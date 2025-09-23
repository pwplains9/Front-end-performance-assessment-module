import { glob } from 'glob';
import { readFileSync } from 'fs';
import { join, extname, relative } from 'path';
import { AssessmentConfig, AssessmentResult, FileAnalysis, FileResult, CategoryResult, LevelCriteria } from '../types';
import { CodeQualityAnalyzer } from '../analyzers/code-quality';
import { PerformanceAnalyzer } from '../analyzers/performance';
import { ArchitectureAnalyzer } from '../analyzers/architecture';
import { BestPracticesAnalyzer } from '../analyzers/best-practices';
import { MaintainabilityAnalyzer } from '../analyzers/maintainability';
import { FrameworkDetector } from '../utils/framework-detector';
import { LevelEvaluator } from '../utils/level-evaluator';
import { i18n } from '../i18n';

export class FrontendAssessor {
  private config: AssessmentConfig;
  private codeQualityAnalyzer: CodeQualityAnalyzer;
  private performanceAnalyzer: PerformanceAnalyzer;
  private architectureAnalyzer: ArchitectureAnalyzer;
  private bestPracticesAnalyzer: BestPracticesAnalyzer;
  private maintainabilityAnalyzer: MaintainabilityAnalyzer;
  private frameworkDetector: FrameworkDetector;
  private levelEvaluator: LevelEvaluator;

  constructor(config: AssessmentConfig) {
    this.config = {
      framework: 'auto',
      includePatterns: ['**/*.{js,jsx,ts,tsx,vue}'],
      excludePatterns: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/*.test.*', '**/*.spec.*'],
      ...config
    };

    this.codeQualityAnalyzer = new CodeQualityAnalyzer();
    this.performanceAnalyzer = new PerformanceAnalyzer();
    this.architectureAnalyzer = new ArchitectureAnalyzer();
    this.bestPracticesAnalyzer = new BestPracticesAnalyzer();
    this.maintainabilityAnalyzer = new MaintainabilityAnalyzer();
    this.frameworkDetector = new FrameworkDetector();
    this.levelEvaluator = new LevelEvaluator();
  }

  async assess(): Promise<AssessmentResult> {
    const files = await this.getProjectFiles();
    const fileAnalyses = await this.analyzeFiles(files);
    
    const categories = {
      codeQuality: await this.assessCodeQuality(fileAnalyses),
      performance: await this.assessPerformance(fileAnalyses),
      architecture: await this.assessArchitecture(fileAnalyses),
      bestPractices: await this.assessBestPractices(fileAnalyses),
      maintainability: await this.assessMaintainability(fileAnalyses)
    };

    const overallScore = this.calculateOverallScore(categories);
    const level = this.levelEvaluator.determineLevel(overallScore, categories, fileAnalyses);
    const recommendations = this.generateRecommendations(categories, level);

    return {
      overallScore,
      level,
      categories,
      fileResults: this.generateFileResults(fileAnalyses, categories),
      recommendations,
      summary: this.generateSummary(overallScore, level, categories)
    };
  }

  private async getProjectFiles(): Promise<string[]> {
    const patterns = this.config.includePatterns || [];
    const ignore = this.config.excludePatterns || [];
    
    const files: string[] = [];
    
    for (const pattern of patterns) {
      const matchedFiles = await glob(pattern, {
        cwd: this.config.projectPath,
        ignore,
        absolute: true
      });
      files.push(...matchedFiles);
    }

    return [...new Set(files)]; // Remove duplicates
  }

  private async analyzeFiles(filePaths: string[]): Promise<FileAnalysis[]> {
    const analyses: FileAnalysis[] = [];

    for (const filePath of filePaths) {
      try {
        const content = readFileSync(filePath, 'utf-8');
        const relativePath = relative(this.config.projectPath, filePath);
        const framework = this.config.framework === 'auto' 
          ? this.frameworkDetector.detect(content, filePath)
          : this.config.framework;

        const analysis: FileAnalysis = {
          path: relativePath,
          content,
          size: content.length,
          lines: content.split('\n').length,
          framework: framework || 'vanilla',
          type: this.determineFileType(filePath, content)
        };

        analyses.push(analysis);
      } catch (error) {
        console.warn(`Failed to analyze file ${filePath}:`, error);
      }
    }

    return analyses;
  }

  private determineFileType(filePath: string, content: string): FileAnalysis['type'] {
    const ext = extname(filePath);
    const fileName = filePath.toLowerCase();

    if (fileName.includes('test') || fileName.includes('spec')) {
      return 'test';
    }

    if (fileName.includes('config') || fileName.includes('setup')) {
      return 'config';
    }

    if (content.includes('export default') || content.includes('export class') || 
        content.includes('<template>') || content.includes('function Component')) {
      return 'component';
    }

    if (content.includes('service') || content.includes('api') || 
        content.includes('fetch') || content.includes('axios')) {
      return 'service';
    }

    if (content.includes('export function') || content.includes('export const')) {
      return 'utility';
    }

    return 'other';
  }

  private async assessCodeQuality(files: FileAnalysis[]): Promise<CategoryResult> {
    return this.codeQualityAnalyzer.analyze(files);
  }

  private async assessPerformance(files: FileAnalysis[]): Promise<CategoryResult> {
    return this.performanceAnalyzer.analyze(files);
  }

  private async assessArchitecture(files: FileAnalysis[]): Promise<CategoryResult> {
    return this.architectureAnalyzer.analyze(files);
  }

  private async assessBestPractices(files: FileAnalysis[]): Promise<CategoryResult> {
    return this.bestPracticesAnalyzer.analyze(files);
  }

  private async assessMaintainability(files: FileAnalysis[]): Promise<CategoryResult> {
    return this.maintainabilityAnalyzer.analyze(files);
  }

  private calculateOverallScore(categories: AssessmentResult['categories']): number {
    const weights = {
      codeQuality: 0.25,
      performance: 0.20,
      architecture: 0.20,
      bestPractices: 0.20,
      maintainability: 0.15
    };

    let totalScore = 0;
    let totalWeight = 0;

    Object.entries(categories).forEach(([category, result]) => {
      const weight = weights[category as keyof typeof weights];
      totalScore += result.percentage * weight;
      totalWeight += weight;
    });

    return Math.round(totalScore / totalWeight);
  }

  private generateFileResults(files: FileAnalysis[], categories: AssessmentResult['categories']): FileResult[] {
    return files.map(file => {
      const issues = Object.values(categories).flatMap(category => 
        category.issues.filter(issue => issue.rule.includes(file.path))
      );

      const score = Math.max(0, 100 - (issues.length * 10));

      return {
        path: file.path,
        score,
        issues,
        suggestions: this.generateFileSuggestions(file, issues)
      };
    });
  }

  private generateFileSuggestions(file: FileAnalysis, issues: any[]): string[] {
    const suggestions: string[] = [];

    if (file.lines > 300) {
      suggestions.push('Consider splitting file into smaller modules');
    }

    if (issues.some(issue => issue.severity === 'error')) {
      suggestions.push('Fix critical errors first');
    }

    if (file.type === 'component' && file.size > 10000) {
      suggestions.push('Component is too large, consider decomposition');
    }

    return suggestions;
  }

  private generateRecommendations(categories: AssessmentResult['categories'], level: string): any[] {
    const recommendations: any[] = [];

    Object.entries(categories).forEach(([category, result]) => {
      if (result.percentage < 70) {
        recommendations.push({
          category,
          priority: result.percentage < 50 ? 'high' : 'medium',
          title: `Improve ${i18n.t(`categories.${category}`)}`,
          description: `Current result: ${result.percentage}%. Needs attention.`,
          examples: this.getExamplesForCategory(category)
        });
      }
    });

    return recommendations;
  }

  private getExamplesForCategory(category: string): string[] {
    const examples: Record<string, string[]> = {
      codeQuality: [
        'Use linters (ESLint, Prettier)',
        'Follow SOLID principles',
        'Write clean and readable code'
      ],
      performance: [
        'Use lazy loading for components',
        'Optimize images',
        'Minimize bundle size'
      ],
      architecture: [
        'Apply design patterns',
        'Separate responsibilities',
        'Use modular architecture'
      ],
      bestPractices: [
        'Follow framework conventions',
        'Use TypeScript',
        'Cover code with tests'
      ],
      maintainability: [
        'Document code',
        'Use descriptive names',
        'Avoid code duplication'
      ]
    };

    return examples[category] || [];
  }

  private generateSummary(score: number, level: string, categories: AssessmentResult['categories']): string {
    const levelDescription = i18n.t(`levels.${level}.description`);

    return `
${i18n.t('assessment.overallScore')}: ${score}/100 (${i18n.t(`levels.${level}.name`)})
${levelDescription}

Category details:
- ${i18n.t('categories.codeQuality')}: ${categories.codeQuality.percentage}%
- ${i18n.t('categories.performance')}: ${categories.performance.percentage}%
- ${i18n.t('categories.architecture')}: ${categories.architecture.percentage}%
- ${i18n.t('categories.bestPractices')}: ${categories.bestPractices.percentage}%
- ${i18n.t('categories.maintainability')}: ${categories.maintainability.percentage}%
    `.trim();
  }
}

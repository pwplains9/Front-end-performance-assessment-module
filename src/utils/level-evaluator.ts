import { FileAnalysis, CategoryResult, LevelCriteria } from '../types';

export class LevelEvaluator {
  private levelCriteria: LevelCriteria = {
    junior: {
      minScore: 60,
      maxComplexity: 10,
      requiredPractices: [
        'basic-syntax',
        'simple-functions',
        'basic-error-handling'
      ]
    },
    middle: {
      minScore: 75,
      maxComplexity: 20,
      requiredPractices: [
        'advanced-syntax',
        'async-programming',
        'testing',
        'code-organization'
      ],
      architecturalPatterns: [
        'mvc',
        'component-based',
        'modular-design'
      ]
    },
    senior: {
      minScore: 85,
      maxComplexity: 30,
      requiredPractices: [
        'design-patterns',
        'performance-optimization',
        'security-awareness',
        'documentation'
      ],
      architecturalPatterns: [
        'clean-architecture',
        'dependency-injection',
        'solid-principles'
      ],
      leadershipIndicators: [
        'code-reviews',
        'mentoring-code',
        'best-practices-enforcement'
      ]
    }
  };

  determineLevel(
    overallScore: number,
    categories: Record<string, CategoryResult>,
    files: FileAnalysis[]
  ): 'junior' | 'middle' | 'senior' {
    const practicesScore = this.evaluatePractices(files);
    const architectureScore = categories.architecture.percentage;
    const complexityScore = this.evaluateComplexity(files);
    
    // Оценка Senior уровня
    if (this.meetsSeniorCriteria(overallScore, practicesScore, architectureScore, complexityScore)) {
      return 'senior';
    }
    
    // Оценка Middle уровня
    if (this.meetsMiddleCriteria(overallScore, practicesScore, architectureScore, complexityScore)) {
      return 'middle';
    }
    
    // По умолчанию Junior уровень
    return 'junior';
  }

  private meetsSeniorCriteria(
    overallScore: number,
    practicesScore: number,
    architectureScore: number,
    complexityScore: number
  ): boolean {
    return (
      overallScore >= this.levelCriteria.senior.minScore &&
      practicesScore >= 80 &&
      architectureScore >= 80 &&
      complexityScore >= 70
    );
  }

  private meetsMiddleCriteria(
    overallScore: number,
    practicesScore: number,
    architectureScore: number,
    complexityScore: number
  ): boolean {
    return (
      overallScore >= this.levelCriteria.middle.minScore &&
      practicesScore >= 65 &&
      architectureScore >= 60 &&
      complexityScore >= 50
    );
  }

  private evaluatePractices(files: FileAnalysis[]): number {
    let score = 0;
    const maxScore = 100;

    // Проверяем использование современных практик
    const practiceChecks = [
      {
        name: 'TypeScript Usage',
        check: () => files.some(f => f.path.endsWith('.ts') || f.path.endsWith('.tsx')),
        weight: 20
      },
      {
        name: 'Error Handling',
        check: () => files.some(f => /try\s*{|catch\s*\(/g.test(f.content)),
        weight: 15
      },
      {
        name: 'Async/Await',
        check: () => files.some(f => /async\s+|await\s+/g.test(f.content)),
        weight: 10
      },
      {
        name: 'Modern ES6+',
        check: () => files.some(f => /const\s+|let\s+|arrow functions|destructuring/g.test(f.content)),
        weight: 10
      },
      {
        name: 'Documentation',
        check: () => files.some(f => /\/\*\*[\s\S]*?\*\//g.test(f.content)),
        weight: 15
      },
      {
        name: 'Testing',
        check: () => files.some(f => f.type === 'test'),
        weight: 20
      },
      {
        name: 'Code Organization',
        check: () => this.hasGoodCodeOrganization(files),
        weight: 10
      }
    ];

    practiceChecks.forEach(check => {
      if (check.check()) {
        score += check.weight;
      }
    });

    return Math.round((score / maxScore) * 100);
  }

  private evaluateComplexity(files: FileAnalysis[]): number {
    const complexities = files.map(file => this.calculateFileComplexity(file));
    const avgComplexity = complexities.reduce((sum, c) => sum + c, 0) / complexities.length;
    
    // Инвертируем шкалу: меньше сложность = выше оценка
    if (avgComplexity <= 5) return 100;
    if (avgComplexity <= 10) return 80;
    if (avgComplexity <= 15) return 60;
    if (avgComplexity <= 20) return 40;
    return 20;
  }

  private calculateFileComplexity(file: FileAnalysis): number {
    let complexity = 1;
    
    const complexityPatterns = [
      /if\s*\(/g,
      /else\s*if\s*\(/g,
      /while\s*\(/g,
      /for\s*\(/g,
      /catch\s*\(/g,
      /case\s+/g,
      /&&/g,
      /\|\|/g
    ];

    complexityPatterns.forEach(pattern => {
      const matches = file.content.match(pattern);
      if (matches) {
        complexity += matches.length;
      }
    });

    return complexity;
  }

  private hasGoodCodeOrganization(files: FileAnalysis[]): boolean {
    // Проверяем разделение на компоненты, сервисы, утилиты
    const hasComponents = files.some(f => f.type === 'component');
    const hasServices = files.some(f => f.type === 'service');
    const hasUtils = files.some(f => f.type === 'utility');
    
    return hasComponents && (hasServices || hasUtils);
  }

  getLevelRecommendations(currentLevel: string, targetLevel?: string): string[] {
    const target = targetLevel || this.getNextLevel(currentLevel);
    
    const recommendations: Record<string, Record<string, string[]>> = {
      junior: {
        middle: [
          'Изучите продвинутые концепции JavaScript/TypeScript',
          'Освойте тестирование (Jest, Testing Library)',
          'Изучите паттерны проектирования',
          'Улучшите архитектуру кода',
          'Изучите инструменты сборки и оптимизации'
        ]
      },
      middle: {
        senior: [
          'Углубите знания архитектурных паттернов',
          'Изучите принципы SOLID и Clean Code',
          'Освойте performance optimization',
          'Развивайте навыки code review',
          'Изучите security best practices',
          'Работайте над soft skills и ментoring'
        ]
      }
    };

    return recommendations[currentLevel]?.[target] || [];
  }

  private getNextLevel(currentLevel: string): string {
    const levels = ['junior', 'middle', 'senior'];
    const currentIndex = levels.indexOf(currentLevel);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : currentLevel;
  }

  getDetailedLevelAnalysis(
    overallScore: number,
    categories: Record<string, CategoryResult>,
    files: FileAnalysis[]
  ): {
    currentLevel: string;
    strengths: string[];
    weaknesses: string[];
    nextSteps: string[];
    estimatedTimeToNextLevel: string;
  } {
    const currentLevel = this.determineLevel(overallScore, categories, files);
    const practicesScore = this.evaluatePractices(files);
    const complexityScore = this.evaluateComplexity(files);

    const strengths: string[] = [];
    const weaknesses: string[] = [];

    // Анализируем сильные и слабые стороны
    Object.entries(categories).forEach(([category, result]) => {
      if (result.percentage >= 80) {
        strengths.push(`Отличные навыки в ${category}`);
      } else if (result.percentage < 60) {
        weaknesses.push(`Требует улучшения: ${category}`);
      }
    });

    if (practicesScore >= 80) {
      strengths.push('Хорошее знание современных практик разработки');
    } else if (practicesScore < 60) {
      weaknesses.push('Недостаточное использование современных практик');
    }

    const nextSteps = this.getLevelRecommendations(currentLevel);
    const estimatedTime = this.estimateTimeToNextLevel(currentLevel, overallScore, categories);

    return {
      currentLevel,
      strengths,
      weaknesses,
      nextSteps,
      estimatedTimeToNextLevel: estimatedTime
    };
  }

  private estimateTimeToNextLevel(
    currentLevel: string,
    overallScore: number,
    categories: Record<string, CategoryResult>
  ): string {
    const nextLevel = this.getNextLevel(currentLevel);
    if (nextLevel === currentLevel) return 'Достигнут максимальный уровень';

    const targetScore = this.levelCriteria[nextLevel as keyof LevelCriteria].minScore;
    const scoreDifference = targetScore - overallScore;

    if (scoreDifference <= 5) return '1-2 месяца';
    if (scoreDifference <= 15) return '3-6 месяцев';
    if (scoreDifference <= 25) return '6-12 месяцев';
    return '1-2 года';
  }
}

import { FileAnalysis, CategoryResult, Issue } from '../types';
import { i18n } from '../i18n';

export abstract class BaseAnalyzer {
  protected abstract rules: AnalyzerRule[];

  async analyze(files: FileAnalysis[]): Promise<CategoryResult> {
    const issues: Issue[] = [];
    let totalScore = 0;
    let maxScore = 0;

    for (const file of files) {
      for (const rule of this.rules) {
        maxScore += rule.weight;
        const result = rule.check(file);
        
        if (result.passed) {
          totalScore += rule.weight;
        } else {
          issues.push({
            rule: `${rule.id}:${file.path}`,
            severity: rule.severity,
            message: result.message,
            line: result.line,
            column: result.column
          });
        }
      }
    }

    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 100;

    return {
      score: totalScore,
      maxScore,
      percentage,
      issues
    };
  }

  protected checkRegexInFile(content: string, pattern: RegExp, message: string): RuleCheckResult {
    const match = pattern.exec(content);
    if (match) {
      const lines = content.substring(0, match.index).split('\n');
      return {
        passed: false,
        message,
        line: lines.length,
        column: lines[lines.length - 1].length
      };
    }
    return { passed: true, message: 'OK' };
  }

  protected countOccurrences(content: string, pattern: RegExp): number {
    const matches = content.match(new RegExp(pattern.source, 'g'));
    return matches ? matches.length : 0;
  }

  protected calculateComplexity(content: string): number {
    // Simplified cyclomatic complexity metric
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

    let complexity = 1; // Base complexity
    
    complexityPatterns.forEach(pattern => {
      complexity += this.countOccurrences(content, pattern);
    });

    return complexity;
  }
}

export interface AnalyzerRule {
  id: string;
  name: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
  weight: number;
  check: (file: FileAnalysis) => RuleCheckResult;
}

export interface RuleCheckResult {
  passed: boolean;
  message: string;
  line?: number;
  column?: number;
}

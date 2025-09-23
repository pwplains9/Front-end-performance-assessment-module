import { BaseAnalyzer, AnalyzerRule } from './base-analyzer';
import { FileAnalysis } from '../types';
import { i18n } from '../i18n';

export class CodeQualityAnalyzer extends BaseAnalyzer {
  protected rules: AnalyzerRule[] = [
    {
      id: 'CQ001',
      name: 'Naming Conventions',
      description: 'Check naming conventions compliance',
      severity: 'warning',
      weight: 10,
      check: (file: FileAnalysis) => {
        // Check camelCase for variables and functions
        const badNaming = /\b(var|let|const|function)\s+[A-Z_][a-zA-Z0-9_]*\s*[=\(]/g;
        return this.checkRegexInFile(file.content, badNaming, 
          i18n.t('rules.namingConventions'));
      }
    },
    {
      id: 'CQ002',
      name: 'Function Length',
      description: 'Check function length',
      severity: 'warning',
      weight: 15,
      check: (file: FileAnalysis) => {
        const functions = file.content.match(/function\s+\w+[^{]*{[^}]*}/g) || [];
        const longFunctions = functions.filter(func => func.split('\n').length > 50);
        
        if (longFunctions.length > 0) {
          return {
            passed: false,
            message: i18n.t('rules.functionLength', { count: longFunctions.length })
          };
        }
        return { passed: true, message: 'Function length is acceptable' };
      }
    },
    {
      id: 'CQ003',
      name: 'Cyclomatic Complexity',
      description: 'Check cyclomatic complexity',
      severity: 'error',
      weight: 20,
      check: (file: FileAnalysis) => {
        const complexity = this.calculateComplexity(file.content);
        const maxComplexity = file.type === 'component' ? 15 : 10;
        
        if (complexity > maxComplexity) {
          return {
            passed: false,
            message: i18n.t('rules.cyclomaticComplexity', { complexity, maxComplexity })
          };
        }
        return { passed: true, message: 'Complexity is acceptable' };
      }
    },
    {
      id: 'CQ004',
      name: 'Magic Numbers',
      description: 'Check for magic numbers',
      severity: 'info',
      weight: 5,
      check: (file: FileAnalysis) => {
        // Look for numbers greater than 1, except common ones (0, 1, 2, 10, 100, etc.)
        const magicNumbers = /\b(?!0|1|2|10|100|1000)\d{2,}\b/g;
        const matches = this.countOccurrences(file.content, magicNumbers);
        
        if (matches > 3) {
          return {
            passed: false,
            message: i18n.t('rules.magicNumbers', { count: matches })
          };
        }
        return { passed: true, message: 'No magic numbers found' };
      }
    },
    {
      id: 'CQ005',
      name: 'Code Duplication',
      description: 'Check code duplication',
      severity: 'warning',
      weight: 12,
      check: (file: FileAnalysis) => {
        const lines = file.content.split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 10 && !line.startsWith('//') && !line.startsWith('*'));
        
        const duplicates = new Map<string, number>();
        lines.forEach(line => {
          duplicates.set(line, (duplicates.get(line) || 0) + 1);
        });
        
        const duplicatedLines = Array.from(duplicates.entries())
          .filter(([_, count]) => count > 1).length;
        
        if (duplicatedLines > file.lines * 0.1) {
          return {
            passed: false,
            message: i18n.t('rules.codeDuplication', { count: duplicatedLines })
          };
        }
        return { passed: true, message: 'Code duplication is acceptable' };
      }
    },
    {
      id: 'CQ006',
      name: 'Comments Quality',
      description: 'Check comments quality',
      severity: 'info',
      weight: 8,
      check: (file: FileAnalysis) => {
        const codeLines = file.lines;
        const commentLines = this.countOccurrences(file.content, /\/\/|\/\*|\*\//g);
        const commentRatio = commentLines / codeLines;
        
        if (commentRatio < 0.1 && codeLines > 50) {
          return {
            passed: false,
            message: i18n.t('rules.commentsQuality')
          };
        }
        if (commentRatio > 0.5) {
          return {
            passed: false,
            message: 'Too many comments. Code may need simplification'
          };
        }
        return { passed: true, message: 'Comments quality is acceptable' };
      }
    }
  ];
}

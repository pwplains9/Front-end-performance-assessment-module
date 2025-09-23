import { BaseAnalyzer, AnalyzerRule } from './base-analyzer';
import { FileAnalysis } from '../types';

export class BestPracticesAnalyzer extends BaseAnalyzer {
  protected rules: AnalyzerRule[] = [
    {
      id: 'BP001',
      name: 'TypeScript Usage',
      description: 'Проверка использования TypeScript',
      severity: 'warning',
      weight: 20,
      check: (file: FileAnalysis) => {
        const isTypeScript = file.path.endsWith('.ts') || file.path.endsWith('.tsx');
        const hasTypes = /:\s*\w+(\[\])?(\s*\|\s*\w+(\[\])?)*\s*[=;,\)]/g.test(file.content);
        
        if (!isTypeScript && file.lines > 50) {
          return {
            passed: false,
            message: 'Рассмотрите миграцию на TypeScript для больших файлов'
          };
        }
        
        if (isTypeScript && !hasTypes && file.lines > 20) {
          return {
            passed: false,
            message: 'TypeScript файл должен содержать типизацию'
          };
        }
        
        return { passed: true, message: 'Использование TypeScript корректно' };
      }
    },
    {
      id: 'BP002',
      name: 'Error Handling',
      description: 'Проверка обработки ошибок',
      severity: 'error',
      weight: 18,
      check: (file: FileAnalysis) => {
        const hasAsyncOperations = /async\s+|await\s+|\.then\s*\(|\.catch\s*\(|fetch\s*\(/g.test(file.content);
        const hasErrorHandling = /try\s*{|catch\s*\(|\.catch\s*\(/g.test(file.content);
        
        if (hasAsyncOperations && !hasErrorHandling) {
          return {
            passed: false,
            message: 'Асинхронные операции должны включать обработку ошибок'
          };
        }
        
        return { passed: true, message: 'Обработка ошибок присутствует' };
      }
    },
    {
      id: 'BP003',
      name: 'Security Practices',
      description: 'Проверка практик безопасности',
      severity: 'error',
      weight: 15,
      check: (file: FileAnalysis) => {
        const securityIssues = [
          { pattern: /innerHTML\s*=/, message: 'Использование innerHTML может привести к XSS' },
          { pattern: /eval\s*\(/, message: 'Использование eval небезопасно' },
          { pattern: /document\.write\s*\(/, message: 'document.write устарел и небезопасен' },
          { pattern: /dangerouslySetInnerHTML/, message: 'Осторожно с dangerouslySetInnerHTML' }
        ];
        
        for (const issue of securityIssues) {
          if (issue.pattern.test(file.content)) {
            return {
              passed: false,
              message: issue.message
            };
          }
        }
        
        return { passed: true, message: 'Проблемы безопасности не найдены' };
      }
    },
    {
      id: 'BP004',
      name: 'Testing Coverage',
      description: 'Проверка наличия тестов',
      severity: 'warning',
      weight: 12,
      check: (file: FileAnalysis) => {
        if (file.type === 'test') return { passed: true, message: 'Это тестовый файл' };
        
        // Проверяем, есть ли соответствующий тестовый файл
        const baseName = file.path.replace(/\.(js|ts|jsx|tsx|vue)$/, '');
        const hasTestFile = /describe\s*\(|it\s*\(|test\s*\(/g.test(file.content);
        
        if (file.type === 'component' && !hasTestFile && file.lines > 30) {
          return {
            passed: false,
            message: 'Компонент должен иметь тесты'
          };
        }
        
        return { passed: true, message: 'Тестирование в порядке' };
      }
    },
    {
      id: 'BP005',
      name: 'Accessibility',
      description: 'Проверка доступности (a11y)',
      severity: 'warning',
      weight: 10,
      check: (file: FileAnalysis) => {
        if (file.type !== 'component') return { passed: true, message: 'Не применимо' };
        
        const a11yIssues = [
          { pattern: /<img(?![^>]*alt\s*=)/g, message: 'Изображения должны иметь alt атрибут' },
          { pattern: /<button[^>]*>[\s\n]*<\/button>/g, message: 'Кнопки должны иметь текст или aria-label' },
          { pattern: /<input(?![^>]*(?:aria-label|placeholder)\s*=)/g, message: 'Поля ввода должны иметь labels или aria-label' }
        ];
        
        for (const issue of a11yIssues) {
          if (this.countOccurrences(file.content, issue.pattern) > 0) {
            return {
              passed: false,
              message: issue.message
            };
          }
        }
        
        return { passed: true, message: 'Доступность соблюдена' };
      }
    },
    {
      id: 'BP006',
      name: 'Framework Conventions',
      description: 'Проверка соблюдения конвенций фреймворка',
      severity: 'warning',
      weight: 15,
      check: (file: FileAnalysis) => {
        if (file.framework === 'react') {
          // React конвенции
          const hasHooks = /use\w+\s*\(/g.test(file.content);
          const hasClassComponent = /class\s+\w+\s+extends\s+(React\.)?Component/g.test(file.content);
          
          if (hasClassComponent && hasHooks) {
            return {
              passed: false,
              message: 'Не смешивайте классовые компоненты с хуками'
            };
          }
          
          // Проверка правил хуков
          if (hasHooks) {
            const conditionalHooks = /if\s*\([^)]+\)\s*{[^}]*use\w+/g.test(file.content);
            if (conditionalHooks) {
              return {
                passed: false,
                message: 'Хуки нельзя вызывать условно'
              };
            }
          }
        }
        
        if (file.framework === 'vue') {
          // Vue конвенции
          if (file.path.endsWith('.vue')) {
            const hasScript = /<script/g.test(file.content);
            const hasTemplate = /<template/g.test(file.content);
            
            if (!hasScript || !hasTemplate) {
              return {
                passed: false,
                message: 'Vue компонент должен содержать <script> и <template> секции'
              };
            }
          }
        }
        
        return { passed: true, message: 'Конвенции фреймворка соблюдены' };
      }
    }
  ];
}

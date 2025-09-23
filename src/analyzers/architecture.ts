import { BaseAnalyzer, AnalyzerRule } from './base-analyzer';
import { FileAnalysis } from '../types';

export class ArchitectureAnalyzer extends BaseAnalyzer {
  protected rules: AnalyzerRule[] = [
    {
      id: 'ARCH001',
      name: 'Separation of Concerns',
      description: 'Проверка разделения ответственности',
      severity: 'warning',
      weight: 20,
      check: (file: FileAnalysis) => {
        if (file.type === 'component') {
          // Компонент не должен содержать бизнес-логику
          const businessLogicPatterns = [
            /fetch\s*\(/g,
            /axios\./g,
            /\$http\./g,
            /XMLHttpRequest/g,
            /localStorage\./g,
            /sessionStorage\./g
          ];
          
          let violations = 0;
          businessLogicPatterns.forEach(pattern => {
            violations += this.countOccurrences(file.content, pattern);
          });
          
          if (violations > 2) {
            return {
              passed: false,
              message: 'Компонент содержит слишком много бизнес-логики. Выделите в отдельные сервисы'
            };
          }
        }
        
        return { passed: true, message: 'Разделение ответственности соблюдено' };
      }
    },
    {
      id: 'ARCH002',
      name: 'Dependency Injection',
      description: 'Проверка внедрения зависимостей',
      severity: 'info',
      weight: 15,
      check: (file: FileAnalysis) => {
        if (file.type === 'service') {
          // Сервис должен получать зависимости через конструктор или параметры
          const hardcodedDependencies = /new\s+\w+Service\s*\(/g.test(file.content);
          const hasConstructorInjection = /constructor\s*\([^)]*\w+Service/g.test(file.content);
          
          if (hardcodedDependencies && !hasConstructorInjection) {
            return {
              passed: false,
              message: 'Используйте внедрение зависимостей вместо прямого создания экземпляров'
            };
          }
        }
        
        return { passed: true, message: 'Внедрение зависимостей в порядке' };
      }
    },
    {
      id: 'ARCH003',
      name: 'Single Responsibility',
      description: 'Проверка принципа единственной ответственности',
      severity: 'warning',
      weight: 18,
      check: (file: FileAnalysis) => {
        const exports = this.countOccurrences(file.content, /export\s+(class|function|const)/g);
        const classes = this.countOccurrences(file.content, /class\s+\w+/g);
        
        // Файл не должен экспортировать слишком много сущностей
        if (exports > 5) {
          return {
            passed: false,
            message: `Файл экспортирует ${exports} сущностей. Рассмотрите разделение на модули`
          };
        }
        
        // Класс не должен иметь слишком много методов
        if (classes > 0) {
          const methods = this.countOccurrences(file.content, /\s+\w+\s*\([^)]*\)\s*{/g);
          if (methods > 15) {
            return {
              passed: false,
              message: `Класс содержит ${methods} методов. Рассмотрите декомпозицию`
            };
          }
        }
        
        return { passed: true, message: 'Принцип единственной ответственности соблюден' };
      }
    },
    {
      id: 'ARCH004',
      name: 'Layered Architecture',
      description: 'Проверка слоистой архитектуры',
      severity: 'info',
      weight: 12,
      check: (file: FileAnalysis) => {
        const filePath = file.path.toLowerCase();
        
        // Компоненты не должны импортировать напрямую из слоя данных
        if (filePath.includes('component') || filePath.includes('view')) {
          const directDataAccess = /import.*from.*['"](.*\/)?api\/|.*\/data\/|.*\/repository\//g.test(file.content);
          
          if (directDataAccess) {
            return {
              passed: false,
              message: 'Компоненты не должны напрямую обращаться к слою данных. Используйте сервисы'
            };
          }
        }
        
        return { passed: true, message: 'Слоистая архитектура соблюдена' };
      }
    },
    {
      id: 'ARCH005',
      name: 'Design Patterns',
      description: 'Проверка использования паттернов проектирования',
      severity: 'info',
      weight: 10,
      check: (file: FileAnalysis) => {
        if (file.type === 'service') {
          // Проверяем использование паттерна Singleton для сервисов
          const hasSingleton = /private\s+static\s+instance|getInstance\s*\(/g.test(file.content);
          const hasMultipleInstances = /new\s+\w*Service\s*\(/g.test(file.content);
          
          if (hasMultipleInstances && !hasSingleton) {
            return {
              passed: false,
              message: 'Рассмотрите использование паттерна Singleton для сервисов'
            };
          }
        }
        
        if (file.type === 'component') {
          // Проверяем использование паттерна Observer для событий
          const hasEvents = /emit\s*\(|addEventListener|on\(/g.test(file.content);
          const hasObserver = /observer|subscribe|unsubscribe/gi.test(file.content);
          
          if (hasEvents && file.lines > 100 && !hasObserver) {
            return {
              passed: false,
              message: 'Для сложных компонентов с событиями рассмотрите паттерн Observer'
            };
          }
        }
        
        return { passed: true, message: 'Паттерны проектирования используются корректно' };
      }
    },
    {
      id: 'ARCH006',
      name: 'Module Coupling',
      description: 'Проверка связанности модулей',
      severity: 'warning',
      weight: 14,
      check: (file: FileAnalysis) => {
        const imports = file.content.match(/import\s+.*from\s+['"][^'"]+['"]/g) || [];
        const relativeImports = imports.filter(imp => imp.includes('../')).length;
        const totalImports = imports.length;
        
        // Слишком много относительных импортов указывает на высокую связанность
        if (totalImports > 0 && (relativeImports / totalImports) > 0.7) {
          return {
            passed: false,
            message: 'Высокая связанность модулей. Рассмотрите рефакторинг архитектуры'
          };
        }
        
        return { passed: true, message: 'Связанность модулей в норме' };
      }
    }
  ];
}

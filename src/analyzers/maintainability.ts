import { BaseAnalyzer, AnalyzerRule } from './base-analyzer';
import { FileAnalysis } from '../types';

export class MaintainabilityAnalyzer extends BaseAnalyzer {
  protected rules: AnalyzerRule[] = [
    {
      id: 'MAINT001',
      name: 'Documentation',
      description: 'Проверка документации кода',
      severity: 'info',
      weight: 12,
      check: (file: FileAnalysis) => {
        const jsdocComments = this.countOccurrences(file.content, /\/\*\*[\s\S]*?\*\//g);
        const functions = this.countOccurrences(file.content, /function\s+\w+|const\s+\w+\s*=\s*\(/g);
        const classes = this.countOccurrences(file.content, /class\s+\w+/g);
        
        const documentableItems = functions + classes;
        const documentationRatio = documentableItems > 0 ? jsdocComments / documentableItems : 1;
        
        if (documentableItems > 3 && documentationRatio < 0.3) {
          return {
            passed: false,
            message: 'Недостаточно JSDoc комментариев для публичных функций и классов'
          };
        }
        
        return { passed: true, message: 'Документация в порядке' };
      }
    },
    {
      id: 'MAINT002',
      name: 'Code Readability',
      description: 'Проверка читаемости кода',
      severity: 'warning',
      weight: 15,
      check: (file: FileAnalysis) => {
        const lines = file.content.split('\n');
        const longLines = lines.filter(line => line.length > 120).length;
        const totalLines = lines.length;
        
        if (longLines / totalLines > 0.1) {
          return {
            passed: false,
            message: `${longLines} строк превышают 120 символов. Используйте переносы строк`
          };
        }
        
        // Проверка вложенности
        const deepNesting = /\s{16,}/g; // 4+ уровня вложенности (16+ пробелов)
        if (this.countOccurrences(file.content, deepNesting) > 5) {
          return {
            passed: false,
            message: 'Глубокая вложенность затрудняет чтение кода'
          };
        }
        
        return { passed: true, message: 'Читаемость кода в норме' };
      }
    },
    {
      id: 'MAINT003',
      name: 'Naming Consistency',
      description: 'Проверка консистентности именования',
      severity: 'warning',
      weight: 10,
      check: (file: FileAnalysis) => {
        // Проверяем консистентность именования переменных
        const camelCaseVars = this.countOccurrences(file.content, /\b[a-z][a-zA-Z0-9]*\b/g);
        const snake_caseVars = this.countOccurrences(file.content, /\b[a-z]+_[a-z_]+\b/g);
        
        if (camelCaseVars > 0 && snake_caseVars > 0 && snake_caseVars / camelCaseVars > 0.3) {
          return {
            passed: false,
            message: 'Смешивание camelCase и snake_case. Выберите один стиль'
          };
        }
        
        return { passed: true, message: 'Именование консистентно' };
      }
    },
    {
      id: 'MAINT004',
      name: 'Dead Code',
      description: 'Проверка мертвого кода',
      severity: 'warning',
      weight: 8,
      check: (file: FileAnalysis) => {
        // Поиск неиспользуемых импортов
        const imports = file.content.match(/import\s+(?:{[^}]+}|\w+)\s+from\s+['"][^'"]+['"]/g) || [];
        const unusedImports = imports.filter(imp => {
          const match = imp.match(/import\s+(?:{([^}]+)}|(\w+))/);
          if (match) {
            const importedNames = match[1] ? match[1].split(',').map(n => n.trim()) : [match[2]];
            return importedNames.some(name => !new RegExp(`\\b${name}\\b`).test(file.content.replace(imp, '')));
          }
          return false;
        });
        
        if (unusedImports.length > 0) {
          return {
            passed: false,
            message: `Найдено ${unusedImports.length} неиспользуемых импортов`
          };
        }
        
        // Поиск закомментированного кода
        const commentedCodeLines = file.content.split('\n').filter(line => {
          const trimmed = line.trim();
          return trimmed.startsWith('//') && 
                 (trimmed.includes('function') || trimmed.includes('const ') || trimmed.includes('let '));
        }).length;
        
        if (commentedCodeLines > 3) {
          return {
            passed: false,
            message: `Найдено ${commentedCodeLines} строк закомментированного кода. Удалите их`
          };
        }
        
        return { passed: true, message: 'Мертвый код не найден' };
      }
    },
    {
      id: 'MAINT005',
      name: 'Configuration Management',
      description: 'Проверка управления конфигурацией',
      severity: 'info',
      weight: 7,
      check: (file: FileAnalysis) => {
        // Поиск захардкоженных значений
        const hardcodedUrls = this.countOccurrences(file.content, /https?:\/\/[^\s'"]+/g);
        const hardcodedPaths = this.countOccurrences(file.content, /['"][A-Za-z]:\\[^'"]*['"]/g);
        
        if (hardcodedUrls > 2 || hardcodedPaths > 0) {
          return {
            passed: false,
            message: 'Найдены захардкоженные URL или пути. Используйте конфигурационные файлы'
          };
        }
        
        return { passed: true, message: 'Конфигурация управляется корректно' };
      }
    },
    {
      id: 'MAINT006',
      name: 'Error Messages',
      description: 'Проверка качества сообщений об ошибках',
      severity: 'info',
      weight: 8,
      check: (file: FileAnalysis) => {
        const errorMessages = file.content.match(/throw\s+new\s+Error\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g) || [];
        const genericErrors = errorMessages.filter(msg => 
          msg.includes('Error') || msg.includes('Something went wrong') || msg.includes('Failed')
        );
        
        if (genericErrors.length > errorMessages.length * 0.5 && errorMessages.length > 0) {
          return {
            passed: false,
            message: 'Используйте более информативные сообщения об ошибках'
          };
        }
        
        return { passed: true, message: 'Сообщения об ошибках информативны' };
      }
    }
  ];
}

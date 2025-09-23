import { BaseAnalyzer, AnalyzerRule } from './base-analyzer';
import { FileAnalysis } from '../types';
import { i18n } from '../i18n';

export class PerformanceAnalyzer extends BaseAnalyzer {
  protected rules: AnalyzerRule[] = [
    {
      id: 'PERF001',
      name: 'Bundle Size',
      description: 'Check file sizes',
      severity: 'warning',
      weight: 15,
      check: (file: FileAnalysis) => {
        const maxSize = file.type === 'component' ? 20000 : 10000; // 20KB for components, 10KB for others
        
        if (file.size > maxSize) {
          return {
            passed: false,
            message: i18n.t('rules.bundleSize', { size: Math.round(file.size / 1000), maxSize: maxSize / 1000 })
          };
        }
        return { passed: true, message: 'File size is acceptable' };
      }
    },
    {
      id: 'PERF002',
      name: 'Lazy Loading',
      description: 'Check lazy loading usage',
      severity: 'info',
      weight: 10,
      check: (file: FileAnalysis) => {
        if (file.type !== 'component') return { passed: true, message: 'Not applicable' };
        
        const hasLazyLoading = /import\s*\(\s*['"`][^'"`]+['"`]\s*\)|React\.lazy|defineAsyncComponent/g.test(file.content);
        const hasMultipleImports = this.countOccurrences(file.content, /^import\s+/gm) > 5;
        
        if (!hasLazyLoading && hasMultipleImports) {
          return {
            passed: false,
            message: i18n.t('rules.lazyLoading')
          };
        }
        return { passed: true, message: 'Lazy loading is used correctly' };
      }
    },
    {
      id: 'PERF003',
      name: 'Heavy Operations',
      description: 'Check heavy operations in render',
      severity: 'error',
      weight: 20,
      check: (file: FileAnalysis) => {
        // Search for potentially heavy operations in JSX/template
        const heavyOperations = [
          /\{\s*\w+\.map\([^}]+\.map\(/g, // Вложенные map
          /\{\s*\w+\.filter\([^}]+\.map\(/g, // filter + map
          /\{\s*\w+\.sort\(/g, // sort в рендере
          /JSON\.parse\s*\(/g, // JSON.parse в рендере
          /new\s+Date\s*\(/g // new Date в рендере
        ];
        
        let heavyOpsCount = 0;
        heavyOperations.forEach(pattern => {
          heavyOpsCount += this.countOccurrences(file.content, pattern);
        });
        
        if (heavyOpsCount > 0) {
          return {
            passed: false,
            message: i18n.t('rules.heavyOperations', { count: heavyOpsCount })
          };
        }
        return { passed: true, message: 'No heavy operations found' };
      }
    },
    {
      id: 'PERF004',
      name: 'Memory Leaks',
      description: 'Check potential memory leaks',
      severity: 'warning',
      weight: 18,
      check: (file: FileAnalysis) => {
        const potentialLeaks = [
          /setInterval\s*\(/g,
          /setTimeout\s*\(/g,
          /addEventListener\s*\(/g,
          /\$on\s*\(/g // Vue event listeners
        ];
        
        const cleanupPatterns = [
          /clearInterval\s*\(/g,
          /clearTimeout\s*\(/g,
          /removeEventListener\s*\(/g,
          /\$off\s*\(/g,
          /useEffect\s*\([^,]+,\s*\[[^\]]*\]\s*\)\s*=>\s*{[^}]*return\s+/g // useEffect cleanup
        ];
        
        let leakCount = 0;
        let cleanupCount = 0;
        
        potentialLeaks.forEach(pattern => {
          leakCount += this.countOccurrences(file.content, pattern);
        });
        
        cleanupPatterns.forEach(pattern => {
          cleanupCount += this.countOccurrences(file.content, pattern);
        });
        
        if (leakCount > cleanupCount) {
          return {
            passed: false,
            message: i18n.t('rules.memoryLeaks', { count: leakCount - cleanupCount })
          };
        }
        return { passed: true, message: 'No memory leaks found' };
      }
    },
    {
      id: 'PERF005',
      name: 'Unnecessary Renders',
      description: 'Проверка ненужных перерендеров',
      severity: 'warning',
      weight: 12,
      check: (file: FileAnalysis) => {
        if (file.framework === 'react') {
          const hasMemo = /React\.memo|useMemo|useCallback/g.test(file.content);
          const hasComplexProps = /props\.\w+\.\w+/g.test(file.content);
          
          if (hasComplexProps && !hasMemo && file.type === 'component') {
            return {
              passed: false,
              message: 'Компонент с сложными props должен использовать мемоизацию'
            };
          }
        }
        
        if (file.framework === 'vue') {
          const hasComputed = /computed\s*\(/g.test(file.content);
          const hasComplexTemplate = this.countOccurrences(file.content, /\{\{[^}]+\}\}/g) > 5;
          
          if (hasComplexTemplate && !hasComputed) {
            return {
              passed: false,
              message: 'Сложные вычисления в шаблоне должны использовать computed свойства'
            };
          }
        }
        
        return { passed: true, message: 'Оптимизация рендеринга в норме' };
      }
    },
    {
      id: 'PERF006',
      name: 'Image Optimization',
      description: 'Проверка оптимизации изображений',
      severity: 'info',
      weight: 8,
      check: (file: FileAnalysis) => {
        const imageImports = this.countOccurrences(file.content, /\.(jpg|jpeg|png|gif|bmp)\b/gi);
        const optimizedFormats = this.countOccurrences(file.content, /\.(webp|avif)\b/gi);
        
        if (imageImports > 0 && optimizedFormats === 0) {
          return {
            passed: false,
            message: 'Рассмотрите использование современных форматов изображений (WebP, AVIF)'
          };
        }
        return { passed: true, message: 'Оптимизация изображений в порядке' };
      }
    }
  ];
}

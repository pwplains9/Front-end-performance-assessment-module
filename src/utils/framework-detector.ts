export class FrameworkDetector {
  detect(content: string, filePath: string): string {
    // Проверяем по расширению файла
    if (filePath.endsWith('.vue')) {
      return 'vue';
    }

    // Проверяем по содержимому
    const frameworks = [
      {
        name: 'react',
        patterns: [
          /import\s+React\s+from\s+['"]react['"]/,
          /import\s+.*\s+from\s+['"]react['"]/,
          /jsx|tsx/i,
          /<[A-Z][a-zA-Z0-9]*[^>]*>/,
          /React\./,
          /useState|useEffect|useContext/,
          /ReactDOM/
        ]
      },
      {
        name: 'vue',
        patterns: [
          /import\s+.*\s+from\s+['"]vue['"]/,
          /<template>/,
          /<script.*setup.*>/,
          /defineComponent|createApp/,
          /ref\s*\(|reactive\s*\(|computed\s*\(/,
          /\$emit|\$props|\$slots/,
          /v-if|v-for|v-model|v-show/
        ]
      },
      {
        name: 'angular',
        patterns: [
          /import\s+.*\s+from\s+['"]@angular/,
          /@Component|@Injectable|@NgModule/,
          /selector\s*:|template\s*:|templateUrl\s*:/,
          /ngOnInit|ngOnDestroy/
        ]
      },
      {
        name: 'svelte',
        patterns: [
          /import\s+.*\s+from\s+['"]svelte/,
          /<script.*svelte.*>/,
          /\$:/,
          /export\s+let/
        ]
      }
    ];

    for (const framework of frameworks) {
      const matches = framework.patterns.filter(pattern => pattern.test(content)).length;
      if (matches >= 2) {
        return framework.name;
      }
    }

    // Проверяем на vanilla JS/TS
    if (this.isVanillaJS(content)) {
      return 'vanilla';
    }

    return 'unknown';
  }

  private isVanillaJS(content: string): boolean {
    const vanillaPatterns = [
      /document\./,
      /window\./,
      /addEventListener/,
      /querySelector/,
      /getElementById/,
      /createElement/
    ];

    return vanillaPatterns.some(pattern => pattern.test(content));
  }

  getFrameworkSpecificRules(framework: string): string[] {
    const rules: Record<string, string[]> = {
      react: [
        'Используйте функциональные компоненты вместо классовых',
        'Применяйте хуки для управления состоянием',
        'Используйте React.memo для оптимизации',
        'Следуйте правилам хуков',
        'Используйте PropTypes или TypeScript для типизации'
      ],
      vue: [
        'Используйте Composition API в Vue 3',
        'Применяйте computed свойства для вычислений',
        'Используйте scoped стили',
        'Следуйте Vue Style Guide',
        'Используйте TypeScript с Vue'
      ],
      angular: [
        'Используйте OnPush стратегию для компонентов',
        'Применяйте RxJS для асинхронных операций',
        'Используйте lazy loading для модулей',
        'Следуйте Angular Style Guide',
        'Используйте строгую типизацию TypeScript'
      ],
      vanilla: [
        'Избегайте глобальных переменных',
        'Используйте современный ES6+ синтаксис',
        'Применяйте модульную архитектуру',
        'Используйте TypeScript для больших проектов',
        'Следуйте принципам SOLID'
      ]
    };

    return rules[framework] || [];
  }

  getFrameworkComplexityWeight(framework: string): number {
    const weights: Record<string, number> = {
      react: 1.0,
      vue: 0.9,
      angular: 1.2,
      svelte: 0.8,
      vanilla: 1.1,
      unknown: 1.0
    };

    return weights[framework] || 1.0;
  }
}

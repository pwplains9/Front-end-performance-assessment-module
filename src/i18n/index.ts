export interface Translations {
  // Assessment messages
  assessment: {
    starting: string;
    completed: string;
    framework: string;
    outputFormat: string;
    targetLevel: string;
    overallScore: string;
    developerLevel: string;
  };
  
  // Category names
  categories: {
    codeQuality: string;
    performance: string;
    architecture: string;
    bestPractices: string;
    maintainability: string;
  };
  
  // Rule messages
  rules: {
    // Code Quality
    namingConventions: string;
    functionLength: string;
    cyclomaticComplexity: string;
    magicNumbers: string;
    codeDuplication: string;
    commentsQuality: string;
    
    // Performance
    bundleSize: string;
    lazyLoading: string;
    heavyOperations: string;
    memoryLeaks: string;
    unnecessaryRenders: string;
    imageOptimization: string;
    
    // Architecture
    separationOfConcerns: string;
    dependencyInjection: string;
    singleResponsibility: string;
    layeredArchitecture: string;
    designPatterns: string;
    moduleCoupling: string;
    
    // Best Practices
    typescriptUsage: string;
    errorHandling: string;
    securityPractices: string;
    testingCoverage: string;
    accessibility: string;
    frameworkConventions: string;
    
    // Maintainability
    documentation: string;
    codeReadability: string;
    namingConsistency: string;
    deadCode: string;
    configurationManagement: string;
    errorMessages: string;
  };
  
  // Level descriptions
  levels: {
    junior: {
      name: string;
      description: string;
      criteria: string[];
    };
    middle: {
      name: string;
      description: string;
      criteria: string[];
    };
    senior: {
      name: string;
      description: string;
      criteria: string[];
    };
  };
  
  // Report sections
  report: {
    title: string;
    categoriesBreakdown: string;
    topIssues: string;
    recommendations: string;
    summary: string;
    fileAnalysis: string;
    issuesOverview: string;
    criticalIssues: string;
    warnings: string;
    noIssuesFound: string;
    detailedAnalysis: string;
  };
  
  // CLI messages
  cli: {
    commands: {
      assess: string;
      init: string;
      rules: string;
      levels: string;
    };
    messages: {
      projectNotFound: string;
      configCreated: string;
      availableRules: string;
      levelCriteria: string;
      assessmentStarting: string;
      assessmentCompleted: string;
      reportGenerated: string;
      error: string;
    };
  };
  
  // Common messages
  common: {
    file: string;
    rule: string;
    score: string;
    issues: string;
    suggestions: string;
    examples: string;
    category: string;
    priority: string;
    high: string;
    medium: string;
    low: string;
    error: string;
    warning: string;
    info: string;
    passed: string;
    failed: string;
  };
}

export type SupportedLanguage = 'en' | 'ru' | 'ua';

export class I18n {
  private currentLanguage: SupportedLanguage = 'en';
  private translations: Record<SupportedLanguage, Translations>;

  constructor() {
    this.translations = {
      en: require('./locales/en.json'),
      ru: require('./locales/ru.json'),
      ua: require('./locales/ua.json')
    };
  }

  setLanguage(language: SupportedLanguage): void {
    if (this.translations[language]) {
      this.currentLanguage = language;
    } else {
      console.warn(`Language ${language} is not supported. Using English as default.`);
      this.currentLanguage = 'en';
    }
  }

  getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  t(key: string, params?: Record<string, string | number>): string {
    const keys = key.split('.');
    let value: any = this.translations[this.currentLanguage];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key "${key}" not found for language "${this.currentLanguage}"`);
        return key;
      }
    }

    if (typeof value !== 'string') {
      console.warn(`Translation key "${key}" does not resolve to a string`);
      return key;
    }

    // Simple parameter substitution
    if (params) {
      return Object.entries(params).reduce((str, [param, val]) => {
        return str.replace(new RegExp(`{{${param}}}`, 'g'), String(val));
      }, value);
    }

    return value;
  }

  // Helper method to get array translations
  tArray(key: string): string[] {
    const keys = key.split('.');
    let value: any = this.translations[this.currentLanguage];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key "${key}" not found for language "${this.currentLanguage}"`);
        return [];
      }
    }

    return Array.isArray(value) ? value : [];
  }

  getSupportedLanguages(): SupportedLanguage[] {
    return Object.keys(this.translations) as SupportedLanguage[];
  }
}

// Global i18n instance
export const i18n = new I18n();

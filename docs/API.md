# API Documentation

Complete API reference for Frontend Performance Assessor.

## 🌍 Language Versions
- 🇺🇸 **English** (this file)
- 🇷🇺 **Русский** → [API-ru.md](API-ru.md)
- 🇺🇦 **Українська** → [API-ua.md](API-ua.md)

## Core Classes

### FrontendAssessor

Main assessment class for analyzing frontend projects.

```typescript
class FrontendAssessor {
  constructor(config: AssessmentConfig)
  async assess(): Promise<AssessmentResult>
}
```

#### Constructor Parameters

```typescript
interface AssessmentConfig {
  projectPath: string;                    // Path to project root
  framework?: 'vue' | 'react' | 'vanilla' | 'auto'; // Framework type
  targetLevel?: 'junior' | 'middle' | 'senior';     // Target level
  includePatterns?: string[];             // File patterns to include
  excludePatterns?: string[];             // File patterns to exclude
  customRules?: CustomRule[];             // Custom analysis rules
}
```

#### Example Usage

```typescript
import { FrontendAssessor } from 'frontend-performance-assessor';

const assessor = new FrontendAssessor({
  projectPath: './src',
  framework: 'react',
  targetLevel: 'middle',
  includePatterns: ['**/*.{ts,tsx,js,jsx}'],
  excludePatterns: ['**/*.test.*', '**/node_modules/**']
});

const result = await assessor.assess();
console.log(`Score: ${result.overallScore}/100`);
```

### Assessment Result

```typescript
interface AssessmentResult {
  overallScore: number;                   // Overall score (0-100)
  level: 'junior' | 'middle' | 'senior'; // Determined level
  categories: {
    codeQuality: CategoryResult;
    performance: CategoryResult;
    architecture: CategoryResult;
    bestPractices: CategoryResult;
    maintainability: CategoryResult;
  };
  fileResults: FileResult[];              // Per-file analysis
  recommendations: Recommendation[];       // Improvement suggestions
  summary: string;                        // Text summary
}
```

### Category Result

```typescript
interface CategoryResult {
  score: number;        // Points earned
  maxScore: number;     // Maximum possible points
  percentage: number;   // Percentage score (0-100)
  issues: Issue[];      // Found issues
}
```

### File Result

```typescript
interface FileResult {
  path: string;         // File path
  score: number;        // File score (0-100)
  issues: Issue[];      // Issues in this file
  suggestions: string[]; // Improvement suggestions
}
```

### Issue

```typescript
interface Issue {
  rule: string;                          // Rule ID
  severity: 'error' | 'warning' | 'info'; // Issue severity
  message: string;                       // Issue description
  line?: number;                         // Line number (if applicable)
  column?: number;                       // Column number (if applicable)
}
```

### Recommendation

```typescript
interface Recommendation {
  category: string;                      // Category name
  priority: 'high' | 'medium' | 'low';  // Priority level
  title: string;                         // Recommendation title
  description: string;                   // Detailed description
  examples?: string[];                   // Code examples
}
```

## Reporters

### ConsoleReporter

Generates colorful console output.

```typescript
class ConsoleReporter {
  report(result: AssessmentResult): void
}
```

### HtmlReporter

Generates interactive HTML reports.

```typescript
class HtmlReporter {
  generateReport(result: AssessmentResult, outputPath?: string): void
}
```

### JsonReporter

Generates structured JSON reports.

```typescript
class JsonReporter {
  generateReport(result: AssessmentResult, outputPath?: string): void
}
```

## Internationalization

### i18n Class

```typescript
class I18n {
  setLanguage(language: SupportedLanguage): void
  getCurrentLanguage(): SupportedLanguage
  t(key: string, params?: Record<string, string | number>): string
  tArray(key: string): string[]
  getSupportedLanguages(): SupportedLanguage[]
}
```

#### Supported Languages

```typescript
type SupportedLanguage = 'en' | 'ru' | 'ua';
```

#### Usage Example

```typescript
import { i18n } from 'frontend-performance-assessor';

// Set language
i18n.setLanguage('ru');

// Get translated text
const title = i18n.t('report.title');

// Get translated text with parameters
const message = i18n.t('assessment.completed', { 
  score: 85, 
  level: 'MIDDLE' 
});
```

## Utility Functions

### assessProject

Convenience function for quick assessment.

```typescript
async function assessProject(config: {
  projectPath: string;
  framework?: 'vue' | 'react' | 'vanilla' | 'auto';
  outputFormat?: 'console' | 'html' | 'json' | 'all';
  outputPath?: string;
  language?: 'en' | 'ru' | 'ua';
}): Promise<AssessmentResult>
```

#### Example

```typescript
import { assessProject } from 'frontend-performance-assessor';

const result = await assessProject({
  projectPath: './src',
  framework: 'vue',
  outputFormat: 'html',
  outputPath: 'quality-report.html',
  language: 'ru'
});
```

## Analyzers

### Base Analyzer

All analyzers extend the base analyzer class.

```typescript
abstract class BaseAnalyzer {
  protected abstract rules: AnalyzerRule[];
  async analyze(files: FileAnalysis[]): Promise<CategoryResult>
}
```

### Analyzer Rule

```typescript
interface AnalyzerRule {
  id: string;                            // Unique rule ID
  name: string;                          // Rule name
  description: string;                   // Rule description
  severity: 'error' | 'warning' | 'info'; // Issue severity
  weight: number;                        // Rule weight (points)
  check: (file: FileAnalysis) => RuleCheckResult; // Check function
}
```

### Custom Rules

You can create custom rules by implementing the `CustomRule` interface:

```typescript
interface CustomRule {
  id: string;
  name: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
  check: (file: FileAnalysis) => RuleResult;
}
```

#### Example Custom Rule

```typescript
const customRule: CustomRule = {
  id: 'CUSTOM001',
  name: 'No Console Logs',
  description: 'Detect console.log statements',
  severity: 'warning',
  check: (file: FileAnalysis) => {
    const hasConsoleLog = /console\.log/g.test(file.content);
    return {
      passed: !hasConsoleLog,
      score: hasConsoleLog ? 0 : 100,
      message: hasConsoleLog ? 'Remove console.log statements' : 'No console.log found',
      suggestions: hasConsoleLog ? ['Use proper logging library'] : []
    };
  }
};
```

## Framework Detection

### FrameworkDetector

Automatically detects the framework used in a project.

```typescript
class FrameworkDetector {
  detect(content: string, filePath: string): string
  getFrameworkSpecificRules(framework: string): string[]
  getFrameworkComplexityWeight(framework: string): number
}
```

## Level Evaluation

### LevelEvaluator

Determines developer level based on assessment results.

```typescript
class LevelEvaluator {
  determineLevel(
    overallScore: number,
    categories: Record<string, CategoryResult>,
    files: FileAnalysis[]
  ): 'junior' | 'middle' | 'senior'
  
  getLevelRecommendations(
    currentLevel: string, 
    targetLevel?: string
  ): string[]
  
  getDetailedLevelAnalysis(
    overallScore: number,
    categories: Record<string, CategoryResult>,
    files: FileAnalysis[]
  ): DetailedLevelAnalysis
}
```

### Level Criteria

```typescript
interface LevelCriteria {
  junior: {
    minScore: number;
    maxComplexity: number;
    requiredPractices: string[];
  };
  middle: {
    minScore: number;
    maxComplexity: number;
    requiredPractices: string[];
    architecturalPatterns: string[];
  };
  senior: {
    minScore: number;
    maxComplexity: number;
    requiredPractices: string[];
    architecturalPatterns: string[];
    leadershipIndicators: string[];
  };
}
```

## Error Handling

All async methods can throw errors. Wrap them in try-catch blocks:

```typescript
try {
  const result = await assessProject({
    projectPath: './src'
  });
  console.log('Assessment completed successfully');
} catch (error) {
  console.error('Assessment failed:', error.message);
}
```

## TypeScript Support

The package includes full TypeScript support with type definitions. Import types as needed:

```typescript
import {
  AssessmentResult,
  AssessmentConfig,
  CategoryResult,
  FileResult,
  Issue,
  Recommendation,
  CustomRule,
  SupportedLanguage
} from 'frontend-performance-assessor';
```

---

For more examples, see the [examples](../examples/) directory.

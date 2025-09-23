export interface AssessmentConfig {
  projectPath: string;
  framework?: 'vue' | 'react' | 'vanilla' | 'auto';
  targetLevel?: 'junior' | 'middle' | 'senior';
  includePatterns?: string[];
  excludePatterns?: string[];
  customRules?: CustomRule[];
}

export interface CustomRule {
  id: string;
  name: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
  check: (file: FileAnalysis) => RuleResult;
}

export interface RuleResult {
  passed: boolean;
  score: number;
  message: string;
  suggestions?: string[];
}

export interface FileAnalysis {
  path: string;
  content: string;
  size: number;
  lines: number;
  framework: string;
  type: 'component' | 'utility' | 'service' | 'config' | 'test' | 'other';
}

export interface AssessmentResult {
  overallScore: number;
  level: 'junior' | 'middle' | 'senior';
  categories: {
    codeQuality: CategoryResult;
    performance: CategoryResult;
    architecture: CategoryResult;
    bestPractices: CategoryResult;
    maintainability: CategoryResult;
  };
  fileResults: FileResult[];
  recommendations: Recommendation[];
  summary: string;
}

export interface CategoryResult {
  score: number;
  maxScore: number;
  percentage: number;
  issues: Issue[];
}

export interface FileResult {
  path: string;
  score: number;
  issues: Issue[];
  suggestions: string[];
}

export interface Issue {
  rule: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  line?: number;
  column?: number;
}

export interface Recommendation {
  category: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  examples?: string[];
}

export interface LevelCriteria {
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

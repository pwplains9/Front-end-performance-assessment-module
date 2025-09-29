# Frontend Performance Assessor

[![npm version](https://badge.fury.io/js/frontend-performance-assessor.svg)](https://badge.fury.io/js/frontend-performance-assessor)
[![Downloads](https://img.shields.io/npm/dm/frontend-performance-assessor.svg)](https://npmjs.org/package/frontend-performance-assessor)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green.svg)](https://nodejs.org/)
[![CLI](https://img.shields.io/badge/CLI-Available-brightgreen.svg)](https://www.npmjs.com/package/frontend-performance-assessor)
[![i18n](https://img.shields.io/badge/i18n-EN%20%7C%20RU%20%7C%20UA-blue.svg)](#-language-support)

🔍 A comprehensive module for assessing frontend developer performance with support for different levels (Junior/Middle/Senior) and frameworks (Vue, React, Angular, Vanilla JS). Includes internationalization support for English, Russian, and Ukrainian.

## 🌍 Documentation Languages

- 🇺🇸 **English** (this file)
- 🇷🇺 **Русский** → [docs/README-ru.md](docs/README-ru.md)
- 🇺🇦 **Українська** → [docs/README-ua.md](docs/README-ua.md)

## 🚀 Features

- **Multi-level assessment**: Junior, Middle, Senior
- **Framework support**: Vue, React, Angular, Svelte, Vanilla JS
- **Comprehensive analysis**: code quality, performance, architecture, best practices, maintainability
- **Multiple report formats**: console, HTML, JSON
- **Internationalization**: support for English, Russian, and Ukrainian languages
- **Customizable rules**: ability to add custom rules
- **CLI interface**: convenient command-line usage

## 📦 Installation

### Global installation
```bash
npm install -g frontend-performance-assessor
```

### Local installation
```bash
npm install --save-dev frontend-performance-assessor
```

## 🎯 Usage

### CLI Interface

#### Basic project assessment
```bash
# Assess current project
frontend-assessor assess ./src

# Assess with specific framework
frontend-assessor assess ./src --framework react

# Assess with Russian language
frontend-assessor assess ./src --lang ru

# Generate HTML report
frontend-assessor assess ./src --output html --path report.html

# Generate all report formats
frontend-assessor assess ./src --output all
```

#### Create configuration
```bash
# Create configuration file
frontend-assessor init --framework vue
```

#### View rules and criteria
```bash
# Show all rules
frontend-assessor rules

# Show rules by category
frontend-assessor rules --category performance

# Show level criteria
frontend-assessor levels

# Show supported languages
frontend-assessor lang
```

### Programmatic Usage

```typescript
import { assessProject, FrontendAssessor } from 'frontend-performance-assessor';

// Quick assessment
const result = await assessProject({
  projectPath: './src',
  framework: 'react',
  outputFormat: 'console',
  language: 'en' // Set language
});

console.log(`Overall score: ${result.overallScore}/100`);
console.log(`Developer level: ${result.level}`);

// Advanced usage
const assessor = new FrontendAssessor({
  projectPath: './src',
  framework: 'vue',
  includePatterns: ['**/*.{js,ts,vue}'],
  excludePatterns: ['**/node_modules/**', '**/dist/**']
});

const assessment = await assessor.assess();

// Generate reports
import { HtmlReporter, JsonReporter } from 'frontend-performance-assessor';

const htmlReporter = new HtmlReporter();
htmlReporter.generateReport(assessment, 'report.html');

const jsonReporter = new JsonReporter();
jsonReporter.generateReport(assessment, 'report.json');
```

## 📊 Assessment Criteria

### 🌱 Junior (60+ points)
- Knowledge of JavaScript/TypeScript basics
- Understanding of HTML/CSS
- Basic framework skills
- Simple error handling
- Clean and readable code

### 🌿 Middle (75+ points)
- Advanced JavaScript/TypeScript concepts
- Code testing
- Architectural patterns
- Performance optimization
- API and async programming

### 🌳 Senior (85+ points)
- Deep understanding of architecture
- SOLID principles and Clean Code
- Application security
- Mentoring and code review
- Technical leadership

## 🔍 Analysis Categories

### 1. Code Quality (25%)
- Naming conventions compliance
- Function length and complexity
- Cyclomatic complexity
- Code duplication
- Comments quality

### 2. Performance (20%)
- File and bundle sizes
- Lazy loading of components
- Render optimization
- Memory leaks
- Image optimization

### 3. Architecture (20%)
- Separation of concerns
- Dependency injection
- Single responsibility principle
- Layered architecture
- Design patterns

### 4. Best Practices (20%)
- TypeScript usage
- Error handling
- Security practices
- Testing
- Accessibility (a11y)

### 5. Maintainability (15%)
- Code documentation
- Code readability
- Naming consistency
- Dead code detection
- Configuration management

## 🌍 Language Support

The module supports three languages:
- **English** (`en`) - default
- **Russian** (`ru`)
- **Ukrainian** (`ua`)

### Setting Language

#### Via command line parameter:
```bash
frontend-assessor assess ./src --lang ru
```

#### Via environment variable:
```bash
# Windows
set FRONTEND_ASSESSOR_LANG=ru
frontend-assessor assess ./src

# Linux/Mac
export FRONTEND_ASSESSOR_LANG=ru
frontend-assessor assess ./src
```

#### Programmatically:
```javascript
import { assessProject, i18n } from 'frontend-performance-assessor';

// Set language globally
i18n.setLanguage('ua');

// Or specify in configuration
const result = await assessProject({
  projectPath: './src',
  language: 'ru'
});
```

## ⚙️ Configuration

Create a `frontend-assessor.config.json` file:

```json
{
  "framework": "auto",
  "includePatterns": ["**/*.{js,jsx,ts,tsx,vue}"],
  "excludePatterns": [
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/*.test.*",
    "**/*.spec.*"
  ],
  "targetLevel": "middle",
  "customRules": [
    {
      "id": "CUSTOM001",
      "name": "Custom Rule",
      "description": "Rule description",
      "severity": "warning"
    }
  ]
}
```

## 🎨 Report Formats

### Console Report
Colorful interactive report in terminal with progress bars and emojis.

### HTML Report
Beautiful web report with:
- Interactive charts
- Detailed category breakdown
- File and issue lists
- Improvement recommendations

### JSON Report
Structured data for integration with other tools.

## 🔧 Project Integration

### Vite
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import { assessProject } from 'frontend-performance-assessor';

export default defineConfig({
  plugins: [
    {
      name: 'frontend-assessor',
      buildStart: async () => {
        await assessProject({
          projectPath: './src',
          outputFormat: 'console'
        });
      }
    }
  ]
});
```

### NPM Scripts
```json
{
  "scripts": {
    "assess": "frontend-assessor assess ./src",
    "assess:html": "frontend-assessor assess ./src --output html",
    "assess:ci": "frontend-assessor assess ./src --output json"
  }
}
```

### GitHub Actions
```yaml
name: Code Quality Assessment
on: [push, pull_request]

jobs:
  assess:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install -g frontend-performance-assessor
      - run: frontend-assessor assess ./src --output json --path assessment.json
      - uses: actions/upload-artifact@v3
        with:
          name: assessment-report
          path: assessment.json
```

## 📈 Usage Examples

### React Project
```bash
frontend-assessor assess ./src --framework react --output html
```

### Vue Project
```bash
frontend-assessor assess ./src --framework vue --output all
```

### Vanilla JS Project
```bash
frontend-assessor assess ./src --framework vanilla --include "**/*.js" --exclude "**/vendor/**"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 🐛 Report Issues

If you find a bug or want to suggest an improvement, create an issue in the [GitHub repository](https://github.com/pwplains9/frontend-performance-assessor/issues).

## 📞 Support

- 📧 Email: byalexdesign@gmail.com

---

Made with ❤️ for the frontend development community
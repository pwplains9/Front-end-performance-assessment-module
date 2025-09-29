# Frontend Performance Assessor Documentation

Welcome to the comprehensive documentation for Frontend Performance Assessor - a powerful tool for evaluating frontend developer skills and code quality.

## 🌍 Choose Your Language

### 📚 User Documentation
- 🇺🇸 **English** → [README.md](../README.md)
- 🇷🇺 **Русский** → [README-ru.md](README-ru.md)  
- 🇺🇦 **Українська** → [README-ua.md](README-ua.md)

### 🔧 Developer Documentation
- 🇺🇸 **API Reference** → [API.md](API.md)
- 🇺🇸 **Contributing Guide** → [CONTRIBUTING.md](CONTRIBUTING.md)
- 🇷🇺 **Руководство по участию** → [CONTRIBUTING-ru.md](CONTRIBUTING-ru.md)
- 🇺🇦 **Посібник з участі** → [CONTRIBUTING-ua.md](CONTRIBUTING-ua.md)

## 📖 Quick Start

### Installation
```bash
npm install -g frontend-performance-assessor
```

### Basic Usage
```bash
# Assess your project
frontend-assessor assess ./src

# With language selection
frontend-assessor assess ./src --lang ru
frontend-assessor assess ./src --lang ua
```

### Programmatic Usage
```javascript
import { assessProject } from 'frontend-performance-assessor';

const result = await assessProject({
  projectPath: './src',
  language: 'en' // or 'ru', 'ua'
});
```

## 🎯 What's Assessed

- **Code Quality** (25%) - Naming, complexity, duplication
- **Performance** (20%) - Bundle size, optimization, memory
- **Architecture** (20%) - Patterns, separation, design
- **Best Practices** (20%) - TypeScript, testing, security
- **Maintainability** (15%) - Documentation, readability

## 🏆 Developer Levels

- 🌱 **Junior** (60+) - Learning fundamentals
- 🌿 **Middle** (75+) - Solid understanding
- 🌳 **Senior** (85+) - Expert level

## 🚀 Features

✅ Multi-framework support (React, Vue, Angular, Vanilla JS)  
✅ Multiple report formats (Console, HTML, JSON)  
✅ Internationalization (EN, RU, UA)  
✅ Customizable rules  
✅ CI/CD integration  
✅ TypeScript support  

## 📊 Report Examples

### Console Output
```
🔍 Frontend Performance Assessment Report
📊 Overall Score: 87/100
🎯 Developer Level: 🌿 MIDDLE
```

### HTML Report
Interactive web report with charts and detailed analysis.

### JSON Report
Structured data for programmatic processing.

## 🔗 Links

- [GitHub Repository](https://github.com/pwplains9/frontend-performance-assessor)
- [NPM Package](https://www.npmjs.com/package/frontend-performance-assessor)
- [Examples](../examples/)
- [Changelog](../CHANGELOG.md)

## 📞 Support

Need help? 
- 📧 Email: support@frontend-assessor.com
- 💬 Discord: [Frontend Assessor Community](https://discord.gg/frontend-assessor)
- 🐛 Issues: [GitHub Issues](https://github.com/pwplains9/frontend-performance-assessor/issues)

---

Choose your language above to get started! 🚀

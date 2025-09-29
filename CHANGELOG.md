# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1] - 2024-01-15

### 🔧 Fixed
- **GitHub repository links**: Updated all GitHub URLs to point to correct repository `pwplains9/Front-end-performance-assessment-module`
- **README.md**: Fixed issue tracker and repository links
- **package.json**: Updated repository, bugs, and homepage URLs

### 📝 Changed
- **Documentation**: All GitHub links now point to the correct repository
- **NPM package**: Updated metadata with correct repository information

---

## [1.1.0] - 2024-01-15

### 🌍 Added - Internationalization
- **Multi-language support**: English, Russian, Ukrainian
- **CLI language options**: `--lang` parameter and `FRONTEND_ASSESSOR_LANG` environment variable
- **Localized reports**: All report formats now support multiple languages
- **New CLI command**: `frontend-assessor lang` to show supported languages
- **i18n system**: Complete internationalization framework with parametrized translations

### 📚 Added - Documentation
- **Multi-language documentation**: README available in EN, RU, UA
- **API documentation**: Complete API reference (`docs/API.md`)
- **Contributing guide**: Guidelines for contributors in multiple languages
- **Documentation structure**: Organized `docs/` folder with language versions
- **Documentation index**: `docs/index.md` as entry point

### 🔧 Changed
- **Code comments**: All code comments translated to English
- **Default language**: English is now the default language
- **API enhancement**: Added `language` parameter to `assessProject` function
- **Build process**: JSON locale files are now automatically copied during build

### 🌍 Language Files
- `src/i18n/locales/en.json` - English translations
- `src/i18n/locales/ru.json` - Russian translations  
- `src/i18n/locales/ua.json` - Ukrainian translations

### 📖 Documentation Files
- `docs/README-ru.md` - Russian documentation
- `docs/README-ua.md` - Ukrainian documentation
- `docs/API.md` - API reference
- `docs/CONTRIBUTING.md` - Contributing guide (EN)
- `docs/CONTRIBUTING-ru.md` - Contributing guide (RU)
- `docs/CONTRIBUTING-ua.md` - Contributing guide (UA)

### 🔄 Migration Guide
For existing users, no breaking changes. The module defaults to English and maintains backward compatibility.

To use other languages:
```bash
# CLI
frontend-assessor assess ./src --lang ru

# Programmatically  
assessProject({ projectPath: './src', language: 'ua' })
```

---

## [1.0.0] - 2024-01-01

### 🎉 Added - Initial Release
- **Multi-level assessment**: Junior/Middle/Senior evaluation system
- **Framework support**: Vue, React, Angular, Svelte, Vanilla JS with auto-detection
- **Comprehensive analysis**: 5 categories with 30+ rules:
  - Code Quality (25%): Naming, complexity, duplication
  - Performance (20%): Bundle size, optimization, memory
  - Architecture (20%): Patterns, separation, design  
  - Best Practices (20%): TypeScript, testing, security
  - Maintainability (15%): Documentation, readability
- **Multiple report formats**: Console, HTML, JSON
- **CLI interface**: Complete command-line tool
- **Programmatic API**: Full TypeScript support
- **Customizable rules**: Add your own assessment rules
- **CI/CD integration**: JSON reports for automated workflows

### 🚀 Features
- **Assessment Engine**: Core assessment logic with 30+ rules
- **Framework Detection**: Automatic framework detection and specific rules
- **Level Evaluation**: Sophisticated algorithm for determining developer level
- **Progress Tracking**: Visual progress bars and detailed breakdowns
- **Customization**: Support for custom rules and configuration
- **CI/CD Integration**: JSON output for automated quality gates
- **Beautiful Reports**: Interactive HTML reports with charts
- **Performance Focused**: Efficient analysis of large codebases

### 📋 Supported Rules
- **Code Quality**: Naming conventions, function length, complexity, duplication
- **Performance**: Bundle size, lazy loading, memory leaks, render optimization
- **Architecture**: Separation of concerns, SOLID principles, design patterns
- **Best Practices**: TypeScript usage, error handling, security, testing
- **Maintainability**: Documentation, readability, dead code detection

### 🔧 CLI Commands
- `assess` - Run project assessment
- `init` - Create configuration file
- `rules` - Show available rules
- `levels` - Show level criteria

### 🔗 Integrations
- Vite plugin for development-time assessment
- GitHub Actions workflow for CI/CD
- NPM scripts integration
- Programmatic API for custom tools

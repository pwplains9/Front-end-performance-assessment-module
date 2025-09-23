# Changelog

All notable changes to Frontend Performance Assessor will be documented in this file.

## [1.1.0] - 2024-01-15

### 🌍 Added - Internationalization
- **Multi-language support**: English, Russian, Ukrainian
- **CLI language options**: `--lang` parameter and `FRONTEND_ASSESSOR_LANG` environment variable
- **Localized reports**: All report formats now support multiple languages
- **New CLI command**: `frontend-assessor lang` to show supported languages

### 🔧 Changed
- **Code comments**: All code comments translated to English
- **Default language**: English is now the default language
- **API enhancement**: Added `language` parameter to `assessProject` function

### 🌍 Language Files
- `src/i18n/locales/en.json` - English translations
- `src/i18n/locales/ru.json` - Russian translations  
- `src/i18n/locales/ua.json` - Ukrainian translations

### 📚 Documentation
- **Multi-language documentation**: README available in EN, RU, UA
- **API documentation**: Complete API reference added
- **Contributing guide**: Guidelines for contributors in multiple languages
- **Documentation structure**: Organized docs/ folder with language versions

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

### 🎉 Initial Release
- **Multi-level assessment**: Junior/Middle/Senior evaluation
- **Framework support**: Vue, React, Angular, Svelte, Vanilla JS
- **Comprehensive analysis**: 5 categories with 30+ rules
- **Multiple report formats**: Console, HTML, JSON
- **CLI interface**: Complete command-line tool
- **Programmatic API**: Full TypeScript support
- **Customizable rules**: Add your own assessment rules
- **CI/CD integration**: JSON reports for automated workflows

### 📊 Assessment Categories
- **Code Quality** (25%): Naming, complexity, duplication
- **Performance** (20%): Bundle size, optimization, memory
- **Architecture** (20%): Patterns, separation, design  
- **Best Practices** (20%): TypeScript, testing, security
- **Maintainability** (15%): Documentation, readability

### 🔧 CLI Commands
- `assess` - Run project assessment
- `init` - Create configuration file
- `rules` - Show available rules
- `levels` - Show level criteria

### 🚀 Features
- Automatic framework detection
- Configurable file patterns
- Detailed recommendations
- Progress tracking
- Beautiful HTML reports with charts
- TypeScript definitions included

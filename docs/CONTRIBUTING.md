# Contributing to Frontend Performance Assessor

Thank you for your interest in contributing to Frontend Performance Assessor! This document provides guidelines for contributing to the project.

## 🌍 Language Versions
- 🇺🇸 **English** (this file)
- 🇷🇺 **Русский** → [CONTRIBUTING-ru.md](CONTRIBUTING-ru.md)
- 🇺🇦 **Українська** → [CONTRIBUTING-ua.md](CONTRIBUTING-ua.md)

## 🤝 How to Contribute

### Reporting Issues
1. Check existing issues to avoid duplicates
2. Use the issue template if available
3. Provide detailed information:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment details (Node.js version, OS, etc.)

### Submitting Pull Requests
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass: `npm test`
6. Update documentation if needed
7. Commit with clear messages
8. Push to your fork: `git push origin feature/your-feature-name`
9. Create a Pull Request

## 🔧 Development Setup

### Prerequisites
- Node.js 16.0.0 or higher
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/pwplains9/frontend-performance-assessor.git
cd frontend-performance-assessor

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run linter
npm run lint
```

### Project Structure
```
frontend-performance-assessor/
├── src/                    # Source code
│   ├── analyzers/         # Code analyzers
│   ├── core/              # Core assessment engine
│   ├── i18n/              # Internationalization
│   ├── reporters/         # Report generators
│   ├── types/             # TypeScript types
│   └── utils/             # Utilities
├── docs/                  # Documentation
├── examples/              # Usage examples
└── dist/                  # Compiled output
```

## 📝 Coding Standards

### TypeScript
- Use TypeScript for all new code
- Follow strict type checking
- Export interfaces and types appropriately
- Use meaningful names for variables and functions

### Code Style
- Use ESLint configuration provided in the project
- Follow Prettier formatting rules
- Write clear, self-documenting code
- Add JSDoc comments for public APIs

### Testing
- Write unit tests for new features
- Ensure test coverage remains high
- Use descriptive test names
- Test both success and error scenarios

## 🌍 Internationalization

### Adding New Languages
1. Create a new locale file in `src/i18n/locales/`
2. Follow the existing structure of `en.json`
3. Update the `SupportedLanguage` type in `src/i18n/index.ts`
4. Add the language to the CLI help and documentation

### Translation Guidelines
- Keep translations consistent with the tone of the project
- Use appropriate technical terminology
- Test translations in the actual interface
- Consider context when translating

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Types
- **Unit tests**: Test individual functions and classes
- **Integration tests**: Test component interactions
- **CLI tests**: Test command-line interface
- **Localization tests**: Test translations

## 📚 Documentation

### Documentation Guidelines
- Update relevant documentation for any changes
- Use clear, concise language
- Include code examples
- Keep translations up to date

### API Documentation
- Use JSDoc for inline documentation
- Document all public methods and interfaces
- Include parameter descriptions and return types
- Provide usage examples

## 🔄 Release Process

### Versioning
We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist
1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Run full test suite
4. Build and test distribution
5. Create release tag
6. Publish to npm
7. Update documentation

## 🎯 Areas for Contribution

### High Priority
- New analysis rules
- Performance improvements
- Bug fixes
- Documentation improvements
- Test coverage improvements

### Medium Priority
- New framework support
- Additional report formats
- CLI enhancements
- Integration examples

### Low Priority
- Code refactoring
- Developer experience improvements
- Additional language translations

## 💬 Communication

### Getting Help
- Create an issue for questions
- Check existing documentation

### Code Review Process
1. All PRs require review from maintainers
2. Address feedback promptly
3. Keep PRs focused and reasonably sized
4. Be respectful in discussions

## 🏆 Recognition

Contributors will be:
- Listed in the project's contributors section
- Mentioned in release notes for significant contributions
- Invited to join the core team for outstanding contributions

## 📜 Code of Conduct

Please note that this project is released with a [Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project, you agree to abide by its terms.

---

Thank you for contributing to Frontend Performance Assessor! 🚀

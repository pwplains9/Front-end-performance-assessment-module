# Frontend Performance Assessor

Комплексний модуль для оцінки продуктивності frontend розробників з підтримкою різних рівнів (Junior/Middle/Senior) та фреймворків (Vue, React, Vanilla JS).

## 🌍 Мови документації

- 🇺🇸 **English** → [../README.md](../README.md)
- 🇷🇺 **Русский** → [README-ru.md](README-ru.md)
- 🇺🇦 **Українська** (цей файл)

## 🚀 Можливості

- **Багаторівнева оцінка**: Junior, Middle, Senior
- **Підтримка фреймворків**: Vue, React, Angular, Svelte, Vanilla JS
- **Комплексний аналіз**: якість коду, продуктивність, архітектура, найкращі практики, підтримуваність
- **Множинні формати звітів**: консоль, HTML, JSON
- **Інтернаціоналізація**: підтримка англійської, російської та української мов
- **Налаштовувані правила**: можливість додавання власних правил
- **CLI інтерфейс**: зручне використання з командного рядка

## 📦 Встановлення

### Глобальне встановлення
```bash
npm install -g frontend-performance-assessor
```

### Локальне встановлення
```bash
npm install --save-dev frontend-performance-assessor
```

## 🎯 Використання

### CLI інтерфейс

#### Базова оцінка проєкту
```bash
# Оцінити поточний проєкт
frontend-assessor assess ./src

# Оцінити із зазначенням фреймворка
frontend-assessor assess ./src --framework react

# Оцінити українською мовою
frontend-assessor assess ./src --lang ua

# Згенерувати HTML звіт
frontend-assessor assess ./src --output html --path report.html

# Згенерувати всі формати звітів
frontend-assessor assess ./src --output all
```

#### Створення конфігурації
```bash
# Створити конфігураційний файл
frontend-assessor init --framework vue
```

#### Перегляд правил та критеріїв
```bash
# Показати всі правила
frontend-assessor rules

# Показати правила за категорією
frontend-assessor rules --category performance

# Показати критерії рівнів
frontend-assessor levels

# Показати підтримувані мови
frontend-assessor lang
```

### Програмне використання

```typescript
import { assessProject, FrontendAssessor } from 'frontend-performance-assessor';

// Швидка оцінка
const result = await assessProject({
  projectPath: './src',
  framework: 'react',
  outputFormat: 'console',
  language: 'ua' // Встановити українську мову
});

console.log(`Загальний бал: ${result.overallScore}/100`);
console.log(`Рівень розробника: ${result.level}`);

// Розширене використання
const assessor = new FrontendAssessor({
  projectPath: './src',
  framework: 'vue',
  includePatterns: ['**/*.{js,ts,vue}'],
  excludePatterns: ['**/node_modules/**', '**/dist/**']
});

const assessment = await assessor.assess();

// Генерація звітів
import { HtmlReporter, JsonReporter } from 'frontend-performance-assessor';

const htmlReporter = new HtmlReporter();
htmlReporter.generateReport(assessment, 'report.html');

const jsonReporter = new JsonReporter();
jsonReporter.generateReport(assessment, 'report.json');
```

## 📊 Критерії оцінки

### 🌱 Junior (60+ балів)
- Знання основ JavaScript/TypeScript
- Розуміння HTML/CSS
- Базові навички роботи з фреймворком
- Проста обробка помилок
- Чистота і читабельність коду

### 🌿 Middle (75+ балів)
- Просунуті концепції JavaScript/TypeScript
- Тестування коду
- Архітектурні патерни
- Оптимізація продуктивності
- Робота з API та асинхронністю

### 🌳 Senior (85+ балів)
- Глибоке розуміння архітектури
- Принципи SOLID і Clean Code
- Безпека додатків
- Менторинг і code review
- Технічне лідерство

## 🔍 Категорії аналізу

### 1. Якість коду (25%)
- Дотримання конвенцій іменування
- Довжина та складність функцій
- Цикломатична складність
- Дублювання коду
- Якість коментарів

### 2. Продуктивність (20%)
- Розміри файлів та бандла
- Ледаче завантаження компонентів
- Оптимізація рендерингу
- Витоки пам'яті
- Оптимізація зображень

### 3. Архітектура (20%)
- Розділення відповідальності
- Впровадження залежностей
- Принцип єдиної відповідальності
- Шарувата архітектура
- Патерни проєктування

### 4. Найкращі практики (20%)
- Використання TypeScript
- Обробка помилок
- Практики безпеки
- Тестування
- Доступність (a11y)

### 5. Підтримуваність (15%)
- Документація коду
- Читабельність коду
- Консистентність іменування
- Виявлення мертвого коду
- Управління конфігурацією

## 🌍 Підтримка мов

Модуль підтримує три мови:
- **Англійська** (`en`) - за замовчуванням
- **Російська** (`ru`)
- **Українська** (`ua`)

### Встановлення мови

#### Через параметр командного рядка:
```bash
frontend-assessor assess ./src --lang ua
```

#### Через змінну оточення:
```bash
# Windows
set FRONTEND_ASSESSOR_LANG=ua
frontend-assessor assess ./src

# Linux/Mac
export FRONTEND_ASSESSOR_LANG=ua
frontend-assessor assess ./src
```

#### Програмно:
```javascript
import { assessProject, i18n } from 'frontend-performance-assessor';

// Встановити мову глобально
i18n.setLanguage('ua');

// Або вказати в конфігурації
const result = await assessProject({
  projectPath: './src',
  language: 'ua'
});
```

## ⚙️ Конфігурація

Створіть файл `frontend-assessor.config.json`:

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
      "name": "Користувацьке правило",
      "description": "Опис правила",
      "severity": "warning"
    }
  ]
}
```

## 🎨 Формати звітів

### Консольний звіт
Кольоровий інтерактивний звіт у терміналі з прогрес-барами та емодзі.

### HTML звіт
Гарний веб-звіт з:
- Інтерактивними графіками
- Детальною розбивкою за категоріями
- Списком файлів та проблем
- Рекомендаціями щодо покращення

### JSON звіт
Структуровані дані для інтеграції з іншими інструментами.

## 🔧 Інтеграція з проєктами

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
name: Оцінка якості коду
on: [push, pull_request]

jobs:
  assess:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install -g frontend-performance-assessor
      - run: frontend-assessor assess ./src --output json --path assessment.json --lang ua
      - uses: actions/upload-artifact@v3
        with:
          name: assessment-report
          path: assessment.json
```

## 📈 Приклади використання

### React проєкт
```bash
frontend-assessor assess ./src --framework react --output html --lang ua
```

### Vue проєкт
```bash
frontend-assessor assess ./src --framework vue --output all --lang ua
```

### Vanilla JS проєкт
```bash
frontend-assessor assess ./src --framework vanilla --include "**/*.js" --exclude "**/vendor/**" --lang ua
```

## 🤝 Внесок у проєкт

1. Зробіть fork репозиторію
2. Створіть feature branch (`git checkout -b feature/amazing-feature`)
3. Зафіксуйте зміни (`git commit -m 'Add amazing feature'`)
4. Відправте в branch (`git push origin feature/amazing-feature`)
5. Відкрийте Pull Request

## 📄 Ліцензія

MIT License - див. файл [LICENSE](../LICENSE)

## 🐛 Повідомити про помилку

Якщо ви знайшли помилку або хочете запропонувати покращення, створіть issue в [GitHub репозиторії](https://github.com/pwplains9/Front-end-performance-assessment-module/issues).

## 📞 Підтримка

- 📧 Email: byalexdesign@gmail.com

---

Створено з ❤️ для спільноти frontend розробників

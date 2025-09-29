# Frontend Performance Assessor

Комплексный модуль для оценки производительности frontend разработчиков с поддержкой различных уровней (Junior/Middle/Senior) и фреймворков (Vue, React, Vanilla JS).

## 🌍 Языки документации

- 🇺🇸 **English** → [../README.md](../README.md)
- 🇷🇺 **Русский** (этот файл)
- 🇺🇦 **Українська** → [README-ua.md](README-ua.md)

## 🚀 Возможности

- **Многоуровневая оценка**: Junior, Middle, Senior
- **Поддержка фреймворков**: Vue, React, Angular, Svelte, Vanilla JS
- **Комплексный анализ**: качество кода, производительность, архитектура, лучшие практики, поддерживаемость
- **Множественные форматы отчетов**: консоль, HTML, JSON
- **Интернационализация**: поддержка английского, русского и украинского языков
- **Настраиваемые правила**: возможность добавления собственных правил
- **CLI интерфейс**: удобное использование из командной строки

## 📦 Установка

### Глобальная установка
```bash
npm install -g frontend-performance-assessor
```

### Локальная установка
```bash
npm install --save-dev frontend-performance-assessor
```

## 🎯 Использование

### CLI интерфейс

#### Базовая оценка проекта
```bash
# Оценить текущий проект
frontend-assessor assess ./src

# Оценить с указанием фреймворка
frontend-assessor assess ./src --framework react

# Оценить с русским языком
frontend-assessor assess ./src --lang ru

# Сгенерировать HTML отчет
frontend-assessor assess ./src --output html --path report.html

# Сгенерировать все форматы отчетов
frontend-assessor assess ./src --output all
```

#### Создание конфигурации
```bash
# Создать конфигурационный файл
frontend-assessor init --framework vue
```

#### Просмотр правил и критериев
```bash
# Показать все правила
frontend-assessor rules

# Показать правила по категории
frontend-assessor rules --category performance

# Показать критерии уровней
frontend-assessor levels

# Показать поддерживаемые языки
frontend-assessor lang
```

### Программное использование

```typescript
import { assessProject, FrontendAssessor } from 'frontend-performance-assessor';

// Быстрая оценка
const result = await assessProject({
  projectPath: './src',
  framework: 'react',
  outputFormat: 'console',
  language: 'ru' // Установить русский язык
});

console.log(`Общий балл: ${result.overallScore}/100`);
console.log(`Уровень разработчика: ${result.level}`);

// Расширенное использование
const assessor = new FrontendAssessor({
  projectPath: './src',
  framework: 'vue',
  includePatterns: ['**/*.{js,ts,vue}'],
  excludePatterns: ['**/node_modules/**', '**/dist/**']
});

const assessment = await assessor.assess();

// Генерация отчетов
import { HtmlReporter, JsonReporter } from 'frontend-performance-assessor';

const htmlReporter = new HtmlReporter();
htmlReporter.generateReport(assessment, 'report.html');

const jsonReporter = new JsonReporter();
jsonReporter.generateReport(assessment, 'report.json');
```

## 📊 Критерии оценки

### 🌱 Junior (60+ баллов)
- Знание основ JavaScript/TypeScript
- Понимание HTML/CSS
- Базовые навыки работы с фреймворком
- Простая обработка ошибок
- Чистота и читаемость кода

### 🌿 Middle (75+ баллов)
- Продвинутые концепции JavaScript/TypeScript
- Тестирование кода
- Архитектурные паттерны
- Оптимизация производительности
- Работа с API и асинхронностью

### 🌳 Senior (85+ баллов)
- Глубокое понимание архитектуры
- Принципы SOLID и Clean Code
- Безопасность приложений
- Менторинг и code review
- Техническое лидерство

## 🔍 Категории анализа

### 1. Качество кода (25%)
- Соблюдение конвенций именования
- Длина и сложность функций
- Цикломатическая сложность
- Дублирование кода
- Качество комментариев

### 2. Производительность (20%)
- Размеры файлов и бандла
- Ленивая загрузка компонентов
- Оптимизация рендеринга
- Утечки памяти
- Оптимизация изображений

### 3. Архитектура (20%)
- Разделение ответственности
- Внедрение зависимостей
- Принцип единственной ответственности
- Слоистая архитектура
- Паттерны проектирования

### 4. Лучшие практики (20%)
- Использование TypeScript
- Обработка ошибок
- Практики безопасности
- Тестирование
- Доступность (a11y)

### 5. Поддерживаемость (15%)
- Документация кода
- Читаемость кода
- Консистентность именования
- Обнаружение мертвого кода
- Управление конфигурацией

## 🌍 Поддержка языков

Модуль поддерживает три языка:
- **Английский** (`en`) - по умолчанию
- **Русский** (`ru`)
- **Украинский** (`ua`)

### Установка языка

#### Через параметр командной строки:
```bash
frontend-assessor assess ./src --lang ru
```

#### Через переменную окружения:
```bash
# Windows
set FRONTEND_ASSESSOR_LANG=ru
frontend-assessor assess ./src

# Linux/Mac
export FRONTEND_ASSESSOR_LANG=ru
frontend-assessor assess ./src
```

#### Программно:
```javascript
import { assessProject, i18n } from 'frontend-performance-assessor';

// Установить язык глобально
i18n.setLanguage('ru');

// Или указать в конфигурации
const result = await assessProject({
  projectPath: './src',
  language: 'ru'
});
```

## ⚙️ Конфигурация

Создайте файл `frontend-assessor.config.json`:

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
      "name": "Пользовательское правило",
      "description": "Описание правила",
      "severity": "warning"
    }
  ]
}
```

## 🎨 Форматы отчетов

### Консольный отчет
Цветной интерактивный отчет в терминале с прогресс-барами и эмодзи.

### HTML отчет
Красивый веб-отчет с:
- Интерактивными графиками
- Детальной разбивкой по категориям
- Списком файлов и проблем
- Рекомендациями по улучшению

### JSON отчет
Структурированные данные для интеграции с другими инструментами.

## 🔧 Интеграция с проектами

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
name: Оценка качества кода
on: [push, pull_request]

jobs:
  assess:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install -g frontend-performance-assessor
      - run: frontend-assessor assess ./src --output json --path assessment.json --lang ru
      - uses: actions/upload-artifact@v3
        with:
          name: assessment-report
          path: assessment.json
```

## 📈 Примеры использования

### React проект
```bash
frontend-assessor assess ./src --framework react --output html --lang ru
```

### Vue проект
```bash
frontend-assessor assess ./src --framework vue --output all --lang ru
```

### Vanilla JS проект
```bash
frontend-assessor assess ./src --framework vanilla --include "**/*.js" --exclude "**/vendor/**" --lang ru
```

## 🤝 Вклад в проект

1. Сделайте fork репозитория
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add amazing feature'`)
4. Отправьте в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

MIT License - см. файл [LICENSE](../LICENSE)

## 🐛 Сообщить об ошибке

Если вы нашли ошибку или хотите предложить улучшение, создайте issue в [GitHub репозитории](https://github.com/pwplains9/Front-end-performance-assessment-module/issues).

## 📞 Поддержка

- 📧 Email: byalexdesign@gmail.com

---

Создано с ❤️ для сообщества frontend разработчиков

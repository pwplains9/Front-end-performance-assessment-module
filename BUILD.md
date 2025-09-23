# Сборка и публикация модуля

## 🔧 Локальная разработка

### 1. Установка зависимостей
```bash
npm install
```

### 2. Сборка проекта
```bash
npm run build
```

### 3. Запуск линтера
```bash
npm run lint
```

### 4. Локальное тестирование
```bash
# Создать символическую ссылку
npm link

# Использовать в другом проекте
cd /path/to/test-project
npm link frontend-performance-assessor

# Тестирование CLI
frontend-assessor assess ./src
```

## 📦 Публикация в NPM

### 1. Подготовка к публикации
```bash
# Убедитесь что все файлы собраны
npm run build

# Проверьте содержимое пакета
npm pack --dry-run
```

### 2. Логин в NPM
```bash
npm login
```

### 3. Публикация
```bash
# Первая публикация
npm publish

# Обновление версии и публикация
npm version patch  # или minor, major
npm publish
```

### 4. Проверка публикации
```bash
# Проверить что пакет доступен
npm info frontend-performance-assessor

# Установить из NPM
npm install -g frontend-performance-assessor
```

## 🚀 Автоматическая публикация через GitHub Actions

Создайте файл `.github/workflows/publish.yml`:

```yaml
name: Publish to NPM

on:
  release:
    types: [published]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 📋 Чеклист перед публикацией

- [ ] Все тесты проходят
- [ ] Код собирается без ошибок
- [ ] Линтер не выдает ошибок
- [ ] README.md обновлен
- [ ] CHANGELOG.md содержит изменения
- [ ] Версия в package.json обновлена
- [ ] Примеры работают корректно
- [ ] CLI команды протестированы

## 🔍 Структура опубликованного пакета

```
frontend-performance-assessor/
├── dist/                   # Скомпилированный код
│   ├── index.js
│   ├── index.d.ts
│   ├── cli.js
│   └── ...
├── package.json
├── README.md
├── LICENSE
└── CHANGELOG.md
```

## 🎯 Использование после публикации

### Глобальная установка
```bash
npm install -g frontend-performance-assessor
frontend-assessor assess ./my-project
```

### В проекте
```bash
npm install --save-dev frontend-performance-assessor
npx frontend-assessor assess ./src
```

### Программное использование
```javascript
const { assessProject } = require('frontend-performance-assessor');

assessProject({
  projectPath: './src',
  outputFormat: 'console'
});
```

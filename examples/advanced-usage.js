const { 
  FrontendAssessor, 
  HtmlReporter, 
  JsonReporter,
  LevelEvaluator 
} = require('frontend-performance-assessor');

async function advancedAssessment() {
  try {
    console.log('🚀 Запуск расширенной оценки проекта...\n');

    // Создание assessor с кастомными настройками
    const assessor = new FrontendAssessor({
      projectPath: './src',
      framework: 'react',
      includePatterns: [
        '**/*.{js,jsx,ts,tsx}',
        '**/*.vue',
        '!**/*.test.*',
        '!**/*.spec.*'
      ],
      excludePatterns: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/coverage/**'
      ]
    });

    // Выполнение оценки
    const result = await assessor.assess();

    console.log('📈 Детальные результаты по категориям:');
    Object.entries(result.categories).forEach(([category, data]) => {
      console.log(`  ${category}: ${data.percentage}% (${data.issues.length} проблем)`);
    });

    // Генерация HTML отчета
    const htmlReporter = new HtmlReporter();
    htmlReporter.generateReport(result, 'detailed-report.html');

    // Генерация JSON отчета для CI/CD
    const jsonReporter = new JsonReporter();
    jsonReporter.generateReport(result, 'assessment-data.json');

    // Получение детального анализа уровня
    const levelEvaluator = new LevelEvaluator();
    const levelAnalysis = levelEvaluator.getDetailedLevelAnalysis(
      result.overallScore,
      result.categories,
      [] // fileAnalyses - в реальном использовании передайте данные файлов
    );

    console.log('\n🎯 Детальный анализ уровня:');
    console.log(`Текущий уровень: ${levelAnalysis.currentLevel.toUpperCase()}`);
    console.log(`Сильные стороны: ${levelAnalysis.strengths.join(', ')}`);
    console.log(`Области для улучшения: ${levelAnalysis.weaknesses.join(', ')}`);
    console.log(`Время до следующего уровня: ${levelAnalysis.estimatedTimeToNextLevel}`);

    console.log('\n💡 Следующие шаги:');
    levelAnalysis.nextSteps.forEach((step, index) => {
      console.log(`  ${index + 1}. ${step}`);
    });

    // Фильтрация критических проблем
    const criticalIssues = Object.values(result.categories)
      .flatMap(category => category.issues)
      .filter(issue => issue.severity === 'error');

    if (criticalIssues.length > 0) {
      console.log('\n🚨 Критические проблемы, требующие немедленного внимания:');
      criticalIssues.slice(0, 5).forEach((issue, index) => {
        console.log(`  ${index + 1}. ${issue.message}`);
      });
    }

    // Проверка достижения целевого уровня
    const targetLevel = 'middle';
    if (result.level === targetLevel || 
        (targetLevel === 'junior' && ['middle', 'senior'].includes(result.level)) ||
        (targetLevel === 'middle' && result.level === 'senior')) {
      console.log(`\n🎉 Поздравляем! Вы достигли уровня ${targetLevel.toUpperCase()}!`);
    } else {
      console.log(`\n📈 Продолжайте работать над достижением уровня ${targetLevel.toUpperCase()}`);
    }

  } catch (error) {
    console.error('❌ Ошибка при выполнении расширенной оценки:', error.message);
    console.error(error.stack);
  }
}

advancedAssessment();

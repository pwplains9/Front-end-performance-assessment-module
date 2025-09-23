const { assessProject } = require('frontend-performance-assessor');

async function runAssessment() {
  try {
    console.log('🔍 Запуск базовой оценки проекта...\n');
    
    // Базовая оценка с выводом в консоль
    const result = await assessProject({
      projectPath: './src',
      framework: 'auto', // Автоматическое определение фреймворка
      outputFormat: 'console'
    });

    console.log('\n📊 Результаты оценки:');
    console.log(`Общий балл: ${result.overallScore}/100`);
    console.log(`Уровень разработчика: ${result.level.toUpperCase()}`);
    console.log(`Количество файлов: ${result.fileResults.length}`);
    console.log(`Количество рекомендаций: ${result.recommendations.length}`);

  } catch (error) {
    console.error('❌ Ошибка при выполнении оценки:', error.message);
  }
}

runAssessment();

// vite.config.js - Интеграция с Vite
import { defineConfig } from 'vite';
import { assessProject } from 'frontend-performance-assessor';

const frontendAssessorPlugin = () => {
  return {
    name: 'frontend-assessor',
    async buildStart() {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Запуск оценки качества кода...');
        
        try {
          const result = await assessProject({
            projectPath: './src',
            framework: 'auto',
            outputFormat: 'console'
          });

          // Предупреждение при низком качестве кода
          if (result.overallScore < 70) {
            console.warn(`⚠️  Качество кода ниже рекомендуемого: ${result.overallScore}/100`);
          }

          // Генерация отчета при серьезных проблемах
          if (result.overallScore < 50) {
            await assessProject({
              projectPath: './src',
              framework: 'auto',
              outputFormat: 'html',
              outputPath: 'quality-report.html'
            });
            console.log('📄 Создан детальный отчет: quality-report.html');
          }
        } catch (error) {
          console.warn('⚠️  Не удалось выполнить оценку качества:', error.message);
        }
      }
    }
  };
};

export default defineConfig({
  plugins: [
    // Ваши другие плагины
    frontendAssessorPlugin()
  ],
  // Остальная конфигурация Vite
});

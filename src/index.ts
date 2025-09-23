export { FrontendAssessor } from './core/assessor';
export { ConsoleReporter } from './reporters/console-reporter';
export { HtmlReporter } from './reporters/html-reporter';
export { JsonReporter } from './reporters/json-reporter';
export { FrameworkDetector } from './utils/framework-detector';
export { LevelEvaluator } from './utils/level-evaluator';

export * from './types';
export { i18n, SupportedLanguage } from './i18n';

// Convenience function for quick assessment
export async function assessProject(config: {
  projectPath: string;
  framework?: 'vue' | 'react' | 'vanilla' | 'auto';
  outputFormat?: 'console' | 'html' | 'json' | 'all';
  outputPath?: string;
  language?: 'en' | 'ru' | 'ua';
}) {
  const { FrontendAssessor } = await import('./core/assessor');
  const { i18n } = await import('./i18n');

  // Set language if provided
  if (config.language) {
    i18n.setLanguage(config.language);
  }
  const { ConsoleReporter } = await import('./reporters/console-reporter');
  const { HtmlReporter } = await import('./reporters/html-reporter');
  const { JsonReporter } = await import('./reporters/json-reporter');

  const assessor = new FrontendAssessor({
    projectPath: config.projectPath,
    framework: config.framework || 'auto'
  });

  const result = await assessor.assess();

  // Output results based on format preference
  const outputFormat = config.outputFormat || 'console';
  
  if (outputFormat === 'console' || outputFormat === 'all') {
    const consoleReporter = new ConsoleReporter();
    consoleReporter.report(result);
  }

  if (outputFormat === 'html' || outputFormat === 'all') {
    const htmlReporter = new HtmlReporter();
    const htmlPath = config.outputPath ? 
      config.outputPath.replace(/\.[^.]+$/, '.html') : 
      'frontend-assessment-report.html';
    htmlReporter.generateReport(result, htmlPath);
  }

  if (outputFormat === 'json' || outputFormat === 'all') {
    const jsonReporter = new JsonReporter();
    const jsonPath = config.outputPath ? 
      config.outputPath.replace(/\.[^.]+$/, '.json') : 
      'frontend-assessment-report.json';
    jsonReporter.generateReport(result, jsonPath);
  }

  return result;
}

#!/usr/bin/env node

import { program } from 'commander';
import { existsSync } from 'fs';
import { resolve } from 'path';
import { assessProject } from './index';
import { i18n, SupportedLanguage } from './i18n';

// Set language from environment variable or default to English
const defaultLanguage = (process.env.FRONTEND_ASSESSOR_LANG as SupportedLanguage) || 'en';
i18n.setLanguage(defaultLanguage);

program
  .name('frontend-assessor')
  .description('Frontend developer performance assessment module')
  .version('1.0.0')
  .option('-l, --lang <language>', 'Set language (en|ru|ua)', defaultLanguage)
  .hook('preAction', (thisCommand) => {
    // Set language from global option before any command runs
    const opts = thisCommand.optsWithGlobals();
    if (opts.lang) {
      i18n.setLanguage(opts.lang as SupportedLanguage);
    }
  });

program
  .command('assess')
  .description('Run project assessment')
  .argument('<project-path>', 'Path to project for assessment')
  .option('-f, --framework <framework>', 'Project framework (vue|react|vanilla|auto)', 'auto')
  .option('-o, --output <format>', 'Output format (console|html|json|all)', 'console')
  .option('-p, --path <output-path>', 'Path to save report')
  .option('--level <level>', 'Target developer level (junior|middle|senior)')
  .option('--include <patterns...>', 'File patterns to include')
  .option('--exclude <patterns...>', 'File patterns to exclude')
  .action(async (projectPath: string, options: any) => {
    try {
      const resolvedPath = resolve(projectPath);
      
      if (!existsSync(resolvedPath)) {
        console.error(`❌ ${i18n.t('cli.messages.projectNotFound', { path: resolvedPath })}`);
        process.exit(1);
      }

      console.log(`🔍 ${i18n.t('assessment.starting', { path: resolvedPath })}`);
      console.log(`📊 ${i18n.t('assessment.framework', { framework: options.framework })}`);
      console.log(`📄 ${i18n.t('assessment.outputFormat', { format: options.output })}`);
      
      if (options.level) {
        console.log(`🎯 ${i18n.t('assessment.targetLevel', { level: options.level })}`);
      }

      const result = await assessProject({
        projectPath: resolvedPath,
        framework: options.framework,
        outputFormat: options.output,
        outputPath: options.path
      });

      console.log(`\n✅ ${i18n.t('assessment.completed', { score: result.overallScore, level: result.level.toUpperCase() })}`);

    } catch (error) {
      console.error(`❌ ${i18n.t('cli.messages.error')}`, error);
      process.exit(1);
    }
  });

program
  .command('init')
  .description('Create configuration file')
  .option('-f, --framework <framework>', 'Project framework', 'auto')
  .action(async (options: any) => {
    const { writeFileSync } = await import('fs');
    
    const config = {
      framework: options.framework,
      includePatterns: ['**/*.{js,jsx,ts,tsx,vue}'],
      excludePatterns: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/*.test.*',
        '**/*.spec.*'
      ],
      targetLevel: 'middle',
      customRules: []
    };

    writeFileSync('frontend-assessor.config.json', JSON.stringify(config, null, 2));
    console.log(`✅ ${i18n.t('cli.messages.configCreated')}`);
  });

program
  .command('rules')
  .description('Show available rules')
  .option('-c, --category <category>', 'Filter by category')
  .action(async (options: any) => {
    const rules = [
      { id: 'CQ001', category: i18n.t('categories.codeQuality'), name: 'Naming Conventions', description: 'Check naming conventions compliance' },
      { id: 'CQ002', category: i18n.t('categories.codeQuality'), name: 'Function Length', description: 'Check function length' },
      { id: 'CQ003', category: i18n.t('categories.codeQuality'), name: 'Cyclomatic Complexity', description: 'Check cyclomatic complexity' },
      { id: 'PERF001', category: i18n.t('categories.performance'), name: 'Bundle Size', description: 'Check file sizes' },
      { id: 'PERF002', category: i18n.t('categories.performance'), name: 'Lazy Loading', description: 'Check lazy loading usage' },
      { id: 'ARCH001', category: i18n.t('categories.architecture'), name: 'Separation of Concerns', description: 'Check separation of concerns' },
      { id: 'BP001', category: i18n.t('categories.bestPractices'), name: 'TypeScript Usage', description: 'Check TypeScript usage' },
      { id: 'MAINT001', category: i18n.t('categories.maintainability'), name: 'Documentation', description: 'Check code documentation' }
    ];

    const filteredRules = options.category 
      ? rules.filter(rule => rule.category.toLowerCase().includes(options.category.toLowerCase()))
      : rules;

    console.log(`📋 ${i18n.t('cli.messages.availableRules')}\n`);
    
    const categories = [...new Set(filteredRules.map(rule => rule.category))];
    
    categories.forEach(category => {
      console.log(`\n📂 ${category}:`);
      console.log('-'.repeat(category.length + 4));
      
      filteredRules
        .filter(rule => rule.category === category)
        .forEach(rule => {
          console.log(`  ${rule.id}: ${rule.name}`);
          console.log(`    ${rule.description}`);
        });
    });
  });

program
  .command('levels')
  .description('Show level criteria')
  .action(() => {
    console.log(`🎯 ${i18n.t('cli.messages.levelCriteria')}\n`);
    
    const levels = ['junior', 'middle', 'senior'] as const;
    const emojis = { junior: '🌱', middle: '🌿', senior: '🌳' };
    const minScores = { junior: '60+', middle: '75+', senior: '85+' };
    
    levels.forEach(level => {
      const levelData = i18n.t(`levels.${level}.name`);
      const criteria = i18n.tArray(`levels.${level}.criteria`);
      
      console.log(`${emojis[level]} ${levelData} (${minScores[level]} ${i18n.t('common.score').toLowerCase()}):`);
      criteria.forEach(criterion => {
        console.log(`  • ${criterion}`);
      });
      console.log('');
    });
  });

program
  .command('lang')
  .description('Show supported languages')
  .action(() => {
    console.log('🌍 Supported languages:\n');
    console.log('  en - English');
    console.log('  ru - Русский');
    console.log('  ua - Українська');
    console.log('\nSet language with: --lang <code> or FRONTEND_ASSESSOR_LANG environment variable');
  });

if (process.argv.length === 2) {
  program.help();
}

program.parse();
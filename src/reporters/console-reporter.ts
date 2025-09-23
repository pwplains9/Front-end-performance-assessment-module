import { AssessmentResult } from '../types';
import { i18n } from '../i18n';

export class ConsoleReporter {
  report(result: AssessmentResult): void {
    console.log(`\n🔍 ${i18n.t('report.title')}\n`);
    console.log('=' .repeat(50));
    
    this.printOverallScore(result);
    this.printCategoriesBreakdown(result);
    this.printTopIssues(result);
    this.printRecommendations(result);
    this.printSummary(result);
  }

  private printOverallScore(result: AssessmentResult): void {
    const levelEmoji = this.getLevelEmoji(result.level);
    const scoreColor = this.getScoreColor(result.overallScore);
    
    console.log(`📊 ${i18n.t('assessment.overallScore')}: ${scoreColor}${result.overallScore}/100${this.resetColor()}`);
    console.log(`🎯 ${i18n.t('assessment.developerLevel')}: ${levelEmoji} ${i18n.t(`levels.${result.level}.name`)}\n`);
  }

  private printCategoriesBreakdown(result: AssessmentResult): void {
    console.log(`📈 ${i18n.t('report.categoriesBreakdown')}:`);
    console.log('-'.repeat(30));
    
    Object.entries(result.categories).forEach(([category, categoryResult]) => {
      const bar = this.createProgressBar(categoryResult.percentage);
      const color = this.getScoreColor(categoryResult.percentage);
      
      console.log(`${this.formatCategoryName(category)}: ${color}${categoryResult.percentage}%${this.resetColor()} ${bar}`);
    });
    console.log('');
  }

  private printTopIssues(result: AssessmentResult): void {
    const allIssues = Object.values(result.categories)
      .flatMap(category => category.issues)
      .filter(issue => issue.severity === 'error')
      .slice(0, 5);

    if (allIssues.length > 0) {
      console.log(`🚨 ${i18n.t('report.topIssues')}:`);
      console.log('-'.repeat(30));
      
      allIssues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue.message}`);
        if (issue.rule.includes(':')) {
          const [ruleId, filePath] = issue.rule.split(':');
          console.log(`   📁 ${i18n.t('common.file')}: ${filePath}`);
          console.log(`   🔧 ${i18n.t('common.rule')}: ${ruleId}`);
        }
        console.log('');
      });
    }
  }

  private printRecommendations(result: AssessmentResult): void {
    if (result.recommendations.length > 0) {
      console.log(`💡 ${i18n.t('report.recommendations')}:`);
      console.log('-'.repeat(30));
      
      result.recommendations
        .filter(rec => rec.priority === 'high')
        .slice(0, 3)
        .forEach((rec, index) => {
          console.log(`${index + 1}. ${rec.title}`);
          console.log(`   ${rec.description}`);
          console.log('');
        });
    }
  }

  private printSummary(result: AssessmentResult): void {
    console.log(`📋 ${i18n.t('report.summary')}:`);
    console.log('-'.repeat(30));
    console.log(result.summary);
    console.log('\n' + '='.repeat(50));
  }

  private formatCategoryName(category: string): string {
    const translatedName = i18n.t(`categories.${category}`) || category;
    return translatedName.padEnd(15);
  }

  private createProgressBar(percentage: number): string {
    const barLength = 20;
    const filledLength = Math.round((percentage / 100) * barLength);
    const filled = '█'.repeat(filledLength);
    const empty = '░'.repeat(barLength - filledLength);
    return `[${filled}${empty}]`;
  }

  private getLevelEmoji(level: string): string {
    const emojis: Record<string, string> = {
      junior: '🌱',
      middle: '🌿',
      senior: '🌳'
    };
    return emojis[level] || '❓';
  }

  private getScoreColor(score: number): string {
    if (score >= 80) return '\x1b[32m'; // Green
    if (score >= 60) return '\x1b[33m'; // Yellow
    return '\x1b[31m'; // Red
  }

  private resetColor(): string {
    return '\x1b[0m';
  }
}

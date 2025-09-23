import { AssessmentResult } from '../types';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { i18n } from '../i18n';

export class HtmlReporter {
  generateReport(result: AssessmentResult, outputPath: string = 'frontend-assessment-report.html'): void {
    const html = this.generateHtml(result);
    writeFileSync(outputPath, html, 'utf-8');
    console.log(`📄 ${i18n.t('cli.messages.reportGenerated', { format: 'HTML', path: outputPath })}`);
  }

  private generateHtml(result: AssessmentResult): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${i18n.t('report.title')}</title>
    <style>
        ${this.getStyles()}
    </style>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>🔍 ${i18n.t('report.title')}</h1>
            <div class="overall-score">
                <div class="score-circle ${this.getScoreClass(result.overallScore)}">
                    <span class="score-number">${result.overallScore}</span>
                    <span class="score-label">/ 100</span>
                </div>
                <div class="level-badge level-${result.level}">
                    ${this.getLevelEmoji(result.level)} ${result.level.toUpperCase()}
                </div>
            </div>
        </header>

        <section class="categories">
            <h2>📈 ${i18n.t('report.categoriesBreakdown')}</h2>
            <div class="categories-grid">
                ${this.generateCategoriesHtml(result.categories)}
            </div>
            <div class="chart-container">
                <canvas id="categoriesChart"></canvas>
            </div>
        </section>

        <section class="issues">
            <h2>🚨 ${i18n.t('report.issuesOverview')}</h2>
            ${this.generateIssuesHtml(result)}
        </section>

        <section class="files">
            <h2>📁 ${i18n.t('report.fileAnalysis')}</h2>
            ${this.generateFilesHtml(result.fileResults)}
        </section>

        <section class="recommendations">
            <h2>💡 ${i18n.t('report.recommendations')}</h2>
            ${this.generateRecommendationsHtml(result.recommendations)}
        </section>

        <section class="summary">
            <h2>📋 ${i18n.t('report.summary')}</h2>
            <div class="summary-content">
                <pre>${result.summary}</pre>
            </div>
        </section>
    </div>

    <script>
        ${this.generateChartScript(result)}
    </script>
</body>
</html>`;
  }

  private getStyles(): string {
    return `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background: white;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .header h1 {
            color: #2d3748;
            font-size: 2rem;
            margin-bottom: 10px;
        }

        .overall-score {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .score-circle {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            position: relative;
        }

        .score-circle.excellent { background: linear-gradient(45deg, #48bb78, #38a169); }
        .score-circle.good { background: linear-gradient(45deg, #ed8936, #dd6b20); }
        .score-circle.poor { background: linear-gradient(45deg, #f56565, #e53e3e); }

        .score-number {
            font-size: 2.5rem;
            line-height: 1;
        }

        .score-label {
            font-size: 0.9rem;
            opacity: 0.8;
        }

        .level-badge {
            padding: 12px 24px;
            border-radius: 25px;
            font-weight: bold;
            color: white;
            font-size: 1.1rem;
        }

        .level-junior { background: linear-gradient(45deg, #4299e1, #3182ce); }
        .level-middle { background: linear-gradient(45deg, #ed8936, #dd6b20); }
        .level-senior { background: linear-gradient(45deg, #48bb78, #38a169); }

        section {
            background: white;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        h2 {
            color: #2d3748;
            margin-bottom: 20px;
            font-size: 1.5rem;
        }

        .categories-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .category-card {
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }

        .category-name {
            font-weight: bold;
            margin-bottom: 10px;
            color: #2d3748;
        }

        .category-score {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .progress-bar {
            width: 100%;
            height: 8px;
            background: #e2e8f0;
            border-radius: 4px;
            overflow: hidden;
        }

        .progress-fill {
            height: 100%;
            border-radius: 4px;
            transition: width 0.3s ease;
        }

        .chart-container {
            max-width: 600px;
            margin: 0 auto;
        }

        .issue-item {
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 8px;
            border-left: 4px solid;
        }

        .issue-error { 
            background: #fed7d7; 
            border-color: #f56565; 
        }

        .issue-warning { 
            background: #feebc8; 
            border-color: #ed8936; 
        }

        .issue-info { 
            background: #bee3f8; 
            border-color: #4299e1; 
        }

        .file-item {
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 8px;
            background: #f7fafc;
            border: 1px solid #e2e8f0;
        }

        .file-path {
            font-weight: bold;
            color: #2d3748;
            margin-bottom: 5px;
        }

        .file-score {
            color: #4a5568;
        }

        .recommendation-item {
            padding: 20px;
            margin-bottom: 15px;
            border-radius: 8px;
            background: #f0fff4;
            border: 1px solid #9ae6b4;
        }

        .recommendation-title {
            font-weight: bold;
            color: #2f855a;
            margin-bottom: 10px;
        }

        .priority-high { border-color: #f56565; background: #fed7d7; }
        .priority-medium { border-color: #ed8936; background: #feebc8; }
        .priority-low { border-color: #4299e1; background: #bee3f8; }

        .summary-content {
            background: #f7fafc;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }

        .summary-content pre {
            white-space: pre-wrap;
            font-family: inherit;
        }

        @media (max-width: 768px) {
            .header {
                flex-direction: column;
                text-align: center;
                gap: 20px;
            }

            .categories-grid {
                grid-template-columns: 1fr;
            }
        }
    `;
  }

  private generateCategoriesHtml(categories: AssessmentResult['categories']): string {
    return Object.entries(categories).map(([category, result]) => {
      const colorClass = this.getScoreClass(result.percentage);
      return `
        <div class="category-card">
            <div class="category-name">${this.formatCategoryName(category)}</div>
            <div class="category-score ${colorClass}">${result.percentage}%</div>
            <div class="progress-bar">
                <div class="progress-fill ${colorClass}" style="width: ${result.percentage}%"></div>
            </div>
            <div style="margin-top: 10px; color: #666; font-size: 0.9rem;">
                ${result.issues.length} issues found
            </div>
        </div>
      `;
    }).join('');
  }

  private generateIssuesHtml(result: AssessmentResult): string {
    const allIssues = Object.values(result.categories)
      .flatMap(category => category.issues)
      .slice(0, 10);

    if (allIssues.length === 0) {
      return `<p>🎉 ${i18n.t('report.noIssuesFound')}</p>`;
    }

    return allIssues.map(issue => `
      <div class="issue-item issue-${issue.severity}">
        <strong>${i18n.t(`common.${issue.severity}`)}:</strong> ${issue.message}
        ${issue.rule.includes(':') ? `<br><small>📁 ${issue.rule.split(':')[1]} | 🔧 ${issue.rule.split(':')[0]}</small>` : ''}
      </div>
    `).join('');
  }

  private generateFilesHtml(fileResults: AssessmentResult['fileResults']): string {
    return fileResults.slice(0, 20).map(file => `
      <div class="file-item">
        <div class="file-path">📄 ${file.path}</div>
        <div class="file-score">${i18n.t('common.score')}: ${file.score}/100 | ${i18n.t('common.issues')}: ${file.issues.length}</div>
        ${file.suggestions.length > 0 ? `
          <div style="margin-top: 10px;">
            <strong>${i18n.t('common.suggestions')}:</strong>
            <ul style="margin-left: 20px; margin-top: 5px;">
              ${file.suggestions.map(s => `<li>${s}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `).join('');
  }

  private generateRecommendationsHtml(recommendations: AssessmentResult['recommendations']): string {
    if (recommendations.length === 0) {
      return `<p>🎉 ${i18n.t('report.noIssuesFound')}</p>`;
    }

    return recommendations.map(rec => `
      <div class="recommendation-item priority-${rec.priority}">
        <div class="recommendation-title">${rec.title}</div>
        <div>${rec.description}</div>
        ${rec.examples && rec.examples.length > 0 ? `
          <div style="margin-top: 10px;">
            <strong>${i18n.t('common.examples')}:</strong>
            <ul style="margin-left: 20px; margin-top: 5px;">
              ${rec.examples.map(ex => `<li>${ex}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `).join('');
  }

  private generateChartScript(result: AssessmentResult): string {
    const categories = Object.keys(result.categories);
    const scores = Object.values(result.categories).map(c => c.percentage);

    return `
      const ctx = document.getElementById('categoriesChart').getContext('2d');
      new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ${JSON.stringify(categories.map(c => this.formatCategoryName(c)))},
          datasets: [{
            label: 'Score',
            data: ${JSON.stringify(scores)},
            backgroundColor: 'rgba(102, 126, 234, 0.2)',
            borderColor: 'rgba(102, 126, 234, 1)',
            pointBackgroundColor: 'rgba(102, 126, 234, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(102, 126, 234, 1)'
          }]
        },
        options: {
          responsive: true,
          scales: {
            r: {
              beginAtZero: true,
              max: 100,
              ticks: {
                stepSize: 20
              }
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    `;
  }

  private formatCategoryName(category: string): string {
    const names: Record<string, string> = {
      codeQuality: 'Code Quality',
      performance: 'Performance',
      architecture: 'Architecture',
      bestPractices: 'Best Practices',
      maintainability: 'Maintainability'
    };
    return names[category] || category;
  }

  private getScoreClass(score: number): string {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    return 'poor';
  }

  private getLevelEmoji(level: string): string {
    const emojis: Record<string, string> = {
      junior: '🌱',
      middle: '🌿',
      senior: '🌳'
    };
    return emojis[level] || '❓';
  }
}

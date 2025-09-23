import { AssessmentResult } from '../types';
import { writeFileSync } from 'fs';

export class JsonReporter {
  generateReport(result: AssessmentResult, outputPath: string = 'frontend-assessment-report.json'): void {
    const jsonReport = this.generateJson(result);
    writeFileSync(outputPath, JSON.stringify(jsonReport, null, 2), 'utf-8');
    console.log(`📄 JSON report generated: ${outputPath}`);
  }

  private generateJson(result: AssessmentResult): any {
    return {
      meta: {
        generatedAt: new Date().toISOString(),
        version: '1.0.0',
        tool: 'frontend-performance-assessor'
      },
      assessment: {
        overallScore: result.overallScore,
        level: result.level,
        summary: result.summary
      },
      categories: Object.entries(result.categories).map(([name, category]) => ({
        name,
        score: category.score,
        maxScore: category.maxScore,
        percentage: category.percentage,
        issuesCount: category.issues.length,
        issues: category.issues.map(issue => ({
          rule: issue.rule,
          severity: issue.severity,
          message: issue.message,
          location: issue.line ? {
            line: issue.line,
            column: issue.column
          } : undefined
        }))
      })),
      files: result.fileResults.map(file => ({
        path: file.path,
        score: file.score,
        issuesCount: file.issues.length,
        issues: file.issues,
        suggestions: file.suggestions
      })),
      recommendations: result.recommendations.map(rec => ({
        category: rec.category,
        priority: rec.priority,
        title: rec.title,
        description: rec.description,
        examples: rec.examples || []
      })),
      statistics: this.generateStatistics(result)
    };
  }

  private generateStatistics(result: AssessmentResult): any {
    const allIssues = Object.values(result.categories).flatMap(c => c.issues);
    const severityCounts = {
      error: allIssues.filter(i => i.severity === 'error').length,
      warning: allIssues.filter(i => i.severity === 'warning').length,
      info: allIssues.filter(i => i.severity === 'info').length
    };

    const categoryScores = Object.entries(result.categories).reduce((acc, [name, category]) => {
      acc[name] = category.percentage;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalFiles: result.fileResults.length,
      totalIssues: allIssues.length,
      severityBreakdown: severityCounts,
      categoryScores,
      averageFileScore: Math.round(
        result.fileResults.reduce((sum, file) => sum + file.score, 0) / result.fileResults.length
      ),
      recommendationsCount: result.recommendations.length,
      highPriorityRecommendations: result.recommendations.filter(r => r.priority === 'high').length
    };
  }
}

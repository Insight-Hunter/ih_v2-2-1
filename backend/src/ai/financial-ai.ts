import { Ai } from '@cloudflare/ai';

export class FinancialAI {
  constructor(private ai: Ai) {}

  async generateInsights(financialData: any) {
    const prompt = `
      Analyze the following financial data and provide actionable insights:
      
      Income: $${financialData.income}
      Expenses: $${financialData.expenses}
      Categories: ${JSON.stringify(financialData.categories)}
      Trends: ${JSON.stringify(financialData.trends)}
      
      Provide 3-5 specific, actionable recommendations for improving financial health.
    `;

    const response = await this.ai.run('@cf/meta/llama-2-7b-chat-int8', {
      messages: [
        { role: 'system', content: 'You are a financial advisor AI providing insights for small businesses.' },
        { role: 'user', content: prompt }
      ]
    });

    return this.parseInsights(response.response);
  }

  async forecastRevenue(historicalData: any[], months: number = 6) {
    const prompt = `
      Based on this historical revenue data: ${JSON.stringify(historicalData)}
      Generate a ${months}-month revenue forecast with confidence intervals.
      Include seasonal patterns and growth trends.
    `;

    const response = await this.ai.run('@cf/meta/llama-2-7b-chat-int8', {
      messages: [
        { role: 'system', content: 'You are a financial forecasting AI specialist.' },
        { role: 'user', content: prompt }
      ]
    });

    return this.parseForecast(response.response);
  }

  async detectAnomalies(transactions: any[]) {
    const recentTransactions = transactions.slice(0, 100);
    
    const prompt = `
      Analyze these recent transactions for unusual patterns or anomalies:
      ${JSON.stringify(recentTransactions)}
      
      Flag any suspicious transactions, unusual spending patterns, or potential fraud.
    `;

    const response = await this.ai.run('@cf/meta/llama-2-7b-chat-int8', {
      messages: [
        { role: 'system', content: 'You are a financial fraud detection AI.' },
        { role: 'user', content: prompt }
      ]
    });

    return this.parseAnomalies(response.response);
  }

  async generateBudgetRecommendations(income: number, expenses: any[], goals: any[]) {
    const prompt = `
      Create a detailed budget recommendation:
      Monthly Income: $${income}
      Current Expenses: ${JSON.stringify(expenses)}
      Financial Goals: ${JSON.stringify(goals)}
      
      Provide specific budget allocations and savings strategies.
    `;

    const response = await this.ai.run('@cf/meta/llama-2-7b-chat-int8', {
      messages: [
        { role: 'system', content: 'You are a budget planning AI advisor.' },
        { role: 'user', content: prompt }
      ]
    });

    return this.parseBudgetRecommendations(response.response);
  }

  private parseInsights(aiResponse: string) {
    try {
      const lines = aiResponse.split('\n').filter(line => line.trim());
      return lines.map((line, index) => ({
        id: index + 1,
        type: this.categorizeInsight(line),
        title: this.extractTitle(line),
        description: line,
        priority: this.assessPriority(line),
        actionable: true
      }));
    } catch (error) {
      return [{
        id: 1,
        type: 'info',
        title: 'AI Analysis Complete',
        description: aiResponse,
        priority: 'medium',
        actionable: false
      }];
    }
  }

  private parseForecast(aiResponse: string) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => ({
      month,
      predicted: this.extractNumber(aiResponse) * (1 + Math.random() * 0.2),
      confidence: Math.max(60, 90 - index * 5),
      trend: index < 3 ? 'up' : 'stable'
    }));
  }

  private parseAnomalies(aiResponse: string) {
    return [{
      type: 'anomaly',
      severity: 'medium',
      description: aiResponse.slice(0, 200),
      affectedTransactions: [],
      recommendation: 'Review flagged transactions for accuracy'
    }];
  }

  private parseBudgetRecommendations(aiResponse: string) {
    return {
      totalBudget: 0,
      categories: [],
      savingsTarget: 0,
      recommendations: aiResponse.split('\n').filter(line => line.trim())
    };
  }

  private categorizeInsight(text: string): string {
    if (text.toLowerCase().includes('warning') || text.toLowerCase().includes('alert')) return 'warning';
    if (text.toLowerCase().includes('opportunity') || text.toLowerCase().includes('improve')) return 'success';
    return 'info';
  }

  private extractTitle(text: string): string {
    return text.split('.')[0].slice(0, 50) + (text.length > 50 ? '...' : '');
  }

  private assessPriority(text: string): string {
    if (text.toLowerCase().includes('urgent') || text.toLowerCase().includes('critical')) return 'high';
    if (text.toLowerCase().includes('important') || text.toLowerCase().includes('should')) return 'medium';
    return 'low';
  }

  private extractNumber(text: string): number {
    const match = text.match(/\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/);
    return match ? parseFloat(match[1].replace(/,/g, '')) : 25000;
  }
}

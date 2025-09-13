// Simple Financial AI service without OpenAI dependency for now
class FinancialAI {
  constructor(apiKey = null) {
    this.apiKey = apiKey;
    console.log('FinancialAI initialized', apiKey ? 'with API key' : 'without API key');
  }

  async generateInsights(financialData) {
    // For now, return smart fallback insights
    const insights = [];
    const { income = 0, expenses = 0, categories = {} } = financialData;

    if (expenses > income) {
      insights.push({
        id: 1,
        type: 'warning',
        title: 'Expenses Exceed Income',
        description: `You're spending $${expenses - income} more than you earn. Consider reviewing discretionary spending.`,
        priority: 'high',
        actionable: true
      });
    }

    if (income > 0) {
      const savingsRate = ((income - expenses) / income) * 100;
      if (savingsRate < 10) {
        insights.push({
          id: 2,
          type: 'info',
          title: 'Low Savings Rate',
          description: `Your savings rate is ${savingsRate.toFixed(1)}%. Aim for 15-20% of income.`,
          priority: 'medium',
          actionable: true
        });
      } else if (savingsRate > 20) {
        insights.push({
          id: 2,
          type: 'success',
          title: 'Excellent Savings Rate',
          description: `Your savings rate of ${savingsRate.toFixed(1)}% is outstanding! Keep it up.`,
          priority: 'low',
          actionable: false
        });
      }
    }

    // Category-specific insights
    const totalCategorySpending = Object.values(categories).reduce((sum, val) => sum + val, 0);
    if (totalCategorySpending > 0) {
      const foodSpending = categories.food || 0;
      if (foodSpending / totalCategorySpending > 0.3) {
        insights.push({
          id: 3,
          type: 'info',
          title: 'High Food Spending',
          description: 'Food represents over 30% of your spending. Consider meal planning to reduce costs.',
          priority: 'medium',
          actionable: true
        });
      }
    }

    insights.push({
      id: 4,
      type: 'success',
      title: 'Financial Health Check',
      description: 'Continue tracking your expenses to identify trends and opportunities for improvement.',
      priority: 'low',
      actionable: true
    });

    return insights;
  }

  async forecastRevenue(historicalData, months = 6) {
    const baseAmount = historicalData && historicalData.length > 0 
      ? historicalData.reduce((sum, item) => sum + (item.amount || 0), 0) / historicalData.length
      : 25000;

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    return Array.from({ length: months }, (_, index) => {
      const monthIndex = (currentMonth + index + 1) % 12;
      const seasonalMultiplier = 1 + (Math.sin((monthIndex / 12) * 2 * Math.PI) * 0.1);
      const trendMultiplier = 1 + (index * 0.02); // 2% growth per month
      const variance = (Math.random() - 0.5) * 0.1; // ±5% random variance
      
      return {
        month: monthNames[monthIndex],
        predicted: Math.round(baseAmount * seasonalMultiplier * trendMultiplier * (1 + variance)),
        confidence: Math.max(60, 90 - index * 5),
        trend: index < months/2 ? 'up' : 'stable'
      };
    });
  }

  async detectAnomalies(transactions) {
    const anomalies = [];
    
    if (!transactions || transactions.length === 0) {
      return anomalies;
    }

    // Simple anomaly detection logic
    const amounts = transactions.map(t => t.amount || 0);
    const avgAmount = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length;
    const threshold = avgAmount * 3; // 3x average is anomalous

    transactions.forEach((transaction, index) => {
      if (transaction.amount > threshold) {
        anomalies.push({
          type: 'high_amount',
          severity: 'medium',
          description: `Transaction of $${transaction.amount} is significantly higher than average ($${avgAmount.toFixed(2)})`,
          affectedTransactions: [transaction.id || index],
          recommendation: 'Review this large transaction for accuracy'
        });
      }
    });

    return anomalies;
  }

  async generateBudgetRecommendations(income, expenses, goals) {
    const recommendations = {
      totalBudget: income,
      categories: [
        { name: 'Housing', allocated: income * 0.30, current: 0, recommendation: '25-30% of income' },
        { name: 'Food', allocated: income * 0.15, current: 0, recommendation: '10-15% of income' },
        { name: 'Transportation', allocated: income * 0.15, current: 0, recommendation: '10-15% of income' },
        { name: 'Savings', allocated: income * 0.20, current: 0, recommendation: '20% of income minimum' },
        { name: 'Entertainment', allocated: income * 0.10, current: 0, recommendation: '5-10% of income' },
        { name: 'Other', allocated: income * 0.10, current: 0, recommendation: 'Miscellaneous expenses' }
      ],
      savingsTarget: income * 0.20,
      tips: [
        'Follow the 50/30/20 rule: 50% needs, 30% wants, 20% savings',
        'Review and adjust your budget monthly based on actual spending',
        'Automate savings to reach your financial goals',
        'Track all expenses to identify spending patterns'
      ]
    };

    return recommendations;
  }

  async categorizTransaction(description, amount) {
    const desc = (description || '').toLowerCase();
    
    // Simple keyword-based categorization
    if (desc.includes('grocery') || desc.includes('supermarket') || desc.includes('food')) {
      return { category: 'Food & Dining', subcategory: 'Groceries', confidence: 0.8, businessExpense: false };
    }
    if (desc.includes('gas') || desc.includes('fuel') || desc.includes('uber') || desc.includes('taxi')) {
      return { category: 'Transportation', subcategory: 'Fuel', confidence: 0.8, businessExpense: false };
    }
    if (desc.includes('amazon') || desc.includes('store') || desc.includes('shop')) {
      return { category: 'Shopping', subcategory: 'General', confidence: 0.7, businessExpense: false };
    }
    if (desc.includes('restaurant') || desc.includes('cafe') || desc.includes('dining')) {
      return { category: 'Food & Dining', subcategory: 'Restaurants', confidence: 0.8, businessExpense: false };
    }
    if (desc.includes('electric') || desc.includes('water') || desc.includes('utility')) {
      return { category: 'Bills & Utilities', subcategory: 'Utilities', confidence: 0.9, businessExpense: false };
    }
    
    return { category: 'Other', subcategory: 'Uncategorized', confidence: 0.5, businessExpense: false };
  }
}

module.exports = { FinancialAI };

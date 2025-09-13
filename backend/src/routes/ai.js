const express = require('express');
const { FinancialAI } = require('../ai/financial-ai');

const router = express.Router();
const aiService = new FinancialAI();

// Generate financial insights
router.post('/insights', async (req, res) => {
  try {
    const { income, expenses, categories, trends } = req.body;
    
    const insights = await aiService.generateInsights({
      income: parseFloat(income) || 0,
      expenses: parseFloat(expenses) || 0,
      categories: categories || {},
      trends: trends || {}
    });

    res.json({
      success: true,
      insights,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Insights generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate insights',
      message: error.message
    });
  }
});

// Revenue forecast
router.post('/forecast', async (req, res) => {
  try {
    const { historicalData, months } = req.body;
    
    const forecast = await aiService.forecastRevenue(
      historicalData || [], 
      parseInt(months) || 6
    );

    res.json({
      success: true,
      forecast,
      period: `${months || 6} months`,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Forecast generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate forecast'
    });
  }
});

// Anomaly detection
router.post('/anomalies', async (req, res) => {
  try {
    const { transactions } = req.body;
    
    const anomalies = await aiService.detectAnomalies(transactions || []);

    res.json({
      success: true,
      anomalies,
      analyzed: (transactions || []).length,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Anomaly detection error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to detect anomalies'
    });
  }
});

// Budget recommendations
router.post('/budget', async (req, res) => {
  try {
    const { income, expenses, goals } = req.body;
    
    const recommendations = await aiService.generateBudgetRecommendations(
      parseFloat(income) || 0, 
      expenses || [], 
      goals || []
    );

    res.json({
      success: true,
      recommendations,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Budget recommendations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate budget recommendations'
    });
  }
});

// Transaction categorization
router.post('/categorize', async (req, res) => {
  try {
    const { description, amount } = req.body;
    
    if (!description) {
      return res.status(400).json({
        success: false,
        error: 'Description is required'
      });
    }
    
    const categorization = await aiService.categorizTransaction(
      description, 
      parseFloat(amount) || 0
    );

    res.json({
      success: true,
      categorization,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Categorization error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to categorize transaction'
    });
  }
});

// Health check for AI services
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'AI services operational',
    features: [
      'Financial Insights',
      'Revenue Forecasting', 
      'Anomaly Detection',
      'Budget Recommendations',
      'Transaction Categorization'
    ],
    mode: 'Smart Fallbacks',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;

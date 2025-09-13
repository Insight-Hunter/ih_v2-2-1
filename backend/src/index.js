const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8787;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors());

// Routes
const aiRoutes = require('./routes/ai');
app.use('/api/ai', aiRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Insight Hunter API v1.0.0',
    status: 'running',
    features: [
      'AI Financial Insights',
      'Revenue Forecasting',
      'Anomaly Detection', 
      'Budget Recommendations',
      'Transaction Categorization'
    ],
    endpoints: {
      insights: 'POST /api/ai/insights',
      forecast: 'POST /api/ai/forecast',
      anomalies: 'POST /api/ai/anomalies', 
      budget: 'POST /api/ai/budget',
      categorize: 'POST /api/ai/categorize',
      health: 'GET /api/ai/health'
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

app.listen(port, () => {
  console.log(`🚀 Insight Hunter API with AI features running on port ${port}`);
  console.log(`🤖 AI Features: ${process.env.OPENAI_API_KEY ? 'Enabled' : 'Using Fallbacks'}`);
});

module.exports = app;

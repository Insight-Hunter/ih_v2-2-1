#!/bin/bash

# Insight Hunter - Complete Repository Setup Script with Advanced Features
# This script creates the entire project structure with AI, integrations, and mobile support

set -e  # Exit on any error

echo "🚀 Setting up Insight Hunter Auto-CFO Platform with Advanced Features..."
echo "================================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}Initializing Git repository...${NC}"
    git init
fi

echo -e "${BLUE}Creating advanced project structure...${NC}"

# Create comprehensive directory structure
mkdir -p {backend/{src/{middleware,routes,database,services,utils,integrations,ai},scripts},frontend/{src/{components/{common,auth,dashboard,transactions,analytics,reports,onboarding,mobile},pages,hooks,services,store,utils,styles,types,ai},public},docs/{api,deployment,user-guide,development},scripts,.github/workflows}

# ==========================================
# BACKEND FILES WITH ADVANCED FEATURES
# ==========================================

echo -e "${PURPLE}Creating advanced backend with AI and integrations...${NC}"

# Enhanced backend package.json with AI and integration dependencies
cat > backend/package.json << 'EOF'
{
  "name": "insight-hunter-api",
  "version": "1.0.0",
  "description": "AI-Powered Auto-CFO Platform API",
  "main": "src/index.ts",
  "scripts": {
    "dev": "wrangler dev --port 8787",
    "deploy": "wrangler publish",
    "deploy:staging": "wrangler publish --env development",
    "deploy:production": "wrangler publish --env production",
    "db:create": "wrangler d1 create insight-hunter-db",
    "db:migrate": "wrangler d1 execute insight-hunter-db --file=database/migrations/001_initial.sql",
    "db:migrate:prod": "wrangler d1 execute insight-hunter-db --env=production --file=database/migrations/001_initial.sql",
    "db:backup": "wrangler d1 export insight-hunter-db --output=backup.sql",
    "db:seed": "node scripts/seed-data.js",
    "logs": "wrangler tail insight-hunter-api",
    "test": "jest",
    "test:watch": "jest --watch",
    "typecheck": "tsc --noEmit",
    "ai:train": "node scripts/train-ai-models.js"
  },
  "dependencies": {
    "itty-router": "^4.0.13",
    "bcryptjs": "^2.4.3",
    "@ai-sdk/openai": "^0.0.15",
    "plaid": "^11.0.0",
    "quickbooks-node": "^2.0.3",
    "node-cron": "^3.0.2",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.2",
    "@types/node": "^20.8.0",
    "@types/node-cron": "^3.0.8",
    "@types/jest": "^29.5.5",
    "@cloudflare/workers-types": "^4.20230914.0",
    "jest": "^29.7.0",
    "typescript": "^5.2.2",
    "wrangler": "^3.10.1"
  }
}
EOF

# Enhanced wrangler.toml with AI and integration bindings
cat > backend/wrangler.toml << 'EOF'
name = "insight-hunter-api"
compatibility_date = "2024-01-15"
main = "src/index.ts"

[env.development]
name = "insight-hunter-api-dev"

[env.production]
name = "insight-hunter-api-prod"

[[d1_databases]]
binding = "DB"
database_name = "insight-hunter-db"
database_id = "your-database-id-here"

[[kv_namespaces]]
binding = "CACHE"
id = "your-kv-namespace-id"

[[r2_buckets]]
binding = "DOCUMENTS"
bucket_name = "insight-hunter-docs"

[ai]
binding = "AI"

[vars]
JWT_SECRET = "your-super-secret-jwt-key-change-this-in-production"
ENVIRONMENT = "development"
OPENAI_API_KEY = "your-openai-api-key"
PLAID_CLIENT_ID = "your-plaid-client-id"
PLAID_SECRET = "your-plaid-secret-key"
PLAID_ENV = "sandbox"
QUICKBOOKS_CLIENT_ID = "your-qb-client-id"
QUICKBOOKS_CLIENT_SECRET = "your-qb-client-secret"
EOF

# Backend TypeScript Configuration
cat > backend/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020"],
    "module": "CommonJS",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "types": ["@cloudflare/workers-types", "jest"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
EOF

# Main backend entry point
cat > backend/src/index.ts << 'EOF'
import { Router } from 'itty-router';
import { corsHeaders } from './middleware/cors';
import authRoutes from './routes/auth';
import transactionRoutes from './routes/transactions';
import analyticsRoutes from './routes/analytics';
import integrationRoutes from './routes/integrations';
import aiRoutes from './routes/ai';

const router = Router();

// Health check
router.get('/', () => new Response('Insight Hunter API v1.0.0', { headers: corsHeaders }));

// Routes
router.all('/api/auth/*', authRoutes);
router.all('/api/transactions/*', transactionRoutes);
router.all('/api/analytics/*', analyticsRoutes);
router.all('/api/integrations/*', integrationRoutes);
router.all('/api/ai/*', aiRoutes);

// CORS preflight
router.options('*', () => new Response(null, { headers: corsHeaders }));

// 404 handler
router.all('*', () => new Response('Not Found', { status: 404, headers: corsHeaders }));

export default {
  fetch: router.handle
};
EOF

# CORS Middleware
cat > backend/src/middleware/cors.ts << 'EOF'
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS,PUT,DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

export function addCorsHeaders(response: Response): Response {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}
EOF

# AI Services - Financial Analysis and Insights
cat > backend/src/ai/financial-ai.ts << 'EOF'
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
EOF

# Bank Integration Service (Plaid)
cat > backend/src/integrations/plaid-service.ts << 'EOF'
import { PlaidApi, Configuration, PlaidEnvironments, AccountsGetRequest, TransactionsGetRequest } from 'plaid';

export class PlaidService {
  private client: PlaidApi;

  constructor(clientId: string, secret: string, env: string = 'sandbox') {
    const configuration = new Configuration({
      basePath: env === 'production' ? PlaidEnvironments.production : PlaidEnvironments.sandbox,
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': clientId,
          'PLAID-SECRET': secret,
        },
      },
    });
    this.client = new PlaidApi(configuration);
  }

  async createLinkToken(userId: string) {
    try {
      const request = {
        user: { client_user_id: userId },
        client_name: 'Insight Hunter',
        products: ['transactions', 'accounts'],
        country_codes: ['US'],
        language: 'en',
      };

      const response = await this.client.linkTokenCreate(request);
      return response.data.link_token;
    } catch (error) {
      console.error('Error creating link token:', error);
      throw new Error('Failed to create bank connection');
    }
  }

  async exchangePublicToken(publicToken: string) {
    try {
      const request = { public_token: publicToken };
      const response = await this.client.itemPublicTokenExchange(request);
      return response.data.access_token;
    } catch (error) {
      console.error('Error exchanging token:', error);
      throw new Error('Failed to establish bank connection');
    }
  }

  async getAccounts(accessToken: string) {
    try {
      const request: AccountsGetRequest = { access_token: accessToken };
      const response = await this.client.accountsGet(request);
      
      return response.data.accounts.map(account => ({
        id: account.account_id,
        name: account.name,
        type: account.type,
        subtype: account.subtype,
        balance: account.balances.current,
        currency: account.balances.iso_currency_code || 'USD'
      }));
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw new Error('Failed to fetch account information');
    }
  }

  async getTransactions(accessToken: string, startDate: string, endDate: string) {
    try {
      const request: TransactionsGetRequest = {
        access_token: accessToken,
        start_date: startDate,
        end_date: endDate,
        count: 500
      };

      const response = await this.client.transactionsGet(request);
      
      return response.data.transactions.map(transaction => ({
        id: transaction.transaction_id,
        accountId: transaction.account_id,
        amount: Math.abs(transaction.amount),
        type: transaction.amount > 0 ? 'expense' : 'income',
        description: transaction.name,
        date: transaction.date,
        category: transaction.category?.[0] || 'Other',
        merchant: transaction.merchant_name,
        pending: transaction.pending
      }));
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw new Error('Failed to fetch transactions');
    }
  }

  async syncTransactions(accessToken: string, lastSync?: string) {
    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = lastSync || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      return await this.getTransactions(accessToken, startDate, endDate);
    } catch (error) {
      console.error('Error syncing transactions:', error);
      throw new Error('Failed to sync transactions');
    }
  }
}
EOF

# Database Schema
cat > backend/database/migrations/001_initial.sql << 'EOF'
-- Users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    company_name TEXT,
    phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    subscription_tier TEXT DEFAULT 'free',
    onboarding_completed BOOLEAN DEFAULT FALSE
);

-- Accounts table (bank accounts, credit cards, etc.)
CREATE TABLE accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    external_id TEXT,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    subtype TEXT,
    balance DECIMAL(12, 2),
    currency TEXT DEFAULT 'USD',
    institution_name TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    plaid_access_token TEXT,
    quickbooks_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Transactions table
CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    account_id INTEGER,
    external_id TEXT,
    amount DECIMAL(12, 2) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    description TEXT,
    category TEXT,
    subcategory TEXT,
    merchant_name TEXT,
    date DATE NOT NULL,
    is_recurring BOOLEAN DEFAULT FALSE,
    is_pending BOOLEAN DEFAULT FALSE,
    tags TEXT, -- JSON array of tags
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES accounts (id) ON DELETE SET NULL
);

-- Financial goals table
CREATE TABLE financial_goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    target_amount DECIMAL(12, 2) NOT NULL,
    current_amount DECIMAL(12, 2) DEFAULT 0,
    target_date DATE,
    category TEXT,
    priority TEXT DEFAULT 'medium',
    is_achieved BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Budgets table
CREATE TABLE budgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    period TEXT DEFAULT 'monthly', -- monthly, weekly, yearly
    spent_amount DECIMAL(12, 2) DEFAULT 0,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- AI insights table
CREATE TABLE ai_insights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT DEFAULT 'medium',
    category TEXT,
    data TEXT, -- JSON data
    is_read BOOLEAN DEFAULT FALSE,
    is_dismissed BOOLEAN DEFAULT FALSE,
    expires_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Integrations table
CREATE TABLE integrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    provider TEXT NOT NULL, -- 'plaid', 'quickbooks', etc.
    access_token TEXT,
    refresh_token TEXT,
    expires_at DATETIME,
    company_id TEXT, -- For QuickBooks
    is_active BOOLEAN DEFAULT TRUE,
    last_sync DATETIME,
    sync_frequency INTEGER DEFAULT 24, -- hours
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_category ON transactions(category);
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_financial_goals_user_id ON financial_goals(user_id);
CREATE INDEX idx_ai_insights_user_id ON ai_insights(user_id);
CREATE INDEX idx_integrations_user_id ON integrations(user_id);
EOF

# ==========================================
# FRONTEND FILES WITH MOBILE AND ONBOARDING
# ==========================================

echo -e "${PURPLE}Creating advanced frontend with mobile support...${NC}"

# Enhanced frontend package.json
cat > frontend/package.json << 'EOF'
{
  "name": "insight-hunter-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/jest": "^27.5.2",
    "@types/node": "^16.18.58",
    "@types/react": "^18.2.28",
    "@types/react-dom": "^18.2.13",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "typescript": "^4.9.5",
    "web-vitals": "^2.1.4",
    "recharts": "^2.8.0",
    "react-router-dom": "^6.16.0",
    "axios": "^1.5.0",
    "@reduxjs/toolkit": "^1.9.7",
    "react-redux": "^8.1.3",
    "styled-components": "^6.1.0",
    "framer-motion": "^10.16.4",
    "react-hook-form": "^7.47.0",
    "@hookform/resolvers": "^3.3.2",
    "yup": "^1.3.3",
    "date-fns": "^2.30.0",
    "react-query": "^3.39.3",
    "react-hot-toast": "^2.4.1",
    "lucide-react": "^0.288.0",
    "tailwindcss": "^3.3.5",
    "react-plaid-link": "^3.3.2",
    "react-signature-canvas": "^1.0.6",
    "react-swipeable": "^7.0.1",
    "@capacitor/core": "^5.5.0",
    "@capacitor/ios": "^5.5.0",
    "@capacitor/android": "^5.5.0"
  },
  "devDependencies": {
    "@types/styled-components": "^5.1.26",
    "@capacitor/cli": "^5.5.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "build:mobile": "npm run build && npx cap sync",
    "mobile:ios": "npx cap open ios",
    "mobile:android": "npx cap open android",
    "mobile:run:ios": "npx cap run ios",
    "mobile:run:android": "npx cap run android"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
EOF

# Frontend TypeScript Configuration
cat > frontend/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "es6"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": "src",
    "paths": {
      "@/*": ["*"],
      "@/components/*": ["components/*"],
      "@/pages/*": ["pages/*"],
      "@/hooks/*": ["hooks/*"],
      "@/services/*": ["services/*"],
      "@/store/*": ["store/*"],
      "@/utils/*": ["utils/*"],
      "@/types/*": ["types/*"]
    }
  },
  "include": [
    "src"
  ]
}
EOF

# Main App Component with Mobile Support
cat > frontend/src/App.tsx << 'EOF'
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import { useAuthCheck } from './hooks/useAuth';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { MobileDetector } from './components/mobile/MobileDetector';

// Pages
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Onboarding from './pages/onboarding/Onboarding';

// Mobile Pages
import MobileDashboard from './pages/mobile/MobileDashboard';
import MobileTransactions from './pages/mobile/MobileTransactions';

import './styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AppContent() {
  const { isAuthenticated, user, isLoading } = useAuthCheck();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="App">
      <MobileDetector />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={!isAuthenticated ? <Landing /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/transactions" element={isAuthenticated ? <Transactions /> : <Navigate to="/login" />} />
        <Route path="/analytics" element={isAuthenticated ? <Analytics /> : <Navigate to="/login" />} />
        <Route path="/reports" element={isAuthenticated ? <Reports /> : <Navigate to="/login" />} />
        <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />
        
        {/* Onboarding */}
        <Route path="/onboarding" element={isAuthenticated && !user?.onboardingCompleted ? <Onboarding /> : <Navigate to="/dashboard" />} />
        
        {/* Mobile Routes */}
        <Route path="/mobile/dashboard" element={isAuthenticated ? <MobileDashboard /> : <Navigate to="/login" />} />
        <Route path="/mobile/transactions" element={isAuthenticated ? <MobileTransactions /> : <Navigate to="/login" />} />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toaster position="top-right" />
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AppContent />
        </Router>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
EOF

# Store Configuration
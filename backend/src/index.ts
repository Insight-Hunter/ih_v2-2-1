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

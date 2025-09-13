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

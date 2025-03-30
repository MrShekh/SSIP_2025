import React, { memo, lazy, Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AuthProvider } from './context/AuthContext';
import { EmployeeProvider } from './context/EmployeeContext';
import { useAuth } from './context/AuthContext';
import './App.css';

// Lazy load heavy components
const Layout = lazy(() => import('./components/layout/Layout'));
const AppRoutes = lazy(() => import('./routes/routes'));

// Simple loading component
const LoadingSpinner = () => (
  <div className="app-loading">
    <div className="loading-spinner"></div>
    <p>Loading...</p>
  </div>
);

// Optimize AppContent with memo
const AppContent = memo(() => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <AppRoutes />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Layout>
        <AppRoutes />
      </Layout>
    </Suspense>
  );
});

AppContent.displayName = 'AppContent';

function App() {
  return (
    <Router>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AuthProvider>
          <EmployeeProvider>
            <AppContent />
          </EmployeeProvider>
        </AuthProvider>
      </LocalizationProvider>
    </Router>
  );
}

export default App;

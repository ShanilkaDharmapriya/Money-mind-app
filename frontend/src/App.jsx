import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Goals from './pages/Goals';
import Layout from './components/Layout';
import { AuthProvider } from './contexts/AuthContext';
import { TransactionProvider } from './contexts/TransactionContext';
import { GoalProvider } from './contexts/GoalContext';
import Budgets from './pages/Budgets';
import { BudgetProvider } from './contexts/BudgetContext';
import { useState, useMemo } from 'react';
import { useAuth } from './contexts/AuthContext';
import Landing from './pages/Landing';

// Create theme instances for light and dark modes
const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#2196f3' : '#90caf9',
      light: mode === 'light' ? '#64b5f6' : '#e3f2fd',
      dark: mode === 'light' ? '#1976d2' : '#42a5f5',
    },
    secondary: {
      main: mode === 'light' ? '#9c27b0' : '#ce93d8',
      light: mode === 'light' ? '#ba68c8' : '#f3e5f5',
      dark: mode === 'light' ? '#7b1fa2' : '#ab47bc',
    },
    background: {
      default: mode === 'light' ? '#f8f9fa' : '#121212',
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
    },
    success: {
      main: mode === 'light' ? '#2e7d32' : '#66bb6a',
    },
    error: {
      main: mode === 'light' ? '#d32f2f' : '#ef5350',
    },
    warning: {
      main: mode === 'light' ? '#ed6c02' : '#ffa726',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'all 0.3s ease-in-out',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: '0 16px 16px 0',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(8px)',
          backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(18, 18, 18, 0.8)',
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: mode === 'light' ? [
    'none',
    '0 2px 4px rgba(0,0,0,0.05)',
    '0 4px 8px rgba(0,0,0,0.05)',
    '0 8px 16px rgba(0,0,0,0.05)',
    '0 16px 24px rgba(0,0,0,0.05)',
    '0 24px 32px rgba(0,0,0,0.05)',
    // ... rest of the shadows
  ] : [
    'none',
    '0 2px 4px rgba(0,0,0,0.2)',
    '0 4px 8px rgba(0,0,0,0.2)',
    '0 8px 16px rgba(0,0,0,0.2)',
    '0 16px 24px rgba(0,0,0,0.2)',
    '0 24px 32px rgba(0,0,0,0.2)',
    // ... rest of the shadows
  ],
});

function App() {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'light';
  });

  const theme = useMemo(() => getTheme(mode), [mode]);
  const { user } = useAuth ? useAuth() : { user: null };

  const toggleColorMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <TransactionProvider>
          <GoalProvider>
            <BudgetProvider>
              <Router>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Layout onToggleColorMode={toggleColorMode} mode={mode} user={user}>
                          <ErrorBoundary>
                            <Dashboard />
                          </ErrorBoundary>
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/transactions"
                    element={
                      <ProtectedRoute>
                        <Layout onToggleColorMode={toggleColorMode} mode={mode} user={user}>
                          <ErrorBoundary>
                            <Transactions />
                          </ErrorBoundary>
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/goals"
                    element={
                      <ProtectedRoute>
                        <Layout onToggleColorMode={toggleColorMode} mode={mode} user={user}>
                          <ErrorBoundary>
                            <Goals />
                          </ErrorBoundary>
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/budgets"
                    element={
                      <ProtectedRoute>
                        <Layout onToggleColorMode={toggleColorMode} mode={mode} user={user}>
                          <ErrorBoundary>
                            <Budgets />
                          </ErrorBoundary>
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/"
                    element={user ? <Navigate to="/dashboard" replace /> : <Landing />} 
                  />
                </Routes>
              </Router>
            </BudgetProvider>
          </GoalProvider>
        </TransactionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

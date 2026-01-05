import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Import pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ServiceTypesPage from './pages/ServiceTypesPage';
import CredentialsPage from './pages/CredentialsPage';

// Layout component
const Layout = ({ children }) => {
  const { logout } = useAuth();
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <header style={{ 
        background: '#1976d2', 
        color: 'white', 
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>Password Manager</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <nav style={{ display: 'flex', gap: '15px' }}>
            <a href="/dashboard" style={{ color: 'white', textDecoration: 'none', padding: '5px 10px', borderRadius: '3px' }}>
              Dashboard
            </a>
            <a href="/service-types" style={{ color: 'white', textDecoration: 'none', padding: '5px 10px', borderRadius: '3px' }}>
              Service Types
            </a>
            <a href="/credentials" style={{ color: 'white', textDecoration: 'none', padding: '5px 10px', borderRadius: '3px' }}>
              Credentials
            </a>
          </nav>
          <button
            onClick={logout}
            style={{
              background: 'transparent',
              color: 'white',
              border: '1px solid white',
              padding: '5px 15px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Lock Vault
          </button>
        </div>
      </header>
      <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {children}
      </main>
      <footer style={{
        marginTop: '40px',
        padding: '20px',
        textAlign: 'center',
        color: '#666',
        fontSize: '14px',
        borderTop: '1px solid #eee'
      }}>
        Password Manager © {new Date().getFullYear()} | Secure credential storage
      </footer>
    </div>
  );
};

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Checking authentication status...
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <Layout>{children}</Layout>;
};

// Public Route wrapper
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/service-types" element={
            <ProtectedRoute>
              <ServiceTypesPage />
            </ProtectedRoute>
          } />
          <Route path="/credentials" element={
            <ProtectedRoute>
              <CredentialsPage />
            </ProtectedRoute>
          } />
          
          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
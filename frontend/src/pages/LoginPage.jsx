import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { 
    login, 
    setupVault, 
    isVaultInitialized, 
    authLocked, 
    lockoutUntil, 
    checkAuthStatus 
  } = useAuth();
  
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleSetup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    const result = await setupVault(password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '100px auto', 
      padding: '30px',
      background: 'white',
      borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ textAlign: 'center', color: '#1976d2', marginBottom: '30px' }}>
        Password Manager
      </h1>

      {authLocked ? (
        <div style={{
          background: '#fff3cd',
          border: '1px solid #ffeaa7',
          color: '#856404',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ marginTop: 0 }}>Account Locked</h3>
          <p>Too many failed attempts. Please wait 5 minutes.</p>
          {lockoutUntil && (
            <p><strong>Locked until:</strong> {lockoutUntil}</p>
          )}
        </div>
      ) : (
        <>
          {!isVaultInitialized && !showSetup ? (
            <div style={{ textAlign: 'center' }}>
              <h3>Welcome!</h3>
              <p>No vault found. You need to create one first.</p>
              <button
                onClick={() => setShowSetup(true)}
                style={{
                  padding: '12px 24px',
                  background: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                Initialize New Vault
              </button>
            </div>
          ) : (
            <>
              <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
                {showSetup ? 'Create New Vault' : 'Unlock Vault'}
              </h3>

              {error && (
                <div style={{
                  background: '#ffebee',
                  color: '#c62828',
                  padding: '10px',
                  borderRadius: '5px',
                  marginBottom: '20px'
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={showSetup ? handleSetup : handleLogin}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Master Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      fontSize: '16px'
                    }}
                    required
                    disabled={loading || authLocked}
                    placeholder={showSetup ? 'Min. 8 characters' : ''}
                  />
                  {showSetup && (
                    <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                      Choose a strong password. If you lose it, all data will be inaccessible.
                    </small>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || authLocked}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: showSetup ? '#4caf50' : '#1976d2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '16px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    marginBottom: '10px'
                  }}
                >
                  {loading ? 'Processing...' : (showSetup ? 'Create Vault' : 'Unlock Vault')}
                </button>
              </form>

              {isVaultInitialized && !showSetup && (
                <button
                  type="button"
                  onClick={() => setShowSetup(true)}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'transparent',
                    color: '#1976d2',
                    border: '1px solid #1976d2',
                    borderRadius: '5px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    marginTop: '10px'
                  }}
                >
                  Create New Vault Instead
                </button>
              )}

              {showSetup && (
                <button
                  type="button"
                  onClick={() => setShowSetup(false)}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'transparent',
                    color: '#666',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    marginTop: '10px'
                  }}
                >
                  ← Back to Login
                </button>
              )}
            </>
          )}
        </>
      )}

      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        background: '#f8f9fa',
        borderRadius: '5px',
        fontSize: '14px',
        color: '#666'
      }}>
        <p style={{ margin: '0' }}>
          <strong>Note:</strong> Your master password is never stored. It's used only to encrypt/decrypt your vault.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
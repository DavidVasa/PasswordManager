import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);
  const [isVaultInitialized, setIsVaultInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authLocked, setAuthLocked] = useState(false);
  const [lockoutUntil, setLockoutUntil] = useState(null);

  // Kontrola stavu při načtení aplikace
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const health = await authService.checkHealth();
      
      setIsVaultInitialized(health.hasVault || false);
      setIsVaultUnlocked(health.vaultUnlocked || false);
      setAuthLocked(health.AuthLocked || false);
      
      // Pokud je trezor odemčený, považujeme uživatele za autentizovaného
      if (health.vaultUnlocked) {
        setIsAuthenticated(true);
        localStorage.setItem('vaultUnlocked', 'true');
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem('vaultUnlocked');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setIsVaultUnlocked(false);
    } finally {
      setLoading(false);
    }
  };

  const setupVault = async (masterPassword) => {
    try {
      await authService.setup(masterPassword);
      setIsVaultInitialized(true);
      setIsVaultUnlocked(true);
      setIsAuthenticated(true);
      localStorage.setItem('vaultUnlocked', 'true');
      toast.success('Vault initialized successfully!');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Setup failed');
      return { success: false, error: error.message };
    }
  };

  const login = async (masterPassword) => {
    try {
      await authService.login(masterPassword);
      setIsVaultUnlocked(true);
      setIsAuthenticated(true);
      setAuthLocked(false);
      localStorage.setItem('vaultUnlocked', 'true');
      toast.success('Vault unlocked successfully!');
      return { success: true };
    } catch (error) {
      if (error.response?.status === 423) {
        setAuthLocked(true);
        const lockedUntil = error.response?.data?.lockedUntil;
        if (lockedUntil) {
          setLockoutUntil(new Date(lockedUntil).toLocaleTimeString());
        }
      }
      toast.error(error.response?.data?.message || 'Login failed');
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setIsVaultUnlocked(false);
      setIsAuthenticated(false);
      localStorage.removeItem('vaultUnlocked');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    isAuthenticated,
    isVaultUnlocked,
    isVaultInitialized,
    loading,
    authLocked,
    lockoutUntil,
    setupVault,
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
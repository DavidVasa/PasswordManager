import api from './api';

const authService = {
  // Inicializace trezoru
  setup: async (masterPassword) => {
    console.log('[authService] Setting up vault...');
    console.log('Sending POST to /auth/setup');
    
    try {
      const response = await api.post('/auth/setup', { masterPassword });
      console.log('[authService] Setup successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('[authService] Setup failed:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          withCredentials: error.config?.withCredentials
        }
      });
      throw error;
    }
  },

  // Přihlášení
  login: async (masterPassword) => {
    console.log('[authService] Logging in...');
    
    try {
      const response = await api.post('/auth/login', { masterPassword });
      console.log('[authService] Login successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('[authService] Login failed:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  },

  // Odhlášení
  logout: async () => {
    console.log('[authService] Logging out...');
    
    try {
      const response = await api.post('/auth/logout');
      console.log('[authService] Logout successful');
      return response.data;
    } catch (error) {
      console.error('[authService] Logout failed:', error);
      throw error;
    }
  },

  // Kontrola zdraví
  checkHealth: async () => {
    console.log('[authService] Checking backend health...');
    
    try {
      const response = await api.get('/health');
      console.log('[authService] Health check OK:', response.data);
      return response.data;
    } catch (error) {
      console.error('[authService] Health check failed:', {
        message: error.message,
        url: '/health'
      });
      throw error;
    }
  },

  // Debug auth status
  checkAuthStatus: async () => {
    console.log('[authService] Checking auth status...');
    
    try {
      const response = await api.get('/check-auth');
      console.log('[authService] Auth status:', response.data);
      return response.data;
    } catch (error) {
      console.error('[authService] Auth status check failed:', error);
      throw error;
    }
  },

  // Kontrola zda je trezor inicializovaný
  isVaultInitialized: async () => {
    try {
      const health = await authService.checkHealth();
      return health.hasVault === true;
    } catch {
      return false;
    }
  },

  // Kontrola zda je trezor odemčený
  isVaultUnlocked: async () => {
    try {
      const health = await authService.checkHealth();
      return health.vaultUnlocked === true;
    } catch {
      return false;
    }
  }
};

export default authService;
import axios from 'axios';

const api = axios.create({
  baseURL: '/', // nebo prázdné string ''
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // důležité pro cookies/session
});

// Přidej interceptory pro debugging
api.interceptors.request.use(
  (config) => {
    console.log('Sending request to:', config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('Response from:', response.config.url, 'status:', response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export default api;
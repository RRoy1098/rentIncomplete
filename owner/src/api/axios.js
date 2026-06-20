import axios from 'axios';

export const API_BASE_URL = import.meta.env.DEV ? 
import.meta.env.VITE_BACKEND_URL 
: import.meta.env.VITE_BACKEND_URL_PROD



const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ownerToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 responses (token expired/invalid)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ownerToken');
      localStorage.removeItem('ownerUser');
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

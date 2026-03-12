import axios from 'axios';

// Create a new axios instance with the base URL.
const api = axios.create({
  baseURL: '/api',
});

/**
 * Interceptor to add the JWT token to every outgoing request
 * if it exists in localStorage.
 */
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;
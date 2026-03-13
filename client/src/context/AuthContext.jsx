import { createContext, useState, useEffect, useCallback } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUser = useCallback(async () => {
    setLoading(true);
    const currentToken = localStorage.getItem('token');
    if (currentToken) {
      api.defaults.headers.common['x-auth-token'] = currentToken;
    } else {
      delete api.defaults.headers.common['x-auth-token'];
      setIsAuthenticated(false);
      setLoading(false);
      setUser(null);
      return;
    }

    try {
      const res = await api.get('/auth'); // Get user from token
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Failed to load user:", err.message);
      localStorage.removeItem('token');
      setToken(null);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [token, loadUser]);

  // This function is for the final step of the OTP login
  const completeLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    // The useEffect above will trigger loadUser
  };

  const register = async (formData) => {
    try {
      const res = await api.post('/users', formData);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      // The useEffect above will trigger loadUser
    } catch (err) {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setError(err.response?.data?.msg || 'Registration failed');
      throw err; // Re-throw to be caught in the component
    }
  };

  const logout = () => {
    delete api.defaults.headers.common['x-auth-token'];
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        loading,
        user,
        error,
        register,
        logout,
        completeLogin,
        clearError: () => setError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
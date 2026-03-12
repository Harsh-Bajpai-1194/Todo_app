import { createContext, useState, useEffect, useCallback } from "react";
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUser = useCallback(async () => {
    try {
      const res = await api.get('/auth');
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (err) {
      setToken(null); // Clear invalid token
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      loadUser();
    } else {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setLoading(false);
      setUser(null); // Ensure user state is cleared
    }
  }, [token, loadUser]);

  const register = async (formData) => {
    try {
      const res = await api.post('/users', formData);
      setToken(res.data.token);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
      setToken(null);
    }
  };

  const login = async (formData) => {
    try {
      const res = await api.post('/auth', formData);
      setToken(res.data.token);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
      setToken(null);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  // Function to allow components to clear the error state
  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, loading, error, register, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};
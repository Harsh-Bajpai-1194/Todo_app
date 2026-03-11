import { createContext, useState, useEffect } from "react";
import axios from 'axios';

export const AuthContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
      localStorage.setItem('token', token);
      loadUser();
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/auth`);
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (err) {
      setToken(null); // Clear invalid token
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/users`, formData);
      setToken(res.data.token);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
      setToken(null);
    }
  };

  const login = async (formData) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth`, formData);
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

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, loading, error, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
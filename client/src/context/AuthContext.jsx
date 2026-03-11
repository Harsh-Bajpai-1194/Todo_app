import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

// A helper function to set the auth token for all future axios requests
const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null,
  });

  // Load user on mount by checking for a token in local storage
  useEffect(() => {
    loadUser();
  }, []);

  // Load User from token
  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      try {
        const res = await axios.get('/api/auth');
        setAuthState(prevState => ({
          ...prevState,
          isAuthenticated: true,
          loading: false,
          user: res.data,
          token: token,
        }));
      } catch (err) {
        // This will happen if the token is invalid
        localStorage.removeItem('token');
        setAuthState(prevState => ({
          ...prevState, // Keep other state like error if it exists
          token: null,
          isAuthenticated: false,
          loading: false,
          user: null,
        }));
      }
    } else {
      // If no token, we're not loading anymore
      setAuthState(prevState => ({ ...prevState, loading: false }));
    }
  };

  // Register User
  const register = async (formData) => {
    try {
      const res = await axios.post('/api/users', formData);
      localStorage.setItem('token', res.data.token);
      await loadUser(); // Load user after setting token
    } catch (err) {
      setAuthState(prevState => ({
        ...prevState,
        error: err.response.data.msg || 'Registration failed',
      }));
    }
  };

  // Login User
  const login = async (formData) => {
    try {
      const res = await axios.post('/api/auth', formData);
      localStorage.setItem('token', res.data.token);
      await loadUser(); // Load user after setting token
    } catch (err) {
      setAuthState(prevState => ({
        ...prevState,
        error: err.response.data.msg || 'Login failed',
      }));
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({
      token: null,
      isAuthenticated: false,
      loading: false,
      user: null,
      error: null,
    });
    setAuthToken(null); // Clear the auth header
  };
  // Clear errors
  const clearErrors = () => setAuthState(prevState => ({ ...prevState, error: null }));

  return (
    <AuthContext.Provider value={{ ...authState, register, login, logout, loadUser, clearErrors }}>
      {children}
    </AuthContext.Provider>
  );
};
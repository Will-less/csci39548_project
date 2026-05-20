import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthAuthenticator = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  
  const handleLogin = (token) => {
    if (!token || typeof token !== 'string') {
      console.warn("bad token");
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("invalid token");
      localStorage.removeItem('userToken');
      setIsLoggedIn(false);
      setUserId(null);
    }

    setLoading(false);
  };

  // Checks for an existing login token when the app first loads
  useEffect(() => {
    const token = localStorage.getItem('userToken');

    if (token) {
      handleLogin(token);
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('userToken', token);
    handleLogin(token);
  }

  const logout = () => {
    localStorage.removeItem('userToken');
    setIsLoggedIn(false);
    setUserId(null);
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, loading, userId }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
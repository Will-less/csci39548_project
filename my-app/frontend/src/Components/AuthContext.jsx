import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();
export const AuthAuthenticator = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
        setIsLoggedIn(true);
        console(userId);
      } catch (error) {
        console.error("invalid token");
        localStorage.remove(userToken);
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('userToken', token);
    setIsLoggedIn(true);
  }

  const logout = () => {
    localStorage.removeItem('userToken');
    setIsLoggedIn(false);
  }


  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, loading, userId }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();
export const AuthAuthenticator = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) setIsLoggedIn(true);
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
    <AuthContext value={{ isLoggedIn, login, logout, loading }}>
      {!loading && children}
    </AuthContext>
  );
};

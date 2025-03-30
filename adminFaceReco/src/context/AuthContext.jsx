import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Check if user data exists in localStorage during initialization
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  const updateUser = useCallback(async (updatedUserData) => {
    try {
      // Here you would typically make an API call to update the user data
      // For now, we'll just update it locally
      setUser(updatedUserData);
      localStorage.setItem('user', JSON.stringify(updatedUserData));
    } catch (error) {
      throw new Error('Failed to update user profile');
    }
  }, []);

  const isAuthenticated = useCallback(() => {
    return !!user;
  }, [user]);

  useEffect(() => {
    // Check localStorage for existing user data
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user,
    login,
    logout,
    updateUser,
    isAuthenticated
  }), [user, login, logout, updateUser, isAuthenticated]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

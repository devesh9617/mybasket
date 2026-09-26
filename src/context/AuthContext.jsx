import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { LOCAL_STORAGE_KEYS } from '../constants/index.js';
import * as authService from '../services/authService.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true while restoring session

  // Restore session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER);
    if (stored) {
      try {
        const { user: storedUser, token: storedToken } = JSON.parse(stored);
        if (storedUser && storedToken) {
          setUser(storedUser);
          setToken(storedToken);
        }
      } catch {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_USER);
      }
    }
    setIsLoading(false);
  }, []);

  const persistSession = (userData, authToken) => {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.AUTH_USER,
      JSON.stringify({ user: userData, token: authToken })
    );
    setUser(userData);
    setToken(authToken);
  };

  const login = useCallback(async (credentials) => {
    const { user: loggedInUser, token: authToken } = await authService.login(credentials);
    persistSession(loggedInUser, authToken);
    return loggedInUser;
  }, []);

  const register = useCallback(async (userData) => {
    const { user: newUser, token: authToken } = await authService.register(userData);
    persistSession(newUser, authToken);
    return newUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_USER);
    setUser(null);
    setToken(null);
  }, []);

  const updateUser = useCallback(async (updates) => {
    const updated = await authService.updateProfile(user.id, updates);
    const newUser = { ...user, ...updated };
    persistSession(newUser, token);
    return newUser;
  }, [user, token]);

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
};

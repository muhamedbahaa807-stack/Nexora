import { createContext, useContext, useState, useEffect } from 'react';

import { setAccessToken, removeAccessToken } from '../api/token.js';

import api from '../api/axios.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const login = (userData, token) => {
    setUser(userData);
    setAccessToken(token);
  };

  const logout = () => {
    setUser(null);
    removeAccessToken();
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await api.post('/refresh');

        setUser(data.user);
        setAccessToken(data.accessToken);
      } catch {
        setUser(null);
        removeAccessToken();
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};

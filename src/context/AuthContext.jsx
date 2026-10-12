/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('movie_explorer_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('movie_explorer_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('movie_explorer_user');
    }
  }, [user]);

  const login = (username, password) => {
    if (!username || !password) {
      throw new Error('Please enter both username and password.');
    }
    if (password.length < 4) {
      throw new Error('Password must be at least 4 characters.');
    }

    const newUser = {
      username: username.trim(),
      email: `${username.toLowerCase().replace(/\s+/g, '')}@example.com`,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`,
      joinedAt: new Date().toISOString(),
    };
    setUser(newUser);
    setIsLoginModalOpen(false);
    return newUser;
  };

  const logout = () => {
    setUser(null);
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
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

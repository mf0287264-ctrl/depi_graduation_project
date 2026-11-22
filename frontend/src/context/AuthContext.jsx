import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(() => localStorage.getItem('userId'));
  const [loading, setLoading] = useState(true);

  // Load user data on mount if userId exists
  useEffect(() => {
    async function loadUser() {
      if (!userId) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const userData = await authService.getUser(userId);
        if (userData && !userData.error) {
          setUser(userData);
        } else {
          logout();
        }
      } catch (err) {
        console.error("Auth load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [userId]);

  const login = async (username, password) => {
    const res = await authService.login(username, password);
    if (res.success && res.userId) {
      localStorage.setItem('userId', res.userId);
      setUserId(res.userId);
      setUser(res.user);
      return res;
    }
    throw new Error(res.message || 'Login failed');
  };

  const signup = async (username, email, password) => {
    const res = await authService.signup(username, email, password);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('userId');
    setUserId(null);
    setUser(null);
    authService.logout().catch(() => {});
  };

  const updateProfile = async (data) => {
    if (!userId) throw new Error("Not logged in");
    await authService.updateUser(userId, data);
    setUser(prev => ({ ...prev, ...data }));
  };

  const updateAvatar = async (file) => {
    if (!userId) throw new Error("Not logged in");
    const res = await authService.uploadAvatar(userId, file);
    if (res.imageUrl) {
      setUser(prev => ({ ...prev, profile_image: res.imageUrl }));
    }
    return res;
  };

  const deleteAccount = async () => {
    if (!userId) return;
    await authService.deleteAccount(userId);
    logout();
  };

  return (
    <AuthContext.Provider value={{
      user,
      userId,
      loading,
      isAuthenticated: Boolean(userId),
      login,
      signup,
      logout,
      updateProfile,
      updateAvatar,
      deleteAccount
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User } from '@/lib/api/auth.service';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    // Inicializálás: ellenőrizzük, hogy van-e bejelentkezett user
    const initAuth = async () => {
      const savedUser = authService.getUser();
      if (savedUser) {
        setUser(savedUser);
        // Ellenőrizzük a szerverrel is
        const currentUser = await authService.getMe();
        if (currentUser) {
          setUser(currentUser);
          authService.setUser(currentUser);
        } else {
          // Token érvénytelen
          setUser(null);
          authService.logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authService.login({ email, password });
    if (result.success && result.user) {
      setUser(result.user);
    }
    return result;
  };

  const register = async (username: string, email: string, password: string) => {
    const result = await authService.register({ username, email, password });
    return result;
  };
  const logout = () => {
    authService.logout();
    setUser(null);
    showToast('Sikeres kijelentkezés!', 'success');
  };

  const refreshUser = async () => {
    const currentUser = await authService.getMe();
    if (currentUser) {
      setUser(currentUser);
      authService.setUser(currentUser);
    } else {
      setUser(null);
      authService.logout();
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
    showToast,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-[9999] flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white transition-all duration-300 ${
            toast.type === 'success' ? 'bg-green-500/90' : 
            toast.type === 'error' ? 'bg-red-500/90' : 
            'bg-blue-500/90'
          }`}
        >
          <span className="text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="hover:bg-white/20 rounded p-1 transition"
          >
            ✕
          </button>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

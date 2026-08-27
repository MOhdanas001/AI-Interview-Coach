'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AuthResponse,
  LoginDto,
  RegisterDto,
  UpdateProfileDto,
  UserDto,
} from '@ai-interview-coach/types';

interface AuthContextType {
  user: UserDto | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (dto: LoginDto) => Promise<void>;
  register: (dto: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (dto: UpdateProfileDto) => Promise<void>;
  refreshSession: () => Promise<void>;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedAccess = localStorage.getItem('access_token');
        const savedRefresh = localStorage.getItem('refresh_token');

        if (savedAccess && savedRefresh) {
          setAccessToken(savedAccess);
          setRefreshToken(savedRefresh);
          await fetchUserProfile(savedAccess);
        }
      } catch {
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const fetchUserProfile = async (token: string) => {
    const res = await fetch(`${API_BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const body = await res.json();
      if (body.success && body.data) {
        setUser(body.data);
      }
    } else if (res.status === 401 && refreshToken) {
      await refreshSession();
    } else {
      clearAuth();
    }
  };

  const login = async (dto: LoginDto) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto),
      });

      const body = await res.json();
      if (!res.ok || !body.success) {
        throw new Error(body.error?.message || 'Login failed');
      }

      const authData: AuthResponse = body.data;
      saveSession(authData.user, authData.tokens.accessToken, authData.tokens.refreshToken);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (dto: RegisterDto) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto),
      });

      const body = await res.json();
      if (!res.ok || !body.success) {
        throw new Error(body.error?.message || 'Registration failed');
      }

      const authData: AuthResponse = body.data;
      saveSession(authData.user, authData.tokens.accessToken, authData.tokens.refreshToken);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSession = async () => {
    if (!refreshToken) {
      clearAuth();
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      const body = await res.json();
      if (res.ok && body.success && body.data) {
        const newAccess = body.data.accessToken;
        const newRefresh = body.data.refreshToken;
        setAccessToken(newAccess);
        setRefreshToken(newRefresh);
        localStorage.setItem('access_token', newAccess);
        localStorage.setItem('refresh_token', newRefresh);
        await fetchUserProfile(newAccess);
      } else {
        clearAuth();
      }
    } catch {
      clearAuth();
    }
  };

  const logout = async () => {
    try {
      if (accessToken) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ refreshToken }),
        });
      }
    } finally {
      clearAuth();
    }
  };

  const updateProfile = async (dto: UpdateProfileDto) => {
    if (!accessToken) throw new Error('Not authenticated');

    const res = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(dto),
    });

    const body = await res.json();
    if (!res.ok || !body.success) {
      throw new Error(body.error?.message || 'Failed to update profile');
    }

    setUser(body.data);
  };

  const saveSession = (
    userData: UserDto,
    access: string,
    refresh: string,
  ) => {
    setUser(userData);
    setAccessToken(access);
    setRefreshToken(refresh);
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  };

  const clearAuth = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        refreshSession,
      }}
    >
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

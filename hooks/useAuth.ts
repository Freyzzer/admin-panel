"use client";

import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'STAFF';
  companyId: string;
}

interface Company {
  id: string;
  name: string;
  slug: string;
}

export function useAuth() {
  const [user, setUser] = useState<User>();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/me', {
        method: 'GET',
        credentials: 'include', // Importante para incluir cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // No autorizado, redirigir a login
          window.location.href = '/login';
          return;
        }
        throw new Error('Error al obtener datos del usuario');
      }

      const data = await response.json();
      setUser(data.user);
      setCompany(data.user?.company || null);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      // Redirigir a login
      window.location.href = '/login';
    } catch (error) {
      console.error('Error during logout:', error);
      // Incluso si hay error, redirigir a login
      window.location.href = '/login';
    }
  };

  const refreshUserData = () => {
    fetchUserData();
  };

  return {
    user,
    company,
    loading,
    error,
    isAuthenticated: !!user,
    logout,
    refreshUserData,
  };
}
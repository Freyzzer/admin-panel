"use client";

import { useAuth } from '@/hooks/useAuth';
import { LogOut, User, Building } from 'lucide-react';

export function UserInfo() {
  const { user, company, loading, error, logout } = useAuth();

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        Error: {error}
      </div>
    );
  }

  if (!user || !company) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
        No hay información de usuario disponible
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Información de Usuario
        </h3>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </button>
      </div>
      
      <div className="space-y-4">
        {/* Usuario Info */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <User className="w-8 h-8 text-blue-500" />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {user.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {user.email}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Rol: {user.role === 'ADMIN' ? 'Administrador' : 'Staff'}
            </p>
          </div>
        </div>
        
        {/* Company Info */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <Building className="w-8 h-8 text-green-500" />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {company.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ID: {company.id}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Slug: /{company.slug}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
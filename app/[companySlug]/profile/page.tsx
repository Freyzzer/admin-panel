"use client";

import { useAuth } from '@/hooks/useAuth';

export default function ProfilePage() {
  const { user, company, loading, error } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Error de Carga</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Mi Perfil
        </h1>
        
        {user && company ? (
          <div className="space-y-6">
            {/* Información Personal */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Información Personal
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nombre Completo
                  </label>
                  <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded">
                    {user.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded">
                    {user.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Rol
                  </label>
                  <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded">
                    {user.role === 'ADMIN' ? 'Administrador' : 'Staff'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    ID de Usuario
                  </label>
                  <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded font-mono text-sm">
                    {user.id}
                  </p>
                </div>
              </div>
            </section>

            {/* Información de la Empresa */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Información de la Empresa
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nombre de Empresa
                  </label>
                  <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded">
                    {company.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Slug de la Empresa
                  </label>
                  <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded font-mono text-sm">
                    /{company.slug}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    ID de Empresa
                  </label>
                  <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded font-mono text-sm">
                    {company.id}
                  </p>
                </div>
              </div>
            </section>

            {/* Acceso a Datos - Código de Ejemplo */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Cómo Acceder a estos Datos
              </h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  En cualquier componente:
                </h3>
                <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`const { user, company, loading, error } = useAuth();

// Usuario actual
console.log(user?.name);    // "Admin User"
console.log(user?.email);   // "admin@demo.com"
console.log(user?.role);    // "ADMIN"

// Empresa actual
console.log(company?.name);  // "Demo Company"
console.log(company?.slug);  // "demo-company"

// Estado
console.log(loading);       // false cuando termina de cargar
console.log(error);         // null si no hay error
console.log(user && company); // true si está autenticado`}
                </pre>
              </div>
            </section>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">
              No se encontró información del usuario
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
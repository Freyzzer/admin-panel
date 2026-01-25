# 📖 Cómo Obtener Información del Usuario y Empresa

## 🎯 Formas de Acceder a los Datos

### 1. **Usando el Hook `useAuth` (Recomendado)**

```typescript
import { useAuth } from '@/hooks/useAuth';

function MiComponente() {
  const { user, company, loading, error, isAuthenticated } = useAuth();

  // Datos del Usuario
  console.log(user?.id);       // "1"
  console.log(user?.name);     // "Admin User"
  console.log(user?.email);    // "admin@demo.com"
  console.log(user?.role);     // "ADMIN"
  console.log(user?.companyId); // "1"

  // Datos de la Empresa
  console.log(company?.id);   // "1"
  console.log(company?.name); // "Demo Company"
  console.log(company?.slug); // "demo-company"

  // Estados
  console.log(loading);       // true/false
  console.log(error);         // null o mensaje de error
  console.log(isAuthenticated); // true/false
}
```

### 2. **Directamente desde la API**

```typescript
async function getUserData() {
  const response = await fetch('/api/me', {
    method: 'GET',
    credentials: 'include', // Importante para enviar cookies
  });

  if (response.ok) {
    const data = await response.json();
    console.log(data.user);    // Información del usuario
    console.log(data.company); // Información de la empresa
  }
}
```

### 3. **Leyendo el Token (no recomendado)**

```typescript
// Solo si necesitas el token directamente
function getTokenFromCookie() {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; auth-token=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift();
  }
  return null;
}

const token = getTokenFromCookie();
if (token) {
  const decoded = Buffer.from(token, 'base64').toString('utf-8');
  const payload = JSON.parse(decoded);
  console.log(payload.userId, payload.companyId);
}
```

## 🚀 Ejemplos Prácticos

### **Componente de Perfil**

```typescript
export default function ProfileComponent() {
  const { user, company, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h1>Bienvenido, {user?.name}!</h1>
      <p>Empresa: {company?.name}</p>
      <p>Rol: {user?.role}</p>
      <p>Acceso a: /{company?.slug}</p>
    </div>
  );
}
```

### **Middleware Personalizado**

```typescript
export function useAdminOnly() {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    redirect('/login');
  }
  
  if (user?.role !== 'ADMIN') {
    redirect('/unauthorized');
  }
  
  return user;
}
```

### **Condiciones de Renderizado**

```typescript
function DashboardComponent() {
  const { user, company, loading } = useAuth();

  return (
    <div>
      {loading && <div>Cargando...</div>}
      
      {user && company && (
        <div>
          {user.role === 'ADMIN' && (
            <button>Configuración Avanzada</button>
          )}
          
          <h1>Dashboard de {company.name}</h1>
          <p>Bienvenido {user.name}</p>
        </div>
      )}
      
      {!user && !loading && (
        <div>No autenticado</div>
      )}
    </div>
  );
}
```

## 📍 Rutas Disponibles

Puedes acceder a la información en estas rutas:

- **Dashboard principal**: `/[companySlug]/` - Usa `useAuth()` para mostrar datos
- **Perfil completo**: `/[companySlug]/profile` - Ejemplo completo de uso
- **Cualquier componente**: Importa y usa el hook `useAuth()`

## 🔧 Tipos de Datos

```typescript
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

// Hook return type
interface UseAuthReturn {
  user: User | null;
  company: Company | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}
```

## 🎨 Visualización en Tiempo Real

Visita: http://localhost:3000/demo-company/profile

Verás un ejemplo completo con:
- ✅ Todos los datos del usuario
- ✅ Información de la empresa
- ✅ Estados de carga y error
- ✅ Ejemplos de código
- ✅ Botón de logout

## 💡 Mejoras Futuras

1. **Cache React Query**: Para mejor manejo de estados
2. **Context Provider**: Para estado global más eficiente
3. **Actualización Automática**: Refresh de datos periódico
4. **Offline Support**: Datos cacheados localmente

---

**¡Listo!** Ahora puedes acceder a toda la información del usuario y empresa de forma sencilla y segura en cualquier componente de tu aplicación. 🎉
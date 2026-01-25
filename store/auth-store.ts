import { UserRole } from '@/lib/types';
import {create} from 'zustand';

type User = {
    password: string | null;
    name: string;
    id: string;
    email: string;
    companyId: string;
    createdAt: Date;
    updatedAt: Date;
    role: UserRole;
    company: Company;
}

type Company = {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    slug: string;
}

type AuthState = {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void
    logout: () => void
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}))
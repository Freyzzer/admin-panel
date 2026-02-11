import { Decimal } from "@/app/generated/prisma/internal/prismaNamespace";

export type ClientStatus = "ACTIVE" | "PENDING" | "SUSPENDED" | "CANCELLED";

export type PaymentStatus = "PAID" | "PENDING" | "OVERDUE";

export type PaymentMethod = "CASH" | "TRANSFER" | "CARD" | "NEQUI" | "DAVIPLATA";

export type UserRole = "ADMIN" | "STAFF";

export type Plan = string; // Plan names are stored as strings in database

export type SubscriptionPlan = 
  | "Netflix Básico"
  | "Netflix Estándar"
  | "Netflix Premium"
  | "Disney+ Premium"
  | "HBO Max"
  | "Amazon Prime Video"
  | "Apple TV+"
  | "Combo Netflix + Disney"
  | "Paramount+ + Showtime"
  | "Netflix Premium Anual" ;

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: Company;
  status: ClientStatus;
  plan: PlanDetailed;
  planId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientDetailed {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: ClientStatus;
  companyId: string;
  planId: string;
  createdAt: string;
  updatedAt: string;
  plan: PlanDetailed;
  company: Company;
}

export interface Payment {
  id: string;
  amount: number;
  clientId: string;
  companyId: string;
  createdAt: Date;
  method: PaymentMethod;
  paidAt: Date | null;
  status: PaymentStatus;
  client: ClientDetailed;
}

export interface Activity {
  id: string;
  clientId: string;
  clientName: string;
  action: string;
  timestamp: string;
}

export interface KPIData {
  totalClients: number;
  activeClients: number;
  pendingPayments: number;
  monthlyRevenue: number;
}

export interface ChartDataPoint {
  month: string;
  revenue: number;
  payments: number;
}

export interface PlanDetailed {
  id: string;
  name: string;
  price: number; 
  interval: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

// Service layer types
export interface ClientServiceOptions {
  fields?: 'basic' | 'detailed';
  page?: number;
  limit?: number;
  status?: ClientStatus;
  search?: string;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

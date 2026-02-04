export type ClientStatus = "ACTIVE" | "PENDING" | "SUSPENDED" | "CANCELLED";

export type PaymentStatus = "PAID" | "PENDING" | "OVERDUE";

export type PaymentMethod = "CASH" | "TRANSFER" | "CARD" | "NEQUI" | "DAVIPLATA";

export type UserRole = "ADMIN" | "STAFF";

export type Plan = "Basic" | "Pro" | "Premium";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: Company;
  status: ClientStatus;
  plan: Plan;
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
  name: Plan;
  price: number; // Convertido desde Decimal para el frontend
  interval: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
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
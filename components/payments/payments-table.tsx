"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PaymentStatusBadge } from "@/components/ui/status-badge";
import type { Payment, PaymentStatus, PaymentMethod } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/calculate";
import { PlanBadge } from "@/components/ui/status-badge";
import { PaymentFilters, type PaymentFiltersState } from "./payment-filters";

// Helper function to get payment method labels
const getPaymentMethodLabel = (method: PaymentMethod): string => {
  const labels = {
    CASH: "Efectivo",
    TRANSFER: "Transferencia",
    CARD: "Tarjeta",
    NEQUI: "Nequi",
    DAVIPLATA: "Daviplata"
  };
  return labels[method] || method;
};

interface PaymentsTableProps {
  payments: Payment[];
  isLoading?: boolean;
}

export function PaymentsTable({ payments, isLoading = false }: PaymentsTableProps) {
  const [filters, setFilters] = useState<PaymentFiltersState>({
    search: "",
    status: "all",
    method: "all",
    amountRange: { min: "", max: "" },
    dateRange: { from: "", to: "" },
    clientId: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset currentPage when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.search, filters.status, filters.method, filters.amountRange, filters.dateRange, filters.clientId]);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      // Búsqueda por nombre de cliente
      const matchesSearch = !filters.search || 
        payment.client.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        payment.client.email.toLowerCase().includes(filters.search.toLowerCase());

      // Estado
      const matchesStatus = filters.status === "all" || payment.client.status === filters.status;

      // Método de pago
      const matchesMethod = filters.method === "all" || payment.method === filters.method;

      // Rango de montos
      const matchesAmountRange = (!filters.amountRange.min && !filters.amountRange.max) ||
        (payment.amount >= Number(filters.amountRange.min || 0) && 
         payment.amount <= Number(filters.amountRange.max || Infinity));

      // Rango de fechas
      const paymentDate = payment.paidAt ? new Date(payment.paidAt) : new Date(payment.createdAt);
      const matchesDateRange = (!filters.dateRange.from && !filters.dateRange.to) ||
        (paymentDate >= new Date(filters.dateRange.from) &&
         paymentDate <= new Date(filters.dateRange.to));

      // Cliente específico
      const matchesClient = filters.clientId === "all" || 
        payment.client.name.toLowerCase().includes(filters.clientId.toLowerCase()) ||
        payment.client.email.toLowerCase().includes(filters.clientId.toLowerCase());

      return matchesSearch && matchesStatus && matchesMethod && matchesAmountRange && matchesDateRange && matchesClient;
    });
  }, [payments, filters]);

  const paginatedPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredPayments.slice(startIndex, endIndex);
  }, [filteredPayments, currentPage]);

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalAmount = useMemo(() => {
    return filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  }, [filteredPayments]);

  const handleFiltersChange = (newFilters: PaymentFiltersState) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "all",
      method: "all",
      amountRange: { min: "", max: "" },
      dateRange: { from: "", to: "" },
      clientId: "all",
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status !== "all") count++;
    if (filters.method !== "all") count++;
    if ((filters.amountRange.min || filters.amountRange.max)) count++;
    if ((filters.dateRange.from || filters.dateRange.to)) count++;
    if (filters.clientId !== "all") count++;
    return count;
  };

  if (isLoading) {
    return <PaymentsTableSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg font-semibold">All Payments</CardTitle>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por cliente..."
                value={filters.search}
                onChange={(e) => handleFiltersChange({...filters, search: e.target.value})}
                className="w-full pl-9 sm:w-64"
              />
            </div>
            <Select
              value={filters.status}
              onValueChange={(value) => handleFiltersChange({...filters, status: value as PaymentStatus | "all"})}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="PAID">Pagado</SelectItem>
                <SelectItem value="PENDING">Pendiente</SelectItem>
                <SelectItem value="OVERDUE">Vencido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
    <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Método</TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
              {filteredPayments.length === 0 ? (
                 <TableRow>
                   <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                     No payments found
                   </TableCell>
                 </TableRow>
               ) : (
                 paginatedPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <Link
                        href={`/clients/${payment.clientId}`}
                        className="flex items-center gap-3 hover:underline"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {payment.client.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{payment.client.name}</span>
                      </Link>
                    </TableCell>
                     <TableCell className="text-muted-foreground">
                       {formatDate(payment.createdAt.toString())}
                     </TableCell>
                     <TableCell className="hidden md:table-cell">
                       <PlanBadge plan={payment.client.plan?.name} />
                     </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {getPaymentMethodLabel(payment.method)}
                      </TableCell>
                    <TableCell>
                      <PaymentStatusBadge status={payment.status} />
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(payment.client.plan.price)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {filteredPayments.length > 0 && (
          <>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {paginatedPayments.length} of {filteredPayments.length} payments
              </div>
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function PaymentsTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-32 flex-1" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}

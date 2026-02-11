'use client'

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { PaymentsTable } from "@/components/payments/payments-table";
import { Payment } from "@/lib/types";
import { useAuthStore } from "@/store/auth-store";
import { useEffect, useState } from "react";

export default function PaymentsPage({
  params,
}: {
  params: { companySlug: string };
}) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const user = useAuthStore((state) => state.user);
  
  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/payments');

      if (!response.ok) {
        console.error('Failed to fetch payments');
        return;
      }

      const data = await response.json();
      setPayments(data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPayments();
  }, [user]);

  return (
    <DashboardLayout title="Pagos" description="Seguimiento y gestión de todas las transacciones de pago">
      <PaymentsTable 
        payments={payments} 
        isLoading={isLoading} 
        companyId={user?.companyId}
        onPaymentCreated={fetchPayments}
      />
    </DashboardLayout>
  );
}


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Payment } from "@/lib/types";
import { useEffect, useState } from "react";
import { PlanBadge } from "../ui/status-badge";
import { useAuthStore } from "@/store/auth-store";



export function RecentPaymentsTable() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch('/api/payments', {
          headers: {
            'companyId': user?.company.id || '', 
          }
        });

        if (!response.ok) {
          console.error('Failed to fetch recent payments');
          return;
        }

        const data = await response.json();
        const sortPayments = data.sort((a: Payment, b: Payment) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());  
        const sortPaidPayments = sortPayments.filter((payment: Payment) => payment.status === 'PAID');
        
        setPayments(sortPaidPayments.slice(0, 5)); 
      } catch (error) {
        console.error('Error fetching recent payments:', error);
      }
    }
    fetchPayments();
  }, [user]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Pagos Recientes</CardTitle>
      </CardHeader>
      <CardContent className="h-full flex flex-col gap-4">
        {payments.map((payment) => (
          <section key={payment.id} className="flex items-center justify-between">
            <div>
              <p>{payment.client.name}</p>
              <PlanBadge plan={payment.client.plan?.name as any} />
            </div>
            <div>
              <p>{payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : 'Sin fecha de pago'}</p>
            </div>
          </section>
        ) )}
      </CardContent>
    </Card>
  );
}

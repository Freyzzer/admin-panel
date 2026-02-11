"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, User, Mail, Phone} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useClient } from "@/hooks/useClients";
import { ClientStatusBadge, PlanBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatDate } from "@/lib/calculate";
import type { ClientDetailed, ClientStatus, Payment } from "@/lib/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ClientDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ClientDetailPage({ params }: ClientDetailPageProps) {
  const { id } = use(params);
  const [client, setClient] = useState<ClientDetailed>();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingPayments, setLoadingPayments] = useState<boolean>(true);
  const router = useRouter();
  

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/clients/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch client data");
        }
        const data = await response.json();
        setClient(data);
      } catch (error) {
        console.error("Error fetching client data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [id]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoadingPayments(true);
        const response = await fetch(`/api/payments/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch client payments");
        }
        const data = await response.json();
        setPayments(data);
      } catch (error) {
        console.error("Error fetching client payments:", error);
      } finally {
        setLoadingPayments(false);
      }
    };
    fetchPayments();
  }, [id]);


  const handleStatusUpdate = async (newStatus: ClientStatus) => {
    try {
      const response = await fetch(`/api/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        throw new Error('Failed to update client status');
      }
      const result = await response.json();
      if (result.success) {
        setClient(prev => prev ? { ...prev, status: newStatus } : prev);
      }
      toast.success(`Client status updated to ${newStatus}`);
      router.refresh();
    } catch (error) {
      console.error('Error updating client status:', error);
    }
  };

  // Calculate next payment date based on last payment
  const calculateNextPaymentDate = () => {
    if (payments.length === 0) return null;
    
    const lastPayment = payments[0]; // Most recent payment (sorted in API)
    if (!lastPayment.paidAt) return null;
    
    const lastPaymentDate = new Date(lastPayment.paidAt);
    const interval = client?.plan?.interval || 'monthly';
    
    // Add interval to last payment date
    const nextDate = new Date(lastPaymentDate);
    if (interval === 'monthly' || interval === 'month') {
      nextDate.setMonth(nextDate.getMonth() + 1);
    } else if (interval === 'yearly' || interval === 'year') {
      nextDate.setFullYear(nextDate.getFullYear() + 1);
    }
    
    return nextDate;
  };

  const nextPaymentDate = calculateNextPaymentDate();

  if (loading) {
    return (
      <DashboardLayout title="Loading..." description="Fetching client information">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-4 w-4 rounded" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }


  return (
    <DashboardLayout title={client?.name || "Client Details"} description={`Viewing ${client?.name}'s profile`}>
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/clients">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>
      </div>

      {/* Client Information */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="">
          <CardHeader>
            <CardTitle>Información de Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{client?.name}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {client?.email}
                  </div>
                  {client?.phone && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      {client?.phone}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Estado</label>
                <ClientStatusBadge status={client?.status} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Plan</label>
                <PlanBadge plan={client?.plan?.name || 'Basic'} />
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium text-gray-700">Client ID</label>
                <p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
                  {client?.id}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Fecha de Registro</label>
                <p className="text-sm text-gray-900">{client?.createdAt}</p>
              </div>
            </div>
          </CardContent>
        </Card>

      {/* Plan Information */}
      <Card className="">
        <CardHeader>
          <CardTitle>Detalles del Plan</CardTitle>
        </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Nombre del Plan</label>
                <p className="text-sm text-gray-900">{client?.plan?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Precio</label>
                <p className="text-sm text-gray-900 font-bold">
                  {client?.plan?.price ? formatCurrency(Number(client?.plan?.price)) + "/month" : "N/A"}
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Billing Cycle</label>
              <p className="text-sm text-gray-900">{client?.plan?.interval}</p>
            </div>
          </CardContent>
        </Card>

      {/* Payment Information */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Información de Pagos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Próxima Fecha de Pago</label>
              <p className="text-sm text-gray-900 font-semibold">
                {nextPaymentDate ? formatDate(nextPaymentDate.toString()) : 'No disponible'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Total Pagado</label>
              <p className="text-sm text-gray-900 font-semibold">
                {formatCurrency(payments.reduce((sum, p) => sum + Number(p.amount), 0))}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Acciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Actualizar estado del cliente:</span>
              <div className="flex space-x-2">
                {client?.status === 'ACTIVE' ? (
                  <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleStatusUpdate('PENDING')}
                  >
                    Pausar Subcripción
                  </Button>
                ) : (
                  <Button 
                  size="sm"
                  onClick={() => handleStatusUpdate('ACTIVE')}
                  >
                    Activar Subcripción
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleStatusUpdate('SUSPENDED')}
                  >
                  Suspender Subcripción
                </Button>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>Last updated: {client?.updatedAt}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Historial de Pagos</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingPayments ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : payments.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No hay pagos registrados</p>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha de Pago</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {payment.paidAt ? formatDate(payment.paidAt.toString()) : 'N/A'}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(Number(payment.amount))}
                      </TableCell>
                      <TableCell>
                        {payment.method === 'CASH' ? 'Efectivo' :
                         payment.method === 'TRANSFER' ? 'Transferencia' :
                         payment.method === 'CARD' ? 'Tarjeta' :
                         payment.method === 'NEQUI' ? 'Nequi' :
                         payment.method === 'DAVIPLATA' ? 'Daviplata' : payment.method}
                      </TableCell>
                      <TableCell>
                        {payment.status === 'PAID' ? 'Pagado' :
                         payment.status === 'PENDING' ? 'Pendiente' :
                         payment.status === 'OVERDUE' ? 'Vencido' : payment.status}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </DashboardLayout>
  );
}
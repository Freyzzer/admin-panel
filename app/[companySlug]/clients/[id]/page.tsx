"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, User, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useClient } from "@/hooks/useClients";
import { ClientStatusBadge, PlanBadge } from "@/components/ui/status-badge";
import { formatCurrency } from "@/lib/calculate";
import type { ClientDetailed, ClientStatus } from "@/lib/types";

interface ClientDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ClientDetailPage({ params }: ClientDetailPageProps) {
  const { id } = use(params);
  const [client, setClient] = useState<ClientDetailed>();
  const [loading, setLoading] = useState<boolean>(true);
  
  const { updateClientStatus } = useClient(id);

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


  const handleStatusUpdate = async (newStatus: ClientStatus) => {
    await updateClientStatus(newStatus);
  };


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
                  {client?.plan?.price ? formatCurrency(client?.plan?.price) + "/month" : "N/A"}
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Billing Cycle</label>
              <p className="text-sm text-gray-900">{client?.plan?.interval}</p>
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
      </div>
    </DashboardLayout>
  );
}
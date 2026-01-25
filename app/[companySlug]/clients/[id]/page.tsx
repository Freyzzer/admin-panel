"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, User, Calendar, Mail, Phone, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useClient } from "@/hooks/useClients";
import { ClientStatusBadge, PlanBadge } from "@/components/ui/status-badge";
import type { ClientStatus, Plan } from "@/lib/types";

interface ClientDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ClientDetailPage({ params }: ClientDetailPageProps) {
  const { id } = use(params);
  const { client, loading, error, updateClientStatus, isAuthenticated } = useClient(id);

  const handleStatusUpdate = async (newStatus: ClientStatus) => {
    await updateClientStatus(newStatus);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Unauthorized</h1>
          <p className="text-gray-600 mb-4">Please log in to view client details.</p>
          <Link href="/login">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

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

  if (error) {
    return (
      <DashboardLayout title="Error" description="Failed to load client">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  if (!client) {
    return (
      <DashboardLayout title="Client Not Found" description="The requested client could not be found">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-600 mb-4">Client not found</p>
            <Link href="/clients">
              <Button>Back to Clients</Button>
            </Link>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={client.name} description={`Viewing ${client.name}'s profile`}>
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/clients">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Clients
          </Link>
        </Button>
      </div>

      {/* Client Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {client.email}
                  </div>
                  {client.phone && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      {client.phone}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <ClientStatusBadge status={client.status} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Plan</label>
                <PlanBadge plan={client.plan?.name || 'Basic'} />
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium text-gray-700">Client ID</label>
                <p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
                  {client.id}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Joined Date</label>
                <p className="text-sm text-gray-900">{client.createdAt}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Company Name</label>
              <p className="text-sm text-gray-900">{client.company?.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Company Slug</label>
              <p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
                /{client.company?.slug}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan Information */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Details</CardTitle>
        </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Plan Name</label>
                <p className="text-sm text-gray-900">{client.plan?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Price</label>
                <p className="text-sm text-gray-900 font-bold">
                  ${client.plan?.price}/month
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Billing Cycle</label>
              <p className="text-sm text-gray-900">{client.plan?.interval}</p>
            </div>
          </CardContent>
        </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Update client status:</span>
              <div className="flex space-x-2">
                {client.status === 'ACTIVE' ? (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleStatusUpdate('PENDING')}
                  >
                    Pause Client
                  </Button>
                ) : (
                  <Button 
                    size="sm"
                    onClick={() => handleStatusUpdate('ACTIVE')}
                  >
                    Activate Client
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleStatusUpdate('SUSPENDED')}
                >
                  Suspend
                </Button>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>Last updated: {client.updatedAt}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
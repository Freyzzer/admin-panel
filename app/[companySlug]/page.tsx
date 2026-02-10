"use client";

import { Users, UserCheck, Clock, DollarSign } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { KPICard } from "@/components/dashboard/kpi-card";
import { useEffect, useMemo, useState } from "react";
import { Client } from "../generated/prisma/browser";
import { formatCurrency } from "@/lib/calculate";
import { useAuthStore } from "@/store/auth-store";
import prisma from "@/lib/prisma";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { UserInfo } from "@/components/user-info";
import { RecentPaymentsTable } from "@/components/dashboard/activity-table";


export default function CompanyDashboardPage({
  params,
}: {
  params: { companySlug: string };
}) {
  const [dataClients, setDataClients] = useState<Client[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false);
  const [Revenue, setRevenue] = useState(0)
  const user = useAuthStore((s) => s.user);
  console.log('user', user);
  
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        
        const response = await fetch('/api/clients', {
          headers: {
            'companyId': user?.company.id || '1'
          }
        });

        if (!response.ok) {
          console.error('Failed to fetch clients');
          return;
        }

        const data = await response.json();
        setDataClients(data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }finally{
        setIsLoading(false);
      }
    }
    fetchClients();
  }, [user]);

  
  /**
   * 🔎 Filtrado y KPIs
   */
  const kpiData = useMemo(() => {
    const totalClients = dataClients.length;

    const activeClients = dataClients.filter(
      (client) => client.status === "ACTIVE"
    ).length;

    const pendingPayments = dataClients.filter(
      (client) => client.status === "PENDING"
    ).length;

    const suspendedClients = dataClients.filter(
      (client) => client.status === "SUSPENDED"
    ).length;

    const cancelledClients = dataClients.filter(
      (client) => client.status === "CANCELLED"
    ).length;

    return {
      totalClients,
      activeClients,
      pendingPayments,
      suspendedClients,
      cancelledClients,
    };
  }, [dataClients]);


  useEffect(() => {
    const fetchMontlyRevenue = async () => {
      try {
        const response = await fetch('/api/metrics/monthlyRevenue');
        
        if (!response.ok) {
          console.error('Failed to fetch clients');
          return;
        }
        
        const data = await response.json();
        setMonthlyRevenue(data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    }
    fetchMontlyRevenue()
  }, [])

  useEffect(() => {
    let Revenue = 0
    monthlyRevenue.forEach(element => {
      Revenue += Number(element.amount)
    });
    setRevenue(Revenue || 0)
  },[monthlyRevenue])

if (!user || !user.company) {
  return (
    <DashboardLayout title="Dashboard" description="Cargando información de la empresa...">
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Cargando datos de la empresa...</p>
        </div>
      </div>
    </DashboardLayout>
  );
}

  return (
    <DashboardLayout title="Dashboard" description={`Overview of ${user?.company.slug} business metrics`}>
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total de Clientes"
          value={kpiData.totalClients}
          icon={Users}
        />
        <KPICard
          title="Clientes Activos"
          value={kpiData.activeClients}
          icon={UserCheck}
        />
        <KPICard
          title="Pagos Pendientes"
          value={kpiData.pendingPayments}
          icon={Clock}
        />
        <KPICard
          title="Ingresos Mensuales"
          value={formatCurrency(Number(Revenue))}
          icon={DollarSign}
        />
      </div>

      {/* Charts and Activity */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <RevenueChart />
        </div>
        
        <div className="">
          <RecentPaymentsTable />
        </div>
      </div>
    </DashboardLayout>
  );
}
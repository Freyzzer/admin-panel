"use client";

import { Users, UserCheck, Clock, DollarSign } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { KPICard } from "@/components/dashboard/kpi-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { ActivityTable } from "@/components/dashboard/activity-table";
import { UserInfo } from "@/components/user-info";
import { useEffect, useMemo, useState } from "react";
import { Client } from "../generated/prisma/browser";
import { formatCurrency } from "@/lib/calculate";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/auth-store";

export default function CompanyDashboardPage({
  params,
}: {
  params: { companySlug: string };
}) {
  const [dataClients, setDataClients] = useState<Client[]>([]);
  const user = useAuthStore((s) => s.user);
  console.log('user in dashboard page', user);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        // setIsLoading(true);
        
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
        console.log('Fetched clients:', data);
        setDataClients(data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }finally{
        // setIsLoading(false);
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


  


  return (
    <DashboardLayout title="Dashboard" description={`Overview of ${user?.company.slug} business metrics`}>
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Clients"
          value={kpiData.totalClients}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
          description="from last month"
        />
        <KPICard
          title="Active Clients"
          value={kpiData.activeClients}
          icon={UserCheck}
          trend={{ value: 8, isPositive: true }}
          description="from last month"
        />
        <KPICard
          title="Pending Payments"
          value={kpiData.pendingPayments}
          icon={Clock}
          trend={{ value: 2, isPositive: false }}
          description="requires attention"
        />
        {/* <KPICard
          title="Monthly Revenue"
          value={formatCurrency(kpiData.monthlyRevenue)}
          icon={DollarSign}
          trend={{ value: 15, isPositive: true }}
          description="from last month"
        /> */}
      </div>

      {/* Charts and Activity */}
      {/* <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <RevenueChart data={chartData} />
          <ActivityTable activities={activities.slice(0, 5)} />
        </div>
        
        <div className="space-y-6">
          <UserInfo />
        </div>
      </div> */}
    </DashboardLayout>
  );
}
'use client';
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { ClientsTable } from "@/components/clients/clients-table";
import { useEffect, useState } from "react";
import { Client } from "@/lib/types";
import { useAuthStore } from "@/store/auth-store";



export default function ClientsPage() {
  const [dataClients, setDataClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const user = useAuthStore((s) => s.user);
  console.log('data', dataClients);
  

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
  
  return (
    <DashboardLayout title="Clients" description="Manage your client relationships">
      <ClientsTable clients={dataClients} isLoading={isLoading} />
    </DashboardLayout>
  );
}
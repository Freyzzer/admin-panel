"use client";

import { useState, useEffect } from 'react';
import { ClientService } from '@/lib/services/client.service';
import { useAuth } from '@/hooks/useAuth';
import type { Client, ClientDetailed, ClientServiceOptions } from '@/lib/types';

export function useClients(options: ClientServiceOptions = {}) {
  const { user, company, isAuthenticated } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    if (!isAuthenticated || !company) {
      setLoading(false);
      return;
    }

    const fetchClients = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await ClientService.getClients(company.id, options);
        
        if (result.success) {
          setClients(result.data || []);
          if ('pagination' in result) {
            setPagination(result.pagination as any);
          }
        } else {
          setError(result.error || 'Failed to fetch clients');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [isAuthenticated, company, JSON.stringify(options)]);

  const refetch = () => {
    if (isAuthenticated && company) {
      ClientService.getClients(company.id, options).then(result => {
        if (result.success) {
          setClients(result.data || []);
          if ('pagination' in result) {
            setPagination((result as any).pagination);
          }
        }
      });
    }
  };

  return {
    clients,
    loading,
    error,
    pagination,
    refetch,
    isAuthenticated
  };
}

export function useClient(clientId: string) {
  const { user, company, isAuthenticated } = useAuth();
  const [client, setClient] = useState<ClientDetailed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !company) {
      setLoading(false);
      return;
    }

    const fetchClient = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await ClientService.getClientById(clientId);
        
        if (result.success && result.data) {
          setClient(result.data);
        } else {
          setError(result.error || 'Failed to fetch client');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      fetchClient();
    }
  }, [isAuthenticated, company, clientId]);

  const updateClientStatus = async (status: any) => {
    try {
      const result = await ClientService.updateClientStatus(clientId, status);
      
      if (result.success) {
        // Refetch client data
        const clientResult = await ClientService.getClientById(clientId);
        if (clientResult.success && clientResult.data) {
          setClient(clientResult.data);
        }
      } else {
        setError(result.error || 'Failed to update client');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return {
    client,
    loading,
    error,
    updateClientStatus,
    isAuthenticated
  };
}
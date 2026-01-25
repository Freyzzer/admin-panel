import { ClientDetailed, ClientServiceOptions, ApiResponse, ClientStatus } from '@/lib/types';

export class ClientService {
  // Mock user company para desarrollo
  private static MOCK_COMPANY_ID = '1';

  /**
   * Get clients with flexible querying
   */
  static async getClients(
    companyId: string,
    options: ClientServiceOptions = {}
  ): Promise<ApiResponse> {
    const {
      fields = 'basic',
      page = 1,
      limit = 50,
      status,
      search
    } = options;

    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (fields !== 'basic') queryParams.set('fields', fields);
      if (page !== 1) queryParams.set('page', page.toString());
      if (limit !== 50) queryParams.set('limit', limit.toString());
      if (status) queryParams.set('status', status);
      if (search) queryParams.set('search', search);

      const response = await fetch(`/api/clients?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        return {
          success: false,
          error: 'Failed to fetch clients'
        };
      }

      const result = await response.json();
      return result;

    } catch (error) {
      console.error('Error fetching clients:', error);
      return {
        success: false,
        error: 'Failed to fetch clients'
      };
    }
  }

  /**
   * Get single client by ID with detailed information
   */
  static async getClientById(
    clientId: string,
    options: { fields?: 'basic' | 'detailed' } = {}
  ): Promise<{ success: boolean; data?: ClientDetailed; error?: string }> {
    const { fields = 'detailed' } = options;

    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (fields !== 'detailed') queryParams.set('fields', fields);

      const response = await fetch(`/api/clients/${clientId}?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        return { success: false, error: 'Client not found' };
      }

      const result = await response.json();
      return result;

    } catch (error) {
      console.error('Error fetching client:', error);
      return { success: false, error: 'Failed to fetch client' };
    }
  }

  /**
   * Create a new client
   */
  static async createClient(
    companyId: string,
    clientData: {
      name: string;
      email: string;
      phone?: string;
      planId: string;
    }
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...clientData,
          companyId
        }),
      });

      if (!response.ok) {
        return { success: false, error: 'Failed to create client' };
      }

      const result = await response.json();
      return result;

    } catch (error) {
      console.error('Error creating client:', error);
      return { success: false, error: 'Failed to create client' };
    }
  }

  /**
   * Update client status
   */
  static async updateClientStatus(
    clientId: string,
    status: ClientStatus
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        return { success: false, error: 'Failed to update client status' };
      }

      const result = await response.json();
      return result;

    } catch (error) {
      console.error('Error updating client status:', error);
      return { success: false, error: 'Failed to update client status' };
    }
  }

  /**
   * Get client statistics
   */
  static async getClientStats(companyId: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      // Fetch all clients to calculate stats
      const result = await this.getClients(companyId, { fields: 'basic', limit: 1000 });
      
      if (!result.success || !result.data) {
        return { success: false, error: 'Failed to fetch client statistics' };
      }

      const clients = result.data;
      const total = clients.length;
      const activeCount = clients.filter((c: any) => c.status === 'ACTIVE').length;
      const pendingCount = clients.filter((c: any) => c.status === 'PENDING').length;
      const suspendedCount = clients.filter((c: any) => c.status === 'SUSPENDED').length;
      const cancelledCount = clients.filter((c: any) => c.status === 'CANCELLED').length;

      return {
        success: true,
        data: {
          total,
          active: activeCount,
          pending: pendingCount,
          suspended: suspendedCount,
          cancelled: cancelledCount
        }
      };

    } catch (error) {
      console.error('Error fetching client stats:', error);
      return { success: false, error: 'Failed to fetch client statistics' };
    }
  }

  /**
   * Get payments for a client
   */
  static async getClientPayments(clientId: string): Promise<{ success: boolean; data?: any[]; error?: string }> {
    try {
      const response = await fetch(`/api/payments?clientId=${clientId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        return { success: false, error: 'Failed to fetch payments' };
      }

      const result = await response.json();
      return result;

    } catch (error) {
      console.error('Error fetching payments:', error);
      return { success: false, error: 'Failed to fetch payments' };
    }
  }
}
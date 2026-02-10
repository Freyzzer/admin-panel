import { GET, POST } from '@/app/api/clients/route'
import { NextRequest } from 'next/server'
import { getAuthPayload } from '@/lib/auth'
import { getAllClientsByCompany } from '@/lib/db/user'
import prisma from '@/lib/prisma'
import { ClientStatus } from '@/app/generated/prisma/enums'

// Mock dependencies
jest.mock('@/lib/auth')
jest.mock('@/lib/db/user')
jest.mock('@/lib/prisma')

const mockGetAuthPayload = getAuthPayload as jest.MockedFunction<typeof getAuthPayload>
const mockGetAllClientsByCompany = getAllClientsByCompany as jest.MockedFunction<typeof getAllClientsByCompany>
const mockPrisma = prisma as jest.Mocked<typeof prisma>

describe('/api/clients', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('should return clients for authenticated user', async () => {
      const mockAuth = {
        userId: 'user1',
        companyId: 'company1',
        role: 'ADMIN',
      }

      const mockClients = [
        {
          id: 'client1',
          name: 'Client One',
          email: 'client1@example.com',
          phone: '123456789',
          status: ClientStatus.ACTIVE,
          companyId: 'company1',
          planId: 'plan1',
          plan: { id: 'plan1', name: 'Basic', price: 100 },
          company: { id: 'company1', name: 'Company 1' },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      mockGetAuthPayload.mockResolvedValue(mockAuth)
      mockGetAllClientsByCompany.mockResolvedValue(mockClients as any)

      const request = new NextRequest('http://localhost:3000/api/clients')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockClients)
      expect(mockGetAuthPayload).toHaveBeenCalledWith(request)
      expect(mockGetAllClientsByCompany).toHaveBeenCalledWith('company1')
    })

    it('should return 401 for unauthenticated request', async () => {
      mockGetAuthPayload.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/clients')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('No autorizado')
      expect(mockGetAllClientsByCompany).not.toHaveBeenCalled()
    })

    it('should handle database errors', async () => {
      const mockAuth = {
        userId: 'user1',
        companyId: 'company1',
        role: 'ADMIN',
      }

      mockGetAuthPayload.mockResolvedValue(mockAuth)
      mockGetAllClientsByCompany.mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost:3000/api/clients')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Error al obtener los clientes')
    })
  })

  describe('POST', () => {
    it('should create a new client successfully', async () => {
      const mockAuth = {
        userId: 'user1',
        companyId: 'company1',
        role: 'ADMIN',
      }

      const newClientData = {
        name: 'New Client',
        email: 'newclient@example.com',
        phone: '987654321',
        planId: 'plan1',
      }

      const createdClient = {
        id: 'client2',
        ...newClientData,
        status: ClientStatus.PENDING,
        companyId: 'company1',
        plan: { id: 'plan1', name: 'Basic', price: 100 },
        company: { id: 'company1', name: 'Company 1' },
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockGetAuthPayload.mockResolvedValue(mockAuth)
      mockPrisma.client.findUnique.mockResolvedValue(null)
      mockPrisma.client.create.mockResolvedValue(createdClient as any)

      const request = new NextRequest('http://localhost:3000/api/clients', {
        method: 'POST',
        body: JSON.stringify(newClientData),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toEqual(createdClient)
      expect(mockPrisma.client.findUnique).toHaveBeenCalledWith({
        where: { email: 'newclient@example.com' },
      })
      expect(mockPrisma.client.create).toHaveBeenCalledWith({
        data: {
          name: 'New Client',
          email: 'newclient@example.com',
          phone: '987654321',
          status: ClientStatus.PENDING,
          companyId: 'company1',
          planId: 'plan1',
        },
        include: {
          plan: true,
          company: true,
        },
      })
    })

    it('should return 401 for unauthenticated request', async () => {
      mockGetAuthPayload.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/clients', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New Client',
          email: 'test@example.com',
          planId: 'plan1',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('No autorizado')
      expect(mockPrisma.client.create).not.toHaveBeenCalled()
    })

    it('should return 400 for missing required fields', async () => {
      const mockAuth = {
        userId: 'user1',
        companyId: 'company1',
        role: 'ADMIN',
      }

      mockGetAuthPayload.mockResolvedValue(mockAuth)

      const request = new NextRequest('http://localhost:3000/api/clients', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New Client',
          // missing email and planId
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Faltan campos requeridos: name, email, planId')
      expect(mockPrisma.client.create).not.toHaveBeenCalled()
    })

    it('should return 409 for existing email', async () => {
      const mockAuth = {
        userId: 'user1',
        companyId: 'company1',
        role: 'ADMIN',
      }

      const existingClient = {
        id: 'existing-client',
        email: 'existing@example.com',
      }

      mockGetAuthPayload.mockResolvedValue(mockAuth)
      mockPrisma.client.findUnique.mockResolvedValue(existingClient as any)

      const request = new NextRequest('http://localhost:3000/api/clients', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New Client',
          email: 'existing@example.com',
          planId: 'plan1',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error).toBe('Ya existe un cliente con este email')
      expect(mockPrisma.client.create).not.toHaveBeenCalled()
    })

    it('should create client without phone', async () => {
      const mockAuth = {
        userId: 'user1',
        companyId: 'company1',
        role: 'ADMIN',
      }

      const newClientData = {
        name: 'New Client',
        email: 'newclient@example.com',
        planId: 'plan1',
      }

      const createdClient = {
        id: 'client2',
        ...newClientData,
        phone: null,
        status: ClientStatus.PENDING,
        companyId: 'company1',
        plan: { id: 'plan1', name: 'Basic', price: 100 },
        company: { id: 'company1', name: 'Company 1' },
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockGetAuthPayload.mockResolvedValue(mockAuth)
      mockPrisma.client.findUnique.mockResolvedValue(null)
      mockPrisma.client.create.mockResolvedValue(createdClient as any)

      const request = new NextRequest('http://localhost:3000/api/clients', {
        method: 'POST',
        body: JSON.stringify(newClientData),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(mockPrisma.client.create).toHaveBeenCalledWith({
        data: {
          name: 'New Client',
          email: 'newclient@example.com',
          phone: null,
          status: ClientStatus.PENDING,
          companyId: 'company1',
          planId: 'plan1',
        },
        include: {
          plan: true,
          company: true,
        },
      })
    })

    it('should handle database errors during creation', async () => {
      const mockAuth = {
        userId: 'user1',
        companyId: 'company1',
        role: 'ADMIN',
      }

      mockGetAuthPayload.mockResolvedValue(mockAuth)
      mockPrisma.client.findUnique.mockResolvedValue(null)
      mockPrisma.client.create.mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost:3000/api/clients', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New Client',
          email: 'newclient@example.com',
          planId: 'plan1',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Error al crear el cliente')
    })
  })
})
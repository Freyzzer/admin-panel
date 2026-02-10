import { POST } from '@/app/api/register/route'
import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Mock dependencies
jest.mock('@/lib/prisma')
jest.mock('bcryptjs')
jest.mock('jose', () => ({
  SignJWT: jest.fn().mockImplementation(() => ({
    setProtectedHeader: jest.fn().mockReturnThis(),
    setIssuedAt: jest.fn().mockReturnThis(),
    setExpirationTime: jest.fn().mockReturnThis(),
    setSubject: jest.fn().mockReturnThis(),
    sign: jest.fn().mockResolvedValue('mock-jwt-token'),
  })),
}))

const mockPrisma = prisma as jest.Mocked<typeof prisma>
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>

describe('/api/register', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.NODE_ENV = 'test'
    process.env.JWT_SECRET = 'test-secret'
  })

  it('should register a new user successfully', async () => {
    const mockCompany = {
      id: 'company1',
      name: 'Test Company',
      slug: 'test-company',
    }

    const mockUser = {
      id: 'user1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'ADMIN',
      companyId: 'company1',
    }

    mockPrisma.user.findUnique.mockResolvedValue(null)
    mockPrisma.company.create.mockResolvedValue(mockCompany as any)
    mockPrisma.user.create.mockResolvedValue(mockUser as any)
    mockBcrypt.hash.mockResolvedValue('hashed-password')

    const request = new NextRequest('http://localhost:3000/api/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        companyName: 'Test Company',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.user).toEqual({
      id: 'user1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'ADMIN',
      companyId: 'company1',
    })
    expect(data.companySlug).toBe('test-company')
    expect(response.headers.get('set-cookie')).toContain('auth-token')
  })

  it('should return 400 for missing required fields', async () => {
    const request = new NextRequest('http://localhost:3000/api/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        // missing password and companyName
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Todos los campos son requeridos')
  })

  it('should return 400 for existing email', async () => {
    const existingUser = {
      id: 'existing-user',
      email: 'test@example.com',
    }

    mockPrisma.user.findUnique.mockResolvedValue(existingUser as any)

    const request = new NextRequest('http://localhost:3000/api/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        companyName: 'Test Company',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Ya existe una cuenta con este email')
    expect(mockPrisma.company.create).not.toHaveBeenCalled()
    expect(mockPrisma.user.create).not.toHaveBeenCalled()
  })

  it('should generate correct slug from company name', async () => {
    const mockCompany = {
      id: 'company1',
      name: 'Test Company & More!',
      slug: 'test-company-more',
    }

    mockPrisma.user.findUnique.mockResolvedValue(null)
    mockPrisma.company.create.mockResolvedValue(mockCompany as any)
    mockPrisma.user.create.mockResolvedValue({} as any)
    mockBcrypt.hash.mockResolvedValue('hashed-password')

    const request = new NextRequest('http://localhost:3000/api/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        companyName: 'Test Company & More!',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    await POST(request)

    expect(mockPrisma.company.create).toHaveBeenCalledWith({
      data: {
        name: 'Test Company & More!',
        slug: 'test-company-more',
      },
    })
  })

  it('should handle database errors during company creation', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null)
    mockPrisma.company.create.mockRejectedValue(new Error('Database error'))

    const request = new NextRequest('http://localhost:3000/api/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        companyName: 'Test Company',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Error interno del servidor')
  })

  it('should handle database errors during user creation', async () => {
    const mockCompany = {
      id: 'company1',
      name: 'Test Company',
      slug: 'test-company',
    }

    mockPrisma.user.findUnique.mockResolvedValue(null)
    mockPrisma.company.create.mockResolvedValue(mockCompany as any)
    mockPrisma.user.create.mockRejectedValue(new Error('User creation error'))
    mockBcrypt.hash.mockResolvedValue('hashed-password')

    const request = new NextRequest('http://localhost:3000/api/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        companyName: 'Test Company',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Error interno del servidor')
  })
})
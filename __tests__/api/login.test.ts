import { POST } from '@/app/api/login/route'
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
    sign: jest.fn().mockResolvedValue('mock-jwt-token'),
  })),
}))

const mockPrisma = prisma as jest.Mocked<typeof prisma>
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>

describe('/api/login', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.JWT_SECRET = 'test-secret'
  })

  it('should authenticate user with valid credentials', async () => {
    const mockUser = {
      id: 'user1',
      email: 'test@example.com',
      password: 'hashed-password',
      name: 'Test User',
      role: 'ADMIN',
      companyId: 'company1',
      company: {
        id: 'company1',
        name: 'Test Company',
        slug: 'test-company',
      },
    }

    mockPrisma.user.findUnique.mockResolvedValue(mockUser as any)
    mockBcrypt.compare.mockResolvedValue(true)

    const request = new NextRequest('http://localhost:3000/api/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('token', 'mock-jwt-token')
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

  it('should return 401 for invalid credentials - user not found', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'nonexistent@example.com',
        password: 'password123',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Credenciales inválidas')
    expect(mockBcrypt.compare).not.toHaveBeenCalled()
  })

  it('should return 401 for invalid credentials - wrong password', async () => {
    const mockUser = {
      id: 'user1',
      email: 'test@example.com',
      password: 'hashed-password',
      name: 'Test User',
      role: 'ADMIN',
      companyId: 'company1',
      company: { slug: 'test-company' },
    }

    mockPrisma.user.findUnique.mockResolvedValue(mockUser as any)
    mockBcrypt.compare.mockResolvedValue(false)

    const request = new NextRequest('http://localhost:3000/api/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrong-password',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Credenciales inválidas 3')
    expect(mockBcrypt.compare).toHaveBeenCalledWith('wrong-password', 'hashed-password')
  })

  it('should return 401 for user without password', async () => {
    const mockUser = {
      id: 'user1',
      email: 'test@example.com',
      password: null,
      name: 'Test User',
      role: 'ADMIN',
      companyId: 'company1',
      company: { slug: 'test-company' },
    }

    mockPrisma.user.findUnique.mockResolvedValue(mockUser as any)

    const request = new NextRequest('http://localhost:3000/api/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Credenciales inválidas')
    expect(mockBcrypt.compare).not.toHaveBeenCalled()
  })

  it('should handle missing request body', async () => {
    const request = new NextRequest('http://localhost:3000/api/login', {
      method: 'POST',
      body: '',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Error interno del servidor')
  })

  it('should handle database errors', async () => {
    mockPrisma.user.findUnique.mockRejectedValue(new Error('Database connection failed'))

    const request = new NextRequest('http://localhost:3000/api/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
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
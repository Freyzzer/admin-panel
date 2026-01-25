import { NextRequest, NextResponse } from 'next/server';

// Mock companies for demo purposes
let mockCompanies = [
  {
    id: '1',
    name: 'Demo Company',
    slug: 'demo-company',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock users for demo purposes  
let mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@demo.com',
    password: 'admin123', // In production, this should be hashed
    role: 'ADMIN',
    companyId: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Staff User', 
    email: 'staff@demo.com',
    password: 'staff123', // In production, this should be hashed
    role: 'STAFF',
    companyId: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Simple password hashing (in production, use bcrypt)
async function hashPassword(password: string): Promise<string> {
  // For demo purposes, just return plain text
  // In production, use proper bcrypt hashing
  return password;
}

// Simple slug generation
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Simple token generation (in production, use JWT)
function generateToken(userId: string, companyId: string): string {
  const payload = {
    userId,
    companyId,
    timestamp: Date.now(),
    // Token expires in 24 hours
    expiresAt: Date.now() + (24 * 60 * 60 * 1000)
  };
  
  // Simple base64 encoding (in production, use proper JWT)
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, companyName } = await request.json();

    // Validate input
    if (!name || !email || !password || !companyName) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Ya existe una cuenta con este email' },
        { status: 400 }
      );
    }

    // Create new company
    const companySlug = generateSlug(companyName);
    const newCompany = {
      id: String(mockCompanies.length + 1),
      name: companyName,
      slug: companySlug,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Create new user
    const hashedPassword = await hashPassword(password);
    const newUser = {
      id: String(mockUsers.length + 1),
      name,
      email,
      password: hashedPassword,
      role: 'ADMIN',
      companyId: newCompany.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Save to mock data
    mockCompanies.push(newCompany);
    mockUsers.push(newUser);

    // Generate token
    const token = generateToken(newUser.id, newUser.companyId);

    // Create response and set cookie
    const response = NextResponse.json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        companyId: newUser.companyId
      },
      companySlug: newCompany.slug
    });
    
    // Set auth token cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    });
    
    return response;

  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
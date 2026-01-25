import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


// Simple password verification
async function verifyPassword(password: string, hashedPassword: string | null): Promise<boolean> {
  // For demo purposes, just compare plain text
  // In production, use proper bcrypt comparison
  return password === hashedPassword;
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
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Find user in mock data
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true, 
        role: true,
        companyId: true,
        company: {
          select: {
            slug: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken(user.id, user.companyId);

    // Create response and set cookie
    const response = NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId
      },
      companySlug: user.company.slug
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
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
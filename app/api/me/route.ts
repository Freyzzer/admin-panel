import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// Simple token verification (in production, use proper JWT verification)
function verifyToken(token: string): { userId: string; companyId: string } | null {
  try {
    // Decode base64 token
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const payload = JSON.parse(decoded);
    
    // Check if token is expired
    if (Date.now() > payload.expiresAt) {
      return null;
    }
    
    return {
      userId: payload.userId,
      companyId: payload.companyId
    };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header or cookies
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || 
                 request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }
    
    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 401 }
      );
    }
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }
    
    // Find company
    const company = await prisma.company.findUnique({
      where: { id: payload.companyId },
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Empresa no encontrada' },
        { status: 404 }
      );
    }
    
    // Return user and company data
    return NextResponse.json({
      user,
      company
    });
    
  } catch (error) {
    console.error('Me endpoint error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
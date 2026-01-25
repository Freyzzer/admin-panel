import { getCurrentUser } from "@/lib/auth";
import  prisma  from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

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

  const payments = await prisma.payment.findMany({
    where: {clientId: payload.companyId },
  });

  return NextResponse.json(payments);
}

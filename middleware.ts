import { NextRequest, NextResponse } from 'next/server';

// Paths that don't require authentication
const publicPaths = ['/login', '/register'];

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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if path is public
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }
  
  // Check for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }
  
  // Get token from Authorization header or cookies
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '') || 
               request.cookies.get('auth-token')?.value;
  
  // If no token, redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  // Verify token
  const payload = verifyToken(token);
  if (!payload) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  // Add user info to request headers for downstream use
  const response = NextResponse.next();
  response.headers.set('x-user-id', payload.userId);
  response.headers.set('x-company-id', payload.companyId);
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
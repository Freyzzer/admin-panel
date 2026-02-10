export const runtime = 'nodejs';

import { jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function getAuthPayload(req: NextRequest) {
  const token = req.cookies.get('auth-token')?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);

    if (
      !payload.sub ||
      typeof payload.sub !== 'string' ||
      typeof payload.companyId !== 'string'
    ) {
      return null;
    }

    return {
      userId: payload.sub,
      companyId: payload.companyId,
      role: payload.role as string | undefined,
    };
  } catch {
    return null;
  }
}
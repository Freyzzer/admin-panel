export const runtime = 'nodejs';

import { getAuthPayload } from '@/lib/auth';
import { getAllPaymentsByCompany } from '@/lib/db/payments';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const auth = await getAuthPayload(request);
    if (!auth) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
  try {
    const payments = await getAllPaymentsByCompany(auth.companyId); 

    return NextResponse.json(payments, { status: 200 });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Error al obtener los pagos' },
      { status: 500 }
    );
  }
}
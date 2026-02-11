export const runtime = 'nodejs';

import { getAuthPayload } from '@/lib/auth';
import { getClientsWithPendingPayments } from '@/lib/db/user';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const auth = await getAuthPayload(request);
  if (!auth) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');

    if (!companyId) {
      return NextResponse.json(
        { error: 'CompanyId es requerido' },
        { status: 400 }
      );
    }

    const clients = await getClientsWithPendingPayments(companyId);

    return NextResponse.json(clients, { status: 200 });
  } catch (error) {
    console.error('Error fetching clients with pending payments:', error);
    return NextResponse.json(
      { error: 'Error al obtener los clientes con pagos pendientes' },
      { status: 500 }
    );
  }
}
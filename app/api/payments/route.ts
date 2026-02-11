export const runtime = 'nodejs';

import { getAuthPayload } from '@/lib/auth';
import { getAllPaymentsByCompany, createPayment } from '@/lib/db/payments';
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

export async function POST(request: NextRequest) {
  const auth = await getAuthPayload(request);
  if (!auth) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { clientId, method } = await request.json();

    if (!clientId || !method) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: clientId y method' },
        { status: 400 }
      );
    }

    const payment = await createPayment(clientId, auth.companyId, method);

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Error al crear el pago' },
      { status: 500 }
    );
  }
}
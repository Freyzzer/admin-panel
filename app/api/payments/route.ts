import { getAllPaymentsByCompany } from '@/lib/db/payments';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const payments = await getAllPaymentsByCompany(request.headers.get('companyId') || ''); 

    return NextResponse.json(payments, { status: 200 });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Error al obtener los pagos' },
      { status: 500 }
    );
  }
}
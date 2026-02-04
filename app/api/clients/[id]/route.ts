import { getClientById } from '@/lib/db/user';
import { get } from 'http';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const clientId = params.id; 
    const data = await getClientById(request.headers.get('Id') || '');

    if (!data) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      );
    }
    return NextResponse.json(data, { status: 200 });
  }
    catch (error) { 
    console.error('Error fetching client by ID:', error);
    return NextResponse.json(
      { error: 'Error al obtener el cliente' },
      { status: 500 }
    );
  }
}
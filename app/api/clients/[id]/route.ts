export const runtime = 'nodejs';

import { getAuthPayload } from '@/lib/auth';
import { UpdateClientById } from '@/lib/db/clients';
import { getClientById } from '@/lib/db/user';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthPayload(request);
    if (!auth) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
  try {
    const resolvedParams = await params;
    const data = await getClientById(resolvedParams.id);

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
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack available');
    return NextResponse.json(
      { error: 'Error al obtener el cliente', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthPayload(request);
    if (!auth) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
  try {
    const resolvedParams = await params;
    const { name, email, planId, status } = await request.json();
   
    const data = await UpdateClientById(resolvedParams.id, { name, email, planId, status });
    if (!data) {
          return NextResponse.json(
            { error: 'Cliente no encontrado' },
            { status: 404 }
          );
        }
    return NextResponse.json({ message: 'Cliente actualizado correctamente' }, { status: 200 });
  } catch (error) {
    console.error('Error updating client:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack available');
    return NextResponse.json(
      { error: 'Error al actualizar el cliente', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } 
}
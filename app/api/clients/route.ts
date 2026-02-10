export const runtime = 'nodejs'; 

import { getAuthPayload } from '@/lib/auth';
import { getAllClientsByCompany } from '@/lib/db/user';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ClientStatus } from '@/app/generated/prisma/enums';

export async function GET(request: NextRequest) {
  const auth = await getAuthPayload(request);
  if (!auth) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  
  try {
    const clients = await getAllClientsByCompany(auth.companyId); 

    return NextResponse.json(clients, { status: 200 });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Error al obtener los clientes' },
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
    const { name, email, phone, planId } = await request.json();

    // Validaciones básicas
    if (!name || !email || !planId) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: name, email, planId' },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe
    const existingClient = await prisma.client.findUnique({
      where: { email }
    });

    if (existingClient) {
      return NextResponse.json(
        { error: 'Ya existe un cliente con este email' },
        { status: 409 }
      );
    }

    // Crear nuevo cliente
    const newClient = await prisma.client.create({
      data: {
        name,
        email,
        phone: phone || null,
        status: ClientStatus.PENDING,
        companyId: auth.companyId,
        planId,
      },
      include: {
        plan: true,
        company: true,
      },
    });

    return NextResponse.json(newClient, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { error: 'Error al crear el cliente' },
      { status: 500 }
    );
  }
}


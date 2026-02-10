export const runtime = 'nodejs';

import { getAuthPayload } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { DeletePlan, UpdatePlan } from "@/lib/db/plan";

export async function PUT(request: NextRequest) {
  const auth = await getAuthPayload(request);
  if (!auth) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "id es requerido" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, interval, price } = body;

    const plan = await UpdatePlan(id, name, interval, price);

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Error updating plan:", error);
    return NextResponse.json(
      { error: "Error al actualizar el plan" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await getAuthPayload(request);
  if (!auth) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "id es requerido" },
        { status: 400 }
      );
    }

    const plan = await DeletePlan(id);

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Error deleting plan:", error);
    return NextResponse.json(
      { error: "Error al eliminar el plan" },
      { status: 500 }
    );
  }
}



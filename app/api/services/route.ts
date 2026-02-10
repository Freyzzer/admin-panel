export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import { CreatePlan,  getAllPlanByCompany } from "@/lib/db/plan";
import { getAuthPayload } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const auth = await getAuthPayload(request);
  if (!auth) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  try {
    const plans = await getAllPlanByCompany(auth.companyId);

    return NextResponse.json(plans, { status: 200 });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Error al obtener planes" },
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
    const body = await request.json();
    const { name, interval, price } = body;

    if (!name || !interval || !price) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const plan = await CreatePlan(name, interval, price, auth.companyId);

    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error("Error creating plan:", error);
    return NextResponse.json(
      { error: "Error al crear el plan" },
      { status: 500 }
    );
  }
}

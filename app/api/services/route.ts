import { NextRequest, NextResponse } from "next/server";
import { CreatePlan, DeletePlan, getAllPlanByCompany, UpdatePlan } from "@/lib/db/plan";

export async function GET(request: NextRequest) {
  try {
    const companyId = request.headers.get("companyId");

    if (!companyId) {
      return NextResponse.json(
        { error: "companyId es requerido" },
        { status: 400 }
      );
    }

    const plans = await getAllPlanByCompany(companyId);

    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Error al obtener planes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, interval, price, companyId } = body;

    if (!name || !interval || !price || !companyId) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const plan = await CreatePlan(name, interval, price, companyId);

    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error("Error creating plan:", error);
    return NextResponse.json(
      { error: "Error al crear el plan" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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

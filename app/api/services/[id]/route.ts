import { NextRequest, NextResponse } from "next/server";


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
function UpdatePlan(id: string, name: any, interval: any, price: any) {
    throw new Error("Function not implemented.");
}

function DeletePlan(id: string) {
    throw new Error("Function not implemented.");
}


import { NextResponse, NextRequest } from "next/server";
import { getMonthlyRevenue } from "@/lib/db/payments";
import { getAuthPayload } from "@/lib/auth";

export async function GET(request: NextRequest){
    const auth = await getAuthPayload(request);
      if (!auth) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
      }
    try{
        const data = await getMonthlyRevenue(auth.companyId)
        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.error('Error fetching payments:', error);
        
        return NextResponse.json(
        { error: 'Error al obtener los pagos' },
        { status: 500 }
    );
    }
} 



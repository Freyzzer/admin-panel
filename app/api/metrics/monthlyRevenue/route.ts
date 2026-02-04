import { NextResponse, NextRequest } from "next/server";
import { getMonthlyRevenue } from "@/lib/db/payments";

export async function GET(request: NextRequest){
    try{
        const data = await getMonthlyRevenue(request.headers.get('companyId') || '')
        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.error('Error fetching payments:', error);
        
        return NextResponse.json(
        { error: 'Error al obtener los pagos' },
        { status: 500 }
    );
    }
} 



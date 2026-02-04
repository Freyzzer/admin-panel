import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PaymentStatus } from "@/app/generated/prisma/enums";
import { getMonthly } from "@/lib/db/payments";


export async function GET(req: Request) {
  try {
    const companyId = req.headers.get("companyId");

    if (!companyId) {
      return NextResponse.json(
        { error: "companyId is required" },
        { status: 400 }
      );
    }

    // Fecha desde hace 6 meses
    const fromDate = new Date();
    fromDate.setMonth(fromDate.getMonth() - 5);
    fromDate.setDate(1);

    const payments = await getMonthly(req.headers.get('companyId') || '')
    console.log('payment', payments);
    

    const grouped: Record<
      string,
      { month: string; revenue: number; payments: number; order: number }
    > = {};

    if(payments){
        payments.forEach(payment => {
          const date = payment.paidAt!;
          const monthLabel = date.toLocaleString("en-US", { month: "short" });
          const year = date.getFullYear();
          const key = `${year}-${date.getMonth()}`;
    
          if (!grouped[key]) {
            grouped[key] = {
              month: monthLabel,
              revenue: 0,
              payments: 0,
              order: date.getTime()
            };
          }
    
          grouped[key].revenue += Number(payment.amount);
          grouped[key].payments += 1;
        });
    }

    const chartData = Object.values(grouped)
      .sort((a, b) => a.order - b.order)
      .map(({ month, revenue, payments }) => ({
        month,
        revenue,
        payments
      }));

    return NextResponse.json(chartData);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
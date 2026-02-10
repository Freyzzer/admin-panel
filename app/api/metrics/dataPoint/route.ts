import { NextResponse, NextRequest } from "next/server";
import { getMonthly } from "@/lib/db/payments";
import { getAuthPayload } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = await getAuthPayload(req);
  if (!auth) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    // Desde el inicio del mes de hace 5 meses (6 meses contando el actual)
    const fromDate = new Date();
    fromDate.setMonth(fromDate.getMonth() - 5);
    fromDate.setDate(1);
    fromDate.setHours(0, 0, 0, 0);

    const payments = await getMonthly(auth.companyId);

    const grouped: Record<
      string,
      { month: string; revenue: number; payments: number; order: number }
    > = {};

    if (payments) {
      payments.forEach(payment => {
        const date = payment.paidAt;
        if (!date) return;

        if (date < fromDate) return;

        const monthLabel = date.toLocaleString("es-CO", {
          month: "short",
        });

        const year = date.getFullYear();
        const monthIndex = date.getMonth(); 
        const key = `${year}-${monthIndex}`;

        if (!grouped[key]) {
          grouped[key] = {
            month: monthLabel,
            revenue: 0,
            payments: 0,
            order: new Date(year, monthIndex, 1).getTime(),
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
        payments,
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
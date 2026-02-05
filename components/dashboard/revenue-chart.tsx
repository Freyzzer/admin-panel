"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChartDataPoint } from "@/lib/types";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";

export function RevenueChart() {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const user = useAuthStore((s) => s.user);

  const getLastSixMonths = (): ChartDataPoint[] => {
    const now = new Date();

    return Array.from({ length: 6 }).map((_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);

      return {
        month: date.toLocaleString("es-CO", { month: "short" }),
        revenue: 0,
        payments: 0,
      };
    });
  };

  const normalizeChartData = (apiData: ChartDataPoint[]): ChartDataPoint[] => {
    const baseMonths = getLastSixMonths();

    return baseMonths.map((base) => {
      const match = apiData.find(
        (item) => item.month.toLowerCase() === base.month.toLowerCase(),
      );

      return match
        ? {
            ...base,
            revenue: match.revenue,
            payments: match.payments,
          }
        : base;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/metrics/dataPoint", {
        headers: {
          companyId: user?.company.id || "cmkubbr7y00008sp9bc4rtd5n",
        },
      });

      const data: ChartDataPoint[] = await response.json();
      setChartData(normalizeChartData(data));
    };

    fetchData();
  }, []);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Revenue Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-75">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#000"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                stroke="#555"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#555"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip
                cursor={{ fill: "#f2f2f2", opacity: 0.3 }}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #000",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
                labelStyle={{ color: "#000", fontWeight: 600 }}
                formatter={(value: number) => [
                  `$${value.toLocaleString()}`,
                  "Revenue",
                ]}
              />
              <Bar
                dataKey="revenue"
                fill="#2e79f5"
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaymentStatusBadge } from "@/components/ui/status-badge";
import type { Payment } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/mock-data";

interface PaymentHistoryProps {
  payments: Payment[];
}

const methodLabels: Record<string, string> = {
  credit_card: "Credit Card",
  bank_transfer: "Bank Transfer",
  paypal: "PayPal",
  cash: "Cash",
};

export function PaymentHistory({ payments }: PaymentHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Payment History</CardTitle>
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center text-center">
            <p className="text-muted-foreground">No payment history</p>
            <p className="text-sm text-muted-foreground/70">
              Payments will appear here once processed
            </p>
          </div>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="text-muted-foreground">
                      {formatDate(payment.date)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {payment.description}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {methodLabels[payment.method]}
                    </TableCell>
                    <TableCell>
                      <PaymentStatusBadge status={payment.status} />
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(payment.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

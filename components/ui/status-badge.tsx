import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ClientStatus, PaymentStatus } from "@/lib/types";

const clientStatusConfig: Record<
  ClientStatus,
  { label: string; className: string }
> = {
  ACTIVE: {
    label: "Active",
    className: "bg-success/10 text-success hover:bg-success/20 border-success/20",
  },
  PENDING: {
    label: "Pending",
    className: "bg-warning/10 text-warning-foreground hover:bg-warning/20 border-warning/20",
  },
  SUSPENDED: {
    label: "Suspended",
    className: "bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-muted text-muted-foreground hover:bg-muted/80 border-muted",
  },
};

const paymentStatusConfig: Record<
  PaymentStatus,
  { label: string; className: string }
> = {
  PAID: {
    label: "Paid",
    className: "bg-success/10 text-success hover:bg-success/20 border-success/20",
  },
  PENDING: {
    label: "Pending",
    className: "bg-warning/10 text-warning-foreground hover:bg-warning/20 border-warning/20",
  },
  OVERDUE: {
    label: "Overdue",
    className: "bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20",
  },
};

interface ClientStatusBadgeProps {
  status: ClientStatus | undefined;
}

export function ClientStatusBadge({ status }: ClientStatusBadgeProps) {
  const config = clientStatusConfig[status || "PENDING"];
  return (
    <Badge variant="outline" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const config = paymentStatusConfig[status];
  return (
    <Badge variant="outline" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}

interface PlanBadgeProps {
  plan: "Basic" | "Pro" | "Premium" | null | undefined;
}

const planConfig: Record<string, { label: string; className: string }> = {
  Basic: {
    label: "Basic",
    className: "bg-secondary text-secondary-foreground",
  },
  Pro: {
    label: "Pro",
    className: "bg-primary/10 text-primary",
  },
  Premium: {
    label: "Premium",
    className: "bg-chart-1/10 text-chart-1",
  },
  null: {
    label: "Basic",
    className: "bg-secondary text-secondary-foreground",
  },
  undefined: {
    label: "Basic",
    className: "bg-secondary text-secondary-foreground",
  },
};

export function PlanBadge({ plan }: PlanBadgeProps) {
  const config = planConfig[plan || "Basic"];
  return (
    <Badge variant="secondary" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}

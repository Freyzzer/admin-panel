import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ClientStatus, PaymentStatus } from "@/lib/types";

const clientStatusConfig: Record<
  ClientStatus,
  { label: string; className: string }
> = {
  ACTIVE: {
    label: "Activo",
    className: "bg-success/10 text-success hover:bg-success/20 border-success/20",
  },
  PENDING: {
    label: "Pendiente",
    className: "bg-warning/10 text-warning-foreground hover:bg-warning/20 border-warning/20",
  },
  SUSPENDED: {
    label: "Suspendido",
    className: "bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20",
  },
  CANCELLED: {
    label: "Cancelado",
    className: "bg-muted text-muted-foreground hover:bg-muted/80 border-muted",
  },
};

const paymentStatusConfig: Record<
  PaymentStatus,
  { label: string; className: string }
> = {
  PAID: {
    label: "Pagado",
    className: "bg-success/10 text-success hover:bg-success/20 border-success/20",
  },
  PENDING: {
    label: "Pendiente",
    className: "bg-warning/10 text-warning-foreground hover:bg-warning/20 border-warning/20",
  },
  OVERDUE: {
    label: "Vencido",
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
  plan: string | null | undefined;
}

const planConfig: Record<string, { label: string; className: string }> = {
  "Basic": {
    label: "Básico",
    className: "bg-secondary text-secondary-foreground",
  },
  "Pro": {
    label: "Profesional", 
    className: "bg-primary/10 text-primary",
  },
  "Premium": {
    label: "Premium",
    className: "bg-chart-1/10 text-chart-1",
  },
  // Mapear planes específicos a categorías
  "Netflix Básico": {
    label: "Netflix Básico",
    className: "bg-secondary text-secondary-foreground",
  },
  "Netflix Estándar": {
    label: "Netflix Estándar", 
    className: "bg-primary/10 text-primary",
  },
  "Netflix Premium": {
    label: "Netflix Premium",
    className: "bg-chart-1/10 text-chart-1",
  },
  "Disney+ Premium": {
    label: "Disney+ Premium",
    className: "bg-chart-1/10 text-chart-1",
  },
  "HBO Max": {
    label: "HBO Max",
    className: "bg-primary/10 text-primary",
  },
  "Amazon Prime Video": {
    label: "Amazon Prime Video",
    className: "bg-secondary text-secondary-foreground",
  },
  "Apple TV+": {
    label: "Apple TV+",
    className: "bg-secondary text-secondary-foreground",
  },
  "Combo Netflix + Disney": {
    label: "Combo Netflix + Disney",
    className: "bg-chart-1/10 text-chart-1",
  },
  "Paramount+ + Showtime": {
    label: "Paramount+ + Showtime",
    className: "bg-primary/10 text-primary",
  },
  "Netflix Premium Anual": {
    label: "Netflix Premium Anual",
    className: "bg-chart-1/10 text-chart-1",
  },
};

export function PlanBadge({ plan }: PlanBadgeProps) {
  if (!plan) {
    return (
      <Badge variant="secondary" className={cn("font-medium", planConfig["Basic"].className)}>
        {planConfig["Basic"].label}
      </Badge>
    );
  }
  
  const config = planConfig[plan] || planConfig["Basic"];
  return (
    <Badge variant="secondary" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}

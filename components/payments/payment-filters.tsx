import React from "react";
import { Calendar, Filter, X, DollarSign, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { PaymentStatus, PaymentMethod } from "@/lib/types";

interface PaymentFiltersProps {
  onFiltersChange: (filters: PaymentFiltersState) => void;
  filters: PaymentFiltersState;
  onReset: () => void;
  activeFiltersCount: number;
}

export interface PaymentFiltersState {
  search: string;
  status: PaymentStatus | "all";
  method: PaymentMethod | "all";
  amountRange: {
    min: string;
    max: string;
  };
  dateRange: {
    from: string;
    to: string;
  };
  clientId: string | "all";
}

export function PaymentFilters({
  onFiltersChange,
  filters,
  onReset,
  activeFiltersCount,
}: PaymentFiltersProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const updateFilter = (key: keyof PaymentFiltersState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilter = (key: keyof PaymentFiltersState) => {
    onFiltersChange({
      ...filters,
      [key]: key === "status" ? "all" : 
                 key === "method" ? "all" : 
                 key === "amountRange" ? { min: "", max: "" } :
                 key === "dateRange" ? { from: "", to: "" } :
                  key === "clientId" ? "all" :
                  "",
    });
  };

  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <div className="space-y-4">
      {/* Filtros principales siempre visibles */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Búsqueda */}
        <div className="relative flex-1 min-w-50 max-w-75">
          <Input
            placeholder="Buscar por cliente..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pr-8"
          />
          {filters.search && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full w-8"
              onClick={() => clearFilter("search")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Estado */}
        <Select
          value={filters.status}
          onValueChange={(value) => updateFilter("status", value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="PAID">Pagado</SelectItem>
            <SelectItem value="PENDING">Pendiente</SelectItem>
            <SelectItem value="OVERDUE">Vencido</SelectItem>
          </SelectContent>
        </Select>

        {/* Método de pago */}
        <Select
          value={filters.method}
          onValueChange={(value) => updateFilter("method", value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Método" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="CASH">Efectivo</SelectItem>
            <SelectItem value="TRANSFER">Transferencia</SelectItem>
            <SelectItem value="CARD">Tarjeta</SelectItem>
            <SelectItem value="NEQUI">Nequi</SelectItem>
            <SelectItem value="DAVIPLATA">Daviplata</SelectItem>
          </SelectContent>
        </Select>

        {/* Rango de montos */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm">
            <DollarSign className="h-4 w-4" />
            <Input
              type="number"
              placeholder="Min"
              value={filters.amountRange.min}
              onChange={(e) => 
                updateFilter("amountRange", {
                  ...filters.amountRange,
                  min: e.target.value
                })
              }
            />
          </div>
          <span className="text-sm text-muted-foreground">-</span>
          <div className="flex items-center gap-1 text-sm">
            <Input
              type="number"
              placeholder="Max"
              value={filters.amountRange.max}
              onChange={(e) => 
                updateFilter("amountRange", {
                  ...filters.amountRange,
                  max: e.target.value
                })
              }
            />
          </div>
        </div>
      </div>

        {/* Filtros avanzados */}
        <div className={cn(
          "border rounded-lg p-4 space-y-4 bg-background",
          !isExpanded && "hidden"
        )}>
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filtros Avanzados</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Rango de fechas */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Rango de Fechas</label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                placeholder="Desde"
                value={filters.dateRange.from}
                onChange={(e) => 
                  updateFilter("dateRange", {
                    ...filters.dateRange,
                    from: e.target.value
                  })
                }
              />
              <Input
                type="date"
                placeholder="Hasta"
                value={filters.dateRange.to}
                onChange={(e) => 
                  updateFilter("dateRange", {
                    ...filters.dateRange,
                    to: e.target.value
                  })
                }
              />
            </div>
          </div>

          {/* Cliente específico */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Cliente Específico</label>
            <Input
              placeholder="Buscar por nombre o email"
              value={filters.clientId}
              onChange={(e) => updateFilter("clientId", e.target.value)}
            />
          </div>

          {/* Botones de acción */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="flex-1"
            >
              Limpiar todos
            </Button>
            <Button
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="flex-1"
            >
              Aplicar filtros
            </Button>
          </div>
        </div>

        {/* Botón para mostrar/ocultar filtros avanzados */}
        {!isExpanded && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(true)}
              className={cn(
                "gap-2",
                hasActiveFilters && "border-primary text-primary"
              )}
            >
              <Filter className="h-4 w-4" />
              Más filtros
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>
          )}
        </div>
  );
}
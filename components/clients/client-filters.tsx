import React from "react";
import { Calendar, Filter, X, ChevronDown } from "lucide-react";
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
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { ClientStatus, SubscriptionPlan } from "@/lib/types";

interface ClientFiltersProps {
  onFiltersChange: (filters: ClientFiltersState) => void;
  filters: ClientFiltersState;
  onReset: () => void;
  activeFiltersCount: number;
}

export interface ClientFiltersState {
  search: string;
  status: ClientStatus | "all";
  planId: SubscriptionPlan | "all";
  registrationDateRange: {
    from: string;
    to: string;
  };
  planPriceRange: {
    min: string;
    max: string;
  };
}

export function ClientFilters({
  onFiltersChange,
  filters,
  onReset,
  activeFiltersCount,
}: ClientFiltersProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const updateFilter = (key: keyof ClientFiltersState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilter = (key: keyof ClientFiltersState) => {
    onFiltersChange({
      ...filters,
      [key]: key === "status" ? "all" : 
                 key === "planId" ? "all" :
                 key === "registrationDateRange" ? { from: "", to: "" } :
                 key === "planPriceRange" ? { min: "", max: "" } : 
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
            placeholder="Buscar por nombre, email..."
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
            <SelectItem value="ACTIVE">Activo</SelectItem>
            <SelectItem value="PENDING">Pendiente</SelectItem>
            <SelectItem value="SUSPENDED">Suspendido</SelectItem>
            <SelectItem value="CANCELLED">Cancelado</SelectItem>
          </SelectContent>
        </Select>

        {/* Plan */}
        <Select
          value={filters.planId}
          onValueChange={(value) => updateFilter("planId", value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Todos los planes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los planes</SelectItem>
            <SelectItem value="Netflix Básico">Netflix Básico</SelectItem>
            <SelectItem value="Netflix Estándar">Netflix Estándar</SelectItem>
            <SelectItem value="Netflix Premium">Netflix Premium</SelectItem>
            <SelectItem value="Disney+ Premium">Disney+ Premium</SelectItem>
            <SelectItem value="HBO Max">HBO Max</SelectItem>
            <SelectItem value="Amazon Prime Video">Amazon Prime Video</SelectItem>
            <SelectItem value="Apple TV+">Apple TV+</SelectItem>
            <SelectItem value="Combo Netflix + Disney">Combo Netflix + Disney</SelectItem>
            <SelectItem value="Paramount+ + Showtime">Paramount+ + Showtime</SelectItem>
            <SelectItem value="Netflix Premium Anual">Netflix Premium Anual</SelectItem>
          </SelectContent>
        </Select>

        {/* Filtros avanzados - Panel desplegable */}
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
          
          {/* Rango de fechas de registro */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Fecha de Registro</label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                placeholder="Desde"
                value={filters.registrationDateRange.from}
                onChange={(e) => 
                  updateFilter("registrationDateRange", {
                    ...filters.registrationDateRange,
                    from: e.target.value
                  })
                }
              />
              <Input
                type="date"
                placeholder="Hasta"
                value={filters.registrationDateRange.to}
                onChange={(e) => 
                  updateFilter("registrationDateRange", {
                    ...filters.registrationDateRange,
                    to: e.target.value
                  })
                }
              />
            </div>
          </div>

          {/* Rango de precios del plan */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Rango de Precios del Plan</label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Min $"
                value={filters.planPriceRange.min}
                onChange={(e) => 
                  updateFilter("planPriceRange", {
                    ...filters.planPriceRange,
                    min: e.target.value
                  })
                }
              />
              <Input
                type="number"
                placeholder="Max $"
                value={filters.planPriceRange.max}
                onChange={(e) => 
                  updateFilter("planPriceRange", {
                    ...filters.planPriceRange,
                    max: e.target.value
                  })
                }
              />
            </div>
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
              Aplicar
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

      {/* Resumen de filtros activos */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Mostrando resultados con:</span>
          <div className="flex gap-1">
            {filters.search && (
              <Badge variant="secondary">Búsqueda</Badge>
            )}
            {filters.status !== "all" && (
              <Badge variant="secondary">Estado</Badge>
            )}
            {filters.planId !== "all" && (
              <Badge variant="secondary">Plan</Badge>
            )}
            {filters.registrationDateRange.from && (
              <Badge variant="secondary">Fechas</Badge>
            )}
            {(filters.planPriceRange.min || filters.planPriceRange.max) && (
              <Badge variant="secondary">Precio</Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onReset}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
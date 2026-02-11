"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Eye, Pencil, MoreHorizontal, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientStatusBadge, PlanBadge } from "@/components/ui/status-badge";
import type { Client } from "@/lib/types";
import { ClientFilters, type ClientFiltersState } from "./client-filters";
import ClientsTableSkeleton from "./clients-table-skeleton";
import { EditClientDialog } from "./edit-client-dialog";

interface ClientsTableProps {
  clients: Client[];
  isLoading?: boolean;
  slug: string;
}

export function ClientsTable({ clients, isLoading = false, slug }: ClientsTableProps) {
  const [filters, setFilters] = useState<ClientFiltersState>({
    search: "",
    status: "all",
    planId: "all",
    registrationDateRange: { from: "", to: "" },
    planPriceRange: { min: "", max: "" },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const itemsPerPage = 10;


  useEffect(() => {
    setCurrentPage(1);
  }, [filters.search, filters.status, filters.planId, filters.registrationDateRange, filters.planPriceRange]);

  const filteredClients = useMemo(() => {
    return clients
      .filter((client) => {

        const matchesSearch = !filters.search || 
          client.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          client.email.toLowerCase().includes(filters.search.toLowerCase());

        const matchesStatus = filters.status === "all" || client.status === filters.status;

        const matchesPlan = filters.planId === "all" || client.plan.name === filters.planId;

        const clientDate = new Date(client.createdAt);
        const matchesDateRange = (!filters.registrationDateRange.from && !filters.registrationDateRange.to) ||
          (clientDate >= new Date(filters.registrationDateRange.from || '1900-01-01') && 
           clientDate <= new Date(filters.registrationDateRange.to || '2100-12-31'));


        return matchesSearch && matchesStatus && matchesPlan && matchesDateRange ;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [clients, filters]);

  const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredClients.slice(startIndex, endIndex);
  }, [filteredClients, currentPage]);

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFiltersChange = (newFilters: ClientFiltersState) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "all",
    planId: "all",
      registrationDateRange: { from: "", to: "" },
      planPriceRange: { min: "", max: "" },
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status !== "all") count++;
    if (filters.planId !== "all") count++;
    if (filters.registrationDateRange.from || filters.registrationDateRange.to) count++;
    if (filters.planPriceRange.min || filters.planPriceRange.max) count++;
    return count;
  };

  if (isLoading) {
    return <ClientsTableSkeleton />;
  }

  return (
    <div className="space-y-4">

      <ClientFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
        activeFiltersCount={getActiveFiltersCount()}
      />

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg font-semibold">Todos los Clientes</CardTitle>
            <Button onClick={() => window.location.href = `/${slug}/clients/new`} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Cliente
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <span>No se encontraron clientes con los filtros aplicados</span>
                        <Button
                            variant="link"
                            onClick={handleResetFilters}
                            className="h-auto p-0"
                        >
                          Limpiar filtros
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                 paginatedClients.map((client) => (
                   <TableRow key={client.id}>
                     <TableCell>
                       <div className="flex items-center gap-3">
                         <Avatar className="h-9 w-9">
                           <AvatarFallback className="bg-primary/10 text-primary text-sm">
                             {client.name
                               .split(" ")
                               .map((n) => n[0])
                               .join("")}
                           </AvatarFallback>
                         </Avatar>
                         <div>
                           <div className="font-medium">{client.name}</div>
                           <div className="text-sm text-muted-foreground">
                             {client.email}
                           </div>
                         </div>
                       </div>
                     </TableCell>
                     <TableCell>
                       <ClientStatusBadge status={client.status} />
                     </TableCell>
                     <TableCell>
                       <PlanBadge plan={client.plan?.name} />
                     </TableCell>
                     <TableCell className="text-right">
                       <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="icon" className="h-8 w-8">
                             <MoreHorizontal className="h-4 w-4" />
                             <span className="sr-only">Open menu</span>
                           </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end">
                           <DropdownMenuItem asChild>
                             <Link href={`/${slug}/clients/${client.id}`}>
                               <Eye className="mr-2 h-4 w-4" />
                               Ver Detalles
                             </Link>
                           </DropdownMenuItem>
                           <DropdownMenuItem
                            onClick={() => {
                              setEditingClient(client);
                              setIsEditOpen(true);
                            }}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar Cliente
                          </DropdownMenuItem>
                         </DropdownMenuContent>
                       </DropdownMenu>
                     </TableCell>
                   </TableRow>
                 ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginación */}
          {filteredClients.length > 0 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                    Mostrando {paginatedClients.length} de {filteredClients.length} clientes
              </div>
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <EditClientDialog
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) {
            setEditingClient(null);
          }
        }}
        client={editingClient}
        />
    </div>
  );
}
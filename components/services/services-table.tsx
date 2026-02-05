import { Eye, MoreHorizontal, Pencil, Plus, Trash } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ClientStatusBadge, PlanBadge } from "../ui/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import Link from "next/link";
import { useState } from "react";
import { PlanDetailed } from "@/lib/types";
import { formatCOP } from "@/lib/calculate";

interface ServicesPageProps {
  services: PlanDetailed[];
  onCreate?: () => void;
  onEdit?: (service: PlanDetailed) => void;
  onDelete?: (service: PlanDetailed) => void;
}

export default function ServicesTable({
  services,
  onCreate,
  onEdit,
  onDelete,
}: ServicesPageProps) {

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Servicios</CardTitle>
        <Button onClick={onCreate} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo servicio
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Detalles</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-medium">{service.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {service.name}
                  </TableCell>
                  <TableCell>
                    {formatCOP(service.price)}
                  </TableCell>
                   <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit?.(service)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => onDelete?.(service)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

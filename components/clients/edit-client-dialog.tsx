"use client";

import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Client, PlanDetailed } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { getAllPlanByCompany, getAllPlanNamesByCompany } from "@/lib/db/plan";
import { useRouter } from "next/navigation";

interface EditClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
}
interface Plan {
  id: string;
  name: string;
}

export function EditClientDialog({
  open,
  onOpenChange,
  client,
}: EditClientDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("");
  const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);
  const router = useRouter();
  
  // Cuando cambia el cliente, refrescamos el estado
  useEffect(() => {
    if (client) {
      setName(client.name);
      setEmail(client.email);
      setPlan(client.plan?.id || "");
    }
  }, [client]);

  const handleSubmit = async () => {
    // Confirmación antes de guardar
    const confirmed = window.confirm("¿Está seguro que desea actualizar los datos de este cliente?");
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/clients/${client?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          planId: plan,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update client");
      }
      const result = await response.json();
      
      // Mostrar toast de éxito
      toast.success("Cliente actualizado correctamente");
      
      // Cerrar el diálogo después de guardar exitosamente
      onOpenChange(false);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Error updating client:", error);
      // Mostrar toast de error
      toast.error("Hubo un error al actualizar el cliente. Por favor intente nuevamente.");
    }
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await getAllPlanNamesByCompany(client?.company.id || "");
        setAvailablePlans(response);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };
    if (client?.company.id) {
      fetchPlans();
    }
  }, [client?.company.id]);

  const handlePlanChange = (value: string) => {
    setPlan(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del cliente"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@email.com"
            />
          </div>
           <div className="space-y-2">
             <Label htmlFor="plan">Plan</Label>
             <Select
               value={plan}
               onValueChange={(value) => handlePlanChange(value)}
             >
               <SelectTrigger className="w-full">
                 <SelectValue placeholder="Seleccione el Plan" />
               </SelectTrigger>
               <SelectContent>
                 {availablePlans.length > 0 ? (
                   availablePlans.map((p) => (
                     <SelectItem key={p.id} value={p.id}>
                       {p.name}
                     </SelectItem>
                   ))
                 ) : (
                   <>
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
                   </>
                 )}
               </SelectContent>
             </Select>
           </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Guardar cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

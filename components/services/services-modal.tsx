"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { PlanDetailed } from "@/lib/types";
import { formatCOP } from "@/lib/calculate";

interface ServiceModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    interval: string;
    price: number;
  }) => void;
  service?: PlanDetailed | null;
}

export default function ServiceModal({
  open,
  onClose,
  onSubmit,
  service,
}: ServiceModalProps) {
  const [name, setName] = useState("");
  const [interval, setInterval] = useState("");
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    if (service) {
      setName(service.name);
      setInterval(service.interval);
      setPrice(Number(service.price));
    } else {
      setName("");
      setInterval("");
      setPrice(0);
    }
  }, [service]);

  const handleSubmit = () => {
    onSubmit({
      name,
      interval,
      price,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {service ? "Editar servicio" : "Nuevo servicio"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nombre</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Premium"
            />
          </div>

          <div className="space-y-2">
            <Label>Intervalo</Label>
            <Input
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              placeholder="monthly / yearly"
            />
          </div>

          <div className="space-y-2">
            <Label>Precio</Label>
            <Input
              type="number"
              value={formatCOP(price).replace(/[^0-9]/g, "")}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {service ? "Guardar cambios" : "Crear"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

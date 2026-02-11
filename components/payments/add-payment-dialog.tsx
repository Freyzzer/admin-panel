"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PaymentMethod } from "@/lib/types";
import { formatCurrency } from "@/lib/calculate";
import { Plus } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  plan: {
    id: string;
    name: string;
    price: number;
  };
  lastPayment?: {
    paidAt: Date;
  };
}

interface AddPaymentDialogProps {
  companyId: string;
  onPaymentCreated?: () => void;
}

export function AddPaymentDialog({ companyId, onPaymentCreated }: AddPaymentDialogProps) {
  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("CASH");
  const [loading, setLoading] = useState(false);

  const paymentMethods: PaymentMethod[] = ["CASH", "TRANSFER", "CARD", "NEQUI", "DAVIPLATA"];

  const getPaymentMethodLabel = (method: PaymentMethod): string => {
    const labels = {
      CASH: "Efectivo",
      TRANSFER: "Transferencia",
      CARD: "Tarjeta",
      NEQUI: "Nequi",
      DAVIPLATA: "Daviplata"
    };
    return labels[method] || method;
  };

  useEffect(() => {
    if (open) {
      fetchClientsWithPendingPayments();
      setSelectedClientId("");
      setSelectedMethod("CASH");
    }
  }, [open]);

  const fetchClientsWithPendingPayments = async () => {
    try {
      const response = await fetch(`/api/clients/pending-payments?companyId=${companyId}`);
      if (response.ok) {
        const data = await response.json();
        setClients(data);
      }
    } catch (error) {
      console.error("Error fetching clients with pending payments:", error);
    }
  };

  const handleConfirmPayment = async () => {
    if (!selectedClientId) return;

    setLoading(true);
    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId: selectedClientId,
          companyId: companyId,
          method: selectedMethod,
        }),
      });

      if (response.ok) {
        setOpen(false);
        onPaymentCreated?.();
      } else {
        console.error("Error creating payment");
      }
    } catch (error) {
      console.error("Error creating payment:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedClient = clients.find(c => c.id === selectedClientId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Añadir Pago
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Añadir Nuevo Pago</DialogTitle>
          <DialogDescription>
            Selecciona un cliente con pago pendiente y el método de pago para registrar el pago.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Seleccionar Cliente con Pago Pendiente</label>
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un cliente con pago pendiente..." />
              </SelectTrigger>
              <SelectContent>
                {clients.length === 0 ? (
                  <div className="px-2 py-2 text-sm text-gray-500">
                    No hay clientes con pagos pendientes
                  </div>
                ) : (
                  clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      <div className="flex flex-col">
                        <span>{client.name} - {client.email}</span>
                        {client.lastPayment ? (
                          <span className="text-xs text-orange-600">
                            Último pago: {new Date(client.lastPayment.paidAt).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-xs text-red-600">
                            Sin pagos registrados
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {selectedClient && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Plan del Cliente</label>
              <div className="p-3 bg-gray-50 rounded-md">
                <div className="font-medium">{selectedClient.plan.name}</div>
                <div className="text-lg font-semibold text-green-600">
                  {formatCurrency(selectedClient.plan.price)}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Método de Pago</label>
            <Select value={selectedMethod} onValueChange={(value: PaymentMethod) => setSelectedMethod(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona método de pago" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {getPaymentMethodLabel(method)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmPayment} 
            disabled={!selectedClientId || loading}
          >
            {loading ? "Confirmando..." : "Confirmar Pago"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
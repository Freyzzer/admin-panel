"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import ServiceModal from "@/components/services/services-modal";
import ServicesTable from "@/components/services/services-table";
import { PlanDetailed } from "@/lib/types";
import { useAuthStore } from "@/store/auth-store";
import { useEffect, useState } from "react";

export default function ServicesPage() {
  const [services, setServices] = useState<PlanDetailed[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedService, setSelectedService] = useState<PlanDetailed | null>(
    null,
  );
  const user = useAuthStore((s) => s.user);

  const handleCreate = () => {
    setSelectedService(null);
    setOpenModal(true);
  };

  const handleEdit = (service: PlanDetailed) => {
    setSelectedService(service);
    setOpenModal(true);
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        console.log(user);
        const response = await fetch("/api/services");
        if (!response.ok) {
          console.error("Failed to fetch services");
          return;
        }
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/services/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete service");
      }
      setServices(services.filter((service) => service.id !== id));
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const handleSubmit = async (data: {
    name: string;
    interval: string;
    price: number;
  }) => {
    if (selectedService) {
      // EDITAR
      await fetch(`/api/services?id=${selectedService.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      // CREAR
      await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data
        }),
      });
    }

    setOpenModal(false);
  };

  return (
    <DashboardLayout
title="Planes"
      description="Gestiona tus planes de servicio y precios"
    >
      <ServicesTable
        services={services}
        onDelete={(service) => handleDelete(service.id)}
        onCreate={handleCreate}
        onEdit={handleEdit}
      />
      <ServiceModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        service={selectedService}
        onSubmit={handleSubmit}
      />
    </DashboardLayout>
  );
}

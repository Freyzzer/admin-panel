"use client";

import { Mail, Phone, Building, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ClientStatusBadge, PlanBadge } from "@/components/ui/status-badge";
import type { Client } from "@/lib/types";
import { formatDate } from "@/lib/mock-data";

interface ClientInfoCardProps {
  client: Client;
  onMarkAsPaid?: () => void;
  onSuspend?: () => void;
  onCancel?: () => void;
}

export function ClientInfoCard({
  client,
  onMarkAsPaid,
  onSuspend,
  onCancel,
}: ClientInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {client.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{client.name}</CardTitle>
              <div className="mt-1 flex items-center gap-2">
                <ClientStatusBadge status={client.status} />
                <PlanBadge plan={client.plan} />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={onMarkAsPaid} size="sm">
              Mark as Paid
            </Button>
            {client.status !== "suspended" && (
              <Button onClick={onSuspend} variant="outline" size="sm">
                Suspend Service
              </Button>
            )}
            {client.status !== "cancelled" && (
              <Button onClick={onCancel} variant="destructive" size="sm">
                Cancel Service
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-muted p-2.5">
              <Mail className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium">{client.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-muted p-2.5">
              <Phone className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm font-medium">{client.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-muted p-2.5">
              <Building className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Company</p>
              <p className="text-sm font-medium">{client.company}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-muted p-2.5">
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Member Since</p>
              <p className="text-sm font-medium">{formatDate(client.joinedAt)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

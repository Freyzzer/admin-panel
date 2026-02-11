"use client";

import React, { useEffect } from "react"

import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { useAuthStore } from "@/store/auth-store";
import { Toaster } from "sonner";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function DashboardLayout({
  children,
  title,
  description,
}: DashboardLayoutProps) {

  const setUser = useAuthStore((s) => s.setUser)  

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => setUser(data?.user || null))
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-64 transition-all duration-300">
        <Header title={title} description={description} />
        <main className="p-6">{children}</main>
      </div>
      <Toaster />
    </div>
  );
}

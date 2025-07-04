"use client";
import { ReactNode } from "react";
import { AuthProvider } from "@/lib/auth";
import DashboardHeader from "@/components/ui/dashboard-header";
import DashboardSidebar from "@/components/ui/dashboard-sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <div className="flex flex-1">
          <DashboardSidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </AuthProvider>
  );
} 
"use client";
import { ReactNode } from "react";
import { AuthProvider } from "@/lib/auth";
import { AppSidebar } from "@/components/dashboard/sidebar/page";
import { SiteHeader } from "@/components/dashboard/header/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SidebarProvider>
          <SidebarInset>
            <main className="flex-1">
              {children}
            </main>
          </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
} 
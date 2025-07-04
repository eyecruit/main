"use client";
import Link from "next/link";
import { IconHome, IconUser, IconSettings } from "@tabler/icons-react";

export default function DashboardSidebar() {
  return (
    <aside className="border-r w-64 p-6 hidden md:block">
      <nav className="space-y-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
        >
          <IconHome className="size-4" />
          Dashboard
        </Link>
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
        >
          <IconUser className="size-4" />
          Profile
        </Link>
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
        >
          <IconSettings className="size-4" />
          Settings
        </Link>
      </nav>
    </aside>
  );
} 
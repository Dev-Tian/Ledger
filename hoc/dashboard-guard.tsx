"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { AuthGuard } from "@/hoc/withAuth";

export function DashboardGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const requiredRole = pathname.startsWith("/dashboard/admin")
    ? "admin"
    : pathname.startsWith("/dashboard/viewer")
      ? "viewer"
      : "employee";

  return <AuthGuard requiredRole={requiredRole}>{children}</AuthGuard>;
}

"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { AuthGuard } from "@/hoc/withAuth";

export function DashboardGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const requiredRole = pathname.startsWith("/admin")
    ? "admin"
    : pathname.startsWith("/uploader")
      ? "uploader"
      : pathname.startsWith("/viewer")
        ? "viewer"
        : "employee";

  return <AuthGuard requiredRole={requiredRole}>{children}</AuthGuard>;
}

import { Suspense } from "react"

import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardGuard } from "@/hoc/dashboard-guard"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={<div className="min-h-svh bg-blue-50" />}>
      <DashboardGuard>
        <DashboardShell>{children}</DashboardShell>
      </DashboardGuard>
    </Suspense>
  )
}

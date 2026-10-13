import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardGuard } from "@/hoc/dashboard-guard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardGuard>
      <DashboardShell>{children}</DashboardShell>
    </DashboardGuard>
  )
}

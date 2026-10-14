import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardGuard } from "@/hoc/dashboard-guard"

export const instant = false

export default function UploaderLayout({
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

"use client"

import { useState } from "react"
import { BookOpen, Building2, CalendarClock, Receipt, Users, type LucideIcon } from "lucide-react"

import { ExcelUploadModal } from "@/components/excel-upload-modal"
import { apiService } from "@/lib/apiService"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const statuses: { label: string; value: number; icon: LucideIcon }[] = [
  { label: "Total Accounts", value: 1, icon: BookOpen },
  { label: "Total users", value: 0, icon: Users },
  { label: "Total branches", value: 2, icon: Building2 },
]

const areas: { title: string; description: string; icon: LucideIcon }[] = [
 
  {
    title: "Installment",
    description: "Upload installment records that set or update an account schedule.",
    icon: CalendarClock,
  },
  {
    title: "Payment",
    description: "Upload payment records for collections posted against installment accounts.",
    icon: Receipt,
  },
]

export default function AdminDashboardPage() {
  const [uploadTitle, setUploadTitle] = useState<string | null>(null)

  return (
    <section className="flex flex-col gap-8">
      <div className="grid gap-4 md:grid-cols-3">
        {statuses.map((status) => (
          <Card key={status.label} className="rounded-3xl bg-white shadow-md ring-blue-100">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardDescription className="text-sm font-medium text-blue-800">
                  {status.label}
                </CardDescription>
                <CardTitle className="mt-2 text-3xl tabular-nums">{status.value}</CardTitle>
              </div>
              <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-800 to-sky-500 text-white">
                <status.icon className="size-5" />
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {areas.map((area) => (
          <button
            key={area.title}
            type="button"
            className="group text-left"
            onClick={() => setUploadTitle(area.title)}
          >
            <Card className="h-full rounded-3xl bg-white shadow-md ring-blue-100 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:ring-blue-400">
              <CardHeader className="flex flex-col gap-4">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-800 to-sky-500 text-white">
                  <area.icon className="size-5" />
                </div>
                <CardTitle className="text-base">{area.title}</CardTitle>
                <CardDescription className="leading-6">
                  {area.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </button>
        ))}
      </div>
      <ExcelUploadModal
        open={uploadTitle !== null}
        onOpenChangeAction={(open) => {
          if (!open) setUploadTitle(null)
        }}
        title={uploadTitle ?? "Payment"}
        onUpload={
          uploadTitle === "Installment"
            ? (rows) => apiService.uploadInstallments(rows).then(() => undefined)
            : uploadTitle === "Payment"
              ? (rows) => apiService.uploadPayments(rows).then(() => undefined)
              : undefined
        }
      />
    </section>
  )
}

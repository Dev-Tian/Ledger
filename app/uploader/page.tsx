"use client"

import { useEffect, useState } from "react"
import { BookOpen, Building2, CalendarClock, Receipt, Users, type LucideIcon } from "lucide-react"

import { ExcelUploadModal } from "@/components/excel-upload-modal"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

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

export default function UploaderDashboardPage() {
  const [uploadTitle, setUploadTitle] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 600)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <section className="flex flex-col gap-8">
      <div className="grid gap-4 md:grid-cols-3">
        {loading
          ? statuses.map((status) => (
              <Card
                key={status.label}
                className="animate-overview-in rounded-3xl bg-white shadow-md ring-blue-100"
              >
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <div className="flex flex-col gap-3">
                    <Skeleton className="h-4 w-28 bg-blue-100" />
                    <Skeleton className="h-8 w-16 bg-blue-100" />
                  </div>
                  <Skeleton className="size-11 rounded-2xl bg-blue-100" />
                </CardHeader>
              </Card>
            ))
          : statuses.map((status, index) => (
              <Card
                key={status.label}
                className="animate-overview-in rounded-3xl bg-white shadow-md ring-blue-100"
                style={{ animationDelay: `${index * 70}ms` }}
              >
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
        {areas.map((area, index) => (
          <button
            key={area.title}
            type="button"
            className="group animate-overview-in text-left"
            style={{ animationDelay: `${220 + index * 80}ms` }}
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
      />
    </section>
  )
}

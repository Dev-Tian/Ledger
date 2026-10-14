"use client"

import { useState } from "react"
import { CalendarClock, Receipt, type LucideIcon } from "lucide-react"

import { ExcelUploadModal } from "@/components/excel-upload-modal"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const areas: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "Payment",
    description: "Upload payment records for collections posted against installment accounts.",
    icon: Receipt,
  },
  {
    title: "Installment",
    description: "Upload installment records that set or update an account schedule.",
    icon: CalendarClock,
  },
]

export default function AdminDashboardPage() {
  const [uploadTitle, setUploadTitle] = useState<string | null>(null)

  return (
    <section className="flex flex-col gap-8">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-800 via-blue-700 to-sky-500 px-8 py-8 text-white shadow-md">
        <p className="text-xs font-medium tracking-[0.16em] text-blue-100 uppercase">
          Admin
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-blue-50">
          Upload payment records and installment records.
        </p>
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
      />
    </section>
  )
}

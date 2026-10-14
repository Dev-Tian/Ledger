import Link from "next/link"
import { BookOpen, History, UserRound } from "lucide-react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const instant = false

const areas = [
  {
    href: "/uploader/customer-setup",
    title: "Customer setup",
    description: "Enter one customer and the loan that starts the installment plan.",
    icon: UserRound,
  },
  {
    href: "/uploader/loan-ledger",
    title: "Loan ledger",
    description: "Review balances, terms, and the schedule for each account.",
    icon: BookOpen,
  },
  {
    href: "/uploader/payment-history",
    title: "Payment history",
    description: "See the collections posted against each installment.",
    icon: History,
  },
]

export default function UploaderDashboardPage() {
  return (
    <section className="flex flex-col gap-8">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-800 via-blue-700 to-sky-500 px-8 py-8 text-white shadow-md">
        <p className="text-xs font-medium tracking-[0.16em] text-blue-100 uppercase">
          Uploader
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-blue-50">
          Customer setup, the loan ledger, and payment history.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {areas.map((area) => (
          <Link key={area.href} href={area.href} className="group">
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
          </Link>
        ))}
      </div>
    </section>
  )
}

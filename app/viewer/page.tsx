import Link from "next/link"
import { BookOpen, CalendarClock, History, UserRound } from "lucide-react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const instant = false

const areas = [
  {
    href: "/viewer/customer-setup",
    title: "Customer setup",
    description: "Customer records for installment accounts.",
    icon: UserRound,
  },
  {
    href: "/viewer/loan-ledger",
    title: "Loan ledger",
    description: "Balances, terms, and the schedule for each account.",
    icon: BookOpen,
  },
  {
    href: "/viewer/payment-history",
    title: "Payment history",
    description: "Collections posted against each installment.",
    icon: History,
  },
  {
    href: "/viewer/manual-aging",
    title: "Manual aging",
    description: "Past-due balances grouped by how long they have been outstanding.",
    icon: CalendarClock,
  },
]

export default function ViewerDashboardPage() {
  return (
    <section className="flex flex-col gap-8">
      <div className="max-w-xl">
        <p className="text-sm font-medium text-blue-700">Viewer</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-2 leading-7 text-muted-foreground">
          Customer setup, the loan ledger, payment history, and manual aging.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {areas.map((area) => (
          <Link key={area.href} href={area.href} className="group">
            <Card className="h-full shadow-md ring-blue-200 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:ring-blue-400">
              <CardHeader className="flex flex-col gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-blue-600 text-white">
                  <area.icon className="size-5" />
                </div>
                <CardTitle>{area.title}</CardTitle>
                <CardDescription>{area.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}

import Link from "next/link"
import { BookOpen, History, UserCog, UserRound, Users } from "lucide-react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const areas = [
  {
    href: "/dashboard/admin/customer-setup",
    title: "Customer setup",
    description: "Enter one customer and the loan that starts the installment plan.",
    icon: UserRound,
  },
  {
    href: "/dashboard/admin/loan-ledger",
    title: "Loan ledger",
    description: "Review balances, terms, and the schedule for each account.",
    icon: BookOpen,
  },
  {
    href: "/dashboard/admin/payment-history",
    title: "Payment history",
    description: "See the collections posted against each installment.",
    icon: History,
  },
  {
    href: "/dashboard/admin/accounts",
    title: "Accounts",
    description: "Look across the installment accounts the branch is carrying.",
    icon: Users,
  },
  {
    href: "/dashboard/admin/user-management",
    title: "User management",
    description: "Add and review the people who can sign in to the ledger.",
    icon: UserCog,
  },
]

export default function AdminDashboardPage() {
  return (
    <section className="flex flex-col gap-8">
      <div className="max-w-xl">
        <p className="text-sm font-medium text-blue-700">Admin</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-2 leading-7 text-muted-foreground">
          Customer setup, the loan ledger, payment history, accounts, and user
          management.
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

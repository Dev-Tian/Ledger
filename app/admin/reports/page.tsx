"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { BookOpen, Receipt, RefreshCw, Scale, Search, Wallet, type LucideIcon } from "lucide-react"

import { ledgerCustomers } from "@/components/ledger-customers"
import { LoadingState } from "@/components/loading-state"
import { TableEmpty } from "@/components/table-empty"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
})

const columns = [
  "Internal ID",
  "Customer name",
  "Location",
  "Status",
  "Collected",
  "Balance due",
  "Unrecovered cost",
  "Actions",
]

const statuses = ["All", "Current", "Fully paid"] as const

function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean)
  const letters = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "")
  return letters.join("") || "?"
}

export default function AdminReportsPage() {
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<(typeof statuses)[number]>("All")

  const totals = useMemo(
    () =>
      ledgerCustomers.reduce(
        (sum, customer) => ({
          accounts: sum.accounts + 1,
          collected: sum.collected + customer.totalPayments,
          balanceDue: sum.balanceDue + customer.totalBalanceDue,
          unrecovered: sum.unrecovered + customer.unrecoveredCost,
        }),
        { accounts: 0, collected: 0, balanceDue: 0, unrecovered: 0 },
      ),
    [],
  )

  const shown = useMemo(() => {
    const text = query.trim().toLowerCase()
    return ledgerCustomers.filter((customer) => {
      const matchesStatus = status === "All" || customer.loanStatus === status
      if (!matchesStatus) return false
      if (!text) return true
      return [customer.internalId, customer.customerName, customer.location, customer.salesOrderNo, customer.loanStatus].some(
        (value) => value.toLowerCase().includes(text),
      )
    })
  }, [query, status])

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 600)
    return () => window.clearTimeout(timer)
  }, [reloadKey])

  function refresh() {
    setLoading(true)
    setReloadKey((key) => key + 1)
  }

  const summary: { label: string; value: string; icon: LucideIcon; amber?: boolean }[] = [
    { label: "Accounts", value: String(totals.accounts), icon: BookOpen },
    { label: "Collected", value: peso.format(totals.collected), icon: Receipt },
    { label: "Balance due", value: peso.format(totals.balanceDue), icon: Scale },
    { label: "Unrecovered cost", value: peso.format(totals.unrecovered), icon: Wallet, amber: true },
  ]

  return (
    <section className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <Card key={item.label} className="rounded-3xl bg-white shadow-md ring-blue-100">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardDescription className="text-sm font-medium text-blue-800">
                  {item.label}
                </CardDescription>
                <CardTitle
                  className={
                    item.amber
                      ? "mt-2 w-fit rounded-lg bg-amber-200 px-3 py-1 text-2xl tabular-nums text-blue-950"
                      : "mt-2 text-2xl tabular-nums text-blue-950"
                  }
                >
                  {item.value}
                </CardTitle>
              </div>
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-800 to-sky-500 text-white">
                <item.icon className="size-5" />
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-blue-200">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-blue-100 px-5 py-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-blue-950">Reports</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Account balances, collections, and unrecovered cost.
            </p>
          </div>
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            <div className="flex rounded-xl bg-blue-50 p-1">
              {statuses.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={
                    status === item
                      ? "cursor-pointer rounded-lg bg-blue-800 px-3 py-1.5 text-sm font-medium text-white"
                      : "cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium text-blue-800 hover:bg-white"
                  }
                  onClick={() => setStatus(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="relative min-w-64 flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name, ID, or location"
                className="h-10 bg-blue-50/60 pl-9"
              />
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="action-hover h-10 bg-blue-500 px-3 text-white"
              disabled={loading}
              onClick={refresh}
            >
              <RefreshCw />
              Refresh
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader className="bg-blue-50/80 text-blue-950">
            <TableRow className="hover:bg-transparent">
              {columns.map((column) => (
                <TableHead
                  key={column}
                  className="h-11 px-5 text-xs font-semibold tracking-wide text-blue-800 uppercase"
                >
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="px-5">
                  <LoadingState />
                </TableCell>
              </TableRow>
            ) : shown.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="px-5 py-6 text-center">
                  <TableEmpty label="No accounts match that report." />
                </TableCell>
              </TableRow>
            ) : (
              shown.map((customer) => (
                <TableRow key={customer.internalId} className="hover:bg-blue-50/70">
                  <TableCell className="px-5 py-3">
                    <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold tracking-wide text-blue-800 ring-1 ring-blue-200">
                      {customer.internalId}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-800 text-xs font-semibold text-white">
                        {initials(customer.customerName)}
                      </span>
                      <span className="font-medium text-blue-950">{customer.customerName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-3 text-blue-950/80">{customer.location}</TableCell>
                  <TableCell className="px-5 py-3">
                    <span
                      className={
                        customer.loanStatus === "Fully paid"
                          ? "inline-flex rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold tracking-wide text-sky-800 ring-1 ring-sky-200"
                          : "inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold tracking-wide text-blue-800 ring-1 ring-blue-200"
                      }
                    >
                      {customer.loanStatus}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-3 tabular-nums text-blue-950">
                    {peso.format(customer.totalPayments)}
                  </TableCell>
                  <TableCell className="px-5 py-3 tabular-nums text-blue-950">
                    {peso.format(customer.totalBalanceDue)}
                  </TableCell>
                  <TableCell className="px-5 py-3">
                    <span className="inline-flex rounded-lg bg-amber-200 px-2.5 py-1 text-sm font-semibold tabular-nums text-blue-950">
                      {peso.format(customer.unrecoveredCost)}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-3">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="action-hover bg-blue-500 text-white"
                    >
                      <Link
                        href={`/admin/account-ledger/${encodeURIComponent(customer.internalId)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}

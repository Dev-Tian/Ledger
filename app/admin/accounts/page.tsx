"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { RefreshCw, Search } from "lucide-react"

import { TableEmpty } from "@/components/table-empty"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoadingState } from "@/components/loading-state"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const columns = [
  "Internal ID",
  "Customer name",
  "Date of purchase",
  "Sales order No.",
  "Location",
  "Actions",
]

type Account = {
  internalId: string
  customerName: string
  purchaseDate: string
  salesOrderNo: string
  location: string
}

function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean)
  const letters = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "")
  return letters.join("") || "?"
}

const accounts: Account[] = [
  {
    internalId: "ACC-1001",
    customerName: "Maria Santos",
    purchaseDate: "Oct 14, 2026",
    salesOrderNo: "SO-24081",
    location: "Cebu",
  },
]

export default function AdminAccountsPage() {
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)
  const [query, setQuery] = useState("")
  const shown = useMemo(() => {
    const text = query.trim().toLowerCase()
    if (!text) return accounts
    return accounts.filter((account) =>
      [account.internalId, account.customerName, account.purchaseDate, account.salesOrderNo, account.location].some(
        (value) => value.toLowerCase().includes(text),
      ),
    )
  }, [query])

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 600)
    return () => window.clearTimeout(timer)
  }, [reloadKey])

  function refresh() {
    setLoading(true)
    setReloadKey((key) => key + 1)
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-blue-200">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-blue-100 px-5 py-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-blue-950">Accounts</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Installment accounts managed by an administrator.
            </p>
          </div>
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            <div className="relative min-w-64 flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name, ID, sales order, or location"
                className="h-10 bg-blue-50/60 pl-9"
              />
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-10 px-3"
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
                  <TableEmpty
                    label={accounts.length === 0 ? "" : "No accounts match that search."}
                  />
                </TableCell>
              </TableRow>
            ) : (
              shown.map((account) => (
                <TableRow key={account.internalId} className="hover:bg-blue-50/70">
                  <TableCell className="px-5 py-3">
                    <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold tracking-wide text-blue-800 ring-1 ring-blue-200">
                      {account.internalId}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-800 text-xs font-semibold text-white">
                        {initials(account.customerName)}
                      </span>
                      <span className="font-medium text-blue-950">{account.customerName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-3 text-blue-950/80">{account.purchaseDate}</TableCell>
                  <TableCell className="px-5 py-3">
                    <span className="inline-flex rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold tracking-wide text-sky-800 ring-1 ring-sky-200">
                      {account.salesOrderNo}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-3 text-blue-950/80">{account.location}</TableCell>
                  <TableCell className="px-5 py-3">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="bg-white"
                    >
                      <Link
                        href={`/admin/account-ledger/${encodeURIComponent(account.internalId)}`}
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

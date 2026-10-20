"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { RefreshCw, Search } from "lucide-react"

import { LoadingState } from "@/components/loading-state"
import { TableEmpty } from "@/components/table-empty"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { apiService, toApiErrorMessage } from "@/lib/apiService"

const columns = [
  "Internal ID",
  "Customer name",
  "Date of purchase",
  "Sales order No.",
  "Location",
  "Actions",
]

type Account = {
  id: string
  internalId: string
  customerName: string
  purchaseDate: string
  salesOrderNo: string
  location: string
}

const purchaseDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
})

function formatPurchaseDate(value: string) {
  const date = new Date(`${value.slice(0, 10)}T00:00:00`)
  if (!value || Number.isNaN(date.getTime())) return value || "—"
  return purchaseDate.format(date)
}

function textOf(value: unknown) {
  return typeof value === "string" || typeof value === "number" ? String(value) : ""
}

function locationOf(value: unknown) {
  if (typeof value === "string" || typeof value === "number") return String(value)
  if (value && typeof value === "object") {
    const record = value as { location_name?: unknown; name?: unknown }
    return textOf(record.location_name) || textOf(record.name)
  }
  return ""
}

function readAccounts(payload: unknown): Account[] {
  if (!payload || typeof payload !== "object") return []
  const accounts = (payload as { accounts?: { data?: unknown } | unknown[] }).accounts
  const list = Array.isArray(accounts)
    ? accounts
    : accounts && typeof accounts === "object" && Array.isArray(accounts.data)
      ? accounts.data
      : []
  return list.flatMap((item) => {
    if (!item || typeof item !== "object") return []
    const row = item as Record<string, unknown>
    const id = textOf(row.id)
    if (!id) return []
    return [
      {
        id,
        internalId: textOf(row.internal_id) || "—",
        customerName: textOf(row.customer_name) || "—",
        purchaseDate: formatPurchaseDate(textOf(row.purchase_date)),
        salesOrderNo: textOf(row.so_number) || "—",
        location: locationOf(row.location) || "—",
      },
    ]
  })
}

function readAccountPage(payload: unknown, count: number) {
  const record =
    payload && typeof payload === "object"
      ? (payload as { accounts?: { current_page?: number; last_page?: number } }).accounts
      : null
  const currentPage = record?.current_page && record.current_page > 0 ? record.current_page : 1
  const lastPage = record?.last_page && record.last_page > 0 ? record.last_page : 1
  return { currentPage, lastPage: Math.max(lastPage, count > 0 ? 1 : 1) }
}

function pageNumbers(current: number, last: number) {
  if (last <= 7) return Array.from({ length: last }, (_, index) => index + 1)
  const items: (number | "ellipsis")[] = [1]
  if (current > 3) items.push("ellipsis")
  for (let page = Math.max(2, current - 1); page <= Math.min(last - 1, current + 1); page += 1) {
    items.push(page)
  }
  if (current < last - 2) items.push("ellipsis")
  items.push(last)
  return items
}

function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean)
  const letters = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "")
  return letters.join("") || "?"
}

export function AccountsTable({
  description,
  ledgerBasePath,
}: {
  description: string
  ledgerBasePath: string
}) {
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)
  const [query, setQuery] = useState("")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const next = query.trim()
      setSearch((current) => {
        if (current !== next) setPage(1)
        return next
      })
    }, 300)
    return () => window.clearTimeout(timer)
  }, [query])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError("")
      try {
        const data = await apiService.getAccounts(page, search)
        if (!cancelled) {
          const next = readAccounts(data)
          const pager = readAccountPage(data, next.length)
          setAccounts(next)
          setPage(pager.currentPage)
          setLastPage(pager.lastPage)
        }
      } catch (loadError) {
        if (!cancelled) {
          setAccounts([])
          setError(toApiErrorMessage(loadError, "Accounts could not be loaded."))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [page, reloadKey, search])

  function refresh() {
    setLoading(true)
    setReloadKey((key) => key + 1)
  }

  return (
    <section className="flex h-[calc(100svh-11.5rem)] min-h-0 flex-col sm:h-[calc(100svh-12.5rem)]">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-blue-200">
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-b border-blue-100 px-5 py-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-blue-950">Accounts</h1>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
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
              className="h-10 cursor-pointer bg-blue-500 px-3 text-white shadow-sm transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-blue-600 hover:text-white hover:shadow-md"
              disabled={loading}
              onClick={refresh}
            >
              <RefreshCw />
              Refresh
            </Button>
          </div>
        </div>
        <Table containerClassName="min-h-0 flex-1 overflow-y-auto">
          <TableHeader className="sticky top-0 z-10 bg-blue-50 text-blue-950">
            <TableRow className="hover:bg-transparent">
              {columns.map((column) => (
                <TableHead
                  key={column}
                  className="h-11 bg-blue-50 px-5 text-xs font-semibold tracking-wide text-blue-800 uppercase"
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
            ) : error || accounts.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="px-5 py-6 text-center">
                  <TableEmpty
                    label={
                      error ||
                      (search ? "No accounts match that search." : "No accounts are listed yet.")
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              accounts.map((account) => (
                <TableRow key={account.id} className="hover:bg-blue-50/70">
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
                      className="action-hover bg-blue-500 text-white"
                    >
                      <Link
                        href={`${ledgerBasePath}/${encodeURIComponent(account.id)}`}
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
        <div className="shrink-0 border-t border-blue-100 bg-blue-50/50 px-4 py-3">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  text="Previous"
                  className={page <= 1 ? "pointer-events-none opacity-40" : "text-blue-950"}
                  onClick={(event) => {
                    event.preventDefault()
                    if (page > 1) setPage(page - 1)
                  }}
                />
              </PaginationItem>
              {pageNumbers(page, lastPage).map((item, index) => (
                <PaginationItem key={item === "ellipsis" ? `ellipsis-${index}` : item}>
                  {item === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      isActive={item === page}
                      className={
                        item === page
                          ? "border-blue-800 bg-blue-800 text-white hover:bg-blue-900 hover:text-white"
                          : "text-blue-950"
                      }
                      onClick={(event) => {
                        event.preventDefault()
                        setPage(item)
                      }}
                    >
                      {item}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  text="Next"
                  className={page >= lastPage ? "pointer-events-none opacity-40" : "text-blue-950"}
                  onClick={(event) => {
                    event.preventDefault()
                    if (page < lastPage) setPage(page + 1)
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </section>
  )
}

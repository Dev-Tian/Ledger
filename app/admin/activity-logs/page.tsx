"use client"

import { useEffect, useMemo, useState } from "react"
import { RefreshCw, Search } from "lucide-react"

import { LoadingState } from "@/components/loading-state"
import { TableEmpty } from "@/components/table-empty"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const columns = ["When", "User", "Action", "Area", "Detail"]

const areas = ["All", "Users", "Uploads", "Accounts"] as const

type Activity = {
  id: string
  when: string
  user: string
  action: "Updated" | "Uploaded" | "Added" | "Deleted"
  area: (typeof areas)[number]
  detail: string
}

const logs: Activity[] = [
  {
    id: "log-1",
    when: "Oct 16, 2026, 3:12 PM",
    user: "Admin",
    action: "Updated",
    area: "Users",
    detail: "Changed a user role",
  },
  {
    id: "log-2",
    when: "Oct 16, 2026, 1:26 PM",
    user: "Admin",
    action: "Uploaded",
    area: "Uploads",
    detail: "Uploaded a payment spreadsheet",
  },
  {
    id: "log-3",
    when: "Oct 16, 2026, 11:40 AM",
    user: "Admin",
    action: "Uploaded",
    area: "Uploads",
    detail: "Uploaded an installment spreadsheet",
  },
  {
    id: "log-4",
    when: "Oct 16, 2026, 10:05 AM",
    user: "Admin",
    action: "Added",
    area: "Users",
    detail: "Added an employee account",
  },
  {
    id: "log-5",
    when: "Oct 15, 2026, 4:18 PM",
    user: "Admin",
    action: "Updated",
    area: "Accounts",
    detail: "Opened account ACC-1001",
  },
]

function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean)
  const letters = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "")
  return letters.join("") || "?"
}

function actionClass(action: Activity["action"]) {
  if (action === "Deleted") return "bg-red-50 text-red-700 ring-red-200"
  if (action === "Uploaded") return "bg-sky-50 text-sky-800 ring-sky-200"
  if (action === "Added") return "bg-emerald-50 text-emerald-800 ring-emerald-200"
  return "bg-blue-50 text-blue-800 ring-blue-200"
}

export default function AdminActivityLogsPage() {
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)
  const [query, setQuery] = useState("")
  const [area, setArea] = useState<(typeof areas)[number]>("All")

  const shown = useMemo(() => {
    const text = query.trim().toLowerCase()
    return logs.filter((log) => {
      if (area !== "All" && log.area !== area) return false
      if (!text) return true
      return [log.user, log.action, log.area, log.detail, log.when].some((value) =>
        value.toLowerCase().includes(text),
      )
    })
  }, [query, area])

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
            <h1 className="text-2xl font-semibold tracking-tight text-blue-950">Activity logs</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign-ins, user changes, and spreadsheet uploads on the ledger.
            </p>
          </div>
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            <div className="flex rounded-xl bg-blue-50 p-1">
              {areas.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={
                    area === item
                      ? "cursor-pointer rounded-lg bg-blue-800 px-3 py-1.5 text-sm font-medium text-white"
                      : "cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium text-blue-800 hover:bg-white"
                  }
                  onClick={() => setArea(item)}
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
                placeholder="Search by user, action, or detail"
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
                  <TableEmpty label="No activity matches that filter." />
                </TableCell>
              </TableRow>
            ) : (
              shown.map((log) => (
                <TableRow key={log.id} className="hover:bg-blue-50/70">
                  <TableCell className="px-5 py-3 whitespace-nowrap text-blue-950/80">
                    {log.when}
                  </TableCell>
                  <TableCell className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-800 text-xs font-semibold text-white">
                        {initials(log.user)}
                      </span>
                      <span className="font-medium text-blue-950">{log.user}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide ring-1 ${actionClass(log.action)}`}
                    >
                      {log.action}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-3">
                    <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold tracking-wide text-blue-800 ring-1 ring-blue-200">
                      {log.area}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-3 text-blue-950">{log.detail}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}

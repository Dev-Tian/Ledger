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
import { apiService, toApiErrorMessage } from "@/lib/apiService"
import { subscribeActivityLogs } from "@/lib/echo"

const columns = ["When", "User", "Action", "Area", "Detail"]

const areas = ["All", "Users", "Uploads", "Accounts"] as const

type ActivityAction = "Updated" | "Uploaded" | "Added" | "Deleted"

type Activity = {
  id: string
  when: string
  user: string
  action: ActivityAction
  area: Exclude<(typeof areas)[number], "All"> | "Other"
  detail: string
}

const whenFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
})

function textOf(value: unknown) {
  return typeof value === "string" || typeof value === "number" ? String(value) : ""
}

function formatWhen(value: string) {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return whenFormat.format(date)
}

function inferAction(detail: string): ActivityAction {
  const text = detail.toLowerCase()
  if (text.includes("upload")) return "Uploaded"
  if (text.includes("delet") || text.includes("removed")) return "Deleted"
  if (text.includes("add") || text.includes("created")) return "Added"
  return "Updated"
}

function inferArea(detail: string, action: ActivityAction): Activity["area"] {
  const text = detail.toLowerCase()
  if (text.includes("user") || text.includes("role") || text.includes("employee")) return "Users"
  if (text.includes("upload") || text.includes("installment") || text.includes("payment") || text.includes("spreadsheet")) {
    return "Uploads"
  }
  if (text.includes("account") || text.includes("ledger")) return "Accounts"
  if (action === "Uploaded") return "Uploads"
  if (action === "Added" || action === "Deleted") return "Users"
  return "Other"
}

function inferUser(detail: string, fallback: string) {
  if (fallback) return fallback
  const match = detail.match(/^(.+?)\s+(uploaded|added|updated|deleted|removed)/i)
  return match?.[1]?.trim() || "—"
}

function mapLogItem(item: unknown): Activity | null {
  if (!item || typeof item !== "object") return null
  const row = item as Record<string, unknown>
  const id = textOf(row.id)
  const detail = textOf(row.info) || textOf(row.detail) || textOf(row.message)
  if (!id && !detail) return null
  const action =
    row.action === "Updated" ||
    row.action === "Uploaded" ||
    row.action === "Added" ||
    row.action === "Deleted"
      ? row.action
      : inferAction(detail)
  const areaValue = textOf(row.area)
  const area =
    areaValue === "Users" || areaValue === "Uploads" || areaValue === "Accounts"
      ? areaValue
      : inferArea(detail, action)
  const user =
    textOf(row.user) ||
    textOf(row.user_name) ||
    textOf((row.user as { name?: unknown } | undefined)?.name) ||
    inferUser(detail, "")
  return {
    id: id || detail,
    when: formatWhen(textOf(row.created_at) || textOf(row.when)),
    user,
    action,
    area,
    detail: detail || "—",
  }
}

function readLogs(payload: unknown): Activity[] {
  if (!payload || typeof payload !== "object") return []
  const record = payload as {
    logs?: { data?: unknown } | unknown[]
    data?: unknown
  }
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(record.logs)
      ? record.logs
      : record.logs && typeof record.logs === "object" && Array.isArray(record.logs.data)
        ? record.logs.data
        : Array.isArray(record.data)
          ? record.data
          : []

  return list.flatMap((item) => {
    const mapped = mapLogItem(item)
    return mapped ? [mapped] : []
  })
}

function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean)
  const letters = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "")
  return letters.join("") || "?"
}

function actionClass(action: ActivityAction) {
  if (action === "Deleted") return "bg-red-50 text-red-700 ring-red-200"
  if (action === "Uploaded") return "bg-sky-50 text-sky-800 ring-sky-200"
  if (action === "Added") return "bg-emerald-50 text-emerald-800 ring-emerald-200"
  return "bg-blue-50 text-blue-800 ring-blue-200"
}

export default function AdminActivityLogsPage() {
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)
  const [query, setQuery] = useState("")
  const [search, setSearch] = useState("")
  const [area, setArea] = useState<(typeof areas)[number]>("All")
  const [logs, setLogs] = useState<Activity[]>([])
  const [error, setError] = useState("")

  const shown = useMemo(() => {
    if (area === "All") return logs
    return logs.filter((log) => log.area === area)
  }, [logs, area])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(query.trim())
    }, 300)
    return () => window.clearTimeout(timer)
  }, [query])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError("")
      try {
        const data = await apiService.getActivityLogs(1, {
          search,
          area: area === "All" ? "" : area,
        })
        if (!cancelled) setLogs(readLogs(data))
      } catch (loadError) {
        if (!cancelled) {
          setLogs([])
          setError(toApiErrorMessage(loadError, "Activity logs could not be loaded."))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [reloadKey, search, area])

  useEffect(() => {
    let active = true
    let leave = () => {}

    void subscribeActivityLogs((payload) => {
      if (!active) return
      const mapped = mapLogItem(payload)
      if (!mapped) return
      setLogs((prev) => {
        if (prev.some((log) => log.id === mapped.id)) return prev
        return [mapped, ...prev]
      })
    }).then((unsubscribe) => {
      if (!active) unsubscribe()
      else leave = unsubscribe
    })

    return () => {
      active = false
      leave()
    }
  }, [])

  function refresh() {
    setLoading(true)
    setReloadKey((key) => key + 1)
  }

  return (
    <section className="flex h-[calc(100svh-11.5rem)] min-h-0 flex-col sm:h-[calc(100svh-12.5rem)]">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-blue-200">
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-b border-blue-100 px-5 py-4">
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
            ) : error || shown.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="px-5 py-6 text-center">
                  <TableEmpty
                    label={
                      error ||
                      (search || area !== "All"
                        ? "No activity matches that filter."
                        : "No activity logs are listed yet.")
                    }
                  />
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

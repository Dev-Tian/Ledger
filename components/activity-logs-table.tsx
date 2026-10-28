"use client"

import { useEffect, useRef, useState } from "react"
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
import { useUser } from "@/contexts/UserContext"
import { apiService, toApiErrorMessage } from "@/lib/apiService"
import { subscribeActivityLogs } from "@/lib/echo"

const columns = ["Date", "User", "Detail"]

const pageSize = 10

type Activity = {
  id: string
  when: string
  whenAt: number
  user: string
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

function whenAtOf(value: string) {
  if (!value) return 0
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 0 : date.getTime()
}

function newestFirst(list: Activity[]) {
  return [...list].sort((a, b) => {
    if (b.whenAt !== a.whenAt) return b.whenAt - a.whenAt
    return String(b.id).localeCompare(String(a.id), undefined, { numeric: true })
  })
}

/** Backend puts the actor in `info` (e.g. "Uploader: Jane Doe"), not a `user` field. */
function inferUser(detail: string, fallback: string) {
  if (fallback) return fallback
  const labeled = detail.match(
    /(?:^|\n)\s*(?:uploader|user|by|actor|performed by)\s*:\s*(.+?)(?:\n|$)/i,
  )
  if (labeled?.[1]?.trim()) return labeled[1].trim()
  const leading = detail.match(/^(.+?)\s+(uploaded|added|updated|deleted|removed)\b/i)
  const candidate = leading?.[1]?.trim() ?? ""
  // Avoid treating "File uploaded…" as user "File"
  if (candidate && !/^(file|batch|upload|error|row)$/i.test(candidate)) return candidate
  return "—"
}

function mapLogItem(item: unknown): Activity | null {
  if (!item || typeof item !== "object") return null
  const row = item as Record<string, unknown>
  const id = textOf(row.id)
  const detail = textOf(row.info) || textOf(row.detail) || textOf(row.message)
  if (!id && !detail) return null
  const nestedUser =
    row.user && typeof row.user === "object" ? (row.user as { name?: unknown; fname?: unknown; lname?: unknown }) : null
  const nestedName =
    textOf(nestedUser?.name) ||
    [textOf(nestedUser?.fname), textOf(nestedUser?.lname)].filter(Boolean).join(" ")
  const user =
    (typeof row.user === "string" || typeof row.user === "number" ? textOf(row.user) : "") ||
    textOf(row.user_name) ||
    nestedName ||
    inferUser(detail, "")
  const whenRaw = textOf(row.created_at) || textOf(row.when)
  return {
    id: id || detail,
    when: formatWhen(whenRaw),
    whenAt: whenAtOf(whenRaw),
    user,
    detail: detail || "—",
  }
}

function listedLogs(payload: unknown): Activity[] {
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

  return newestFirst(
    list.flatMap((item) => {
      const mapped = mapLogItem(item)
      return mapped ? [mapped] : []
    }),
  )
}

function readLogsPage(payload: unknown) {
  const logs = listedLogs(payload)
  const record =
    payload && typeof payload === "object"
      ? (payload as { logs?: { current_page?: number; last_page?: number } })
      : null
  const pager = record?.logs && typeof record.logs === "object" ? record.logs : null
  const currentPage = pager?.current_page ?? 1
  const lastPage =
    pager?.last_page && pager.last_page > 0
      ? pager.last_page
      : Math.max(1, Math.ceil(logs.length / pageSize))
  const pageLogs =
    logs.length > pageSize ? logs.slice((currentPage - 1) * pageSize, currentPage * pageSize) : logs
  return { logs: pageLogs, currentPage, lastPage }
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

/** Newest (page 1 only): blue. Previous recent: yellow. Older / later pages: white. */
function rowClass(index: number, page: number) {
  if (page === 1 && index === 0) return "bg-blue-200 hover:bg-blue-300/80"
  if (page === 1 && index === 1) return "bg-yellow-100/90 hover:bg-yellow-200/90"
  return "bg-white hover:bg-blue-50/70"
}

export function ActivityLogsTable({
  description = "Sign-ins, user changes, and spreadsheet uploads on the ledger.",
}: {
  description?: string
}) {
  const { user } = useUser()
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)
  const [query, setQuery] = useState("")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [logs, setLogs] = useState<Activity[]>([])
  const [error, setError] = useState("")
  const pageRef = useRef(page)
  pageRef.current = page

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
        const data = await apiService.getActivityLogs(page, { search })
        if (!cancelled) {
          const next = readLogsPage(data)
          setLogs(next.logs)
          setPage(next.currentPage)
          setLastPage(next.lastPage)
        }
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
  }, [page, reloadKey, search])

  useEffect(() => {
    const userId = Number(user?.id)
    if (!Number.isFinite(userId)) return

    let active = true
    let leave = () => {}

    void subscribeActivityLogs(userId, (payload) => {
      if (!active) return
      const mapped = mapLogItem(payload)
      if (!mapped) return
      if (pageRef.current !== 1) return
      setLogs((prev) => {
        if (prev.some((log) => log.id === mapped.id)) return prev
        return newestFirst([mapped, ...prev]).slice(0, pageSize)
      })
    }).then((unsubscribe) => {
      if (!active) unsubscribe()
      else leave = unsubscribe
    })

    return () => {
      active = false
      leave()
    }
  }, [user?.id])

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
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            <div className="relative min-w-64 flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by user or detail"
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
            ) : error || logs.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="px-5 py-6 text-center">
                  <TableEmpty
                    label={
                      error ||
                      (search
                        ? "No activity matches that search."
                        : "No activity logs are listed yet.")
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log, index) => (
                <TableRow key={log.id} className={rowClass(index, page)}>
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
                  <TableCell className="px-5 py-3 text-blue-950">{log.detail}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {lastPage > 1 ? (
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
        ) : null}
      </div>
    </section>
  )
}

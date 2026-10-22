"use client"

import { RefreshCw, Search, Users } from "lucide-react"
import { useEffect, useState } from "react"

import { BranchCustomersModal } from "@/components/branch-customers-modal"
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
import { apiService, toApiErrorMessage } from "@/lib/apiService"

type BranchLocation = {
  id: string | number
  locationName: string
}

function textOf(value: unknown) {
  return typeof value === "string" || typeof value === "number" ? String(value) : ""
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

function readLocationsPage(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return { locations: [] as BranchLocation[], currentPage: 1, lastPage: 1 }
  }
  const record = payload as {
    locations?: { data?: unknown; current_page?: number; last_page?: number } | unknown[]
  }
  const pager =
    record.locations && typeof record.locations === "object" && !Array.isArray(record.locations)
      ? record.locations
      : null
  const list = Array.isArray(record.locations)
    ? record.locations
    : Array.isArray(pager?.data)
      ? pager.data
      : []
  const locations = list.flatMap((item) => {
    if (!item || typeof item !== "object") return []
    const row = item as Record<string, unknown>
    const id = row.id
    const locationName = textOf(row.location_name)
    if (id == null || !locationName) return []
    return [{ id: id as string | number, locationName }]
  })
  return {
    locations,
    currentPage: pager?.current_page ?? 1,
    lastPage: pager?.last_page && pager.last_page > 0 ? pager.last_page : 1,
  }
}

export default function AdminBranchesPage() {
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [items, setItems] = useState<BranchLocation[]>([])
  const [query, setQuery] = useState("")
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<BranchLocation | null>(null)
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
        const data = await apiService.getLocations(page, search)
        if (!cancelled) {
          const next = readLocationsPage(data)
          setItems(next.locations)
          setPage(next.currentPage)
          setLastPage(next.lastPage)
        }
      } catch (loadError) {
        if (!cancelled) {
          setItems([])
          setError(toApiErrorMessage(loadError, "Branches could not be loaded."))
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
            <h1 className="text-2xl font-semibold tracking-tight text-blue-950">Branches</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              View branch locations and their customers.
            </p>
          </div>
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            <div className="relative min-w-64 flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by location name"
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

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          {loading ? (
            <LoadingState />
          ) : error || items.length === 0 ? (
            <div className="flex min-h-64 items-center justify-center">
              <TableEmpty
                label={
                  error ||
                  (search ? "No branches match that search." : "No branches are listed yet.")
                }
              />
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {items.map((branch) => (
                <article
                  key={branch.id}
                  className="flex flex-col gap-4 rounded-xl bg-blue-50/40 p-5 shadow-sm ring-1 ring-blue-200"
                >
                  <div>
                    <h2 className="text-sm font-semibold tracking-tight text-blue-950">
                      {branch.locationName}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">Location #{branch.id}</p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    className="action-hover bg-blue-800 text-white hover:bg-blue-900"
                    onClick={() => setSelected(branch)}
                  >
                    <Users />
                    View customers
                  </Button>
                </article>
              ))}
            </div>
          )}
        </div>

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

      <BranchCustomersModal
        open={selected !== null}
        onOpenChangeAction={(open) => {
          if (!open) setSelected(null)
        }}
        branch={selected}
      />
    </section>
  )
}

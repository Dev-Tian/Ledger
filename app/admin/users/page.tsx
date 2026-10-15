"use client"

import { useEffect, useState } from "react"
import { Pencil, RefreshCw, Search, Trash2 } from "lucide-react"

import { TableEmpty } from "@/components/table-empty"
import { UpdateUserModal } from "@/components/update-user-modal"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"
import { LoadingState } from "@/components/loading-state"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const columns = ["Name", "Email", "Code", "Branch code", "Actions"]

type ListedUser = {
  id?: string | number
  name?: string
  fname?: string
  lname?: string
  email?: string
  code?: string
  branch_code?: string
}

const pageSize = 10

type BranchOption = { value: string; label: string }

const allBranches: BranchOption = { value: "", label: "All branches" }

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

function readUserPage(payload: unknown) {
  const users = listedUsers(payload)
  const record = payload && typeof payload === "object" ? (payload as { users?: { current_page?: number; last_page?: number } }) : null
  const pager = record?.users && typeof record.users === "object" ? record.users : null
  const currentPage = pager?.current_page ?? 1
  const lastPage = pager?.last_page && pager.last_page > 0 ? pager.last_page : Math.max(1, Math.ceil(users.length / pageSize))
  const pageUsers = users.length > pageSize ? users.slice((currentPage - 1) * pageSize, currentPage * pageSize) : users
  return { users: pageUsers, currentPage, lastPage }
}

function listedUsers(payload: unknown): ListedUser[] {
  if (!payload || typeof payload !== "object") return []
  const record = payload as {
    data?: unknown
    users?: { data?: unknown } | unknown[]
  }
  const paged =
    record.users && typeof record.users === "object" && !Array.isArray(record.users)
      ? record.users.data
      : undefined
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(paged)
      ? paged
      : Array.isArray(record.users)
        ? record.users
        : Array.isArray(record.data)
          ? record.data
          : []
  return list.filter((item): item is ListedUser => !!item && typeof item === "object")
}

function listedBranches(payload: unknown): BranchOption[] {
  if (!payload || typeof payload !== "object") return [allBranches]
  const list = (payload as { branch_code?: unknown }).branch_code
  if (!Array.isArray(list)) return [allBranches]
  const options = list.flatMap((item) => {
    if (!item || typeof item !== "object") return []
    const code = (item as { branch_code?: unknown }).branch_code
    if (typeof code !== "string" || !code.trim()) return []
    const value = code.trim()
    return [{ value, label: value }]
  })
  return [allBranches, ...options]
}

function displayName(user: ListedUser) {
  const name = user.name?.trim() || [user.fname, user.lname].filter(Boolean).join(" ")
  return name || "—"
}

function initials(name: string) {
  const parts = name.split(/\s+/).filter((part) => part && part !== "—")
  const letters = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "")
  return letters.join("") || "?"
}

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [users, setUsers] = useState<ListedUser[]>([])
  const [query, setQuery] = useState("")
  const [search, setSearch] = useState("")
  const [branch, setBranch] = useState<BranchOption | null>(allBranches)
  const [branches, setBranches] = useState<BranchOption[]>([allBranches])
  const [editing, setEditing] = useState<ListedUser | null>(null)
  const [deletingUser, setDeletingUser] = useState<ListedUser | null>(null)
  const [leavingId, setLeavingId] = useState<string | number | null>(null)
  const [removing, setRemoving] = useState(false)
  const [deleteError, setDeleteError] = useState("")
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
        const data = await apiService.getUsers(page, {
          search,
          branch_code: branch?.value ?? "",
        })
        if (!cancelled) {
          const next = readUserPage(data)
          const nextBranches = listedBranches(data)
          setUsers(next.users)
          setBranches((current) => (nextBranches.length > 1 ? nextBranches : current))
          setPage(next.currentPage)
          setLastPage(next.lastPage)
        }
      } catch (loadError) {
        if (!cancelled) {
          setUsers([])
          setError(toApiErrorMessage(loadError, "Users could not be loaded."))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [page, reloadKey, search, branch])

  function refresh() {
    setLoading(true)
    setReloadKey((key) => key + 1)
  }

  async function removeUser() {
    if (deletingUser?.id == null) return
    setRemoving(true)
    setDeleteError("")
    try {
      const removedId = deletingUser.id
      await apiService.deleteUser(removedId)
      setDeletingUser(null)
      setLeavingId(removedId)
      window.setTimeout(() => {
        setUsers((current) => current.filter((user) => user.id !== removedId))
        setLeavingId(null)
        setReloadKey((key) => key + 1)
      }, 700)
    } catch (failure) {
      setDeleteError(toApiErrorMessage(failure, "That user could not be deleted."))
    } finally {
      setRemoving(false)
    }
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-blue-200">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-blue-100 px-5 py-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-blue-950">Users</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              People who can sign in to the ledger.
            </p>
          </div>
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            <div className="relative min-w-64 flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name, email, code, or branch code"
                className="h-10 bg-blue-50/60 pl-9"
              />
            </div>
            <Combobox
              items={branches}
              value={branch}
              onValueChange={(value) => {
                setBranch(value)
                setPage(1)
              }}
              isItemEqualToValue={(item, selected) => item.value === selected.value}
            >
              <ComboboxTrigger className="flex h-10 min-w-44 items-center justify-between gap-2 rounded-lg border border-input bg-blue-50/60 px-3 text-sm text-blue-950">
                <ComboboxValue placeholder="All branches" />
              </ComboboxTrigger>
              <ComboboxContent>
                <ComboboxInput showTrigger={false} placeholder="Search branches" />
                <ComboboxEmpty>No branches found.</ComboboxEmpty>
                <ComboboxList>
                  {(item: BranchOption) => (
                    <ComboboxItem key={item.value || "all"} value={item}>
                      {item.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-10 px-3 bg-blue-800 text-white hover:bg-blue-900 cursor-pointer hover:text-white"
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
            ) : error ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="px-5 py-6 text-center">
                  <TableEmpty label={error} />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="px-5 py-6 text-center">
                  <TableEmpty
                    label={
                      search || branch?.value
                        ? "No users match that filter."
                        : "No users are listed yet."
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                const name = displayName(user)
                const leaving = leavingId != null && user.id === leavingId
                return (
                  <TableRow
                    key={user.id ?? user.email}
                    className={
                      leaving
                        ? "pointer-events-none animate-user-remove"
                        : "hover:bg-blue-50/70"
                    }
                  >
                    <TableCell className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-800 text-xs font-semibold text-white">
                          {initials(name)}
                        </span>
                        <span className="font-medium text-blue-950">{name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-3 text-blue-950/80">{user.email || "—"}</TableCell>
                    <TableCell className="px-5 py-3">
                      <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold tracking-wide text-blue-800 ring-1 ring-blue-200">
                        {user.code || "—"}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <span className="inline-flex rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold tracking-wide text-sky-800 ring-1 ring-sky-200">
                        {user.branch_code || "—"}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="outline"
                          className="bg-white"
                          aria-label={`Edit ${name}`}
                          disabled={user.id == null}
                          onClick={() => setEditing(user)}
                        >
                          <Pencil className="text-blue-700" />
                        </Button>
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="outline"
                          className="bg-white"
                          aria-label={`Delete ${name}`}
                          disabled={user.id == null}
                          onClick={() => {
                            setDeleteError("")
                            setDeletingUser(user)
                          }}
                        >
                          <Trash2 className="text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      <div className="border-t border-blue-100 bg-blue-50/50 px-4 py-3">
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
      <AlertDialog
        open={deletingUser !== null}
        onOpenChange={(open) => {
          if (!open && !removing) setDeletingUser(null)
        }}
      >
        <AlertDialogContent className="w-[min(28rem,calc(100%-2rem))] max-w-none! gap-0 overflow-hidden p-0 shadow-lg ring-blue-200 sm:max-w-none!">
          <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-sky-500 px-6 py-5 text-white">
            <AlertDialogTitle className="text-xl font-semibold">Delete this user?</AlertDialogTitle>
            <AlertDialogDescription className="mt-1 text-sm text-blue-100">
              Their sign-in will be removed. This cannot be undone.
            </AlertDialogDescription>
          </div>
          {deletingUser ? (
            <div className="px-6 py-5">
              <p className="text-lg font-semibold text-blue-950">{displayName(deletingUser)}</p>
              <dl className="mt-4 grid gap-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd className="font-medium text-blue-950">{deletingUser.email || "—"}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Code</dt>
                  <dd className="font-medium text-blue-950">{deletingUser.code || "—"}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Branch code</dt>
                  <dd className="font-medium text-blue-950">{deletingUser.branch_code || "—"}</dd>
                </div>
              </dl>
              {deleteError ? <p className="mt-4 text-sm text-red-600">{deleteError}</p> : null}
            </div>
          ) : null}
          <div className="flex justify-end gap-2 border-t border-blue-100 bg-blue-50 px-6 py-4">
            <AlertDialogCancel className="bg-white px-4" disabled={removing}>
              Cancel
            </AlertDialogCancel>
            <Button
              type="button"
              className="bg-red-600 px-4 text-white hover:bg-red-700"
              disabled={removing || deletingUser?.id == null}
              onClick={() => void removeUser()}
            >
              {removing ? "Deleting" : "Delete user"}
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
      <UpdateUserModal
        open={editing !== null}
        user={editing}
        onOpenChangeAction={(open) => {
          if (!open) setEditing(null)
        }}
        onUpdatedAction={refresh}
      />
    </section>
  )
}

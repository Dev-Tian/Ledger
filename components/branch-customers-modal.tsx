"use client"

import { useEffect, useState } from "react"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { LoadingState } from "@/components/loading-state"
import { TableEmpty } from "@/components/table-empty"
import { Button } from "@/components/ui/button"
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
]

const purchaseDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
})

export type BranchCustomer = {
  internalId: string
  customerName: string
  purchaseDate: string
  salesOrderNo: string
}

function textOf(value: unknown) {
  return typeof value === "string" || typeof value === "number" ? String(value) : ""
}

function formatDate(value: string) {
  if (!value) return "—"
  const date = new Date(`${value.slice(0, 10)}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return purchaseDate.format(date)
}

function readCustomers(payload: unknown): BranchCustomer[] {
  if (!payload || typeof payload !== "object") return []
  const record = payload as { message?: unknown; location?: unknown; data?: unknown }
  const location =
    (record.message && typeof record.message === "object" ? record.message : null) ??
    (record.location && typeof record.location === "object" ? record.location : null) ??
    (record.data && typeof record.data === "object" ? record.data : null)
  if (!location || typeof location !== "object") return []
  const installments = (location as { installments?: unknown }).installments
  if (!Array.isArray(installments)) return []
  return installments.flatMap((item) => {
    if (!item || typeof item !== "object") return []
    const row = item as Record<string, unknown>
    const internalId = textOf(row.internal_id)
    if (!internalId) return []
    return [
      {
        internalId,
        customerName: textOf(row.customer_name) || "—",
        purchaseDate: formatDate(textOf(row.purchase_date)),
        salesOrderNo: textOf(row.so_number) || "—",
      },
    ]
  })
}

export function BranchCustomersModal({
  open,
  onOpenChangeAction,
  branch,
}: {
  open: boolean
  onOpenChangeAction: (open: boolean) => void
  branch: { id: string | number; locationName: string } | null
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [customers, setCustomers] = useState<BranchCustomer[]>([])

  useEffect(() => {
    if (!open || branch == null) {
      setCustomers([])
      setError("")
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError("")
    void apiService
      .getLocation(branch.id)
      .then((data) => {
        if (cancelled) return
        setCustomers(readCustomers(data))
      })
      .catch((loadError) => {
        if (cancelled) return
        setCustomers([])
        setError(toApiErrorMessage(loadError, "Customers could not be loaded."))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [open, branch])

  return (
    <AlertDialog open={open} onOpenChange={onOpenChangeAction}>
      <AlertDialogContent className="w-[min(72rem,calc(100%-2rem))] max-w-none! gap-0 overflow-hidden p-0 shadow-lg ring-blue-200 sm:max-w-none!">
        <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-sky-500 px-8 py-5 text-white">
          <AlertDialogTitle className="text-2xl">
            {branch ? branch.locationName : "Customers"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base text-blue-100">
            Customers of this branch.
          </AlertDialogDescription>
        </div>
        <div className="max-h-[min(40rem,70svh)] overflow-auto px-8 py-6">
          <div className="overflow-x-auto rounded-xl bg-white shadow-md ring-1 ring-blue-200">
            <Table>
              <TableHeader className="bg-blue-50 text-blue-950">
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column} className="px-5 py-4 text-base text-blue-950">
                      {column}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="px-5">
                      <LoadingState />
                    </TableCell>
                  </TableRow>
                ) : error || customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="px-5 py-8 text-center text-base">
                      <TableEmpty
                        label={error || "No customers are listed for this branch yet."}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  customers.map((customer) => (
                    <TableRow key={customer.internalId}>
                      <TableCell className="px-5 py-4 text-base">{customer.internalId}</TableCell>
                      <TableCell className="px-5 py-4 text-base">{customer.customerName}</TableCell>
                      <TableCell className="px-5 py-4 text-base">{customer.purchaseDate}</TableCell>
                      <TableCell className="px-5 py-4 text-base">{customer.salesOrderNo}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="flex justify-end border-t bg-blue-50 px-8 py-4">
          <Button
            type="button"
            size="sm"
            className="bg-blue-800 px-3 text-white hover:bg-blue-900"
            onClick={() => onOpenChangeAction(false)}
          >
            Close
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

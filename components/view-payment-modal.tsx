"use client"

import { useEffect, useState } from "react"

import { LoadingState } from "@/components/loading-state"
import { ModalLogoWatermark } from "@/components/modal-logo-watermark"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const columns = [
  "Document number",
  "Date",
  "Name",
  "OR number",
  "Maximum of amount",
  "Memo (main)",
  "Minimum of sales order number",
  "Minimum of invoice number - leasing",
  "Eligible for rebate",
  "Generic collector",
  "Location",
]

const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
})

export type PaymentRemark = {
  id: string
  action: "edited" | "voided"
  by: string
  at: string
  detail?: string
}

export type ViewPayment = {
  id: string
  documentNumber: string
  date: string
  name: string
  orNumber: string
  maximumOfAmount: number
  memoMain: string
  minimumSalesOrderNumber: string
  minimumInvoiceNumberLeasing: string
  eligibleForRebate: string
  genericCollector: string
  location: string
  voided?: boolean
  remarks: PaymentRemark[]
}

export function ViewPaymentModal({
  open,
  onOpenChangeAction,
  payment,
}: {
  open: boolean
  onOpenChangeAction: (open: boolean) => void
  payment: ViewPayment | null
}) {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open || !payment) return
    let cancelled = false
    setLoading(true)
    const timer = window.setTimeout(() => {
      if (!cancelled) setLoading(false)
    }, 400)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [open, payment])

  return (
    <AlertDialog open={open} onOpenChange={onOpenChangeAction}>
      <AlertDialogContent className="flex max-h-[min(90svh,56rem)] w-[min(48rem,calc(100%-2rem))] max-w-none! flex-col gap-0 overflow-hidden p-0 shadow-lg ring-blue-200 sm:max-w-none!">
        <div className="shrink-0 bg-gradient-to-r from-blue-800 via-blue-700 to-sky-500 px-6 py-5 text-white">
          <AlertDialogTitle className="text-xl">
            {payment ? payment.documentNumber : "Payment"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-blue-100">
            Full payment record for this collection.
          </AlertDialogDescription>
        </div>
        <div className="relative flex min-h-0 flex-1 flex-col">
          <ModalLogoWatermark />
          {loading ? (
            <div className="relative z-10 bg-white/80">
              <LoadingState />
            </div>
          ) : (
            <div className="relative z-10 flex min-h-0 flex-1 flex-col">
              <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto px-6 py-5">
                <div className="rounded-xl bg-white/90 shadow-md ring-1 ring-blue-200">
                  <Table>
                    <TableHeader className="bg-blue-50 text-blue-950">
                      <TableRow>
                        {columns.map((column) => (
                          <TableHead
                            key={column}
                            className="h-11 px-4 text-xs font-semibold tracking-wide whitespace-nowrap text-blue-800 uppercase"
                          >
                            {column}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payment ? (
                        <TableRow>
                          <TableCell className="px-4 py-3 whitespace-nowrap">
                            <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold tracking-wide text-blue-800 ring-1 ring-blue-200">
                              {payment.documentNumber}
                            </span>
                          </TableCell>
                          <TableCell className="px-4 py-3 whitespace-nowrap text-blue-950/80">
                            {payment.date}
                          </TableCell>
                          <TableCell className="px-4 py-3 whitespace-nowrap font-medium text-blue-950">
                            {payment.name}
                          </TableCell>
                          <TableCell className="px-4 py-3 whitespace-nowrap">
                            <span className="inline-flex rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold tracking-wide text-sky-800 ring-1 ring-sky-200">
                              {payment.orNumber || "—"}
                            </span>
                          </TableCell>
                          <TableCell className="px-4 py-3 whitespace-nowrap tabular-nums text-blue-950">
                            {peso.format(payment.maximumOfAmount)}
                          </TableCell>
                          <TableCell className="px-4 py-3 whitespace-nowrap text-blue-950/80">
                            {payment.memoMain || "—"}
                          </TableCell>
                          <TableCell className="px-4 py-3 whitespace-nowrap">
                            <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold tracking-wide text-blue-800 ring-1 ring-blue-200">
                              {payment.minimumSalesOrderNumber || "—"}
                            </span>
                          </TableCell>
                          <TableCell className="px-4 py-3 whitespace-nowrap text-blue-950/80">
                            {payment.minimumInvoiceNumberLeasing || "—"}
                          </TableCell>
                          <TableCell className="px-4 py-3 whitespace-nowrap">
                            <span
                              className={
                                payment.eligibleForRebate.toLowerCase() === "yes"
                                  ? "inline-flex rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold tracking-wide text-sky-800 ring-1 ring-sky-200"
                                  : "inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold tracking-wide text-blue-800 ring-1 ring-blue-200"
                              }
                            >
                              {payment.eligibleForRebate || "—"}
                            </span>
                          </TableCell>
                          <TableCell className="px-4 py-3 whitespace-nowrap text-blue-950/80">
                            {payment.genericCollector || "—"}
                          </TableCell>
                          <TableCell className="px-4 py-3 whitespace-nowrap text-blue-950/80">
                            {payment.location || "—"}
                          </TableCell>
                        </TableRow>
                      ) : null}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-5 overflow-hidden rounded-xl bg-white/90 shadow-md ring-1 ring-blue-200">
                  <div className="border-b border-blue-100 bg-blue-50 px-4 py-3">
                    <h3 className="text-sm font-semibold tracking-tight text-blue-950">Remarks</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Record of who edited or voided this payment.
                    </p>
                  </div>
                  {payment && payment.remarks.length > 0 ? (
                    <ul className="divide-y divide-blue-100">
                      {payment.remarks.map((remark) => (
                        <li
                          key={remark.id}
                          className={
                            remark.action === "voided"
                              ? "bg-red-50/80 px-4 py-3"
                              : "bg-blue-50/70 px-4 py-3"
                          }
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={
                                remark.action === "voided"
                                  ? "inline-flex rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold tracking-wide text-red-700 ring-1 ring-red-200"
                                  : "inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold tracking-wide text-blue-800 ring-1 ring-blue-200"
                              }
                            >
                              {remark.action === "voided" ? "Voided" : "Edited"}
                            </span>
                            <span className="text-sm font-medium text-blue-950">{remark.by}</span>
                            <span className="text-xs text-muted-foreground">{remark.at}</span>
                          </div>
                          {remark.detail ? (
                            <p className="mt-1.5 text-sm leading-5 text-blue-950/80">{remark.detail}</p>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                      No remarks are recorded yet.
                    </p>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 justify-end border-t border-blue-100 bg-blue-50/50 px-6 py-4">
                <Button
                  type="button"
                  size="sm"
                  className="cursor-pointer bg-blue-800 px-3 text-white hover:bg-blue-900"
                  onClick={() => onOpenChangeAction(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

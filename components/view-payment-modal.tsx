"use client"

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
  return (
    <AlertDialog open={open} onOpenChange={onOpenChangeAction}>
      <AlertDialogContent className="w-[min(84rem,calc(100%-2rem))] max-w-none! gap-0 overflow-hidden p-0 shadow-lg ring-blue-200 sm:max-w-none!">
        <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-sky-500 px-6 py-5 text-white">
          <AlertDialogTitle className="text-xl">
            {payment ? payment.documentNumber : "Payment"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-blue-100">
            Full payment record for this collection.
          </AlertDialogDescription>
        </div>
        <div className="max-h-[min(40rem,70svh)] overflow-auto px-6 py-5">
          <div className="overflow-x-auto rounded-xl bg-white shadow-md ring-1 ring-blue-200">
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
        </div>
        <div className="flex justify-end border-t border-blue-100 bg-blue-50/50 px-6 py-4">
          <Button
            type="button"
            size="sm"
            className="cursor-pointer bg-blue-800 px-3 text-white hover:bg-blue-900"
            onClick={() => onOpenChangeAction(false)}
          >
            Close
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

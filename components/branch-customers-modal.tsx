"use client"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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

const columns = [
  "Internal ID",
  "Customer name",
  "Date of purchase",
  "Sales order No.",
  "Location",
]

export type BranchCustomer = {
  internalId: string
  customerName: string
  purchaseDate: string
  salesOrderNo: string
  location: string
}

export function BranchCustomersModal({
  open,
  onOpenChangeAction,
  branch,
}: {
  open: boolean
  onOpenChangeAction: (open: boolean) => void
  branch: { code: string; name: string; customers: BranchCustomer[] } | null
}) {
  const listed = branch?.customers ?? []

  return (
    <AlertDialog open={open} onOpenChange={onOpenChangeAction}>
      <AlertDialogContent className="w-[min(72rem,calc(100%-2rem))] max-w-none! gap-0 overflow-hidden p-0 shadow-lg ring-blue-200 sm:max-w-none!">
        <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-sky-500 px-8 py-5 text-white">
          <AlertDialogTitle className="text-2xl">
            {branch ? `${branch.name} / ${branch.code}` : "Customers"}
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
                {listed.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="px-5 py-8 text-center text-base">
                      <TableEmpty label="No customers are listed for this branch yet." />
                    </TableCell>
                  </TableRow>
                ) : (
                  listed.map((customer) => (
                    <TableRow key={customer.internalId}>
                      <TableCell className="px-5 py-4 text-base">{customer.internalId}</TableCell>
                      <TableCell className="px-5 py-4 text-base">{customer.customerName}</TableCell>
                      <TableCell className="px-5 py-4 text-base">{customer.purchaseDate}</TableCell>
                      <TableCell className="px-5 py-4 text-base">{customer.salesOrderNo}</TableCell>
                      <TableCell className="px-5 py-4 text-base">{customer.location}</TableCell>
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

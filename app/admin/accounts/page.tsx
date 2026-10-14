import Link from "next/link"

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
  "Actions",
]

type Account = {
  internalId: string
  customerName: string
  purchaseDate: string
  salesOrderNo: string
  location: string
}

const accounts: Account[] = [
  {
    internalId: "ACC-1001",
    customerName: "Maria Santos",
    purchaseDate: "Oct 14, 2026",
    salesOrderNo: "SO-24081",
    location: "Cebu",
  },
]

export default function AdminAccountsPage() {
  return (
    <section className="flex flex-col gap-6">
      <div className="max-w-xl">   
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Accounts</h1>
        <p className="mt-2 leading-7 text-muted-foreground">
          Installment accounts managed by an administrator will be listed here.
        </p>
      </div>
      <div className="overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-blue-200">
        <Table>
          <TableHeader className="bg-blue-50 text-blue-950">
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column} className="px-4 text-blue-950">
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  No accounts are listed yet.
                </TableCell>
              </TableRow>
            ) : (
              accounts.map((account) => (
                <TableRow key={account.internalId}>
                  <TableCell className="px-4">{account.internalId}</TableCell>
                  <TableCell className="px-4">{account.customerName}</TableCell>
                  <TableCell className="px-4">{account.purchaseDate}</TableCell>
                  <TableCell className="px-4">{account.salesOrderNo}</TableCell>
                  <TableCell className="px-4">{account.location}</TableCell>
                  <TableCell className="px-4">
                    <Button
                      asChild
                      size="sm"
                      className="bg-blue-800 px-3 text-white hover:bg-blue-900"
                    >
                      <Link
                        href={`/admin/account-ledger/${encodeURIComponent(account.internalId)}`}
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
      </div>
    </section>
  )
}

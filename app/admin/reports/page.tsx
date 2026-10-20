"use client"

import { useEffect, useMemo, useState } from "react"
import { Ban, Eye, Pencil, RefreshCw, Search } from "lucide-react"

import { LoadingState } from "@/components/loading-state"
import { TableEmpty } from "@/components/table-empty"
import { EditPaymentModal } from "@/components/edit-payment-modal"
import { ViewPaymentModal, type ViewPayment } from "@/components/view-payment-modal"
import { VoidPaymentModal } from "@/components/void-payment-modal"
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

const columns = [
  "Document number",
  "Date",
  "Name",
  "OR number",
  "Maximum of amount",
  "Memo (main)",
  "Minimum of sales order number",
  "Actions",
]

const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
})

type PaymentRow = ViewPayment

const mockPayments: PaymentRow[] = [
  {
    id: "1",
    documentNumber: "PV-2026-0142",
    date: "Oct 14, 2026",
    name: "Maria Santos",
    orNumber: "OR-88421",
    maximumOfAmount: 3750,
    memoMain: "Monthly installment",
    minimumSalesOrderNumber: "SO-24081",
    minimumInvoiceNumberLeasing: "",
    eligibleForRebate: "Yes",
    genericCollector: "Collector A",
    location: "Cebu",
  },
  {
    id: "2",
    documentNumber: "PV-2026-0148",
    date: "Oct 15, 2026",
    name: "Sample Customer",
    orNumber: "OR-88455",
    maximumOfAmount: 6313,
    memoMain: "Down payment",
    minimumSalesOrderNumber: "SO-0001",
    minimumInvoiceNumberLeasing: "INV-10021",
    eligibleForRebate: "No",
    genericCollector: "Collector B",
    location: "Bohol",
  },
  {
    id: "3",
    documentNumber: "PV-2026-0151",
    date: "Oct 16, 2026",
    name: "Juan Dela Cruz",
    orNumber: "OR-88502",
    maximumOfAmount: 4200,
    memoMain: "Partial collection",
    minimumSalesOrderNumber: "SO-24110",
    minimumInvoiceNumberLeasing: "INV-10044",
    eligibleForRebate: "Yes",
    genericCollector: "Collector A",
    location: "Cebu",
  },
  {
    id: "4",
    documentNumber: "PV-2026-0159",
    date: "Oct 17, 2026",
    name: "Ana Reyes",
    orNumber: "OR-88540",
    maximumOfAmount: 2500,
    memoMain: "Rebate adjustment",
    minimumSalesOrderNumber: "SO-23990",
    minimumInvoiceNumberLeasing: "",
    eligibleForRebate: "Yes",
    genericCollector: "Collector C",
    location: "Alano",
  },
  {
    id: "5",
    documentNumber: "PV-2026-0164",
    date: "Oct 18, 2026",
    name: "Carlo Mendoza",
    orNumber: "OR-88588",
    maximumOfAmount: 5100,
    memoMain: "Full monthly due",
    minimumSalesOrderNumber: "SO-24155",
    minimumInvoiceNumberLeasing: "INV-10088",
    eligibleForRebate: "No",
    genericCollector: "Collector B",
    location: "Cebu",
  },
]

function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean)
  const letters = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "")
  return letters.join("") || "?"
}

export default function AdminPaymentsPage() {
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)
  const [query, setQuery] = useState("")
  const [payments, setPayments] = useState<PaymentRow[]>(mockPayments)
  const [viewing, setViewing] = useState<PaymentRow | null>(null)
  const [editing, setEditing] = useState<PaymentRow | null>(null)
  const [voiding, setVoiding] = useState<PaymentRow | null>(null)

  const shown = useMemo(() => {
    const text = query.trim().toLowerCase()
    if (!text) return payments
    return payments.filter((payment) =>
      [
        payment.documentNumber,
        payment.date,
        payment.name,
        payment.orNumber,
        payment.memoMain,
        payment.minimumSalesOrderNumber,
        String(payment.maximumOfAmount),
      ].some((value) => value.toLowerCase().includes(text)),
    )
  }, [payments, query])

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 600)
    return () => window.clearTimeout(timer)
  }, [reloadKey])

  function refresh() {
    setLoading(true)
    setReloadKey((key) => key + 1)
  }

  return (
    <section className="flex h-[calc(100svh-11.5rem)] min-h-0 flex-col sm:h-[calc(100svh-12.5rem)]">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-blue-200">
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-b border-blue-100 px-5 py-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-blue-950">Payments</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Collection records posted against installment accounts.
            </p>
          </div>
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            <div className="relative min-w-64 flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by document, name, OR, or sales order"
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
            ) : shown.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="px-5 py-6 text-center">
                  <TableEmpty
                    label={
                      query.trim()
                        ? "No payments match that search."
                        : "No payments are listed yet."
                    }
                  />
                </TableCell>
              </TableRow>
            ) : (
              shown.map((payment) => (
                <TableRow key={payment.id} className="hover:bg-blue-50/70">
                  <TableCell className="px-5 py-3">
                    <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold tracking-wide text-blue-800 ring-1 ring-blue-200">
                      {payment.documentNumber}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-3 whitespace-nowrap text-blue-950/80">
                    {payment.date}
                  </TableCell>
                  <TableCell className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-800 text-xs font-semibold text-white">
                        {initials(payment.name)}
                      </span>
                      <span className="font-medium text-blue-950">{payment.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-3">
                    <span className="inline-flex rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold tracking-wide text-sky-800 ring-1 ring-sky-200">
                      {payment.orNumber || "—"}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-3 tabular-nums text-blue-950">
                    {peso.format(payment.maximumOfAmount)}
                  </TableCell>
                  <TableCell className="px-5 py-3 text-blue-950/80">
                    {payment.memoMain || "—"}
                  </TableCell>
                  <TableCell className="px-5 py-3">
                    <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold tracking-wide text-blue-800 ring-1 ring-blue-200">
                      {payment.minimumSalesOrderNumber || "—"}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="outline"
                        className="action-hover cursor-pointer bg-white text-blue-700"
                        aria-label={`View ${payment.documentNumber}`}
                        onClick={() => setViewing(payment)}
                      >
                        <Eye />
                      </Button>
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="outline"
                        className="action-hover cursor-pointer bg-white text-blue-700"
                        aria-label={`Edit ${payment.documentNumber}`}
                        onClick={() => setEditing(payment)}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="outline"
                        className="action-hover cursor-pointer bg-white text-red-600"
                        aria-label={`Void ${payment.documentNumber}`}
                        onClick={() => setVoiding(payment)}
                      >
                        <Ban />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <ViewPaymentModal
        open={viewing !== null}
        onOpenChangeAction={(open) => {
          if (!open) setViewing(null)
        }}
        payment={viewing}
      />
      <EditPaymentModal
        open={editing !== null}
        payment={editing}
        onOpenChangeAction={(open) => {
          if (!open) setEditing(null)
        }}
        onSavedAction={(next) => {
          setPayments((current) =>
            current.map((payment) => (payment.id === next.id ? next : payment)),
          )
        }}
      />
      <VoidPaymentModal
        open={voiding !== null}
        payment={voiding}
        onOpenChangeAction={(open) => {
          if (!open) setVoiding(null)
        }}
        onVoidedAction={(payment) => {
          setPayments((current) => current.filter((row) => row.id !== payment.id))
        }}
      />
    </section>
  )
}

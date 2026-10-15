"use client"

import { useEffect, useRef, useState } from "react"
import { Search } from "lucide-react"

import { BranchInfoForm } from "@/components/branch-info-form"
import { CustomerSetupForm } from "@/components/customer-setup-form"
import { ledgerCustomers, matchesCustomer, type LedgerCustomer } from "@/components/ledger-customers"
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

const loanLedgerColumns = [
  "Installment No.",
  "Due date",
  "Payment date",
  "Payment reference",
  "Monthly installment",
  "Monthly principal",
  "Monthly interest",
  "Penalty",
  "Rebate",
  "Monthly installment paid",
  "Monthly principal paid",
  "Monthly interest paid",
  "Penalty paid",
  "Overdue",
  "Running balance without penalty",
  "Running balance with penalty",
  "Payment breakdown",
]

const paymentHistoryColumns = [
  "Payment date",
  "OR / Ref no.",
  "Amount paid",
  "Penalty paid",
  "Applied to monthly due",
  "Unapplied excess",
  "Received by",
  "Location",
  "Remarks",
  "Validation / status",
  "Eligible for rebate",
]

const tabs = [
  "Customer set-up",
  "Branch info",
  "Loan Ledger",
  "Payment history",
] as const

type AccountLedgerTab = (typeof tabs)[number]

const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 2,
})

function loanSummary(customer: LedgerCustomer) {
  const principal =
    Number(customer.termMonths) > 0
      ? Number(customer.financedAmount) / Number(customer.termMonths)
      : 0
  return [
    [
      ["Customer name", customer.customerName],
      ["Customer ID", customer.customerId],
      ["Loan start date", customer.loanStartLabel],
      ["Term (months)", customer.termMonths],
      ["Monthly principal", peso.format(principal)],
      ["Notes", customer.notes],
    ],
    [
      ["Sales order no.", customer.salesOrderNo],
      ["Item / unit", customer.itemUnit],
      ["Original loan amount", peso.format(Number(customer.loanAmount))],
      ["Down payment", peso.format(Number(customer.downPayment))],
      ["Monthly interest", peso.format(Number(customer.monthlyInterest))],
      ["Monthly installment", peso.format(principal + Number(customer.monthlyInterest))],
    ],
    [
      ["Loan status", customer.loanStatus],
      ["Current balance", peso.format(customer.currentBalance)],
      ["Total payments", peso.format(customer.totalPayments)],
      ["Total amount due", peso.format(customer.totalAmountDue)],
      ["Total balance due", peso.format(customer.totalBalanceDue)],
    ],
  ]
}

function LoanLedgerSummary({
  title,
  customer,
}: {
  title: string
  customer: LedgerCustomer
}) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-blue-200">
      <div className="bg-blue-800 px-5 py-4 text-white">
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-blue-100">These fields are read only.</p>
      </div>
      <div className="grid gap-6 px-5 py-5 lg:grid-cols-3">
        {loanSummary(customer).map((column) => (
          <dl key={column[0][0]} className="flex flex-col gap-3">
            {column.map(([label, value]) => (
              <div key={label} className="flex flex-col gap-1">
                <dt className="text-xs font-medium text-blue-800">{label}</dt>
                <dd className="text-sm text-blue-950">{value || "—"}</dd>
              </div>
            ))}
          </dl>
        ))}
      </div>
      <div className="flex items-center justify-between gap-4 border-t bg-blue-50 px-5 py-3">
        <p className="text-sm font-medium text-blue-800">Unrecovered cost</p>
        <p className="rounded-lg bg-amber-200 px-3 py-1 text-sm font-semibold tabular-nums text-blue-950">
          {peso.format(customer.unrecoveredCost)}
        </p>
      </div>
    </div>
  )
}

function RecordTable({
  columns,
  empty,
}: {
  columns: readonly string[]
  empty: string
}) {
  return (
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
          <TableRow>
            <TableCell colSpan={columns.length} className="px-4 py-6 text-center">
              <TableEmpty label={empty} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

function LedgerPanel({
  title,
  customer,
  columns,
  empty,
}: {
  title: string
  customer: LedgerCustomer
  columns: readonly string[]
  empty: string
}) {
  return (
    <div className="flex flex-col gap-4">
      <LoanLedgerSummary title={title} customer={customer} />
      <RecordTable columns={columns} empty={empty} />
    </div>
  )
}

const resultColumns = ["Internal ID", "Customer name", "Date of purchase", "Sales order No.", "Location"]

export function AccountLedgerView({ searchable = false }: { searchable?: boolean }) {
  const [tab, setTab] = useState<AccountLedgerTab>(tabs[0])
  const [query, setQuery] = useState("")
  const [resultsOpen, setResultsOpen] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [selected, setSelected] = useState<LedgerCustomer>(ledgerCustomers[0])
  const [loading, setLoading] = useState(true)
  const skipSearch = useRef(false)
  const matches = ledgerCustomers.filter((customer) => matchesCustomer(customer, query))

  useEffect(() => {
    setLoading(true)
    const timer = window.setTimeout(() => setLoading(false), 600)
    return () => window.clearTimeout(timer)
  }, [selected.internalId])

  useEffect(() => {
    if (!searchable) return
    if (skipSearch.current) {
      skipSearch.current = false
      return
    }
    if (query.trim() === "") {
      setSearchLoading(false)
      setResultsOpen(false)
      return
    }
    setResultsOpen(true)
    setSearchLoading(true)
    const timer = window.setTimeout(() => setSearchLoading(false), 3500)
    return () => window.clearTimeout(timer)
  }, [query, searchable])

  return (
    <section className="-mt-5.5 flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Account Ledger" className="flex flex-wrap gap-2">
          {tabs.map((item) => {
            const selected = tab === item
            return (
              <Button
                key={item}
                type="button"
                role="tab"
                aria-selected={selected}
                size="sm"
                className={
                  selected
                    ? "bg-blue-800 px-3 text-white hover:bg-blue-900"
                    : "bg-white px-3 text-blue-800 ring-1 ring-blue-200 hover:bg-blue-50"
                }
                onClick={() => setTab(item)}
              >
                {item}
              </Button>
            )
          })}
        </div>
        {searchable ? (
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by customer name, customer ID, or sales order"
              className="h-8 bg-white pl-9"
            />
          </div>
        ) : null}
      </div>
      <div className="relative">
      <div role="tabpanel">
        {loading ? (
          tab === "Payment history" ? (
            <div className="overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-blue-200">
              <LoadingState />
            </div>
          ) : (
            <LoadingState variant={tab === "Loan Ledger" ? "summary" : "fields"} />
          )
        ) : tab === "Customer set-up" ? (
          <CustomerSetupForm customer={selected} />
        ) : tab === "Branch info" ? (
          <BranchInfoForm customer={selected} />
        ) : tab === "Loan Ledger" ? (
          <LedgerPanel
            title="Per customer loan ledger"
            customer={selected}
            columns={loanLedgerColumns}
            empty="No installments are listed yet."
          />
        ) : tab === "Payment history" ? (
          <RecordTable columns={paymentHistoryColumns} empty="No payments are listed yet." />
        ) : (
          <div className="rounded-xl bg-white px-6 py-8 shadow-md ring-1 ring-blue-200">
            <h2 className="text-lg font-semibold tracking-tight">{tab}</h2>
          </div>
        )}
      </div>
      {searchable && resultsOpen ? (
        <div className="absolute inset-0 z-10 overflow-auto rounded-xl bg-blue-50 p-4 shadow-md ring-1 ring-blue-200">
          {searchLoading ? (
          <div className="overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-blue-200">
            <Table>
              <TableHeader className="bg-blue-50 text-blue-950">
                <TableRow>
                  {resultColumns.map((column) => (
                    <TableHead key={column} className="px-4 text-blue-950">
                      {column}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={resultColumns.length} className="px-4">
                    <LoadingState />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          ) : matches.length === 0 ? (
            <div className="flex min-h-80 items-center justify-center rounded-xl bg-white shadow-md ring-1 ring-blue-200">
              <TableEmpty label="No customer matches that search." />
            </div>
          ) : (
          <div className="overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-blue-200">
            <Table>
              <TableHeader className="bg-blue-50 text-blue-950">
                <TableRow>
                  {resultColumns.map((column) => (
                    <TableHead key={column} className="px-4 text-blue-950">
                      {column}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {matches.map((customer) => (
                    <TableRow
                      key={customer.internalId}
                      className="cursor-pointer"
                      onClick={() => {
                        skipSearch.current = true
                        setSelected(customer)
                        setQuery(customer.customerName)
                        setSearchLoading(false)
                        setResultsOpen(false)
                      }}
                    >
                      <TableCell className="px-4">{customer.internalId}</TableCell>
                      <TableCell className="px-4">{customer.customerName}</TableCell>
                      <TableCell className="px-4">{customer.purchaseDate}</TableCell>
                      <TableCell className="px-4">{customer.salesOrderNo}</TableCell>
                      <TableCell className="px-4">{customer.location}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          )}
        </div>
      ) : null}
      </div>
    </section>
  )
}

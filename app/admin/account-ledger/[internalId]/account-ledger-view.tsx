"use client"

import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import { Search } from "lucide-react"

import { BranchInfoForm } from "@/components/branch-info-form"
import { CustomerSetupForm } from "@/components/customer-setup-form"
import { type LedgerCustomer } from "@/components/ledger-customers"
import { apiService, toApiErrorMessage } from "@/lib/apiService"
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
  rows,
  empty,
}: {
  columns: readonly string[]
  rows: string[][]
  empty: string
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-blue-200">
      <Table containerClassName="min-h-0 flex-1 overflow-y-auto">
        <TableHeader className="sticky top-0 z-10 bg-blue-50 text-blue-950">
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column} className="bg-blue-50 px-4 text-blue-950">
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="px-4 py-6 text-center">
                <TableEmpty label={empty} />
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, index) => (
              <TableRow key={`${row[0]}-${index}`}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={`${columns[cellIndex]}-${index}`} className="px-4">
                    {cell || "—"}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function LedgerPanel({
  title,
  customer,
  columns,
  rows,
  empty,
}: {
  title: string
  customer: LedgerCustomer
  columns: readonly string[]
  rows: string[][]
  empty: string
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="shrink-0">
        <LoanLedgerSummary title={title} customer={customer} />
      </div>
      <RecordTable columns={columns} rows={rows} empty={empty} />
    </div>
  )
}

const purchaseDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
})

function textOf(value: unknown) {
  return typeof value === "string" || typeof value === "number" ? String(value) : ""
}

function locationOf(value: unknown) {
  if (typeof value === "string" || typeof value === "number") return String(value)
  if (value && typeof value === "object") {
    const record = value as { location_name?: unknown; name?: unknown }
    return textOf(record.location_name) || textOf(record.name)
  }
  return ""
}

function formatDate(value: string) {
  if (!value) return "—"
  const date = new Date(`${value.slice(0, 10)}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return purchaseDate.format(date)
}

function money(value: unknown) {
  const amount = Number(value)
  return Number.isFinite(amount) ? peso.format(amount) : "—"
}

type LedgerLine = {
  installment_number?: unknown
  due_date?: unknown
  payment_date?: unknown
  payment_ref?: unknown
  penalty?: unknown
  rebate?: unknown
  monthly_installment_paid?: unknown
  monthly_principal_paid?: unknown
  monthly_interest_paid?: unknown
  penalty_paid?: unknown
  overdue?: unknown
  balance_wo_penalty?: unknown
  balance_w_penalty?: unknown
}

function readAccount(payload: unknown) {
  const account = payload && typeof payload === "object" ? (payload as { account?: Record<string, unknown> }).account : null
  if (!account) return null
  const customer: LedgerCustomer = {
    internalId: textOf(account.internal_id),
    customerName: textOf(account.customer_name),
    customerId: textOf(account.customer_id),
    purchaseDate: formatDate(textOf(account.purchase_date)),
    salesOrderNo: textOf(account.sales_order_no),
    location: locationOf(account.location),
    itemUnit: textOf(account.item),
    loanStartDate: textOf(account.loan_start_date).slice(0, 10),
    loanStartLabel: formatDate(textOf(account.loan_start_date)),
    loanAmount: textOf(account.loan_amount),
    downPayment: textOf(account.down_payment),
    termMonths: textOf(account.term),
    rebateAmount: "",
    financedAmount: textOf(account.financed_amount),
    monthlyInterest: textOf(account.monthly_interest),
    monthlyInstallment: textOf(account.monthly_installment),
    branchName: "",
    branchCode: "",
    preparedBy: "",
    approver: "",
    contactNo: "",
    templateVersion: "",
    loanStatus: textOf(account.loan_status),
    currentBalance: Number(account.current_balance) || 0,
    totalPayments: Number(account.total_payments) || 0,
    totalAmountDue: Number(account.total_amount_due) || 0,
    totalBalanceDue: Number(account.total_balance_due) || 0,
    unrecoveredCost: Number(account.unrecovered_cost) || 0,
    notes: "",
  }
  const lines = Array.isArray(account.ledgers) ? (account.ledgers as LedgerLine[]) : []
  const monthlyInstallment = textOf(account.monthly_installment)
  const monthlyPrincipal = textOf(account.monthly_principal)
  const monthlyInterest = textOf(account.monthly_interest)
  const rebated = account.is_rebated ? "Yes" : "No"
  const ledgerRows = lines.map((line) => {
    const paid = [line.monthly_principal_paid, line.monthly_interest_paid, line.penalty_paid].some((value) => Number(value) > 0)
    const breakdown = paid
      ? `Principal ${money(line.monthly_principal_paid)} · Interest ${money(line.monthly_interest_paid)} · Penalty ${money(line.penalty_paid)}`
      : ""
    return [
      textOf(line.installment_number),
      formatDate(textOf(line.due_date)),
      formatDate(textOf(line.payment_date)),
      textOf(line.payment_ref),
      money(monthlyInstallment),
      money(monthlyPrincipal),
      money(monthlyInterest),
      money(line.penalty),
      money(line.rebate),
      money(line.monthly_installment_paid),
      money(line.monthly_principal_paid),
      money(line.monthly_interest_paid),
      money(line.penalty_paid),
      money(line.overdue),
      money(line.balance_wo_penalty),
      money(line.balance_w_penalty),
      breakdown,
    ]
  })
  const payments = lines.flatMap((line) => {
    if (!textOf(line.payment_date)) return []
    return [[
      formatDate(textOf(line.payment_date)),
      textOf(line.payment_ref),
      money(line.monthly_installment_paid),
      money(line.penalty_paid),
      money(line.monthly_installment_paid),
      money(0),
      "",
      textOf(account.location),
      "",
      "Posted",
      rebated,
    ]]
  })
  return { id: textOf(account.id), customer, ledgerRows, payments }
}

type AccountMatch = {
  id: string
  internalId: string
  customerName: string
  purchaseDate: string
  salesOrderNo: string
  location: string
}

function readMatches(payload: unknown): AccountMatch[] {
  if (!payload || typeof payload !== "object") return []
  const accounts = (payload as { accounts?: { data?: unknown } | unknown[] }).accounts
  const list = Array.isArray(accounts)
    ? accounts
    : accounts && typeof accounts === "object" && Array.isArray(accounts.data)
      ? accounts.data
      : []
  return list.flatMap((item) => {
    if (!item || typeof item !== "object") return []
    const row = item as Record<string, unknown>
    const id = textOf(row.id)
    if (!id) return []
    return [{
      id,
      internalId: textOf(row.internal_id),
      customerName: textOf(row.customer_name),
      purchaseDate: formatDate(textOf(row.purchase_date)),
      salesOrderNo: textOf(row.so_number),
      location: locationOf(row.location),
    }]
  })
}

const resultColumns = ["Internal ID", "Customer name", "Date of purchase", "Sales order No.", "Location"]

export function AccountLedgerView({ searchable = false }: { searchable?: boolean }) {
  const params = useParams<{ internalId?: string }>()
  const routeId = typeof params.internalId === "string" ? decodeURIComponent(params.internalId) : ""
  const [tab, setTab] = useState<AccountLedgerTab>(tabs[0])
  const [query, setQuery] = useState("")
  const [resultsOpen, setResultsOpen] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [matches, setMatches] = useState<AccountMatch[]>([])
  const [selected, setSelected] = useState<LedgerCustomer | null>(null)
  const [ledgerRows, setLedgerRows] = useState<string[][]>([])
  const [payments, setPayments] = useState<string[][]>([])
  const [accountKey, setAccountKey] = useState(routeId)
  const [loading, setLoading] = useState(Boolean(routeId))
  const [error, setError] = useState("")
  const skipSearch = useRef(false)

  useEffect(() => {
    if (!accountKey) return
    let cancelled = false

    async function load() {
      setLoading(true)
      setError("")
      try {
        const data = await apiService.getAccount(accountKey)
        const next = readAccount(data)
        if (!cancelled) {
          if (!next) {
            setSelected(null)
            setLedgerRows([])
            setPayments([])
            setError("Account not found.")
          } else {
            setSelected(next.customer)
            setLedgerRows(next.ledgerRows)
            setPayments(next.payments)
          }
        }
      } catch (loadError) {
        if (!cancelled) {
          setSelected(null)
          setLedgerRows([])
          setPayments([])
          setError(toApiErrorMessage(loadError, "That account could not be loaded."))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [accountKey])

  useEffect(() => {
    if (!searchable) return
    if (skipSearch.current) {
      skipSearch.current = false
      return
    }
    const text = query.trim()
    if (text === "") {
      setSearchLoading(false)
      setResultsOpen(false)
      setMatches([])
      return
    }
    setResultsOpen(true)
    setSearchLoading(true)
    let cancelled = false
    const timer = window.setTimeout(() => {
      void apiService.getAccounts(1, text).then((data) => {
        if (cancelled) return
        setMatches(readMatches(data))
        setSearchLoading(false)
      }).catch((searchError) => {
        if (cancelled) return
        setMatches([])
        setSearchLoading(false)
        setError(toApiErrorMessage(searchError, "Accounts could not be searched."))
      })
    }, 300)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [query, searchable])

  return (
    <section className="-flex h-[calc(100svh-11.5rem)] min-h-0 flex-col gap-6 sm:h-[calc(100svh-12.5rem)]">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
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
      <div className="relative min-h-0 flex-1">
      <div role="tabpanel" className="flex h-full min-h-0 flex-col">
        {loading ? (
          tab === "Payment history" ? (
            <div className="overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-blue-200">
              <LoadingState />
            </div>
          ) : (
            <LoadingState variant={tab === "Loan Ledger" ? "summary" : "fields"} />
          )
        ) : error || !selected ? (
          <div className="flex min-h-80 items-center justify-center rounded-xl bg-white shadow-md ring-1 ring-blue-200">
            <TableEmpty label={error || "Search for an account."} />
          </div>
        ) : tab === "Customer set-up" ? (
          <CustomerSetupForm customer={selected} />
        ) : tab === "Branch info" ? (
          <BranchInfoForm customer={selected} />
        ) : tab === "Loan Ledger" ? (
          <LedgerPanel
            title="Per customer loan ledger"
            customer={selected}
            columns={loanLedgerColumns}
            rows={ledgerRows}
            empty="No installments are listed yet."
          />
        ) : tab === "Payment history" ? (
          <RecordTable columns={paymentHistoryColumns} rows={payments} empty="No payments are listed yet." />
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
                      key={customer.id}
                      className="cursor-pointer"
                      onClick={() => {
                        skipSearch.current = true
                        setAccountKey(customer.id)
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

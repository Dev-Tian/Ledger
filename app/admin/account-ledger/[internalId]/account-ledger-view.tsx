"use client"

import { useState } from "react"

import { BranchInfoForm } from "@/components/branch-info-form"
import { CustomerSetupForm } from "@/components/customer-setup-form"
import { Button } from "@/components/ui/button"
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

const loanLedgerDetailColumns = loanLedgerColumns.filter(
  (column) => column !== "Payment breakdown",
)

const paymentDetailNote =
  "Each due date appears once per actual payment reference. If a due date has no payment, one scheduled row appears."

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
  "Loan Ledger detail",
  "Payment history",
] as const

type AccountLedgerTab = (typeof tabs)[number]

const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 2,
})

const loanSummary = [
  [
    ["Customer name", "Sample Customer"],
    ["Customer ID", "CUST-001"],
    ["Loan start date", "Apr 3, 2026"],
    ["Term (months)", "36"],
    ["Monthly principal", peso.format(3750)],
    ["Notes", ""],
  ],
  [
    ["Sales order no.", "SO-0001"],
    ["Item / unit", "Smash 115"],
    ["Original loan amount", peso.format(242268)],
    ["Down payment", peso.format(15000)],
    ["Monthly interest", peso.format(2563)],
    ["Monthly installment", peso.format(6313)],
  ],
  [
    ["Loan status", "Fully paid"],
    ["Current balance", peso.format(0)],
    ["Total payments", peso.format(32028)],
    ["Total amount due", peso.format(13120)],
    ["Total balance due", peso.format(0)],
  ],
] as const

function LoanLedgerSummary({ title, notes }: { title: string; notes: string }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-blue-200">
      <div className="bg-blue-800 px-5 py-4 text-white">
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-blue-100">These fields are read only.</p>
      </div>
      <div className="grid gap-6 px-5 py-5 lg:grid-cols-3">
        {loanSummary.map((column) => (
          <dl key={column[0][0]} className="flex flex-col gap-3">
            {column.map(([label, value]) => (
              <div key={label} className="flex flex-col gap-1">
                <dt className="text-xs font-medium text-blue-800">{label}</dt>
                <dd className="text-sm text-blue-950">
                  {(label === "Notes" ? notes : value) || "—"}
                </dd>
              </div>
            ))}
          </dl>
        ))}
      </div>
      <div className="flex items-center justify-between gap-4 border-t bg-blue-50 px-5 py-3">
        <p className="text-sm font-medium text-blue-800">Unrecovered cost</p>
        <p className="rounded-lg bg-amber-200 px-3 py-1 text-sm font-semibold tabular-nums text-blue-950">
          {peso.format(116473)}
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
            <TableCell
              colSpan={columns.length}
              className="px-4 py-10 text-center text-muted-foreground"
            >
              {empty}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

function LedgerPanel({
  title,
  notes,
  columns,
  empty,
}: {
  title: string
  notes: string
  columns: readonly string[]
  empty: string
}) {
  return (
    <div className="flex flex-col gap-4">
      <LoanLedgerSummary title={title} notes={notes} />
      <RecordTable columns={columns} empty={empty} />
    </div>
  )
}

export function AccountLedgerView() {
  const [tab, setTab] = useState<AccountLedgerTab>(tabs[0])

  return (
    <section className="-mt-5.5 flex flex-col gap-6">
     
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
      <div role="tabpanel">
        {tab === "Customer set-up" ? (
          <CustomerSetupForm />
        ) : tab === "Branch info" ? (
          <BranchInfoForm />
        ) : tab === "Loan Ledger" ? (
          <LedgerPanel
            title="Per customer loan ledger"
            notes=""
            columns={loanLedgerColumns}
            empty="No installments are listed yet."
          />
        ) : tab === "Loan Ledger detail" ? (
          <LedgerPanel
            title="Per customer loan ledger — payment detail"
            notes={paymentDetailNote}
            columns={loanLedgerDetailColumns}
            empty="No payment details are listed yet."
          />
        ) : tab === "Payment history" ? (
          <RecordTable columns={paymentHistoryColumns} empty="No payments are listed yet." />
        ) : (
          <div className="rounded-xl bg-white px-6 py-8 shadow-md ring-1 ring-blue-200">
            <h2 className="text-lg font-semibold tracking-tight">{tab}</h2>
          </div>
        )}
      </div>
    </section>
  )
}

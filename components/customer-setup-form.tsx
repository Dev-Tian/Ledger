"use client"

import { useMemo, useState } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const steps = [
  "Make one record for each customer.",
  "Enter the customer and loan details on this page.",
  "Payment History is used for payments only.",
  "Do not enter an installment number. Payments allocate automatically.",
  "Print the summary when it is needed.",
]

const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 2,
})

function toAmount(value: string) {
  const amount = Number(value)
  return Number.isFinite(amount) ? amount : 0
}

export function CustomerSetupForm() {
  const [customerName, setCustomerName] = useState("TAGLUCOP, Grant Selwyr A.")
  const [customerId, setCustomerId] = useState("102775")
  const [salesOrderNo, setSalesOrderNo] = useState("SO-MALA-38")
  const [itemUnit, setItemUnit] = useState("CT125AE")
  const [loanStartDate, setLoanStartDate] = useState("2025-04-03")
  const [loanAmount, setLoanAmount] = useState("147316")
  const [downPayment, setDownPayment] = useState("4000")
  const [termMonths, setTermMonths] = useState("36")

  const figures = useMemo(() => {
    const term = toAmount(termMonths)
    const financed = toAmount(loanAmount) - toAmount(downPayment)
    const monthlyInstallment = term > 0 ? financed / term : 0
    return {
      monthlyInstallment,
      monthlyInterest: 0,
    }
  }, [loanAmount, downPayment, termMonths])

  return (
    <section className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="overflow-hidden rounded-xl bg-background shadow-md ring-1 ring-blue-200">
        <div className="bg-blue-800 px-6 py-5 text-white">
          <h1 className="text-lg font-semibold tracking-tight">
            Customer loan setup
          </h1>
          <p className="mt-1 text-sm text-blue-100">
            Use this record for one customer only. Yellow fields are entered
            by the branch.
          </p>
        </div>
        <div className="flex flex-col gap-8 px-6 py-6">
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold tracking-tight text-blue-900">
              Customer
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Customer name" htmlFor="customer-name" className="sm:col-span-2">
                <Input
                  id="customer-name"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  className="h-10 bg-amber-50"
                />
              </Field>
              <Field label="Customer ID" htmlFor="customer-id">
                <Input
                  id="customer-id"
                  value={customerId}
                  onChange={(event) => setCustomerId(event.target.value)}
                  className="h-10 bg-amber-50"
                />
              </Field>
              <Field label="Sales order no." htmlFor="sales-order-no">
                <Input
                  id="sales-order-no"
                  value={salesOrderNo}
                  onChange={(event) => setSalesOrderNo(event.target.value)}
                  className="h-10 bg-amber-50"
                />
              </Field>
              <Field label="Item / unit" htmlFor="item-unit">
                <Input
                  id="item-unit"
                  value={itemUnit}
                  onChange={(event) => setItemUnit(event.target.value)}
                  className="h-10 bg-amber-50"
                />
              </Field>
              <Field label="Loan start date" htmlFor="loan-start-date">
                <Input
                  id="loan-start-date"
                  type="date"
                  value={loanStartDate}
                  onChange={(event) => setLoanStartDate(event.target.value)}
                  className="h-10 bg-amber-50"
                />
              </Field>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold tracking-tight text-blue-900">
              Loan
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <MoneyField
                label="Loan amount"
                id="loan-amount"
                value={loanAmount}
                onChange={setLoanAmount}
              />
              <MoneyField
                label="Down payment"
                id="down-payment"
                value={downPayment}
                onChange={setDownPayment}
              />
              <Field label="Term (months)" htmlFor="term-months">
                <Input
                  id="term-months"
                  inputMode="numeric"
                  value={termMonths}
                  onChange={(event) => setTermMonths(event.target.value)}
                  className="h-10 bg-amber-50 tabular-nums"
                />
              </Field>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Figure
              label="Monthly installment"
              value={peso.format(figures.monthlyInstallment)}
            />
            <Figure
              label="Monthly interest"
              value={peso.format(figures.monthlyInterest)}
            />
          </div>
        </div>
      </div>
      <aside className="overflow-hidden rounded-xl bg-background shadow-md ring-1 ring-blue-200">
        <h2 className="bg-blue-800 px-5 py-4 text-sm font-semibold text-white">
          Branch workflow
        </h2>
        <ol className="flex flex-col gap-4 px-5 py-5">
          {steps.map((step, index) => (
            <li key={step} className="flex gap-3 text-sm leading-6">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-800 text-xs font-semibold text-white">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </aside>
    </section>
  )
}

function Field({
  label,
  htmlFor,
  className,
  children,
}: {
  label: string
  htmlFor: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={className ? `flex flex-col gap-2 ${className}` : "flex flex-col gap-2"}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  )
}

function MoneyField({
  label,
  id,
  value,
  onChange,
}: {
  label: string
  id: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <Field label={label} htmlFor={id}>
      <div className="relative">
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
          ₱
        </span>
        <Input
          id={id}
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 bg-amber-50 pl-7 tabular-nums"
        />
      </div>
    </Field>
  )
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-blue-50 px-4 py-3 ring-1 ring-blue-200">
      <p className="text-xs font-medium text-blue-800">{label}</p>
      <p className="mt-1 text-lg font-semibold tracking-tight tabular-nums">
        {value}
      </p>
    </div>
  )
}

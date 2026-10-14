import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 2,
})

function toAmount(value: string) {
  const amount = Number(value)
  return Number.isFinite(amount) ? amount : 0
}

const customerName = "Sample Customer"
const customerId = "CUST-001"
const salesOrderNo = "SO-0001"
const itemUnit = "Smash 115"
const loanStartDate = "2026-04-03"
const loanAmount = "242268"
const downPayment = "15000"
const termMonths = "36"
const rebateAmount = "300"
const financedAmount = "135000"

const monthlyPrincipal =
  toAmount(termMonths) > 0 ? toAmount(financedAmount) / toAmount(termMonths) : 0
const monthlyInterest = 0
const monthlyInstallment = monthlyPrincipal + monthlyInterest

export function CustomerSetupForm() {

  return (
    <div className="mx-auto max-w-4xl overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-blue-200">
      <div className="bg-blue-800 px-5 py-4 text-white">
        <h2 className="text-base font-semibold tracking-tight">Customer loan setup</h2>
        <p className="mt-1 text-sm text-blue-100">
          One customer. These fields are read only.
        </p>
      </div>
      <div className="flex max-h-[min(32rem,calc(100svh-18rem))] flex-col gap-6 overflow-y-auto px-5 py-5">
        <Section title="Customer">
          <TextField
            label="Customer name"
            id="customer-name"
            value={customerName}
            className="sm:col-span-2"
          />
          <TextField
            label="Customer ID"
            id="customer-id"
            value={customerId}
          />
        </Section>
        <Section title="Purchase">
          <TextField
            label="Sales order no."
            id="sales-order-no"
            value={salesOrderNo}
          />
          <TextField label="Item / unit" id="item-unit" value={itemUnit} />
          <Field label="Loan start date" htmlFor="loan-start-date">
            <Input
              id="loan-start-date"
              type="date"
              readOnly
              value={loanStartDate}
              className="h-9 bg-white text-blue-950"
            />
          </Field>
        </Section>
        <Section title="Amounts">
          <MoneyField label="Loan amount" id="loan-amount" value={loanAmount} />
          <MoneyField
            label="Down payment"
            id="down-payment"
            value={downPayment}
          />
          <Field label="Term (months)" htmlFor="term-months">
            <Input
              id="term-months"
              inputMode="numeric"
              readOnly
              value={termMonths}
              className="h-9 bg-white text-blue-950 tabular-nums"
            />
          </Field>
          <MoneyField
            label="Rebate amount"
            id="rebate-amount"
            value={rebateAmount}
          />
          <MoneyField
            label="Financed amount"
            id="financed-amount"
            value={financedAmount}
          />
        </Section>
        <div className="grid gap-3 sm:grid-cols-3">
          <Figure label="Monthly principal" value={peso.format(monthlyPrincipal)} />
          <Figure label="Monthly interest" value={peso.format(monthlyInterest)} />
          <Figure label="Monthly installment" value={peso.format(monthlyInstallment)} />
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold tracking-wide text-blue-800 uppercase">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
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
    <div className={className ? `flex flex-col gap-1.5 ${className}` : "flex flex-col gap-1.5"}>
      <Label htmlFor={htmlFor} className="text-xs text-blue-950">
        {label}
      </Label>
      {children}
    </div>
  )
}

function TextField({
  label,
  id,
  value,
  className,
}: {
  label: string
  id: string
  value: string
  className?: string
}) {
  return (
    <Field label={label} htmlFor={id} className={className}>
      <Input id={id} readOnly value={value} className="h-9 bg-white text-blue-950" />
    </Field>
  )
}

function MoneyField({
  label,
  id,
  value,
}: {
  label: string
  id: string
  value: string
}) {
  return (
    <Field label={label} htmlFor={id}>
      <div className="relative">
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
          ₱
        </span>
        <Input
          id={id}
          readOnly
          value={value}
          className="h-9 bg-white pl-7 text-blue-950 tabular-nums"
        />
      </div>
    </Field>
  )
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-blue-50 px-3 py-2.5 ring-1 ring-blue-200">
      <p className="text-xs font-medium text-blue-800">{label}</p>
      <p className="mt-1 text-sm font-semibold tabular-nums">{value}</p>
    </div>
  )
}

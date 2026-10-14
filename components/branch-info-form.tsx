import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const branchName = ""
const branchCode = ""
const preparedBy = ""
const approver = ""
const contactNo = ""
const templateVersion = "Branch Production v1"
const customerName = "Sample Customer"
const customerId = "CUST-001"
const salesOrderNo = "SO-0001"
const itemUnit = "Smash 115"
const loanStartDate = "2026-04-03"
const loanAmount = "242268"
const downPayment = "15000"
const termMonths = "36"
const monthlyInstallment = "3750"
const monthlyInterest = "2563"

export function BranchInfoForm() {

  return (
    <div className="mx-auto max-w-4xl overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-blue-200">
      <div className="bg-blue-800 px-5 py-4 text-white">
        <h2 className="text-base font-semibold tracking-tight">Branch loan template</h2>
        <p className="mt-1 text-sm text-blue-100">
          Branch details and the loan inputs for this account. These fields are read only.
        </p>
      </div>
      <div className="flex max-h-[min(32rem,calc(100svh-18rem))] flex-col gap-6 overflow-y-auto px-5 py-5">
        <Section title="Branch">
          <TextField label="Branch name" id="branch-name" value={branchName} />
          <TextField label="Branch code" id="branch-code" value={branchCode} />
          <TextField label="Prepared by" id="prepared-by" value={preparedBy} />
          <TextField label="Approver" id="approver" value={approver} />
          <TextField label="Contact no." id="contact-no" value={contactNo} />
          <TextField label="Template version" id="template-version" value={templateVersion} />
        </Section>
        <Section title="Loan setup">
          <TextField
            label="Customer name"
            id="branch-customer-name"
            value={customerName}
            className="sm:col-span-2"
          />
          <TextField
            label="Customer ID"
            id="branch-customer-id"
            value={customerId}
          />
          <TextField
            label="Sales order no."
            id="branch-sales-order-no"
            value={salesOrderNo}
          />
          <TextField
            label="Item / unit"
            id="branch-item-unit"
            value={itemUnit}
          />
          <Field label="Loan start date" htmlFor="branch-loan-start-date">
            <Input
              id="branch-loan-start-date"
              type="date"
              readOnly
              value={loanStartDate}
              className="h-9 bg-white text-blue-950"
            />
          </Field>
          <MoneyField
            label="Loan amount"
            id="branch-loan-amount"
            value={loanAmount}
          />
          <MoneyField
            label="Down payment"
            id="branch-down-payment"
            value={downPayment}
          />
          <Field label="Term (months)" htmlFor="branch-term-months">
            <Input
              id="branch-term-months"
              inputMode="numeric"
              readOnly
              value={termMonths}
              className="h-9 bg-white text-blue-950 tabular-nums"
            />
          </Field>
          <MoneyField
            label="Monthly installment"
            id="branch-monthly-installment"
            value={monthlyInstallment}
          />
          <MoneyField
            label="Monthly interest"
            id="branch-monthly-interest"
            value={monthlyInterest}
          />
        </Section>
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

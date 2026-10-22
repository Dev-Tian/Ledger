import { ledgerCustomers, type LedgerCustomer } from "@/components/ledger-customers"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function BranchInfoForm({
  customer = ledgerCustomers[0],
}: {
  customer?: LedgerCustomer
}) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-blue-200">
      <div className="shrink-0 bg-blue-800 px-5 py-4 text-white">
        <h2 className="text-2xl font-semibold tracking-tight uppercase">{customer.customerName}</h2>
        <p className="mt-1 text-sm text-blue-100">
          Branch details and the loan inputs for this account. These fields are read only.
        </p>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        <div className="flex flex-col gap-6 pb-6">
          <Section title="Branch">
            <TextField label="Branch name" id="branch-name" value={customer.branchName} />
            <TextField label="Branch code" id="branch-code" value={customer.branchCode} />
            <TextField label="Prepared by" id="prepared-by" value={customer.preparedBy} />
            <TextField label="Approver" id="approver" value={customer.approver} />
            <TextField label="Contact no." id="contact-no" value={customer.contactNo} />
            <TextField label="Template version" id="template-version" value={customer.templateVersion} />
          </Section>
          <Section title="Loan setup">
            <TextField
              label="Customer ID"
              id="branch-customer-id"
              value={customer.customerId}
            />
            <TextField
              label="Sales order no."
              id="branch-sales-order-no"
              value={customer.salesOrderNo}
            />
            <TextField
              label="Item / unit"
              id="branch-item-unit"
              value={customer.itemUnit}
            />
            <Field label="Loan start date" htmlFor="branch-loan-start-date">
              <Input
                id="branch-loan-start-date"
                type="date"
                readOnly
                value={customer.loanStartDate}
                className="h-9 bg-white text-blue-950"
              />
            </Field>
            <MoneyField
              label="Loan amount"
              id="branch-loan-amount"
              value={customer.loanAmount}
            />
            <MoneyField
              label="Down payment"
              id="branch-down-payment"
              value={customer.downPayment}
            />
            <Field label="Term (months)" htmlFor="branch-term-months">
              <Input
                id="branch-term-months"
                inputMode="numeric"
                readOnly
                value={customer.termMonths}
                className="h-9 bg-white text-blue-950 tabular-nums"
              />
            </Field>
            <MoneyField
              label="Monthly installment"
              id="branch-monthly-installment"
              value={customer.monthlyInstallment}
            />
            <MoneyField
              label="Monthly interest"
              id="branch-monthly-interest"
              value={customer.monthlyInterest}
            />
          </Section>
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
        <span className="pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2 text-sm text-muted-foreground">
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

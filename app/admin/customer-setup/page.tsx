import { LedgerPage } from "@/components/ledger-page"

export const instant = false

export default function AdminCustomerSetupPage() {
  return (
    <LedgerPage
      title="Customer setup"
      description="Customer records for installment accounts are maintained in this area."
    />
  )
}

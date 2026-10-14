import { LedgerPage } from "@/components/ledger-page"

export const instant = false

export default function AdminPaymentHistoryPage() {
  return (
    <LedgerPage
      title="Payment history"
      description="Posted payments and collections are listed in this area."
    />
  )
}

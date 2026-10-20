"use client"

import { AccountsTable } from "@/components/accounts-table"

export default function ViewerAccountsPage() {
  return (
    <AccountsTable
      description="Installment accounts available for this role."
      ledgerBasePath="/viewer/account-ledger"
    />
  )
}

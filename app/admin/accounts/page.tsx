"use client"

import { AccountsTable } from "@/components/accounts-table"

export default function AdminAccountsPage() {
  return (
    <AccountsTable
      description="Installment accounts managed by an administrator."
      ledgerBasePath="/admin/account-ledger"
    />
  )
}

"use client"

import { AccountsTable } from "@/components/accounts-table"

export default function UploaderAccountsPage() {
  return (
    <AccountsTable
      description="Installment accounts are listed here."
      ledgerBasePath="/uploader/account-ledger"
    />
  )
}

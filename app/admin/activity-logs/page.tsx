"use client"

import { ActivityLogsTable } from "@/components/activity-logs-table"

export default function AdminActivityLogsPage() {
  return (
    <ActivityLogsTable description="Sign-ins, user changes, and spreadsheet uploads on the ledger." />
  )
}

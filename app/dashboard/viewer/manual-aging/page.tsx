import { CalendarClock } from "lucide-react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const columns = [
  "Account",
  "Customer",
  "Due date",
  "Days past due",
  "Bucket",
  "Balance",
]

export default function ViewerManualAgingPage() {
  return (
    <section className="flex flex-col gap-6">
      <div className="max-w-xl">
        <p className="text-sm font-medium text-blue-700">Viewer</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Manual aging
        </h1>
        <p className="mt-2 leading-7 text-muted-foreground">
          Past-due installment accounts, grouped by how long each balance has
          been outstanding.
        </p>
      </div>
      <Card className="overflow-hidden shadow-md ring-blue-200">
        <CardHeader className="border-b border-blue-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-blue-600 text-white">
              <CalendarClock className="size-5" />
            </div>
            <div>
              <CardTitle>Aging schedule</CardTitle>
              <CardDescription>No accounts are listed yet.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="bg-blue-50 text-blue-950">
              <tr>
                {columns.map((column) => (
                  <th key={column} className="px-4 py-3 font-medium">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  The aging schedule will appear here when the ledger service
                  returns it.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  )
}

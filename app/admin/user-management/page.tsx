import { UserCog } from "lucide-react"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const instant = false

const columns = ["Name", "Email", "Role"]

export default function UserManagementPage() {
  return (
    <section className="flex flex-col gap-6">
      <div className="max-w-xl">
        <p className="text-sm font-medium text-blue-700">Admin</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          User management
        </h1>
        <p className="mt-2 leading-7 text-muted-foreground">
          People who can sign in as admin, uploader, or viewer.
        </p>
      </div>
      <Card className="overflow-hidden shadow-md ring-blue-200">
        <CardHeader className="border-b border-blue-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-blue-600 text-white">
              <UserCog className="size-5" />
            </div>
            <div>
              <CardTitle>Ledger users</CardTitle>
              <CardDescription>No users are listed yet.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-sm">
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
                <td colSpan={columns.length} className="px-4 py-10 text-center text-muted-foreground">
                  The user list will appear here when the account service returns it.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  )
}

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const columns = ["Branch code", "Name", "Email", "Branch"]

export default function AdminUsersPage() {
  return (
    <section className="flex flex-col gap-6">
      <div className="max-w-xl">
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Users</h1>
        <p className="mt-2 leading-7 text-muted-foreground">
          People who can sign in to the ledger are listed in this area.
        </p>
      </div>
      <div className="overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-blue-200">
        <Table>
          <TableHeader className="bg-blue-50 text-blue-950">
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column} className="px-4 text-blue-950">
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="px-4 py-10 text-center text-muted-foreground"
              >
                No users are listed yet.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </section>
  )
}

"use client"

import { useEffect, useState } from "react"
import { RefreshCw } from "lucide-react"

import { TableEmpty } from "@/components/table-empty"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const columns = ["Name", "Email", "Branch", "Branch code"]

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 600)
    return () => window.clearTimeout(timer)
  }, [reloadKey])

  function refresh() {
    setLoading(true)
    setReloadKey((key) => key + 1)
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-xl">
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Users</h1>
          <p className="mt-2 leading-7 text-muted-foreground">
            People who can sign in to the ledger are listed in this area.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="mt-2 px-3"
          disabled={loading}
          onClick={refresh}
        >
          <RefreshCw />
          Refresh
        </Button>
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
            {loading ? (
              Array.from({ length: 5 }, (_, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column} className="px-4">
                      <Skeleton className="h-4 w-full max-w-32" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="px-4 py-6 text-center">
                  <TableEmpty label="" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}

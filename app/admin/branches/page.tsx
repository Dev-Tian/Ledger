"use client"

import { Pencil, Plus, RefreshCw, Search, Trash2, Users } from "lucide-react"
import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const branches = [
  {
    code: "BOHL",
    name: "Bohol Logistics",
    company: "Strong Moto Centrum, Inc. - SMCT",
  },
  {
    code: "ALAD",
    name: "Alano",
    company: "Des Appliance Plaza, Inc. - DAP",
  },
]

export default function AdminBranchesPage() {
  const [query, setQuery] = useState("")
  const shown = useMemo(() => {
    const text = query.trim().toLowerCase()
    if (!text) return branches
    return branches.filter((branch) =>
      [branch.name, branch.code, branch.company].some((value) =>
        value.toLowerCase().includes(text),
      ),
    )
  }, [query])

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Branches</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View and manage branches information
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" className="bg-blue-800 px-3 text-white hover:bg-blue-900">
            <Plus />
            Add branch
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="px-3"
            onClick={() => setQuery("")}
          >
            <RefreshCw />
            Refresh
          </Button>
        </div>
      </div>
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by branch, branch code, or branch name"
          className="h-10 bg-white pl-9"
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {shown.map((branch) => (
          <article
            key={branch.code}
            className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-md ring-1 ring-blue-200"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold tracking-tight text-blue-950 uppercase">
                  {branch.name} / {branch.code}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{branch.company}</p>
              </div>
              <div className="flex items-center gap-1">
                <Button type="button" size="icon-sm" variant="ghost" aria-label={`Edit ${branch.name}`}>
                  <Pencil className="text-blue-700" />
                </Button>
                <Button type="button" size="icon-sm" variant="ghost" aria-label={`Delete ${branch.name}`}>
                  <Trash2 className="text-red-600" />
                </Button>
              </div>
            </div>
            <Button type="button" size="sm" className="bg-blue-800 text-white hover:bg-blue-900">
              <Users />
              View customers
            </Button>
          </article>
        ))}
      </div>
      {shown.length === 0 ? (
        <p className="text-sm text-muted-foreground">No branches match that search.</p>
      ) : null}
    </section>
  )
}

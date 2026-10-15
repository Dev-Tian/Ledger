"use client"

import { useState, type FormEvent } from "react"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function AddBranchModal({
  open,
  onOpenChangeAction,
  onAddAction,
}: {
  open: boolean
  onOpenChangeAction: (open: boolean) => void
  onAddAction: (branch: { name: string; code: string; company: string }) => boolean
}) {
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [company, setCompany] = useState("")
  const [error, setError] = useState("")

  function reset() {
    setName("")
    setCode("")
    setCompany("")
    setError("")
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset()
    onOpenChangeAction(next)
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    const next = {
      name: name.trim(),
      code: code.trim().toUpperCase(),
      company: company.trim(),
    }
    if (!next.name || !next.code || !next.company) {
      setError("Fill in the branch name, code, and company.")
      return
    }
    if (!onAddAction(next)) {
      setError("That branch code is already listed.")
      return
    }
    handleOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="gap-0 overflow-hidden p-0 shadow-lg ring-blue-200 sm:max-w-md">
        <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-sky-500 px-6 py-4 text-white">
          <AlertDialogTitle className="text-lg">Add branch</AlertDialogTitle>
          <AlertDialogDescription className="text-blue-100">
            Enter the branch name, code, and company.
          </AlertDialogDescription>
        </div>
        <form className="flex flex-col gap-4 px-6 py-5" onSubmit={submit}>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-blue-950">Branch name</span>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-10 bg-white text-blue-950"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-blue-950">Branch code</span>
            <Input
              value={code}
              onChange={(event) => setCode(event.target.value)}
              className="h-10 bg-white text-blue-950 uppercase"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-blue-950">Company</span>
            <Input
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              className="h-10 bg-white text-blue-950"
            />
          </label>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-blue-800 px-3 text-white hover:bg-blue-900"
            >
              Add branch
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

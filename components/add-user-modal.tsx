"use client"

import { useEffect, useState, type FormEvent } from "react"

import { BranchCodeCombobox } from "@/components/branch-code-combobox"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { apiService, toApiErrorMessage } from "@/lib/apiService"

export function AddUserModal({
  open,
  branches,
  onOpenChangeAction,
  onAddedAction,
}: {
  open: boolean
  branches: string[]
  onOpenChangeAction: (open: boolean) => void
  onAddedAction: () => void
}) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [branchCode, setBranchCode] = useState("")
  const [password, setPassword] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!open) return
    setName("")
    setEmail("")
    setCode("")
    setBranchCode("")
    setPassword("")
    setError("")
  }, [open])

  async function submit(event: FormEvent) {
    event.preventDefault()
    const nextName = name.trim()
    const nextCode = code.trim()
    const nextBranch = branchCode.trim()
    const nextPassword = password.trim()
    if (!nextName || !nextCode || !nextBranch || !nextPassword) {
      setError("Fill in the name, code, branch code, and password.")
      return
    }
    if (nextPassword.length < 8 || nextPassword.length > 20) {
      setError("Password must be 8 to 20 characters.")
      return
    }
    setSaving(true)
    setError("")
    try {
      await apiService.addUser({
        name: nextName,
        code: nextCode,
        email: email.trim() || null,
        branch_code: nextBranch,
        password: nextPassword,
      })
      onAddedAction()
      onOpenChangeAction(false)
    } catch (saveError) {
      setError(toApiErrorMessage(saveError, "This user could not be added."))
    } finally {
      setSaving(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChangeAction}>
      <AlertDialogContent className="w-[min(42rem,calc(100%-2rem))] max-w-none! gap-0 overflow-hidden p-0 shadow-lg ring-blue-200 sm:max-w-none!">
        <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-sky-500 px-8 py-5 text-white">
          <AlertDialogTitle className="text-2xl">Add user</AlertDialogTitle>
          <AlertDialogDescription className="text-base text-blue-100">
            Create a sign-in for the ledger. The new user is an employee.
          </AlertDialogDescription>
        </div>
        <form onSubmit={(event) => void submit(event)}>
          <div className="grid gap-x-6 gap-y-4 px-8 py-6 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-sm font-semibold text-blue-950">Name</span>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-11 bg-white text-base text-blue-950"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-blue-950">Email</span>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-11 bg-white text-base text-blue-950"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-blue-950">Code</span>
              <Input
                value={code}
                onChange={(event) => setCode(event.target.value)}
                className="h-11 bg-white text-base text-blue-950"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-blue-950">Branch code</span>
              <BranchCodeCombobox
                branches={branches}
                value={branchCode}
                onValueChange={setBranchCode}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-blue-950">Password</span>
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 bg-white text-base text-blue-950"
              />
            </label>
            <label className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-sm font-semibold text-blue-950">Role</span>
              <Input readOnly value="Employee" className="h-11 bg-blue-50 text-base text-blue-950" />
            </label>
          </div>
          {error ? <p className="px-8 pb-2 text-sm text-red-600">{error}</p> : null}
          <div className="flex justify-end gap-2 border-t bg-blue-50 px-8 py-4">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="bg-white px-4"
              onClick={() => onOpenChangeAction(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-blue-800 px-4 text-white hover:bg-blue-900"
              disabled={saving}
            >
              {saving ? "Adding" : "Add user"}
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

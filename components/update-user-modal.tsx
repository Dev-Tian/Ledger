"use client"

import { useEffect, useState, type FormEvent } from "react"

import { BranchCodeCombobox } from "@/components/branch-code-combobox"
import { RoleCombobox } from "@/components/role-combobox"
import { ModalError } from "@/components/modal-error"
import { LoadingState } from "@/components/loading-state"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { apiService, toApiErrorMessage } from "@/lib/apiService"

export type EditableUser = {
  id?: string | number
  name?: string
  fname?: string
  lname?: string
  email?: string
  code?: string
  branch?: string | { name?: string }
  branch_code?: string
  roles?: { name?: string }[]
}

function textName(user: EditableUser) {
  return user.name?.trim() || [user.fname, user.lname].filter(Boolean).join(" ")
}

function readUser(payload: unknown): EditableUser | null {
  if (!payload || typeof payload !== "object") return null
  const record = payload as { data?: EditableUser; user?: EditableUser }
  const user = record.user ?? record.data ?? (payload as EditableUser)
  if (!user || typeof user !== "object") return null
  return user
}

export function UpdateUserModal({
  open,
  user,
  branches,
  onOpenChangeAction,
  onUpdatedAction,
}: {
  open: boolean
  user: EditableUser | null
  branches: string[]
  onOpenChangeAction: (open: boolean) => void
  onUpdatedAction: () => void
}) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [branchCode, setBranchCode] = useState("")
  const [role, setRole] = useState("")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!open || user?.id == null) return
    let cancelled = false
    setName(textName(user))
    setEmail(user.email ?? "")
    setCode(user.code ?? "")
    setBranchCode(user.branch_code ?? "")
    setRole(user.roles?.[0]?.name ?? "")
    setError("")
    setLoading(true)

    async function load() {
      try {
        const data = readUser(await apiService.getUser(user!.id!))
        if (cancelled || !data) return
        setName(textName(data))
        setEmail(data.email ?? "")
        setCode(data.code ?? "")
        setBranchCode(data.branch_code ?? "")
        setRole(data.roles?.[0]?.name ?? "")
      } catch (loadError) {
        if (!cancelled) setError(toApiErrorMessage(loadError, "This user could not be loaded."))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [open, user])

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (user?.id == null) return
    const nextName = name.trim()
    const nextEmail = email.trim()
    const nextRole = role.trim().toLowerCase()
    if (!nextName || !nextEmail || !nextRole) {
      setError("Fill in the name, email, and role.")
      return
    }
    setSaving(true)
    setError("")
    try {
      await apiService.updateUser(user.id, {
        name: nextName,
        email: nextEmail,
        code: code.trim(),
        branch_code: branchCode.trim(),
        roles: [nextRole],
      })
      onUpdatedAction()
      onOpenChangeAction(false)
    } catch (saveError) {
      setError(toApiErrorMessage(saveError, "This user could not be updated."))
    } finally {
      setSaving(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChangeAction}>
      <AlertDialogContent className="w-[min(42rem,calc(100%-2rem))] max-w-none! gap-0 overflow-hidden p-0 shadow-lg ring-blue-200 sm:max-w-none!">
        <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-sky-500 px-8 py-5 text-white">
          <AlertDialogTitle className="text-2xl">
            {name.trim() || "Update user"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base text-blue-100">
            {email.trim() || "Update this user’s account details."}
          </AlertDialogDescription>
        </div>
        {loading ? (
          <div className="bg-white">
            <LoadingState />
          </div>
        ) : (
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
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold text-blue-950">Branch code</span>
                <BranchCodeCombobox
                  branches={branches}
                  value={branchCode}
                  onValueChange={setBranchCode}
                />
              </div>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold text-blue-950">Role</span>
                <RoleCombobox value={role} onValueChange={setRole} />
              </label>
            </div>
            {error ? (
              <div className="px-8 pb-4">
                <ModalError
                  title={
                    error.includes("loaded")
                      ? "This user could not be opened"
                      : "This user was not saved"
                  }
                  message={error}
                />
              </div>
            ) : null}
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
                disabled={saving || user?.id == null}
              >
                {saving ? "Saving" : "Save"}
              </Button>
            </div>
          </form>
        )}
      </AlertDialogContent>
    </AlertDialog>
  )
}

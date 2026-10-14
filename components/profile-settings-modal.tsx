"use client"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { User } from "@/contexts/UserContext"

const emptyValue = "Not assigned"

function splitName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return { first: "", last: "" }
  if (parts.length === 1) return { first: parts[0], last: "" }
  return { first: parts[0], last: parts.slice(1).join(" ") }
}

function shown(value?: string | null) {
  const text = value?.trim()
  return text ? text : emptyValue
}

export function ProfileSettingsModal({
  open,
  onOpenChangeAction,
  user,
  role,
}: {
  open: boolean
  onOpenChangeAction: (open: boolean) => void
  user: User | null
  role: string
}) {
  const fromName = splitName(user?.name ?? "")
  const fields = [
    { label: "First name", value: shown(user?.fname || fromName.first) },
    { label: "Last name", value: shown(user?.lname || fromName.last) },
    { label: "Contact", value: shown(user?.contact) },
    { label: "Position", value: shown(user?.position || role) },
    { label: "Department", value: shown(user?.department) },
    { label: "Branch", value: shown(user?.branch_code) },
  ]

  return (
    <AlertDialog open={open} onOpenChange={onOpenChangeAction}>
      <AlertDialogContent className="gap-0 overflow-hidden p-0 shadow-lg ring-blue-200 sm:max-w-2xl">
        <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-sky-500 px-6 py-4 text-white">
          <AlertDialogTitle className="text-lg">Profile settings</AlertDialogTitle>
          <AlertDialogDescription className="text-blue-100">
            These fields are read only.
          </AlertDialogDescription>
        </div>
        <div className="grid gap-x-8 gap-y-4 px-6 py-5 sm:grid-cols-2">
          {fields.map((field) => (
            <label key={field.label} className="flex flex-col gap-1.5">
              <span className="text-sm font-semibold text-blue-950">{field.label}</span>
              <Input
                readOnly
                value={field.value}
                className="h-10 bg-white text-blue-950"
              />
            </label>
          ))}
        </div>
        <div className="flex justify-end border-t bg-blue-50 px-6 py-4">
          <Button
            type="button"
            size="sm"
            className="bg-blue-800 px-3 text-white hover:bg-blue-900"
            onClick={() => onOpenChangeAction(false)}
          >
            Close
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

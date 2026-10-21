"use client"

import { useState, type FormEvent } from "react"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ModalError } from "@/components/modal-error"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toApiErrorMessage } from "@/lib/apiService"

export function AddBranchModal({
  open,
  onOpenChangeAction,
  onAddAction,
}: {
  open: boolean
  onOpenChangeAction: (open: boolean) => void
  onAddAction: (locationName: string) => Promise<void>
}) {
  const [name, setName] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  function reset() {
    setName("")
    setSaving(false)
    setError("")
  }

  function handleOpenChange(next: boolean) {
    if (saving) return
    if (!next) reset()
    onOpenChangeAction(next)
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    const locationName = name.trim()
    if (!locationName) {
      setError("Enter a branch / location name.")
      return
    }
    setSaving(true)
    setError("")
    try {
      await onAddAction(locationName)
      setSaving(false)
      reset()
      onOpenChangeAction(false)
    } catch (failure) {
      setError(toApiErrorMessage(failure, "That branch could not be added."))
      setSaving(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="gap-0 overflow-hidden p-0 shadow-lg ring-blue-200 sm:max-w-md">
        <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-sky-500 px-6 py-4 text-white">
          <AlertDialogTitle className="text-lg">Add branch</AlertDialogTitle>
          <AlertDialogDescription className="text-blue-100">
            Enter the location name for this branch.
          </AlertDialogDescription>
        </div>
        <form className="flex flex-col gap-4 px-6 py-5" onSubmit={submit}>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-blue-950">Location name</span>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-10 bg-white text-blue-950"
              disabled={saving}
            />
          </label>
          {error ? <ModalError title="This branch was not added" message={error} /> : null}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={saving}
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-blue-800 px-3 text-white hover:bg-blue-900"
              disabled={saving}
            >
              {saving ? "Adding…" : "Add branch"}
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

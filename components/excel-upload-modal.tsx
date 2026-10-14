"use client"

import { useRef, useState } from "react"
import { FileSpreadsheet } from "lucide-react"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

function isExcelFile(file: File) {
  const name = file.name.toLowerCase()
  return name.endsWith(".xls") || name.endsWith(".xlsx")
}

export function ExcelUploadModal({
  open,
  onOpenChangeAction,
  title,
}: {
  open: boolean
  onOpenChangeAction: (open: boolean) => void
  title: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState("")

  function clearFile() {
    setFile(null)
    setError("")
    if (inputRef.current) inputRef.current.value = ""
  }

  function handleOpenChange(next: boolean) {
    if (!next) clearFile()
    onOpenChangeAction(next)
  }

  function chooseFile(selected: File | undefined) {
    if (!selected) {
      setFile(null)
      return
    }
    if (!isExcelFile(selected)) {
      setFile(null)
      setError("Choose an Excel file ending in .xls or .xlsx.")
      if (inputRef.current) inputRef.current.value = ""
      return
    }
    setError("")
    setFile(selected)
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="gap-0 overflow-hidden p-0 shadow-lg ring-blue-200 sm:max-w-md">
        <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-sky-500 px-6 py-4 text-white">
          <AlertDialogTitle className="text-lg">Upload {title}</AlertDialogTitle>
          <AlertDialogDescription className="text-blue-100">
            Choose the Excel file for this {title.toLowerCase()} upload.
          </AlertDialogDescription>
        </div>
        <form
          className="flex flex-col gap-4 px-6 py-5"
          onSubmit={(event) => {
            event.preventDefault()
            if (!file) {
              setError("Choose an Excel file ending in .xls or .xlsx.")
            }
          }}
        >
          <label className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border border-dashed border-blue-300 bg-blue-50 px-4 py-8 text-center">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-800 to-sky-500 text-white">
              <FileSpreadsheet className="size-5" />
            </span>
            <span className="text-sm font-semibold text-blue-950">
              {file ? file.name : "Choose an Excel file"}
            </span>
            <span className="text-xs text-muted-foreground">.xls or .xlsx</span>
            <input
              ref={inputRef}
              type="file"
              accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              className="sr-only"
              onChange={(event) => chooseFile(event.target.files?.[0])}
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
              disabled={!file}
            >
              Upload
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

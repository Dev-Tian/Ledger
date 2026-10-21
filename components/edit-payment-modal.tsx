"use client"

import { useEffect, useState, type FormEvent } from "react"

import { LoadingState } from "@/components/loading-state"
import { ModalError } from "@/components/modal-error"
import { ModalLogoWatermark } from "@/components/modal-logo-watermark"
import type { ViewPayment } from "@/components/view-payment-modal"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ChevronDown } from "lucide-react"

function YesNoDropdown({
  value,
  onValueChange,
}: {
  value: string
  onValueChange: (value: string) => void
}) {
  const selected =
    value.trim().toLowerCase() === "yes"
      ? "Yes"
      : value.trim().toLowerCase() === "no"
        ? "No"
        : ""

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-10 w-full justify-between bg-white px-3 text-sm font-normal text-blue-950 hover:bg-white"
        >
          <span className={selected ? "text-blue-950" : "text-muted-foreground"}>
            {selected || "Select Yes or No"}
          </span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-(--radix-dropdown-menu-trigger-width)">
        <DropdownMenuRadioGroup value={selected} onValueChange={onValueChange}>
          <DropdownMenuRadioItem value="Yes" className="cursor-pointer">
            Yes
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="No" className="cursor-pointer">
            No
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function EditPaymentModal({
  open,
  payment,
  onOpenChangeAction,
  onSavedAction,
}: {
  open: boolean
  payment: ViewPayment | null
  onOpenChangeAction: (open: boolean) => void
  onSavedAction: (payment: ViewPayment) => void
}) {
  const [documentNumber, setDocumentNumber] = useState("")
  const [date, setDate] = useState("")
  const [name, setName] = useState("")
  const [orNumber, setOrNumber] = useState("")
  const [maximumOfAmount, setMaximumOfAmount] = useState("")
  const [memoMain, setMemoMain] = useState("")
  const [minimumSalesOrderNumber, setMinimumSalesOrderNumber] = useState("")
  const [minimumInvoiceNumberLeasing, setMinimumInvoiceNumberLeasing] = useState("")
  const [eligibleForRebate, setEligibleForRebate] = useState("")
  const [genericCollector, setGenericCollector] = useState("")
  const [location, setLocation] = useState("")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!open || !payment) return
    let cancelled = false
    setDocumentNumber(payment.documentNumber)
    setDate(payment.date)
    setName(payment.name)
    setOrNumber(payment.orNumber)
    setMaximumOfAmount(String(payment.maximumOfAmount))
    setMemoMain(payment.memoMain)
    setMinimumSalesOrderNumber(payment.minimumSalesOrderNumber)
    setMinimumInvoiceNumberLeasing(payment.minimumInvoiceNumberLeasing)
    setEligibleForRebate(payment.eligibleForRebate)
    setGenericCollector(payment.genericCollector)
    setLocation(payment.location)
    setError("")
    setSaving(false)
    setLoading(true)
    const timer = window.setTimeout(() => {
      if (!cancelled) setLoading(false)
    }, 400)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [open, payment])

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!payment) return
    const nextName = name.trim()
    const nextDocument = documentNumber.trim()
    const amount = Number(maximumOfAmount)
    if (!nextDocument || !nextName || !Number.isFinite(amount)) {
      setError("Fill in the document number, name, and a valid amount.")
      return
    }
    setSaving(true)
    setError("")
    onSavedAction({
      ...payment,
      documentNumber: nextDocument,
      date: date.trim(),
      name: nextName,
      orNumber: orNumber.trim(),
      maximumOfAmount: amount,
      memoMain: memoMain.trim(),
      minimumSalesOrderNumber: minimumSalesOrderNumber.trim(),
      minimumInvoiceNumberLeasing: minimumInvoiceNumberLeasing.trim(),
      eligibleForRebate: eligibleForRebate.trim(),
      genericCollector: genericCollector.trim(),
      location: location.trim(),
    })
    setSaving(false)
    onOpenChangeAction(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChangeAction}>
      <AlertDialogContent className="w-[min(48rem,calc(100%-2rem))] max-w-none! gap-0 overflow-hidden p-0 shadow-lg ring-blue-200 sm:max-w-none!">
        <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-sky-500 px-6 py-5 text-white">
          <AlertDialogTitle className="text-xl">
            {payment?.documentNumber || "Edit payment"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-blue-100">
            Update this payment record.
          </AlertDialogDescription>
        </div>
        <div className="relative">
          <ModalLogoWatermark />
          {loading ? (
            <div className="relative z-10 bg-white/80">
              <LoadingState />
            </div>
          ) : (
            <form className="relative z-10" onSubmit={submit}>
              <div className="grid max-h-[min(36rem,60svh)] min-h-0 gap-x-4 gap-y-3 overflow-y-auto px-6 py-5 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold text-blue-950">Document number</span>
                  <Input
                    value={documentNumber}
                    onChange={(event) => setDocumentNumber(event.target.value)}
                    className="h-10 bg-white text-blue-950"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold text-blue-950">Date</span>
                  <Input
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className="h-10 bg-white text-blue-950"
                  />
                </label>
                <label className="flex flex-col gap-1.5 sm:col-span-2">
                  <span className="text-sm font-semibold text-blue-950">Name</span>
                  <Input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="h-10 bg-white text-blue-950"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold text-blue-950">OR number</span>
                  <Input
                    value={orNumber}
                    onChange={(event) => setOrNumber(event.target.value)}
                    className="h-10 bg-white text-blue-950"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold text-blue-950">Maximum of amount</span>
                  <Input
                    inputMode="decimal"
                    value={maximumOfAmount}
                    onChange={(event) => setMaximumOfAmount(event.target.value)}
                    className="h-10 bg-white text-blue-950 tabular-nums"
                  />
                </label>
                <label className="flex flex-col gap-1.5 sm:col-span-2">
                  <span className="text-sm font-semibold text-blue-950">Memo (main)</span>
                  <Input
                    value={memoMain}
                    onChange={(event) => setMemoMain(event.target.value)}
                    className="h-10 bg-white text-blue-950"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold text-blue-950">
                    Minimum of sales order number
                  </span>
                  <Input
                    value={minimumSalesOrderNumber}
                    onChange={(event) => setMinimumSalesOrderNumber(event.target.value)}
                    className="h-10 bg-white text-blue-950"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold text-blue-950">
                    Minimum of invoice number - leasing
                  </span>
                  <Input
                    value={minimumInvoiceNumberLeasing}
                    onChange={(event) => setMinimumInvoiceNumberLeasing(event.target.value)}
                    className="h-10 bg-white text-blue-950"
                  />
                </label>
                <div className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold text-blue-950">Eligible for rebate</span>
                  <YesNoDropdown value={eligibleForRebate} onValueChange={setEligibleForRebate} />
                </div>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold text-blue-950">Generic collector</span>
                  <Input
                    value={genericCollector}
                    onChange={(event) => setGenericCollector(event.target.value)}
                    className="h-10 bg-white text-blue-950"
                  />
                </label>
                <label className="flex flex-col gap-1.5 sm:col-span-2">
                  <span className="text-sm font-semibold text-blue-950">Location</span>
                  <Input
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    className="h-10 bg-white text-blue-950"
                  />
                </label>
                {error ? (
                  <div className="sm:col-span-2">
                    <ModalError title="This payment was not saved" message={error} />
                  </div>
                ) : null}
              </div>
              <div className="flex justify-end gap-2 border-t border-blue-100 bg-blue-50/80 px-6 py-4">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="cursor-pointer bg-white px-4 text-blue-950"
                  disabled={saving}
                  onClick={() => onOpenChangeAction(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="cursor-pointer bg-blue-800 px-3 text-white hover:bg-blue-900"
                  disabled={saving || !payment}
                >
                  {saving ? "Saving" : "Save"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

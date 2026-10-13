"use client"

import { CircleHelp } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

const helpSteps = [
  "Record one customer at a time.",
  "Enter the customer and loan details in Customer setup.",
  "Post collections in Payment history.",
  "For a question about a branch account, contact your branch.",
]

export function InfoModalTrigger({
  topic,
  children,
  className,
  appearance = "button",
  size = "sm",
}: {
  topic: "about" | "help"
  children: React.ReactNode
  className?: string
  appearance?: "button" | "link"
  size?: "sm" | "lg" | "default"
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {appearance === "link" ? (
        <button type="button" className={className} onClick={() => setOpen(true)}>
          {children}
        </button>
      ) : (
        <Button
          type="button"
          size={size}
          className={className}
          onClick={() => setOpen(true)}
        >
          {children}
        </Button>
      )}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="gap-0 overflow-hidden p-0 shadow-lg ring-blue-200 sm:max-w-md">
          {topic === "about" ? <AboutBody /> : <HelpBody />}
          <div className="flex justify-end border-t bg-blue-50 px-6 py-4">
            <Button
              type="button"
              size="sm"
              className="bg-blue-800 px-3 text-white hover:bg-blue-900"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function AboutBody() {
  return (
    <>
      <div className="flex flex-col items-center gap-3 bg-blue-600 px-6 py-7 text-center text-white">
        <Image
          src="/smctt.png"
          alt=""
          width={1024}
          height={569}
          className="h-14 w-auto"
          style={{ width: "auto", height: "3.5rem" }}
        />
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium tracking-wide text-blue-100 uppercase">
            SMCT Group of Companies
          </p>
          <AlertDialogTitle className="text-lg text-white">About</AlertDialogTitle>
        </div>
      </div>
      <AlertDialogDescription className="px-6 py-5 text-left text-sm leading-6 text-foreground">
        SMCT-LEDGER keeps installment accounts, payment schedules, and
        collections in one place for SMCT Group of Companies.
      </AlertDialogDescription>
    </>
  )
}

function HelpBody() {
  return (
    <>
      <div className="flex flex-col items-center gap-3 bg-blue-600 px-6 py-7 text-center text-white">
        <div className="flex size-12 items-center justify-center rounded-full bg-white shadow-sm">
          <CircleHelp className="size-6 text-blue-700" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium tracking-wide text-blue-100 uppercase">
            For branch staff
          </p>
          <AlertDialogTitle className="text-lg text-white">Help</AlertDialogTitle>
        </div>
      </div>
      <div className="px-6 py-5">
        <AlertDialogDescription className="sr-only">
          Record one customer at a time, enter the loan in Customer setup, post
          collections in Payment history, and contact your branch with account
          questions.
        </AlertDialogDescription>
        <ol className="flex flex-col gap-3">
          {helpSteps.map((step, index) => (
            <li key={step} className="flex gap-3 text-sm leading-6">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-800 text-xs font-semibold text-white">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </>
  )
}

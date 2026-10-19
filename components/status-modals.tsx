"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type StatusModalProps = {
  open: boolean
  onOpenChangeAction: (open: boolean) => void
  title: string
  description: string
  durationMs?: number
}

function StatusModal({
  open,
  onOpenChangeAction,
  title,
  description,
  durationMs = 2000,
  tone,
}: StatusModalProps & { tone: "success" | "error" }) {
  const success = tone === "success"
  const onOpenChangeRef = useRef(onOpenChangeAction)
  onOpenChangeRef.current = onOpenChangeAction

  useEffect(() => {
    if (!open) return
    const timer = window.setTimeout(() => onOpenChangeRef.current(false), durationMs)
    return () => window.clearTimeout(timer)
  }, [open, durationMs])

  return (
    <AlertDialog open={open} onOpenChange={onOpenChangeAction}>
      <AlertDialogContent
        size="sm"
        className={
          success
            ? "gap-0 overflow-hidden p-0 shadow-lg ring-green-200 sm:max-w-sm"
            : "gap-0 overflow-hidden p-0 shadow-lg ring-red-200 sm:max-w-sm"
        }
      >
        <div
          className={
            success
              ? "flex flex-col items-center gap-3 bg-green-600 px-6 py-7 text-center text-white"
              : "flex flex-col items-center gap-3 bg-red-600 px-6 py-7 text-center text-white"
          }
        >
          <div
            key={open ? tone : "closed"}
            className={`flex size-12 items-center justify-center rounded-full bg-white shadow-sm ${
              success ? "" : "status-error-badge"
            }`}
          >
            {success ? (
              <svg
                viewBox="0 0 24 24"
                className="size-7 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <circle cx="12" cy="12" r="9" className="status-check-ring" />
                <path d="M8 12.5 10.8 15.2 16.2 9.2" className="status-check-mark" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="size-7 text-red-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <circle cx="12" cy="12" r="9" className="status-error-ring" />
                <path d="M9 9l6 6M15 9l-6 6" className="status-error-mark" />
              </svg>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium tracking-wide uppercase">
              {success ? "Success" : "Error"}
            </p>
            <AlertDialogTitle className="text-lg text-white">{title}</AlertDialogTitle>
            <AlertDialogDescription
              className={success ? "text-green-100" : "text-red-100"}
            >
              {description}
            </AlertDialogDescription>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function SuccessModal(props: StatusModalProps) {
  return <StatusModal {...props} tone="success" />
}

export function ErrorModal(props: StatusModalProps) {
  return <StatusModal {...props} tone="error" />
}

export function LoadingModal({
  open,
  onOpenChangeAction,
}: {
  open: boolean
  onOpenChangeAction: (open: boolean) => void
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChangeAction}>
      <AlertDialogContent
        size="sm"
        className="gap-0 overflow-hidden p-0 shadow-lg ring-blue-200 sm:max-w-sm"
      >
        <div className="flex flex-col items-center gap-3 bg-blue-600 px-6 py-7 text-center text-white">
          <div className="flex size-12 items-center justify-center rounded-full bg-white shadow-sm">
            <div
              className="size-6 animate-spin rounded-full border-[3px] border-blue-100 border-t-blue-700"
              role="status"
              aria-label="Loading"
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium tracking-wide uppercase">Loading</p>
            <AlertDialogTitle className="text-lg text-white">
              Checking your account
            </AlertDialogTitle>
            <AlertDialogDescription className="text-blue-100">
              Please wait while we confirm whether this account is accepted.
            </AlertDialogDescription>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function WelcomeModal({
  open,
  onOpenChangeAction,
  role,
}: {
  open: boolean
  onOpenChangeAction: (open: boolean) => void
  role: string
}) {
  const onOpenChangeRef = useRef(onOpenChangeAction)
  onOpenChangeRef.current = onOpenChangeAction

  useEffect(() => {
    if (!open) return
    const timer = window.setTimeout(() => onOpenChangeRef.current(false), 2500)
    return () => window.clearTimeout(timer)
  }, [open])

  return (
    <AlertDialog open={open} onOpenChange={onOpenChangeAction}>
      <AlertDialogContent
        size="sm"
        className="gap-0 overflow-hidden p-0 shadow-lg ring-blue-200 sm:max-w-sm"
      >
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
            <p className="text-xs font-medium tracking-wide uppercase">Welcome</p>
            <AlertDialogTitle className="text-lg text-white">Good day</AlertDialogTitle>
            <AlertDialogDescription className="text-blue-100">
              You are signed in to the {role} dashboard.
            </AlertDialogDescription>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

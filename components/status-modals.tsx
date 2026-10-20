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
        className={
          success
            ? "w-[min(24rem,calc(100%-2rem))] max-w-none! gap-0 overflow-hidden p-0 shadow-xl ring-green-200 sm:max-w-none!"
            : "w-[min(24rem,calc(100%-2rem))] max-w-none! gap-0 overflow-hidden p-0 shadow-xl ring-red-200 sm:max-w-none!"
        }
      >
        <div
          className={
            success
              ? "h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600"
              : "h-2 bg-gradient-to-r from-red-500 via-rose-500 to-red-600"
          }
        />
        <div
          className={
            success
              ? "flex flex-col items-center gap-5 bg-gradient-to-b from-green-50 to-white px-8 pt-8 pb-9 text-center"
              : "flex flex-col items-center gap-5 bg-gradient-to-b from-red-50 to-white px-8 pt-8 pb-9 text-center"
          }
        >
          <div
            key={open ? tone : "closed"}
            className={
              success
                ? "status-success-badge flex size-24 items-center justify-center rounded-full bg-white shadow-lg ring-8 ring-green-100"
                : "status-error-badge flex size-24 items-center justify-center rounded-full bg-white shadow-lg ring-8 ring-red-100"
            }
          >
            {success ? (
              <svg
                viewBox="0 0 48 48"
                className="size-16 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <circle cx="24" cy="24" r="14" className="status-check-ring" />
                <path d="M16 25.5 21.5 31 32 18.5" className="status-check-mark" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 48 48"
                className="size-16 text-red-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <circle cx="24" cy="24" r="14" className="status-error-ring" />
                <path d="M18 18l12 12M30 18l-12 12" className="status-error-mark" />
              </svg>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <p
              className={
                success
                  ? "text-xs font-semibold tracking-[0.16em] text-green-700 uppercase"
                  : "text-xs font-semibold tracking-[0.16em] text-red-700 uppercase"
              }
            >
              {success ? "Success" : "Error"}
            </p>
            <AlertDialogTitle className="text-xl font-semibold tracking-tight text-blue-950">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-6 text-muted-foreground">
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

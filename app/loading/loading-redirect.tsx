"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { useEffect, useState } from "react"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

const duration = 1500

export function LoadingRedirect({ signingOut }: { signingOut: boolean }) {
  const router = useRouter()
  const [value, setValue] = useState(0)
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let redirected = false
    let stopped = false
    let timer = 0
    const started = Date.now()

    const fail = () => {
      if (stopped || redirected) return
      stopped = true
      window.clearInterval(timer)
      setFailed(true)
    }

    if (!navigator.onLine) {
      fail()
      return
    }

    setFailed(false)
    setValue(0)

    const timerId = window.setInterval(() => {
      if (!navigator.onLine) {
        fail()
        return
      }
      const next = Math.min(100, ((Date.now() - started) / duration) * 100)
      setValue(next)
      if (next >= 100 && !redirected) {
        redirected = true
        window.clearInterval(timer)
        router.push(signingOut ? "/" : "/dashboard")
      }
    }, 40)

    timer = timerId
    window.addEventListener("offline", fail)
    return () => {
      stopped = true
      window.clearInterval(timer)
      window.removeEventListener("offline", fail)
    }
  }, [attempt, router, signingOut])

  function tryAgain() {
    setAttempt((current) => current + 1)
  }

  return (
    <>
      <div className="flex w-full flex-col gap-2">
        <Progress
          value={value}
          aria-label={failed ? "Network error" : signingOut ? "Signing out" : "Preparing your ledger"}
          className={failed ? "h-2 bg-red-100" : "h-2 bg-blue-100"}
        />
        <p
          className={
            failed
              ? "text-xs font-medium text-red-700 tabular-nums"
              : "text-xs font-medium text-blue-800 tabular-nums"
          }
        >
          {Math.round(value)}%
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold tracking-tight">
          {signingOut ? "Signing out" : "Preparing your ledger"}
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          {signingOut
            ? "Please wait while your session is closed."
            : "Please wait while your account is opened."}
        </p>
      </div>
      <AlertDialog
        open={failed}
        onOpenChange={(open) => {
          if (!open) tryAgain()
        }}
      >
        <AlertDialogContent className="gap-0 overflow-hidden p-0 shadow-lg ring-red-200 sm:max-w-sm">
          <div className="flex flex-col items-center gap-3 bg-red-700 px-6 py-7 text-center text-white">
            <div className="flex size-20 items-center justify-center rounded-full bg-white shadow-sm">
              <Image
                src="/no-internet.png"
                alt=""
                width={512}
                height={512}
                className="size-14"
                style={{ width: "3.5rem", height: "3.5rem" }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-medium tracking-wide uppercase">Error</p>
              <AlertDialogTitle className="text-lg text-white">
                Network error
              </AlertDialogTitle>
              <AlertDialogDescription className="text-red-100">
                The connection was lost while this page was loading. Check your
                network, then try again.
              </AlertDialogDescription>
            </div>
          </div>
          <div className="flex justify-center bg-background px-6 py-4">
            <Button
              type="button"
              size="sm"
              className="bg-blue-800 px-3 text-white hover:bg-blue-900"
              onClick={tryAgain}
            >
              Try again
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

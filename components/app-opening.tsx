"use client"

import { useLayoutEffect, useState, type ReactNode } from "react"

import { LoadingScreen, skipOpeningKey } from "@/app/loading/loading-redirect"

export function AppOpening({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)

  useLayoutEffect(() => {
    if (window.sessionStorage.getItem(skipOpeningKey) !== "1") return
    window.sessionStorage.removeItem(skipOpeningKey)
    setReady(true)
  }, [])

  if (!ready) {
    return <LoadingScreen opening onComplete={() => setReady(true)} />
  }

  return children
}

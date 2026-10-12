"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function LoadingRedirect() {
  const router = useRouter()

  useEffect(() => {
    const timer = window.setTimeout(() => router.push("/dashboard"), 1500)
    return () => window.clearTimeout(timer)
  }, [router])

  return null
}

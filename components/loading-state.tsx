import Image from "next/image"

import { Skeleton } from "@/components/ui/skeleton"

export function LoadingState({
  variant = "table",
}: {
  variant?: "table" | "fields" | "summary"
}) {
  if (variant === "fields") {
    return (
      <div className="overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-blue-200">
        <div className="bg-blue-800 px-5 py-4">
          <Skeleton className="h-8 w-64 bg-blue-700" />
          <Skeleton className="mt-2 h-4 w-72 bg-blue-700" />
        </div>
        <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
          {Array.from({ length: 8 }, (_, index) => (
            <Skeleton key={index} className="h-9 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (variant === "summary") {
    return (
      <div className="flex flex-col gap-4">
        <div className="overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-blue-200">
          <div className="bg-blue-800 px-5 py-4">
            <Skeleton className="h-5 w-56 bg-blue-700" />
            <Skeleton className="mt-2 h-4 w-40 bg-blue-700" />
          </div>
          <div className="grid gap-4 px-5 py-5 sm:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-blue-200">
          <LogoSpinner />
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white">
      <LogoSpinner />
    </div>
  )
}

function LogoSpinner() {
  return (
    <div className="flex items-center justify-center py-14" role="status" aria-label="Loading">
      <div className="relative flex size-24 items-center justify-center">
        <span className="absolute inset-0 animate-spin rounded-full border-4 border-blue-100 border-t-blue-800" />
        <Image
          src="/smctt.png"
          alt=""
          width={1024}
          height={569}
          className="h-10 w-auto"
          style={{ width: "auto", height: "2.5rem" }}
        />
      </div>
    </div>
  )
}

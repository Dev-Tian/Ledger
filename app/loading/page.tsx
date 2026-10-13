import Image from "next/image"
import { Suspense } from "react"

import { LoadingRedirect } from "./loading-redirect"

export default function LoadingPage({
  searchParams,
}: {
  searchParams: Promise<{ to?: string | string[] }>
}) {
  return (
    <div className="bg-logo-tile flex min-h-svh flex-col">
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <Suspense
          fallback={
            <LoadingCard signingOut={false} hold />
          }
        >
          <LoadingContent searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  )
}

async function LoadingContent({
  searchParams,
}: {
  searchParams: Promise<{ to?: string | string[] }>
}) {
  const params = await searchParams
  const to = Array.isArray(params.to) ? params.to[0] : params.to

  return <LoadingCard signingOut={to === "home"} />
}

function LoadingCard({
  signingOut,
  hold = false,
}: {
  signingOut: boolean
  hold?: boolean
}) {
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-5 rounded-xl bg-background px-6 py-10 text-center shadow-md ring-1 ring-blue-200">
      <Image
        src="/smctt.png"
        alt="SMCT Group of Companies"
        width={1024}
        height={569}
        priority
        className="h-16 w-auto"
        style={{ width: "auto", height: "4rem" }}
      />
      <p className="text-sm font-semibold tracking-tight">SMCT-LEDGER</p>
      {hold ? (
        <p className="text-sm leading-6 text-muted-foreground">Please wait.</p>
      ) : (
        <LoadingRedirect signingOut={signingOut} />
      )}
    </div>
  )
}

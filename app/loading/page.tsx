import { Suspense } from "react"

import { LoadingScreen } from "./loading-redirect"

export default function LoadingPage({
  searchParams,
}: {
  searchParams: Promise<{ to?: string | string[] }>
}) {
  return (
    <Suspense fallback={<LoadingScreen hold />}>
      <LoadingContent searchParams={searchParams} />
    </Suspense>
  )
}

async function LoadingContent({
  searchParams,
}: {
  searchParams: Promise<{ to?: string | string[] }>
}) {
  const params = await searchParams
  const to = Array.isArray(params.to) ? params.to[0] : params.to

  return <LoadingScreen signingOut={to === "home"} />
}

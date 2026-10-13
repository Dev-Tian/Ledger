import Image from "next/image"
import Link from "next/link"

import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"

export default function OtherAppsPage() {
  return (
    <div className="bg-logo-tile flex min-h-svh flex-col">
      <header className="border-b border-blue-700 bg-blue-600 text-white">
        <div className="flex h-16 w-full items-center justify-between px-6">
          <Link href="/" className="inline-flex shrink-0 items-center gap-3">
            <Image
              src="/smctt.png"
              alt="SMCT Group of Companies"
              width={1024}
              height={569}
              priority
              className="h-12 w-auto"
              style={{ width: "auto", height: "3rem" }}
            />
            <span className="text-sm font-semibold tracking-tight">
              SMCT-LEDGER
            </span>
          </Link>
          <Button
            asChild
            size="sm"
            className="bg-blue-800 px-3 text-white hover:bg-blue-900"
          >
            <Link href="/">Home</Link>
          </Button>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 bg-background px-6 py-16">
        <h1 className="text-4xl font-semibold tracking-tight">Other apps</h1>
        <p className="max-w-xl text-base leading-7 text-muted-foreground">
          Other SMCT applications used with this ledger will be listed here.
        </p>
      </main>
      <SiteFooter />
    </div>
  )
}

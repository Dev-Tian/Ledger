import Image from "next/image"
import Link from "next/link"

import { InfoModalTrigger } from "@/components/info-modal"

const linkClass =
  "text-sm text-blue-100 underline-offset-4 hover:text-white hover:underline"

export function SiteFooter() {
  return (
    <footer className="border-t border-blue-700 bg-blue-600 text-white">
      <div className="flex w-full flex-wrap items-center justify-between gap-4 px-6 py-5">
        <div className="flex min-w-0 items-center gap-3">
          <Image
            src="/smctt.png"
            alt="SMCT Group of Companies"
            width={1024}
            height={569}
            className="h-14 w-auto"
            style={{ width: "auto", height: "3.5rem" }}
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-tight">SMCT-LEDGER</p>
            <p className="text-sm text-blue-100">
              Installment accounts, schedules, and collections.
            </p>
          </div>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <InfoModalTrigger
            appearance="link"
            topic="help"
            className={linkClass}
          >
            Help
          </InfoModalTrigger>
          <Link href="/apps" className={linkClass}>
            Other apps
          </Link>
          <InfoModalTrigger
            appearance="link"
            topic="about"
            className={linkClass}
          >
            About
          </InfoModalTrigger>
        </nav>
      </div>
    </footer>
  )
}

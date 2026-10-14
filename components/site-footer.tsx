import Image from "next/image"
import Link from "next/link"

import { InfoModalTrigger } from "@/components/info-modal"

const linkClass =
  "rounded-full bg-white/10 px-3.5 py-1.5 text-sm text-white ring-1 ring-white/15 transition hover:bg-white/20"

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-gradient-to-r from-blue-800 via-blue-700 to-sky-600 text-white">
      <div className="flex w-full flex-wrap items-center justify-between gap-4 px-6 py-5">
        <div className="flex min-w-0 items-center gap-3">
          <Image
            src="/smctt.png"
            alt="SMCT Group of Companies"
            width={1024}
            height={569}
            className="h-12 w-auto shrink-0"
            style={{ width: "auto", height: "3rem" }}
          />
          <div className="min-w-0">
            <p className="text-[0.65rem] font-medium tracking-[0.16em] text-blue-100 uppercase">
              SMCT Group
            </p>
            <p className="text-sm font-semibold tracking-tight">SMCT-LEDGER</p>
            <p className="text-sm text-blue-100">
              Installment accounts, schedules, and collections.
            </p>
          </div>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap items-center gap-2">
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

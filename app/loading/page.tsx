import Image from "next/image";
import Link from "next/link";

import { LoadingRedirect } from "./loading-redirect";

export default function LoadingPage() {
  return (
    <div className="bg-logo-tile flex min-h-svh flex-col">
      <LoadingRedirect />
      <main className="flex flex-1 items-center justify-center px-6 py-16">
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
          <div
            className="size-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-700"
            role="status"
            aria-label="Loading"
          />
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-semibold tracking-tight">
              Preparing your ledger
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">
              Please wait while your account is opened.
            </p>
          </div>
          <Link
            href="/"
            className="text-sm font-medium text-blue-700 hover:text-blue-800"
          >
            Return home
          </Link>
        </div>
      </main>
    </div>
  );
}

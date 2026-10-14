import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="bg-logo-tile flex min-h-svh flex-col">
      <header className="border-b border-blue-700 bg-blue-600 text-white">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center px-6">
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
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center bg-background px-6 py-16">
        <Card className="w-full max-w-sm gap-0 overflow-hidden rounded-3xl bg-white py-0 shadow-2xl shadow-blue-950/15 ring-1 ring-blue-100">
          <div className="bg-gradient-to-br from-blue-800 via-blue-700 to-sky-500 px-8 py-7 text-center text-white">
            <Image
              src="/smctt.png"
              alt=""
              width={1024}
              height={569}
              className="mx-auto h-12 w-auto"
              style={{ width: "auto", height: "3rem" }}
            />
            <CardHeader className="items-center justify-items-center gap-1.5 px-0 pt-4 pb-0 text-center">
              <p className="text-xs font-medium tracking-[0.16em] text-blue-100 uppercase">
                SMCT account
              </p>
              <CardTitle className="text-2xl font-semibold tracking-tight text-white">
                Sign in
              </CardTitle>
              <CardDescription className="text-sm leading-6 text-blue-100">
                Use your SMCT account email to open the ledger.
              </CardDescription>
            </CardHeader>
          </div>
          <CardContent className="flex flex-col gap-4 px-8 py-7">
            <LoginForm />
            <Button asChild variant="ghost" className="w-full">
              <Link href="/">Back to home</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

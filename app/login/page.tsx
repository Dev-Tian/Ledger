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
        <Card className="w-full max-w-sm gap-0 overflow-hidden rounded-2xl bg-white py-0 shadow-xl shadow-blue-950/10 ring-1 ring-blue-100">
          <div className="h-1.5 bg-gradient-to-r from-blue-800 via-blue-600 to-sky-400" />
          <CardHeader className="items-center justify-items-center gap-4 px-8 pt-8 pb-0 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-blue-50 ring-1 ring-blue-100">
              <Image
                src="/smctt.png"
                alt=""
                width={1024}
                height={569}
                className="h-10 w-auto"
                style={{ width: "auto", height: "2.5rem" }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <CardTitle className="text-2xl font-semibold tracking-tight">
                Sign in
              </CardTitle>
              <CardDescription className="text-sm leading-6">
                Use your SMCT account email to open the ledger.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 px-8 pt-6 pb-8">
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

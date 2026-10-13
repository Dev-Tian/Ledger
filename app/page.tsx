import Image from "next/image";
import Link from "next/link";
import { CalendarClock, ClipboardList, Wallet } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LoginForm } from "@/app/login/login-form";
import { InfoModalTrigger } from "@/components/info-modal";
import { SiteFooter } from "@/components/site-footer";

const features = [
  {
    icon: ClipboardList,
    title: "One account per plan",
    description:
      "Keep each customer’s installment plan, principal, and remaining balance in a single record.",
  },
  {
    icon: CalendarClock,
    title: "A schedule you can trust",
    description:
      "See the next due date, how many payments are left, and which accounts have slipped.",
  },
  {
    icon: Wallet,
    title: "Payments against the ledger",
    description:
      "Record what was collected and apply it to the installment that is actually due.",
  },
];

export default function Home() {
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
         
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-16 bg-background px-6 py-16">
        <section className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-6">
            <p className="text-sm font-medium text-muted-foreground">
              Installment ledger
            </p>
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-balance">
              Identify outstanding balances and the date the next payment is due.
            </h1>
            <p className="max-w-lg text-base leading-7 text-muted-foreground">
              SMCT-LEDGER maintains installment accounts, payment schedules, and
              collections in a single record, in place of notebooks and
              scattered spreadsheets.
            </p>
            <div className="flex flex-wrap gap-3">
              <InfoModalTrigger
                topic="about"
                size="lg"
                className="bg-blue-800 text-white hover:bg-blue-900"
              >
                About
              </InfoModalTrigger>
              
            </div>
          </div>

          <Card className="w-full shadow-md ring-blue-200">
            <CardHeader className="items-center justify-items-center gap-3 border-b border-blue-700 bg-blue-600 px-6 py-6 text-center text-white">
              <Image
                src="/smctt.png"
                alt=""
                width={1024}
                height={569}
                className="h-16 w-auto"
                style={{ width: "auto", height: "4rem" }}
              />
              <CardTitle className="text-lg text-white">Sign in</CardTitle>
              <CardDescription className="text-blue-100">
                Use your SMCT account email to open the ledger.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 py-6">
              <LoginForm />
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section id="accounts" className="flex flex-col gap-8">
          <div className="max-w-xl">
            <p className="text-sm font-medium text-blue-700">Ledger records</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Built for installment work
            </h2>
            <p className="mt-2 leading-7 text-muted-foreground">
              Each account is kept with its payment schedule and the collections
              applied to it.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="group shadow-md ring-blue-200 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-blue-400"
              >
                <CardHeader className="flex flex-col gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-blue-600 text-white transition duration-300 group-hover:bg-blue-700">
                    <feature.icon className="size-5" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

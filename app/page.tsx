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
import { AppOpening } from "@/components/app-opening";
import { SiteFooter } from "@/components/site-footer";

const features = [
  {
    icon: ClipboardList,
    image: "/accountant.png",
    imageClass: "-translate-x-6",
    title: "One account per plan",
    description:
      "Keep each customer’s installment plan, principal, and remaining balance in a single record.",
  },
  {
    icon: CalendarClock,
    image: "/schedule.png",
    imageClass: "-translate-x-6",
    title: "A schedule you can trust",
    description:
      "See the next due date, how many payments are left, and which accounts have slipped.",
  },
  {
    icon: Wallet,
    image: "/atm-card.png",
    imageClass: "-translate-x-6",
    title: "Payments against the ledger",
    description:
      "Record what was collected and apply it to the installment that is actually due.",
  },
];

export default function Home() {
  return (
    <AppOpening>
    <div className="bg-logo-tile flex min-h-svh flex-col">
      <header className="border-b border-white/10 bg-gradient-to-r from-blue-800 via-blue-700 to-sky-600 text-white">
        <div className="flex h-[4.5rem] w-full items-center px-6">
          <Link href="/" className="inline-flex shrink-0 items-center gap-3">
            <Image
              src="/smctt.png"
              alt="SMCT Group of Companies"
              width={1024}
              height={569}
              priority
              className="h-10 w-auto"
              style={{ width: "auto", height: "2.5rem" }}
            />
            <span className="flex flex-col leading-tight">
              <span className="text-[0.65rem] font-medium tracking-[0.16em] text-blue-100 uppercase">
                SMCT Group
              </span>
              <span className="text-sm font-semibold tracking-tight">
                SMCT-LEDGER
              </span>
            </span>
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-16 bg-background px-6 py-16">
        <section className="grid items-stretch gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative flex flex-col gap-6">
            <Image
              src="/book.png"
              alt=""
              width={640}
              height={640}
              className="pointer-events-none absolute bottom-0 left-1/2 z-0 h-72 w-auto -translate-x-1/2 translate-y-8 opacity-40"
              style={{ width: "auto", height: "16.5rem" }}
            />
            <div className="relative z-10 flex flex-col gap-6">
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
          </div>

          <Card className="w-full gap-0 overflow-hidden rounded-3xl bg-white py-0 shadow-2xl shadow-blue-950/15 ring-1 ring-blue-100">
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
            <CardContent className="px-8 py-7">
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
                className="group relative overflow-visible shadow-md ring-blue-200 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-blue-400"
              >
                <CardHeader className="relative z-10 flex flex-col gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-blue-600 text-white transition duration-300 group-hover:bg-blue-700">
                    <feature.icon className="size-5" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <Image
                  src={feature.image}
                  alt=""
                  width={256}
                  height={256}
                  className={`pointer-events-none absolute -top-6 -right-6 z-20 h-24 w-auto origin-bottom-left scale-75 opacity-0 transition duration-300 group-hover:scale-100 group-hover:opacity-100 ${"imageClass" in feature ? feature.imageClass : ""}`}
                  style={{ width: "auto", height: "6rem" }}
                />
              </Card>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
    </AppOpening>
  );
}

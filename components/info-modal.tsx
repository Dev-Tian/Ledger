"use client"

import Image from "next/image"
import { useState } from "react"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

const developers = [
  {
    name: "Dev Allan",
    icon: "/allan.webp",
    href: "https://chat.smctgroup.ph/direct/DevunderscoreAllandashj",
  },
  {
    name: "Dev Jenecil",
    icon: "/jenecil.jpg",
    href: "https://chat.smctgroup.ph/direct/dev_jenecil",
  },
  {
    name: "Dev Macmac",
    icon: "/Macmac.jpg",
    href: "https://chat.smctgroup.ph/direct/Dev-IT_Macmac",
  },
  {
    name: "Dev Zart",
    icon: "/zart.jpg",
    href: "https://chat.smctgroup.ph/direct/dev_zart",
  },
  {
    name: "Dev Tian",
    icon: "/Tian.jpg",
    href: "https://chat.smctgroup.ph/direct/dev_tian",
  },
]

export function InfoModalTrigger({
  topic,
  children,
  className,
  appearance = "button",
  size = "sm",
}: {
  topic: "about" | "help"
  children: React.ReactNode
  className?: string
  appearance?: "button" | "link"
  size?: "sm" | "lg" | "default"
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {appearance === "link" ? (
        <button type="button" className={className} onClick={() => setOpen(true)}>
          {children}
        </button>
      ) : (
        <Button
          type="button"
          size={size}
          className={className}
          onClick={() => setOpen(true)}
        >
          {children}
        </Button>
      )}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent
          className={
            topic === "help"
              ? "gap-0 overflow-hidden p-0 shadow-lg ring-blue-200 sm:max-w-lg"
              : "gap-0 overflow-hidden p-0 shadow-lg ring-blue-200 sm:max-w-md"
          }
        >
          {topic === "about" ? <AboutBody /> : <HelpBody />}
          <div className="flex justify-end border-t bg-blue-50 px-6 py-4">
            <Button
              type="button"
              size="sm"
              className="bg-blue-800 px-3 text-white hover:bg-blue-900"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function AboutBody() {
  return (
    <>
      <div className="flex flex-col items-center gap-3 bg-blue-600 px-6 py-7 text-center text-white">
        <Image
          src="/smctt.png"
          alt=""
          width={1024}
          height={569}
          className="h-14 w-auto"
          style={{ width: "auto", height: "3.5rem" }}
        />
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium tracking-wide text-blue-100 uppercase">
            SMCT Group of Companies
          </p>
          <AlertDialogTitle className="text-lg text-white">About</AlertDialogTitle>
        </div>
      </div>
      <AlertDialogDescription className="px-6 py-5 text-left text-sm leading-6 text-foreground">
        SMCT-LEDGER keeps installment accounts, payment schedules, and
        collections in one place for SMCT Group of Companies.
      </AlertDialogDescription>
    </>
  )
}

function HelpBody() {
  return (
    <>
      <div className="flex flex-col items-center gap-3 bg-blue-600 px-6 py-7 text-center text-white">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium tracking-wide text-blue-100 uppercase">
            Development team
          </p>
          <AlertDialogTitle className="text-lg text-white">Help</AlertDialogTitle>
        </div>
      </div>
      <div className="px-6 py-5">
        <AlertDialogDescription className="mb-4 text-center text-sm leading-6 text-muted-foreground">
          Choose a developer to open a chat.
        </AlertDialogDescription>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {developers.map((developer) => (
            <li key={developer.name}>
              <a
                href={developer.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/70 px-3 py-4 text-center transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md hover:ring-1 hover:ring-blue-200"
              >
                <Image
                  src={developer.icon}
                  alt=""
                  width={96}
                  height={96}
                  className="size-14 rounded-full object-cover ring-2 ring-white"
                />
                <span className="text-sm font-medium text-blue-950">{developer.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

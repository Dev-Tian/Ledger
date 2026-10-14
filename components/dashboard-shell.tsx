"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import {
  BookOpen,
  CalendarClock,
  Clock,
  History,
  LayoutDashboard,
  Settings,
  User,
  UserCog,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react"

import { WelcomeModal } from "@/components/status-modals"
import { useUser } from "@/contexts/UserContext"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"

export type DashboardRole = "admin" | "employee" | "viewer"

type NavItem = { href: string; label: string; icon: LucideIcon }

function navItems(role: DashboardRole): NavItem[] {
  const base =
    role === "admin"
      ? "/dashboard/admin"
      : role === "viewer"
        ? "/dashboard/viewer"
        : "/dashboard"

  const ledger: NavItem[] = [
    { href: `${base}/customer-setup`, label: "Customer setup", icon: UserRound },
    { href: `${base}/loan-ledger`, label: "Loan ledger", icon: BookOpen },
    { href: `${base}/payment-history`, label: "Payment history", icon: History },
  ]

  if (role === "viewer") {
    return [
      ...ledger,
      {
        href: `${base}/manual-aging`,
        label: "Manual aging",
        icon: CalendarClock,
      },
    ]
  }

  if (role === "employee") return ledger

  return [
    { href: base, label: "Overview", icon: LayoutDashboard },
    ...ledger,
    {
      href: `${base}/accounts`,
      label: "Accounts",
      icon: Users,
    },
    {
      href: `${base}/user-management`,
      label: "User management",
      icon: UserCog,
    },
  ]
}

const roleLabel: Record<DashboardRole, string> = {
  admin: "Admin",
  employee: "Employee",
  viewer: "Viewer",
}

function HeaderClock() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    const tick = () => setNow(new Date())
    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [])

  const time = now
    ? new Intl.DateTimeFormat("en-PH", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "Asia/Manila",
      }).format(now)
    : "--:--:--"
  const date = now
    ? new Intl.DateTimeFormat("en-PH", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "Asia/Manila",
      }).format(now)
    : ""

  return (
    <time
      dateTime={now?.toISOString()}
      className="flex items-center gap-2 rounded-lg bg-blue-800 px-3 py-1 text-white"
    >
      <Clock className="size-4 text-white" aria-hidden />
      <span className="flex flex-col items-end leading-tight">
        <span className="text-sm font-medium tabular-nums">{time}</span>
        <span className="text-xs text-white">{date}</span>
      </span>
    </time>
  )
}

function roleFromPath(pathname: string): DashboardRole {
  if (pathname.startsWith("/dashboard/admin")) return "admin"
  if (pathname.startsWith("/dashboard/viewer")) return "viewer"
  return "employee"
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const role = roleFromPath(pathname)
  const { user, logout } = useUser()
  const signedInLabel =
    user?.name ||
    [user?.fname, user?.lname].filter(Boolean).join(" ") ||
    roleLabel[role]
  const items = navItems(role)
  const [welcomeOpen, setWelcomeOpen] = useState(true)

  return (
    <TooltipProvider>
      <WelcomeModal
        open={welcomeOpen}
        onOpenChangeAction={setWelcomeOpen}
        role={roleLabel[role]}
      />
      <SidebarProvider className="min-h-svh bg-blue-50">
        <div className="flex min-h-svh w-full flex-col">
        <header className="sticky top-0 z-20 flex h-16 w-full shrink-0 items-center gap-3 border-b bg-white px-4">
          <SidebarTrigger />
          <div className="flex items-center gap-3">
            <Image
              src="/smctt.png"
              alt="SMCT Group of Companies"
              width={1024}
              height={569}
              className="h-10 w-auto"
              style={{ width: "auto", height: "2.5rem" }}
            />
            <span className="text-sm font-semibold tracking-tight">
              SMCT-LEDGER
            </span>
          </div>
          <p className="text-sm font-semibold tracking-tight">
            {roleLabel[role]} dashboard
          </p>
          <div className="ml-auto flex items-center gap-2">
            <HeaderClock />
            <div
              className="flex items-center gap-2 pr-1"
              aria-label={`Signed in as ${signedInLabel}`}
            >
              <span className="flex size-7 items-center justify-center rounded-full bg-blue-800 text-white">
                <User className="size-3.5" aria-hidden />
              </span>
              <span className="text-sm font-medium">{signedInLabel}</span>
            </div>
            <Button
              type="button"
              size="icon-sm"
              aria-label="Settings"
              className="bg-blue-800 text-white hover:bg-blue-900"
            >
              <Settings />
            </Button>
            <Button
              type="button"
              size="sm"
              className="bg-red-800 px-3 text-white hover:bg-red-900"
              onClick={() => void logout()}
            >
              Logout
            </Button>
          </div>
        </header>
        <div className="relative flex w-full flex-1">
        <Sidebar className="absolute! top-0! bottom-0! h-auto! [&_[data-sidebar=sidebar]]:bg-blue-600 [&_[data-sidebar=sidebar]]:text-white">
          <SidebarContent className="px-2 py-4">
            <SidebarGroup className="p-0">
              <SidebarMenu className="gap-1">
                {items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={item.label}
                      className="h-10 rounded-lg px-3 text-white hover:bg-blue-700 hover:text-white data-active:bg-white data-active:font-semibold data-active:text-blue-800"
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="bg-blue-50">
          <div className="relative flex-1">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
            >
              <Image
                src="/smctt.png"
                alt=""
                width={1024}
                height={569}
                className="w-[min(72rem,115%)] opacity-[0.12]"
                style={{ width: "min(72rem, 115%)", height: "auto" }}
              />
            </div>
            <div className="relative px-6 py-8">{children}</div>
          </div>
        </SidebarInset>
        </div>
        <footer className="relative z-20 w-full border-t border-blue-700 bg-blue-600 text-white">
          <div className="flex w-full flex-wrap items-center justify-between gap-3 px-6 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <Image
                src="/smctt.png"
                alt="SMCT Group of Companies"
                width={1024}
                height={569}
                className="h-9 w-auto"
                style={{ width: "auto", height: "2.25rem" }}
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold tracking-tight">
                  SMCT-LEDGER
                </p>
                <p className="text-xs text-blue-100">
                  Installment accounts, schedules, and collections.
                </p>
              </div>
            </div>
            <p className="text-xs text-blue-100">
              Signed in as{" "}
              <span className="font-medium text-white">{signedInLabel}</span>
            </p>
          </div>
        </footer>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  )
}

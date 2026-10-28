"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState, type CSSProperties } from "react"
import {
  BookOpen,
  Building2,
  Clock,
  LayoutDashboard,
  Receipt,
  ScrollText,
  Settings,
  User,
  Users,
  type LucideIcon,
} from "lucide-react"

import { InfoModalTrigger } from "@/components/info-modal"
import { ProfileSettingsModal } from "@/components/profile-settings-modal"
import { useUser } from "@/contexts/UserContext"
import { accountRole } from "@/hoc/withAuth"

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
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { TooltipProvider } from "@/components/ui/tooltip"

export type DashboardRole = "admin" | "uploader" | "employee" | "viewer"

type NavItem = { href: string; label: string; icon: LucideIcon }

function navItems(role: DashboardRole): NavItem[] {
  const base =
    role === "admin"
      ? "/admin"
      : role === "viewer" || role === "employee"
        ? "/viewer"
        : "/uploader"

  if (role === "viewer") {
    return [{ href: `${base}/accounts`, label: "Accounts", icon: BookOpen }]
  }

  if (role === "uploader") {
    return [
      { href: base, label: "Overview", icon: LayoutDashboard },
      { href: `${base}/accounts`, label: "Accounts", icon: BookOpen },
      { href: `${base}/activity-logs`, label: "Activity logs", icon: ScrollText },
    ]
  }

  if (role === "employee") {
    return [{ href: "/viewer/accounts", label: "Accounts", icon: BookOpen }]
  }

  return [
    { href: base, label: "Overview", icon: LayoutDashboard },
    { href: `${base}/accounts`, label: "Accounts", icon: BookOpen },
    { href: `${base}/users`, label: "Users", icon: Users },
    { href: `${base}/branches`, label: "Branches", icon: Building2 },
    { href: `${base}/cust-payment`, label: "Payment", icon: Receipt },
    { href: `${base}/activity-logs`, label: "Activity logs", icon: ScrollText },
  ]
}

const roleLabel: Record<DashboardRole, string> = {
  admin: "Admin",
  uploader: "Uploader",
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

function SidebarPanelToggle({ className }: { className?: string }) {
  return (
    <SidebarTrigger
      className={`text-white hover:bg-white/15 hover:text-white ${className ?? ""}`}
    />
  )
}

function SidebarEdgeToggle() {
  const { state, isMobile, openMobile } = useSidebar()
  const open = isMobile ? openMobile : state === "expanded"
  if (open) return null

  return (
    <SidebarPanelToggle className="absolute top-3 left-3 z-30 bg-blue-800 shadow-md" />
  )
}

function roleFromPath(pathname: string): DashboardRole {
  if (pathname.startsWith("/admin")) return "admin"
  if (pathname.startsWith("/uploader")) return "uploader"
  if (pathname.startsWith("/viewer")) return "viewer"
  return "employee"
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, logout } = useUser()
  const signedInRole = accountRole(user)
  const role =
    signedInRole === "admin" ||
    signedInRole === "uploader" ||
    signedInRole === "employee" ||
    signedInRole === "viewer"
      ? signedInRole
      : roleFromPath(pathname)
  const signedInLabel =
    user?.name ||
    [user?.fname, user?.lname].filter(Boolean).join(" ") ||
    roleLabel[role]
  const items = navItems(role)
  const showSidebar = !pathname.includes("/account-ledger")
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <TooltipProvider>
      <ProfileSettingsModal
        open={profileOpen}
        onOpenChangeAction={setProfileOpen}
        user={user}
        role={user?.role || user?.roles?.[0]?.name || roleLabel[role]}
      />
      <SidebarProvider
        className="h-svh overflow-hidden bg-blue-50"
        style={{ "--sidebar-width": "13rem" } as CSSProperties}
      >
        <div className="flex h-full min-h-0 w-full flex-col overflow-hidden">
        <header className="z-20 flex h-16 w-full shrink-0 items-center gap-3 border-b bg-white px-4">
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
            {showSidebar ? (
              <>
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
                  aria-label="Profile settings"
                  className="bg-blue-800 text-white hover:bg-blue-900 cursor-pointer"
                  onClick={() => setProfileOpen(true)}
                >
                  <Settings />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="bg-red-500 px-3 text-white hover:bg-red-700 cursor-pointer"
                  onClick={() => void logout()}
                >
                  Logout
                </Button>
              </>
            ) : null}
          </div>
        </header>
        <div className="relative flex min-h-0 w-full flex-1 overflow-hidden">
        {showSidebar ? <SidebarEdgeToggle /> : null}
        {showSidebar ? <Sidebar className="absolute! top-0! bottom-0! h-auto! [&_[data-sidebar=sidebar]]:bg-gradient-to-r [&_[data-sidebar=sidebar]]:from-blue-800 [&_[data-sidebar=sidebar]]:via-blue-700 [&_[data-sidebar=sidebar]]:to-sky-600 [&_[data-sidebar=sidebar]]:text-white">
          <div className="flex justify-start px-2 pt-3">
            <SidebarPanelToggle />
          </div>
          <SidebarContent className="px-2 py-4">
            <SidebarGroup className="p-0">
              <SidebarMenu className="gap-1">
                {items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={item.label}
                      className="h-10 rounded-lg px-3 text-white hover:bg-white/15 hover:text-white data-active:bg-white data-active:font-semibold data-active:text-blue-800"
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
          <div className="pointer-events-none mt-auto flex justify-center px-4 pb-6">
            <Image
              src="/insurance.png"
              alt=""
              width={512}
              height={512}
              className="h-28 w-28 opacity-30"
              style={{ width: "7rem", height: "7rem" }}
            />
          </div>
        </Sidebar> : null}
        <SidebarInset className="min-h-0 min-w-0 overflow-y-auto bg-blue-50">
          <div className="relative min-w-0 flex-1">
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
            <div className="relative min-w-0 px-4 py-6 sm:px-6 sm:py-8">{children}</div>
          </div>
        </SidebarInset>
        </div>
        <footer className="relative z-20 w-full shrink-0 border-t border-white/10 bg-gradient-to-r from-blue-800 via-blue-700 to-sky-600 text-white">
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
            <div className="flex flex-wrap items-center gap-3">
              <InfoModalTrigger
                topic="help"
                className="bg-white/15 text-white hover:bg-white/25"
              >
                Assistance
              </InfoModalTrigger>
              <p className="text-xs text-blue-100">
                Signed in as{" "}
                <span className="font-medium text-white">{signedInLabel}</span>
              </p>
            </div>
          </div>
        </footer>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  )
}

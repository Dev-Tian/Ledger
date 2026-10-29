"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState, type CSSProperties } from "react"
import {
  BookOpen,
  Building2,
  Clock,
  LayoutDashboard,
  MessageCircle,
  Receipt,
  ScrollText,
  Settings,
  User,
  Users,
  type LucideIcon,
} from "lucide-react"

import { CalculatorBubbleButton } from "@/components/calculator-modal"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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

function sidebarFooterIcon(pathname: string) {
  if (pathname.includes("/users")) return "/group.png"
  if (pathname.includes("/accounts") || pathname.includes("/account-ledger")) {
    return "/budget.png"
  }
  if (pathname.includes("/branches")) return "/worldwide.png"
  if (pathname.includes("/cust-payment") || pathname.includes("/payment")) {
    return "/billing.png"
  }
  if (pathname.includes("/activity-logs")) return "/graph.png"
  // Overview (/admin, /uploader, etc.)
  return "/insurance.png"
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

function SidebarNavMenu({
  items,
  pathname,
}: {
  items: NavItem[]
  pathname: string
}) {
  const { state, isMobile, openMobile } = useSidebar()
  const open = isMobile ? openMobile : state === "expanded"
  const [animKey, setAnimKey] = useState(0)
  const wasOpen = useRef(open)

  useEffect(() => {
    if (open && !wasOpen.current) setAnimKey((key) => key + 1)
    wasOpen.current = open
  }, [open])

  return (
    <SidebarMenu key={animKey} className="gap-1">
      {items.map((item, index) => (
        <SidebarMenuItem
          key={item.href}
          className="animate-sidebar-nav-in"
          style={{ animationDelay: `${160 + index * 110}ms` }}
        >
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
            tooltip={item.label}
            className="h-10 w-[calc(100%-0.5rem)] rounded-lg px-3 text-white transition-[width,transform,background-color,box-shadow,color,border-radius] duration-200 ease-out hover:w-[calc(100%-1.25rem)] hover:translate-x-1 hover:bg-white/15 hover:text-white hover:shadow-md data-active:w-full data-active:translate-x-0 data-active:rounded-r-none data-active:bg-white data-active:pr-4 data-active:font-semibold data-active:text-blue-800 data-active:shadow-none data-active:hover:w-full data-active:hover:translate-x-0 data-active:hover:bg-white data-active:hover:text-blue-800 data-active:hover:shadow-none"
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
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
  const [assistanceBubbleOpen, setAssistanceBubbleOpen] = useState(true)
  const [assistanceBubbleLeaving, setAssistanceBubbleLeaving] = useState(false)
  const [togglePopKey, setTogglePopKey] = useState(0)
  const showAssistanceBubbles = assistanceBubbleOpen || assistanceBubbleLeaving
  const leaveTimer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (leaveTimer.current != null) window.clearTimeout(leaveTimer.current)
    }
  }, [])

  function toggleAssistanceBubbles() {
    setTogglePopKey((key) => key + 1)
    if (assistanceBubbleOpen) {
      setAssistanceBubbleLeaving(true)
      if (leaveTimer.current != null) window.clearTimeout(leaveTimer.current)
      leaveTimer.current = window.setTimeout(() => {
        setAssistanceBubbleOpen(false)
        setAssistanceBubbleLeaving(false)
        leaveTimer.current = null
      }, 380)
      return
    }
    setAssistanceBubbleLeaving(false)
    setAssistanceBubbleOpen(true)
  }

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
        <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden">
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
                  className="cursor-pointer bg-blue-800 text-white hover:bg-blue-900"
                  onClick={() => setProfileOpen(true)}
                >
                  <Settings />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="cursor-pointer bg-red-500 px-3 text-white hover:bg-red-700"
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
        {showSidebar ? <Sidebar className="absolute! top-0! bottom-0! h-auto! border-r-0! [&_[data-sidebar=sidebar]]:bg-gradient-to-r [&_[data-sidebar=sidebar]]:from-blue-800 [&_[data-sidebar=sidebar]]:via-blue-700 [&_[data-sidebar=sidebar]]:to-sky-600 [&_[data-sidebar=sidebar]]:text-white">
          <div className="flex justify-start px-2 pt-3">
            <SidebarPanelToggle />
          </div>
          <SidebarContent className="overflow-x-visible py-4 pr-0 pl-2">
            <SidebarGroup className="p-0">
              <SidebarNavMenu items={items} pathname={pathname} />
            </SidebarGroup>
          </SidebarContent>
          <div className="pointer-events-none mt-auto flex justify-center px-4 pb-6">
            <div key={sidebarFooterIcon(pathname)} className="animate-sidebar-nav-in">
              <div style={{ opacity: 0.72 }}>
                <Image
                  src={sidebarFooterIcon(pathname)}
                  alt=""
                  width={512}
                  height={512}
                  className="h-28 w-28 brightness-0 invert"
                  style={{ width: "7rem", height: "7rem" }}
                />
              </div>
            </div>
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
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  key={togglePopKey}
                  type="button"
                  size="icon-sm"
                  className="animate-tool-toggle-pop cursor-pointer bg-white/15 text-white hover:bg-white/25"
                  aria-label={assistanceBubbleOpen ? "Hide assistance" : "Show assistance"}
                  aria-pressed={assistanceBubbleOpen}
                  onClick={toggleAssistanceBubbles}
                >
                  <MessageCircle className="size-3.5" aria-hidden />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                {assistanceBubbleOpen ? "Hide assistance" : "Show assistance"}
              </TooltipContent>
            </Tooltip>
          </div>
        </footer>
        {showAssistanceBubbles ? (
          <div
            key={assistanceBubbleLeaving ? "bubbles-out" : "bubbles-in"}
            className="pointer-events-none absolute right-4 bottom-20 z-40 flex flex-col items-end gap-4 overflow-visible sm:right-6 sm:bottom-24"
          >
            <div
              className={`pointer-events-auto group/bubble flex flex-col items-center gap-1 ${
                assistanceBubbleLeaving ? "animate-tool-bubble-out" : "animate-tool-bubble-in"
              }`}
              style={{ animationDelay: assistanceBubbleLeaving ? "70ms" : "0ms" }}
            >
              <CalculatorBubbleButton className="tool-bubble size-14 cursor-pointer rounded-full bg-gradient-to-br from-blue-800 to-blue-600 text-white shadow-[0_10px_24px_rgb(30_64_175_/_0.35)] ring-2 ring-white/40 hover:from-blue-900 hover:to-blue-700" />
              <span className="pointer-events-none rounded-full bg-blue-950/70 px-2 py-0.5 text-[10px] font-medium tracking-wide text-white opacity-0 backdrop-blur-sm transition duration-200 group-hover/bubble:opacity-100">
                Calculator
              </span>
            </div>
            <div
              className={`pointer-events-auto group/bubble flex flex-col items-center gap-1 ${
                assistanceBubbleLeaving ? "animate-tool-bubble-out" : "animate-tool-bubble-in"
              }`}
              style={{ animationDelay: assistanceBubbleLeaving ? "0ms" : "100ms" }}
            >
              <InfoModalTrigger
                topic="help"
                size="default"
                className="tool-bubble size-14 cursor-pointer rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-[0_10px_24px_rgb(14_165_233_/_0.35)] ring-2 ring-white/40 hover:from-sky-600 hover:to-cyan-600"
              >
                <span className="sr-only">Assistance</span>
                <MessageCircle className="size-5" aria-hidden />
              </InfoModalTrigger>
              <span className="pointer-events-none rounded-full bg-blue-950/70 px-2 py-0.5 text-[10px] font-medium tracking-wide text-white opacity-0 backdrop-blur-sm transition duration-200 group-hover/bubble:opacity-100">
                Assistance
              </span>
            </div>
          </div>
        ) : null}
        </div>
      </SidebarProvider>
    </TooltipProvider>
  )
}

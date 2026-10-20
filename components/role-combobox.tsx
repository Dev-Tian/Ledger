"use client"

import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const roles = [
  { value: "admin", label: "Admin" },
  { value: "uploader", label: "Uploader" },
  { value: "employee", label: "Employee" },
] as const

function labelFor(value: string) {
  const known = roles.find((role) => role.value === value.toLowerCase())
  if (known) return known.label
  if (!value) return ""
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function RoleCombobox({
  value,
  onValueChange,
}: {
  value: string
  onValueChange: (value: string) => void
}) {
  const selected = value.trim().toLowerCase()
  const label = labelFor(selected)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full justify-between bg-white px-3 text-base font-normal text-blue-950 hover:bg-white"
        >
          <span className={label ? "text-blue-950" : "text-muted-foreground"}>
            {label || "Select a role"}
          </span>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-(--radix-dropdown-menu-trigger-width)">
        <DropdownMenuRadioGroup value={selected} onValueChange={onValueChange}>
          {roles.map((role) => (
            <DropdownMenuRadioItem key={role.value} value={role.value} className="cursor-pointer">
              {role.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

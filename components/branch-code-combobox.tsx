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

const ALL_VALUE = "__all__"

export function BranchCodeCombobox({
  branches,
  value,
  onValueChange,
  placeholder = "Select a branch",
  allLabel,
  className,
}: {
  branches: string[]
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  /** When set, adds an “all” option that reports `""` via onValueChange. */
  allLabel?: string
  className?: string
}) {
  const codes = branches.filter(Boolean)
  const selected = codes.find((code) => code === value) ?? ""
  const radioValue = allLabel && !selected ? ALL_VALUE : selected
  const label = selected || allLabel || placeholder

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={
            className ??
            "h-11 w-full justify-between bg-white px-3 text-base font-normal text-blue-950 hover:bg-white"
          }
        >
          <span className={selected || allLabel ? "text-blue-950" : "text-muted-foreground"}>
            {label}
          </span>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-(--radix-dropdown-menu-trigger-width)">
        <DropdownMenuRadioGroup
          value={radioValue}
          onValueChange={(next) => {
            onValueChange(next === ALL_VALUE ? "" : next)
          }}
        >
          {allLabel ? (
            <DropdownMenuRadioItem value={ALL_VALUE} className="cursor-pointer">
              {allLabel}
            </DropdownMenuRadioItem>
          ) : null}
          {codes.length === 0 && !allLabel ? (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">No branches found.</div>
          ) : (
            codes.map((code) => (
              <DropdownMenuRadioItem key={code} value={code} className="cursor-pointer">
                {code}
              </DropdownMenuRadioItem>
            ))
          )}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

"use client"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox"

type BranchOption = { value: string; label: string }

export function BranchCodeCombobox({
  branches,
  value,
  onValueChange,
}: {
  branches: string[]
  value: string
  onValueChange: (value: string) => void
}) {
  const options = branches.map((code) => ({ value: code, label: code }))
  const selected =
    options.find((option) => option.value.toLowerCase() === value.trim().toLowerCase()) ??
    (value.trim() ? { value: value.trim(), label: value.trim() } : null)
  const items = selected && !options.some((option) => option.value === selected.value)
    ? [selected, ...options]
    : options

  return (
    <Combobox
      items={items}
      value={selected}
      onValueChange={(next) => onValueChange(next?.value ?? "")}
      isItemEqualToValue={(item, current) => item.value === current.value}
    >
      <ComboboxTrigger className="flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-input bg-white px-3 text-base text-blue-950">
        <ComboboxValue placeholder="Select a branch" />
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxInput showTrigger={false} placeholder="Search branches" />
        <ComboboxEmpty>No branches found.</ComboboxEmpty>
        <ComboboxList>
          {(item: BranchOption) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

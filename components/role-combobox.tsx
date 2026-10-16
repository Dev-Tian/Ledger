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

type RoleOption = { value: string; label: string }

const roles: RoleOption[] = [
  { value: "admin", label: "Admin" },
  { value: "uploader", label: "Uploader" },
  { value: "employee", label: "Employee" },
]

function labelFor(value: string) {
  const known = roles.find((role) => role.value === value.toLowerCase())
  if (known) return known.label
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function RoleCombobox({
  value,
  onValueChange,
}: {
  value: string
  onValueChange: (value: string) => void
}) {
  const current = value.trim().toLowerCase()
  const selected = current ? { value: current, label: labelFor(current) } : null
  const items =
    selected && !roles.some((role) => role.value === selected.value)
      ? [selected, ...roles]
      : roles

  return (
    <Combobox
      items={items}
      value={selected}
      onValueChange={(next) => onValueChange(next?.value ?? "")}
      isItemEqualToValue={(item, currentItem) => item.value === currentItem.value}
    >
      <ComboboxTrigger className="flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-input bg-white px-3 text-base text-blue-950">
        <ComboboxValue placeholder="Select a role" />
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxInput showTrigger={false} placeholder="Search roles" />
        <ComboboxEmpty>No roles found.</ComboboxEmpty>
        <ComboboxList>
          {(item: RoleOption) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

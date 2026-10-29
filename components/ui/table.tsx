"use client"

import * as React from "react"
import { cn } from "cn"

const overflowClassPattern =
  /\boverflow(?:-[xy])?(?:-auto|-scroll|-hidden|-clip|-visible)?\b/g

function Table({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<"table"> & { containerClassName?: string }) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [horizontalOverflow, setHorizontalOverflow] = React.useState(false)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(false)
  const [stickyRightWidth, setStickyRightWidth] = React.useState(0)

  const overflowClass =
    containerClassName?.match(overflowClassPattern)?.join(" ") || "overflow-x-auto"
  const layoutClass = containerClassName
    ?.replace(overflowClassPattern, "")
    .replace(/\s+/g, " ")
    .trim()

  React.useEffect(() => {
    const scroller = scrollRef.current
    if (!scroller) return

    function stickyRightInset(node: HTMLElement) {
      let width = 0
      for (const cell of node.querySelectorAll("th, td")) {
        const style = getComputedStyle(cell)
        if (style.position !== "sticky") continue
        const right = Number.parseFloat(style.right)
        if (!Number.isFinite(right) || right > 0.5) continue
        width = Math.max(width, cell.getBoundingClientRect().width)
      }
      return Math.round(width)
    }

    function update() {
      const node = scrollRef.current
      if (!node) return
      const { scrollLeft, scrollWidth, clientWidth } = node
      const maxX = scrollWidth - clientWidth
      const overflow = maxX > 1
      setHorizontalOverflow(overflow)
      setCanScrollLeft(overflow && scrollLeft > 1)
      setCanScrollRight(overflow && scrollLeft < maxX - 1)
      setStickyRightWidth(stickyRightInset(node))
    }

    update()
    scroller.addEventListener("scroll", update, { passive: true })
    const resizeObserver = new ResizeObserver(update)
    resizeObserver.observe(scroller)
    const table = scroller.querySelector("table")
    if (table) resizeObserver.observe(table)

    const mutationObserver = new MutationObserver(update)
    mutationObserver.observe(scroller, {
      childList: true,
      subtree: true,
      characterData: true,
    })

    return () => {
      scroller.removeEventListener("scroll", update)
      resizeObserver.disconnect()
      mutationObserver.disconnect()
    }
  }, [overflowClass, layoutClass])

  return (
    <div
      data-slot="table-container"
      className={cn("relative w-full max-w-full overflow-hidden", layoutClass)}
    >
      <div ref={scrollRef} className={cn("size-full", overflowClass)}>
        <table
          data-slot="table"
          className={cn("w-max min-w-full caption-bottom text-sm", className)}
          {...props}
        />
      </div>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 z-40 w-8 bg-gradient-to-r from-white via-white/70 to-transparent transition-opacity duration-200",
          horizontalOverflow ? (canScrollLeft ? "opacity-100" : "opacity-40") : "opacity-0"
        )}
      />
      <div
        aria-hidden
        style={{ right: stickyRightWidth }}
        className={cn(
          "pointer-events-none absolute inset-y-0 z-40 w-8 bg-gradient-to-l from-white via-white/70 to-transparent transition-opacity duration-200",
          horizontalOverflow ? (canScrollRight ? "opacity-100" : "opacity-40") : "opacity-0"
        )}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}

"use client"

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react"
import { Calculator, GripHorizontal, X } from "lucide-react"
import { createPortal } from "react-dom"

import { Button } from "@/components/ui/button"

type Op = "+" | "-" | "×" | "÷"

function formatDisplay(value: string) {
  if (!value || value === "-") return value || "0"
  const negative = value.startsWith("-")
  const raw = negative ? value.slice(1) : value
  const [whole, fraction] = raw.split(".")
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  const next = fraction != null ? `${grouped}.${fraction}` : grouped
  return negative ? `-${next}` : next
}

function calculate(left: number, right: number, op: Op) {
  switch (op) {
    case "+":
      return left + right
    case "-":
      return left - right
    case "×":
      return left * right
    case "÷":
      return right === 0 ? NaN : left / right
  }
}

function trimResult(value: number) {
  if (!Number.isFinite(value)) return "Error"
  return String(Number(value.toPrecision(12)))
}

function clampPosition(x: number, y: number, width: number, height: number) {
  const maxX = Math.max(8, window.innerWidth - width - 8)
  const maxY = Math.max(8, window.innerHeight - height - 8)
  return {
    x: Math.min(Math.max(8, x), maxX),
    y: Math.min(Math.max(8, y), maxY),
  }
}

export function CalculatorModal({
  open,
  onOpenChangeAction,
}: {
  open: boolean
  onOpenChangeAction: (open: boolean) => void
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const dragOffset = useRef({ x: 0, y: 0 })
  const draggingRef = useRef(false)
  const [mounted, setMounted] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [display, setDisplay] = useState("0")
  const [stored, setStored] = useState<number | null>(null)
  const [pendingOp, setPendingOp] = useState<Op | null>(null)
  const [fresh, setFresh] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return
    const width = 320
    const height = 460
    setPosition(
      clampPosition(
        window.innerWidth - width - 28,
        window.innerHeight - height - 120,
        width,
        height,
      ),
    )
  }, [open])

  useEffect(() => {
    function onPointerMove(event: PointerEvent) {
      if (!draggingRef.current) return
      const panel = panelRef.current
      const width = panel?.offsetWidth ?? 320
      const height = panel?.offsetHeight ?? 460
      setPosition(
        clampPosition(
          event.clientX - dragOffset.current.x,
          event.clientY - dragOffset.current.y,
          width,
          height,
        ),
      )
    }

    function onPointerUp() {
      if (!draggingRef.current) return
      draggingRef.current = false
      setDragging(false)
    }

    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)
    return () => {
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
    }
  }, [])

  function reset() {
    setDisplay("0")
    setStored(null)
    setPendingOp(null)
    setFresh(true)
  }

  function close() {
    reset()
    onOpenChangeAction(false)
  }

  function startDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return
    const panel = panelRef.current
    if (!panel) return
    const box = panel.getBoundingClientRect()
    dragOffset.current = {
      x: event.clientX - box.left,
      y: event.clientY - box.top,
    }
    draggingRef.current = true
    setDragging(true)
  }

  function inputDigit(digit: string) {
    setDisplay((current) => {
      if (fresh || current === "0" || current === "Error") {
        setFresh(false)
        return digit
      }
      if (current.replace("-", "").replace(".", "").length >= 12) return current
      return `${current}${digit}`
    })
  }

  function inputDot() {
    setDisplay((current) => {
      if (fresh || current === "Error") {
        setFresh(false)
        return "0."
      }
      if (current.includes(".")) return current
      return `${current}.`
    })
  }

  function toggleSign() {
    setDisplay((current) => {
      if (current === "0" || current === "Error") return current
      return current.startsWith("-") ? current.slice(1) : `-${current}`
    })
    setFresh(false)
  }

  function applyPercent() {
    setDisplay((current) => {
      const value = Number(current)
      if (!Number.isFinite(value)) return "0"
      return trimResult(value / 100)
    })
    setFresh(true)
  }

  function chooseOp(op: Op) {
    const value = Number(display)
    if (!Number.isFinite(value)) {
      reset()
      return
    }
    if (stored != null && pendingOp && !fresh) {
      const next = calculate(stored, value, pendingOp)
      const text = trimResult(next)
      setDisplay(text)
      setStored(text === "Error" ? null : next)
      setPendingOp(text === "Error" ? null : op)
      setFresh(true)
      return
    }
    setStored(value)
    setPendingOp(op)
    setFresh(true)
  }

  function equals() {
    if (stored == null || !pendingOp) return
    const value = Number(display)
    if (!Number.isFinite(value)) {
      reset()
      return
    }
    const next = calculate(stored, value, pendingOp)
    const text = trimResult(next)
    setDisplay(text)
    setStored(null)
    setPendingOp(null)
    setFresh(true)
  }

  const keys: { label: string; onClick: () => void; className?: string }[] = [
    { label: "AC", onClick: reset, className: "bg-blue-100 text-blue-900 hover:bg-blue-200" },
    { label: "+/−", onClick: toggleSign, className: "bg-blue-100 text-blue-900 hover:bg-blue-200" },
    { label: "%", onClick: applyPercent, className: "bg-blue-100 text-blue-900 hover:bg-blue-200" },
    { label: "÷", onClick: () => chooseOp("÷"), className: "bg-sky-500 text-white hover:bg-sky-600" },
    { label: "7", onClick: () => inputDigit("7") },
    { label: "8", onClick: () => inputDigit("8") },
    { label: "9", onClick: () => inputDigit("9") },
    { label: "×", onClick: () => chooseOp("×"), className: "bg-sky-500 text-white hover:bg-sky-600" },
    { label: "4", onClick: () => inputDigit("4") },
    { label: "5", onClick: () => inputDigit("5") },
    { label: "6", onClick: () => inputDigit("6") },
    { label: "−", onClick: () => chooseOp("-"), className: "bg-sky-500 text-white hover:bg-sky-600" },
    { label: "1", onClick: () => inputDigit("1") },
    { label: "2", onClick: () => inputDigit("2") },
    { label: "3", onClick: () => inputDigit("3") },
    { label: "+", onClick: () => chooseOp("+"), className: "bg-sky-500 text-white hover:bg-sky-600" },
    { label: "0", onClick: () => inputDigit("0"), className: "col-span-2" },
    { label: ".", onClick: inputDot },
    { label: "=", onClick: equals, className: "bg-blue-800 text-white hover:bg-blue-900" },
  ]

  if (!mounted || !open) return null

  return createPortal(
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Calculator"
      className="fixed z-50 w-[min(20rem,calc(100vw-1rem))] overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-blue-200"
      style={{ left: position.x, top: position.y }}
    >
      <div
        className={`flex cursor-grab items-start justify-between gap-3 bg-gradient-to-r from-blue-800 via-blue-700 to-sky-600 px-4 py-3 text-white select-none active:cursor-grabbing ${
          dragging ? "cursor-grabbing" : ""
        }`}
        onPointerDown={startDrag}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <GripHorizontal className="size-4 opacity-70" aria-hidden />
            <Calculator className="size-4" aria-hidden />
            <p className="text-sm font-semibold">Calculator</p>
          </div>
          <p className="mt-1 text-xs text-blue-100">Drag to move around the dashboard.</p>
        </div>
        <Button
          type="button"
          size="icon-sm"
          aria-label="Close calculator"
          className="cursor-pointer bg-white/15 text-white hover:bg-white/25"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={close}
        >
          <X className="size-3.5" aria-hidden />
        </Button>
      </div>
      <div className="bg-white px-3 pt-3">
        <div className="mb-3 rounded-xl bg-blue-50 px-3 py-4 text-right ring-1 ring-blue-100">
          <p className="min-h-8 truncate text-3xl font-semibold tracking-tight text-blue-950 tabular-nums">
            {formatDisplay(display)}
          </p>
          <p className="mt-1 text-xs text-blue-700/70">
            {pendingOp && stored != null ? `${formatDisplay(String(stored))} ${pendingOp}` : " "}
          </p>
        </div>
        <div className="grid grid-cols-4 gap-2 pb-3">
          {keys.map((key) => (
            <Button
              key={key.label}
              type="button"
              className={`h-11 cursor-pointer rounded-xl text-base font-semibold ${
                key.className ?? "bg-white text-blue-950 ring-1 ring-blue-100 hover:bg-blue-50"
              }`}
              onClick={key.onClick}
            >
              {key.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex justify-end border-t border-blue-100 bg-blue-50/80 px-3 py-2.5">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="cursor-pointer bg-white px-4 text-blue-950"
          onClick={close}
        >
          Close
        </Button>
      </div>
    </div>,
    document.body,
  )
}

export function CalculatorBubbleButton({
  className,
}: {
  className?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        type="button"
        size="default"
        aria-label="Open calculator"
        className={className}
        onClick={() => setOpen(true)}
      >
        <span className="sr-only">Calculator</span>
        <Calculator className="size-5" aria-hidden />
      </Button>
      <CalculatorModal open={open} onOpenChangeAction={setOpen} />
    </>
  )
}

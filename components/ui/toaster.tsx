"use client"

import { CircleAlert, CircleCheck, TriangleAlert, X } from "lucide-react"
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react"

import { cn } from "cn"

type ToastTone = "success" | "failed" | "warning"

type ToastInput = {
  title: string
  description?: string
}

type ToastItem = ToastInput & {
  id: string
  tone: ToastTone
  closing: boolean
}

type ToastApi = {
  success: (toast: ToastInput) => void
  failed: (toast: ToastInput) => void
  warning: (toast: ToastInput) => void
}

const ToastContext = createContext<ToastApi | null>(null)

const tones: Record<
  ToastTone,
  { label: string; className: string; icon: typeof CircleCheck }
> = {
  success: {
    label: "Success",
    className: "border-0 bg-[#008000] text-white",
    icon: CircleCheck,
  },
  failed: {
    label: "Failed",
    className: "border-0 bg-[#ff0000] text-white",
    icon: CircleAlert,
  },
  warning: {
    label: "Warning",
    className: "border-0 bg-[#ffff00] text-black",
    icon: TriangleAlert,
  },
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const closingIds = useRef(new Set<string>())

  const dismiss = useCallback((id: string) => {
    if (closingIds.current.has(id)) return
    closingIds.current.add(id)
    setToasts((current) =>
      current.map((toast) =>
        toast.id === id ? { ...toast, closing: true } : toast,
      ),
    )
    window.setTimeout(() => {
      closingIds.current.delete(id)
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 500)
  }, [])

  const push = useCallback(
    (tone: ToastTone, toast: ToastInput) => {
      const id = crypto.randomUUID()
      setToasts((current) => [
        ...current,
        { ...toast, id, tone, closing: false },
      ])
      window.setTimeout(() => dismiss(id), 3000)
    },
    [dismiss],
  )

  const api = useMemo<ToastApi>(
    () => ({
      success: (toast) => push("success", toast),
      failed: (toast) => push("failed", toast),
      warning: (toast) => push("warning", toast),
    }),
    [push],
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed top-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-3 overflow-visible">
        {toasts.map((toast) => {
          const tone = tones[toast.tone]
          const Icon = tone.icon

          return (
            <div
              key={toast.id}
              role={toast.tone === "failed" ? "alert" : "status"}
              className={cn(
                toast.closing
                  ? "pointer-events-auto animate-toast-out rounded-xl border px-4 py-3 shadow-lg"
                  : "pointer-events-auto animate-toast-in rounded-xl border px-4 py-3 shadow-lg",
                tone.className,
              )}
            >
              <div className="flex items-start gap-3">
                <Icon className="mt-0.5 size-5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium tracking-wide uppercase">
                    {tone.label}
                  </p>
                  <p className="text-sm font-semibold">{toast.title}</p>
                  {toast.description ? (
                    <p className="mt-1 text-sm leading-5 opacity-80">
                      {toast.description}
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  className="rounded-md p-1 hover:bg-black/10"
                  aria-label="Dismiss"
                  onClick={() => dismiss(toast.id)}
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const api = useContext(ToastContext)

  if (!api) {
    throw new Error("useToast must be used within ToastProvider.")
  }

  return api
}

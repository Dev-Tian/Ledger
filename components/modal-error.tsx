import { CircleAlert } from "lucide-react"

export function ModalError({
  title,
  message,
}: {
  title: string
  message: string
}) {
  return (
    <div
      role="alert"
      className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-left shadow-sm"
    >
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700">
        <CircleAlert className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-red-900">{title}</p>
        <p className="mt-0.5 text-sm leading-5 text-red-800">{message}</p>
      </div>
    </div>
  )
}

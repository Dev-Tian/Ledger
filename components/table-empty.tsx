import Image from "next/image"

export function TableEmpty({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-2">
      <Image
        src="/not-found.gif"
        alt=""
        width={320}
        height={200}
        unoptimized
        className="h-28 w-auto"
        style={{ width: "auto", height: "7rem" }}
      />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

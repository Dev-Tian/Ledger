import Image from "next/image"

/** Faded SMCT logo behind modal body content. */
export function ModalLogoWatermark() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
    >
      <Image
        src="/smctt.png"
        alt=""
        width={1024}
        height={569}
        className="w-[min(28rem,85%)] opacity-[0.08]"
        style={{ width: "min(28rem, 85%)", height: "auto" }}
      />
    </div>
  )
}

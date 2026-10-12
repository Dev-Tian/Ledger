export function LedgerPage({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <section className="flex max-w-xl flex-col gap-2">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="leading-7 text-muted-foreground">{description}</p>
    </section>
  )
}

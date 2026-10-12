export default function AboutTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="animate-page-fade motion-reduce:animate-none">{children}</div>
  );
}

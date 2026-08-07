export function Tag({
  children,
  dotColor = "var(--terracotta)",
}: {
  children: React.ReactNode;
  dotColor?: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1 text-xs font-mono-tag uppercase tracking-wide text-ink-soft">
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: dotColor }}
      />
      {children}
    </span>
  );
}

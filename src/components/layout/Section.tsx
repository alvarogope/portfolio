export default function Section({
  children,
  className = "",
  tight = false,
}: {
  children: React.ReactNode;
  className?: string;
  tight?: boolean;
}) {
  return (
    <section
      className={className}
      style={{
        maxWidth: "min(90vw, 68rem)",
        margin: "0 auto",
        padding: "var(--space-section, 4rem) 1.5rem",
        ...(tight ? { paddingTop: "var(--space-section-tight, 1.5rem)" } : null),
      }}
    >
      {children}
    </section>
  );
}

export default function Section({
  children,
  className = "",
  tight = false,
}: {
  children: React.ReactNode;
  className?: string;
  /**
   * Drop the TOP padding only, for a Section that follows a project hero.
   *
   * The default 4rem is right between two sections. Directly under a hero it
   * is the middle of three stacked gaps — the hero's own bottom padding, this,
   * and the chapter index's — which together opened every project page with a
   * screen of empty space before anything to read. The bottom padding is
   * untouched, so the foot of the page keeps its rhythm.
   */
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

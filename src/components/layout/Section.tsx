   export default function Section({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <section
        className={className}
        style={{
          maxWidth: "min(90vw, 68rem)",
          margin: "0 auto",
          padding: "var(--space-section, 4rem) 1.5rem",
        }}
      >
        {children}
      </section>
    );
  }
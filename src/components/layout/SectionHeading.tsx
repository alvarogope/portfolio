   export default function SectionHeading({
    kicker,
    title,
  }: {
    kicker?: string;
    title: string;
  }) {
    return (
      <div style={{ marginBottom: "1.75rem" }}>
        {kicker && (
          <p
            className="mono"
            style={{
              fontSize: "0.7rem",
              color: "var(--color-lunar-gold)",
              marginBottom: "0.6rem",
            }}
          >
            {kicker}
          </p>
        )}
        <h2 style={{ fontSize: "var(--text-xl)", margin: 0 }}>{title}</h2>
        <div
          style={{
            width: "2.5rem",
            height: "2px",
            background: "var(--color-lunar-gold)",
            marginTop: "0.9rem",
          }}
        />
      </div>
    );
  }
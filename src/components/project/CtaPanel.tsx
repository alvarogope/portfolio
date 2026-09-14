import Link from "next/link";

export default function CtaPanel({
  kicker,
  title,
  body,
  href,
  linkLabel,
  accent = "gold",
}: {
  kicker: string;
  title: string;
  body: string;
  href: string;
  linkLabel: string;
  accent?: "gold" | "silver";
}) {
  const rule = accent === "gold" ? "var(--color-gold)" : "var(--color-silver)";
  return (
    <Link
      href={href}
      className="panel cta-panel"
      style={{ "--cta-rule": rule } as React.CSSProperties}
    >
      <span
        className="mono"
        style={{
          fontSize: "0.71rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--color-silver)",
        }}
      >
        {kicker}
      </span>
      <h2
        style={{
          margin: "0.75rem 0 1rem",
          fontSize: "var(--text-xl)",
          fontFamily: "var(--font-display)",
          lineHeight: 1.2,
        }}
      >
        {title}
      </h2>
      <p style={{ margin: 0, lineHeight: 1.75, color: "var(--color-silver)" }}>{body}</p>
      {/* The whole panel is the link, which is exactly why it needs saying:
          a bordered block of prose does not look clickable. */}
      <span className="mono cta-panel__link">
        Click here · {linkLabel}{" "}
        <span aria-hidden="true" className="cta-panel__arrow">
          →
        </span>
      </span>
    </Link>
  );
}

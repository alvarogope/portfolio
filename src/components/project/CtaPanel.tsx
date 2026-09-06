import Link from "next/link";

const HAIRLINE = "1px solid color-mix(in srgb, var(--color-mist) 20%, transparent)";

/**
 * The hand-off panel at the foot of a page: what is on the next page, and why
 * you would go there.
 *
 * EXTRACTED, NOT INVENTED. This is the panel the game-engineering page has been
 * rendering inline to send readers on to the quantum toolkit. The main page now
 * needs the same control to hand readers to the deep dive, and the deep-dive
 * page needs it to hand them back — three inline copies of one panel is how
 * three panels stop looking alike.
 *
 * `accent` is the left rule. Gold for a forward hand-off into new material,
 * silver for a lateral or return move — the same ranking `RampLink` uses, so a
 * reader reads direction off the colour without being told.
 */
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
    <div
      className="panel"
      style={{
        padding: "clamp(1.75rem, 5vw, 3rem)",
        border: HAIRLINE,
        borderLeft: `3px solid ${rule}`,
        maxWidth: "38rem",
      }}
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
      <Link
        href={href}
        className="mono"
        style={{
          display: "inline-block",
          marginTop: "1.5rem",
          fontSize: "0.8rem",
          color: "var(--color-gold)",
          borderBottom: "1px solid color-mix(in srgb, var(--color-gold) 50%, transparent)",
          paddingBottom: "3px",
        }}
      >
        {linkLabel} <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

import Link from "next/link";

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
 * THE WHOLE CARD IS THE LINK. It was a <div> with one anchor on its last line,
 * which left most of a 38rem card inert while looking every bit as clickable as
 * the line that worked. The panel is now the <a> itself and the line at the
 * foot is a <span> — one control, one accessible name, no nested anchors. The
 * hover, focus and reduced-motion states live in `globals.css` under CTA PANEL,
 * because this renders up to twice a page across six pages and a per-instance
 * <style> tag would ship the same sheet a dozen times.
 *
 * `accent` is the left rule, and now also what the card's hairline warms to on
 * hover. Gold for a forward hand-off into new material, silver for a lateral or
 * return move — the same ranking `RampLink` uses, so a reader reads direction
 * off the colour without being told.
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
      {/* Not an anchor. The card around it is the one. */}
      <span className="mono cta-panel__link">
        {linkLabel}{" "}
        <span aria-hidden="true" className="cta-panel__arrow">
          →
        </span>
      </span>
    </Link>
  );
}

import Link from "next/link";

/**
 * "The full argument is over here" — the link out of a condensed section.
 *
 * WHY THIS SHAPE. The main page was cut from ~7,650 words to ~2,600 by moving
 * five sections' depth onto `/moon-knight/world`. Every section that was cut
 * rather than moved ends with one of these, and the ramps have to look like ONE
 * mechanism: a reader who follows the first should recognise the second and
 * third instantly as the same offer, not wonder whether they lead somewhere
 * different in kind.
 *
 * It is the mono / gold / hairline-underline treatment the engineering links at
 * the foot of "What Broke, and What I Built" already use, lifted into a
 * component so the three new ramps and the two old engineering links cannot
 * drift apart.
 *
 * `tone` exists because those two engineering links are deliberately ranked:
 * the game programming leads in gold and the quantum research follows in
 * silver. Same control, stated priority.
 *
 * IT SAYS "CLICK HERE FOR" IN SO MANY WORDS. A gold mono line with an arrow
 * reads as a link to anyone who has used a portfolio site before and as
 * decoration to plenty of people who have not — and a ramp nobody clicks is a
 * section nobody reads. The lead is rendered as its own uppercase key so the
 * label after it stays the thing the reader is choosing between; every ramp on
 * the site gets it from here, so they cannot say it in five different ways.
 */
export default function RampLink({
  href,
  children,
  tone = "gold",
}: {
  href: string;
  children: React.ReactNode;
  tone?: "gold" | "silver";
}) {
  const color = tone === "gold" ? "var(--color-gold)" : "var(--color-silver)";
  return (
    <Link
      href={href}
      className="mono ramp"
      style={
        {
          "--ramp-color": color,
        } as React.CSSProperties
      }
    >
      <span className="ramp__key">Click here for</span>
      <span className="ramp__label">
        {children} <span aria-hidden="true">→</span>
      </span>

      <style>{`
        .ramp {
          display: inline-flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 0.2rem 0.5rem;
          font-size: 0.78rem;
          line-height: 1.5;
          color: var(--ramp-color);
        }
        .ramp__key {
          font-size: 0.64rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          opacity: 0.85;
        }
        .ramp__label {
          border-bottom: 1px solid color-mix(in srgb, var(--ramp-color) 50%, transparent);
          padding-bottom: 2px;
        }
        .ramp:hover .ramp__label,
        .ramp:focus-visible .ramp__label {
          border-bottom-color: var(--ramp-color);
        }
      `}</style>
    </Link>
  );
}

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
      className="mono"
      style={{
        display: "inline-block",
        fontSize: "0.78rem",
        lineHeight: 1.5,
        color,
        borderBottom: `1px solid color-mix(in srgb, ${color} 50%, transparent)`,
        paddingBottom: "2px",
      }}
    >
      {children} <span aria-hidden="true">→</span>
    </Link>
  );
}

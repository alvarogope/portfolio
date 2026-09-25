import Link from "next/link";

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

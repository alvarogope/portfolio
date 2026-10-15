import Link from "next/link";

export default function RampLink({
  href,
  children,
  tone = "gold",
  prefix = "Click here for",
  size = "md",
}: {
  href: string;
  children: React.ReactNode;
  tone?: "gold" | "silver";
  prefix?: string;
  size?: "md" | "lg";
}) {
  const color = tone === "gold" ? "var(--color-gold)" : "var(--color-silver)";
  return (
    <Link
      href={href}
      className={size === "lg" ? "mono ramp ramp--lg" : "mono ramp"}
      style={
        {
          "--ramp-color": color,
        } as React.CSSProperties
      }
    >
      <span className="ramp__key">{prefix}</span>
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
        .ramp--lg { font-size: 0.9rem; }
        .ramp--lg .ramp__key { font-size: 0.72rem; }
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

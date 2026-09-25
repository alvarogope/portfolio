import Link from "next/link";

export interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: readonly Crumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mono"
      style={{ fontSize: "0.72rem", color: "var(--color-mist)", marginTop: "1rem" }}
    >
      <ol
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        {items.map((item, i) => (
          <li key={item.label} style={{ display: "contents" }}>
            {i > 0 && <span aria-hidden>/</span>}
            {item.href ? (
              <Link href={item.href} style={{ color: "var(--color-mist)" }}>
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" style={{ color: "var(--color-silver)" }}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

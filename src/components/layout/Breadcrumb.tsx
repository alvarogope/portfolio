import Link from "next/link";

/**
 * The trail back up from a project subpage.
 *
 * EXTRACTED, NOT INVENTED. This is the breadcrumb the game-engineering page
 * has been rendering inline since it was built; the deep-dive subpage needed
 * exactly the same thing, and two hand-maintained copies of a navigation
 * control is how they drift apart. Both pages now render this.
 *
 * The last crumb is the current page and is NOT a link — it carries
 * `aria-current="page"` instead. A link to where you already are is noise for
 * everyone and a small trap for a screen-reader user paging through landmarks.
 */
export interface Crumb {
  label: string;
  /** Omit on the final crumb — the page you are already on. */
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

import type { ProjectFacts, ProjectLink } from "@/content/schema";

export default function ProjectFactsBlock({
  facts,
  links,
}: {
  facts: ProjectFacts;
  links: ProjectLink[];
}) {
  const items = [
    { k: "Engine", v: facts.engine },
    { k: "Role", v: facts.role },
    { k: "Team", v: facts.team },
    { k: "Year", v: facts.year },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "1.5rem 2.5rem",
        alignItems: "flex-start",
        padding: "1.5rem 0",
        borderTop: "1px solid var(--color-nightfall)",
        borderBottom: "1px solid var(--color-nightfall)",
      }}
    >
      {items.map(({ k, v }) => (
        <div key={k} style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          <span className="mono" style={{ fontSize: "0.7rem", color: "var(--color-mist)" }}>
            {k}
          </span>
          <span style={{ fontSize: "0.95rem" }}>{v}</span>
        </div>
      ))}

      {links.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          <span className="mono" style={{ fontSize: "0.7rem", color: "var(--color-mist)" }}>
            Links
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            {links.map((l) => (
              <a
                key={l.label}
                href={l.url}
                style={{
                  fontSize: "0.95rem",
                  color: "var(--color-gold)",
                  borderBottom: "1px solid transparent",
                }}
              >
                {l.label} ↗
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
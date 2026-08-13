import type { ProjectFacts, ProjectLink } from "@/content/schema";
import EngineTag from "./EngineTag";

export default function ProjectFactsBlock({
  facts,
  links,
}: {
  facts: ProjectFacts;
  links: ProjectLink[];
}) {
  /* Engine is pulled out of the plain-text run and rendered as a tag,
     so it is the one fact that reads at a glance. The rest of the row
     stays as it was. */
  const items = [
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
      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
        <span className="mono" style={{ fontSize: "0.7rem", color: "var(--color-mist)" }}>
          Engine
        </span>
        <EngineTag engine={facts.engine} />
      </div>

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
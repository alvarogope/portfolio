import type { Project } from "@/content/schema";

type EngNote = NonNullable<Project["engineeringNote"]>;

export default function EngineeringNote({ note }: { note: EngNote }) {
  return (
    <div
      className="panel"
      style={{
        border: "1px solid color-mix(in srgb, var(--color-mist) 20%, transparent)",
        padding: "clamp(1.5rem, 4vw, 2.5rem)",
      }}
    >
      <div style={{ display: "grid", gap: "1.5rem" }}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
          <span className="mono" style={{ color: "var(--color-mist)", fontSize: "0.75rem", minWidth: "3rem", paddingTop: "0.1rem" }}>
            2025
          </span>
          <p style={{ margin: 0, maxWidth: "44rem" }}>{note.designedYear.replace(/^2025[:\s]*/, "")}</p>
        </div>

        <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
          <span className="mono" style={{ color: "var(--color-lunar-gold)", fontSize: "0.75rem", minWidth: "3rem", paddingTop: "0.1rem" }}>
            2026
          </span>
          <p style={{ margin: 0, maxWidth: "44rem" }}>{note.engineeringYear.replace(/^2026[:\s]*/, "")}</p>
        </div>
      </div>

      <div
        style={{
          marginTop: "1.75rem",
          paddingTop: "1.5rem",
          borderTop: "1px solid color-mix(in srgb, var(--color-mist) 20%, transparent)",
        }}
      >
        <span className="mono" style={{ fontSize: "0.65rem", color: "var(--color-mist)" }}>
          Current status
        </span>
        <p style={{ margin: "0.5rem 0 0", maxWidth: "44rem", color: "var(--color-moonlight)" }}>
          {note.currentStatus}
        </p>

        {note.repoUrl ? (
          <a
            href={note.repoUrl}
            className="mono"
            style={{
              display: "inline-block",
              marginTop: "1.25rem",
              color: "var(--color-lunar-gold)",
              fontSize: "0.75rem",
              borderBottom: "1px solid color-mix(in srgb, var(--color-lunar-gold) 50%, transparent)",
              paddingBottom: "2px",
            }}
          >
            Engineering deep-dive: the C++ toolkit ↗
          </a>
        ) : null}
      </div>
    </div>
  );
}
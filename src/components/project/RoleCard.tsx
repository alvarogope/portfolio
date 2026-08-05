import type { Role } from "@/content/schema";

const accentColor = (a?: string) =>
  a === "gold"
    ? "var(--color-gold)"
    : a === "scarlet"
    ? "var(--color-scarlet)"
    : a === "emerald"
    ? "var(--color-emerald)"
    : "var(--color-silver)";

export default function RoleCard({ role }: { role: Role }) {
  const accent = accentColor(role.accent);

  return (
    <article
      className="panel"
      style={{
        border: "1px solid color-mix(in srgb, var(--color-mist) 20%, transparent)",
        borderTop: `2px solid ${accent}`,
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <div>
        <h3 style={{ fontSize: "var(--text-lg)", margin: 0, fontFamily: "var(--font-hero)" }}>
          {role.name}
        </h3>
        <p style={{ margin: "0.4rem 0 0", color: "var(--color-moonlight)", lineHeight: 1.55 }}>
          {role.brief}
        </p>
      </div>

      <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--color-mist)", lineHeight: 1.6 }}>
        {role.tools}
      </p>

      <div
        style={{
          marginTop: "auto",
          paddingTop: "1rem",
          borderTop: "1px solid color-mix(in srgb, var(--color-mist) 18%, transparent)",
          display: "grid",
          gap: "0.6rem",
        }}
      >
        <div style={{ display: "flex", gap: "0.6rem", alignItems: "baseline" }}>
          <span className="mono" style={{ fontSize: "0.6rem", color: "var(--color-mist)", minWidth: "5.5rem" }}>
            Depends on
          </span>
          <span style={{ fontSize: "0.85rem" }}>{role.dependsOn}</span>
        </div>
        <div style={{ display: "flex", gap: "0.6rem", alignItems: "baseline" }}>
          <span className="mono" style={{ fontSize: "0.6rem", color: accent, minWidth: "5.5rem" }}>
            Needed by
          </span>
          <span style={{ fontSize: "0.85rem" }}>{role.neededBy}</span>
        </div>
      </div>
    </article>
  );
}
import type { Ability } from "@/content/schema";

export default function AbilityCard({ ability }: { ability: Ability }) {
  return (
    <article
      className="panel"
      style={{
        border: "1px solid color-mix(in srgb, var(--color-mist) 20%, transparent)",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.9rem",
      }}
    >
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <h3 style={{ fontSize: "var(--text-lg)", margin: 0 }}>{ability.name}</h3>
        <div style={{ display: "flex", gap: "0.4rem" }}>
          {ability.availableTo.map((who) => (
            <span
              key={who}
              className="mono"
              style={{
                fontSize: "0.72rem",
                padding: "0.28rem 0.65rem",
                borderRadius: "999px",
                color: who === "Enemy" && ability.availableTo.length === 1
                  ? "var(--color-rose-blood)"
                  : "var(--color-mist)",
                border: `1px solid ${
                  who === "Enemy" && ability.availableTo.length === 1
                    ? "var(--color-rose-blood)"
                    : "color-mix(in srgb, var(--color-mist) 40%, transparent)"
                }`,
              }}
            >
              {who}
            </span>
          ))}
        </div>
      </header>

      <p style={{ margin: 0, lineHeight: 1.7 }}>{ability.body}</p>

      <p
        className="mono"
        style={{
          margin: 0,
          fontSize: "0.85rem",
          color: "var(--color-mist)",
          borderLeft: "2px solid var(--color-gold)",
          paddingLeft: "0.85rem",
          lineHeight: 1.65,
        }}
      >
        {ability.annotation}
      </p>
    </article>
  );
}
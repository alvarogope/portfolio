import type { DesignChallenge } from "@/content/schema";

export default function ChallengeQuote({
  challenge,
  renderProse,
}: {
  challenge: DesignChallenge;
  renderProse?: (text: string) => React.ReactNode;
}) {
  const meta = [
    challenge.engine && { k: "Engine", v: challenge.engine },
    challenge.system && { k: "System", v: challenge.system },
    challenge.resolution && { k: "Resolution", v: challenge.resolution },
  ].filter(Boolean) as { k: string; v: string }[];

  return (
    <div
      className="panel"
      style={{
        border: "1px solid color-mix(in srgb, var(--color-gold) 35%, transparent)",
        borderLeft: "3px solid var(--color-gold)",
        padding: "clamp(1.5rem, 4vw, 2.5rem)",
      }}
    >
      <span
        className="mono"
        style={{ fontSize: "0.72rem", color: "var(--color-gold)", letterSpacing: "0.14em" }}
      >
        Design Challenge
      </span>

      <p style={{ fontSize: "var(--text-lg)", lineHeight: 1.6, margin: "1rem 0 1.5rem", maxWidth: "38rem" }}>
        {renderProse ? renderProse(challenge.quote) : challenge.quote}
      </p>

      {meta.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1.25rem 2rem",
            paddingTop: "1.25rem",
            borderTop: "1px solid color-mix(in srgb, var(--color-mist) 20%, transparent)",
          }}
        >
          {meta.map(({ k, v }) => (
            <div key={k} style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              <span className="mono" style={{ fontSize: "0.72rem", color: "var(--color-mist)" }}>
                {k}
              </span>
              <span style={{ fontSize: "0.92rem", lineHeight: 1.5 }}>{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
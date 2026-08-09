import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/content/schema";

/* The homepage "character-select" card. Shows the four wayfinding
   signals: systems hook, disciplines, scope, and a routing verb —
   so a recruiter knows what each project is and why to click before
   clicking. Pillars render larger; the fourth card is standard. */

export default function ProjectGateway({
  project: p,
  posterSrc,
  featured = false,
}: {
  project: Project;
  posterSrc?: string;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/${p.slug}`}
      className="panel"
      style={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid color-mix(in srgb, var(--color-mist) 20%, transparent)",
        overflow: "hidden",
        textDecoration: "none",
        transition: "border-color 0.25s var(--ease-soft, ease), transform 0.25s var(--ease-soft, ease)",
        gridColumn: featured ? "1 / -1" : "span 1",
      }}
    >
      {/* Poster */}
      <div style={{ position: "relative", aspectRatio: featured ? "16 / 9" : "3 / 2", background: "var(--color-void)" }}>
        {posterSrc ? (
          <Image src={posterSrc} alt={p.posterAlt} fill sizes="(max-width: 800px) 90vw, 45vw" style={{ objectFit: "cover" }} />
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--color-mist)" }}>
            <span className="mono" style={{ fontSize: "0.7rem" }}>{p.title}</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "1.25rem 1.4rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem", flex: 1 }}>
        <span className="mono" style={{ fontSize: "0.72rem", color: "var(--color-mist)" }}>
          {p.eyebrow}
        </span>

        <h3 style={{ fontSize: featured ? "var(--text-xl)" : "var(--text-lg)", margin: 0, fontFamily: "var(--font-hero)" }}>{p.title}</h3>

        <p style={{ margin: 0, color: "var(--color-moonlight)", lineHeight: 1.55 }}>
          {p.systemsHook}
        </p>

        <div style={{ marginTop: "auto", paddingTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <span className="mono" style={{ fontSize: "0.78rem", color: "var(--color-silver)", lineHeight: 1.5 }}>
            {p.disciplines}
          </span>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
            <span className="mono" style={{ fontSize: "0.78rem", color: "var(--color-mist)", lineHeight: 1.5 }}>
              {p.scope}
            </span>
            <span className="mono" style={{ fontSize: "0.75rem", color: "var(--color-gold)" }}>
              {p.routingVerb} →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
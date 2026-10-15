import Image from "next/image";
import type { Project } from "@/content/schema";
import ProjectFactsBlock from "./ProjectFacts";

export default function ProjectHero({
  project: p,
  posterSrc,
  posterPosition = "50% 50%",
  posterShade = 0,
}: {
  project: Project;
  posterSrc: string;
  /* Where the square crop sits on a wider poster. */
  posterPosition?: string;
  /* 0–1: a void wash over a poster that is too bright for the page. */
  posterShade?: number;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.1fr)",
        gap: "clamp(2rem, 5vw, 4rem)",
        alignItems: "start",
        padding: "clamp(1rem, 3vw, 2rem) 1.5rem clamp(1.5rem, 3vw, 2.25rem)",
        width: "calc(min(46vw, 39rem) + min(46vw, 39rem, var(--free-right)))",
        marginLeft: "calc(50% - min(46vw, 39rem))",
        marginRight: "calc(50% - min(46vw, 39rem, var(--free-right)))",
      }}
      className="project-hero"
    >
      {/* Poster */}
      <div
        style={{
          position: "relative",
          aspectRatio: "1 / 1",
          borderRadius: "2px",
          overflow: "hidden",
          border: "1px solid color-mix(in srgb, var(--color-gold) 30%, transparent)",
          boxShadow: "0 20px 60px -20px rgba(0,0,0,0.8)",
        }}
      >
        {posterSrc ? (
          <Image
            src={posterSrc}
            alt={p.posterAlt}
            fill
            priority
            sizes="(max-width: 800px) 90vw, 40vw"
            style={{ objectFit: "cover", objectPosition: posterPosition }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              background: "var(--color-nightfall)",
            }}
          >
            <span className="mono" style={{ fontSize: "0.7rem", color: "var(--color-mist)" }}>
              {p.title}
            </span>
          </div>
        )}
        {posterSrc && posterShade > 0 && (
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background: `color-mix(in srgb, var(--color-void) ${Math.round(posterShade * 100)}%, transparent)`,
            }}
          />
        )}
      </div>

      {/* Text column */}
      <div>
        <h1 style={{ fontSize: "var(--text-hero)", margin: 0, lineHeight: 1.05, fontFamily: "var(--font-hero)" }}>
          {p.title}
        </h1>

        {p.showcase && (
          <p
            className="mono"
            style={{
              display: "inline-block",
              marginTop: "1.5rem",
              padding: "0.4rem 0.8rem",
              fontSize: "0.7rem",
              color: "var(--color-gold)",
              border: "1px solid var(--color-gold)",
            }}
          >
            {p.showcase}
          </p>
        )}

        <div style={{ marginTop: "2rem" }}>
          <ProjectFactsBlock facts={p.facts} links={p.links} />
        </div>
      </div>
    </div>
  );
}
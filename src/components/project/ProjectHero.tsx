import Image from "next/image";
import type { Project } from "@/content/schema";
import ProjectFactsBlock from "./ProjectFacts";

export default function ProjectHero({
  project: p,
  posterSrc,
}: {
  project: Project;
  posterSrc: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.1fr)",
        gap: "clamp(2rem, 5vw, 4rem)",
        alignItems: "start",
        /* The bottom was `clamp(2rem, 6vw, 5rem)`. It stacked with the
           following <Section>'s own 4rem top padding and the chapter index's
           1.75rem, so a wide screen opened with ~11rem of nothing between the
           hero and the page's contents. Cut to a normal section break; the
           other two halves of that stack are trimmed at their own sites. */
        padding: "clamp(1rem, 3vw, 2rem) 1.5rem clamp(1.5rem, 3vw, 2.25rem)",
        /* `min(92vw, 78rem)` centred, written as a lead and a tail so the
           right edge can stop short of the project rail. The rail is pinned
           to the middle of the viewport, so on a tall hero it lands straight
           across the fact block on the right of this grid — it did, from
           1560px to about 1890px. Same rule the wide consoles follow: the
           left edge does not move, the right one yields. `--free-right` is
           defined in globals.css, under THE RIGHT GUTTER, and is a plain
           50vw wherever the rail is not on screen. */
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
            style={{ objectFit: "cover" }}
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
      </div>

      {/* Text column */}
      <div>
        <p className="mono" style={{ color: "var(--color-mist)", fontSize: "0.75rem", marginBottom: "1rem" }}>
          {p.eyebrow}
        </p>

        <h1 style={{ fontSize: "var(--text-hero)", margin: 0, lineHeight: 1.05, fontFamily: "var(--font-hero)" }}>
          {p.title}
        </h1>

        <p style={{ fontSize: "var(--text-lg)", color: "var(--color-mist)", marginTop: "1rem", maxWidth: "36rem" }}>
          {p.tagline}
        </p>

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
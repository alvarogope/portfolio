import type { Metadata } from "next";
import { games } from "@/content/games";
import ProjectGateway from "@/components/cards/ProjectGateway";

export const metadata: Metadata = {
  title: "Álvaro Gómez | Technical Designer",
  description: "I design game systems and build them myself. Unreal Engine 5, Unity, C++, Python.",
};

// Map slugs to their poster (only Moon-Knight has one so far)
const posters: Record<string, string> = {
  "moon-knight": "/images/moon-knight/poster.png",
};

export default function Home() {
  return (
    <main style={{ maxWidth: "min(92vw, 78rem)", margin: "0 auto", padding: "clamp(3rem, 8vw, 6rem) 1.5rem" }}>
      {/* Hero */}
      <section style={{ marginBottom: "clamp(3rem, 7vw, 5rem)", maxWidth: "48rem" }}>
        <p className="mono" style={{ fontSize: "0.75rem", color: "var(--color-silver)", marginBottom: "1.25rem" }}>
          Álvaro Gómez · Technical Game Designer
        </p>
        <h1 style={{ fontSize: "var(--text-hero)", margin: 0, lineHeight: 1.05, fontFamily: "var(--font-hero)" }}>
          I design game systems and build them myself
        </h1>
        <p style={{ fontSize: "var(--text-lg)", color: "var(--color-mist)", marginTop: "1.5rem" }}>
          Unreal Engine 5 · Unity · C++ · Python. Four games, one question each: what makes the system worth playing?
        </p>
      </section>

      {/* Project grid */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1.5rem",
        }}
      >
        {games.map((p, i) => (
          <ProjectGateway
            key={p.slug}
            project={p}
            posterSrc={posters[p.slug]}
            featured={i === 0}
          />
        ))}
      </section>
    </main>
  );
}
import type { Metadata } from "next";
import { moonKnight as p } from "@/content/games/moon-knight";
import Section from "@/components/layout/Section";
import AbilityCard from "@/components/project/AbilityCard";
import ProjectHero from "@/components/project/ProjectHero";
import SectionHeading from "@/components/layout/SectionHeading";
import Gallery from "@/components/project/Gallery";
import EngineeringNote from "@/components/project/EngineeringNote";
import ChallengeQuote from "@/components/project/ChallengeQuote";
import Reveal from "@/components/layout/Reveal";
import Link from "next/link";
import ProjectNav from "@/components/layout/ProjectNav";
import { projectNavItems } from "@/content/games";
import Aurora from "@/components/effects/Aurora";
import MoonKnightAudio from "@/components/project/MoonKnightAudio";
import Bestiary from "@/components/project/Bestiary";
import WorldMap from "@/components/project/WorldMap";

export const metadata: Metadata = {
  title: `${p.title} | Álvaro Gómez Pérez`,
  description: p.systemsHook,
};

export default function MoonKnightPage() {
  return (
    <>
      {/* Hero */}
      <div className="mk-hero">
        <Aurora
          className="mk-hero-aurora"

          colorStops={["#2d5e48", "#614844", "#95313f"]}

          origin="top"
          amplitude={0.9}
          speed={2}

          blend={1}

          opacity={0.6}
        />
        <div className="mk-hero-content">
          <ProjectHero project={p} posterSrc="/images/moon-knight/poster.png" />
        </div>
      </div>

      <Section>
        {/* Vision */}
        <Reveal>
          <div style={{ maxWidth: "42rem" }}>
            <SectionHeading kicker="01 · Overview" title="The Vision" />
            <p style={{ marginTop: "1rem" }}>{p.vision}</p>
          </div>
        </Reveal>

        {/* Contributions */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="02 · My Role" title="My Contribution" />
            <div style={{ display: "grid", gap: "1.5rem" }}>
              {p.contributions.map((c) => (
                <div key={c.label}>
                  <span className="mono" style={{ fontSize: "0.75rem", color: "var(--color-lunar-gold)" }}>
                    {c.label}
                  </span>
                  <p style={{ marginTop: "0.4rem", maxWidth: "42rem" }}>{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Abilities — the signature section */}
        {p.abilities && (
          <Reveal>
            <div style={{ marginTop: "5rem" }}>
              <SectionHeading kicker="03 · Signature Systems" title="The Power of the Gods" />
              <p style={{ color: "var(--color-mist)", maxWidth: "42rem", marginTop: "3rem", marginBottom: "1.5rem" }}>
                Five optional abilities, each built on a real quantum computing principle. One equipped at a time, high risk, high reward.
              </p>
              <div style={{ display: "grid", gap: "1rem" }}>
                {p.abilities.map((a, i) => (
                  <Reveal key={a.name} delay={i * 70}>
                    <AbilityCard ability={a} />
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* Bestiary — the creatures the combat systems above are taught through */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <Bestiary kicker="04 · The Creatures" />
          </div>
        </Reveal>

        {/* The world of Kaelum — the hand-drawn map, marked up */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="05 · The World" title="The World of Kaelum" />
            <p style={{ color: "var(--color-mist)", maxWidth: "42rem", marginTop: "1.5rem", marginBottom: "1.75rem" }}>
              Four lands around one drowned island, drawn by hand. Three torches mark the fortresses
              holding the Moon Fragments; the roses mark the ways down into the Old Gods&apos; dungeons.
              Point at any sigil to read what waits there.
            </p>
            <WorldMap />
          </div>
        </Reveal>

        {/* Challenge Quote */}
        {p.designChallenge && (
          <Reveal>
            <div style={{ marginTop: "5rem" }}>
              <SectionHeading kicker="06 · The Hard Part" title="Design Challenge" />
              <div style={{ marginTop: "1.5rem" }}>
                <ChallengeQuote challenge={p.designChallenge} />
              </div>
            </div>
          </Reveal>
        )}
        {/* Design to Engineering */}
        {p.engineeringNote && (
          <Reveal>
            <div style={{ marginTop: "5rem" }}>
              <SectionHeading kicker="07 · From Design to Engineering" title="Building the Quantum" />
              <div style={{ marginTop: "1.5rem" }}>
                <EngineeringNote note={p.engineeringNote} />
              </div>
              <div style={{ marginTop: "1.5rem" }}>
                <Link
                  href="/moon-knight/engineering"
                  className="mono"
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--color-gold)",
                    borderBottom: "1px solid color-mix(in srgb, var(--color-gold) 50%, transparent)",
                    paddingBottom: "2px",
                  }}
                >
                  Read the engineering deep-dive: the C++ quantum toolkit →
                </Link>
              </div>
            </div>
          </Reveal>
        )}
        {/* Original Score */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="08 · Original Score" title="Music for a Borrowed Moon" />
            <p style={{ color: "var(--color-mist)", maxWidth: "42rem", marginTop: "1.5rem", marginBottom: "1.5rem" }}>
              I wrote and recorded the game&apos;s score myself. The main theme carries the knight through the night; the rest
              theme only surfaces when he stops beneath a willow tree. Play either below.
            </p>
            <MoonKnightAudio />
          </div>
        </Reveal>

        {/* Gallery */}
        {p.gallery && (
          <Reveal>
            <div style={{ marginTop: "5rem" }}>
              <SectionHeading kicker="09 · From the Game" title="Gallery" />
              <div style={{ marginTop: "1.5rem" }}>
                <Gallery items={p.gallery} />
              </div>
            </div>
          </Reveal>
        )}
        <Reveal>
          <ProjectNav items={projectNavItems} currentSlug={p.slug} />
        </Reveal>
      </Section>

      {/* The two layers. */}
      <style>{`
        .mk-hero {
          position: relative;
          isolation: isolate;
          overflow: hidden;
        }
        .mk-hero-aurora {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }
        .mk-hero-content {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </>
  );
}

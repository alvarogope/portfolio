import type { Metadata } from "next";
import { seedsOfTomorrow as p } from "@/content/games/seeds-of-tomorrow";
import Section from "@/components/layout/Section";
import SectionHeading from "@/components/layout/SectionHeading";
import ProjectHero from "@/components/project/ProjectHero";
import ChallengeQuote from "@/components/project/ChallengeQuote";
import Reveal from "@/components/layout/Reveal";
import SeedsAudio from "@/components/project/SeedsAudio";
import ProjectNav from "@/components/layout/ProjectNav";
import { projectNavItems } from "@/content/games";
import SideRays from "@/components/effects/SideRays";

export const metadata: Metadata = {
  title: `${p.title} | Álvaro Gómez`,
  description: p.systemsHook,
};

export default function SeedsOfTomorrowPage() {
  return (
    <>
      {/* Hero. The light is scoped to this band and to this project: the game
          is about a poisoned world healing, so morning sun is the one effect
          that is actually about the subject rather than decoration. */}
      <div className="sot-hero">
        <SideRays
          className="sot-hero-rays"
          /* Top-left, so the hot corner lands behind the poster and the shafts
             rake down-RIGHT across the open half of the hero. Sunlight reads
             as coming past something rather than glaring out of empty space,
             which is the whole idea of light through leaves; it also keeps the
             brightest pixels off the text column. */
          origin="top-left"
          /* --color-gold and --color-silver as this route re-points them: warm
             amber for the sun, living green for what it comes through. The two
             are separate ray fans `spread` apart, so you get gold shafts
             crossing green ones rather than one blended colour. */
          rayColor1="#E0A845"
          rayColor2="#5F9B6B"
          /* Gold-leaning: the sun is the subject, the leaves are the filter. */
          blend={0.4}
          spread={1.6}
          /* Off the perfect 45deg, so the fan reads as light through a canopy
             rather than a diagram. */
          tilt={-13}
          saturation={2.8}
          /* Low falloff is the wide setting, and this effect needs all of it:
             see the note in SideRays.tsx. At 1.0 the light still reads a
             quarter of the way across the hero; by 1.6 (the upstream default)
             it is spent in half that. */
          falloff={1.5}
          speed={2.5}
          /* ──────────────────────────────────────────────────────────
             THE STRENGTH PAIR -- measured, not decorative.

             --color-silver (#5F9B6B on this route, the engine tag) is the
             binding constraint: it is small text needing 4.5:1 and it only
             starts at 5.76:1 on bare --color-void, so the background has
             room to reach a luminance of 0.021 and no further.

             At intensity 1.5 / opacity 0.28 the brightest background
             anywhere in the hero is #1d2116 -- 2.6x the page, still
             darker than --color-nightfall -- and every hero text role
             clears AA:

               h1        moonlight  large  13.63:1  (needs 3.0)
               tagline   mist       large   5.25:1  (needs 3.0)
               eyebrow   mist       small   5.25:1  (needs 4.5)
               showcase  gold       small   7.70:1  (needs 4.5)
               facts.k   mist       small   5.25:1  (needs 4.5)
               facts.v   moonlight  small  13.63:1  (needs 4.5)
               engine    silver     small   4.99:1  (needs 4.5)

             Worst case over the whole hero box, a full sweep of the
             shimmer, and aspect ratios from 0.45 to 3.0 -- so it holds at
             every breakpoint, including where the hero collapses to one
             column. Raising either number breaks the engine tag first.
             `spread`, `tilt` and `speed` steer the fan without touching
             any of this; `saturation`, `blend`, `falloff` and the colours
             all move it.
             ────────────────────────────────────────────────────────── */
          intensity={2.5}
          opacity={0.28}
        />
        <div className="sot-hero-content">
          <ProjectHero project={p} posterSrc="/images/seeds-of-tomorrow/poster.png" />
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

        {/* The Score — signature section */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="02 · Original Score" title="Plant a Sound" />
            <p style={{ color: "var(--color-mist)", maxWidth: "42rem", marginTop: "1.5rem", marginBottom: "1.5rem" }}>
              I composed and recorded eleven original tracks for the game. The main theme plays as you explore this page; the seeds below are moments from the score. Plant one to hear it.
            </p>
            <SeedsAudio />
          </div>
        </Reveal>

        {/* Design Challenge — the weather system */}
        {p.designChallenge && (
          <Reveal>
            <div style={{ marginTop: "5rem" }}>
              <SectionHeading kicker="03 · The Hard Part" title="A World That Heals" />
              <div style={{ marginTop: "1.5rem" }}>
                <ChallengeQuote challenge={p.designChallenge} />
              </div>
            </div>
          </Reveal>
        )}

        {/* Contributions */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="04 · My Role" title="My Contribution" />
            <div style={{ display: "grid", gap: "1.5rem" }}>
              {p.contributions.map((c) => (
                <div key={c.label}>
                  <span className="mono" style={{ fontSize: "0.75rem", color: "var(--color-silver)" }}>
                    {c.label}
                  </span>
                  <p style={{ marginTop: "0.4rem", maxWidth: "42rem" }}>{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal>
          <ProjectNav items={projectNavItems} currentSlug={p.slug} />
        </Reveal>
      </Section>

      {/* Scoped to this page. Two layers: the rays, then the hero on top. */}
      <style>{`
        .sot-hero {
          position: relative;
          isolation: isolate;
          overflow: hidden;
        }
        .sot-hero-rays {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .sot-hero-content {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </>
  );
}

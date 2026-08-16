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

export const metadata: Metadata = {
  title: `${p.title} | Álvaro Gómez Pérez`,
  description: p.systemsHook,
};

export default function MoonKnightPage() {
  return (
    <>
      {/* Hero — poster + title + facts, full width, at the top.

          The aurora is scoped to this band and to this project: it is the
          flagship, and the arcane glow is part of its identity rather than
          a site-wide effect. Everything about the stack below is tuned
          against contrast — see mk-hero-veil. */}
      <div className="mk-hero">
        <Aurora
          className="mk-hero-aurora"
          /* Deep moon-blue → steel → deep scarlet. The scarlet is a darker
             cousin of --color-scarlet, the ritual "blood/danger" accent, so
             the band ends on the palette's own red rather than a new one.

             The alternative set (steel → #8a94a8 → deep green) was measured
             and rejected: its light middle stop drives the background to
             #717a8a, within 1.2:1 of --color-mist body text, and reads as
             literal northern lights rather than something gothic. */
          colorStops={["#1a2740", "#3a4a6a", "#681019"]}
          amplitude={0.5}
          speed={0.3}
          /* High blend is the SOFT setting here — it widens the alpha ramp.
             See the note in Aurora.tsx; `opacity` is the strength knob. */
          blend={0.6}
          opacity={0.5}
          origin="bottom"
        />
        <div aria-hidden className="mk-hero-veil" />
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
        {/* Challenge Quote */}
        {p.designChallenge && (
          <Reveal>
            <div style={{ marginTop: "5rem" }}>
              <SectionHeading kicker="04 · The Hard Part" title="Design Challenge" />
              <div style={{ marginTop: "1.5rem" }}>
                <ChallengeQuote challenge={p.designChallenge} />
              </div>
            </div>
          </Reveal>
        )}
        {/* Design to Engineering */}
        {/* Design to Engineering */}
        {p.engineeringNote && (
          <Reveal>
            <div style={{ marginTop: "5rem" }}>
              <SectionHeading kicker="05 · From Design to Engineering" title="Building the Quantum" />
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
        {/* Gallery */}
        {p.gallery && (
          <Reveal>
            <div style={{ marginTop: "5rem" }}>
              <SectionHeading kicker="06 · From the Game" title="Gallery" />
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

      {/* Scoped to this page. Three layers, bottom to top: the aurora, the
          veil that buys back its contrast, and the hero itself. */}
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
        /* ────────────────────────────────────────────────────────────
           THE VEIL — measured, not decorative.

           --color-mist is the binding constraint on this page: at 0.75rem
           it is small text, so it needs 4.5:1, and on bare --color-void it
           only starts at 5.24:1. There is almost no headroom, which is why
           the aurora runs at opacity 0.5 rather than anything higher.

           Even at 0.5 the band's brightest pixel takes mist down to
           4.14:1 — a fail. This gradient is what closes that: void at 40%
           along the bottom edge, clearing by 55% up, i.e. exactly where
           the glow lives. With it, the brightest background anywhere in
           the hero is #161c28 (a shade off --color-nightfall) and every
           hero text role passes AA at worst case:

             h1        moonlight  large  13.66:1  (needs 3.0)
             tagline   mist       large   4.63:1  (needs 3.0)
             eyebrow   mist       small   4.63:1  (needs 4.5)
             showcase  gold       small   7.58:1  (needs 4.5)
             facts     silver     small   9.65:1  (needs 4.5)

           Those are worst-case figures over the whole hero box and a full
           sweep of the animation, not average ones — so they hold at every
           breakpoint, including where the hero collapses to one column and
           the text drops into the band. Raising the aurora's opacity or
           weakening this veil breaks the eyebrow first.
           ──────────────────────────────────────────────────────────── */
        .mk-hero-veil {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: linear-gradient(
            to top,
            color-mix(in srgb, var(--color-void) 40%, transparent),
            transparent 55%
          );
        }
        .mk-hero-content {
          position: relative;
          z-index: 2;
        }
      `}</style>
    </>
  );
}

import type { Metadata } from "next";
import { shatteredSkies as p } from "@/content/games/shattered-skies";
import Section from "@/components/layout/Section";
import SectionHeading from "@/components/layout/SectionHeading";
import ProjectHero from "@/components/project/ProjectHero";
import ChallengeQuote from "@/components/project/ChallengeQuote";
import Reveal from "@/components/layout/Reveal";
import PlanetDossier from "@/components/project/PlanetDossier";
import ShatteredSkiesSystem from "@/components/project/ShatteredSkiesSystem";
import NarrativeMap from "@/components/project/NarrativeMap";
import ShatterstormWorld from "@/components/project/ShatterstormWorld";
import ShatteredSkiesMechanics from "@/components/project/ShatteredSkiesMechanics";
import ProjectNav from "@/components/layout/ProjectNav";
import { projectNavItems } from "@/content/games";
import Galaxy from "@/components/effects/Galaxy";

export const metadata: Metadata = {
  title: `${p.title} | Álvaro Gómez`,
  description: p.systemsHook,
};

export default function ShatteredSkiesPage() {
  return (
    <>
      {/* Hero */}
      <div className="ss-hero">
        <Galaxy
          className="ss-hero-galaxy"
          hueShift={97}                 // Shifts the hue of all stars by the specified degrees (0-360)
          saturation={1.1}              // Controls color saturation of stars (0 = grayscale, 1 = full color)
          density={1.2}                   // Controls the density of stars in the galaxy
          glowIntensity={0.03}          // Controls the intensity of the star glow effect
          opacity={0.66}                
          speed={0.1}                   // Global speed multiplier for all animations
          starSpeed={0.1}              
          rotationSpeed={0.03}          // Speed of automatic galaxy rotation
          twinkleIntensity={0.5}        // Controls how much stars twinkle (0 = no twinkle, 1 = maximum twinkle)
          mouseInteraction              
          mouseRepulsion={true}         // Black Hole Effect when true
          transparent={true}            // Refers to the background
        />
        <div className="ss-hero-content">
          <ProjectHero project={p} posterSrc="/images/shattered-skies/poster.png" />
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

        {/* The Game — the team's premise, world and narrative structure.
            Context before contributions: this is the game we made together,
            and the sections after it are the parts that are mine. */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="02 · The Game" title="The Game We Made" />
            <NarrativeMap />
          </div>
        </Reveal>

        {/* The World of Shatterstorm — the setting's soul, placed directly
            above the planetary dossier, which is its facts. The two are one
            world-design chapter in two halves: voice first, survey second. */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="03 · World Design" title="The World of Shatterstorm" />
            <ShatterstormWorld />
          </div>
        </Reveal>

        {/* The Planetary System */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="04 · World Design" title="A System of Five Worlds" />
            <p style={{ color: "var(--color-mist)", maxWidth: "42rem", marginTop: "1.5rem", marginBottom: "1.5rem" }}>
              A miniature solar system where the physics is the puzzle. Each planet has its own hazard, its own secret, and its own rule for getting through.
            </p>
            {/* The dossier is passed as children so it stays a server component;
                the wrapper only owns the active-world state. */}
            <ShatteredSkiesSystem>
              <PlanetDossier />
            </ShatteredSkiesSystem>
          </div>
        </Reveal>

        {/* Core Mechanics — the three systems, with the communication system
            foregrounded as the signature one. This supersedes the old
            four-card communication band: the same four channels are in here
            with their design reasoning, plus the telepathy -> endings figure,
            so keeping both would have said it twice in a row. */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="05 · Core Mechanics" title="Systems That Force You Together" />
            <p style={{ color: "var(--color-mist)", maxWidth: "42rem", marginTop: "1.5rem", marginBottom: "1.5rem" }}>
              Three systems, co-designed with the team, that all answer the same question: how do you make two players who cannot understand each other depend on each other anyway?
            </p>
            <ShatteredSkiesMechanics />
          </div>
        </Reveal>

        {/* Design Challenge */}
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

        {/* Contributions */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="07 · My Role" title="My Contribution" />
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

      {/* Scoped to this page. Two layers: the starfield, then the hero. */}
      <style>{`
        .ss-hero {
          position: relative;
          isolation: isolate;
          overflow: hidden;
        }
        .ss-hero-galaxy {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }
        .ss-hero-content {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </>
  );
}

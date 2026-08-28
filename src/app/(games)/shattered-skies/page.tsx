import type { Metadata } from "next";
import { shatteredSkies as p } from "@/content/games/shattered-skies";
import Section from "@/components/layout/Section";
import SectionHeading from "@/components/layout/SectionHeading";
import ProjectHero from "@/components/project/ProjectHero";
import ChallengeQuote from "@/components/project/ChallengeQuote";
import Reveal from "@/components/layout/Reveal";
import PlanetDossier from "@/components/project/PlanetDossier";
import PlanetLevels from "@/components/project/PlanetLevels";
import ShatteredSkiesSystem from "@/components/project/ShatteredSkiesSystem";
import NarrativeMap from "@/components/project/NarrativeMap";
import ShatterstormWorld from "@/components/project/ShatterstormWorld";
import ShatteredSkiesMechanics from "@/components/project/ShatteredSkiesMechanics";
import ShatteredSkiesCoop from "@/components/project/ShatteredSkiesCoop";
import ProjectNav from "@/components/layout/ProjectNav";
import { projectNavItems } from "@/content/games";
import Galaxy from "@/components/effects/Galaxy";
import PageHighlights from "@/components/project/PageHighlights";
// Quoted verbatim by the highlight band below, by key: the band never
// retypes a line, so §05 and §07 stay the only home for either idea.
import { levelsCredit } from "@/content/shattered-skies-levels";
import { waveformPayoff } from "@/content/shattered-skies-gameplay";

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

        {/* Skim band. This is the longest page on the site, and the audit put
            its solo audio credit at 30-41% depth and the waveform paragraph it
            calls the best on the page at 70-98%. Neither section can move: §05
            is deliberately after the dossier (facts, then play) and §07 is the
            payoff §06 hands off to, so reordering either would break a setup.
            The audit's own instruction for both is a pull quote — so both are
            surfaced here at ~1% depth, verbatim and by key, linking down to the
            sections that still own them. */}
        <Reveal>
          <div style={{ marginTop: "4rem" }}>
            <PageHighlights
              accent="var(--color-silver)"
              items={[
                {
                  section: "05 · Level Design",
                  title: "Each Planet Teaches a Skill",
                  href: "#planetary-level-design",
                  quote: levelsCredit.lines[0].body,
                },
                {
                  section: "07 · Co-op Design",
                  title: "Split, Distorted, Rebuilt",
                  href: "#coop-design",
                  quote: waveformPayoff,
                },
              ]}
            />
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
            {/* The challenge quote is the standfirst of this section rather
                than a section of its own four screens down. It IS the orrery's
                thesis — a metroidvania rebuilt around a solar system — and it
                names Tidalor's tides and Dunestorm's gravity lock, which are
                two of the worlds in the diagram directly below it. */}
            {p.designChallenge && (
              <div style={{ marginTop: "1.5rem", marginBottom: "2rem" }}>
                <ChallengeQuote challenge={p.designChallenge} />
              </div>
            )}
            {/* The dossier is passed as children so it stays a server component;
                the wrapper only owns the active-world state. */}
            <ShatteredSkiesSystem>
              <PlanetDossier />
            </ShatteredSkiesSystem>
          </div>
        </Reveal>

        {/* Planetary Level Design — the dossier's counterpart. The dossier
            above is what each world IS; this is how each one PLAYS: the
            teaching progression across the five worlds in play order, with
            audio folded in as a design dimension. Placed directly after the
            dossier so the pair read as one world-design chapter, facts then
            play, and before the mechanics section because a mechanic is
            easier to read once you know which world taught it. */}
        <Reveal>
          <div style={{ marginTop: "5rem" }} id="planetary-level-design">
            <SectionHeading kicker="05 · Level Design" title="Each Planet Teaches a Skill" />
            <p style={{ color: "var(--color-mist)", maxWidth: "42rem", marginTop: "1.5rem", marginBottom: "1.5rem" }}>
              The same five worlds, re-sequenced as a curriculum: what each one is built to teach, the puzzle that teaches it, and what it sounds like while it does.
            </p>
            <PlanetLevels />
          </div>
        </Reveal>

        {/* Core Mechanics — the three systems, with the communication system
            foregrounded as the signature one. This supersedes the old
            four-card communication band: the same four channels are in here
            with their design reasoning, plus the telepathy -> endings figure,
            so keeping both would have said it twice in a row. */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="06 · Core Mechanics" title="Systems That Force You Together" />
            <p style={{ color: "var(--color-mist)", maxWidth: "42rem", marginTop: "1.5rem", marginBottom: "1.5rem" }}>
              Three systems, co-designed with the team, that all answer the same question: how do you make two players who cannot understand each other depend on each other anyway?
            </p>
            <ShatteredSkiesMechanics />
          </div>
        </Reveal>

        {/* Co-op Design — the depth under the mechanics section. The three
            repair minigames used to be a three-card list up there; they are
            here now, each broken down into its asymmetry with a diagram of
            who knows and who controls what, followed by the general co-op
            puzzle pattern and the knowledge-gating rule. The mechanics
            section keeps a one-line pointer and no descriptions. */}
        <Reveal>
          <div style={{ marginTop: "5rem" }} id="coop-design">
            <SectionHeading kicker="07 · Co-op Design" title="Split, Distorted, Rebuilt" />
            <p style={{ color: "var(--color-mist)", maxWidth: "42rem", marginTop: "1.5rem", marginBottom: "1.5rem" }}>
              How the cooperation actually works, one system at a time: what each minigame takes away from which player, and what the pair have to invent to get it back.
            </p>
            <ShatteredSkiesCoop />
          </div>
        </Reveal>

        {/* Contributions */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="08 · My Role" title="My Contribution" />
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

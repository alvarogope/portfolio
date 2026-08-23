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
import NarrativeDesign from "@/components/project/NarrativeDesign";
import Cast from "@/components/project/Cast";
import DiegeticDesign from "@/components/project/DiegeticDesign";
import Jousting from "@/components/project/Jousting";
import ArtDirection from "@/components/project/ArtDirection";
import AudioDesign from "@/components/project/AudioDesign";

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

        {/* Narrative design — the arc, the motifs, and story carried by systems */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="06 · Narrative Design" title="Three Acts, One Moon" />
            <p style={{ color: "var(--color-mist)", maxWidth: "42rem", marginTop: "1.5rem", marginBottom: "1.75rem" }}>
              The story is told by the world, not by cutscenes. Three acts, three moon phases, three
              ages of a life — and a reversal in the last one that re-reads everything before it.
            </p>
            <NarrativeDesign />
          </div>
        </Reveal>

        {/* The cast — who is in the story the section above tells, and why each exists */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <Cast kicker="07 · The Cast" />
          </div>
        </Reveal>

        {/* Diegetic design — the systems the story above is actually told through:
            UI, progression and navigation dissolved into the fiction. Sits after
            the narrative and the cast because the moon HUD only lands once the
            reader knows what the moon means. */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="08 · Diegetic Design" title="Mechanics That Hide in the World" />
            <p style={{ color: "var(--color-mist)", maxWidth: "42rem", marginTop: "1.5rem", marginBottom: "1.75rem" }}>
              The health bar is the moon on the knight&apos;s back, experience is a rose stained in a
              boss&apos;s blood, and the map is a blade held up to the moonlight. Nothing here is a
              menu — every system is an object, a gesture or a place.
            </p>
            <DiegeticDesign />
          </div>
        </Reveal>

        {/* Art direction — the visual thesis and what it decides. Sits after
            the world, the narrative and the diegetic systems on purpose: the
            Sublime is argued through solitude, ruin and darkness, so the reader
            needs the world and the story first, and the visibility decision
            only lands once the integrated UI has been made the case for. */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="09 · Art Direction" title="The Sublime, Made Playable" />
            <p style={{ color: "var(--color-mist)", maxWidth: "42rem", marginTop: "1.5rem", marginBottom: "1.75rem" }}>
              One aesthetic idea decides the whole look of the game — and then keeps going,
              into how the player travels, what the world is made of, and how hard it is to
              see what is about to kill you.
            </p>
            <ArtDirection />
          </div>
        </Reveal>

        {/* The joust — a side feature, kept small, sitting with the other
            mechanics rather than among the pillars. */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="10 · A Side Feature" title="The Jousting Minigame" />
            <p style={{ color: "var(--color-mist)", maxWidth: "42rem", marginTop: "1.5rem", marginBottom: "1.75rem" }}>
              The Woods still keeps the duelling tradition of a fallen noble house, and Orpheus is
              the one who teaches it. Two riders, two lances, and one moment to decide.
            </p>
            <Jousting />
          </div>
        </Reveal>

        {/* Challenge Quote */}
        {p.designChallenge && (
          <Reveal>
            <div style={{ marginTop: "5rem" }}>
              <SectionHeading kicker="11 · The Hard Part" title="Design Challenge" />
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
              <SectionHeading kicker="12 · From Design to Engineering" title="Building the Quantum" />
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
        {/* Original score & audio design. The two real recordings are the
            playable core and are passed straight through to `MoonKnightAudio`;
            everything around them is the composer's reasoning. No third player
            is ever added here — the other pieces described in that section are
            design, not recordings. */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="13 · Score & Audio Design" title="Music for a Borrowed Moon" />
            <p style={{ color: "var(--color-mist)", maxWidth: "42rem", marginTop: "1.5rem", marginBottom: "1.75rem" }}>
              I composed the game&apos;s score, and designed the rules it obeys: where music is
              allowed to play, what each instrument is permitted to mean, and why most of this
              game is scored with nothing but footsteps.
            </p>
            <AudioDesign>
              <MoonKnightAudio />
            </AudioDesign>
          </div>
        </Reveal>

        {/* Gallery */}
        {p.gallery && (
          <Reveal>
            <div style={{ marginTop: "5rem" }}>
              <SectionHeading kicker="14 · From the Game" title="Gallery" />
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

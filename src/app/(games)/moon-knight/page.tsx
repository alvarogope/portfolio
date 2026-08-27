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
import ControllerMap from "@/components/project/ControllerMap";
import Jousting from "@/components/project/Jousting";
import ArtDirection from "@/components/project/ArtDirection";
import AudioDesign from "@/components/project/AudioDesign";
import BeatChart from "@/components/project/BeatChart";
import Expansions from "@/components/project/Expansions";

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

        {/* Controls — the input map. Directly after the diegetic section
            because it is that section's evidence: Raise Weapon is a shoulder
            button rather than a map screen, healing is a face button rather
            than an inventory, and there is no block bound anywhere on the pad.
            Replaces the flat controls.png that used to sit in the gallery at
            the foot of the page, where a picture of a mapping could not be
            read aloud, themed, or corrected. */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="09 · Controls" title="The Input Map" />
            <div style={{ marginTop: "1.75rem" }}>
              <ControllerMap />
            </div>
          </div>
        </Reveal>

        {/* Art direction — the visual thesis and what it decides. Sits after
            the world, the narrative and the diegetic systems on purpose: the
            Sublime is argued through solitude, ruin and darkness, so the reader
            needs the world and the story first, and the visibility decision
            only lands once the integrated UI has been made the case for. */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="10 · Art Direction" title="The Sublime, Made Playable" />
            <p style={{ color: "var(--color-mist)", maxWidth: "42rem", marginTop: "1.5rem", marginBottom: "1.75rem" }}>
              One aesthetic idea decides the whole look of the game — and then keeps going,
              into how the player travels, what the world is made of, and how hard it is to
              see what is about to kill you.
            </p>
            <ArtDirection />
          </div>
        </Reveal>

        {/* Level design — the beat chart. Last of the pillars on purpose: it is
            the only section that plans every other one at once, so the reader
            needs the creatures, the world, the cast, the story and the look
            already in hand for a cell reading "Banshees hidden in fog" to be a
            decision rather than a noun. The moon rail then closes the loop
            back to the narrative: same four phases, same spine. */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="11 · Level Design" title="The Beat Chart" />
            <p style={{ color: "var(--color-mist)", maxWidth: "42rem", marginTop: "1.5rem", marginBottom: "1.75rem" }}>
              The sheet the game was actually planned from: four levels against nine design
              dimensions, with the moon waxing across the top. Pick a level to open its design
              sheet.
            </p>
            <BeatChart />
          </div>
        </Reveal>

        {/* Expansions — the "and beyond", and the closer of the world block.
            It has to come after the beat chart: that section finishes planning
            the four levels the game HAS, so this is the natural next breath,
            and the claim only lands once the reader has seen the quantum
            abilities (03) that both concepts are grown from. Two concepts, no
            roadmap — narrative range, not a plan to ship. */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="12 · And Beyond" title="Where the World Goes Next" />
            <p style={{ color: "var(--color-mist)", maxWidth: "42rem", marginTop: "1.5rem", marginBottom: "1.75rem" }}>
              Two expansion concepts, each grown from a quantum mechanic the game already has.
              Unbuilt, and kept here as evidence of the same thing the rest of the page argues:
              that these systems generate story on their own.
            </p>
            <Expansions />
          </div>
        </Reveal>

        {/* The joust — a side feature, kept small, sitting with the other
            mechanics rather than among the pillars. */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="13 · A Side Feature" title="The Jousting Minigame" />
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
              <SectionHeading kicker="14 · The Hard Part" title="Design Challenge" />
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
              <SectionHeading kicker="15 · From Design to Engineering" title="Building the Quantum" />
              <div style={{ marginTop: "1.5rem" }}>
                <EngineeringNote note={p.engineeringNote} />
              </div>
              {/* Two deep-dives now: the game programming is the foundation
                  and leads, the quantum toolkit is the research grown inside
                  it. */}
              <div
                style={{
                  marginTop: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "0.85rem",
                }}
              >
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
                  How I programmed the game: the C++ / Blueprint architecture →
                </Link>
                <Link
                  href="/moon-knight/engineering/quantum"
                  className="mono"
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--color-silver)",
                    borderBottom: "1px solid color-mix(in srgb, var(--color-silver) 45%, transparent)",
                    paddingBottom: "2px",
                  }}
                >
                  The research within it: the C++ quantum toolkit →
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
            <SectionHeading kicker="16 · Score & Audio Design" title="Music for a Borrowed Moon" />
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
              <SectionHeading kicker="17 · From the Game" title="Gallery" />
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

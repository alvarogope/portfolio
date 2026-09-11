import type { Metadata } from "next";
import Section from "@/components/layout/Section";
import SectionHeading from "@/components/layout/SectionHeading";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Reveal from "@/components/layout/Reveal";
import ProjectNav from "@/components/layout/ProjectNav";
import { moonKnightNavItems } from "@/content/games";
import CtaPanel from "@/components/project/CtaPanel";
import NarrativeDesign from "@/components/project/NarrativeDesign";
import Cast from "@/components/project/Cast";
import DiegeticDesign from "@/components/project/DiegeticDesign";
import ArtDirection from "@/components/project/ArtDirection";
import AudioDesign from "@/components/project/AudioDesign";
import MoonKnightAudio from "@/components/project/MoonKnightAudio";
import Expansions from "@/components/project/Expansions";
import Jousting from "@/components/project/Jousting";
import { deepDiveAnchors } from "@/content/moon-knight-deep-dive";

export const metadata: Metadata = {
  title: "The World, the Story and the Score | Moon-Knight",
  description:
    "The deep dive: Moon-Knight's three-act arc and its reversal, the cast, the symbolism, the jousting minigame, and the full diegetic, art-direction and score arguments.",
};

export default function MoonKnightWorldPage() {
  return (
    <Section>
      <Breadcrumb
        items={[
          { label: "Moon-Knight", href: "/moon-knight" },
          { label: "The deep dive" },
        ]}
      />

      <Reveal>
        <header style={{ marginTop: "1.5rem", maxWidth: "40rem" }}>
          <p
            className="mono"
            style={{ fontSize: "0.72rem", color: "var(--color-silver)", marginBottom: "1rem" }}
          >
            MOON-KNIGHT · STORY, SYMBOL & MUSIC
          </p>
          <h1
            style={{
              fontSize: "var(--text-hero)",
              margin: 0,
              lineHeight: 1.05,
              fontFamily: "var(--font-hero)",
            }}
          >
            The World, the Story and the Music
          </h1>
          <p style={{ fontSize: "var(--text-lg)", color: "var(--color-mist)", marginTop: "1rem" }}>
            This other half of the project is mainly focus on its narrative, the NPCs and their stories,
            the pagan symbolism it was built from, the artistic decisions and the music and audio design in depth.
            Finally, it focuses on how to monetise the game after its release with a Jousting minigame that outgrew the game
            and the potental expansions.
          </p>
        </header>
      </Reveal>

      {/* 1 — the arc, the reversal, and the plot */}
      <Reveal>
        <div
          id={deepDiveAnchors.narrative}
          style={{ marginTop: "4rem", scrollMarginTop: "2rem" }}
        >
          <SectionHeading kicker="Narrative Design" title="The Three Acts" />
          <p
            style={{
              color: "var(--color-mist)",
              maxWidth: "35rem",
              marginTop: "1.5rem",
              marginBottom: "1.75rem",
            }}
          >
            The game tells its story through the gameplay, mechanics, quests and combats and not through
            cutscenes. Centralis is the tutorial and prologue, the following levels are the three acts of the story.
            Each are represented by three moon phases, three ages of life and an ending to the story at the highest peak of the world.
          </p>
          <NarrativeDesign />
        </div>
      </Reveal>

      {/* 02 — THE CAST */}
      <Reveal>
        <div
          id={deepDiveAnchors.cast}
          style={{ marginTop: "5rem", scrollMarginTop: "2rem" }}
        >
          <Cast kicker="The Characters" />
        </div>
      </Reveal>

      {/* 04 — diegetic design */}
      <Reveal>
        <div
          id={deepDiveAnchors.diegetic}
          style={{ marginTop: "5rem", scrollMarginTop: "2rem" }}
        >
          <SectionHeading kicker="UI Diegetic Design" title="The In-World UI Design" />
          <p
            style={{
              color: "var(--color-mist)",
              maxWidth: "35rem",
              marginTop: "1.5rem",
              marginBottom: "1.75rem",
            }}
          >
            The main page shows what it was built, but here is the explanation and the full deep-dive.
          </p>
          <DiegeticDesign />
        </div>
      </Reveal>

      {/* 05 — art direction */}
      <Reveal>
        <div
          id={deepDiveAnchors.art}
          style={{ marginTop: "5rem", scrollMarginTop: "2rem" }}
        >
          <SectionHeading kicker="Art Direction" title="The Sublime" />
          <p
            style={{
              color: "var(--color-mist)",
              maxWidth: "35rem",
              marginTop: "1.5rem",
              marginBottom: "1.75rem",
            }}
          >
            The Sublime and their way of romanticise the medieval ages is what inspired the artstyle direction.
            This art philosophy adapted to games, exposes the player to solitude, open spaces and big challenges
            whether internal or external.
          </p>
          <ArtDirection />
        </div>
      </Reveal>

      {/* 06 — the music */}
      <Reveal>
        <div
          id={deepDiveAnchors.score}
          style={{ marginTop: "5rem", scrollMarginTop: "2rem" }}
        >
          <SectionHeading kicker="Music & Audio Design" title="The Music of Kaelum" />
          <p
            style={{
              color: "var(--color-mist)",
              maxWidth: "35rem",
              marginTop: "1.5rem",
              marginBottom: "1.75rem",
            }}
          >
            I composed the game&apos;s music and also designed the reasons behind it. Where music is
            played, what each instrument to means and why this audio design.
          </p>
          <AudioDesign>
            <MoonKnightAudio />
          </AudioDesign>
        </div>
      </Reveal>

      {/* 07 — THE JOUSTING minigame */}
      <Reveal>
        <div
          id={deepDiveAnchors.jousting}
          style={{ marginTop: "5rem", scrollMarginTop: "2rem" }}
        >
          <SectionHeading kicker="07 · A Side Feature" title="The Jousting Minigame" />
          <p
            style={{
              color: "var(--color-mist)",
              maxWidth: "35rem",
              marginTop: "1.5rem",
              marginBottom: "1.75rem",
            }}
          >
            The Woods still keeps the duelling tradition of a fallen noble house. Two riders, two
            lances, and one moment to decide.
          </p>
          <Jousting />
        </div>
      </Reveal>

      {/* 08 — the expansions */}
      <Reveal>
        <div
          id={deepDiveAnchors.expansions}
          style={{ marginTop: "5rem", scrollMarginTop: "2rem" }}
        >
          <SectionHeading kicker="08 · And Beyond" title="Where the World Goes Next" />
          <p
            style={{
              color: "var(--color-mist)",
              maxWidth: "35rem",
              marginTop: "1.5rem",
              marginBottom: "1.75rem",
            }}
          >
            Two expansion concepts, each grown from a quantum mechanic the game already has.
            Unbuilt, and kept here as evidence of the same thing the project argues throughout:
            that these systems generate story on their own.
          </p>
          <Expansions />
        </div>
      </Reveal>

      <Reveal>
        <div
          style={{
            marginTop: "5rem",
            display: "grid",
            gap: "1.5rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 20rem), 1fr))",
            alignItems: "start",
          }}
        >
          <CtaPanel
            kicker="Back to the project"
            title="Moon-Knight"
            body="The built work: the quantum combat systems, the creatures they are taught through, the control scheme, the world of Kaelum, the beat chart the game was planned from, and the engine limit that turned into a C++ toolkit."
            href="/moon-knight"
            linkLabel="Back to Moon-Knight"
            accent="silver"
          />
          <CtaPanel
            kicker="The other subpage"
            title="Game Engineering"
            body="How the game is actually built: what lives in Blueprint and what lives in C++, the combat state machine, the data-driven tuning layer, and captures from the editor."
            href="/moon-knight/engineering"
            linkLabel="Read the engineering write-up"
            accent="silver"
          />
        </div>
      </Reveal>

      <Reveal>
        <ProjectNav
          items={moonKnightNavItems}
          currentSlug="moon-knight-world"
          kicker="Where to next"
        />
      </Reveal>
    </Section>
  );
}

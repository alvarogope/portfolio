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
import ArtDirection from "@/components/project/ArtDirection";
import AudioDesign from "@/components/project/AudioDesign";
import MoonKnightAudio from "@/components/project/MoonKnightAudio";
import Expansions from "@/components/project/Expansions";
import Jousting from "@/components/project/Jousting";
import { deepDiveAnchors } from "@/content/moon-knight-deep-dive";

export const metadata: Metadata = {
  title: "The World | Moon-Knight",
  description:
    "The deep dive: Moon-Knight's three-act arc and its reversal, the cast, the symbolism, the jousting minigame, and the full art-direction and score arguments.",
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
            This other half of the project is mainly focused on its narrative, the NPCs and their stories,
            the pagan symbolism it was built from, the artistic decisions and the music and audio design in depth.
            Finally, it focuses on how to monetise the game after its release with a Jousting minigame that outgrew the game
            and the potential expansions.
          </p>
        </header>
      </Reveal>

      {/* 1 — the arc, the reversal, and the plot */}
      <Reveal>
        <div
          id={deepDiveAnchors.narrative}
          style={{ marginTop: "4rem" }}
        >
          <SectionHeading kicker="The Three Acts" title="The Narrative Design" />
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
            Each is represented by three moon phases, three ages of life and an ending to the story at the highest peak of the world.
          </p>
          <NarrativeDesign />
        </div>
      </Reveal>

      {/* 02 — THE CAST */}
      <Reveal>
        <div
          id={deepDiveAnchors.cast}
          style={{ marginTop: "5rem" }}
        >
          <Cast kicker="The Characters" />
        </div>
      </Reveal>

      {/* 03 — art direction */}
      <Reveal>
        <div
          id={deepDiveAnchors.art}
          style={{ marginTop: "5rem" }}
        >
          <SectionHeading kicker="The Sublime" title="Art Direction" />
          <ArtDirection />
        </div>
      </Reveal>

      {/* 04 — the music */}
      <Reveal>
        <div
          id={deepDiveAnchors.score}
          style={{ marginTop: "5rem" }}
        >
          <SectionHeading kicker="The Soundtrack" title="The Music of Kaelum" />
          <p
            style={{
              color: "var(--color-mist)",
              maxWidth: "35rem",
              marginTop: "1.5rem",
              marginBottom: "1.75rem",
            }}
          >
            I composed the game&apos;s music and also designed the reasons behind it. Where music is
            played, what each instrument means and why this audio design.
          </p>
          <AudioDesign>
            <MoonKnightAudio />
          </AudioDesign>
        </div>
      </Reveal>

      {/* 05 — THE JOUSTING minigame */}
      <Reveal>
        <div
          id={deepDiveAnchors.jousting}
          style={{ marginTop: "5rem" }}
        >
          <SectionHeading kicker="MiniGame" title="Medieval Jousting" />
          <p
            style={{
              color: "var(--color-mist)",
              maxWidth: "35rem",
              marginTop: "1.5rem",
              marginBottom: "1.75rem",
            }}
          >
            An old duelling tradition that is shown to the Moon-Knight.
          </p>
          <Jousting />
        </div>
      </Reveal>

      {/* 06 — the expansions */}
      <Reveal>
        <div
          id={deepDiveAnchors.expansions}
          style={{ marginTop: "5rem" }}
        >
          <SectionHeading kicker="Expansions" title="Potential DLCs" />
          <p
            style={{
              color: "var(--color-mist)",
              maxWidth: "35rem",
              marginTop: "1.5rem",
              marginBottom: "1.75rem",
            }}
          >
            I thought of two potential expansions. Each will focus on a quantum mechanic already in the game.
            They were kept only in the Design Document as a way to show the market potential of the game.
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
            kicker="Back to the Design Project"
            title="Moon-Knight"
            body="The design project: video gameplays, the five quantum abilities, the type of enemies, the control scheme, the world of Kaelum and the beat chart the game was planned with."
            href="/moon-knight"
            linkLabel="Back to Moon-Knight"
            accent="silver"
          />
          <CtaPanel
            kicker="The Codebase"
            title="Programming Moon-Knight"
            body="The engineering side of the project. The limitations of Blueprints translated into C++ and the main code choices. The combat state machine, the data-driven layer and the quantum C++ engine limits."
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

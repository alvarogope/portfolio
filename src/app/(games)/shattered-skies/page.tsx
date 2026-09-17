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
import PlateGrid from "@/components/project/PlateGrid";
import ShatterstormWorld from "@/components/project/ShatterstormWorld";
import ShatteredSkiesMechanics from "@/components/project/ShatteredSkiesMechanics";
import ShatteredSkiesCoop from "@/components/project/ShatteredSkiesCoop";
import ProjectNav from "@/components/layout/ProjectNav";
import ChapterNav from "@/components/layout/ChapterNav";
import {
  shatteredSkiesChapters as ch,
  shatteredSkiesChapterList,
} from "@/content/project-chapters";
import { projectNavItems } from "@/content/games";
import Galaxy from "@/components/effects/Galaxy";
import {
  BACKDROP_OPACITY,
  SHATTERED_SKIES_GALAXY,
} from "@/components/effects/SubpageBackdrop";
import RampLink from "@/components/project/RampLink";
import CtaPanel from "@/components/project/CtaPanel";
import { inMotionIntro, inMotionItems } from "@/content/shattered-skies-in-motion";
import { deepDiveHref, deepDivePath, mainAnchors } from "@/content/shattered-skies-deep-dive";

export const metadata: Metadata = {
  title: `${p.title} | Álvaro Gómez`,
  description: p.systemsHook,
};

/* ═══════════════════════════════════════════════════════════════════════════
   SHATTERED SKIES · THE MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

const GAP = { marginTop: "5rem" } as const;

const LEAD = {
  color: "var(--color-mist)",
  maxWidth: "35rem",
  marginTop: "1.5rem",
  marginBottom: "1.5rem",
} as const;

export default function ShatteredSkiesPage() {
  return (
    <>
      {/* Hero */}
      <div className="ss-hero">
        <Galaxy
          className="ss-hero-galaxy"
          {...SHATTERED_SKIES_GALAXY}
          opacity={BACKDROP_OPACITY.shatteredSkies.hero}
        />
        <div className="ss-hero-content">
          <ProjectHero project={p} posterSrc="/images/shattered-skies/poster.png" />
        </div>
      </div>

      <Section tight>
        <ChapterNav chapters={shatteredSkiesChapterList} />

        {/* ═══ 01 · OVERVIEW ═══ */}
        <Reveal>
          <div id={ch.overview.id} style={{ maxWidth: "35rem" }}>
            <SectionHeading kicker="Overview" title={ch.overview.title} />
            <p style={{ marginTop: "1rem" }}>{p.vision}</p>
          </div>
        </Reveal>

        {/* ═══ 02 · IN MOTION ═══ */}
        <Reveal>
          <div style={GAP} id={mainAnchors.inMotion}>
            <SectionHeading kicker={inMotionIntro.kicker} title={inMotionIntro.title} />
            <PlateGrid minWidth="22rem" items={[...inMotionItems]} />
          </div>
        </Reveal>

        {/* ═══ 03 · THE GAME ═══ */}
        <Reveal>
          <div style={GAP} id={mainAnchors.theGame}>
            <SectionHeading kicker="The Game" title={ch.theGame.title} />
            <NarrativeMap variant="main" />

            <div style={{ marginTop: "3rem" }}>
              <PlateGrid
                minWidth="29rem"
                items={[
                  {
                    src: "/images/shattered-skies/story-beats.jpg",
                    label: "The narrative structure",
                    alt: "The narrative structure chart: two backstories for Drayk and Aevi converging through four story beats into four endings — Unity, two Betrayal variants, and Extinction.",
                    caption:
                      "The narrative structure that all designers had access in the GDD. The beats, the character backstories and the three endings posibilities.",
                  },
                  {
                    src: "/images/shattered-skies/shattered-skies-spaceship.png",
                    label: "The planets in game",
                    alt: "In-engine view of the ship on the hub floor with a wall of planets behind it. The planet textures are placeholders from a stock solar-system set, not the five designed worlds.",
                    caption:
                      "The planet layout in-game. The planets are placeholder textures due to lack of time, but the system works for adding the new 3D models. The design of the five planets are below.",
                  },
                ]}
              />
            </div>

            <div style={{ marginTop: "2rem" }}>
              <RampLink href={deepDiveHref("story")}>
                The whole story, the final choice and the three endings
              </RampLink>
            </div>
          </div>
        </Reveal>

        {/* ═══ 04 · MY ROLE ═══ */}
        <Reveal>
          <div id={ch.role.id} style={GAP}>
            <SectionHeading kicker="My Role" title={ch.role.title} />
            <div style={{ display: "grid", gap: "1.25rem", marginTop: "1.5rem" }}>
              {p.contributions.map((c) => (
                <div key={c.label}>
                  <span className="mono" style={{ fontSize: "0.75rem", color: "var(--color-silver)" }}>
                    {c.label}
                  </span>
                  <p style={{ marginTop: "0.4rem", maxWidth: "35rem" }}>{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ═══ 05 · THE WORLD & THE FIVE WORLDS ═══ */}
        <Reveal>
          <div style={GAP} id={mainAnchors.worlds}>
            <SectionHeading kicker="World Design" title={ch.worlds.title} />
            <div style={{ marginTop: "1.5rem", marginBottom: "2rem" }}>
              <ShatterstormWorld variant="main" />
            </div>

            {p.designChallenge && (
              <div style={{ marginBottom: "2.5rem" }}>
                <ChallengeQuote challenge={p.designChallenge} />
              </div>
            )}

            <ShatteredSkiesSystem>
              <PlanetDossier />
            </ShatteredSkiesSystem>

            <div style={{ marginTop: "2rem" }}>
              <RampLink href={deepDiveHref("world")}>
                The Full Description of the Planetary System and What is found there
              </RampLink>
            </div>
          </div>
        </Reveal>

        {/* ═══ 06 · LEVEL DESIGN ═══*/}
        <Reveal>
          <div style={GAP} id={mainAnchors.levels}>
            <SectionHeading kicker="Level Design" title={ch.levels.title} />
            <PlanetLevels />
          </div>
        </Reveal>

        {/* ═══ 07 · CORE MECHANICS ═══ */}
        <Reveal>
          <div style={GAP} id={mainAnchors.mechanics}>
            <SectionHeading kicker="The Core Mechanics" title={ch.mechanics.title} />
            <p style={LEAD}>
              These systems were designed with the team. The purpose of them was to make the players
              cooperate and rely on each other without any kind of communication.
            </p>
            <ShatteredSkiesMechanics />

            <div style={{ marginTop: "2.5rem", maxWidth: "54rem" }}>
              <PlateGrid
                minWidth="100%"
                aspect="1728 / 1079"
                items={[
                  {
                    src: "/images/shattered-skies/shattered-skies-gameplay-ui.png",
                    label: "The communication channel in-game",
                    alt: "In-game view of a corridor fight: the objective panel top-left, the weapon slot bottom-left, and the Conversation Panel bottom-right — the interface two players who cannot understand each other have to talk through.",
                    caption:
                      "The Conversation Panel, bottom right, in the HUD next to the objective and the weapon slot.",
                  },
                ]}
              />
            </div>
          </div>
        </Reveal>

        {/* ═══ 08 · CO-OP DESIGN ═══ */}
        <Reveal>
          <div style={GAP} id={mainAnchors.coop}>
            <SectionHeading kicker="Co-op Design" title={ch.coop.title} />
            <p style={LEAD}>
              How the main mechanics work. How each player interact with the minigame
              and the way the were designed to enhance cooperation.
            </p>
            <ShatteredSkiesCoop />

            <div style={{ marginTop: "3rem" }}>
              <PlateGrid
                minWidth="26rem"
                items={[
                  {
                    src: "/images/shattered-skies/spaceship.png",
                    label: "The ship sketch",
                    alt: "Hand-annotated schematic of the ship from above, marking the weapons, defence, radar, steering, landing gear, resource collection and the two entry points.",
                    caption:
                      "This is a sketch of the ship we made for the developers to have a visual representation. Everything is annotated: " +
                      "where the weapons, defence, radar, steering, landing gear and resource management are located in the ship",
                  },
                ]}
              />
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div style={{ ...GAP, maxWidth: "34rem" }}>
            <CtaPanel
              kicker="The deep dive"
              title="The World & the Story"
              body=
                "The worldbuilding and the main story unsummarsed. The full narrative, the full endings and the Shatterstorm."
              href={deepDivePath}
              linkLabel="Read the deep dive"
            />
          </div>
        </Reveal>

        <Reveal>
          <ProjectNav items={projectNavItems} currentSlug={p.slug} />
        </Reveal>
      </Section>

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

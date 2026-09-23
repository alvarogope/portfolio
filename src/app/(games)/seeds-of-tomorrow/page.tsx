import type { Metadata } from "next";
import { seedsOfTomorrow as p } from "@/content/games/seeds-of-tomorrow";
import Section from "@/components/layout/Section";
import SectionHeading from "@/components/layout/SectionHeading";
import Breadcrumb from "@/components/layout/Breadcrumb";
import ProjectHero from "@/components/project/ProjectHero";
import Reveal from "@/components/layout/Reveal";
import SeedsAudio from "@/components/project/SeedsAudio";
import PlateGrid from "@/components/project/PlateGrid";
import SeedsLevelDesign from "@/components/project/SeedsLevelDesign";
import WeatherSystem from "@/components/project/WeatherSystem";
import ProjectNav from "@/components/layout/ProjectNav";
import ChapterNav from "@/components/layout/ChapterNav";
import {
  seedsChapters as ch,
  seedsChapterList,
} from "@/content/project-chapters";
import RampLink from "@/components/project/RampLink";
import { contributionHomes } from "@/content/seeds-levels";
import { projectNavItems } from "@/content/games";
import { beforeAfter, inMotionIntro, inMotionItems } from "@/content/seeds-in-motion";
import SideRays from "@/components/effects/SideRays";

export const metadata: Metadata = {
  title: `${p.title} | Álvaro Gómez`,
  description: p.systemsHook,
};

const GAP = { marginTop: "5rem" } as const;

const LEAD = {
  color: "var(--color-mist)",
  maxWidth: "35rem",
  marginTop: "1.5rem",
  marginBottom: "1.75rem",
} as const;

export default function SeedsOfTomorrowPage() {
  return (
    <>
      {/* Hero. */}
      <div className="sot-hero">
        <SideRays
          className="sot-hero-rays"

          origin="top-left"

          rayColor1="#E0A845"
          rayColor2="#5F9B6B"

          blend={0.4}
          spread={1.6}

          tilt={-13}
          saturation={2.8}

          falloff={1.5}
          speed={2.7}

          intensity={2.5}
          opacity={0.28}
        />
        <div className="sot-hero-content">
          <ProjectHero project={p} posterSrc="/images/seeds-of-tomorrow/poster.png" />
        </div>
      </div>

      <Section tight>
        <ChapterNav chapters={seedsChapterList} />

        {/* ═══ 01 · OVERVIEW ═══ */}
        <Reveal>
          <div
            id={ch.overview.id}
            style={{ maxWidth: "35rem", marginTop: "1.5rem" }}
          >
            <SectionHeading kicker="The Overview" title={ch.overview.title} />
            <p style={{ marginTop: "1rem" }}>{p.vision}</p>
          </div>
        </Reveal>

        {/* ═══ 02 · IN MOTION ═══ */}
        <Reveal>
          <div id={ch.inMotion.id} style={GAP}>
            <SectionHeading kicker={inMotionIntro.kicker} title={inMotionIntro.title} />

            <PlateGrid minWidth="26rem" aspect="1440 / 610" items={[...beforeAfter]} />

            <div style={{ marginTop: "2.5rem" }}>
              <PlateGrid minWidth="24rem" items={[...inMotionItems]} />
            </div>
          </div>
        </Reveal>

        {/* ═══ 03 · MY ROLE ═══ */}
        <Reveal>
          <div id={ch.role.id} style={GAP}>
            <SectionHeading kicker="My Role" title={ch.role.title} />
            <p className="mono" style={{ fontSize: "0.72rem", color: "var(--color-silver)", marginBottom: "1.5rem" }}>
              {p.facts.role} · {p.facts.team}
            </p>
            <ul className="sot-roles">
              {p.contributions.map((c) => {
                const home = contributionHomes[c.label];
                return (
                  <li key={c.label} className="sot-role">
                    <span className="mono sot-role-label">{c.label}</span>
                    {home ? (
                      <>
                        <p className="sot-role-shown">{home.shown}</p>
                        <a className="mono sot-role-link" href={home.href}>
                          {home.section} &darr;
                        </a>
                      </>
                    ) : (
                      <p className="sot-role-shown">{c.description}</p>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>

        {/* ═══ 04 · ORIGINAL SCORE ═══ */}
        <Reveal>
          <div id={ch.score.id} style={GAP}>
            <SectionHeading kicker="Original Music" title={ch.score.title} />
            <p style={LEAD}>
              I composed and recorded original tracks for the game. The main theme can be listened 
              to while exploring this page down below. The rest can be found in this section.
            </p>
            <SeedsAudio />

            <div style={{ marginTop: "2.5rem", maxWidth: "46rem" }}>
              <PlateGrid
                minWidth="100%"
                aspect="1600 / 1174"
                items={[
                  {
                    src: "/images/seeds-of-tomorrow/Seed.jpg",
                    label: "Key art",
                    alt: "Painted key art of a single glowing seed sprouting through cracked earth, roots running light into the ground and flowers opening around it.",
                    caption:
                      "Concept art of a planted seed.",
                  },
                ]}
              />
            </div>
          </div>
        </Reveal>

        {/* ═══ 05 · LEVEL DESIGN ═══ */}
        <Reveal>
          <div id={ch.levels.id} style={GAP}>
            <SectionHeading kicker="Level Design" title={ch.levels.title} />
            <p style={LEAD}>
              I co-designed the levels and the puzzles with members of the team. I designed the pace
              the gameplay runs.
            </p>
            <SeedsLevelDesign />

            <div style={{ marginTop: "3rem" }}>
              <PlateGrid
                minWidth="26rem"
                items={[
                  {
                    src: "/images/seeds-of-tomorrow/city-level.jpg",
                    label: "The Snow Level",
                    alt: "Overhead view of the ruined-town level, with the combat arenas marked out in red across the streets and around the wrecked buildings.",
                    caption:
                      "The fights are placed around the buildings that have to be cleared before the puzzle can be started.",
                  },
                  {
                    src: "/images/seeds-of-tomorrow/Gameplay_Screenshot_2.png",
                    label: "Fight in-game",
                    alt: "Top-down gameplay in the valley level: the player firing an energy beam at corrupted enemies, each with a health bar, with the red arena boundary curving across the ground.",
                    caption:
                      "The combat in the game. The origin of the pollution and the enemies appear on screen.",
                  },
                  {
                    src: "/images/seeds-of-tomorrow/Gameplay_Screenshot.png",
                    label: "The snow level",
                    alt: "The snow-town level in play: the player firing on a corrupted enemy in a street between wrecked houses, with a hazard bloom marking the contested ground.",
                    caption:
                      "The snow level in combat.",
                  },
                ]}
              />
            </div>
          </div>
        </Reveal>

        {/* ═══ 06 · THE HARD PART ═══ */}
        {p.designChallenge && (
          <Reveal>
            <div id={ch.weather.id} style={GAP}>
              <SectionHeading kicker="The Development" title={ch.weather.title} />
              <blockquote className="sot-quote">
                <p className="sot-quote-body">{p.designChallenge.quote}</p>
                <footer className="mono sot-quote-foot">
                  {p.designChallenge.system} · {p.designChallenge.engine}
                </footer>
              </blockquote>

              <WeatherSystem />

              <div style={{ marginTop: "3rem", maxWidth: "48rem" }}>
                <PlateGrid
                  minWidth="100%"
                  aspect="914 / 639"
                  items={[
                    {
                      src: "/images/seeds-of-tomorrow/dying-earth-sketch.jpg",
                      label: "Sketch",
                      alt: "Hand-drawn charcoal sketch of a poisoned Earth: cooling towers venting smoke, wrecked pylons, scattered oil drums, a ringed planet and a saucer in the sky.",
                      caption:
                        "Another concept art that represents the cover of the game.",
                    },
                  ]}
                />
              </div>
            </div>
          </Reveal>
        )}

        <Reveal>
          <div style={GAP}>
            <RampLink href="/">Back to all four projects</RampLink>
          </div>
        </Reveal>

        <Reveal>
          <ProjectNav items={projectNavItems} currentSlug={p.slug} />
        </Reveal>
      </Section>

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

        /* The design quote, absorbed into this section as its standfirst rather
           than sitting in its own bordered panel above the diagram. A rule and
           a measure, not a box: the diagram below is the framed thing, and two
           frames stacked read as two sections. */
        .sot-quote {
          margin: 1.5rem 0 2.5rem;
          padding-left: 1.25rem;
          border-left: 2px solid color-mix(in srgb, var(--color-silver) 55%, transparent);
          max-width: 44rem;
        }
        .sot-quote-body {
          margin: 0;
          font-size: 1.05rem;
          line-height: 1.65;
          color: var(--color-moonlight);
        }
        .sot-quote-foot {
          margin: 0.85rem 0 0;
          font-size: 0.7rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          /* --color-mist is 6.05:1 on this page's ground, clear of the AA bar
             for small type; the other three routes run tighter. */
          color: var(--color-mist);
        }

        .sot-roles {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
          gap: 1px;
          background: color-mix(in srgb, var(--color-mist) 34%, transparent);
          border: 1px solid color-mix(in srgb, var(--color-mist) 34%, transparent);
          border-radius: 12px;
          overflow: hidden;
        }
        .sot-role {
          background: var(--color-void);
          padding: 1rem 1.1rem 1.1rem;
          display: grid;
          gap: 0.4rem;
          align-content: start;
          min-width: 0;
        }
        .sot-role-label {
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          color: var(--color-moonlight);
        }
        .sot-role-shown {
          margin: 0;
          font-size: 0.82rem;
          line-height: 1.55;
          color: color-mix(in srgb, var(--color-mist) 55%, var(--color-moonlight));
        }
        .sot-role-link {
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          color: color-mix(in srgb, var(--color-silver) 72%, var(--color-moonlight));
          text-decoration: underline;
          text-underline-offset: 3px;
        }
      `}</style>
    </>
  );
}
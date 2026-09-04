import type { Metadata } from "next";
import { seedsOfTomorrow as p } from "@/content/games/seeds-of-tomorrow";
import Section from "@/components/layout/Section";
import SectionHeading from "@/components/layout/SectionHeading";
import ProjectHero from "@/components/project/ProjectHero";
import ChallengeQuote from "@/components/project/ChallengeQuote";
import Reveal from "@/components/layout/Reveal";
import SeedsAudio from "@/components/project/SeedsAudio";
import PlateGrid from "@/components/project/PlateGrid";
import LoopingVideo from "@/components/project/LoopingVideo";
import SeedsLevelDesign from "@/components/project/SeedsLevelDesign";
import WeatherSystem from "@/components/project/WeatherSystem";
import ProjectNav from "@/components/layout/ProjectNav";
import { contributionHomes } from "@/content/seeds-levels";
import { projectNavItems } from "@/content/games";
import SideRays from "@/components/effects/SideRays";

export const metadata: Metadata = {
  title: `${p.title} | Álvaro Gómez`,
  description: p.systemsHook,
};

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

      <Section>
        {/* Vision */}
        <Reveal>
          <div style={{ maxWidth: "35rem" }}>
            <SectionHeading kicker="01 · Overview" title="The Vision" />
            <p style={{ marginTop: "1rem" }}>{p.vision}</p>
          </div>
        </Reveal>

        {/* The premise, drawn by hand before any of it was built. It sets the
            ruined world every later section is measured against — and §04 is
            where the same ground comes back green. The file is named
            dying-earth-sketch because it is a sketch: the hero poster is a
            separate piece of art. */}
        <Reveal>
          <div style={{ marginTop: "2.5rem", maxWidth: "48rem" }}>
            <PlateGrid
              minWidth="100%"
              aspect="914 / 639"
              items={[
                {
                  src: "/images/seeds-of-tomorrow/dying-earth-sketch.jpg",
                  label: "Concept \u00b7 charcoal",
                  alt: "Hand-drawn charcoal sketch of a poisoned Earth: cooling towers venting smoke, wrecked pylons, scattered oil drums, a ringed planet and a saucer in the sky.",
                  caption:
                    "The premise before the project: cooling towers still venting, pylons down, drums in the dirt, and something watching from orbit. Everything the game asks the player to undo is in this drawing.",
                },
              ]}
            />
          </div>
        </Reveal>

        {/* The Music Score */}
        <Reveal>
          <div id="score" style={{ marginTop: "5rem", scrollMarginTop: "6rem" }}>
            <SectionHeading kicker="02 · Original Score" title="Plant a Sound" />
            <p style={{ color: "var(--color-mist)", maxWidth: "35rem", marginTop: "1.5rem", marginBottom: "1.5rem" }}>
              I composed and recorded eleven original tracks for the game. The main theme plays as you explore this page; the seeds below are moments from the score. Plant one to hear it.
            </p>
            <SeedsAudio />

            {/* The seeds in the component above are abstract UI. This gives
                the metaphor the section is named for a face. Painted key art,
                captioned as such so it cannot read as a screenshot. */}
            <div style={{ marginTop: "2.5rem", maxWidth: "46rem" }}>
              <PlateGrid
                minWidth="100%"
                aspect="1600 / 1174"
                items={[
                  {
                    src: "/images/seeds-of-tomorrow/Seed.jpg",
                    label: "Key art \u00b7 painted",
                    alt: "Painted key art of a single glowing seed sprouting through cracked earth, roots running light into the ground and flowers opening around it.",
                    caption:
                      "Key art, not a screenshot. One seed in dead ground, and the light running out from its roots \u2014 the image the score was written to.",
                  },
                ]}
              />
            </div>
          </div>
        </Reveal>

        {/* Level design — the credited "Level Designer" half of the role, which
            had no section until now: the pacing loop lived inside the weather
            component as its third band. It owns the loop; the weather section
            below owns what the sky does. See docs/section-ownership-map.md G1. */}
        <Reveal>
          <div id="level-design" style={{ marginTop: "5rem", scrollMarginTop: "6rem" }}>
            <SectionHeading kicker="03 · Level Design" title="Fight, Then Mend" />
            <p style={{ color: "var(--color-mist)", maxWidth: "35rem", marginTop: "1.5rem", marginBottom: "1.5rem" }}>
              I designed the levels and the puzzles, and the rhythm they run on. Every place in the
              game is paced the same way: a burst of tension, then the quieter work of putting it
              back — and the sky over it answering at the end.
            </p>
            <SeedsLevelDesign />

            {/* The two halves of the loop the section names: the place, laid
                out, and the fight that happens in it. Layout as a still,
                combat as a loop \u2014 a still of a fight shows a pose, not a
                rhythm. */}
            <div style={{ marginTop: "3rem" }}>
              <PlateGrid
                minWidth="26rem"
                items={[
                  {
                    src: "/images/seeds-of-tomorrow/city-level.jpg",
                    label: "The place \u00b7 in the Unity scene",
                    alt: "Overhead view of the ruined-town level, with the combat arenas marked out in red across the streets and around the wrecked buildings.",
                    caption:
                      "The ruined town from above, with its arenas marked in red. The fights are placed around the buildings that have to be cleared before the mending can start.",
                  },
                  {
                    src: "/images/seeds-of-tomorrow/Gameplay_Screenshot.png",
                    label: "A second level, in engine",
                    alt: "The snow-town level in play: the player firing on a corrupted enemy in a street between wrecked houses, with a hazard bloom marking the contested ground.",
                    caption:
                      "The same pacing rule in a different place. Snow town, built from the same kit and laid out the same way \u2014 a contested pocket to clear, then ground to put back.",
                  },
                  {
                    video: "/images/seeds-of-tomorrow/combat.mp4",
                    src: "",
                    label: "The fight",
                    alt: "Gameplay loop of combat in Seeds of Tomorrow: the player engaging corrupted enemies in one of the marked arenas.",
                    caption:
                      "The tension half of the loop, in motion \u2014 the burst the whole level is paced around.",
                  },
                  {
                    video: "/images/seeds-of-tomorrow/completed_level.mp4",
                    src: "",
                    label: "The mend",
                    alt: "A level reaching its completed state: the ground restored and the sky clearing once the last of the work is done.",
                    caption:
                      "And the other half. The quieter work that follows every fight, played through to the point where the place is finished \u2014 which is what the section title means literally.",
                  },
                ]}
              />
            </div>
          </div>
        </Reveal>

        {/* Weather System */}
        {p.designChallenge && (
          <Reveal>
            <div id="weather" style={{ marginTop: "5rem", scrollMarginTop: "6rem" }}>
              <SectionHeading kicker="04 · The Hard Part" title="A World That Heals" />
              <div style={{ marginTop: "1.5rem" }}>
                <ChallengeQuote challenge={p.designChallenge} />
              </div>
              {/* The claim, photographed. Same plot of ground, same camera,
                  same crop \u2014 only the player's work is different. This goes
                  ABOVE the weather component on purpose: the diptych is the
                  result, and WeatherSystem below is the mechanism that gets
                  there, so the reader meets the change before the machinery. */}
              <div style={{ marginTop: "2.5rem" }}>
                <PlateGrid
                  minWidth="26rem"
                  aspect="1440 / 610"
                  items={[
                    {
                      src: "/images/seeds-of-tomorrow/restoration-before.jpg",
                      label: "Before",
                      alt: "The valley level before restoration: bare sand, dead rock formations, wrecked vehicles and shipping containers along the road.",
                      caption:
                        "Before. Bare sand, dead rock, and the wreckage still where it fell.",
                    },
                    {
                      src: "/images/seeds-of-tomorrow/restoration-after.jpg",
                      label: "After",
                      alt: "The same valley after restoration, from the same camera position: the ground green and planted with autumn forest, the same road running through it.",
                      caption:
                        "After. The same ground, the same road, the same camera \u2014 photographed again once the player had finished with it.",
                    },
                  ]}
                />
              </div>

              {/* The diptych above is the change at the scale of a level.
                  This is the same change at the scale of a second, which is
                  the part a pair of stills structurally cannot show. */}
              <figure style={{ margin: "2.5rem 0 0", maxWidth: "52rem" }}>
                <LoopingVideo
                  src="/images/seeds-of-tomorrow/blossom.mp4"
                  label="Dead ground blossoming: vegetation spreading out from a planted seed and the colour returning to the terrain"
                />
                <figcaption
                  style={{
                    marginTop: "0.7rem",
                    fontSize: "0.9rem",
                    color: "var(--color-mist)",
                    lineHeight: 1.6,
                  }}
                >
                  The turn itself. The pair above is the before and after of a whole level; this is
                  the second in which it happens, spreading out from the point the player planted.
                </figcaption>
              </figure>

              {/* The sky as the progress readout: the mechanism behind the
                  change above. */}
              <div style={{ marginTop: "2.5rem" }}>
                <WeatherSystem />
              </div>
            </div>
          </Reveal>
        )}

        {/* My role. Every one of the four credited contributions now has a
            section that shows it, so this routes to the owner rather than
            restating it a second time — keys, not copy. A contribution with no
            entry in `contributionHomes` still prints its description, so adding
            one can never silently lose it. */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="05 · My Role" title="My Contribution" />
            <p className="mono" style={{ fontSize: "0.72rem", color: "var(--color-silver)", marginBottom: "1.5rem" }}>
              {p.facts.role} · {p.facts.team} · each one shown above, not just claimed
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
                          {home.section} &uarr;
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
        <Reveal>
          <ProjectNav items={projectNavItems} currentSlug={p.slug} />
        </Reveal>
      </Section>

      {/* Two layers: the rays and the hero on top. */}
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

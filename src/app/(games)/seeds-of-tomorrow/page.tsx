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
import RampLink from "@/components/project/RampLink";
import { contributionHomes } from "@/content/seeds-levels";
import { projectNavItems } from "@/content/games";
import { beforeAfter, inMotionIntro, inMotionItems } from "@/content/seeds-in-motion";
import SideRays from "@/components/effects/SideRays";

export const metadata: Metadata = {
  title: `${p.title} | Álvaro Gómez`,
  description: p.systemsHook,
};

/* ═══════════════════════════════════════════════════════════════════════════
   SEEDS OF TOMORROW · THE PAGE

   THE FOURTH AND LAST APPLICATION of the template Moon-Knight, Shattered Skies
   and Break-In carry. This page needed the least work of any of them — the
   reading-load audit called it "the cleanest-written page on the site" — so
   what changed is the shape, not the substance.

   TWO THINGS WERE WRONG WITH THE SHAPE.

     1. Two pieces of NON-GAME artwork stood between the reader and any evidence
        the game exists: a charcoal concept sketch under the overview, and a
        painted key-art seed under the score. A reader giving this page a minute
        met a drawing, a painting and eleven track titles before one frame of
        Unity. The sketch moved down to the weather section, where it is the
        premise that system exists to undo; the key art stayed with the score,
        which is what it was painted for, but now sits behind the footage.

     2. The before/after diptych — the strongest single argument on the page —
        sat at roughly 60% depth as an illustration of a system the reader had
        no reason yet to care about. It now leads §02, full width.

   NO SUBPAGE. Seeds is ~1,400 rendered words. Moon-Knight and Shattered Skies
   were split at 6,000 and 8,100. There is nothing here to move.

   ATTRIBUTION. A team of five. Álvaro composed the score and designed the
   levels, the puzzles and the weather. `weatherCredit` inside `WeatherSystem`
   is this page's canonical statement of that, and §03 · My Role routes to the
   section that shows each credited discipline rather than restating it.

   ONE IDEA, ONE OWNER. The idea this page repeats most — solve a place and its
   sky lets go — is stated canonically ONCE, in `rosterThesis` inside the
   weather roster. Everything else that used to restate it has been cut back to
   a pointer. See docs/section-ownership-map.md.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Shared spacing between top-level sections, so the rhythm is stated once. */
const GAP = { marginTop: "5rem" } as const;

/** The standfirst under a section heading. Same measure everywhere. */
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

      <Section>
        {/* The way back up. No subpage, so there is no trail to descend — but
            the homepage IS the project index, and the page needs an exit that
            is not the browser's back button. */}
        <Breadcrumb items={[{ label: "Projects", href: "/" }, { label: p.title }]} />

        {/* ═══ 01 · OVERVIEW ═══
            Prose only now. The charcoal sketch that used to sit under this
            moved to §06, where it is the premise the weather system undoes. */}
        <Reveal>
          <div style={{ maxWidth: "35rem", marginTop: "1.5rem" }}>
            <SectionHeading kicker="01 · Overview" title="The Vision" />
            <p style={{ marginTop: "1rem" }}>{p.vision}</p>
          </div>
        </Reveal>

        {/* ═══ 02 · IN MOTION ═══
            Proof before prose. The diptych runs at full width and on its own,
            above the clips, because it is a comparison: two frames of one plot
            of ground, and it only reads if they are big enough to compare. */}
        <Reveal>
          <div style={GAP}>
            <SectionHeading kicker={inMotionIntro.kicker} title={inMotionIntro.title} />
            <p style={LEAD}>{inMotionIntro.body}</p>

            <PlateGrid minWidth="26rem" aspect="1440 / 610" items={[...beforeAfter]} />

            <div style={{ marginTop: "2.5rem" }}>
              <PlateGrid minWidth="24rem" items={[...inMotionItems]} />
            </div>
          </div>
        </Reveal>

        {/* ═══ 03 · MY ROLE ═══
            Moved up from last, matching the other three pages: after the game,
            before the disciplines. Every credited contribution has a section
            that shows it, so this routes to the owner rather than restating it
            — keys, not copy. A contribution with no entry in
            `contributionHomes` still prints its description, so adding one can
            never silently lose it. */}
        <Reveal>
          <div style={GAP}>
            <SectionHeading kicker="03 · My Role" title="My Contribution" />
            <p className="mono" style={{ fontSize: "0.72rem", color: "var(--color-silver)", marginBottom: "1.5rem" }}>
              {p.facts.role} · {p.facts.team} · each one shown below, not just claimed
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
          <div id="score" style={{ ...GAP, scrollMarginTop: "6rem" }}>
            <SectionHeading kicker="04 · Original Score" title="Plant a Sound" />
            <p style={LEAD}>
              I composed and recorded eleven original tracks for the game. The main theme plays as
              you explore this page; the seeds below are moments from the score. Plant one to hear
              it.
            </p>
            <SeedsAudio />

            {/* The seeds in the component above are abstract UI. This gives the
                metaphor the section is named for a face. Painted key art,
                captioned as such so it cannot read as a screenshot. */}
            <div style={{ marginTop: "2.5rem", maxWidth: "46rem" }}>
              <PlateGrid
                minWidth="100%"
                aspect="1600 / 1174"
                items={[
                  {
                    src: "/images/seeds-of-tomorrow/Seed.jpg",
                    label: "Key art · painted",
                    alt: "Painted key art of a single glowing seed sprouting through cracked earth, roots running light into the ground and flowers opening around it.",
                    caption:
                      "Key art, not a screenshot. One seed in dead ground, and the light running out from its roots — the image the score was written to.",
                  },
                ]}
              />
            </div>
          </div>
        </Reveal>

        {/* ═══ 05 · LEVEL DESIGN ═══
            The credited "Level Designer" half of the role, which had no section
            until the G1 gap-fix: the pacing loop used to live inside the weather
            component as its third band. It owns the loop; §06 owns what the sky
            does. See docs/section-ownership-map.md G1. */}
        <Reveal>
          <div id="level-design" style={{ ...GAP, scrollMarginTop: "6rem" }}>
            <SectionHeading kicker="05 · Level Design" title="Fight, Then Mend" />
            <p style={LEAD}>
              I designed the levels and the puzzles, and the rhythm they run on. Every place in the
              game is paced the same way: a burst of tension, then the quieter work of putting it
              back.
            </p>
            <SeedsLevelDesign />

            {/* Where the arenas are drawn, and what one looks like from inside
                it. The clip of the fight itself is up in §02 — this is the
                layout evidence the clip cannot carry. */}
            <div style={{ marginTop: "3rem" }}>
              <PlateGrid
                minWidth="26rem"
                items={[
                  {
                    src: "/images/seeds-of-tomorrow/city-level.jpg",
                    label: "The place · in the Unity scene",
                    alt: "Overhead view of the ruined-town level, with the combat arenas marked out in red across the streets and around the wrecked buildings.",
                    caption:
                      "The ruined town from above, with its arenas marked in red. The fights are placed around the buildings that have to be cleared before the mending can start.",
                  },
                  {
                    src: "/images/seeds-of-tomorrow/Gameplay_Screenshot_2.png",
                    label: "An arena, from inside it",
                    alt: "Top-down gameplay in the valley level: the player firing an energy beam at corrupted enemies, each with a health bar, with the red arena boundary curving across the ground.",
                    caption:
                      "One of those red rectangles in play. The boundary is drawn on the ground during the fight, so the space the level designer marked out is the space the player is held inside.",
                  },
                  {
                    src: "/images/seeds-of-tomorrow/Gameplay_Screenshot.png",
                    label: "A second level, in engine",
                    alt: "The snow-town level in play: the player firing on a corrupted enemy in a street between wrecked houses, with a hazard bloom marking the contested ground.",
                    caption:
                      "The same pacing rule in a different place. Snow town, built from the same kit and laid out the same way — a contested pocket to clear, then ground to put back.",
                  },
                ]}
              />
            </div>
          </div>
        </Reveal>

        {/* ═══ 06 · THE HARD PART ═══
            THE MERGE. The design-challenge quote used to sit in its own bordered
            panel directly above this diagram, saying in prose exactly what the
            diagram says in picture — including the rejected HUD bar, which the
            diagram also draws struck through. They were one section pretending
            to be two. The quote is now the section's standfirst, in the author's
            voice, and the component that follows is the evidence for it.
            Ownership map, Absorb #10.

            The charcoal sketch closes the section rather than opening the page:
            it is the world the system exists to undo, and it belongs beside the
            machinery that undoes it. */}
        {p.designChallenge && (
          <Reveal>
            <div id="weather" style={{ ...GAP, scrollMarginTop: "6rem" }}>
              <SectionHeading kicker="06 · The Hard Part" title="A World That Heals" />
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
                      label: "Concept · charcoal",
                      alt: "Hand-drawn charcoal sketch of a poisoned Earth: cooling towers venting smoke, wrecked pylons, scattered oil drums, a ringed planet and a saucer in the sky.",
                      caption:
                        "The premise, drawn before any of it was built: cooling towers still venting, pylons down, drums in the dirt, and something watching from orbit. Everything the system above exists to undo is in this drawing.",
                    },
                  ]}
                />
              </div>
            </div>
          </Reveal>
        )}

        {/* The exits. Up to the index, and sideways to the other three
            projects. No CtaPanel: this project has no second half. */}
        <Reveal>
          <div style={GAP}>
            <RampLink href="/">Back to all four projects</RampLink>
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

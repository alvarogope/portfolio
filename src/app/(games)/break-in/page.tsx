import type { Metadata } from "next";
import { breakIn as p } from "@/content/games/break-in";
import Section from "@/components/layout/Section";
import SectionHeading from "@/components/layout/SectionHeading";
import Breadcrumb from "@/components/layout/Breadcrumb";
import ProjectHero from "@/components/project/ProjectHero";
import ChallengeQuote from "@/components/project/ChallengeQuote";
import Reveal from "@/components/layout/Reveal";
import ProjectNav from "@/components/layout/ProjectNav";
import ChapterNav from "@/components/layout/ChapterNav";
import {
  breakInChapters as ch,
  breakInChapterList,
} from "@/content/project-chapters";
import { projectNavItems } from "@/content/games";
import Prism from "@/components/effects/Prism";
import RoleTerms from "@/components/project/RoleTerms";
import RoleGraph from "@/components/project/RoleGraph";
import LevelFlow from "@/components/project/LevelFlow";
import PlateGrid from "@/components/project/PlateGrid";
import LoopingVideo from "@/components/project/LoopingVideo";
import HeistLoop from "@/components/project/HeistLoop";
import BalanceNote from "@/components/project/BalanceNote";
import DetectionStates from "@/components/project/DetectionStates";
import BreakInAudio from "@/components/project/BreakInAudio";
import RampLink from "@/components/project/RampLink";
import { inMotionIntro, inMotionItems } from "@/content/break-in-in-motion";

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

export default function BreakInPage() {
  return (
    <>
      {/* Hero */}
      <div className="bi-hero">
        <Prism
          className="bi-hero-prism"
          animationType="rotate"

          rotation={{ roll: Math.PI }}

          offset={{ y: 80 }}
          timeScale={0.35}
          hueShift={3.45}
          colorFrequency={1.0}
          saturation={1.5}
          glow={0.22}
          bloom={1}
          noise={0.03}
          scale={4.5}
          suspendWhenOffscreen
          opacity={1}
        />
        <div className="bi-hero-content">
          <ProjectHero project={p} posterSrc="/images/break-in/poster.png" />
        </div>
      </div>

      <Section tight>
        <Breadcrumb items={[{ label: "Projects", href: "/" }, { label: p.title }]} />

        <ChapterNav chapters={breakInChapterList} />

        {/* ═══ 01 · OVERVIEW ═══ */}
        <Reveal>
          <div
            id={ch.overview.id}
            style={{ maxWidth: "35rem", marginTop: "1.5rem" }}
          >
            <SectionHeading kicker="The Overview" title={ch.overview.title} />
            <p style={{ marginTop: "1rem" }}>
              <RoleTerms text={p.vision} />
            </p>
          </div>
        </Reveal>

        {/* ═══ 02 · IN MOTION ═══ */}
        <Reveal>
          <div id={ch.inMotion.id} style={GAP}>
            <SectionHeading kicker={inMotionIntro.kicker} title={inMotionIntro.title} />
            <p style={LEAD}>{inMotionIntro.body}</p>
            <PlateGrid minWidth="24rem" items={[...inMotionItems]} />
          </div>
        </Reveal>

        {/* ═══ 03 · MY ROLE ═══ */}
        <Reveal>
          <div id={ch.role.id} style={GAP}>
            <SectionHeading kicker="My Role" title={ch.role.title} />
            <div style={{ display: "grid", gap: "1.25rem", marginTop: "1.5rem" }}>
              {p.contributions.map((c) => (
                <div key={c.label}>
                  <span className="mono" style={{ fontSize: "0.75rem", color: "var(--color-silver)" }}>
                    {c.label}
                  </span>
                  <p style={{ marginTop: "0.4rem", maxWidth: "35rem" }}>
                    <RoleTerms text={c.description} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>


        {/* ═══ 04 · THE RUN ═══ */}
        <Reveal>
          <div id={ch.theRun.id} style={GAP}>
            <SectionHeading kicker="The Gameplay Design" title={ch.theRun.title} />
            <p style={LEAD}>
              <RoleTerms text="One gameplay run is eight minutes long and divided into four phases: get in, open the vault, access the servers and get out. Two of these phases happen at the same time." />
            </p>
            <HeistLoop />
          </div>
        </Reveal>


        {/* ═══ 05 · SIGNATURE SYSTEMS ═══ */}
        <Reveal>
          <div id={ch.systems.id} style={GAP}>
            <SectionHeading kicker="Main Systems" title={ch.systems.title} />
            <p style={LEAD}>
              <RoleTerms text=  "Every element of the gameplay was designed so players had to cooperate and help each other succeed. The Distraction clip shows how these work in-game." />
            </p>
            <RoleGraph />
          </div>
        </Reveal>

        {/* ═══ 06 · LEVEL DESIGN ═══ */}
        <Reveal>
          <div id={ch.levels.id} style={GAP}>
            <SectionHeading kicker="Level Design" title={ch.levels.title} />
            <p style={LEAD}>
              <RoleTerms text="The bank is one level divided into two places where the team has to split up so they could operate." />
            </p>
            <LevelFlow />

            <div style={{ marginTop: "3rem" }}>
              <h3
                className="mono"
                style={{
                  fontSize: "0.72rem",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--color-silver)",
                  margin: "0 0 0.75rem",
                }}
              >
                The level evolution
              </h3>
              <p
                style={{
                  color: "var(--color-mist)",
                  maxWidth: "35rem",
                  marginTop: 0,
                  marginBottom: "1.75rem",
                }}
              >
                The bank layout. Firstly, it was sketched on paper by me and the level designer, focused
                on the two floors. We had to think where the players had to operate and always give them 
                a solution to a potential problem depending on where they were in the map.
              </p>
              <PlateGrid
                minWidth="29rem"
                items={[
                  {
                    src: "/images/break-in/basement-plan-sketch.jpeg",
                    label: "Phase 1 · Basement sketch",
                    alt: "Hand-drawn pen sketch of the bank basement, marking the security walk path, the laser trap, the digital-money loot room, the changing room and the hideout.",
                    caption:
                      "The security walk path along the top, the laser trap on the left, and the changing room for the Insider's disguise.",
                  },
                  {
                    src: "/images/break-in/Basement_plan.png",
                    label: "Phase 2 · Basement plan",
                    alt: "Clean floor plan of the bank basement: laser trap, security walk path, digital money room, hideout, changing room for disguises, vault, and the basement entrance.",
                    caption:
                      "The clean version of the sketch. Lasers placed and the final position of the vault.",
                  },
                  {
                    src: "/images/break-in/ground-floor-plan.png",
                    label: "Phase 3 · Ground floor plan",
                    alt: "Clean floor plan of the bank ground floor: entry and waiting areas, reception desk, ATMs, manager's cabin, meeting room, back office, store room, server and security room, hideout spot, security gate, and the stairs to the basement.",
                    caption:
                      "The ground floor plan. The server room that the Insider has to reach and the hideout spot.",
                  },

                  {
                    src: "/images/break-in/ground-floor-blockout-cameras.jpeg",
                    label: "Phase 4 · Cameras placement",
                    alt: "Early block-out diagram of the bank ground floor: the stairs outlined in red, a hideout in blue, a cash area in green, the reception desk, and three purple triangles marking camera positions against a printed key reading Cameras.",
                    caption:
                      "The placement of where the cameras should eventually go. Every triangle is a camera. Their placement was intentional and especially related to what we wanted to allow The Hacker to see, so as not to give them too much power.",
                  },
                  {
                    src: "/images/break-in/ground-floor-greybox.jpeg",
                    label: "Phase 5 · The game ground floor",
                    alt: "Cut-away view of the built bank ground floor from above: the lobby with its ATMs and seating, reception, the back offices and the store room, matching the ground-floor plan.",
                    caption:
                      "The ground floor: the lobby, the back offices, the store room. Standing it up early is what let us test the patrol timings before anything else was built.",
                  },
                  {
                    src: "/images/break-in/basement-greybox.jpeg",
                    label: "Phase 6 · The game basement",
                    alt: "Cut-away view of the built bank basement from above with the laser grid switched on, showing the stairs down and the rooms from the basement plan.",
                    caption:
                      "The basement, with the lasers in the game and the rest of the rooms.",
                  },
                  {
                    src: "/images/break-in/Vault.png",
                    label: "Phase 7 · The vault",
                    alt: "The vault door in the built basement, the object the Vaultsnatcher's role is built around.",
                    caption:
                      "The vault door.",
                  },
                  {
                    src: "/images/break-in/Digital_Money_Room.png",
                    label: "Phase 8 · The server room",
                    alt: "The digital-money room in the built basement: banks of monitors on desks around three walls, a lit server rack on a plinth in the centre, and the door out.",
                    caption:
                      "Where the Insider has to place the USB.",
                  },
                ]}
              />
            </div>
          </div>
        </Reveal>

        {/* ═══ 07 · STEALTH ═══*/}
        <Reveal>
          <div id={ch.stealth.id} style={GAP}>
            <SectionHeading kicker="Stealth" title={ch.stealth.title} />
            <p style={LEAD}>
              <RoleTerms text="From the moment an enemy starts investigating, the player knows. These are the ways I decided to communicate it." />
            </p>
            <DetectionStates />

            <figure style={{ margin: "2.5rem 0 0", maxWidth: "54rem" }}>
              <LoopingVideo
                src="/images/break-in/hacker_vision.mp4"
                label="Hacker Vision highlighting enemies through walls, the shared danger sense that replaces voice chat"
              />
              <figcaption
                style={{
                  marginTop: "0.7rem",
                  fontSize: "0.9rem",
                  color: "var(--color-mist)",
                  lineHeight: 1.6,
                }}
              >
                Hacker Vision: Five seconds of seeing enemies through walls.
              </figcaption>
            </figure>
          </div>
        </Reveal>

        {/* ═══ 08 · AUDIO ═══ */}
        <Reveal>
          <div id={ch.audio.id} style={GAP}>
            <SectionHeading kicker="Audio Design" title={ch.audio.title} />
            <BreakInAudio />
          </div>
        </Reveal>

        {/* ═══ 09 · BALANCE ═══ */}
        <Reveal>
          <div id={ch.balance.id} style={GAP}>
            <SectionHeading kicker="Balancing the Game" title={ch.balance.title} />
            <BalanceNote />
          </div>
        </Reveal>

        {/* ═══ 10 · THE HARD PART ═══ */}
        {p.designChallenge && (
          <Reveal>
            <div id={ch.challenge.id} style={GAP}>
              <SectionHeading kicker="Design Challenges" title={ch.challenge.title} />
              <div style={{ marginTop: "1.5rem" }}>
                <ChallengeQuote
                  challenge={p.designChallenge}
                  renderProse={(text) => <RoleTerms text={text} />}
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

      {/* Two layers */}
      <style>{`
        /* Role cross-references in prose. Colour only — no background, no
           box — so it reads as a linked term rather than a highlighter pen.
           #E5B54D on this page's #0A0B0D is 10.36:1, on .panel 9.35:1. The
           glow is a whisper of the same amber the role cards use on hover. */
        .role-term {
          color: var(--color-silver);
          font-weight: 500;
          text-shadow: 0 0 12px color-mix(in srgb, var(--color-silver) 22%, transparent);
        }
        .bi-hero {
          position: relative;
          isolation: isolate;
          overflow: hidden;
        }
        /* No mask. Earlier versions clipped the prism into a thin band to
           protect text contrast, and that is precisely what stopped it
           reading as a 3D form -- all that survived was a flat glow. The
           reference is the whole shape, so the whole shape is drawn.
           See the contrast note on .bi-hero-content. */
        .bi-hero-prism {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }
        /* ------------------------------------------------------------
           CONTRAST, stated plainly rather than engineered around.

           --color-mist (#767B84) sits at 4.63:1 on bare --color-void
           against a 4.5 bar, so the background may reach 1.46x the page
           and no further. The reference prism is far brighter than that
           wherever it crosses the text column: measured worst case behind
           the copy is #8eb9e5, about 138x the page, which takes mist to
           roughly 2.1:1 and the h1 to 1.1:1. The hero does NOT meet AA
           over the prism.

           Every alternative was measured and each one costs the reference
           silhouette: capping the whole hero at 1.46x peaks 4/255 above
           the page and is invisible; masking it into a band leaves a flat
           glow; pushing it below the content (offsetY -420) drops the
           bright base out of frame and reads as two separate beams.

           The bottom band below keeps the base edge clear of the copy,
           which is the most that can be done without losing the form.
           The real fix is the palette: --color-mist is the tightest of
           the four game routes (Moon-Knight 5.24:1, Seeds 6.05, Shattered
           Skies 4.90, here 4.63). Lifting it toward #9AA0AA would buy the
           headroom this hero needs.
           ------------------------------------------------------------ */
        .bi-hero-content {
          position: relative;
          z-index: 1;
          /* Room under the copy so the bright base edge lands in clear
             space rather than through the fact block. */
        }
      `}</style>
    </>
  );
}

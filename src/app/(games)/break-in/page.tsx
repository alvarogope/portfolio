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
              <RoleTerms text="One gameplay run is eight minutes long and divided in four phases: get in, open the vault, access the servers and get out. Two of these phases happen at the same time." />
            </p>
            <HeistLoop />
          </div>
        </Reveal>


        {/* ═══ 05 · SIGNATURE SYSTEMS ═══ */}
        <Reveal>
          <div id={ch.systems.id} style={GAP}>
            <SectionHeading kicker="05 · Signature Systems" title={ch.systems.title} />
            <p style={LEAD}>
              <RoleTerms text="Those are the traps one role takes off another's board, and a teammate you need for the laser you cannot see is as load-bearing as one who hands you a key. Cut any one wire and the run ends. The Distraction clip at the top of the page is one of them firing." />
            </p>
            <RoleGraph />
          </div>
        </Reveal>

        {/* ═══ 06 · LEVEL DESIGN ═══ */}
        <Reveal>
          <div id={ch.levels.id} style={GAP}>
            <SectionHeading kicker="06 · Level Design" title={ch.levels.title} />
            <p style={LEAD}>
              <RoleTerms text="The phase clock above was the run in time. This is the same run in space: the bank is one level with two places the team has to split up and two places it has to be back together." />
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
                From sketch to built
              </h3>
              <p
                style={{
                  color: "var(--color-mist)",
                  maxWidth: "35rem",
                  marginTop: 0,
                  marginBottom: "1.75rem",
                }}
              >
                The bank as it was actually designed, in the order it happened: sketched on paper
                with the team&rsquo;s level designer, cleaned up into two floors in one plan
                language, blocked out while the rooms were still being argued about, then built and
                dressed in Unity. I led the design and co-authored the layout; the build was the
                team&rsquo;s.
              </p>
              <PlateGrid
                minWidth="29rem"
                items={[
                  {
                    src: "/images/break-in/basement-plan-sketch.jpeg",
                    label: "01 · Sketch — basement",
                    alt: "Hand-drawn pen sketch of the bank basement, marking the security walk path, the laser trap, the digital-money loot room, the changing room and the hideout.",
                    caption:
                      "The first pass, on paper. The security walk path along the top, the laser trap on the left, and the changing room already labelled for the Insider's disguise.",
                  },
                  {
                    src: "/images/break-in/Basement_plan.png",
                    label: "02 · Plan — basement",
                    alt: "Clean floor plan of the bank basement: laser trap, security walk path, digital money room, hideout, changing room for disguises, vault, and the basement entrance.",
                    caption:
                      "The same drawing, cleaned up. This is the floor where the team splits: the Lockpicker takes the lasers, the Vaultsnatcher takes the vault, and neither can start without the other.",
                  },
                  {
                    src: "/images/break-in/ground-floor-plan.png",
                    label: "03 · Plan — ground floor",
                    alt: "Clean floor plan of the bank ground floor: entry and waiting areas, reception desk, ATMs, manager's cabin, meeting room, back office, store room, server and security room, hideout spot, security gate, and the stairs to the basement.",
                    caption:
                      "The starting floor, in the same language. The server room the Insider has to reach and the hideout spot the run keeps returning to are both named here.",
                  },
                  {
                    src: "/images/break-in/basement-blockout.jpeg",
                    label: "04 · Block-out — basement",
                    alt: "Early block-out diagram of the bank basement drawn as flat rectangles: a management area, a PC area labelled as the hack point, and the vault, with one edge marked in red and a small room outlined in blue.",
                    caption:
                      "The basement while the rooms were still being argued about. The vault is already fixed, but the loot room is a generic “PC area” rather than the digital-money room it became, and the changing room does not exist yet.",
                  },
                  {
                    src: "/images/break-in/ground-floor-blockout-cameras.jpeg",
                    label: "05 · Block-out — ground floor, cameras marked",
                    alt: "Early block-out diagram of the bank ground floor: the stairs outlined in red, a hideout in blue, a cash area in green, the reception desk, and three purple triangles marking camera positions against a printed key reading Cameras.",
                    caption:
                      "The same pass on the ground floor, and the only sheet anywhere that places the cameras — the three purple triangles, against a printed key. Deciding where they point is what makes the Hacker a role rather than a helper: the CCTV coverage drawn here is the whole of what that seat can see.",
                  },
                  {
                    src: "/images/break-in/ground-floor-greybox.jpeg",
                    label: "06 · Built — ground floor",
                    alt: "Cut-away view of the built bank ground floor from above: the lobby with its ATMs and seating, reception, the back offices and the store room, matching the ground-floor plan.",
                    caption:
                      "The ground floor, room for room against the plan above — the lobby, the back offices, the store room. Standing it up early is what let us walk patrol timings before anything was final.",
                  },
                  {
                    src: "/images/break-in/basement-greybox.jpeg",
                    label: "07 · Built — basement",
                    alt: "Cut-away view of the built bank basement from above with the laser grid switched on, showing the stairs down and the rooms from the basement plan.",
                    caption:
                      "The basement, with the lasers live. The trap that is arrows on paper at the top of this band is a real volume here, which is where its timing got tuned.",
                  },
                  {
                    src: "/images/break-in/Vault.png",
                    label: "08 · Built — the vault",
                    alt: "The vault door in the built basement, the object the Vaultsnatcher's role is built around.",
                    caption:
                      "The vault door. The one object the Vaultsnatcher's whole role turns on, and the reason the decoy-swap timer is measured in single seconds.",
                  },
                  {
                    src: "/images/break-in/Digital_Money_Room.png",
                    label: "09 · Built — digital money",
                    alt: "The digital-money room in the built basement: banks of monitors on desks around three walls, a lit server rack on a plinth in the centre, and the door out.",
                    caption:
                      "The digital-money room. These are the hidden PCs the Lockpicker strips, one room away from the vault the Vaultsnatcher is working.",
                  },
                ]}
              />
            </div>
          </div>
        </Reveal>

        {/* ═══ 07 · STEALTH ═══*/}
        <Reveal>
          <div id={ch.stealth.id} style={GAP}>
            <SectionHeading kicker="07 · Stealth" title={ch.stealth.title} />
            <p style={LEAD}>
              <RoleTerms text="the design is in how loudly it announces itself. From the moment an enemy starts investigating, the player is being told three separate ways at once." />
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
                Hacker Vision. Five seconds of seeing enemies through walls, then thirty of not.
              </figcaption>
            </figure>
          </div>
        </Reveal>

        {/* ═══ 08 · AUDIO ═══ */}
        <Reveal>
          <div id={ch.audio.id} style={GAP}>
            <SectionHeading kicker="08 · Audio" title={ch.audio.title} />
            <BreakInAudio />
          </div>
        </Reveal>

        {/* ═══ 09 · BALANCE ═══ */}
        <Reveal>
          <div id={ch.balance.id} style={GAP}>
            <SectionHeading kicker="09 · Balance" title={ch.balance.title} />
            <BalanceNote />
          </div>
        </Reveal>

        {/* ═══ 10 · THE HARD PART ═══ */}
        {p.designChallenge && (
          <Reveal>
            <div id={ch.challenge.id} style={GAP}>
              <SectionHeading kicker="10 · The Hard Part" title={ch.challenge.title} />
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

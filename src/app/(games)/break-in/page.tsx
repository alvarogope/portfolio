import type { Metadata } from "next";
import { breakIn as p } from "@/content/games/break-in";
import Section from "@/components/layout/Section";
import SectionHeading from "@/components/layout/SectionHeading";
import ProjectHero from "@/components/project/ProjectHero";
import ChallengeQuote from "@/components/project/ChallengeQuote";
import Reveal from "@/components/layout/Reveal";
import ProjectNav from "@/components/layout/ProjectNav";
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

export const metadata: Metadata = {
  title: `${p.title} | Álvaro Gómez`,
  description: p.systemsHook,
};

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

      <Section>
        {/* Vision */}
        <Reveal>
          <div style={{ maxWidth: "35rem" }}>
            <SectionHeading kicker="01 · Overview" title="The Vision" />
            <p style={{ marginTop: "1rem" }}>
              <RoleTerms text={p.vision} />
            </p>
          </div>
        </Reveal>

        {/* The run itself — four phases on an eight-minute clock, and how it ends.
            Deliberately placed BEFORE the role graph and the floor plan: both of
            those assume the reader already knows what a run is trying to do. */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="02 · The Run" title="Eight minutes, four phases" />
            <p style={{ color: "var(--color-mist)", maxWidth: "35rem", marginTop: "1.5rem", marginBottom: "1.75rem" }}>
              <RoleTerms text="One run is eight minutes long and reads in four phases: get in, take the vault, take the servers, and get out separately. Two of those phases happen at the same time. Below is the run drawn on its own clock — where the pressure sits, what each player is doing in each window, and the two ways it ends." />
            </p>
            <HeistLoop />
          </div>
        </Reveal>

        {/* Nobody wins alone — the dependency web */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="03 · Signature Systems" title="Nobody wins alone" />
            <p style={{ color: "var(--color-mist)", maxWidth: "35rem", marginTop: "1.5rem", marginBottom: "1.75rem" }}>
              <RoleTerms text="Four cameras, four roles, and nine dependencies wired between them — and they are two webs, not one. Six lines are what a player switches on for a teammate: an ability turned on, a window opened, patrol positions handed over. Three are counter-lines, and they run the other way round: they are the traps one role takes off another's board, because a teammate you need for the laser you cannot see is as load-bearing as one who hands you a key. Cut any one wire and the run ends." />
            </p>
            <RoleGraph />

            {/* One wire in the graph above, firing. The Hacker overloads the
                lights and a guard leaves a route a teammate needs — the whole
                dependency argument in a few seconds. */}
            <figure style={{ margin: "2.5rem 0 0", maxWidth: "54rem" }}>
              <LoopingVideo
                src="/images/break-in/distraction_test.mp4"
                label="The Hacker's Distraction ability overloading the lights and pulling a patrolling guard off his route"
              />
              <figcaption
                style={{
                  marginTop: "0.7rem",
                  fontSize: "0.9rem",
                  color: "var(--color-mist)",
                  lineHeight: 1.6,
                }}
              >
                Distraction, in play. One of the nine wires above: the Hacker overloads the lights,
                the guard leaves his route, and a teammate who could not ask for it gets a window.
              </figcaption>
            </figure>
          </div>
        </Reveal>

        {/* There is no second role section. "Four Roles, One Web" used to sit
            here, four cards of brief/tools/depends-on/needed-by, and every fact
            in it was already in the graph above — with the dependencies drawn
            as wires rather than restated as prose. The two things it did have
            of its own were both wrong: it credited the Vaultsnatcher with the
            server-room USB, which is the Insider's, and it had the Hacker
            depending on the Vaultsnatcher for the basement cameras. Deleting it
            is what settled the contradiction. The p.roles data still feeds RoleTerms,
            which lights the four names wherever they appear in prose. */}

        {/* Level design — the route and the pacing */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="04 · Level Design" title="The Route" />
            <p style={{ color: "var(--color-mist)", maxWidth: "35rem", marginTop: "1.5rem", marginBottom: "1.75rem" }}>
              <RoleTerms text="The phase clock above was the run in time. This is the same run in space: the bank is one level with two places the team has to split up and two places it has to be back together. Below: the route through it, the tension curve the five stages are tuned to, and what each stage is actually made of. The quiet stage in the middle is deliberate — it is what the vault is measured against." />
            </p>
            <LevelFlow />

            {/* Sketch, plan, greybox, built — in that order, because that is
                the order it happened in and each step is evidence for the one
                before it. The level was co-designed: the layout was sketched
                with the team's level designer and the greybox is theirs.
                PlateGrid fits every plate whole and opens it full size, which
                a floor plan needs and a crop would ruin. */}
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
                From sketch to greybox
              </h3>
              <p
                style={{
                  color: "var(--color-mist)",
                  maxWidth: "35rem",
                  marginTop: 0,
                  marginBottom: "1.75rem",
                }}
              >
                The bank as it was actually designed: sketched on paper with the team&rsquo;s level
                designer, drawn up as two floors in one language, then greyboxed in Unity. I led the
                design and co-authored the layout; the build was the team&rsquo;s.
              </p>
              <PlateGrid
                minWidth="29rem"
                items={[
                  {
                    src: "/images/break-in/basement-plan-sketch.jpeg",
                    label: "01 \u00b7 Sketch",
                    alt: "Hand-drawn pen sketch of the bank basement, marking the security walk path, the laser trap, the digital-money loot room, the changing room and the hideout.",
                    caption:
                      "The first pass, on paper. The security walk path along the top, the laser trap on the left, and the changing room already labelled for the Insider's disguise.",
                  },
                  {
                    src: "/images/break-in/Basement_plan.png",
                    label: "02 \u00b7 Plan \u2014 basement",
                    alt: "Clean floor plan of the bank basement: laser trap, security walk path, digital money room, hideout, changing room for disguises, vault, and the basement entrance.",
                    caption:
                      "The same drawing, cleaned up. This is the floor where the team splits: the Lockpicker takes the lasers, the Vaultsnatcher takes the vault, and neither can start without the other.",
                  },
                  {
                    src: "/images/break-in/ground-floor-plan.png",
                    label: "03 \u00b7 Plan \u2014 ground floor",
                    alt: "Clean floor plan of the bank ground floor: entry and waiting areas, reception desk, ATMs, manager's cabin, meeting room, back office, store room, server and security room, hideout spot, security gate, and the stairs to the basement.",
                    caption:
                      "The starting floor, in the same language. The server room the Insider has to reach and the hideout spot the run keeps returning to are both named here.",
                  },
                  {
                    src: "/images/break-in/ground-floor-greybox.jpeg",
                    label: "04 \u00b7 Greybox \u2014 ground floor",
                    alt: "Unity greybox of the bank ground floor seen from above: lobby with ATMs and seating, reception, back offices and the store room, matching the ground-floor plan.",
                    caption:
                      "The ground floor built. Room for room against the plan above \u2014 the lobby, the back offices, the store room \u2014 which is what let us walk patrol timings before anything was textured.",
                  },
                  {
                    src: "/images/break-in/basement-greybox.jpeg",
                    label: "05 \u00b7 Greybox \u2014 basement",
                    alt: "Unity greybox cut-away of the bank basement with the laser grid switched on, showing the stairs down and the rooms from the basement plan.",
                    caption:
                      "The basement built, with the lasers live. The trap that is arrows on paper two plates up is a real volume here, which is where its timing got tuned.",
                  },
                  {
                    src: "/images/break-in/Vault.png",
                    label: "06 \u00b7 Built",
                    alt: "The vault door in the greyboxed basement, the object the Vaultsnatcher's role is built around.",
                    caption:
                      "The vault door. The one object the Vaultsnatcher's whole role turns on, and the reason the decoy-swap timer is measured in single seconds.",
                  },
                ]}
              />
            </div>
          </div>
        </Reveal>

        {/* Detection — the stealth state machine. Sits right after the level,
            because the route above is the thing this machine is watching. */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="05 · Stealth" title="Being Seen" />
            <p style={{ color: "var(--color-mist)", maxWidth: "35rem", marginTop: "1.5rem", marginBottom: "1.75rem" }}>
              <RoleTerms text="Detection is four states and four transitions, and the design is in how loudly it announces itself. From the moment an enemy starts investigating, the player is being told three separate ways at once — a rising white-noise crescendo, an eye on the HUD, and a bar filling above the enemy's head. With no voice channel, nobody can warn you but the game." />
            </p>
            <DetectionStates />

            {/* The section's claim — "nobody can warn you but the game" — is
                a five-second ability on a thirty-second cooldown. A still
                cannot show a duration. */}
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
                Hacker Vision. Five seconds of seeing enemies through walls, then thirty of not
                &mdash; the shared danger sense that had to exist once the voice channel did not.
              </figcaption>
            </figure>
          </div>
        </Reveal>

        {/* Audio direction — placed straight after the detection machine
            because the two share a channel: the crescendo that resolves into
            the chase theme is designed up there as one of three feedback
            channels, and this section is the rest of what audio is doing on a
            page whose whole premise is that nobody can talk. Direction credit,
            so it is sized as one console rather than a pillar. */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="06 · Audio" title="What the heist sounds like" />
            <p style={{ color: "var(--color-mist)", maxWidth: "35rem", marginTop: "1.5rem", marginBottom: "1.75rem" }}>
              <RoleTerms text="Take away the voice channel and a four-player stealth game has no way to pass information. I put it in the audio: a score wired to the state of the run, a clock you hear rather than check, and an action set where every move announces itself loudly enough to be read from another room." />
            </p>
            <BreakInAudio />
          </div>
        </Reveal>

        {/* The balancing philosophy — the design note under all of it */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="07 · Balance" title="Tuned so nobody can carry" />
            <p style={{ color: "var(--color-mist)", maxWidth: "35rem", marginTop: "1.5rem", marginBottom: "1.75rem" }}>
              <RoleTerms text="Four asymmetric roles only stay interesting if all four stay necessary. Three rules held that line: no role can reach past its quarter of the run, difficulty answers the team's performance instead of sitting still, and the payout is shared before it is individual." />
            </p>
            <BalanceNote />
          </div>
        </Reveal>

        {/* Design Challenge */}
        {p.designChallenge && (
          <Reveal>
            <div style={{ marginTop: "5rem" }}>
              <SectionHeading kicker="08 · The Hard Part" title="Design Challenge" />
              <div style={{ marginTop: "1.5rem" }}>
                <ChallengeQuote
                  challenge={p.designChallenge}
                  renderProse={(text) => <RoleTerms text={text} />}
                />
              </div>
            </div>
          </Reveal>
        )}

        {/* Contributions */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="09 · My Role" title="My Contribution" />
            <div style={{ display: "grid", gap: "1.5rem" }}>
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

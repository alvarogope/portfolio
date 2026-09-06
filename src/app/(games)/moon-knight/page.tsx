import type { Metadata } from "next";
import { moonKnight as p } from "@/content/games/moon-knight";
import Section from "@/components/layout/Section";
import ProjectHero from "@/components/project/ProjectHero";
import SectionHeading from "@/components/layout/SectionHeading";
import PlateGrid from "@/components/project/PlateGrid";
import LoopingVideo from "@/components/project/LoopingVideo";
import EngineeringNote from "@/components/project/EngineeringNote";
import ChallengeQuote from "@/components/project/ChallengeQuote";
import Reveal from "@/components/layout/Reveal";
import ProjectNav from "@/components/layout/ProjectNav";
import { projectNavItems } from "@/content/games";
import Aurora from "@/components/effects/Aurora";
import MoonKnightAudio from "@/components/project/MoonKnightAudio";
import Bestiary from "@/components/project/Bestiary";
import WorldMap from "@/components/project/WorldMap";
import DiegeticDesign from "@/components/project/DiegeticDesign";
import ControllerMap from "@/components/project/ControllerMap";
import ArtDirection from "@/components/project/ArtDirection";
import AudioDesign from "@/components/project/AudioDesign";
import BeatChart from "@/components/project/BeatChart";
import QuantumSigil from "@/components/project/QuantumSigil";
import RampLink from "@/components/project/RampLink";
import CtaPanel from "@/components/project/CtaPanel";
import { inMotionClips, inMotionIntro } from "@/content/moon-knight-in-motion";
// Counted, never typed: the overview scoreboard derives every figure it
// prints, so a new level or ability updates the summary by existing.
import { beatLevels } from "@/content/moon-knight-levels";
import { bestiaryBosses, bestiaryEnemies } from "@/content/moon-knight-bestiary";
import { narrativeActs } from "@/content/moon-knight-narrative";
import { deepDiveHref, deepDivePath } from "@/content/moon-knight-deep-dive";

export const metadata: Metadata = {
  title: `${p.title} | Álvaro Gómez Pérez`,
  description: p.systemsHook,
};

/* ════════════════════════════════════════════════════════════════════════════
   THIS PAGE WAS CONDENSED, THEN RE-ORDERED, AND HERE ARE THE TWO RULES IT
   NOW FOLLOWS.

   1 · SPLIT BY KIND, NOT TRIMMED BY TASTE. The page ran to ~7,650 rendered
   words across seventeen blocks. The material was not filler; the SHAPE was
   wrong for the first reader it has to survive. So:

     · BUILT WORK STAYS. The game running, the quantum systems, the creatures,
       the controls, the world, the beat chart and the honest negative result.
     · CRAFT DEPTH AND DIVERSIONS MOVED, whole, to `/moon-knight/world`: the
       story, the cast, the symbolism, the jousting minigame, and the full
       arguments behind the diegetic, art and audio sections. Nothing was
       deleted. Nothing was summarised.

   THREE SECTIONS ARE "SPLIT" RATHER THAN MOVED — diegetic design, art
   direction, the score. Each renders here in a `short` variant that shows
   FEWER FIELDS OF THE OWNER'S OWN DATA and then ramps to the full section.
   None of them types a summary: a hand-written short version is a second copy,
   and second copies drift.

   2 · THE GAME COMES FIRST, LITERALLY. The page used to open on a standfirst
   quoting the diegetic thesis — so a recruiter's first impression of a game
   project was an abstract argument about interface — and then spend two
   sections on vision and role before showing anything running. The order is
   now: one line of standfirst, the game in motion, the signature system, and
   only then what it is for and who built it. Evidence before claim.

   NOTHING IS DESCRIBED TWICE. §02 renders the abilities as ONE figure — the
   design document's own sigil, made interactive — and no longer follows it
   with five cards of the same array. Blueprint captures appear on this page
   and on the engineering page, but never the same capture: here a graph is
   evidence that a DESIGN DECISION was wired, there it is evidence about
   ARCHITECTURE.

   CROSS-PAGE LINKS ARE BUILT, NEVER TYPED. A wrong cross-page fragment fails
   SILENTLY — the browser navigates and simply does not scroll — so every one
   of them is constructed from `moon-knight-deep-dive.ts` and `castHref`, and a
   rename breaks the build instead of the page.
   ════════════════════════════════════════════════════════════════════════════ */

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
        {/* 01 — OVERVIEW, and the page opens on it.

            NO STANDFIRST BAND ANY MORE. The page carried an `OpeningStatement`
            above this: one line quoted by key, with a jump link to the section
            that owns it. It made no sense where it stood — a pull quote
            advertising §02 while sitting above §01 is a table of contents
            pretending to be an argument, and a reader met a claim before they
            had been told what the project was.

            So the overview leads, and it does the job a standfirst was being
            asked to do: what the game is, and what of it actually runs. The
            counts beside it are DERIVED — `abilities.length`, `beatLevels`,
            the bestiary arrays — so the summary cannot drift from the sections
            that prove it, and nothing here is a sentence any of them owns. */}
        <Reveal>
          <div>
            <SectionHeading kicker="01 · Overview" title="The Vision" />
            <div className="mk-overview">
              <div className="mk-overview-prose">
                <p style={{ marginTop: "1rem" }}>{p.vision}</p>
                <p style={{ marginTop: "1rem", color: "var(--color-mist)" }}>{p.built}</p>
              </div>
              <dl className="mk-scoreboard">
                {[
                  { n: p.abilities?.length ?? 0, label: "quantum abilities" },
                  { n: beatLevels.length, label: "levels, planned & built" },
                  { n: bestiaryBosses.length, label: "bosses, each teaching a mechanic" },
                  { n: bestiaryEnemies.length, label: "enemy types" },
                  { n: narrativeActs.length, label: "acts, one per land" },
                ].map((row) => (
                  <div key={row.label} className="mk-scoreboard-row">
                    <dt className="mono mk-scoreboard-n">{String(row.n).padStart(2, "0")}</dt>
                    <dd className="mk-scoreboard-label">{row.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Reveal>

        {/* 02 — Contributions. The breadth block: five disciplines named in a
            recruiter's own vocabulary, in about 100 words. It follows the
            overview because the overview says what the thing IS and this says
            which parts of it were mine. */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="02 · My Role" title="My Contribution" />
            <div style={{ display: "grid", gap: "1.5rem" }}>
              {p.contributions.map((c) => (
                <div key={c.label}>
                  <span className="mono" style={{ fontSize: "0.75rem", color: "var(--color-lunar-gold)" }}>
                    {c.label}
                  </span>
                  <p style={{ marginTop: "0.4rem", maxWidth: "35rem" }}>{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* 03 — IN MOTION. The old page-foot gallery, dissolved and promoted:
            the only proof on the page that the game RUNS, placed third so it
            lands before any design argument is made. `PlateGrid` fits the
            clips with `contain` and `LoopingVideo` refuses to autoplay under
            reduced motion, offering controls instead. */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker={inMotionIntro.kicker} title={inMotionIntro.title} />
            <p
              style={{
                color: "var(--color-mist)",
                maxWidth: "35rem",
                marginTop: "1.5rem",
                marginBottom: "1.75rem",
              }}
            >
              {inMotionIntro.body}
            </p>
            <PlateGrid
              minWidth="22rem"
              items={inMotionClips.map((c) => ({
                src: "",
                video: c.video,
                alt: c.alt,
                label: c.label,
                caption: c.caption,
              }))}
            />
          </div>
        </Reveal>

        {/* 04 — THE SIGNATURE SYSTEM.

            ONE FIGURE, NOT A FIGURE PLUS FIVE CARDS. This section used to
            render the sigil and then five `AbilityCard`s of the same array
            directly beneath it, so every principle and every effect appeared
            twice within one screen. The cards are gone. The sigil is the
            game's own design-document artwork, and its readout — name,
            quantum basis, what it does in play — is now the only place an
            ability is described on this site's design side. */}
        {p.abilities && (
          <Reveal>
            <div style={{ marginTop: "5rem" }} id="signature-systems">
              <SectionHeading kicker="04 · Signature Systems" title="The Power of the Gods" />
              <p style={{ color: "var(--color-mist)", maxWidth: "35rem", marginTop: "1.5rem", marginBottom: "2rem" }}>
                Five optional abilities, each built on a real quantum computing principle. One
                equipped at a time, high risk, high reward.
              </p>

              <QuantumSigil abilities={p.abilities} />
            </div>
          </Reveal>
        )}

        {/* 05 — Bestiary. STAYS WHOLE, and that is a structural decision, not a
            taste one: the world map above links into `#bestiary-<id>` for every
            creature, and splitting this section would send half those anchors
            cross-page for no reading-load gain. It is 330 words and almost
            entirely visual. The Werewolf card now carries the boss capture
            absorbed from the dissolved gallery. */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <Bestiary kicker="05 · The Creatures" />
          </div>
        </Reveal>

        {/* 06 — Controls. Tightened, not cut: every binding survives, the long
            sentences did not. The reading-load audit found three of the page's
            fourteen 40-word-plus sentences in this one section, including the
            longest on the site at 58 words — a control scheme should be the
            most scannable thing on a design page. */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="06 · Controls" title="The Input Map" />
            <div style={{ marginTop: "1.75rem" }}>
              <ControllerMap />
            </div>

            {/* The map above says which button. This says what the button
                does — one press, one montage, the recovery window the next
                input has to land inside. */}
            <figure style={{ margin: "2.5rem 0 0", maxWidth: "52rem" }}>
              <LoopingVideo
                src="/images/moon-knight/attack1.mp4"
                label="The first attack of the chain: wind-up, the active frames where the sword trace is live, and the recovery window the next input has to land inside"
              />
              <figcaption
                style={{
                  marginTop: "0.7rem",
                  fontSize: "0.9rem",
                  color: "var(--color-mist)",
                  lineHeight: 1.6,
                }}
              >
                One press, in full. The wind-up, the active frames where the blade traces, and the
                recovery the next input has to land inside — the animation and the combat system
                are the same object, and this is where a controller diagram stops being able to
                show it.
              </figcaption>
            </figure>

            {/* THE WIRING BEHIND THE WINDOW, and the first of three Blueprint
                captures placed on the DESIGN side of this project.

                They are here for a different reason than the ones on the
                engineering page. There, a graph is evidence about
                ARCHITECTURE — what lives in Blueprint, what moved to C++, and
                why. Here a graph is evidence that a DESIGN DECISION was
                actually wired: the combo window above is not a claim about
                intent, it is a gate with a name, and this is it. Neither
                capture on this page is one of the seven on the engineering
                page, and each is captioned to its own argument. */}
            <div style={{ marginTop: "2.5rem", maxWidth: "58rem" }}>
              <PlateGrid
                minWidth="100%"
                items={[
                  {
                    src: "/images/moon-knight/BPC_ComboContinuiationGate.png",
                    label: "Blueprint · the continuation gate",
                    alt: "The BPC_AttackSystem Blueprint graph: a Sword Attack event branching on Is Attacking?, a Combo continue event branching on Save Attack?, a Switch on Int firing Attack 1 through Attack 4, and a Stop Combo node on the failing branch.",
                    caption:
                      "The recovery window in the clip above, as the thing that implements it. Each swing opens Save Attack? while its window is live; the next input either arrives inside it and the switch fires the next attack in the chain, or it does not and the graph falls through to Stop Combo. Prototyped in Blueprint because a timing window is tuned in seconds there, and moved into C++ once the numbers stopped moving.",
                  },
                ]}
              />
            </div>
          </div>
        </Reveal>

        {/* 07 — THE WORLD AND ITS LEVELS. Two sections merged into one, and
            the merge is an argument rather than a tidy-up.

            They were §07 "The World of Kaelum" and §08 "The Beat Chart", and
            between them they answered one question twice. The map said where a
            place is, who is there and what guards it; the chart said what that
            same place is like to play. Read a screen apart, a reader had to
            carry the map in their head to make sense of the chart.

            They are now one section in three bands — THE PLACE, THE PLAN, THE
            PHOTOGRAPH — and the overlap is resolved rather than tolerated:

              · the map's readout no longer prints the level's objective. It
                prints the level the place is played as, AS A LINK into the
                chart's own rail below, which selects that level's sheet.
              · the chart no longer carries `cast` or `enemies` rows. The map
                renders those as LINKS into the bestiary and the cast, which is
                a strictly better rendering of the same facts. `boss` stays on
                the chart: which fight caps a level is a plan decision.

            The map itself also stopped rendering everything three times — see
            `WorldMap`. That is where most of this section's old length went. */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading
              kicker="07 · The World & Level Design"
              title="Kaelum, and How It Was Planned"
            />
            <p style={{ color: "var(--color-mist)", maxWidth: "38rem", marginTop: "1.5rem", marginBottom: "2.5rem" }}>
              Three great lands around one drowned island, drawn by hand — and the sheet the four
              levels inside them were actually planned from. The map answers where a place is and
              who is in it; the chart answers what it is like to play. Every place on the map opens
              its level on the chart.
            </p>

            {/* Band A — the place. */}
            <h3 className="mono mk-band-title">A · The map</h3>
            <WorldMap />

            {/* Band B — the plan. `#the-plan` is the map's hand-off target, and
                `BeatChart`'s rail tabs now select on focus, so a link to
                `#bc-tab-<level>` lands on the right sheet rather than merely
                somewhere near it. */}
            <div id="the-plan" style={{ marginTop: "4.5rem", scrollMarginTop: "2rem" }}>
              <h3 className="mono mk-band-title">B · The plan</h3>
              <p style={{ color: "var(--color-mist)", maxWidth: "38rem", marginTop: 0, marginBottom: "1.75rem" }}>
                Four levels — the prologue on Centralis and then one per act — against six design
                dimensions, with the moon waxing across the top. Pick a level to open its design
                sheet.
              </p>
              <BeatChart />
            </div>

            {/* Band C — the levels, photographed. Deliberately NOT folded into
                the In Motion band: these are documents, and `PlateGrid` fits
                them with `contain` and opens them full size. A crop would
                destroy the callouts, which are the entire point. */}
            <div style={{ marginTop: "4.5rem" }}>
              <h3 className="mono mk-band-title">C · The level, annotated</h3>
              <p
                style={{
                  color: "var(--color-mist)",
                  maxWidth: "38rem",
                  marginTop: 0,
                  marginBottom: "1.75rem",
                }}
              >
                The same levels seen from inside them. Each plate carries the reasoning on the shot
                itself, which is how these were reviewed while the level was being built.
              </p>
              {/* Capped rather than run to the full 68rem column. The plates are
                  3840px wide, but a full-width box asked the optimiser for a
                  variant it then had to upscale, and upscaled type is soft type.
                  At 58rem the served variant is larger than the box it lands in,
                  so the callouts stay crisp. */}
              <div style={{ maxWidth: "58rem" }}>
              <PlateGrid
                minWidth="100%"
                items={[
                  {
                    src: "/images/moon-knight/centralis.png",
                    label: "Centralis · the whole level",
                    alt: "Annotated overhead of the Centralis level: callouts marking the PCG forest used as natural blocking, the spawn view holding the moon, the NPC and the sword in one frame, the sword lit beside the willow tree, and the layout withheld until the sword is picked up.",
                    caption:
                      "Four decisions on one frame: the forest as natural blocking rather than randomised scatter, a spawn view that holds all three guides at once, the sword lit as the brightest point after the moon, and the layout deliberately withheld until the player picks it up.",
                  },
                  {
                    src: "/images/moon-knight/forest.png",
                    label: "Centralis · at eye level",
                    alt: "Annotated night shot from inside the forest: callouts on the moon as both light source and compass, and on enemy placement in the dark between the trees.",
                    caption:
                      "The same level from the floor. The moon does two jobs — the only real light, and the direction of the objective — and the enemies are placed in the dark between the trees, which is what makes the forest read as short-range and fast.",
                  },
                  {
                    src: "/images/moon-knight/boss_arena.png",
                    label: "The werewolf arena",
                    alt: "Annotated boss arena: the werewolf placed on a raised mound so it stays readable from anywhere in the arena, with the arena sized for dodging room.",
                    caption:
                      "The boss stands on a rise so it stays readable from anywhere in the arena, and the arena is sized for the dodge rather than for the fight — the last beat on the chart above.",
                  },
                ]}
              />
              </div>
            </div>
          </div>
        </Reveal>

        {/* 08 — Diegetic design, SHORT. The thesis, the moon-HUD strip, the
            four swaps, and where the claim stops. The four `why` arguments,
            the skill tree, the invisible-design decisions and the core-combat
            verbs are on the deep dive.

            The claim is now SCOPED. It used to read "nothing here is a menu —
            every system is an object, a gesture or a place", which the repo
            contradicts: `View` opens a conventional equipment screen. The
            thesis now names the four systems it is actually true of and says
            why the equipment menu is the right call. A scoped claim a reader
            can check beats a sweeping one they can disprove. */}
        <Reveal>
          <div style={{ marginTop: "5rem" }} id="diegetic-design">
            <SectionHeading kicker="08 · Diegetic Design" title="Mechanics That Hide in the World" />
            <p style={{ color: "var(--color-mist)", maxWidth: "35rem", marginTop: "1.5rem", marginBottom: "1.75rem" }}>
              The health bar is the moon on the knight&apos;s back, experience is a rose stained in
              a boss&apos;s blood, and the map is a blade held up to the moonlight.
            </p>

            {/* The willow: the save point, and the one diegetic system that is
                a PLACE rather than an object or a gesture. Sits at the head of
                the section because it is the only one a screenshot can state
                on its own. */}
            <figure style={{ margin: "0 0 2.5rem", maxWidth: "52rem" }}>
              <PlateGrid
                minWidth="100%"
                items={[
                  {
                    src: "/images/moon-knight/willow_tree.png",
                    label: "The willow",
                    alt: "A white willow tree on a rise under a full night sky, a fallen winged statue below it, the knight small in the distance.",
                    caption:
                      "The willow. There is no save menu and no bonfire prompt — the tree is the checkpoint, and the only place the harp heals you all the way back.",
                  },
                ]}
              />
            </figure>

            <DiegeticDesign variant="short" />

            {/* Two more Blueprint captures, on the design argument rather than
                the architecture one. A diegetic interface is easy to claim and
                cheap to fake in a portfolio; these are what it looks like when
                the claim is true — one stats component serving both readouts,
                and a death sequence with no screen in it. */}
            <div style={{ marginTop: "2.5rem" }}>
              <h3
                className="mono"
                style={{
                  fontSize: "0.72rem",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--color-silver)",
                  margin: "0 0 1.25rem",
                }}
              >
                The wiring behind it
              </h3>
              <PlateGrid
                minWidth="26rem"
                items={[
                  {
                    src: "/images/moon-knight/BP_PlayerStats.png",
                    label: "Blueprint · one component, both readouts",
                    alt: "The player-stats Blueprint graph: the component casts to the player, dummy or AI character, sets a Character Type enum, and feeds Set Percent into whichever health and stamina bar belongs to that owner.",
                    caption:
                      "The moon on the knight's back and the bar above an enemy's head are the same component. It casts to whoever owns it, records a character type, and drives the matching widget — so putting the health bar inside the world cost a skin, not a system.",
                  },
                  {
                    src: "/images/moon-knight/BP_DieMechanic.png",
                    label: "Blueprint · dying, without a screen",
                    alt: "The Die Blueprint sequence: disable input, set the mesh to simulate physics, start a camera fade through the player camera manager, delay, then open the current level again by name.",
                    caption:
                      "Death as a sequence rather than a menu: input off, the body goes to ragdoll, the camera fades to black and the world comes back. No card, no retry button. This Blueprint version reloaded the whole level; in C++ it became a respawn at the last willow, which is why the tree above is the checkpoint.",
                  },
                ]}
              />
            </div>

            <div style={{ marginTop: "2rem" }}>
              <RampLink href={deepDiveHref("diegetic")}>
                The full diegetic argument: every system&apos;s reasoning, the skill tree and the
                invisible decisions
              </RampLink>
            </div>
          </div>
        </Reveal>

        {/* 09 — Art direction, SHORT. The thesis line, the real palette, and
            the one translation where the aesthetic crosses into the rules —
            darkness is not mood here, it is difficulty, which makes it systems
            evidence rather than craft depth. The other translations and the
            framing decisions are on the deep dive. */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="09 · Art Direction" title="The Sublime, Made Playable" />
            <p style={{ color: "var(--color-mist)", maxWidth: "35rem", marginTop: "1.5rem", marginBottom: "1.75rem" }}>
              One aesthetic idea decides the whole look of the game — and then keeps going, into
              how hard it is to see what is about to kill you.
            </p>

            {/* Two real frames before the argument. The first is the thesis in
                one image: a small figure, an enormous indifferent landscape,
                one light source. The second is what "the Sublime is the beauty
                of decay" actually looks like in the build. */}
            <div style={{ marginBottom: "2.5rem", maxWidth: "58rem" }}>
              <PlateGrid
                minWidth="100%"
                items={[
                  {
                    src: "/images/moon-knight/sublime_meadow.png",
                    label: "The Sublime, in one frame",
                    alt: "The knight seen from behind, alone in a moonlit meadow of foxgloves, ruined statues either side, a full moon low on the horizon under a dense starfield.",
                    caption:
                      "Everything the art direction argues, in one shot: one small figure, one light source, ruins nobody is coming back for, and a landscape entirely indifferent to you.",
                  },
                  {
                    src: "/images/moon-knight/environment.png",
                    label: "Ruin as ground cover",
                    alt: "Night interior of the forest: a statue half-swallowed by heavy foliage, stars visible through the canopy.",
                    caption:
                      "Decay is the set dressing, not a set piece. The statues are already losing to the forest, which is what stops the world reading as a level and starts it reading as a place.",
                  },
                ]}
              />
            </div>

            {/* The title screen: the look committed to before a mechanic runs. */}
            <figure style={{ margin: "0 0 2.5rem", maxWidth: "52rem" }}>
              <LoopingVideo
                src="/images/moon-knight/menu.mp4"
                label="The Moon-Knight title screen: the moon held over a dark landscape, with the menu set into the scene rather than over it"
              />
              <figcaption
                style={{
                  marginTop: "0.7rem",
                  fontSize: "0.9rem",
                  color: "var(--color-mist)",
                  lineHeight: 1.6,
                }}
              >
                The title screen. The menu sits inside the scene rather than on top of it — the same
                rule §08 applies to the HUD, applied before the game has started.
              </figcaption>
            </figure>

            <ArtDirection variant="short" />

            <div style={{ marginTop: "2rem" }}>
              <RampLink href={deepDiveHref("art")}>
                The Sublime in full: all four translations and the framing decisions
              </RampLink>
            </div>
          </div>
        </Reveal>

        {/* 10 — The hard part. MOVED UP from the foot of the page. It is the
            strongest credibility move in the portfolio — a documented negative
            result rather than a faked success — and the only door to the two
            engineering pages. At 84% depth almost nobody opened it. */}
        {p.designChallenge && (
          <Reveal>
            <div style={{ marginTop: "5rem" }}>
              <SectionHeading kicker="10 · The Hard Part" title="What Broke, and What I Built" />
              <div style={{ marginTop: "1.5rem" }}>
                <ChallengeQuote challenge={p.designChallenge} />
              </div>
              {/* One section, not two: the quote ends on "documented the
                  feasibility gap and carried it into a standalone C++ toolkit"
                  and the note below is that sentence as a timeline. */}
              {p.engineeringNote && (
                <div style={{ marginTop: "2.5rem" }}>
                  <EngineeringNote note={p.engineeringNote} />
                </div>
              )}
              <div
                style={{
                  marginTop: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "0.85rem",
                }}
              >
                <RampLink href="/moon-knight/engineering">
                  How I programmed the game: the C++ / Blueprint architecture
                </RampLink>
                <RampLink href="/moon-knight/engineering/quantum" tone="silver">
                  The research within it: the C++ quantum toolkit
                </RampLink>
              </div>
            </div>
          </Reveal>
        )}

        {/* 11 — The score, SHORT. The two real recordings and one sentence.
            This is the deliberate exception to "move the music wholesale": a
            reader pressing play and hearing a real score in ten seconds is
            evidence, and evidence belongs on the main page. The 900 words of
            composer reasoning around it are the depth, and those moved. */}
        <Reveal>
          <div style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="11 · Score" title="I Wrote the Music Too" />
            <p style={{ color: "var(--color-mist)", maxWidth: "35rem", marginTop: "1.5rem", marginBottom: "1.75rem" }}>
              Two finished pieces from the score I composed for the game. Press either to play.
            </p>
            <AudioDesign variant="short">
              <MoonKnightAudio />
            </AudioDesign>

            <div style={{ marginTop: "2rem" }}>
              <RampLink href={deepDiveHref("score")}>
                How the score was designed: the silence rule, the village themes and what each
                instrument is allowed to mean
              </RampLink>
            </div>
          </div>
        </Reveal>

        {/* THE HAND-OFF, AND BOTH DOORS ARE ON IT.

            This used to be a single panel to the deep dive, which left the two
            engineering pages reachable from exactly one place on the site: the
            pair of ramp links inside §11, two thirds of the way down. A reader
            who scrolled past that section arrived at the foot of the page with
            no idea the code write-ups existed. Both routes are now offered
            here, side by side, in the same control the subpages use to hand
            readers back — so every page under `/moon-knight` ends with the
            complete set of places to go next. */}
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
              kicker="The deep dive"
              title="The World, the Story and the Score"
              body="The other half of this project, at full length: the three-act arc and its reversal, the cast and what each of them is for, the symbolism the world is built on, the complete diegetic and art-direction arguments, how the score was written, the jousting minigame and its risk table, and where the world would go next."
              href={deepDivePath}
              linkLabel="Read the deep dive"
            />
            <CtaPanel
              kicker="The code"
              title="Programming Moon-Knight"
              body="How the game is actually built: the boundary between C++ and Blueprint and the five choices that drew it, the combat state machine, the data-driven tuning layer, captures from the editor — and, branching off it, the standalone C++ quantum toolkit the engine limit turned into."
              href="/moon-knight/engineering"
              linkLabel="Read the engineering write-up"
              accent="silver"
            />
          </div>
        </Reveal>

        <Reveal>
          <ProjectNav items={projectNavItems} currentSlug={p.slug} />
        </Reveal>
      </Section>

      {/* The two layers, plus the two things §01 and §07 need. */}
      <style>{`
        /* ---- §01 the overview scoreboard ----
           Prose left, counts right. Every number is derived; the labels say
           what was counted, so the block is a summary rather than a badge. */
        .mk-overview {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 17rem);
          gap: clamp(1.5rem, 4vw, 3rem);
          align-items: start;
          margin-top: 0.5rem;
        }
        .mk-overview-prose { max-width: 35rem; }
        .mk-scoreboard {
          margin: 0;
          display: grid;
          gap: 0.85rem;
          padding-left: 1.25rem;
          border-left: 1px solid color-mix(in srgb, var(--color-mist) 24%, transparent);
        }
        .mk-scoreboard-row {
          display: grid;
          grid-template-columns: 2.6rem minmax(0, 1fr);
          align-items: baseline;
          gap: 0.75rem;
        }
        .mk-scoreboard-n {
          margin: 0;
          font-size: 1.35rem;
          line-height: 1;
          color: var(--color-lunar-gold);
          font-variant-numeric: tabular-nums;
        }
        .mk-scoreboard-label {
          margin: 0;
          font-size: 0.85rem;
          line-height: 1.5;
          /* Lifted steel: --color-mist is 4.41:1 on this ground, under the AA
             bar for small type. */
          color: #93A0B3;
        }
        @media (max-width: 900px) {
          .mk-overview { grid-template-columns: minmax(0, 1fr); }
          .mk-scoreboard { padding-left: 0; border-left: 0; padding-top: 1.25rem;
            border-top: 1px solid color-mix(in srgb, var(--color-mist) 24%, transparent); }
        }

        /* ---- §07 band headings ----
           Three bands inside one section, so they are labelled A / B / C
           rather than given section numbers of their own — they are one
           argument in three movements, not three sections. */
        .mk-band-title {
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--color-lunar-gold);
          margin: 0 0 1rem;
        }

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

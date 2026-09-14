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
import ChapterNav from "@/components/layout/ChapterNav";
import {
  moonKnightChapters as ch,
  moonKnightChapterList,
} from "@/content/project-chapters";
import { projectNavItems } from "@/content/games";
import Aurora from "@/components/effects/Aurora";
import {
  BACKDROP_OPACITY,
  MOON_KNIGHT_AURORA,
} from "@/components/effects/SubpageBackdrop";
import MoonKnightAudio from "@/components/project/MoonKnightAudio";
import Bestiary from "@/components/project/Bestiary";
import WorldMap from "@/components/project/WorldMap";
import DiegeticDesign, { InvisibleDesign } from "@/components/project/DiegeticDesign";
import ControllerMap from "@/components/project/ControllerMap";
import ArtDirection from "@/components/project/ArtDirection";
import AudioDesign from "@/components/project/AudioDesign";
import BeatChart from "@/components/project/BeatChart";
import QuantumSigil from "@/components/project/QuantumSigil";
import RampLink from "@/components/project/RampLink";
import CtaPanel from "@/components/project/CtaPanel";
import { inMotionClips, inMotionIntro } from "@/content/moon-knight-in-motion";
import { beatLevels } from "@/content/moon-knight-levels";
import { bestiaryBosses, bestiaryEnemies } from "@/content/moon-knight-bestiary";
import { narrativeActs } from "@/content/moon-knight-narrative";
import { deepDiveHref, deepDivePath } from "@/content/moon-knight-deep-dive";

export const metadata: Metadata = {
  title: `${p.title} | Álvaro Gómez Pérez`,
  description: p.systemsHook,
};


export default function MoonKnightPage() {
  return (
    <>
      {/* Hero */}
      <div className="mk-hero">
        <Aurora
          className="mk-hero-aurora"
          {...MOON_KNIGHT_AURORA}
          opacity={BACKDROP_OPACITY.moonKnight.hero}
        />
        <div className="mk-hero-content">
          <ProjectHero project={p} posterSrc="/images/moon-knight/poster.png" />
        </div>
      </div>

      {/* `tight`: this Section follows the hero, so its 4rem top padding
          would be the second of three stacked gaps. See Section.tsx. */}
      <Section tight>
        {/* The contents of the page, before the page starts arguing. */}
        <ChapterNav chapters={moonKnightChapterList} />

        {/* 1 — OVERVIEW */}
        <Reveal>
          <div id={ch.overview.id}>
            <SectionHeading kicker="The Overview" title={ch.overview.title} />
            <div className="mk-overview">
              <div className="mk-overview-prose">
                <p style={{ marginTop: "1rem" }}>{p.vision}</p>
                <p style={{ marginTop: "1rem", color: "var(--color-mist)" }}>{p.built}</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* 2 — Contributions */}
        <Reveal>
          <div id={ch.role.id} style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="My Role" title={ch.role.title} />
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

        {/* 3 — Videos Section */}
        <Reveal>
          <div id={ch.inMotion.id} style={{ marginTop: "5rem" }}>
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

        {/* 4 — THE QUANTUM SYSTEM. */}
        {p.abilities && (
          <Reveal>
            <div
              id={ch.abilities.id}
              style={{ marginTop: "5rem" }}
            >
              <SectionHeading kicker="The Quantum Abilities" title={ch.abilities.title} />
              <p style={{ color: "var(--color-mist)", maxWidth: "35rem", marginTop: "1.5rem", marginBottom: "2rem" }}>
                Five abilities built on a real quantum computing principle. One
                equipped at a time with high risk and high reward.
              </p>

              <QuantumSigil abilities={p.abilities} />
            </div>
          </Reveal>
        )}

        {/* 5 — Bestiary */}
        <Reveal>
          <div id={ch.bestiary.id} style={{ marginTop: "5rem" }}>
            <Bestiary kicker="The Enemies" />
            <div style={{ marginTop: "3rem" }}>
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
                AI Blueprints Systems
              </h3>
              <PlateGrid
                minWidth="26rem"
                items={[
                  {
                    src: "/images/moon-knight/AI Detection - Moon-Knight.png",
                    label: "Blueprint · Triggering enemies through sight detection",
                    alt: "The AI sight-detection graph: a Sight Detection event breaks the AI stimulus, branches on Successfully Sensed, and on the true path writes the player into the Target Actor Blackboard key and calls Activate Mini Boss Combat — while the false path clears the key and calls Deactivate Miniboss Combat.",
                    caption:
                      "The detection system that the majority of the enemies share. The sensed stimulus writes you into the Target Actor key that the Behaviour Tree reads. " +
                      "This system lets the player to Deactivate the stimulus, leaving the fight whenever is needed."
                  },
                  {
                    src: "/images/moon-knight/MiniBoss_Combat.png",
                    label: "Blueprint · Boss bar only appearing during the bossfight",
                    alt: "The mini-boss combat graph: Activate MiniBoss Combat creates the WB Boss Health bar widget and adds it to the viewport, a tick divides current health by max health into Set Percent, and Deactivate Miniboss Combat removes the widget from its parent.",
                    caption:
                      "With this Blueprint, the boss' health bar only appears when they are triggered. This HUD dissapears when the boss is defeated or when they lose sight of the player." 
                  },
                ]}
              />
            </div>
          </div>
        </Reveal>

        {/* 6 — Controls */}
        <Reveal>
          <div id={ch.controls.id} style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="The Controls" title={ch.controls.title} />
            <div style={{ marginTop: "1.75rem" }}>
              <ControllerMap />
            </div>

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
                This is the Animation Montage of the first attack. The space between the two notifies of the animation is 
                the time that the player has to concatenate attacks. If the player presses the input outside of this time 
                the attack combo will fail. This is the connection between the animation and the Blueprints.
              </figcaption>
            </figure>

            <div style={{ marginTop: "2.5rem", maxWidth: "58rem" }}>
              <PlateGrid
                minWidth="100%"
                items={[
                  {
                    src: "/images/moon-knight/BPC_ComboContinuiationGate.png",
                    label: "Blueprint · the combo continuation",
                    alt: "The BPC_AttackSystem Blueprint graph: a Sword Attack event branching on Is Attacking?, a Combo continue event branching on Save Attack?, a Switch on Int firing Attack 1 through Attack 4, and a Stop Combo node on the failing branch.",
                    caption:
                      "This is the logic of the combo continuation and how the game detects the player's attacks. " +
                      "Each swing opens the bool Save Attack? while its window is true. The next input either arrives inside it and the switch fires the next attack in the chain, or it does not and the graph falls through to Stop Combo." + 
                      "Prototyped in Blueprint because a timing window is tuned in seconds there, and moved into C++ once the numbers stopped moving.",
                  },
                  {
                    src: "/images/moon-knight/BP_Notify_SwordTraceLoop.png",
                    label: "Blueprint · how the sword applies damage",
                    alt: "The BP_Notify_SwordTraceLoop anim notify state: Received Notify Begin gets the owner, casts to the player character or to BP_AI, and calls Start Sword Trace on whichever attack component it found.",
                    caption:
                      "This is the Blueprint logic that was attach to all the swords in the prototype. A Notify opens the trace when the swing should cause damage and the another Notify closes it. " +
                      "The graph also casts to the BP_AI, making the enemies' attacks follow the same rules and applying damage only during certain parts of the animations.",
                  },
                ]}
              />
            </div>
          </div>
        </Reveal>

        {/* 7 — THE WORLD AND THE LEVELS. */}
        <Reveal>
          <div id={ch.world.id} style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="The World & Level Design" title={ch.world.title} />
            <p style={{ color: "var(--color-mist)", maxWidth: "38rem", marginTop: "1.5rem", marginBottom: "2.5rem" }}>
              There are three main areas and an island in the world of Kaelum.
              This is the drawn map. It shows where each place is and which NPCs will the player encounter.
              The chart answers what it is like to play and every place on the map opens
              its level on the chart.
            </p>

            {/* Band A — the place. */}
            <h3 className="mono mk-band-title">The map</h3>
            <WorldMap />

            {/* Band B */}
            <div id="the-plan" style={{ marginTop: "4.5rem" }}>
              <h3 className="mono mk-band-title">The plan</h3>
              <p style={{ color: "var(--color-mist)", maxWidth: "38rem", marginTop: 0, marginBottom: "1.75rem" }}>
                The Beatchart of shows the tutorial and the three main areas which represent one act per area. 
                Pick a level to open its design.
              </p>
              <BeatChart />
            </div>

            {/* Band C */}
            <div style={{ marginTop: "4.5rem" }}>
              <h3 className="mono mk-band-title">The Level Design</h3>
              <p
                style={{
                  color: "var(--color-mist)",
                  maxWidth: "38rem",
                  marginTop: 0,
                  marginBottom: "1.75rem",
                }}
              >
                In-game screenshots of the game. Each picture shows the level design choices that were
                reviewed while the level was being built.
              </p>
              <div style={{ maxWidth: "58rem" }}>
              <PlateGrid
                minWidth="100%"
                items={[
                  {
                    src: "/images/moon-knight/centralis.png",
                    label: "Centralis · overview of the level",
                    alt: "Annotated overhead of the Centralis level: callouts marking the PCG forest used as natural blocking, the spawn view holding the moon, the NPC and the sword in one frame, the sword lit beside the willow tree, and the layout withheld until the sword is picked up.",
                    caption:
                      "The main four decisions: The forest functions as a natural reducing the light of the main area of level and hiding enemies. " + 
                      "From here, the player has the three guides in front of them. The Moon, The Willow Tree and The Sword. " +
                      "Being the last one under the brightest point of the map. " + 
                      "The layout of the level is hidden from the player until they get to the sword pickup spot and then the layout is fully revealed. " +
                      "With these decisions I try to communicate with the player through the level",
                  },
                  {
                    src: "/images/moon-knight/forest.png",
                    label: "Centralis · the forest",
                    alt: "Annotated night shot from inside the forest: callouts on the moon as both light source and compass, and on enemy placement in the dark between the trees.",
                    caption:
                      "The same level from the floor. The moon serves a double function by giving natural light to the level and the direction towards" +
                      "where the player should go. The enemies are placed in the dark between the trees, which is what makes the combat short-range and fast.",
                  },
                  {
                    src: "/images/moon-knight/boss_arena.png",
                    label: "The werewolf boss arena",
                    alt: "Annotated boss arena: the werewolf placed on a raised mound so it stays readable from anywhere in the arena, with the arena sized for dodging room.",
                    caption:
                      "The boss stands on a hill so it seen from anywhere in the arena, and the arena gives space so the player has space to dodge.",
                  },
                ]}
              />
              </div>
            </div>
          </div>
        </Reveal>

        {/* 8 — UI DESIGN */}
        <Reveal>
          <div id={ch.diegetic.id} style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="Main Design" title={ch.diegetic.title} />
            <p style={{ color: "var(--color-mist)", maxWidth: "35rem", marginTop: "1.5rem", marginBottom: "1.75rem" }}>
              The Health Bar is the moon on the knight&apos;s back. The Experience is a white rose stained in
              the boss&apos;s blood. The map player knows where to go by raising the sword and reflecting the moonlight.
            </p>

            {/* The willow tree */}
            <figure style={{ margin: "0 0 2.5rem", maxWidth: "52rem" }}>
              <PlateGrid
                minWidth="100%"
                items={[
                  {
                    src: "/images/moon-knight/willow_tree.png",
                    label: "willow trees",
                    alt: "A white willow tree on a rise under a full night sky, a fallen winged statue below it, the knight small in the distance.",
                    caption:
                      "These trees are the player's checkpoint and safe space. Is the only place the player can heal fully.",
                  },
                ]}
              />
            </figure>

            {/* The WHOLE argument, not the key strip it used to be. This was
                the deep dive's §04 and it is back here, because the decisions
                it describes are the design of the game and a reader should not
                have to leave the project page to meet them. `withInvisible` is
                off: the four no-interface decisions are the section directly
                below, with a heading of their own. */}
            <DiegeticDesign withInvisible={false} />

            {/* Blueprint Screenshots */}
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
                The Blueprints
              </h3>
              <PlateGrid
                minWidth="26rem"
                items={[
                  {
                    src: "/images/moon-knight/BP_PlayerStats.png",
                    label: "The Health in the HUD",
                    alt: "The player-stats Blueprint graph: the component casts to the player, dummy or AI character, sets a Character Type enum, and feeds Set Percent into whichever health and stamina bar belongs to that owner.",
                    caption:
                      "I tied the health and its representation to the HUD and wired them properly so the enemies could also inheret from this system. " +
                      "Due to lack of time, I could not made the diegectic health bar as a moon, but the systems was build for making it work with any kind of UI.",
                  },
                  {
                    src: "/images/moon-knight/BP_DieMechanic.png",
                    label: "Diying sequence",
                    alt: "The Die Blueprint sequence: disable input, set the mesh to simulate physics, start a camera fade through the player camera manager, delay, then open the current level again by name.",
                    caption:
                      "For the death sequence I decided to make all the characters go to ragdoll and if the player dies, have a fade to black screen. " +
                      "When I reworked in the C++ codebase, I wired the respawn at the last willow tree the player rested, making them checkpoints rather than force the main spawn. ",
                  },
                  {
                    src: "/images/moon-knight/Pickup Trace - Moon-Knight.png",
                    label: "Pickup mechanic",
                    alt: "The pickup trace graph: the Interact input runs a sphere trace forward from the follow camera, and if the hit actor casts to BP_Weapon it is added to the equipment component and the world actor is destroyed.",
                    caption:
                      "The trace runs forward from the camera towards a pickable object in front. I chose this instead of a HUD. Player's are hinted to pickup an item through context. " + 
                      "The weapon goes into the equipment system and the mesh in the world is destroyed.",
                  },
                ]}
              />
            </div>
          </div>
        </Reveal>

        {/* 9 — INVISIBLE DESIGN
            A sibling of the section above, not a child of it — it was nested
            inside §08's <div> by accident, which put its heading inside
            another section's body. */}
        <Reveal>
          <div id={ch.invisible.id} style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="Invisible Design" title={ch.invisible.title} />
            <InvisibleDesign />
          </div>
        </Reveal>

        {/* 10 — Art Direction */}
        <Reveal>
          <div id={ch.art.id} style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="Art Direction" title={ch.art.title} />
            <p style={{ color: "var(--color-mist)", maxWidth: "35rem", marginTop: "1.5rem", marginBottom: "1.75rem" }}>
              The Sublime and their way of romanticise the medieval ages is what inspired the artstyle direction.
              This art philosophy adapted to games, exposes the player to solitude, open spaces and big challenges whether internal or external.
            </p>

            {/* Two Screenshots */}
            <div style={{ marginBottom: "2.5rem", maxWidth: "58rem" }}>
              <PlateGrid
                minWidth="100%"
                items={[
                  {
                    src: "/images/moon-knight/sublime_meadow.png",
                    label: "Landscapes",
                    alt: "The knight seen from behind, alone in a moonlit meadow of foxgloves, ruined statues either side, a full moon low on the horizon under a dense starfield.",
                    caption:
                      "This screenshot shows a miniboss next to ruins and under the moonlight. Big landscapes, big landscapes and big challenges turned epic.",
                  },
                  {
                    src: "/images/moon-knight/environment.png",
                    label: "Ruins",
                    alt: "Night interior of the forest: a statue half-swallowed by heavy foliage, stars visible through the canopy.",
                    caption:
                      "Ruins are a big part of the game's setting. They show how the society that built them functioned, their religion, their aspirations or their fears. " +
                      "By making them ruins, it creates the sensation in the player that everything has an end and eventually forgotten and buried by nature.",
                  },
                ]}
              />
            </div>

            {/* The title screen. */}
            <figure style={{ margin: "0 0 2.5rem", maxWidth: "52rem" }}>
              <LoopingVideo
                src="/images/moon-knight/menu.mp4"
                label="The Moon-Knight title screen: the moon held over a dark landscape, with the menu set into the scene rather than over it"
                
              />
              <figcaption
                style={{
                  marginTop: "0.7rem",
                  fontSize: "1.2rem",
                  color: "var(--color-mist)",
                  lineHeight: 1.6,
                }}
              >
                The title screen
              </figcaption>
            </figure>

            <ArtDirection variant="short" />

            <div style={{ marginTop: "2rem" }}>
              <RampLink href={deepDiveHref("art")}>
                The Full Sublime Artstyle Direction and art decisions
              </RampLink>
            </div>
          </div>
        </Reveal>

        {/* 11 — Development Issuess. */}
        {p.designChallenge && (
          <Reveal>
            <div id={ch.development.id} style={{ marginTop: "5rem" }}>
              <SectionHeading kicker="The Development" title={ch.development.title} />
              <div style={{ marginTop: "1.5rem" }}>
                <ChallengeQuote challenge={p.designChallenge} />
              </div>
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
                  How I programmed the game: the C++ and Blueprint architecture
                </RampLink>
                <RampLink href="/moon-knight/engineering/quantum" tone="silver">
                  The Quantum Research and the C++ Quantum Toolkit
                </RampLink>
              </div>
            </div>
          </Reveal>
        )}

        {/* 12 — The Audio and Music Design. */}
        <Reveal>
          <div id={ch.audio.id} style={{ marginTop: "5rem" }}>
            <SectionHeading kicker="Audio Design" title={ch.audio.title} />
            <p style={{ color: "var(--color-mist)", maxWidth: "35rem", marginTop: "1.5rem", marginBottom: "1.75rem" }}>
              The two main compositions of the game. Press either to play.
            </p>
            <AudioDesign variant="short">
              <MoonKnightAudio />
            </AudioDesign>

            <div style={{ marginTop: "2rem" }}>
              <RampLink href={deepDiveHref("score")}>
                How the soundtrack and the audio design was done and its reasoning.
              </RampLink>
            </div>
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
              kicker="The deep dive"
              title="The World, the Story and the Music"
              body= 
                "The full length of the project. The Narrative Design, the NPCs and their story, the worldbuilding and its symbolism, and the full art-direction argument. How the music and the audio design was planned, the jousting minigame and the potential DLCs."
              href={deepDivePath}
              linkLabel="Read the deep dive"
            />
            <CtaPanel
              kicker="The codebase"
              title="Programming Moon-Knight"
              body= "The engineering side of the projet. The limitations of Blueprints translated in C++ and the main code choices. The combat state machine, the data-driven layer and the quantum C++ engine limits."
              href="/moon-knight/engineering"
              linkLabel="Read the engineering side"
              accent="silver"
            />
          </div>
        </Reveal>

        <Reveal>
          <ProjectNav items={projectNavItems} currentSlug={p.slug} />
        </Reveal>
      </Section>

      {/* The two layers */}
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
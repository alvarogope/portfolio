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

   THE SHAPE, AND WHY IT CHANGED. This page ran to ~8,100 rendered words — ten
   times the reading-load audit's benchmark, the longest on the site — with the
   first frame of actual gameplay at 58% depth, behind key art, a design
   document, a title screen and an empty hub. The material was not filler; the
   SHAPE was wrong for the first reader it has to survive.

   It was split by KIND, not trimmed by taste. This page keeps the built,
   working game. `/shattered-skies/world` took the fiction and the reasoning,
   whole. Four components render both halves from the same content files under a
   `variant` prop, so no sentence exists in two places.

   THE ORDER IS EVIDENCE-FIRST, WITH ONE DELIBERATE DEPARTURE FROM MOON-KNIGHT.
   Moon-Knight runs Overview → My Role → In Motion. This page runs Overview →
   In Motion → The Game → My Role, because the ownership map protects §02's
   placement in those words: "their game first, my work second — the reason the
   whole page works. Protect it." Footage IS the team's game, so it sits
   naturally before the team note, and My Role still follows the team context
   rather than pre-empting it. Attribution order is preserved; the footage just
   stopped being buried.

   THE OPENING STATEMENT WAS CUT. It was a two-item pull quote above §01,
   quoting §05 and §07 and linking down to them. Both reasons for it are gone:
   the audio credit it surfaced is now four sections up rather than at 41%
   depth, and the waveform payoff it surfaced is pulled inside the co-op section
   itself. It also would have become a cross-page pull quote after the split,
   which is the exact shape retired as D5 on Moon-Knight. The rule that removal
   established: a standfirst may only quote a section far below it on the SAME
   page.

   HARD CONSTRAINT S5. `ShatteredSkiesSystem` scrolls to a dossier card through
   a DOM query when a world is selected, so the orrery and the dossier must stay
   on one page. They are both here, in §05, together with the knowledge-gating
   rule they absorbed. Do not move either to the subpage.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Shared spacing between top-level sections, so the rhythm is stated once. */
const GAP = { marginTop: "5rem" } as const;

/** The standfirst under a section heading. Same measure everywhere. */
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
        {/* Tuning lives in `SubpageBackdrop`, which is also where the deep
            dive reads it from, so the hero and the subpage band cannot drift
            apart. Every knob keeps its comment there. Only strength differs. */}
        <Galaxy
          className="ss-hero-galaxy"
          {...SHATTERED_SKIES_GALAXY}
          opacity={BACKDROP_OPACITY.shatteredSkies.hero}
        />
        <div className="ss-hero-content">
          {/* The facts block renders `p.links`, which is where the deep dive is
              reachable from the top of the page. */}
          <ProjectHero project={p} posterSrc="/images/shattered-skies/poster.png" />
        </div>
      </div>

      <Section>
        {/* ═══ 01 · OVERVIEW ═══ */}
        <Reveal>
          <div style={{ maxWidth: "35rem" }}>
            <SectionHeading kicker="01 · Overview" title="The Vision" />
            <p style={{ marginTop: "1rem" }}>{p.vision}</p>
          </div>
        </Reveal>

        {/* ═══ 02 · IN MOTION ═══
            The whole point of the restructure, in one band: proof before prose.
            The audit put the first frame of gameplay at 4,700 words; it is at
            about 120 now. Every clip is muted, loops, and refuses to autoplay
            under reduced motion. */}
        <Reveal>
          <div style={GAP} id={mainAnchors.inMotion}>
            <SectionHeading kicker={inMotionIntro.kicker} title={inMotionIntro.title} />
            <p style={{ ...LEAD, marginBottom: "1.75rem" }}>{inMotionIntro.body}</p>
            <PlateGrid minWidth="22rem" items={[...inMotionItems]} />
          </div>
        </Reveal>

        {/* ═══ 03 · THE GAME ═══
            Context before contributions: this is the game we made together, and
            the sections after it are the parts that are mine. `teamNote` inside
            `NarrativeMap` is the page's canonical attribution and the only one
            besides §06's levelsCredit. */}
        <Reveal>
          <div style={GAP} id={mainAnchors.theGame}>
            <SectionHeading kicker="03 · The Game" title="The Game We Made" />
            <NarrativeMap variant="main" />

            <div style={{ marginTop: "3rem" }}>
              <PlateGrid
                minWidth="29rem"
                items={[
                  {
                    src: "/images/shattered-skies/story-beats.jpg",
                    label: "The structure",
                    alt: "The narrative structure chart: two backstories for Drayk and Aevi converging through four story beats into four endings — Unity, two Betrayal variants, and Extinction.",
                    caption:
                      "The branch structure as it was authored, cropped to the diagram band. The whole sheet — the written beats, and the column where we marked the backstory down for being too black-and-white — is on the deep dive.",
                  },
                  {
                    src: "/images/shattered-skies/shattered-skies-spaceship.png",
                    label: "The build",
                    alt: "In-engine view of the ship on the hub floor with a wall of planets behind it. The planet textures are placeholders from a stock solar-system set, not the five designed worlds.",
                    caption:
                      "The hub as it stood at the end of the module. The planets on that wall are placeholder textures from a stock solar-system set — we ran out of time to swap them, and the five worlds they stand in for are designed in §05 below, not here.",
                  },
                ]}
              />
            </div>

            <div style={{ marginTop: "2rem" }}>
              <RampLink href={deepDiveHref("story")}>
                The whole story, the sealed choice and the three endings
              </RampLink>
            </div>
          </div>
        </Reveal>

        {/* ═══ 04 · MY ROLE ═══
            Moved up from last. At the end of an 8,000-word page these four
            claims were a recap; here, straight after the team context, they are
            a promise of the four sections that follow. Cut to one line each in
            the same change, because moving an untrimmed recap only relocates
            it. */}
        <Reveal>
          <div style={GAP}>
            <SectionHeading kicker="04 · My Role" title="My Contribution" />
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

        {/* ═══ 05 · THE WORLD & THE FIVE WORLDS ═══
            THE MERGE. These were two sections, both kickered "World Design",
            586 + 827 words apart — a reader skimming the rail saw the same
            label twice and could not tell what the second one added. They are
            one chapter in two halves and always were: the claim, then the
            evidence for it.

            `ShatterstormWorld variant="main"` is the claim — a shattered planet
            for two shattered peoples. The challenge quote is the orrery's
            thesis and stands directly above it. Then the diagram that proves
            both. The texture, relics and politics went to the deep dive.

            S5: the orrery and the dossier are one unit. `ShatteredSkiesSystem`
            owns the selection and scrolls to the picked world's dossier card,
            so the dossier is passed as children and both stay here. */}
        <Reveal>
          <div style={GAP} id={mainAnchors.worlds}>
            <SectionHeading kicker="05 · World Design" title="The World & the Five Worlds" />
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
                What the place is like to stand on: the texture, the relics, who is left
              </RampLink>
            </div>
          </div>
        </Reveal>

        {/* ═══ 06 · LEVEL DESIGN ═══
            Moved up four positions. The audit was blunt: this holds the solo
            audio credit and "the best material on the page", and "if anything
            this needs to move UP, not shrink". It is also the cheapest long
            section on the site to skim — 2,090 authored words, but four fifths
            of them sit behind the tab rail.

            Placed directly after the dossier so the pair read as one chapter,
            facts then play, and before the mechanics because a mechanic is
            easier to read once you know which world taught it. */}
        <Reveal>
          <div style={GAP} id={mainAnchors.levels}>
            <SectionHeading kicker="06 · Level Design" title="Each Planet Teaches a Skill" />
            <p style={LEAD}>
              The same five worlds, re-sequenced as a curriculum: what each one is built to teach,
              the puzzle that teaches it, and what it sounds like while it does.
            </p>
            <PlanetLevels />
          </div>
        </Reveal>

        {/* ═══ 07 · CORE MECHANICS ═══
            Condensed: what each system IS, plus the telepathy figure and the
            Conversation Panel on screen. The `decision → why → impact` rails
            are on the deep dive.

            The four channel bodies decode on scroll — the terminal effect this
            page used to carry on exactly this copy, before the four-card
            transmission band was superseded by this component and the effect
            went with the band by accident. */}
        <Reveal>
          <div style={GAP} id={mainAnchors.mechanics}>
            <SectionHeading kicker="07 · Core Mechanics" title="Systems That Force You Together" />
            <p style={LEAD}>
              Three systems, co-designed with the team, that all answer the same question: how do
              you make two players who cannot understand each other depend on each other anyway?
            </p>
            <ShatteredSkiesMechanics variant="main" />

            {/* The communication system as an interface rather than as a
                claim: the Conversation Panel is on screen, under fire, beside
                the objective and the weapon slot. */}
            <div style={{ marginTop: "2.5rem", maxWidth: "54rem" }}>
              <PlateGrid
                minWidth="100%"
                aspect="1728 / 1079"
                items={[
                  {
                    src: "/images/shattered-skies/shattered-skies-gameplay-ui.png",
                    label: "The communication channel, on screen",
                    alt: "In-game view of a corridor fight: the objective panel top-left, the weapon slot bottom-left, and the Conversation Panel bottom-right — the interface two players who cannot understand each other have to talk through.",
                    caption:
                      "The Conversation Panel, bottom right, sitting in the HUD next to the objective and the weapon slot. It is the only channel the two players get, and it is deliberately as load-bearing on screen as the ammo count.",
                  },
                ]}
              />
            </div>

            <div style={{ marginTop: "2rem" }}>
              <RampLink href={deepDiveHref("language")}>
                Why each channel is broken the way it is
              </RampLink>
            </div>
          </div>
        </Reveal>

        {/* ═══ 08 · CO-OP DESIGN ═══
            Condensed to the three schematics, which are drawn from `sides` —
            data, not prose — so they carry the whole split at almost no reading
            cost. The pattern that governs all three is folded in above them as
            five labels, because a rule belongs in front of the examples it
            governs. The full prose is on the deep dive. */}
        <Reveal>
          <div style={GAP} id={mainAnchors.coop}>
            <SectionHeading kicker="08 · Co-op Design" title="Split, Distorted, Rebuilt" />
            <p style={LEAD}>
              How the cooperation actually works, one system at a time: what each minigame takes
              away from which player, and what the pair have to invent to get it back.
            </p>
            <ShatteredSkiesCoop variant="main" />

            <div style={{ marginTop: "3rem" }}>
              <PlateGrid
                minWidth="26rem"
                items={[
                  {
                    src: "/images/shattered-skies/spaceship.png",
                    label: "The ship, annotated",
                    alt: "Hand-annotated schematic of the ship from above, marking the weapons, defence, radar, steering, landing gear, resource collection and the two entry points.",
                    caption:
                      "The working schematic. Every subsystem the repair minigames take away from one player and hand to the other is named and placed here — weapons, defence, radar, steering, landing gear, resource collection, and the two ways in.",
                  },
                ]}
              />
            </div>

            <div style={{ marginTop: "2rem" }}>
              <RampLink href={deepDiveHref("repairs")}>
                Each repair taken apart, and the five-step pattern every planetside puzzle follows
              </RampLink>
            </div>
          </div>
        </Reveal>

        {/* The hand-off. One panel: unlike Moon-Knight this project has a
            single subpage, so there is nowhere sideways to go. */}
        <Reveal>
          <div style={{ ...GAP, maxWidth: "34rem" }}>
            <CtaPanel
              kicker="The deep dive"
              title="The World, the Story and the Silence"
              body="The other half, whole and unsummarised: the full narrative and the three endings two sealed choices pick between, the world of Shatterstorm, and the reasoning behind every system built to stop two players understanding each other."
              href={deepDivePath}
              linkLabel="Read the deep dive"
            />
          </div>
        </Reveal>

        <Reveal>
          <ProjectNav items={projectNavItems} currentSlug={p.slug} />
        </Reveal>
      </Section>

      {/* Scoped to this page. Two layers: the starfield, then the hero. */}
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

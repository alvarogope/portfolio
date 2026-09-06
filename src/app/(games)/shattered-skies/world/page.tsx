import type { Metadata } from "next";
import Section from "@/components/layout/Section";
import SectionHeading from "@/components/layout/SectionHeading";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Reveal from "@/components/layout/Reveal";
import CtaPanel from "@/components/project/CtaPanel";
import PlateGrid from "@/components/project/PlateGrid";
import NarrativeMap from "@/components/project/NarrativeMap";
import ShatterstormWorld from "@/components/project/ShatterstormWorld";
import ShatteredSkiesMechanics from "@/components/project/ShatteredSkiesMechanics";
import ShatteredSkiesCoop from "@/components/project/ShatteredSkiesCoop";
import { deepDiveAnchors, mainHref, mainPath } from "@/content/shattered-skies-deep-dive";

export const metadata: Metadata = {
  title: "The World, the Story and the Silence | Shattered Skies",
  description:
    "The deep dive: Shattered Skies' full narrative and its three endings, the world of Shatterstorm, and the design reasoning behind every system that keeps two players from understanding each other.",
};

/* ═══════════════════════════════════════════════════════════════════════════
   SHATTERED SKIES · THE DEEP DIVE

   WHAT THIS PAGE IS FOR. The main page ran to ~8,100 rendered words across
   nine blocks — ten times the reading-load audit's benchmark — and the first
   frame of actual gameplay landed at 58% depth. It was split the same way
   Moon-Knight was, by KIND rather than by taste:

     · `/shattered-skies` keeps the built, working game — footage first, then
       the team's premise, my contributions, the planetary system you can
       operate, the teaching curriculum, and each system's claim with its
       evidence.
     · this page took the reasoning and the fiction, whole: the full story and
       its three endings, the world's soul, and the `decision → why → impact`
       argument behind every communication, ship, traversal and repair system.

   NOTHING WAS DELETED AND ALMOST NOTHING WAS SUMMARISED. The four Shattered
   Skies components render the same content files they always did; a `variant`
   prop decides which half of each one is on which page. No sentence renders
   twice. The keys that DO appear on both pages — a channel's label, a beat's
   title, the five puzzle-step labels — are what join a condensed entry to its
   full form, which is the mechanism of a keys-not-copy split, not a repeat.

   ORDER IS THE ARGUMENT. Story first, because a reader who clicked THROUGH to
   a deep dive has earned the fiction immediately rather than after three craft
   chapters. Then the world that fiction happens in. Then the reasoning, in the
   order the main page introduces the systems: the language barrier, the ship
   and the body, the three repairs, the planetside pattern. The design document
   last, because it is evidence rather than argument.

   THE ANCHORS ARE LOAD-BEARING, AND THEY RUN BOTH WAYS. Section ids come from
   `deepDiveAnchors`, the same object the main page's ramp links are built from,
   so a rename breaks the build instead of silently breaking a link. Two
   pointers on THIS page run the other way — the knowledge-gating signpost and
   the repairs hand-off both name sections that stayed on the main page — and
   those are built from `mainHref(anchor, "deep")`, which is why they carry a
   path here and a bare fragment there.

   WHY THE ORRERY IS NOT ON THIS PAGE. Hard constraint S5: selecting a world in
   the orrery scrolls the page to that world's dossier card through a DOM query
   (`ShatteredSkiesSystem`). Separate the two across pages and selection
   silently does nothing. They stay together, on the main page, where the
   knowledge-gating rule they absorbed is also stated and drawn.

   NO `ProjectNav`. This is a subpage, not a project: it navigates by breadcrumb
   at the top and a return panel at the foot, exactly as Moon-Knight's deep dive
   and the two engineering pages do. The palette, the Rajdhani fonts and the
   `Symbiochord` rail arrive free from `../layout.tsx`, which themes `body` for
   every route under `/shattered-skies`.
   ═══════════════════════════════════════════════════════════════════════════ */

export default function ShatteredSkiesWorldPage() {
  return (
    <Section>
      <Breadcrumb
        items={[
          { label: "Shattered Skies", href: mainPath },
          { label: "The deep dive" },
        ]}
      />

      <Reveal>
        <header style={{ marginTop: "1.5rem", maxWidth: "40rem" }}>
          <p
            className="mono"
            style={{ fontSize: "0.72rem", color: "var(--color-silver)", marginBottom: "1rem" }}
          >
            SHATTERED SKIES · STORY, WORLD & REASONING
          </p>
          <h1
            style={{
              fontSize: "var(--text-hero)",
              margin: 0,
              lineHeight: 1.05,
              fontFamily: "var(--font-hero)",
            }}
          >
            The World, the Story and the Silence
          </h1>
          <p style={{ fontSize: "var(--text-lg)", color: "var(--color-mist)", marginTop: "1rem" }}>
            The half of this project that is not a diagram: the whole story and the three endings
            two sealed choices pick between, the world it crosses, and the reasoning behind every
            system built to stop two players understanding each other.
          </p>
          {/* The attribution is stated ONCE, on the main page, by §03's
              teamNote. This is a pointer to it, not a second copy — the rule
              the ownership map sets for this project's most-repeated sentence. */}
          <p
            className="mono"
            style={{
              fontSize: "0.74rem",
              lineHeight: 1.7,
              color: "var(--color-mist)",
              marginTop: "1.25rem",
            }}
          >
            Team of 5 · my role: Systems &amp; World Designer.{" "}
            <a href={mainHref("theGame", "deep")} style={{ color: "var(--color-silver)" }}>
              What was mine and what was the team&rsquo;s
            </a>
          </p>
        </header>
      </Reveal>

      {/* ═══ 01 · THE STORY ═══
          The beat bodies, the sealed-choice mechanism and the three endings.
          The main page carries the diagram and the five beat NAMES; this is the
          prose that diagram is a picture of. */}
      <Reveal>
        <div style={{ marginTop: "5rem" }} id={deepDiveAnchors.story}>
          <SectionHeading kicker="01 · The Story" title="Two Backstories, Four Endings" />
          <div style={{ marginTop: "2rem" }}>
            <NarrativeMap variant="deep" />
          </div>
        </div>
      </Reveal>

      {/* ═══ 02 · THE WORLD ═══
          The setting's soul. The main page keeps only the thesis panel — a
          shattered planet for two shattered peoples — because the orrery under
          it is that claim's evidence. The texture, the relics and the politics
          are here. */}
      <Reveal>
        <div style={{ marginTop: "5rem" }} id={deepDiveAnchors.world}>
          <SectionHeading kicker="02 · World Design" title="The World of Shatterstorm" />
          <div style={{ marginTop: "2rem" }}>
            <ShatterstormWorld variant="deep" />
          </div>
        </div>
      </Reveal>

      {/* ═══ 03 · THE LANGUAGE ═══
          Four channels, each as decision → why → impact. The main page states
          what each channel IS; this is why each one is shaped that way. */}
      <Reveal>
        <div style={{ marginTop: "5rem" }} id={deepDiveAnchors.language}>
          <SectionHeading kicker="03 · Core Mechanics" title="A Language That Will Not Carry" />
          <p
            style={{
              color: "var(--color-mist)",
              maxWidth: "35rem",
              marginTop: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            The reasoning under the signature mechanic: for each of the four channels, the decision
            taken, why it was taken over the obvious alternative, and what it did to the way people
            actually play.
          </p>
          <ShatteredSkiesMechanics variant="deep" block="language" />
        </div>
      </Reveal>

      {/* ═══ 04 · THE SHIP AND THE BODY ═══ */}
      <Reveal>
        <div style={{ marginTop: "5rem" }} id={deepDiveAnchors.ship}>
          <SectionHeading kicker="04 · Core Mechanics" title="The Ship, and the Weight of a Body" />
          <p
            style={{
              color: "var(--color-mist)",
              maxWidth: "35rem",
              marginTop: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            The same reasoning for the other two systems: why the ship&rsquo;s controls are in two
            places at once, what the thruster does when it stops being a thruster, and why the best
            traversal in the game is the most exposed thing a player can do.
          </p>
          <ShatteredSkiesMechanics variant="deep" block="ship" />
        </div>
      </Reveal>

      {/* ═══ 05 · THE THREE REPAIRS ═══
          The schematics stay on the main page — they are drawn from `sides`,
          which is data, so they cost the condensed page almost nothing while
          carrying the whole split. This is the prose they are pictures of. */}
      <Reveal>
        <div style={{ marginTop: "5rem" }} id={deepDiveAnchors.repairs}>
          <SectionHeading kicker="05 · Co-op Design" title="The Three Repairs, In Full" />
          <ShatteredSkiesCoop variant="deep" block="repairs" />
        </div>
      </Reveal>

      {/* ═══ 06 · THE PLANETSIDE PATTERN ═══
          The main page states this pattern as five labels BEFORE the three
          repair descriptions, because a rule belongs in front of the examples
          it governs. This is each step written out, plus why the Symbiochord is
          in the puzzle design at all. */}
      <Reveal>
        <div style={{ marginTop: "5rem" }} id={deepDiveAnchors.pattern}>
          <SectionHeading kicker="06 · Co-op Design" title="The Planetside Pattern" />
          <ShatteredSkiesCoop variant="deep" block="pattern" />
        </div>
      </Reveal>

      {/* ═══ 07 · THE DESIGN DOCUMENT ═══
          The uncropped sheet. The main page shows the cropped diagram band;
          this is the whole working document, including the "Current Weakness"
          column where the backstory is criticised for being too black-and-white
          — which is the reason it belongs on a page a reader chose to open. */}
      <Reveal>
        <div style={{ marginTop: "5rem" }} id={deepDiveAnchors.document}>
          <SectionHeading kicker="07 · From the Desk" title="The Design Document" />
          <div style={{ marginTop: "2rem", maxWidth: "50rem" }}>
            <PlateGrid
              minWidth="100%"
              items={[
                {
                  src: "/images/shattered-skies/shattered-skies-gameplay-1.jpg.jpeg",
                  label: "The narrative sheet, uncropped",
                  alt: "The full narrative design document: a Backstories column, the Character Arc and Story Beats spine with five written beats, an Ending column listing Unity, Betrayal and Extinction, and a left-hand Current Weakness column criticising the backstory for being too black-and-white.",
                  caption:
                    "The working sheet the structure was authored on. The main page shows the diagram band across the top; this is the whole thing, including the column on the left where the backstory is marked down for being too black-and-white — the note that led to both species being written as convinced they are in the right.",
                },
              ]}
            />
          </div>
        </div>
      </Reveal>

      {/* The way back. One panel, because unlike Moon-Knight this project has
          no second subpage to go sideways to. */}
      <Reveal>
        <div style={{ marginTop: "5rem", maxWidth: "34rem" }}>
          <CtaPanel
            kicker="Back to the project"
            title="Shattered Skies"
            body="The built work: the game running, the team's premise, the five-world orbital system you can operate, the curriculum each planet teaches, and the three systems that force two players who cannot speak to depend on each other."
            href={mainPath}
            linkLabel="Back to Shattered Skies"
            accent="silver"
          />
        </div>
      </Reveal>
    </Section>
  );
}

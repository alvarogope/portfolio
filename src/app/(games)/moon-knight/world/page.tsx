import type { Metadata } from "next";
import Section from "@/components/layout/Section";
import SectionHeading from "@/components/layout/SectionHeading";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Reveal from "@/components/layout/Reveal";
import CtaPanel from "@/components/project/CtaPanel";
import NarrativeDesign from "@/components/project/NarrativeDesign";
import Cast from "@/components/project/Cast";
import DiegeticDesign from "@/components/project/DiegeticDesign";
import ArtDirection from "@/components/project/ArtDirection";
import AudioDesign from "@/components/project/AudioDesign";
import MoonKnightAudio from "@/components/project/MoonKnightAudio";
import Expansions from "@/components/project/Expansions";
import Jousting from "@/components/project/Jousting";
import { deepDiveAnchors } from "@/content/moon-knight-deep-dive";

export const metadata: Metadata = {
  title: "The World, the Story and the Score | Moon-Knight",
  description:
    "The deep dive: Moon-Knight's three-act arc and its reversal, the cast, the symbolism, the jousting minigame, and the full diegetic, art-direction and score arguments.",
};

/* ═══════════════════════════════════════════════════════════════════════════
   MOON-KNIGHT · THE DEEP DIVE

   WHAT THIS PAGE IS FOR. The main page was condensed from ~7,650 words to
   ~2,600 so a recruiter's first minute meets built, working systems. This is
   where the other half went — whole, not summarised. Nothing on this page was
   rewritten in the move: the sections render the same components against the
   same content files they always did.

   ORDER IS THE ARGUMENT. Story first, because the reversal is the best writing
   on the project and a reader who clicked THROUGH to a deep dive has earned it
   immediately rather than after four craft sections. Then who is in the story,
   then what it all means, then the three crafts that serve it — systems, look,
   sound — then the joust, then where it would go next.

   THE JOUST IS THE ONE SECTION THAT ARRIVED FROM THE MAIN PAGE AS A CUT rather
   than as a split, and it passes the page's own test on merit, not on length:
   it is a diversion, and a diversion is material a reader CHOOSES. It also
   reads better here, two screens under the cast that introduces the knight who
   teaches it.

   THE ANCHORS ARE LOAD-BEARING. Four links from elsewhere land on this page:
   the main page's opening statement (→ score), and its three ramp links (→
   diegetic, art, score), plus every character link on the world map (→
   `#cast-<id>`, rendered by `Cast` below). Section ids come from
   `deepDiveAnchors`, the same object those links are built from, so a rename
   cannot silently break one of them — it breaks the build instead.

   NO `ProjectNav`. This is a subpage, not a project: it navigates by
   breadcrumb at the top and a return panel at the foot, exactly as the two
   engineering pages do. Fonts and the `MoonProgress` rail arrive free from
   `../layout.tsx`, which wraps every route under `/moon-knight`.
   ═══════════════════════════════════════════════════════════════════════════ */

export default function MoonKnightWorldPage() {
  return (
    <Section>
      <Breadcrumb
        items={[
          { label: "Moon-Knight", href: "/moon-knight" },
          { label: "The deep dive" },
        ]}
      />

      <Reveal>
        <header style={{ marginTop: "1.5rem", maxWidth: "40rem" }}>
          <p
            className="mono"
            style={{ fontSize: "0.72rem", color: "var(--color-silver)", marginBottom: "1rem" }}
          >
            MOON-KNIGHT · STORY, SYMBOL & SCORE
          </p>
          <h1
            style={{
              fontSize: "var(--text-hero)",
              margin: 0,
              lineHeight: 1.05,
              fontFamily: "var(--font-hero)",
            }}
          >
            The World, the Story and the Score
          </h1>
          <p style={{ fontSize: "var(--text-lg)", color: "var(--color-mist)", marginTop: "1rem" }}>
            The half of this project that is not a system: the arc and its reversal, the people in
            it, the symbols it is built from, the reasoning behind how it looks and sounds, and the
            minigame that outgrew the game it was a diversion from.
          </p>
        </header>
      </Reveal>

      {/* NO STANDFIRST BLOCK HERE, AND THE REASON IS A DUPLICATION AUDIT.

         This page carried an `OpeningStatement` quoting two lines by key: the
         reversal from §01 and the silence thesis from §06. That is the right
         pattern on the MAIN page, where the section a line is quoted from is
         thousands of words below and most readers never reach it. Here both
         owners are on the same page, so a reader met each sentence twice in
         one scroll — the served HTML had `reversal.body` and
         `silenceThesis.line` rendered twice apiece.

         The header above already does the standfirst job, and it says what
         this page is rather than borrowing a line from inside it. */}

      {/* 01 — the arc, the reversal, and the plot in a <details> */}
      <Reveal>
        <div
          id={deepDiveAnchors.narrative}
          style={{ marginTop: "4rem", scrollMarginTop: "2rem" }}
        >
          <SectionHeading kicker="01 · Narrative Design" title="Three Acts, One Moon" />
          <p
            style={{
              color: "var(--color-mist)",
              maxWidth: "35rem",
              marginTop: "1.5rem",
              marginBottom: "1.75rem",
            }}
          >
            The story is told by the world, not by cutscenes. Centralis is the prologue; the three
            acts that follow are the three lands — three moon phases, three ages of a life — and a
            reversal in the last one that re-reads everything before it.
          </p>
          <NarrativeDesign />
        </div>
      </Reveal>

      {/* 02 — THE CAST. The `#cast-<id>` anchors live here now, and the world
          map on the main page links to every one of them by full path. Moving
          or renaming this section means updating `castHref`. */}
      <Reveal>
        <div
          id={deepDiveAnchors.cast}
          style={{ marginTop: "5rem", scrollMarginTop: "2rem" }}
        >
          <Cast kicker="02 · The Cast" />
        </div>
      </Reveal>

      {/* 03 — symbolism. Currently rendered by `NarrativeDesign` above as its
          themes and story-through-mechanics bands; the anchor exists so the
          motifs are addressable and so a future split has somewhere to land
          without inventing a new id. */}
      <Reveal>
        <div
          id={deepDiveAnchors.motifs}
          style={{ marginTop: "5rem", scrollMarginTop: "2rem" }}
        >
          <SectionHeading kicker="03 · Symbolism" title="The Motifs the World Is Built From" />
          <p
            style={{
              color: "var(--color-mist)",
              maxWidth: "35rem",
              marginTop: "1.5rem",
            }}
          >
            The willow, the triskelion and the piano recur across every discipline on this
            project — they are read as themes in the arc above, as rules in the diegetic systems
            below, and as instrumentation in the score. Each section states what the symbol does
            in its own terms; none of them restates the others.
          </p>
        </div>
      </Reveal>

      {/* 04 — diegetic design, in full */}
      <Reveal>
        <div
          id={deepDiveAnchors.diegetic}
          style={{ marginTop: "5rem", scrollMarginTop: "2rem" }}
        >
          <SectionHeading kicker="04 · Diegetic Design" title="Mechanics That Hide in the World" />
          <p
            style={{
              color: "var(--color-mist)",
              maxWidth: "35rem",
              marginTop: "1.5rem",
              marginBottom: "1.75rem",
            }}
          >
            The main page shows what each system became. This is why each one was built that way,
            what the roses buy, and the four decisions the player never sees a screen for.
          </p>
          <DiegeticDesign />
        </div>
      </Reveal>

      {/* 05 — art direction, in full */}
      <Reveal>
        <div
          id={deepDiveAnchors.art}
          style={{ marginTop: "5rem", scrollMarginTop: "2rem" }}
        >
          <SectionHeading kicker="05 · Art Direction" title="The Sublime, Made Playable" />
          <p
            style={{
              color: "var(--color-mist)",
              maxWidth: "35rem",
              marginTop: "1.5rem",
              marginBottom: "1.75rem",
            }}
          >
            One aesthetic idea and every rule it decides — how the player travels, what the world
            is made of, how big the bosses are, and how hard it is to see what is about to kill
            you.
          </p>
          <ArtDirection />
        </div>
      </Reveal>

      {/* 06 — the score, in full. The two recordings render here as well as on
          the main page: `AudioDesign` takes them as children, so both depths
          play the same two files and neither holds a second copy of them. */}
      <Reveal>
        <div
          id={deepDiveAnchors.score}
          style={{ marginTop: "5rem", scrollMarginTop: "2rem" }}
        >
          <SectionHeading kicker="06 · Score & Audio Design" title="Music for a Borrowed Moon" />
          <p
            style={{
              color: "var(--color-mist)",
              maxWidth: "35rem",
              marginTop: "1.5rem",
              marginBottom: "1.75rem",
            }}
          >
            I composed the game&apos;s score, and designed the rules it obeys: where music is
            allowed to play, what each instrument is permitted to mean, and why most of this game
            is scored with nothing but footsteps.
          </p>
          <AudioDesign>
            <MoonKnightAudio />
          </AudioDesign>
        </div>
      </Reveal>

      {/* 07 — THE JOUST, moved here from the main page.

          It was §09 there, between the beat chart and the diegetic section,
          and it was taking a pillar's worth of vertical space for a side
          feature. It is a good piece of design — a complete risk table, two
          actions against three timings — but it is a DIVERSION, and a reader
          who wants the diversions is the reader who clicked through to a deep
          dive. That is the test this page applies to everything on it.

          It also lands better here than it read there: Orpheus, who teaches
          the joust, is described by the cast in §02 above. On the main page he
          arrived as an unattached proper noun, which is why a one-clause
          introduction had been drafted for him. That clause is deleted rather
          than moved — §02 is two screens up, and a second introduction to a
          character the cast owns is exactly the duplication this project
          spends its structure avoiding. */}
      <Reveal>
        <div
          id={deepDiveAnchors.jousting}
          style={{ marginTop: "5rem", scrollMarginTop: "2rem" }}
        >
          <SectionHeading kicker="07 · A Side Feature" title="The Jousting Minigame" />
          <p
            style={{
              color: "var(--color-mist)",
              maxWidth: "35rem",
              marginTop: "1.5rem",
              marginBottom: "1.75rem",
            }}
          >
            The Woods still keeps the duelling tradition of a fallen noble house. Two riders, two
            lances, and one moment to decide.
          </p>
          <Jousting />
        </div>
      </Reveal>

      {/* 08 — the expansions. Two concepts, no roadmap. Each one's `mechanic`
          must keep matching an ability name in `games/moon-knight.ts` exactly —
          that cross-reference is the section's entire claim, and it is now a
          cross-PAGE reference, so nothing enforces it but this note and the
          one in `moon-knight-expansions.ts`. */}
      <Reveal>
        <div
          id={deepDiveAnchors.expansions}
          style={{ marginTop: "5rem", scrollMarginTop: "2rem" }}
        >
          <SectionHeading kicker="08 · And Beyond" title="Where the World Goes Next" />
          <p
            style={{
              color: "var(--color-mist)",
              maxWidth: "35rem",
              marginTop: "1.5rem",
              marginBottom: "1.75rem",
            }}
          >
            Two expansion concepts, each grown from a quantum mechanic the game already has.
            Unbuilt, and kept here as evidence of the same thing the project argues throughout:
            that these systems generate story on their own.
          </p>
          <Expansions />
        </div>
      </Reveal>

      {/* The way back, and the way sideways. */}
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
            kicker="Back to the project"
            title="Moon-Knight"
            body="The built work: the quantum combat systems, the creatures they are taught through, the control scheme, the world of Kaelum, the beat chart the game was planned from, and the engine limit that turned into a C++ toolkit."
            href="/moon-knight"
            linkLabel="Back to Moon-Knight"
            accent="silver"
          />
          <CtaPanel
            kicker="The other subpage"
            title="Game Engineering"
            body="How the game is actually built: what lives in Blueprint and what lives in C++, the combat state machine, the data-driven tuning layer, and captures from the editor."
            href="/moon-knight/engineering"
            linkLabel="Read the engineering write-up"
            accent="silver"
          />
        </div>
      </Reveal>
    </Section>
  );
}

/**
 * Seeds of Tomorrow — level & puzzle design: the rhythm of a place.
 *
 * WHY THIS FILE EXISTS. `facts.role` on this project is "Composer & Level
 * Designer" and `disciplines` lists "Level & puzzle design" and "Pacing" — and
 * until this section was built the page had a score section, a weather section
 * and nothing that showed the level work. The evidence was already written: the
 * four-beat loop (fight → recover the seed → solve the place → the sky turns)
 * lived inside `seeds-weather.ts` as the weather component's third band, which
 * made the pacing design read as a footnote to the weather rather than the
 * thing the weather is the payoff of. It moved here. See
 * docs/section-ownership-map.md, Gap G1.
 *
 * OWNERSHIP. This file owns the loop, its two halves, and the puzzle/pacing
 * credit. It does NOT own the weather: the sky turning is the loop's last beat,
 * and everything about *what* the sky does — the flip, the trigger, the five
 * weathers — stays in `seeds-weather.ts` and is reached from here by a pointer,
 * not restated.
 *
 * NOTHING HERE IS INVENTED. Every claim is a re-homing of copy already on the
 * Seeds page: the four steps and `loopNote` as they stood in `seeds-weather.ts`,
 * and the two contribution bullets in `games/seeds-of-tomorrow.ts` that this
 * section exists to show rather than assert — "Level & puzzle design" and
 * "Progression & pacing". No level count, no puzzle taxonomy and no difficulty
 * curve is claimed, because none is recorded anywhere in the repo.
 *
 * GEOMETRY lives in `SeedsLevelDesign`. Nothing here knows a pixel.
 */

/* ---- the two halves of the beat ------------------------------------------
   The credited pacing rhythm, named. `loopSteps` below tags each step with the
   half it belongs to, so the diagram can show where the arc turns over rather
   than asserting that it does. */

export type LoopHalf = "tension" | "restoration";

export interface Half {
  id: LoopHalf;
  label: string;
  /** The half in one line, on the band. */
  body: string;
}

export const halves: readonly Half[] = [
  {
    id: "tension",
    label: "The tension half",
    body:
      "Bursts of pressure against the monsters the pollution twisted out of the place, and the " +
      "search for the seed that is the means of bringing it back.",
  },
  {
    id: "restoration",
    label: "The restorative half",
    body:
      "The quieter work the tension resolves into: the puzzle that heals the area, the planting, " +
      "and then the place letting go.",
  },
];

/* ---- the loop ------------------------------------------------------------
   Moved out of `seeds-weather.ts`, where it was the weather diagram's third
   band. The only addition is `half`, which is what makes it a pacing diagram
   rather than a list of four things. */

export interface LoopStep {
  id: string;
  index: string;
  name: string;
  body: string;
  /** Which side of the rhythm this beat sits on. */
  half: LoopHalf;
  /** True for the step where the sky changes — the loop's payoff beat. */
  isPayoff?: boolean;
}

export const loopSteps: readonly LoopStep[] = [
  {
    id: "fight",
    index: "01",
    name: "Fight",
    half: "tension",
    body: "A burst of tension against the monsters the pollution twisted out of the place.",
  },
  {
    id: "recover",
    index: "02",
    name: "Recover the seed",
    half: "tension",
    body: "The Seeds of Tomorrow are the means of bringing life back, and they have to be found.",
  },
  {
    id: "solve",
    index: "03",
    name: "Solve the place",
    half: "restoration",
    body:
      "The quieter, restorative half of the rhythm: the puzzle that heals the area, and the planting.",
  },
  {
    id: "turn",
    index: "04",
    name: "The sky turns",
    half: "restoration",
    body: "The acid rain over that place runs clean and life returns to it. Then the next place.",
    isPayoff: true,
  },
];

/** The pacing argument the loop exists to make. Was `loopNote` in the weather file. */
export const loopNote =
  "The weather is the last beat of the loop, not a layer over it. I paced the game as combat " +
  "resolving into restoration — tension, then the quieter work of solving a place — and the sky " +
  "turning is the resolution at the end of that arc. Which is why it had to be the world and not " +
  "a meter: a bar ticking up cannot be the emotional payoff of a fight.";

/**
 * The one line the payoff beat gets instead of re-describing the weather. The
 * flip, the trigger and the five skies belong to the weather section; this
 * points at it and stops.
 */
export const payoffPointer = {
  label: "What the sky does",
  href: "#weather",
  body: "The beat this loop lands on is the weather section below — it owns the flip and the skies.",
};

/* ---- the puzzles ---------------------------------------------------------
   The "Level & puzzle design" bullet, re-homed from `contributions` into the
   section that shows it. Deliberately unspecific: the repo records that the
   levels and their puzzles are mine and that each space is built around the
   loop, and records nothing about how many or of what kind. */

export const puzzleNote = {
  tag: "Level & puzzle design",
  body:
    "I designed the levels and the puzzles the player solves to recover and plant the seeds, " +
    "building each space around the same rhythm: clear what the pollution left in it, then do " +
    "the work that brings it back. The puzzle is the hinge — it is what the fight resolves into " +
    "and what the sky answers.",
};

/* ---- screen-reader summary ----------------------------------------------- */

/** The loop diagram, said once in prose, for the SVG's `desc`. */
export const loopSummary =
  "A four-step loop: fight the monsters, recover the seed, solve the place and plant it, and then " +
  "the sky turns clean over it. The loop then returns to the first step at the next place. The " +
  "first two steps are the tension half of the rhythm, the last two the restorative half, and the " +
  "weather change is the payoff at the end of the arc.";

/* ---- attribution ---------------------------------------------------------
   Seeds was a team of five. This block claims the level and pacing design, in
   the same voice `weatherCredit` claims the weather — and it is the visible
   evidence for the "Level Designer" half of the credited role. */

export const levelCredit = {
  role: "Composer & Level Designer",
  team: "Team of 5",
  body:
    "Seeds of Tomorrow was made by five of us. The levels, their puzzles and the rhythm above are " +
    "mine, alongside the score and the weather. The loop is the design decision the rest of the " +
    "page rests on: everything else — the sky as the readout, the tracks that change with a " +
    "place — is arranged to make its last beat land.",
};

/* ---- where each credited contribution is shown --------------------------
   The section-04 reconciliation. `contributions` on this project used to be
   four bullets on a four-section page, two of them recapping the sections
   directly above and two of them claiming work that had no section at all.
   Now that every one of the four has an owner, the role section routes to the
   owner instead of restating it: keys, not copy. Keyed by
   `contributions[].label`; any label without an entry falls back to printing
   its description. */

export interface ContributionHome {
  /** The section that shows the work, as it reads on the page. */
  section: string;
  /** In-page anchor of that section. */
  href: string;
  /** What is there to look at, in a handful of words. */
  shown: string;
}

export const contributionHomes: Readonly<Record<string, ContributionHome>> = {
  "Original score (11 tracks)": {
    section: "02 · Original Score",
    href: "#score",
    shown: "Three of the eleven tracks, planted and playable.",
  },
  "Level & puzzle design": {
    section: "03 · Level Design",
    href: "#level-design",
    shown: "The loop every space is built around, and the puzzle at its hinge.",
  },
  "Progression & pacing": {
    section: "03 · Level Design",
    href: "#level-design",
    shown: "The rhythm drawn: two beats of tension resolving into two of restoration.",
  },
  "Weather & environmental feedback": {
    section: "04 · The Hard Part",
    href: "#weather",
    shown: "The flip, the five skies, and the one trigger that reaches all of them.",
  },
};

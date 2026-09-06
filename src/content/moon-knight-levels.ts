/**
 * Moon-Knight — the level design beat chart.
 *
 * The four levels of the game planned across every design dimension at once:
 * the space, what the player is there to do, who they meet, what tries to stop
 * them, and what it looks and sounds like while it happens. This is the
 * PLANNING view — the sheet the level was actually built from — so every cell
 * is kept to a phrase. The full descriptions live in their own sections: the
 * creatures in `moon-knight-bestiary.ts`, the characters in
 * `moon-knight-cast.ts`, the look in `moon-knight-art.ts` and the score in
 * `moon-knight-audio.ts`. Repeating them here would turn a chart into an essay
 * and cost it the one thing it is for, which is being read ACROSS.
 *
 * FOUR LOCATIONS, THREE ACTS. Centralis — the lake island the Moon-Knight
 * wakes on — is the PROLOGUE. It is played as a level, but it sits OUTSIDE the
 * act count: no fragment is there and no land is claimed, and the story proper
 * starts when the first fragment does. The three acts are the three lands
 * (`moon-knight-narrative.ts`), one fragment each. `stageLabel` below stamps
 * that on every level, so a count of FOUR on this page is always a count of
 * locations and a count of THREE is always a count of acts.
 *
 * THE MOON IS THE PROGRESSION. Each level is stamped with the phase the game is
 * in when the player plays it, and the phases WAX: crescent, first quarter,
 * gibbous, full. That is not decoration — the moon is the spine of the whole
 * project (the three acts in `moon-knight-narrative.ts`, the health readout in
 * `moon-knight-diegetic.ts`), so the level order and the lunar cycle are the
 * same line drawn twice. By the last level the moon is full, which is exactly
 * when the Sun-Knight arrives.
 *
 * The narrative's three moons are not a second cycle disagreeing with this
 * one. An act's moon is the FRAGMENT recovered in it — crescent, half, full —
 * and a level's moon is the SKY it is played under. Four skies over four
 * locations, three fragments across three acts, one motif.
 *
 * `phase` reuses the vocabulary of `MoonPhaseGlyph` so the discs on this chart
 * are the SAME discs as the ones crowning the narrative arc. Do not invent a
 * phase name here without adding the geometry there.
 *
 * READ THE ROWS, NOT ONLY THE COLUMNS. The chart is authored so that any one
 * dimension read left to right is a deliberate escalation — the audio row runs
 * silence, whispers, singing, harmonics; the visuals row runs shadow, rain,
 * fog, snow. `arc` distils that into one phrase per level.
 */

/* ---- the dimensions -----------------------------------------------------
   The row order of the matrix and the field order of every level, kept in one
   place so the table, the mobile cards and the detail sheet can never drift
   out of agreement about what a level is made of.

   `group` is what the DETAIL SHEET clusters by, and it is an argument about
   how a level gets designed: you place it and give the player a reason to be
   there (space & goal), you decide what it costs (threat), then you decide
   what it feels like (mood). Three passes, that order.

   WHY THERE IS NO `cast` OR `enemies` ROW. There was, and they were a second
   copy. The world map renders exactly those facts — who you meet in a place,
   what fights you there — as LINKS into the cast and the bestiary, which is a
   strictly better rendering of them, and since the map and this chart merged
   into one section the repeat sits half a screen apart. The map owns WHO IS
   WHERE; this chart owns WHAT A LEVEL IS LIKE TO PLAY. `boss` stays here
   because which fight caps a level is a plan decision, not a fact about a
   place. */

export type DimensionId =
  | "space"
  | "objective"
  | "quest"
  | "boss"
  | "visuals"
  | "audio";

export type DimensionGroup = "space-goal" | "cast-threat" | "mood";

export interface BeatDimension {
  id: DimensionId;
  /** The matrix row header. Short — it is repeated in every mobile card. */
  label: string;
  group: DimensionGroup;
}

export const beatDimensions: readonly BeatDimension[] = [
  { id: "space", label: "Space", group: "space-goal" },
  { id: "objective", label: "Objective", group: "space-goal" },
  { id: "quest", label: "Story / Quest", group: "space-goal" },
  { id: "boss", label: "Boss", group: "cast-threat" },
  { id: "visuals", label: "Visuals", group: "mood" },
  { id: "audio", label: "Audio", group: "mood" },
] as const;

export const dimensionGroups: readonly { id: DimensionGroup; label: string }[] = [
  { id: "space-goal", label: "Space & goal" },
  { id: "cast-threat", label: "Threat" },
  { id: "mood", label: "Mood" },
] as const;

/* ---- the levels --------------------------------------------------------- */

/** Matches `MoonPhaseName` in `components/project/MoonPhaseGlyph.tsx`. */
export type LevelMoonPhase = "crescent" | "half" | "gibbous" | "full";

export type LevelId = "tutorial" | "woods" | "misty-lands" | "frozen-mountains";

/**
 * One cell of the chart. `null` is an honest blank — that dimension is not part
 * of the level's plan — and renders as a dash rather than being invented.
 */
export type BeatCell = string | null;

export interface BeatLevel {
  id: LevelId;
  /** "Level 01". Authored, not derived, so the copy can change without maths. */
  ordinal: string;
  /**
   * Where the level sits in the NARRATIVE structure: "Prologue" for Centralis,
   * then "Act I"–"Act III", one per land. Authored to match `actLabel` in
   * `moon-knight-narrative.ts`, and the field that stops four levels and three
   * acts reading as two different counts.
   */
  stageLabel: string;
  name: string;
  /** The place, in a few words. Sits under the moon on the rail. */
  subtitle: string;
  phase: LevelMoonPhase;
  /** The phase in words. The glyph is decorative; this is what is announced. */
  phaseLabel: string;
  /** Keyed by `DimensionId` — every dimension present, blanks explicit. */
  cells: Record<DimensionId, BeatCell>;
  /** Marks the Sun-Knight. Drives the FINAL flag on the boss row. */
  finalBoss?: boolean;
  /**
   * How the level's layers cohere — ONE non-obvious thought about why these
   * nine cells belong to each other. The payoff of the detail sheet: the chart
   * shows the parts, this says what they add up to.
   *
   * HALVED, DELIBERATELY, AND IT MUST STAY HALVED. These ran ~70 words each
   * and drifted into re-listing the cells directly above them — "Banshees hide
   * inside it, ghosts drift through, the voices singing in it are the enemy
   * audio" restates three cells the reader has just read, and two facts the
   * bestiary and the audio section own outright. A cohesion line that names
   * its own cells is telling the reader nothing; it should make the one claim
   * the chart cannot make on its own, and stop. Target: one sentence.
   */
  cohesion: string;
  /** The level in three beats: what you see, what you hear, what fights you. */
  arc: string;
}

export const beatLevels: readonly BeatLevel[] = [
  {
    id: "tutorial",
    ordinal: "Level 01",
    stageLabel: "Prologue",
    name: "Tutorial",
    subtitle: "Lake Island",
    phase: "crescent",
    phaseLabel: "Waxing crescent",
    cells: {
      space: "Lake Island",
      objective: "Get to the boat and escape",
      quest: "Prompt start",
      boss: "The Werewolf",
      visuals: "Lots of shadows, green scenarios",
      audio: "Footsteps (silence)",
    },
    cohesion:
      "One island, one way off it, and no score to hide behind — so the game trains the ear " +
      "before it trains the sword.",
    arc: "shadow · footsteps · soldiers",
  },
  {
    id: "woods",
    ordinal: "Level 02",
    stageLabel: "Act I",
    name: "The Woods",
    subtitle: "Talking woods & the cemetery",
    phase: "half",
    phaseLabel: "First quarter, waxing",
    cells: {
      space: "Talking woods & the cemetery",
      objective: "Get the 1st Moon Fragment",
      quest: null,
      boss: "The Wizard-Knight",
      visuals: "Green scenarios in the rain, colourful flowers",
      audio: "Whispers in the wind",
    },
    cohesion:
      "The forest is a character before it is a place: everything that fights you here is the " +
      "woods standing up.",
    arc: "rain · whispers · the forest itself",
  },
  {
    id: "misty-lands",
    ordinal: "Level 03",
    stageLabel: "Act II",
    name: "Misty Lands",
    subtitle: "City of Mists & the Haunted Castle",
    phase: "gibbous",
    phaseLabel: "Waxing gibbous",
    cells: {
      space: "City of Mists & the Haunted Castle in ruins",
      objective: "Get the 2nd Moon Fragment",
      quest: "End the banshees' menace",
      boss: "The Centaur-Knight",
      visuals: "Foggy scenarios",
      audio: "Voices singing in the fog",
    },
    cohesion:
      "Fog is not weather here, it is the level geometry — it decides what you are allowed to " +
      "see and therefore what can reach you.",
    arc: "fog · singing · what hides in it",
  },
  {
    id: "frozen-mountains",
    ordinal: "Level 04",
    stageLabel: "Act III",
    name: "Frozen Mountains",
    subtitle: "The catacombs & the astronomers' castle",
    phase: "full",
    phaseLabel: "Full moon",
    cells: {
      space: "The catacombs & the astronomers' castle",
      objective: "Get the 3rd Moon Fragment",
      quest: "Follow the Witch, the Druid, or Death",
      boss: "The Sun-Knight",
      visuals: "Rocky & snowy",
      audio: "High-pitch music & harmonics",
    },
    finalBoss: true,
    cohesion:
      "The moon is full and every mask is off: three allies want the same loyalty, only one gets " +
      "it, and the last fight is waiting at the end of whichever was chosen.",
    arc: "snow · harmonics · ice knights",
  },
] as const;

/** Blank cells render as this. One dash, defined once. */
export const emptyCell = "—";

/** What a blank cell is announced as, since a dash reads as nothing. */
export const emptyCellLabel = "Not part of this level";

/**
 * The chart in one paragraph — what the escalation is FOR. Sits above the rail
 * so a reader who gives this section five seconds still leaves with the claim.
 */
export const beatChartThesis =
  "Four levels, planned as one line: a prologue on the lake island, then one act per land. Each is " +
  "stamped with the moon phase the game is in when it is played, and every dimension is tuned to " +
  "wax with it: the light, the weather, the sound and what hides inside it all escalate together, " +
  "from a silent island to a full moon over the Sun-Knight.";

/**
 * The line that reconciles the two counts, printed under the rail. The page
 * shows four moons here and three above the narrative arc, and this is the one
 * place that says why — so a reader counting moons is never left to guess
 * whether they are looking at one cycle or two.
 */
export const beatStructureNote =
  "Centralis is the prologue: a level to play, but before the arc — no fragment, no act. The three " +
  "acts are the three lands that follow it, one fragment each. So the sky waxes across four " +
  "locations while the story runs in three: the moons crowning the narrative arc are the fragments " +
  "recovered, and the moons on this rail are the nights they are taken under.";

export const arcCaption =
  "The escalation, read across: what you see · what you hear · what fights you.";

export function getBeatLevel(id: LevelId): BeatLevel {
  const level = beatLevels.find((l) => l.id === id);
  if (!level) throw new Error(`Unknown level: ${id}`);
  return level;
}

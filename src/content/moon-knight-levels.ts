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
 * THE MOON IS THE PROGRESSION. Each level is stamped with the phase the game is
 * in when the player plays it, and the phases WAX: crescent, first quarter,
 * gibbous, full. That is not decoration — the moon is the spine of the whole
 * project (the three acts in `moon-knight-narrative.ts`, the health readout in
 * `moon-knight-diegetic.ts`), so the level order and the lunar cycle are the
 * same line drawn twice. By the last level the moon is full, which is exactly
 * when the Sun-Knight arrives.
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
   there (space & goal), you decide who is in it and what it costs (cast &
   threat), then you decide what it feels like (mood). Three passes, that
   order. */

export type DimensionId =
  | "space"
  | "objective"
  | "quest"
  | "mode"
  | "cast"
  | "enemies"
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
  { id: "mode", label: "Game mode", group: "space-goal" },
  { id: "cast", label: "Cast", group: "cast-threat" },
  { id: "enemies", label: "Enemies", group: "cast-threat" },
  { id: "boss", label: "Boss", group: "cast-threat" },
  { id: "visuals", label: "Visuals", group: "mood" },
  { id: "audio", label: "Audio", group: "mood" },
] as const;

export const dimensionGroups: readonly { id: DimensionGroup; label: string }[] = [
  { id: "space-goal", label: "Space & goal" },
  { id: "cast-threat", label: "Cast & threat" },
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
   * How the level's layers cohere — one thought about why these nine cells
   * belong to each other. The payoff of the detail sheet: the chart shows the
   * parts, this says what they add up to.
   */
  cohesion: string;
  /** The level in three beats: what you see, what you hear, what fights you. */
  arc: string;
}

export const beatLevels: readonly BeatLevel[] = [
  {
    id: "tutorial",
    ordinal: "Level 01",
    name: "Tutorial",
    subtitle: "Lake Island",
    phase: "crescent",
    phaseLabel: "Waxing crescent",
    cells: {
      space: "Lake Island",
      objective: "Get to the boat and escape",
      quest: "Prompt start",
      mode: "Jousting (introduced)",
      cast: "Death",
      enemies: "Soldiers",
      boss: "The Werewolf",
      visuals: "Lots of shadows, green scenarios",
      audio: "Footsteps (silence)",
    },
    cohesion:
      "An island with one way off it, taught in the dark. There is no score to hide behind: the " +
      "shadows take the soldiers' silhouettes and footsteps are the only thing the player can " +
      "hear coming, so the game trains the ear before it trains the sword.",
    arc: "shadow · footsteps · soldiers",
  },
  {
    id: "woods",
    ordinal: "Level 02",
    name: "The Woods",
    subtitle: "Talking woods & the cemetery",
    phase: "half",
    phaseLabel: "First quarter, waxing",
    cells: {
      space: "Talking woods & the cemetery",
      objective: "Get the 1st Moon Fragment",
      quest: null,
      mode: null,
      cast: "The Witch",
      enemies: "Wooden & amphibian humanoids",
      boss: "Priest-Knight",
      visuals: "Green scenarios in the rain, colourful flowers",
      audio: "Whispers in the wind",
    },
    cohesion:
      "The forest is a character before it is a place. The wooden and amphibian humanoids are the " +
      "woods standing up, the whispers in the wind are it talking, and in the rain the flowers " +
      "are the only colour that carries — so the player reads the level by what blooms in it.",
    arc: "rain · whispers · the forest itself",
  },
  {
    id: "misty-lands",
    ordinal: "Level 03",
    name: "Misty Lands",
    subtitle: "City of Mists & the Haunted Castle",
    phase: "gibbous",
    phaseLabel: "Waxing gibbous",
    cells: {
      space: "City of Mists & the Haunted Castle in ruins",
      objective: "Get the 2nd Moon Fragment",
      quest: "End the banshees' menace",
      mode: null,
      cast: "The Druid",
      enemies: "Banshees hidden in fog, ghosts of past times",
      boss: "The Centaur",
      visuals: "Foggy scenarios",
      audio: "Voices singing in the fog",
    },
    cohesion:
      "Fog is the level. Banshees hide inside it, ghosts drift through, the voices singing in it " +
      "are the enemy audio; the ruined castle only shows in pieces.",
    arc: "fog · singing · what hides in it",
  },
  {
    id: "frozen-mountains",
    ordinal: "Level 04",
    name: "Frozen Mountains",
    subtitle: "The catacombs & the astronomers' castle",
    phase: "full",
    phaseLabel: "Full moon",
    cells: {
      space: "The catacombs & the astronomers' castle",
      objective: "Get the 3rd Moon Fragment",
      quest: "Follow the Witch, the Druid, or Death",
      mode: null,
      cast: "The Witch, The Druid, Death",
      enemies: "Ice knights & wizards",
      boss: "The Sun-Knight",
      visuals: "Rocky & snowy",
      audio: "High-pitch music & harmonics",
    },
    finalBoss: true,
    cohesion:
      "The moon is full and every mask is off: the Witch, the Druid and Death all want the same " +
      "loyalty and only one of them gets it. Rock and snow leave nowhere to read cover from, the " +
      "harmonics ring high and thin above it, and the Sun-Knight is waiting at the end of " +
      "whichever allegiance was chosen.",
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
  "Four levels, planned as one line. Each is stamped with the moon phase the game is in when it " +
  "is played, and every dimension is tuned to wax with it: the light, the weather, the sound and " +
  "what hides inside it all escalate together, from a silent island to a full moon over the " +
  "Sun-Knight.";

export const arcCaption =
  "The escalation, read across: what you see · what you hear · what fights you.";

export function getBeatLevel(id: LevelId): BeatLevel {
  const level = beatLevels.find((l) => l.id === id);
  if (!level) throw new Error(`Unknown level: ${id}`);
  return level;
}

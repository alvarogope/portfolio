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

export type LevelMoonPhase = "crescent" | "half" | "gibbous" | "full";

export type LevelId = "tutorial" | "woods" | "misty-lands" | "frozen-mountains";

export type BeatCell = string | null;

export interface BeatLevel {
  id: LevelId;
  ordinal: string;
  stageLabel: string;
  name: string;
  subtitle: string;
  phase: LevelMoonPhase;
  phaseLabel: string;
  cells: Record<DimensionId, BeatCell>;
  finalBoss?: boolean;
  cohesion: string;
  arc: string;
}

export const beatLevels: readonly BeatLevel[] = [
  {
    id: "tutorial",
    ordinal: "Level 1",
    stageLabel: "Tutorial",
    name: "Centralis",
    subtitle: "Lake Island",
    phase: "crescent",
    phaseLabel: "Waxing crescent",
    cells: {
      space: "Lake Island",
      objective: "Get to the boat and escape",
      quest: "Prompt start",
      boss: "The Werewolf",
      visuals: "Dark spaces and green scenarios",
      audio: "Footsteps (silence)",
    },
    cohesion:
      "An island and one way to get out of it, fight your way out.",
    arc: "Shadows · Silence · Soldiers",
  },
  {
    id: "woods",
    ordinal: "Level 2",
    stageLabel: "Act I",
    name: "The Woods",
    subtitle: "Moving woods & a cemetery",
    phase: "half",
    phaseLabel: "First quarter, waxing",
    cells: {
      space: "Moving woods and a cemetery",
      objective: "Get the Crescent Fragment",
      quest: null,
      boss: "The Wizard-Knight",
      visuals: "Green scenarios in the rain, colourful flowers next to swamps",
      audio: "Whispers in the wind that increase tension",
    },
    cohesion:
      "The forest is a dark and swampy place. The enemies are camouflaging with the environment.",
    arc: "Swamps · Whispers · The Forest",
  },
  {
    id: "misty-lands",
    ordinal: "Level 3",
    stageLabel: "Act II",
    name: "Misty Lands",
    subtitle: "City of Mists and a Haunted Castle",
    phase: "gibbous",
    phaseLabel: "Waxing gibbous",
    cells: {
      space: "City of Mists and a Haunted Castle in ruins",
      objective: "Get the 2nd Moon Fragment",
      quest: "End the banshees' menace",
      boss: "The Centaur-Knight",
      visuals: "Foggy scenarios",
      audio: "Voices singing in the fog",
    },
    cohesion:
      "Fog is not only the weather here, it is the level atmosphere. Banshees and ghosts use it to their advantage.",
    arc: "Fog · Singing · Banshees and Ghosts",
  },
  {
    id: "frozen-mountains",
    ordinal: "Level 4",
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
      "A fight at the highest peak in the world decides the fate of Kaelum. " +
      "Three allies ask for help, but the player decides who to choose.",
    arc: "Snow · Harmonics · Ice Knights",
  },
] as const;

export const emptyCell = "—";

export const emptyCellLabel = "Not part of this level";

export const beatChartThesis =
  "Four levels: a prologue on the lake island, then one act per land. Each " +
  "represents each moon phase that the game is in. From a silent island to a full moon over the Sun-Knight. " +
  "The world should feel like it is from an epic novel.";

export const beatStructureNote =
  "Centralis is the tutorial, not a full level. The three " +
  "acts are the three lands that follow it, one fragment each." + 
  "So the moon waxes as the player progresses and collects the fragments.";

export const arcCaption =
  "The section summary: the environment · the audio · the enemies.";

export function getBeatLevel(id: LevelId): BeatLevel {
  const level = beatLevels.find((l) => l.id === id);
  if (!level) throw new Error(`Unknown level: ${id}`);
  return level;
}

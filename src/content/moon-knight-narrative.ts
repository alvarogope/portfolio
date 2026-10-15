export type MoonPhase = "crescent" | "half" | "full";

export type NarrativeActId = "waking" | "gathering" | "ascent";

export interface NarrativeAct {
  id: NarrativeActId;
  actLabel: string;
  phase: MoonPhase;
  lifeStage: string;
  title: string;
  land: string;
  fragment: string;
  guardian: string;
  beat: string;
}

export const narrativeActs: readonly NarrativeAct[] = [
  {
    id: "waking",
    actLabel: "Act I",
    phase: "crescent",
    lifeStage: "The Maiden",
    title: "The Waking",
    land: "The Woods",
    fragment: "Crescent Moon Fragment",
    guardian: "The Wizard-Knight",
    beat:
      "The Moon-Knight wakes from a coma on Centralis, a lake island at the centre of Kaelum, " +
      "remembering nothing. Death is waiting there, and promises to bring them back every time they " +
      "fall. The first fragment is in The Woods.",
  },
  {
    id: "gathering",
    actLabel: "Act II",
    phase: "half",
    lifeStage: "The Mother",
    title: "The Gathering",
    land: "The Misty Lands",
    fragment: "Half-Moon Fragment",
    guardian: "The Centaur-Knight",
    beat:
      "The Moon-Knight reads from the environment how their life was before the coma and what made them go " +
      "into it. They discover that a Sun-Knight exists and how important he was. At the fortress after retaking the " +
      "half-moon fragment, a siege occurs and they are sent north, in chains.",
  },
  {
    id: "ascent",
    actLabel: "Act III",
    phase: "full",
    lifeStage: "The Crone",
    title: "The Ascent",
    land: "The Frozen Mountains",
    fragment: "Full Moon Fragment",
    guardian: "The Sun-Knight",
    beat:
      "After escaping, the Moon-Knight climbs to the last fortress and their comrade waiting inside of it. " +
      "Once defeated, the player has two options: let the God of the Gaps stand or end the world.",
  },
];

export const prologueNote = {
  label: "Prologue in Centralis",
  line:
    "The Moon-Knight wakes on a lake island. This functions as the prologue of the game. " +
    "The three acts begin after this one. Each act is represented by a different stage of the moon and " +
    "the fragments that need to be recovered by the player.",
};

const actById = new Map(narrativeActs.map((a) => [a.id, a]));

export function getNarrativeAct(id: NarrativeActId): NarrativeAct {
  const act = actById.get(id);
  if (!act) throw new Error(`Unknown Moon-Knight act: ${id}`);
  return act;
}

export const reversal = {
  kicker: "The end",
  title: "The Sun-Knight's Vision",
  body:
    "The Sun-Knight is not a villain. He was the Moon-Knight's comrade before he discovered the Gods of the Gaps fallacy. " +
    "After finding this out, he broke the Moon into different fragments out of fear and then got confronted by the Moon-Knight. " +
    "When the battle ended, the Sun-Knight couldn't bring himself to kill the Moon-Knight, who fell into a coma and woke with no memory of anything.",
  payoff:
    "This way of having the character discover the world at the same time as the player is the best approach for an " +
    "unknown new world and has a narrative excuse to explain how the world functions. This explanation of the story " +
    "gave me several narrative and design excuses for my ideas for the game while avoiding the classic good vs evil story",
};

/* ---- themes & symbolism ------------------------------------------------- */

export type ThemeGlyph = "phases" | "willow" | "triskelion" | "piano";

export interface NarrativeTheme {
  id: string;
  glyph: ThemeGlyph;
  title: string;
  line: string;
}

export const narrativeThemes: readonly NarrativeTheme[] = [
  {
    id: "willow",
    glyph: "willow",
    title: "Willow trees",
    line:
      "The player's safe space and the only place the Moon-Knight can heal fully. A willow means sorrow " +
      "and mourning, and it also means vitality and rebirth, which is exactly what a checkpoint is.",
  },
  {
    id: "triskelion",
    glyph: "triskelion",
    title: "The triskelion rune",
    line:
      "The symbol of death, cut into willow bark, dungeon walls and the oldest ruins. It marks where " +
      "something ended, including the tree that brings the Moon-Knight back.",
  },
  {
    id: "piano",
    glyph: "piano",
    title: "A piano underground",
    line:
      "The score is medieval folk everywhere but the dungeons, where a piano " +
      "plays. This is an instrument that sounds odd in a medieval world and does not belong there," + 
      "hinting something is odd. Nothing tells the player something is wrong down " +
      "there. The instrument does.",
  },
];

/* ---- story through mechanics -------------------------------------------- */

export interface MechanicPair {
  id: string;
  mechanic: string;
  meaning: string;
}

export const storyThroughMechanics = {
  thesis:
    "The story is not told through cutscenes. It is in who attacks and from where, in what the ruins " +
    "were before they were ruins, and in the few words the NPCs will say. Kaelum is built to be " +
    "scanned archaeologically. The player who looks finds the events before the waking, and the player " +
    "who does not will still feel them through gameplay.",
  pairs: [
    {
      id: "death",
      mechanic: "Death's promise → the respawn",
      meaning:

        "This explains that the Moon-Knight can die through the game. Death returns " +
        "the Moon-Knight because their business is unfinished and the ending is the moment that stops " +
        "being true.",
    },
    {
      id: "gods",
      mechanic: "The Power of the Gods → the fallacy",
      meaning:
        "The magic is a manipulation of quantum states that the people of Kaelum could have interpreted as divinity. The player " +
        " has to earn them by taking Ancient Gods' Blood from a dungeon, staining the Witch's white roses with " +
        "it, and running the alchemical magic by performing the superstition the story is about.",
    },
    {
      id: "moon",
      mechanic: "The moon → the progress bar",
      meaning:
        "Every fragment gathered moves the moon on a phase. Making progress, act and age a reading, " +
        "taken from the game's sky rather than from a menu or XP.",
    },
  ] as readonly MechanicPair[],
};

/* ---- the fuller prose, folded away on the page -------------------------- */

export const fullStory: readonly string[] = [
  "Kaelum is a dark fantasy medieval world in three great regions: The Woods, The Misty Lands and " +
    "the Frozen Mountains. For most of the game the Moon-Knight walks through it on their own. " +
    "Loneliness is an important part of the story, as the player will walk through ruins, ancient temples," + 
    "castles, fortresses and swamps and will explore them on their own. It contrasts with a fast close combat" + 
    "with knights, banshees, ghosts, goblins and wizards.",

  "They wake from a coma on Centralis, a lake island in the middle of the continent, and meet Death, " +
    "a strange figure who promises to revive them every time they die. The island is the prologue, " +
    "the three acts begin when they leave Centralis. The task is to restore the Moon Goddess by recovering " +
    "the three fragments.",

  "Each fragment is at the end of a fantastic set world: the Crescent in The Woods behind the " +
    "Wizard-Knight, the Half-Moon in the Misty Lands behind the Centaur-Knight and the Full Moon in " +
    "the Frozen Mountains behind the Sun-Knight himself. At the Misty Lands fortress the Moon-Knight " +
    "is attacked under siege, captured and sent to the north. Escaping that captivity opens " +
    "the last act.",

  "The Sun-Knight was the Moon-Knight's partner, back when the Sun and the Moon worked together. He was the first to " +
    "see the Gods of the Gaps fallacy for what it is: the Power of the Gods is a manipulation of " +
    "quantum states, not divinity and Kaelum built its faith in the gap. What he saw in the moon was " +
    "dark enough that he broke it apart and hid the pieces. When the Moon-Knight discovered it, they " +
    "faced each other and the Moon-Knight got sent into a coma.",

  "Throughout the game the player learns why Death was so generous. The Moon-Knight was returned because of " +
    "unfinished business and when it is finished they go back. On the highest mountain of Kaelum the " +
    "player decides whether the Gods of the Gaps fallacy ends there or stands. Either way the " +
    "Moon-Knight dies, this time hugging Death, and welcoming it at last.",
];

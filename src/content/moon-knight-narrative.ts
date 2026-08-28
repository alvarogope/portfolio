/**
 * Moon-Knight — the narrative design: the arc, what it is about, and how it is
 * delivered without cutscenes.
 *
 * Condensed from the narrative chapter of the GDD. The beats are the real ones
 * — the waking on Centralis, the three fragments and their guardians, the
 * siege in the Misty Lands, the Sun-Knight, the choice on the highest mountain
 * — written short enough to be skimmed. The fuller prose lives in `fullStory`
 * and is folded away on the page, so a reader who wants the plot can have it
 * and a reader who wants the shape is not made to read it first.
 *
 * THE SPINE is the moon. Crescent, half and full are at once the three
 * fragments, the three lands, the three acts, and the three ages of a life.
 * Every list below is in that order, so the motif does the structural work.
 *
 * THREE ACTS, AND A PROLOGUE BEFORE THEM. The waking on Centralis is played as
 * a level — it is the tutorial island — but it is NOT an act: there is no
 * fragment on it and no land is claimed there. `prologueNote` says so on the
 * page, which is what keeps this section's three moons from reading as a
 * disagreement with the beat chart's four (`moon-knight-levels.ts`, where the
 * fourth moon is the prologue's sky). Acts are counted here; locations are
 * counted there.
 */

/* ---- the arc ------------------------------------------------------------ */

export type MoonPhase = "crescent" | "half" | "full";

/** Narrowed so the world map can point a region at its act and be checked. */
export type NarrativeActId = "waking" | "gathering" | "ascent";

export interface NarrativeAct {
  id: NarrativeActId;
  /** "Act I" — the label, not derived, so the copy can change without maths. */
  actLabel: string;
  phase: MoonPhase;
  /** The age of life this act is tuned to. The moon carries it. */
  lifeStage: string;
  title: string;
  land: string;
  fragment: string;
  guardian: string;
  /** One or two sentences. This is the part that gets skimmed — keep it short. */
  beat: string;
}

export const narrativeActs: readonly NarrativeAct[] = [
  {
    id: "waking",
    actLabel: "Act I",
    phase: "crescent",
    lifeStage: "Childhood",
    title: "The Waking",
    land: "The Woods",
    fragment: "Crescent Moon Fragment",
    guardian: "The Wizard-Knight",
    beat:
      "The Moon-Knight wakes from a coma on Centralis, a lake island at the centre of Kaelum, " +
      "remembering nothing. Death is waiting there, and promises to bring them back every time they " +
      "fall. The first fragment lies in The Woods.",
  },
  {
    id: "gathering",
    actLabel: "Act II",
    phase: "half",
    lifeStage: "Adulthood",
    title: "The Gathering",
    land: "The Misty Lands",
    fragment: "Half-Moon Fragment",
    guardian: "The Centaur-Knight",
    beat:
      "Ruin by ruin, the Moon-Knight reads back the life they had before the coma — and what the " +
      "Sun-Knight was to them. At the fortress holding the half-moon the siege closes in: taken " +
      "alive, and sent north in chains.",
  },
  {
    id: "ascent",
    actLabel: "Act III",
    phase: "full",
    lifeStage: "Elderhood",
    title: "The Ascent",
    land: "The Frozen Mountains",
    fragment: "Full Moon Fragment",
    guardian: "The Sun-Knight",
    beat:
      "Escaped from captivity, the Moon-Knight climbs to the last fortress and the comrade waiting " +
      "inside it. On the highest mountain of Kaelum one question is left open to the player: let the " +
      "Gods of the Gaps stand, or end them.",
  },
];

/**
 * The prologue, stated once and owned here.
 *
 * Centralis is the only place on this page where the act count and the level
 * count can look like they disagree, so the arc names it before it counts to
 * three. Structure only — the waking itself is Act I's beat and the island's
 * lore belongs to the world map; this says what KIND of thing the island is.
 */
export const prologueNote = {
  label: "Prologue · Centralis",
  line:
    "The waking on the lake island is the prologue: a level to play, but not an act — no fragment " +
    "is taken there and no land is claimed. The three acts are the three lands that follow it, one " +
    "fragment each, which is why the beat chart plans four locations while the arc tells three " +
    "acts. The moons above are the fragments recovered; the moons on the chart are the skies they " +
    "are taken under.",
};

const actById = new Map(narrativeActs.map((a) => [a.id, a]));

/**
 * One act by id, for the world map: a land needs to say which act it belongs
 * to and which fragment is in it, and both are already written here. THIS
 * ORDER IS CANONICAL — Wizard-Knight in the Woods, Centaur-Knight in the Misty
 * Lands, Sun-Knight in the mountains — and anything that disagrees is the
 * thing to correct.
 */
export function getNarrativeAct(id: NarrativeActId): NarrativeAct {
  const act = actById.get(id);
  if (!act) throw new Error(`Unknown Moon-Knight act: ${id}`);
  return act;
}

/** The late reversal, and why it is placed late. Spoilers, on purpose. */
export const reversal = {
  kicker: "The turn · spoilers, deliberately",
  title: "The errand was the villain's nightmare",
  body:
    "The Sun-Knight is no dark lord. He was the Moon-Knight's comrade, from when the Sun and the Moon " +
    "worked as one — and the first in Kaelum to see the Gods of the Gaps fallacy for what it is. What " +
    "he then saw in the moon frightened him into breaking it apart and hiding the pieces. The " +
    "Moon-Knight found out. They fought. The Moon-Knight woke with no memory of it.",
  payoff:
    "Which means the errand the player has been running for three acts — put the Moon Goddess back " +
    "together — is the exact thing the villain broke the world to prevent. And Death's revivals were " +
    "never mercy: they were a loan against unfinished business. Finish it and you go back. The " +
    "Moon-Knight does, and embraces Death when it comes.",
  note:
    "The reversal sits in the last act by design. It costs nothing to hold, and it re-reads every " +
    "fragment the player has already carried up a mountain — turning a collect-three quest into a " +
    "question about whether it should have been run at all.",
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
      "The only safe ground, and the only place the Moon-Knight heals fully. A willow means sorrow " +
      "and mourning, and it also means vitality and rebirth — which is exactly what a checkpoint is.",
  },
  {
    id: "triskelion",
    glyph: "triskelion",
    title: "The triskelion rune",
    line:
      "The symbol of death, cut into willow bark, dungeon walls and the oldest ruins. It marks where " +
      "something ended — including, quietly, the tree that brings you back.",
  },
  {
    id: "piano",
    glyph: "piano",
    title: "A piano underground",
    line:
      "The score is medieval folk everywhere but the dungeons, where a piano — an instrument this " +
      "world should not have — plays instead. Nothing tells the player something is wrong down " +
      "there. The instrument does.",
  },
];

/* ---- story through mechanics -------------------------------------------- */

export interface MechanicPair {
  id: string;
  /** The system, named as the player meets it. */
  mechanic: string;
  /** What carrying that system tells them. */
  meaning: string;
}

export const storyThroughMechanics = {
  thesis:
    "The story is not delivered in cutscenes. It is in who attacks and from where, in what the ruins " +
    "were before they were ruins, and in the few words the NPCs will part with. Kaelum is built to be " +
    "read archaeologically: the player who looks finds the events before the waking, and the player " +
    "who does not still feels them.",
  pairs: [
    {
      id: "death",
      mechanic: "Death's promise → the respawn",
      meaning:
        "Coming back is not a convenience bolted onto the fiction; it is the fiction. Death returns " +
        "the Moon-Knight because the business is unfinished, and the ending is the moment that stops " +
        "being true.",
    },
    {
      id: "gods",
      mechanic: "The Power of the Gods → the fallacy, playable",
      meaning:
        "The magic is a manipulation of quantum states that Kaelum mistook for divinity. The player " +
        "earns it by taking Ancient Gods' Blood from a dungeon, staining the Witch's white roses with " +
        "it, and running the alchemy — performing the superstition the story is about.",
    },
    {
      id: "moon",
      mechanic: "The moon → the progress bar",
      meaning:
        "Every fragment recovered moves the moon on a phase. Progress, act and age are one reading, " +
        "taken from the sky rather than from a menu.",
    },
  ] as readonly MechanicPair[],
};

/* ---- the fuller prose, folded away on the page -------------------------- */

export const fullStory: readonly string[] = [
  "Kaelum is a dark fantasy medieval world in three great regions — The Woods, The Misty Lands and " +
    "the Frozen Mountains — and for most of the game the Moon-Knight crosses them alone. The " +
    "loneliness is the point: ruins, ancient temples, castles, fortresses and swamps explored on your " +
    "own, cut against fast close combat with knights, banshees, ghosts, goblins, wizards and worse.",

  "They wake from a coma on Centralis, a lake island in the middle of the continent, and meet Death — " +
    "a strange figure who promises to revive them every time they die. The island is the prologue; " +
    "the three acts begin when they leave it. The task is to restore the Moon Goddess by recovering " +
    "the three fragments she was broken into.",

  "Each fragment sits at the end of a fairy-tale set piece: the Crescent in The Woods behind the " +
    "Wizard-Knight, the Half-Moon in the Misty Lands behind the Centaur-Knight, and the Full Moon in " +
    "the Frozen Mountains behind the Sun-Knight himself. At the Misty Lands fortress the Moon-Knight " +
    "is attacked under siege, captured, and sent to the frozen north; escaping that captivity opens " +
    "the last act.",

  "The Sun-Knight was a comrade, from when the Sun and the Moon worked as one. He was the first to " +
    "see the Gods of the Gaps fallacy for what it is — the Power of the Gods is a manipulation of " +
    "quantum states, not divinity, and Kaelum built its faith in the gap. What he saw in the moon was " +
    "dark enough that he broke it apart and hid the pieces. The Moon-Knight discovered it, they " +
    "faced each other, and the coma and the missing memory are what the Moon-Knight was left with.",

  "Along the way the player learns why Death was so generous. The Moon-Knight was returned because of " +
    "unfinished business, and when it is finished they go back. On the highest mountain of Kaelum the " +
    "player decides whether the Gods of the Gaps fallacy ends there or stands. Either way the " +
    "Moon-Knight dies — this time hugging Death, and welcoming it at last.",
];

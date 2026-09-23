import { deepDivePath } from "./moon-knight-deep-dive";

export type CastId = "moon-knight" | "death" | "witch" | "druid" | "orpheus";

export type CastBand = "player" | "encounter" | "mirror";

interface CastBase {
  id: CastId;
  name: string;
  band: CastBand;
  title: string;
  role: string;
  designPurpose: string;
  accent: string;
}

export interface ContrastFace {
  label: string;
  note: string;
}

export interface PlayerMember extends CastBase {
  band: "player";
  contrast: readonly [ContrastFace, ContrastFace];
}

export interface EncounterMember extends CastBase {
  band: "encounter";
}

export interface MirrorMember extends CastBase {
  band: "mirror";
  stance: string;
  answer: string;
}

export type CastMember = PlayerMember | EncounterMember | MirrorMember;

/* ------------------------------------------------------------- the player -- */

export const castPlayer: PlayerMember = {
  id: "moon-knight",
  name: "The Moon-Knight",
  band: "player",
  title: "The Player",
  accent: "#B8C4D4",
  role:
    "It is fully customizable and wakes up with no memory, making the player and the character learn about the world at the same time.",
  contrast: [
    {
      label: "Does not speak",
      note:
        "Not giving them a dialogue or voice makes the player focus on the feeling and gameplay. They seem like a very hard and tough warrior.",
    },
    {
      label: "Heals by playing",
      note:
        "To contrast with the silence, healing is through playing an instrument given by Death. Adding a romantic touch to the character.",
    },
  ],
  designPurpose:
    "The focus is on the contrast between these two. A character that doesn't talk and only expresses themselves through music " +
    "can create a great empathy in players, trying to forget the armour and focusing on the character. The amnesia serves the same purpose.",
};

/* --------------------------------------------------------- Death / Orpheus -- */

export const castEncounters: readonly EncounterMember[] = [
  {
    id: "death",
    name: "Death",
    band: "encounter",
    title: "First NPC",
    accent: "#CE727E",
    role:
      "A veiled woman in white. She gives you the harp that heals and she revives you every time you die in the game. " + 
      "Her energy runs through the willow trees. Her purpose is unknown.",
    designPurpose:
      "She is the mystery engine — she feeds the player just enough context to move and never enough to understand, so the questions stay open for three acts. At the end she embraces you, and her white dress stains with blood, like a white rose.",
  },
  {
    id: "orpheus",
    name: "Orpheus",
    band: "encounter",
    title: "The Warrior",
    accent: "#E07A45",
    role:
      "A fallen soldier in The Woods village who gave up being a knight." + 
      "He introduces the jousting minigame; when you finish jousting, he points you at the enemies in The Woods.",
    designPurpose:
      "If you follow his story, he thanks you for eliminating the enemies in The Woods. But, when you come back to him " +
      "you find him dead with wounds made by thieves. His village is reduced to ashes.",
  },
];

/* ------------------------------------------------------------- The Witch / Druid -- */

export const mirrorTruth = {
  label: "The God of the Gaps",
  line: "Two ways for the player to solve the world",
} as const;

export const castMirror: readonly [MirrorMember, MirrorMember] = [
  {
    id: "witch",
    name: "The Witch",
    band: "mirror",
    title: "",
    stance: "Inquiry",
    accent: "#57A886",
    role:
      "She follows you from The Woods to the Misty Lands to the Frozen Mountains so the player can upgrade every time they need.",
    answer: "Kill the gods. Begin the Age of Humankind.",
    designPurpose:
      "She embraces the mysteries of the world and faces the gods. If you follow her quest she opens up one ending",
  },
  {
    id: "druid",
    name: "The Druid",
    band: "mirror",
    title: "",
    stance: "Faith",
    accent: "#C9A961",
    role:
      "In a Misty Lands village, he asks for help with defeating banshees. If you agree, he reveals a hidden fortress. He comes back in the Frozen Mountains",
    answer: "Keep it buried. The world is not ready to know.",
    designPurpose:
      "He discovers the fallacy, but asks you to hide it for keeping the state of the world. It is your call if you want to hide the information or expose it.",
  },
];

export const moonKnightCast: readonly CastMember[] = [
  castPlayer,
  ...castEncounters,
  ...castMirror,
];

export const castAnchor = (id: CastId) => `cast-${id}`;

export const castHref = (id: CastId, base: string = deepDivePath) =>
  `${base}#${castAnchor(id)}`;

const castById = new Map(moonKnightCast.map((c) => [c.id, c]));

export function getCastMember(id: CastId): CastMember {
  const member = castById.get(id);
  if (!member) throw new Error(`Unknown Moon-Knight cast member: ${id}`);
  return member;
}
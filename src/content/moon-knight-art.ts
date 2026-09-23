export const artThesis = {
  kicker: "The Artistic Approach",
  line:
    "The Sublime: The beauty of experiencing a ruined world in solitude.",
  body: [
    "Moon-Knight art direction is based on the Romantic idea of the medieval times. " + 
      "The Sublime is the feeling of standing before something immense and indifferent " + 
      "and being attracted and frightened at once. It is not based on medieval art, but " + 
      "its romanticisation during the 19th Century.",
    "The game is made for making the player feel small and alone. The world the player experiences " +
      "is in decay, no civilisation remains and everything has been forgotten. Life is not valued " +
      "because nobody remembers. The moon is always present, but being nearly the only light in a " + 
      "world that is already dead.",
  ],
} as const;

export interface SublimeTranslation {
  id: string;
  tag: string;
  title: string;
  decision: string;
  why: string;
  key?: boolean;
  crossover?: string;
}

export const sublimeTranslations: readonly SublimeTranslation[] = [
  {
    id: "solitude",
    tag: "Solitude",
    title: "The player is alone",
    decision:
      "The knight goes through the whole game by themselves. The NPCs could help you momentarily, but they are alone.",
    why:
      "The Sublime is a feeling one person has in front of something enormous. I wanted the player to feel in silence." + 
      "Making this happen makes the scale felt, while silence does the work.",
  },
  {
    id: "ruins",
    tag: "Ruins & past",
    title: "A civilisation long forgotten",
    decision:
      "Buildings in the world, broken fortresses, drowned streets and old-god " +
      "sanctuaries, are just an echo of what once was and will never be again.",
    why:
      "The feeling of things ending is what made the Sublime real. Death, decay, oblivion " +
      "and sorrow is what the player finds and making them walk through a world full of this " +
      "sets the tone perfectly. All things end, whether we like it or not. ",
  },
  {
    id: "palette",
    tag: "Cold colours",
    title: "The Colour Palette",
    decision:
      "Cold colours are predominant. The game is set at night with, basically, not any warmth in colours.",
    why:
      "The same colour palette appears in the Romantic paintings that inspired the art approach. " +
      "These colours relate to the topics explored in the sublime, like death and feeling small against a big force. " +
      "It also makes contrast easier, like the piano, if warmth appears it is fully intentional and noticeable by the player.",
  },
  {
    id: "darkness",
    tag: "Darkness",
    title: "Darkness as a mechanic",
    key: true,
    crossover: "Aesthetic → difficulty",
    decision:
      "Light is low by design. Large parts of the world are lit only by the moon, and the " +
      "enemies use that by hiding in the shadows and what you cannot see is what reaches you " +
      "first.",
    why:
      "Darkness aligns with the narrative, the gameplay, but most importantly, the philosophy of the Sublime. " +
      "Mechanically, it helps the difficulty design. The player has to stop sometimes and read the environment so they don't die.",
  },
];

export interface Swatch {
  hex: string;
  name: string;
  role: string;
}

export const palette: readonly Swatch[] = [
  { hex: "#001021", name: "Void", role: "" },
  { hex: "#1A2153", name: "Moonlit blue", role: "" },
  { hex: "#2A2B34", name: "Stone", role: "" },
  { hex: "#034748", name: "Arcane emerald", role: "" },
  { hex: "#B8BECC", name: "Moonlight silver", role: "" },
];

export const paletteNote =
  "";

export interface VisualDecision {
  id: string;
  decision: string;
  why: string;
  pillars?: readonly { subject: string; stands: string }[];
}

export const visualDecisions: readonly VisualDecision[] = [
  {
    id: "menu-is-place",
    decision: "The main menu is the starting location",
    why:
      "The menu is where the games begin, being also a perfect setting. The moonlight reflecting on the " +
      "sword, and the sword being placed in a stone, like Excalibur, next to a Willow Tree. " +
      "Three of the most important motifs of the game and representing the parts of the game: " +
      "the mechanics, the checkpoints and the story and progression.",
    pillars: [
      { subject: "The moon", stands: "Narrative & Progression" },
      { subject: "The moon-sword", stands: "Mechanics & Progression" },
      { subject: "The willow tree", stands: "Safety & healing" },
    ],
  },
  {
    id: "scale",
    decision: "The character is smaller than most of the enemies",
    why:
      "This serves a double purpose: the player can clearly see the enemy and feel small. " +
      "The enemies' attacks can be read better and players can decide where to dodge to. " +
      "It relates to the Sublime too, making it a David against Goliath situation.",
  },
  {
    id: "visibility",
    decision: "Camera and character working towards visibility",
    why: 
      "Both the camera and the character work together to give the player as much view as possible. " +
      "This also relates to the UI Design, prioritising what the players see and can scan in one glance of the screen ",
  },
];
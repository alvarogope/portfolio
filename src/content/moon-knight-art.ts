export const artThesis = {
  kicker: "The Artistic Approach",
  line:
    "The Sublime: The beauty of experiencing vast and ruined world in solitude.",
  body: [
    "Moon-Knight is art-directed from a single Romantic idea. The Sublime is the feeling of " +
      "standing before something immense and indifferent — a drowned coast, a fallen city, a " +
      "sky with one moon in it — and being moved and frightened at once. Beauty and dread " +
      "arriving together, and neither of them addressed to you.",
    "Naming the principle is the easy half. The value is in what it decides: the player travels " +
      "alone because awe needs solitude, the world is a ruin because the Sublime is the beauty of " +
      "decay, the palette is cold and night-bound because the game is lit by one moon — and light " +
      "is scarce because scarcity of light is also a difficulty setting.",
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
    title: "The player goes alone",
    decision:
      "There is no companion, no party and no escort. The knight crosses every land, every ruin " +
      "and every dungeon by themself, and the few characters they meet stay where they are.",
    why:
      "The Sublime is a feeling one person has in front of something enormous, and it does not " +
      "survive company — someone to talk to converts awe into conversation. Enforcing solitude " +
      "for the whole journey is what makes the scale felt rather than described, and it lets the " +
      "silence do the work no line of dialogue could.",
  },
  {
    id: "ruins",
    tag: "Ruin & sorrow",
    title: "A fallen civilisation, reclaimed by nature",
    decision:
      "Environments are built as remains: broken fortresses, drowned streets and old-god " +
      "sanctuaries with roots through the stonework and water where the floor used to be.",
    why:
      "Decay is where the Sublime lives — a ruin is beautiful precisely because it is evidence of " +
      "something ended. Building the world as a place that was already lost before the player " +
      "arrived means the player walks through mourning instead of being told about it, and every " +
      "room becomes a piece of narrative that needs no cutscene.",
  },
  {
    id: "palette",
    tag: "Cold & night-bound",
    title: "A cold palette, under one moon",
    decision:
      "Cold colours predominate — void blue, moonlit indigo, stone grey, arcane emerald. The " +
      "game is set at night, and the warm end of the spectrum is almost entirely withheld.",
    why:
      "Cold reads as distance, indifference and the absence of shelter, which is exactly the " +
      "emotional register the Sublime asks for. Withholding warmth also gives the few bright " +
      "moments real value: when light does appear it means something, because the player has " +
      "been given so little of it.",
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
      "Mechanically, it helps to the difficulty design. The player has to stop some times and read the environment so they don't die. " +
      "Happening in the fog and darker levels.",
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
      "There is no separate title screen: the menu is the place the game begins, framed so that " +
      "one image states what the game is about before a button is pressed. The moon, the " +
      "moon-sword and the willow tree are all in shot, which means the player has already seen " +
      "the story, the mechanics and the safe place they will keep coming back to — and pressing " +
      "start simply releases the camera into a world they are already standing in.",
    pillars: [
      { subject: "The moon", stands: "Narrative" },
      { subject: "The moon-sword", stands: "Mechanics & navigation" },
      { subject: "The willow tree", stands: "Safety & healing" },
    ],
  },
  {
    id: "scale",
    decision: "The player character is smaller than the bosses",
    why:
      "Scale is set for readability before it is set for drama. A boss clearly larger than the " +
      "knight gives its wind-ups more room on screen, so attacks can be read early enough to be " +
      "answered and the dodge becomes a decision rather than a guess. It happens to serve the " +
      "Sublime as well — a small figure in front of something enormous — but the reason it " +
      "survived tuning is that the fights got fairer.",
  },
  {
    id: "visibility",
    decision: "Camera and character tuned for maximum visibility",
    why:
      "Everything the camera and the character silhouette do is aimed at giving the player as " +
      "much of the world as possible: framing that keeps the ground and the threats in view, and " +
      "a figure that never eats the space in front of it. Same philosophy as the integrated UI — " +
      "the player should be reading the world, not fighting the view. In a game this dark, " +
      "visibility is the resource the design is most careful with.",
  },
];
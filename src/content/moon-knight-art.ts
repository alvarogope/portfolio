/**
 * Moon-Knight — art direction: the visual thesis and what it decides.
 *
 * This file is shaped around ONE IDEA and its consequences, not around a mood
 * board. The thesis is the Romantic Sublime — awe and dread before vast, ruined
 * nature, and the beauty of solitude and decay — and everything below exists to
 * show the thesis DOING something: choosing how the player travels, what the
 * world is made of, which colours are allowed, and how hard the game is.
 *
 * EVERY ENTRY CARRIES ITS REASONING. `decision` is the visible choice; `why` is
 * the argument for it. The `why` is the portfolio value — a reader who skims
 * only the `why` lines should still come away with the case — so it is a
 * first-class field and never folded into the description.
 *
 * The throughline, and the reason this section sits with the systems sections
 * rather than in a gallery: the aesthetic is not decoration. It sets the mood,
 * and it also sets the difficulty. Darkness is the proof.
 */

/* ---- the thesis --------------------------------------------------------- */

export const artThesis = {
  kicker: "The guiding principle",
  /** One line. If a reader takes nothing else from this section, this. */
  line:
    "The Sublime: awe and dread before a vast, ruined world — and the beauty of " +
    "being alone in it.",
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

/* ---- the translation ---------------------------------------------------- */

/**
 * The four moves that turn the principle into a game. Each is a decision the
 * player can feel, followed by the reason it was made.
 *
 * `key` marks darkness-as-mechanic. It is the one entry where the aesthetic
 * crosses into the rules — the absence of light is not mood, it is difficulty —
 * so the component gives it its own treatment instead of a fourth identical
 * card. `crossover` is the short statement of that crossing.
 */
export interface SublimeTranslation {
  id: string;
  /** Two or three words. The fastest possible read of the move. */
  tag: string;
  title: string;
  /** What the player actually meets. Concise — this gets skimmed. */
  decision: string;
  /** The design reasoning. The reason the entry is here at all. */
  why: string;
  key?: boolean;
  /** Only on the key entry: what the aesthetic turns into. */
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
    title: "Darkness is a mechanic, not a mood",
    key: true,
    crossover: "Aesthetic → difficulty",
    decision:
      "Light is scarce by design. Large parts of the world are lit only by the moon, and the " +
      "enemies use that: they wait in the shadows, and what you cannot see is what reaches you " +
      "first.",
    why:
      "This is the hinge of the whole art direction. The dark was chosen for the Sublime, and it " +
      "is also the difficulty curve — reading a room, choosing where to step and deciding whether " +
      "to advance are all harder because of an aesthetic decision. The look of the game and the " +
      "challenge of the game are the same choice, which is the standard every other decision here " +
      "is held to.",
  },
];

/* ---- the palette -------------------------------------------------------- */

/**
 * The real palette, in the order it is used: ground first, light last. That
 * order is the argument — four cold, dark inks and then one pale one, so the
 * strip itself shows how little light the game spends.
 *
 * The swatches are the true hex values, so their contrast is whatever the game
 * needs it to be. NO TEXT IS SET ON THEM — every label renders beneath its
 * block, on the section's own background, where it is legible.
 */
export interface Swatch {
  hex: string;
  name: string;
  /** What the colour is FOR. One clause. */
  role: string;
}

export const palette: readonly Swatch[] = [
  { hex: "#001021", name: "Void", role: "The night ground everything else sits on." },
  { hex: "#1A2153", name: "Moonlit blue", role: "Deep sky and open distance." },
  { hex: "#2A2B34", name: "Stone", role: "The neutral of ruins and armour." },
  { hex: "#034748", name: "Arcane emerald", role: "The old gods' power, and life." },
  { hex: "#B8BECC", name: "Moonlight silver", role: "The light that remains." },
];

export const paletteNote =
  "Four of the five are cold and dark; only the last one carries light. The palette is " +
  "weighted the way the world is — the player spends most of the game inside the first four " +
  "colours, and silver is rare enough to be worth walking toward.";

/* ---- deliberate visual decisions ---------------------------------------- */

/**
 * Composition and framing choices, where the reasoning is again the substance.
 * Rendered as decision → why.
 *
 * `pillars` exists only for the main menu: the whole point of that decision is
 * that ONE image states three things at once, so the three have to be nameable
 * on the page or the claim cannot be checked.
 */
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

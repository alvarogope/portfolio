/**
 * Seeds of Tomorrow — the weather as the game's progress readout.
 *
 * ATTRIBUTION. Seeds of Tomorrow was a team of five. The weather system is mine:
 * I designed it alongside the score and the levels, and `weatherCredit` below
 * carries that on the page in my own voice rather than leaving it to inference.
 *
 * NOTHING HERE IS INVENTED. Every claim is either a restatement of copy already
 * on the Seeds page — `designChallenge.quote`, `contributions`, `vision` and the
 * score's own track descriptions in `SeedsAudio` — or a correction I gave
 * directly: that the weather is atmospheric and narrative before it is anything
 * else, that solving a place calms EVERY sky over it (the acid rain stops being
 * acid, the hard weather stops), and that the wind is a real force the grass is
 * driven off rather than a particle effect in front of the camera.
 *
 * WHY A STATE FLIP and not a weather cycle. There is exactly one transition — a
 * place is harsh until the player solves it, and then it lets go — and it is
 * one-way and per-place. Drawing a rotating cycle of weather states would be
 * inventing a machine that was never claimed. So the diagram draws the one flip
 * at full width, using the acid-to-clean pair the design quote names, with the
 * trigger on the seam and the rule stated on the lane so the roster can carry
 * the other three answering the same trigger their own way.
 *
 * COLOUR IS NEVER LOAD-BEARING. Every zone prints its state as a word, every
 * weather prints its role as a word, and the roster repeats all of it as prose.
 *
 * GEOMETRY lives in `WeatherSystem`. Nothing here knows a pixel.
 */

/* ---- the weather roster -------------------------------------------------- */

export type WeatherId = "acid-rain" | "clean-rain" | "snow" | "wind" | "sandstorm";

/**
 * Which side of the flip a weather names. `signal` is the acid/clean pair the
 * design quote names outright; `hazard` is the hard weather that stops instead
 * of turning. Both answer the same trigger — the split is about what the solve
 * does to them, not about whether it reaches them.
 */
export type WeatherRole = "signal" | "hazard";

export interface Weather {
  id: WeatherId;
  /** Rendered as the W-number. */
  index: string;
  name: string;
  role: WeatherRole;
  /** The role as a word, beside the accent. */
  roleLabel: string;
  /** Where it falls, where the write-up says. Empty where it does not. */
  where: string;
  /** One line, in the card. */
  body: string;
  /**
   * What solving the place does to this weather. Every sky answers the same
   * trigger, which is the rule the roster exists to show: the acid rain stops
   * being acid, and the hard weathers stop.
   */
  afterSolve: string;
  /**
   * The track I scored for this weather's level, quoted from the score section
   * further up this page. Only the two levels that got their own track carry
   * one; it is the "see AND hear" half of the system, in the score's own words.
   */
  scored?: { track: string; line: string };
}

export const weathers: readonly Weather[] = [
  {
    id: "acid-rain",
    index: "W1",
    name: "Acid rain",
    role: "signal",
    roleLabel: "The poisoned sky",
    where: "Every poisoned area",
    body:
      "The default sky. It falls on everything the player has not restored yet, which makes it " +
      "the game's way of saying there is still work here without saying anything.",
    afterSolve: "It stops being acid — the same rain, running clean.",
  },
  {
    id: "clean-rain",
    index: "W2",
    name: "Clean rain",
    role: "signal",
    roleLabel: "The healed sky",
    where: "Every area the player has solved",
    body:
      "What the acid rain becomes. The one weather change in the game that the player causes, and " +
      "the confirmation that the place they are standing in is finished.",
    afterSolve: "This is the after. It is what the solve leaves behind.",
    scored: { track: "Rain Level", line: "The world weeping, then washed clean" },
  },
  {
    id: "snow",
    index: "W3",
    name: "Snow",
    role: "hazard",
    roleLabel: "Atmosphere & hazard",
    where: "Its own level",
    body:
      "Hard weather with its own mood: a condition to survive as much as an atmosphere to feel, " +
      "and the level is built around what its sky is doing to the player.",
    afterSolve: "The hard weather stops once the place is solved.",
    scored: { track: "Snow Level", line: "Still, crystalline cold" },
  },
  {
    id: "wind",
    index: "W4",
    name: "Wind",
    role: "hazard",
    roleLabel: "Atmosphere & hazard",
    where: "",
    body:
      "Not only a particle effect. I built the wind as an actual force and drove the grass off " +
      "it, so the blades bend and move the same way the weather is blowing — the wind is in the " +
      "world rather than in front of it.",
    afterSolve: "The hard weather stops once the place is solved.",
  },
  {
    id: "sandstorm",
    index: "W5",
    name: "Sandstorm",
    role: "hazard",
    roleLabel: "Atmosphere & hazard",
    where: "",
    body:
      "The harshest of them. Hard weather in the same system as the rain, pointed at the " +
      "moment-to-moment rather than at the state of the place.",
    afterSolve: "The hard weather stops once the place is solved.",
  },
];

/** The claim the roster exists to make, printed on the band. */
export const rosterThesis =
  "Every weather here is atmosphere first — it belongs to the place and to the story being told " +
  "in it, not to a UI. And every one of them answers the same trigger: solve the place and its " +
  "sky lets go. The acid rain stops being acid; the hard weather stops.";

/* ---- the two zone states ------------------------------------------------ */

export type ZoneId = "poisoned" | "healed";

export interface Zone {
  id: ZoneId;
  /** Rendered as the Z-number: the order the player moves through them. */
  index: string;
  name: string;
  /** The state as a word, so the sky's colour is never the only signal. */
  stateLabel: string;
  /** The weather over this zone — the id of the entry in `weathers`. */
  sky: WeatherId;
  /** The sky, said in three or four words, inside the panel. */
  skyLine: string;
  /** What the ground is doing under that sky. */
  groundLine: string;
  /** What the player reads off it — the whole point of the system. */
  readout: string;
  /** The zone in full, under the diagram. */
  detail: string;
}

export const zones: readonly Zone[] = [
  {
    id: "poisoned",
    index: "Z1",
    name: "A poisoned place",
    stateLabel: "Poisoned",
    sky: "acid-rain",
    skyLine: "Acid rain, falling hard",
    groundLine: "Nothing growing · monsters twisted out of the pollution",
    readout: "This place is still poisoned",
    detail:
      "Every area the player has not yet restored rains acid. It is the default state of the " +
      "world in this game: the Earth has been poisoned beyond saving in the traveller's future, " +
      "and the places he walks back into are still on their way there. The player never has to be " +
      "told a zone is unfinished — they walk in and it is raining acid on them.",
  },
  {
    id: "healed",
    index: "Z2",
    name: "A healed place",
    stateLabel: "Healed",
    sky: "clean-rain",
    skyLine: "The same rain, turned clean",
    groundLine: "Life returning to the ground the player restored",
    readout: "This place is won",
    detail:
      "Solve the puzzle that heals a place and its sky lets go. Where it was raining acid, the " +
      "rain stops being acid: the same weather, no longer poison, which is the reading I wanted — " +
      "the world was never the enemy, only what had been done to it. Where the weather was hard, " +
      "it stops. The world visibly mends as the player restores it, one healed place at a time.",
  },
];

/* ---- the one transition ------------------------------------------------- */

/**
 * The only state change the design asserts. One trigger, one direction, and it
 * is the puzzle solve rather than a kill count or a collection total.
 */
export const flip = {
  trigger: "The player solves the place's puzzle",
  direction: "One-way · per place",
  body:
    "One trigger, one direction, and it reaches every sky. Solving the puzzle that heals a place " +
    "is the only thing that changes the weather over it: the acid rain stops being acid, and the " +
    "hard weather stops. The change belongs to that place rather than to a global counter, and " +
    "there is no meter filling toward it — a place is poisoned until it is solved.",
  /** The same rule in one line, printed on the diagram's lane. */
  rule: "Acid rain stops being acid · hard weather stops",
};

/**
 * The thing the system was built instead of. It is in the design quote as the
 * rejected option, so the diagram draws it as one — struck through, under the
 * sky that replaced it.
 */
export const rejectedReadout = {
  label: "Progress bar",
  strapline: "The readout I did not build",
  body:
    "A HUD bar would have told the player the same fact in a corner of the screen, and it would " +
    "have told them about the game rather than about the world. Putting the readout in the sky " +
    "costs a channel the player cannot look away from, and buys a fiction where restoring the " +
    "Earth is something you feel in the weather rather than something you read off a meter.",
};

/* ---- the loop the weather sits inside ------------------------------------ */

export interface LoopStep {
  id: string;
  index: string;
  name: string;
  body: string;
  /** True for the step where the sky changes — the loop's payoff beat. */
  isPayoff?: boolean;
}

export const loopSteps: readonly LoopStep[] = [
  {
    id: "fight",
    index: "01",
    name: "Fight",
    body: "A burst of tension against the monsters the pollution twisted out of the place.",
  },
  {
    id: "recover",
    index: "02",
    name: "Recover the seed",
    body: "The Seeds of Tomorrow are the means of bringing life back, and they have to be found.",
  },
  {
    id: "solve",
    index: "03",
    name: "Solve the place",
    body:
      "The quieter, restorative half of the rhythm: the puzzle that heals the area, and the planting.",
  },
  {
    id: "turn",
    index: "04",
    name: "The sky turns",
    body: "The acid rain over that place runs clean and life returns to it. Then the next place.",
    isPayoff: true,
  },
];

export const loopNote =
  "The weather is the last beat of the loop, not a layer over it. I paced the game as combat " +
  "resolving into restoration — tension, then the quieter work of solving a place — and the sky " +
  "turning is the resolution at the end of that arc. Which is why it had to be the world and not " +
  "a meter: a bar ticking up cannot be the emotional payoff of a fight.";

/* ---- screen-reader summaries -------------------------------------------- */

/** The flip diagram, said once in prose, for the SVG's `desc`. */
export const flipSummary =
  "Two halves of one world. On the left, a poisoned place under acid rain, with nothing growing " +
  "under it. On the right, the same place after the player solves its puzzle: the rain has turned " +
  "clean and life is returning to the ground. Between them, the single trigger that moves a place " +
  "from one to the other — solving that place's puzzle — drawn as a one-way crossing. The same " +
  "trigger reaches every sky: acid rain stops being acid, and hard weather stops. Underneath, " +
  "struck through, the progress bar this system was built instead of.";

/** The loop diagram, said once in prose, for the SVG's `desc`. */
export const loopSummary =
  "A four-step loop: fight the monsters, recover the seed, solve the place and plant it, and then " +
  "the sky turns clean over it. The loop then returns to the first step at the next place. The " +
  "weather change is the last beat, the payoff at the end of the arc.";

/* ---- attribution --------------------------------------------------------- */

export const weatherCredit = {
  role: "Composer & Level Designer",
  team: "Team of 5",
  body:
    "Seeds of Tomorrow was made by five of us. The weather system is mine — I designed it, and I " +
    "scored the levels it falls on, which is why the two halves say the same thing. I wanted the " +
    "player's progress to live in the one place they cannot close: the sky over their head. " +
    "Everything else in the system follows from refusing the progress bar.",
};

/**
 * Shattered Skies — the planetary level design beat chart.
 *
 * The companion to `shattered-skies-planets.ts`. That file is what each world
 * IS — gravity, diameter, temperature, ecosystem — and it is rendered by the
 * dossier and the orrery. This file is how each world PLAYS: what it teaches,
 * the puzzle it is built around, what it hands the player, what tries to stop
 * them, and what it looks and sounds like while it happens.
 *
 * NOTHING FROM THE DOSSIER IS REPEATED HERE. The classification line and the
 * world colour are READ from `planetById` rather than re-typed, so the two
 * views can never disagree about what Cryonix is called or what colour it is,
 * and no stat is duplicated in the first place.
 *
 * PLAY ORDER, NOT ORBIT ORDER. The dossier is sorted by distance from the star
 * (Pyroterra, Dunestorm, Remnara, Tidalor, Cryonix). This array is sorted by
 * the sequence the player actually experiences — Pyroterra, Dunestorm,
 * Tidalor, Cryonix, Remnara — because the argument being made here is a
 * TEACHING progression, and teaching order is not the same as astronomy. The
 * two orders diverging is the point: the system was laid out as a solar
 * system, then re-sequenced as a curriculum.
 *
 * THE THROUGHLINE: EACH PLANET TEACHES A DIFFERENT SKILL. Core mechanics on
 * Pyroterra, navigation and decryption on Dunestorm, underwater traversal and
 * resource management on Tidalor, advanced light-refraction puzzles on
 * Cryonix, stealth and combat on Remnara — which is the skill the finale is
 * built on. `skill` and `arc` distil that into the progression line.
 *
 * ATTRIBUTION. A five-person team project. On this material specifically: the
 * AUDIO design is entirely mine, and the LEVEL design was co-designed with one
 * other designer. `levelsCredit` says exactly that and is rendered above the
 * chart, not tucked underneath it.
 */

import { planetById, type PlanetId } from "./shattered-skies-planets";

/* ---- the dimensions -----------------------------------------------------
   The matrix row order, the mobile card order and the detail sheet's grouping,
   all from one array so the three views cannot drift.

   `group` is an argument about how a world gets designed: decide what it is
   there to teach and the puzzle that teaches it (curriculum), build the loop
   of tools and threats around that (systems), then decide what it feels like
   to be there (sensory). Audio sits in the last group and is listed last on
   purpose — it is the layer designed once the world already works. */

export type DimensionId =
  | "teaches"
  | "signature"
  | "unlocks"
  | "hazards"
  | "visuals"
  | "audio";

export type DimensionGroup = "curriculum" | "systems" | "sensory";

export interface LevelDimension {
  id: DimensionId;
  /** The matrix row header. Short — it repeats in every mobile card. */
  label: string;
  group: DimensionGroup;
}

export const levelDimensions: readonly LevelDimension[] = [
  { id: "teaches", label: "Teaches", group: "curriculum" },
  { id: "signature", label: "Signature", group: "curriculum" },
  { id: "unlocks", label: "Unlocks", group: "systems" },
  { id: "hazards", label: "Hazards", group: "systems" },
  { id: "visuals", label: "Visuals", group: "sensory" },
  { id: "audio", label: "Audio", group: "sensory" },
] as const;

export const dimensionGroups: readonly { id: DimensionGroup; label: string }[] = [
  { id: "curriculum", label: "What it teaches" },
  { id: "systems", label: "Tools & threats" },
  { id: "sensory", label: "Look & sound" },
] as const;

/* ---- one world ---------------------------------------------------------- */

/** A hazard, split so the sheet can show the threat and its demand separately. */
export interface Hazard {
  name: string;
  /** What it does to the player — the demand, not the flavour. */
  effect: string;
}

export interface PlanetAudio {
  /** The score's character in a few words. */
  character: string;
  /** What is actually playing. The instrumentation call for this world. */
  instruments: string;
  /** The diegetic layer: what the world itself sounds like under the score. */
  texture: string;
}

/** A design detail worth stopping on. Surfaced as a highlighted note. */
export interface AudioGem {
  label: string;
  body: string;
}

export interface LevelPlanet {
  /** Keys into `planetById` for the classification and the world colour. */
  id: PlanetId;
  /** "World 01". Authored, not derived, so copy can change without maths. */
  ordinal: string;
  name: string;
  /** The skill this world owns, in two or three words. Drives the arc line. */
  skill: string;
  /** Where this world sits in the curriculum, in one line. */
  skillNote: string;

  /** The matrix. Six short phrases, one per dimension — kept to a phrase so
      the chart can be read ACROSS as well as down. */
  cells: Record<DimensionId, string>;

  /* The design sheet. Fuller than the matrix on purpose: the matrix is for
     comparing worlds, the sheet is for understanding one. */
  teaches: string;
  signature: string;
  unlocks: { tool: string; toolNote: string; rewards: string };
  hazards: readonly Hazard[];
  visuals: string;
  audio: PlanetAudio;
  audioGem?: AudioGem;

  /** Why these six layers belong to each other. The sheet's only argument. */
  cohesion: string;
  /** The world in three beats, for the progression line. */
  arc: string;
}

export const levelPlanets: readonly LevelPlanet[] = [
  {
    id: "pyroterra",
    ordinal: "World 01",
    name: "Pyroterra",
    skill: "Core mechanics",
    skillNote: "The alphabet: solve, platform, gather. Everything later is built on this hour.",
    cells: {
      teaches: "Core loop — puzzle-solving, platforming, resource gathering",
      signature: "Redirect lava to unlock the ancient vaults",
      unlocks: "Fire-resistant shields · stamina boosts, energy crystals",
      hazards: "Dynamic lava flows, crumbling platforms, erupting vents",
      visuals: "Fiery red-orange, magma rivers, ash skies",
      audio: "Fast, aggressive; choir carries the melody",
    },
    teaches:
      "The intro world, and the only one allowed to teach three things at once: how a puzzle is " +
      "read, how a jump is timed, and why resources are worth stopping for. Every later world " +
      "assumes all three and teaches exactly one new thing on top.",
    signature:
      "Lava redirection. The same flows that kill the player are the mechanism that opens the " +
      "ancient vaults — so the first lesson the game teaches is that the hazard is the tool, " +
      "which is the thesis of every world after it.",
    unlocks: {
      tool: "Fire-resistant shields",
      toolNote: "Opens the routes that run straight through the heat rather than around it.",
      rewards:
        "Stamina boosts and energy crystals — deliberately generous, so the first world pays out fast.",
    },
    hazards: [
      {
        name: "Dynamic lava flows",
        effect: "Move on their own; crossings become timing problems, not routes.",
      },
      {
        name: "Fragile platforms",
        effect: "Crumble underfoot — commit early, or lose the ground.",
      },
      {
        name: "Erupting vents",
        effect: "Block a path or reroute a flow; the player has to choose which.",
      },
    ],
    visuals:
      "Fiery reds and oranges, glowing magma rivers cut through black rock, ash-choked skies with " +
      "eruptions going off on the horizon. Legibility over subtlety: on the teaching world, the " +
      "thing that kills you is the brightest thing on screen.",
    audio: {
      character: "Fast-paced and aggressive",
      instruments: "Choir voices carry the main melody — human voices over an inhuman place",
      texture:
        "Deep volcanic rumble under everything, lava crackle up close, and intense percussion that " +
        "arrives only in the hazard zones against an eerie calm elsewhere.",
    },
    cohesion:
      "A world that teaches by threat. The percussion is a hazard tell before the player has " +
      "learned to read a lava flow — it enters when the ground is about to matter and drops back " +
      "to an eerie calm when it does not — so the ear learns the danger rhythm one beat ahead of " +
      "the eye. The choir over the rumble does the other half of the job: it keeps a human line " +
      "in a world with nothing human left on it.",
    arc: "lava · choir · timing",
  },
  {
    id: "dunestorm",
    ordinal: "World 02",
    name: "Dunestorm",
    skill: "Navigation & decryption",
    skillNote: "Reading a world that will not hold still — and reading the writing left on it.",
    cells: {
      teaches: "Navigation and decryption; adapting to terrain that moves",
      signature: "Decode ancient symbols to uncover buried secrets",
      unlocks: "Dust repellers · ancient inscriptions, upgrade resources",
      hazards: "Sandstorms, shifting dunes, buried traps",
      visuals: "Golden dunes, weathered ruins, mirages, heat haze",
      audio: "Heavy and ambient; strings lead",
    },
    teaches:
      "Orientation under pressure. Pyroterra's ground was hostile but it stayed where it was put; " +
      "Dunestorm's moves, so the player has to navigate by landmark and marker instead of memory — " +
      "and then read the symbols left behind by whoever was here first.",
    signature:
      "Decryption. Ancient symbols scattered across the ruins have to be decoded to find what is " +
      "buried under them, which makes the lore and the progression the same object: you cannot " +
      "advance without reading, and the reading is the story.",
    unlocks: {
      tool: "Dust repellers",
      toolNote:
        "Cut a clear path through a sandstorm — the storm stops being a wall and becomes a cost.",
      rewards: "Ancient inscriptions that carry the world's history, plus upgrade resources.",
    },
    hazards: [
      {
        name: "Sandstorms",
        effect:
          "Cut visibility and disrupt communication between the two players — the comms system is the hazard here.",
      },
      {
        name: "Shifting dunes",
        effect: "The terrain rewrites itself; markers are the only reliable way back.",
      },
      {
        name: "Buried traps",
        effect:
          "Immobilise a player temporarily, which on a co-op world means the other one has to come back.",
      },
    ],
    visuals:
      "Golden dunes to the horizon, weathered ruins half-swallowed by them, mirages and heat " +
      "distortion warping what the player thinks they can see. The world lies to the eye on " +
      "purpose — it is the navigation planet, so sight is the thing it takes away.",
    audio: {
      character: "Heavy and ambient",
      instruments: "String instruments lead — long, sustained, no rhythm to hold onto",
      texture:
        "Whistling winds that intensify as a storm closes in, echoes across shifting sand, and the " +
        "creak of ancient structures settling.",
    },
    cohesion:
      "The one world where the audio is not atmosphere but instrumentation. Sandstorms cut the " +
      "players' comms, so the wind rising is the last warning either of them gets before they " +
      "lose each other — the score's own storm layer doubles as the hazard tell. Under it the " +
      "strings stay long and rhythmless, which is exactly what a place with no fixed landmarks " +
      "should sound like.",
    arc: "sand · strings · getting lost",
  },
  {
    id: "tidalor",
    ordinal: "World 03",
    name: "Tidalor",
    skill: "Traversal & resource management",
    skillNote: "A whole new axis to move on, and a meter that runs down while you use it.",
    cells: {
      teaches: "Underwater traversal and oxygen / resource management",
      signature: "Jetpack traversal underwater; recover relics cooperatively",
      unlocks: "Oxygen harvesters · jetpack upgrades",
      hazards: "Oxygen depletion, aquatic predators, currents and pressure",
      visuals: "Bioluminescent depths, glowing ruins, dark trenches",
      audio: "Calm, in 3/4 — the tides, as tempo",
    },
    teaches:
      "Movement on a whole new axis, and a resource that spends itself whether or not the player " +
      "is making progress. Everything before this could be solved by stopping and thinking; " +
      "oxygen makes stopping cost something.",
    signature:
      "Jetpack traversal underwater, and relics that cannot be recovered alone. The ocean is the " +
      "only world where the pair are physically weightless and still dependent — the depth does " +
      "not separate them, the air does.",
    unlocks: {
      tool: "Oxygen harvesters",
      toolNote:
        "Replenish air from the plant life, which turns the flora into a route map: the way through is the way that breathes.",
      rewards:
        "Jetpack upgrades — every one of them buys mobility, which is the currency down here.",
    },
    hazards: [
      {
        name: "Oxygen depletion",
        effect: "A constantly running clock the player has to keep topping up from the world itself.",
      },
      {
        name: "Aquatic predators",
        effect: "React to noise and movement, so the counter is stealth rather than fighting.",
      },
      {
        name: "Currents and pressure",
        effect: "Push the player off their line and make depth itself a cost.",
      },
    ],
    visuals:
      "A surreal bioluminescent world: glowing creatures and glowing ruins, dark trenches with no " +
      "floor visible, trails of light left through the water. The only light source that matters " +
      "is alive, so the player reads the level by what is growing in it.",
    audio: {
      character: "Calm, and written in 3/4",
      instruments: "A waltz tempo, chosen so the music never sits still — it swells and recedes",
      texture:
        "Soft water whoosh, whale-like calls from somewhere out of sight, a low bioluminescence hum, " +
        "and sharp cues the moment a predator notices you.",
    },
    audioGem: {
      label: "Audio as worldbuilding",
      body:
        "Tidalor's score is in 3/4 rather than 4/4 for one reason: a waltz has constant motion built " +
        "into its meter — it never lands square, it swells and pulls back. That is a tide. The " +
        "world's defining physical force is written into the time signature, so the player feels " +
        "the ocean moving even in the still rooms where nothing is animating.",
    },
    cohesion:
      "The gentlest world and the one most likely to kill you. Everything is calm — the waltz, " +
      "the hum, the light — and the whole time a meter is emptying, so the tension comes from the " +
      "readout rather than the soundtrack. That is why the predator cues are sharp: they are the " +
      "only hard edge in the mix, and the only sound the player must react to instantly.",
    arc: "bioluminescence · a waltz · running out of air",
  },
  {
    id: "cryonix",
    ordinal: "World 04",
    name: "Cryonix",
    skill: "Advanced puzzles",
    skillNote: "The puzzle skill from Pyroterra, escalated into optics — and onto unstable ground.",
    cells: {
      teaches: "Advanced puzzles — light refraction — on unstable traversal",
      signature: "Refract light through crystals to open the cryo-chambers",
      unlocks: "Crystal augmenters · heat-resistant gear",
      hazards: "Slippery surfaces, collapsing ice, blizzards",
      visuals: "Icy blues, refracted light, glittering caves",
      audio: "Minimalist; instruments replicate ice through harmonics",
    },
    teaches:
      "The puzzle skill from the first world, taken as far as it goes: light refraction, solved " +
      "while crossing ground that will not hold. Two demands at once, which is only fair by the " +
      "fourth world.",
    signature:
      "Crystals that bend light into the cryo-chambers' locks, across precarious ice bridges. The " +
      "puzzle piece and the environment are the same material — the ice is what you solve with " +
      "and what you fall through.",
    unlocks: {
      tool: "Crystal augmenters",
      toolNote:
        "Enhance light manipulation, which widens the solution space rather than removing the puzzle.",
      rewards:
        "Heat-resistant gear — the reward on the coldest world is protection from heat, which is a straight setup for what comes after.",
    },
    hazards: [
      {
        name: "Slippery surfaces",
        effect: "Balance becomes an input; precision platforming stops being free.",
      },
      {
        name: "Collapsing ice",
        effect: "Paths exist temporarily — a route is a window, not a place.",
      },
      {
        name: "Blizzards",
        effect:
          "Strip visibility exactly when the puzzle needs the player to see where the light lands.",
      },
    ],
    visuals:
      "Icy blues, refraction patterns thrown through crystal, glittering caves and reflections " +
      "that move as the player does. The light is the puzzle, so the art direction's whole job is " +
      "making a beam readable at a glance.",
    audio: {
      character: "Minimalist — the sparsest score in the game",
      instruments:
        "Instruments played for tone and harmonics, chosen to replicate the sound of ice itself",
      texture: "Cracking ice and faint howling wind, with a lot of empty space between them.",
    },
    cohesion:
      "The only world scored by subtraction. A refraction puzzle needs the player concentrating, " +
      "so the music gets out of the way and leaves harmonics — thin, glassy, more texture than " +
      "melody — which is what ice would sound like if it were an instrument. The sparseness also " +
      "does the safety work: with almost nothing in the mix, ice cracking underfoot is impossible " +
      "to miss.",
    arc: "refracted light · harmonics · thin ice",
  },
  {
    id: "remnara",
    ordinal: "World 05",
    name: "Remnara",
    skill: "Stealth & combat",
    skillNote: "The last skill taught, because it is the one the finale is made of.",
    cells: {
      teaches: "Stealth and combat — the finale's skill set",
      signature: "Gather resources among hostile fauna and fallen ruins",
      unlocks: "Camouflage cloaks · high-value resources, lore items",
      hazards: "Aggressive wildlife, dense foliage, toxic flora",
      visuals: "Vibrant greens, towering trees, vine-covered ruins",
      audio: "Calm, melodic, familiar — deliberately comforting",
    },
    teaches:
      "Stealth and combat, and the choice between them. It is the last thing taught because it is " +
      "the thing the endgame is built out of — the player arrives at the finale having just " +
      "practised it, not having read about it four worlds ago.",
    signature:
      "Resource-gathering under threat, through the overgrown ruins of a civilisation that did " +
      "not survive this system. Every encounter is a live question: go quiet, or go loud.",
    unlocks: {
      tool: "Camouflage cloaks",
      toolNote:
        "Evade the wildlife rather than beat it — the world hands the player a way to opt out of its own combat.",
      rewards:
        "High-value resources and the lore items that explain how the fallen civilisation fell.",
    },
    hazards: [
      {
        name: "Aggressive wildlife",
        effect: "Forces the stealth-or-fight call, over and over, with different odds each time.",
      },
      {
        name: "Dense foliage",
        effect: "Cuts sightlines and hides ambushes — cover works for both sides.",
      },
      {
        name: "Toxic flora",
        effect:
          "Harmful spores that make some of the safest-looking cover the worst place to hide.",
      },
    ],
    visuals:
      "Vibrant greens, towering trees, bioluminescent fungi, ruins under vines. The most beautiful " +
      "world in the system is a graveyard, and the art has to carry both readings at once.",
    audio: {
      character: "Calm, melodic and deliberately familiar",
      instruments:
        "The most conventionally tuneful writing in the game — it is meant to sound like somewhere you know",
      texture:
        "A rich wildlife bed, leaves rustling close by, distant roars, and sudden spikes that signal " +
        "danger before it is visible.",
    },
    cohesion:
      "The only world that sounds like home, which is precisely why it is the cruellest. It is the " +
      "one habitable planet in the system, so the score is warm and melodic and comforting on " +
      "purpose — and then the spikes cut through it. Comfort is not a gift here, it is the setup: " +
      "the player relaxes into familiar music on the world where a mistake costs the most.",
    arc: "green ruins · a familiar melody · things that hunt",
  },
] as const;

/* ---- space --------------------------------------------------------------
   Between the worlds. It is not a level, but the ship sections are their own
   soundscape, and they carry the audio idea the whole score is anchored to —
   so it sits alongside the five worlds rather than inside one. */

export const spaceAudio = {
  kicker: "Between worlds · the ship",
  headline: "Minimalist ship music, with an ominous chorus",
  body:
    "The ship is scored almost bare, with a chorus underneath it that is not reassuring. The " +
    "contrast is the point: two people in a small vessel against a system that does not notice " +
    "them. The chorus is the size of the place, and the players are what is left over.",
  gem: {
    label: "Silence in space",
    body:
      "No sound travels in the void — there is nothing out there to carry the vibration — so the " +
      "exterior sections are genuinely silent. The exception is the one thing that earns it: an " +
      "asteroid striking the hull IS audible, because now the vibration has something to travel " +
      "through. The realism is not a gimmick; it makes silence the default state, so the impact " +
      "lands like a gunshot.",
  },
} as const;

/* ---- framing ------------------------------------------------------------ */

/** The chart's claim, above everything. */
export const teachingThesis =
  "Five worlds, sequenced as a curriculum. Each one teaches a different skill and then assumes " +
  "it forever: the core loop on Pyroterra, navigation and decryption on Dunestorm, traversal and " +
  "resource management on Tidalor, advanced puzzles on Cryonix, and stealth and combat on " +
  "Remnara — which is the skill set the finale is built out of. Played in that order, the game " +
  "never explains the same thing twice.";

/** Says out loud what this section is NOT, so the dossier is not re-read. */
export const dossierPointer =
  "The dossier above is what each world IS — gravity, size, temperature, ecosystem. This is how " +
  "each one PLAYS.";

export const progressionCaption =
  "The teaching progression, read across: what it teaches · what you hear · what it asks of you.";

/**
 * Attribution, split by discipline because the two halves of this section were
 * not made the same way. Rendered above the chart, not under it.
 */
export const levelsCredit = {
  headline: "Team project · team of five",
  role: "Systems & World Designer",
  lines: [
    {
      id: "audio",
      label: "Audio design",
      claim: "Mine",
      body:
        "Every world's score, instrumentation and soundscape, plus the ship music and the silence " +
        "rule for space. Designed and written by me.",
    },
    {
      id: "level",
      label: "Level design",
      claim: "Co-designed with one other designer",
      body:
        "The teaching progression, the signature puzzles, the hazard sets and the unlock economy " +
        "were worked out between the two of us.",
    },
  ],
} as const;

/** The classification and world colour, read from the dossier's data. */
export function planetFacet(id: PlanetId): { kind: string; accent: string } {
  const p = planetById[id];
  return { kind: p.kind, accent: p.accent };
}

export function getLevelPlanet(id: PlanetId): LevelPlanet {
  const planet = levelPlanets.find((p) => p.id === id);
  if (!planet) throw new Error(`Unknown level planet: ${id}`);
  return planet;
}

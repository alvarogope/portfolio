import { planetById, type PlanetId } from "./shattered-skies-planets";

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

export interface Hazard {
  name: string;
}

export interface PlanetAudio {
  character: string;
  instruments: string;
  texture: string;
}

export interface AudioGem {
  label: string;
  body: string;
}

export interface LevelPlanet {
  id: PlanetId;
  ordinal: string;
  name: string;
  skill: string;
  skillNote: string;

  cells: Record<DimensionId, string>;

  teaches: string;
  signature: string;
  unlocks: { tool: string; toolNote: string; rewards: string };
  hazards: readonly Hazard[];
  visuals: string;
  audio: PlanetAudio;
  audioGem?: AudioGem;

  cohesion: string;
  arc: string;
}

export const levelPlanets: readonly LevelPlanet[] = [
  {
    id: "pyroterra",
    ordinal: "Planet 1",
    name: "Pyroterra",
    skill: "Core mechanics",
    skillNote: "The alphabet: solve, platform, gather.",
    cells: {
      teaches: "The Core mechanics: puzzle-solving, platforming, resource gathering",
      signature: "Redirect lava to unlock vaults",
      unlocks: "Fire-resistant shields, stamina boosts, energy crystals",
      hazards: "Dynamic lava flows, crumbling platforms",
      visuals: "Intense red colours, lava rivers, grey skies",
      audio: "Fast and aggressive. A choir that carries the melody",
    },
    teaches:
      "The first world that teaches three core mechanics: how the puzzles work, " +
      "how the jumps are timed and why resources are important. These are repeated througout the game.",
    signature:
      "Lava redirection. The lava rivers that kill the player are used to open the " +
      "vaults to progress. This is for the player to understand that anything can bea tool " + 
      "and that the world can interact with itself.",
    unlocks: {
      tool: "Fire-resistant shields",
      toolNote: "Opens paths for running straight through the heat.",
      rewards:
        "Stamina boosts and energy crystals.",
    },
    hazards: [
      {
        name: "Dynamic lava flows",
      },
      {
        name: "Fragile platforms",
      },
      {
        name: "Erupting vents",
      },
    ],
    visuals:
      "Intense red and orange predominant in the world, magma rivers cutting through black rock, grey skies with " +
      "eruptions going off on the horizon. So it's clear that the environment is dangerous.",
    audio: {
      character: "Fast-paced and aggressive",
      instruments: "Choir voices for the main melody.",
      texture:
        "",
    },
    cohesion:
      "Forces the players to learn quick to survive. The environment tries to kill constantly, " +
      "through lava rivers and eruptions, but these are dodgebale since the come in patterns. " +
      "The audio sets the tone: human lines in a world that nothing human is left.",
    arc: "lava · choir · timing",
  },
  {
    id: "dunestorm",
    ordinal: "Planet 2",
    name: "Dunestorm",
    skill: "Navigation & decryption",
    skillNote: "Understanding a dynamic world",
    cells: {
      teaches: "Navigation and decryption. Adapt to a dynamic terrain",
      signature: "Solve ancient symbols to decrypt secrets",
      unlocks: "Dust repellers, old inscriptions, upgrade resources",
      hazards: "Sandstorms, dunes, buried traps inn the sand",
      visuals: "Golden dunes, weathered ruins, mirages",
      audio: "Heavy and ambient. Strings as leading instruments",
    },
    teaches:
      "Orientation is key, in a hostile ground with no landmarks. They can amrk the areas for better movement. " +
      "Read symbols that were left behind.",
    signature:
      "An old language found in the ruins. The players have to decode it to find where they guide to and what they mean. " +
      "Progression, story and lore merge in these texts.",
    unlocks: {
      tool: "Dust repellers",
      toolNote:
        "Create a path through a sandstorm, survive to the environment.",
      rewards: "Inscriptions with the world's history and upgrade resources.",
    },
    hazards: [
      {
        name: "Sandstorms",
      },
      {
        name: "Shifting dunes",
      },
      {
        name: "Buried traps",
      },
    ],
    visuals:
      "Dunes as landscape, ruins swallowed by the sand, heat distortion playing with what the player sees. " +
      "The players must feel confused as the planet is designed to feel like that.",
    audio: {
      character: "Heavy and ambient",
      instruments: "String instruments. Long, sustainedand with no rhythm",
      texture:
        "",
    },
    cohesion:
      "The audio is instrumentation and it builds up with every sandstorm, making the players lose each other. " +
      "The music relates to the environment being very static. There are no landmarks in the planet and " +
      "the music makes it feel like a liminal space.",
    arc: "sand · strings · getting lost",
  },
  {
    id: "tidalor",
    ordinal: "Moon",
    name: "Tidalor",
    skill: "Traversal & resource management",
    skillNote: "Movement gains a new perspective in the moon.",
    cells: {
      teaches: "Underwater traversal. Oxygen and resource management",
      signature: "Jetpack traversal underwater. Recovering relics cooperatively",
      unlocks: "Oxygen harvesters · jetpack upgrades",
      hazards: "Oxygen management, aquatic predators, currents and water pressure",
      visuals: "Bioluminescent underwater, ruins, and pitch balck for the depths",
      audio: "A calm 3/4 tempo. Tides in the soundtrack",
    },
    teaches:
      "Movement in this world could cost the life of the characters. Players need the oxygen underwater, " +
      "so a mistake could be fatal. Now, pausing for thinking costs time.",
    signature:
      "The main movement are the use of jetpacks underwater. Now the players have to cooperate in a new " +
      "state for gathering the relics.",
    unlocks: {
      tool: "Oxygen harvesters",
      toolNote:
        "Get air from the plant life, making the flora into a route and guiding the players.",
      rewards:
        "Jetpack upgrades. Movement is important here.",
    },
    hazards: [
      {
        name: "Oxygen depletion",
      },
      {
        name: "Aquatic predators",
      },
      {
        name: "Currents and pressure",
      },
    ],
    visuals:
      "A bioluminescent world, guiding the players through the natural lights of the animals and surface. " +
      "There are ruins with old lights and dark eerie spaces. The moving lights become guides or warnings.",
    audio: {
      character: "Calm, and written in 3/4",
      instruments: "A waltz. A music that never stops moving.",
      texture:
        "",
    },
    audioGem: {
      label: "Audio as worldbuilding",
      body:
        "Making Tidalor's music to 3/4 makes the world a moving and non-stop place, reseambling waves. " +
        "This enhances the feeeling of ocean bigger for the players.",
    },
    cohesion:
      "This world seems calm at the beginning. The music, the waves and the light are designed to relax the players. " +
      "The tension comes from sounds that are not from the soundtrack and from the dynamic tides that cover " +
      "its surface.",
    arc: "bioluminescence · a waltz · running out of air",
  },
  {
    id: "cryonix",
    ordinal: "Planet 3",
    name: "Cryonix",
    skill: "Advanced puzzles",
    skillNote: "The puzzle skill learnt through the game becomes a real challenge.",
    cells: {
      teaches: "Advanced puzzles. Use of light refraction and unstable traversal",
      signature: "Refract light through crystals to open the cryo-chambers",
      unlocks: "Crystal augmenters · heat-resistant gear",
      hazards: "Slippery surfaces, collapsing ice, blizzards",
      visuals: "Light blues, reflections and glittering caves",
      audio: "Minimalist. Instruments use harmonics",
    },
    teaches:
      "The described puzzles come back, but more challenging: light refraction, solved " +
      "while crossing ground that can break. Increasing the risk in the solving and the environment.",
    signature:
      "Crystals that bend light into the cryo-chambers' locks, across precarious ice bridges. The " +
      "puzzle piece and the environment are the same material — the ice is what you solve with " +
      "and what you fall through.",
    unlocks: {
      tool: "Crystal augmenters",
      toolNote:
        "Light manipulation. Amplifying the solution space and make it more difficult.",
      rewards:
        "Heat-resistant gear. Setting up the next level.",
    },
    hazards: [
      {
        name: "Slippery surfaces",
      },
      {
        name: "Collapsing ice",
      },
      {
        name: "Blizzards",
      },
    ],
    visuals:
      "Cold blues, refraction patterns through crystal, glittering caves and reflections " +
      "that move as the players do. The light is part of the puzzle, so the art direction's whole job is " +
      "making them readable.",
    audio: {
      character: "Minimalist",
      instruments:
        "Instruments played for tone and harmonics, chosen to replicate the sound of ice itself",
      texture: "",
    },
    cohesion:
      "The biggest challenge for the players. Traversal, resource management and the spatial awareness " +
      "that the Symbiochord requires become the focal point. The music is based in harmonics and " +
      "the tempo is slow. As glassy and cold as possible. By moving the soundtrack to a secondary role " +
      "the environmental sounds become important and noticeable.",
    arc: "refracted light · harmonics · thin ice",
  },
  {
    id: "remnara",
    ordinal: "Planet 5",
    name: "Remnara",
    skill: "Stealth & combat",
    skillNote: "The last skills are taught.",
    cells: {
      teaches: "Stealth and combat ultimate challenge",
      signature: "Gather resources protected by hostile animals",
      unlocks: "Camouflage clothes, high-value resources, lore items",
      hazards: "Aggressive wildlife and toxic flora",
      visuals: "Vibrant greens, towering trees.",
      audio: "Calm, melodic, familiar, sounds like home",
    },
    teaches:
      "Stealth or combat, player have to choose. It is the last thing taught and what the last challenge is based of.",
    signature:
      "Ruins of a civilisation. All the resources that are left were used by them.",
    unlocks: {
      tool: "Camouflage cloaks",
      toolNote:
        "Avoid the wild animals or defeat them.",
      rewards:
        "High-value resources and the lore items that explain how the civilisation fell.",
    },
    hazards: [
      {
        name: "Aggressive wildlife",
      },
      {
        name: "Dense foliage",
      },
      {
        name: "Toxic flora",
      },
    ],
    visuals:
      "Vibrant greens, towering trees and ruiny environment. The most beautiful " +
      "world in the system as a graveyard.",
    audio: {
      character: "Calm, melodic and deliberately familiar",
      instruments:
        "Major mode so the tone and harmony is familiar. It sounds like home.",
      texture:
        "",
    },
    cohesion:
      "Earth-like planet. The characters' movement is easy and the music sounds like home, warm " + 
      "and melodic. Contrasting with its cruelty and tense encounters.",
    arc: "green ruins · a familiar melody · things that hunt",
  },
] as const;

export const spaceAudio = {
  kicker: "Between worlds · the ship",
  headline: "Minimalist ship music",
  body:
    "The ship's music is almost non-existant. It has a chorus whose " +
    "contrast is the point: two people in a ship against a system that does not notice " +
    "them.",
  gem: {
    label: "Silence in space",
    body:
      "Since no sound can travel through void, when the players are in the space, there is no sound. " +
      "This also creates the sensation of being in front of everything and nothing at the same time. " +
      "When there are collisions with the spaceship, it sounds, make them seem massive when it impacts.",
  },
} as const;

export const teachingThesis =
  "Each planet teaches a different skill and challenges the players. The last planet is the ultimate " +
  "challenge, since it combines everything the players learn through the whole journey.";

export const dossierPointer =
  "";

export const progressionCaption =
  "The teaching progression: what it teaches · what you hear · what it demands.";

export const levelsCredit = {
  headline: "Team project · team of five",
  role: "Systems & World Designer",
  lines: [
    {
      id: "audio",
      label: "Audio design",
      claim: "My design",
      body:
        "I designed what each planet should sound like and the slowing down in space soundscape.",
    },
    {
      id: "level",
      label: "Level design",
      claim: "Co-designed with another designer",
      body:
        "Teaching the progression, puzzles, the hazards and the economy " +
        "were worked out between the two of us.",
    },
  ],
} as const;

export function planetFacet(id: PlanetId): { kind: string; accent: string } {
  const p = planetById[id];
  return { kind: p.kind, accent: p.accent };
}

export function getLevelPlanet(id: PlanetId): LevelPlanet {
  const planet = levelPlanets.find((p) => p.id === id);
  if (!planet) throw new Error(`Unknown level planet: ${id}`);
  return planet;
}

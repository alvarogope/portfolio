export const lead = {
  tag: "The premise",
  body:
    "Shatterstorm is a world that came apart. Its crust broke into a network of floating " +
    "landmasses, strung together by rotting ancient bridges and technological scaffolding that " +
    "was never built to hold this long. Storm-wracked skies, glowing energy fissures, debris " +
    "drifting where ground used to be — destruction and beauty in the same frame, and never one " +
    "without the other.",
  reconcile: "The cataclysm was called the Shatterstorm. So is what it left.",
  note:
    "The premise is a design decision before it is a description: the ground is not a given. " +
    "Every space in the game is a fragment with an edge, and every way between two fragments is " +
    "something somebody built or something that merely survived. Nothing in the game gets to " +
    "assume solid ground, which is what makes traversal a question rather than a control scheme.",
} as const;

export const metaphor = {
  title: "The Shatterstorm",
  body:
    "The main event of the game is a metaphor of the relationship of the characters. " +
    "This event broke the world into pieces that stay together. The same as Aevi and Drayk.",
  note:
    "Designing this setting was an important world design decision. The environment of the world has the same patterns as " +
    "their characters. Broken by war, but fully connected.",
} as const;

export interface WorldTexture {
  id: string;
  label: string;
  body: string;
}

export const textures: readonly WorldTexture[] = [
  {
    id: "light",
    label: "Light",
    body:
      "Bioluminescent flora climbs out of the dark crevices between fragments, so the deepest, " +
      "least survivable parts of the world are the parts that glow.",
  },
  {
    id: "air",
    label: "Air",
    body:
      "An acrid mix of ozone off the permanent electrical storms and the earth-smell of ruins " +
      "going back to nature. You can tell how close the next storm is by breathing.",
  },
  {
    id: "sound",
    label: "Sound",
    body:
      "Thunder at a distance that never closes, energy crackling loose across a fissure, and — " +
      "nearer than either — the cry of something that has not shown itself yet.",
  },
  {
    id: "life",
    label: "Life",
    body:
      "Chimeric creatures that read like two animals arguing over one body. Ecosystems that swing " +
      "without warning: alien jungle on one fragment, desolate plain on the next.",
  },
];


export const relicsLead =
  "The technology that survives here is not the players' technology. Veynar machinery is still " +
  "running on fragments where nobody is left to run it, and their ruins are cut through with " +
  "symbols in a language nobody has spoken for centuries. The relics are the world's memory — " +
  "and, in one case, its way out.";

export interface Relic {
  id: string;
  term: string;
  gloss: string;
}

export const relics: readonly Relic[] = [
  {
    id: "gravity-stabilizers",
    term: "Gravity stabilizers",
    gloss:
      "Veynar machines still holding the landmasses in the air, centuries after the hands that " +
      "built them stopped.",
  },
  {
    id: "kadura",
    term: "Kadura stones",
    gloss: "Monoliths spiking the fractured horizon. Nobody living knows what they were for.",
  },
  {
    id: "energy-cores",
    term: "Singing energy cores",
    gloss: "Power sources of a forgotten make. You hear one long before you find it.",
  },
  {
    id: "zyrium",
    term: "Zyrium Crystals",
    gloss:
      "The one known key to removing the parasite — and the reason the journey has to reach the " +
      "coldest world in the system.",
  },
];


export const whoRemains = {
  title: "Who remains",
  body:
    "The Shatterstorm is not empty. Scavengers, nomads and solitary tribesmen hold on in the " +
    "ruins — some hunting the lost technology to restore it, some to own it, and the distance " +
    "between those two motives is most of the politics left out here. The Rynor and the Tethrans " +
    "each adapted to the broken world in their own way, which is part of why they are still at " +
    "war over what is left of it.",
} as const;
/**
 * Shattered Skies — the world of Shatterstorm: the setting's soul, as opposed
 * to its facts.
 *
 * THE DIVISION OF LABOUR with `shattered-skies-planets.ts` is deliberate and
 * should be kept. That file is the survey: five worlds, gravity, diameter,
 * temperature, ecosystem, the hazard each one poses. This file is the world
 * those numbers are numbers ABOUT — what the place feels like to stand on,
 * why it is broken, and what the breakage is doing for the story. Nothing
 * here repeats a planet, a stat or a hazard, and `bridge` below is the one
 * sentence that hands the reader over to the dossier.
 *
 * ATTRIBUTION. Shattered Skies is a team project (team of 5); the world design
 * is mine. `roleNote` says exactly that and no more — the framing to avoid is
 * one that reads as though I wrote the whole game.
 *
 * ON THE NAME. "Shatterstorm" is used two ways across the project and both are
 * correct: the cataclysm that broke the crust, and the world it left behind.
 * `lead.reconcile` below is the line that makes that explicit rather than
 * leaving the reader to trip over it — see the Shatterstorm note in
 * `shattered-skies-overview.ts`, which uses the event sense.
 */

/* ---- attribution -------------------------------------------------------- */

/* ---- the lead: the core world-design premise ---------------------------- */

export const lead = {
  tag: "The premise",
  body:
    "Shatterstorm is a world that came apart. Its crust broke into a network of floating " +
    "landmasses, strung together by rotting ancient bridges and technological scaffolding that " +
    "was never built to hold this long. Storm-wracked skies, glowing energy fissures, debris " +
    "drifting where ground used to be — destruction and beauty in the same frame, and never one " +
    "without the other.",
  /** Both senses of the name, said once, so neither reading trips the reader. */
  reconcile: "The cataclysm was called the Shatterstorm. So is what it left.",
  /** The design claim underneath the picture. This is the part that is a decision. */
  note:
    "The premise is a design decision before it is a description: the ground is not a given. " +
    "Every space in the game is a fragment with an edge, and every way between two fragments is " +
    "something somebody built or something that merely survived. Nothing in the game gets to " +
    "assume solid ground, which is what makes traversal a question rather than a control scheme.",
} as const;

/* ---- the thematic argument ---------------------------------------------- */

export const metaphor = {
  title: "The world is the argument",
  body:
    "A shattered planet for two shattered peoples, forced together. The Shatterstorm is not a " +
    "backdrop the story happens in front of — it is the story's argument, made in terrain. Drayk " +
    "and Aevi are two destinies twined too closely to pull apart, crossing a world in precisely " +
    "that condition: broken into pieces that hold only because something is holding them. Every " +
    "bridge they cross restates the thesis, and every one of those bridges is rotting.",
  /** Kept separate so the claim above can be read as craft, not as poetry. */
  note:
    "Designing the setting to embody the premise rather than decorate it is the world-design call " +
    "I would defend hardest here. Two species fractured by war, bound by a parasite neither chose, " +
    "moving across a fractured world bound by machinery nobody maintains: the reader should reach " +
    "the same conclusion from the landscape that the story reaches out loud.",
} as const;

/* ---- the living ruins: sensory texture ----------------------------------
   Four notes, one sense each where it can be. Short on purpose — this band is
   meant to be skimmed and remembered, not studied. */

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

/* ---- relics of the Veynar ------------------------------------------------ */

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

/* ---- who is left --------------------------------------------------------- */

export const whoRemains = {
  title: "Who remains",
  body:
    "The Shatterstorm is not empty. Scavengers, nomads and solitary tribesmen hold on in the " +
    "ruins — some hunting the lost technology to restore it, some to own it, and the distance " +
    "between those two motives is most of the politics left out here. The Rynor and the Tethrans " +
    "each adapted to the broken world in their own way, which is part of why they are still at " +
    "war over what is left of it.",
} as const;

/* ---- the handover -------------------------------------------------------
   The one line that points at the planetary dossier. Deliberately carries no
   planet names, no stats and no hazards: the survey does that itself, and
   saying it twice would make the reader read it neither time. */

export const bridge =
  "What that premise became, world by world, is the survey below.";

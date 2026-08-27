/**
 * Shattered Skies — the five worlds of the system, ordered by distance from the star.
 *
 * Stage 1 renders this as the survey dossier (`PlanetDossier`). Stage 2 puts an
 * animated orrery above that dossier reading the same array, so everything an
 * orbit animation needs — `orbitIndex`, `orbitRadius`, `renderScale`, `accent` —
 * lives here rather than in the view.
 *
 * Distances and sizes are schematic: they preserve order and rough proportion,
 * not real scale.
 *
 * THIS FILE ALSO OWNS KNOWLEDGE-GATED ACCESS. The rule used to be prose in the
 * co-op design section, three thousand words down the page from the only
 * diagram that can actually show it. It is an argument about ORBITS — a route
 * that opens when a moon reaches the right part of its arc, a world whose
 * gravity holds you until you have learned something elsewhere — so it belongs
 * to the orbital diagram and not to a paragraph. `knowledgeGate` below is the
 * system-level rule; `Planet.access` is that rule applied one world at a time,
 * and the dossier prints it on every card. The co-op section keeps a one-line
 * pointer and nothing else.
 *
 * NOTHING HERE IS INVENTED. Every `access` entry is either a restatement of
 * copy that already existed — `designChallenge.quote` on the project file
 * (Tidalor's tides, Dunestorm's gravity lock), the `note` lines below, or the
 * Zyrium relic in `shattered-skies-world.ts` — or an explicit statement that a
 * world has no gate, which is a fact about the design rather than a blank.
 * `gate: "open"` is an honest answer, not a missing one.
 */

export type PlanetId = "pyroterra" | "dunestorm" | "remnara" | "tidalor" | "cryonix";

/* ---- knowledge-gated access ---------------------------------------------
   What stands between a player and a place. Deliberately NOT a lock type:
   there are no locks in this game, so the union names the PHYSICS doing the
   gating instead.

   - `open`     nothing withheld. Stated rather than left blank.
   - `orbital`  a window that opens and closes as a body travels its arc.
   - `gravity`  a surface condition the player has to out-engineer to leave. */

export type AccessGate = "open" | "orbital" | "gravity";

export interface PlanetAccess {
  gate: AccessGate;
  /** Two or three words. The chip on the card and in the orrery's pinned bar. */
  label: string;
  /** The condition, in one line. What the world is actually doing. */
  rule: string;
  /**
   * The thing the player has to UNDERSTAND to pass it — which is the whole
   * point of the system, so it is a first-class field rather than a clause
   * inside `rule`. On an ungated world this says so plainly.
   */
  knowledge: string;
}

export interface Planet {
  /** Stable key. Also selects the SVG symbol (`#ssp-<id>`) and the active-planet highlight. */
  id: PlanetId;
  name: string;
  /** Short classification line, e.g. "Lava World". */
  kind: string;
  /** 1-based position outward from the star. */
  orbitIndex: number;
  /** Rendered orbit tag, e.g. "Orbit 01" or "Orbit 04 · Moon". */
  orbitLabel: string;
  /** Tidalor orbits a gas giant rather than the star directly. */
  isMoon: boolean;
  /** What it orbits, when that is not the star. */
  host?: string;
  /** The one world players can live on. */
  habitable: boolean;

  gravity: string;
  /** Gravity band: "Low" | "High" | "Earth-like" | "Extremely low". */
  gravityClass: string;
  diameter: string;
  diameterKm: number;
  temperature: string;
  temperatureC: number;

  ecosystem: string;
  /** One-line design note — what the world does to the player. */
  note: string;
  /** What gates this world, and what the player has to know to pass it. */
  access: PlanetAccess;

  /** World colour. Used for the orbit tag, the gravity class and the temperature ramp. */
  accent: string;
  /** Distance from the star, 0–1 relative to the outermost world. Schematic. */
  orbitRadius: number;
  /** Render size, 0–1 relative to the largest world (Dunestorm). */
  renderScale: number;
}

export const shatteredSkiesPlanets: readonly Planet[] = [
  {
    id: "pyroterra",
    name: "Pyroterra",
    kind: "Lava World",
    orbitIndex: 1,
    orbitLabel: "Orbit 01",
    isMoon: false,
    habitable: false,
    gravity: "2.7 m/s²",
    gravityClass: "Low",
    diameter: "4,500 km",
    diameterKm: 4500,
    temperature: "1,570 °C",
    temperatureC: 1570,
    ecosystem: "Lava lakes & volcanic rock",
    note: "Tunnels beneath the lava; eruptions never stop.",
    access: {
      gate: "open",
      label: "Open",
      rule:
        "Nothing is withheld. Orbit 01 is where the system opens, and every route on it is " +
        "available the first time a player lands.",
      knowledge:
        "None required — Pyroterra is the world the other four are understood against.",
    },
    accent: "#FF6B35",
    orbitRadius: 0.16,
    renderScale: 0.71,
  },
  {
    id: "dunestorm",
    name: "Dunestorm",
    kind: "Desert World",
    orbitIndex: 2,
    orbitLabel: "Orbit 02",
    isMoon: false,
    habitable: false,
    gravity: "17.01 m/s²",
    gravityClass: "High",
    diameter: "9,645 km",
    diameterKm: 9645,
    temperature: "61 °C",
    temperatureC: 61,
    ecosystem: "Sand, rock & fast winds",
    note: "Everything is built underground, below the winds.",
    access: {
      gate: "gravity",
      label: "Surface gravity",
      rule:
        "17.01 m/s² pins a player to the surface. Landing on Dunestorm is easy and leaving it is " +
        "not: the thruster that got you down cannot lift you off again.",
      knowledge:
        "That the thruster can be upgraded at all, and that the upgrade is somewhere else in the " +
        "system. The gate is on Dunestorm; the answer never is.",
    },
    accent: "#E39A45",
    orbitRadius: 0.34,
    renderScale: 1,
  },
  {
    id: "remnara",
    name: "Remnara",
    kind: "Temperate World",
    orbitIndex: 3,
    orbitLabel: "Orbit 03",
    isMoon: false,
    habitable: true,
    gravity: "9.1 m/s²",
    gravityClass: "Earth-like",
    diameter: "5,580 km",
    diameterKm: 5580,
    temperature: "18 °C",
    temperatureC: 18,
    ecosystem: "Plants & water",
    note: "Post-war remains are the players' building material.",
    access: {
      gate: "open",
      label: "Open",
      rule:
        "Earth-like gravity, no orbital condition, no hazard that closes a route. The one world " +
        "in the system that simply lets a player walk on it.",
      knowledge:
        "None. Remnara arrives late in the teaching order rather than behind a door — what the " +
        "player is missing on their first visit is a skill, not access.",
    },
    accent: "#74C9A8",
    orbitRadius: 0.55,
    renderScale: 0.76,
  },
  {
    id: "tidalor",
    name: "Tidalor",
    kind: "Ocean Moon",
    orbitIndex: 4,
    orbitLabel: "Orbit 04 · Moon",
    isMoon: true,
    host: "Gas giant",
    habitable: false,
    gravity: "1.03 m/s²",
    gravityClass: "Low",
    diameter: "2,100 km",
    diameterKm: 2100,
    temperature: "7 °C",
    temperatureC: 7,
    ecosystem: "Rock beneath water",
    note: "Tides open and close routes as the moon travels.",
    access: {
      gate: "orbital",
      label: "Tidal window",
      rule:
        "Routes open and close with the tide, and the tide is set by where Tidalor sits in its " +
        "orbit around the gas giant. The same path is a corridor at low water and gone at high.",
      knowledge:
        "Which part of the arc runs the tide low — and then either the patience to wait for it " +
        "or a flight plan that arrives when it does.",
    },
    accent: "#57B6D8",
    orbitRadius: 0.78,
    renderScale: 0.35,
  },
  {
    id: "cryonix",
    name: "Cryonix",
    kind: "Dwarf Planet · Ice",
    orbitIndex: 5,
    orbitLabel: "Orbit 05",
    isMoon: false,
    habitable: false,
    gravity: "0.51 m/s²",
    gravityClass: "Extremely low",
    diameter: "1,150 km",
    diameterKm: 1150,
    temperature: "−34 °C",
    temperatureC: -34,
    ecosystem: "Icy crystal desert",
    note: "Source of the Zyrium Crystals, buried under ice.",
    access: {
      gate: "open",
      label: "Open",
      rule:
        "Reachable from the first hour, like everywhere else. Nothing on Cryonix is locked and " +
        "nothing about the ice refuses a player who flies out to it.",
      knowledge:
        "What is under the ice. The Zyrium buried here is the one known way to remove the " +
        "parasite, and until a player understands that, the coldest world in the system is a " +
        "long flight to a crystal desert.",
    },
    accent: "#A8DCEC",
    orbitRadius: 1,
    renderScale: 0.29,
  },
];

/* ---- the system-level rule ----------------------------------------------
   Moved here from the co-op design section, where it was prose sitting a long
   way from the only picture that can carry it. Everything in this block is
   about the SYSTEM rather than about one world; the per-world half is
   `Planet.access` above.

   ATTRIBUTION. Shattered Skies is a team project (team of five) and my role on
   it was Systems & World Designer. The planetary system and the access rule
   below are world-design work, argued out with the team like everything else
   on this project. `knowledgeGate.credit` says that on the page in one line,
   because this block now sits in a section that had no attribution of its own
   and the credit should travel with the claim.

   THE WORKED EXAMPLE stays deliberately unattributed to a planet. The source
   copy never named which world the cave is on, and inventing one to make the
   diagram tidier would be inventing design. It is rendered as a system-level
   figure instead — which is also the honest shape, since the rule it
   demonstrates is about a RELATIONSHIP between two bodies rather than about a
   place. */

export const knowledgeGate = {
  kicker: "Access",
  title: "A metroidvania of knowledge",
  standfirst:
    "The whole system is open from the first hour. What is closed is everything you do not yet " +
    "understand about how it moves.",
  lead:
    "There are no keys in Shattered Skies, and no traversal upgrades held back to be handed out " +
    "later. Players can fly anywhere from the start. The thing that actually gates the world is " +
    "comprehension: the orbits, the alignments and the conditions each world imposes are the " +
    "lock, and learning how the system works is the only way to pick it.",

  /** The rule, stated once, above the per-world column. */
  rule: {
    label: "The rule",
    body:
      "Free exploration from the start, with access gated by knowledge rather than by keys or " +
      "upgrades. Everything a player needs to reach any place in the game is already in their " +
      "hands the first time they undock. What they are missing is not equipment — it is the " +
      "understanding of when and where the system opens.",
  },

  /** The figure: two bodies opposite each other, and the door that is an orbit. */
  example: {
    label: "What that looks like in play",
    body:
      "An information note found on one world describes a cave that can only be entered while its " +
      "planet sits opposite a particular location. Nothing about the cave is locked; the door is " +
      "the orbit. Read the note, understand the alignment, wait for it or fly to meet it — and a " +
      "place that was closed the last four times you flew past it is simply open.",
    /** The `<desc>` for the alignment figure. */
    figureSummary:
      "A star at the centre with one orbit drawn around it. A planet sits on one side of the " +
      "orbit and the location it must align with sits directly opposite, with a dashed line " +
      "running between them straight through the star. The caption marks that line as the moment " +
      "the cave is open; at every other point on the arc it is shut.",
    figureOpenLabel: "Aligned · open",
    figureShutLabel: "Anywhere else · shut",
  },

  designPoint:
    "Progression you cannot lose, cannot be given and cannot skip: the player unlocks the world " +
    "by understanding it, and the only thing that carries between sessions is what they now know.",

  credit:
    "Team of five · my role: Systems & World Designer. The planetary system and this access rule " +
    "are world design, worked out with the team.",
} as const;

/** How each gate reads in the legend, so the chips are never colour alone. */
export const accessGateMeta: Record<AccessGate, { term: string; gloss: string }> = {
  open: { term: "Open", gloss: "nothing withheld — stated, not left blank" },
  orbital: { term: "Orbital window", gloss: "a route that opens as a body travels its arc" },
  gravity: { term: "Gravity", gloss: "a surface condition you have to out-engineer to leave" },
};

/** The gas giant Tidalor orbits. Scenery — it is not one of the five surveyed worlds. */
export const tidalorHost = {
  name: "Gas giant",
  label: "Gas giant · host",
  accent: "#D6B183",
} as const;

export const planetById = Object.fromEntries(
  shatteredSkiesPlanets.map((p) => [p.id, p])
) as Record<PlanetId, Planet>;

export type PlanetId = "pyroterra" | "dunestorm" | "remnara" | "tidalor" | "cryonix";

export type AccessGate = "open" | "orbital" | "gravity";

export interface PlanetAccess {
  gate: AccessGate;
  label: string;
  rule: string;
  knowledge: string;
}

export interface Planet {
  id: PlanetId;
  name: string;
  kind: string;
  orbitIndex: number;
  orbitLabel: string;
  isMoon: boolean;
  host?: string;
  habitable: boolean;

  gravity: string;
  gravityClass: string;
  diameter: string;
  diameterKm: number;
  temperature: string;
  temperatureC: number;

  ecosystem: string;
  note?: string;
  access: PlanetAccess;

  accent: string;
  orbitRadius: number;
  renderScale: number;
}

export const shatteredSkiesPlanets: readonly Planet[] = [
  {
    id: "pyroterra",
    name: "Pyroterra",
    kind: "Lava World",
    orbitIndex: 1,
    orbitLabel: "Planet 1",
    isMoon: false,
    habitable: false,
    gravity: "2.7 m/s²",
    gravityClass: "Low",
    diameter: "4,500 km",
    diameterKm: 4500,
    temperature: "1,570 °C",
    temperatureC: 1570,
    ecosystem: "Lava lakes & volcanic rock",
    note: "Tunnels beneath the lava.",
    access: {
      gate: "open",
      label: "Open",
      rule:
        "This is where the game begins",
      knowledge:
        "No knowledge required.",
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
    orbitLabel: "Planet 2",
    isMoon: false,
    habitable: false,
    gravity: "17.01 m/s²",
    gravityClass: "High",
    diameter: "9,645 km",
    diameterKm: 9645,
    temperature: "61 °C",
    temperatureC: 61,
    ecosystem: "Sand, rock & fast winds",
    note: "Everything is built underground.",
    access: {
      gate: "gravity",
      label: "Surface gravity",
      rule:
        "The high gravity makes it easy to access but difficult to leave.",
      knowledge:
        "That the spaceship can be upgraded to leave.",
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
    orbitLabel: "Planet 3",
    isMoon: false,
    habitable: true,
    gravity: "9.1 m/s²",
    gravityClass: "Earth-like",
    diameter: "5,580 km",
    diameterKm: 5580,
    temperature: "18 °C",
    temperatureC: 18,
    ecosystem: "Plants & water",
    note: "Aftermath ruins are resources.",
    access: {
      gate: "open",
      label: "Open",
      rule:
        "Both characters are comfortable in this planet. Easy to navigate.",
      knowledge:
        "No knowledge required.",
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
    orbitLabel: "Moon",
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
    access: {
      gate: "orbital",
      label: "Tidal window",
      rule:
        "Routes open and close with the tides, thanks to gravity. The same path is a corridor " + 
        "at low water and gone at high.",
      knowledge:
        "Which part of the arc runs the tide low.",
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
    orbitLabel: "Planet 5",
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
        "Nothing is locked, which is what makes it mysterious.",
      knowledge:
        "The Zyrium under the ice as it is the known way to remove the parasite. At least one player needs to understand this.",
    },
    accent: "#A8DCEC",
    orbitRadius: 1,
    renderScale: 0.29,
  },
];

export const knowledgeGate = {
  kicker: "Access",
  title: "How the solar system works",
  standfirst:
    "All the levels are accessible from the beginning, however, to get to some places players need to understand " + 
    "how the system moves.",
  lead:
    "There are no keys or hidden traversal upgrades in Shattered Skies. What limits the players' movement is based on how the world functions: " +
    "the orbits of the planets, how they align and how the environment works. This is the key for progression.",

  example: {
    label: "What this looks like in gameplay",
    body:
      "There are notes in the world hinting the player how to progress, helping them progress. " +
      "One of them describes a cave that can be entered while the planet's orbit is in a particular rotation. " +
      "The cave is closed most of the time, but during that time in particular, the door is open.",
    figureSummary:
      "A star at the centre with one orbit drawn around it. A planet sits on one side of the " +
      "orbit and the location it must align with sits directly opposite, with a dashed line " +
      "running between them straight through the star. The caption marks that line as the moment " +
      "the cave is open; at every other point on the arc it is shut.",
    figureOpenLabel: "Aligned · open",
    figureShutLabel: "Anywhere else · shut",
  },

  designPoint:
    "This progression cannot be lost, given or skipped. The players unlock the world by understanding it." + 
    "Carrying this information is crucial for other sessions.",

} as const;

export const accessGateMeta: Record<AccessGate, { term: string; gloss: string }> = {
  open: { term: "Open", gloss: "easy access" },
  orbital: { term: "Orbital window", gloss: "route opens as the planet orbits" },
  gravity: { term: "Gravity", gloss: "adapt to surface" },
};

export const tidalorHost = {
  name: "Gas giant",
  label: "Gas giant · host",
  accent: "#D6B183",
} as const;

export const planetById = Object.fromEntries(
  shatteredSkiesPlanets.map((p) => [p.id, p])
) as Record<PlanetId, Planet>;

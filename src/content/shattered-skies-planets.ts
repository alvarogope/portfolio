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
 */

export type PlanetId = "pyroterra" | "dunestorm" | "remnara" | "tidalor" | "cryonix";

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
    accent: "#A8DCEC",
    orbitRadius: 1,
    renderScale: 0.29,
  },
];

/** The gas giant Tidalor orbits. Scenery — it is not one of the five surveyed worlds. */
export const tidalorHost = {
  name: "Gas giant",
  label: "Gas giant · host",
  accent: "#D6B183",
} as const;

export const planetById = Object.fromEntries(
  shatteredSkiesPlanets.map((p) => [p.id, p])
) as Record<PlanetId, Planet>;

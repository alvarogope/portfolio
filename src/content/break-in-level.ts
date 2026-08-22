/**
 * Break-In — the bank level: the branching route through it, and the five
 * stages the run is designed around.
 *
 * Two halves, deliberately kept apart:
 *
 * 1. THE ROUTE — the floor plan as a graph. `routeNodes` are the spaces and
 *    `routeLinks` the ways between them. Like `break-in-roles`, this is
 *    semantic only: no node knows where it sits on screen. `track` says which
 *    of the two parallel routes a space belongs to while the route is split,
 *    which is a fact about the level, not about the drawing; the component
 *    turns tracks into lanes and ranks into columns.
 *
 * 2. THE STAGES — the five design beats, each with the one number that matters
 *    here: `tension`. Read in order those five numbers ARE the pacing curve,
 *    and the shape is the argument: open with a moderate entry, drop to the
 *    quietest point of the run in the offices, then climb without a break to
 *    the vault. The dip is not a gap in the design; it is the design. Tension
 *    only reads as tension if it has been released first.
 *
 * `tensionPoints` normalises those five numbers to a unitless 0–1 grid so more
 * than one treatment can draw the same curve. Stage 1 renders it as the
 * console's line chart; a Stage 2 "tension spine" can map the identical points
 * onto whatever geometry it wants without re-deriving anything.
 */

import type { RoleId } from "./break-in-roles";

/* ---- the route --------------------------------------------------------- */

export type RouteNodeId =
  | "lobby"
  | "reception"
  | "info-centre"
  | "hideout-spot"
  | "managers-office"
  | "back-office"
  | "server-room"
  | "basement"
  | "laser-security"
  | "changing-room"
  | "digital-money"
  | "vault";

/**
 * What a space does to the shape of the route.
 * - `entry`  — where the run starts.
 * - `split`  — the team divides here; two routes leave it.
 * - `beat`   — a space on one of those routes.
 * - `merge`  — both routes come back together.
 * - `goal`   — the end of the run.
 */
export type RouteNodeKind = "entry" | "split" | "beat" | "merge" | "goal";

/** Which of the two parallel routes a space sits on, while the route is split. */
export type RouteTrack = "a" | "b";

export interface RouteNode {
  id: RouteNodeId;
  label: string;
  kind: RouteNodeKind;
  /** Only set on `beat` spaces: the tracks exist only between a split and a merge. */
  track?: RouteTrack;
}

export interface RouteLink {
  from: RouteNodeId;
  to: RouteNodeId;
}

export const routeNodes: readonly RouteNode[] = [
  { id: "lobby", label: "Lobby", kind: "entry" },
  { id: "reception", label: "Reception", kind: "split" },

  { id: "info-centre", label: "Info Centre", kind: "beat", track: "a" },
  { id: "hideout-spot", label: "Hideout Spot", kind: "beat", track: "a" },
  { id: "managers-office", label: "Manager's Office", kind: "beat", track: "b" },
  { id: "back-office", label: "Back Office", kind: "beat", track: "b" },

  { id: "server-room", label: "Server Room", kind: "merge" },
  { id: "basement", label: "Basement", kind: "split" },

  { id: "laser-security", label: "Laser Security", kind: "beat", track: "a" },
  { id: "changing-room", label: "Changing Room", kind: "beat", track: "b" },

  { id: "digital-money", label: "Digital Money", kind: "merge" },
  { id: "vault", label: "Vault", kind: "goal" },
];

/**
 * Every link joins one space to the next. The route is series-parallel — it
 * splits twice and closes both times — so a link never skips a rank, and the
 * drawing can lay the graph out from the links alone.
 */
export const routeLinks: readonly RouteLink[] = [
  { from: "lobby", to: "reception" },

  { from: "reception", to: "info-centre" },
  { from: "reception", to: "managers-office" },
  { from: "info-centre", to: "hideout-spot" },
  { from: "managers-office", to: "back-office" },
  { from: "hideout-spot", to: "server-room" },
  { from: "back-office", to: "server-room" },

  { from: "server-room", to: "basement" },

  { from: "basement", to: "laser-security" },
  { from: "basement", to: "changing-room" },
  { from: "laser-security", to: "digital-money" },
  { from: "changing-room", to: "digital-money" },

  { from: "digital-money", to: "vault" },
];

/** The route in one sentence — the diagram's text equivalent. */
export const routeSummary =
  "The run enters at the Lobby and reaches Reception, where the team splits: one route takes the " +
  "Info Centre to the Hideout Spot, the other the Manager's Office to the Back Office. Both rejoin " +
  "at the Server Room, drop to the Basement, and split a second time into Laser Security and the " +
  "Changing Room. Both rejoin at Digital Money, and the run ends at the Vault.";

const routeById = new Map(routeNodes.map((n) => [n.id, n]));

export function getRouteNode(id: RouteNodeId): RouteNode {
  const node = routeById.get(id);
  if (!node) throw new Error(`Unknown Break-In route node: ${id}`);
  return node;
}

/* ---- the stages -------------------------------------------------------- */

export type StageId = "lobby" | "offices" | "server-room" | "vault-corridor" | "vault";

export interface LevelStage {
  id: StageId;
  /** 1–5, the order the run plays them in. */
  order: number;
  name: string;
  /** What the player is trying to do here. */
  objective: string;
  /** The system the stage is built on. */
  mechanic: string;
  /** The role the stage is tuned around, or `"all"` when every role is on the clock. */
  roleFocus: RoleId | "all";
  hazards: readonly string[];
  /** The feeling the stage is tuned for. Doubles as its label on the curve. */
  experience: string;
  /**
   * Intended tension, 0 calm → 1 peak. Design intent, not a measurement: these
   * five numbers are the pacing curve and are the reason the stages are in this
   * order. See the note at the top of this file.
   */
  tension: number;
}

export const levelStages: readonly LevelStage[] = [
  {
    id: "lobby",
    order: 1,
    name: "Lobby",
    objective: "Get familiar with the environment / find a route to the basement",
    mechanic: "Routing",
    roleFocus: "all",
    hazards: ["NPC employees", "Guards"],
    experience: "Entry tension",
    tension: 0.5,
  },
  {
    id: "offices",
    order: 2,
    name: "Offices",
    objective: "Hideout, planning",
    mechanic: "Hideout",
    roleFocus: "all",
    hazards: ["Security"],
    experience: "Comfort · breather",
    tension: 0.25,
  },
  {
    id: "server-room",
    order: 3,
    name: "Server Room",
    objective: "Disable alarms / cameras, unlock secure doors",
    mechanic: "Hacking puzzle",
    roleFocus: "hacker",
    hazards: ["Surveillance", "Guards"],
    experience: "Strategic puzzle",
    tension: 0.55,
  },
  {
    id: "vault-corridor",
    order: 4,
    name: "Vault Corridor",
    objective: "Bypass layered defences",
    mechanic: "Timing & coordination",
    roleFocus: "insider",
    hazards: ["Lasers", "Motion detectors"],
    experience: "Precision stealth",
    tension: 0.75,
  },
  {
    id: "vault",
    order: 5,
    name: "Vault",
    objective: "Open and extract gold",
    mechanic: "Multiphase heist",
    roleFocus: "all",
    hazards: ["Timed defence reactivation"],
    experience: "Climax · tension spike",
    tension: 1,
  },
];

/* ---- the pacing curve --------------------------------------------------- */

export interface TensionPoint {
  stage: StageId;
  name: string;
  /** The stage's experience tag — the curve's x-axis reads as these five words. */
  experience: string;
  /** Position through the run, 0 at the first stage, 1 at the last. */
  x: number;
  /** Tension, 0 calm → 1 peak. */
  y: number;
}

/**
 * The curve as unitless points. Nothing here is in pixels: a view maps `x` and
 * `y` onto whatever box it has, which is what lets the line chart and any later
 * treatment plot the same five numbers.
 */
export const tensionPoints: readonly TensionPoint[] = levelStages.map((stage, i) => ({
  stage: stage.id,
  name: stage.name,
  experience: stage.experience,
  x: levelStages.length > 1 ? i / (levelStages.length - 1) : 0,
  y: stage.tension,
}));

const byTension = [...tensionPoints].sort((a, b) => a.y - b.y);

/** The two points the curve is about: the release, and the climax it buys. */
export const tensionLow: TensionPoint = byTension[0];
export const tensionPeak: TensionPoint = byTension[byTension.length - 1];

/** The shape of the curve in words — the chart's text equivalent, shown as its caption. */
export const pacingSummary =
  "Tension opens moderate in the Lobby, falls to its lowest in the Offices — the one deliberate " +
  "breather, where the team hides up and plans — then climbs without a break: the Server Room's " +
  "puzzle, the Vault Corridor's precision stealth, and the spike at the Vault. The dip is what " +
  "makes the last third read as pressure rather than noise.";

/** Tension as a word, for the readouts that carry the numbers in text. */
export function tensionBand(tension: number): string {
  if (tension >= 0.9) return "Peak";
  if (tension >= 0.7) return "High";
  if (tension >= 0.45) return "Moderate";
  return "Low";
}

import type { RoleId } from "./break-in-roles";

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

export type RouteNodeKind = "entry" | "split" | "beat" | "merge" | "goal";

export type RouteTrack = "a" | "b";

export interface RouteNode {
  id: RouteNodeId;
  label: string;
  kind: RouteNodeKind;
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

export type StageId = "lobby" | "offices" | "server-room" | "vault-corridor" | "vault";

export interface LevelStage {
  id: StageId;
  order: number;
  name: string;
  objective: string;
  mechanic: string;
  roleFocus: RoleId | "all";
  hazards: readonly string[];
  experience: string;
  tension: number;
  why: string;
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
    why:
      "The players are exposed in a public room full of staff.",
  },
  {
    id: "offices",
    order: 2,
    name: "Offices",
    objective: "Hideout, plan",
    mechanic: "Hideout",
    roleFocus: "all",
    hazards: ["Security"],
    experience: "Comfort",
    tension: 0.25,
    why:
      "The goal here is to hide and plan what to do next.",
  },
  {
    id: "server-room",
    order: 3,
    name: "Server Room",
    objective: "Get in on the security card, plant the USB in PC",
    mechanic: "USB plant",
    roleFocus: "insider",
    hazards: ["Surveillance", "Guards"],
    experience: "Strategic",
    tension: 0.55,
    why:
      "Moderate tension because the players can get caught now, since they have to expose themselves more.",
  },
  {
    id: "vault-corridor",
    order: 4,
    name: "Vault Corridor",
    objective: "Bypass layered defences",
    mechanic: "Timing & coordination",
    roleFocus: "lockpicker",
    hazards: ["Lasers", "Motion detectors"],
    experience: "Stealth",
    tension: 0.75,
    why:
      "High tension because of the major hazards and traps. A mistake here is fatal.",
  },
  {
    id: "vault",
    order: 5,
    name: "Vault",
    objective: "Open and extract gold",
    mechanic: "Multiphase heist",
    roleFocus: "all",
    hazards: ["Timed defence reactivation"],
    experience: "Climax",
    tension: 1,
    why:
      "Where everything collapses. The countdown is short, the alarm can go off and the players can " +
      "be caught looking for the exit.",
  },
];

export interface TensionPoint {
  stage: StageId;
  name: string;
  experience: string;
  x: number;
  y: number;
}

export const tensionPoints: readonly TensionPoint[] = levelStages.map((stage, i) => ({
  stage: stage.id,
  name: stage.name,
  experience: stage.experience,
  x: levelStages.length > 1 ? i / (levelStages.length - 1) : 0,
  y: stage.tension,
}));

const byTension = [...tensionPoints].sort((a, b) => a.y - b.y);

export const tensionLow: TensionPoint = byTension[0];
export const tensionPeak: TensionPoint = byTension[byTension.length - 1];

export const pacingSummary =
  "";

export function tensionBand(tension: number): string {
  if (tension >= 0.9) return "Peak";
  if (tension >= 0.7) return "High";
  if (tension >= 0.45) return "Moderate";
  return "Low";
}

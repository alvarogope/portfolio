import type { TrapId } from "./break-in-detection";

export type RoleId = "insider" | "hacker" | "lockpicker" | "vaultsnatcher";

export type LinkType = "unlocks" | "enables" | "protects" | "counters";

export type LinkTarget = RoleId | "all";

export interface RoleAbility {
  name: string;
  body: string;
  tuning?: string;
  note?: string;
}

export interface RolePuzzle {
  name: string;
  body: string;
  fail?: string;
}

export interface BreakInRole {
  id: RoleId;
  name: string;
  orbitLabel: string;
  cam: string;
  location: string;
  discipline: string;
  kit: readonly RoleAbility[];
  puzzle: RolePuzzle | null;
}

export interface RoleLink {
  id: string;
  from: RoleId;
  to: LinkTarget;
  type: LinkType;
  label: string;
  trap?: TrapId;
}

export const breakInRoles: readonly BreakInRole[] = [
  {
    id: "insider",
    name: "The Insider",
    orbitLabel: "1",
    cam: "CAM-1",
    location: "Lobby / Staff Door",
    discipline: "Opens paths",
    kit: [
      {
        name: "Disguise",
        body:
          "Transforms into Security, a Janitor or Office Staff. The uniform is randomised, so which " +
          "doors open changes every gameplay. Enemies will not investigate them while in this state.",
        tuning: "10s · 60s cooldown",
        note: "It will not be activated in front of an enemy.",
      },
      {
        name: "Find the Security Card",
        body:"The card opens the server room, to insert a USB into a live server.",
        note: "The USB helps the Hacker to access the downstairs cameras.",
      },
      {
        name: "Find the Escape",
        body:
          "One of three randomised exits: the bathroom vent, the vent beside the vault or the " +
          "backdoor in the manager's office. It changes every run.",
        note: "Once it is found, a red guide line to the exit appears for all players.",
      },
    ],
    puzzle: null,
  },
  {
    id: "hacker",
    name: "The Hacker",
    orbitLabel: "2",
    cam: "CAM-2",
    location: "Security Office",
    discipline: "Assistance / support · the team's eyes",
    kit: [
      {
        name: "CCTV Control",
        body:
          "A top-down view of the bank through the security cameras. The downstairs " +
          "cameras cannot be accessed until a USB is planted in the camera PC.",
        note: "A sign appears on whichever camera is active, so the team can see where the Hacker is looking.",
      },
      {
        name: "Distraction",
        body:
          "Hacks highlighted electrical objects, like lights, computers, to distract enemies and modify their route.",
        tuning: "7s · 10s cooldown",
        note: "Helps their team indirectly.",
      },
      {
        name: "Hacker Vision",
        body:
          "Highlights enemies in red through walls.",
        tuning: "5s · 30s cooldown",
        note:
          "The team's only awareness of where enemies actually are for five seconds in every thirty-five.",
      },
      {
        name: "Finding Environmental Clues",
        body:
          "A distraction can also surface clues in the environment.",
        note: "Clues lower the difficulty of the puzzle they belong to.",
      },
    ],
    puzzle: {
      name: "Speed typing",
      body:
        "Words appear and have to be typed back quickly and accurately to get the digital money out",
      fail: "Fail and the transfer restarts from the top, with the clock still running.",
    },
  },
  {
    id: "lockpicker",
    name: "The Lockpicker",
    orbitLabel: "3",
    cam: "CAM-3",
    location: "Basement / Laser Grid",
    discipline: "Enters for the digital money",
    kit: [
      {
        name: "Lock Picking",
        body: "Opens locked doors with a pick set.",
        tuning: "~3 m noise · ~6 m on a failure",
        note: "A failed attempt makes a loud noise and if a guard is in that radius, it will investigate.",
      },
      {
        name: "Stealing Digital Money",
        body:
          "Transfers money out of hidden PCs around the bank. they sit behind locked doors only they can open.",
        note: "Needs the manager's password and has to find it.",
      },
      {
        name: "Smoke Bombs",
        body: "Three per run. Smoke reveals the basement laser traps and disables them.",
        tuning: "3 per run",
        note: "Three units per run. The Vaultsnatcher's route in depends on how they are spent.",
      },
    ],
    puzzle: {
      name: "Pick and turn",
      body:
        "Hold the pick steady in position while turning the knob through its full travel. Rush " +
        "it and it will break.",
      fail: "A slip amplifies the noise from about three metres to six and will turn anyone inside it into Chasing Mode.",
    },
  },
  {
    id: "vaultsnatcher",
    name: "The Vaultsnatcher",
    orbitLabel: "4",
    cam: "CAM-4",
    location: "Vault / Ingot Rack",
    discipline: "Extraction · the physical gold",
    kit: [
      {
        name: "Find the Manager's Password",
        body: "Hidden in the manager's office. It is what opens the vault.",
        note: "It also opens the Lockpicker's digital transfer.",
      },
      {
        name: "Pick up Gold Ingots",
        body:
          "A quick button-press, the faster it is pressed the faster the ingots are taken. The ingots are " + 
          "highlighted as the player approaches them.",
        note: "Every ingot slows the player down.",
      },
      {
        name: "Replace the Ingot",
        body:
          "A similar weight decoy has to be placed in place of the ingot within one second of it coming off of it.",
        tuning: "1s window per ingot",
        note: "Failed to do so and the alarm trips, leaving the whole team thirty seconds to get out.",
      },
    ],
    puzzle: {
      name: "Shape and weight match",
      body:
        "Find objects around the bank whose shape and weight match the ingots, and place them " +
        "as decoys. The amount that is needed is randomised, and only two can be " +
        "carried at a time, so the trip has to be made more than once.",
      fail: "Come up short and limits how many ingots can be taken without the alarm going off.",
    },
  },
];

export const puzzleAsymmetryNote = {
  headline: "Three puzzles",
  body:
    "Each character has their own minigame but one. The Insider's own task is its ability to disguise, " +
    "their route reading to find paths. So, adding a minigame would have put so much weight on this character. ",
  credit: "A Lead Designer call on balance.",
};

export const roleLinks: readonly RoleLink[] = [
  {
    id: "insider-hacker",
    from: "insider",
    to: "hacker",
    type: "unlocks",
    label: "USB unlocks the downstairs cameras",
  },
  {
    id: "hacker-insider",
    from: "hacker",
    to: "insider",
    type: "enables",
    label: "Shows the guards positions",
  },
  {
    id: "hacker-lockpicker",
    from: "hacker",
    to: "lockpicker",
    type: "enables",
    label: "Distraction clears the path to the PCs",
  },
  {
    id: "hacker-vaultsnatcher",
    from: "hacker",
    to: "vaultsnatcher",
    type: "enables",
    label: "Vision reads the guards through vault walls",
  },
  {
    id: "lockpicker-vaultsnatcher",
    from: "lockpicker",
    to: "vaultsnatcher",
    type: "counters",
    trap: "lasers",
    label: "T1 - smoke shows the lasers",
  },
  {
    id: "hacker-lockpicker-vision",
    from: "hacker",
    to: "lockpicker",
    type: "counters",
    trap: "failed-lockpick",
    label: "T3 - hacker vision reads the room first",
  },
  {
    id: "vaultsnatcher-all",
    from: "vaultsnatcher",
    to: "all",
    type: "counters",
    trap: "unreplaced-gold",
    label: "T2 - decoys swapped for ingots",
  },
  {
    id: "vaultsnatcher-lockpicker",
    from: "vaultsnatcher",
    to: "lockpicker",
    type: "unlocks",
    label: "Manager's password opens the room",
  },
  {
    id: "insider-all",
    from: "insider",
    to: "all",
    type: "protects",
    label: "Find escape route for all of them",
  },
];

export const linkTypeMeta: Record<LinkType, { term: string; gloss: string }> = {
  unlocks: { term: "Unlocks", gloss: "turns an ability on" },
  enables: { term: "Enables", gloss: "opens to move" },
  counters: { term: "Removes", gloss: "clears off a trap" },
  protects: { term: "Protects", gloss: "escape" },
};

export const linkTypeOrder: readonly LinkType[] = ["unlocks", "enables", "counters"];

export const DEFAULT_ROLE: RoleId = "hacker";

export const selectionRule = {
  headline: "No ability duplication",
  body:
    "Each role can only be chosen once per play. The abilities were designed to complement each other, " +
    "knowing their strengths and weaknesses. Having two of the same role would make a weaker team and even " +
    "not letting the team complete the game at all.",
  credit:
    "As the Lead Designer, the dependency and balance of the roles had to be forced into the players from the " +
    "character selection screen. This made the cooperation key for winning.",
};

const byId = new Map(breakInRoles.map((r) => [r.id, r]));

export function getRole(id: RoleId): BreakInRole {
  const role = byId.get(id);
  if (!role) throw new Error(`Unknown Break-In role: ${id}`);
  return role;
}

export function linkTargets(link: RoleLink): RoleId[] {
  if (link.to !== "all") return [link.to];
  return breakInRoles.map((r) => r.id).filter((id) => id !== link.from);
}

export function linkTouches(link: RoleLink, id: RoleId): boolean {
  return link.from === id || linkTargets(link).includes(id);
}

export function incomingLinks(id: RoleId): { link: RoleLink; source: BreakInRole }[] {
  return roleLinks
    .filter((link) => link.from !== id && linkTargets(link).includes(id))
    .map((link) => ({ link, source: getRole(link.from) }));
}

export function outgoingLinks(id: RoleId): { link: RoleLink; targets: BreakInRole[] }[] {
  return roleLinks
    .filter((link) => link.from === id)
    .map((link) => ({ link, targets: linkTargets(link).map(getRole) }));
}

export function connectedRoles(id: RoleId): Set<RoleId> {
  const out = new Set<RoleId>();
  for (const link of roleLinks) {
    if (!linkTouches(link, id)) continue;
    if (link.from !== id) out.add(link.from);
    for (const target of linkTargets(link)) if (target !== id) out.add(target);
  }
  return out;
}
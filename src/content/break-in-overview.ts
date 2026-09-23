import type { RoleId } from "./break-in-roles";

export interface TeamNote {
  headline: string;
  role: string;
  body: string;
}

export const teamNote: TeamNote = {
  headline: "Team project · Team of 4",
  role: "Lead Designer",
  body:
    "Break-In was developed by four people divided in two teams. I was in charge of leading the design team and " +
    "maintaining the main communication with the engineering team. I designed the phase structure, the win and lose model, the " +
    "roles and the way they were balanced, and co-designed the level layout and design.",
};

export const RUN_MINUTES = 8;

export function clockLabel(minutes: number): string {
  const m = Math.floor(minutes);
  const s = Math.round((minutes - m) * 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export interface ClockMark {
  at: number;
  label: string;
  note: string;
  emphasis?: boolean;
}

export const SCORE_SHIFT_REMAINING = 5;

export const SCORE_SHIFT_AT = RUN_MINUTES - SCORE_SHIFT_REMAINING;

export const clockMarks: readonly ClockMark[] = [
  { at: 0, label: clockLabel(0), note: "The players spawn" },
  {
    at: SCORE_SHIFT_AT,
    label: clockLabel(SCORE_SHIFT_AT),
    note: `${SCORE_SHIFT_REMAINING} min left`,
  },
  { at: RUN_MINUTES, label: clockLabel(RUN_MINUTES), note: "", emphasis: true },
];

export type PhaseId = "infiltration" | "execution" | "digital" | "escape";

export type PhaseLane = "main" | "parallel";

export interface PhaseBeat {
  role: RoleId | "all";
  text: string;
}

export interface HeistPhase {
  id: PhaseId;
  order: number;
  name: string;
  lane: PhaseLane;
  start: number;
  end: number;
  objective: string;
  mechanic: string;
  beats: readonly PhaseBeat[];
  tasks: readonly string[];
  risk: string;
  pressure: number;
}

export const heistPhases: readonly HeistPhase[] = [
  {
    id: "infiltration",
    order: 1,
    name: "Infiltration & Setup",
    lane: "main",
    start: 0,
    end: 2.5,
    objective:
      "Four players spawn in different places.",
    mechanic: "Spawns",
    beats: [
      {
        role: "hacker",
        text: "Starts outside the bank, inside a van and looking to the bank's security system.",
      },
      {
        role: "insider",
        text: "Starts inside disguised as staff.",
      },
      {
        role: "lockpicker",
        text: "Starts inside a restricted zone and has to get clear of it before they can open anything.",
      },
      {
        role: "vaultsnatcher",
        text: "Starts in a restricted area in the bank, hunting the keycard for opening the vault.",
      },
    ],
    tasks: ["Disable barriers", "Move under disguise", "Find keycards", "Scout escape routes early"],
    risk:
      "Escape routes can be scouted now or later. Now costs setup time, later means running the last two minutes without an escape plan.",
    pressure: 0.4,
  },
  {
    id: "execution",
    order: 2,
    name: "Execution & Loot",
    lane: "main",
    start: 2.5,
    end: 6,
    objective: "Open the vault and take as much money as the team can carry.",
    mechanic: "Layered defences",
    beats: [
      {
        role: "vaultsnatcher",
        text: "Tries to open the vault. The keycard has to be in and the alarms down. Has to take the gold and money.",
      },
      {
        role: "lockpicker",
        text: "Use the smoke bombs to reveal the laser grid. It is the only way that the Vaultsnatcher gets in.",
      },
      {
        role: "hacker",
        text:  "Can see where the guards are, through walls, and can distract them so they don't catch the gang.",
      },
      {
        role: "all",
        text: "The players have to find objects to match the weight of the ingots so they could rob without the alarms going off.",
      },
    ],
    tasks: [
      "Keycard entry",
      "Alarms down",
      "Biometric bypass",
      "Laser grid",
      "Elite guards",
      "Decoy ingots",
    ],
    risk:
      "Carrying loot slows you down. Every ingot is more money and less speed.",
    pressure: 0.85,
  },
  {
    id: "digital",
    order: 3,
    name: "Digital Heist",
    lane: "parallel",
    start: 3,
    end: 6,
    objective: "Take the money that is digitally stored in the bank.",
    mechanic: "Timed word puzzle",
    beats: [
      {
        role: "insider",
        text: "Reaches the server room on the security card and inserts a USB in a live server. This starts the phase.",
      },
      {
        role: "hacker",
        text:  "Once the USB is in, they get a timed word puzzle. The more puzzles solved, the more money they get. If they run out of time, the window closes.",
      },
      {
        role: "all",
        text: "The two main sources of income are active at the same time.",
      },
    ],
    tasks: ["USB plant", "Server access", "Timed word puzzle", "Funds transfer"],
    risk: "The second path doesn't mean that it is safer, but allows the team to get the bigger score, while risking that the hacker will fail.",
    pressure: 0.7,
  },
  {
    id: "escape",
    order: 4,
    name: "Escape",
    lane: "main",
    start: 6,
    end: 8,
    objective: "All players get out without being seen.",
    mechanic: "Escape the bank",
    beats: [
      {
        role: "all",
        text: "There is no shared escape route. Each player has to find the way out." ,
      },
      {
        role: "insider",
        text: "The route scouted back in phase 1 appears here. The team that skipped it is searching with the clock in red.",
      },
      {
        role: "hacker",
        text: "The hacker will have to distract the guards so the exits are completely clear of them.",
      },
    ],
    tasks: ["No shared exit", "Four viable routes", "Undetected", "Before 08:00"],
    risk: "The heist is finished. Escape without getting caught.",
    pressure: 1,
  },
];

export const loopSummary =
  "The run is eight minutes long and reads in four phases. Phase 1, Infiltration & Setup, runs " +
  "from 00:00 to about 02:30: four players spawn in four different places and open the routes " +
  "between them. Phase 2, Execution & Loot, runs to about 06:00 — the vault comes down layer by " +
  "layer and the gold comes out. Phase 3, the Digital Heist, is not after phase 2 but alongside " +
  "it, roughly 03:00 to 06:00: a second loot path opened by a USB and closed by a timed puzzle. " +
  "Phase 4, Escape, is the last two minutes — no shared exit, four separate routes, everybody out " +
  "before the clock expires.";

export const phaseLevelNote =
  "";

export interface OutcomeCondition {
  label: string;
  detail: string;
}

export const winConditions: readonly OutcomeCondition[] = [
  {
    label: "Objectives completed",
    detail: "Physical loot, digital funds, or both.",
  },
  {
    label: "All four escaped",
    detail: "Every player is out of the building.",
  },
  { label: "Undetected", detail: "No player was caught or arrested at any point of the game." },
  { label: "Inside 08:00", detail: "The last player clears the building before the clock expires." },
];

export const loseConditions: readonly OutcomeCondition[] = [
  {
    label: "Any player detected",
    detail: "One player caught or arrested ends the game for all four.",
  },
  {
    label: "The clock expires",
    detail: "08:00 with anyone still inside.",
  },
];

export const outcomeThesis = "One caught, everyone fails.";

export type GradeId = "a" | "b" | "c" | "f";

export interface GradeTier {
  id: GradeId;
  grade: string;
  label: string;
  weight: number;
}

export const gradeTiers: readonly GradeTier[] = [
  {
    id: "a",
    grade: "A",
    label: "Over £1,000,000",
    weight: 1,
  },
  {
    id: "b",
    grade: "B",
    label: "£500,000 – £1,000,000",
    weight: 0.7,
  },
  {
    id: "c",
    grade: "C",
    label: "£100,000 – £500,000",
    weight: 0.4,
  },
  {
    id: "f",
    grade: "F",
    label: "Under £100,000 or caught",
    weight: 0.12,
  },
];

export const gradingNote =
  "";

export type BalanceChart = "solo-ceiling" | "adaptive" | "rewards";

export interface BalancePillar {
  id: BalanceChart;
  index: string;
  title: string;
  body: string;
  caption?: string;
}

export const balancingIntro =
  "The hardest part of balancing a four-player online heist game was tuning all the roles in a way " +
  "that all roles are important, relevant and crucial to complete the game. As Lead Designer I tried to " +
  "follow this rule: All four must cooperate and all the abilities and accountability rely on all of the team " +
  "and not on one player. These are the design principles I consider:";

export const balancingPillars: readonly BalancePillar[] = [
  {
    id: "solo-ceiling",
    index: "1",
    title: "Interdependency",
    body:
      "Every role's abilities are unique and equally important for beating the game. Each role owns a quarter " +
      "of accountability for progressing in the game.",
    caption:
      "",
  },
  {
    id: "adaptive",
    index: "2",
    title: "The Difficulty",
    body:
      "The target when balancing the difficulty was more about the players' feeling during " +
      "the heist. The pressure rises by the end so every team has pressure at the end, whether " +
      "they struggled or not. And that is how I wanted to design the difficulty in Break-In.",
  },
  {
    id: "rewards",
    index: "3",
    title: "Teamwork",
    body:
      "Every ability enhances cooperation and they are made for players that want to work in a team " +
      "with no main role at all. All of them have a crucial part in the heist.",
  },
];

export interface SoloReach {
  role: RoleId;
  reach: number;
  wall: string;
}

export const soloReach: readonly SoloReach[] = [
  { role: "insider", reach: 0.25, wall: "Cannot see patrols" },
  { role: "hacker", reach: 0.25, wall: "Blind below ground" },
  { role: "lockpicker", reach: 0.25, wall: "No vault password" },
  { role: "vaultsnatcher", reach: 0.25, wall: "Lasers still live" },
];

export const RUN_COMPLETE = 1;

export interface AdaptivePoint {
  x: number;
  pressure: number;
  felt: number;
}

export const adaptiveCurve: readonly AdaptivePoint[] = [
  { x: 0, pressure: 0.22, felt: 0.66 },
  { x: 0.25, pressure: 0.36, felt: 0.7 },
  { x: 0.5, pressure: 0.54, felt: 0.72 },
  { x: 0.75, pressure: 0.74, felt: 0.71 },
  { x: 1, pressure: 0.93, felt: 0.73 },
];

export const targetBand = { low: 0.6, high: 0.8 };

export const adaptiveLevers: readonly string[] = [
  "Patrol density",
  "Camera coverage",
  "Puzzle length",
  "Guard alert radius",
];

export interface RewardSlice {
  label: string;
  share: number;
  gloss: string;
}

export const rewardSplit: readonly RewardSlice[] = [
  {
    label: "Team share",
    share: 0.7,
    gloss: "Split evenly across all four.",
  },
  {
    label: "Role bonus",
    share: 0.3,
    gloss: "For playing each role well.",
  },
];

export const bonusCriteria: readonly string[] = [
  "Doors opened for others",
  "Patrols pulled off a teammate",
  "Traps cleared ahead of the crew",
  "Objectives closed cleanly",
];

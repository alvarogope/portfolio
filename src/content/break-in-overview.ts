/**
 * Break-In — the run itself: the four phases of the heist, what ends a run,
 * and the balancing philosophy underneath all of it.
 *
 * ATTRIBUTION. Break-In was made by a team of four. I was the Lead Designer:
 * I set the design direction and authored most of the design document, and the
 * systems described here — the phase structure, the win/lose model and the
 * three balancing principles — are the design I led. It was still four people
 * building it, and `teamNote` below is rendered visibly at the head of the
 * section so that is never left to inference.
 *
 * WHY THIS FILE EXISTS SEPARATELY from `break-in-level`. Two different
 * questions, deliberately kept apart:
 *
 *   `break-in-level` answers WHERE — the bank as a floor plan, the branching
 *   route through its twelve spaces, and the five stages that route is paced
 *   against. It is spatial.
 *
 *   This file answers WHEN and WHAT FOR — the four objective phases the team
 *   moves through across an eight-minute clock, one of which (the digital
 *   heist) runs *parallel* to another rather than after it. It is temporal.
 *
 * The route and the phases are not the same beats seen twice. A team can be in
 * the Vault stage of the route while two players are on the digital phase and
 * one has already started scouting the escape; the route cannot express that,
 * and the phase view cannot express which door they went through.
 * `phaseLevelNote` states that relationship once, on the page.
 *
 * GEOMETRY, as everywhere else on this route, lives in the components. Phases
 * carry minute windows on a 0–8 clock and a lane; `HeistLoop` turns those into
 * x-positions and rows. Nothing here knows a pixel.
 */

import type { RoleId } from "./break-in-roles";

/* ---- attribution -------------------------------------------------------- */

export interface TeamNote {
  /** The headline claim, kept blunt. */
  headline: string;
  /** My role on the team. Matches `facts.role` in the project file. */
  role: string;
  /** The sentence that separates what the team built from what I led. */
  body: string;
}

export const teamNote: TeamNote = {
  headline: "Team project · Team of 4",
  role: "Lead Designer",
  body:
    "Break-In was built by four of us. I led the design: the phase structure below, the win and " +
    "lose model, the four roles and the balancing rules that hold them level are the design work " +
    "I directed and authored. Building the game — code, art, levels, integration — was the team's.",
};

/* ---- the clock ----------------------------------------------------------
   Every phase window and every annotation is expressed in minutes on this
   scale, so one number changes the whole diagram. */

/** The run length, in minutes. The single hard constraint the design is built on. */
export const RUN_MINUTES = 8;

/** Clock face, mm:ss, from a minute value. Used for every window label. */
export function clockLabel(minutes: number): string {
  const m = Math.floor(minutes);
  const s = Math.round((minutes - m) * 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * Annotations on the clock ruler — moments the run is tuned around rather than
 * phase boundaries. `emphasis` marks the one that ends the run.
 */
export interface ClockMark {
  at: number;
  label: string;
  note: string;
  emphasis?: boolean;
}

/**
 * How much of the run is left when the score changes gear. The audio design
 * specifies the shift by REMAINING time, not elapsed time, so it is written
 * here the way it was designed and the elapsed position is derived below.
 * `break-in-audio` reads the same two numbers, which is what stops the phase
 * clock and the score clock from ever disagreeing about where the mark sits.
 */
export const SCORE_SHIFT_REMAINING = 5;

/** The same moment as an elapsed position on the 0–8 clock. */
export const SCORE_SHIFT_AT = RUN_MINUTES - SCORE_SHIFT_REMAINING;

export const clockMarks: readonly ClockMark[] = [
  { at: 0, label: clockLabel(0), note: "Four spawns, four places" },
  {
    at: SCORE_SHIFT_AT,
    label: clockLabel(SCORE_SHIFT_AT),
    note: `Score tempo shift · ${SCORE_SHIFT_REMAINING} min left`,
  },
  { at: RUN_MINUTES, label: clockLabel(RUN_MINUTES), note: "Hard fail", emphasis: true },
];

/* ---- the four phases ----------------------------------------------------
   `lane` is the one piece of structure that is not obvious from the windows:
   the digital heist is a SECOND loot path, not a later one. It opens while the
   vault crew is still working and closes into the same escape, which is why it
   is drawn as a parallel run rather than a third box in the row. */

export type PhaseId = "infiltration" | "execution" | "digital" | "escape";

/** `main` is the spine every player is on. `parallel` runs alongside it. */
export type PhaseLane = "main" | "parallel";

export interface PhaseBeat {
  /** `"all"` when the beat is on every player at once. */
  role: RoleId | "all";
  text: string;
}

export interface HeistPhase {
  id: PhaseId;
  /** 1–4, reading order. Not strictly chronological: phase 03 overlaps phase 02. */
  order: number;
  name: string;
  /** The spine, or the parallel loot path. */
  lane: PhaseLane;
  /** Minutes on the 0–8 clock. Design intent — the window the phase is tuned for. */
  start: number;
  end: number;
  /** What the team is trying to achieve. One line, present tense. */
  objective: string;
  /** The system the phase leans on, shown as its tag. */
  mechanic: string;
  /** Who is doing what, in the phase's own order. */
  beats: readonly PhaseBeat[];
  /** The concrete tasks, as short pills. */
  tasks: readonly string[];
  /** The decision the phase is really about — its risk/reward line. */
  risk: string;
  /** Intended pressure, 0 calm → 1 peak. Drives the meter under each phase. */
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
      "Four players wake up in four different places and build the routes between them.",
    mechanic: "Asymmetric spawns",
    beats: [
      {
        role: "hacker",
        text: "Starts outside the building — rooftop or van — patched into the security system, and is the only player who can see the whole floor at once.",
      },
      {
        role: "insider",
        text: "Starts inside in a staff disguise, walking through the checks everyone else has to route around.",
      },
      {
        role: "lockpicker",
        text: "Starts inside a restricted zone, already somewhere they should not be, and has to get clear of it before they can open anything.",
      },
      {
        role: "vaultsnatcher",
        text: "Starts in a restricted zone on the far side of the bank, hunting the keycard the vault approach depends on.",
      },
    ],
    tasks: ["Disable barriers", "Move under disguise", "Find keycards", "Scout escape routes early"],
    risk:
      "Escape routes can be scouted now or later. Now costs setup time the vault will want back; later means running the last two minutes blind.",
    pressure: 0.4,
  },
  {
    id: "execution",
    order: 2,
    name: "Execution & Loot",
    lane: "main",
    start: 2.5,
    end: 6,
    objective: "Breach the vault and take as much physical loot out of it as the team can carry.",
    mechanic: "Layered defences",
    beats: [
      {
        role: "vaultsnatcher",
        text: "Works the vault: keycard in, alarms down, biometric lock bypassed, then gold and cash off the racks.",
      },
      {
        role: "lockpicker",
        text: "Burns smoke bombs to reveal and kill the laser grid on the approach, which is the only way the Vaultsnatcher gets in at all.",
      },
      {
        role: "hacker",
        text: "Reads the elite guards through walls and pulls them off the vault corridor with a distraction.",
      },
      {
        role: "all",
        text: "Real ingots come off the rack and weight-matched decoys go back on, buying time before the vault reads as robbed.",
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
      "Carrying loot slows you down. Every ingot is more money and less speed, and the player deciding how much to take is the one who has to outrun the response.",
    pressure: 0.85,
  },
  {
    id: "digital",
    order: 3,
    name: "Digital Heist",
    lane: "parallel",
    start: 3,
    end: 6,
    objective: "Take the money that does not have to be carried — while the vault is still open.",
    mechanic: "Timed word puzzle",
    beats: [
      {
        role: "insider",
        text: "Reaches the server room on the security card and plants a USB in a live server. Nothing starts until that lands.",
      },
      {
        role: "hacker",
        text: "Gets one timed word puzzle out of it. Solve it and the funds transfer; run out of clock and the window closes.",
      },
      {
        role: "all",
        text: "Two objectives are now live at once, and there are only four players to spend across them.",
      },
    ],
    tasks: ["USB plant", "Server access", "Timed word puzzle", "Funds transfer"],
    risk:
      "A second loot path, not a safer one. Splitting to run both is where the biggest scores come from and where most runs are lost.",
    pressure: 0.7,
  },
  {
    id: "escape",
    order: 4,
    name: "Escape",
    lane: "main",
    start: 6,
    end: 8,
    objective: "All four players get out, separately, without being seen.",
    mechanic: "Decentralised extraction",
    beats: [
      {
        role: "all",
        text: "There is no shared exit and no rally point. Each player has to find a viable route out of wherever the heist left them.",
      },
      {
        role: "insider",
        text: "The route scouted back in phase 01 pays here; the team that skipped it is searching with the clock already in the red.",
      },
      {
        role: "hacker",
        text: "Last useful act: pulling patrols off three separate exits at once, for three players who cannot answer back.",
      },
    ],
    tasks: ["No shared exit", "Four viable routes", "Undetected", "Before 08:00"],
    risk:
      "The heist is finished and the run is not. One player still inside at 08:00 costs the team everything already banked.",
    pressure: 1,
  },
];

/** The loop in one paragraph — the diagram's text equivalent. */
export const loopSummary =
  "The run is eight minutes long and reads in four phases. Phase 01, Infiltration & Setup, runs " +
  "from 00:00 to about 02:30: four players spawn in four different places and open the routes " +
  "between them. Phase 02, Execution & Loot, runs to about 06:00 — the vault comes down layer by " +
  "layer and the gold comes out. Phase 03, the Digital Heist, is not after phase 02 but alongside " +
  "it, roughly 03:00 to 06:00: a second loot path opened by a USB and closed by a timed puzzle. " +
  "Phase 04, Escape, is the last two minutes — no shared exit, four separate routes, everybody out " +
  "before the clock expires.";

/** How the phase view relates to the route view, said once, on the page. */
export const phaseLevelNote =
  "This is the run in time, not in space. The floor plan further down answers where the team goes " +
  "and in what order the rooms arrive; this answers what they are trying to achieve and when the " +
  "clock says they should be doing it. The two do not line up one-to-one on purpose: the digital " +
  "heist runs parallel to the vault, so two players can be in the same room on two different " +
  "phases.";

/* ---- win and lose -------------------------------------------------------
   Modelled as two lists with two different joins. The win list is an AND — all
   of it, or none of it. The lose list is an OR — any one is enough. That
   asymmetry IS the game, so it is data rather than prose. */

export interface OutcomeCondition {
  /** Short label, as it reads on the card. */
  label: string;
  /** The condition in full. */
  detail: string;
}

export const winConditions: readonly OutcomeCondition[] = [
  {
    label: "Objectives complete",
    detail: "Physical loot, digital funds, or both — the team leaves with what it came for.",
  },
  {
    label: "All four escaped",
    detail: "Every player is out of the building. Three out of four is a loss, not a partial win.",
  },
  { label: "Undetected", detail: "No player was caught or arrested at any point in the run." },
  { label: "Inside 08:00", detail: "The last player clears the building before the clock expires." },
];

export const loseConditions: readonly OutcomeCondition[] = [
  {
    label: "Any player detected",
    detail: "One player caught or arrested ends the run for all four, wherever the others are.",
  },
  {
    label: "The clock expires",
    detail: "08:00 with anyone still inside. Loot already banked does not count for anyone.",
  },
];

/** The line the whole outcome model exists to make true. */
export const outcomeThesis = "One caught, everyone fails.";

export const outcomeNote =
  "Winning is a single AND: every condition, or no win. Losing is an OR — either one is enough on " +
  "its own. That asymmetry is deliberate, and it is what makes the dependency web above matter at " +
  "the table. There is no version of this run where three players succeed and one does not.";

/* ---- the grade ----------------------------------------------------------
   Winning is binary; the SCORE is not. Once the team is out, the run is graded
   on the take, which is what turns "did we get out" into "how much did we dare
   to carry". The two systems are deliberately stacked in that order: the escape
   is pass/fail so nobody gambles with a teammate's run, and the grade is
   graduated so there is still a reason to take one more ingot.

   `floor` is what the tier pays out from, in pounds; `label` is the range as it
   reads on the card. F carries no floor because it is the failure case rather
   than the bottom of a scale. */

export type GradeId = "a" | "b" | "c" | "f";

export interface GradeTier {
  id: GradeId;
  grade: string;
  /** The range, as written on the card. */
  label: string;
  /** What the tier means in a line. */
  body: string;
  /** 0-1, where this tier sits on the scale bar. */
  weight: number;
}

export const gradeTiers: readonly GradeTier[] = [
  {
    id: "a",
    grade: "A",
    label: "Over £1,000,000",
    body: "Both loot paths run, and run greedily. The rack is stripped and the transfer lands.",
    weight: 1,
  },
  {
    id: "b",
    grade: "B",
    label: "£500,000 – £1,000,000",
    body: "One path finished properly, or both hurried. A clean run that left something behind.",
    weight: 0.7,
  },
  {
    id: "c",
    grade: "C",
    label: "£100,000 – £500,000",
    body: "Out alive with what was nearest the door. The escape worked; the heist barely did.",
    weight: 0.4,
  },
  {
    id: "f",
    grade: "F",
    label: "Under £100,000, or caught",
    body: "Caught is an automatic F whatever was banked — the take does not survive the arrest.",
    weight: 0.12,
  },
];

export const gradingNote =
  "Getting out is pass or fail; what you got out with is graded. That split is the whole risk " +
  "curve: the escape stays binary so no player can gamble with somebody else's run, and the grade " +
  "stays graduated so there is always a reason to spend one more second at the rack.";

/* ---- balancing philosophy ----------------------------------------------
   Three principles, each with the one small chart that makes it an argument
   rather than a claim. `id` says which chart; the geometry is the component's. */

export type BalanceChart = "solo-ceiling" | "adaptive" | "rewards";

export interface BalancePillar {
  id: BalanceChart;
  index: string;
  title: string;
  /** The principle. */
  body: string;
  /** What the chart beside it is showing. */
  caption: string;
}

export const balancingIntro =
  "The hard part of a four-player heist is not making it difficult; it is making all four seats " +
  "worth sitting in. As Lead Designer I tuned Break-In against one rule — the game must be " +
  "unwinnable alone, and it must never be one player's job to carry the other three — and the " +
  "three principles below are what that rule turned into.";

export const balancingPillars: readonly BalancePillar[] = [
  {
    id: "solo-ceiling",
    index: "01",
    title: "Interdependent, and equally so",
    body:
      "Every role's abilities are unique, and every role's abilities are equally critical. Each one " +
      "owns roughly a quarter of the critical path and cannot reach past it: the Vaultsnatcher " +
      "cannot cross a live laser grid, the Lockpicker cannot open the transfer without the " +
      "manager's password, the Hacker is blind below ground until the USB lands. There is no carry " +
      "seat and no passenger seat, which is the core balancing principle everything else serves.",
    caption:
      "How far each role gets unaided, against the run it has to finish. The gap is the design, not a shortfall.",
  },
  {
    id: "adaptive",
    index: "02",
    title: "Difficulty that answers back",
    body:
      "The game reads how the team is performing and pushes back. Play well and patrols thicken, " +
      "cameras multiply and puzzles lengthen; struggle and it eases, slightly. The target is not a " +
      "fixed difficulty but a fixed feeling: pressure rises to meet competence so a strong team and " +
      "a shaky one both spend the last two minutes on the edge — and no role goes quiet because the " +
      "run got easy.",
    caption:
      "Pressure applied rises with team performance so that felt tension stays inside the target band.",
  },
  {
    id: "rewards",
    index: "03",
    title: "Paid as a team, bonused as a role",
    body:
      "XP and currency are distributed by team effort, with a bonus on top for playing your role " +
      "well. The shared base is the larger share on purpose: it makes the optimal play making your " +
      "teammates faster rather than out-earning them. The bonus exists so the unglamorous seat — " +
      "the Hacker who never touches gold, the Insider who spends the run opening doors — is still " +
      "the most profitable thing that player can be doing.",
    caption:
      "The payout split: the shared base is the bigger half, and the bonus pays for role play rather than loot carried.",
  },
];

/* ---- chart data ---------------------------------------------------------- */

/**
 * How much of the critical path each role can complete unaided, 0–1. Design
 * intent, not telemetry: each role holds one quarter of the run and stops.
 */
export interface SoloReach {
  role: RoleId;
  /** 0–1 of the run completable alone. */
  reach: number;
  /** What stops them. */
  wall: string;
}

export const soloReach: readonly SoloReach[] = [
  { role: "insider", reach: 0.25, wall: "Cannot see patrols" },
  { role: "hacker", reach: 0.25, wall: "Blind below ground" },
  { role: "lockpicker", reach: 0.25, wall: "No vault password" },
  { role: "vaultsnatcher", reach: 0.25, wall: "Lasers still live" },
];

/** The line every one of them is measured against. */
export const RUN_COMPLETE = 1;

/**
 * The adaptive-difficulty response, as unitless points. `x` is team
 * performance, 0 struggling → 1 clean. `pressure` is what the game applies;
 * `felt` is the tension that results, which is the value actually being held.
 */
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

/** The band `felt` is held inside. */
export const targetBand = { low: 0.6, high: 0.8 };

/** What the game actually turns up when a team is performing. */
export const adaptiveLevers: readonly string[] = [
  "Patrol density",
  "Camera coverage",
  "Puzzle length",
  "Guard alert radius",
];

/** The payout model, as a split that sums to 1. */
export interface RewardSlice {
  label: string;
  share: number;
  gloss: string;
}

export const rewardSplit: readonly RewardSlice[] = [
  {
    label: "Team share",
    share: 0.7,
    gloss: "Split evenly across all four, on the run's total take.",
  },
  {
    label: "Role bonus",
    share: 0.3,
    gloss: "Earned individually, for playing your own role well.",
  },
];

/** What the bonus is actually paid for. Cooperative acts, not loot totals. */
export const bonusCriteria: readonly string[] = [
  "Doors opened for others",
  "Patrols pulled off a teammate",
  "Traps cleared ahead of the crew",
  "Objectives closed cleanly",
];

export const joustingIntro = {
  tournament:
    "A best-of-three tournament against progressively harder knights. Win it for a " +
    "piece of armour and the bow.",
} as const;

export type JoustTone = "good" | "contested" | "none" | "bad";

export type JoustAction = "Attack" | "Dodge";

export interface JoustCell {
  outcome: string;
  tone: JoustTone;
}

export interface JoustRow {
  action: JoustAction;
  cells: readonly JoustCell[];
}

export const joustTimings = ["Early", "Perfect distance", "Late"] as const;

export const joustMatrix: readonly JoustRow[] = [
  {
    action: "Attack",
    cells: [
      { outcome: "No hit", tone: "none" },
      { outcome: "Enemy can dodge", tone: "contested" },
      { outcome: "Miss", tone: "none" },
    ],
  },
  {
    action: "Dodge",
    cells: [
      { outcome: "Receives hit", tone: "bad" },
      { outcome: "Dodges the attack", tone: "good" },
      { outcome: "Receives hit", tone: "bad" },
    ],
  },
];

export const joustMatrixCaption =
  "How the timings work in the game.";


export const joustDesignNote =
  "It replicates how jousting works in this world and follows the most basic structure in games. " +
  "It depends on the player to get better at it and get the timing correctly.";

export const joustSpinout = {
  kicker: "Next Project",
  body:
    "I found potential in this jousting game and I have been developing it as a side project " +
    "as a standalone game.",
} as const;

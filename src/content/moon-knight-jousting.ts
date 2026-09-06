/**
 * Moon-Knight — the jousting minigame.
 *
 * A SIDE FEATURE, and the file is sized to say so: one screen of copy and a
 * six-cell matrix. It is here because the risk table is a tidy piece of design
 * worth showing, not because the joust is a pillar of the game.
 *
 * THE MATRIX IS THE POINT. Two actions against three timings, and the shape of
 * the outcomes is the argument: only the middle column pays, and it pays
 * differently depending on whether you swung or ducked. `tone` is what colours
 * a cell, and it is a JUDGEMENT about the outcome, not a restatement of it —
 * see `JoustTone` below.
 */

/* ---- the framing -------------------------------------------------------- */

export const joustingIntro = {
  /* NO `teacher` FIELD, DELIBERATELY. One was drafted — a six-word clause
     introducing Orpheus — for the case where the joust sat on the main page
     and the cast did not. The joust now renders on the deep dive, two
     sections below the cast that owns him, so the clause would be a second
     introduction to a character already described on the same page. It was
     never rendered, and it is gone. */
  /** How the player meets it, and what it is for. Two sentences, no more. */
  tournament:
    "A best-of-three tournament against progressively harder knights. Win it for a " +
    "piece of armour, and further in, the bow.",
  practice:
    "A practice mode runs the same charge with nothing staked on it, for players who " +
    "want the timing in their hands before the tournament asks for it.",
} as const;

/* ---- the risk matrix ---------------------------------------------------- */

/**
 * How good an outcome is for the player. Colour comes from this and nothing
 * else, so the palette stays a claim about the design rather than decoration:
 *
 *   "good"      the clean win — the only one on the board.
 *   "contested" live, but not yours yet: it lands unless they read you.
 *   "none"      nothing happens. No damage either way.
 *   "bad"       you take the hit.
 */
export type JoustTone = "good" | "contested" | "none" | "bad";

export type JoustAction = "Attack" | "Dodge";

export interface JoustCell {
  outcome: string;
  tone: JoustTone;
}

export interface JoustRow {
  action: JoustAction;
  /** One per column of `joustTimings`, in that order. */
  cells: readonly JoustCell[];
}

/** The columns. "Perfect distance" is the skill window the whole game is. */
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
  "Outcome by action and timing — both riders charge, and the lance is committed once.";

/* ---- the reasoning, and where it went ----------------------------------- */

export const joustDesignNote =
  "One read, and nothing else: how far away they are, and when to commit. No combo, no " +
  "resource, no second input — the timing window is the entire skill test, and only the " +
  "middle column pays.";

/**
 * The hook. Kept to two sentences on purpose — it is a status note about the
 * idea, not a second project pitched inside the first.
 */
export const joustSpinout = {
  kicker: "Since then",
  body:
    "I liked this more than the thing it was a diversion from. The joust has outgrown " +
    "its origin — I have started building it separately, as a standalone game rather " +
    "than a minigame in someone else's woods.",
} as const;

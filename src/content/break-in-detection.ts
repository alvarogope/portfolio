/**
 * Break-In — the detection system as a state machine: what an enemy is doing,
 * what moves it to the next state, and how the player is told.
 *
 * ATTRIBUTION. Break-In was a team of four; I was Lead Designer, and the
 * detection state machine and its feedback model are design work I authored
 * and directed. `designNote` below carries that in my own voice on the page,
 * rather than leaving it to inference.
 *
 * WHY A STATE MACHINE and not a meter. There are exactly four states and every
 * transition has one named trigger, so the honest drawing is a directed graph
 * rather than a gauge. The one thing a meter does carry — that escalation takes
 * TIME — lives inside the Investigating node as the filling bar, which is the
 * mechanic itself and not a decoration.
 *
 * THE DESIGN ARGUMENT the diagram exists to make: the machine is aggressively
 * telegraphed. Every second a player spends in Investigating, three independent
 * channels are firing at once — audio, HUD, and the world — so a player is
 * never surprised by their own detection state. That was a deliberate choice
 * forced by the bigger one: Break-In has NO VOICE CHANNEL, so a player who
 * misses their own escalation cannot be warned by a teammate. See
 * `voiceConstraint`.
 *
 * GEOMETRY lives in `DetectionStates`, as everywhere else on this route. States
 * carry an order and an accent band; nothing here knows a pixel.
 */

import type { RoleId } from "./break-in-roles";

/* ---- the states --------------------------------------------------------- */

export type DetectionStateId = "idle" | "investigating" | "chasing" | "caught";

/**
 * Where the state sits on the calm-to-caught ramp. The component maps these
 * onto the same green → amber → red scale the page's alarm rail runs, so the
 * two read as one vocabulary. Never the only carrier of meaning: every state
 * also prints its band as a word.
 */
export type DetectionBand = "calm" | "warn" | "alert" | "fail";

export interface DetectionState {
  id: DetectionStateId;
  /** 1–4, the order escalation runs in. Rendered as the S-number. */
  order: number;
  name: string;
  band: DetectionBand;
  /** The band as a word, so the colour is never doing the work alone. */
  bandLabel: string;
  /** What the enemy is doing, in the node. Two short lines' worth. */
  body: string;
  /** The line under the body. The Investigating state draws its bar here instead. */
  footer: string;
  /** The state in full, for the table below the diagram. */
  detail: string;
}

export const detectionStates: readonly DetectionState[] = [
  {
    id: "idle",
    order: 1,
    name: "Idle / Patrol",
    band: "calm",
    bandLabel: "Calm",
    body: "Enemies hold a post or walk a programmed route.",
    footer: "Only a Distraction moves them",
    detail:
      "The default. An enemy either holds a fixed spot or follows a programmed patrol route. " +
      "Nothing a player does to the level moves them off it — the Hacker's Distraction, hacking a " +
      "highlighted light or computer, is the only thing in the game that reroutes a patrol.",
  },
  {
    id: "investigating",
    order: 2,
    name: "Investigating",
    band: "warn",
    bandLabel: "Warning",
    body: "An investigation bar above the enemy fills over time.",
    footer: "Investigation bar filling",
    detail:
      "The enemy has seen something and is resolving it. A bar above their head fills over time, " +
      "and while it fills all three feedback channels are running at once. This is the only state " +
      "with a way back: break line of sight, or leave whatever triggered it, and the bar drains " +
      "toward Idle instead of filling.",
  },
  {
    id: "chasing",
    order: 3,
    name: "Chasing",
    band: "alert",
    bandLabel: "Alert",
    body: "The chase song plays and the enemy pursues.",
    footer: "Chase theme at full",
    detail:
      "The bar filled. The white-noise crescendo resolves into the chase song it has been building " +
      "toward for the whole of the previous state, and the enemy pursues the player directly.",
  },
  {
    id: "caught",
    order: 4,
    name: "Caught",
    band: "fail",
    bandLabel: "Failure",
    body: "The enemy reaches the player. Mission over.",
    footer: "Run over for all four",
    detail:
      "The enemy reaches the player and arrests them. Because the escape is collective, this is not " +
      "one player's failure state — it is the team's.",
  },
];

/* ---- the transitions ----------------------------------------------------
   `trigger` is the short form that fits on a wire; `detail` is the full
   condition, which the table below the diagram carries. `kind` is drawn as a
   line style AND printed as a word, so the graph is never colour-only. */

export type TransitionKind = "escalate" | "deescalate" | "terminal";

export interface DetectionTransition {
  id: string;
  from: DetectionStateId;
  to: DetectionStateId;
  kind: TransitionKind;
  /** Short label, as it reads on the wire. */
  trigger: string;
  /** The condition in full. */
  detail: string;
}

export const detectionTransitions: readonly DetectionTransition[] = [
  {
    id: "idle-investigating",
    from: "idle",
    to: "investigating",
    kind: "escalate",
    trigger: "Player seen",
    detail:
      "An enemy sees a player somewhere they should not be, or doing something they should not be " +
      "doing: standing in a restricted room, picking a lock, stealing money, or using a PC. A " +
      "player under the Insider's disguise is exempt — enemies will not investigate staff.",
  },
  {
    id: "investigating-chasing",
    from: "investigating",
    to: "chasing",
    kind: "escalate",
    trigger: "Bar fills",
    detail:
      "The investigation bar reaches full. Nothing else escalates it: there is no instant spot, " +
      "which is what gives the three feedback channels a window to be acted on.",
  },
  {
    id: "investigating-idle",
    from: "investigating",
    to: "idle",
    kind: "deescalate",
    trigger: "Line of sight broken",
    detail:
      "The player breaks line of sight or leaves whatever triggered the investigation before the " +
      "bar fills. The enemy stands down and returns to its post or its route. This is the only " +
      "edge in the machine that runs backwards, and it is the whole reason the telegraphing exists.",
  },
  {
    id: "chasing-caught",
    from: "chasing",
    to: "caught",
    kind: "terminal",
    trigger: "Enemy reaches you",
    detail:
      "The pursuing enemy catches the player. The run ends there for all four, whatever the other " +
      "three were doing and whatever the team had already banked.",
  },
];

export const machineSummary =
  "Four states. Enemies start Idle, holding a post or walking a programmed route, and only the " +
  "Hacker's Distraction can move them off it. Being seen in a restricted room, picking a lock, " +
  "stealing money or using a PC moves an enemy to Investigating, where a bar above their head " +
  "fills over time. Break line of sight before it fills and the enemy returns to Idle; let it fill " +
  "and the state becomes Chasing, with the chase song playing and the enemy in pursuit. If the " +
  "enemy reaches the player, the state is Caught, and because the escape is collective that ends " +
  "the run for all four players. Above the row sit three traps — a broken laser beam, gold left " +
  "unreplaced on the vault rack, and a failed lockpick — which feed a single bus straight into " +
  "Chasing. All three bypass the Investigating state entirely, so none of them gives a player a " +
  "bar to outrun or a warning to act on.";

/* ---- the feedback model -------------------------------------------------
   Three channels, deliberately redundant. Each is listed with what it is and
   why it is separate from the other two — a player who has muted the game, a
   player watching the world instead of the HUD, and a player watching the HUD
   instead of the world all get told. */

export type FeedbackChannelId = "audio" | "hud" | "world";

export interface FeedbackChannel {
  id: FeedbackChannelId;
  /** The channel it occupies. */
  channel: string;
  name: string;
  body: string;
  /** Who this channel catches — the reason it is not redundant with the others. */
  catches: string;
}

export const feedbackChannels: readonly FeedbackChannel[] = [
  {
    id: "audio",
    channel: "Audio",
    name: "White-noise crescendo",
    body:
      "A band of white noise rises the whole time the bar is filling, built to resolve into the " +
      "chase song rather than to be replaced by it. The escalation is audible before it happens.",
    catches: "The player whose eyes are on a puzzle, not the screen edges.",
  },
  {
    id: "hud",
    channel: "Visual · HUD",
    name: "The eye icon",
    body:
      "An eye appears on the HUD the instant an investigation starts, and stays for as long as one " +
      "is running. It is the fastest read of the three: present or absent, no interpretation.",
    catches: "The player who is running and cannot pick a guard out of the room.",
  },
  {
    id: "world",
    channel: "Visual · world",
    name: "The investigation bar",
    body:
      "A bar above the enemy's head, filling in real time. It is the only channel that says WHICH " +
      "enemy and HOW LONG is left, so it is the one that turns a warning into a decision.",
    catches: "The player who knows they are seen but not by whom, or how urgently.",
  },
];

export const feedbackThesis =
  "Three channels fire at once, and none of them is optional.";

export const feedbackNote =
  "Redundant on purpose. Any one of the three would technically tell a player they had been " +
  "seen. All three together mean nobody is ever surprised by their own detection state, whatever " +
  "they happen to be looking at or listening to when it changes.";

/* ---- the constraint underneath everything ------------------------------- */

/* ---- the traps ----------------------------------------------------------
   The three ways a player's own mistake trips the alarm. They belong with the
   state machine rather than in a section of their own because that is what they
   ARE: extra edges into it.

   THE SHAPE IS THE ARGUMENT, and it is why the diagram draws them as one bus.
   All three land on Chasing, which means all three SKIP the Investigating
   state — no bar to outrun, no line of sight to break, no way back. Everything
   the feedback model above buys a player is unavailable on these three edges.
   That is the whole point of them: detection is survivable and forgiving, and
   the traps are the places where it stops being either, so a team plans around
   them instead of improvising through them.

   EACH ONE HAS A DESIGNED COUNTER, AND THIS FILE NO LONGER DRAWS IT. Which
   role takes which trap off the board is the role graph's to say — it draws
   the three counters as wires beside the six enabling ones — so the cards
   below carry the mistake, the state it forces and the cost, and a single
   pointer under them sends a reader one section back for the answer. What a
   trap does lives here; who saves you from it lives there.

   `counter` and `counterRole` stay as the design record: two of the three
   counters belong to somebody other than the player who trips them, which is
   the point of them, and the gold is the exception — the Vaultsnatcher trips
   that alarm and also holds the decoy that stops it. */

export type TrapId = "lasers" | "unreplaced-gold" | "failed-lockpick";

export interface AlarmTrigger {
  id: TrapId;
  /** Rendered as the T-number, so a trap can be cited from the prose. */
  index: string;
  name: string;
  /** Where in the level this one lives. */
  where: string;
  /** The mistake, short enough for the diagram. */
  mistake: string;
  /** Which state it forces. All three are `chasing`: that is the point. */
  escalatesTo: DetectionStateId;
  /** The punishment in three or four words, for the trap's tag. */
  consequenceTag: string;
  /** The punishment in full. */
  consequence: string;
  /** The whole trigger, for the card below the diagram. */
  detail: string;
  /** The designed answer, and whose it is. */
  counter: string;
  counterRole: RoleId;
}

export const alarmTriggers: readonly AlarmTrigger[] = [
  {
    id: "lasers",
    index: "T1",
    name: "Lasers",
    where: "Basement approach",
    mistake: "A beam is broken",
    escalatesTo: "chasing",
    consequenceTag: "15s escape",
    consequence: "Alarm trips · escape window cut to 15 seconds",
    detail:
      "The laser grid on the basement approach is invisible until something reveals it. Step into " +
      "a beam and the alarm goes straight off, and the run stops being a heist: the team has " +
      "fifteen seconds to be out of the building, which is not enough time to finish anything " +
      "still open. It is the harshest punishment in the game and it is attached to the one hazard " +
      "a player cannot see unaided.",
    counter: "Smoke reveals the beams and disables them — three bombs for the whole run.",
    counterRole: "lockpicker",
  },
  {
    id: "unreplaced-gold",
    index: "T2",
    name: "Unreplaced gold",
    where: "Vault ingot rack",
    mistake: "An ingot stays off the rack",
    escalatesTo: "chasing",
    consequenceTag: "30s escape",
    consequence: "Alarm trips · 30 seconds to get out",
    detail:
      "The rack is weighed. Lifting an ingot starts a one-second window to put a weight-matched " +
      "decoy in its place, and gold left unreplaced past that window trips the alarm and starts a " +
      "thirty-second escape clock. The window is per ingot, so the punishment scales with greed " +
      "exactly the way the risk does: the more gold coming off the rack at once, the more " +
      "one-second windows are open simultaneously.",
    counter: "Decoys matched by shape and weight, swapped in within the second.",
    counterRole: "vaultsnatcher",
  },
  {
    id: "failed-lockpick",
    index: "T3",
    name: "Failed lockpick",
    where: "Any locked door",
    mistake: "The pick slips",
    escalatesTo: "chasing",
    consequenceTag: "Straight to chase",
    consequence: "Noise amplified · enemies escalate directly to Chasing",
    detail:
      "Picking a lock makes noise inside about a three-metre radius. Failing one amplifies it to " +
      "roughly six metres and skips the investigation entirely — anything inside that radius goes " +
      "straight to Chasing rather than starting a bar. It is the only trap a player can walk into " +
      "purely by being rushed, which is why it is also the one most often tripped in the last two " +
      "minutes.",
    counter: "Vision reads the room first, so the pick is never attempted blind.",
    counterRole: "hacker",
  },
];

/** The claim the trap bus exists to make, printed on the wire itself. */
export const trapsThesis = "Skips S2 — no bar, no way back";

/**
 * One pointer, under the three cards, and the only thing this section says
 * about who answers a trap. It exists so the cards do not read as three
 * problems with no solutions: the solutions are drawn, one section back, as
 * wires between the roles that hold them.
 */
export const trapsCounterPointer =
  "Every one of the three has a designed counter, and none of them is drawn here: which role " +
  "takes which trap off the board is the role web's to show, in §05 · Nobody wins alone.";

export const trapsNote =
  "Every trap lands on Chasing, which means every trap skips Investigating. There is no filling " +
  "bar to outrun, no line of sight to break, and no channel gets a chance to warn anyone: the " +
  "first signal is the chase song. That asymmetry is deliberate. Ordinary detection is generous " +
  "so that players will move; the traps are where it stops being generous. They sit on exactly " +
  "the three actions worth planning around — crossing the basement, stripping the rack, and " +
  "opening a door in a hurry.";

export const trapsCredit =
  "Lead Designer, team of 4. I wanted punishment to be legible rather than fair-feeling, so each " +
  "of the three has one cause, one consequence and one counter. No role holds the counter to its " +
  "own trap — except the Vaultsnatcher, who both trips the gold alarm and defuses it. The laser " +
  "that kills your run is answered by somebody else's smoke bomb, which is the dependency web " +
  "arriving as a threat rather than as a favour.";

export const voiceConstraint = {
  headline: "No voice channel",
  body:
    "Break-In has no voice chat by design, so a player cannot be warned by a teammate — every " +
    "player has to read their own detection state unaided, which is what buys the three channels " +
    "their cost. It also makes enemy positions a shared problem with a single designed answer: the " +
    "Hacker's Vision, which highlights enemies in red through walls, is the only way anyone on the " +
    "team sees an enemy they are not looking at. Detection awareness is not a personal skill in " +
    "this game; it is a system somebody has to run.",
};

/* `body` used to open on "a stealth game with no voice channel cannot also be
   coy about detection", which is `voiceConstraint` restated two screens up
   inside this same section. Cut per the ownership map: the constraint is
   argued once, above, and this note starts from the consequence instead. */
export const designNote = {
  role: "Lead Designer",
  team: "Team of 4",
  body:
    "I designed this machine to be loud. If the player about to be spotted is the only one who " +
    "can act on it, then telling them has to be over-engineered rather than subtle. The three " +
    "channels, the de-escalation edge and the fact that nothing escalates instantly are all the " +
    "same decision: every player owns their own state, and the game makes sure they know what " +
    "it is.",
};

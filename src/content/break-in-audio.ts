/**
 * Break-In — audio direction.
 *
 * WHAT THIS CREDIT IS, EXACTLY. I directed and designed the audio: what the
 * game sounds like, when the score changes gear, and which actions have to be
 * audible for a team that cannot speak. I did not compose or perform it — the
 * music and effect assets were generated, and `audioCredit` below says so on
 * the page in those words. The design work is the decisions; the assets are
 * not the claim, and nothing in this file should ever drift toward implying
 * otherwise.
 *
 * THE SPINE. Break-In has no voice channel, so audio is not atmosphere here —
 * it is the coordination layer. Every claim below is an instance of that: the
 * score tells you how much run is left, the clock tells you it again in a
 * channel you cannot look away from, and every action a player takes announces
 * itself so the other three can read it without being told. `thesis` states it
 * once so the section has an argument rather than three lists.
 *
 * ONE NUMBER, ONE SOURCE. The tempo shift is specified by REMAINING time, and
 * this file reads `SCORE_SHIFT_REMAINING` / `SCORE_SHIFT_AT` from
 * `break-in-overview` rather than restating them. That is what stops the phase
 * clock in section 02 and the score clock here from ever disagreeing about
 * where the mark sits — change the constant there and both move.
 *
 * NO DETECTION MODEL HERE. `break-in-detection.ts` owns the state machine and
 * the three feedback channels, including the white-noise crescendo that
 * resolves into the chase song. This file names that crossing once, in
 * `detectionPointer`, and stops. If a description of the investigation bar,
 * the eye icon or the four states ever appears in this file, it is in the
 * wrong one.
 *
 * GEOMETRY lives in `BreakInAudio`, as everywhere else on this route. Nothing
 * here knows a pixel.
 */

import { RUN_MINUTES, SCORE_SHIFT_AT, SCORE_SHIFT_REMAINING, clockLabel } from "./break-in-overview";

/* ---- attribution --------------------------------------------------------
   First on the page, not tucked under it. The distinction between directing
   audio and writing it is the whole reason this block is worded carefully. */

export const audioCredit = {
  role: "Audio direction",
  team: "Team of 4",
  headline: "Designed, not composed",
  body:
    "I directed the audio on Break-In: what the game sounds like, what the score does when the " +
    "run changes state, and which actions had to be audible for a team with no way to talk to " +
    "each other. The design decisions below are mine. The music and effect assets themselves " +
    "were generated rather than written and performed by me — the craft I am claiming here is " +
    "the direction, not the composition.",
} as const;

/* ---- the thesis ---------------------------------------------------------
   One claim. Every band under it is an instance. */

export const thesis = {
  tag: "The throughline",
  line: "With no voice channel, sound is the coordination layer.",
  /* This used to open on "Break-In takes speech away on purpose, which leaves
     a four-player stealth game with no way to pass information" — which is the
     section standfirst in `page.tsx`, restated almost word for word two inches
     above this paragraph and visible on the same screen. The standfirst now
     poses the problem and this owns the answer. */
  body:
    "Audio is where I put it back. The score reports the state of the run, the clock reports the " +
    "time in a channel nobody can look away from, and every meaningful action announces itself " +
    "loudly enough to be read from another room. None of it is atmosphere that happens to be " +
    "useful; all of it is the communication system the design refuses to hand the players any " +
    "other way.",
} as const;

/* ---- 01 · the state-driven score ----------------------------------------
   Three gears, in the order a run meets them. `trigger` is what moves the
   score into this state — a game state, never a cue a composer picks. */

export type ScoreStateId = "baseline" | "pressure" | "chase";

export interface ScoreState {
  id: ScoreStateId;
  /** Rendered as the S-number. */
  index: string;
  name: string;
  /** What moves the score into this gear. */
  trigger: string;
  /** What it sounds like, in one line. */
  sound: string;
  /** What the player is meant to read off it. The design value. */
  reads: string;
}

export const scoreStates: readonly ScoreState[] = [
  {
    id: "baseline",
    index: "S1",
    name: "Sneaking",
    trigger: "The default. Nobody has been seen.",
    sound:
      "A synth-led underscore, tense but calm — driving enough to feel like a heist, quiet " +
      "enough to plan over. Modern rather than orchestral, because the fantasy is a crew with " +
      "good equipment, not a caper.",
    reads: "The run is going to plan, and there is still room to think.",
  },
  {
    id: "pressure",
    index: "S2",
    name: "Running out of time",
    trigger: `${SCORE_SHIFT_REMAINING} minutes left on the clock — ${clockLabel(SCORE_SHIFT_AT)} elapsed.`,
    sound:
      "The same underscore, taken up in tempo. It is a gear change rather than a new piece, so " +
      "nobody has to notice a transition to feel one.",
    reads:
      "Time is now the problem. The shift is the only warning a player working heads-down at a " +
      "puzzle gets, and it arrives without anyone having to tell them.",
  },
  {
    id: "chase",
    index: "S3",
    name: "Chase",
    trigger: "An enemy escalates to Chasing — see the detection model.",
    sound:
      "The underscore gives way to a chase theme: loud, unambiguous, and audible to all four " +
      "players wherever they are in the building.",
    reads:
      "Somebody has been caught out. This is the one moment in the run where every player learns " +
      "the same thing at the same time, and it is the score that tells them.",
  },
];

export const scoreNote =
  "The score is wired to game state, not to level geography. A track that changes when the " +
  "situation changes is a status readout. With no voice channel, a status readout everyone can " +
  "hear is worth more than a track that fits the room.";

/* ---- 02 · audio as the timer --------------------------------------------
   The clock is diegetic and audible. Ticks before the mark are quiet and
   even; after it they are louder. The rail in the component is drawn from
   `RUN_MINUTES` and `SCORE_SHIFT_AT`, so it re-registers itself if the run
   length ever changes. */

export const clockAudio = {
  label: "Audio as the timer",
  body:
    "The eight-minute clock ticks out loud. It runs under everything at a low level for the first " +
    `${SCORE_SHIFT_AT} minutes, marks the moment the score changes gear, and gets louder for the ` +
    `last ${SCORE_SHIFT_REMAINING}. There is a timer on the HUD as well, but the HUD is a thing ` +
    "you have to choose to look at, and three of the four roles spend most of the run looking at " +
    "something else.",
  why:
    "Time pressure only works if it is felt continuously rather than checked periodically. Put " +
    "the clock in the ear and a player picking a lock or typing a transfer knows how much run is " +
    "left without breaking off to find out. It also puts the whole team on the same clock " +
    "without anyone announcing it.",
  /** Drawn on the rail. Read from the run's own constants. */
  runMinutes: RUN_MINUTES,
  markAt: SCORE_SHIFT_AT,
  markLabel: clockLabel(SCORE_SHIFT_AT),
  endLabel: clockLabel(RUN_MINUTES),
  quietLabel: "Low, even ticks",
  loudLabel: "Louder, every second counted",
} as const;

/* ---- 03 · audio as communication ----------------------------------------
   The centrepiece, and the tie back to the page's no-voice pillar.

   `tells` is the load-bearing field. `sound` is what was made; `tells` is what
   another player two rooms away learns from hearing it — which is the only
   reason any of these cues were specified in the first place. A cue that
   cannot be read by somebody who did not perform it does not belong in this
   list. */

export type CueRole = "hacker" | "insider" | "lockpicker" | "vaultsnatcher" | "any";

export interface AudioCue {
  id: string;
  /** The action, in the player's language. */
  action: string;
  /** Whose action it is. `any` means it is not owned by one seat. */
  role: CueRole;
  /** What it sounds like. Short. */
  sound: string;
  /** What a teammate who did not perform it reads from hearing it. */
  tells: string;
  /** Marks the cues that carry a warning rather than a status. */
  warning?: boolean;
}

export const cues: readonly AudioCue[] = [
  {
    id: "lockpick",
    action: "Lockpicking",
    role: "lockpicker",
    sound: "Close, granular metal — the pick working the pins, held under the underscore.",
    tells: "Somebody is opening a door here, and is committed until it is done.",
  },
  {
    id: "lockpick-fail",
    action: "A failed lockpick",
    role: "lockpicker",
    sound: "The slip, sharply louder than the pick itself, spilling well past the door.",
    tells:
      "The attempt has gone wrong and the noise radius has doubled. It is the loudest mistake in " +
      "the game and it is meant to be — everyone nearby needs to move.",
    warning: true,
  },
  {
    id: "camera-switch",
    action: "Camera switch",
    role: "hacker",
    sound: "A short relay clack on the feed the Hacker moves to.",
    tells:
      "Where the Hacker is looking right now — which, for a player standing under that camera, " +
      "means they are being watched by the one teammate who can help.",
  },
  {
    id: "typing",
    action: "The Hacker typing",
    role: "hacker",
    sound: "Continuous keystrokes for as long as the transfer puzzle is live.",
    tells: "The digital heist is running and the Hacker is committed to a screen, not watching for you.",
  },
  {
    id: "vision",
    action: "Hacker Vision going up",
    role: "hacker",
    sound: "A low sweep on activation, and a softer fall when the five seconds are spent.",
    tells:
      "The window is open — and, more usefully, when it has closed. Nobody has to guess whether " +
      "they are still being watched over.",
  },
  {
    id: "distraction",
    action: "A distraction firing",
    role: "hacker",
    sound: "The hacked object itself — a light stuttering, a PC waking — heard from where it is, not from the Hacker.",
    tells:
      "A patrol is being pulled, and the sound is positioned so the team learns where it is being " +
      "pulled to. The cue is the plan.",
  },
  {
    id: "clue",
    action: "An environmental clue surfacing",
    role: "any",
    sound: "A short, bright confirmation tone on the object that just became readable.",
    tells: "The puzzle in front of you just got easier, and it was a teammate who did that.",
  },
];

export const cuesNote =
  "Every cue is specified by what it lets somebody else work out. That is the difference between " +
  "sound design and audio direction on this project. The question was never whether an action " +
  "sounded good; it was whether a player in another room could tell what had just happened and " +
  "act on it. Four players end up tracking each other by ear, which is the coordination the " +
  "voice channel would have handled if there had been one.";

/* ---- the crossing -------------------------------------------------------
   Names the detection model's audio channel and stops. The crescendo, the eye
   icon, the investigation bar and the four states all belong to
   `break-in-detection.ts`. */

export const detectionPointer = {
  label: "The audio channel of the detection model",
  body:
    "The white-noise crescendo that rises while an enemy is investigating, and resolves into the " +
    "chase theme when it escalates, is one of the three redundant feedback channels in the " +
    "detection system further up this page. It is designed there, with the eye and the " +
    "investigation bar it works alongside — this section only notes that the audio channel is the " +
    "one that reaches the other three players.",
} as const;

/** The section's screen-reader summary of the tick rail. */
export const clockRailSummary =
  `An eight-minute rail. For the first ${SCORE_SHIFT_AT} minutes the clock ticks are low and even. ` +
  `At ${clockLabel(SCORE_SHIFT_AT)} a mark shows where the score changes gear, and for the last ` +
  `${SCORE_SHIFT_REMAINING} minutes the ticks are louder and closer together, ending at ` +
  `${clockLabel(RUN_MINUTES)} where the run hard-fails.`;

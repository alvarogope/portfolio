import { RUN_MINUTES, SCORE_SHIFT_AT, SCORE_SHIFT_REMAINING, clockLabel } from "./break-in-overview";

export const audioCredit = {
  role: "Audio Designer",
  team: "Team of 4",
  headline: "Designed, not composed",
  body:
    "I was the game designer in Break-In. I focused mainly on communicating to the players what is " +
    "going on in the gameplay through the sound cues. The tension of the heist has to be transmitted through " +
    "the audio too. I did not compose the sounds that were used in the game, but I directed the decisions " +
    "that I am going to explain below.",
} as const;

export const thesis = {
  tag: "",
  line: "No voice channel made the coordination rely on the sound.",
  body:
    "The music and sound is what tells the player the state they are in, the state the enemies are " +
    "and the clock ticking reminding the players to consider it the whole time.",
} as const;

export type ScoreStateId = "baseline" | "pressure" | "chase";

export interface ScoreState {
  id: ScoreStateId;
  index: string;
  name: string;
  trigger: string;
  sound: string;
  reads: string;
}

export const scoreStates: readonly ScoreState[] = [
  {
    id: "baseline",
    index: "S1",
    name: "Sneaking",
    trigger: "Default",
    sound:
      "The music mainly is a synth that builds the tension but also is calm, representing this state.",
    reads: "The heist is going well and there is time to think.",
  },
  {
    id: "pressure",
    index: "S2",
    name: "Running out of time",
    trigger: `${SCORE_SHIFT_REMAINING} minutes left on the clock.`,
    sound:
      "The same music but with a faster tempo.",
    reads:
      "This is for the players to know that they are running out of time.",
  },
  {
    id: "chase",
    index: "S3",
    name: "Chase",
    trigger: "An enemy goes to Chasing Mode.",
    sound:
      "The music becomes loud, fast and tense and is heard by all the players.",
    reads:
      "Someone has been caught out and is being chased.",
  },
];

export const scoreNote =
  "The score is wired to game state. The audio changes when the " +
  "situation changes. With no voice channel this audio design is key.";

export const clockAudio = {
  label: "Audio to tell the time",
  body:
    "There is a timer on the HUD as well, but the HUD can be forgotten easily in a tense moment. " +
    "This helps the players to know how much time is left.",
  why:
    "The time pressure only worked if it was constantly reminded. I found that " +
    "this worked better for players, especially when he time got to 3 minutes.",
  runMinutes: RUN_MINUTES,
  markAt: SCORE_SHIFT_AT,
  markLabel: clockLabel(SCORE_SHIFT_AT),
  endLabel: clockLabel(RUN_MINUTES),
  quietLabel: "Tick every minute",
  loudLabel: "Louder and ticks every 30 seconds",
} as const;

export type CueRole = "hacker" | "insider" | "lockpicker" | "vaultsnatcher" | "any";

export interface AudioCue {
  id: string;
  action: string;
  role: CueRole;
  sound: string;
  warning?: boolean;
}

export const cues: readonly AudioCue[] = [
  {
    id: "lockpick",
    action: "Lockpicking",
    role: "lockpicker",
    sound: "Metal sound of lockpicking.",
  },
  {
    id: "lockpick-fail",
    action: "A failed lockpick",
    role: "lockpicker",
    sound: "A loud metal crack.",
    warning: true,
  },
  {
    id: "camera-switch",
    action: "Camera switch",
    role: "hacker",
    sound: "A clack on the camera the Hacker moves to.",
  },
  {
    id: "typing",
    action: "The Hacker typing",
    role: "hacker",
    sound: "Typing sound and change of music while the puzzle goes on."
  },
  {
    id: "vision",
    action: "Hacker Vision going up",
    role: "hacker",
    sound: "A low sweep when it activates and a softer fall when the five passes.",
  },
  {
    id: "distraction",
    action: "A distraction firing",
    role: "hacker",
    sound: "The hacked object itself: a light stuttering, a PC turning on. Whichever the object is.",
  },
  {
    id: "clue",
    action: "An environmental clue surfacing",
    role: "any",
    sound: "A short, bright confirmation tone on the object.",
  },
];

export const cuesNote =
  "These sounds were to help the players understand what is going on with their teammates since there is " +
  "no voice chat.";

export const detectionPointer = {
  label: "The audio channel of the detection model",
  body:
    "The white-noise crescendo that rises while an enemy is investigating, and resolves into the " +
    "chase theme when it escalates, is one of the three redundant feedback channels in the " +
    "detection system further up this page. It is designed there, with the eye and the " +
    "investigation bar it works alongside — this section only notes that the audio channel is the " +
    "one that reaches the other three players.",
} as const;

export const clockRailSummary =
  `An eight-minute rail. For the first ${SCORE_SHIFT_AT} minutes the clock ticks are low and even. ` +
  `At ${clockLabel(SCORE_SHIFT_AT)} a mark shows where the score changes gear, and for the last ` +
  `${SCORE_SHIFT_REMAINING} minutes the ticks are louder and closer together, ending at ` +
  `${clockLabel(RUN_MINUTES)} where the run hard-fails.`;
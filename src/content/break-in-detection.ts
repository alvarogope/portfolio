import type { RoleId } from "./break-in-roles";

export type DetectionStateId = "idle" | "investigating" | "chasing" | "caught";

export type DetectionBand = "calm" | "warn" | "alert" | "fail";

export interface DetectionState {
  id: DetectionStateId;
  order: number;
  name: string;
  band: DetectionBand;
  bandLabel: string;
  body: string;
  footer: string;
  detail: string;
}

export const detectionStates: readonly DetectionState[] = [
  {
    id: "idle",
    order: 1,
    name: "Idle / Patrol",
    band: "calm",
    bandLabel: "Calm",
    body: "Enemies hold position or walk a route.",
    footer: "Only a DISTRACTION moves them",
    detail:
      "The default state. Enemies can be in a fixed position or in a patrol route. The only thing " +
      "that moves them is the distraction and escalating to investigation or chasing.",
  },
  {
    id: "investigating",
    order: 2,
    name: "Investigating",
    band: "warn",
    bandLabel: "Warning",
    body: "An investigation bar above the enemy is filled.",
    footer: "",
    detail:
      "The enemy has seen something and its bar starts to fill up. Players can escape enemies in this state " +
      "by hiding and making them go back to their idle state.",
  },
  {
    id: "chasing",
    order: 3,
    name: "Chasing",
    band: "alert",
    bandLabel: "Alert",
    body: "A sound clue plays and the enemy start chasing.",
    footer: "",
    detail:
      "The bar got filled. The white-noise crescendo resolves into chase audio cue. The enemy starts chasing the player.",
  },
  {
    id: "caught",
    order: 4,
    name: "Caught",
    band: "fail",
    bandLabel: "Failure",
    body: "The enemy reaches the player. Mission Over.",
    footer: "",
    detail:
      "The enemy reaches the player and arrests them. Making the team to fail.",
  },
];

export type TransitionKind = "escalate" | "deescalate" | "terminal";

export interface DetectionTransition {
  id: string;
  from: DetectionStateId;
  to: DetectionStateId;
  kind: TransitionKind;
  trigger: string;
  detail: string;
}

export const detectionTransitions: readonly DetectionTransition[] = [
  {
    id: "idle-investigating",
    from: "idle",
    to: "investigating",
    kind: "escalate",
    trigger: "Player is seen",
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
    trigger: "Player not seen for a while",
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

export type FeedbackChannelId = "audio" | "hud" | "world";

export interface FeedbackChannel {
  id: FeedbackChannelId;
  channel: string;
  name: string;
  body: string;
  catches: string;
}

export const feedbackChannels: readonly FeedbackChannel[] = [
  {
    id: "audio",
    channel: "Audio",
    name: "White-noise crescendo",
    body:
      "A band of white noise rises while bar is filling, built to resolve into the " +
      "chase song. Making the tension present in the game.",
    catches: "",
  },
  {
    id: "hud",
    channel: "HUD",
    name: "An eye icon",
    body:
      "An eye appears on the HUD when an investigation starts. Giving real-time information about the enemy.",
    catches: "The player who is running and cannot pick a guard out of the room.",
  },
  {
    id: "world",
    channel: "HUD",
    name: "The investigation bar",
    body:
      "A bar above the enemy's head, filling in real time. States WHICH " +
      "enemy and HOW LONG is left deciding whether to escape or keep hiding.",
    catches: "The player who knows they are seen but not by whom, or how urgently.",
  },
];

export const feedbackThesis =
  "";

export type TrapId = "lasers" | "unreplaced-gold" | "failed-lockpick";

export interface AlarmTrigger {
  id: TrapId;
  index: string;
  name: string;
  where: string;
  mistake: string;
  escalatesTo: DetectionStateId;
  consequenceTag: string;
  consequence: string;
  detail: string;
  counter: string;
  counterRole: RoleId;
}

export const alarmTriggers: readonly AlarmTrigger[] = [
  {
    id: "lasers",
    index: "T1",
    name: "Lasers",
    where: "Basement",
    mistake: "",
    escalatesTo: "chasing",
    consequenceTag: "15s escape",
    consequence: "Alarm sets off and the escape window cut to 15 seconds",
    detail:
      "If any of the players is reached by any laser, the alarm will set off. They will have 15 seconds " +
      "to get out, leaving the unfinished tasks.",
    counter: "Smoke reveals the beams and disables them — three bombs for the whole run.",
    counterRole: "lockpicker",
  },
  {
    id: "unreplaced-gold",
    index: "T2",
    name: "Unreplaced gold",
    where: "Vault",
    mistake: "",
    escalatesTo: "chasing",
    consequenceTag: "30s escape",
    consequence: "Alarm sets off and 30 seconds to get out",
    detail:
      "If the player fails to replace the ingot with a similar weight object an alarm will set off. " +
      "This is per ingot and the players know about this, making this trap even a deliberate option to get out. " +
      "However, the more gold the player has stole, the slower he gets and they only have 30 seconds to get out.",
    counter: "Decoys matched by shape and weight, swapped in within the second.",
    counterRole: "vaultsnatcher",
  },
  {
    id: "failed-lockpick",
    index: "T3",
    name: "Failed lockpick",
    where: "Locked doors",
    mistake: "",
    escalatesTo: "investigating",
    consequenceTag: "Straight to chase",
    consequence: "Noise amplified · enemies escalate directly to Chasing",
    detail:
      "Picking a lock makes noise inside a three-metre radius. Failing one amplifies it to " +
      "six metres and trriggers the investigation immediately. It is the only trap a player can walk into " +
      "by rushing, which is why it is also the one most often tripped in the last two " +
      "minutes.",
    counter: "Vision reads the room first, so the pick is never attempted blind.",
    counterRole: "hacker",
  },
];

export const trapsThesis = "Skips S2";

export const trapsCounterPointer =
  "";

export const trapsNote =
  "";

export const trapsCredit =
  "I wanted the punish to be legible, so each trap has a cause and a consequence but can be avoided. This " +
  "connects with the level design as I wanted to give the player a way to escape the guards, because " +
  "failing just once and losing would be too much of a punishment.";

export const voiceConstraint = {
  headline: "No voice channel",
  body:
    "Break-In was designed with no voice chat, impeding players to warn one each other. The state " +
    "in which the heist is at the moment appears in the HUD. All the detection states appear in each of " +
    "the players' HUD. This also made me think of a way to make the players communicate with each other " +
    "without words. That's how the Hacker's Vision was born, which highlights enemies in red through the walls. " +
    "It is a way of communicating WARNING without any words, just because the Hacker triggered it.",
};

export const designNote = {
  role: "Lead Designer",
  team: "Team of 4",
  body:
    "This system and the way I designed it it was to make the players know when they are in danger and " +
    "allowing them to make decisions in a way that won't be punished hardly. This made the player " +
    "accountable of their own decisions instead of blaming the game system. Nothing escalates instantly, " +
    "players can hide and see enemies making them the owner of their decisions completely and putting them " +
    "in the centre of the game.",
};
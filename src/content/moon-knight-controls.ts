export type ControlGroup = "sticks" | "face" | "shoulder" | "system" | "dpad";

export type BindingSource = "gdd" | "alvaro" | "proposed";

export type ControlId =
  | "left-stick"
  | "left-stick-press"
  | "right-stick"
  | "right-stick-press"
  | "dpad"
  | "a"
  | "b"
  | "x"
  | "y"
  | "lb"
  | "rb"
  | "lt"
  | "rt"
  | "view"
  | "menu";

export interface CombatAction {
  action: string;
  why: string;
}

export interface ControlBinding {
  id: ControlId;
  input: string;
  code: string;
  group: ControlGroup;
  action: string;
  combat?: CombatAction;
  note?: string;
  source: BindingSource;
}

export const groupLabels: Record<ControlGroup, string> = {
  sticks: "Sticks",
  dpad: "D-pad",
  face: "Face buttons",
  shoulder: "Shoulders & triggers",
  system: "System",
};

export const groupOrder: readonly ControlGroup[] = [
  "sticks",
  "face",
  "shoulder",
  "dpad",
  "system",
];

export const controlBindings: readonly ControlBinding[] = [
  /* ---- sticks ---- */
  {
    id: "left-stick",
    input: "Left stick",
    code: "LS",
    group: "sticks",
    action: "Move character",
    source: "gdd",
  },
  {
    id: "left-stick-press",
    input: "L3",
    code: "L3",
    group: "sticks",
    action: "Stealth",
    note:
      "Having the stealth in the moving button allows the player to access this move quickly.",
    source: "alvaro",
  },
  {
    id: "right-stick",
    input: "Right stick",
    code: "RS",
    group: "sticks",
    action: "Move camera",
    source: "gdd",
  },
  {
    id: "right-stick-press",
    input: "R3",
    code: "R3",
    group: "sticks",
    action: "Lock on to target",
    note:
      "The same reason as stealth: Easy access while moving the camera.",
    source: "alvaro",
  },

  /* ---- face buttons ---- */
  {
    id: "y",
    input: "Y",
    code: "Y",
    group: "face",
    action: "Heal",
    note:
      "The harp. Healing requires the player to fully stop. There is no inventory.",
    source: "gdd",
  },
  {
    id: "x",
    input: "X",
    code: "X",
    group: "face",
    action: "Talk to NPCs",
    source: "gdd",
  },
  {
    id: "b",
    input: "B",
    code: "B",
    group: "face",
    action: "Dodge",
    note:
      "Unlimited, with i-frames, to keep aggressiveness in the combat system.",
    source: "gdd",
  },
  {
    id: "a",
    input: "A",
    code: "A",
    group: "face",
    action: "Jump",
    source: "gdd",
  },

  /* ---- shoulders & triggers ---- */
  {
    id: "lb",
    input: "LB",
    code: "LB",
    group: "shoulder",
    action: "Raise weapon",
    note:
      "The navigation animation: lift the sword, catch the moonlight and the light points the way.",
    source: "gdd",
  },
  {
    id: "lt",
    input: "LT",
    code: "LT",
    group: "shoulder",
    action: "Use bow",
    combat: {
      action: "Parry",
      why:
        "",
    },
    source: "alvaro",
  },
  {
    id: "rb",
    input: "RB",
    code: "RB",
    group: "shoulder",
    action: "Melee attack",
    source: "gdd",
  },
  {
    id: "rt",
    input: "RT",
    code: "RT",
    group: "shoulder",
    action: "Pick up item / throw arrow",
    combat: {
      action: "Strong melee",
      why:
        "",
    },
    source: "alvaro",
  },

  /* ---- d-pad ---- */
  {
    id: "dpad",
    input: "D-pad",
    code: "+",
    group: "dpad",
    action: "The spell grid. It selects and casts a Quantum Ability.",
    note:
      "Four directions for the abilities the player is ever given: Master of Matters, Instability, Inversion and Elliptical Force.",
    source: "alvaro",
  },

  /* ---- system ---- */
  {
    id: "view",
    input: "View",
    code: "VW",
    group: "system",
    action: "Equipment system",
    source: "gdd",
  },
  {
    id: "menu",
    input: "Menu",
    code: "MN",
    group: "system",
    action: "Pause menu",
    source: "gdd",
  },
];

export const controlsById = Object.fromEntries(
  controlBindings.map((c) => [c.id, c])
) as Record<ControlId, ControlBinding>;

/* ---- framing ------------------------------------------------------------ */

export const controlsIntro = {
  kicker: "The pad",
  title: "The Controller Map",
  body:
    "Things are worth reading off it. There is no block " +
    "button and two triggers change meaning the " +
    "moment a fight starts.",
  hint: "Point at a control on the pad, or at a row in the list. It will light up with its design choices.",
};

export const contextNote = {
  label: "Triggers that change in combat",
  body:
    "LT and RT depend on the player's status to change their actions." +
    "The game already knows whether you are fighting.",
};

export const padSummary =
  "A stylised modern gamepad. Across the top, the left trigger is Use bow, or Parry once a fight " +
  "has started, and the left bumper is Raise weapon; the right trigger is Pick up item or throw " +
  "arrow, or the heavy attack in combat, and the right bumper is Melee attack. The left stick " +
  "moves the character and clicking it goes into stealth; the right stick moves the camera and " +
  "clicking it locks on to a target. The D-pad is the spell grid, its four directions casting the " +
  "four quantum abilities the player is given. The four face buttons are Y for Heal, X for Talk " +
  "to NPCs, B for Dodge and A for Jump. The small View button opens the equipment system and the " +
  "Menu button pauses.";
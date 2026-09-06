/**
 * Moon-Knight — the control scheme, as a gamepad map.
 *
 * WHERE EACH BINDING COMES FROM, because they do not all come from the same
 * place. `source` records it on every row and the page prints it:
 *
 *   "gdd"      read off the original controls diagram
 *              (`public/images/moon-knight/controls.png`), which is the scheme
 *              the game was built to.
 *   "alvaro"   given directly by Álvaro afterwards, filling the gaps the
 *              diagram left — the stick clicks, the spell grid, and the
 *              context-sensitive parry.
 *   "proposed" reserved for a suggestion that has not been confirmed. NOTHING
 *              currently carries it — RT as the heavy attack was the last one
 *              and Álvaro has since confirmed it. Keep the value: if a future
 *              binding is guessed rather than known, it belongs here so the
 *              page can flag it rather than letting it harden into fact.
 *
 * CONTEXT-SENSITIVE BINDINGS. Two triggers do different things depending on
 * whether the knight is in combat, which is the design idea worth showing:
 * the out-of-combat action is the one you would never want mid-fight, and the
 * in-combat action is the one you would never want while exploring. `combat`
 * holds the second meaning; a row without it does the same thing everywhere.
 *
 * LAYOUT IS XBOX-ORDER, and the labels use Xbox names (A/B/X/Y, LB/RB, LT/RT,
 * L3/R3) because that is what the source diagram drew. `ControllerMap` renders
 * a stylised pad rather than any manufacturer's, so the names are the only
 * thing tying it to a real controller.
 *
 * `id` is the load-bearing field. It is the React key, and the `data-ctl` hook
 * on both the SVG control and its legend row — which is what lets a hover or a
 * focus on either one light up the other with no JavaScript at all. Adding a
 * control means adding geometry for that id in `ControllerMap`. Note that the
 * stick CLICKS are their own ids: physically they are the same stick, but they
 * are separate inputs with separate actions, so they get separate rows and the
 * pad lights the stick's cap rather than its well.
 */

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

/** The second meaning a context-sensitive input takes on. */
export interface CombatAction {
  action: string;
  /** Why the input carries two meanings. The design point, in one line. */
  why: string;
}

export interface ControlBinding {
  id: ControlId;
  /** The input as the diagram names it — "LB", "Y", "Left stick", "L3". */
  input: string;
  /** Short code drawn on the pad itself. Two characters where possible. */
  code: string;
  group: ControlGroup;
  /** The action. On a context-sensitive input, the out-of-combat one. */
  action: string;
  /** Present only where the input changes meaning in combat. */
  combat?: CombatAction;
  /**
   * Why the binding is interesting, where it is. Only the rows that carry a
   * design point have one — most of a control scheme is just a control scheme,
   * and annotating every row would bury the few that matter.
   */
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

/** Reading order for the legend. */
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
      "Clicking the stick you already move with. Going quiet is a change to how you walk, so it is bound to the thing that walks.",
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
      "The same symmetry: the camera stick takes the camera decision. Clicking it hands the framing to the game.",
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
      "The harp. Healing is something the knight stops and plays, so it sits on a face button. There is no inventory to open and no potion to select.",
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
      "Unlimited, with i-frames. No block is bound anywhere on the pad — defence had to be a movement, so it is bound like one.",
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
      "The navigation gesture: lift the sword, catch the moonlight, and the blade points the way. A shoulder button, not a map screen.",
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
        "The bow is an opener, drawn on something that has not noticed you yet. That leaves the trigger free the moment a fight starts, so parry takes it over — the highest-risk defensive move goes under the idle finger.",
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
        "LT's reasoning, mirrored. Picking things up is not a combat verb, so the right trigger is idle in a fight. Light on the bumper, heavy on the trigger, which is where a hand already expects them.",
    },
    source: "alvaro",
  },

  /* ---- d-pad ---- */
  {
    id: "dpad",
    input: "D-pad",
    code: "+",
    group: "dpad",
    action: "The spell grid — select and cast a quantum ability",
    note:
      "Four directions for the four abilities the player is ever given: Master of Matters, Instability, Inversion and Elliptical Force. The fifth is enemy-exclusive, so it has no key on the grid. The decision is stated in the control scheme rather than in prose.",
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
  title: "Every action, on one controller",
  body:
    "The scheme the game is built to. Three things are worth reading off it. There is no block " +
    "button anywhere on the pad. Wayfinding and healing sit on controls you can reach mid-fight, " +
    "where a conventional RPG would bury both in menus. And two triggers change meaning the " +
    "moment a fight starts.",
  hint: "Point at a control on the pad, or at a row in the list — the other lights up, and its reasoning reads out here.",
};

/** Explains the two-meaning rows, once, above the legend. */
export const contextNote = {
  label: "Triggers that change in combat",
  body:
    "LT and RT each carry two actions. Out of combat they are the bow and the hands. Neither is " +
    "any use once a fight starts, so the same two fingers become parry and the heavy attack. " +
    "Nothing is modal and nothing is toggled — the game already knows whether you are fighting, " +
    "because the same combat state drives the health readout.",
};

/** The pad's text equivalent, for the SVG's description. */
export const padSummary =
  "A stylised modern gamepad. Across the top, the left trigger is Use bow, or Parry once a fight " +
  "has started, and the left bumper is Raise weapon; the right trigger is Pick up item or throw " +
  "arrow, or the heavy attack in combat, and the right bumper is Melee attack. The left stick " +
  "moves the character and clicking it goes into stealth; the right stick moves the camera and " +
  "clicking it locks on to a target. The D-pad is the spell grid, its four directions casting the " +
  "four quantum abilities the player is given. The four face buttons are Y for Heal, X for Talk " +
  "to NPCs, B for Dodge and A for Jump. The small View button opens the equipment system and the " +
  "Menu button pauses.";

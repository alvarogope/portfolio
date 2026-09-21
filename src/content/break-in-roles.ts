/**
 * Break-In — the four co-op roles and the dependency web between them.
 *
 * This is the data behind the "Nobody wins alone" diagram (`RoleGraph`). It is
 * deliberately *semantic only*: ids, copy and the directed links. Nothing here
 * knows where a node sits on screen or what a wire looks like — that layout
 * lives in the component, so the same data can drive the SVG diamond, the
 * mobile roster, or anything added later.
 *
 * TWO WEBS, ONE GRAPH. The links are not all the same kind of debt. Six say
 * what a role switches on or opens up for a teammate; three say which of the
 * three traps a role takes off a teammate's board. Both are dependencies and
 * both belong on the same picture — a role you need for what it prevents is as
 * load-bearing as one you need for what it hands you — so `counters` is a link
 * type beside `unlocks` and `enables` rather than a second diagram.
 *
 * THE TRAPS ARE NOT DESCRIBED HERE. A `counters` link carries a `trap` id and
 * a label naming the counter; what the trap does, what it costs and why it
 * skips the Investigating state all live in `break-in-detection`. This file
 * says who saves you, that file says what from.
 *
 * Stage 1 renders it static with one role pre-selected. Stage 2 wires
 * hover/click to change that selection, which is why every lookup a highlight
 * needs (`linkTouches`, `incomingLinks`, `outgoingLinks`) is a pure function of
 * a `RoleId` rather than something the view derives inline.
 *
 * EACH ROLE CARRIES ITS FULL KIT (`discipline` + `kit`), and the readout panel
 * beside the diagram renders it. That is deliberate and it is the reason there
 * is no separate abilities section on the page: the graph already answers "what
 * is this role", so the fuller answer belongs in the same place rather than in
 * a second list repeating the same four names.
 *
 * `selectionRule` is the lobby rule that makes the whole web binding. It is
 * data rather than page copy because it is a fact about the system, not a
 * caption — the interdependence the diagram draws is enforced before the run
 * starts, not discovered during it.
 */

/* Type-only, and deliberately circular: `break-in-detection` imports `RoleId`
   back from here. Both edges are `import type`, so both are erased and no
   module ever waits on the other at runtime. The cycle is the point — a trap
   knows which role counters it, and a counter-link knows which trap it takes
   off the board, and neither file should own the other's facts. */
import type { TrapId } from "./break-in-detection";

export type RoleId = "insider" | "hacker" | "lockpicker" | "vaultsnatcher";

/**
 * How one role acts on another. The four split into TWO WEBS, and the diagram
 * draws both: what a role switches on for a teammate, and what it takes off
 * the board for them.
 *
 * What a role ENABLES:
 * - `unlocks`  — turns a teammate's ability on; it does not exist until this happens.
 * - `enables`  — makes a teammate's move possible *now*: information, or a window.
 *
 * What a role PROTECTS AGAINST:
 * - `counters` — takes one NAMED TRAP off the board. Carries a `trap` id, and
 *   that trap's mechanics are the detection state machine's to state, not this
 *   file's: here a counter-link says only who holds the answer to which hazard.
 * - `protects` — keeps the team alive without countering anything specific.
 *   Exactly one link is this: the escape route, which the diagram draws in its
 *   own `escape` style because it is the one line all four are on.
 */
export type LinkType = "unlocks" | "enables" | "protects" | "counters";

/** `"all"` is the escape route: one link that lands on every other role at once. */
export type LinkTarget = RoleId | "all";

/**
 * One entry in a role's kit. `name` is the ability as the design document names
 * it; `body` is what it actually does; `note` is the one consequence worth
 * pulling out — a cost, a dependency, or the thing it unlocks elsewhere.
 *
 * The kit lives HERE rather than in a separate abilities section on the page:
 * the readout panel beside the diagram is already the place a reader goes to
 * find out what a role can do, so the fuller detail belongs in it rather than
 * in a second list saying the same names again.
 */
export interface RoleAbility {
  name: string;
  body: string;
  /**
   * The numbers the ability is actually tuned to — duration, cooldown, radius.
   * Rendered as a mono chip beside the name, so a reader can compare two roles'
   * budgets without reading either paragraph. Only abilities that HAVE tuned
   * numbers carry one; a lockpick has a noise radius, finding a password does
   * not, and inventing a figure for the second would be worse than the gap.
   */
  tuning?: string;
  note?: string;
}

/**
 * The mini-game a role plays. Three of the four have one; the Insider does not,
 * and that is a design decision rather than a hole — see `puzzleAsymmetryNote`.
 * `fail` is the cost of losing it, which is what makes the puzzle a risk rather
 * than a delay.
 */
export interface RolePuzzle {
  name: string;
  body: string;
  fail?: string;
}

export interface BreakInRole {
  /** Stable key. Drives the SVG node, the highlight, and every link lookup. */
  id: RoleId;
  name: string;
  /** Position in the roster, "01"–"04". Rendered as the node watermark. */
  orbitLabel: string;
  /** Surveillance-console dressing: the camera that covers this role. */
  cam: string;
  /** Where that camera points. */
  location: string;
  /** The seat's job in one phrase — what this player is FOR. */
  discipline: string;
  /** The full ability kit, rendered as labelled items in the readout. */
  kit: readonly RoleAbility[];
  /** The role's mini-game, or `null` for the one role deliberately without one. */
  puzzle: RolePuzzle | null;
}

export interface RoleLink {
  /** `"<from>-<to>"`. Also the key the component's wire-geometry table uses. */
  id: string;
  from: RoleId;
  to: LinkTarget;
  type: LinkType;
  /** The dependency in one line, as it reads on the wire and in the panel. */
  label: string;
  /**
   * Set on `counters` links only: WHICH trap this one takes off the board.
   * An id, never a description — the trap's cause, consequence and cost are
   * owned by `break-in-detection`, and the component resolves the id against
   * `alarmTriggers` to print its T-number. That is the whole reference: this
   * file says who saves you, that file says what from.
   */
  trap?: TrapId;
}

export const breakInRoles: readonly BreakInRole[] = [
  {
    id: "insider",
    name: "The Insider",
    orbitLabel: "01",
    cam: "CAM-01",
    location: "Lobby / Staff Door",
    discipline: "Access · opens the paths nobody else can walk",
    kit: [
      {
        name: "Disguise",
        body:
          "Passes as Security, a Janitor or Office Staff — the uniform is randomised, so which " +
          "doors it is worth walking through changes every run. Enemies will not investigate a " +
          "player wearing a uniform they recognise.",
        tuning: "10s · 60s cooldown",
        note: "Will not activate in front of an enemy: it has to be put on before it is needed, not once it is.",
      },
      {
        name: "Find the Security Card",
        body:
          "The card opens the server room, where a USB goes into a live server.",
        note: "That USB is what switches on the Hacker's downstairs cameras.",
      },
      {
        name: "Find the Escape",
        body:
          "One of three randomised exits: the bathroom vent, the vent beside the vault, or the " +
          "backdoor in the manager's office. Which one it is changes every run.",
        note: "Once found, a red guide line to the exit appears for all four players.",
      },
    ],
    /* The one role with no mini-game. Deliberate: see `puzzleAsymmetryNote`. */
    puzzle: null,
  },
  {
    id: "hacker",
    name: "The Hacker",
    orbitLabel: "02",
    cam: "CAM-02",
    location: "Security Office",
    discipline: "Assistance / support · the team's eyes",
    kit: [
      {
        name: "CCTV Control",
        body:
          "A strategic top-down view of the bank through the security cameras. The downstairs " +
          "cameras stay dark until a USB is planted in the camera PC.",
        note: "A sign appears on whichever camera is active, so the team can see where the Hacker is looking.",
      },
      {
        name: "Distraction",
        body:
          "Hacks highlighted electrical objects — lights, computers — to pull enemies off their " +
          "programmed routes.",
        tuning: "7s · 10s cooldown",
        note: "The only thing in the game that moves a patrol off its route.",
      },
      {
        name: "Hacker Vision",
        body:
          "Highlights enemies in red through walls.",
        tuning: "5s · 30s cooldown",
        note:
          "With no voice channel, this is the team's only awareness of where enemies actually are — " +
          "and it is up for five seconds in every thirty-five.",
      },
      {
        name: "Finding Environmental Clues",
        body:
          "A distraction can also surface clues in the environment for whoever is working a puzzle.",
        note: "Clues lower the difficulty of the puzzle they belong to.",
      },
    ],
    puzzle: {
      name: "Speed typing",
      body:
        "Words appear and have to be typed back quickly and accurately to move the digital money " +
        "out — it is a CBDC, so the theft is a transfer rather than a carry.",
      fail: "Miss it and the transfer restarts from the top, with the clock still running.",
    },
  },
  {
    id: "lockpicker",
    name: "The Lockpicker",
    orbitLabel: "03",
    cam: "CAM-03",
    location: "Basement / Laser Grid",
    discipline: "Entry · the digital money",
    kit: [
      {
        name: "Lock Picking",
        body: "Opens locked doors with a pick set, through a timing puzzle.",
        tuning: "~3 m noise · ~6 m on a failure",
        note: "A failed attempt is louder, and everything inside that wider radius escalates straight to a chase.",
      },
      {
        name: "Stealing Digital Money",
        body:
          "Transfers money out of hidden PCs around the bank, several of which sit behind locked " +
          "doors only this role can open.",
        note: "Needs the manager's password, which the Vaultsnatcher finds.",
      },
      {
        name: "Smoke Bombs",
        body: "Three per run. Smoke reveals the basement laser traps and disables them.",
        tuning: "3 per run",
        note: "Three charges for a whole run — the Vaultsnatcher's route in depends on how they are spent.",
      },
    ],
    puzzle: {
      name: "Pick and turn",
      body:
        "Hold the pick steady in position while turning the knob through its full travel. Rushing " +
        "the turn is what slips it.",
      fail: "A slip amplifies the noise from about three metres to about six, and escalates anything inside it straight to Chasing.",
    },
  },
  {
    id: "vaultsnatcher",
    name: "The Vaultsnatcher",
    orbitLabel: "04",
    cam: "CAM-04",
    location: "Vault / Ingot Rack",
    discipline: "Extraction · the physical gold",
    kit: [
      {
        name: "Find the Manager's Password",
        body: "Hidden in the manager's cabin. It is what opens the vault.",
        note: "It also opens the Lockpicker's digital transfer.",
      },
      {
        name: "Pick up Gold Ingots",
        body:
          "A rapid button-press grab: how much gold leaves the rack is a function of how fast the " +
          "player works. Ingots highlight as you approach them.",
        note: "Loot slows the carrier down — every ingot is money now and speed later.",
      },
      {
        name: "Replace the Ingot",
        body:
          "A weight-matched decoy has to go back on the rack within one second of the real ingot " +
          "coming off it.",
        tuning: "1s window per ingot",
        note: "Miss the second and the alarm trips, leaving the whole team thirty seconds to get out.",
      },
    ],
    puzzle: {
      name: "Shape and weight match",
      body:
        "Find objects around the bank whose shape and weight match the ingots, and carry them back " +
        "as decoys. How many the rack needs is randomised and never shown, and only two can be " +
        "carried at a time — so the trip has to be made more than once, blind.",
      fail: "Come up short and the rack is left holding gaps, which is what trips the alarm.",
    },
  },
];

/**
 * Three of the four roles have a mini-game. The Insider does not, and that is
 * the decision rather than the omission: the Insider's work is disguise timing,
 * routing and searching — reading a room and choosing a moment — and bolting a
 * dexterity test onto that would have replaced the judgement with a reflex. The
 * asymmetry also does something for the table, since it means one player is
 * always free to move while the other three are locked to a screen.
 */
export const puzzleAsymmetryNote = {
  headline: "Three puzzles, not four",
  body:
    "The Hacker types, the Lockpicker picks and the Vaultsnatcher matches decoys. The Insider has " +
    "no mini-game at all — their skill is timing a disguise, reading a route and finding things, " +
    "and a dexterity test would have replaced that judgement rather than tested it. It leaves one " +
    "player mobile at any moment the other three are heads-down, which is the practical half of " +
    "the same decision.",
  credit: "A Lead Designer call, on a team of four.",
};

/**
 * The nine dependencies, and they are two webs rather than one list.
 *
 * SIX ARE THE ENABLING WEB (`unlocks` / `enables`): what one player switches on
 * or opens up for another. That was the original diagram.
 *
 * THREE ARE THE COUNTER WEB (`counters`): who holds the answer to each of the
 * three traps. They are drawn because the traps are the other half of the same
 * argument — a role is load-bearing not only for what it hands a teammate, but
 * for the hazard it takes off that teammate's board. Every one carries a `trap`
 * id and nothing else about the trap; the mechanics stay in the detection file.
 *
 * The escape route is the ninth and it is its own thing: the one line every
 * role is on at once, modelled as a single link to `"all"` rather than three
 * duplicates so the diagram can draw it as one bus.
 */
export const roleLinks: readonly RoleLink[] = [
  {
    id: "insider-hacker",
    from: "insider",
    to: "hacker",
    type: "unlocks",
    label: "USB unlocks the downstairs cameras",
  },
  {
    id: "hacker-insider",
    from: "hacker",
    to: "insider",
    type: "enables",
    label: "Vision hands over patrol positions",
  },
  {
    id: "hacker-lockpicker",
    from: "hacker",
    to: "lockpicker",
    type: "enables",
    label: "Distraction clears the halls to the PCs",
  },
  {
    id: "hacker-vaultsnatcher",
    from: "hacker",
    to: "vaultsnatcher",
    type: "enables",
    label: "Vision reads the guards through vault walls",
  },
  /* ---- the counter web: who holds the answer to which trap ---- */
  {
    id: "lockpicker-vaultsnatcher",
    from: "lockpicker",
    to: "vaultsnatcher",
    type: "counters",
    trap: "lasers",
    label: "T1 · smoke kills the lasers",
  },
  /* The Hacker's second wire to the Lockpicker, and the reason the counter web
     was worth drawing at all: the Distraction link above says what the Hacker
     opens up, this one says what it keeps from happening. Same pair, both
     webs, which is the clearest case on the diagram for having two. */
  {
    id: "hacker-lockpicker-vision",
    from: "hacker",
    to: "lockpicker",
    type: "counters",
    trap: "failed-lockpick",
    label: "T3 · vision reads the room first",
  },
  /* To "all" because the punishment is: an ingot left off the rack puts the
     WHOLE team on a thirty-second clock, so swapping the decoy in time is
     something the Vaultsnatcher does for the other three as much as for
     themselves. The one trap whose counter sits with the role that trips it. */
  {
    id: "vaultsnatcher-all",
    from: "vaultsnatcher",
    to: "all",
    type: "counters",
    trap: "unreplaced-gold",
    label: "T2 · decoys swapped in the second",
  },
  {
    id: "vaultsnatcher-lockpicker",
    from: "vaultsnatcher",
    to: "lockpicker",
    type: "unlocks",
    label: "Manager's password opens the transfer",
  },
  {
    id: "insider-all",
    from: "insider",
    to: "all",
    type: "protects",
    label: "Escape route — the red line all four need",
  },
];

/** Legend copy. What each line style means, in the order the legend lists them. */
export const linkTypeMeta: Record<LinkType, { term: string; gloss: string }> = {
  unlocks: { term: "Unlocks", gloss: "turns an ability on" },
  enables: { term: "Enables", gloss: "opens the window to move" },
  counters: { term: "Counters", gloss: "takes a named trap off the board" },
  protects: { term: "Protects", gloss: "keeps the team alive" },
};

/**
 * The legend's first three rows. `protects` is not among them and that is not
 * an omission: its only member is the escape route, which the diagram draws in
 * its own `escape` style, so the fourth legend row is the escape bus and it
 * borrows this gloss. Every style in the key has wires on the graph.
 */
export const linkTypeOrder: readonly LinkType[] = ["unlocks", "enables", "counters"];

/** The role the diagram opens on. The Hacker is the hub: it touches all seven links. */
export const DEFAULT_ROLE: RoleId = "hacker";

/**
 * No character duplication. Picking a role in the lobby locks it out for
 * everyone else, so a party is always exactly one of each. My call as Lead
 * Designer, and the earliest point the "nobody wins alone" pillar is enforced:
 * the four kits were designed to cover each other's gaps, and two of anything
 * would leave one of those gaps permanently open.
 */
export const selectionRule = {
  headline: "No character duplication",
  body:
    "Each of the four roles can be chosen only once — picking one in the lobby locks it out for " +
    "the rest of the party. The kits were designed to complement each other's strengths and cover " +
    "each other's weaknesses, so a team with two Hackers and no Lockpicker is not a weaker team, " +
    "it is a team that cannot finish the run at all.",
  credit:
    "A Lead Designer decision on a team of four: the dependency web above is not something players " +
    "opt into, it is enforced from the character-select screen. Nobody wins alone starts before " +
    "the heist does.",
};

const byId = new Map(breakInRoles.map((r) => [r.id, r]));

export function getRole(id: RoleId): BreakInRole {
  const role = byId.get(id);
  if (!role) throw new Error(`Unknown Break-In role: ${id}`);
  return role;
}

/** Expands `to: "all"` into every role but the source. A role never needs itself. */
export function linkTargets(link: RoleLink): RoleId[] {
  if (link.to !== "all") return [link.to];
  return breakInRoles.map((r) => r.id).filter((id) => id !== link.from);
}

/** True when `id` is either end of the link. Drives the highlight in both stages. */
export function linkTouches(link: RoleLink, id: RoleId): boolean {
  return link.from === id || linkTargets(link).includes(id);
}

/** What this role NEEDS: every link pointing at it, with who it comes from. */
export function incomingLinks(id: RoleId): { link: RoleLink; source: BreakInRole }[] {
  return roleLinks
    .filter((link) => link.from !== id && linkTargets(link).includes(id))
    .map((link) => ({ link, source: getRole(link.from) }));
}

/** What this role GIVES: every link leaving it, with everyone it lands on. */
export function outgoingLinks(id: RoleId): { link: RoleLink; targets: BreakInRole[] }[] {
  return roleLinks
    .filter((link) => link.from === id)
    .map((link) => ({ link, targets: linkTargets(link).map(getRole) }));
}

/** Every role on the far end of a link from `id` — the nodes a highlight lights up with it. */
export function connectedRoles(id: RoleId): Set<RoleId> {
  const out = new Set<RoleId>();
  for (const link of roleLinks) {
    if (!linkTouches(link, id)) continue;
    if (link.from !== id) out.add(link.from);
    for (const target of linkTargets(link)) if (target !== id) out.add(target);
  }
  return out;
}

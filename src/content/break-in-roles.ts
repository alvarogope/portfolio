/**
 * Break-In — the four co-op roles and the dependency web between them.
 *
 * This is the data behind the "Nobody wins alone" diagram (`RoleGraph`). It is
 * deliberately *semantic only*: ids, copy and the directed links. Nothing here
 * knows where a node sits on screen or what a wire looks like — that layout
 * lives in the component, so the same data can drive the SVG diamond, the
 * mobile roster, or anything added later.
 *
 * Stage 1 renders it static with one role pre-selected. Stage 2 wires
 * hover/click to change that selection, which is why every lookup a highlight
 * needs (`linkTouches`, `incomingLinks`, `outgoingLinks`) is a pure function of
 * a `RoleId` rather than something the view derives inline.
 */

export type RoleId = "insider" | "hacker" | "lockpicker" | "vaultsnatcher";

/**
 * How one role acts on another.
 * - `unlocks`  — turns a teammate's ability on; it does not exist until this happens.
 * - `enables`  — makes a teammate's move possible *now*: information, or a window.
 * - `protects` — keeps a teammate alive/undetected rather than granting them anything.
 */
export type LinkType = "unlocks" | "enables" | "protects";

/** `"all"` is the escape route: one link that lands on every other role at once. */
export type LinkTarget = RoleId | "all";

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
  /** One-paragraph "what they do", for the readout panel. */
  summary: string;
  /** Short ability tags, rendered as mono pills. */
  abilities: readonly string[];
}

export interface RoleLink {
  /** `"<from>-<to>"`. Also the key the component's wire-geometry table uses. */
  id: string;
  from: RoleId;
  to: LinkTarget;
  type: LinkType;
  /** The dependency in one line, as it reads on the wire and in the panel. */
  label: string;
}

export const breakInRoles: readonly BreakInRole[] = [
  {
    id: "insider",
    name: "The Insider",
    orbitLabel: "01",
    cam: "CAM-01",
    location: "Lobby / Staff Door",
    summary:
      "Opens the way: disguise as staff, security card, USB in the server room, escape route.",
    abilities: ["Disguise", "Security Card", "USB"],
  },
  {
    id: "hacker",
    name: "The Hacker",
    orbitLabel: "02",
    cam: "CAM-02",
    location: "Security Office",
    summary:
      "The team's shared sight. Marks enemies in red through walls and moves them with a hack. Powerless below until the Insider acts. No voice channel.",
    abilities: ["Hacker Vision", "Distraction", "CCTV"],
  },
  {
    id: "lockpicker",
    name: "The Lockpicker",
    orbitLabel: "03",
    cam: "CAM-03",
    location: "Basement / Laser Grid",
    summary:
      "Steals the digital money. Picks the doors to the PCs; smoke bombs reveal and kill the basement lasers.",
    abilities: ["Lockpick", "Smoke Bomb", "PC Transfer"],
  },
  {
    id: "vaultsnatcher",
    name: "The Vaultsnatcher",
    orbitLabel: "04",
    cam: "CAM-04",
    location: "Vault / Ingot Rack",
    summary:
      "Solves the vault, takes the gold, replaces the ingots before the alarm hits everyone.",
    abilities: ["Vault Puzzle", "Ingot Swap", "Password"],
  },
];

/**
 * The seven dependencies. Six are role-to-role; the last is the escape route,
 * the one line every role is on at once — modelled as a single link to `"all"`
 * rather than three duplicates, so the diagram can draw it as one bus.
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
  {
    id: "lockpicker-vaultsnatcher",
    from: "lockpicker",
    to: "vaultsnatcher",
    type: "protects",
    label: "Smoke reveals and kills the lasers",
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
  protects: { term: "Protects", gloss: "keeps the team alive" },
};

export const linkTypeOrder: readonly LinkType[] = ["unlocks", "enables", "protects"];

/** The role the diagram opens on. The Hacker is the hub: it touches all seven links. */
export const DEFAULT_ROLE: RoleId = "hacker";

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

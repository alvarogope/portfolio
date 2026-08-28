/**
 * Moon-Knight — Liber Monstrorum, the bestiary.
 *
 * Two tiers. The four BOSSES each own one of the game's quantum combat
 * mechanics — the fight is how the player is taught that mechanic, so the
 * mechanic name here matches an entry in `moonKnight.abilities`
 * (`src/content/games/moon-knight.ts`). The six ENEMIES are read instead
 * through gameplay + weakness: the bestiary is the thing "Master of Matters"
 * asks the player to learn before committing an element.
 *
 * Stage 2 hangs an interactive world map off this file. Every entry therefore
 * carries a stable `id` (`BestiaryId`) which is:
 *   - the React key and the DOM anchor id (`#bestiary-<id>`), so the map can
 *     deep-link to a card;
 *   - the emblem selector in `Bestiary.tsx` (`EMBLEMS[id]`);
 *   - the intended key for a future `mapRegion` lookup, kept OUT of this file
 *     so region data can be added without touching the codex.
 * Look entries up with `bestiaryById` rather than indexing the arrays.
 *
 * `accent` is a render token, not lore: it tints the stained-glass wash behind
 * that creature's emblem and its rules. Same idea as `Planet.accent`.
 */

export type BestiaryId =
  | "werewolf"
  | "centaur-knight"
  | "wizard-knight"
  | "sun-knight"
  | "soldiers"
  | "wooden-humanoids"
  | "amphibian-humanoids"
  | "banshees"
  | "ghosts"
  | "ice-knights";

export type BestiaryTier = "boss" | "enemy";

/** Elemental answer the player is meant to find. `none` = no elemental key. */
export type WeaknessType = "fire" | "lightning" | "light" | "ice" | "melee" | "none";

/** Selects the schematic plate drawn beneath a boss's mechanic text. */
export type MechanicDiagramId = "instability" | "matters" | "inversion" | "elliptical";

export interface QuantumMechanic {
  /** Matches the player-facing ability of the same name. */
  name: string;
  description: string;
  diagram: MechanicDiagramId;
}

export interface Weakness {
  type: WeaknessType;
  /** Always rendered as text beside the icon — the icon never carries it alone. */
  label: string;
}

interface BestiaryEntryBase {
  id: BestiaryId;
  name: string;
  tier: BestiaryTier;
  lore: string;
  /** Stained-glass wash + rule tint for this creature's arch. */
  accent: string;
}

export interface BossEntry extends BestiaryEntryBase {
  tier: "boss";
  /** 1-based order the player meets them in. */
  rank: number;
  /** Tier label on the card: "Boss I" … "Boss IV", or "Final" for the last. */
  rankLabel: string;
  isFinal: boolean;
  /** One line, set in italics under the name. Drawn from the lore below. */
  epithet: string;
  mechanic: QuantumMechanic;
}

export interface EnemyEntry extends BestiaryEntryBase {
  tier: "enemy";
  /** How it fights, in one line. */
  gameplay: string;
  weakness: Weakness;
}

export type BestiaryEntry = BossEntry | EnemyEntry;

/**
 * ENCOUNTER ORDER, AND IT IS THE NARRATIVE'S. Werewolf on the prologue island,
 * Wizard-Knight in the Woods, Centaur-Knight in the Misty Lands, Sun-Knight in
 * the Frozen Mountains — the order `narrativeActs` and `fullStory` set, the
 * beat chart plays and the world map indexes by place. `rank` and the array
 * position say the same thing twice, so they move together; nothing sorts by
 * `rank`, which means the array is what a reader actually sees.
 */
export const bestiaryBosses: readonly BossEntry[] = [
  {
    id: "werewolf",
    name: "The Werewolf",
    tier: "boss",
    rank: 1,
    rankLabel: "Boss I",
    isFinal: false,
    accent: "#8E2F3C",
    epithet: "Sent as a weapon, kept as a prisoner.",
    mechanic: {
      name: "Instability",
      description:
        "Throws an orb that changes speed and size on contact with anything in the environment.",
      diagram: "instability",
    },
    lore:
      "Sent by the Sun-Knight, captured and tortured. It tries to turn on the soldiers it came with.",
  },
  {
    id: "wizard-knight",
    name: "The Wizard-Knight",
    tier: "boss",
    rank: 2,
    rankLabel: "Boss II",
    isFinal: false,
    accent: "#6F5AA8",
    epithet: "Once a servant of the moon.",
    mechanic: {
      name: "Inversion",
      description:
        "An undodgeable area attack. The player must counter it with their own Instability attack — and he counters yours in turn.",
      diagram: "inversion",
    },
    lore: "Once a servant of the moon, he turned against it.",
  },
  {
    id: "centaur-knight",
    name: "The Centaur-Knight",
    tier: "boss",
    rank: 3,
    rankLabel: "Boss III",
    isFinal: false,
    accent: "#3B7A5E",
    epithet: "Hidden all his life, until alchemy made a place for him.",
    mechanic: {
      name: "Master of Matters",
      description: "Attacks using several states of matter.",
      diagram: "matters",
    },
    lore:
      "Hid all his life because of his appearance. He found acceptance in alchemy, and alchemy drew him to the Sun-Knight's side.",
  },
  {
    id: "sun-knight",
    name: "The Sun-Knight",
    tier: "boss",
    rank: 4,
    rankLabel: "Final",
    isFinal: true,
    accent: "#C9A961",
    epithet: "The Moon-Knight's partner, before the betrayal.",
    mechanic: {
      name: "Elliptical Force",
      description:
        "Throws two orbs — sun and moon — on elliptical arcs that collide on the player.",
      diagram: "elliptical",
    },
    lore:
      "Once the Moon-Knight's partner, he betrayed the moon. The last fight in the game: every soldier the player has cut down marched under his sigil.",
  },
];

export const bestiaryEnemies: readonly EnemyEntry[] = [
  {
    id: "soldiers",
    name: "Soldiers",
    tier: "enemy",
    accent: "#B8C4D4",
    gameplay:
      "Sword in the right hand, melee with the left. Their combat mirrors the Moon-Knight's, but they cannot dodge, jump or heal.",
    weakness: { type: "none", label: "No elemental weakness" },
    lore: "Fallen soldiers under the Sun-Knight's control.",
  },
  {
    id: "wooden-humanoids",
    name: "Wooden Humanoids",
    tier: "enemy",
    accent: "#8A6A3B",
    gameplay: "Camouflage as trees. Spear in melee, thrown splinters at range.",
    weakness: { type: "fire", label: "Fire" },
    lore: "Once soldiers, who rested here so long they became tree-like.",
  },
  {
    id: "amphibian-humanoids",
    name: "Amphibian Humanoids",
    tier: "enemy",
    accent: "#3B7A5E",
    gameplay: "Swamp-dwellers. Strong-arm melee, and a long tongue at range.",
    weakness: { type: "melee", label: "Cut the tongue mid-attack" },
    lore: "Once swamp people, who adapted to survive.",
  },
  {
    id: "banshees",
    name: "Banshees",
    tier: "enemy",
    accent: "#C9A961",
    gameplay:
      "Hide in the fog and lure with a beautiful song, then strike with claws. The fastest enemy in the game.",
    weakness: { type: "lightning", label: "Lightning" },
    lore: "Cursed royalty, turned monstrous.",
  },
  {
    id: "ghosts",
    name: "Ghosts",
    tier: "enemy",
    accent: "#E8E6DF",
    gameplay: "Invisible until you are very close. The fog moves oddly to warn you.",
    weakness: { type: "light", label: "Light" },
    lore: "Cursed royalty, turned monstrous.",
  },
  {
    id: "ice-knights",
    name: "Ice Knights & Wizards",
    tier: "enemy",
    accent: "#8FD4E8",
    gameplay:
      "Wizards strike at range and are weak to melee; knights close in with ice swords and are weak to ice.",
    weakness: { type: "ice", label: "Ice, or melee for the wizards" },
    lore: "Revived by star-seeking wizards to protect them.",
  },
];

/** Bosses first, in encounter order, then the common ranks. */
export const moonKnightBestiary: readonly BestiaryEntry[] = [
  ...bestiaryBosses,
  ...bestiaryEnemies,
];

/** Stage 2: resolve a map pin to its codex entry. */
export const bestiaryById: Readonly<Record<BestiaryId, BestiaryEntry>> = Object.fromEntries(
  moonKnightBestiary.map((e) => [e.id, e])
) as Record<BestiaryId, BestiaryEntry>;

/** DOM anchor for an entry's card, so the Stage-2 map can deep-link to it. */
export const bestiaryAnchor = (id: BestiaryId) => `bestiary-${id}`;

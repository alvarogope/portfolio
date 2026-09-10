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

export type WeaknessType = "fire" | "lightning" | "light" | "ice" | "melee" | "none";

export type MechanicDiagramId = "instability" | "matters" | "inversion" | "elliptical";

export interface QuantumMechanic {
  name: string;
  description: string;
  diagram: MechanicDiagramId;
}

export interface Weakness {
  type: WeaknessType;
  label: string;
}

interface BestiaryEntryBase {
  id: BestiaryId;
  name: string;
  tier: BestiaryTier;
  lore: string;
  accent: string;
}

export interface BossPlate {
  src: string;
  alt: string;
  caption: string;
}

export interface BossEntry extends BestiaryEntryBase {
  tier: "boss";
  rank: number;
  rankLabel: string;
  isFinal: boolean;
  epithet: string;
  mechanic: QuantumMechanic;
  plate?: BossPlate;
}

export interface EnemyEntry extends BestiaryEntryBase {
  tier: "enemy";
  gameplay: string;
  weakness: Weakness;
}

export type BestiaryEntry = BossEntry | EnemyEntry;

export const bestiaryBosses: readonly BossEntry[] = [
  {
    id: "werewolf",
    name: "The Werewolf",
    tier: "boss",
    rank: 1,
    rankLabel: "Boss I",
    isFinal: false,
    accent: "#8E2F3C",
    epithet: "The first big challenge.",
    mechanic: {
      name: "Instability",
      description:
        "Throws an orb that changes speed and size on contact with anything from the environment.",
      diagram: "instability",
    },
    lore:
      "It was sent by the Sun-Knight, captured and tortured. It turns on the soldiers it came to get you.",
    plate: {
      src: "/images/moon-knight/boss-werewolf.png",
      alt: "The Werewolf boss encounter at night: the knight facing the werewolf, with the named enemy health bar across the top of the screen.",
      caption:
        "The encounter as the player meets it. The named health bar is the one piece of conventional UI a boss fight is allowed — it marks the fight as an event.",
    },
  },
  {
    id: "wizard-knight",
    name: "The Wizard-Knight",
    tier: "boss",
    rank: 2,
    rankLabel: "Boss II",
    isFinal: false,
    accent: "#6F5AA8",
    epithet: "Once a servant of the Moon.",
    mechanic: {
      name: "Inversion",
      description:
        "An undodgeable attack. The player must parry it with the Instability ability. He can counters yours in return.",
      diagram: "inversion",
    },
    lore: "Once a servant of the moon, he turned against her.",
  },
  {
    id: "centaur-knight",
    name: "The Centaur-Knight",
    tier: "boss",
    rank: 3,
    rankLabel: "Boss III",
    isFinal: false,
    accent: "#3B7A5E",
    epithet: "Hidden all his life, until he found alchemy.",
    mechanic: {
      name: "Master of Matters",
      description: "Attacks using several states of matter.",
      diagram: "matters",
    },
    lore:
      "Hid all his life because of his appearance. He found strength in alchemy, and alchemy drew him to the Sun-Knight.",
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
        "Throws two orbs, a Sun and a Moon, on elliptical circles that collide on the player.",
      diagram: "elliptical",
    },
    lore:
      "Once the Moon-Knight's partner, he betrayed the Moon. The last fight in the game: every soldier the player has fight against followed him.",
  },
];

export const bestiaryEnemies: readonly EnemyEntry[] = [
  {
    id: "soldiers",
    name: "Soldiers",
    tier: "enemy",
    accent: "#B8C4D4",
    gameplay:
      "Equipped with a sword. The combat is similar to the player's. They cannot dodge, jump or heal.",
    weakness: { type: "none", label: "No elemental weakness" },
    lore: "Fallen soldiers following the Sun-Knight.",
  },
  {
    id: "wooden-humanoids",
    name: "Wooden Humanoids",
    tier: "enemy",
    accent: "#8A6A3B",
    gameplay: "Camouflage as trees. Spear in melee, thrown splinters at range.",
    weakness: { type: "fire", label: "Fire" },
    lore: "Once soldiers, who rested so long they became tree-like.",
  },
  {
    id: "amphibian-humanoids",
    name: "Amphibian Humanoids",
    tier: "enemy",
    accent: "#3B7A5E",
    gameplay: "Swamp dwellers. Strong-arm melee and a long tongue at range.",
    weakness: { type: "melee", label: "Cut the tongue mid-attack" },
    lore: "Once swamp people, who adapted to survive.",
  },
  {
    id: "banshees",
    name: "Banshees",
    tier: "enemy",
    accent: "#C9A961",
    gameplay:
      "They hide in the fog and sing a beautiful song to attrack you then strike with claws. The fastest enemy in the game.",
    weakness: { type: "lightning", label: "Lightning" },
    lore: "Cursed royalty, turned into monsters.",
  },
  {
    id: "ghosts",
    name: "Ghosts",
    tier: "enemy",
    accent: "#E8E6DF",
    gameplay: "Invisible until very close. The fog moves oddly to warn you.",
    weakness: { type: "light", label: "Light" },
    lore: "Cursed royalty, turned into monsters.",
  },
  {
    id: "ice-knights",
    name: "Ice Knights & Wizards",
    tier: "enemy",
    accent: "#8FD4E8",
    gameplay:
      "Wizards strike at range and are weak to melee. Knights attack with ice swords.",
    weakness: { type: "ice", label: "Ice, or melee for the wizards" },
    lore: "Revived by star-seeking wizards to protect them.",
  },
];

export const moonKnightBestiary: readonly BestiaryEntry[] = [
  ...bestiaryBosses,
  ...bestiaryEnemies,
];

export const bestiaryById: Readonly<Record<BestiaryId, BestiaryEntry>> = Object.fromEntries(
  moonKnightBestiary.map((e) => [e.id, e])
) as Record<BestiaryId, BestiaryEntry>;

export const bestiaryAnchor = (id: BestiaryId) => `bestiary-${id}`;
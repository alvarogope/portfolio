import {
  bestiaryAnchor,
  bestiaryById,
  type BestiaryEntry,
  type BestiaryId,
} from "./moon-knight-bestiary";
import { castHref, getCastMember, type CastId, type CastMember } from "./moon-knight-cast";
import { getBeatLevel, type BeatLevel, type LevelId } from "./moon-knight-levels";
import {
  getNarrativeAct,
  type NarrativeAct,
  type NarrativeActId,
} from "./moon-knight-narrative";

export type MarkerId =
  | "centralis"
  | "the-woods"
  | "misty-lands"
  | "frozen-mountains"
  | "first-fragment"
  | "second-fragment"
  | "third-fragment"
  | "old-gods-quests";

export type MarkerType = "area" | "fortress" | "dungeon";

export interface RegionProfile {
  cast?: readonly CastId[];
  enemies?: readonly BestiaryId[];
  boss?: BestiaryId;
  level?: LevelId;
  act?: NarrativeActId;
}

export interface MapMarker {
  id: MarkerId;
  label: string;
  type: MarkerType;
  xPct: number;
  yPct: number;
  lore: string;
  profile?: RegionProfile;
}

export const markerTypeMeta: Record<MarkerType, { term: string; gloss: string }> = {
  area: {
    term: "Land",
    gloss:
      "Centralis, the lake island where the journey begins, and the three great levels. " +
      "Each area covers one act in the narrative, they are listed in the order they are played.",
  },
  fortress: {
    term: "Fortress · Moon Fragments",
    gloss:
      "The Fortresses stand on high ground, visible at all points in the level. Lots of enemies await inside. " + 
      "There is a moon fragment in every single one of them, guarded by a boss that defends it.",
  },
  dungeon: {
    term: "Dungeon · Old Gods Quest",
    gloss:
      "The Dungeons are underground and they are guarded by enemies that were never human. " +
      "They are well-hidden and difficult to access. Here is where the Power of the Gods abilities are gained. ",
  },
};

export const mapMarkers: readonly MapMarker[] = [
  /* ---- the island and the three great lands, in progression order ---- */
  {
    id: "centralis",
    label: "Centralis",
    type: "area",
    xPct: 49.3,
    yPct: 43.3,
    lore:
      "Where the game starts. The Moon-Knight wakes up from a coma here. The land is covered in dark trees " +
      "and surrounded by water. The NPC Death is waiting here. " + 
      "This section is the tutorial and leads to The Woods when completed.",
    profile: {
      cast: ["death"],
      enemies: ["soldiers"],
      boss: "werewolf",
      level: "tutorial",
    },
  },
  {
    id: "the-woods",
    label: "The Woods",
    type: "area",
    xPct: 32,
    yPct: 83.3,
    lore:
      "Area filled with swamps and ruins covered by nature. There are wooden and amphibian humanoids as potential threats. " +
      "The player will encounter The Witch and she will tell you about the Power of the Gods.",
    profile: {
      cast: ["witch", "orpheus"],
      enemies: ["wooden-humanoids", "amphibian-humanoids"],
      boss: "wizard-knight",
      level: "woods",
      act: "waking",
    },
  },
  {
    id: "misty-lands",
    label: "The Misty Lands",
    type: "area",
    xPct: 78,
    yPct: 73.3,
    lore:
      "If there was life in this place, it was a long time ago. " +
      "Once the capital of Kaelum, now its citizens are transformed into ghosts and banshees that hide in the fog. " +
      "A tiny village survives, where The Druid asks for help. The most melancholic and dark land.",
    profile: {
      cast: ["druid"],
      enemies: ["banshees", "ghosts"],
      boss: "centaur-knight",
      level: "misty-lands",
      act: "gathering",
    },
  },
  {
    id: "frozen-mountains",
    label: "The Frozen Mountains",
    type: "area",
    xPct: 32,
    yPct: 18,
    lore:
      "This area is filled with snow and rock. Ruins of an ancient star-seeker society, now occupied by wizards and " +
      "soldiers. The final ascent towards the end of the world.",
    profile: {
      cast: ["witch", "druid", "death"],
      enemies: ["ice-knights", "soldiers"],
      boss: "sun-knight",
      level: "frozen-mountains",
      act: "ascent",
    },
  },

  /* ---- the three torches: one Moon Fragment each ---- */
  {
    id: "first-fragment",
    label: "1st Fragment",
    type: "fortress",
    xPct: 7.6,
    yPct: 83.2,
    lore: "A fortress on top of a mountain in The Woods. Inside: soldiers, the Crescent Moon Fragment, and The Wizard waiting for you.",
    profile: { enemies: ["soldiers"], boss: "wizard-knight", level: "woods", act: "waking" },
  },
  {
    id: "second-fragment",
    label: "2nd Fragment",
    type: "fortress",
    xPct: 92.8,
    yPct: 7,
    lore: "The second fortress, at the far north-east reach of the map. The Waxing Gibbous Moon Fragment guarded by The Centaur.",
    profile: {
      enemies: ["soldiers"],
      boss: "centaur-knight",
      level: "misty-lands",
      act: "gathering",
    },
  },
  {
    id: "third-fragment",
    label: "3rd Fragment",
    type: "fortress",
    xPct: 25.8,
    yPct: 25,
    lore: "The final fortress, high in the Frozen Mountains, at the end of the world. The Full Moon Fragment and The Sun-Knight.",
    profile: {
      enemies: ["soldiers", "ice-knights"],
      boss: "sun-knight",
      level: "frozen-mountains",
      act: "ascent",
    },
  },

  /* ---- the roses: one marker stands for the Old Gods quests ---- */
  {
    id: "old-gods-quests",
    label: "Old Gods Quests",
    type: "dungeon",
    xPct: 69.9,
    yPct: 38.5,
    lore:
      "These are Dungeons, underground, barely lit, guarded by non-human creatures. Hidden and hard to access. " +
      "Here the player collects the Power of the Gods by defeating enemies.",
    profile: { cast: ["witch"] },
  },
];

const byId = new Map(mapMarkers.map((m) => [m.id, m]));

export function getMarker(id: MarkerId): MapMarker {
  const marker = byId.get(id);
  if (!marker) throw new Error(`Unknown Kaelum map marker: ${id}`);
  return marker;
}

export interface RegionRef<T> {
  entry: T;
  href: string;
}

export interface ResolvedRegion {
  cast: readonly RegionRef<CastMember>[];
  enemies: readonly RegionRef<BestiaryEntry>[];
  boss: RegionRef<BestiaryEntry> | null;
  level: BeatLevel | null;
  act: NarrativeAct | null;
  isEmpty: boolean;
}

export function resolveRegion(id: MarkerId): ResolvedRegion | null {
  const { profile } = getMarker(id);
  if (!profile) return null;

  const cast = (profile.cast ?? []).map((castId) => ({
    entry: getCastMember(castId),
    href: castHref(castId),
  }));
  const enemies = (profile.enemies ?? []).map((beastId) => ({
    entry: bestiaryById[beastId],
    href: `#${bestiaryAnchor(beastId)}`,
  }));
  const boss = profile.boss
    ? { entry: bestiaryById[profile.boss], href: `#${bestiaryAnchor(profile.boss)}` }
    : null;
  const level = profile.level ? getBeatLevel(profile.level) : null;
  const act = profile.act ? getNarrativeAct(profile.act) : null;

  return {
    cast,
    enemies,
    boss,
    level,
    act,
    isEmpty: cast.length === 0 && enemies.length === 0 && !boss && !level && !act,
  };
}

export const regionProfileLabels = {
  cast: "NPC",
  guards: "Enemies",
  plan: "Level",
  boss: "Boss",
} as const;

export const planLinkSuffix = "open the design sheet";

export const regionProfilePointer =
  "Every name here is a link. Creature names open their bestiary entry above, character names " +
  "open their card on the deep dive, and the level a place is played as opens its own design " +
  "sheet on the chart below.";

export const mapAlt =
  "Hand-drawn map of Kaelum: the Frozen Mountains in grey across the north, The Woods in green to " +
  "the south-west, the small green island of Centralis at the centre with a boat beside it, and the " +
  "fog-grey Misty Lands filling the east, all surrounded by sea. Three torches mark the fortresses " +
  "holding the Moon Fragments, and roses mark the Old Gods quests.";
/**
 * Moon-Knight — the world of Kaelum, as marked on the hand-drawn map.
 *
 * Every marker is placed in PERCENTAGES of the map image, not pixels, so the
 * whole set stays registered to the art at any size the map is rendered at.
 * `xPct` runs 0 (left edge) to 100 (right edge), `yPct` 0 (top) to 100
 * (bottom), and both address the CENTRE of the marker.
 *
 * TUNING THE COORDINATES: the numbers below were read off the art at
 * 2048 x 1536. To convert a pixel position from the source image, divide by
 * those and multiply by 100 — x_pct = px / 2048 * 100, y_pct = py / 1536 * 100.
 * Nothing else in the component needs to change when a marker moves; the
 * popover even re-picks which way it opens from the new coordinates.
 *
 * Order matters: the list is the progression order of the game, and it is also
 * the tab order through the markers and the order of the location list under
 * the map.
 *
 * THE MAP IS THE SPATIAL INDEX OF THE WHOLE GAME, and this file is where that
 * index lives. A marker carries its lore and then a PROFILE that is nothing
 * but ids: who is here (`cast`), what guards it (`enemies`, `boss`), and when
 * in the story it comes (`level`, `act`). `resolveRegion` turns those ids into
 * the real entries from the bestiary, the cast, the beat chart and the
 * narrative arc, with the anchors to link to them.
 *
 * NOTHING IS COPIED. A profile holds no names, no descriptions and no numbers
 * — only keys — so the bestiary stays the only place a creature is designed,
 * the cast the only place a character is written, and the beat chart the only
 * place a level is planned. The map answers WHAT IS WHERE and hands the reader
 * to the section that answers everything else. Rename the Witch and the map
 * follows; describe her twice and it cannot.
 *
 * THE BESTIARY ASKED FOR THIS. `moon-knight-bestiary.ts` reserves a
 * `mapRegion` tie and says explicitly that it should be kept out of the codex
 * "so region data can be added without touching it". This is that tie, built
 * from the map's side: the marker names the creatures, not the other way
 * round, and the codex never learns about geography.
 */

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

/**
 * What kind of place this is, which picks the sigil and its colour:
 * - `area`     — one of the four locations: Centralis, the prologue island,
 *                and the three great lands that are the three acts. Silver diamond.
 * - `fortress` — a torch on the map: a Moon Fragment and the boss holding it. Gold flame.
 * - `dungeon`  — a rose on the map: an Old Gods quest, underground. Scarlet rosette.
 */
export type MarkerType = "area" | "fortress" | "dungeon";

/**
 * What is at a place, written as KEYS ONLY. Every field is an id into another
 * content file, and `resolveRegion` is what turns them into entries. If you
 * find yourself wanting to write a sentence in here, it belongs in the section
 * that owns the thing you are describing.
 *
 * All four fields are optional because the markers are not all the same kind
 * of place: a fortress has a boss and no residents, the dungeons have a patron
 * and no act, and the prologue island has a level but no fragment to fetch.
 */
export interface RegionProfile {
  /** Who you meet here. Ids into `moon-knight-cast`. */
  cast?: readonly CastId[];
  /** What fights you here. Ids into `moon-knight-bestiary`. */
  enemies?: readonly BestiaryId[];
  /** What holds the ground at the end of it. One id into the same bestiary. */
  boss?: BestiaryId;
  /** The beat-chart level this place is played as. Gives the moon phase. */
  level?: LevelId;
  /** The act of the arc this place belongs to. Gives the fragment. */
  act?: NarrativeActId;
}

export interface MapMarker {
  id: MarkerId;
  /** Name as it reads on the map and in the location list. */
  label: string;
  type: MarkerType;
  /** Centre of the marker, as a percentage of the map's width. */
  xPct: number;
  /** Centre of the marker, as a percentage of the map's height. */
  yPct: number;
  /** The lore the marker reveals. */
  lore: string;
  /** Who is here, what guards it, and when it comes. Keys, never copy. */
  profile?: RegionProfile;
}

/** What each kind of place is, in general — the line above the specific lore. */
export const markerTypeMeta: Record<MarkerType, { term: string; gloss: string }> = {
  area: {
    term: "Land",
    gloss:
      "Centralis, the lake island the journey begins on — the prologue — and the three great lands " +
      "it leads to, one per act, listed in the order they are played.",
  },
  fortress: {
    term: "Fortress · Moon Fragment",
    gloss:
      "Fortresses stand on high ground, visible from anywhere in the level. Human and monster " +
      "soldiers wait inside as if they were expecting you. Each holds a Moon Fragment and ends in a boss.",
  },
  dungeon: {
    term: "Dungeon · Old Gods Quest",
    gloss:
      "Dungeons are underground, barely lit, and guarded by things that were never human. Hidden " +
      "and hard to reach — and where the powers of the Ancient Gods are collected.",
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
      "Where the Moon-Knight wakes from a coma of unknown length. A dark forest on a lake island, " +
      "its statues deliberately toppled. Death waits here. The prologue: the journey begins on the " +
      "island, but the first act begins in The Woods.",
    /* No act, and that is the point: the waking happens here, but Act I's
       land is the Woods and its fragment is there. The island is the PROLOGUE
       — a level before the arc starts — which is why the beat chart counts
       four locations where the narrative counts three acts. Its level carries
       `stageLabel: "Prologue"`, so the popover says so rather than going
       blank where the other markers name an act. */
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
      "Dark and swampy, nature reclaiming ruined buildings. Wooden and amphibian humanoids. The " +
      "Witch's first haunt, where the player learns the powers of the old gods.",
    /* Orpheus is here too, which is the sort of thing only a spatial index
       catches: the beat chart lists the Witch as this level's cast, and the
       cast file places Orpheus in the Woods village. Both are true, and the
       map is the first place they are read together. */
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
      "Where Kaelum's great cities once stood. Now fog, banshees, and the ghosts of the people who " +
      "lived here. A tiny village survives under the Druid, who asks for help. The most melancholic land.",
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
      "Snow and rock, no life. Ruins of an ancient star-seeker society, now held by wizards and " +
      "soldiers. The final ascent.",
    /* All three of them, and that is the level's whole argument: the Witch,
       the Druid and Death want the same loyalty and only one gets it. */
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
    lore: "A fortress on high ground in The Woods. Inside: soldiers waiting, a Moon Fragment, and a boss. One of three.",
    /* No cast: the NPCs live in the lands, not inside the fortresses. */
    profile: { enemies: ["soldiers"], boss: "wizard-knight", level: "woods", act: "waking" },
  },
  {
    id: "second-fragment",
    label: "2nd Fragment",
    type: "fortress",
    xPct: 92.8,
    yPct: 7,
    lore: "The second fortress, at the far north-east reach of the map. A Moon Fragment guarded by a boss.",
    /* The Misty Lands fortress — the one the Druid reveals, and the one where
       the siege takes the Moon-Knight alive. */
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
    lore: "The final fortress, high in the Frozen Mountains. The last Moon Fragment and its boss.",
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
      "Dungeons: underground, barely lit, guarded by non-human creatures. Hidden and hard to reach. " +
      "Here the player collects the Ancient Gods' Powers.",
    /* No enemies listed, and that is honest rather than lazy: the things down
       here "were never human" and the codex does not have entries for them.
       An invented tag would be worse than the gap. No act either — the
       dungeons sit beside the arc rather than in it. */
    profile: { cast: ["witch"] },
  },
];

const byId = new Map(mapMarkers.map((m) => [m.id, m]));

export function getMarker(id: MarkerId): MapMarker {
  const marker = byId.get(id);
  if (!marker) throw new Error(`Unknown Kaelum map marker: ${id}`);
  return marker;
}

/* ---- resolving a region -------------------------------------------------
   Ids in, entries out. This is the only place the map reaches into the other
   four content files, and it reaches for whole entries rather than for fields:
   the component prints a name and an href and nothing else, so a creature's
   design, a character's purpose and a level's plan are never in a position to
   be half-copied here. */

/** One resolved reference: the entry itself, and where its card lives. */
export interface RegionRef<T> {
  /**
   * Link to that entry's card. NOT always a bare fragment: the bestiary is
   * still on the main page beside this map, so creature links stay
   * `#bestiary-<id>`, but the cast moved to the deep-dive subpage, so
   * character links are full paths (`/moon-knight/world#cast-witch`) built by
   * `castHref`. Mixing the two is correct and deliberate — each link points at
   * wherever its card actually renders.
   */
  entry: T;
  href: string;
}

export interface ResolvedRegion {
  cast: readonly RegionRef<CastMember>[];
  enemies: readonly RegionRef<BestiaryEntry>[];
  boss: RegionRef<BestiaryEntry> | null;
  level: BeatLevel | null;
  act: NarrativeAct | null;
  /** True when there is nothing to show — the component skips the block. */
  isEmpty: boolean;
}

/**
 * A marker's profile, with every id turned into the entry it points at.
 * Returns `null` for a marker that carries no profile at all, so the caller
 * can render the lore alone rather than an empty frame.
 */
export function resolveRegion(id: MarkerId): ResolvedRegion | null {
  const { profile } = getMarker(id);
  if (!profile) return null;

  /* Cross-page on purpose — the cast renders on `/moon-knight/world` while
     this map renders on `/moon-knight`. See `castHref`. */
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

/** Row labels for the profile. Here rather than in the component, with the copy. */
export const regionProfileLabels = {
  cast: "Who is here",
  guards: "What guards it",
  /**
   * The hand-off row, and the reason there is no `objective` any more.
   *
   * The map and the beat chart are one section now, half a screen apart, and
   * they were both printing the level's objective — the chart from
   * `cells.objective`, the map from `act.fragment`. A place's OBJECTIVE is a
   * plan fact and the chart owns it. What the map owes the reader instead is
   * the pointer: this place is played as that level, and here is its sheet.
   */
  plan: "Played as",
  boss: "Boss",
} as const;

/** The label on the hand-off link into the beat chart's own rail. */
export const planLinkSuffix = "open its design sheet";

/**
 * The hand-off, printed once under the profile. The map says what is where;
 * every name in it is a link to the section that says what it IS.
 */
export const regionProfilePointer =
  "Every name here is a link. Creature names open their bestiary entry above, character names " +
  "open their card on the deep dive, and the level a place is played as opens its own design " +
  "sheet on the chart below.";

/** The map's own description, for readers who never see the image. */
export const mapAlt =
  "Hand-drawn map of Kaelum: the Frozen Mountains in grey across the north, The Woods in green to " +
  "the south-west, the small green island of Centralis at the centre with a boat beside it, and the " +
  "fog-grey Misty Lands filling the east, all surrounded by sea. Three torches mark the fortresses " +
  "holding the Moon Fragments, and roses mark the Old Gods quests.";

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
 */

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
 * - `area`     — one of the four lands. Silver diamond.
 * - `fortress` — a torch on the map: a Moon Fragment and the boss holding it. Gold flame.
 * - `dungeon`  — a rose on the map: an Old Gods quest, underground. Scarlet rosette.
 */
export type MarkerType = "area" | "fortress" | "dungeon";

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
}

/** What each kind of place is, in general — the line above the specific lore. */
export const markerTypeMeta: Record<MarkerType, { term: string; gloss: string }> = {
  area: {
    term: "Land",
    gloss: "One of the four lands of Kaelum, in the order the journey takes them.",
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
  /* ---- the four lands, in progression order ---- */
  {
    id: "centralis",
    label: "Centralis",
    type: "area",
    xPct: 49.3,
    yPct: 43.3,
    lore:
      "Where the Moon-Knight wakes from a coma of unknown length. A dark forest on a lake island, " +
      "its statues deliberately toppled. Death waits here. The journey begins.",
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
  },

  /* ---- the three torches: one Moon Fragment each ---- */
  {
    id: "first-fragment",
    label: "1st Fragment",
    type: "fortress",
    xPct: 7.6,
    yPct: 83.2,
    lore: "A fortress on high ground in The Woods. Inside: soldiers waiting, a Moon Fragment, and a boss. One of three.",
  },
  {
    id: "second-fragment",
    label: "2nd Fragment",
    type: "fortress",
    xPct: 92.8,
    yPct: 7,
    lore: "The second fortress, at the far north-east reach of the map. A Moon Fragment guarded by a boss.",
  },
  {
    id: "third-fragment",
    label: "3rd Fragment",
    type: "fortress",
    xPct: 25.8,
    yPct: 25,
    lore: "The final fortress, high in the Frozen Mountains. The last Moon Fragment and its boss.",
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
  },
];

const byId = new Map(mapMarkers.map((m) => [m.id, m]));

export function getMarker(id: MarkerId): MapMarker {
  const marker = byId.get(id);
  if (!marker) throw new Error(`Unknown Kaelum map marker: ${id}`);
  return marker;
}

/** The map's own description, for readers who never see the image. */
export const mapAlt =
  "Hand-drawn map of Kaelum: the Frozen Mountains in grey across the north, The Woods in green to " +
  "the south-west, the small green island of Centralis at the centre with a boat beside it, and the " +
  "fog-grey Misty Lands filling the east, all surrounded by sea. Three torches mark the fortresses " +
  "holding the Moon Fragments, and roses mark the Old Gods quests.";

/**
 * Moon-Knight — where the deep-dive subpage lives, and what its anchors are.
 *
 * WHY THIS FILE EXISTS. The main page was condensed and the enthusiast-depth
 * material — the story, the cast, the symbolism, the full craft arguments and
 * the expansions — moved to `/moon-knight/world`. That move turned four
 * previously same-page fragment links into CROSS-PAGE links, and a wrong
 * cross-page fragment fails silently: the browser navigates, finds no such id,
 * and simply does not scroll. Nothing throws, nothing logs, and the reader has
 * no idea they were meant to land somewhere.
 *
 * So the route and every anchor on it are declared ONCE, here, and every link
 * into the subpage is built from these constants rather than typed. The
 * subpage renders its section ids from the same object, which means a rename
 * moves the link and the target together or fails to compile.
 *
 * THIS FILE OWNS NO COPY. It is addresses only — no titles, no prose. The
 * sections it points at are still the only places their ideas are explained,
 * exactly as the section-ownership map requires.
 */

/** The deep-dive subpage. Sibling of `/moon-knight/engineering`. */
export const deepDivePath = "/moon-knight/world";

/**
 * Every section id on the subpage. The keys are stable; the values are the
 * DOM ids, so `deepDiveAnchors.score` and `id={deepDiveAnchors.score}` cannot
 * drift apart.
 */
export const deepDiveAnchors = {
  narrative: "narrative-design",
  cast: "the-cast",
  motifs: "symbolism-and-motifs",
  diegetic: "diegetic-design",
  art: "art-direction",
  score: "score-and-audio",
  jousting: "the-jousting-minigame",
  expansions: "where-the-world-goes-next",
} as const;

export type DeepDiveAnchor = keyof typeof deepDiveAnchors;

/** A link into one section of the subpage, from anywhere on the site. */
export const deepDiveHref = (anchor: DeepDiveAnchor) =>
  `${deepDivePath}#${deepDiveAnchors[anchor]}`;

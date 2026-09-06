/**
 * Shattered Skies — where the deep-dive subpage lives, and what its anchors are.
 *
 * WHY THIS FILE EXISTS. The main page ran to ~8,100 rendered words across nine
 * blocks — ten times the reading-load audit's benchmark — with the first frame
 * of actual gameplay at 58% depth. It was split the same way Moon-Knight was:
 * the built, working game stays on `/shattered-skies`, and the enthusiast depth
 * — the full story, the world's soul, and the design reasoning behind every
 * system — moved to `/shattered-skies/world`.
 *
 * That move turns same-page pointers into CROSS-PAGE links, and a wrong
 * cross-page fragment fails SILENTLY: the browser navigates, finds no such id,
 * and simply does not scroll. Nothing throws, nothing logs, and the reader has
 * no idea they were meant to land somewhere.
 *
 * So the route and every anchor on it are declared ONCE, here, and every link
 * into the subpage is built from these constants rather than typed. The subpage
 * renders its section ids from the same object, which means a rename moves the
 * link and the target together or fails to compile.
 *
 * THE SAME PROBLEM RUNS THE OTHER WAY. Two pointers on the subpage refer back
 * to sections that stayed on the main page — the knowledge-gating rule, which
 * belongs to the orrery, and the three repair minigames' condensed home. Those
 * are `mainAnchors` / `mainHref` below, and they exist for exactly the same
 * reason: on the main page they are same-page fragments, on the subpage they
 * are cross-page links, and the component that renders both must not have to
 * know which page it is on. It asks for an href and gets a correct one.
 *
 * THIS FILE OWNS NO COPY. It is addresses only — no titles, no prose. The
 * sections it points at are still the only places their ideas are explained,
 * exactly as the section-ownership map requires.
 */

/** The main project page. */
export const mainPath = "/shattered-skies";

/** The deep-dive subpage. Sibling route, so it inherits `../layout.tsx`. */
export const deepDivePath = "/shattered-skies/world";

/**
 * Every section id on the SUBPAGE. Keys are stable; values are the DOM ids, so
 * `deepDiveAnchors.repairs` and `id={deepDiveAnchors.repairs}` cannot drift.
 */
export const deepDiveAnchors = {
  story: "the-story",
  world: "the-world-of-shatterstorm",
  language: "a-language-that-will-not-carry",
  ship: "the-ship-and-the-body",
  repairs: "the-three-repairs",
  pattern: "the-planetside-pattern",
  document: "the-design-document",
} as const;

export type DeepDiveAnchor = keyof typeof deepDiveAnchors;

/**
 * Every section id on the MAIN page that anything links TO. Not a list of the
 * page's sections — only the ones that are the target of a pointer, which is
 * what makes it worth centralising.
 */
export const mainAnchors = {
  inMotion: "in-motion",
  theGame: "the-game",
  worlds: "the-worlds",
  levels: "planetary-level-design",
  mechanics: "core-mechanics",
  coop: "coop-design",
} as const;

export type MainAnchor = keyof typeof mainAnchors;

/** A link into one section of the subpage, from anywhere on the site. */
export const deepDiveHref = (anchor: DeepDiveAnchor) =>
  `${deepDivePath}#${deepDiveAnchors[anchor]}`;

/**
 * A link into one section of the MAIN page.
 *
 * `from` is what makes this safe to call from a shared component: on the main
 * page the same target must stay a bare fragment (so it does not reload the
 * page the reader is already on), and from the subpage it must carry the path.
 * The component passes its own location and stops having to care.
 */
export const mainHref = (anchor: MainAnchor, from: "main" | "deep" = "main") =>
  from === "main" ? `#${mainAnchors[anchor]}` : `${mainPath}#${mainAnchors[anchor]}`;

/**
 * Which page a shared component is rendering on.
 *
 * The four Shattered Skies components that appear on both pages take this as a
 * prop. `main` renders the owner's exported KEYS — the labels, the diagrams,
 * one line each — and `deep` renders the full copy. Keys, not copy: there is
 * exactly one literal for every sentence, and the variant decides whether it is
 * shown, never what it says.
 */
export type SsVariant = "main" | "deep";

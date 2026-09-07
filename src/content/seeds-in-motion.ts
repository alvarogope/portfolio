/**
 * Seeds of Tomorrow — the game running, said early.
 *
 * WHY THIS SECTION EXISTS. The fourth and last application of the pattern
 * Moon-Knight, Shattered Skies and Break-In already carry. Seeds is the
 * shortest page on the site and was never buried the way the other three were,
 * but it had the same shape problem in miniature: TWO pieces of non-game
 * artwork — a charcoal concept sketch and a painted key-art seed — stood
 * between the reader and any evidence that the game exists. A recruiter giving
 * this page a minute met a drawing, a painting and eleven track titles before
 * one frame of Unity.
 *
 * WHAT MOVED, AND WHY THE DIPTYCH LEADS. The before/after pair is the strongest
 * single argument on this page and it was sitting at roughly 60% depth, inside
 * the weather section, as an illustration of a system the reader had not been
 * given a reason to care about yet. It is now the first thing after the
 * overview, at full width, because it needs no setup: two photographs of one
 * plot of ground answer "what is this game for" faster than any sentence here
 * could. The weather section keeps the MECHANISM — the flip, the trigger, the
 * five skies — which is what it always owned.
 *
 * THE CHARCOAL SKETCH MOVED THE OTHER WAY, down to the weather section, where
 * it is the premise the restoration system exists to undo. It is a better
 * pairing than it had at the top, and it stops the page opening on concept art.
 *
 * THE RULE THIS BAND KEEPS, unchanged from the other three pages: a caption
 * says what the ASSET shows and what it took. It never re-argues the section it
 * touches. The diptych does not explain the flip; the blossom clip does not
 * explain the trigger. Both are one scroll from the diagram that owns them.
 *
 * SILENT BY DESIGN. Every clip is muted and loops; `LoopingVideo` refuses to
 * autoplay under `prefers-reduced-motion` and offers controls instead.
 */

export interface MotionItem {
  /** Path under /public. Omitted when this item is a still. */
  video?: string;
  /** Path under /public for a still. Empty string when this item is a clip. */
  src: string;
  /** Accessible name. Describe what it shows, as alt text would. */
  alt: string;
  /** Small mono eyebrow. Two or three words. */
  label: string;
  /** What it shows, and what it took. Never an argument made elsewhere. */
  caption: string;
}

export const inMotionIntro = {
  kicker: "02 · In Motion",
  title: "The Game, Running",
  body: "The same plot of ground, twice, and three captures from the Unity build.",
} as const;

/**
 * The diptych, kept separate from the grid below so it can run at full width.
 * Same camera, same crop, same road — only the player's work is different, and
 * that only reads if the two frames are big enough to compare.
 */
export const beforeAfter: readonly MotionItem[] = [
  {
    src: "/images/seeds-of-tomorrow/restoration-before.jpg",
    label: "Before",
    alt: "The valley level before restoration: bare sand, dead rock formations, wrecked vehicles and shipping containers scattered along the road.",
    caption: "Before. Bare sand, dead rock, and the wreckage still where it fell.",
  },
  {
    src: "/images/seeds-of-tomorrow/restoration-after.jpg",
    label: "After",
    alt: "The same valley after restoration, from the same camera position: the ground green and planted with autumn forest, the same road running through it.",
    caption:
      "After. The same ground, the same road, the same camera — photographed again once the player had finished with it.",
  },
];

export const inMotionItems: readonly MotionItem[] = [
  {
    video: "/images/seeds-of-tomorrow/combat.mp4",
    src: "",
    label: "The fight",
    alt: "Gameplay of combat in Seeds of Tomorrow: the player engaging corrupted enemies inside one of the marked arenas.",
    caption:
      "Corrupted enemies, fought inside a marked arena. This is the half of a level that has to be finished before any of the mending can start.",
  },
  {
    video: "/images/seeds-of-tomorrow/blossom.mp4",
    src: "",
    label: "The turn",
    alt: "Dead ground blossoming: vegetation spreading outward from a planted seed and colour returning to the terrain.",
    caption:
      "The second in which the pair above happens — vegetation spreading out from the point the player planted.",
  },
  {
    src: "/images/seeds-of-tomorrow/Gameplay_Screenshot_3.png",
    label: "What comes back",
    alt: "The restored world in play: deer, a dog, a raccoon and other animals grazing on green ground among autumn trees and mushrooms, with the traveller's saucer parked on the road.",
    caption:
      "Further on, in a place already finished. Animals are back on the ground, and the traveller's craft is parked on the road he came to change.",
  },
];

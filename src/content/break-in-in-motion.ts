/**
 * Break-In — the game running, said early.
 *
 * WHY THIS SECTION EXISTS. Same finding as Moon-Knight and Shattered Skies, and
 * the same fix. The reading-load audit put the first frame of Break-In actually
 * running inside the role-graph section, roughly 1,300 words deep, buried in
 * the argument it was evidence for. This page has only two clips in the whole
 * project, so a reader giving it a minute met neither. The clip was promoted
 * rather than absorbed: proof before prose, at about 160 rendered words instead
 * of 1,300 — the shallowest first frame of gameplay on the site, ahead of
 * Shattered Skies at 169 and Moon-Knight at 374.
 *
 * WHAT MOVED HERE AND WHAT DID NOT.
 *
 *   · `distraction_test.mp4` MOVED UP from §05 · Signature Systems. A guard
 *     walking off a patrol route is the game running; it is not a dependency
 *     graph, and §05 has a nine-wire diagram that argues the point far better
 *     than four seconds of footage can. §05 now points at this band in one
 *     clause rather than carrying a second copy of the clip.
 *
 *   · `hacker_vision.mp4` deliberately did NOT move. Five seconds of seeing
 *     through walls and thirty of not is a DURATION, and it is the evidence for
 *     the detection section specifically — the map's Absorb #11 puts the duty
 *     cycle there on purpose. One clip, one place: this band leaves it alone.
 *
 *   · The two stills are newly placed. Neither is any section's evidence:
 *     `Reception_Lobby_2` is the room every run starts in and `Laser_security`
 *     is the hazard that ends the most of them, and until now nothing on the
 *     page showed either of them built. The floor plans in §06 are drawings of
 *     this place; these are photographs of it.
 *
 * THE RULE THIS BAND KEEPS, inherited unchanged from the other two pages: a
 * caption says what the ASSET shows and what it took. It never re-argues the
 * section it touches. The clip does not explain the dependency web, the lasers
 * do not explain the trap bus. Both are one scroll away and own themselves.
 *
 * SILENT BY DESIGN. The clip is muted and loops; `LoopingVideo` refuses to
 * autoplay it under `prefers-reduced-motion` and offers controls instead.
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
  title: "The Heist, Running",
  /**
   * One sentence. This band's job is to get out of the way of the footage.
   */
  body: "One clip and two rooms from the Unity build, before any of the design argument below.",
} as const;

export const inMotionItems: readonly MotionItem[] = [
  {
    video: "/images/break-in/distraction_test.mp4",
    src: "",
    label: "Distraction",
    alt: "The Hacker's Distraction ability overloading a bank light, and a patrolling guard leaving his route to deal with it.",
    caption:
      "A light overloads and the guard walks off his patrol to deal with it.",
  },
  {
    src: "/images/break-in/Reception_Lobby_2.png",
    label: "Where a run starts",
    alt: "In-engine view of the bank lobby: three ATMs along the back wall, waiting seating, low tables, and the walk-through security gate that leads to the rest of the building.",
    caption:
      "The lobby, in engine. Four players spawn into this building in four different places, and this is the public half of it — ATMs, waiting seats, and the walk-through gate everyone but the Insider has to route around.",
  },
  {
    src: "/images/break-in/Laser_security.png",
    label: "The basement approach",
    alt: "In-engine view of the basement corridor with the laser grid switched on: a dozen green beams crossing the passage at waist and chest height, and a wall keypad beside them.",
    caption:
      "The laser grid on the basement approach, drawn visible for this capture. In a run it is invisible until something reveals it, and the corridor looks like an empty corridor.",
  },
];

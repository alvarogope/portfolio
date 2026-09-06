/**
 * Shattered Skies — the game running, said early.
 *
 * WHY THIS SECTION EXISTS. The reading-load audit measured the first frame of
 * actual gameplay on this page at 4,700 words deep — 58% — behind key art, a
 * design document, a title screen and an empty hub. Every asset that showed the
 * game being PLAYED was buried inside the argument it was evidence for, which
 * meant a reader giving the page a minute saw a lot of prose about a game and
 * nothing of the game.
 *
 * So the clips were promoted rather than absorbed, exactly as Moon-Knight's
 * `In Motion` band was: proof before prose, at ~120 words instead of ~4,700.
 *
 * WHAT MOVED HERE AND WHAT DID NOT. `menu.mp4` and `ship.mp4` moved UP from the
 * narrative and co-op sections — a title screen is not narrative design and a
 * ship in flight is not a repair minigame, and both were sitting in sections
 * that had a better picture to show. `…-spaceship-interior.png` is newly placed:
 * it is the only asset that shows the distributed stations the ship's whole
 * argument rests on, and that argument was previously illustrated by an
 * EXTERIOR shot and a schematic.
 *
 * `…-gameplay-ui.png` deliberately did NOT move. It shows the Conversation
 * Panel sitting in the HUD next to the objective and the weapon slot, which is
 * the evidence for the communication section specifically. One shot, one place:
 * this band points at it rather than copying it.
 *
 * THE RULE THIS BAND KEEPS. A caption here says what the CLIP shows and what it
 * cost to build. It never re-argues the section it touches — the ship clip does
 * not explain the station split, the interior still does not explain the repair
 * minigames. Those are one scroll away and they own themselves.
 *
 * SILENT BY DESIGN. Every clip is muted and loops; `LoopingVideo` refuses to
 * autoplay under `prefers-reduced-motion` and offers controls instead.
 */

export interface MotionItem {
  /** Path under /public. Empty string when this item is a still. */
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
  /**
   * One sentence. This band's job is to get out of the way of the footage —
   * the whole point of promoting it was that a reader gets proof before prose.
   */
  body:
    "Three captures from the build, before any of the design argument below. Everything on this " +
    "page was designed for a game that runs.",
} as const;

export const inMotionItems: readonly MotionItem[] = [
  {
    video: "/images/shattered-skies/menu.mp4",
    src: "",
    label: "The front door",
    alt: "The Shattered Skies title screen and menu, running in the build the module was demoed from.",
    caption:
      "How the game introduces itself — the title screen the module was demoed from.",
  },
  {
    video: "/images/shattered-skies/ship.mp4",
    src: "",
    label: "Between worlds",
    alt: "The ship in flight between worlds, carrying the weight and inertia the flight model gives it.",
    caption:
      "The ship under way. It carries real mass, which is why a course correction has to be started long before it is needed.",
  },
  {
    src: "/images/shattered-skies/shattered-skies-spaceship-interior.png.png",
    label: "Inside the hub",
    alt: "In-engine view of the ship's interior: the hub floor with its lit consoles spread around the walls and a player character standing among them.",
    caption:
      "The interior, in engine. The consoles are spread around the walls rather than gathered at a cockpit — the layout is what makes one player unable to be at all of them.",
  },
];

/**
 * Moon-Knight — the game running, said early.
 *
 * WHAT HAPPENED TO THE GALLERY. This is the old `16 · From the Game` strip,
 * dissolved and rebuilt. The section-ownership map's verdict on it was
 * `Dissolve` — every caption re-explained a section above it, and the one
 * still it carried (`boss-werewolf.png`) was 1,500 words away from the card it
 * illustrated. That still has now been absorbed onto the Werewolf's bestiary
 * entry, where it is evidence rather than decoration.
 *
 * WHAT DID NOT DISSOLVE, AND WHY THIS FILE EXISTS. The three video loops are
 * not illustrations of claims made elsewhere — they are the only proof on the
 * page that the game RUNS. Absorbing them into the sections they relate to
 * would have scattered them across 60% of the page's depth, and a reader who
 * gives this page a minute would have reached none of them. So they were
 * promoted instead of absorbed, and they lead: three clips, high on the page,
 * before any argument is made.
 *
 * That makes this section an OWNER, not a pointer — the map's §16 verdict
 * moved from `Dissolve` to `Own`. The rule it has to keep is the one the old
 * gallery broke: a caption here says what the CLIP shows and what it cost to
 * build. It never re-argues the section it touches. The combo clip does not
 * explain the combo system, the mini-boss clip does not explain scale — those
 * belong to §06 Controls and §09 Art Direction, and are one scroll away.
 *
 * SILENT BY DESIGN. Every clip is muted and loops; `LoopingVideo` refuses to
 * autoplay any of them under `prefers-reduced-motion` and offers controls
 * instead, so nothing here moves at a reader who asked for stillness.
 */

export interface MotionClip {
  /** Path under /public. */
  video: string;
  /** Accessible name. Describe what the loop shows, as alt text would. */
  alt: string;
  /** Small mono eyebrow. Two or three words. */
  label: string;
  /** What the clip shows, and what it took. Never an argument made elsewhere. */
  caption: string;
}

export const inMotionIntro = {
  kicker: "03 · In Motion",
  title: "The Game, Running",
  /**
   * One sentence. This band's job is to get out of the way of the videos —
   * the whole point of promoting it was that a reader gets proof before prose.
   */
  body:
    "Three clips from the build, before any of the design argument below. Everything on " +
    "this page was made for a game that runs.",
} as const;

export const inMotionClips: readonly MotionClip[] = [
  {
    video: "/images/moon-knight/combo.mp4",
    label: "Four-hit chain",
    alt: "The four-hit sword combo chaining, each input landing inside the previous swing's continuation window",
    caption:
      "The combo chain, uncut. Each hit continues only if the next input lands inside the previous swing's window — timing no still frame can show.",
  },
  {
    video: "/images/moon-knight/miniboss.mp4",
    label: "Mini-boss",
    alt: "The mini-boss encounter in play: the enemy towering over the knight, and the dodge used to get out of its swing",
    caption:
      "The mini-boss in play. It is far bigger than you, and the dodge is the only answer to that reach.",
  },
  {
    video: "/images/moon-knight/werewolf_dodge_attack.mp4",
    label: "Boss fight",
    alt: "The Werewolf boss fight: dodging through an attack and answering it in the recovery window",
    caption:
      "The Werewolf, fought rather than framed. Dodge through the swing, answer in its recovery — the loop the encounter is tuned around.",
  },
];

/**
 * The chapter index that sits under every project hero.
 *
 * WHY THIS FILE EXISTS. A reader landing on a project page could not see what
 * was on it without scrolling the whole thing. The index under the hero fixes
 * that: one horizontal row of chapters — the level design, the score, the
 * screenshots — so the page announces its own contents in one screen.
 *
 * It is a POINTER BLOCK, not a second home, and the map's rule applies whole
 * (`docs/section-ownership-map.md` § "Pointers are not owners"):
 *
 *   1. **A chapter's `title` is the section's own title**, not a new name for
 *      it. Where the section heading comes from a content const the chapter
 *      reads the same const, so there is one literal and two render sites.
 *      Where the page typed the heading, the PAGE now reads it from here —
 *      `<SectionHeading title={ch.levels.title} />` — which is the same
 *      one-literal rule pointing the other way.
 *   2. **`note` is a label, never an argument.** Six words, what the chapter
 *      holds. The moment a note starts explaining, the owning section has been
 *      duplicated and the note has to be cut back.
 *   3. **The address is built, never typed.** Every chapter carries an `id` the
 *      page renders as `id={...}`, so a renamed chapter moves the link and its
 *      target together.
 *   4. **It lists THIS page's sections and nothing else.** Subpages — the deep
 *      dive, the engineering write-ups — are already in the hero's links block
 *      and in the `ProjectNav` at the foot. A third copy in here made the index
 *      answer two questions at once ("what is on this page" and "where else can
 *      I go"), and the tiles that left the page looked exactly like the tiles
 *      that did not.
 */

import { inMotionIntro as mkInMotion } from "./moon-knight-in-motion";
import { inMotionIntro as biInMotion } from "./break-in-in-motion";
import { inMotionIntro as sotInMotion } from "./seeds-in-motion";
import { inMotionIntro as ssInMotion } from "./shattered-skies-in-motion";
import { mainAnchors as ssMain } from "./shattered-skies-deep-dive";

export interface Chapter {
  /** The section id on this page. */
  id: string;
  /** The section's own title. Never a fresh name for it. */
  title: string;
  /** At most six words. What it holds, not what it argues. */
  note: string;
}

/** The same-page fragment for one chapter. */
export const chapterHref = (c: Chapter) => `#${c.id}`;

/* ═══════════════════════════════════════════════════════════════════════
   MOON-KNIGHT

   The design decisions came back from the deep dive and are chapter 08
   again, whole — see the map's Moon-Knight §08 entry.
   ═══════════════════════════════════════════════════════════════════════ */

export const moonKnightChapters = {
  overview: { id: "overview", title: "The Vision", note: "What the game is" },
  role: { id: "my-role", title: "My Contribution", note: "What I designed and built" },
  inMotion: { id: "in-motion", title: mkInMotion.title, note: "Video clips from the build" },
  abilities: {
    id: "signature-systems",
    title: "The Power of the Gods",
    note: "The five quantum abilities",
  },
  bestiary: { id: "the-creatures", title: "Bestiary", note: "Enemies, bosses and their AI" },
  controls: {
    id: "the-controls",
    title: "The Input Map in a Controller",
    note: "The control scheme and the combo",
  },
  world: {
    id: "world-and-levels",
    title: "Kaelum and How It Was Planned",
    note: "The map, the beat chart, the levels",
  },
  diegetic: {
    id: "diegetic-design",
    title: "The Main Design Decisions",
    note: "The interface dissolved into the world",
  },
  invisible: {
    id: "invisible-design",
    title: "The Decisions With No Interface",
    note: "What the player never sees",
  },
  art: { id: "art-direction", title: "The Sublime", note: "The art direction and screenshots" },
  development: {
    id: "the-development",
    title: "The Quantum and Engineering Design",
    note: "The hard part of building it",
  },
  audio: { id: "audio-design", title: "The Soundtrack", note: "The music I composed" },
} as const satisfies Record<string, Chapter>;

export const moonKnightChapterList: readonly Chapter[] = [
  moonKnightChapters.overview,
  moonKnightChapters.role,
  moonKnightChapters.inMotion,
  moonKnightChapters.abilities,
  moonKnightChapters.bestiary,
  moonKnightChapters.controls,
  moonKnightChapters.world,
  moonKnightChapters.diegetic,
  moonKnightChapters.invisible,
  moonKnightChapters.art,
  moonKnightChapters.development,
  moonKnightChapters.audio,
];

/* ═══════════════════════════════════════════════════════════════════════
   SHATTERED SKIES

   Six of the eight ids already existed as `mainAnchors`, because other
   components link to them. Those are read here, not restated.
   ═══════════════════════════════════════════════════════════════════════ */

export const shatteredSkiesChapters = {
  overview: { id: "overview", title: "The Vision", note: "What the game is" },
  inMotion: { id: ssMain.inMotion, title: ssInMotion.title, note: "Captures from the build" },
  theGame: { id: ssMain.theGame, title: "The Game We Made", note: "The loop, start to end" },
  role: { id: "my-role", title: "My Contribution", note: "What I designed and built" },
  worlds: {
    id: ssMain.worlds,
    title: "The World & the Five Worlds",
    note: "Shatterstorm and its five planets",
  },
  levels: {
    id: ssMain.levels,
    title: "Each Planet Teaches a Skill",
    note: "The level design, planet by planet",
  },
  mechanics: {
    id: ssMain.mechanics,
    title: "Systems That Force You Together",
    note: "The core co-op mechanics",
  },
  coop: {
    id: ssMain.coop,
    title: "Split, Distorted, Rebuilt",
    note: "The two seats and their mini-games",
  },
} as const satisfies Record<string, Chapter>;

export const shatteredSkiesChapterList: readonly Chapter[] = [
  shatteredSkiesChapters.overview,
  shatteredSkiesChapters.inMotion,
  shatteredSkiesChapters.theGame,
  shatteredSkiesChapters.role,
  shatteredSkiesChapters.worlds,
  shatteredSkiesChapters.levels,
  shatteredSkiesChapters.mechanics,
  shatteredSkiesChapters.coop,
];

/* ═══════════════════════════════════════════════════════════════════════
   BREAK-IN

   One page, no subpage, so every chapter is a fragment.
   ═══════════════════════════════════════════════════════════════════════ */

export const breakInChapters = {
  overview: { id: "overview", title: "The Vision", note: "What the game is" },
  inMotion: { id: "in-motion", title: biInMotion.title, note: "A clip and two rooms" },
  theRun: { id: "the-run", title: "Eight minutes, four phases", note: "The shape of one heist" },
  role: { id: "my-role", title: "My Contribution", note: "What I designed and built" },
  systems: {
    id: "signature-systems",
    title: "Nobody wins alone",
    note: "The four roles and their wiring",
  },
  levels: { id: "level-design", title: "The Route", note: "The level design and the map" },
  stealth: { id: "stealth", title: "Being Seen", note: "The detection states" },
  audio: { id: "audio", title: "What the heist sounds like", note: "The audio direction" },
  balance: { id: "balance", title: "Tuned so nobody can carry", note: "The balance data" },
  challenge: {
    id: "the-hard-part",
    title: "Design Challenge",
    note: "The hard part of building it",
  },
} as const satisfies Record<string, Chapter>;

export const breakInChapterList: readonly Chapter[] = [
  breakInChapters.overview,
  breakInChapters.inMotion,
  breakInChapters.theRun,
  breakInChapters.role,
  breakInChapters.systems,
  breakInChapters.levels,
  breakInChapters.stealth,
  breakInChapters.audio,
  breakInChapters.balance,
  breakInChapters.challenge,
];

/* ═══════════════════════════════════════════════════════════════════════
   SEEDS OF TOMORROW

   Three ids already existed on the page and are kept exactly as they were —
   they are what the site's existing deep links point at.
   ═══════════════════════════════════════════════════════════════════════ */

export const seedsChapters = {
  overview: { id: "overview", title: "The Vision", note: "What the game is" },
  inMotion: { id: "in-motion", title: sotInMotion.title, note: "Captures from the build" },
  role: { id: "my-role", title: "My Contribution", note: "What I designed and built" },
  score: { id: "score", title: "Plant a Sound", note: "The music I composed" },
  levels: { id: "level-design", title: "Fight, Then Mend", note: "The level and puzzle design" },
  weather: { id: "weather", title: "A World That Heals", note: "The weather system" },
} as const satisfies Record<string, Chapter>;

export const seedsChapterList: readonly Chapter[] = [
  seedsChapters.overview,
  seedsChapters.inMotion,
  seedsChapters.role,
  seedsChapters.score,
  seedsChapters.levels,
  seedsChapters.weather,
];

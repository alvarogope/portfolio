import { inMotionIntro as mkInMotion } from "./moon-knight-in-motion";
import { inMotionIntro as biInMotion } from "./break-in-in-motion";
import { inMotionIntro as sotInMotion } from "./seeds-in-motion";
import { inMotionIntro as ssInMotion } from "./shattered-skies-in-motion";
import { mainAnchors as ssMain } from "./shattered-skies-deep-dive";

export interface Chapter {
  id: string;
  title: string;
  note: string;
}

export const chapterHref = (c: Chapter) => `#${c.id}`;

/* ═══════════════════════════════════════════════════════════════════════
   MOON-KNIGHT
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
   ═══════════════════════════════════════════════════════════════════════ */

export const shatteredSkiesChapters = {
  overview: { id: "overview", title: "The Vision", note: "What the game is" },
  inMotion: { id: ssMain.inMotion, title: ssInMotion.title, note: "Captures from the build" },
  theGame: { id: ssMain.theGame, title: "The Game We Worked On", note: "The loop, start to end" },
  role: { id: "my-role", title: "My Contribution", note: "What I designed and built" },
  worlds: {
    id: ssMain.worlds,
    title: "The World & the Five Planets",
    note: "Shatterstorm and its five planets",
  },
  levels: {
    id: ssMain.levels,
    title: "Each Planet Shows a Skill",
    note: "The level design, planet by planet",
  },
  mechanics: {
    id: ssMain.mechanics,
    title: "Creating Cooperation",
    note: "The core co-op mechanics",
  },
  coop: {
    id: ssMain.coop,
    title: "Division, Distortion and Improvisation",
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
   ═══════════════════════════════════════════════════════════════════════ */

export const breakInChapters = {
  overview: { id: "overview", title: "The Vision", note: "What the game is" },
  inMotion: { id: "in-motion", title: biInMotion.title, note: "A clip and two rooms" },
  theRun: { id: "the-run", title: "Eight minutes of tension", note: "The shape of one heist" },
  role: { id: "my-role", title: "My Contribution", note: "What I designed and built" },
  systems: {
    id: "signature-systems",
    title: "Winning by Cooperating",
    note: "The four roles and their wiring",
  },
  levels: { id: "level-design", title: "The Route", note: "The level design and the map" },
  stealth: { id: "stealth", title: "The Detection System", note: "The detection states" },
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

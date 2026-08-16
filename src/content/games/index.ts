import type { Project } from "../schema";
import { moonKnight } from "./moon-knight";
import { breakIn } from "./break-in";
import { shatteredSkies } from "./shattered-skies";
import { seedsOfTomorrow } from "./seeds-of-tomorrow";

export type ProjectNavItem = {
  label: string;
  slug: string;
  accent: string;
};

export const games: Project[] = [
  moonKnight,
  breakIn,
  shatteredSkies,
  seedsOfTomorrow,
];

/* The running order the site tells, which is deliberately not the
   registry order above — it matches the homepage's Act I–IV sequence so
   a visitor meets the four worlds in the same order everywhere. */
export const projectNavItems: ProjectNavItem[] = [
  { label: moonKnight.title, slug: moonKnight.slug, accent: "#c8cde0" },
  { label: shatteredSkies.title, slug: shatteredSkies.slug, accent: "#7ec8d8" },
  { label: breakIn.title, slug: breakIn.slug, accent: "#d6a65a" },
  { label: seedsOfTomorrow.title, slug: seedsOfTomorrow.slug, accent: "#8fc98a" },
];

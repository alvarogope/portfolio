import type { Project } from "../schema";
import { moonKnight } from "./moon-knight";
import { breakIn } from "./break-in";
import { shatteredSkies } from "./shattered-skies";
import { seedsOfTomorrow } from "./seeds-of-tomorrow";

export type ProjectNavItem = {
  label: string;
  slug: string;
  href?: string;
  accent: string;
};

export const games: Project[] = [
  moonKnight,
  breakIn,
  shatteredSkies,
  seedsOfTomorrow,
];

export const HOME_NAV_ITEM: ProjectNavItem = {
  label: "All projects",
  slug: "home",
  href: "/",
  accent: "#b8c4d4",
};

export const projectNavItems: ProjectNavItem[] = [
  HOME_NAV_ITEM,
  { label: moonKnight.title, slug: moonKnight.slug, accent: "#c8cde0" },
  { label: shatteredSkies.title, slug: shatteredSkies.slug, accent: "#7ec8d8" },
  { label: breakIn.title, slug: breakIn.slug, accent: "#d6a65a" },
  { label: seedsOfTomorrow.title, slug: seedsOfTomorrow.slug, accent: "#8fc98a" },
];

/* THE SUBPAGE RAILS. */
export const moonKnightNavItems: ProjectNavItem[] = [
  HOME_NAV_ITEM,
  { label: "Back to the design", slug: moonKnight.slug, accent: "#c8cde0" },
  {
    label: "The deep dive",
    slug: "moon-knight-world",
    href: "/moon-knight/world",
    accent: "#c8cde0",
  },
  {
    label: "Game engineering",
    slug: "moon-knight-engineering",
    href: "/moon-knight/engineering",
    accent: "#c8cde0",
  },
  {
    label: "Quantum toolkit",
    slug: "moon-knight-quantum",
    href: "/moon-knight/engineering/quantum",
    accent: "#c8cde0",
  },
];

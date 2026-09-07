import type { Project } from "../schema";
import { moonKnight } from "./moon-knight";
import { breakIn } from "./break-in";
import { shatteredSkies } from "./shattered-skies";
import { seedsOfTomorrow } from "./seeds-of-tomorrow";

export type ProjectNavItem = {
  label: string;
  /**
   * The row's identity: it picks the icon in `ProjectNav` and it is what
   * `currentSlug` is matched against. For a top-level project it is the
   * project's own slug; for anything else it is a made-up key and `href`
   * carries the real address.
   */
  slug: string;
  /** Defaults to `/${slug}`. Set it for rows that are not a project index. */
  href?: string;
  accent: string;
};

export const games: Project[] = [
  moonKnight,
  breakIn,
  shatteredSkies,
  seedsOfTomorrow,
];

/**
 * The way out of a project and back to the index.
 *
 * It used to exist only at the very foot of a page — a `RampLink` on two of
 * the four projects, and nothing at all on the other two — so a reader deep
 * inside a project had no visible route home without scrolling to the end.
 * It is now the first row of every rail, and the foot-of-page links are
 * deliberately left where they are: two exits are not a duplication problem
 * when one of them is pinned to the viewport and the other is a full stop.
 */
export const HOME_NAV_ITEM: ProjectNavItem = {
  label: "All projects",
  slug: "home",
  href: "/",
  accent: "#b8c4d4",
};

/* The running order the site tells, which is deliberately not the
   registry order above — it matches the homepage's Act I–IV sequence so
   a visitor meets the four worlds in the same order everywhere. */
export const projectNavItems: ProjectNavItem[] = [
  HOME_NAV_ITEM,
  { label: moonKnight.title, slug: moonKnight.slug, accent: "#c8cde0" },
  { label: shatteredSkies.title, slug: shatteredSkies.slug, accent: "#7ec8d8" },
  { label: breakIn.title, slug: breakIn.slug, accent: "#d6a65a" },
  { label: seedsOfTomorrow.title, slug: seedsOfTomorrow.slug, accent: "#8fc98a" },
];

/**
 * THE SUBPAGE RAILS.
 *
 * A subpage used to navigate by breadcrumb at the top and `CtaPanel`s at the
 * foot and nothing in between, which meant that on a page five sections long
 * the only way sideways was to reach one end of it. These give the two
 * projects that HAVE subpages the same pinned rail their main pages carry.
 *
 * Each rail lists the project's whole family, current page included, exactly
 * as `projectNavItems` lists the current project — the active row is what
 * tells a reader where in the family they are standing. `slug` is an icon
 * key here, not a route; `href` is the route.
 */
export const moonKnightNavItems: ProjectNavItem[] = [
  HOME_NAV_ITEM,
  { label: moonKnight.title, slug: moonKnight.slug, accent: "#c8cde0" },
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

export const shatteredSkiesNavItems: ProjectNavItem[] = [
  HOME_NAV_ITEM,
  { label: shatteredSkies.title, slug: shatteredSkies.slug, accent: "#7ec8d8" },
  {
    label: "The deep dive",
    slug: "shattered-skies-world",
    href: "/shattered-skies/world",
    accent: "#7ec8d8",
  },
];

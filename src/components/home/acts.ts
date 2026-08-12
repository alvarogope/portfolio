import { games } from "@/content/games";
import type { Project } from "@/content/schema";

/* Presentation-only configuration for the homepage's four "acts".

   Everything the visitor reads — title, hook, disciplines, link label —
   comes from the real project entries in @/content/games. The only
   things defined here are the narrative running order, the per-project
   accent, and which side the copy sits on.

   These are keyed by SLUG rather than by registry index on purpose:
   the registry's own order is Moon-Knight, Break-In, Shattered Skies,
   Seeds, which is not the running order the homepage tells. Indexing
   by position would silently attach the wrong act label and accent to
   a project. */

export type ActSide = "left" | "right";

export interface Act {
  project: Project;
  label: string;
  accent: string;
  poster: string;
  /** Which side the copy block sits on; the poster takes the other. */
  side: ActSide;
  flagship: boolean;
}

interface ActConfig {
  slug: string;
  label: string;
  accent: string;
  poster: string;
  side: ActSide;
  flagship?: boolean;
}

const CONFIG: ActConfig[] = [
  {
    slug: "moon-knight",
    label: "ACT I — FLAGSHIP · DARK MEDIEVAL FANTASY",
    accent: "#c8cde0",
    poster: "/images/moon-knight/poster.png",
    side: "right",
    flagship: true,
  },
  {
    slug: "shattered-skies",
    label: "ACT II — SCI-FI CO-OP",
    accent: "#7ec8d8",
    poster: "/images/shattered-skies/poster.png",
    side: "left",
  },
  {
    slug: "seeds-of-tomorrow",
    label: "ACT III — SOLARPUNK",
    accent: "#8fc98a",
    poster: "/images/seeds-of-tomorrow/poster.png",
    side: "right",
  },
  {
    slug: "break-in",
    label: "ACT IV — HEIST",
    accent: "#d6a65a",
    poster: "/images/break-in/poster.png",
    side: "left",
  },
];

/* A project that is configured but missing from the registry is
   skipped rather than rendered empty, so the page can never show a
   headless band. */
export const acts: Act[] = CONFIG.flatMap((entry) => {
  const project = games.find((g) => g.slug === entry.slug);
  if (!project) return [];
  return [
    {
      project,
      label: entry.label,
      accent: entry.accent,
      poster: entry.poster,
      side: entry.side,
      flagship: entry.flagship ?? false,
    },
  ];
});

/** Splits a project's `disciplines` string into individual chips. */
export function toChips(disciplines: string): string[] {
  return disciplines
    .split("·")
    .map((d) => d.trim())
    .filter(Boolean);
}

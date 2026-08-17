import { games } from "@/content/games";
import type { Project } from "@/content/schema";

export type ActSide = "left" | "right";

export interface Act {
  project: Project;
  label: string;
  accent: string;
  poster: string;
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
    slug: "break-in",
    label: "ACT III — HEIST",
    accent: "#d6a65a",
    poster: "/images/break-in/poster.png",
    side: "right",
  },
  {
    slug: "seeds-of-tomorrow",
    label: "ACT IV — SOLARPUNK",
    accent: "#8fc98a",
    poster: "/images/seeds-of-tomorrow/poster.png",
    side: "left",
  },
];

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

export function toChips(disciplines: string): string[] {
  return disciplines
    .split("·")
    .map((d) => d.trim())
    .filter(Boolean);
}

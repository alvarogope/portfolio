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
    label: "DARK MEDIEVAL FANTASY RPG",
    accent: "#c8cde0",
    poster: "/images/moon-knight/mk-poster.png",
    side: "right",
    flagship: true,
  },
  {
    slug: "shattered-skies",
    label: "SCI-FI CO-OP",
    accent: "#7ec8d8",
    poster: "/images/shattered-skies/sk-poster.png",
    side: "left",
  },
  {
    slug: "break-in",
    label: "HEIST",
    accent: "#d6a65a",
    poster: "/images/break-in/Laser_security.png",
    side: "right",
  },
  {
    slug: "seeds-of-tomorrow",
    label: "SOLARPUNK",
    accent: "#8fc98a",
    poster: "/images/seeds-of-tomorrow/st-poster.png",
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
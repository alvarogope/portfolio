import { games } from "@/content/games";
import type { Project } from "@/content/schema";
import { heroSlides } from "./hero-slides";

export type ActSide = "left" | "right";

export interface ActImage {
  src: string;
  alt: string;
  position: string;
  shade: number;
}

export interface Act {
  project: Project;
  label: string;
  accent: string;
  poster: string;
  image: ActImage;
  side: ActSide;
  flagship: boolean;
}

interface ActConfig {
  slug: string;
  label: string;
  accent: string;
  poster: string;
  image: ActImage | ((project: Project) => ActImage);
  side: ActSide;
  flagship?: boolean;
}

function heroAlt(src: string): string {
  return heroSlides.find((s) => s.src === src)?.alt ?? "";
}

const CONFIG: ActConfig[] = [
  {
    slug: "moon-knight",
    label: "DARK MEDIEVAL FANTASY RPG",
    accent: "#c8cde0",
    poster: "/images/moon-knight/mk-poster.png",
    image: {
      src: "/images/moon-knight/willow_tree.png",
      alt: "A white willow tree on a rise under a full night sky, a fallen winged statue below it, the knight small in the distance.",
      position: "50% 38%",
      shade: 0.14,
    },
    side: "right",
    flagship: true,
  },
  {
    slug: "shattered-skies",
    label: "SCI-FI CO-OP",
    accent: "#7ec8d8",
    poster: "/images/shattered-skies/sk-poster.png",
    image: {
      src: "/images/hero/hub-planet-wall-crop.jpg",
      alt: heroAlt("/images/hero/hub-planet-wall-crop.jpg"),
      position: "62% 50%",
      shade: 0.08,
    },
    side: "left",
  },
  {
    slug: "break-in",
    label: "HEIST",
    accent: "#d6a65a",
    poster: "/images/break-in/Laser_security.png",
    image: (project) => ({
      src: "/images/break-in/Laser_security.png",
      alt: project.posterAlt,
      position: "30% 60%",
      shade: 0.18,
    }),
    side: "right",
  },
  {
    slug: "seeds-of-tomorrow",
    label: "SOLARPUNK",
    accent: "#8fc98a",
    poster: "/images/seeds-of-tomorrow/sot-poster.jpg",
    image: {
      src: "/images/seeds-of-tomorrow/Seed.jpg",
      alt: "Painted key art of a single glowing seed sprouting through cracked earth, roots running light into the ground and flowers opening around it.",
      position: "50% 15%",
      shade: 0.1,
    },
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
      image: typeof entry.image === "function" ? entry.image(project) : entry.image,
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
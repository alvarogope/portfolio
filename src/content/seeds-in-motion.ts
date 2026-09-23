export interface MotionItem {
  video?: string;
  src: string;
  alt: string;
  label: string;
  caption: string;
}

export const inMotionIntro = {
  kicker: "Gameplay Videos",
  title: "The Gameplay",
  body: "The same plot of ground, twice, and three captures from the Unity build.",
} as const;

export const beforeAfter: readonly MotionItem[] = [
  {
    src: "/images/seeds-of-tomorrow/restoration-before.jpg",
    label: "Before",
    alt: "The valley level before restoration: bare sand, dead rock formations, wrecked vehicles and shipping containers scattered along the road.",
    caption: "Before. Sand, rock and the wreckage.",
  },
  {
    src: "/images/seeds-of-tomorrow/restoration-after.jpg",
    label: "After",
    alt: "The same valley after restoration, from the same camera position: the ground green and planted with autumn forest, the same road running through it.",
    caption:
      "After. The same level, but after planting a seed.",
  },
];

export const inMotionItems: readonly MotionItem[] = [
  {
    video: "/images/seeds-of-tomorrow/combat.mp4",
    src: "",
    label: "The fight",
    alt: "Gameplay of combat in Seeds of Tomorrow: the player engaging corrupted enemies inside one of the marked arenas.",
    caption:
      "Polluted enemies. This is the first half of the level, before the puzzle.",
  },
  {
    video: "/images/seeds-of-tomorrow/blossom.mp4",
    src: "",
    label: "The puzzle",
    alt: "Dead ground blossoming: vegetation spreading outward from a planted seed and colour returning to the terrain.",
    caption:
      "The moment when the seed blossoms.",
  },
  {
    src: "/images/seeds-of-tomorrow/restored-world.png",
    label: "Restoring life",
    alt: "The restored world in play: deer, a dog, a raccoon and other animals grazing on green ground among autumn trees and mushrooms, with the traveller's saucer parked on the road.",
    caption:
      "Further on, in a level already completed. Animals are back.",
  },
];
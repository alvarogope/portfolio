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
} as const;

export const inMotionItems: readonly MotionItem[] = [
  {
    video: "/images/shattered-skies/menu.mp4",
    src: "",
    label: "The Main Menu",
    alt: "The Shattered Skies title screen and menu.",
    caption:
      "The first thing the player sees: The Spaceship",
  },
  {
    video: "/images/shattered-skies/ship.mp4",
    src: "",
    label: "The spaceship in the game",
    alt: "The ship in flight between worlds, carrying the weight and inertia the flight model gives it.",
    caption:
      "This is the main traversal mechanics between the planets, carrying real in-game mass",
  },
  {
    src: "/images/shattered-skies/shattered-skies-spaceship-interior.png.png",
    label: "First Level",
    alt: "In-engine view of the ship's interior: the hub floor with its lit consoles spread around the walls and a player character standing among them.",
    caption:
      "The first level, an interior level. The resources are spread around the level and they are protected by enemies.",
  },
];

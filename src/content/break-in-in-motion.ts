export interface MotionItem {
  video?: string;
  src: string;
  alt: string;
  label: string;
  caption: string;
}

export const inMotionIntro = {
  kicker: "Gameplay videos",
  title: "The Gameplay",
  body: "One clip and two rooms from the Unity build.",
} as const;

export const inMotionItems: readonly MotionItem[] = [
  {
    video: "/images/break-in/distraction_test.mp4",
    src: "",
    label: "Distraction",
    alt: "The Hacker's Distraction ability overloading a bank light, and a patrolling guard leaving his route to deal with it.",
    caption:
      "This is the test for the distraction mechanic. The guard will go to wherever the trigger is.",
  },
  {
    src: "/images/break-in/Reception_Lobby.png",
    label: "The Main Lobby",
    alt: "In-engine view of the bank lobby: three ATMs along the back wall, waiting seating, low tables, and the walk-through security gate that leads to the rest of the building.",
    caption:
      "The main lobby in-game. The four players spawn into the building in four different places but in the " +
      "customer part of a bank. The ATMs, waiting seats and the main gate where everyone will go in to the back side " +
      "of the bank.",
  },
  {
    src: "/images/break-in/Laser_security.png",
    label: "The basement",
    alt: "In-engine view of the basement corridor with the laser grid switched on: a dozen green beams crossing the passage at waist and chest height, and a wall keypad beside them.",
    caption:
      "The main trap in the basement: laser grid. In a normal run, it is invisible until one of the players " +
      "throw a smoking can.",
  },
];

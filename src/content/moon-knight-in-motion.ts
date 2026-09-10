export interface MotionClip {
  video: string;
  alt: string;
  label: string;
  caption: string;
}

export const inMotionIntro = {
  kicker: "Gameplay Videos",
  title: "The Gameplay",
  body:
    "Clips from the game, showing the main mechanics that make the game work.",
} as const;

export const inMotionClips: readonly MotionClip[] = [
  {
    video: "/images/moon-knight/combo.mp4",
    label: "Four Attack Combo",
    alt: "The four-hit sword combo chaining, each input landing inside the previous swing's continuation window",
    caption:
      "The four sword combo, showing the fundamentals of the combat system.",
  },
  {
    video: "/images/moon-knight/miniboss.mp4",
    label: "Mini-boss",
    alt: "The mini-boss encounter in play: the enemy towering over the knight, and the dodge used to get out of its swing",
    caption:
      "The Mini-Boss combat. It is bigger than the Moon-Knight for better vision. Dodging the attack is crucial.",
  },
  {
    video: "/images/moon-knight/werewolf_dodge_attack.mp4",
    label: "Boss fight",
    alt: "The Werewolf boss fight: dodging through an attack and answering it in the recovery window",
    caption:
      "The Werewolf fight. Dodging and attacking in a fast-paced combat.",
  },
];

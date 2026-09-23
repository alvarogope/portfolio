import type { SeedsChapterKey } from "./project-chapters";

export type LoopHalf = "tension" | "restoration";

export interface Half {
  id: LoopHalf;
  label: string;
  body: string;
}

export const halves: readonly Half[] = [
  {
    id: "tension",
    label: "The tension",
    body:
      "Dynamic combat against polluted monsters.",
  },
  {
    id: "restoration",
    label: "The restore",
    body:
      "Slow-paced puzzle-solving that heals the level when completed.",
  },
];

export interface LoopStep {
  id: string;
  index: string;
  name: string;
  body: string;
  half: LoopHalf;
  isPayoff?: boolean;
}

export const loopSteps: readonly LoopStep[] = [
  {
    id: "fight",
    index: "",
    name: "Fight",
    half: "tension",
    body: "A burst of tension against the monsters.",
  },
  {
    id: "recover",
    index: "",
    name: "Recover the seed",
    half: "tension",
    body: "The Seeds of Tomorrow brings life back.",
  },
  {
    id: "solve",
    index: "",
    name: "Solve the place",
    half: "restoration",
    body:
      "The puzzle that heals the area.",
  },
  {
    id: "turn",
    index: "",
    name: "The sky turns",
    half: "restoration",
    body: "The acid rain returns to normal.",
    isPayoff: true,
  },
];

export const loopNote =
  "I paced the game and divided it into the combat and the puzzle-solving dynamic.";

export const payoffPointer = {
  label: "What the sky does",
  href: "#weather",
  body: "",
};

export const puzzleNote = {
  tag: "Level & puzzle design",
  body:
    "I co-designed the levels and the puzzles the player solves to recover and plant the seeds, " +
    "building each space around the same rhythm: clear what the pollution left in it, then do " +
    "the work that brings it back. The puzzle is the hinge — it is what the fight resolves into " +
    "and what the sky answers.",
};

export const loopSummary =
  "A four-step loop: fight the monsters, recover the seed, solve the place and plant it, and then " +
  "the sky turns clean over it. The loop then returns to the first step at the next place. The " +
  "first two steps are the tension half of the rhythm, the last two the restorative half, and the " +
  "weather change is the payoff at the end of the arc.";

export const levelCredit = {
  role: "Composer & Level Designer",
  team: "Team of 5",
  body:
    "The game was developed by the five of us. Part of the levels, puzzles and rhythm is what I co-designed " +
    "with other members of the team.",
};

export interface ContributionHome {
  /** The owning section, by key: the page reads its title and anchor from `seedsChapters`. */
  chapter: SeedsChapterKey;
  shown: string;
}

export const contributionHomes: Readonly<Record<string, ContributionHome>> = {
  "Original soundtrack": {
    chapter: "score",
    shown: "Three of the songs.",
  },
  "Level & puzzle design": {
    chapter: "levels",
    shown: "The weather in the levels.",
  },
  "Progression & pacing": {
    chapter: "levels",
    shown: "The game beats",
  },
  "Weather & environmental feedback": {
    chapter: "weather",
    shown: "Weather relating to story.",
  },
};
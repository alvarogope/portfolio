import type { Project } from "../schema";

export const seedsOfTomorrow: Project = {
  slug: "seeds-of-tomorrow",
  title: "Seeds of Tomorrow",
  tagline: "A traveller from a poisoned future returns to heal the Earth before it is too late.",
  pillar: false,

  facts: { engine: "Unity", role: "Composer & Level Designer", team: "Team of 5", year: "2025" },
  links: [],

  eyebrow: "UNITY · TEAM OF 5 · 2025",
  systemsHook: "A dying world that heals as you solve it: acid rain turns clean, and life returns to the Earth you restore.",
  disciplines: "Original score · Level & puzzle design · Weather systems · Pacing",
  scope: "Composer & Level Designer · Team of 5",
  routingVerb: "See the design",
  showcase: "Shown at Developed: Brighton 2025",

  posterAlt: "Seeds of Tomorrow key art placeholder",

  vision:
    "In a future where the Earth has been poisoned beyond saving, a traveller journeys back to our time to change its fate. He finds a child to protect from the pollution and the nature-twisted monsters it has spawned, and he searches for the Seeds of Tomorrow: the means to bring life back to a dying world. The player fights the monsters, recovers the seeds, and plants them to restore the Earth, one healed place at a time. It is a hopeful story told through a world that visibly mends as you play.",

  designChallenge: {
    quote:
      "I wanted the world itself to be the feedback for the player's progress, not a HUD bar. So I tied the weather to the fiction: acid rain falls on the poisoned areas, and when the player solves the puzzle that heals a place, the rain turns clean. Snow, wind, and sandstorms each carry their own hazard and mood. The environment stops being a backdrop and becomes the clearest signal of whether you are winning, so restoring the Earth is something the player feels in the sky, not reads on a meter.",
    engine: "Unity",
    system: "Weather / environmental feedback",
    resolution: "Made the weather the diegetic signal of the world healing.",
  },

  contributions: [
    {
      label: "Original score (11 tracks)",
      description:
        "Composed and recorded the game's entire soundtrack: eleven original tracks scoring the journey from a poisoned world to a restored one, matching the tone of each area and the emotional arc of the story.",
    },
    {
      label: "Weather & environmental feedback",
      description:
        "Designed the weather as a storytelling system, so the world visibly heals as the player restores it. Acid rain over poisoned zones turns clean when a puzzle is solved; snow, wind and sandstorms are each a hazard and a mood.",
    },
    {
      label: "Level & puzzle design",
      description:
        "Designed the levels and the puzzles the player solves to recover and plant the seeds, building each space around the loop of clearing threats and then restoring life.",
    },
    {
      label: "Progression & pacing",
      description:
        "Designed the combat-then-puzzle rhythm that paces the game: bursts of tension against the monsters, resolving into the quieter, restorative work of solving a place and healing it.",
    },
  ],
};
import type { Project } from "../schema";

export const seedsOfTomorrow: Project = {
  slug: "seeds-of-tomorrow",
  title: "Seeds of Tomorrow",
  tagline: "A time traveller from a polluted Earth returns to heal it before it is too late.",
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
    "In a future where Earth has been completely destroyed by pollution, a time traveller comes back to " +
    "change this fate before is too late. When he arrives, he finds a child that needs protection " +
    "from polluted monsters. To bring life back, he searches the Seeds of Tomorrow, guarded by monsters. " +
    "He has to recover the seeds and plant them to restore life on Earth",

  designChallenge: {
    quote:
      "I wanted the world to reflect the world as realistic as possible. For that, as weather designer, I wanted to make " +
      "the weather dynamic. I tied the weather to the story: acid rain falls in the rain level and when the player solves " +
      "the level it changes to normal rain. Each of the weather levels had their own hazard and mood, adding to the level design.",
    engine: "Unity",
    system: "Weather and Level Design",
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
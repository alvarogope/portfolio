import type { Project } from "../schema";

export const shatteredSkies: Project = {
  slug: "shattered-skies",
  title: "Shattered Skies",
  tagline: "A fractured world with a united purpose. Two enemies, one life they must preserve.",
  pillar: true,

  facts: { engine: "Unity", role: "Game Designer", team: "Team of 5", year: "2025" },
  links: [],

  eyebrow: "UNITY · TEAM OF 5 · 2025",
  systemsHook: "Two players share one life and cannot understand each other. What you say in five clear seconds decides how it ends.",
  disciplines: "Systems · World & level design · Traversal · Progression",
  scope: "Systems & World Designer · Team of 5",
  routingVerb: "See the systems",

  posterAlt: "Shattered Skies key art placeholder",

  vision:
    "Shattered Skies entwines two soldiers from enemy species that hold the same parasite, The Symbiochord. " +
    "These two characters do not share the same language, making communication difficult. The action takes place " +
    "in a dangerous and dynamic planetary system forcing them to cooperate to survive and decide whether to trust " +
    "the person they were raised to hate. I mainly designed the world they move through and the systems that force them to " +
    "stay together. Planets and their physics, interdependent puzzles, the traversal mechanics and their power-ups and the " +
    "progression based in the learning and understanding of the universe.",

  designChallenge: {
    quote:
      "The main challenge as a designer in the level and world design was to make a planetary system that functions as a puzzle, " +
      "at the same time that it had to be as realistic as possible. The realistic approach made the learning easier for the players " +
      "when it comes to recognising the same patterns in physics in the game and in the real world. The main decision that connects all of " +
      "these decisions together is the moon Tidalor, since its path opens when the orbit pulls the tides low. Another example is " +
      "Dunestorm, whose gravity locks players until they learn how to upgrade their jetpacks. That's how progression becomes knowledge " +
      "advancing through systems observation.",
    engine: "Unity",
    system: "World design / physics / progression",
    resolution: "Make physics realistic for a better pattern recognition and progression based on knowledge.",
  },

  contributions: [
    {
      label: "The planetary system & the world design",
      description:
        "Researched real gravity, orbit and tide behaviour for the five worlds, so the physics are as natural and easier to learn for the players.",
    },
    {
      label: "Interdependent puzzle design",
      description:
        "Designed the interdependency of the puzzles, requiring cooperation, simultaneous action and timing within the gameplay's asymmetry.",
    },
    {
      label: "Traversal & asymmetry mechanics",
      description:
        "All movement design: the two bodies with opposite strengths, jetpacks sensitive to weight and the shared fuel supply, and their own cooperative mechanics like the boost.",
    },
    {
      label: "Progression based on knowledge",
      description:
        "Inspired by metroidvania's world comprehension instead of systems upgrades. Players need to understand the world for powering-up and progressing.",
    },
  ],
};
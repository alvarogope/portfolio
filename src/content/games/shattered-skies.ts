import type { Project } from "../schema";

export const shatteredSkies: Project = {
  slug: "shattered-skies",
  title: "Shattered Skies",
  tagline: "A fractured world, a united purpose. Two enemies, one life, and a voice that will not carry.",
  pillar: true,

  facts: { engine: "Unity", role: "Systems & World Designer", team: "Team of 5", year: "2025" },
  links: [],

  eyebrow: "UNITY · TEAM OF 5 · 2025",
  systemsHook: "Two players share one life and cannot understand each other. What you say in five clear seconds decides how it ends.",
  disciplines: "Systems · World & level design · Traversal · Progression",
  scope: "Systems & World Designer · Team of 5",
  routingVerb: "See the systems",

  posterAlt: "Shattered Skies key art placeholder",

  vision:
    "Shattered Skies binds two soldiers of enemy species to a single parasite, the Symbiochord: it fuses their fates so that if one dies, both die, and it inflicts pain when they fight or drift apart. They cannot speak a shared language. Across a hand-built miniature solar system, they must cooperate to survive, and along the way decide whether to trust the person they were raised to hate. I designed the world they move through and the systems that force them together: the planets and their physics, the interdependent puzzles, the traversal, and the knowledge-gated progression that turns understanding the universe into the way forward.",

  /* The five worlds now live in src/content/shattered-skies-planets.ts, with the
     full survey data the planetary dossier and the orrery both read. */

  designChallenge: {
    quote:
      "The planetary system had to be a puzzle in itself, not a backdrop. I researched how gravity, orbit, and tides actually behave, then built each planet so that understanding it was the way to progress: Tidalor's paths open only when the moon it orbits pulls the tides low, and Dunestorm's gravity locks players in until they have learned to upgrade their thruster elsewhere. Progression is knowledge, not stats. Players advance by observing the system, forming a theory, and testing it, which is the metroidvania loop rebuilt around a solar system.",
    engine: "Unity",
    system: "World design / physics / progression",
    resolution: "Knowledge-gated a five-planet system where understanding the physics is the upgrade.",
  },

  contributions: [
    {
      label: "The planetary system & world design",
      description:
        "Designed the entire five-planet solar system: each planet's ecosystem, hazards, and secrets, researched against real gravity and orbital behaviour so that physics is a mechanic. This is level design at the scale of a solar system.",
    },
    {
      label: "Interdependent puzzle design",
      description:
        "Designed the cooperative puzzles so that neither player can solve them alone, requiring simultaneous action, shared timing, and each player's asymmetric ability to complete.",
    },
    {
      label: "Traversal & asymmetry",
      description:
        "Designed all traversal: the fuel-limited, weight-sensitive jetpacks (lighter Aevi flies better), the mid-air collision booster that rewards moving as one, and the character asymmetry where Drayk builds with the environment while Aevi moves objects without changing them, abilities that look alike but play completely differently.",
    },
    {
      label: "Knowledge-gated progression",
      description:
        "Built the metroidvania progression around understanding rather than upgrades: players unlock the system by learning how it works, turning observation and deduction into the core advancement loop.",
    },
  ],
};
import type { Project } from "../schema";

export const shatteredSkies: Project = {
  slug: "shattered-skies",
  title: "Shattered Skies",
  tagline: "A fractured world, a united purpose. Two enemies, one life, and a voice that will not carry.",
  pillar: true,

  facts: { engine: "Unity", role: "Systems & World Designer", team: "Team of 5", year: "2025" },
  /* The subpage. The main page was condensed to the built, working game; the
     full story, the world's soul and the design reasoning live here. Named for
     what a reader gets rather than for the site's structure. */
  links: [{ label: "The world & the reasoning", url: "/shattered-skies/world" }],

  eyebrow: "UNITY · TEAM OF 5 · 2025",
  systemsHook: "Two players share one life and cannot understand each other. What you say in five clear seconds decides how it ends.",
  disciplines: "Systems · World & level design · Traversal · Progression",
  scope: "Systems & World Designer · Team of 5",
  routingVerb: "See the systems",

  posterAlt: "Shattered Skies key art placeholder",

  /* The parasite's MECHANICS are deliberately not described here. `premise` in
     shattered-skies-overview.ts owns them and states them two sections later,
     and §07's telepathy block states their consequence. The vision names the
     Symbiochord and moves on to what I designed, which is what this paragraph
     is for. */
  vision:
    "Shattered Skies binds two soldiers of enemy species to a single parasite, the Symbiochord, and gives them no shared language. Across a hand-built miniature solar system they have to cooperate to survive, and decide along the way whether to trust the person they were raised to hate. I designed the world they move through and the systems that force them together: the planets and their physics, the interdependent puzzles, the traversal, and the knowledge-gated progression that turns understanding the universe into the way forward.",

  /* The five worlds now live in src/content/shattered-skies-planets.ts, with the
     full survey data the planetary dossier and the orrery both read. */

  designChallenge: {
    quote:
      "The planetary system had to be a puzzle in itself, not a backdrop. I researched how gravity, orbit, and tides actually behave, then built each planet so that understanding it was the way to progress: Tidalor's paths open only when the moon it orbits pulls the tides low, and Dunestorm's gravity locks players in until they have learned to upgrade their thruster elsewhere. Progression is knowledge, not stats. Players advance by observing the system, forming a theory, and testing it, which is the metroidvania loop rebuilt around a solar system.",
    engine: "Unity",
    system: "World design / physics / progression",
    resolution: "Knowledge-gated a five-planet system where understanding the physics is the upgrade.",
  },

  /* ONE LINE EACH, AND THAT IS THE WHOLE POINT.

     This block used to be the last thing on an 8,000-word page: four
     paragraphs re-describing the jetpacks, the collision booster, the planetary
     system and the gating rule, all of which are designed in full further down.
     The ownership map called it "a fourth recap after 8,000 words".

     It now sits at position 04, directly after the team context, where the same
     four claims read as a promise of what is coming rather than a summary of
     what has gone. Moving it without cutting it would only have relocated the
     recap, so each entry is one sentence that NAMES the contribution and hands
     off. Nothing here explains a mechanic; the sections below do that, once. */
  contributions: [
    {
      label: "The planetary system & world design",
      description:
        "Five worlds researched against real gravity, orbit and tide behaviour, so the physics of the system is the thing the player is actually learning.",
    },
    {
      label: "Interdependent puzzle design",
      description:
        "Puzzles neither player can finish alone — built on simultaneous action, shared timing and the two characters' asymmetry.",
    },
    {
      label: "Traversal & asymmetry",
      description:
        "All movement design: two bodies with opposite strengths, a weight-sensitive jetpack on a shared fuel supply, and a boost that only exists when both players commit at once.",
    },
    {
      label: "Knowledge-gated progression",
      description:
        "A metroidvania built around comprehension instead of upgrades: the system opens as the players work out how it moves.",
    },
  ],
};
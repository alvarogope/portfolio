import type { Project } from "../schema";

export const breakIn: Project = {
  slug: "break-in",
  title: "Break-In",
  tagline: "A four-player stealth heist where no role can win alone, and nobody can speak.",

  facts: { engine: "Unity", role: "Lead Designer", team: "Team of 4", year: "2025" },
  links: [],

  eyebrow: "UNITY · TEAM OF 4 · LEAD DESIGNER · 2025",
  systemsHook: "Four asymmetric roles, no voice chat, eight minutes. Every ability is useless without a teammate.",
  disciplines: "Systems · Multiplayer · Level design · Audio direction",
  scope: "Lead Designer · Team of 4",
  routingVerb: "See the systems",

  posterAlt: "Break-In key art placeholder",

  vision:
    "Break-In is a four-player co-op stealthy bank heist game whose main mechanic is that players cannot talk with each other. " +
    "Instead, players can choose between four asymmetric roles (Hacker, Insider, Vaultsnatcher and the Lockpicker) to solve one " +
    "piece of the big puzzle that is the heist. The only way to coordinate is through some tools they are given in the " +
    "game. Steal as much as you can in eight minutes and escape together undetected. If one player gets caught, it is game over.",

  // Names only: RoleTerms reads them to highlight roles in prose. Each role's kit lives in break-in-roles.ts.
  roles: [
    { name: "The Hacker" },
    { name: "The Insider" },
    { name: "The Vaultsnatcher" },
    { name: "The Lockpicker" },
  ],

  designChallenge: {
    quote:
      "When we started designing the game, we thought to remove the voice channel from the very start. Therefore, coordination " +
      "had to become a mechanic itself and then I designed tools so this could be translated in-game. The Hacker's Vision became " +
      "a shared danger, for example. I wanted players to achieve communication through the systems that they were given, and my " +
      "job was to provide those systems.",
    engine: "Unity",
    system: "Co-op / detection / feedback",
    resolution: "Replaced voice chat with three coordination systems.",
  },

  contributions: [
    {
      label: "Lead design & direction",
      description:
        "Led the design team and communicated with the engineering team. Designed most of the design documents, like the roles, the mechanics, the puzzle and the balancing.",
    },
    {
      label: "Role & interdependency design",
      description:
        "Designed the four asymmetric roles and tuned them so cooperation truly worked and they needed each other to complete the game.",
    },
    {
      label: "Detection & feedback systems",
      description:
        "Designed the detection state machine and the danger signal.",
    },
    {
      label: "Pressure loop & difficulty",
      description:
        "Built the eight-minute pressure loop, the difficulty and the risk/reward design.",
    },
    {
      label: "Audio direction & level design support",
      description:
        "Directed the audio, clock and action cues. Co-designed the bank layout with the team's level designer.",
    },
  ],
};
import type { Project } from "../schema";

export const breakIn: Project = {
  slug: "break-in",
  title: "Break-In",
  tagline: "A four-player stealth heist where no role can win alone, and nobody can speak.",
  pillar: true,

  facts: { engine: "Unity", role: "Lead Designer", team: "Team of 4", year: "2025" },
  links: [],

  eyebrow: "UNITY · TEAM OF 4 · LEAD DESIGNER · 2025",
  systemsHook: "Four asymmetric roles, no voice chat, eight minutes. Every ability is useless without a teammate.",
  disciplines: "Systems · Multiplayer · Level design · Audio direction",
  scope: "Lead Designer · Team of 4",
  routingVerb: "See the systems",

  posterAlt: "Break-In key art placeholder",

  vision:
    "Break-In is a four-player co-op sealthy bank heist game which main mechanic is that players cannot talk with each other. " +
    "Intead, players can choose between four assymetric roles (Hacker, Insider, Vaultsnatcher and the Lockpicker) to solve one " +
    "piece of the big puzzle that is the heist. The only way to coordinate is throught some tools they are given in the " +
    "game. Steal as much as you can in eight minutes and escape together undetected. If one player gets caught, is game over.",

  roles: [
    {
      name: "The Hacker",
      brief: "The eyes. Watches the whole bank through CCTV and guides the team that cannot hear each other.",
      tools: "Hacker Vision highlights enemies through walls (5s, 30s cooldown). Distraction overloads lights and PCs to pull guards off their routes (7s, 10s cooldown). Reveals environmental clues that lower puzzle difficulty.",
      dependsOn: "The Insider, whose USB in the server room is what wakes the downstairs cameras.",
      neededBy: "Everyone. The Hacker is how a voiceless team sees danger.",
      accent: "silver",
    },
    {
      name: "The Insider",
      brief: "The key. Opens paths the Hacker cannot reach, and plants the hack that starts the digital heist.",
      tools: "Disguise as staff to pass through restricted rooms (10s, 60s cooldown). Finds the security card to reach the server room, where planting a USB grants the Hacker the digital-money hack. Scouts one of three random escape routes and lights the path for the team.",
      dependsOn: "The Hacker's vision to move unseen between disguises.",
      neededBy: "The Hacker, who cannot start the CBDC hack until the Insider plants the USB.",
      accent: "silver",
    },
    {
      name: "The Vaultsnatcher",
      brief: "The hands. Cracks the vault and lifts the gold, one second from setting off the alarm.",
      tools: "Finds the manager's password to open the vault. Swaps real gold ingots for weight-matched decoys; leaving one unreplaced for more than a second triggers the alarm and a 30-second escape window. Carries decoys two at a time, so the trip has to be made more than once.",
      dependsOn: "The Lockpicker, whose smoke kills the basement lasers on the way in.",
      neededBy: "The Lockpicker, who cannot start the digital transfer without the manager's password.",
      accent: "gold",
    },
    {
      name: "The Lockpicker",
      brief: "The way through. Opens locked doors, strips the digital money, and kills the lasers.",
      tools: "Picks locks through a timing puzzle; a failed attempt amplifies the noise, alerting guards within six metres instead of three. Steals digital money from hidden PCs. Carries three smoke bombs that reveal and disable the basement laser traps.",
      dependsOn: "The Hacker's vision to pick locks without a guard turning the corner.",
      neededBy: "The Vaultsnatcher, who cannot reach the gold until the lasers are down.",
      accent: "silver",
    },
  ],

  designChallenge: {
    quote:
      "The obvious way to build a co-op heist is to give players a voice channel and let them sort it out. I removed it on purpose. Without speech, coordination had to become a mechanic, so I built the tools to carry it. The Hacker's vision became a shared danger sense, camera signs marked where the Hacker was looking, and on-screen prompts became a shared language. The result is that communication is something players achieve through the systems, not something the systems assume.",
    engine: "Unity",
    system: "Co-op / detection / feedback",
    resolution: "Replaced voice chat with three diegetic coordination channels.",
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
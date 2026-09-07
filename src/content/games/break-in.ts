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
    "Break-In is a four-player co-op bank heist with a deliberate cruelty at its centre: the players cannot talk to each other. There is no voice channel by design. Instead, four asymmetric roles (Hacker, Insider, Vaultsnatcher, and Lockpicker) each hold one piece of a puzzle none of them can finish alone, and the only way to coordinate is through the tools the game gives them. Steal as much as you can in eight minutes, and escape together, undetected. If one player is caught, everyone loses.",

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

  /* Every bullet below maps to a section that shows the work. "The game modes,
     and the monetisation model" used to close the first one and no longer does:
     the game was never shipped, so there was no monetisation — that chapter was
     a GDD-completeness requirement rather than a designed deliverable — and the
     extra modes were an idea that was never built. Neither is a contribution to
     claim, so both were removed rather than given a section. Do not re-add them. */
  /* MOVED, AND CUT IN THE SAME CHANGE. This block used to close the page.
     After ~5,000 words it read as a recap of five sections the reader had
     already been through; at the §04 position, directly after the team note in
     §03, it reads as a promise of the six that follow. The ownership map's
     Merge #6.

     Moving an untrimmed recap only relocates it, so every enumeration went
     with the move. "Detection & feedback" used to name all three channels,
     which §07 draws; "Pressure loop" recapped §09's three balancing rules;
     "Role & interdependency" recapped §05's nine wires; "Audio direction"
     listed the three cues §08 now owns. Each bullet is one line and names the
     section that shows the work, so nothing here is the sole claim for
     anything. */
  contributions: [
    {
      label: "Lead design & direction",
      description:
        "Led the design across a team of four and authored most of the design document — the roles, the mechanics, the puzzle styles and the balancing.",
    },
    {
      label: "Role & interdependency design",
      description:
        "Designed the four asymmetric roles and tuned them so no seat can carry a run and none is dead weight. §05 draws the web.",
    },
    {
      label: "Detection & feedback systems",
      description:
        "Designed the detection state machine and the redundant danger signal that runs alongside it. §07 is the machine itself.",
    },
    {
      label: "Pressure loop & difficulty",
      description:
        "Built the eight-minute pressure loop, the adaptive difficulty under it, and a reward model that pays out on a failed run. §03 and §09.",
    },
    {
      label: "Audio direction & level design support",
      description:
        "Directed the audio — score, clock and action cues — and co-authored the bank layout with the team's level designer. §06 and §08.",
    },
  ],
};
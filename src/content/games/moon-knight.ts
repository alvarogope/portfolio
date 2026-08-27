import type { Project } from "../schema";

export const moonKnight: Project = {
  slug: "moon-knight",
  title: "Moon-Knight",
  tagline: "Dark fantasy action RPG. Solo project, full authorship.",
  pillar: true,

  facts: {
    engine: "Unreal Engine 5",
    role: "Solo developer",
    team: "Solo",
    year: "2025",
  },

  links: [
    { label: "Design summary (PDF)", url: "#" },
    { label: "Game engineering", url: "/moon-knight/engineering" },
    { label: "Quantum toolkit", url: "/moon-knight/engineering/quantum" },
  ],

  eyebrow: "UE5 · C++ & BLUEPRINTS · SOLO PROJECT · 2025",
  systemsHook: "Five combat abilities built on real quantum computing principles.",
  disciplines: "Systems · Quantum design · C++ · UI/UX · Level design",
  scope: "Solo · full authorship",
  routingVerb: "See the systems",

  posterAlt:
    "Moon-Knight key art. Armoured knight beneath a full moon, moon-phase health bar on the breastplate.",
  showcase: "Shown at Develop:Brighton 2025",

  vision:
    "Moon-Knight asks a question most action RPGs never do: what if the game's fantasy powers obeyed the rules of quantum physics? I designed five combat abilities from real quantum principles, wove them into the lore of the Old Gods, and built the systems that make them feel dangerous to use. It began as my MA dissertation, where the theoretical research and the playable game were one project, both awarded a Distinction, and it continues now as a personal engineering project rebuilding those mechanics in C++.",

  contributions: [
    {
      label: "Systems & combat design",
      description:
        "Designed the full combat loop: combos, the five quantum abilities, a dual skill tree, and the boss encounters that teach each mechanic under pressure.",
    },
    {
      label: "Quantum ability design",
      description:
        "Translated five quantum-computing principles (decoherence, entanglement, NOT gates, Majorana states, and time-state superposition) into abilities a player can feel, each with a distinct risk profile.",
    },
    {
      label: "Anti-farming economy",
      description:
        "Built the White Rose XP economy: experience exists only as roses stained in boss blood, so the game cannot be ground out. Difficulty is regulated by the player getting better, not the character getting stronger.",
      accent: "scarlet",
    },
    {
      label: "Diegetic UI",
      description:
        "Kept the interface inside the world: a moon-phase health bar on the armour, a cooldown ring around it, and the knight raising his sword to catch moonlight instead of consulting a compass.",
    },
    {
      label: "Engineering",
      description:
        "Built the game in Unreal Engine 5 with C++ and Blueprints, including behaviour-tree AI, data-driven equipment, and a Game Instance persistence layer, and am now rebuilding the quantum mechanics as a standalone C++ library.",
    },
  ],

  videoId: undefined,
  videoCaption:
    "Gameplay demo. The design summary documents which mechanics the prototype realised and which exceeded what Blueprints can simulate.",

  abilities: [
    {
      name: "Master of Matters",
      body: "Commit to an element before the fight, and the fight can't take it from you. Fire, lightning, or water bonds to your blade and holds even against enemies whose defences strip ordinary elemental attacks. The ability rewards players who learn the bestiary: fire for the wooden humanoids, lightning for the banshees, and the wrong choice wastes your only equipped slot.",
      annotation: "Quantum basis · Majorana states · topologically protected qubits",
      availableTo: ["Player", "Enemy"],
    },
    {
      name: "Instability",
      body: "Instability punishes anyone who fights near walls. The orb changes size, speed, and path every time it touches the environment, so positioning becomes part of dodging: against a boss who throws it, observant players bait the attack into open ground where it stays readable. Cast it yourself in a cramped corridor and you're gambling, because the same chaos that shreds enemies can become unreadable for you.",
      annotation: "Quantum basis · qubit instability (decoherence) · superposition",
      availableTo: ["Player", "Enemy"],
    },
    {
      name: "Inversion",
      body: "Some boss attacks are too wide to dodge, by design. Inversion is the answer key: read the incoming attack, time the counter, and flip it into healing instead of damage. It is the parry philosophy pushed further, where the most dangerous attacks in the game become the biggest heals for players brave enough to stand in them, and bosses can invert your unstable attacks right back, so the tool you master is also the one you learn to fear.",
      annotation: "Quantum basis · NOT gates · qubit state inversion",
      availableTo: ["Player", "Enemy"],
    },
    {
      name: "Elliptical Force",
      body: "Two orbs orbit the target from opposite sides and slowly converge. The safe zone shrinks with every revolution, forcing a decision now rather than a perfect dodge later: spatial pressure as an attack. Defensively it doubles as a catch, because an incoming sphere can be bound into the orbit instead of dodged, turning an enemy's projectile into part of your own attack.",
      annotation: "Quantum basis · entanglement · correlated qubit convergence",
      availableTo: ["Player", "Enemy"],
    },
    {
      name: "Double Superposition",
      body: "The one power the player never gets, deliberately. Enemies rewind themselves one second: the killing blow you just landed un-happens, the attack you dodged re-times itself, the boss heals through your critical. Players learn the principle by fighting it rather than casting it, and beating an enemy who can undo your best moment forces you to build an advantage they cannot rewind, not one lucky hit.",
      annotation: "Quantum basis · double superposition · one-second state restoration · enemy-exclusive by design",
      availableTo: ["Enemy"],
    },
  ],

  designChallenge: {
    quote:
      "The mechanics were designed to be quantum, but Unreal's Blueprints have no native way to reverse time or hold a true superposition. Rather than fake it and pretend, I documented exactly where each mechanic exceeded the engine, from Instability's orbs becoming undodgeable when they mutated on collision to time-reversal degrading into a random delay, and used those honest negative results as the design brief for the C++ rebuild.",
    engine: "Unreal Engine 5",
    system: "Blueprints / C++",
    resolution: "Documented the feasibility gap and carried it into a standalone C++ toolkit.",
  },

  engineeringNote: {
    designedYear:
      "2025: designed all five mechanics and documented why Blueprints could not fully simulate them.",
    engineeringYear:
      "2026: rebuilding them in C++ as an engine-agnostic quantum toolkit, statistically verified.",
    repoUrl: undefined,
    currentStatus:
      "Core library and two of five mechanics complete and statistically verified. The remaining mechanics are recombinations of the same verified primitives.",
  },

  /* The controls diagram used to be the third entry here. It is now the
     coded pad in section 09 (`ControllerMap`), beside the diegetic systems
     it is evidence for — a picture of a mapping could not be read aloud,
     themed or corrected. `controls.png` stays in /public as the source the
     bindings were transcribed from. */
  gallery: [
    {
      src: "/images/moon-knight/boss-werewolf.png",
      alt: "The Werewolf boss encounter at night, with a named enemy health bar",
      caption: "Boss encounter. The Werewolf, one of the fights that teaches a quantum ability under pressure, with the named enemy health bar.",
    },
    {
      src: "/images/moon-knight/world-map.jpg",
      alt: "Hand-drawn world map showing regions, rose collectibles, and the Old Gods quest locations",
      caption: "World map. Five regions gated by the White Rose collectibles and the Old Gods quests that grant each power.",
    },
  ],
};
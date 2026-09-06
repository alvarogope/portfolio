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
    /* No "Design summary (PDF)" entry until the PDF exists — the links list renders
       unconditionally, so a "#" url ships as a live link to nowhere. */
    { label: "Game engineering", url: "/moon-knight/engineering" },
    { label: "Quantum toolkit", url: "/moon-knight/engineering/quantum" },
    /* The third subpage. The main page was condensed to the built work; the
       story, the cast, the symbolism and the score live here in full. Named
       for what a reader gets rather than for the site's structure. */
    { label: "The world & the score", url: "/moon-knight/world" },
  ],

  eyebrow: "UE5 · C++ & BLUEPRINTS · SOLO PROJECT · 2025",
  systemsHook: "Five combat abilities built on real quantum computing principles.",
  disciplines: "Systems · Quantum design · C++ · UI/UX · Level design",
  scope: "Solo · full authorship",
  routingVerb: "See the systems",

  posterAlt:
    "Moon-Knight key art. Armoured knight beneath a full moon, moon-phase health bar on the breastplate.",
  showcase: "Shown at Develop:Brighton 2025",

  /* Trimmed to the pitch and the provenance. The closing clause about the C++
     rebuild was cut: §12 tells that story properly, with a timeline and two
     links, and this was its fourth telling counting both engineering pages. */
  vision:
    "Moon-Knight asks a question most action RPGs never do: what if the game's fantasy powers obeyed the rules of quantum physics? I designed five combat abilities from real quantum principles, wove them into the lore of the Old Gods, and built the systems that make them dangerous to use. It began as my MA dissertation — the theoretical research and the playable game were one project, both awarded a Distinction.",

  /* THE BREADTH BLOCK, AND THE RULE IT NOW KEEPS.
     Five disciplines named in a recruiter's vocabulary, in about 100 words.
     Its job is to say WHAT WORK WAS DONE — not to preview the sections that
     show it. Four of these bullets used to do both, and the overlap was
     verbatim: the five quantum principles were listed here and again in the
     sigil readout, the roses appeared here and in `white-rose-xp`, and the
     moon HUD and the moonlight compass were named here and in the diegetic
     thesis. Each bullet now names the deliverable and the judgement behind
     it, and lets the owning section carry the example. */
  /* WHAT ACTUALLY RUNS, in one sentence, under the vision on §01.
     The overview's job is "what is the game, and what of it works" — the
     vision answers the first half and this answers the second. It names no
     system that a section below then re-describes: the COUNTS beside it are
     derived from the data at render time, and the qualities here are the ones
     no count can carry (solo, shippable, shown to the public). */
  built:
    "It is not a prototype: the game is playable end to end, and every part of it is mine — the " +
    "systems, the levels, the creatures, the interface, the C++ and Blueprint that runs it, and " +
    "the score underneath it.",

  contributions: [
    {
      label: "Systems & combat design",
      description:
        "Designed the full combat loop: combos, the five quantum abilities, a dual skill tree, and the boss encounters that teach each mechanic under pressure.",
    },
    {
      label: "Quantum ability design",
      description:
        "Derived five combat abilities from real quantum-computing principles, each with its own risk profile and its own way of going wrong in the player's hands.",
    },
    {
      label: "Anti-farming economy",
      description:
        "Built the White Rose XP economy and the progression it feeds: a currency the player cannot manufacture, and a difficulty curve tuned on that assumption.",
      accent: "scarlet",
    },
    {
      label: "Diegetic UI",
      description:
        "Designed an interface with no HUD overlay — every readout the player needs replaced by something in the world — and decided the one place where a conventional menu was still the better tool.",
    },
    {
      label: "Engineering",
      description:
        "Built the game in Unreal Engine 5, and drew the line the codebase still follows: what earns its place in C++, and what is better left as a Blueprint graph.",
    },
  ],

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
     coded pad in section 06 (`ControllerMap`), beside the diegetic systems
     it is evidence for — a picture of a mapping could not be read aloud,
     themed or corrected. `controls.png` stays in /public as the source the
     bindings were transcribed from. */

  /* NO `gallery` FIELD ANY MORE, AND THAT IS THE POINT.
     The section-ownership map's verdict on the page-foot gallery was
     `Dissolve`: every caption re-explained a section above it. The still
     (`boss-werewolf.png`) is now absorbed onto the Werewolf's bestiary card,
     where it is evidence beside the claim it proves. The three video loops
     were promoted rather than absorbed — they are the only proof the game
     RUNS, and absorbing them would have scattered them past where a first-pass
     reader stops. They now lead the page from
     `src/content/moon-knight-in-motion.ts`, which owns them.
     `Project.gallery` stays optional in the schema; other projects still use
     it. */
};
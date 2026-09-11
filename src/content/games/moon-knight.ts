import type { Project } from "../schema";

export const moonKnight: Project = {
  slug: "moon-knight",
  title: "Moon-Knight",
  tagline: "Dark Fantasy Action RPG. Solo project, Full Authorship.",
  pillar: true,

  facts: {
    engine: "Unreal Engine 5",
    role: "Solo Developer",
    team: "Solo",
    year: "2025 - Present",
  },

  links: [
    { label: "Game Engineering", url: "/moon-knight/engineering" },
    { label: "Quantum Toolkit", url: "/moon-knight/engineering/quantum" },
    { label: "The World & The Music", url: "/moon-knight/world" },
  ],

  eyebrow: "UE5 · C++ & BLUEPRINTS · SOLO PROJECT · 2025 - Present",
  systemsHook: "Five combat abilities built on real quantum computing principles.",
  disciplines: "Systems Design · Quantum Design · Combat Design · C++ · Level Design · UI/UX ",
  scope: "Solo · full authorship",
  routingVerb: "See the systems",

  posterAlt:
    "Moon-Knight key art. Armoured knight beneath a full moon, moon-phase health bar on the breastplate.",
  showcase: "Shown at Develop:Brighton 2025",

  vision:
    "Moon-Knight is an action RPG where I tried to think on how could Quantum Computing principles change RPGs mechanics. " + 
    "I designed five combat abilities from these principles and built the systems. " + 
    "It began as my MA dissertation to research what this cutting edge technology could change the designing side of video games, while " + 
    "also design every single aspect of it.",

  built:
    "I developed the a prototype. The Tutorial is fully playable where the main mechanics and systems are introduced." +
    " I built all the systems, the level design, the enemies, the interface, the C++ and the Blurptints that makes the game " +
    " and the music and audio design of the game.",

  contributions: [
    {
      label: "Systems & combat design",
      description:
        "Designed the full combat loop: combos, the five quantum abilities, a dual skill tree and the boss encounters showing each mechanic.",
    },
    {
      label: "Quantum abilities design",
      description:
        "Extrapolated quantum computing principles and translated them into video games. " + 
        "Each of them have their own risks and rewards, making the player to learn how to use them",
    },
    {
      label: "Anti-farming Skill Points",
      description:
        "Built the White Rose XP and its progression. The player's have to earn the XP by playing and defeating enemies.",
      accent: "scarlet",
    },
    {
      label: "Design Decisions",
      description:
        "I designed the interfac with a diegetic approach. By making the UI like this, " + 
        "I put what the player can see on screen first without adding HUD and just blend these in the game world.",
    },
    {
      label: "Engineering",
      description:
        "Built the game in Unreal Engine 5. For the prototype, I firstly used Blueprints for a faster prototype. " +
        "Then I rebuilt the codebase in C++ for a better performance.",
    },
  ],

  abilities: [
    {
      name: "Master of Matters",
      body: "Embed the sword with different elements: Fire, Lightning and Water. This applies more damage and is very effective against enemies " +
            "made out of a certain material or whose defences are very useful against normal melee attacks. " +
            "The ability rewards players wholearn the enemies defences and penalised players by wasting an equipped slot.",
      annotation: "Quantum basis · Majorana states · topologically protected qubits",
      availableTo: ["Player", "Enemy"],
    },
    {
      name: "Instability",
      body: "This ability is based in the instability of a qubit when it is exposed to the environment. " +
            "This ability casts an orb that changes size, speed and path every time is in contact with the environment. " +
            "Positioning becomes part of the gameplay as well as knowing the environment where your casting these abilities. " +
            "The closer to the wall, the more difficult to dodge these attacks. " + 
            "Creating a good balance for enemies that take advantage of narrow environments, where melee attacks are not effective.",
      annotation: "Quantum basis · qubit instability (decoherence) · superposition",
      availableTo: ["Player", "Enemy"],
    },
    {
      name: "Inversion",
      body: "Some boss attacks are very difficult to dodge, by design. Inversion is very helpful for this. This ability reads the damage that the " +
            "attacks makes and flips it to negative, becoming a healing mechanic. It is a basic parry, but pushed further where the most dangeorus " +
            "attacks in the game can safe the player, in a game where healing is limited. It is a high risk, high reward situation where skilled players " +
            "can take advantage of aggresive bosses. This ability can also be used by bosses and invert the damage you try to apply to them.",
      annotation: "Quantum basis · NOT gates · qubit state inversion",
      availableTo: ["Player", "Enemy"],
    },
    {
      name: "Elliptical Force",
      body: "This ability is based on the entanglement of two qubits. It casts two orbs moving in circles, but leaves the enemy in the middle " +
            "and eventually converging. As a blocking method, if a sphere attack is thrown to the player, they can protect themselves" + 
            "using this ability, making the entanglement happen.",
      annotation: "Quantum basis · entanglement · correlated qubit convergence",
      availableTo: ["Player", "Enemy"],
    },
    {
      name: "Double Superposition",
      body: "This ability is exclusive to enemies. The ability rewinds on the state of the enemy one second. " +
            "This means that enemies can heal, dodge your attack by reposition themselves and attack in a unexpected way, " +
            "exposing the player if they are not paying attention to the fight.",
      annotation: "Quantum basis · double superposition · one-second state restoration · enemy-exclusive by design",
      availableTo: ["Enemy"],
    },
  ],

  designChallenge: {
    quote:
      "The game was designed to have video game mechanics inspired by quantum computing, trying to imagine how this technology could change the media " +
      "without the breaking the main rules of video games and interactive media. Unreal Engine's Blueprints don't have a way to represent them properly. " +
      "I documented where this technology could excell in the video game media and where it felt like quantum computing was unnecessary. " +
      "The quantum skill tree was the best way to translate these principles. I am rebuilding the codebase using a C++17 library called QPP that " + 
      "uses a quantum library, as well as researching how to use this technology to improve the media.",
    engine: "Unreal Engine 5",
    system: "Blueprints / C++",
    resolution: "Documented the technology limitations and carried it into a C++17 quantum toolkit.",
  },

  engineeringNote: {
    designedYear:
      "2025: Designed all five quantum mechanics and documented why Blueprints could not fully represent them.",
    engineeringYear:
      "2026: Building them in C++ as a quantum toolkit that can be used in every engine, statistically verified.",
    repoUrl: undefined,
    currentStatus:
      "Developing a quantum toolkit and verifying the mechanics statistically.",
  },

};
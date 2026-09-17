export interface MechanicMeta {
  id: string;
  order: string;
  kicker: string;
  title: string;
  standfirst: string;
}

export interface Reasoning {
  decision: string;
  why: string;
  impact: string;
}

export interface Spine {
  tag: string;
  body: string;
  note: string;
}

export const spine: Spine = {
  tag: "The throughline",
  body:
    "The two characters belong to two different species. They don't share language, so when we built " +
    "these systems we had to consider this barrier and the way cooperation should work without communiation. " +
    "So the players could feel comfortable with the system we decided to enhance this cooperation by having it " +
    "through the whole game, like in the ship and the jetpack boost.",
  note:
    "The design reasoning was more centred about “how do we make trust cost something”. Then the system " +
    "had to be arround not having a voice chat and design problems they can solve without them.",
};

/* ==========================================================================
   01 · THE COMMUNICATION SYSTEM — the signature mechanic
   ==========================================================================
*/

export interface CommChannel {
  id: string;
  order: string;
  label: string;
  tag: string;
  body: string;
  reasoning: Reasoning;
  emphasis?: "meta" | "payoff";
}

export interface CommunicationSection {
  meta: MechanicMeta;
  lead: string;
  channels: readonly CommChannel[];
  close: string;
}

export const communication: CommunicationSection = {
  meta: {
    id: "communication",
    order: "1",
    kicker: "The Main Mechanic",
    title: "Characters with a Different Language",
    standfirst:
      "Drayk and Aevi do not share the same language and we had to make that miscommunication " +
      "exist within the game.",
  },

  lead:
    "We tried to twist how co-op games are usually designed, because they have a channel and build trust " +
    "through it. However, we were taking that away, so we had to design some other kind of communication channel.",

  channels: [
    {
      id: "voice",
      order: "1",
      label: "Distorted voice chat",
      tag: "Unity Voice Channel Distortion plugin",
      body:
        "Voice chat is run through a distortion plugin in Unity. " +
        "The only thing that players can receive is the tone, but not the words.",
      reasoning: {
        decision:
          "It breaks the voice channel and it is present since the beginning of the game.",
        why:
          "These two characters cannot understand each other. If the voice chat was completely removed the experience " +
          "would have been less genuine, but we wanted to create the sensation that the characters are able to communicate " +
          "but they simply cannot understand each other at all. Adding the distortion just keeps the character audible but " +
          "without any meaning, adding up to the kind of story we were trying to tell. This also protects the dual narrative, " +
          "as it gives the players different stories that they cannot share through any channel.",
        impact:
          "We noticed that the players focused on playing and not on talking. Voice could have a specific tone but " +
          "does not have any meaning at all. This builds-up mistrust or the opposite when reading the others behaviour.",
      },
    },
    {
      id: "out-of-game-rule",
      order: "2",
      label: "A rule outside the game",
      tag: "",
      emphasis: "meta",
      body:
        "Players have to agree to not talk the game while they are playing. This restriction has to " +
        "exists outside the game to keep the intention of the whole design.",
      reasoning: {
        decision:
          "For experiencing the game as it was designed, we asked the players to not talk outside of the sessions.",
        why:
          "The game design decisions were focused on miscommunication and this is also part of thhe story. " +
          "We expect the players to respet these rules. Shattered Skies could have shared a chat and make it as " +
          "most of every co-op game, but the ambiguity is what this game was build from and every decision was taken " +
          "towards that direction. Player can break it, but they will not experience the game properly.",
        impact:
          "Players become part of the barrier the games require. This is the first cooperative mechanic. " +
          "Eventually, this could grow in them as suspicion or trust.",
      },
    },
    {
      id: "gestures",
      order: "3",
      label: "Gestures get lost in translation",
      tag: "Some render differently per player",
      body:
        "Simple gestures, but some render differently to each player, so even body " +
        "language is lost in translation.",
      reasoning: {
        decision:
          "This give the player a non-verbal expression, but for each character means different things.",
        why:
          "We thought that different cultures could have different meaning for each gestures, this could be " +
          "part of the miscommunication system. This doesn't work in all gestures since sometimes players need " +
          "to know the minimum to understand each other.",
        impact:
          "Players ended up sharing a gestures languge for themsleves and communicate without talking. " +
          "Through try an error they were able to relate actions to gestures.",
      },
    },
    {
      id: "telepathy",
      order: "4",
      label: "Telepathy window",
      tag: "5 seconds with the voice filter off",
      emphasis: "payoff",
      body:
        "This resource grants five seconds with the filter off and voice chat perfectly clear. It is a rare one. " + 
        "It is not too long for building a proper phrase, but give the opportunity to communicate through a voice. " +
        "Players can use this for lying too. Linking this to the Lie ending.",
      reasoning: {
        decision:
          "We wanted to give the players at least one chance to talk with each other before the ending " +
          "and even relate to it.",
        why:
          "If talking is constant, it stops being a design decision that was set at the tutorial. " +
          "This unique opportunity turns it into a great decision for the players: what is worth " +
          "saying? Connceting it to the ending is what makes it an interesting mechanic since they " +
          "can also lie to each other, which was impossible during the game.",
        impact:
          "This five seconds of communication becomes a prisoner's dilemma. Players used this window " +
          "for warning, planning, confession or liying, getting the to the ending they want to get.",
      },
    },
  ],

  close:
    "The reason behind this was to let the players decide a single moment of communication. " +
    "However, every single mechanic embraces the misscommunication, while the telepathy permits what " +
    "players have been missing the whole game.",
};

/* ---- the telepathy → endings flow ---------------------------------------*/

export type FlowTone = "truth" | "deceit";
export type EndingTone = "unity" | "betrayal" | "destruction";

export interface FlowChoice {
  id: string;
  tone: FlowTone;
  label: string;
}

export interface FlowEnding {
  id: string;
  tone: EndingTone;
  name: string;
  combo: string;
  from: readonly FlowTone[];
}

export interface TelepathyFlow {
  title: string;
  caption: string;
  summary: string;
  window: { column: string; label: string; seconds: number };
  choicesLabel: string;
  choices: readonly FlowChoice[];
  endingsLabel: string;
  endings: readonly FlowEnding[];
  note: string;
}

export const telepathyFlow: TelepathyFlow = {
  title: "How the Telepathy Works",
  caption:
    "Here is a graph explaining the mechanic",
  summary:
    "A flow in three columns. On the left, the telepathy window: five seconds of clear speech, " +
    "granted by a rare resource. In the middle, the choice each player makes inside it — speak " +
    "true or speak false. On the right, the three endings those choices feed: both true leads " +
    "toward Unity, one lie toward Betrayal, and two lies toward Mutual Destruction.",
  window: {
    column: "The resource",
    label: "The telepathy window",
    seconds: 5,
  },
  choicesLabel: "Each player decision",
  choices: [
    {
      id: "truth",
      tone: "truth",
      label: "Speak true",
    },
    {
      id: "deceit",
      tone: "deceit",
      label: "Speak false",
    },
  ],
  endingsLabel: "Link to endings",
  endings: [
    {
      id: "unity",
      tone: "unity",
      name: "Unity",
      combo: "Both spoke true",
      from: ["truth"],
    },
    {
      id: "betrayal",
      tone: "betrayal",
      name: "Betrayal",
      combo: "One of the two lied",
      from: ["truth", "deceit"],
    },
    {
      id: "mutual-destruction",
      tone: "destruction",
      name: "Mutual Destruction",
      combo: "Both spoke false",
      from: ["deceit"],
    },
  ],
  note:
    "This window does not pick the ending by itself, only the final decision does. This moment " +
    "can be used to expresss what players know and believes or the complete opposite",
};

/* ==========================================================================
   02 · THE SPACESHIP HUB — compact
   ==========================================================================
*/

export interface ShipStation {
  id: string;
  name: string;
  role: string;
}

export interface RepairsPointer {
  label: string;
  body: string;
  pointer: string;
  linkLabel: string;
}

export interface ShipSection {
  meta: MechanicMeta;
  inspiration: { ref: string; body: string };
  lead: string;
  dualControl: Reasoning;
  stationsLabel: string;
  stations: readonly ShipStation[];
  repairs: RepairsPointer;
  designPoint: string;
}

export const ship: ShipSection = {
  meta: {
    id: "ship",
    order: "2",
    kicker: "Cooperative move",
    title: "The Spaceship",
    standfirst:
      "The home base. Players will have to learn how to use it to navigate through the planetary system.",
  },

  inspiration: {
    ref: "Combined driving",
    body:
      "The reference we took as a team and what we wanted from it. We wanted the players " + 
      "to cooperate in a ship where the controls were phisically distributed. This helped to " +
      "understand cooperation without communication.",
  },

  lead:
    "The ship is the way players navigate through planets, but it is also the main hub and their safe place. " +
    "To control it, it takes both of them, as steering, shields, cannons and radars are in separate rooms, making " +
    "the players to physically move and coordinate: one is steering while the other one turns on the sields. " +
    "We gave the ship realistic weight and inertia, making the navigation difficult even through communication.",

  dualControl: {
    decision:
      "The functions of the spaceship are distributed and it has real mass, so it cannot be fixed instantly.",
    why:
      "Both players have to cooperate even in the most basic movement. Spreading the functions makes the " +
      "navigation a kind of communication.",
    impact:
      "Players ended up auto-organising in roles and then when the ship got damaged, they would change them. " +
      "This kind of cooperation to one of the most important mechanic helped them in future puzzles.",
  },

  stationsLabel: "The main ship systems",
  stations: [
    {
      id: "steer",
      name: "Steering",
      role: "Heading and thrust. Weight and inertia are real, forcing turns to begin early.",
    },
    {
      id: "shield",
      name: "Shields",
      role: "Directional cover. To hold one arc makes another one open.",
    },
    {
      id: "cannons",
      name: "Cannons",
      role: "Clears asteroids and hostiles, can be aimed independently of where the ship points to.",
    },
    {
      id: "radar",
      name: "Radar",
      role: "Reads hazards, space trash and celestial bodies.",
    },
  ],

  repairs: {
    label: "Repair",
    body:
      "The ateroids and space hazards can damage the ship, which then has to be repaired. The repair becomes " +
      "a minigame, so players can still navigate.",
    pointer:
      "They are three minigames: circuit realignment, seal the breach and calibrate sensors. Each one " +
      "divides the knowledge and control between the two players.",
    linkLabel: "how the three mini-games work",
  },

  designPoint:
    "We were trying to make cooperation mechanical and intuitive as possible in the spaceship. " +
    "Helpful for future puzzles and forcing it in the most important mechanic.",
};

/* ==========================================================================
   03 · ASYMMETRIC TRAVERSAL — compact
   ==========================================================================
*/

export interface HostBody {
  id: "aevi" | "drayk";
  name: string;
  build: string;
  body: string;
}

export interface JetpackUse {
  id: string;
  label: string;
  body: string;
}

export interface TraversalSection {
  meta: MechanicMeta;
  lead: string;
  bodiesLabel: string;
  bodies: readonly HostBody[];
  jetpackLabel: string;
  jetpackBody: string;
  jetpackUses: readonly JetpackUse[];
  booster: { label: string; body: string; reasoning: Reasoning };
}

export const traversal: TraversalSection = {
  meta: {
    id: "traversal",
    order: "03",
    kicker: "Movement",
    title: "Sharing a Fuel Tank",
    standfirst:
      "The characters move assymetrically, but they share the same tank that makes their jetpacks function.",
  },

  lead:
    "Both characters have different traversal mechanics. Aevi is small, quick and doesn't jump far. " +
    "Drayk is big, slow and jumps high. Both their bodies show how they moves work and how they could " +
    "help each other with. Many puzzles are designed around this: one reaches a ledge and the other one helpes to reach it. " +
    "This makes both characters well-balanced.",

  bodiesLabel: "The two bodies",
  bodies: [
    {
      id: "aevi",
      name: "Aevi",
      build: "Small · quick · short jump",
      body:
        "Runs fast and can fit where Drayk can't, but needs him for jumping far. The jetpack takes her " +
        "higher due to her lightweight and consumes less fuel. This makes her strong when the players need to be " + 
        "quick.",       
    },
    {
      id: "drayk",
      name: "Drayk",
      build: "Large · slow · long jump",
      body:
        "Can reach through jumping where Aevi cannot, however, he burns the fuel faster than her when using " +
        "a jetpack, but very useful when strength is required.",
    },
  ],

  jetpackLabel: "Jetpacks",
  jetpackBody:
    "Both have access to a jetpack from the very beginning, permitting this move from the start. " +
    "They are limited by fuel and they are sensitive to the character's weight. Aevi being lighter than " +
    "Drayk and balancing the jumping mechanics. They are also used in some puzzles.",
  jetpackUses: [
    {
      id: "underwater",
      label: "Underwater",
      body: "The packs work submerged, which is how a drowning player reaches the next air pocket.",
    },
    {
      id: "ice",
      label: "Melting ice",
      body: "Thrust held against a frozen wall opens a path that was solid a moment ago.",
    },
    {
      id: "burn",
      label: "Burning growth",
      body: "Wood and overgrown plant matter burn away, clearing routes the world had closed.",
    },
  ],

  booster: {
    label: "The collision booster",
    body:
      "When both players jetpack into each other while on use, they create a booster to move them " +
      "higher. Fuel drains fast while this happens, so the movement has to be intentional at every point.",
    reasoning: {
      decision:
        "Make the highest point in the traversal kit reachable only by two players colliding on " +
        "purpose, and let them transfer fuel to each other.",
      why:
        "Asymmetry alone produces turn-taking — you lift me here, I squeeze through there — " +
        "which is cooperation but not trust. The booster needs both players to commit at the " +
        "same instant, spending a resource they can watch running out, for a partner they " +
        "cannot talk to. Sharable fuel then makes generosity an actual mechanic with an actual " +
        "cost.",
      impact:
        "The best traversal in the game is also the most exposed thing a player can do. Getting " +
        "it right is the pair's clearest evidence that they have learned to read each other; " +
        "getting it wrong strands them, and stranding is the game's quietest punishment, because " +
        "nobody can explain whose fault it was.",
    },
  },
};
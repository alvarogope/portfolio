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
    title: "Characters with Difference Language",
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
          "Break the voice channel rather than remove it, and introduce it at the exact moment " +
          "the two players first meet.",
        why:
          "“Two species who cannot understand each other” is a premise until a system " +
          "makes it true. Cutting voice entirely would have made the barrier invisible — players " +
          "would simply have typed elsewhere and forgotten the fiction. Distorting it keeps the " +
          "person audible and the meaning gone, which is the actual experience the story is " +
          "about. It is also what protects the dual narrative: each player is given story the " +
          "other cannot receive, and the channel between them is too degraded to hand it over.",
        impact:
          "Players stop talking and start watching. Tone carries and meaning does not, so intent " +
          "has to be read off behaviour — where a partner is looking, what they are standing " +
          "next to, whether they came back. Mistrust is the resting state of the relationship, " +
          "and anything the players build on top of it is built out of actions.",
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
          "Write a rule the software cannot enforce, and count it as part of the design rather " +
          "than as etiquette.",
        why:
          "Every in-game barrier we built could be walked around by two people on a shared call " +
          "or sitting on the same sofa. The ambiguity is only ever as strong as the quietest " +
          "channel between the players, so the design has to reach past the executable. Naming " +
          "the rule explicitly — the way a tabletop game names its social contract — turns the " +
          "obvious exploit into something players decline to do on purpose.",
        impact:
          "The players become co-authors of the barrier. Agreeing to stay in the dark is itself " +
          "the first cooperative act of the session, and it means the suspicion in the last hour " +
          "of the game is real suspicion: nobody has been told what the other one is playing for.",
      },
    },
    {
      id: "gestures",
      order: "3",
      label: "Gestures that get lost in translation",
      tag: "Some render differently per player",
      body:
        "Simple gestures, but some render differently to each player, so even body " +
        "language is lost in translation.",
      reasoning: {
        decision:
          "Give players a non-verbal vocabulary — then break part of it too, so the same signal " +
          "does not always mean the same thing on both screens.",
        why:
          "A clean gesture wheel would have quietly replaced the language we had just taken away, " +
          "and the barrier would have lasted about ten minutes. Mismatching some of the gestures " +
          "keeps the divide alive through the workaround: players cannot trust the vocabulary, " +
          "only the conventions they establish and confirm through use.",
        impact:
          "Two players end up with a private pidgin nobody designed — a jump that means " +
          "“now”, a repeated point that means “not that one” — and the " +
          "puzzles make it load-bearing. When a plan fails, the failure is legible: the signal " +
          "did not mean on your screen what it meant on mine.",
      },
    },
    {
      id: "telepathy",
      order: "4",
      label: "Telepathy window",
      tag: "5 seconds with the voce filter off",
      emphasis: "payoff",
      body:
        "This resource grants five seconds with the filter off and voice chat perfectly clear. It is a rare one. " + 
        "It is not too long for building a proper phrase, but give the opportunity to communicate through a voice. " +
        "Players can use this for lying too. Linking this to the Lie ending.",
      reasoning: {
        decision:
          "Make clarity a scarce collectible rather than a permanent unlock, cap it at five " +
          "seconds, and wire what is said inside it into the ending the players get.",
        why:
          "If clarity is free it stops being interesting the moment it arrives, and the barrier " +
          "the rest of the game built becomes a tutorial the players graduated from. Rationing " +
          "it turns speech itself into a decision — what is worth the window? — and connecting " +
          "it to the ending is what makes honesty a mechanic instead of a mood. It is the one " +
          "moment where the two players can properly lie to each other, which is only possible " +
          "because everything else in the game made lying impossible.",
        impact:
          "Five seconds is a prisoner's dilemma with a countdown on it. Players spend the window " +
          "on a warning, a plan, a confession — or on a lie that buys them the ending they want. " +
          "It is the one channel in the game where the words themselves are the mechanic, and " +
          "the three endings are downstream of it.",
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
      "Distribute the ship's functions across stations one player cannot cover, and give the " +
      "hull real mass so nothing can be fixed instantly.",
    why:
      "A ship one player can fly makes the second player a passenger, and a passenger has no " +
      "reason to communicate. Spreading the systems out turns every flight into a continuous " +
      "negotiation of roles, and the inertia puts a deadline on that negotiation — you cannot " +
      "out-react a bad plan in a ship this heavy.",
    impact:
      "Players self-organise into roles, then break their own roles the moment a hazard makes " +
      "them wrong. The ship is where the pair learn to run a shorthand under pressure, which is " +
      "the skill the planets below spend the rest of the game testing.",
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
/**
 * Shattered Skies — the core mechanics: the three systems that make two
 * players who cannot talk to each other cooperate anyway.
 *
 * ATTRIBUTION. Shattered Skies is a team project (team of 5) and my role on it
 * was Systems & World Designer. The three mechanics in this file were
 * CO-DESIGNED with the team — `roleNote` below is rendered visibly at the head
 * of the section and says exactly that. The framing to avoid is one that reads
 * as though these systems were authored alone; every heading, note and design
 * point in here is written in that register on purpose, and should stay there.
 *
 * THE SPINE. Every mechanic in this file is the same argument in a different
 * material: cooperation is not encouraged, it is structurally required, and it
 * has to happen across a communication barrier the design refuses to lower.
 * The communication system states it, the ship makes it mechanical, and
 * traversal makes it physical. `spine` is that claim said once, so the section
 * has a thesis rather than three loose subsections.
 *
 * WHERE THIS FILE RENDERS, AFTER THE SPLIT. The MAIN page gets the claim and
 * its evidence: the spine, each channel's label, tag and `body`, the telepathy
 * flow diagram, the ship's stations and the two traversal bodies. The DEEP DIVE
 * gets the `reasoning` triples — `decision → why → impact` for every channel,
 * `ship.dualControl`, `traversal.booster.reasoning` — and the `jetpackUses`.
 *
 * The two pages never render the same sentence. A channel's `label` appears on
 * both because it is the KEY that joins the condensed entry to its reasoning;
 * everything else has exactly one render site.
 *
 * THE FOUR CHANNEL BODIES DECODE. `DecodeOnView` scrambles each `body` and
 * resolves it when it scrolls into view. That is not decoration bolted on: this
 * copy is the direct descendant of the four `TransmissionCard` bodies the page
 * used to render, and a sentence that arrives as noise and resolves is the
 * section's own argument performed on the section's own words. Keep the bodies
 * SHORT for that reason — a decoding paragraph is a paragraph withheld.
 *
 * WEIGHTING IS DELIBERATE. The communication system is the signature mechanic
 * and carries the fullest treatment: four channels, each with its own design
 * reasoning, plus the telepathy → endings flow, which is the clearest single
 * expression of the whole game's design. The ship and the traversal are strong
 * but compact — prose-led, small supporting tables, no second diagram. Do not
 * "balance" the three by growing the last two; the imbalance is the point.
 *
 * THE REASONING TRIPLE. Every mechanic states `decision → why → impact` rather
 * than describing itself. A description of a mechanic is a feature list; the
 * decision and its consequence are the portfolio value, and the components
 * render the three as labelled lines so a reader can find them at a glance.
 *
 * NO PLANETS, NO STORY BEATS. `shattered-skies-planets.ts` owns the worlds and
 * `shattered-skies-overview.ts` owns the narrative structure and the three
 * endings. The one crossing point is the telepathy flow below, which has to
 * name the endings for the link to mean anything — it names them and stops,
 * leaving the outcomes to the narrative section further up the page.
 *
 * Pronouns: the two hosts are aliens and the game never fixes their gender.
 * Aevi and Drayk are written without gendered pronouns throughout, as in the
 * other Shattered Skies content files.
 */

/* ---- shared shapes ------------------------------------------------------ */

/** The heading furniture each of the three mechanics carries. */
export interface MechanicMeta {
  id: string;
  /** "01" — rendered as the mono index on the block's rule. */
  order: string;
  /** Short mono kicker over the title. */
  kicker: string;
  title: string;
  /** One line under the title: the claim, not the description. */
  standfirst: string;
}

/** decision → why → player impact. The reason this file exists. */
export interface Reasoning {
  decision: string;
  why: string;
  impact: string;
}

/* ---- attribution -------------------------------------------------------- */


/* ---- the spine ----------------------------------------------------------
   One claim, stated once, that the three mechanics below are each an instance
   of. If a mechanic stops being an instance of it, the mechanic is wrong. */

export interface Spine {
  tag: string;
  body: string;
  note: string;
}

export const spine: Spine = {
  tag: "The throughline",
  body:
    "Two players. Two species. No shared language. Every core system in Shattered Skies exists to " +
    "make that barrier real and then make cooperation the only way through it — the voice you " +
    "cannot understand, the ship neither of you can fly alone, and the jump neither of you can " +
    "make without the other.",
  note:
    "The design question was never “how do we let two players work together” — co-op does that " +
    "by default. It was “how do we make trust cost something”. So the systems withhold the " +
    "cheapest thing in multiplayer, clear speech, and hand the players problems that cannot be " +
    "solved without it.",
};

/* ==========================================================================
   01 · THE COMMUNICATION SYSTEM — the signature mechanic
   ==========================================================================
   Four channels, in escalating order: noise, then a rule the software cannot
   enforce, then a vocabulary that betrays you, then the one window where you
   can finally speak — and have to decide whether to lie. The order is the
   argument; keep it. */

export interface CommChannel {
  id: string;
  order: string;
  label: string;
  /** Short mono line: the implementation in a breath. */
  tag: string;
  /** What the mechanic is. Written to be read aloud. */
  body: string;
  reasoning: Reasoning;
  /** Marks the two channels the section leans on hardest. */
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
    order: "01",
    kicker: "The signature mechanic",
    title: "A language that will not carry",
    standfirst:
      "Two players controlling two alien species with no shared language — and four systems that " +
      "make the incomprehension something you play rather than something you are told.",
  },

  lead:
    "Most co-op games hand players a channel and trust them with it. Shattered Skies takes the " +
    "channel apart. The four systems below escalate: noise, then a rule the software cannot " +
    "enforce, then a vocabulary that betrays you, then the one window where you can finally " +
    "speak — and have to decide whether to lie.",

  channels: [
    {
      id: "voice",
      order: "01",
      label: "Distorted voice chat",
      tag: "Unity · voice run through a distortion plugin",
      body:
        "Voice chat is run through a distortion plugin in Unity — words come out unintelligible, " +
        "but urgency and emotion survive. You can hear that your partner is afraid; you cannot " +
        "hear why.",
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
      order: "02",
      label: "The rule beyond the screen",
      tag: "A social rule, enforced outside the build",
      emphasis: "meta",
      body:
        "Players agree not to discuss the story outside the distorted voice chat. The restriction " +
        "lives outside the game to protect the fiction inside it, and it keeps every intention " +
        "ambiguous.",
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
      order: "03",
      label: "Gestures that get lost in translation",
      tag: "Non-verbal signals · some render differently per player",
      body:
        "Simple non-verbal gestures — but some render differently to each player, so even body " +
        "language is lost in translation. Players have to invent a shared vocabulary across a " +
        "divide that keeps moving.",
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
      order: "04",
      label: "The telepathy window",
      tag: "Rare resource · 5 seconds · filter off",
      emphasis: "payoff",
      body:
        "A rare resource grants five seconds with the filter off and speech perfectly clear. Never " +
        "enough to say everything — and what you say in the window, true or false, feeds straight " +
        "into the endings.",
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
    "One escalation: the noise makes incomprehension real, the out-of-game rule keeps it honest, " +
    "the gestures make players build across it, and the window puts a price on the one thing they " +
    "have missed all game. Every other mechanic in the game is played through this one.",
};

/* ---- the telepathy → endings flow ---------------------------------------
   The diagram that closes the communication block. It exists to make one link
   visible: the signature communication mechanic is the input to the game's
   prisoner's-dilemma endings. Ending names and tones match
   `shattered-skies-overview.ts` so the two diagrams on the page agree; the
   outcomes are deliberately NOT repeated here. */

export type FlowTone = "truth" | "deceit";
export type EndingTone = "unity" | "betrayal" | "destruction";

export interface FlowChoice {
  id: string;
  tone: FlowTone;
  label: string;
  gloss: string;
}

export interface FlowEnding {
  id: string;
  tone: EndingTone;
  name: string;
  /** The combination of the two players' choices that leads here. */
  combo: string;
  gloss: string;
  /** Which choice nodes feed this ending. Drives the diagram's edges. */
  from: readonly FlowTone[];
}

export interface TelepathyFlow {
  title: string;
  caption: string;
  /** The SVG's <desc>: the whole shape in one sentence, for screen readers. */
  summary: string;
  /** All three column headers live in the data, so no diagram copy sits in the component. */
  window: { column: string; label: string; detail: string; seconds: number };
  choicesLabel: string;
  choices: readonly FlowChoice[];
  endingsLabel: string;
  endings: readonly FlowEnding[];
  note: string;
}

export const telepathyFlow: TelepathyFlow = {
  title: "Five seconds, and what they decide",
  caption:
    "The telepathy window is the game's clearest line from a communication mechanic to an ending.",
  summary:
    "A flow in three columns. On the left, the telepathy window: five seconds of clear speech, " +
    "granted by a rare resource. In the middle, the choice each player makes inside it — speak " +
    "true or speak false. On the right, the three endings those choices feed: both true leads " +
    "toward Unity, one lie toward Betrayal, and two lies toward Mutual Destruction.",
  window: {
    column: "The resource",
    label: "The telepathy window",
    detail: "A rare resource. Five seconds, filter off, perfectly clear speech.",
    seconds: 5,
  },
  choicesLabel: "Each player, alone",
  choices: [
    {
      id: "truth",
      tone: "truth",
      label: "Speak true",
      gloss: "Spend the window on what is actually happening, or on what you actually intend.",
    },
    {
      id: "deceit",
      tone: "deceit",
      label: "Speak false",
      gloss: "Withhold, mislead, or promise something you already know you will not do.",
    },
  ],
  endingsLabel: "Where it lands",
  endings: [
    {
      id: "unity",
      tone: "unity",
      name: "Unity",
      combo: "Both spoke true",
      gloss: "Two players who spent their scarcest resource on each other.",
      from: ["truth"],
    },
    {
      id: "betrayal",
      tone: "betrayal",
      name: "Betrayal",
      combo: "One of the two lied",
      gloss: "The lie only has to be one-sided. Which side decides who survives.",
      from: ["truth", "deceit"],
    },
    {
      id: "mutual-destruction",
      tone: "destruction",
      name: "Mutual Destruction",
      combo: "Both spoke false",
      gloss: "Neither player trusted the window, so nothing crossed it.",
      from: ["deceit"],
    },
  ],
  note:
    "The windows do not pick the ending on their own — the final choice does, and each player " +
    "makes it alone. What the telepathy windows decide is what each player knows, and believes, " +
    "walking into it. That is the design in one line: the communication system is the evidence, " +
    "and the ending is the verdict.",
};

/* ==========================================================================
   02 · THE SPACESHIP HUB — compact
   ==========================================================================
   Prose-led with one small reference table. Lovers in a Dangerous Spacetime is
   named as the reference because it is the honest one. */

export interface ShipStation {
  id: string;
  name: string;
  role: string;
}

/**
 * The three repair minigames are NOT described here. They are the centrepiece
 * of the co-op design section further down the page
 * (`shattered-skies-gameplay.ts`), where each one is taken apart into its
 * asymmetry and its comms-barrier twist. This block names them once and hands
 * the reader on; if a description of one ever reappears here, delete it.
 */
export interface RepairsPointer {
  label: string;
  /** Why the ship generates repairs at all — the setup, not the minigames. */
  body: string;
  /** The one line that hands the depth to the co-op design section. */
  pointer: string;
  /** Link text for that hand-off. The href is built at the render site. */
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
    order: "02",
    kicker: "The hub",
    title: "A ship that takes two",
    standfirst:
      "Home base and the road between planets, with its systems spread far enough apart that one " +
      "player can never be at all of them.",
  },

  inspiration: {
    ref: "Lovers in a Dangerous Spacetime",
    body:
      "The reference we took to the team openly. What we wanted from it was its central trick: a " +
      "vehicle whose controls are physically distributed, so that flying it is a running " +
      "argument about who is where.",
  },

  lead:
    "The ship is both home base and the way between planets — and it takes two. Steering, " +
    "shields, cannons and radar sit at separate stations, so players must physically move to " +
    "their posts and constantly coordinate: one steers while the other defends, and whoever is " +
    "on radar is the only one who can see what is coming. The hull carries realistic weight and " +
    "inertia, so a course correction has to be started long before it is needed — which means " +
    "the call to make it has to come earlier still, through a voice channel that cannot carry " +
    "the words.",

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

  stationsLabel: "Ship systems",
  stations: [
    {
      id: "steer",
      name: "Steering",
      role: "Heading and thrust. Weight and inertia are real, so turns begin early or not at all.",
    },
    {
      id: "shield",
      name: "Shields",
      role: "Directional cover. Holding one arc always means leaving another one open.",
    },
    {
      id: "cannons",
      name: "Cannons",
      role: "Clears asteroids and hostiles, aimed independently of where the ship is pointed.",
    },
    {
      id: "radar",
      name: "Radar",
      role: "Reads hazards, debris and approaching worlds — and is worthless unless the other player is told.",
    },
  ],

  repairs: {
    label: "Repair under fire",
    body:
      "Asteroid fields and the hazards between worlds do real damage, and damage is repaired by " +
      "hand, mid-flight, while the other player keeps the ship alive. Nobody can afford to leave " +
      "their station for long, so every repair is a second job taken on under load.",
    /* S2 — no direction word. This block renders on the main page and its
       reasoning renders on the deep dive, so "below" is true on one page and
       false on the other. The render site resolves the address; this file
       states the fact and stops. */
    pointer:
      "Three minigames handle it — Circuit Realignment, Seal Hull Breach and Calibrate Sensors. " +
      "Each one splits the knowledge or the control between the two players in a different way.",
    /** The link text. The address is resolved by the component. */
    linkLabel: "How the three splits work",
  },

  designPoint:
    "The ship is where cooperation stops being a theme and becomes mechanical. You cannot fly it " +
    "alone — not because the game forbids it, but because the controls are in two places at once.",
};

/* ==========================================================================
   03 · ASYMMETRIC TRAVERSAL — compact
   ==========================================================================
   The collision booster is the highlight: it is the point where the traversal
   system produces cooperation the design did not have to script. */

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
  designPoint: string;
}

export const traversal: TraversalSection = {
  meta: {
    id: "traversal",
    order: "03",
    kicker: "Movement",
    title: "Two bodies, one tank of fuel",
    standfirst:
      "Asymmetric characters, a fuel-limited jetpack that cares how much you weigh, and a boost " +
      "that only exists when both players commit to it at once.",
  },

  lead:
    "Aevi is small, quick, and jumps poorly. Drayk is big, slow, and jumps hard. Their bodies " +
    "shape how they move and therefore how they cooperate — one of them reaches a ledge the " +
    "other has to be helped to, and neither is the better traversal character in general, only " +
    "in a particular place.",

  bodiesLabel: "The two bodies",
  bodies: [
    {
      id: "aevi",
      name: "Aevi",
      build: "Small · quick · weak jump",
      body:
        "Covers ground fast and fits where Drayk cannot, but cannot clear height unaided. Lighter " +
        "on the jetpack, so the same tank of fuel carries Aevi further.",
    },
    {
      id: "drayk",
      name: "Drayk",
      build: "Large · slow · strong jump",
      body:
        "Reaches by jumping what Aevi needs fuel for, but burns through that fuel faster and " +
        "loses time on any route that rewards speed.",
    },
  ],

  jetpackLabel: "Jetpacks, from the first minute",
  jetpackBody:
    "Both players carry a jetpack from the start of the game — the traversal is not an unlock, it " +
    "is the baseline. Fuel is limited and weight-sensitive: Aevi's lighter frame makes the pack " +
    "more efficient, which is precisely what balances Aevi against Drayk's stronger jump. The " +
    "same thruster is also a tool, and doubling movement as an environmental verb is what keeps " +
    "the fuel gauge tense — every metre spent solving a puzzle is a metre you cannot fly.",
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
      "When both players jetpack into each other mid-air, they create a booster that flings them " +
      "higher than either could reach alone. Fuel drains fast while it happens, players can " +
      "share fuel between packs, and running dry can strand you somewhere neither of you can get " +
      "out of. Movement itself is a resource the two of you manage together.",
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

  designPoint:
    "Asymmetric bodies plus a shared, finite fuel supply gives you traversal that only functions " +
    "through cooperation — and, because fuel can be given away, only functions well through " +
    "trust.",
};

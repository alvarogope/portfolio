/**
 * Shattered Skies — co-op design: the depth behind the mechanics section.
 *
 * WHAT THIS FILE OWNS. `shattered-skies-mechanics.ts` introduces the ship, the
 * communication barrier and the traversal — it names the three repair
 * minigames in one pointer line and stops. This file is where those three are
 * actually taken apart, plus the general co-op puzzle pattern and the
 * knowledge-gated exploration rule. If a sentence here is also in the
 * mechanics file, one of the two is wrong: the mechanics file states the
 * system, this one states how the system splits the players.
 *
 * ATTRIBUTION. Shattered Skies is a team project (team of five) and my role on
 * it was Systems & World Designer. Everything described here was CO-DESIGNED
 * with the team. `roleNote` is rendered visibly at the head of the section and
 * says so in those words. Keep every heading and design note in that register;
 * nothing in this file should read as solo authorship.
 *
 * THE THESIS. Each of the three minigames is the same design move in a
 * different material: SPLIT the knowledge or the control between the two
 * players, then force them to bridge the split through a channel that has been
 * deliberately broken. What comes back across the gap is not information — it
 * is a private language the pair invents under time pressure. `thesis` states
 * that once, and every block below is an instance of it. A minigame that stops
 * being an instance of it is a minigame that has drifted.
 *
 * THE SPLIT IS THE DATA. Every minigame carries a `sides` pair, and each side
 * declares exactly what it SEES and what it CONTROLS. The diagrams are drawn
 * from those two fields, and so are their screen-reader descriptions, so the
 * picture and the accessible text can never disagree about who knows what.
 *
 * NO PLANETS HERE. `shattered-skies-planets.ts` owns the five worlds. The
 * knowledge-gating block below only points at that system — it explains the
 * rule that governs access to it and deliberately describes no planet.
 *
 * Pronouns: the two hosts are aliens and the game never fixes their gender.
 * Aevi and Drayk are written without gendered pronouns, as in the other
 * Shattered Skies content files.
 */

/* ---- shared shapes ------------------------------------------------------ */

/** Heading furniture, matched to the mechanics section so the page reads as one document. */
export interface BlockMeta {
  id: string;
  /** Mono index on the block's rule, e.g. "01". */
  order: string;
  /** Short mono kicker over the title. */
  kicker: string;
  title: string;
  /** One line under the title: the claim, not the description. */
  standfirst: string;
}

/** A labelled note — used for the asymmetry, the barrier twist and the failure state. */
export interface Beat {
  label: string;
  body: string;
}

/* ---- attribution -------------------------------------------------------- */

export interface RoleNote {
  role: string;
  headline: string;
  body: string;
}

export const roleNote: RoleNote = {
  role: "Systems & World Designer",
  headline: "Co-designed with the team",
  body:
    "Team of five. The minigames, the puzzle pattern and the gating rule below were worked out " +
    "together — pitched, argued over and cut down in playtests — with systems and world design " +
    "as my seat at that table. This is the reasoning behind them, not a claim to have authored " +
    "them alone.",
};

/* ---- the thesis ---------------------------------------------------------
   One claim. The three minigames are three materials for it. */

export interface Thesis {
  tag: string;
  body: string;
  note: string;
  /** The three moves, named, so the reader can spot them in each block. */
  moves: readonly Beat[];
}

export const thesis: Thesis = {
  tag: "The throughline",
  body:
    "Every minigame on the ship splits something in half — the knowledge, or the control — and " +
    "gives one half to each player. Neither half is a game on its own. The only way to put them " +
    "back together is to talk, and talking is the one thing Shattered Skies has already taken " +
    "away.",
  note:
    "That is the whole design in one sentence, and it is why the minigames are not skill tests. " +
    "The difficulty is never in the maze, the weld or the waveform; it is in the sentence you " +
    "cannot say. So players stop trying to say it. They start hammering a rhythm, barking a " +
    "syllable at a pitch that means left, thumping twice for stop — and within a few attempts " +
    "the pair are running a vocabulary nobody on the team designed. The minigames are the " +
    "pressure that manufactures it.",
  moves: [
    {
      label: "Split",
      body:
        "One player is given the picture, the other is given the hands. Each is useless with what " +
        "they were given.",
    },
    {
      label: "Distort",
      body:
        "The only channel between them runs through the voice filter, so the obvious instruction " +
        "— “left”, “now”, “zero point four” — arrives as noise.",
    },
    {
      label: "Improvise",
      body:
        "The pair invent their own signals to carry it instead, and get measurably faster at the " +
        "minigame as that private language matures.",
    },
  ],
};

/* ==========================================================================
   THE THREE MINIGAMES
   ==========================================================================
   Order is deliberate: split knowledge (the maze), split control (the welder),
   then both at once (the waveform). Each block states the same four things in
   the same order — premise, split, barrier, failure — so a reader learns the
   shape once. */

/** Which half of the split a side holds. Drives the diagram's tone. */
export type SideRole = "sees" | "controls" | "both";

export interface MinigameSide {
  id: "a" | "b";
  /** Short human name for this seat, e.g. "The blind hand". */
  label: string;
  role: SideRole;
  /** What this player can see. Rendered in the diagram and in its description. */
  sees: string;
  /** What this player can act on. Rendered in the diagram and in its description. */
  controls: string;
  /**
   * The short mono line printed inside this side's panel in the diagram.
   * `sees`/`controls` are full sentences and do not fit in an SVG panel, so
   * the compressed version lives here rather than as copy in the component.
   */
  chip: string;
}

/** Selects which figure the component draws. Geometry stays in the component. */
export type DiagramVariant = "maze" | "welder" | "waveform";

export interface DiagramSpec {
  variant: DiagramVariant;
  /** The SVG <title>. */
  title: string;
  /** The SVG <desc>: who sees what, who controls what, and what sits between them. */
  summary: string;
  /** The label in the gap of the broken channel arc. */
  barrier: string;
  /** Small mono line under the drawing: what failure costs. */
  stakes: string;
  /** The two named axes a figure draws as dials. Waveform only. */
  axes?: readonly [string, string];
  /** Caption for an object both players act on. Welder only. */
  sharedLabel?: string;
}

export interface Minigame {
  id: string;
  order: string;
  name: string;
  /** Mono line: the system and its shape in a breath. */
  tag: string;
  standfirst: string;
  /** What the minigame is, plainly. */
  premise: string;
  sides: readonly [MinigameSide, MinigameSide];
  /** The design move: what got split, and why that split and not another. */
  split: Beat;
  /** The twist: what the broken channel does to the split. */
  barrierTwist: Beat;
  /** What losing costs, and what that pressure is for. */
  failure: Beat;
  diagram: DiagramSpec;
  /** The line that hands this block back to the thesis. */
  designPoint: string;
}

export interface MinigameSection {
  meta: BlockMeta;
  lead: string;
  games: readonly Minigame[];
  close: string;
}

export const minigames: MinigameSection = {
  meta: {
    id: "minigames",
    order: "01",
    kicker: "The centrepiece",
    title: "Three repairs, three splits",
    standfirst:
      "The ship breaks constantly, and every repair is built the same way: cut the problem in " +
      "half, give each player one half, and put a broken radio between them.",
  },

  lead:
    "Asteroid fields and the hazards between worlds do real damage, and damage has to be repaired " +
    "by hand, mid-flight, while the ship is still being flown. The three minigames below are the " +
    "same design argument told three times — first with the knowledge split, then with the " +
    "control split, then with both at once. Each one ends the same way, too: not with a player " +
    "getting better at the puzzle, but with two players getting better at each other.",

  games: [
    /* -------------------------------------------------------------------- */
    {
      id: "circuit",
      order: "01",
      name: "Circuit Realignment",
      tag: "Power · 8×8 grid maze · knowledge split",
      standfirst:
        "One player drives a power node through a maze they cannot see. The other can see the " +
        "maze and nothing else.",
      premise:
        "A dead system comes back on line when its power node is walked across an eight-by-eight " +
        "grid and reconnected to the source. The grid is a maze — walls between cells, one route " +
        "through — and the node moves one cell at a time.",
      sides: [
        {
          id: "a",
          label: "The blind hand",
          role: "controls",
          sees: "The node, and the empty grid it sits on. No walls, no source.",
          controls: "The node — one cell per input, in any of four directions.",
          chip: "Controls the node · no walls, no source",
        },
        {
          id: "b",
          label: "The guide",
          role: "sees",
          sees: "The whole maze: every wall, the source, and where the node currently is.",
          controls: "Nothing. Not one cell of it.",
          chip: "Sees every wall · moves nothing",
        },
      ],
      split: {
        label: "The split",
        body:
          "Knowledge on one side, control on the other, with no overlap at all. The player holding " +
          "the input has no map; the player holding the map has no input. We tested a version " +
          "where the blind player could see one cell ahead and it collapsed immediately — a " +
          "sliver of vision is enough to solve it alone, slowly, and the second player becomes a " +
          "commentator. The split has to be total for the guide to matter.",
      },
      barrierTwist: {
        label: "The twist",
        body:
          "The guide knows the answer and cannot say it. “Up” and “left” come through the " +
          "distortion as the same smeared vowel, and they are the two most dangerous words in the " +
          "game to get wrong. So the guide stops using words. What replaces them is invented on " +
          "the spot and specific to that pair — a rising hum for up, a short bark for left, " +
          "silence held for stop — and it has to be built while the strike counter is live.",
      },
      failure: {
        label: "The cost",
        body:
          "Driving the node into a wall is a strike, and three strikes destroy the ship. The " +
          "counter is what makes the guide's silence unbearable: every wall is a thing they " +
          "watched coming and could not name in time.",
      },
      diagram: {
        variant: "maze",
        title: "Circuit Realignment — the knowledge split",
        summary:
          "Two panels side by side, joined at the top by a broken arc labelled “distorted voice”. " +
          "On the left, the blind player's screen: an empty eight-by-eight lattice with the power " +
          "node on it and directional ticks around the node — no walls and no source. On the " +
          "right, the guide's screen: the same eight-by-eight grid with every wall drawn in and " +
          "the power source marked, the node shown only as an outline the guide cannot move. The " +
          "arc between them breaks in the middle, where the barrier label sits.",
        barrier: "Distorted voice",
        stakes: "Node into a wall = 1 strike · 3 strikes = the ship explodes",
      },
      designPoint:
        "The guide is not a hint system. The guide is a person who can see the answer through a " +
        "window they cannot shout through, and the minigame is the argument that follows.",
    },

    /* -------------------------------------------------------------------- */
    {
      id: "hull",
      order: "02",
      name: "Seal Hull Breach",
      tag: "Hull · one welder · control split",
      standfirst:
        "One welder, two players, two axes. Neither of them can move it where it needs to go.",
      premise:
        "A crack opens in the hull and has to be welded shut in zero-g, following the shape of the " +
        "break from one end to the other. There is a single welder, and its two axes of movement " +
        "are wired to two different players.",
      sides: [
        {
          id: "a",
          label: "Horizontal",
          role: "controls",
          sees: "The plate and the crack — the same view the other player has.",
          controls: "The welder's left–right movement. Only left and right.",
          chip: "Left ↔ right only",
        },
        {
          id: "b",
          label: "Vertical",
          role: "controls",
          sees: "The plate and the crack — the same view the other player has.",
          controls: "The welder's up–down movement. Only up and down.",
          chip: "Up ↕ down only",
        },
      ],
      split: {
        label: "The split",
        body:
          "This one splits the control instead of the knowledge, and it is the sharpest of the " +
          "three because both players can see exactly what needs to happen. Nothing is hidden; " +
          "the frustration is purely that half the tool is in someone else's hands. A diagonal — " +
          "the shape most cracks actually take — is not two inputs one after the other, it is two " +
          "inputs held at the same rate at the same moment, which is a thing you have to agree on " +
          "before you start.",
      },
      barrierTwist: {
        label: "The twist",
        body:
          "What the pair need to exchange is not a direction, it is a tempo — how fast, starting " +
          "when, easing off where. The distortion strips the words but keeps the rhythm, which is " +
          "the one thing that survives the filter intact. Pairs work this out by accident and " +
          "then lean on it: a counted-in pulse, a held note that means keep going, a sharp one " +
          "that means stop. The channel that cannot carry a sentence turns out to carry a beat.",
      },
      failure: {
        label: "The cost",
        body:
          "Let the welder drift off the damaged section and the weld resets to the start. The " +
          "hull is failing while they work, so a reset is not just lost progress — it is spent " +
          "time against an implosion, and that pressure is what stops the pair from carefully " +
          "taking turns.",
      },
      diagram: {
        variant: "welder",
        title: "Seal Hull Breach — the control split",
        summary:
          "One hull plate in the centre with a jagged crack across it and a single welder sitting " +
          "on the crack. From the left, a cyan axis line runs in to the welder and continues " +
          "through it as a left–right double arrow: that is player A's control, horizontal only. " +
          "From the right, a warm line drops below the plate, turns, and rises into the welder as " +
          "an up–down double arrow: that is player B's control, vertical only. Above the plate, " +
          "an arc joining the two players' control blocks breaks in the middle, where the label " +
          "“distorted voice” sits.",
        barrier: "Distorted voice",
        stakes: "Off the damaged section = the weld resets · the hull is imploding while you work",
        sharedLabel: "One welder, one crack",
      },
      designPoint:
        "Two people operating one tool on different axes is cooperation you can feel in your " +
        "thumbs. Nothing is hidden here, and it is still the hardest of the three.",
    },

    /* -------------------------------------------------------------------- */
    {
      id: "sensors",
      order: "03",
      name: "Calibrate Sensors",
      tag: "Navigation · waveform · knowledge and control split",
      standfirst:
        "One player is shown the wave to match. The other holds the only two dials that can make " +
        "it — and cannot be told a number.",
      premise:
        "Navigation comes back when the sensor output is matched to a target waveform. Two " +
        "properties have to line up: amplitude and frequency. There is one readout of the target " +
        "and one set of dials, and they are not on the same screen.",
      sides: [
        {
          id: "a",
          label: "The reader",
          role: "sees",
          sees: "The target waveform, live — its height and its pitch.",
          controls: "Nothing. The dials are not on this screen.",
          chip: "Sees the target · no dials",
        },
        {
          id: "b",
          label: "The hands",
          role: "controls",
          sees: "Only the wave they are currently producing, with nothing to compare it against.",
          controls: "Amplitude and frequency, as two continuous dials.",
          chip: "Holds both dials · no target",
        },
      ],
      split: {
        label: "The split",
        body:
          "Both halves at once: the target is knowledge only the reader has, and the dials are " +
          "control only the hands have. What makes it different from the maze is that the answer " +
          "is a pair of continuous values rather than a route. There is no discrete instruction to " +
          "give — no “up”, no “left” — and “a bit more” has no meaning until the two of them have " +
          "agreed what a bit is.",
      },
      barrierTwist: {
        label: "The twist",
        body:
          "A number is the one thing the distortion destroys completely, so the reader has to " +
          "become the instrument instead of describing it. Pairs end up humming the target: " +
          "louder for amplitude, faster for frequency, the filter mangling the timbre but leaving " +
          "the shape. It is the clearest moment in the game of players routing around the barrier " +
          "rather than fighting it — and the one where you can hear a partnership improving, " +
          "because the second calibration always takes a fraction of the first.",
      },
      failure: {
        label: "The cost",
        body:
          "The calibration is timed and the ship explodes on the clock, not on a mistake. That " +
          "distinction matters: wrong dials cost nothing by themselves, so the pair are free to " +
          "experiment — as long as they experiment quickly.",
      },
      diagram: {
        variant: "waveform",
        title: "Calibrate Sensors — the split, both halves",
        summary:
          "Two panels side by side, joined at the top by a broken arc labelled “distorted voice”. " +
          "On the left, the reader's screen: a scope showing the target waveform, with no controls " +
          "beneath it. On the right, the hands' screen: the wave they are currently producing — " +
          "visibly shorter and slower than the target — above two dials, one for amplitude and " +
          "one for frequency. Neither panel contains what the other one holds, and the arc " +
          "between them breaks in the middle, where the barrier label sits.",
        barrier: "Distorted voice",
        stakes: "Timed · the clock, not the mistake, is what explodes the ship",
        axes: ["Amplitude", "Frequency"],
      },
      designPoint:
        "Amplitude and frequency are two things a voice already has. When the words go, the pair " +
        "discover they were carrying the instrument all along.",
    },
  ],

  close:
    "Split the knowledge, split the control, split both — and in all three cases the missing piece " +
    "has to cross a channel that will not carry it. The pair stop trying to send information and " +
    "start sending signals, and the private code they end up with is the actual reward. The " +
    "repaired ship is a receipt.",
};

/* ==========================================================================
   THE CO-OP PUZZLE PATTERN — compact
   ==========================================================================
   The general shape the planetside puzzles follow. Deliberately short: it is a
   pattern, not a catalogue, and the Symbiochord is the part worth the words. */

export interface PuzzleStep {
  id: string;
  order: string;
  label: string;
  body: string;
}

export interface PuzzleSection {
  meta: BlockMeta;
  lead: string;
  stepsLabel: string;
  steps: readonly PuzzleStep[];
  symbiochord: Beat;
  designPoint: string;
}

export const puzzlePattern: PuzzleSection = {
  meta: {
    id: "puzzle-pattern",
    order: "02",
    kicker: "The pattern",
    title: "The shape every puzzle takes",
    standfirst:
      "One reachable object, one unreachable player, and a parasite that punishes distance. Almost " +
      "every puzzle on the planets is a variation on five steps.",
  },

  lead:
    "The planetside puzzles are not a set of one-offs; they are one loop, re-dressed. Writing the " +
    "loop down as a pattern was how the team kept five worlds' worth of puzzles feeling like the " +
    "same game — and it is also what made them fast to prototype, because a new puzzle is a new " +
    "answer to step two rather than a new design.",

  stepsLabel: "The loop",
  steps: [
    {
      id: "gap",
      order: "01",
      label: "An area only one of them can reach",
      body:
        "The puzzle opens with an object — a lever, a socket, a console — behind a gap that suits " +
        "exactly one of the two bodies. Which one it suits is the puzzle's first sentence.",
    },
    {
      id: "interact",
      order: "02",
      label: "One interacts, the other solves",
      body:
        "The player who got in holds the object. They cannot solve it. The solution is in the " +
        "other player's movement — where they stand, what they block, when they cross — so the " +
        "one with their hands on the mechanism is the one with the least control over it.",
    },
    {
      id: "leash",
      order: "03",
      label: "The Symbiochord limits the distance",
      body:
        "The parasite that chains the two hosts together does not stretch for free. Pulling apart " +
        "to reach the object strains it, and a strained Symbiochord puts both lives at risk — so " +
        "the distance the puzzle demands is itself part of its cost.",
    },
    {
      id: "exposure",
      order: "04",
      label: "The one holding the object is exposed",
      body:
        "Being at the mechanism usually means being unable to defend yourself. Time stops being " +
        "abundant. The pair have to decide how long the exposed player can afford to stay there, " +
        "and they have to decide it without discussing it.",
    },
    {
      id: "resolve",
      order: "05",
      label: "The outcome is shared",
      body:
        "The puzzle resolves for both of them or neither of them. There is no version where one " +
        "player banks a reward and the other does not — which is the rule the Symbiochord already " +
        "applies to damage, applied to progress.",
    },
  ],

  symbiochord: {
    label: "Why the Symbiochord is in the puzzle design at all",
    body:
      "Shared fate is usually a story device — two characters bound together, mentioned in " +
      "cutscenes. Wiring it into the puzzle loop is what stops it being decorative. Because the " +
      "chain has a length and a consequence, every puzzle becomes a negotiation about distance: " +
      "how far you are willing to be pulled, how long you are willing to hold there, and how much " +
      "you trust the person deciding it. Cooperation is not the intended solution to these " +
      "puzzles. It is the only state in which either player is alive to attempt one.",
  },

  designPoint:
    "The pattern makes the leash the real puzzle piece. Every lever is a question about how far " +
    "apart the two of you are willing to be.",
};

/* ==========================================================================
   KNOWLEDGE-GATED EXPLORATION — compact
   ==========================================================================
   The access rule for the solar system. Points at
   `shattered-skies-planets.ts`; describes no planet. */

export interface GatingSection {
  meta: BlockMeta;
  lead: string;
  rule: Beat;
  example: Beat;
  crossRef: Beat;
  designPoint: string;
}

export const knowledgeGating: GatingSection = {
  meta: {
    id: "knowledge-gating",
    order: "03",
    kicker: "Access",
    title: "A metroidvania of knowledge",
    standfirst:
      "The whole system is open from the first hour. What is closed is everything you do not yet " +
      "understand about how it moves.",
  },

  lead:
    "There are no keys in Shattered Skies, and no traversal upgrades held back to be handed out " +
    "later. Players can fly anywhere from the start. The thing that actually gates the world is " +
    "comprehension: the orbits, the alignments and the conditions each world imposes are the lock, " +
    "and learning how the system works is the only way to pick it.",

  rule: {
    label: "The rule",
    body:
      "Free exploration from the start, with access gated by knowledge rather than by keys or " +
      "upgrades. Everything a player needs to reach any place in the game is already in their " +
      "hands the first time they undock. What they are missing is not equipment — it is the " +
      "understanding of when and where the system opens.",
  },

  example: {
    label: "What that looks like in play",
    body:
      "An information note found on one world describes a cave that can only be entered while its " +
      "planet sits opposite a particular location. Nothing about the cave is locked; the door is " +
      "the orbit. Read the note, understand the alignment, wait for it or fly to meet it — and a " +
      "place that was closed the last four times you flew past it is simply open.",
  },

  crossRef: {
    label: "Which is why the system was built the way it was",
    body:
      "The five worlds, their orbits and the moon that orbits a gas giant instead of the star are " +
      "surveyed further up this page. That system is not scenery for this rule — it is the rule's " +
      "content. Every orbital relationship in it is a potential key, which is what let the team " +
      "build gates without building doors.",
  },

  designPoint:
    "Progression you cannot lose, cannot be given and cannot skip: the player unlocks the world by " +
    "understanding it, and the only thing that carries between sessions is what they now know.",
};

export interface BlockMeta {
  id: string;
  order: string;
  kicker: string;
  title: string;
  standfirst: string;
}

export interface Beat {
  label: string;
  body: string;
}


export interface Thesis {
  tag: string;
  body: string;
  note: string;
  moves: readonly Beat[];
}

export const thesis: Thesis = {
  tag: "The main design",
  body:
    "The minigames in the ship are always divided into two. Knowledge and control, giving one to each player, " +
    "and expecting them to colaborate without talking with each other.",
  note:
    "The puzzles are not a skill test, they are a communication test. The difficulty comes from the lack of " +
    "conversation that they could have. The way they communicate is completely up to the players and the way " +
    "they have to express ideas. The time they take to solve them depend fully on them.",
  moves: [
    {
      label: "Division",
      body:
        "One player is given the whole pciture of the puzzle, while the other has to interact with it.",
    },
    {
      label: "Distortion",
      body:
        "While this happens, the voice channel is being distorted so the instructions feels like noise.",
    },
    {
      label: "Improvisation",
      body:
        "The pair will have to make up their own signals and use common sense to complete the minigames",
    },
  ],
};

export type SideRole = "sees" | "controls" | "both";

export interface MinigameSide {
  id: "a" | "b";
  label: string;
  role: SideRole;
  sees: string;
  controls: string;
  chip: string;
}

export type DiagramVariant = "maze" | "welder" | "waveform";

export interface DiagramSpec {
  variant: DiagramVariant;
  title: string;
  summary: string;
  barrier: string;
  stakes: string;
  axes?: readonly [string, string];
  sharedLabel?: string;
}

export interface Minigame {
  id: string;
  order: string;
  name: string;
  tag: string;
  standfirst: string;
  premise: string;
  sides: readonly [MinigameSide, MinigameSide];
  split: Beat;
  barrierTwist: Beat;
  failure: Beat;
  diagram: DiagramSpec;
  designPoint: string;
}

export interface MinigameSection {
  meta: BlockMeta;
  lead: string;
  games: readonly Minigame[];
}

export const waveformPayoff =
  "The reader in this last case would have to hum for the target. Maybe louder for amplitude and " +
  "faster for frequency, but never talking.";

export const minigames: MinigameSection = {
  meta: {
    id: "minigames",
    order: "1",
    kicker: "The core puzzles",
    title: "The Ship Repairs",
    standfirst:
      "When the ship is damaged, it has to be repaired through the same pattern: the problem is divided, " +
      "each player gets one half and the voice chat distortion between them.",
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
      order: "1a",
      name: "Circuit Realignment",
      tag: "Power · 8x8 grid maze · knowledge division",
      standfirst:
        "One of the players has to drive a power node through an invisible maze for them. The other player can " +
        "see it, but nothing else.",
      premise:
        "A dead system comes back on line when its power node is walked across an eight-by-eight " +
        "grid and reconnected to the source. The grid is a maze — walls between cells, one route " +
        "through — and the node moves one cell at a time.",
      sides: [
        {
          id: "a",
          label: "The blind",
          role: "controls",
          sees: "The node and the empty grid.",
          controls: "The node and the movement",
          chip: "Controlling the node",
        },
        {
          id: "b",
          label: "The guide",
          role: "sees",
          sees: "The whole maze and where the node is.",
          controls: "Nothing.",
          chip: "Sees walls but cannot move",
        },
      ],
      split: {
        label: "The split",
        body:
          "Knowledge on one side, control on the other, with no overlap. We playtested a version " +
          "where the blind player could see one cell ahead and it collapsed immediately: a sliver " +
          "of vision is enough to solve it alone, and the guide becomes a commentator. The split " +
          "has to be total for the guide to matter.",
      },
      barrierTwist: {
        label: "The twist",
        body:
          "The guide knows the answer and cannot say it. “Up” and “left” come through the " +
          "distortion as the same smeared vowel, and they are the two most dangerous words in the " +
          "game to get wrong. So the guide stops using words — a rising hum for up, a short bark " +
          "for left, silence held for stop — and builds that while the strike counter is live.",
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
        title: "Puzzle Sample",
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
      order: "2",
      name: "Seal The Breach",
      tag: "Hull repair · control split",
      standfirst:
        "Neither of the players can move to weld where it needs.",
      premise:
        "A crack opens in the hull and has to be welded shut in zero-g, following the shape of the " +
        "break from one end to the other. There is a single welder, and its two axes of movement " +
        "are wired to two different players.",
      sides: [
        {
          id: "a",
          label: "Horizontal",
          role: "controls",
          sees: "The plate and the crack.",
          controls: "The welder's horizontal movement",
          chip: "Left ↔ right only",
        },
        {
          id: "b",
          label: "Vertical",
          role: "controls",
          sees: "The plate and the crack.",
          controls: "The welder's vertical movement.",
          chip: "Up ↕ down only",
        },
      ],
      split: {
        label: "The split",
        body:
          "Control split instead of knowledge, and it is the sharpest of the three because both " +
          "players can see exactly what needs to happen. Nothing is hidden; half the tool is " +
          "simply in someone else's hands. A diagonal — the shape most cracks take — is not two " +
          "inputs in turn, it is two inputs held at the same rate at the same moment.",
      },
      barrierTwist: {
        label: "The twist",
        body:
          "What the pair need to exchange is not a direction, it is a tempo — how fast, starting " +
          "when, easing off where. The distortion strips the words but keeps the rhythm, which is " +
          "the one thing that survives the filter intact. The channel that cannot carry a " +
          "sentence turns out to carry a beat.",
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
        title: "Puzzle Sample",
        summary:
          "One hull plate in the centre with a jagged crack across it and a single welder sitting " +
          "on the crack. From the left, a cyan axis line runs in to the welder and continues " +
          "through it as a left–right double arrow: that is the Horizontal seat's control. " +
          "From the right, a warm line drops below the plate, turns, and rises into the welder as " +
          "an up–down double arrow: that is the Vertical seat's control. Above the plate, " +
          "an arc joining the two players' control blocks breaks in the middle, where the label " +
          "“distorted voice” sits.",
        barrier: "Distorted voice",
        stakes: "Off the damaged section = the puzzle resets · the hull is imploding while this goes on",
        sharedLabel: "One welder for one crack",
      },
      designPoint:
        "Two people operating one tool on different axes is cooperation you can feel in your " +
        "thumbs. Nothing is hidden here, and it is still the hardest of the three.",
    },

    /* -------------------------------------------------------------------- */
    {
      id: "sensors",
      order: "3",
      name: "Calibratig Sensors",
      tag: "Navigation · waveform · knowledge and control division",
      standfirst:
        "One player is shown a wave to match. The other holds the only two controllers.",
      premise:
        "Navigation comes back when the sensor output is matched to a target waveform. Two " +
        "properties have to line up: amplitude and frequency. There is one readout of the target " +
        "and one set of dials, and they are not on the same screen.",
      sides: [
        {
          id: "a",
          label: "The reader",
          role: "sees",
          sees: "The target wave.",
          controls: "Nothing.",
          chip: "Sees the target",
        },
        {
          id: "b",
          label: "The hands",
          role: "controls",
          sees: "The wave currently producing",
          controls: "Amplitude and frequency.",
          chip: "Controls both dials",
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
          "become the instrument instead of describing it. " +
          waveformPayoff +
          " It is the clearest moment in the game of players routing around the barrier " +
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
        title: "Puzzle Sample",
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
};

/* ==========================================================================
   THE CO-OP PUZZLE PATTERN
   ==========================================================================
*/

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
    title: "The Puzzle Structure",
    standfirst:
      "Puzzles cannot be solved by players individually. The way they were designed follow these ways: ",
  },

  lead:
    "",

  stepsLabel: "The loop",
  steps: [
    {
      id: "gap",
      order: "1",
      label: "An area only one  can get to",
      body:
        "There is an object, whether is a lever, a socket or a console, and a gap that can only be jumped " +
        "by one of the characters. The solution is whoever can jump that far.",
    },
    {
      id: "interact",
      order: "2",
      label: "One interacts, to let the other pass",
      body:
        "The player that can reach the object cannot solve it. The solution relies on the other player's " +
        "movement when the first triggers a bridge or a platform.",
    },
    {
      id: "leash",
      order: "3",
      label: "The Symbiochord limiting the distance",
      body:
        "The parasite lets th character distance from each other in a limited way. If they are too " +
        "far apart, they die. Some puzzles' solutions put this into risk and positioning is key.",
    },
    {
      id: "exposure",
      order: "4",
      label: "Holding the object is exposes",
      body:
        "Interacting usually means vulnerability while this is happening. The players have to decide " +
        "how long this goes on so the players don't die.",
    },
    {
      id: "resolve",
      order: "5",
      label: "Shared solution",
      body:
        "Puzzles require both to be solved. If one of them dies while solving it, they both do.",
    },
  ],

  symbiochord: {
    label: "Why the Symbiochord is in the puzzle design at all",
    body:
      "Connects the story to the narrative direcctly. This way players stop thinking just about " +
      "how to solve a puzzle by themselves, and think as a team that cannot separate. This also wires " +
      "them together in a way that they know, all the time, that they cannot survive without the other.",
  },

  designPoint:
    "This is the elements that makes the puzzle design. Players will have to consider every aspect of this " +
    "to solve them.",
};

export const gatingPointer = {
  label: "Where access is designed",
  body:
    "The progression in Shattered Skies depend mainly on what the players know about this world. ",
  linkLabel: "The World",
} as const;

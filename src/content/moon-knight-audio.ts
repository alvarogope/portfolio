/**
 * Moon-Knight — audio design: the composer's thinking around the score.
 *
 * I wrote, performed and recorded the music for this game, so this file is the
 * COMPOSER'S half of the page: not a track list, but the decisions behind what
 * plays, what does not, and what each instrument is doing there. Two of these
 * pieces exist as finished recordings and are playable on the page; everything
 * else here is design, and is written as design. NOTHING IN THIS FILE IS A
 * TRACK STUB — no entry below is ever to be rendered as a player, empty or
 * otherwise, because the recordings for them do not exist and will not.
 *
 * EVERY ENTRY CARRIES ITS REASONING. `sound` is what the player hears; `why` is
 * the reason it was scored that way. The `why` is the portfolio value — a
 * reader who skims only those lines should still come away with the argument.
 *
 * MOTIFS ARE SHARED WITH THE REST OF THE PAGE, NOT RE-INVENTED. The dungeon
 * piano is the same note the narrative motifs make ("an instrument this world
 * should not have"), and the harp is the one Death gives the knight in the cast
 * and diegetic sections. `echo` marks those crossings so the phrasing here can
 * be kept deliberately consistent with them — by section NAME, never by number,
 * since the page renumbers whenever a section is inserted.
 */

/* ---- the composer's framing --------------------------------------------- */

export const composerCredit = {
  kicker: "Score & audio design",
  /** Said plainly, once: this is my music, not licensed or commissioned. */
  line: "I composed, performed and recorded the score myself.",
  body:
    "The two pieces below are real recordings from the game. Everything around them is the " +
    "audio design that governs them — where music is allowed to play, what each instrument " +
    "is permitted to mean, and why most of this game is scored with nothing at all.",
} as const;

/* ---- the thesis --------------------------------------------------------- */

/**
 * Lead with this. The strongest audio decision in the project is the decision
 * not to score most of it, and stating that first re-frames the two tracks
 * underneath as rare events rather than as a short soundtrack.
 */
export const silenceThesis = {
  kicker: "The first decision",
  line: "Most of the game is just the player's footsteps.",
  body: [
    "The scarcity of music is deliberate. Silence is what builds the solitude the whole art " +
      "direction is after, and it sharpens attention — a player with nothing to listen to starts " +
      "listening to the room, which is exactly what a game this dark needs them to do.",
    "It also protects the music. Because the score is rare, the places that have one become " +
      "places the player bonds to: a village, a willow, a boss who was worth a theme. Scoring " +
      "everything would have cost me the only thing that makes any of it land.",
  ],
} as const;

/* ---- the village themes ------------------------------------------------- */

/**
 * The safe places, and the only calm music in the game. Three villages, three
 * pieces, each one scored to tell its own location's story — so the score is
 * carrying setting and history, not just marking "you are safe now".
 */
export interface VillageTheme {
  id: string;
  place: string;
  /** The instrumentation, in two or three words. The fastest read. */
  instrumentation: string;
  /** What it sounds like. One or two sentences. */
  sound: string;
  /** Why it was scored that way. */
  why: string;
}

export const villageThemes: readonly VillageTheme[] = [
  {
    id: "woods",
    place: "The Woods",
    instrumentation: "Violins & flutes",
    sound:
      "Violins and flutes lead, slow and open, over the bonfires. It is the warmest music in " +
      "the game — and the only place in the score I let warmth in at all.",
    why:
      "This is the friendliest village the knight will ever reach, so it gets the friendliest " +
      "instruments. Strings and flutes carry human company in a way nothing else in my " +
      "instrument list does, and spending the game's whole supply of warmth here makes " +
      "arriving feel like relief rather than like a checkpoint.",
  },
  {
    id: "misty",
    place: "The Misty Lands",
    instrumentation: "Heavy reverb",
    sound:
      "The same calm tempo, drowned in reverb — long tails, no close detail, every phrase " +
      "arriving as if from somewhere further off than the player is standing.",
    why:
      "This is a place whose great age has already passed. Reverb is distance and it is memory, " +
      "so scoring the village as an echo says the thing the environment art says: the people who " +
      "made this are gone, and only the trees and the stones still remember it.",
  },
  {
    id: "frozen",
    place: "The Frozen Mountains",
    instrumentation: "Harmonics & suspended chords",
    sound:
      "High-pitched instruments, string harmonics and suspended chords that never quite " +
      "resolve — crystal, written as music, at the coldest and highest point in the world.",
    why:
      "Harmonics and unresolved suspensions are the closest sound I have to ice: brittle, thin " +
      "and beautiful without ever settling. Putting the highest music in the game at the highest " +
      "place in the game also makes the theme a reward — the player hears how far above " +
      "everything else they have climbed, and what the journey cost to get there.",
  },
];

/* ---- instruments that mean something ------------------------------------ */

/**
 * The diegetic half of the audio design: cases where the CHOICE OF INSTRUMENT
 * is the information. Every entry here breaks or bends the medieval-folk
 * palette on purpose, and the break is the message.
 */
export interface InstrumentMeaning {
  id: string;
  /** Where in the game this happens. */
  context: string;
  /** The instrument, named. Two words at most. */
  instrument: string;
  sound: string;
  why: string;
  /** The section elsewhere on this page that makes the same point. */
  echo?: string;
}

export const instrumentMeanings: readonly InstrumentMeaning[] = [
  {
    id: "dungeon-piano",
    context: "Dungeons",
    instrument: "Piano",
    echo: "Narrative motifs",
    sound:
      "A piano, played sparsely and atmospherically — single notes with room around them, " +
      "nothing folk about it, nothing else underneath.",
    why:
      "A piano is an instrument this world should not have. Nothing tells the player something " +
      "is wrong underground — no warning, no line of dialogue, no change of lighting. The " +
      "instrument does it on its own, and a player who cannot name why the dungeons feel off " +
      "still feels it from the first note.",
  },
  {
    id: "quantum-synths",
    context: "The quantum abilities",
    instrument: "Synths",
    sound:
      "The moment the player uses one of the old gods' powers, synths take the score — " +
      "sustained, electronic, sitting on top of whatever medieval instrumentation was playing.",
    why:
      "Same trick as the piano, aimed at a system instead of a place. A synthesiser cannot " +
      "belong to this world, so borrowing a god's power sounds like something arriving from " +
      "outside it. The power feels alien because it is scored as alien, and the player is told " +
      "what these abilities are without a single word of explanation.",
  },
  {
    id: "harp-healing",
    context: "Healing",
    instrument: "Harp",
    echo: "Diegetic design",
    sound:
      "An ascending arpeggio that grows more complex the longer it is played, and near a willow " +
      "tree it gains a full backing arrangement rather than staying alone.",
    why:
      "The knight heals by playing the harp Death gave them — their instrument, and the only " +
      "thing they do that is not violence. Writing the heal as a rising figure that develops as " +
      "it goes makes recovery audibly progressive, and letting the willow bring the rest of the " +
      "arrangement in makes the safe place sound like the safe place before the player reads any " +
      "of it on screen.",
  },
  {
    id: "boss-themes",
    context: "The three knight bosses",
    instrument: "Character themes",
    sound:
      "One theme each, fast-paced and driving, and each written to that knight in particular — " +
      "through its melody, its instrumentation or the mode it sits in.",
    why:
      "A boss theme is the only chance the score gets to characterise someone the player is too " +
      "busy to listen to. The tempo does the danger; the writing does the person, so the fight " +
      "is telling their story while it is happening. Mini-bosses deliberately get no music at " +
      "all — the silence marks them as lesser, and keeps a theme meaning that this one matters.",
  },
];

/* ---- sound feedback ----------------------------------------------------- */

/**
 * Short by design. Sound effects are not the interesting part of this section,
 * but leaving them out would imply the audio work stopped at the music.
 */
export const soundFeedback = {
  kicker: "Sound feedback",
  line:
    "Every combat action has organic, realistic sound feedback, recorded rather than " +
    "synthesised, so the game feels physical in the hand.",
  /** Named so the claim is concrete. Short, in the player's language. */
  actions: ["Hits & impacts", "Sword swoosh", "Dodge", "Pickups"],
  why:
    "In a game where the music is usually absent, effects are carrying the entire audio " +
    "channel most of the time. If the swing and the hit do not sound like weight meeting " +
    "weight, the silence stops reading as atmosphere and starts reading as a missing file.",
} as const;

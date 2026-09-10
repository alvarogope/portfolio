export const composerCredit = {
  kicker: "The Music & audio design",
  line: "I composed, performed and recorded the score myself.",
  body:
    "These two pieces were composed by me for the game and were implemented. " +
    "The main instrument is a piano, since it is odd to hear in a medieval wolrd, showing the quantum abilities.",
} as const;

export const silenceThesis = {
  kicker: "Main audio design decision",
  line: "Most of the game, the player is alone with their own footsteps.",
  body: [
    "The scarcity of music is deliberate. Silence is what builds the solitude the whole art " +
      "direction is after, and it sharpens attention — a player with nothing to listen to starts " +
      "listening to the room, which is exactly what a game this dark needs them to do.",
    "It also protects the music. Because the score is rare, the places that have one become " +
      "places the player bonds to: a village, a willow, a boss who was worth a theme. Scoring " +
      "everything would have cost me the only thing that makes any of it land.",
  ],
} as const;

export interface VillageTheme {
  id: string;
  place: string;
  instrumentation: string;
  sound: string;
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

export interface InstrumentMeaning {
  id: string;
  context: string;
  instrument: string;
  sound: string;
  why: string;
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

export const soundFeedback = {
  kicker: "Sound feedback",
  line:
    "Every combat action has organic, realistic sound feedback, recorded rather than " +
    "synthesised, so the game feels physical in the hand.",
  actions: ["Hits & impacts", "Sword swoosh", "Dodge", "Pickups"],
  why:
    "In a game where the music is usually absent, effects are carrying the entire audio " +
    "channel most of the time. If the swing and the hit do not sound like weight meeting " +
    "weight, the silence stops reading as atmosphere and starts reading as a missing file.",
} as const;

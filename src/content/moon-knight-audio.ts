export const composerCredit = {
  kicker: "The Music & audio design",
  line: "I composed, performed and recorded the music myself.",
  body:
    "These two pieces were composed by me for the game and were implemented. " + 
    "The main instrument is a piano, since it is odd to hear in a medieval wolrd, showing the quantum abilities.",
} as const;

export const silenceThesis = {
  kicker: "Main audio design decisions",
  line: "Most of the game, the player is alone with their own footsteps.",
  body: [
    "The sabsence of music is intentional. Silence is building the solitude I wqas looking for. " +
      "It also builds tension and makes the player focus fully on the game.",
    "It also makes the musical moments more special. If the player doesn't know when the music is " +
      "going to be played makes certain moments more memorable and places being felt special. " + 
      "If the music is played in certain scenarios, those places become more important for the player.",
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
      "These instruments are predominant as this ara is the most similar to medieval times, " +
      "as well as being very natural. Is the only level there is a glimpse of warmth in the game.",
    why:
      "The village here is the friendliest, so the instruments are more alligned with the world. " +
      "Strings and wind instruments feel the most humankind in the medieval times, making the player feel relieve.",
  },
  {
    id: "misty",
    place: "The Misty Lands",
    instrumentation: "Reverb",
    sound:
      "Still calm, but a lot of reverb. It feels like echo in the wind and from somewhere the player will never be.",
    why:
      "This place used to be great, but long ago. The reverb gives distance and they sound like people " +
      "talking in memories from the past. The people that lived here are gone with nobody remembering them.",
  },
  {
    id: "frozen",
    place: "The Frozen Mountains",
    instrumentation: "Harmonics & suspended chords",
    sound:
      "High-pitched instruments, string harmonics and suspended chords giving the feeling of crystal, " + 
      "for the coldest and highest point in the world.",
    why:
      "I consider these musical resources the closes to ice and glass for their coldness. " +
      "The suspension chords makes the player feel they need resolution and an ending. " +
      "It also relates to the level, making the player feel they have progressed and the" + 
      "journey is about to end epically",
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
    sound:
      "A piano, notes with room around them and the feeling of something wrong.",
    why:
      "A piano is an instrument that shouldn't exist in this time period. " +
      "The player can automatically feel something weird is happening in there.",
  },
  {
    id: "quantum-synths",
    context: "The quantum abilities",
    instrument: "Synths",
    sound:
      "The moment the player uses one of the old gods' powers, synths are played.",
    why:
      "The same reason as the piano, but further away. The god's power are not suppose to be " +
      "from this world and its arriving from another one, letting the player realise these things on their own.",
  },
  {
    id: "harp-healing",
    context: "Healing",
    instrument: "Harp",
    sound:
      "An ascending arpeggio that grows near a willow " +
      "tree, as it gains some backing arrangement and more harmonies.",
    why:
      "The arpeggio represents health and doing an ascension represents healing. " +
      "Making the music bigger next to a willow tree showas the player that this power is amplified.",
  },
  {
    id: "boss-themes",
    context: "The three knight bosses",
    instrument: "Character themes",
    sound:
      "One piece for each. Fast-paced and driving and each written to that knight in particular. " +
      "Through its melody and its instrumentation is where their stories are described.",
    why:
      "Boss fights looks for the opposite effect that the other game does and keeps the player in tension in another way. " +
      "It is also the only context the player is given about the boss's story",
  },
];

export const soundFeedback = {
  kicker: "feedback",
  line:
    "I seeked organic and realistic sound feedback, so the games feels natural where it has to.",
  actions: ["Hits & impacts", "Sword swoosh", "Dodge", "Pickups"],
  why:
    "In the game, the music is usually absent. Then sound effects are very important to get right. " +
    "If the swing and the hit do not sound properly, the atmosphere is completely lost.",
} as const;

export type WeatherId = "acid-rain" | "clean-rain" | "snow" | "wind" | "sandstorm";

export type WeatherRole = "signal" | "hazard";

export interface Weather {
  id: WeatherId;
  index: string;
  name: string;
  role: WeatherRole;
  roleLabel: string;
  where: string;
  body: string;
  afterSolve?: string;
  scored?: { track: string; line: string };
}

export const weathers: readonly Weather[] = [
  {
    id: "acid-rain",
    index: "1",
    name: "Acid rain",
    role: "signal",
    roleLabel: "The poisoned sky",
    where: "Every polluted rainy area",
    body:
      "It falls on everything the player has not solved yet.",
    afterSolve: "The same rain, running clean.",
  },
  {
    id: "clean-rain",
    index: "2",
    name: "Clean rain",
    role: "signal",
    roleLabel: "The healed sky",
    where: "solved rainy area",
    body:
      "The acid rains transforms to this once the level is completed.",
    afterSolve: "This is the after. It is what the solve leaves behind.",
    scored: { track: "Rain Level", line: "The world weeping, then washed clean" },
  },
  {
    id: "snow",
    index: "3",
    name: "Snow",
    role: "hazard",
    roleLabel: "Atmosphere & hazard",
    where: "snow level",
    body:
      "Hard weather with its own mood: a condition to survive as much as an atmosphere to feel, " +
      "and the level is built around what its sky is doing to the player.",
    scored: { track: "Snow Level", line: "Still, crystalline cold" },
  },
  {
    id: "wind",
    index: "4",
    name: "Wind",
    role: "hazard",
    roleLabel: "Atmosphere & hazard",
    where: "",
    body:
      "Not only a particle effect. I built the wind as an actual force and drove the grass off " +
      "it, so the blades bend and move the same way the weather is blowing. The wind is in the " +
      "world rather than in front of it.",
  },
  {
    id: "sandstorm",
    index: "5",
    name: "Sandstorm",
    role: "hazard",
    roleLabel: "Atmosphere & hazard",
    where: "",
    body:
      "The harshest of them. Hard weather in the same system as the rain, pointed at the " +
      "moment-to-moment rather than at the state of the place.",
  },
];

export const rosterThesis =
  "Every weather forms part of the level design's atmosphere. It belongs to the place and resonates " +
  "to the story the game is telling. By changing the weather, the world makes sense.";

export type ZoneId = "poisoned" | "healed";

export interface Zone {
  id: ZoneId;
  index: string;
  name: string;
  stateLabel: string;
  sky: WeatherId;
  skyLine: string;
  groundLine: string;
  readout: string;
  detail: string;
}

export const zones: readonly Zone[] = [
  {
    id: "poisoned",
    index: "",
    name: "A polluted place",
    stateLabel: "Poisoned",
    sky: "acid-rain",
    skyLine: "Acid rain",
    groundLine: "Monsters and pollution",
    readout: "This place is polluted",
    detail:
      "It is the default state of the world in the game. The player can know if a level is completed " +
      "by observing the environment.",
  },
  {
    id: "healed",
    index: "",
    name: "A healed place",
    stateLabel: "Healed",
    sky: "clean-rain",
    skyLine: "Cleansed rain",
    groundLine: "Life returning to the ground",
    readout: "This place was fixed",
    detail:
      "The rain stops being acid and the world starts healing.",
  },
];

export const flip = {
  trigger: "Puzzle Solved",
  direction: "",
  body:
    "One trigger, one direction, and it reaches every sky. The change belongs to that place " +
    "rather than to a global counter, and there is no meter filling toward it — a place is " +
    "poisoned until it is solved.",
  rule: "Acid rain stops being acid · hard weather stops",
};

export const rejectedReadout = {
  label: "Progress bar",
};

export const loopPointer = {
  label: "the gameplay loop it relates to",
  href: "#level-design",
  body:
    "",
};

export const flipSummary =
  "Two halves of one world. On the left, a poisoned place under acid rain, with nothing growing " +
  "under it. On the right, the same place after the player solves its puzzle: the rain has turned " +
  "clean and life is returning to the ground. Between them, the single trigger that moves a place " +
  "from one to the other — solving that place's puzzle — drawn as a one-way crossing. The same " +
  "trigger reaches every sky: acid rain stops being acid, and hard weather stops. Underneath, " +
  "struck through, the progress bar this system was built instead of.";

export const weatherCredit = {
  body:
    "I designed the weather syste and I also composed the music that it will be played during " +
    "the puzzle beat of them. I wanted the player to feel the progress in each world and that " +
    "all of them have their own personality",
};
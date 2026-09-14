export interface TeamNote {
  headline: string;
  role: string;
  body: string;
}

export const teamNote: TeamNote = {
  headline: "Team project · Team of 5",
  role: "Systems & World Designer",
  body:
    "This section shows how we worked together as a team for the same goal. The premise world and narrative " +
    "were designed together, as a team. This section is mainly for context that represents our work as a team.",
};


export const premise =
  "This two-player narrative exploration adventure is set in a solar system. Two members of enemies species are infected by " +
  "the Symbiochord. Their names: Drayk, a Rynor soldier, and Aevi, a Tethran scientist. This parasite connects their bodies and " +
  "their fate. If one dies, the other dies too. They have to cooperate althought their species were in war for centuries.";

export type HostId = "drayk" | "aevi";

export interface Host {
  id: HostId;
  name: string;
  species: string;
  vocation: string;
  tag: string;
  backstory: string;
}

export const hosts: readonly Host[] = [
  {
    id: "drayk",
    name: "Drayk",
    species: "Rynor",
    vocation: "Soldier",
    tag: "Rynor · Soldier",
    backstory:
      "Raised and trained in war. Prepared to kill Tethrans as they made his world burn. " +
      "From his side, he thinks of the Symbiochord as a weapon and the stranger on the other side of it " +
      "its his captor.",
  },
  {
    id: "aevi",
    name: "Aevi",
    species: "Tethran",
    vocation: "Scientist",
    tag: "Tethran · Scientist",
    backstory:
      "She studied the Symbiochord from the outside and now has to war it. She understands this parasite better than " +
      "anyone, making her aware of the risks that she's taking and the danger their in.",
  },
];

export const getHost = (id: HostId): Host => {
  const host = hosts.find((h) => h.id === id);
  if (!host) throw new Error(`Unknown host: ${id}`);
  return host;
};


export interface WorldNote {
  id: string;
  label: string;
  body: string;
}

export const worldNotes: readonly WorldNote[] = [
  {
    id: "veynar",
    label: "The Veynar",
    body:
      "An older civilisation engineered the Symbiochord as an instrument of peace: a parasite " +
      "that binds two enemies into one life, so neither can harm the other without harming " +
      "themselves. They went extinct before they ever used it.",
  },
  {
    id: "shatterstorm",
    label: "The Shatterstorm",
    body:
      "The catastrophe that ended them released the parasite across the galaxy and broke whole " +
      "worlds into floating fragments. The five worlds the game is played across are what was " +
      "left standing.",
  },
  {
    id: "hosts",
    label: "The hosts",
    body:
      "Centuries later the parasite finds two unwilling hosts on opposite sides of a war neither " +
      "of them started, and forces the peace the Veynar never got to impose.",
  },
];

export interface StoryBeat {
  id: string;
  index: string;
  title: string;
  mapLabel: string;
  body: string;
  decisive?: boolean;
}

export const storyBeats: readonly StoryBeat[] = [
  {
    id: "cooperation",
    index: "Beat 01",
    title: "Forces Cooperation",
    mapLabel: "Forced Cooperation",
    body:
      "They meet as enemies and do the obvious thing. The Symbiochord passes every wound straight " +
      "back through the attacker, so the fight ends the only way it can — both of them hurt, " +
      "neither of them dead. Cooperation is not a choice yet. It is the only move the parasite " +
      "leaves on the board.",
  },
  {
    id: "timer",
    index: "Beat 02",
    title: "Limited Time",
    mapLabel: "Limited Time",
    body:
      "The parasite is spreading through both hosts and the window in which it can still be " +
      "removed is closing. A timer enters the game. Removal may already be irreversible, and " +
      "nobody is going to tell them which side of that line they are on.",
  },
  {
    id: "doubt",
    index: "Beat 03",
    title: "Doubt & Misunderstanding",
    mapLabel: "Doubt & Misunderstanding",
    body:
      "Ruins across the system give up the Veynar's history in fragments. Each host reads those " +
      "fragments through their own language and their own war, and the first real doubts about " +
      "the other are planted without either of them saying a word.",
  },
  {
    id: "tension",
    index: "Beat 04",
    title: "Tensions Escalate",
    mapLabel: "Tensions Escalate",
    body:
      "Each host is told, separately, that the other means to betray them. Neither can check the " +
      "claim: they cannot speak clearly enough to ask. Suspicion peaks with the parasite almost " +
      "complete and the timer almost out.",
  },
  {
    id: "final-choice",
    index: "Beat 05",
    title: "The Final Choice & The Moment of Truth",
    mapLabel: "The Final Choice",
    decisive: true,
    body:
      "At the end each host chooses alone: give up their own survival for the other, or take the " +
      "Symbiochord for their own species. Neither learns what the other picked until both choices " +
      "are locked in.",
  },
];


export const hiddenChoice = {
  label: "How the endings are selected",
  body:
    "The three endings are not a menu. Each player commits alone, with no way to see or discuss " +
    "the other's decision — the distorted voice chat that runs through the whole game makes sure " +
    "of it. It is the pair of choices that picks the ending, never one of them, so both players " +
    "end up answering the same question at the same moment: do I trust someone I was raised to " +
    "kill? A prisoner's dilemma with a species on each side of the table.",
} as const;

export type EndingTone = "unity" | "betrayal" | "destruction";

export interface StoryEnding {
  id: string;
  name: string;
  tone: EndingTone;
  condition: string;
  mapTag: string;
  outcome: string;
}

export const storyEndings: readonly StoryEnding[] = [
  {
    id: "unity",
    name: "Unity",
    tone: "unity",
    condition: "Both choose the selfless act",
    mapTag: "Both selfless",
    outcome:
      "The parasite completes and absorbs both hosts into a single collective consciousness. The " +
      "war ends everywhere at once — universal peace, bought with individuality and free will.",
  },
  {
    id: "betrayal",
    name: "Betrayal",
    tone: "betrayal",
    condition: "One betrays the other",
    mapTag: "One selfish",
    outcome:
      "Whoever chose for themselves seizes control of the Symbiochord, and their species survives " +
      "with it. The other species is wiped out. Which of the two lives depends entirely on which " +
      "host broke first.",
  },
  {
    id: "mutual-destruction",
    name: "Mutual Destruction",
    tone: "destruction",
    condition: "Neither cooperates",
    mapTag: "Both selfish",
    outcome:
      "Both reach for the parasite and neither lets go. Cooperation fails at the last possible " +
      "moment, both hosts die, and the Symbiochord survives them to find new hosts and begin " +
      "again.",
  },
];

export const mapNotes = {
  main:
    "The map carries the shape and the names. Each beat, each ending and how the two sealed " +
    "choices pick between them are written out in full on the deep dive.",
  narrow:
    "The map is drawn on wider screens. The same structure reads top to bottom here: the two " +
    "hosts above, then the five beats in order.",
} as const;

export const mapSummary =
  "Two backstory nodes, Drayk of the Rynor and Aevi of the Tethrans, converge where the " +
  "Symbiochord chains them together. From there a single spine runs through four story beats — " +
  "forced cooperation, a closing removal window, doubt sown by the Veynar ruins, and escalating " +
  "suspicion — and drops into the fifth beat, the final choice. Below it each player seals one " +
  "decision, with no information passing between them, and every ending takes one line from each " +
  "of them, because it is the pair of choices that decides which of the three is reached: Unity " +
  "if both choose selflessly, Betrayal if one of them chooses selfishly, and Mutual Destruction " +
  "if neither cooperates.";

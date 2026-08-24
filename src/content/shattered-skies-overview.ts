/**
 * Shattered Skies — "The Game": the premise, the world, and the narrative
 * structure the TEAM built.
 *
 * ATTRIBUTION. Everything in this file describes a team project (team of 5).
 * It is context, not credit: it exists so that the contribution sections
 * further down the page — the planetary system, the interdependent puzzles,
 * the traversal, the knowledge-gated progression — land against a game the
 * reader already understands. My role on it was Systems & World Designer, and
 * `teamNote` below is rendered visibly at the head of the section so the
 * distinction is never left to inference.
 *
 * THE SHAPE the diagram draws is the reason this is one file: two backstories
 * converge onto a single spine of five beats, the spine ends in a choice each
 * player makes alone, and the pair of choices — not either one — selects the
 * ending. `NarrativeMap` reads the arrays below in order and derives every
 * coordinate from them, so the geometry lives in the component and the story
 * lives here.
 *
 * Pronouns: the two hosts are written without gendered pronouns throughout.
 * They are aliens, the game never fixes it, and neutral phrasing costs nothing.
 */

/* ---- attribution -------------------------------------------------------- */

export interface TeamNote {
  /** The headline claim, kept blunt. */
  headline: string;
  /** My role on the team. Matches `facts.role` in the project file. */
  role: string;
  /** The sentence that separates this section from the ones after it. */
  body: string;
}

export const teamNote: TeamNote = {
  headline: "Team project · Team of 5",
  role: "Systems & World Designer",
  body:
    "This section is the game we made together — the premise, the world and the narrative " +
    "structure are the team's work, and the story was written as a shared effort. It is here " +
    "as context. My own contributions to Shattered Skies are the sections that follow it.",
};

/* ---- the premise -------------------------------------------------------- */

export const premise =
  "A two-player narrative exploration adventure set in a miniature solar system. Two members " +
  "of opposing alien species — Drayk, a Rynor soldier, and Aevi, a Tethran scientist — are " +
  "infected by the Symbiochord, a parasite that physically chains them together and merges " +
  "their fates: if one dies, both die. They have to cooperate despite centuries of war between " +
  "their species.";

/* ---- the hosts ----------------------------------------------------------
   Two ids, two colours. The map, the host cards and the sealed-choice gates
   all key off these, so the reader learns the colour coding from the cards
   above the diagram and never has to be told it twice. */

export type HostId = "drayk" | "aevi";

export interface Host {
  id: HostId;
  name: string;
  species: string;
  vocation: string;
  /** "Rynor · Soldier" — pre-joined for the diagram's second line. */
  tag: string;
  /** Two sentences at most: this is a backstory node, not a character sheet. */
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
      "Raised inside the war and trained to read every Tethran as the reason their world burned. " +
      "Meets the Symbiochord as a weapon, and the stranger on the other end of it as a captor.",
  },
  {
    id: "aevi",
    name: "Aevi",
    species: "Tethran",
    vocation: "Scientist",
    tag: "Tethran · Scientist",
    backstory:
      "A researcher who studied the Symbiochord from the outside and now wears it. Understands " +
      "the parasite better than anyone alive, which makes what it will cost harder to ignore.",
  },
];

export const getHost = (id: HostId): Host => {
  const host = hosts.find((h) => h.id === id);
  if (!host) throw new Error(`Unknown host: ${id}`);
  return host;
};

/* ---- the world ---------------------------------------------------------- */

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

/* ---- the spine ----------------------------------------------------------
   Five beats. `mapLabel` is the short form the diagram node carries; `body` is
   the full beat, and it is real HTML text below the diagram — which is also
   what the narrow-screen fallback reads. `decisive` marks the beat the endings
   hang off, drawn apart from the spine. */

export interface StoryBeat {
  id: string;
  /** "Beat 01". Authored rather than derived so the copy can change freely. */
  index: string;
  title: string;
  /** Short enough to sit in a diagram node at two lines. */
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
    title: "Limited Time — Stakes Raised",
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
    title: "The Final Choice — Moment of Truth",
    mapLabel: "The Final Choice",
    decisive: true,
    body:
      "At the end each host chooses alone: give up their own survival for the other, or take the " +
      "Symbiochord for their own species. Neither learns what the other picked until both choices " +
      "are locked in.",
  },
];

/* ---- the hidden-information choice -------------------------------------- */

export const hiddenChoice = {
  label: "How the endings are selected",
  body:
    "The three endings are not a menu. Each player commits alone, with no way to see or discuss " +
    "the other's decision — the distorted voice chat that runs through the whole game makes sure " +
    "of it. It is the pair of choices that picks the ending, never one of them, so both players " +
    "end up answering the same question at the same moment: do I trust someone I was raised to " +
    "kill? A prisoner's dilemma with a species on each side of the table.",
} as const;

/* ---- the endings --------------------------------------------------------
   The GDD's three victory conditions, and they are exactly the three cells of
   a two-by-two choice matrix: both selfless, one selfish, both selfish. Two
   players with two options each gives four combinations and three distinct
   outcomes, because it does not matter WHICH of them betrays the other — only
   that one of them did. That collapse is the reason there are three endings
   rather than four, and it is what makes the structure a prisoner's dilemma
   rather than a menu. */

export type EndingTone = "unity" | "betrayal" | "destruction";

export interface StoryEnding {
  id: string;
  name: string;
  tone: EndingTone;
  /** The pair of choices that reaches it, long form. */
  condition: string;
  /** The same thing at diagram size. */
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

/** The `<desc>` the diagram is announced with. One sentence per band. */
export const mapSummary =
  "Two backstory nodes, Drayk of the Rynor and Aevi of the Tethrans, converge where the " +
  "Symbiochord chains them together. From there a single spine runs through four story beats — " +
  "forced cooperation, a closing removal window, doubt sown by the Veynar ruins, and escalating " +
  "suspicion — and drops into the fifth beat, the final choice. Below it each player seals one " +
  "decision, with no information passing between them, and every ending takes one line from each " +
  "of them, because it is the pair of choices that decides which of the three is reached: Unity " +
  "if both choose selflessly, Betrayal if one of them chooses selfishly, and Mutual Destruction " +
  "if neither cooperates.";

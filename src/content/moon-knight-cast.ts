/**
 * Moon-Knight — Dramatis Personae, the cast.
 *
 * Five characters, and for each one the DESIGN PURPOSE: why they exist and
 * what they do for the player. The role line is the "who"; the purpose is the
 * portfolio value, so both are first-class fields rather than one blob.
 *
 * The cast is not a flat list — it is three bands, and `band` is what sorts a
 * character into one:
 *
 *   - "player"    THE MOON-KNIGHT, rendered large. Carries a `contrast`, the
 *                 silent-warrior / heals-with-an-instrument opposition that is
 *                 the headline character-design decision on this project.
 *   - "encounter" DEATH and ORPHEUS — the two figures the world sends at you.
 *   - "mirror"    THE WITCH and THE DRUID, always a PAIR. They carry `stance`
 *                 and `answer` because they are the same question asked twice:
 *                 see `mirrorTruth` below, which is the question itself.
 *
 * `accent` is a render token, not lore — it tints the plate behind the
 * character's emblem and their stance label. Every accent is checked to clear
 * AA as small text on the card panel (#0F141E), because the mono labels are
 * actually painted with it.
 *
 * `id` is the React key AND the emblem selector in `CastEmblems.tsx`
 * (`EMBLEMS[id]`), so adding a character means adding an emblem of that id.
 */

export type CastId = "moon-knight" | "death" | "witch" | "druid" | "orpheus";

export type CastBand = "player" | "encounter" | "mirror";

interface CastBase {
  id: CastId;
  name: string;
  band: CastBand;
  /** Mono label above the name — their function, not their job title. */
  title: string;
  /** One line, scannable: who they are and what they do to you. */
  role: string;
  /** The design/narrative reasoning. The reason this section exists. */
  designPurpose: string;
  /** Plate wash + stance ink. AA-checked on the card panel. */
  accent: string;
}

/** One half of the Moon-Knight's contrast. Two of these, set against each other. */
export interface ContrastFace {
  /** Three or four words. Read at a glance, in mono. */
  label: string;
  note: string;
}

export interface PlayerMember extends CastBase {
  band: "player";
  /** [how they read, how they heal] — the opposition, in that order. */
  contrast: readonly [ContrastFace, ContrastFace];
}

export interface EncounterMember extends CastBase {
  band: "encounter";
}

export interface MirrorMember extends CastBase {
  band: "mirror";
  /** One word: the position they hold. Printed large — it is the pairing. */
  stance: string;
  /** What they would have you do about the truth, in their own voice. */
  answer: string;
}

export type CastMember = PlayerMember | EncounterMember | MirrorMember;

/* ------------------------------------------------------------- the player -- */

export const castPlayer: PlayerMember = {
  id: "moon-knight",
  name: "The Moon-Knight",
  band: "player",
  title: "The Player",
  accent: "#B8C4D4",
  role:
    "The silent protagonist. Fully customizable, and wakes with no memory — so the player learns the world at exactly the speed the character does.",
  contrast: [
    {
      label: "Never speaks",
      note:
        "No dialogue and no voice. The focus is on feeling, and silence under armour reads as a hard, capable warrior before the player has done anything.",
    },
    {
      label: "Heals by playing",
      note:
        "The one way back to full strength is to stop, sit, and play an instrument — the harp Death hands you in the first minutes.",
    },
  ],
  designPurpose:
    "The contrast is the point. A mute warrior whose only act of self-repair is music opens a gap between how the character looks and how they mend, and that gap is where empathy gets in — you stop reading the armour and start reading the person inside it. Amnesia does the same job for the world: neither of you knows Kaelum yet.",
};

/* --------------------------------------------------------- the encounters -- */

export const castEncounters: readonly EncounterMember[] = [
  {
    id: "death",
    name: "Death",
    band: "encounter",
    title: "First NPC",
    accent: "#CE727E",
    role:
      "A veiled woman in white. She gives you the harp that heals and revives you every time you fall; her energy runs through the willow trees. Her purpose is never stated.",
    designPurpose:
      "She is the mystery engine — she feeds the player just enough context to move and never enough to understand, so the questions stay open for three acts. At the end she embraces you, and her white dress stains with blood, like a white rose.",
  },
  {
    id: "orpheus",
    name: "Orpheus",
    band: "encounter",
    title: "The Cost",
    accent: "#E07A45",
    role:
      "A fallen soldier in the Woods village who gave up the life you are still living. He introduces the jousting minigame; win it and he points you at a hidden menace in the woods.",
    designPurpose:
      "A quiet gut-punch. He is always there to talk to — right up until you come back after his warning and find him dead and the village burned. He is the proof that the world takes what the player does not protect.",
  },
];

/* ------------------------------------------------------------- the mirror -- */

/** The question the Witch and the Druid are two answers to. */
export const mirrorTruth = {
  label: "The same truth",
  line: "The gods are a gap in what people can explain — and both of them work it out.",
  note: "Two answers. The player follows one.",
} as const;

/** Always rendered as a pair, in this order: inquiry on the left, faith on the right. */
export const castMirror: readonly [MirrorMember, MirrorMember] = [
  {
    id: "witch",
    name: "The Witch",
    band: "mirror",
    title: "The Seeker",
    stance: "Inquiry",
    accent: "#57A886",
    role:
      "Follows you from the Woods to the Misty Lands to the Frozen Mountains, granting the powers of the old gods — the quantum mechanics.",
    answer: "Tear down the order of the gods. Begin an age of humankind.",
    designPurpose:
      "She embodies inquiry: she digs at the world's mysteries instead of settling for the god-of-the-gaps fallacy. Follow her the whole way and she opens an ending no other path reaches.",
  },
  {
    id: "druid",
    name: "The Druid",
    band: "mirror",
    title: "The Keeper",
    stance: "Faith",
    accent: "#C9A961",
    role:
      "In the Misty Lands village he asks your help against the banshees; succeed and he reveals the hidden second fortress. He returns later in the Frozen Mountains.",
    answer: "Keep it buried. Society is not ready to be told.",
    designPurpose:
      "He sees the same fallacy the Witch does and asks you to bury it anyway — caution as a whole worldview, not cowardice. Built as her deliberate mirror, so choosing between them is choosing how knowledge should be held.",
  },
];

/** Reading order for the section: player, then the two you meet, then the pair. */
export const moonKnightCast: readonly CastMember[] = [
  castPlayer,
  ...castEncounters,
  ...castMirror,
];

/** DOM anchor for a character's card, so anything can deep-link to one. */
export const castAnchor = (id: CastId) => `cast-${id}`;

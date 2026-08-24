/**
 * Moon-Knight — two expansion concepts.
 *
 * WHERE THE WORLD COULD GO, and nothing more than that: neither of these is
 * built, and the section exists to show narrative RANGE rather than a plan for
 * shipping anything. Nothing in this file should ever grow a price, a tier, a
 * roadmap or a list of achievements — the moment it does, it stops being a
 * worldbuilding artifact and starts being a pitch deck, which is not what the
 * page is arguing.
 *
 * THE CLAIM IS THE PROVENANCE. Both concepts were reverse-engineered out of a
 * quantum mechanic that already exists in `moonKnight.abilities`
 * (`src/content/games/moon-knight.ts`), not out of a wish for more content:
 *
 *   Echoes      ← Double Superposition. Enemy-exclusive in the main game, a
 *                 one-second state restoration the player is taught to fear.
 *                 The expansion keeps the principle and changes the scale.
 *   The Circus  ← entanglement, the quantum basis of Elliptical Force. The
 *                 expansion moves it off an ability and onto a whole cast.
 *
 * `mechanic` MUST match an ability name or quantum basis in that file. It is a
 * cross-reference the reader is expected to follow back up the page to section
 * 03, so a mechanic renamed there has to be renamed here.
 *
 * `designPoint` is the load-bearing field. The hook is the story; the design
 * point is why the story is evidence of anything, and a reader skimming only
 * those two lines should still get the section's whole argument.
 */

export type ExpansionId = "echoes" | "circus";

export interface Expansion {
  id: ExpansionId;
  /** "Expansion I". Authored, not derived — these are not numbered content. */
  label: string;
  title: string;
  /** The mechanic this grows from, named exactly as section 03 names it. */
  mechanic: string;
  /** How that mechanic behaves in the main game, so the extension is legible. */
  mechanicNote: string;
  /** The story, in three sentences. Evocative, and spoils itself on purpose. */
  hook: string;
  /** Why the concept is evidence: what the mechanic does that the story needed. */
  designPoint: string;
}

export const expansions: readonly Expansion[] = [
  {
    id: "echoes",
    label: "Expansion I",
    title: "Echoes",
    mechanic: "Double Superposition",
    mechanicNote: "Enemy-exclusive in the main game · one-second state restoration",
    hook:
      "The Moon-Knight steps back to the year before the Misty Lands fell and finds them alive: " +
      "no fog, no ghosts, a wealthy society going about its evening. A prince asks for help " +
      "recovering his beloved from the monsters of The Underground — a place the player will " +
      "recognise, because it is the Misty Lands as they are now. A new partner rides with you, " +
      "loses his mind before the end and turns his sword on you; when he falls, the princess " +
      "names the curse of insanity in her family's blood, and, having lost the one she loved, " +
      "takes her own life.",
    designPoint:
      "Double Superposition is the one power the player is never given — enemies rewind a second " +
      "and the player learns the principle by losing to it. Echoes hands them the same principle " +
      "at another scale: not one second but one age, which buys the thing a ruin can never do on " +
      "its own — let the player stand in the same place twice, once as the wreck they know and " +
      "once as the life it lost.",
  },
  {
    id: "circus",
    label: "Expansion II",
    title: "The Circus",
    mechanic: "Entanglement",
    mechanicNote: "The quantum basis of Elliptical Force · correlated convergence",
    hook:
      "In the Frozen Lands a masked stranger called The Jester invites the Moon-Knight to The " +
      "Circus, an event held somewhere past the edge of Kaelum's continent. Its members finish " +
      "one another's movements and speak with a single voice. In a castle of appalling luxury " +
      "the player is asked to unseat the royal family who keep The Circus for their own " +
      "entertainment — and finds an ancient line of vampires, who flinch from the silver of the " +
      "Moon-sword.",
    designPoint:
      "Elliptical Force is entanglement as one ability: two orbs, correlated, converging on a " +
      "shrinking safe zone. The Circus asks what the same principle looks like when it is not " +
      "an ability but an identity — a troupe sharing abilities and one voice, so the quantum " +
      "idea is the cast itself rather than something the cast casts.",
  },
] as const;

/**
 * The framing. Says out loud that these are unbuilt, and says what they are
 * for, so neither the reader nor a future editor can mistake the section for
 * a content plan.
 */
export const expansionsFraming =
  "Neither of these is built. They are here for where they came from: each one grew out of a " +
  "quantum mechanic the game already has rather than out of a wish for more game. A principle " +
  "designed for combat turned out to be a premise for a story too — the systems generate the " +
  "fiction, which is the argument this page has been making, run one step further.";

/** Marks every card. Two words, so the framing is never more than a glance away. */
export const conceptTag = "Concept";

export type ExpansionId = "echoes" | "circus";

export interface Expansion {
  id: ExpansionId;
  label: string;
  title: string;
  mechanic: string;
  mechanicNote: string;
  hook: string;
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
      "The Moon-Knight steps back to when the Misty Lands started falling and finds the place in its original form: " +
      "no fog, no ghosts and a wealthy society. The prince asks for help " +
      "to recover his beloved from monsters hiding in The Underground. The action takes place in what is " +
      "called The Misty Lands, in the game. The prince will ride with you and " +
      "lose his mind before you get to the princess, confronting you. When you defeat him, the princess " +
      "mentions a curse in her family, and, after losing the one that she loved, " +
      "takes her own life.",
    designPoint:
      "",
  },
  {
    id: "circus",
    label: "Expansion II",
    title: "The Circus",
    mechanic: "Entanglement",
    mechanicNote: "The quantum basis of Elliptical Force · correlated convergence",
    hook:
      "In the Frozen Mountains a masked stranger called The Jester appears and invites the Moon-Knight to The " +
      "Circus. This event happens somewhere outside of Kaelum. The members of this company finish " +
      "each other's phrases and they speak with the same voice. After arriving at a luxurious castle, " +
      "the knight has to defeat the nobility that keeps The Circus under their control for " +
      "their own entertainment. Eventually, the knight discovers that this family is an ancient line of vampires, " + 
      "who can only be defeated using the silver of the Moon-sword.",
    designPoint:
      "",
  },
] as const;

export const expansionsFraming =
  "Neither of these is built. They are here for where they came from: each one grew out of a " +
  "quantum mechanic the game already has rather than out of a wish for more game. A principle " +
  "designed for combat turned out to be a premise for a story too — the systems generate the " +
  "fiction, which is the argument this page has been making, run one step further.";

export const conceptTag = "Concept";
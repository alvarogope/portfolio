/**
 * Moon-Knight — diegetic design: the mechanics that hide in the world.
 *
 * This is the design thesis of the whole project, so the file is shaped around
 * it rather than around a list of features. Every entry below is a system that
 * a conventional game would have put in a menu, a bar or an overlay, and that
 * this game instead expresses as an object, a gesture or a place.
 *
 * EVERY ENTRY CARRIES ITS REASONING. `mechanic` is what the player does; `why`
 * is why it was built that way. The `why` is the portfolio value — a reader who
 * skims only the `why` lines should still come away with the argument — so it
 * is a first-class field, never folded into the description.
 *
 * `replaces` names the conventional UI element the mechanic dissolves. It is
 * the fastest way to read the thesis: health bar → moon, XP counter → roses,
 * minimap → sword. Two or three words, in the language a player would use,
 * because the contrast is the whole point.
 *
 * `glyph` selects the emblem in `DiegeticDesign.tsx`. Three of the four are
 * drawn from geometry shared with the other Moon-Knight sections — the moon
 * phases with the narrative arc, the rose and the harp with the cast — because
 * these motifs recur across the game and must not drift between sections.
 */

/* ---- the thesis --------------------------------------------------------- */

export const diegeticThesis = {
  kicker: "The throughline",
  /** One line. If a reader takes nothing else from this section, this. */
  line:
    "Mechanics that disappear into the world — UI, progression and navigation " +
    "expressed through fiction, not menus.",
  body:
    "Every system below could have been a bar, a number or an overlay. Each one is " +
    "instead an object the knight carries, a mark they leave, or a thing they do with " +
    "their body. The player reads the game by looking at the game.",
} as const;

/* ---- the moon HUD ------------------------------------------------------- */

/** The three states of the health readout, worn on the armour. */
export type HudPhase = "full" | "half" | "new";

export interface HudState {
  phase: HudPhase;
  /** Mono label under the glyph — the player's condition, in one word. */
  label: string;
  /** The reading, in the fiction. One short line. */
  note: string;
}

/**
 * Full → half → new, in that order: this is a gradient, not a set, and the
 * order carries the information. Rendered as the section's headline visual.
 */
export const moonHudStates: readonly HudState[] = [
  {
    phase: "full",
    label: "Whole",
    note: "The disc on the backplate is full and lit. Nothing has touched you yet.",
  },
  {
    phase: "half",
    label: "Wounded",
    note: "Half the moon has gone dark — half the light you started the fight with.",
  },
  {
    phase: "new",
    label: "Failing",
    note: "No light left on the plate. The next hit is the one that ends it.",
  },
];

/* ---- the diegetic mechanics --------------------------------------------- */

export type DiegeticGlyph = "moon-hud" | "rose" | "sword" | "harp";

export interface DiegeticMechanic {
  id: string;
  glyph: DiegeticGlyph;
  /** The conventional UI element this dissolves. Two or three words. */
  replaces: string;
  title: string;
  /** What the player actually does. Concise — this gets skimmed. */
  mechanic: string;
  /** The design reasoning. The reason the entry is here at all. */
  why: string;
}

export const diegeticMechanics: readonly DiegeticMechanic[] = [
  {
    id: "moon-hud",
    glyph: "moon-hud",
    replaces: "Health bar",
    title: "The Moon Health HUD",
    mechanic:
      "The health bar is the moon on the knight's armour. Full health is a full moon; " +
      "as you take damage it wanes to a half-moon, then to a new moon. There is no " +
      "floating bar anywhere on screen — your condition is worn on your back.",
    why:
      "The most-read stat in the game becomes the game's central symbol. The player " +
      "checks their health by looking at the character they are already watching, so " +
      "the eye never leaves the world, and every glance at the moon is one more " +
      "repetition of the motif the whole story is built on.",
  },
  {
    id: "white-rose-xp",
    glyph: "rose",
    replaces: "XP & levelling",
    title: "The White-Rose XP System",
    mechanic:
      "Experience comes only from defeating bosses. You stain a white rose in the " +
      "boss's blood, and each stained rose is one point toward the next sword tier. " +
      "The last tier costs two.",
    why:
      "There is nothing to farm. XP is gated to story and optional bosses, so " +
      "progression regulates its own difficulty through the narrative instead of a " +
      "grind loop — a player who wants to be stronger has to go and beat something, " +
      "and the record of that is an object they carry, not a number that went up.",
  },
  {
    id: "moonlight-wayfinding",
    glyph: "sword",
    replaces: "Map & compass",
    title: "Moonlight Wayfinding",
    mechanic:
      "No map and no compass. To find the next Moon Fragment the knight raises their " +
      "sword to catch the moonlight, and the blade reflects toward the objective. It " +
      "cannot be used in combat.",
    why:
      "Navigation becomes a gesture performed in the world rather than an overlay drawn " +
      "on top of it. It costs time and leaves you open, so orienting yourself is a " +
      "decision with a price — and locking it out of combat keeps it a moment of " +
      "stillness between fights instead of a button held down forever.",
  },
  {
    id: "harp-healing",
    glyph: "harp",
    replaces: "Potions & rest menu",
    title: "Healing by Instrument",
    mechanic:
      "Death gives you a harp. You heal by playing it, and heal fully only at a willow " +
      "tree, where the music grows louder and runs longer.",
    why:
      "The silent warrior restores themself with music — the one thing they do that is " +
      "not violence, and the sharpest contrast available to a character who never " +
      "speaks. Tying the full heal to the willow trees makes restoration a place as " +
      "well as an act, and hands the game's themes of sorrow and rebirth to the system " +
      "the player touches most.",
  },
];

/* ---- invisible design --------------------------------------------------- */

/**
 * The cluster: decisions where the design is felt and never seen. Shorter than
 * the four above and reasoning-led — the decision is one line and the `why` is
 * the substance, so they render as decision → why pairs.
 */
export interface DesignDecision {
  id: string;
  decision: string;
  why: string;
}

export const invisibleDesign: readonly DesignDecision[] = [
  {
    id: "no-difficulty",
    decision: "No difficulty select",
    why:
      "You meet the enemies as they were designed to be met. Every encounter is tuned " +
      "against one set of numbers, so the fight the designer built is the fight the " +
      "player gets — and nobody has to declare what kind of player they are before " +
      "they have played.",
  },
  {
    id: "camouflaged-loading",
    decision: "Loading screens camouflaged in gameplay",
    why:
      "Elevators, doors that take a moment to unbar, long slow passages between " +
      "regions. The world keeps running while it streams, so the fiction is never " +
      "cut by a spinner and a tip of the day.",
  },
  {
    id: "no-block",
    decision: "You cannot block, by design",
    why:
      "Blocking bred conservative play — players held the guard up and waited the fight " +
      "out. Removing it keeps combat moving: dodge is unlimited, parry is high risk for " +
      "high reward, and there is no button that turns defence into standing still.",
  },
  {
    id: "willow-saves",
    decision: "Saving only at willow trees",
    why:
      "Resting resets the area with new enemy placements. Rest is a place you travel to " +
      "rather than a menu you open, and ground you already cleared re-earns its tension " +
      "the moment you leave the tree.",
  },
];

/* ---- why this UI -------------------------------------------------------- */

/**
 * PLACEHOLDER. The real rationale is still to be written; `placeholder` is true
 * so the component can mark it as a draft in the UI rather than pass it off as
 * finished copy. Set it to false when the prose below is replaced.
 */
export const uiRationale = {
  kicker: "Designer's note",
  title: "Why an integrated UI",
  placeholder: true,
  body: [
    "[Placeholder: why the integrated moon-HUD rather than a conventional one — " +
      "immersion, keeping the player's eyes in the world, reinforcing the moon motif, " +
      "and avoiding the disconnect of a floating bar that belongs to nobody.]",
    "[To write properly later: the cost side too — legibility at a glance, what it took " +
      "to keep the moon readable in a dark scene, and where a conventional HUD would " +
      "honestly have served the player better.]",
  ],
} as const;

/* ---- core combat -------------------------------------------------------- */

/**
 * Secondary by design. The interesting systems are above; this exists so the
 * section is complete without the generic verbs taking the reader's attention
 * first. Keep every note to a single short clause.
 */
export interface CombatVerb {
  id: string;
  name: string;
  note: string;
}

export const coreCombat: readonly CombatVerb[] = [
  { id: "weak", name: "Weak melee", note: "Fast, chains, low commitment." },
  { id: "strong", name: "Strong melee", note: "Slow, staggers, punishable." },
  { id: "dodge", name: "Dodge", note: "Unlimited, with i-frames." },
  { id: "parry", name: "Parry", note: "Tight window, high reward." },
  { id: "bow", name: "Bow", note: "Ranged opener, finite arrows." },
  { id: "stealth", name: "Stealth", note: "Break line of sight, open unseen." },
];

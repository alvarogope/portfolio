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

/* ---- what the roses buy --------------------------------------------------
   The dual skill tree. `contributions[0]` on this project claims "a dual skill
   tree" and until now nothing on any page showed one — see
   docs/section-ownership-map.md, Gap G3.

   NOTHING HERE IS INVENTED, AND THE LIMIT IS THE POINT. The repo names exactly
   two progression lines and no more:

     · the SWORD line — `white-rose-xp` above: "each stained rose is one point
       toward the next sword tier. The last tier costs two."
     · the BOW line — `moon-knight-game-engineering.ts` ships a tuning header
       whose `//--- Skill tree caps ---` section holds one constant,
       `MaxBowDamageBonus = 100.0f`.

   Two lines, one currency: that is the "dual" in dual skill tree, and it is
   all the repo records. No node graph, no tier count and no per-tier effect is
   claimed here, because none is written down anywhere. If those get recorded
   later this block is where they go.

   THE CURRENCY IS NOT RE-EXPLAINED. `white-rose-xp` owns the rose economy —
   bosses only, nothing to farm. This block spends what that one earns and
   points back at it rather than restating it. */

export interface SkillBranch {
  id: string;
  /** Rendered as the branch number. */
  index: string;
  name: string;
  /** The weapon line, in the language a player would use. */
  kind: string;
  /** What the roses buy on this branch, as the repo records it. */
  body: string;
  /** The one hard fact the codebase pins this branch to, and where it lives. */
  pin: { value: string; source: string };
}

export const skillTree = {
  kicker: "What the roses buy",
  /** One line: the tree in a sentence. */
  line: "Two weapon lines, one currency, and the currency is a boss you beat.",
  body:
    "The roses are the only experience in the game, and they spend in two places. " +
    "Both lines are capped rather than open-ended, which is the same decision as the " +
    "no-farming rule one card up: the ceiling is fixed so the difficulty curve stays " +
    "the story's to set, not the player's to grind past.",
  /** Where the currency itself is explained — not restated here. */
  currency: { label: "The White-Rose XP System", id: "white-rose-xp" },
  branches: [
    {
      id: "sword",
      index: "B1",
      name: "The sword line",
      kind: "Melee",
      body:
        "Each stained rose is one point toward the next sword tier, and the last tier " +
        "costs two — so the final upgrade is deliberately the one you cannot stumble into.",
      pin: { value: "Last tier costs 2 roses", source: "Diegetic design · white-rose-xp" },
    },
    {
      id: "bow",
      index: "B2",
      name: "The bow line",
      kind: "Ranged",
      body:
        "The ranged half of the tree, and the one the build actually pins a number to: " +
        "the bow's damage bonus is capped in the tuning header rather than left to scale.",
      pin: { value: "MaxBowDamageBonus = 100.0f", source: "Engineering · tuning constants" },
    },
  ] as readonly SkillBranch[],
} as const;

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

/* ---- why this UI --------------------------------------------------------

   There is deliberately no separate "designer's note" export here. The case
   for the integrated UI is made by the four `why` fields on
   `diegeticMechanics` above — that is what those fields are for, and a fifth
   block restating them would be the argument talking about itself. If the
   cost side is ever written (legibility at a glance, keeping the moon readable
   in a dark scene), it belongs inside the moon-HUD entry's `why`, not in a
   note of its own. */

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

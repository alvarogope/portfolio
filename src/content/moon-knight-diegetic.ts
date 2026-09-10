export const diegeticThesis = {
  kicker: "The philosophy",
  line:
    "The health, the progression and healing are alive in the world.",
  body:
    "These could have been a bar or an overlay, but instead they are an action in the wolrd. " +
    "By making the systems like this, I prioritise the player's on screen view and makes the game have more amplitude." +
    "Health is always in the centre and can be seen easily. The progression doesn't tell where to go exactly, just to which direction." +
    "Making the healing process play an instrument creates a bond with the melody and the player, specially if it's done in the ssafe space.",
  scope:
    "The equipment system is still a convencional menu. I thought it was the better way to represent the items and the system" +
    "since this is a system that players can take more time to feel comfortable since is interactable and not information that is just read " +
    "like health and direction.",
} as const;


export type HudPhase = "full" | "half" | "new";

export interface HudState {
  phase: HudPhase;
  label: string;
  note: string;
}

export const moonHudStates: readonly HudState[] = [
  {
    phase: "full",
    label: "Full Moon",
    note: "The health bar is full.",
  },
  {
    phase: "half",
    label: "half-Moon",
    note: "The health bar is at 50%",
  },
  {
    phase: "new",
    label: "waxing crescent",
    note: "A small light in the circle, health is very low.",
  },
];


export type DiegeticGlyph = "moon-hud" | "rose" | "sword" | "harp";

export interface DiegeticMechanic {
  id: string;
  glyph: DiegeticGlyph;
  replaces: string;
  title: string;
  mechanic: string;
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

export interface SkillBranch {
  id: string;
  index: string;
  name: string;
  kind: string;
  body: string;
  pin: { value: string; source: string };
}

export const skillTree = {
  kicker: "What the roses buy",
  line: "Two weapon lines, one currency, and the currency is a boss you beat.",
  body:
    "The roses are the only experience in the game, and they spend in two places. " +
    "Both lines are capped rather than open-ended, which is the same decision as the " +
    "no-farming rule one card up: the ceiling is fixed so the difficulty curve stays " +
    "the story's to set, not the player's to grind past.",
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

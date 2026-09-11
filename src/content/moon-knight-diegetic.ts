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
    title: "The Moon Health Bar",
    mechanic:
      "The health bar is a moon on the knight's armour. Full health is a full moon, " +
      "but as you take damage it transforms  into a half-moon, then to a new moon.",
    why:
      "I decided to put the health bar where the player is going to look most of the time since " +
      "its the stat that is going to be read the most. The player's eye never leaves the world, " +
      "while also being the most important figure in the game's world.",
  },
  {
    id: "white-rose-xp",
    glyph: "rose",
    replaces: "XP & levelling",
    title: "The White-Rose XP System",
    mechanic:
      "XP comes only from defeating enemies and following objectives. The player has to stain " +
      "a white rose with the boss's blood, making each one of them one XP.",
    why:
      "I wanted to prevent farming XPs, so I conditioned these levels to objective and bosses. " +
      "This also makes it easier to tune the difficulty since there are limited XP across the levels. " +
      "It also relates to the narrative instead of guessing how much XP each enemy costs.",
  },
  {
    id: "moonlight-wayfinding",
    glyph: "sword",
    replaces: "Map & compass",
    title: "Moonlight",
    mechanic:
      "There is no map or compass, so I had to think of how to tell the player where to go. " +
      "Raising the sword to catch moonlight, points to the next Moon Fragment.",
    why:
      "I wanted the player to experience the world rather than look in a map for directions. " +
      "It forces the player to recognise the places and puts a lot of weight on the level design, " + 
      "which has to guide with the environment",
  },
  {
    id: "harp-healing",
    glyph: "harp",
    replaces: "Potions & rest menu",
    title: "Healing by Playing an Instrument",
    mechanic:
      "Death gives you a harp. You heal by playing it and can only heal fully at a willow " +
      "tree, where the music has more harmonies mysteriously.",
    why:
      "I wanted healing to be emotional and to have a meaning for the player, so I made healing a " +
      "very touching action. By making them only fully heal at the willow tree conditions the gameplay " +
      "and makes healing in a checkpoint more emotional and memorable.",
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
  kicker: "The Othe XP",
  line: "By defeating the main bosses, the player gewt XP for upgrading thei combat skills.",
  body:
    "",
  currency: { label: "The White-Rose XP System", id: "white-rose-xp" },
  branches: [
    {
      id: "sword",
      index: "",
      name: "The melee upgrade",
      kind: "Sword",
      body:
        "This upgrade grantes the player a normal upgrade in their sword's attacks.",
      pin: { value: "Last tier costs 2 XPs", source: "Diegetic design" },
    },
    {
      id: "bow",
      index: "",
      name: "Long Distance Upgrade",
      kind: "Bow",
      body:
        "This upgrade grantes the player a normal upgrade in their bow's attacks.",
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
    decision: "No difficulty selection",
    why:
      "The enemies have the difficulty they were designed to have. The fight the designer built " +
      "is the fight that gets to the player.",
  },
  {
    id: "camouflaged-loading",
    decision: "Loading screens",
    why:
      "Elevators, the enviornment covering spaces and doors could help as loading screen while " +
      "the player is doing something else. Trying to smoothe gameplay as much as possible.",
  },
  {
    id: "no-block",
    decision: "No blocking",
    why:
      "I wanted the players to be aggressive while they play and blocking created the opposite circumstance. " +
      "Removing it I had to also tune the combat: dodging doesn't consume stealth, add a parry and constant movement.",
  },
  {
    id: "willow-saves",
    decision: "Saving only at willow trees",
    why:
      "Resting resets the area, like in a soulslike. The tension reappears once the player leaves the tree.",
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

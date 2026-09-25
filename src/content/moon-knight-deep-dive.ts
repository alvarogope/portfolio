export const deepDivePath = "/moon-knight/world";

export const deepDiveAnchors = {
  narrative: "narrative-design",
  cast: "the-cast",
  art: "art-direction",
  score: "score-and-audio",
  jousting: "the-jousting-minigame",
  expansions: "where-the-world-goes-next",
} as const;

export type DeepDiveAnchor = keyof typeof deepDiveAnchors;

export const deepDiveHref = (anchor: DeepDiveAnchor) =>
  `${deepDivePath}#${deepDiveAnchors[anchor]}`;
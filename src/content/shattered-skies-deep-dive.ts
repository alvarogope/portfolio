export const mainPath = "/shattered-skies";

export const mainAnchors = {
  inMotion: "in-motion",
  theGame: "the-game",
  worlds: "the-worlds",
  levels: "planetary-level-design",
  mechanics: "core-mechanics",
  coop: "coop-design",
} as const;

export type MainAnchor = keyof typeof mainAnchors;

export const mainHref = (anchor: MainAnchor, from: "main" | "deep" = "main") =>
  from === "main" ? `#${mainAnchors[anchor]}` : `${mainPath}#${mainAnchors[anchor]}`;

export type SsVariant = "main" | "deep";
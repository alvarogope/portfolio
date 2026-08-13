import Image from "next/image";

/* The engine, as a scannable label rather than another line of prose.

   One component for every surface — the fact block on each project
   page and the cards on the homepage — so it reads as the same
   recurring element wherever it appears.

   Colour comes from the accent, which each context supplies through
   tokens rather than a literal: the four scoped game layouts already
   re-point --color-silver to their own accent, so the default picks up
   the right colour on every project page with nothing passed in. The
   homepage hands in its per-card accent instead, since its bands carry
   their accent as data rather than as a scoped token.

   The accent stays on the TEXT only. The engine marks are rendered
   monochrome white, per the vendors' brand guidelines — a logo tinted
   to a project accent would not be a compliant use of either mark. */

const LOGOS: { match: RegExp; src: string }[] = [
  { match: /unreal/i, src: "/images/engines/unreal.svg" },
  { match: /unity/i, src: "/images/engines/unity.svg" },
];

/** Case-insensitive contains-match; null when no mark is known. */
function logoFor(engine: string): string | null {
  return LOGOS.find((l) => l.match.test(engine))?.src ?? null;
}

const LOGO_PX = 15;

export default function EngineTag({
  engine,
  accent = "var(--color-silver)",
}: {
  engine: string;
  /** Any CSS colour. Defaults to the surrounding theme's accent token. */
  accent?: string;
}) {
  const logo = logoFor(engine);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        alignSelf: "flex-start",
        gap: logo ? "0.45rem" : 0,
        fontFamily: "var(--font-mono)",
        fontSize: "0.75rem",
        lineHeight: 1,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        color: accent,
        border: `1px solid color-mix(in srgb, ${accent} 45%, transparent)`,
        background: `color-mix(in srgb, ${accent} 8%, transparent)`,
        borderRadius: 3,
        padding: "0.42rem 0.66rem",
      }}
    >
      {/* Decorative: the engine name sits right beside it, so an alt
          here would make screen readers announce the engine twice.

          `unoptimized` keeps the file a plain vector request — Next's
          image optimizer refuses SVG without dangerouslyAllowSVG, and
          there is nothing to optimise in a 32-unit vector anyway.

          The source marks ship black-on-transparent, so they are
          normalised to white here: brightness(0) flattens every colour
          to black while preserving alpha, and invert(1) then lifts it
          to pure white. That holds whatever colour the file is, so
          swapping in an already-white asset later changes nothing. */}
      {logo && (
        <Image
          src={logo}
          alt=""
          width={LOGO_PX}
          height={LOGO_PX}
          unoptimized
          aria-hidden
          style={{
            display: "block",
            width: LOGO_PX,
            height: LOGO_PX,
            flex: "0 0 auto",
            filter: "brightness(0) invert(1)",
          }}
        />
      )}
      {engine}
    </span>
  );
}

import Image from "next/image";

const LOGOS: { match: RegExp; src: string }[] = [
  { match: /unreal/i, src: "/images/engines/unreal.svg" },
  { match: /unity/i, src: "/images/engines/unity.svg" },
];

function logoFor(engine: string): string | null {
  return LOGOS.find((l) => l.match.test(engine))?.src ?? null;
}

const LOGO_PX = 15;

export default function EngineTag({
  engine,
  accent = "var(--color-silver)",
}: {
  engine: string;
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
      {/* Decoration of Logos */}
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

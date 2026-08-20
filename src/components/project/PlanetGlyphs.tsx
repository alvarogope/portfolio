import type { PlanetId } from "@/content/shattered-skies-planets";

/**
 * Shattered Skies — the worlds, drawn as pure SVG (no image files).
 *
 * `PlanetSprite` holds every gradient and `<symbol>`; `PlanetGlyph` stamps one
 * out with `<use>`. Render the sprite exactly ONCE per page — the ids are
 * global — then place as many glyphs as you like. Stage 2's orrery shares both.
 */

const CLIP = "ssp-clip";
const CLIP_GAS = "ssp-clip-gas";

/** Radial body gradients, id → [core, mid, limb]. The mid stop sits at 42%. */
const BODY: Record<string, [string, string, string]> = {
  pyroterra: ["#FFE1A8", "#FF8A3C", "#8E1B06"],
  dunestorm: ["#F7E3BC", "#D89B4F", "#69381A"],
  remnara: ["#BFEDE4", "#3E97A8", "#123C48"],
  tidalor: ["#CFF0FA", "#3FA8CF", "#0F3B52"],
  cryonix: ["#FFFFFF", "#C6E6F2", "#5C7F92"],
  gas: ["#F0D3A8", "#C08A4F", "#553219"],
};

export function PlanetSprite() {
  return (
    <svg width="0" height="0" aria-hidden focusable="false" style={{ position: "absolute" }}>
      <defs>
        <clipPath id={CLIP}>
          <circle cx="50" cy="50" r="48" />
        </clipPath>
        <clipPath id={CLIP_GAS}>
          <circle cx="70" cy="50" r="36" />
        </clipPath>

        {Object.entries(BODY).map(([id, stops]) => (
          <radialGradient key={id} id={"ssp-g-" + id} cx="34%" cy="30%" r="78%">
            <stop offset="0%" stopColor={stops[0]} />
            <stop offset="42%" stopColor={stops[1]} />
            <stop offset="100%" stopColor={stops[2]} />
          </radialGradient>
        ))}

        <radialGradient id="ssp-g-sun" cx="42%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="30%" stopColor="#FFE39A" />
          <stop offset="66%" stopColor="#FFA23C" />
          <stop offset="100%" stopColor="#E85A1E" />
        </radialGradient>

        <radialGradient id="ssp-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFB25A" stopOpacity="0.34" />
          <stop offset="42%" stopColor="#FF7A34" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#FF7A34" stopOpacity="0" />
        </radialGradient>

        <pattern id="ssp-stars" width="220" height="220" patternUnits="userSpaceOnUse">
          <circle cx="18" cy="32" r="1" fill="#DCEAF5" opacity="0.55" />
          <circle cx="72" cy="110" r="0.8" fill="#DCEAF5" opacity="0.32" />
          <circle cx="140" cy="48" r="1.2" fill="#FFFFFF" opacity="0.6" />
          <circle cx="196" cy="150" r="0.9" fill="#DCEAF5" opacity="0.38" />
          <circle cx="56" cy="190" r="1" fill="#DCEAF5" opacity="0.45" />
          <circle cx="120" cy="168" r="0.7" fill="#DCEAF5" opacity="0.28" />
          <circle cx="186" cy="86" r="0.8" fill="#DCEAF5" opacity="0.34" />
          <circle cx="96" cy="20" r="1.1" fill="#FFFFFF" opacity="0.5" />
          <circle cx="34" cy="128" r="0.6" fill="#DCEAF5" opacity="0.26" />
          <circle cx="160" cy="206" r="0.9" fill="#DCEAF5" opacity="0.4" />
        </pattern>

        {/* Lava lakes, cooled crust, glowing fissures. */}
        <symbol id="ssp-pyroterra" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="48" fill="url(#ssp-g-pyroterra)" />
          <g clipPath={"url(#" + CLIP + ")"}>
            <ellipse cx="33" cy="33" rx="19" ry="11" fill="#4A1608" opacity="0.62" />
            <ellipse cx="72" cy="70" rx="17" ry="10" fill="#4A1608" opacity="0.52" />
            <ellipse cx="24" cy="76" rx="12" ry="7" fill="#4A1608" opacity="0.45" />
            <path d="M2 60 Q28 50 46 64 Q64 78 98 66" stroke="#FFD98F" strokeWidth="2.6" fill="none" opacity="0.85" />
            <path d="M12 24 Q36 40 58 26 Q76 14 96 30" stroke="#FFC169" strokeWidth="1.8" fill="none" opacity="0.6" />
            <path d="M40 96 Q48 76 66 88" stroke="#FFD98F" strokeWidth="1.6" fill="none" opacity="0.55" />
          </g>
        </symbol>

        {/* Banded sand seas under a permanent windstorm. */}
        <symbol id="ssp-dunestorm" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="48" fill="url(#ssp-g-dunestorm)" />
          <g clipPath={"url(#" + CLIP + ")"}>
            <ellipse cx="50" cy="26" rx="52" ry="7" fill="#E8C48A" opacity="0.45" />
            <ellipse cx="50" cy="46" rx="52" ry="5" fill="#A96B33" opacity="0.45" />
            <ellipse cx="50" cy="64" rx="52" ry="8" fill="#E8C48A" opacity="0.3" />
            <ellipse cx="50" cy="82" rx="52" ry="5" fill="#A96B33" opacity="0.4" />
            <path d="M18 56 Q44 44 74 58" stroke="#FFF0D2" strokeWidth="1.6" fill="none" opacity="0.5" />
          </g>
        </symbol>

        {/* Continents, the war scar, cloud. */}
        <symbol id="ssp-remnara" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="48" fill="url(#ssp-g-remnara)" />
          <g clipPath={"url(#" + CLIP + ")"}>
            <path d="M14 40 Q30 24 48 32 Q62 38 58 52 Q50 66 32 60 Q18 54 14 40 Z" fill="#79C48C" opacity="0.85" />
            <path d="M66 20 Q84 24 88 40 Q78 46 68 38 Q62 30 66 20 Z" fill="#79C48C" opacity="0.7" />
            <path d="M56 72 Q74 66 88 76 Q80 90 62 86 Q52 82 56 72 Z" fill="#6FB681" opacity="0.7" />
            <path d="M28 44 L52 78" stroke="#B9C6C4" strokeWidth="2.2" opacity="0.65" />
            <ellipse cx="44" cy="18" rx="20" ry="5" fill="#EAF7F6" opacity="0.4" />
          </g>
        </symbol>

        {/* Seabed shapes under a tide line. */}
        <symbol id="ssp-tidalor" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="48" fill="url(#ssp-g-tidalor)" />
          <g clipPath={"url(#" + CLIP + ")"}>
            <ellipse cx="36" cy="42" rx="20" ry="12" fill="#1B4C66" opacity="0.55" />
            <ellipse cx="72" cy="66" rx="16" ry="10" fill="#1B4C66" opacity="0.45" />
            <path d="M2 68 Q26 60 50 70 Q74 80 98 70" stroke="#DAF2FC" strokeWidth="1.6" fill="none" opacity="0.55" />
            <path d="M2 34 Q26 26 50 36 Q74 46 98 36" stroke="#DAF2FC" strokeWidth="1.2" fill="none" opacity="0.35" />
          </g>
        </symbol>

        {/* Crystal plates over ice. */}
        <symbol id="ssp-cryonix" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="48" fill="url(#ssp-g-cryonix)" />
          <g clipPath={"url(#" + CLIP + ")"}>
            <polygon points="30,26 44,38 28,50 18,36" fill="#FFFFFF" opacity="0.5" />
            <polygon points="62,54 78,62 64,76 54,64" fill="#FFFFFF" opacity="0.4" />
            <polygon points="56,20 70,30 58,40 48,30" fill="#FFFFFF" opacity="0.3" />
            <path d="M20 62 L40 70 L34 88" stroke="#8FD6EC" strokeWidth="1.6" fill="none" opacity="0.7" />
          </g>
        </symbol>

        <symbol id="ssp-sun" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="48" fill="#FFB347" opacity="0.1" />
          <circle cx="50" cy="50" r="40" fill="#FF9A3C" opacity="0.18" />
          <circle cx="50" cy="50" r="32" fill="url(#ssp-g-sun)" />
          <circle cx="50" cy="50" r="32" fill="none" stroke="#FFE9BE" strokeWidth="0.8" opacity="0.5" />
        </symbol>

        {/* Tidalor's host. Wider than tall — viewBox 140 × 100. */}
        <symbol id="ssp-gasgiant" viewBox="0 0 140 100">
          <circle cx="70" cy="50" r="36" fill="url(#ssp-g-gas)" />
          <g clipPath={"url(#" + CLIP_GAS + ")"}>
            <ellipse cx="70" cy="34" rx="40" ry="6" fill="#EBCB9C" opacity="0.4" />
            <ellipse cx="70" cy="52" rx="40" ry="4" fill="#7A4A22" opacity="0.45" />
            <ellipse cx="70" cy="66" rx="40" ry="6" fill="#EBCB9C" opacity="0.28" />
          </g>
          <ellipse
            cx="70"
            cy="50"
            rx="62"
            ry="13"
            fill="none"
            stroke="#D6B183"
            strokeWidth="2.4"
            opacity="0.5"
            transform="rotate(-18 70 50)"
          />
        </symbol>
      </defs>
    </svg>
  );
}

/** One world, square, sized by the caller. Decorative — its name sits beside it in the markup. */
export function PlanetGlyph({
  id,
  size,
  className,
}: {
  id: PlanetId;
  size: number | string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-hidden
      focusable="false"
      style={{ display: "block", overflow: "visible" }}
    >
      <use href={"#ssp-" + id} width="100" height="100" />
    </svg>
  );
}

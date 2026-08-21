"use client";

import { useEffect, useState } from "react";
import IndicatorPortal from "./IndicatorPortal";
import { useScrollProgress } from "./useScrollProgress";

const SIZE = 64;
const BOTTOM_OFFSET = 32; // 2rem, matches the fixed `bottom` value below

type Rgb = [number, number, number];

/* ---- the waxing colour ramp -------------------------------------------
   Three anchors, interpolated in OKLab rather than sRGB.

   The ends were never the problem: measured in OKLCh, a straight lerp holds
   hue at ~258-262° the whole way, so swapping colour space alone changes
   almost nothing. What made mid-scroll look muddy is CHROMA — it falls
   steadily from 3.8 at the dim end to 1.8 at the bright end, and a near-grey
   at mid lightness reads as a dull slate. Against this page's blue-black it
   picks up an induced warmth on top of that, which is the mauve cast.

   MID holds the blue through the middle, so chroma arcs up (peak ~6.1 near
   t=0.42) instead of sagging. Lightness still climbs linearly in L*, so the
   moon reads as one hue getting brighter, start to finish. */
const DIM: Rgb = [86, 98, 120];
const MID: Rgb = [142, 166, 203];
const MOONLIGHT: Rgb = [232, 240, 252];

/* Rim glow. Strongest at the top of the page, gone once the moon is bright
   enough to carry its own edge. */
const GLOW_UNTIL = 0.6;
const GLOW_RGB = "200, 214, 232";

/* --- OKLab, just enough of it to walk the ramp above (Björn Ottosson). --- */

const toLinear = (v: number) => {
  const c = v / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};

const toSrgb = (v: number) => {
  const c = v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  return Math.max(0, Math.min(255, Math.round(c * 255)));
};

function rgbToOklab([r, g, b]: Rgb): Rgb {
  const R = toLinear(r);
  const G = toLinear(g);
  const B = toLinear(b);
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function oklabToRgb([L, a, b]: Rgb): Rgb {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    toSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    toSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    toSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

const OK_DIM = rgbToOklab(DIM);
const OK_MID = rgbToOklab(MID);
const OK_MOONLIGHT = rgbToOklab(MOONLIGHT);

/* Quadratic Bézier control point, placed so the curve passes exactly through
   MID at t = 0.5. Two straight lerps joined at MID would also hit it, but they
   reverse the chroma slope at the joint and that shows as a kink mid-scroll;
   one Bézier arcs through instead. Verified in gamut across the whole range. */
const OK_CTRL: Rgb = [0, 1, 2].map(
  (i) => 2 * OK_MID[i] - (OK_DIM[i] + OK_MOONLIGHT[i]) / 2
) as Rgb;

function moonColor(t: number) {
  const u = 1 - t;
  const lab = [0, 1, 2].map(
    (i) => u * u * OK_DIM[i] + 2 * u * t * OK_CTRL[i] + t * t * OK_MOONLIGHT[i]
  ) as Rgb;
  return `rgb(${oklabToRgb(lab).join(", ")})`;
}

export default function MoonProgress() {
  const { progress, reduced } = useScrollProgress();
  const [dockedTop, setDockedTop] = useState<number | null>(null);

  useEffect(() => {
    const update = () => {
      const footer = document.querySelector("footer");
      if (!footer) return;

      const footerTop = footer.getBoundingClientRect().top;
      const reservedSpace = SIZE + BOTTOM_OFFSET;
      setDockedTop(
        footerTop <= window.innerHeight ? window.scrollY + footerTop - reservedSpace : null
      );
    };

    const raf = requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const r = SIZE / 2;

  const shadowOffset = progress * SIZE;

  const litColor = moonColor(progress);

  /* 1 while the moon is too dim to find on its own, 0 once it isn't. */
  const glow = Math.max(0, 1 - progress / GLOW_UNTIL);

  const placement: React.CSSProperties =
    dockedTop === null
      ? { position: "fixed", bottom: "2rem" }
      : { position: "absolute", top: dockedTop };

  return (
    <IndicatorPortal name="moon">
      <div
        aria-hidden
        style={{
          ...placement,
          left: "var(--rail-left, 1.5rem)",
          width: SIZE,
          height: SIZE,
          zIndex: 40,
          pointerEvents: "none",
          transform: "scale(var(--moon-scale, 1))",
          transformOrigin: "left bottom",
        }}
      >
        {reduced ? (
          <div
            style={{
              width: SIZE,
              height: SIZE,
              borderRadius: "50%",
              border: "1px solid var(--color-mist)",
              background: `rgb(${MOONLIGHT.join(", ")})`,
            }}
          />
        ) : (
          <svg
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            /* Halo only — a CSS filter paints outside the 64px box without
               taking any layout, so the indicator's footprint is unchanged. */
            style={{
              filter:
                glow > 0
                  ? `drop-shadow(0 0 3px rgba(${GLOW_RGB}, ${(0.3 * glow).toFixed(3)}))` +
                    ` drop-shadow(0 0 9px rgba(${GLOW_RGB}, ${(0.18 * glow).toFixed(3)}))`
                  : undefined,
            }}
          >
            <defs>
              <clipPath id="moon-clip">
                <circle cx={r} cy={r} r={r} />
              </clipPath>
            </defs>

            {/* Dark base */}
            <circle
              cx={r}
              cy={r}
              r={r}
              fill="var(--color-nightfall)"
              stroke="var(--color-mist)"
              strokeWidth="1"
            />

            {/* Lit Moon */}
            <g clipPath="url(#moon-clip)">
              <circle cx={r} cy={r} r={r} fill={litColor} />
              <circle cx={r} cy={r - shadowOffset} r={r} fill="var(--color-void)" />
            </g>

            {/* Rim on Top. Firms up while the disc is dim so the edge stays
                readable, then settles back to its usual weight. */}
            <circle
              cx={r}
              cy={r}
              r={r - 0.5}
              fill="none"
              stroke="var(--color-mist)"
              strokeWidth="1"
              opacity={(0.6 + 0.35 * glow).toFixed(3)}
            />
          </svg>
        )}
      </div>
    </IndicatorPortal>
  );
}

"use client";

import { useEffect, useState } from "react";
import IndicatorPortal from "./IndicatorPortal";
import { useScrollProgress } from "./useScrollProgress";

/* Moon-Knight's scroll indicator, and the one the others are modelled
   on. A moon fixed bottom-left that waxes from new to full as you
   scroll, echoing the moon-phase health bar. The illuminated fraction
   is scroll progress, and the lit colour shifts silver -> scarlet
   across the scroll (moonlight -> blood).

   It stays position: fixed until the footer approaches the bottom of
   the viewport, then "docks" just above it so it scrolls away with the
   page instead of floating over the footer. That docking is specific
   to the moon; the other three indicators sit mid-height on the left
   rail where the footer never reaches them. */

const SIZE = 44;
const BOTTOM_OFFSET = 32; // 2rem, matches the fixed `bottom` value below

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

    // Measured after first paint, once layout has settled.
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

  // Shadow recedes upward as progress grows: covers the moon at the
  // top (new moon) and slides off by the bottom (full moon).
  const shadowOffset = (1 - progress) * SIZE;

  // Interpolate the lit colour: silver (top) -> scarlet (bottom).
  const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);

  const SILVER = [220, 230, 245];
  const SCARLET = [104, 12, 25];

  const litColor = `rgb(${lerp(SILVER[0], SCARLET[0], progress)}, ${lerp(
    SILVER[1],
    SCARLET[1],
    progress
  )}, ${lerp(SILVER[2], SCARLET[2], progress)})`;

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
          // The moon is the widest of the four, so on phones it also
          // scales down to clear the text column. See globals.css.
          transform: "scale(var(--moon-scale, 1))",
          transformOrigin: "left bottom",
        }}
      >
        {reduced ? (
          // Static dot under reduced-motion
          <div
            style={{
              width: SIZE,
              height: SIZE,
              borderRadius: "50%",
              border: "1px solid var(--color-mist)",
              background: "var(--color-nightfall)",
            }}
          />
        ) : (
          <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
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

            {/* Lit moon, colour shifts with scroll, revealed as shadow recedes */}
            <g clipPath="url(#moon-clip)">
              <circle cx={r} cy={r} r={r} fill={litColor} />
              <circle cx={r} cy={r - shadowOffset} r={r} fill="var(--color-void)" />
            </g>

            {/* Rim on top */}
            <circle
              cx={r}
              cy={r}
              r={r - 0.5}
              fill="none"
              stroke="var(--color-mist)"
              strokeWidth="1"
              opacity="0.6"
            />
          </svg>
        )}
      </div>
    </IndicatorPortal>
  );
}

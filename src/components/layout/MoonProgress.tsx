"use client";

import { useEffect, useState } from "react";
import IndicatorPortal from "./IndicatorPortal";
import { useScrollProgress } from "./useScrollProgress";

const SIZE = 64;
const BOTTOM_OFFSET = 32; // 2rem, matches the fixed `bottom` value below

const DIM = [86, 98, 120];
const MOONLIGHT = [232, 240, 252];

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

  const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);

  const litColor = `rgb(${lerp(DIM[0], MOONLIGHT[0], progress)}, ${lerp(
    DIM[1],
    MOONLIGHT[1],
    progress
  )}, ${lerp(DIM[2], MOONLIGHT[2], progress)})`;

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

            {/* Lit Moon */}
            <g clipPath="url(#moon-clip)">
              <circle cx={r} cy={r} r={r} fill={litColor} />
              <circle cx={r} cy={r - shadowOffset} r={r} fill="var(--color-void)" />
            </g>

            {/* Rim on Top */}
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

"use client";

import { useEffect, useState } from "react";

/* The signature element. A moon fixed bottom-left that waxes from
   new to full as you scroll the page, echoing Moon-Knight's
   moon-phase health bar. The illuminated fraction = scroll progress,
   and the lit colour shifts silver -> scarlet across the scroll
   (moonlight -> blood). Respects prefers-reduced-motion.

   It stays position: fixed until the footer approaches the bottom
   of the viewport, then "docks" just above it so it scrolls away
   with the page instead of floating over the footer. */

const SIZE = 44;
const BOTTOM_OFFSET = 32; // 2rem, matches the fixed `bottom` value below

export default function MoonProgress() {
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [dockedTop, setDockedTop] = useState<number | null>(null);

  useEffect(() => {
    // Honour reduced-motion
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);

    const update = () => {
      // Track scroll progress 0..1
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const p = scrollable > 0 ? window.scrollY / scrollable : 0;
      setProgress(Math.min(1, Math.max(0, p)));

      // Dock above the footer once it reaches the moon's reserved space
      const footer = document.querySelector("footer");
      if (footer) {
        const footerTop = footer.getBoundingClientRect().top;
        const reservedSpace = SIZE + BOTTOM_OFFSET;
        if (footerTop <= window.innerHeight) {
          setDockedTop(window.scrollY + footerTop - reservedSpace);
        } else {
          setDockedTop(null);
        }
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      mq.removeEventListener("change", onChange);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const size = SIZE;
  const r = size / 2;

  // Shadow recedes upward as progress grows: covers the moon at the
  // top (new moon) and slides off by the bottom (full moon).
  const shadowOffset = (1 - progress) * size;

  // Interpolate the lit colour: silver (top) -> scarlet (bottom).
  const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);
  const rgb = (c: number[]) => `rgb(${c[0]}, ${c[1]}, ${c[2]})`;

  const SILVER = [220, 230, 245];
  const SCARLET = [104, 12, 25];

  const litColor = rgb([
    lerp(SILVER[0], SCARLET[0], progress),
    lerp(SILVER[1], SCARLET[1], progress),
    lerp(SILVER[2], SCARLET[2], progress),
  ]);

  return (
    <div
      aria-hidden="true"
      style={
        dockedTop === null
          ? {
              position: "fixed",
              bottom: "2rem",
              left: "1.5rem",
              width: size,
              height: size,
              zIndex: 40,
              pointerEvents: "none",
            }
          : {
              position: "absolute",
              top: dockedTop,
              left: "1.5rem",
              width: size,
              height: size,
              zIndex: 40,
              pointerEvents: "none",
            }
      }
    >
      {reduced ? (
        // Static dot under reduced-motion
        <div
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            border: "1px solid var(--color-mist)",
            background: "var(--color-nightfall)",
          }}
        />
      ) : (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <clipPath id="moon-clip">
              <circle cx={r} cy={r} r={r} />
            </clipPath>
          </defs>

          {/* Dark base */}
          <circle cx={r} cy={r} r={r} fill="var(--color-nightfall)" stroke="var(--color-mist)" strokeWidth="1" />

          {/* Lit moon, colour shifts with scroll, revealed as shadow recedes */}
          <g clipPath="url(#moon-clip)">
            <circle cx={r} cy={r} r={r} fill={litColor} />
            <circle
              cx={r}
              cy={r - shadowOffset}
              r={r}
              fill="var(--color-void)"
            />
          </g>

          {/* Rim on top */}
          <circle cx={r} cy={r} r={r - 0.5} fill="none" stroke="var(--color-mist)" strokeWidth="1" opacity="0.6" />
        </svg>
      )}
    </div>
  );
}
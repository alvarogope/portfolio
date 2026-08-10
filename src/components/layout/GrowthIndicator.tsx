"use client";

import IndicatorPortal, { railStyle } from "./IndicatorPortal";
import { useScrollProgress } from "./useScrollProgress";

/* Seeds of Tomorrow scroll indicator: a stem that grows as you read.
   It rises from a fixed base on the left edge, puts out a pair of
   leaves partway up, and blooms in the last third of the scroll —
   life returning as you descend.

   Deliberately mid-height on the left edge, not pinned to the bottom:
   Seeds already has a full-width audio transport bar down there, and
   this must stay well clear of it.

   Greens come from --color-silver (living green in this theme) and the
   bloom from --color-gold (warm amber). */

const TRACK = 160;
const BLOOM_STARTS = 0.7; // last 30% of the scroll

export default function GrowthIndicator() {
  const { progress, reduced } = useScrollProgress();

  const grown = reduced ? 1 : progress;
  const stem = grown * TRACK;

  // 0 -> 1 across the final stretch, so the flower opens rather than pops.
  const bloom = Math.min(1, Math.max(0, (grown - BLOOM_STARTS) / (1 - BLOOM_STARTS)));

  // Leaves appear once the stem has actually grown past them.
  const leafAt = TRACK * 0.45;
  const leavesOut = stem > leafAt;

  return (
    <IndicatorPortal name="growth">
      <div aria-hidden style={railStyle(TRACK)}>
        <div style={{ position: "relative", width: 2, height: "100%" }}>
          {/* the soil line the stem rises from */}
          <span
            style={{
              position: "absolute",
              bottom: -1,
              left: "50%",
              transform: "translateX(-50%)",
              width: 12,
              height: 2,
              borderRadius: 1,
              background: "color-mix(in srgb, var(--color-silver) 45%, transparent)",
            }}
          />

          {/* faint trace of the full height, so the stem reads as growing
              into something rather than floating */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              background: "color-mix(in srgb, var(--color-silver) 12%, transparent)",
            }}
          />

          {/* the stem itself, growing upward from the base */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: stem,
              background: "var(--color-silver)",
              boxShadow: "0 0 6px color-mix(in srgb, var(--color-silver) 60%, transparent)",
            }}
          />

          {/* a leaf either side, once the stem clears them */}
          {leavesOut && (
            <>
              <span style={leafStyle(leafAt, "left")} />
              <span style={leafStyle(leafAt - 14, "right")} />
            </>
          )}

          {/* the bloom at the growing tip */}
          {bloom > 0 && (
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              style={{
                position: "absolute",
                bottom: stem,
                left: "50%",
                transform: `translate(-50%, 50%) scale(${bloom})`,
                transformOrigin: "center",
                opacity: bloom,
                overflow: "visible",
              }}
            >
              {[0, 72, 144, 216, 288].map((angle) => (
                <ellipse
                  key={angle}
                  cx="9"
                  cy="4.6"
                  rx="2.5"
                  ry="4"
                  fill="var(--color-gold)"
                  transform={`rotate(${angle} 9 9)`}
                />
              ))}
              <circle cx="9" cy="9" r="2.2" fill="var(--color-moonlight)" />
            </svg>
          )}
        </div>
      </div>
    </IndicatorPortal>
  );
}

function leafStyle(bottom: number, side: "left" | "right"): React.CSSProperties {
  return {
    position: "absolute",
    bottom,
    left: "50%",
    width: 9,
    height: 5,
    background: "var(--color-silver)",
    opacity: 0.75,
    // a leaf shape: round on the outer edge, pointed where it meets the stem
    borderRadius: side === "left" ? "100% 0 100% 0" : "0 100% 0 100%",
    transform: side === "left" ? "translateX(-100%)" : "translateX(0)",
    transformOrigin: side === "left" ? "right center" : "left center",
  };
}

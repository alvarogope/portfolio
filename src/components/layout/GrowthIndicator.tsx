"use client";

import IndicatorPortal, { railStyle } from "./IndicatorPortal";
import { useScrollProgress } from "./useScrollProgress";

const TRACK = 220;
const STEM = 4;
const BLOOM = 26; 
const BLOOM_STARTS = 0.7; 

export default function GrowthIndicator() {
  const { progress, reduced } = useScrollProgress();

  const grown = reduced ? 1 : progress;
  const stem = grown * TRACK;

  const bloom = Math.min(1, Math.max(0, (grown - BLOOM_STARTS) / (1 - BLOOM_STARTS)));

  const leafAt = TRACK * 0.45;
  const lowerLeafAt = leafAt - 20;
  const leavesOut = stem > leafAt;

  return (
    <IndicatorPortal name="growth">
      <div aria-hidden style={railStyle(TRACK)}>
        <div style={{ position: "relative", width: STEM, height: "100%" }}>
          {/* Soil Line */}
          <span
            style={{
              position: "absolute",
              bottom: -1,
              left: "50%",
              transform: "translateX(-50%)",
              width: 18,
              height: 3,
              borderRadius: 1.5,
              background: "color-mix(in srgb, var(--color-silver) 45%, transparent)",
            }}
          />

          {/* Faint Trace */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              background: "color-mix(in srgb, var(--color-silver) 12%, transparent)",
            }}
          />

          {/* Stem */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: stem,
              borderRadius: STEM / 2,
              background: "var(--color-silver)",
              boxShadow: "0 0 9px color-mix(in srgb, var(--color-silver) 60%, transparent)",
            }}
          />

          {/* Leaf */}
          {leavesOut && (
            <>
              <span style={leafStyle(leafAt, "left")} />
              <span style={leafStyle(lowerLeafAt, "right")} />
            </>
          )}

          {/* Bloom */}
          {bloom > 0 && (
            <svg
              width={BLOOM}
              height={BLOOM}
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
    width: 13,
    height: 7,
    background: "var(--color-silver)",
    opacity: 0.75,
    borderRadius: side === "left" ? "100% 0 100% 0" : "0 100% 0 100%",
    transform: side === "left" ? "translateX(-100%)" : "translateX(0)",
    transformOrigin: side === "left" ? "right center" : "left center",
  };
}

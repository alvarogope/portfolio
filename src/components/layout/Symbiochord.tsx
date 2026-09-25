"use client";

import IndicatorPortal, { railStyle } from "./IndicatorPortal";
import { useScrollProgress } from "./useScrollProgress";

/* Shattered Skies scroll indicator */

const TRACK = 220;
const LINE = 4;
const NODE = 12;

export default function Symbiochord() {
  const { progress, reduced } = useScrollProgress();

  const fill = reduced ? TRACK : progress * TRACK;

  return (
    <IndicatorPortal name="symbiochord">
      <div aria-hidden style={railStyle(TRACK)}>
        <div
          style={{
            position: "relative",
            width: LINE,
            height: "100%",
            borderRadius: LINE / 2,
            background: "color-mix(in srgb, var(--color-silver) 18%, transparent)",
          }}
        >
          {/* the cord paid out so far */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: fill,
              borderRadius: LINE / 2,
              background: "var(--color-silver)",
              boxShadow: "0 0 12px var(--color-silver)",
            }}
          />
          {/* anchored end */}
          <span style={nodeStyle(0)} />
          {/* the end that travels with you */}
          <span style={nodeStyle(fill)} />
        </div>
      </div>
    </IndicatorPortal>
  );
}

function nodeStyle(top: number): React.CSSProperties {
  return {
    position: "absolute",
    top,
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: NODE,
    height: NODE,
    borderRadius: "50%",
    background: "var(--color-silver)",
    boxShadow: "0 0 14px var(--color-silver)",
  };
}

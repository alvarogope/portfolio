"use client";

import IndicatorPortal, { railStyle } from "./IndicatorPortal";
import { useScrollProgress } from "./useScrollProgress";

/* Shattered Skies scroll indicator: the Symbiochord. A vertical tether
   on the left edge that fills top -> bottom as you scroll, with a
   glowing node anchored at the top and a second node riding the fill
   point — the shared-fate cord binding the two players, paying out as
   you descend.

   Accent comes from --color-silver, which this project's layout
   re-points to HUD cyan. */

const TRACK = 160;

export default function Symbiochord() {
  const { progress, reduced } = useScrollProgress();

  const fill = reduced ? TRACK : progress * TRACK;

  return (
    <IndicatorPortal name="symbiochord">
      <div aria-hidden style={railStyle(TRACK)}>
        <div
          style={{
            position: "relative",
            width: 2,
            height: "100%",
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
              background: "var(--color-silver)",
              boxShadow: "0 0 8px var(--color-silver)",
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
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "var(--color-silver)",
    boxShadow: "0 0 10px var(--color-silver)",
  };
}

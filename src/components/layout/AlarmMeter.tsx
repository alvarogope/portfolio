"use client";

import IndicatorPortal, { railStyle } from "./IndicatorPortal";
import { useScrollProgress } from "./useScrollProgress";

/* Break-In scroll indicator: the alarm meter. A thin vertical gauge on
   the left edge that fills bottom -> top and runs green -> amber -> red
   as you scroll — tension climbing toward the heist's climax.

   The three stops are deliberate signal colours rather than theme
   tokens: the whole point is the green/amber/red reading, and it has to
   hold regardless of the palette. They match the layout's --color-emerald,
   --color-silver (amber caution) and --color-scarlet. */

const TRACK = 140;

const GREEN = [95, 181, 132];
const AMBER = [229, 181, 77];
const RED = [226, 60, 60];

const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);
const mix = (a: number[], b: number[], t: number) =>
  `rgb(${lerp(a[0], b[0], t)}, ${lerp(a[1], b[1], t)}, ${lerp(a[2], b[2], t)})`;

/* Green through amber at the halfway mark, then amber through red. */
function alarmColor(t: number): string {
  return t < 0.5 ? mix(GREEN, AMBER, t / 0.5) : mix(AMBER, RED, (t - 0.5) / 0.5);
}

const FULL_SCALE = `linear-gradient(to top, rgb(${GREEN}) 0%, rgb(${AMBER}) 50%, rgb(${RED}) 100%)`;

export default function AlarmMeter() {
  const { progress, reduced } = useScrollProgress();

  const fill = reduced ? TRACK : progress * TRACK;
  const color = alarmColor(progress);

  return (
    <IndicatorPortal name="alarm">
      <div aria-hidden style={railStyle(TRACK)}>
        <div
          style={{
            position: "relative",
            width: 4,
            height: "100%",
            borderRadius: 2,
            background: "color-mix(in srgb, var(--color-mist) 22%, transparent)",
            overflow: "hidden",
          }}
        >
          {/* Under reduced motion the gauge shows its whole scale at rest
              instead of tracking the scroll. */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: fill,
              borderRadius: 2,
              background: reduced ? FULL_SCALE : color,
              boxShadow: reduced ? "none" : `0 0 8px ${color}`,
            }}
          />
        </div>

        {/* Tick marks at the two thresholds, so the meter reads as a gauge. */}
        {[0.5, 1].map((t) => (
          <span
            key={t}
            style={{
              position: "absolute",
              bottom: TRACK * t - 1,
              left: "50%",
              transform: "translateX(-50%)",
              width: 10,
              height: 1,
              background: "color-mix(in srgb, var(--color-mist) 40%, transparent)",
            }}
          />
        ))}
      </div>
    </IndicatorPortal>
  );
}

"use client";

import IndicatorPortal, { railStyle } from "./IndicatorPortal";
import { useScrollProgress } from "./useScrollProgress";

const TRACK = 220;
const BAR = 8;
const TICK = 18;

const GREEN = [95, 181, 132];
const AMBER = [229, 181, 77];
const RED = [226, 60, 60];

const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);
const mix = (a: number[], b: number[], t: number) =>
  `rgb(${lerp(a[0], b[0], t)}, ${lerp(a[1], b[1], t)}, ${lerp(a[2], b[2], t)})`;

/* Green to amber to red. */
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
            width: BAR,
            height: "100%",
            borderRadius: BAR / 2,
            background: "color-mix(in srgb, var(--color-mist) 22%, transparent)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: fill,
              borderRadius: BAR / 2,
              background: reduced ? FULL_SCALE : color,
              boxShadow: reduced ? "none" : `0 0 12px ${color}`,
            }}
          />
        </div>

¡        {[0.5, 1].map((t) => (
          <span
            key={t}
            style={{
              position: "absolute",
              bottom: TRACK * t - 1,
              left: "50%",
              transform: "translateX(-50%)",
              width: TICK,
              height: 1,
              background: "color-mix(in srgb, var(--color-mist) 40%, transparent)",
            }}
          />
        ))}
      </div>
    </IndicatorPortal>
  );
}

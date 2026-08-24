/**
 * Moon-Knight — the moon, drawn once.
 *
 * The moon is the spine of this project: it is the three acts in
 * `NarrativeDesign`, and it is the health readout in `DiegeticDesign`. Those
 * two sections sit on the same page, so the discs have to be the SAME discs —
 * a crescent that is a sliver in one band and a comma in the other reads as
 * two different symbols, which is exactly the drift this module exists to
 * prevent. The geometry lives here and nowhere else.
 *
 * Drawn, not typed: the unicode moon characters render as emoji on most
 * platforms, which is the wrong century. Each glyph is the same 20-unit disc
 * on a `0 0 24 24` box — a faint full circle for the moon that is always
 * there, and a lit shape over it for the part currently in sunlight.
 *
 * The crescent is the only awkward one. It is the right half of the disc
 * (clockwise, sweep 1) closed by the right half of a narrower ellipse
 * (counter-clockwise, sweep 0), which cuts the terminator back into the lit
 * side and leaves a true sliver rather than a comma.
 *
 * The gibbous is that same construction with the closing sweep flipped: the
 * ellipse now bows the other way, past the centre line and into the dark side,
 * so the lit area is more than half a disc. Crescent and gibbous are therefore
 * literally the same two arcs with one bit changed, which is why they read as
 * opposite ends of one cycle rather than two unrelated drawings.
 *
 * COLOUR IS THE CALLER'S. Both the disc and the lit area take their class from
 * props and carry no fill of their own, because the narrative section paints
 * every moon silver while the diegetic section runs them from silver to
 * scarlet as a health gradient. Same shape, different ink.
 */

export type MoonPhaseName = "new" | "crescent" | "half" | "gibbous" | "full";

const CRESCENT = "M12 2 A 10 10 0 0 1 12 22 A 5 10 0 0 0 12 2 Z";
const HALF = "M12 2 A 10 10 0 0 1 12 22 Z";
const GIBBOUS = "M12 2 A 10 10 0 0 1 12 22 A 5 10 0 0 1 12 2 Z";

export function MoonPhaseGlyph({
  phase,
  className,
  discClassName,
  litClassName,
}: {
  phase: MoonPhaseName;
  /** Sizes the svg. The disc fills it. */
  className?: string;
  /** The unlit body of the moon — always drawn, including at new moon. */
  discClassName?: string;
  /** The part in sunlight. Absent at new moon, the whole disc when full. */
  litClassName?: string;
}) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle className={discClassName} cx="12" cy="12" r="10" />
      {phase === "full" && <circle className={litClassName} cx="12" cy="12" r="10" />}
      {phase === "gibbous" && <path className={litClassName} d={GIBBOUS} />}
      {phase === "half" && <path className={litClassName} d={HALF} />}
      {phase === "crescent" && <path className={litClassName} d={CRESCENT} />}
      {/* new moon: the disc is all there is, and that is the point */}
    </svg>
  );
}

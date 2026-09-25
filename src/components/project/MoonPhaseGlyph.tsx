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
  className?: string;
  discClassName?: string;
  litClassName?: string;
}) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle className={discClassName} cx="12" cy="12" r="10" />
      {phase === "full" && <circle className={litClassName} cx="12" cy="12" r="10" />}
      {phase === "gibbous" && <path className={litClassName} d={GIBBOUS} />}
      {phase === "half" && <path className={litClassName} d={HALF} />}
      {phase === "crescent" && <path className={litClassName} d={CRESCENT} />}
    </svg>
  );
}

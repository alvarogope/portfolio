import Aurora from "@/components/effects/Aurora";
import SubpageBackdrop, {
  BACKDROP_OPACITY,
  MOON_KNIGHT_AURORA,
} from "@/components/effects/SubpageBackdrop";

/**
 * Covers BOTH engineering routes — `/moon-knight/engineering` and the quantum
 * toolkit nested under it — because a layout wraps its whole segment. That is
 * why there is no fourth copy of this file for `quantum/`.
 *
 * See `SubpageBackdrop` for why the effect is a band at the top rather than the
 * hero treatment verbatim, and why the tuning is shared rather than copied.
 */
export default function MoonKnightEngineeringLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SubpageBackdrop
      backdrop={
        <Aurora
          {...MOON_KNIGHT_AURORA}
          opacity={BACKDROP_OPACITY.moonKnight.subpage}
        />
      }
    >
      {children}
    </SubpageBackdrop>
  );
}

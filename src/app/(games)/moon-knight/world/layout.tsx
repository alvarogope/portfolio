import Aurora from "@/components/effects/Aurora";
import SubpageBackdrop, {
  BACKDROP_OPACITY,
  MOON_KNIGHT_AURORA,
} from "@/components/effects/SubpageBackdrop";

/**
 * Gives the deep dive the aurora the main page opens on. See
 * `SubpageBackdrop` for why the effect is a band at the top rather than the
 * hero treatment verbatim, and why the tuning is shared rather than copied.
 */
export default function MoonKnightWorldLayout({
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

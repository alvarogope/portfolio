import Galaxy from "@/components/effects/Galaxy";
import SubpageBackdrop, {
  BACKDROP_OPACITY,
  SHATTERED_SKIES_GALAXY,
} from "@/components/effects/SubpageBackdrop";

/**
 * Gives the deep dive the starfield the main page opens on. See
 * `SubpageBackdrop` for why the effect is a band at the top rather than the
 * hero treatment verbatim, and why the tuning is shared rather than copied.
 */
export default function ShatteredSkiesWorldLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SubpageBackdrop
      backdrop={
        <Galaxy
          {...SHATTERED_SKIES_GALAXY}
          opacity={BACKDROP_OPACITY.shatteredSkies.subpage}
        />
      }
    >
      {children}
    </SubpageBackdrop>
  );
}

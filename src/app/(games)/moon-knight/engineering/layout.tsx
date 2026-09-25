import Aurora from "@/components/effects/Aurora";
import SubpageBackdrop, {
  BACKDROP_OPACITY,
  MOON_KNIGHT_AURORA,
} from "@/components/effects/SubpageBackdrop";

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
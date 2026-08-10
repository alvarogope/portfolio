import MoonProgress from "@/components/layout/MoonProgress";

export default function MoonKnightLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={
        {
          "--font-display": "var(--font-unifraktur), serif",
          "--font-hero": "var(--font-cinzel), serif",
          minHeight: "100vh",
        } as React.CSSProperties
      }
    >
      {children}
      <MoonProgress />
    </div>
  );
}
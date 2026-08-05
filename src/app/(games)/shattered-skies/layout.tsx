export default function ShatteredSkiesLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div
        style={
          {
            // Sci-fi palette overrides (cyan / orange / green)
            "--color-void": "#080D14",
            "--color-nightfall": "#111A24",
            "--color-moonlight": "#DDE8F0",
            "--color-mist": "#6B8299",
            "--color-silver": "#4DD0E1", // primary accent -> HUD cyan
            "--color-gold": "#FF8A3D", // secondary accent -> signal orange
            "--color-scarlet": "#FF8A3D",
            "--color-emerald": "#5FD98A",
            "--color-lunar-gold": "#4DD0E1",
            "--color-rose-blood": "#FF8A3D",
            // Sci-fi display font
            "--font-display": "var(--font-rajdhani), sans-serif",
            "--font-hero": "var(--font-rajdhani), sans-serif",
            background: "#080D14",
            minHeight: "100vh",
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    );
  }
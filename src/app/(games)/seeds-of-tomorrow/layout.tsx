   export default function SeedsLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div
        style={
          {
            "--color-void": "#0C1210",
            "--color-nightfall": "#16211B",
            "--color-moonlight": "#EDEAE0",
            "--color-mist": "#7E9885",
            "--color-silver": "#5F9B6B", // primary accent -> living green
            "--color-gold": "#E0A845", // secondary accent -> warm amber
            "--color-scarlet": "#E0A845",
            "--color-emerald": "#5FB2C4",
            "--color-lunar-gold": "#5F9B6B",
            "--color-rose-blood": "#E0A845",
            "--font-display": "var(--font-fraunces), serif",
            "--font-hero": "var(--font-fraunces), serif",
            background: "#0C1210",
            minHeight: "100vh",
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    );
  }
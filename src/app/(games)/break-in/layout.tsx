/* Scopes the Break-In heist theme to its route. A cold surveillance
   system: steel greys, amber caution as the everyday accent, with
   green (clear) and red (alarm) held in reserve for meaning.
   Token overrides cascade to every component inside. */

   import AlarmMeter from "@/components/layout/AlarmMeter";

   export default function BreakInLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div
        style={
          {
            "--color-void": "#0A0B0D",
            "--color-nightfall": "#16181C",
            "--color-moonlight": "#E4E6E9",
            "--color-mist": "#767B84",
            "--color-silver": "#E5B54D", // primary accent -> amber caution
            "--color-gold": "#E5B54D",
            "--color-scarlet": "#E23C3C", // alarm red
            "--color-emerald": "#5FB584", // clear/safe green
            "--color-lunar-gold": "#E5B54D",
            "--color-rose-blood": "#E23C3C",
            "--font-display": "var(--font-archivo), sans-serif",
            "--font-hero": "var(--font-archivo), sans-serif",
            background: "#0A0B0D",
            minHeight: "100vh",
          } as React.CSSProperties
        }
      >
        {children}
        <AlarmMeter />
      </div>
    );
  }
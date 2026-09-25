import AlarmMeter from "@/components/layout/AlarmMeter";

export default function BreakInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        body {
          --color-void: #0A0B0D;
          --color-nightfall: #16181C;
          --color-moonlight: #E4E6E9;
          --color-mist: #767B84;
          --color-silver: #E5B54D; /* primary colour -> silver */
          --color-gold: #E5B54D;
          --color-scarlet: #E23C3C; /* red for the alarm */
          --color-emerald: #5FB584; /* clear green */
          --color-lunar-gold: #E5B54D;
          --color-rose-blood: #E23C3C;
        }
      `}</style>

      <div
        style={
          {
            "--font-display": "var(--font-archivo), sans-serif",
            "--font-hero": "var(--font-archivo), sans-serif",
            minHeight: "100vh",
          } as React.CSSProperties
        }
      >
        {children}
        <AlarmMeter />
      </div>
    </>
  );
}
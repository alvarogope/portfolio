import GrowthIndicator from "@/components/layout/GrowthIndicator";

export default function SeedsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        body {
          --color-void: #0C1210;
          --color-nightfall: #16211B;
          --color-moonlight: #EDEAE0;
          --color-mist: #7E9885;
          --color-silver: #5F9B6B; /* primary colour -> green */
          --color-gold: #E0A845; /* secondary colour -> amberish colour */
          --color-scarlet: #E0A845;
          --color-emerald: #5FB2C4;
          --color-lunar-gold: #5F9B6B;
          --color-rose-blood: #E0A845;
        }
      `}</style>

      <div
        style={
          {
            "--font-display": "var(--font-fraunces), serif",
            "--font-hero": "var(--font-fraunces), serif",
            minHeight: "100vh",
          } as React.CSSProperties
        }
      >
        {children}
        <GrowthIndicator />
      </div>
    </>
  );
}
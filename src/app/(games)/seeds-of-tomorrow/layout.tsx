import GrowthIndicator from "@/components/layout/GrowthIndicator";

/**
 * The sticky header and the footer are siblings of `{children}` in the root
 * layout, so they sit OUTSIDE this layout's subtree. Scoping the palette to a
 * wrapper div therefore left both of them on the global blue-black base while
 * the page painted this route's green-black — a visible seam above the footer,
 * and a cold header bar over a warm page. Putting the colour tokens on `body`
 * themes the whole document for as long as this route is mounted, so the base
 * is one colour from the top of the header to the bottom of the footer.
 *
 * Fonts stay on the wrapper: they are the page's voice, not the chrome's.
 */
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

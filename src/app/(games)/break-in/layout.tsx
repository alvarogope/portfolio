import AlarmMeter from "@/components/layout/AlarmMeter";

/**
 * The sticky header and the footer are siblings of `{children}` in the root
 * layout, so they sit OUTSIDE this layout's subtree. Scoping the palette to a
 * wrapper div therefore left both of them on the global blue-black base while
 * the page painted this route's near-black — a visible seam above the footer,
 * and a cold header bar over the page. Putting the colour tokens on `body`
 * themes the whole document for as long as this route is mounted, so the base
 * is one colour from the top of the header to the bottom of the footer.
 *
 * Fonts stay on the wrapper: they are the page's voice, not the chrome's.
 */
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

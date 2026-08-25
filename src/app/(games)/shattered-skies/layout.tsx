import Symbiochord from "@/components/layout/Symbiochord";

/**
 * The sticky header and the footer are siblings of `{children}` in the root
 * layout, so they sit OUTSIDE this layout's subtree. Scoping the palette to a
 * wrapper div therefore left both of them on the global blue-black base while
 * the page painted this route's deeper blue — a visible seam above the footer,
 * and a mismatched header bar over the page. Putting the colour tokens on
 * `body` themes the whole document for as long as this route is mounted, so the
 * base is one colour from the top of the header to the bottom of the footer.
 *
 * Fonts stay on the wrapper: they are the page's voice, not the chrome's.
 */
export default function ShatteredSkiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        body {
          --color-void: #080D14;
          --color-nightfall: #111A24;
          --color-moonlight: #DDE8F0;
          --color-mist: #6B8299;
          --color-silver: #4DD0E1; /* primary colour  -> cyan */
          --color-nebula: #7ec8d8; /* shared UI accent for the system views */
          --color-gold: #FF8A3D; /* secondary colour -> orange */
          --color-scarlet: #FF8A3D;
          --color-emerald: #5FD98A;
          --color-lunar-gold: #4DD0E1;
          --color-rose-blood: #FF8A3D;
        }
      `}</style>

      <div
        style={
          {
            "--font-display": "var(--font-rajdhani), sans-serif",
            "--font-hero": "var(--font-rajdhani), sans-serif",
            minHeight: "100vh",
          } as React.CSSProperties
        }
      >
        {children}
        <Symbiochord />
      </div>
    </>
  );
}

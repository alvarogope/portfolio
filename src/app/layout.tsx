import type { Metadata } from "next";
import { Cinzel, UnifrakturCook, Spectral, JetBrains_Mono } from "next/font/google";
import MoonProgress from "@/components/layout/MoonProgress";
import "./globals.css";

/* ============================================
   FONTS — next/font self-hosts these and feeds
   them into the --font-* slots that globals.css
   already references. Zero layout shift: the
   space is reserved before the font loads.
   ============================================ */

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-hero",   // ← fills the display slot
  display: "swap",
});

const display = UnifrakturCook({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-cinzel",   // ← fills the display slot
  display: "swap",
});
  
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains", // ← utility/mono slot
  display: "swap",
});

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-spectral", // ← body slot
  display: "swap",
});

/* ============================================
   METADATA — site-wide defaults. Per-page files
   override title/description later.
   ============================================ */

export const metadata: Metadata = {
  title: "Álvaro Gómez Pérez | Technical Designer",
  description:
    "Technical game designer. I design game systems and build them myself — Unreal Engine 5, Unity, C++, Python.",
};

/* ============================================
   ROOT LAYOUT — wraps every page. The font
   variables are attached to <html> so they
   cascade everywhere.
   ============================================ */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-GB"
      className={`${cinzel.variable} ${display.variable} ${spectral.variable} ${jetbrains.variable}`}
    >
      <body>
        {/* Placeholder nav — replaced by <SiteNav /> next file */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid var(--color-nightfall)",
            position: "sticky",
            top: 0,
            background: "color-mix(in srgb, var(--color-void) 85%, transparent)",
            backdropFilter: "blur(8px)",
            zIndex: 50,
          }}
        >
          <span style={{ fontFamily: "var(--font-hero)", letterSpacing: "0.04em" }}>
            Álvaro Gómez
          </span>
          <nav className="mono" style={{ display: "flex", gap: "1.5rem", fontSize: "0.8rem" }}>
            <a href="/">Projects</a>
            <a href="/engineering">Engineering</a>
            <a href="/about">About</a>
          </nav>
        </header>

        {children}

        {/* Placeholder footer — replaced by <Footer /> later */}
        <footer
          className="mono"
          style={{
            padding: "3rem 1.5rem",
            marginTop: "4rem",
            borderTop: "1px solid var(--color-nightfall)",
            color: "var(--color-mist)",
            fontSize: "0.75rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "space-between",
          }}
        >
          <span>© {new Date().getFullYear()} Álvaro Gómez</span>
          <span>Next.js + Tailwind · {" "}
            <a href="https://github.com/alvarogope/portfolio" style={{ borderBottom: "1px solid color-mix(in srgb, var(--color-silver) 50%, transparent)" }}>
              source on GitHub
            </a>
          </span>
        </footer>
        <MoonProgress />
      </body>
    </html>
  );
}
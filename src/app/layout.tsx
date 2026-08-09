import type { Metadata } from "next";
import { Cinzel, UnifrakturCook, Spectral, JetBrains_Mono, Rajdhani, Fraunces, Archivo, Bricolage_Grotesque } from "next/font/google";
import MoonProgress from "@/components/layout/MoonProgress";
import "./globals.css";
import Link from "next/link";

/* ============================================
   FONTS — next/font self-hosts these and feeds
   them into the --font-* slots that globals.css
   already references. Zero layout shift: the
   space is reserved before the font loads.
   ============================================ */

/* Each loader owns a RAW font variable named after the typeface
   (--font-cinzel, --font-archivo, …). The SEMANTIC slots that
   components actually read (--font-hero, --font-display, --font-body,
   --font-mono) are assigned in globals.css and re-pointed per route by
   the scoped layouts under (games). Never give a loader a slot name:
   next/font writes it onto <html> unlayered, which would outrank the
   @theme default and pin that slot site-wide. */

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-cinzel",   // ← Moon-Knight hero
  display: "swap",
});

const unifraktur = UnifrakturCook({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-unifraktur",   // ← Moon-Knight headings
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

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-rajdhani",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-fraunces",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-archivo",
  display: "swap",
});

const brand = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-brand",
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
        className={`${cinzel.variable} ${unifraktur.variable} ${spectral.variable} ${jetbrains.variable} ${rajdhani.variable} ${fraunces.variable} ${archivo.variable} ${brand.variable}`}
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
          <Link href="/" style={{ fontFamily: "var(--font-hero)", letterSpacing: "0.04em" }}>
            Álvaro Gómez
          </Link>
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
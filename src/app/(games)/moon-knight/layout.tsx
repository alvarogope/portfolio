/* Pins the Moon-Knight gothic type to its own route. Previously this
   page inherited the global default, so it broke the moment the default
   became the brand serif. Colours are deliberately NOT overridden here:
   the @theme palette in globals.css already IS the Moon-Knight palette. */

export default function MoonKnightLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div
        style={
          {
            "--font-display": "var(--font-unifraktur), serif", // UnifrakturCook -> headings
            "--font-hero": "var(--font-cinzel), serif",        // Cinzel -> hero title
            minHeight: "100vh",
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    );
  }

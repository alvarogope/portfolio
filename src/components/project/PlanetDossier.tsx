import {
  shatteredSkiesPlanets,
  tidalorHost,
  type Planet,
  type PlanetId,
} from "@/content/shattered-skies-planets";
import { PlanetGlyph, PlanetSprite } from "./PlanetGlyphs";

/**
 * Shattered Skies — survey dossier.
 *
 * A schematic strip of the system over a stat grid, one column per world,
 * ordered outward from the star. Static: everything reads without hover.
 *
 * The one-world-in-focus highlight is driven entirely by CSS: any ANCESTOR
 * carrying `data-active-planet="<id>"` dims the other worlds and lifts that one.
 * Passing `activePlanetId` puts the attribute on this section's own root, and
 * Stage 2's client wrapper puts it on a div above — same rules match either way,
 * which is what lets the orrery drive the highlight while this stays a server
 * component with no client JavaScript of its own.
 */

/* Schematic strip geometry, in viewBox units. Not to distance scale. */
const STRIP_W = 1400;
const STRIP_H = 300;
const SUN_X = 96;
const SUN_Y = 150;
const SPAN = 1094;
const ORBIT_RY = 118;

const stripX = (p: Planet) => SUN_X + p.orbitRadius * SPAN;
const stripSize = (p: Planet) => 20 + p.renderScale * 50;

export default function PlanetDossier({
  planets = shatteredSkiesPlanets,
  activePlanetId = null,
}: {
  planets?: readonly Planet[];
  /** Stage 2: the world the orrery is pointing at. Null means "show them all evenly". */
  activePlanetId?: PlanetId | null;
}) {
  const habitable = planets.filter((p) => p.habitable);
  const hottest = planets[0];
  const coldest = planets[planets.length - 1];
  const ramp = planets.map((p) => p.accent).join(", ");

  /* One pair of rules per world: CSS cannot compare an ancestor's attribute
     value against a descendant's, so the pairing is written out per id. */
  const focusRules = planets
    .map(
      (p) => `
        [data-active-planet="${p.id}"] :is(.pd__card, .pd__strip-world)[data-planet="${p.id}"] {
          opacity: 1;
        }
        [data-active-planet="${p.id}"] .pd__card[data-planet="${p.id}"] {
          box-shadow: 0 0 0 1px var(--pd-accent);
        }`
    )
    .join("");

  return (
    <section
      className="pd"
      aria-label="Planetary survey dossier"
      data-active-planet={activePlanetId ?? undefined}
    >
      <PlanetSprite />

      {/* Dossier header — summary readings */}
      <header className="pd__head">
        <p className="pd__kicker">Survey dossier · System of five worlds</p>
        <dl className="pd__summary">
          <div className="pd__metric">
            <dt>Worlds</dt>
            <dd>{planets.length}</dd>
          </div>
          <div className="pd__metric">
            <dt>Habitable</dt>
            <dd style={{ color: habitable[0]?.accent }}>
              {habitable.length} — {habitable.map((p) => p.name).join(", ")}
            </dd>
          </div>
          <div className="pd__metric">
            <dt>Range</dt>
            <dd>
              {hottest.temperature} → {coldest.temperature}
            </dd>
          </div>
        </dl>
      </header>

      {/* Schematic strip. Decorative: every reading below is repeated in the grid. */}
      <div className="pd__strip" aria-hidden>
        <svg
          className="pd__strip-svg"
          viewBox={`0 0 ${STRIP_W} ${STRIP_H}`}
          preserveAspectRatio="xMidYMid meet"
          focusable="false"
        >
          <rect width={STRIP_W} height={STRIP_H} style={{ fill: "var(--color-void)" }} />
          <rect width={STRIP_W} height={STRIP_H} fill="url(#ssp-stars)" />
          <circle cx={SUN_X} cy={SUN_Y} r={230} fill="url(#ssp-halo)" />

          <g fill="none" strokeWidth="1" strokeDasharray="3 8">
            {planets.map((p) => (
              <ellipse
                key={p.id}
                className="pd__orbit"
                cx={SUN_X}
                cy={SUN_Y}
                rx={p.orbitRadius * SPAN}
                ry={ORBIT_RY}
                stroke={p.accent}
                strokeOpacity="0.4"
              />
            ))}
          </g>

          <use href="#ssp-sun" x={SUN_X - 44} y={SUN_Y - 44} width="88" height="88" />

          {planets.map((p) => {
            const x = stripX(p);
            const size = stripSize(p);
            const top = SUN_Y - size / 2;
            return (
              <g key={p.id} className="pd__strip-world" data-planet={p.id}>
                {/* Tidalor's host, drawn behind the moon it carries. */}
                {p.isMoon && (
                  <>
                    <use href="#ssp-gasgiant" x={x - 116} y={SUN_Y - 42} width="118" height="84" />
                    <text
                      className="pd__strip-host"
                      x={x - 57}
                      y={SUN_Y + 54}
                      textAnchor="middle"
                      fill={tidalorHost.accent}
                    >
                      {tidalorHost.label.toUpperCase()}
                    </text>
                  </>
                )}
                <circle cx={x} cy={SUN_Y} r={size * 0.78} fill={p.accent} opacity="0.1" />
                <PlanetGlyphUse id={p.id} x={x - size / 2} y={top} size={size} />
                <text className="pd__strip-name" x={x} y={top - 26} textAnchor="middle">
                  {p.name.toUpperCase()}
                </text>
                <text className="pd__strip-temp" x={x} y={top - 10} textAnchor="middle" fill={p.accent}>
                  {p.temperature}
                  {p.isMoon ? " · MOON" : ""}
                </text>
              </g>
            );
          })}

          <text className="pd__strip-note" x={STRIP_W - 40} y={STRIP_H - 16} textAnchor="end">
            SCHEMATIC · NOT TO DISTANCE SCALE
          </text>
        </svg>
      </div>

      {/* The stat grid — one column per world, ordered outward from the star. */}
      <ol className="pd__grid">
        {planets.map((p) => (
          <li
            key={p.id}
            className="pd__card"
            data-planet={p.id}
            style={{ "--pd-accent": p.accent } as React.CSSProperties}
          >
            <div className="pd__orbit-row">
              <span className="pd__orbit-tag">{p.orbitLabel}</span>
              <span className="pd__orbit-rule" aria-hidden />
            </div>

            <PlanetGlyph id={p.id} size="100%" className="pd__glyph" />

            <div className="pd__ident">
              <h3 className="pd__name">{p.name}</h3>
              <p className="pd__kind">
                {p.kind}
                {p.isMoon && <span className="pd__moon-tag">Moon of a {p.host?.toLowerCase()}</span>}
              </p>
            </div>

            <dl className="pd__stats">
              <div className="pd__stat">
                <dt>Gravity</dt>
                <dd>{p.gravity}</dd>
              </div>
              <div className="pd__stat">
                <dt>Class</dt>
                <dd className="pd__stat-accent">{p.gravityClass}</dd>
              </div>
              <div className="pd__stat">
                <dt>Diameter</dt>
                <dd>{p.diameter}</dd>
              </div>
              <div className="pd__stat">
                <dt>Temp</dt>
                <dd>{p.temperature}</dd>
              </div>
            </dl>

            <div className="pd__eco">
              <span className="pd__eco-label">Ecosystem</span>
              <span className="pd__eco-value">{p.ecosystem}</span>
            </div>

            <p className="pd__note">{p.note}</p>
          </li>
        ))}
      </ol>

      {/* Hot → cold, in orbital order */}
      <footer className="pd__ramp">
        <span className="pd__ramp-label">Hottest</span>
        <span
          className="pd__ramp-bar"
          aria-hidden
          style={{ backgroundImage: `linear-gradient(90deg, ${ramp})` }}
        />
        <span className="pd__ramp-label">Coldest</span>
      </footer>

      <style>{`
        .pd {
          --pd-hairline: color-mix(in srgb, var(--color-mist) 24%, transparent);
          --pd-card: color-mix(in srgb, var(--color-nightfall) 45%, var(--color-void));
          --pd-row: color-mix(in srgb, var(--color-nightfall) 75%, var(--color-void));
          /* Lifted off --color-mist: the labels are small and widely tracked,
             and mist alone renders too thin to sit comfortably above AA. */
          --pd-quiet: color-mix(in srgb, var(--color-mist) 82%, var(--color-moonlight));
          --pd-prose: color-mix(in srgb, var(--color-moonlight) 45%, var(--color-mist));
          background: var(--color-void);
          border: 1px solid var(--pd-hairline);
          overflow: hidden;
        }

        /* ---- header ---- */
        .pd__head {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-end;
          justify-content: space-between;
          gap: 1.25rem;
          padding: 1.5rem 1.5rem 1.25rem;
          border-bottom: 1px solid var(--pd-hairline);
        }
        .pd__kicker {
          margin: 0;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--color-silver);
        }
        .pd__summary {
          display: flex;
          flex-wrap: wrap;
          gap: 1.75rem;
          margin: 0;
        }
        .pd__metric { display: grid; gap: 0.3rem; }
        .pd__metric dt {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--pd-quiet);
        }
        .pd__metric dd {
          margin: 0;
          font-family: var(--font-mono);
          font-size: 0.85rem;
          color: var(--color-moonlight);
        }

        /* ---- schematic strip ---- */
        .pd__strip {
          overflow-x: auto;
          overscroll-behavior-x: contain;
          border-bottom: 1px solid var(--pd-hairline);
        }
        .pd__strip-svg {
          display: block;
          width: 100%;
          min-width: 46rem; /* below this the strip scrolls instead of shrinking to illegible */
          height: auto;
          font-family: var(--font-mono);
        }
        .pd__strip-name {
          font-family: var(--font-display);
          font-size: 19px;
          font-weight: 700;
          letter-spacing: 0.1em;
          fill: var(--color-moonlight);
        }
        .pd__strip-temp { font-size: 11px; letter-spacing: 0.14em; }
        .pd__strip-host { font-size: 10px; letter-spacing: 0.2em; opacity: 0.85; }
        .pd__strip-note {
          font-size: 10px;
          letter-spacing: 0.2em;
          fill: var(--pd-quiet);
        }
        .pd__orbit {
          stroke-dashoffset: 0;
          animation: pd-drift 70s linear infinite;
        }
        @keyframes pd-drift { to { stroke-dashoffset: -220; } }

        /* ---- stat grid ---- */
        .pd__grid {
          list-style: none;
          display: grid;
          grid-template-columns: 1fr;
          gap: 1px;
          margin: 0;
          padding: 1px;
        }
        @media (min-width: 34rem) { .pd__grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 52rem) { .pd__grid { grid-template-columns: repeat(3, 1fr); } }
        /* 75rem, not 68: from here the section is at its max width, so a
           five-across column is wide enough to hold the longest readings
           ("17.01 m/s²", "Extremely low") on one line and the rows stay aligned. */
        @media (min-width: 75rem) { .pd__grid { grid-template-columns: repeat(5, 1fr); } }

        /* Subgrid keeps the six blocks of every card on the same lines across a
           row, so the stats stay scannable even though Tidalor carries an extra
           moon tag. Without subgrid support the card is a plain block flow, which
           reads fine — only the cross-column alignment is lost. */
        .pd__card {
          display: grid;
          grid-template-rows: subgrid;
          grid-row: span 6;
          row-gap: 1rem;
          align-content: start;
          min-width: 0;
          padding: 1.25rem 1.15rem 1.5rem;
          background: var(--pd-card);
          box-shadow: 0 0 0 1px var(--pd-hairline);
          transition: opacity 320ms ease, box-shadow 320ms ease;
        }
        @supports not (grid-template-rows: subgrid) {
          .pd__card {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
        }

        .pd__orbit-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }
        .pd__orbit-tag {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--pd-accent);
        }
        .pd__orbit-rule {
          width: 1.6rem;
          height: 2px;
          flex: none;
          background: var(--pd-accent);
        }

        .pd__glyph {
          width: clamp(4.5rem, 42%, 6rem);
          height: auto;
          aspect-ratio: 1;
          align-self: start;
          justify-self: start;
        }

        .pd__name {
          margin: 0;
          font-family: var(--font-display);
          font-size: clamp(1.45rem, 1.15rem + 0.8vw, 1.85rem);
          font-weight: 700;
          letter-spacing: 0.04em;
          line-height: 1;
          text-transform: uppercase;
          color: var(--color-moonlight);
        }
        .pd__kind {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          margin: 0.5rem 0 0;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.16em;
          line-height: 1.5;
          text-transform: uppercase;
          color: var(--pd-quiet);
        }
        .pd__moon-tag {
          align-self: flex-start;
          padding: 0.15rem 0.4rem;
          border: 1px solid color-mix(in srgb, var(--pd-accent) 55%, transparent);
          font-size: 0.6rem;
          letter-spacing: 0.14em;
          color: var(--pd-accent);
        }

        .pd__stats { display: grid; align-content: start; gap: 1px; margin: 0; }
        .pd__stat {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          justify-content: space-between;
          gap: 0.4rem;
          padding: 0.5rem 0.55rem;
          background: var(--pd-row);
        }
        .pd__stat dt {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--pd-quiet);
        }
        .pd__stat dd {
          margin: 0;
          font-family: var(--font-mono);
          font-size: 0.78rem;
          color: var(--color-moonlight);
        }
        /* A category tag rather than a reading — set smaller so the longest of
           them ("Extremely low") stays on one line in the narrowest column. */
        .pd__stat-accent {
          font-size: 0.7rem;
          letter-spacing: 0;
          color: var(--pd-accent) !important;
        }

        .pd__eco { display: grid; gap: 0.35rem; }
        .pd__eco-label {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--pd-quiet);
        }
        .pd__eco-value {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          line-height: 1.5;
          color: var(--color-moonlight);
        }

        .pd__note {
          margin: 0;
          font-family: var(--font-body);
          font-size: 0.92rem;
          line-height: 1.6;
          color: var(--pd-prose);
        }

        /* ---- temperature ramp ---- */
        .pd__ramp {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.1rem 1.5rem 1.35rem;
          border-top: 1px solid var(--pd-hairline);
        }
        .pd__ramp-label {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          white-space: nowrap;
          color: var(--pd-quiet);
        }
        .pd__ramp-bar { flex: 1; height: 2px; }

        /* ---- one world in focus ----
           Driven by an ancestor's data-active-planet, so either this section's
           own prop or the client wrapper above it can set the state. The
           per-world rules come last: they tie with the dimming rules on
           specificity and win on source order. */
        [data-active-planet] .pd__card { opacity: 0.42; }
        [data-active-planet] .pd__strip-world { opacity: 0.4; }
${focusRules}

        @media (prefers-reduced-motion: reduce) {
          .pd__orbit { animation: none; }
        }
      `}</style>
    </section>
  );
}

/** `PlanetGlyph` renders its own <svg>; inside the strip we need a bare <use>. */
function PlanetGlyphUse({
  id,
  x,
  y,
  size,
}: {
  id: PlanetId;
  x: number;
  y: number;
  size: number;
}) {
  return <use href={`#ssp-${id}`} x={x} y={y} width={size} height={size} />;
}

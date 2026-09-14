import {
  accessGateMeta,
  knowledgeGate,
  shatteredSkiesPlanets,
  tidalorHost,
  type Planet,
  type PlanetId,
} from "@/content/shattered-skies-planets";
import { PlanetGlyph, PlanetSprite } from "./PlanetGlyphs";

const STRIP_W = 1400;
const STRIP_H = 300;
const SUN_X = 96;
const SUN_Y = 150;
const SPAN = 1094;
const ORBIT_RY = 118;

const stripX = (p: Planet) => SUN_X + p.orbitRadius * SPAN;
const stripSize = (p: Planet) => 20 + p.renderScale * 50;

const FIG_W = 520;
const FIG_H = 190;
const FIG_CX = 260;
const FIG_CY = 96;
const FIG_RX = 196;
const FIG_RY = 58;

const GHOST_A = (300 * Math.PI) / 180;
const GHOST_X = FIG_CX + FIG_RX * Math.cos(GHOST_A);
const GHOST_Y = FIG_CY + FIG_RY * Math.sin(GHOST_A);

function AlignmentFigure() {
  const { figureSummary, figureOpenLabel, figureShutLabel } = knowledgeGate.example;
  return (
    <svg
      className="pd__fig"
      viewBox={`0 0 ${FIG_W} ${FIG_H}`}
      role="img"
      aria-labelledby="pd-fig-title pd-fig-desc"
      focusable="false"
    >
      <title id="pd-fig-title">Orbit Hint</title>
      <desc id="pd-fig-desc">{figureSummary}</desc>

      <ellipse
        className="pd__fig-orbit"
        cx={FIG_CX}
        cy={FIG_CY}
        rx={FIG_RX}
        ry={FIG_RY}
        fill="none"
      />

      <line
        className="pd__fig-line"
        x1={FIG_CX - FIG_RX}
        y1={FIG_CY}
        x2={FIG_CX + FIG_RX}
        y2={FIG_CY}
      />

      <circle className="pd__fig-star" cx={FIG_CX} cy={FIG_CY} r={11} />

      <circle className="pd__fig-ghost" cx={GHOST_X} cy={GHOST_Y} r={9} />
      <text className="pd__fig-label is-shut" x={GHOST_X} y={GHOST_Y - 18} textAnchor="middle">
        {figureShutLabel}
      </text>

      <circle className="pd__fig-body" cx={FIG_CX - FIG_RX} cy={FIG_CY} r={13} />
      <rect
        className="pd__fig-target"
        x={FIG_CX + FIG_RX - 10}
        y={FIG_CY - 10}
        width={20}
        height={20}
      />

      <text className="pd__fig-label is-open" x={FIG_CX} y={FIG_CY + 34} textAnchor="middle">
        {figureOpenLabel}
      </text>
    </svg>
  );
}

export default function PlanetDossier({
  planets = shatteredSkiesPlanets,
  activePlanetId = null,
}: {
  planets?: readonly Planet[];
  activePlanetId?: PlanetId | null;
}) {
  const habitable = planets.filter((p) => p.habitable);
  const hottest = planets[0];
  const coldest = planets[planets.length - 1];
  const ramp = planets.map((p) => p.accent).join(", ");

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

      <header className="pd__head">
        <p className="pd__kicker">The Planetary System Dossier</p>
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

      <section className="pd__gate" aria-labelledby="pd-gate-title">
        <header className="pd__gate-head">
          <p className="pd__kicker">{knowledgeGate.kicker}</p>
          <h3 className="pd__gate-title" id="pd-gate-title">
            {knowledgeGate.title}
          </h3>
          <p className="pd__gate-standfirst">{knowledgeGate.standfirst}</p>
        </header>

        <div className="pd__gate-body">
          <div className="pd__gate-prose">
            <p className="pd__gate-lead">{knowledgeGate.lead}</p>
            <div className="pd__gate-beat">
              <p className="pd__gate-beat-label">{knowledgeGate.rule.label}</p>
              <p className="pd__gate-beat-body">{knowledgeGate.rule.body}</p>
            </div>
          </div>

          <figure className="pd__gate-fig">
            <AlignmentFigure />
            <figcaption className="pd__gate-cap">
              <span className="pd__gate-beat-label">{knowledgeGate.example.label}</span>
              {knowledgeGate.example.body}
            </figcaption>
          </figure>
        </div>

        <p className="pd__gate-point">{knowledgeGate.designPoint}</p>

        <ul className="pd__gate-legend">
          {(Object.keys(accessGateMeta) as (keyof typeof accessGateMeta)[]).map((k) => (
            <li key={k} className="pd__gate-legend-item" data-gate={k}>
              <span className="pd__gate-chip">{accessGateMeta[k].term}</span>
              <span className="pd__gate-gloss">{accessGateMeta[k].gloss}</span>
            </li>
          ))}
        </ul>
      </section>

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

            <div className="pd__access" data-gate={p.access.gate}>
              <p className="pd__access-head">
                <span className="pd__access-label">Access</span>
                <span className="pd__access-chip">{p.access.label}</span>
              </p>
              <p className="pd__access-rule">{p.access.rule}</p>
              <p className="pd__access-know">
                <span className="pd__access-know-label">What you have to know</span>
                {p.access.knowledge}
              </p>
            </div>
          </li>
        ))}
      </ol>

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

        /* Subgrid keeps the seven blocks of every card on the same lines across
           a row, so the stats stay scannable even though Tidalor carries an extra
           moon tag. The span has to match the child count: a child past the end of
           a subgrid is placed in an implicit track, which is zero-height here, so
           it escapes the card and prints over whatever sits below it. Without subgrid
           support the card is a plain block flow, which reads fine — only the cross-column alignment is lost. */
        .pd__card {
          display: grid;
          grid-template-rows: subgrid;
          grid-row: span 7;
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
          /* No shared rows to line up against, so the access block is pushed to
             the foot of the card instead. */
          .pd__access { margin-top: auto; }
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
          font-size: 0.70rem;
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

        /* ---- knowledge-gated access ----
           --pd-gate is set per tone and every chip prints its own word, so
           the colour is a second read of something the text already carries.
           Cyan for a window that opens, warm for a condition that holds you,
           quiet for a world with nothing withheld. */
        .pd__gate {
          display: grid;
          gap: 1.1rem;
          padding: 1.5rem;
          border-bottom: 1px solid var(--pd-hairline);
          background: color-mix(in srgb, var(--color-nightfall) 28%, var(--color-void));
        }
        .pd__gate-head { display: grid; gap: 0.5rem; }
        .pd__gate-title {
          margin: 0;
          font-family: var(--font-hero);
          font-size: clamp(1.15rem, 1rem + 0.8vw, 1.55rem);
          line-height: 1.2;
          color: var(--color-moonlight);
        }
        .pd__gate-standfirst {
          margin: 0;
          max-width: 46rem;
          font-family: var(--font-body);
          font-size: 0.98rem;
          line-height: 1.6;
          color: var(--color-moonlight);
        }

        .pd__gate-body {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 1.5rem;
          align-items: start;
        }
        .pd__gate-prose { display: grid; gap: 0.9rem; }
        .pd__gate-lead,
        .pd__gate-beat-body {
          margin: 0;
          font-family: var(--font-body);
          font-size: 0.92rem;
          line-height: 1.65;
          color: var(--pd-prose);
        }
        .pd__gate-beat {
          display: grid;
          gap: 0.35rem;
          padding-left: 0.9rem;
          border-left: 2px solid color-mix(in srgb, var(--color-silver) 45%, transparent);
        }
        .pd__gate-beat-label {
          margin: 0;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-silver);
        }

        .pd__gate-fig { margin: 0; display: grid; gap: 0.7rem; }
        .pd__fig {
          display: block;
          width: 100%;
          height: auto;
          background: var(--color-void);
          border: 1px solid var(--pd-hairline);
        }
        .pd__fig-orbit {
          stroke: color-mix(in srgb, var(--color-mist) 55%, transparent);
          stroke-width: 1;
          stroke-dasharray: 3 7;
        }
        .pd__fig-line {
          stroke: var(--color-silver);
          stroke-width: 1.4;
          stroke-dasharray: 6 4;
        }
        .pd__fig-star { fill: var(--color-gold); }
        .pd__fig-body { fill: var(--color-silver); }
        .pd__fig-target {
          fill: none;
          stroke: var(--color-silver);
          stroke-width: 2;
        }
        .pd__fig-ghost {
          fill: none;
          stroke: color-mix(in srgb, var(--color-mist) 70%, transparent);
          stroke-width: 1.4;
          stroke-dasharray: 3 3;
        }
        .pd__fig-label {
          font-family: var(--font-mono);
          font-size: 15px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .pd__fig-label.is-open { fill: var(--color-silver); }
        .pd__fig-label.is-shut { fill: var(--pd-quiet); }

        .pd__gate-cap {
          margin: 0;
          display: grid;
          gap: 0.3rem;
          font-family: var(--font-body);
          font-size: 0.88rem;
          line-height: 1.6;
          color: var(--pd-prose);
        }

        .pd__gate-point {
          margin: 0;
          padding: 0.85rem 1rem;
          border: 1px solid color-mix(in srgb, var(--color-silver) 30%, transparent);
          background: color-mix(in srgb, var(--color-silver) 6%, transparent);
          font-family: var(--font-body);
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--color-moonlight);
        }

        .pd__gate-legend {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem 1.5rem;
        }
        .pd__gate-legend-item {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
          font-family: var(--font-body);
          font-size: 0.84rem;
          color: var(--pd-prose);
        }

        /* the chip, shared by the legend and every card */
        .pd__gate-chip,
        .pd__access-chip {
          flex: 0 0 auto;
          padding: 0.12rem 0.5rem;
          border: 1px solid color-mix(in srgb, var(--pd-gate, var(--color-mist)) 55%, transparent);
          background: color-mix(in srgb, var(--pd-gate, var(--color-mist)) 10%, transparent);
          font-family: var(--font-mono);
          font-size: 0.71rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--pd-gate, var(--pd-quiet));
          white-space: nowrap;
        }
        [data-gate="orbital"] { --pd-gate: var(--color-silver); }
        [data-gate="gravity"] { --pd-gate: var(--color-gold); }
        [data-gate="open"]    { --pd-gate: var(--pd-quiet); }

        .pd__gate-credit {
          margin: 0;
          padding-top: 0.85rem;
          border-top: 1px solid var(--pd-hairline);
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.06em;
          line-height: 1.6;
          color: var(--pd-quiet);
        }

        /* ---- the per-card access row ---- */
        .pd__access {
          display: grid;
          align-content: start;
          gap: 0.5rem;
          padding-top: 0.9rem;
          border-top: 1px solid var(--pd-hairline);
        }
        .pd__access-head {
          margin: 0;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.5rem;
        }
        .pd__access-label {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--pd-quiet);
        }
        .pd__access-rule {
          margin: 0;
          font-family: var(--font-body);
          font-size: 0.88rem;
          line-height: 1.6;
          color: var(--color-moonlight);
        }
        .pd__access-know {
          margin: 0;
          display: grid;
          gap: 0.25rem;
          font-family: var(--font-body);
          font-size: 0.86rem;
          line-height: 1.6;
          color: var(--pd-prose);
        }
        .pd__access-know-label {
          font-family: var(--font-mono);
          font-size: 0.70rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--pd-gate, var(--pd-quiet));
        }

        @media (max-width: 860px) {
          .pd__gate-body { grid-template-columns: minmax(0, 1fr); }
          .pd__gate { padding: 1.25rem 1rem; }
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

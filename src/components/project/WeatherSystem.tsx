import {
  flip,
  flipSummary,
  loopPointer,
  rejectedReadout,
  rosterThesis,
  weatherCredit,
  weathers,
  zones,
  type Weather,
  type WeatherId,
  type Zone,
} from "@/content/seeds-weather";

const VB_W = 1120;
const VB_H = 404;

const PAD_X = 20;
const PANEL_W = 490;
const GATE_W = 100;

const PANEL_Y = 46;
const HEAD_H = 34;
const SKY_TOP = PANEL_Y + HEAD_H;
const GROUND_Y = 236;
const SOIL_BOTTOM = 290;
const FOOT_BOTTOM = 332;
const PANEL_H = FOOT_BOTTOM - PANEL_Y;

const CROSS_Y = Math.round((SKY_TOP + GROUND_Y) / 2);

const TRIGGER_Y = 6;
const TRIGGER_H = 26;

const REJECT_Y = 366;
const BAR_W = 232;
const BAR_H = 11;

const PLATE_FONT = 10;
const PLATE_CHAR_W = PLATE_FONT * 0.6;

function panelBox(i: number) {
  const x = PAD_X + i * (PANEL_W + GATE_W);
  return { x, y: PANEL_Y, w: PANEL_W, h: PANEL_H, cx: x + PANEL_W / 2, right: x + PANEL_W };
}

const SEAM_X = PAD_X + PANEL_W + GATE_W / 2;

const RAIN_COLUMNS = 22;
const RAIN_PERIOD = 54;

interface Drop {
  x: number;
  y: number;
  len: number;
  slant: number;
}

function rainDrops(panelX: number, slant: number, len: number): Drop[] {
  const drops: Drop[] = [];
  const pitch = PANEL_W / RAIN_COLUMNS;
  const rows = Math.ceil((GROUND_Y - SKY_TOP) / RAIN_PERIOD) + 2;

  for (let c = 0; c < RAIN_COLUMNS; c++) {
    const xJitter = ((c * 17) % 13) - 6;
    const yJitter = ((c * 29) % RAIN_PERIOD) - RAIN_PERIOD / 2;
    const lenJitter = ((c * 11) % 7) - 3;

    for (let r = -1; r < rows; r++) {
      drops.push({
        x: panelX + pitch * (c + 0.5) + xJitter,
        y: SKY_TOP + yJitter + r * RAIN_PERIOD,
        len: len + lenJitter,
        slant,
      });
    }
  }
  return drops;
}

function Rain({ zone, panelX }: { zone: Zone; panelX: number }) {
  const acid = zone.id === "poisoned";
  const drops = rainDrops(panelX, acid ? -7 : -1.5, acid ? 22 : 15);

  return (
    <g clipPath={`url(#sw-sky-${zone.id})`}>
      <g className={`sw-rain is-${zone.id}`}>
        {drops.map((d, i) => (
          <line
            key={i}
            className="sw-drop"
            x1={d.x}
            y1={d.y}
            x2={d.x + d.slant}
            y2={d.y + d.len}
          />
        ))}
      </g>
    </g>
  );
}

const STEM_XS = [0.1, 0.21, 0.34, 0.46, 0.58, 0.7, 0.79, 0.9];

function Ground({ zone, panelX }: { zone: Zone; panelX: number }) {
  const healed = zone.id === "healed";

  return (
    <g className={`sw-ground is-${zone.id}`}>
      <rect
        className="sw-soil"
        x={panelX}
        y={GROUND_Y}
        width={PANEL_W}
        height={SOIL_BOTTOM - GROUND_Y}
      />
      <line
        className="sw-soil-line"
        x1={panelX}
        y1={GROUND_Y}
        x2={panelX + PANEL_W}
        y2={GROUND_Y}
      />

      {STEM_XS.map((t, i) => {
        const x = panelX + PANEL_W * t + (((i * 19) % 11) - 5);
        const h = 16 + ((i * 13) % 9);

        if (!healed) {
          return (
            <g key={t}>
              <path className="sw-stem" d={`M ${x} ${GROUND_Y} v ${-h}`} />
              <path className="sw-stem" d={`M ${x} ${GROUND_Y - h} l ${i % 2 ? 5 : -5} ${-4}`} />
            </g>
          );
        }

        const g = h + 9;
        return (
          <g key={t}>
            <path className="sw-stem" d={`M ${x} ${GROUND_Y} v ${-g}`} />
            <path
              className="sw-leaf"
              d={`M ${x} ${GROUND_Y - g * 0.55} c -8 -2, -11 -7, -10 -11 c 6 -1, 9 4, 10 11 Z`}
            />
            <path
              className="sw-leaf"
              d={`M ${x} ${GROUND_Y - g * 0.8} c 8 -2, 11 -7, 10 -11 c -6 -1, -9 4, -10 11 Z`}
            />
          </g>
        );
      })}
    </g>
  );
}

function Plate({
  text,
  x,
  y,
  kind = "trigger",
}: {
  text: string;
  x: number;
  y: number;
  kind?: "trigger" | "quiet";
}) {
  const label = text.toUpperCase();
  const w = label.length * PLATE_CHAR_W + 22;

  return (
    <g className={`sw-plate is-${kind}`}>
      <rect className="sw-plate-body" x={x - w / 2} y={y} width={w} height={TRIGGER_H} rx={13} />
      <text className="sw-plate-text" x={x} y={y + TRIGGER_H / 2 + 3.4} textAnchor="middle">
        {label}
      </text>
    </g>
  );
}

function ZonePanel({ zone, i }: { zone: Zone; i: number }) {
  const box = panelBox(i);
  const sky = weathers.find((w) => w.id === zone.sky);

  return (
    <g className={`sw-zone is-${zone.id}`}>
      <rect
        className="sw-sky"
        x={box.x}
        y={SKY_TOP}
        width={PANEL_W}
        height={GROUND_Y - SKY_TOP}
      />
      <Rain zone={zone} panelX={box.x} />
      <Ground zone={zone} panelX={box.x} />

      <rect className="sw-panel-head" x={box.x} y={PANEL_Y} width={PANEL_W} height={HEAD_H} />

      <rect
        className="sw-panel-foot"
        x={box.x}
        y={SOIL_BOTTOM}
        width={PANEL_W}
        height={FOOT_BOTTOM - SOIL_BOTTOM}
      />
      <text className="sw-panel-reads" x={box.x + 74} y={SOIL_BOTTOM + 25}>
        {zone.readout}
      </text>

      <text className="sw-panel-caption" x={box.x + 16} y={SKY_TOP + 24}>
        {zone.skyLine}
      </text>
      <text className="sw-panel-caption is-ground" x={box.x + 16} y={SOIL_BOTTOM - 12}>
        {zone.groundLine}
      </text>

      <rect
        className="sw-panel-frame"
        x={box.x + 0.5}
        y={PANEL_Y + 0.5}
        width={PANEL_W - 1}
        height={PANEL_H - 1}
        rx={10}
      />
    </g>
  );
}

function SolveNode() {
  return (
    <g className="sw-solve">
      <circle className="sw-solve-well" cx={SEAM_X} cy={CROSS_Y} r={16} />
      <path className="sw-solve-stem" d={`M ${SEAM_X} ${CROSS_Y + 8} v -10`} />
      <path
        className="sw-solve-leaf"
        d={`M ${SEAM_X} ${CROSS_Y - 2} c -8 -1, -10 -6, -9 -10 c 6 0, 8 5, 9 10 Z`}
      />
      <path
        className="sw-solve-leaf"
        d={`M ${SEAM_X} ${CROSS_Y - 2} c 8 -1, 10 -6, 9 -10 c -6 0, -8 5, -9 10 Z`}
      />
    </g>
  );
}

function Flip() {
  return (
    <svg
      className="sw-flip"
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      role="img"
      aria-labelledby="sw-flip-title sw-flip-desc"
    >
      <title id="sw-flip-title">
        One place, before and after the player heals it
      </title>
      <desc id="sw-flip-desc">{flipSummary}</desc>

      <defs>
        <marker
          id="sw-arrow"
          viewBox="0 0 8 8"
          refX="7.4"
          refY="4"
          markerWidth="8"
          markerHeight="8"
          markerUnits="userSpaceOnUse"
          orient="auto"
        >
          <path className="sw-head" d="M 0 0 L 8 4 L 0 8 Z" />
        </marker>

        {zones.map((zone) => (
          <clipPath key={zone.id} id={`sw-sky-${zone.id}`}>
            <rect
              x={panelBox(zones.indexOf(zone)).x}
              y={SKY_TOP}
              width={PANEL_W}
              height={GROUND_Y - SKY_TOP}
            />
          </clipPath>
        ))}
      </defs>

      {zones.map((zone, i) => (
        <ZonePanel key={zone.id} zone={zone} i={i} />
      ))}

      <Plate text={flip.trigger} x={SEAM_X} y={TRIGGER_Y} />
      <path className="sw-drop-line" d={`M ${SEAM_X} ${TRIGGER_Y + TRIGGER_H} V ${CROSS_Y - 16}`} />
      <path
        className="sw-cross"
        d={`M ${panelBox(0).right - 10} ${CROSS_Y} H ${SEAM_X - 20}`}
        markerEnd="url(#sw-arrow)"
      />
      <path
        className="sw-cross"
        d={`M ${SEAM_X + 20} ${CROSS_Y} H ${panelBox(1).x + 4}`}
        markerEnd="url(#sw-arrow)"
      />
      <SolveNode />
      {flip.direction.split(" · ").map((line, i) => (
        <text
          key={line}
          className="sw-cross-label"
          x={SEAM_X}
          y={CROSS_Y + 34 + i * 13}
          textAnchor="middle"
        >
          {line.toUpperCase()}
        </text>
      ))}

    </svg>
  );
}

function WeatherGlyph({ id }: { id: WeatherId }) {
  if (id === "acid-rain") {
    return (
      <svg className="sw-glyph" viewBox="0 0 72 44" aria-hidden="true" focusable="false">
        <path className="sw-glyph-cloud" d="M 14 15 c 0 -7 6 -11 12 -9 c 3 -6 13 -6 15 1 c 6 -1 9 3 8 8 Z" />
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            className="sw-glyph-drop"
            x1={16 + i * 12}
            y1={24}
            x2={11 + i * 12}
            y2={38}
          />
        ))}
      </svg>
    );
  }

  if (id === "clean-rain") {
    return (
      <svg className="sw-glyph" viewBox="0 0 72 44" aria-hidden="true" focusable="false">
        <path className="sw-glyph-cloud" d="M 14 13 c 0 -7 6 -11 12 -9 c 3 -6 13 -6 15 1 c 6 -1 9 3 8 8 Z" />
        {[0, 1, 2].map((i) => (
          <line key={i} className="sw-glyph-drop" x1={18 + i * 11} y1={21} x2={18 + i * 11} y2={30} />
        ))}
        <path className="sw-glyph-stem" d="M 56 42 v -14" />
        <path className="sw-glyph-leaf" d="M 56 30 c -8 -1, -10 -6, -9 -10 c 6 0, 8 5, 9 10 Z" />
        <path className="sw-glyph-leaf" d="M 56 32 c 8 -1, 10 -6, 9 -10 c -6 0, -8 5, -9 10 Z" />
      </svg>
    );
  }

  if (id === "snow") {
    const arms = [0, 60, 120];
    return (
      <svg className="sw-glyph" viewBox="0 0 72 44" aria-hidden="true" focusable="false">
        <g transform="translate(36 22)">
          {arms.map((a) => (
            <g key={a} transform={`rotate(${a})`}>
              <line className="sw-glyph-stroke" x1={-16} y1={0} x2={16} y2={0} />
              <line className="sw-glyph-stroke" x1={10} y1={0} x2={5} y2={-5} />
              <line className="sw-glyph-stroke" x1={10} y1={0} x2={5} y2={5} />
              <line className="sw-glyph-stroke" x1={-10} y1={0} x2={-5} y2={-5} />
              <line className="sw-glyph-stroke" x1={-10} y1={0} x2={-5} y2={5} />
            </g>
          ))}
        </g>
      </svg>
    );
  }

  if (id === "wind") {
    return (
      <svg className="sw-glyph" viewBox="0 0 72 44" aria-hidden="true" focusable="false">
        <path className="sw-glyph-stroke" d="M 8 13 h 38 a 6 6 0 1 0 -6 -6" />
        <path className="sw-glyph-stroke" d="M 8 23 h 48 a 6 6 0 1 1 -6 6" />
        <path className="sw-glyph-stroke" d="M 8 33 h 30 a 5 5 0 1 0 -5 5" />
      </svg>
    );
  }

  return (
    <svg className="sw-glyph" viewBox="0 0 72 44" aria-hidden="true" focusable="false">
      <path className="sw-glyph-dune" d="M 4 40 c 12 -2 16 -12 30 -12 c 12 0 18 10 34 12 Z" />
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          className="sw-glyph-grain"
          x1={10 + i * 13}
          y1={8 + (i % 3) * 6}
          x2={22 + i * 13}
          y2={6 + (i % 3) * 6}
        />
      ))}
    </svg>
  );
}

const ROLE_ORDER: Weather["role"][] = ["signal", "hazard"];

export default function WeatherSystem() {
  const sorted = [...weathers].sort(
    (a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role),
  );

  return (
    <div className="sw">
      <div className="panel sw-frame">
        <div className="sw-frame-head">
          <p className="mono sw-frame-tag">The Weather Design</p>
        </div>

        {/* 1 — the flip */}
        <section className="sw-band">
          <div className="sw-band-head">
            <h3 className="sw-band-title">The Acid Rain</h3>
          </div>
          <div
            className="sw-screen sw-flip-scroll"
            role="group"
            aria-label="The weather flip diagram, scrolls horizontally"
            tabIndex={0}
          >
            <Flip />
          </div>
          <p className="mono mono-note sw-scroll-note">Scroll the world sideways to cross it →</p>

          <ol className="sw-zones">
            {zones.map((zone) => (
              <li key={zone.id} className={`sw-zone-card is-${zone.id}`}>
                <p className="mono sw-zone-kicker">
                  <span className="sw-zone-dot" aria-hidden="true" />
                  {zone.index} {zone.stateLabel}
                </p>
                <h4 className="sw-zone-name">{zone.name}</h4>
                <p className="sw-zone-detail">{zone.detail}</p>
              </li>
            ))}
          </ol>

        </section>

        {/* 2 — every weather, and the job it holds */}
        <section className="sw-band">
          <div className="sw-band-head">
            <h3 className="sw-band-title">The Types of Weather</h3>
          </div>
          <p className="sw-thesis">{rosterThesis}</p>
          <ul className="sw-weathers">
            {sorted.map((w) => (
              <li key={w.id} className={`sw-weather is-${w.role} sw-is-${w.id}`}>
                <div className="sw-glyph-well">
                  <WeatherGlyph id={w.id} />
                </div>
                <p className="mono sw-weather-kicker">
                  <span className="sw-weather-index">{w.index}</span>
                  <span>{w.roleLabel}</span>
                </p>
                <h4 className="sw-weather-name">{w.name}</h4>
                {w.where && <p className="mono sw-weather-where">Falls on · {w.where}</p>}
              </li>
            ))}
          </ul>
        </section>

        <section className="sw-band">
          <aside className="sw-credit">
            <p className="mono sw-credit-tag">Designer note · The weather</p>
            <p className="sw-credit-body">{weatherCredit.body}</p>
            <p className="sw-credit-pointer">
              <a href={loopPointer.href}>Click here for {loopPointer.label} &uarr;</a>
              <span>{loopPointer.body}</span>
            </p>
          </aside>
        </section>
      </div>

      <style>{`
        .sw {
          /* This route scopes --color-silver to its green (#5F9B6B) and
             --color-gold to its amber (#E0A845). The accents are the tokens,
             not hexes. */
          --sw-leaf: var(--color-silver);
          /* Lifted for small text: the raw green clears AA on the route's void
             but leaves nothing spare, and this holds 7.8:1 everywhere the 10px
             mono is used. */
          --sw-leaf-text: color-mix(in srgb, var(--color-silver) 72%, var(--color-moonlight));
          --sw-acid: var(--color-gold);
          --sw-quiet: color-mix(in srgb, var(--color-mist) 55%, var(--color-moonlight));
          --sw-edge: color-mix(in srgb, var(--color-mist) 34%, transparent);
          --sw-screen: var(--color-void);
          /* The two skies. Both are shallow mixes into the route's void, so the
             moonlight text over them stays above 13:1. */
          --sw-sky-acid: color-mix(in srgb, var(--sw-acid) 13%, var(--color-void));
          --sw-sky-clean: color-mix(in srgb, var(--sw-leaf) 14%, var(--color-void));
        }

        /* The same breakout the other project consoles use: the section column
           caps at 68rem, narrower than a two-panel world wants. Tokens in
           globals.css, under THE RIGHT GUTTER. */
        @media (min-width: 900px) {
          .sw {
            width: var(--breakout-w);
            margin-left: calc(50% - var(--breakout-lead));
            margin-right: calc(50% - var(--breakout-tail));
          }
        }

        .sw-frame {
          border: 1px solid var(--sw-edge);
          border-radius: 14px;
          padding: 1.25rem;
          display: grid;
          gap: 1.9rem;
        }
        .sw-frame-head {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: baseline;
          gap: 0.5rem 1.5rem;
          padding-bottom: 0.85rem;
          border-bottom: 1px solid var(--sw-edge);
        }
        .sw-frame-tag { margin: 0; font-size: 0.72rem; color: var(--sw-leaf-text); }
        .sw-frame-meta { margin: 0; font-size: 0.68rem; color: var(--sw-quiet); }

        .sw-band { display: grid; gap: 0.85rem; }
        .sw-band-head {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: baseline;
          gap: 0.35rem 1.5rem;
        }
        .sw-band-title {
          font-family: var(--font-hero);
          font-size: 1.05rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          margin: 0;
          color: var(--color-moonlight);
        }
        .sw-band-meta { margin: 0; font-size: 0.72rem; color: var(--sw-quiet); }

        .sw-screen {
          background: var(--sw-screen);
          border: 1px solid var(--sw-edge);
          border-radius: 12px;
        }
        .sw-flip-scroll { overflow-x: auto; overscroll-behavior-x: contain; }
        .sw-flip-scroll:focus-visible {
          outline: 2px solid var(--color-lunar-gold);
          outline-offset: 2px;
        }
        /* Below its floor the world scrolls rather than shrinking: the zone
           cards under it carry both states in full anyway, so a squinting
           diagram would buy nothing. */
        .sw-flip { display: block; width: 100%; min-width: 1120px; height: auto; }
        /* Narrow-only, for the same reason as every other scroll-only figure:
           no drag handler, no key handler, so no chip — just the one true
           thing, at the widths where it is true. */
        .sw-scroll-note {
          display: none;
          margin: 0.7rem 0 0;
          font-size: 0.70rem;
          color: var(--sw-quiet);
        }
        @media (max-width: 1120px) {
          .sw-scroll-note { display: block; }
        }

        /* ---- 1 · the flip ---- */
        .sw-sky { fill: var(--sw-sky-acid); }
        .is-healed .sw-sky { fill: var(--sw-sky-clean); }

        .sw-panel-head,
        .sw-panel-foot { fill: color-mix(in srgb, var(--color-moonlight) 5%, transparent); }
        .sw-panel-frame {
          fill: none;
          stroke: color-mix(in srgb, var(--sw-acid) 42%, transparent);
          stroke-width: 1;
        }
        .is-healed .sw-panel-frame { stroke: color-mix(in srgb, var(--sw-leaf) 55%, transparent); }

        .sw-panel-index,
        .sw-panel-sky {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
        }
        /* The zone number takes the accent; the sky name beside it stays quiet,
           because the word "poisoned"/"healed" next to it is the signal. */
        .sw-panel-index { fill: var(--sw-acid); }
        .is-healed .sw-panel-index { fill: var(--sw-leaf-text); }
        .sw-panel-sky { fill: var(--sw-quiet); }

        /* The sky caption sits over falling rain, and a lit stroke crossing a
           letter would drop it to about 3.5:1. The halo puts the screen colour
           back behind every glyph, so the caption is read against the panel and
           not against whatever drop happens to be passing. */
        .sw-panel-caption {
          font-family: var(--font-body);
          font-size: 11.5px;
          fill: var(--color-moonlight);
          stroke: var(--sw-screen);
          stroke-width: 3px;
          stroke-linejoin: round;
          paint-order: stroke fill;
        }
        .sw-panel-caption.is-ground {
          font-size: 10.5px;
          fill: var(--sw-quiet);
          stroke: none;
        }

        .sw-panel-reads-label {
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 0.16em;
          fill: var(--sw-quiet);
        }
        .sw-panel-reads {
          font-family: var(--font-hero);
          font-size: 14px;
          font-weight: 600;
          fill: var(--sw-acid);
        }
        .is-healed .sw-panel-reads { fill: var(--sw-leaf-text); }

        /* ---- rain ---- */
        .sw-drop { stroke-linecap: round; fill: none; }
        .sw-rain.is-poisoned .sw-drop {
          stroke: color-mix(in srgb, var(--sw-acid) 62%, transparent);
          stroke-width: 1.9;
        }
        .sw-rain.is-healed .sw-drop {
          stroke: color-mix(in srgb, var(--sw-leaf) 72%, var(--color-moonlight));
          stroke-width: 1.15;
          opacity: 0.72;
        }
        /* The lattice period and the travel distance are the same number, so
           the loop closes on itself and any frozen frame is a correct picture. */
        .sw-rain.is-poisoned { animation: sw-fall 1.15s linear infinite; }
        .sw-rain.is-healed { animation: sw-fall 2.1s linear infinite; }
        @keyframes sw-fall {
          from { transform: translateY(0); }
          to   { transform: translateY(${RAIN_PERIOD}px); }
        }

        /* ---- ground ---- */
        .sw-soil { fill: color-mix(in srgb, var(--sw-acid) 9%, var(--color-void)); }
        .is-healed .sw-soil { fill: color-mix(in srgb, var(--sw-leaf) 11%, var(--color-void)); }
        .sw-soil-line {
          stroke: color-mix(in srgb, var(--sw-acid) 50%, transparent);
          stroke-width: 1.2;
        }
        .is-healed .sw-soil-line { stroke: color-mix(in srgb, var(--sw-leaf) 62%, transparent); }
        .sw-stem {
          fill: none;
          stroke: color-mix(in srgb, var(--sw-acid) 55%, var(--color-mist));
          stroke-width: 2;
          stroke-linecap: round;
        }
        .is-healed .sw-stem { stroke: color-mix(in srgb, var(--sw-leaf) 80%, var(--color-moonlight)); }
        .sw-leaf { fill: color-mix(in srgb, var(--sw-leaf) 62%, transparent); }

        /* ---- the crossing ---- */
        .sw-cross {
          fill: none;
          stroke: var(--sw-leaf-text);
          stroke-width: 1.8;
        }
        .sw-drop-line {
          fill: none;
          stroke: color-mix(in srgb, var(--sw-leaf) 60%, transparent);
          stroke-width: 1.3;
          stroke-dasharray: 5 5;
        }
        .sw-head { fill: var(--sw-leaf-text); }
        .sw-cross-label {
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 0.16em;
          fill: var(--sw-quiet);
        }

        .sw-solve-well {
          fill: var(--sw-screen);
          stroke: var(--sw-leaf-text);
          stroke-width: 1.6;
        }
        .sw-solve-stem {
          fill: none;
          stroke: var(--sw-leaf-text);
          stroke-width: 1.6;
          stroke-linecap: round;
        }
        .sw-solve-leaf { fill: var(--sw-leaf-text); }

        .sw-plate-body {
          fill: var(--sw-screen);
          stroke: color-mix(in srgb, var(--sw-leaf) 58%, transparent);
          stroke-width: 1;
        }
        .sw-plate-text {
          font-family: var(--font-mono);
          font-size: ${PLATE_FONT}px;
          letter-spacing: 0.11em;
          fill: var(--color-moonlight);
        }

        /* ---- the rejected readout ---- */
        .sw-reject-rule { stroke: var(--sw-edge); stroke-width: 1; }
        .sw-reject-rail { fill: color-mix(in srgb, var(--color-mist) 26%, transparent); }
        .sw-reject-fill { fill: color-mix(in srgb, var(--color-mist) 52%, transparent); }
        .sw-reject-strike {
          stroke: color-mix(in srgb, var(--sw-acid) 78%, transparent);
          stroke-width: 1.8;
          stroke-linecap: round;
        }
        .sw-reject-label,
        .sw-lane-label {
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.16em;
          fill: var(--sw-quiet);
        }
        /* The rule is the diagram's thesis, so it is the one lane label that
           takes the growth accent rather than the quiet grey. */
        .sw-rule-label {
          font-family: var(--font-mono);
          font-size: 9.5px;
          /* Tracked tighter than the other lane labels: it shares its row with
             the trigger plate, and the plate is the one that must not move. */
          letter-spacing: 0.1em;
          fill: var(--sw-leaf-text);
        }

        /* ---- zone cards ---- */
        .sw-zones {
          list-style: none;
          margin: 0.35rem 0 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1rem;
        }
        .sw-zone-card {
          border: 1px solid var(--sw-edge);
          border-radius: 12px;
          background: var(--sw-screen);
          padding: 1.1rem 1.2rem;
          display: grid;
          gap: 0.4rem;
          align-content: start;
          min-width: 0;
        }
        .sw-zone-card.is-poisoned { border-left: 3px solid color-mix(in srgb, var(--sw-acid) 70%, transparent); }
        .sw-zone-card.is-healed { border-left: 3px solid var(--sw-leaf); }
        .sw-zone-kicker {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0;
          font-size: 0.71rem;
          letter-spacing: 0.14em;
          color: var(--sw-quiet);
        }
        .sw-zone-dot {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          background: var(--sw-acid);
          flex: none;
        }
        .is-healed .sw-zone-dot { background: var(--sw-leaf); }
        .sw-zone-name {
          font-family: var(--font-hero);
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0;
          color: var(--color-moonlight);
        }
        .sw-zone-detail {
          margin: 0.1rem 0 0;
          font-size: 0.86rem;
          line-height: 1.6;
          color: var(--sw-quiet);
        }
        .sw-zone-reads {
          margin: 0.4rem 0 0;
          padding-top: 0.65rem;
          border-top: 1px solid var(--sw-edge);
          font-size: 0.86rem;
          line-height: 1.5;
          color: var(--color-moonlight);
        }
        .sw-zone-reads-label {
          display: block;
          font-size: 0.68rem;
          letter-spacing: 0.16em;
          margin-bottom: 0.15rem;
          color: var(--sw-acid);
        }
        .is-healed .sw-zone-reads-label { color: var(--sw-leaf-text); }

        /* ---- trigger and rejected option ---- */
        .sw-splits {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1rem;
        }
        .sw-split {
          border: 1px solid var(--sw-edge);
          border-radius: 12px;
          background: var(--sw-screen);
          padding: 1.1rem 1.2rem;
          display: grid;
          gap: 0.4rem;
          align-content: start;
        }
        .sw-split.is-trigger { border-left: 3px solid var(--sw-leaf); }
        .sw-split.is-reject { border-left: 3px solid color-mix(in srgb, var(--color-mist) 60%, transparent); }
        .sw-split-tag {
          margin: 0;
          font-size: 0.71rem;
          letter-spacing: 0.14em;
          color: var(--sw-leaf-text);
        }
        .sw-split.is-reject .sw-split-tag { color: var(--sw-quiet); }
        .sw-split-name {
          font-family: var(--font-hero);
          font-size: 1.02rem;
          font-weight: 600;
          margin: 0;
          color: var(--color-moonlight);
        }
        /* The rejected readout is struck through in the drawing; it is struck
           through here too, and it also says so in words above it. */
        .sw-struck {
          text-decoration: line-through;
          text-decoration-thickness: 2px;
          text-decoration-color: color-mix(in srgb, var(--sw-acid) 80%, transparent);
          color: var(--sw-quiet);
        }
        .sw-split-body {
          margin: 0.1rem 0 0;
          font-size: 0.86rem;
          line-height: 1.6;
          color: var(--sw-quiet);
        }

        /* ---- 2 · the weathers ---- */
        .sw-thesis {
          margin: 0;
          max-width: 54rem;
          font-size: 0.95rem;
          line-height: 1.65;
          color: var(--color-moonlight);
        }
        .sw-weathers {
          list-style: none;
          margin: 0.35rem 0 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
          gap: 1rem;
        }
        .sw-weather {
          border: 1px solid var(--sw-edge);
          border-radius: 12px;
          background: var(--sw-screen);
          padding: 1rem 1.1rem 1.15rem;
          display: grid;
          gap: 0.35rem;
          align-content: start;
          min-width: 0;
        }
        .sw-weather.is-signal { box-shadow: inset 0 3px 0 var(--sw-leaf); }
        .sw-weather.is-hazard { box-shadow: inset 0 3px 0 color-mix(in srgb, var(--sw-acid) 72%, transparent); }
        .sw-glyph-well {
          border: 1px solid var(--sw-edge);
          border-radius: 9px;
          background: color-mix(in srgb, var(--color-moonlight) 3%, var(--sw-screen));
          padding: 0.55rem 0.7rem;
          margin-bottom: 0.3rem;
          display: flex;
          justify-content: center;
        }
        .sw-glyph { display: block; width: 100%; max-width: 7.5rem; height: auto; }
        .sw-glyph-cloud { fill: color-mix(in srgb, var(--color-mist) 42%, transparent); }
        .sw-glyph-drop {
          stroke: var(--sw-acid);
          stroke-width: 2.2;
          stroke-linecap: round;
        }
        /* Clean rain is the one weather drawn in the growth accent, because it
           is the one that means growth. Its name says so too, and its card
           prints the same fact as words. */
        .sw-is-clean-rain .sw-glyph-drop { stroke: var(--sw-leaf-text); stroke-width: 1.6; }
        .sw-glyph-stem {
          fill: none;
          stroke: var(--sw-leaf-text);
          stroke-width: 1.8;
          stroke-linecap: round;
        }
        .sw-glyph-leaf { fill: var(--sw-leaf); }
        .sw-glyph-stroke {
          fill: none;
          stroke: var(--sw-acid);
          stroke-width: 1.9;
          stroke-linecap: round;
        }
        .sw-glyph-dune { fill: color-mix(in srgb, var(--sw-acid) 30%, transparent); }
        .sw-glyph-grain {
          stroke: var(--sw-acid);
          stroke-width: 1.8;
          stroke-linecap: round;
        }

        .sw-weather-kicker {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: baseline;
          gap: 0.25rem 0.8rem;
          margin: 0;
          font-size: 0.70rem;
          letter-spacing: 0.14em;
          color: var(--sw-quiet);
        }
        .sw-weather-index { color: var(--sw-leaf-text); }
        .sw-weather.is-hazard .sw-weather-index { color: var(--sw-acid); }
        .sw-weather-name {
          font-family: var(--font-hero);
          font-size: 1.05rem;
          font-weight: 600;
          margin: 0;
          color: var(--color-moonlight);
        }
        .sw-weather-where {
          margin: 0;
          font-size: 0.70rem;
          letter-spacing: 0.1em;
          color: var(--sw-quiet);
        }
        .sw-weather-body {
          margin: 0.15rem 0 0;
          font-size: 0.82rem;
          line-height: 1.55;
          color: var(--sw-quiet);
        }
        /* Every card carries this line, because every sky answers the trigger.
           It is the roster's whole argument, so it is set at full strength. */
        .sw-weather-after {
          margin: 0.4rem 0 0;
          padding-top: 0.6rem;
          border-top: 1px solid var(--sw-edge);
          font-size: 0.82rem;
          line-height: 1.5;
          color: var(--color-moonlight);
        }
        .sw-weather-after-label {
          display: block;
          font-size: 0.68rem;
          letter-spacing: 0.16em;
          margin-bottom: 0.15rem;
          color: var(--sw-leaf-text);
        }

        .sw-weather-scored {
          margin: 0.35rem 0 0;
          padding-top: 0.6rem;
          border-top: 1px solid var(--sw-edge);
          font-size: 0.8rem;
          font-style: italic;
          line-height: 1.5;
          color: var(--color-moonlight);
        }
        .sw-weather-scored-label {
          display: block;
          font-size: 0.68rem;
          letter-spacing: 0.16em;
          font-style: normal;
          margin-bottom: 0.15rem;
          color: var(--sw-leaf-text);
        }

        /* ---- 3 · the credit ---- */
        .sw-credit {
          border: 1px solid var(--sw-edge);
          border-left: 3px solid var(--sw-leaf);
          border-radius: 12px;
          background: var(--sw-screen);
          padding: 1.15rem 1.25rem;
          display: grid;
          gap: 0.5rem;
        }
        .sw-credit-tag {
          margin: 0;
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          color: var(--sw-leaf-text);
        }
        .sw-credit-body {
          margin: 0;
          font-size: 0.88rem;
          line-height: 1.65;
          color: var(--color-moonlight);
        }
        .sw-credit-pointer {
          margin: 0.25rem 0 0;
          display: grid;
          gap: 0.2rem;
          font-size: 0.78rem;
          line-height: 1.5;
          color: var(--sw-quiet);
        }
        .sw-credit-pointer a {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          color: var(--sw-leaf-text);
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        /* ---- responsive ---- */
        @media (max-width: 860px) {
          .sw-zones,
          .sw-splits { grid-template-columns: minmax(0, 1fr); }
        }
        @media (max-width: 700px) {
          .sw-frame { padding: 0.9rem; }
        }

        /* The rain is the only motion in here, and it stops dead. Its lattice
           shares a period with the travel, so the frame it freezes on is the
           same picture as any other. */
        @media (prefers-reduced-motion: reduce) {
          .sw-rain { animation: none !important; }
          .sw *, .sw *::before, .sw *::after {
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}
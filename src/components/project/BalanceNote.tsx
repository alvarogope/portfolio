import {
  RUN_COMPLETE,
  adaptiveCurve,
  adaptiveLevers,
  balancingIntro,
  balancingPillars,
  bonusCriteria,
  rewardSplit,
  soloReach,
  targetBand,
  type BalanceChart,
} from "@/content/break-in-overview";
import { getRole } from "@/content/break-in-roles";

/**
 * Break-In — the balancing note: the three rules the heist is tuned against,
 * each with the one small chart that turns it from a claim into an argument.
 *
 *   01 SOLO CEILING — four bars against the run they have to finish. All four
 *      are the same height and all four fall the same distance short, which is
 *      the whole point: the gap is designed, not a shortfall.
 *   02 ADAPTIVE RESPONSE — two lines. Pressure applied climbs with team
 *      performance; felt tension, the value actually being held, stays flat
 *      inside a target band. The flat line is the design goal; the rising one
 *      is what it costs.
 *   03 REWARD SPLIT — one bar, two segments. The shared base is deliberately
 *      the bigger half.
 *
 * This is a design note in my own voice — I was Lead Designer on a team of
 * four — so the console carries that credit in its header rather than leaving
 * the reader to infer whose reasoning this is.
 *
 * Static: no state, no client JS. Geometry here, data in `break-in-overview`.
 */

/* ---- 01 · solo ceiling -------------------------------------------------- */

const S_W = 440;
const S_H = 206;
const S_L = 48;
const S_R = 428;
const S_BASE = 152;
const S_TOP = 28;
const S_SLOT = (S_R - S_L) / soloReach.length;
const S_BAR_W = 52;

function wrap(text: string, max: number): string[] {
  const lines: string[] = [];
  let current = "";
  for (const word of text.split(" ")) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > max && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function SoloCeilingChart() {
  return (
    <svg
      className="bn-chart"
      viewBox={`0 0 ${S_W} ${S_H}`}
      role="img"
      aria-labelledby="bn-solo-title bn-solo-desc"
    >
      <title id="bn-solo-title">How far each role gets on its own</title>
      <desc id="bn-solo-desc">
        Four bars, one per role, each reaching about a quarter of the height of the line marked run
        complete. The Insider is stopped because they cannot see patrols, the Hacker because they are
        blind below ground, the Lockpicker because they have no vault password, and the Vaultsnatcher
        because the lasers are still live. Every role falls the same distance short.
      </desc>

      {/* The line every bar is measured against. */}
      <line className="bn-ceiling" x1={S_L - 8} y1={S_TOP} x2={S_R + 6} y2={S_TOP} />
      <text className="bn-axis-num" x={S_L - 12} y={S_TOP + 4} textAnchor="end">
        {Math.round(RUN_COMPLETE * 100)}%
      </text>
      <text className="bn-ceiling-label" x={S_R + 6} y={S_TOP - 8} textAnchor="end">
        RUN COMPLETE
      </text>

      <line className="bn-baseline" x1={S_L - 8} y1={S_BASE} x2={S_R + 6} y2={S_BASE} />

      {soloReach.map((entry, i) => {
        const h = entry.reach * (S_BASE - S_TOP);
        const bx = S_L + i * S_SLOT + (S_SLOT - S_BAR_W) / 2;
        const by = S_BASE - h;
        const cx = bx + S_BAR_W / 2;
        return (
          <g key={entry.role} className="bn-bar-group">
            {/* The unreachable remainder, drawn faintly so the gap has a shape. */}
            <rect className="bn-bar-ghost" x={bx} y={S_TOP} width={S_BAR_W} height={by - S_TOP} />
            <rect className="bn-bar" x={bx} y={by} width={S_BAR_W} height={h} />
            <text className="bn-bar-value" x={cx} y={by - 7} textAnchor="middle">
              {Math.round(entry.reach * 100)}%
            </text>
            <text className="bn-bar-name" x={cx} y={S_BASE + 18} textAnchor="middle">
              {getRole(entry.role).name.replace(/^The /, "")}
            </text>
            {wrap(entry.wall, 13).map((line, li) => (
              <text
                key={line}
                className="bn-bar-wall"
                x={cx}
                y={S_BASE + 32 + li * 11}
                textAnchor="middle"
              >
                {line}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

/* ---- 02 · adaptive response --------------------------------------------- */

const A_W = 440;
const A_H = 196;
const A_L = 52;
const A_R = 424;
const A_BASE = 150;
const A_TOP = 26;

const ax = (x: number) => A_L + x * (A_R - A_L);
const ay = (v: number) => A_BASE - v * (A_BASE - A_TOP);

const line = (key: "pressure" | "felt") =>
  adaptiveCurve.map((p) => `${ax(p.x).toFixed(1)} ${ay(p[key]).toFixed(1)}`).join(" L ");

function AdaptiveChart() {
  const bandTop = ay(targetBand.high);
  const bandBottom = ay(targetBand.low);

  return (
    <svg
      className="bn-chart"
      viewBox={`0 0 ${A_W} ${A_H}`}
      role="img"
      aria-labelledby="bn-adapt-title bn-adapt-desc"
    >
      <title id="bn-adapt-title">Pressure rises so that felt tension does not move</title>
      <desc id="bn-adapt-desc">
        Two lines plotted against team performance, from struggling on the left to a clean run on the
        right. Pressure applied — patrol density, camera coverage, puzzle length, guard alert radius —
        climbs steeply from roughly a fifth to nearly full. Felt tension stays almost flat at around
        seven tenths, inside a shaded target band. The rising line is the cost of holding the flat one.
      </desc>

      <rect
        className="bn-band"
        x={A_L}
        y={bandTop}
        width={A_R - A_L}
        height={bandBottom - bandTop}
      />
      <text className="bn-band-label" x={A_L + 6} y={A_TOP + 16}>
        TARGET TENSION BAND
      </text>

      <line className="bn-baseline" x1={A_L} y1={A_BASE} x2={A_R} y2={A_BASE} />
      <line className="bn-baseline" x1={A_L} y1={A_TOP} x2={A_L} y2={A_BASE} />

      <text className="bn-axis-num" x={A_L - 10} y={A_TOP + 4} textAnchor="end">
        High
      </text>
      <text className="bn-axis-num" x={A_L - 10} y={A_BASE + 4} textAnchor="end">
        Low
      </text>

      <path className="bn-line is-felt" d={`M ${line("felt")}`} />
      <path className="bn-line is-pressure" d={`M ${line("pressure")}`} />

      {adaptiveCurve.map((p) => (
        <circle key={p.x} className="bn-dot" cx={ax(p.x)} cy={ay(p.pressure)} r={3.4} />
      ))}

      <text className="bn-axis-end" x={A_L} y={A_BASE + 18}>
        STRUGGLING
      </text>
      <text className="bn-axis-end" x={A_R} y={A_BASE + 18} textAnchor="end">
        CLEAN RUN
      </text>
      <text className="bn-axis-title" x={(A_L + A_R) / 2} y={A_BASE + 36} textAnchor="middle">
        TEAM PERFORMANCE
      </text>
    </svg>
  );
}

/* ---- 03 · reward split -------------------------------------------------- */

const R_W = 440;
const R_H = 104;
const R_L = 20;
const R_TRACK = 400;
const R_BAR_Y = 42;
const R_BAR_H = 44;

/** Prefix sum over the shares: each slice starts where the ones before it end. */
const rewardSegments = rewardSplit.map((slice, i) => ({
  ...slice,
  x: R_L + rewardSplit.slice(0, i).reduce((sum, s) => sum + s.share, 0) * R_TRACK,
  w: slice.share * R_TRACK,
  shared: i === 0,
}));

function RewardChart() {
  const segments = rewardSegments;

  return (
    <svg
      className="bn-chart"
      viewBox={`0 0 ${R_W} ${R_H}`}
      role="img"
      aria-labelledby="bn-reward-title bn-reward-desc"
    >
      <title id="bn-reward-title">How a run&rsquo;s take is paid out</title>
      <desc id="bn-reward-desc">
        A single bar representing the whole payout, split in two. Seventy per cent is a team share
        divided evenly across all four players; thirty per cent is an individual role bonus. The
        shared base is deliberately the larger of the two.
      </desc>

      {segments.map((seg) => (
        <g key={seg.label}>
          <rect
            className={seg.shared ? "bn-slice is-shared" : "bn-slice"}
            x={seg.x}
            y={R_BAR_Y}
            width={seg.w}
            height={R_BAR_H}
          />
          <text className="bn-slice-label" x={seg.x + seg.w / 2} y={R_BAR_Y - 12} textAnchor="middle">
            {seg.label.toUpperCase()}
          </text>
          <text className="bn-slice-value" x={seg.x + seg.w / 2} y={R_BAR_Y + 28} textAnchor="middle">
            {Math.round(seg.share * 100)}%
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ---- pillars ------------------------------------------------------------ */

function Chart({ id }: { id: BalanceChart }) {
  if (id === "solo-ceiling") return <SoloCeilingChart />;
  if (id === "adaptive") return <AdaptiveChart />;
  return <RewardChart />;
}

/** The small print under a chart: legends and criteria, as HTML so the type
    never inherits the plot's scale. */
function ChartFoot({ id }: { id: BalanceChart }) {
  if (id === "adaptive") {
    return (
      <>
        <ul className="bn-legend">
          <li className="mono bn-legend-item">
            <span className="bn-swatch is-pressure" aria-hidden="true" />
            Pressure applied
          </li>
          <li className="mono bn-legend-item">
            <span className="bn-swatch is-felt" aria-hidden="true" />
            Felt tension
          </li>
        </ul>
        <ul className="bn-pills" aria-label="What the game turns up">
          {adaptiveLevers.map((lever) => (
            <li key={lever} className="mono bn-pill">
              {lever}
            </li>
          ))}
        </ul>
      </>
    );
  }

  if (id === "rewards") {
    return (
      <>
        <dl className="bn-split">
          {rewardSplit.map((slice) => (
            <div key={slice.label} className="bn-split-row">
              <dt className="mono bn-split-term">{slice.label}</dt>
              <dd className="bn-split-gloss">{slice.gloss}</dd>
            </div>
          ))}
        </dl>
        <ul className="bn-pills" aria-label="What the role bonus pays for">
          {bonusCriteria.map((criterion) => (
            <li key={criterion} className="mono bn-pill">
              {criterion}
            </li>
          ))}
        </ul>
      </>
    );
  }

  return null;
}

/* ---- the console -------------------------------------------------------- */

export default function BalanceNote() {
  return (
    <div className="bn">
      <div className="panel bn-console">
        <div className="bn-console-head">
          <p className="mono bn-console-tag">Design note · balancing</p>
          {/* No credit line. The attribution is §02s, on the phase clock,
              and printing it again here was the second render of the same
              block rather than a second fact. */}
          <p className="mono bn-console-meta">{balancingPillars.length} tuning rules</p>
        </div>

        <p className="bn-intro">{balancingIntro}</p>

        <ol className="bn-pillars">
          {balancingPillars.map((pillar) => (
            <li key={pillar.id} className="bn-pillar">
              <div className="bn-pillar-text">
                <p className="mono bn-pillar-index">{pillar.index}</p>
                {/* h3, not h4: this console has no band headings above it, so
                    the pillars sit directly under the section's h2. */}
                <h3 className="bn-pillar-title">{pillar.title}</h3>
                <p className="bn-pillar-body">{pillar.body}</p>
              </div>

              <figure className="bn-figure">
                <div className="bn-screen">
                  <Chart id={pillar.id} />
                </div>
                <ChartFoot id={pillar.id} />
                <figcaption className="bn-caption">{pillar.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ol>
      </div>

      <style>{`
        .bn {
          --bn-amber: var(--color-silver);
          /* Same lift as the other two consoles on this route: raw mist is
             4.63:1 on a screen, the blend clears 7.9:1. */
          --bn-quiet: color-mix(in srgb, var(--color-mist) 55%, var(--color-moonlight));
          --bn-edge: color-mix(in srgb, var(--color-mist) 30%, transparent);
          --bn-screen: var(--color-void);
        }

        @media (min-width: 900px) {
          .bn {
            width: min(92vw, 82rem);
            margin-left: calc(50% - min(46vw, 41rem));
            margin-right: calc(50% - min(46vw, 41rem));
          }
        }

        .bn-console {
          border: 1px solid var(--bn-edge);
          padding: 1.25rem;
          display: grid;
          gap: 1.5rem;
        }
        .bn-console-head {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: baseline;
          gap: 0.5rem 1.5rem;
          padding-bottom: 0.85rem;
          border-bottom: 1px solid var(--bn-edge);
        }
        .bn-console-tag { margin: 0; font-size: 0.72rem; color: var(--bn-amber); }
        .bn-console-meta { margin: 0; font-size: 0.68rem; color: var(--bn-quiet); }

        .bn-intro {
          margin: 0;
          max-width: 46rem;
          font-size: 0.95rem;
          line-height: 1.7;
          color: var(--color-moonlight);
        }

        .bn-pillars {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 1px;
          background: var(--bn-edge);
          border: 1px solid var(--bn-edge);
        }
        /* Text left, evidence right. The chart column is fixed-ish so all three
           plots render at the same scale down the page and can be compared. */
        .bn-pillar {
          background: var(--bn-screen);
          padding: 1.35rem 1.25rem;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 26rem);
          gap: 1.5rem 2rem;
          align-items: start;
        }
        .bn-pillar-text { display: grid; gap: 0.45rem; align-content: start; }
        .bn-pillar-index {
          margin: 0;
          font-size: 0.66rem;
          letter-spacing: 0.2em;
          color: var(--bn-amber);
        }
        .bn-pillar-title {
          font-family: var(--font-hero);
          font-size: 1.1rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          margin: 0;
          color: var(--color-moonlight);
        }
        .bn-pillar-body {
          margin: 0;
          max-width: 34rem;
          font-size: 0.88rem;
          line-height: 1.65;
          color: var(--bn-quiet);
        }

        .bn-figure { margin: 0; display: grid; gap: 0.7rem; }
        .bn-screen {
          background: color-mix(in srgb, var(--color-moonlight) 3%, var(--bn-screen));
          border: 1px solid var(--bn-edge);
          padding: 0.6rem 0.5rem;
        }
        .bn-chart { display: block; width: 100%; height: auto; }
        .bn-caption {
          margin: 0;
          font-size: 0.76rem;
          line-height: 1.55;
          color: var(--bn-quiet);
        }

        /* ---- shared plot furniture ---- */
        .bn-baseline {
          stroke: color-mix(in srgb, var(--color-mist) 48%, transparent);
          stroke-width: 1;
        }
        .bn-axis-num {
          font-family: var(--font-mono);
          font-size: 10px;
          fill: var(--bn-quiet);
        }
        .bn-axis-end {
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.12em;
          fill: var(--bn-quiet);
        }
        .bn-axis-title {
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 0.22em;
          fill: color-mix(in srgb, var(--color-mist) 40%, var(--color-moonlight));
        }

        /* ---- 01 · solo ceiling ---- */
        .bn-ceiling {
          stroke: var(--color-moonlight);
          stroke-width: 1.2;
          stroke-dasharray: 5 4;
          opacity: 0.85;
        }
        .bn-ceiling-label {
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.16em;
          fill: var(--color-moonlight);
        }
        .bn-bar-ghost {
          fill: color-mix(in srgb, var(--color-mist) 9%, transparent);
          stroke: color-mix(in srgb, var(--color-mist) 22%, transparent);
          stroke-width: 1;
          stroke-dasharray: 3 4;
        }
        .bn-bar { fill: var(--bn-amber); }
        .bn-bar-value {
          font-family: var(--font-mono);
          font-size: 11px;
          fill: var(--bn-amber);
        }
        .bn-bar-name {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.04em;
          fill: var(--color-moonlight);
        }
        .bn-bar-wall {
          font-family: var(--font-mono);
          font-size: 8.5px;
          fill: var(--bn-quiet);
        }

        /* ---- 02 · adaptive response ---- */
        .bn-band { fill: color-mix(in srgb, var(--color-emerald) 14%, transparent); }
        .bn-band-label {
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 0.18em;
          fill: color-mix(in srgb, var(--color-emerald) 82%, var(--color-moonlight));
        }
        .bn-line { fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
        .bn-line.is-pressure { stroke: var(--bn-amber); }
        .bn-line.is-felt {
          stroke: color-mix(in srgb, var(--color-emerald) 84%, var(--color-moonlight));
          stroke-width: 1.8;
          stroke-dasharray: 6 5;
        }
        .bn-dot { fill: var(--bn-amber); }

        .bn-legend {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem 1.1rem;
        }
        .bn-legend-item {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.66rem;
          color: var(--bn-quiet);
        }
        .bn-swatch { width: 16px; height: 2px; flex: none; }
        .bn-swatch.is-pressure { background: var(--bn-amber); }
        .bn-swatch.is-felt {
          background: repeating-linear-gradient(
            to right,
            color-mix(in srgb, var(--color-emerald) 84%, var(--color-moonlight)) 0 6px,
            transparent 6px 10px
          );
        }

        /* ---- 03 · reward split ---- */
        .bn-slice {
          fill: color-mix(in srgb, var(--bn-amber) 16%, transparent);
          stroke: var(--bn-amber);
          stroke-width: 1.2;
        }
        .bn-slice.is-shared { fill: color-mix(in srgb, var(--bn-amber) 48%, transparent); }
        .bn-slice-label {
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.16em;
          fill: var(--bn-amber);
        }
        .bn-slice-value {
          font-family: var(--font-mono);
          font-size: 16px;
          fill: var(--color-moonlight);
        }

        .bn-split { margin: 0; display: grid; gap: 0.45rem; }
        .bn-split-row { display: grid; gap: 0.1rem; }
        .bn-split-term {
          margin: 0;
          font-size: 0.64rem;
          letter-spacing: 0.1em;
          color: var(--bn-amber);
        }
        .bn-split-gloss {
          margin: 0;
          font-size: 0.78rem;
          line-height: 1.5;
          color: var(--bn-quiet);
        }

        /* ---- pills ---- */
        .bn-pills {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 0.3rem;
        }
        .bn-pill {
          font-size: 0.62rem;
          padding: 0.2rem 0.42rem;
          border: 1px solid color-mix(in srgb, var(--color-mist) 34%, transparent);
          color: var(--bn-quiet);
          line-height: 1.35;
        }

        /* ---- responsive ----
           Below the two-column band the chart goes under the argument it
           supports rather than beside it; the plots keep their aspect and the
           HTML furniture keeps its type size. */
        @media (max-width: 900px) {
          .bn-pillar { grid-template-columns: minmax(0, 1fr); }
        }
        @media (max-width: 700px) {
          .bn-console { padding: 0.9rem; }
          .bn-pillar { padding: 1.1rem 0.85rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .bn *, .bn *::before, .bn *::after {
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}

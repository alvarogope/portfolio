import {
  audioCredit,
  clockAudio,
  clockRailSummary,
  cues,
  cuesNote,
  detectionPointer,
  scoreNote,
  scoreStates,
  thesis,
  type AudioCue,
} from "@/content/break-in-audio";
import { getRole } from "@/content/break-in-roles";

/**
 * Break-In — the audio console: what the game sounds like, and why that is
 * the coordination system.
 *
 * DELIBERATELY COMPACT. This is a DIRECTION credit, not a composer showcase —
 * there is no player, no waveform and no track list, because there are no
 * tracks of mine to play. One bezel, three bands, and the credit first:
 *
 *   1. THE CREDIT, at the top rather than the bottom. The distinction between
 *      directing audio and writing it has to be made before the reader forms
 *      an impression, not corrected afterwards.
 *   2. THE SCORE — three gears as three cards, each stating the game state
 *      that triggers it, then the tick rail underneath. The rail is the one
 *      drawing in the section and it earns its place: "audio is the timer" is
 *      a claim about a shape over eight minutes, which is exactly what a rail
 *      draws and a paragraph does not.
 *   3. THE CUES — the action roster as a real table, because "action → sound →
 *      what it tells the team" is tabular data and the third column is the
 *      whole argument.
 *
 * THE RAIL IS DERIVED, NOT DRAWN. Its mark sits at `clockAudio.markAt / runMinutes`
 * of the width, both read from `break-in-overview`'s constants, so changing
 * the run length or the shift point moves the mark, the tick density and the
 * labels together. Nothing in the geometry below is a magic number tied to
 * "eight minutes" or "three".
 *
 * COLOUR IS NEVER THE ONLY SIGNAL. Each score state prints its trigger as
 * text, the loud half of the rail is labelled in words as well as drawn taller
 * and denser, and the warning cues carry a "Warning" tag rather than only an
 * accent. A server component — no state, and the only transition is a hover
 * hairline that reduced-motion turns off.
 */

/* ---- the tick rail ------------------------------------------------------
   viewBox units. The rail is a fixed 1000-unit box scaled to its container,
   so ticks stay hairline-crisp at any width. */
const VB_W = 1000;
const VB_H = 120;
const PAD_X = 8;
const BASE_Y = 84;
const RAIL_W = VB_W - PAD_X * 2;

/** Ticks per minute before and after the mark. Density is part of the claim. */
const QUIET_PER_MIN = 2;
const LOUD_PER_MIN = 4;
const QUIET_H = 9;
const LOUD_H = 20;

interface Tick {
  x: number;
  h: number;
  loud: boolean;
}

function buildTicks(runMinutes: number, markAt: number): Tick[] {
  const x = (m: number) => PAD_X + (m / runMinutes) * RAIL_W;
  const ticks: Tick[] = [];

  const quietStep = 1 / QUIET_PER_MIN;
  for (let m = 0; m < markAt - 1e-6; m += quietStep) {
    ticks.push({ x: x(m), h: QUIET_H, loud: false });
  }

  const loudStep = 1 / LOUD_PER_MIN;
  for (let m = markAt; m <= runMinutes + 1e-6; m += loudStep) {
    ticks.push({ x: x(m), h: LOUD_H, loud: true });
  }
  return ticks;
}

function ClockRail() {
  const { runMinutes, markAt, markLabel, endLabel, quietLabel, loudLabel } = clockAudio;
  const ticks = buildTicks(runMinutes, markAt);
  const markX = PAD_X + (markAt / runMinutes) * RAIL_W;
  const quietMidX = PAD_X + (markAt / 2 / runMinutes) * RAIL_W;
  const loudMidX = PAD_X + ((markAt + runMinutes) / 2 / runMinutes) * RAIL_W;

  return (
    <svg
      className="ba-rail"
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      role="img"
      aria-labelledby="ba-rail-title ba-rail-desc"
      focusable="false"
    >
      <title id="ba-rail-title">The clock, as the player hears it</title>
      <desc id="ba-rail-desc">{clockRailSummary}</desc>

      {/* the two halves, named in words above the rail */}
      <text className="ba-rail-zone" x={quietMidX} y={26} textAnchor="middle">
        {quietLabel}
      </text>
      <text className="ba-rail-zone is-loud" x={loudMidX} y={26} textAnchor="middle">
        {loudLabel}
      </text>

      {/* the baseline */}
      <line className="ba-rail-line" x1={PAD_X} y1={BASE_Y} x2={VB_W - PAD_X} y2={BASE_Y} />

      {/* the ticks */}
      <g>
        {ticks.map((t, i) => (
          <line
            key={i}
            className={`ba-tick${t.loud ? " is-loud" : ""}`}
            x1={t.x}
            y1={BASE_Y}
            x2={t.x}
            y2={BASE_Y - t.h}
          />
        ))}
      </g>

      {/* the shift mark */}
      <line className="ba-rail-mark" x1={markX} y1={BASE_Y - 34} x2={markX} y2={BASE_Y + 10} />
      <text className="ba-rail-marktext" x={markX} y={BASE_Y - 40} textAnchor="middle">
        {markLabel} · score shifts
      </text>

      {/* the ends */}
      <text className="ba-rail-end" x={PAD_X} y={BASE_Y + 26} textAnchor="start">
        00:00
      </text>
      <text className="ba-rail-end is-fail" x={VB_W - PAD_X} y={BASE_Y + 26} textAnchor="end">
        {endLabel} · hard fail
      </text>
    </svg>
  );
}

/* ---- the cue table ------------------------------------------------------ */

/** The seat a cue belongs to, named. `any` is not a role, so it is not looked up. */
function cueOwner(cue: AudioCue): string {
  return cue.role === "any" ? "Any role" : getRole(cue.role).name;
}

export default function BreakInAudio() {
  return (
    <div className="ba">
      <div className="ba-console">
        <div className="ba-console-head">
          <p className="mono ba-console-tag">Audio console</p>
          <p className="mono ba-console-meta">
            {scoreStates.length} score states · {cues.length} action cues
          </p>
        </div>

        {/* ---- 1 · the credit, first ---- */}
        <aside className="ba-credit">
          <p className="mono ba-credit-tag">
            {audioCredit.role} · {audioCredit.team} · {audioCredit.headline}
          </p>
          <p className="ba-credit-body">{audioCredit.body}</p>
        </aside>

        {/* ---- the thesis ---- */}
        <section className="ba-band" aria-labelledby="ba-thesis-title">
          <p className="mono ba-band-meta">{thesis.tag}</p>
          <h3 id="ba-thesis-title" className="ba-thesis-line">
            {thesis.line}
          </h3>
          <p className="ba-prose">{thesis.body}</p>
        </section>

        {/* ---- 2 · the score, and the clock under it ---- */}
        <section className="ba-band" aria-labelledby="ba-score-title">
          <div className="ba-band-head">
            <h3 id="ba-score-title" className="ba-band-title">
              A score wired to game state
            </h3>
            <p className="mono ba-band-meta">Three gears</p>
          </div>

          <ol className="ba-states">
            {scoreStates.map((s) => (
              <li key={s.id} className={`ba-state${s.id === "chase" ? " is-alert" : ""}`}>
                <p className="mono ba-state-index">{s.index}</p>
                <h4 className="ba-state-name">{s.name}</h4>
                <p className="ba-state-trigger">
                  <span className="mono ba-key">Trigger</span>
                  {s.trigger}
                </p>
                <p className="ba-state-sound">{s.sound}</p>
                <p className="ba-state-reads">
                  <span className="mono ba-key is-read">Reads as</span>
                  {s.reads}
                </p>
              </li>
            ))}
          </ol>

          <p className="ba-prose">{scoreNote}</p>

          <div className="ba-clock">
            <div className="ba-band-head">
              <h4 className="ba-clock-title">{clockAudio.label}</h4>
              <p className="mono ba-band-meta">Diegetic time pressure</p>
            </div>
            <p className="ba-prose">{clockAudio.body}</p>
            <div className="ba-rail-screen">
              <ClockRail />
            </div>
            <p className="ba-prose ba-prose--why">
              <span className="mono ba-key">Why</span>
              {clockAudio.why}
            </p>
          </div>
        </section>

        {/* ---- 3 · the cues ---- */}
        <section className="ba-band" aria-labelledby="ba-cues-title">
          <div className="ba-band-head">
            <h3 id="ba-cues-title" className="ba-band-title">
              Every action announces itself
            </h3>
            <p className="mono ba-band-meta">The communication layer</p>
          </div>

          <div className="ba-table-scroll" tabIndex={0} role="region" aria-label="Action audio cues">
            <table className="ba-table">
              <caption className="sr-only">
                Each audio cue in Break-In: the action, the role it belongs to, what it sounds
                like, and what a teammate who did not perform it learns from hearing it.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Action</th>
                  <th scope="col">Sound</th>
                  <th scope="col">What it tells the team</th>
                </tr>
              </thead>
              <tbody>
                {cues.map((c) => (
                  <tr key={c.id} className={c.warning ? "is-warning" : undefined}>
                    <th scope="row">
                      <span className="ba-cue-action">{c.action}</span>
                      <span className="mono ba-cue-role">{cueOwner(c)}</span>
                      {c.warning && <span className="mono ba-cue-warn">Warning</span>}
                    </th>
                    <td className="ba-cue-sound">{c.sound}</td>
                    <td className="ba-cue-tells">{c.tells}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="ba-prose">{cuesNote}</p>
        </section>

        {/* ---- the crossing back to the detection model ---- */}
        <aside className="ba-pointer">
          <p className="mono ba-pointer-tag">{detectionPointer.label}</p>
          <p className="ba-pointer-body">{detectionPointer.body}</p>
        </aside>
      </div>

      <style>{`
        .ba {
          /* Same scoping as the other Break-In consoles: this route reads
             --color-silver as its amber (#E5B54D). The accent is the token. */
          --ba-amber: var(--color-silver);
          /* Raw mist is 4.63:1 on the void. The blend clears 7.9:1 everywhere
             the small mono is set, which is the floor this page holds. */
          --ba-quiet: color-mix(in srgb, var(--color-mist) 55%, var(--color-moonlight));
          --ba-edge: color-mix(in srgb, var(--color-mist) 30%, transparent);
          --ba-screen: var(--color-void);
          --ba-alert: color-mix(in srgb, var(--color-scarlet) 45%, var(--ba-amber));
        }

        .ba-console {
          border: 1px solid var(--ba-edge);
          padding: 1.25rem;
          display: grid;
          gap: 1.75rem;
        }
        .ba-console-head {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: baseline;
          gap: 0.5rem 1.5rem;
          padding-bottom: 0.85rem;
          border-bottom: 1px solid var(--ba-edge);
        }
        .ba-console-tag { margin: 0; font-size: 0.72rem; color: var(--ba-amber); }
        .ba-console-meta { margin: 0; font-size: 0.68rem; color: var(--ba-quiet); }

        .ba-band { display: grid; gap: 0.85rem; }
        .ba-band-head {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: baseline;
          gap: 0.35rem 1.5rem;
        }
        .ba-band-title {
          font-family: var(--font-hero);
          font-size: 1rem;
          letter-spacing: 0.04em;
          margin: 0;
          color: var(--color-moonlight);
        }
        .ba-band-meta { margin: 0; font-size: 0.66rem; color: var(--ba-quiet); }

        .ba-prose {
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.7;
          color: var(--color-moonlight);
          max-width: 60rem;
        }
        .ba-prose--why { color: var(--ba-quiet); }

        .ba-key {
          display: inline-block;
          margin-right: 0.5rem;
          font-size: 0.6rem;
          letter-spacing: 0.14em;
          color: var(--ba-amber);
        }
        .ba-key.is-read { color: var(--ba-quiet); }

        /* ---- 1 · the credit ----
           Amber left rule, matching the detection console's design note: on
           this page that rule means "this is me talking about the work". */
        .ba-credit {
          border: 1px solid var(--ba-edge);
          border-left: 2px solid var(--ba-amber);
          background: var(--ba-screen);
          padding: 1.1rem 1.2rem;
          display: grid;
          gap: 0.5rem;
        }
        .ba-credit-tag {
          margin: 0;
          font-size: 0.66rem;
          letter-spacing: 0.14em;
          color: var(--ba-amber);
        }
        .ba-credit-body {
          margin: 0;
          font-size: 0.86rem;
          line-height: 1.65;
          color: var(--color-moonlight);
        }

        .ba-thesis-line {
          font-family: var(--font-hero);
          font-size: clamp(1.1rem, 0.95rem + 0.8vw, 1.5rem);
          line-height: 1.3;
          letter-spacing: 0.01em;
          margin: 0;
          color: var(--color-moonlight);
          max-width: 40rem;
        }

        /* ---- 2 · the three gears ---- */
        .ba-states {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0.75rem;
        }
        .ba-state {
          border: 1px solid var(--ba-edge);
          border-top: 2px solid color-mix(in srgb, var(--ba-amber) 55%, transparent);
          background: var(--ba-screen);
          padding: 0.95rem 1rem 1.05rem;
          display: grid;
          gap: 0.45rem;
          align-content: start;
          transition: border-color 160ms ease;
        }
        .ba-state:hover { border-color: color-mix(in srgb, var(--ba-amber) 45%, transparent); }
        .ba-state.is-alert { border-top-color: var(--ba-alert); }
        .ba-state-index {
          margin: 0;
          font-size: 0.6rem;
          letter-spacing: 0.16em;
          color: var(--ba-quiet);
        }
        .ba-state.is-alert .ba-state-index { color: var(--ba-alert); }
        .ba-state-name {
          font-family: var(--font-hero);
          font-size: 0.98rem;
          font-weight: 600;
          margin: 0;
          color: var(--color-moonlight);
        }
        .ba-state-trigger,
        .ba-state-sound,
        .ba-state-reads {
          margin: 0;
          font-size: 0.84rem;
          line-height: 1.6;
        }
        .ba-state-trigger { color: var(--color-moonlight); }
        .ba-state-sound { color: var(--ba-quiet); }
        .ba-state-reads {
          padding-top: 0.55rem;
          border-top: 1px solid var(--ba-edge);
          color: var(--color-moonlight);
        }

        /* ---- the clock rail ---- */
        .ba-clock {
          border: 1px solid var(--ba-edge);
          padding: 1rem 1.1rem 1.1rem;
          display: grid;
          gap: 0.75rem;
        }
        .ba-clock-title {
          font-family: var(--font-hero);
          font-size: 0.95rem;
          letter-spacing: 0.03em;
          margin: 0;
          color: var(--color-moonlight);
        }
        .ba-rail-screen {
          background: var(--ba-screen);
          border: 1px solid var(--ba-edge);
          padding: 0.5rem 0.6rem;
          overflow-x: auto;
          overscroll-behavior-x: contain;
        }
        .ba-rail { display: block; width: 100%; min-width: 30rem; height: auto; }

        .ba-rail-line { stroke: var(--ba-edge); stroke-width: 1.5; }
        .ba-tick {
          stroke: color-mix(in srgb, var(--ba-quiet) 70%, transparent);
          stroke-width: 2;
        }
        .ba-tick.is-loud { stroke: var(--ba-amber); stroke-width: 2.6; }
        .ba-rail-mark {
          stroke: var(--ba-amber);
          stroke-width: 1.5;
          stroke-dasharray: 4 3;
        }
        .ba-rail-zone {
          font-family: var(--font-mono);
          font-size: 17px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          fill: var(--ba-quiet);
        }
        .ba-rail-zone.is-loud { fill: var(--ba-amber); }
        .ba-rail-marktext {
          font-family: var(--font-mono);
          font-size: 17px;
          letter-spacing: 0.08em;
          fill: var(--ba-amber);
        }
        .ba-rail-end {
          font-family: var(--font-mono);
          font-size: 17px;
          letter-spacing: 0.08em;
          fill: var(--ba-quiet);
        }
        .ba-rail-end.is-fail { fill: color-mix(in srgb, var(--color-scarlet) 74%, var(--color-moonlight)); }

        /* ---- 3 · the cue table ---- */
        .ba-table-scroll { overflow-x: auto; overscroll-behavior-x: contain; }
        .ba-table-scroll:focus-visible {
          outline: 2px solid var(--color-lunar-gold);
          outline-offset: 2px;
        }
        .ba-table {
          width: 100%;
          min-width: 44rem;
          border-collapse: collapse;
          text-align: left;
        }
        .ba-table thead th {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          font-weight: 400;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ba-quiet);
          padding: 0.6rem 0.9rem;
          border-bottom: 1px solid var(--ba-edge);
          background: var(--ba-screen);
        }
        .ba-table tbody th,
        .ba-table tbody td {
          padding: 0.8rem 0.9rem;
          border-bottom: 1px solid var(--ba-edge);
          vertical-align: top;
          font-size: 0.85rem;
          line-height: 1.6;
          font-weight: 400;
        }
        .ba-table tbody th { display: grid; gap: 0.25rem; align-content: start; }
        .ba-cue-action { color: var(--color-moonlight); }
        .ba-cue-role {
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          color: var(--ba-quiet);
        }
        .ba-cue-warn {
          justify-self: start;
          margin-top: 0.15rem;
          padding: 0.08rem 0.4rem;
          border: 1px solid color-mix(in srgb, var(--ba-alert) 60%, transparent);
          font-size: 0.55rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--ba-alert);
        }
        .ba-cue-sound { color: var(--ba-quiet); }
        .ba-cue-tells { color: var(--color-moonlight); }
        .ba-table tbody tr.is-warning th { border-left: 2px solid var(--ba-alert); padding-left: 0.75rem; }

        /* ---- the crossing ---- */
        .ba-pointer {
          border: 1px solid var(--ba-edge);
          border-left: 2px solid color-mix(in srgb, var(--ba-quiet) 55%, transparent);
          padding: 0.95rem 1.1rem;
          display: grid;
          gap: 0.4rem;
        }
        .ba-pointer-tag {
          margin: 0;
          font-size: 0.64rem;
          letter-spacing: 0.14em;
          color: var(--ba-quiet);
        }
        .ba-pointer-body {
          margin: 0;
          font-size: 0.84rem;
          line-height: 1.65;
          color: var(--ba-quiet);
        }

        /* ---- responsive ---- */
        @media (max-width: 860px) {
          .ba-states { grid-template-columns: minmax(0, 1fr); }
        }
        @media (max-width: 560px) {
          .ba-console { padding: 1rem 0.85rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ba-state { transition: none; }
        }
      `}</style>
    </div>
  );
}

import {
  RUN_MINUTES,
  clockLabel,
  clockMarks,
  heistPhases,
  loopSummary,
  gradeTiers,
  gradingNote,
  loseConditions,
  outcomeNote,
  outcomeThesis,
  phaseLevelNote,
  teamNote,
  winConditions,
  type HeistPhase,
} from "@/content/break-in-overview";
import { getRole } from "@/content/break-in-roles";

/**
 * Break-In — the run console: eight minutes, four phases, one outcome.
 *
 * This is the TEMPORAL view of the heist, and it is deliberately not the level
 * flowchart further down the page. That one is a floor plan: which spaces, in
 * which order, with which route splits. This one has no rooms in it at all —
 * it is a clock with objectives laid on it, and its whole argument is a shape
 * the floor plan cannot draw: phase 03 runs *underneath* phase 02 rather than
 * after it, so the team is solving two loot paths with four players at the same
 * time. `phaseLevelNote` says that relationship out loud on the page, so the
 * reader is never left to work out why there are four phases and five stages.
 *
 * Three bands in one bezel, the same instrument language as the level console:
 *
 *   1. THE CLOCK — a ruler from 00:00 to 08:00 with the phases drawn as blocks
 *      at their real windows, on two lanes. Widths are minutes; nothing is
 *      spaced for looks, which is why phase 02 is the widest thing on screen.
 *   2. THE PHASE PANELS — four columns expanding each block into who is doing
 *      what, the tasks, and the risk/reward decision the phase is built around.
 *   3. THE OUTCOME — the win AND, the lose OR, and the convergence diagram that
 *      makes "one caught, everyone fails" a picture rather than a claim.
 *
 * Static: no state, no client JS. GEOMETRY lives here, the run lives in
 * `break-in-overview`.
 */

/* ---- clock geometry -----------------------------------------------------
   One scale for the whole diagram: x is minutes, always. Sized so the phase
   names sit at 15px and the small mono at 10px on a desktop band; below about
   980px it scrolls rather than shrinks, the same bargain the floor plan makes. */

const VB_W = 1160;
const VB_H = 316;
const PAD_X = 30;
const TRACK_W = VB_W - PAD_X * 2;

const MARK_LABEL_Y = 18;
const MARK_NOTE_Y = 31;
const RULER_Y = 44;
const TICK_MINOR = 6;
const TICK_MAJOR = 11;

const MAIN_Y = 74;
const PAR_Y = 200;
const BLOCK_H = 96;
const GAP = 18;
const PAD_IN = 14;

const MAIN_MID = MAIN_Y + BLOCK_H / 2;
const PAR_MID = PAR_Y + BLOCK_H / 2;

/** Minutes to user units. The only conversion in the file. */
function x(minutes: number): number {
  return PAD_X + (minutes / RUN_MINUTES) * TRACK_W;
}

function phaseBox(phase: HeistPhase) {
  const left = x(phase.start) + GAP / 2;
  const right = x(phase.end) - GAP / 2;
  const y = phase.lane === "main" ? MAIN_Y : PAR_Y;
  return { x: left, y, w: right - left, h: BLOCK_H, right, cx: (left + right) / 2, cy: y + BLOCK_H / 2 };
}

/** Greedy wrap to a character budget. The budget is derived from the box width. */
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

const pct = (n: number) => `${(n * 100).toFixed(2)}%`;

const mainPhases = heistPhases.filter((p) => p.lane === "main");
const parallelPhase = heistPhases.find((p) => p.lane === "parallel");

/* ---- 1 · the clock ------------------------------------------------------ */

function PhaseBlock({ phase }: { phase: HeistPhase }) {
  const box = phaseBox(phase);
  const inner = box.w - PAD_IN * 2;
  /* ~5.9 user units per character at 10.5px in the body face — a deliberately
     pessimistic budget, so a line of caps or long words still clears the right
     padding. Two lines is the cap: the panels below carry the phase in full, so
     a third line here would be duplication set in worse type. */
  const lines = wrap(phase.objective, Math.max(18, Math.floor(inner / 5.9))).slice(0, 2);

  return (
    <g className={`hl-block is-${phase.lane}`}>
      <rect className="hl-block-body" x={box.x} y={box.y} width={box.w} height={box.h} />
      <rect
        className="hl-block-frame"
        x={box.x + 0.5}
        y={box.y + 0.5}
        width={box.w - 1}
        height={box.h - 1}
      />
      {/* The accent spine on the left edge: where the phase starts, to the minute. */}
      <rect className="hl-block-edge" x={box.x} y={box.y} width={2.5} height={box.h} />

      <text className="hl-block-index" x={box.x + PAD_IN} y={box.y + 21}>
        PHASE {String(phase.order).padStart(2, "0")}
      </text>
      <text
        className="hl-block-window"
        x={box.x + box.w - PAD_IN}
        y={box.y + 21}
        textAnchor="end"
      >
        {clockLabel(phase.start)} – {clockLabel(phase.end)}
      </text>

      <text className="hl-block-name" x={box.x + PAD_IN} y={box.y + 45}>
        {phase.name}
      </text>

      {lines.map((line, i) => (
        <text key={line} className="hl-block-obj" x={box.x + PAD_IN} y={box.y + 63 + i * 13}>
          {line}
        </text>
      ))}

      {/* Pressure, as the width of the bar. Same 0–1 scale the panels read. */}
      <rect className="hl-block-rail" x={box.x + PAD_IN} y={box.y + 85} width={inner} height={3} />
      <rect
        className="hl-block-fill"
        x={box.x + PAD_IN}
        y={box.y + 85}
        width={inner * phase.pressure}
        height={3}
      />
    </g>
  );
}

function ClockTrack() {
  const minutes = Array.from({ length: RUN_MINUTES + 1 }, (_, i) => i);
  const markAt = new Set(clockMarks.map((m) => m.at));

  const p1 = phaseBox(heistPhases[0]);
  const par = parallelPhase ? phaseBox(parallelPhase) : null;
  const last = phaseBox(heistPhases[heistPhases.length - 1]);

  return (
    <svg
      className="hl-track"
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      role="img"
      aria-labelledby="hl-track-title hl-track-desc"
    >
      <title id="hl-track-title">The four phases of an eight-minute Break-In run</title>
      <desc id="hl-track-desc">{loopSummary}</desc>

      <defs>
        <linearGradient id="hl-clock" x1="0" y1="0" x2="1" y2="0">
          <stop className="hl-clock-a" offset="0%" />
          <stop className="hl-clock-b" offset="55%" />
          <stop className="hl-clock-c" offset="100%" />
        </linearGradient>
        <marker
          id="hl-arrow"
          viewBox="0 0 8 8"
          refX="7.4"
          refY="4"
          markerWidth="8"
          markerHeight="8"
          markerUnits="userSpaceOnUse"
          orient="auto"
        >
          <path className="hl-arrowhead" d="M 0 0 L 8 4 L 0 8 Z" />
        </marker>
      </defs>

      {/* ---- the ruler: green through amber to red, the same scale the page's
              alarm rail runs on, so the clock and the alarm read as one idea. */}
      <line className="hl-ruler" x1={PAD_X} y1={RULER_Y} x2={x(RUN_MINUTES)} y2={RULER_Y} />
      {minutes.map((m) => (
        <line
          key={m}
          className={markAt.has(m) ? "hl-tick is-major" : "hl-tick"}
          x1={x(m)}
          y1={RULER_Y}
          x2={x(m)}
          y2={RULER_Y + (markAt.has(m) ? TICK_MAJOR : TICK_MINOR)}
        />
      ))}

      {clockMarks.map((mark) => {
        const anchor = mark.at === 0 ? "start" : mark.at >= RUN_MINUTES ? "end" : "middle";
        return (
          <g key={mark.label} className={mark.emphasis ? "hl-mark is-end" : "hl-mark"}>
            <text className="hl-mark-label" x={x(mark.at)} y={MARK_LABEL_Y} textAnchor={anchor}>
              {mark.label}
            </text>
            <text className="hl-mark-note" x={x(mark.at)} y={MARK_NOTE_Y} textAnchor={anchor}>
              {mark.note}
            </text>
          </g>
        );
      })}

      {/* The wall at 08:00, drawn the full height of the diagram because it
          applies to every lane at once. */}
      <line className="hl-deadline" x1={x(RUN_MINUTES)} y1={RULER_Y} x2={x(RUN_MINUTES)} y2={VB_H - 8} />

      {/* ---- the spine: phase to phase, straight through the gap ---- */}
      {mainPhases.slice(0, -1).map((phase, i) => {
        const a = phaseBox(phase);
        const b = phaseBox(mainPhases[i + 1]);
        return (
          <path
            key={`spine-${phase.id}`}
            className="hl-link"
            d={`M ${a.right} ${MAIN_MID} H ${b.x}`}
            markerEnd="url(#hl-arrow)"
          />
        );
      })}

      {/* ---- the parallel path: opened out of phase 01, closing into phase 04.
              Dashed and right-angled, so it reads as a branch off the spine
              rather than a step in it. */}
      {par && (
        <>
          <path
            className="hl-link is-branch"
            d={`M ${p1.cx} ${MAIN_Y + BLOCK_H} V ${PAR_MID} H ${par.x}`}
            markerEnd="url(#hl-arrow)"
          />
          <path
            className="hl-link is-branch"
            d={`M ${par.right} ${PAR_MID} H ${last.cx} V ${MAIN_Y + BLOCK_H}`}
            markerEnd="url(#hl-arrow)"
          />
          <text className="hl-lane-note" x={PAD_X + 2} y={PAR_MID - 4}>
            SECOND LOOT PATH
          </text>
          <text className="hl-lane-sub" x={PAD_X + 2} y={PAR_MID + 10}>
            runs alongside phase 02
          </text>
        </>
      )}

      {heistPhases.map((phase) => (
        <PhaseBlock key={phase.id} phase={phase} />
      ))}
    </svg>
  );
}

/* ---- 2 · the phase panels ---------------------------------------------- */

function PhaseField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="hl-field">
      <p className="mono hl-field-label">{label}</p>
      {children}
    </div>
  );
}

function PhasePanels() {
  return (
    <ol className="hl-phases">
      {heistPhases.map((phase) => (
        <li key={phase.id} className={`hl-phase is-${phase.lane}`}>
          <p className="mono hl-phase-kicker">
            <span>Phase {String(phase.order).padStart(2, "0")}</span>
            <span className="hl-phase-mech">{phase.mechanic}</span>
          </p>
          <h4 className="hl-phase-name">{phase.name}</h4>
          <p className="mono hl-phase-window">
            <span className="hl-phase-clock">
              {clockLabel(phase.start)} – {clockLabel(phase.end)}
            </span>
            <span className={phase.lane === "parallel" ? "hl-lane-tag is-par" : "hl-lane-tag"}>
              {phase.lane === "parallel" ? "Parallel path" : "Spine"}
            </span>
          </p>

          <PhaseField label="Objective">
            <p className="hl-objective">{phase.objective}</p>
          </PhaseField>

          <PhaseField label="On the clock">
            <ul className="hl-beats">
              {phase.beats.map((beat) => (
                <li key={beat.text} className="hl-beat">
                  <span className="mono hl-beat-role">
                    {beat.role === "all" ? "All four" : getRole(beat.role).name}
                  </span>
                  <span className="hl-beat-text">{beat.text}</span>
                </li>
              ))}
            </ul>
          </PhaseField>

          <PhaseField label="Tasks">
            <ul className="hl-tasks">
              {phase.tasks.map((task) => (
                <li key={task} className="mono hl-task">
                  {task}
                </li>
              ))}
            </ul>
          </PhaseField>

          <div className="hl-phase-foot">
            <p className="mono hl-risk-label">Risk / reward</p>
            <p className="hl-risk">{phase.risk}</p>
            <div className="hl-meter" aria-hidden="true">
              <span className="hl-meter-fill" style={{ width: pct(phase.pressure) }} />
            </div>
            <p className="mono hl-meter-read">
              Pressure · {Math.round(phase.pressure * 100)}%
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ---- 3 · the outcome ----------------------------------------------------
   Four rows onto one bus onto one node. Right-angle conduit, the same drawing
   language the role graph's wires use — this is the same claim those wires
   make, resolved into a single result. */

const G_W = 500;
const G_H = 196;
const G_ROW_Y = [28, 66, 104, 142];
const G_LABEL_X = 6;
const G_LABEL_W = 172;
const G_BUS_X = 232;
const G_MID = 100;
const G_OUT_X = 288;
const G_OUT_W = 206;

function ExtractionGate() {
  return (
    <svg
      className="hl-gate"
      viewBox={`0 0 ${G_W} ${G_H}`}
      role="img"
      aria-labelledby="hl-gate-title hl-gate-desc"
    >
      <title id="hl-gate-title">Collective extraction: all four players, or no win</title>
      <desc id="hl-gate-desc">
        Four rows, one per role, converge onto a single bus and then onto one result. The run only
        banks when every one of the four is clear of the building; a single player detected or still
        inside collapses the whole result to a loss.
      </desc>

      <defs>
        <marker
          id="hl-gate-arrow"
          viewBox="0 0 8 8"
          refX="7.4"
          refY="4"
          markerWidth="8"
          markerHeight="8"
          markerUnits="userSpaceOnUse"
          orient="auto"
        >
          <path className="hl-arrowhead" d="M 0 0 L 8 4 L 0 8 Z" />
        </marker>
      </defs>

      {[...Array(4)].map((_, i) => (
        <path
          key={`bus-${G_ROW_Y[i]}`}
          className="hl-gate-wire"
          d={`M ${G_LABEL_X + G_LABEL_W} ${G_ROW_Y[i]} H ${G_BUS_X} V ${G_MID}`}
        />
      ))}
      <path
        className="hl-gate-wire is-out"
        d={`M ${G_BUS_X} ${G_MID} H ${G_OUT_X}`}
        markerEnd="url(#hl-gate-arrow)"
      />
      <text className="hl-gate-join" x={G_BUS_X + 26} y={G_MID - 9} textAnchor="middle">
        AND
      </text>

      {[
        { id: "hacker" as const },
        { id: "insider" as const },
        { id: "lockpicker" as const },
        { id: "vaultsnatcher" as const },
      ].map((entry, i) => (
        <g key={entry.id} className="hl-gate-row">
          <rect
            className="hl-gate-chip"
            x={G_LABEL_X}
            y={G_ROW_Y[i] - 15}
            width={G_LABEL_W}
            height={30}
          />
          <text className="hl-gate-chip-label" x={G_LABEL_X + 12} y={G_ROW_Y[i] + 4}>
            {/* "The " is dropped so the four names and the OUT state never
                collide inside a 172-unit chip. */}
            {getRole(entry.id).name.replace(/^The /, "")}
          </text>
          <text
            className="hl-gate-chip-state"
            x={G_LABEL_X + G_LABEL_W - 12}
            y={G_ROW_Y[i] + 4}
            textAnchor="end"
          >
            OUT
          </text>
        </g>
      ))}

      <rect className="hl-gate-out" x={G_OUT_X} y={G_MID - 27} width={G_OUT_W} height={54} />
      <text className="hl-gate-out-label" x={G_OUT_X + G_OUT_W / 2} y={G_MID - 4} textAnchor="middle">
        ALL FOUR CLEAR
      </text>
      <text className="hl-gate-out-sub" x={G_OUT_X + G_OUT_W / 2} y={G_MID + 15} textAnchor="middle">
        RUN BANKED · INSIDE 08:00
      </text>
    </svg>
  );
}

function OutcomeBand() {
  return (
    <div className="hl-outcome">
      <div className="hl-gate-wrap">
        <ExtractionGate />
        <p className="hl-thesis">{outcomeThesis}</p>
      </div>

      <div className="hl-states">
        <section className="hl-state is-win">
          <p className="mono hl-state-tag">
            <span className="hl-state-dot" aria-hidden="true" />
            Win · all of
          </p>
          <ul className="hl-conditions">
            {winConditions.map((c) => (
              <li key={c.label} className="hl-condition">
                <span className="mono hl-condition-label">{c.label}</span>
                <span className="hl-condition-detail">{c.detail}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="hl-state is-lose">
          <p className="mono hl-state-tag">
            <span className="hl-state-dot" aria-hidden="true" />
            Lose · either of
          </p>
          <ul className="hl-conditions">
            {loseConditions.map((c) => (
              <li key={c.label} className="hl-condition">
                <span className="mono hl-condition-label">{c.label}</span>
                <span className="hl-condition-detail">{c.detail}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <p className="hl-outcome-note">{outcomeNote}</p>

      {/* The grade. It belongs here rather than in a section of its own: it is
          the second half of the same question the two cards above answer, and
          it only applies once they have been answered yes. */}
      <section className="hl-grades">
        <div className="hl-grades-head">
          <h4 className="hl-grades-title">Then it is graded</h4>
          <p className="mono hl-grades-meta">On the take · once everyone is out</p>
        </div>
        <ol className="hl-grade-row">
          {gradeTiers.map((tier) => (
            <li key={tier.id} className={`hl-grade is-${tier.id}`}>
              <p className="hl-grade-mark">{tier.grade}</p>
              <p className="mono hl-grade-range">{tier.label}</p>
              <div className="hl-grade-bar" aria-hidden="true">
                <span className="hl-grade-fill" style={{ width: pct(tier.weight) }} />
              </div>
              <p className="hl-grade-body">{tier.body}</p>
            </li>
          ))}
        </ol>
        <p className="hl-grades-note">{gradingNote}</p>
      </section>
    </div>
  );
}

/* ---- the console ------------------------------------------------------- */

export default function HeistLoop() {
  return (
    <div className="hl">
      {/* Attribution first, before anything it could be mistaken for. */}
      <aside className="hl-credit" aria-label="Attribution">
        <p className="mono hl-credit-tag">{teamNote.headline}</p>
        <p className="hl-credit-role">
          My role on it: <strong>{teamNote.role}</strong>
        </p>
        <p className="hl-credit-body">{teamNote.body}</p>
      </aside>

      <div className="panel hl-console">
        <div className="hl-console-head">
          <p className="mono hl-console-tag">Run structure · 08:00 on the clock</p>
          <p className="mono hl-console-meta">
            {heistPhases.length} phases · 2 loot paths · 1 collective outcome
          </p>
        </div>

        {/* 1 — the clock */}
        <section className="hl-band">
          <div className="hl-band-head">
            <h3 className="hl-band-title">The core loop, in time</h3>
            <p className="mono hl-band-meta">Blocks are drawn at their real minute windows</p>
          </div>
          <div
            className="hl-screen hl-track-scroll"
            role="group"
            aria-label="Phase timeline, scrolls horizontally"
            tabIndex={0}
          >
            <ClockTrack />
          </div>
          <p className="mono mono-note hl-scroll-note">Scroll the clock sideways to follow the run →</p>
          <p className="hl-band-note">{phaseLevelNote}</p>
        </section>

        {/* 2 — the phases in full */}
        <section className="hl-band">
          <div className="hl-band-head">
            <h3 className="hl-band-title">Phase breakdown</h3>
            <p className="mono hl-band-meta">Four phases · who does what, and what it costs</p>
          </div>
          <PhasePanels />
        </section>

        {/* 3 — how a run ends */}
        <section className="hl-band">
          <div className="hl-band-head">
            <h3 className="hl-band-title">How a run ends</h3>
            <p className="mono hl-band-meta">Win is an AND · lose is an OR</p>
          </div>
          <OutcomeBand />
        </section>
      </div>

      <style>{`
        .hl {
          /* This route scopes --color-silver to its amber (#E5B54D): the accent
             is the token, not a hex. 9.2:1 on the screens below. */
          --hl-amber: var(--color-silver);
          /* Mist is 4.63:1 on a screen and 4.2:1 on the bezel — at or under the
             bar. Blended toward moonlight the small mono clears AA everywhere:
             7.9:1 on a screen, 7.7:1 on the bezel. */
          --hl-quiet: color-mix(in srgb, var(--color-mist) 55%, var(--color-moonlight));
          --hl-edge: color-mix(in srgb, var(--color-mist) 30%, transparent);
          --hl-screen: var(--color-void);
          /* Scarlet is 4.59:1 on the void — over the bar but with nothing spare,
             so small text uses the lifted mix and the raw token is kept for
             rules, dots and frames. Emerald is 7.8:1 and needs no lift, but it
             is mixed the same way so the two cards match in weight. */
          --hl-fail: color-mix(in srgb, var(--color-scarlet) 74%, var(--color-moonlight));
          --hl-pass: color-mix(in srgb, var(--color-emerald) 84%, var(--color-moonlight));
          display: grid;
          gap: 1.75rem;
        }

        /* Same breakout as the role graph and the level console: the section
           column caps at 68rem, which is narrower than an eight-minute ruler
           wants. The parent is centred, so 50% minus half the target width puts
           this back on the viewport centre. */
        @media (min-width: 900px) {
          .hl {
            width: min(92vw, 82rem);
            margin-left: calc(50% - min(46vw, 41rem));
            margin-right: calc(50% - min(46vw, 41rem));
          }
        }

        /* ---- attribution ---- */
        .hl-credit {
          border: 1px solid var(--hl-edge);
          border-left: 2px solid var(--hl-amber);
          background: var(--color-nightfall);
          padding: 1.1rem 1.25rem;
          display: grid;
          gap: 0.45rem;
          max-width: 46rem;
        }
        .hl-credit-tag {
          margin: 0;
          font-size: 0.7rem;
          letter-spacing: 0.16em;
          color: var(--hl-amber);
        }
        .hl-credit-role {
          margin: 0;
          font-size: 0.95rem;
          color: var(--color-moonlight);
        }
        .hl-credit-role strong { font-weight: 600; color: var(--hl-amber); }
        .hl-credit-body {
          margin: 0;
          font-size: 0.88rem;
          line-height: 1.6;
          color: var(--hl-quiet);
        }

        /* ---- the bezel ---- */
        .hl-console {
          border: 1px solid var(--hl-edge);
          padding: 1.25rem;
          display: grid;
          gap: 1.75rem;
        }
        .hl-console-head {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: baseline;
          gap: 0.5rem 1.5rem;
          padding-bottom: 0.85rem;
          border-bottom: 1px solid var(--hl-edge);
        }
        .hl-console-tag { margin: 0; font-size: 0.72rem; color: var(--hl-amber); }
        .hl-console-meta { margin: 0; font-size: 0.68rem; color: var(--hl-quiet); }

        .hl-band { display: grid; gap: 0.75rem; }
        .hl-band-head {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: baseline;
          gap: 0.35rem 1.5rem;
        }
        .hl-band-title {
          font-family: var(--font-hero);
          font-size: 1rem;
          letter-spacing: 0.04em;
          margin: 0;
          color: var(--color-moonlight);
        }
        .hl-band-meta { margin: 0; font-size: 0.66rem; color: var(--hl-quiet); }
        .hl-band-note {
          margin: 0.35rem 0 0;
          max-width: 58rem;
          font-size: 0.86rem;
          line-height: 1.6;
          color: var(--color-moonlight);
        }

        .hl-screen {
          background: var(--hl-screen);
          border: 1px solid var(--hl-edge);
        }

        /* ---- 1 · clock track ----
           At 1040px the 1160-unit box renders at 0.90, which puts the smallest
           mono at 8.5px — the same floor the floor plan holds. Below that the
           ruler scrolls rather than shrinking: a clock whose windows have gone
           to 7px has stopped being a clock. */
        .hl-track-scroll { overflow-x: auto; overscroll-behavior-x: contain; }
        .hl-track-scroll:focus-visible {
          outline: 2px solid var(--color-lunar-gold);
          outline-offset: 2px;
        }
        .hl-track { display: block; width: 100%; min-width: 1040px; height: auto; }

        .hl-ruler { stroke: url(#hl-clock); stroke-width: 3; }
        .hl-clock-a { stop-color: var(--color-emerald); }
        .hl-clock-b { stop-color: var(--hl-amber); }
        .hl-clock-c { stop-color: var(--color-scarlet); }

        .hl-tick {
          stroke: color-mix(in srgb, var(--color-mist) 46%, transparent);
          stroke-width: 1;
        }
        .hl-tick.is-major {
          stroke: color-mix(in srgb, var(--color-mist) 78%, var(--color-moonlight));
          stroke-width: 1.4;
        }

        .hl-mark-label {
          font-family: var(--font-mono);
          font-size: 12px;
          letter-spacing: 0.06em;
          fill: var(--color-moonlight);
        }
        .hl-mark-note {
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.1em;
          fill: var(--hl-quiet);
        }
        .hl-mark.is-end .hl-mark-label { fill: var(--color-scarlet); }
        .hl-mark.is-end .hl-mark-note { fill: var(--hl-fail); }

        .hl-deadline {
          stroke: var(--color-scarlet);
          stroke-width: 1.2;
          stroke-dasharray: 3 5;
          opacity: 0.72;
        }

        .hl-link {
          fill: none;
          stroke: color-mix(in srgb, var(--color-mist) 72%, var(--color-moonlight));
          stroke-width: 1.5;
        }
        .hl-link.is-branch {
          stroke: color-mix(in srgb, var(--hl-amber) 62%, transparent);
          stroke-dasharray: 5 4;
        }
        .hl-arrowhead { fill: color-mix(in srgb, var(--color-mist) 72%, var(--color-moonlight)); }

        .hl-lane-note {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.16em;
          fill: var(--hl-amber);
        }
        .hl-lane-sub {
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.06em;
          fill: var(--hl-quiet);
        }

        .hl-block-body { fill: color-mix(in srgb, var(--color-moonlight) 4%, var(--hl-screen)); }
        .hl-block-frame { fill: none; stroke: var(--hl-edge); stroke-width: 1; }
        .hl-block-edge { fill: color-mix(in srgb, var(--color-mist) 62%, transparent); }

        .hl-block-index {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.16em;
          fill: var(--hl-amber);
        }
        .hl-block-window {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.06em;
          fill: var(--hl-quiet);
        }
        .hl-block-name {
          font-family: var(--font-hero);
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.02em;
          fill: var(--color-moonlight);
        }
        .hl-block-obj {
          font-family: var(--font-body);
          font-size: 10.5px;
          fill: color-mix(in srgb, var(--color-mist) 40%, var(--color-moonlight));
        }
        .hl-block-rail { fill: color-mix(in srgb, var(--color-mist) 26%, transparent); }
        .hl-block-fill { fill: var(--hl-amber); }

        /* The parallel block is dressed as a branch, not a step: amber edge,
           amber frame, so the eye pairs it with the dashed conduit that feeds
           it rather than with the three blocks on the spine. */
        .hl-block.is-parallel .hl-block-frame {
          stroke: color-mix(in srgb, var(--hl-amber) 45%, transparent);
        }
        .hl-block.is-parallel .hl-block-edge { fill: var(--hl-amber); }
        .hl-block.is-parallel .hl-block-body {
          fill: color-mix(in srgb, var(--hl-amber) 7%, var(--hl-screen));
        }

        .hl-scroll-note { display: none; margin: 0; font-size: 0.64rem; color: var(--hl-quiet); }
        @media (max-width: 1120px) { .hl-scroll-note { display: block; } }

        /* ---- 2 · phase panels ----
           One-pixel gaps over the edge colour: the dividers are the grid, not a
           border on each panel. */
        .hl-phases {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(${heistPhases.length}, minmax(0, 1fr));
          gap: 1px;
          background: var(--hl-edge);
          border: 1px solid var(--hl-edge);
        }
        .hl-phase {
          background: var(--hl-screen);
          padding: 1rem 0.9rem 1.1rem;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          min-width: 0;
        }
        .hl-phase.is-parallel {
          background:
            linear-gradient(180deg, color-mix(in srgb, var(--hl-amber) 7%, transparent), transparent 40%),
            var(--hl-screen);
        }

        .hl-phase-kicker {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: baseline;
          gap: 0.3rem 0.6rem;
          margin: 0;
          font-size: 0.62rem;
          color: var(--hl-quiet);
        }
        .hl-phase-mech { color: var(--color-moonlight); }
        .hl-phase-name {
          font-family: var(--font-hero);
          font-size: 1.05rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          margin: 0;
          color: var(--color-moonlight);
        }
        .hl-phase-window {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.4rem;
          margin: 0;
          font-size: 0.62rem;
        }
        .hl-phase-clock { color: var(--hl-amber); letter-spacing: 0.08em; }
        .hl-lane-tag {
          padding: 0.14rem 0.4rem;
          border: 1px solid color-mix(in srgb, var(--color-mist) 34%, transparent);
          color: var(--hl-quiet);
          line-height: 1.35;
        }
        .hl-lane-tag.is-par {
          border-color: color-mix(in srgb, var(--hl-amber) 46%, transparent);
          color: var(--hl-amber);
        }

        .hl-field { display: grid; gap: 0.25rem; }
        .hl-field-label { margin: 0; font-size: 0.58rem; color: var(--hl-amber); }
        .hl-objective {
          margin: 0;
          font-size: 0.84rem;
          line-height: 1.45;
          color: var(--color-moonlight);
        }

        .hl-beats { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5rem; }
        .hl-beat { display: grid; gap: 0.12rem; }
        .hl-beat-role {
          font-size: 0.6rem;
          letter-spacing: 0.1em;
          color: var(--hl-amber);
        }
        .hl-beat-text {
          font-size: 0.8rem;
          line-height: 1.5;
          color: var(--hl-quiet);
        }

        .hl-tasks {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 0.3rem;
        }
        .hl-task {
          font-size: 0.62rem;
          padding: 0.2rem 0.42rem;
          border: 1px solid color-mix(in srgb, var(--color-mist) 34%, transparent);
          color: var(--hl-quiet);
          line-height: 1.35;
        }

        /* Pinned to the bottom so the risk line and the meter agree across all
           four panels however long the beats above them run. */
        .hl-phase-foot {
          margin-top: auto;
          padding-top: 0.85rem;
          display: grid;
          gap: 0.35rem;
          border-top: 1px solid var(--hl-edge);
        }
        .hl-risk-label { margin: 0; font-size: 0.58rem; color: var(--hl-amber); }
        .hl-risk {
          margin: 0;
          font-size: 0.78rem;
          line-height: 1.5;
          color: var(--color-moonlight);
        }
        .hl-meter {
          margin-top: 0.2rem;
          height: 3px;
          background: color-mix(in srgb, var(--color-mist) 26%, transparent);
        }
        .hl-meter-fill { display: block; height: 100%; background: var(--hl-amber); }
        .hl-meter-read { margin: 0; font-size: 0.58rem; color: var(--hl-quiet); }

        /* ---- 3 · outcome ---- */
        .hl-outcome { display: grid; gap: 1.1rem; }

        .hl-gate-wrap {
          border: 1px solid var(--hl-edge);
          background: var(--hl-screen);
          padding: 1rem 1.1rem 1.15rem;
          display: grid;
          gap: 0.75rem;
          justify-items: center;
        }
        .hl-gate { display: block; width: 100%; max-width: 34rem; height: auto; }

        .hl-gate-wire {
          fill: none;
          stroke: color-mix(in srgb, var(--color-mist) 70%, var(--color-moonlight));
          stroke-width: 1.4;
        }
        .hl-gate-wire.is-out { stroke: var(--color-emerald); stroke-width: 2; }
        .hl-gate-join {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.18em;
          fill: var(--hl-amber);
        }
        .hl-gate-chip {
          fill: color-mix(in srgb, var(--color-moonlight) 4%, var(--hl-screen));
          stroke: var(--hl-edge);
          stroke-width: 1;
        }
        .hl-gate-chip-label {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.04em;
          fill: var(--color-moonlight);
        }
        .hl-gate-chip-state {
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.16em;
          fill: var(--color-emerald);
        }
        .hl-gate-out {
          fill: color-mix(in srgb, var(--color-emerald) 12%, var(--hl-screen));
          stroke: var(--color-emerald);
          stroke-width: 1.4;
        }
        .hl-gate-out-label {
          font-family: var(--font-mono);
          font-size: 13px;
          letter-spacing: 0.12em;
          fill: var(--color-moonlight);
        }
        .hl-gate-out-sub {
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.14em;
          fill: var(--hl-pass);
        }

        .hl-thesis {
          margin: 0;
          font-family: var(--font-hero);
          font-size: clamp(1.05rem, 0.9rem + 0.7vw, 1.45rem);
          letter-spacing: 0.02em;
          text-align: center;
          color: var(--color-moonlight);
        }

        .hl-states {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1px;
          background: var(--hl-edge);
          border: 1px solid var(--hl-edge);
        }
        .hl-state { background: var(--hl-screen); padding: 1rem 1.05rem 1.15rem; min-width: 0; }
        .hl-state.is-win { box-shadow: inset 2px 0 0 var(--color-emerald); }
        .hl-state.is-lose { box-shadow: inset 2px 0 0 var(--color-scarlet); }

        .hl-state-tag {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          margin: 0 0 0.75rem;
          font-size: 0.66rem;
          letter-spacing: 0.16em;
        }
        .hl-state-dot { width: 7px; height: 7px; border-radius: 50%; flex: none; }
        .hl-state.is-win .hl-state-tag { color: var(--hl-pass); }
        .hl-state.is-win .hl-state-dot { background: var(--color-emerald); }
        .hl-state.is-lose .hl-state-tag { color: var(--hl-fail); }
        .hl-state.is-lose .hl-state-dot { background: var(--color-scarlet); }

        .hl-conditions { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.7rem; }
        .hl-condition { display: grid; gap: 0.12rem; }
        .hl-condition-label {
          font-size: 0.68rem;
          letter-spacing: 0.06em;
          color: var(--color-moonlight);
        }
        .hl-condition-detail { font-size: 0.82rem; line-height: 1.5; color: var(--hl-quiet); }

        /* ---- the grade scale ----
           A row of four, running A down to F so it reads left to right as the
           take falling away. The bar under each mark is the same 0-1 scale the
           phase meters use, so the page has one language for "how much". */
        .hl-grades {
          display: grid;
          gap: 0.75rem;
          padding-top: 1rem;
          border-top: 1px solid var(--hl-edge);
        }
        .hl-grades-head {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: baseline;
          gap: 0.35rem 1.5rem;
        }
        .hl-grades-title {
          font-family: var(--font-hero);
          font-size: 0.95rem;
          letter-spacing: 0.04em;
          margin: 0;
          color: var(--color-moonlight);
        }
        .hl-grades-meta { margin: 0; font-size: 0.66rem; color: var(--hl-quiet); }

        .hl-grade-row {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1px;
          background: var(--hl-edge);
          border: 1px solid var(--hl-edge);
        }
        .hl-grade {
          background: var(--hl-screen);
          padding: 0.85rem 0.9rem 1rem;
          display: grid;
          gap: 0.3rem;
          align-content: start;
          min-width: 0;
        }
        .hl-grade-mark {
          margin: 0;
          font-family: var(--font-hero);
          font-size: 1.65rem;
          font-weight: 600;
          line-height: 1;
          color: var(--hl-amber);
        }
        /* F is the failure case, not the bottom of the scale, so it takes the
           fail colour rather than a fainter amber. */
        .hl-grade.is-f .hl-grade-mark { color: var(--hl-fail); }
        .hl-grade.is-f .hl-grade-fill { background: var(--color-scarlet); }
        .hl-grade-range {
          margin: 0;
          font-size: 0.64rem;
          letter-spacing: 0.04em;
          color: var(--color-moonlight);
        }
        .hl-grade-bar {
          margin: 0.15rem 0 0.1rem;
          height: 3px;
          background: color-mix(in srgb, var(--color-mist) 26%, transparent);
        }
        .hl-grade-fill { display: block; height: 100%; background: var(--hl-amber); }
        .hl-grade-body {
          margin: 0;
          font-size: 0.78rem;
          line-height: 1.5;
          color: var(--hl-quiet);
        }
        .hl-grades-note {
          margin: 0;
          max-width: 58rem;
          font-size: 0.84rem;
          line-height: 1.6;
          color: var(--color-moonlight);
        }

        .hl-outcome-note {
          margin: 0;
          padding-top: 0.9rem;
          border-top: 1px solid var(--hl-edge);
          max-width: 58rem;
          font-size: 0.86rem;
          line-height: 1.6;
          color: var(--color-moonlight);
        }

        /* ---- responsive ---- */
        @media (max-width: 1100px) {
          .hl-phases { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 700px) {
          .hl-console { padding: 0.9rem; }
          .hl-phases { grid-template-columns: minmax(0, 1fr); }
          .hl-states { grid-template-columns: minmax(0, 1fr); }
          .hl-grade-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .hl-gate-wrap { padding: 0.85rem 0.6rem 1rem; }
        }

        /* Nothing here animates, but the console inherits page-level
           transitions; this makes the intent explicit for anything added later. */
        @media (prefers-reduced-motion: reduce) {
          .hl *, .hl *::before, .hl *::after {
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}

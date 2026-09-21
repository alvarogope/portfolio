import {
  halves,
  levelCredit,
  loopNote,
  loopSteps,
  loopSummary,
  payoffPointer,
  puzzleNote,
  type LoopHalf,
} from "@/content/seeds-levels";

/**
 * Seeds of Tomorrow — the level design drawn rather than claimed.
 *
 * The "Level Designer" half of the credited role had no section: the four-beat
 * loop that IS the credited pacing work was buried inside `WeatherSystem` as
 * its third band. This component is that band promoted to a section of its own,
 * with the half each beat belongs to made visible — which is what turns four
 * boxes into a pacing argument.
 *
 *   1. THE LOOP — fight, recover, solve, and then the sky turns, with the
 *      return arc under the row. A rail across the top marks where the arc
 *      turns over from tension into restoration, so the rhythm is drawn and
 *      not only asserted. The payoff node keeps its emphasis, because the
 *      whole design claim is that the reward lands at the end of the arc.
 *   2. THE BEATS — the four steps in prose, tagged by half, with one pointer
 *      out of the payoff beat to the weather section that owns what the sky
 *      actually does. No sky is described here.
 *   3. THE PUZZLES & THE CREDIT — the level/puzzle bullet re-homed out of the
 *      contributions recap, and which part of a team of five this is.
 *
 * OWNERSHIP. The weather is not this section's. The payoff beat names the sky
 * turning and links down; the flip, the trigger and the five weathers stay in
 * the weather section. See docs/section-ownership-map.md, Gap G1.
 *
 * COLOUR IS NEVER LOAD-BEARING. Every beat prints its half as a word, and the
 * payoff prints "THE PAYOFF BEAT" rather than relying on its accent.
 */

const HALF_LABEL: Record<LoopHalf, string> = {
  tension: "Tension",
  restoration: "Restoration",
};

/* ---- the loop ------------------------------------------------------------
   Four beats and a return, drawn on one line. The return arc runs under the
   row rather than through it so the payoff node keeps a clean right edge — it
   is the beat everything else is arranged around. */

const LOOP_W = 1000;
const LOOP_H = 236;
const LOOP_PAD = 18;
const LOOP_NODE_H = 92;
const LOOP_GAP = 44;
const LOOP_NODE_W = (LOOP_W - LOOP_PAD * 2 - LOOP_GAP * (loopSteps.length - 1)) / loopSteps.length;
const LOOP_Y = 52;
const LOOP_MID = LOOP_Y + LOOP_NODE_H / 2;
const RETURN_Y = 194;
const RAIL_Y = 26;

function loopBox(i: number) {
  const x = LOOP_PAD + i * (LOOP_NODE_W + LOOP_GAP);
  return { x, w: LOOP_NODE_W, right: x + LOOP_NODE_W, cx: x + LOOP_NODE_W / 2 };
}

/** Where the arc turns over: the first index whose half differs from the first. */
const TURN_INDEX = loopSteps.findIndex((s) => s.half !== loopSteps[0].half);

function Loop() {
  const last = loopBox(loopSteps.length - 1);
  const first = loopBox(0);
  const turn = loopBox(TURN_INDEX);
  const seam = turn.x - LOOP_GAP / 2;

  return (
    <svg
      className="sl-loop"
      viewBox={`0 0 ${LOOP_W} ${LOOP_H}`}
      role="img"
      aria-labelledby="sl-loop-title sl-loop-desc"
    >
      <title id="sl-loop-title">The loop every place in the game is paced around</title>
      <desc id="sl-loop-desc">{loopSummary}</desc>

      <defs>
        <marker
          id="sl-loop-arrow"
          viewBox="0 0 8 8"
          refX="7.4"
          refY="4"
          markerWidth="8"
          markerHeight="8"
          markerUnits="userSpaceOnUse"
          orient="auto"
        >
          <path className="sl-head" d="M 0 0 L 8 4 L 0 8 Z" />
        </marker>
      </defs>

      {/* The rail: which half of the rhythm each stretch of the row is. */}
      <g className="sl-rail" aria-hidden="true">
        <path className="sl-rail-line" d={`M ${first.x} ${RAIL_Y} H ${seam - 6}`} />
        <path className="sl-rail-line is-restoration" d={`M ${seam + 6} ${RAIL_Y} H ${last.right}`} />
        <text className="sl-rail-label" x={first.x} y={RAIL_Y - 9}>
          {HALF_LABEL[loopSteps[0].half].toUpperCase()}
        </text>
        <text className="sl-rail-label is-restoration" x={seam + 6} y={RAIL_Y - 9}>
          {HALF_LABEL[loopSteps[TURN_INDEX].half].toUpperCase()}
        </text>
        <path className="sl-rail-seam" d={`M ${seam} ${RAIL_Y - 8} V ${LOOP_Y - 6}`} />
      </g>

      {loopSteps.map((step, i) => {
        const box = loopBox(i);
        return (
          <g key={step.id} className={`sl-loop-node${step.isPayoff ? " is-payoff" : ""}`}>
            <rect
              className="sl-loop-body"
              x={box.x}
              y={LOOP_Y}
              width={box.w}
              height={LOOP_NODE_H}
              rx={10}
            />
            <rect
              className="sl-loop-frame"
              x={box.x + 0.5}
              y={LOOP_Y + 0.5}
              width={box.w - 1}
              height={LOOP_NODE_H - 1}
              rx={10}
            />
            <text className="sl-loop-index" x={box.cx} y={LOOP_Y + 28} textAnchor="middle">
              {step.index}
              {step.isPayoff ? " · THE SKY TURNS" : ""}
            </text>
            <text className="sl-loop-name" x={box.cx} y={LOOP_Y + 56} textAnchor="middle">
              {step.name}
            </text>
            <text className="sl-loop-foot" x={box.cx} y={LOOP_Y + 76} textAnchor="middle">
              {step.isPayoff ? "THE PAYOFF BEAT" : HALF_LABEL[step.half].toUpperCase()}
            </text>
          </g>
        );
      })}

      {loopSteps.slice(0, -1).map((step, i) => (
        <path
          key={step.id}
          className="sl-loop-edge"
          d={`M ${loopBox(i).right + 8} ${LOOP_MID} H ${loopBox(i + 1).x - 12}`}
          markerEnd="url(#sl-loop-arrow)"
        />
      ))}

      {/* The return: out of the payoff, under the row, back to the fight. */}
      <path
        className="sl-loop-edge is-return"
        d={`M ${last.cx} ${LOOP_Y + LOOP_NODE_H} V ${RETURN_Y} H ${first.cx} V ${LOOP_Y + LOOP_NODE_H + 8}`}
        markerEnd="url(#sl-loop-arrow)"
      />
      <text className="sl-lane-label" x={LOOP_W - LOOP_PAD} y={RETURN_Y + 24} textAnchor="end">
        THEN THE NEXT PLACE
      </text>
    </svg>
  );
}

/* ---- the frame ----------------------------------------------------------- */

export default function SeedsLevelDesign() {
  return (
    <div className="sl">
      <div className="panel sl-frame">
        <div className="sl-frame-head">
          <p className="mono sl-frame-tag">Level design · the rhythm of a place</p>
          <p className="mono sl-frame-meta">
            {loopSteps.length} beats · {halves.length} halves · 1 return · Unity
          </p>
        </div>

        {/* 1 — the loop */}
        <section className="sl-band">
          <div className="sl-band-head">
            <h3 className="sl-band-title">The loop every place is built around</h3>
            <p className="mono sl-band-meta">Fight · recover · solve · the sky turns</p>
          </div>
          <p className="sl-thesis">{loopNote}</p>
          <div
            className="sl-screen sl-loop-scroll"
            role="group"
            aria-label="The loop of a place, scrolls horizontally"
            tabIndex={0}
          >
            <Loop />
          </div>
          <p className="mono mono-note sl-scroll-note">Scroll the loop sideways to follow it →</p>

          <ul className="sl-halves">
            {halves.map((h) => (
              <li key={h.id} className={`sl-half is-${h.id}`}>
                <p className="mono sl-half-tag">{h.label}</p>
                <p className="sl-half-body">{h.body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* 2 — the beats in prose */}
        <section className="sl-band">
          <div className="sl-band-head">
            <h3 className="sl-band-title">The beats</h3>
            <p className="mono sl-band-meta">Each one tagged with the half it sits in</p>
          </div>
          <ol className="sl-steps">
            {loopSteps.map((step) => (
              <li key={step.id} className={`sl-step${step.isPayoff ? " is-payoff" : ""}`}>
                <p className="mono sl-step-index">{step.index}</p>
                <div>
                  <h4 className="sl-step-name">{step.name}</h4>
                  <p className="mono sl-step-half">{HALF_LABEL[step.half]}</p>
                  <p className="sl-step-body">{step.body}</p>
                  {step.isPayoff && (
                    <p className="sl-step-pointer">
                      <a href={payoffPointer.href}>Click here for {payoffPointer.label} →</a>
                      <span>{payoffPointer.body}</span>
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* 3 — the puzzles, and whose design this is */}
        <section className="sl-band sl-close">
          <aside className="sl-puzzle">
            <p className="mono sl-puzzle-tag">{puzzleNote.tag}</p>
            <p className="sl-puzzle-body">{puzzleNote.body}</p>
          </aside>
          <aside className="sl-credit">
            <p className="mono sl-credit-tag">
              Design note · {levelCredit.role} · {levelCredit.team}
            </p>
            <p className="sl-credit-body">{levelCredit.body}</p>
          </aside>
        </section>
      </div>

      <style>{`
        .sl {
          /* Same tokens as the weather console on this route: --color-silver is
             the route's green (#5F9B6B), --color-gold its amber (#E0A845). */
          --sl-leaf: var(--color-silver);
          /* Lifted for small text, exactly as the weather console does it: the
             raw green clears AA on this route's void with nothing spare. */
          --sl-leaf-text: color-mix(in srgb, var(--color-silver) 72%, var(--color-moonlight));
          --sl-amber: var(--color-gold);
          --sl-amber-text: color-mix(in srgb, var(--color-gold) 78%, var(--color-moonlight));
          --sl-quiet: color-mix(in srgb, var(--color-mist) 55%, var(--color-moonlight));
          --sl-edge: color-mix(in srgb, var(--color-mist) 34%, transparent);
          --sl-screen: var(--color-void);
        }

        /* The same breakout the other project consoles use. Tokens in
           globals.css, under THE RIGHT GUTTER. */
        @media (min-width: 900px) {
          .sl {
            width: var(--breakout-w);
            margin-left: calc(50% - var(--breakout-lead));
            margin-right: calc(50% - var(--breakout-tail));
          }
        }

        .sl-frame {
          border: 1px solid var(--sl-edge);
          border-radius: 14px;
          padding: 1.25rem;
          display: grid;
          gap: 1.9rem;
        }
        .sl-frame-head {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: baseline;
          gap: 0.5rem 1.5rem;
          padding-bottom: 0.85rem;
          border-bottom: 1px solid var(--sl-edge);
        }
        .sl-frame-tag { margin: 0; font-size: 0.72rem; color: var(--sl-leaf-text); }
        .sl-frame-meta { margin: 0; font-size: 0.68rem; color: var(--sl-quiet); }

        .sl-band { display: grid; gap: 0.85rem; }
        .sl-band-head {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: baseline;
          gap: 0.35rem 1.5rem;
        }
        .sl-band-title {
          font-family: var(--font-hero);
          font-size: 1.05rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          margin: 0;
          color: var(--color-moonlight);
        }
        .sl-band-meta { margin: 0; font-size: 0.72rem; color: var(--sl-quiet); }

        .sl-thesis {
          margin: 0;
          max-width: 58rem;
          font-size: 0.86rem;
          line-height: 1.6;
          color: var(--color-moonlight);
        }

        .sl-screen {
          background: var(--sl-screen);
          border: 1px solid var(--sl-edge);
          border-radius: 12px;
        }
        .sl-loop-scroll { overflow-x: auto; overscroll-behavior-x: contain; }
        .sl-loop-scroll:focus-visible {
          outline: 2px solid var(--color-lunar-gold);
          outline-offset: 2px;
        }
        /* Below its floor the loop scrolls rather than shrinking: the beat list
           under it carries all four in full anyway. */
        .sl-loop { display: block; width: 100%; min-width: 900px; height: auto; }
        /* Narrow-only, matching every other scroll-only figure on the site.
           This frame has no drag or key handler — it is a plain overflow-x
           auto box — so it gets a note that claims scrolling and nothing else,
           and only at the widths where the drawing genuinely overflows. It
           does NOT qualify for the shared InteractiveHint chip. */
        .sl-scroll-note {
          display: none;
          margin: 0.7rem 0 0;
          font-size: 0.70rem;
          color: var(--sl-quiet);
        }
        @media (max-width: 900px) {
          .sl-scroll-note { display: block; }
        }

        /* ---- 1 · the loop ---- */
        .sl-head { fill: var(--sl-leaf-text); }
        .sl-rail-line {
          fill: none;
          stroke: color-mix(in srgb, var(--sl-amber) 60%, transparent);
          stroke-width: 1.5;
        }
        .sl-rail-line.is-restoration { stroke: color-mix(in srgb, var(--sl-leaf) 65%, transparent); }
        .sl-rail-seam {
          fill: none;
          stroke: var(--sl-edge);
          stroke-width: 1;
          stroke-dasharray: 4 4;
        }
        .sl-rail-label {
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.16em;
          fill: var(--sl-amber-text);
        }
        .sl-rail-label.is-restoration { fill: var(--sl-leaf-text); }

        .sl-loop-body { fill: color-mix(in srgb, var(--color-moonlight) 4%, var(--sl-screen)); }
        .sl-loop-frame { fill: none; stroke: var(--sl-edge); stroke-width: 1; }
        .sl-loop-node.is-payoff .sl-loop-body {
          fill: color-mix(in srgb, var(--sl-leaf) 12%, var(--sl-screen));
        }
        .sl-loop-node.is-payoff .sl-loop-frame { stroke: var(--sl-leaf); stroke-width: 1.6; }
        .sl-loop-index {
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.16em;
          fill: var(--sl-quiet);
        }
        .sl-loop-node.is-payoff .sl-loop-index { fill: var(--sl-leaf-text); }
        .sl-loop-name {
          font-family: var(--font-hero);
          font-size: 16px;
          font-weight: 600;
          fill: var(--color-moonlight);
        }
        .sl-loop-foot {
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 0.14em;
          fill: var(--sl-quiet);
        }
        .sl-loop-node.is-payoff .sl-loop-foot { fill: var(--sl-leaf-text); }
        .sl-loop-edge {
          fill: none;
          stroke: color-mix(in srgb, var(--color-mist) 78%, var(--color-moonlight));
          stroke-width: 1.5;
        }
        .sl-loop-edge.is-return {
          stroke: var(--sl-leaf-text);
          stroke-dasharray: 6 5;
        }
        .sl-lane-label {
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.16em;
          fill: var(--sl-quiet);
        }

        .sl-halves {
          list-style: none;
          margin: 0.35rem 0 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
          gap: 1px;
          background: var(--sl-edge);
          border: 1px solid var(--sl-edge);
          border-radius: 12px;
          overflow: hidden;
        }
        .sl-half {
          background: var(--sl-screen);
          padding: 1rem 1.1rem 1.1rem;
          border-top: 2px solid color-mix(in srgb, var(--sl-amber) 60%, transparent);
          min-width: 0;
        }
        .sl-half.is-restoration {
          border-top-color: color-mix(in srgb, var(--sl-leaf) 65%, transparent);
        }
        .sl-half-tag {
          margin: 0;
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          color: var(--sl-amber-text);
        }
        .sl-half.is-restoration .sl-half-tag { color: var(--sl-leaf-text); }
        .sl-half-body {
          margin: 0.4rem 0 0;
          font-size: 0.82rem;
          line-height: 1.55;
          color: var(--sl-quiet);
        }

        /* ---- 2 · the beats ---- */
        .sl-steps {
          list-style: none;
          margin: 0.35rem 0 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
          gap: 1px;
          background: var(--sl-edge);
          border: 1px solid var(--sl-edge);
          border-radius: 12px;
          overflow: hidden;
        }
        .sl-step {
          background: var(--sl-screen);
          padding: 1rem 1.1rem 1.1rem;
          display: grid;
          grid-template-columns: 2rem minmax(0, 1fr);
          gap: 0.2rem 0.4rem;
          align-content: start;
          min-width: 0;
        }
        .sl-step.is-payoff { background: color-mix(in srgb, var(--sl-leaf) 9%, var(--sl-screen)); }
        .sl-step-index {
          margin: 0;
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          color: var(--sl-quiet);
          padding-top: 0.2rem;
        }
        .sl-step.is-payoff .sl-step-index { color: var(--sl-leaf-text); }
        .sl-step-name {
          font-family: var(--font-hero);
          font-size: 1rem;
          font-weight: 600;
          margin: 0;
          color: var(--color-moonlight);
        }
        .sl-step-half {
          margin: 0.2rem 0 0;
          font-size: 0.70rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--sl-quiet);
        }
        .sl-step-body {
          margin: 0.35rem 0 0;
          font-size: 0.82rem;
          line-height: 1.55;
          color: var(--sl-quiet);
        }
        .sl-step-pointer {
          margin: 0.6rem 0 0;
          display: grid;
          gap: 0.2rem;
          font-size: 0.78rem;
          line-height: 1.5;
          color: var(--sl-quiet);
        }
        .sl-step-pointer a {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          color: var(--sl-leaf-text);
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        /* ---- 3 · the puzzles and the credit ---- */
        .sl-close {
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
          gap: 1rem;
        }
        .sl-puzzle,
        .sl-credit {
          border: 1px solid var(--sl-edge);
          border-radius: 12px;
          background: var(--sl-screen);
          padding: 1.15rem 1.25rem;
          display: grid;
          gap: 0.5rem;
          align-content: start;
        }
        .sl-puzzle { border-left: 3px solid var(--sl-amber); }
        .sl-credit { border-left: 3px solid var(--sl-leaf); }
        .sl-puzzle-tag {
          margin: 0;
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          color: var(--sl-amber-text);
        }
        .sl-credit-tag {
          margin: 0;
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          color: var(--sl-leaf-text);
        }
        .sl-puzzle-body,
        .sl-credit-body {
          margin: 0;
          font-size: 0.88rem;
          line-height: 1.65;
          color: var(--color-moonlight);
        }

        /* ---- responsive ---- */
        @media (max-width: 700px) {
          .sl-frame { padding: 0.9rem; }
          .sl-step { grid-template-columns: 1.7rem minmax(0, 1fr); }
        }

        /* Nothing in here animates, but the section inherits the route's
           transitions; this holds them still with the rest of the page. */
        @media (prefers-reduced-motion: reduce) {
          .sl *, .sl *::before, .sl *::after {
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}

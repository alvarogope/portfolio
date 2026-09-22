import {
  alarmTriggers,
  designNote,
  detectionStates,
  detectionTransitions,
  feedbackChannels,
  feedbackThesis,
  machineSummary,
  trapsCounterPointer,
  trapsCredit,
  trapsNote,
  trapsThesis,
  voiceConstraint,
  type AlarmTrigger,
  type DetectionState,
  type DetectionStateId,
  type FeedbackChannelId,
  type TransitionKind,
} from "@/content/break-in-detection";
import { getRole } from "@/content/break-in-roles";

const PAD_X = 24;
const NODE_W = 214;
const NODE_H = 118;
const GAP = 132;
const PITCH = NODE_W + GAP;

const TRAP_Y = 40;
const TRAP_H = 62;
const TRAP_W = 232;
const TRAP_GAP = 34;
const TRAP_BOTTOM = TRAP_Y + TRAP_H;
const BUS_Y = 130;

const NODE_Y = 164;
const NODE_MID = NODE_Y + NODE_H / 2;
const NODE_BOTTOM = NODE_Y + NODE_H;

const RETURN_Y = 332;

const VB_W = PAD_X * 2 + detectionStates.length * NODE_W + (detectionStates.length - 1) * GAP;
const VB_H = 368;

const HEADER_H = 22;
const PAD_IN = 14;

const PLATE_FONT = 10;
const PLATE_CHAR_W = PLATE_FONT * 0.6;

const order = detectionStates.map((s) => s.id);

function nodeBox(id: DetectionStateId) {
  const i = order.indexOf(id);
  const x = PAD_X + i * PITCH;
  return { x, y: NODE_Y, w: NODE_W, h: NODE_H, cx: x + NODE_W / 2, right: x + NODE_W };
}

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

const BAR_FILL = 0.62;

function trapBox(i: number) {
  const x = PAD_X + i * (TRAP_W + TRAP_GAP);
  return { x, y: TRAP_Y, w: TRAP_W, h: TRAP_H, cx: x + TRAP_W / 2, right: x + TRAP_W };
}

const TRAP_TARGET = alarmTriggers[0].escalatesTo;
const TRAP_DROP_X = nodeCentre(TRAP_TARGET);

function nodeCentre(id: DetectionStateId): number {
  const i = detectionStates.findIndex((state) => state.id === id);
  return PAD_X + i * PITCH + NODE_W / 2;
}

function TrapNode({ trap, i }: { trap: AlarmTrigger; i: number }) {
  const box = trapBox(i);
  return (
    <g className="ds-trap">
      <rect className="ds-trap-body" x={box.x} y={box.y} width={box.w} height={box.h} />
      <rect
        className="ds-trap-frame"
        x={box.x + 0.5}
        y={box.y + 0.5}
        width={box.w - 1}
        height={box.h - 1}
      />
      <rect className="ds-trap-edge" x={box.x} y={box.y} width={3} height={box.h} />

      <text className="ds-trap-index" x={box.x + 12} y={box.y + 17}>
        {trap.index}
      </text>
      <text className="ds-trap-tag" x={box.right - 12} y={box.y + 17} textAnchor="end">
        {trap.consequenceTag.toUpperCase()}
      </text>
      <text className="ds-trap-name" x={box.x + 12} y={box.y + 38}>
        {trap.name.toUpperCase()}
      </text>
      <text className="ds-trap-mistake" x={box.x + 12} y={box.y + 53}>
        {trap.mistake}
      </text>
    </g>
  );
}

function TrapBus() {
  const first = trapBox(0);
  const last = trapBox(alarmTriggers.length - 1);
  return (
    <g className="ds-trapbus">
      {alarmTriggers.map((trap, i) => (
        <path
          key={trap.id}
          className="ds-trapbus-line"
          d={`M ${trapBox(i).cx} ${TRAP_BOTTOM} V ${BUS_Y}`}
        />
      ))}
      <path
        className="ds-trapbus-line"
        d={`M ${first.cx} ${BUS_Y} H ${Math.max(TRAP_DROP_X, last.cx)}`}
      />
      <path
        className="ds-trapbus-line"
        d={`M ${TRAP_DROP_X} ${BUS_Y} V ${NODE_Y}`}
        markerEnd="url(#ds-arrow-trap)"
      />
      <TriggerPlate
        x={(trapBox(alarmTriggers.length - 2).cx + last.cx) / 2}
        y={BUS_Y}
        text={trapsThesis}
        kind="trap"
      />
    </g>
  );
}

function StateNode({ state }: { state: DetectionState }) {
  const box = nodeBox(state.id);
  const inner = box.w - PAD_IN * 2;
  const lines = wrap(state.body, Math.floor(inner / 6.4)).slice(0, 2);
  const isInvestigating = state.id === "investigating";

  return (
    <g className={`ds-node is-${state.band}`}>
      <rect className="ds-node-body" x={box.x} y={box.y} width={box.w} height={box.h} />
      <rect className="ds-node-head" x={box.x} y={box.y} width={box.w} height={HEADER_H} />
      <line
        className="ds-node-rule"
        x1={box.x}
        y1={box.y + HEADER_H}
        x2={box.right}
        y2={box.y + HEADER_H}
      />

      <circle className="ds-node-dot" cx={box.x + PAD_IN + 4} cy={box.y + 11} r={3.4} />
      <text className="ds-node-index" x={box.x + PAD_IN + 16} y={box.y + 15}>
        S{state.order}
      </text>
      <text className="ds-node-band" x={box.right - PAD_IN} y={box.y + 15} textAnchor="end">
        {state.bandLabel.toUpperCase()}
      </text>

      <text className="ds-node-name" x={box.x + PAD_IN} y={box.y + 48}>
        {state.name.toUpperCase()}
      </text>

      {lines.map((linetext, i) => (
        <text
          key={linetext}
          className="ds-node-body-text"
          x={box.x + PAD_IN}
          y={box.y + 68 + i * 13}

        >
          {linetext}
        </text>
      ))}

      {isInvestigating ? (
        <>
          <rect
            className="ds-bar-rail"
            x={box.x + PAD_IN}
            y={box.y + 92}
            width={inner}
            height={6}
          />
          <rect
            className="ds-bar-fill"
            x={box.x + PAD_IN}
            y={box.y + 92}
            width={inner * BAR_FILL}
            height={6}
          />
          <text className="ds-node-foot" x={box.x + PAD_IN} y={box.y + 110}>
            {state.footer}
          </text>
        </>
      ) : (
        <text className="ds-node-foot" x={box.x + PAD_IN} y={box.y + 100}>
          {state.footer}
        </text>
      )}

      <rect
        className="ds-node-frame"
        x={box.x + 0.5}
        y={box.y + 0.5}
        width={box.w - 1}
        height={box.h - 1}
      />
    </g>
  );
}

type PlateKind = TransitionKind | "trap";

function TriggerPlate({ x, y, text, kind }: { x: number; y: number; text: string; kind: PlateKind }) {
  const label = text.toUpperCase();
  const w = label.length * PLATE_CHAR_W + 16;
  const h = 20;
  return (
    <g className={`ds-plate is-${kind}`}>
      <rect className="ds-plate-body" x={x - w / 2} y={y - h / 2} width={w} height={h} />
      <text className="ds-plate-text" x={x} y={y + 3.5} textAnchor="middle">
        {label}
      </text>
    </g>
  );
}

function Machine() {
  return (
    <svg
      className="ds-machine"
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      role="img"
      aria-labelledby="ds-machine-title ds-machine-desc"
    >
      <title id="ds-machine-title">The Break-In detection state machine</title>
      <desc id="ds-machine-desc">{machineSummary}</desc>

      <defs>
        {(["escalate", "deescalate", "terminal", "trap"] as const).map((kind) => (
          <marker
            key={kind}
            id={`ds-arrow-${kind}`}
            viewBox="0 0 8 8"
            refX="7.4"
            refY="4"
            markerWidth="8"
            markerHeight="8"
            markerUnits="userSpaceOnUse"
            orient="auto"
          >
            <path className={`ds-head is-${kind}`} d="M 0 0 L 8 4 L 0 8 Z" />
          </marker>
        ))}
      </defs>

      {detectionTransitions.map((t) => {
        const a = nodeBox(t.from);
        const b = nodeBox(t.to);

        const back = t.kind === "deescalate";
        const d = back
          ? `M ${a.cx} ${NODE_BOTTOM} V ${RETURN_Y} H ${b.cx} V ${NODE_BOTTOM}`
          : `M ${a.right} ${NODE_MID} H ${b.x}`;
        const label = back
          ? { x: (a.cx + b.cx) / 2, y: RETURN_Y }
          : { x: (a.right + b.x) / 2, y: NODE_MID };

        return (
          <g key={t.id} className={`ds-edge is-${t.kind}`}>
            <path className="ds-edge-line" d={d} markerEnd={`url(#ds-arrow-${t.kind})`} />
            <TriggerPlate x={label.x} y={label.y} text={t.trigger} kind={t.kind} />
          </g>
        );
      })}

      {alarmTriggers.map((trap, i) => (
        <TrapNode key={trap.id} trap={trap} i={i} />
      ))}
      <TrapBus />

      {detectionStates.map((state) => (
        <StateNode key={state.id} state={state} />
      ))}
    </svg>
  );
}

function ChannelGlyph({ id }: { id: FeedbackChannelId }) {
  if (id === "audio") {
    const bars = [8, 14, 22, 30, 38];
    return (
      <svg className="ds-glyph" viewBox="0 0 72 44" aria-hidden="true" focusable="false">
        {bars.map((h, i) => (
          <rect key={h} className="ds-glyph-bar" x={8 + i * 13} y={40 - h} width={7} height={h} />
        ))}
      </svg>
    );
  }

  if (id === "hud") {
    return (
      <svg className="ds-glyph" viewBox="0 0 72 44" aria-hidden="true" focusable="false">
        <path
          className="ds-glyph-stroke"
          d="M 8 22 C 20 6, 52 6, 64 22 C 52 38, 20 38, 8 22 Z"
        />
        <circle className="ds-glyph-fill" cx="36" cy="22" r="7.5" />
        <circle className="ds-glyph-pupil" cx="36" cy="22" r="3" />
      </svg>
    );
  }

  return (
    <svg className="ds-glyph" viewBox="0 0 72 44" aria-hidden="true" focusable="false">
      <rect className="ds-glyph-rail" x="14" y="6" width="44" height="7" />
      <rect className="ds-glyph-bar" x="14" y="6" width={44 * 0.62} height="7" />
      <circle className="ds-glyph-stroke-fill" cx="36" cy="26" r="6" />
      <path className="ds-glyph-stroke" d="M 24 42 C 25 33, 47 33, 48 42" />
    </svg>
  );
}

const KIND_WORD: Record<TransitionKind, string> = {
  escalate: "Escalates",
  deescalate: "De-escalates",
  terminal: "Ends the run",
};

export default function DetectionStates() {
  const hacker = getRole("hacker");

  return (
    <div className="ds">
      <div className="panel ds-console">
        <div className="ds-console-head">
          <p className="mono ds-console-tag">Detection state machine</p>
        </div>

        <section className="ds-band">
          <div className="ds-band-head">
            <h3 className="ds-band-title">The machine</h3>
          </div>
          <div
            className="ds-screen ds-machine-scroll"
            role="group"
            aria-label="Detection state machine, scrolls horizontally"
            tabIndex={0}
          >
            <Machine />
          </div>
          <p className="mono mono-note ds-scroll-note">Scroll the machine sideways to follow it →</p>
        </section>

        <section className="ds-band">
          <div className="ds-band-head">
            <h3 className="ds-band-title">Traps and Alarm Triggers</h3>
            <p className="mono ds-band-meta">
              {alarmTriggers.length} mistakes · all three skip S2
            </p>
          </div>
          <ol className="ds-traps">
            {alarmTriggers.map((trap) => (
              <li key={trap.id} className="ds-trap-card">
                <p className="mono ds-trap-card-kicker">
                  <span className="ds-trap-card-index">{trap.index}</span>
                  <span>{trap.where}</span>
                </p>
                <h4 className="ds-trap-card-name">{trap.name}</h4>

                <p className="mono ds-trap-card-chain">
                  <span className="ds-trap-card-mistake">{trap.mistake}</span>
                  <span className="ds-trap-card-arrow" aria-hidden="true">
                    →
                  </span>
                  <span className="ds-trap-card-state">{getStateName(trap.escalatesTo)}</span>
                </p>

                <p className="ds-trap-card-cost">{trap.consequence}</p>
                <p className="ds-trap-card-detail">{trap.detail}</p>
              </li>
            ))}
          </ol>
          <p className="ds-trap-credit">{trapsCredit}</p>
        </section>

        <section className="ds-band">
          <div className="ds-band-head">
            <h3 className="ds-band-title">The Guard States</h3>
          </div>
          <ol className="ds-states">
            {detectionStates.map((state) => (
              <li key={state.id} className={`ds-state is-${state.band}`}>
                <p className="mono ds-state-kicker">
                  <span className="ds-state-dot" aria-hidden="true" />
                  S{state.order} · {state.bandLabel}
                </p>
                <h4 className="ds-state-name">{state.name}</h4>
                <p className="ds-state-detail">{state.detail}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="ds-band">
          <div className="ds-band-head">
            <h3 className="ds-band-title">Multi-channel feedback</h3>
          </div>
          <p className="ds-thesis">{feedbackThesis}</p>
          <ul className="ds-channels">
            {feedbackChannels.map((channel) => (
              <li key={channel.id} className="ds-channel">
                <div className="ds-glyph-well">
                  <ChannelGlyph id={channel.id} />
                </div>
                <p className="mono ds-channel-tag">{channel.channel}</p>
                <h4 className="ds-channel-name">{channel.name}</h4>
                <p className="ds-channel-body">{channel.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="ds-band ds-band--split">
          <aside className="ds-constraint">
            <p className="mono ds-constraint-tag">Design Decision · {voiceConstraint.headline}</p>
            <p className="ds-constraint-body">{voiceConstraint.body}</p>
          </aside>

          <aside className="ds-credit">
            <p className="mono ds-credit-tag">
              Design note · {designNote.role}
            </p>
            <p className="ds-credit-body">{designNote.body}</p>
          </aside>
        </section>
      </div>

      <style>{`
        .ds {
          /* This route scopes --color-silver to its amber (#E5B54D). The accent
             is the token, not a hex. */
          --ds-amber: var(--color-silver);
          /* Raw mist is 4.63:1 on a screen — at the bar with nothing spare. The
             blend clears 7.9:1 everywhere the small mono is used. */
          --ds-quiet: color-mix(in srgb, var(--color-mist) 55%, var(--color-moonlight));
          --ds-edge: color-mix(in srgb, var(--color-mist) 30%, transparent);
          --ds-screen: var(--color-void);
          --ds-steel: color-mix(in srgb, var(--color-mist) 78%, var(--color-moonlight));

          /* The calm-to-caught ramp, borrowed from the page's alarm rail so the
             two read as one vocabulary. Scarlet is 4.59:1 on the void — over
             the bar but tight — so text uses the lifted mixes and the raw
             tokens are kept for rules, dots and frames. */
          --ds-calm: var(--color-emerald);
          --ds-calm-text: color-mix(in srgb, var(--color-emerald) 84%, var(--color-moonlight));
          --ds-warn: var(--ds-amber);
          --ds-warn-text: var(--ds-amber);
          --ds-alert: color-mix(in srgb, var(--color-scarlet) 62%, var(--ds-amber));
          --ds-alert-text: color-mix(in srgb, var(--color-scarlet) 45%, var(--ds-amber));
          --ds-fail: var(--color-scarlet);
          --ds-fail-text: color-mix(in srgb, var(--color-scarlet) 74%, var(--color-moonlight));
        }

        /* Same breakout the role graph and the two other consoles use: the
           section column caps at 68rem, narrower than a four-state row wants.
           Tokens in globals.css, under THE RIGHT GUTTER. */
        @media (min-width: 900px) {
          .ds {
            width: var(--breakout-w);
            margin-left: calc(50% - var(--breakout-lead));
            margin-right: calc(50% - var(--breakout-tail));
          }
        }

        .ds-console {
          border: 1px solid var(--ds-edge);
          padding: 1.25rem;
          display: grid;
          gap: 1.75rem;
        }
        .ds-console-head {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: baseline;
          gap: 0.5rem 1.5rem;
          padding-bottom: 0.85rem;
          border-bottom: 1px solid var(--ds-edge);
        }
        .ds-console-tag { margin: 0; font-size: 0.72rem; color: var(--ds-amber); }
        .ds-console-meta { margin: 0; font-size: 0.68rem; color: var(--ds-quiet); }

        .ds-band { display: grid; gap: 0.75rem; }
        .ds-band-head {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: baseline;
          gap: 0.35rem 1.5rem;
        }
        .ds-band-title {
          font-family: var(--font-hero);
          font-size: 1rem;
          letter-spacing: 0.04em;
          margin: 0;
          color: var(--color-moonlight);
        }
        .ds-band-meta { margin: 0; font-size: 0.72rem; color: var(--ds-quiet); }

        .ds-screen { background: var(--ds-screen); border: 1px solid var(--ds-edge); }

        /* ---- 1 · the machine ----
           At 1120px the ${VB_W}-unit box renders at about 0.86, which holds the
           smallest mono at 8.2px — the same floor the other diagrams on this
           page keep. Below that it scrolls rather than shrinking: the
           transition table under it carries every edge in full anyway, so a
           squinting diagram would buy nothing. */
        .ds-machine-scroll { overflow-x: auto; overscroll-behavior-x: contain; }
        .ds-machine-scroll:focus-visible {
          outline: 2px solid var(--color-lunar-gold);
          outline-offset: 2px;
        }
        .ds-machine { display: block; width: 100%; min-width: 1120px; height: auto; }
        .ds-scroll-note { display: none; margin: 0; font-size: 0.71rem; color: var(--ds-quiet); }
        @media (max-width: 1200px) { .ds-scroll-note { display: block; } }

        .ds-node-body { fill: color-mix(in srgb, var(--color-moonlight) 4%, var(--ds-screen)); }
        .ds-node-head { fill: color-mix(in srgb, var(--color-moonlight) 6%, transparent); }
        .ds-node-rule { stroke: var(--ds-edge); stroke-width: 1; }
        .ds-node-frame { fill: none; stroke: var(--ds-edge); stroke-width: 1; }

        .ds-node-index,
        .ds-node-band {
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.14em;
          fill: var(--ds-quiet);
        }
        .ds-node-name {
          font-family: var(--font-hero);
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.05em;
          fill: var(--color-moonlight);
        }
        .ds-node-body-text {
          font-family: var(--font-body);
          font-size: 10px;
          fill: color-mix(in srgb, var(--color-mist) 40%, var(--color-moonlight));
        }
        .ds-node-foot {
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 0.08em;
          fill: var(--ds-quiet);
        }

        /* Band accents. Every one of these is paired with the band printed as a
           word inside the same node, so nothing here is the only signal. */
        .ds-node.is-calm  .ds-node-dot { fill: var(--ds-calm); }
        .ds-node.is-warn  .ds-node-dot { fill: var(--ds-warn); }
        .ds-node.is-alert .ds-node-dot { fill: var(--ds-alert); }
        .ds-node.is-fail  .ds-node-dot { fill: var(--ds-fail); }

        .ds-node.is-calm  .ds-node-band { fill: var(--ds-calm-text); }
        .ds-node.is-warn  .ds-node-band { fill: var(--ds-warn-text); }
        .ds-node.is-alert .ds-node-band { fill: var(--ds-alert-text); }
        .ds-node.is-fail  .ds-node-band { fill: var(--ds-fail-text); }

        .ds-node.is-warn  .ds-node-frame { stroke: color-mix(in srgb, var(--ds-warn) 48%, transparent); }
        .ds-node.is-alert .ds-node-frame { stroke: color-mix(in srgb, var(--ds-alert) 55%, transparent); }
        /* The terminal state gets the heaviest frame in the row: it is the only
           node with no edge leaving it. */
        .ds-node.is-fail  .ds-node-frame { stroke: var(--ds-fail); stroke-width: 1.6; }
        .ds-node.is-fail  .ds-node-body {
          fill: color-mix(in srgb, var(--color-scarlet) 9%, var(--ds-screen));
        }
        .ds-node.is-fail  .ds-node-name { fill: var(--ds-fail-text); }

        .ds-bar-rail { fill: color-mix(in srgb, var(--color-mist) 26%, transparent); }
        .ds-bar-fill { fill: var(--ds-warn); }

        /* ---- edges ----
           Line style carries direction as well as colour: solid forward,
           dashed backward, heavy for the one that ends the run. */
        .ds-edge-line { fill: none; }
        .ds-edge.is-escalate .ds-edge-line { stroke: var(--ds-steel); stroke-width: 1.5; }
        .ds-edge.is-deescalate .ds-edge-line {
          stroke: color-mix(in srgb, var(--ds-calm) 70%, var(--color-moonlight));
          stroke-width: 1.4;
          stroke-dasharray: 6 5;
        }
        .ds-edge.is-terminal .ds-edge-line { stroke: var(--ds-fail); stroke-width: 2.1; }

        .ds-head.is-escalate { fill: var(--ds-steel); }
        .ds-head.is-deescalate { fill: color-mix(in srgb, var(--ds-calm) 70%, var(--color-moonlight)); }
        .ds-head.is-terminal { fill: var(--ds-fail); }

        .ds-plate-body {
          fill: var(--ds-screen);
          stroke: color-mix(in srgb, var(--color-mist) 26%, transparent);
          stroke-width: 1;
        }
        .ds-plate-text {
          font-family: var(--font-mono);
          font-size: ${PLATE_FONT}px;
          letter-spacing: 0.1em;
          fill: var(--color-moonlight);
        }
        .ds-plate.is-deescalate .ds-plate-text {
          fill: color-mix(in srgb, var(--ds-calm) 82%, var(--color-moonlight));
        }
        .ds-plate.is-terminal .ds-plate-text { fill: var(--ds-fail-text); }
        .ds-plate.is-terminal .ds-plate-body {
          stroke: color-mix(in srgb, var(--color-scarlet) 45%, transparent);
        }

        /* ---- the trap rail ----
           Dressed hot: scarlet edge, scarlet frame, a hazard stripe on the
           leading edge. It is the only thing in the diagram that is not part of
           the ordinary machine, and it should not look like it is. */
        .ds-trap-body { fill: color-mix(in srgb, var(--color-scarlet) 8%, var(--ds-screen)); }
        .ds-trap-frame {
          fill: none;
          stroke: color-mix(in srgb, var(--color-scarlet) 46%, transparent);
          stroke-width: 1;
        }
        .ds-trap-edge { fill: var(--color-scarlet); }
        .ds-trap-index {
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.16em;
          fill: var(--ds-fail-text);
        }
        .ds-trap-tag {
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.12em;
          fill: var(--ds-fail-text);
        }
        .ds-trap-name {
          font-family: var(--font-hero);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.06em;
          fill: var(--color-moonlight);
        }
        .ds-trap-mistake {
          font-family: var(--font-body);
          font-size: 9.5px;
          fill: var(--ds-quiet);
        }

        .ds-trapbus-line {
          fill: none;
          stroke: var(--color-scarlet);
          stroke-width: 1.6;
          stroke-dasharray: 7 4;
        }
        .ds-head.is-trap { fill: var(--color-scarlet); }
        .ds-plate.is-trap .ds-plate-body {
          stroke: color-mix(in srgb, var(--color-scarlet) 50%, transparent);
        }
        .ds-plate.is-trap .ds-plate-text { fill: var(--ds-fail-text); }

        .ds-lane-label {
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 0.2em;
          fill: color-mix(in srgb, var(--color-mist) 45%, var(--color-moonlight));
        }

        /* ---- trap cards ---- */
        .ds-traps {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(${alarmTriggers.length}, minmax(0, 1fr));
          gap: 1px;
          background: var(--ds-edge);
          border: 1px solid var(--ds-edge);
        }
        .ds-trap-card {
          background: var(--ds-screen);
          padding: 1.05rem 1rem 1.15rem;
          display: grid;
          gap: 0.42rem;
          align-content: start;
          min-width: 0;
          box-shadow: inset 0 2px 0 var(--color-scarlet);
        }
        .ds-trap-card-kicker {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: baseline;
          gap: 0.3rem 0.8rem;
          margin: 0;
          font-size: 0.70rem;
          letter-spacing: 0.1em;
          color: var(--ds-quiet);
        }
        .ds-trap-card-index { color: var(--ds-fail-text); }
        .ds-trap-card-name {
          font-family: var(--font-hero);
          font-size: 1.02rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          margin: 0;
          color: var(--color-moonlight);
        }
        .ds-trap-card-chain {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 0.4rem;
          margin: 0.1rem 0 0;
          font-size: 0.68rem;
          letter-spacing: 0.04em;
          color: var(--ds-quiet);
        }
        .ds-trap-card-arrow { color: var(--ds-fail-text); }
        .ds-trap-card-state { color: var(--ds-alert-text); }
        /* The punishment is the reason the card exists, so it is the one line
           in it set at full strength. */
        .ds-trap-card-cost {
          margin: 0.15rem 0 0;
          font-size: 0.84rem;
          line-height: 1.45;
          color: var(--ds-fail-text);
        }
        .ds-trap-card-detail {
          margin: 0;
          font-size: 0.82rem;
          line-height: 1.55;
          color: var(--ds-quiet);
        }
        /* The hand-off. Amber and ruled like the credit below it, because it
           is the same kind of line — an aside about the three cards rather
           than another fact inside them — and it sits directly under the row
           so the answer is the next thing read after the three problems. */
        .ds-trap-pointer {
          margin: 0;
          padding-left: 0.85rem;
          border-left: 2px solid var(--ds-amber);
          max-width: 58rem;
          font-size: 0.84rem;
          line-height: 1.6;
          color: var(--color-moonlight);
        }
        .ds-trap-credit {
          margin: 0;
          padding-left: 0.85rem;
          border-left: 2px solid var(--ds-amber);
          max-width: 56rem;
          font-size: 0.84rem;
          line-height: 1.6;
          color: var(--ds-quiet);
        }


        /* ---- 2 · transitions ---- */
        .ds-transitions {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 1px;
          background: var(--ds-edge);
          border: 1px solid var(--ds-edge);
        }
        .ds-transition {
          background: var(--ds-screen);
          padding: 0.95rem 1rem;
          display: grid;
          grid-template-columns: minmax(0, 15rem) minmax(0, 9rem) minmax(0, 1fr);
          gap: 0.4rem 1.5rem;
          align-items: start;
        }
        .ds-transition-path {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 0.4rem;
          margin: 0;
          font-size: 0.72rem;
          letter-spacing: 0.04em;
          color: var(--color-moonlight);
        }
        .ds-transition-arrow { color: var(--ds-quiet); }
        .ds-transition.is-terminal .ds-transition-to { color: var(--ds-fail-text); }
        .ds-transition.is-deescalate .ds-transition-to { color: var(--ds-calm-text); }

        .ds-transition-kind {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0;
          font-size: 0.71rem;
          letter-spacing: 0.06em;
          color: var(--ds-quiet);
        }
        /* The legend swatch and the conduit are the same object: a short run of
           the exact line style the edge is drawn with. */
        .ds-rule { display: block; width: 1.5rem; height: 0; flex: none; }
        .ds-rule.is-escalate { border-top: 2px solid var(--ds-steel); }
        .ds-rule.is-deescalate {
          border-top: 2px dashed color-mix(in srgb, var(--ds-calm) 70%, var(--color-moonlight));
        }
        .ds-rule.is-terminal { border-top: 3px solid var(--color-scarlet); }

        .ds-transition-body { display: grid; gap: 0.2rem; min-width: 0; }
        .ds-transition-trigger { margin: 0; font-size: 0.70rem; color: var(--ds-amber); }
        .ds-transition-detail {
          margin: 0;
          font-size: 0.84rem;
          line-height: 1.55;
          color: var(--color-moonlight);
        }

        /* ---- 3 · the states ---- */
        .ds-states {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(${detectionStates.length}, minmax(0, 1fr));
          gap: 1px;
          background: var(--ds-edge);
          border: 1px solid var(--ds-edge);
        }
        .ds-state {
          background: var(--ds-screen);
          padding: 1rem 0.95rem 1.1rem;
          display: grid;
          gap: 0.4rem;
          align-content: start;
          min-width: 0;
        }
        .ds-state.is-calm  { box-shadow: inset 0 2px 0 var(--ds-calm); }
        .ds-state.is-warn  { box-shadow: inset 0 2px 0 var(--ds-warn); }
        .ds-state.is-alert { box-shadow: inset 0 2px 0 var(--ds-alert); }
        .ds-state.is-fail  { box-shadow: inset 0 2px 0 var(--ds-fail); }

        .ds-state-kicker {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          margin: 0;
          font-size: 0.70rem;
          letter-spacing: 0.12em;
        }
        .ds-state-dot { width: 7px; height: 7px; border-radius: 50%; flex: none; }
        .ds-state.is-calm  .ds-state-kicker { color: var(--ds-calm-text); }
        .ds-state.is-calm  .ds-state-dot { background: var(--ds-calm); }
        .ds-state.is-warn  .ds-state-kicker { color: var(--ds-warn-text); }
        .ds-state.is-warn  .ds-state-dot { background: var(--ds-warn); }
        .ds-state.is-alert .ds-state-kicker { color: var(--ds-alert-text); }
        .ds-state.is-alert .ds-state-dot { background: var(--ds-alert); }
        .ds-state.is-fail  .ds-state-kicker { color: var(--ds-fail-text); }
        .ds-state.is-fail  .ds-state-dot { background: var(--ds-fail); }

        .ds-state-name {
          font-family: var(--font-hero);
          font-size: 1.02rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          margin: 0;
          color: var(--color-moonlight);
        }
        .ds-state-detail {
          margin: 0;
          font-size: 0.82rem;
          line-height: 1.55;
          color: var(--ds-quiet);
        }

        /* ---- 4 · feedback channels ---- */
        .ds-thesis {
          margin: 0;
          font-family: var(--font-hero);
          font-size: clamp(1rem, 0.88rem + 0.6vw, 1.32rem);
          letter-spacing: 0.02em;
          color: var(--color-moonlight);
          max-width: 44rem;
        }
        .ds-channels {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(${feedbackChannels.length}, minmax(0, 1fr));
          gap: 1px;
          background: var(--ds-edge);
          border: 1px solid var(--ds-edge);
        }
        .ds-channel {
          background: var(--ds-screen);
          padding: 1.1rem 1rem 1.2rem;
          display: grid;
          gap: 0.4rem;
          align-content: start;
          min-width: 0;
        }
        .ds-glyph-well {
          border: 1px solid var(--ds-edge);
          background: color-mix(in srgb, var(--color-moonlight) 3%, var(--ds-screen));
          padding: 0.6rem 0.75rem;
          margin-bottom: 0.35rem;
          display: flex;
          justify-content: center;
        }
        .ds-glyph { display: block; width: 100%; max-width: 8rem; height: auto; }
        .ds-glyph-bar { fill: var(--ds-amber); }
        .ds-glyph-rail { fill: color-mix(in srgb, var(--color-mist) 30%, transparent); }
        .ds-glyph-stroke {
          fill: none;
          stroke: var(--ds-amber);
          stroke-width: 2.4;
          stroke-linecap: round;
        }
        .ds-glyph-stroke-fill {
          fill: none;
          stroke: var(--ds-amber);
          stroke-width: 2.4;
        }
        .ds-glyph-fill { fill: color-mix(in srgb, var(--ds-amber) 30%, transparent); }
        .ds-glyph-pupil { fill: var(--ds-amber); }

        .ds-channel-tag {
          margin: 0;
          font-size: 0.70rem;
          letter-spacing: 0.16em;
          color: var(--ds-amber);
        }
        .ds-channel-name {
          font-family: var(--font-hero);
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          margin: 0;
          color: var(--color-moonlight);
        }
        .ds-channel-body {
          margin: 0;
          font-size: 0.82rem;
          line-height: 1.55;
          color: var(--ds-quiet);
        }
        .ds-channel-catches {
          margin: 0.35rem 0 0;
          padding-top: 0.6rem;
          border-top: 1px solid var(--ds-edge);
          font-size: 0.78rem;
          line-height: 1.5;
          color: var(--color-moonlight);
        }
        .ds-channel-catches-label {
          display: block;
          font-size: 0.68rem;
          letter-spacing: 0.16em;
          color: var(--ds-amber);
          margin-bottom: 0.15rem;
        }

        .ds-note {
          margin: 0;
          max-width: 58rem;
          font-size: 0.86rem;
          line-height: 1.6;
          color: var(--color-moonlight);
        }

        /* ---- 5 · constraint and credit ---- */
        .ds-band--split {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1rem;
        }
        .ds-constraint,
        .ds-credit {
          border: 1px solid var(--ds-edge);
          background: var(--ds-screen);
          padding: 1.1rem 1.2rem;
          display: grid;
          gap: 0.5rem;
          align-content: start;
        }
        .ds-constraint { border-left: 2px solid var(--color-scarlet); }
        .ds-credit { border-left: 2px solid var(--ds-amber); }

        .ds-constraint-tag {
          margin: 0;
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          color: var(--ds-fail-text);
        }
        .ds-credit-tag {
          margin: 0;
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          color: var(--ds-amber);
        }
        .ds-constraint-body,
        .ds-credit-body {
          margin: 0;
          font-size: 0.86rem;
          line-height: 1.6;
          color: var(--color-moonlight);
        }
        .ds-constraint-foot {
          margin: 0;
          padding-top: 0.6rem;
          border-top: 1px solid var(--ds-edge);
          font-size: 0.72rem;
          color: var(--ds-quiet);
        }

        /* ---- responsive ---- */
        @media (max-width: 1100px) {
          .ds-states { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .ds-transition { grid-template-columns: minmax(0, 1fr); gap: 0.5rem; }
        }
        @media (max-width: 860px) {
          .ds-channels { grid-template-columns: minmax(0, 1fr); }
          .ds-traps { grid-template-columns: minmax(0, 1fr); }
          .ds-band--split { grid-template-columns: minmax(0, 1fr); }
        }
        @media (max-width: 700px) {
          .ds-console { padding: 0.9rem; }
          .ds-states { grid-template-columns: minmax(0, 1fr); }
        }

        /* Nothing here animates, but the console sits inside a page that does;
           this makes the intent explicit for anything added later. */
        @media (prefers-reduced-motion: reduce) {
          .ds *, .ds *::before, .ds *::after {
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}

function getStateName(id: DetectionStateId): string {
  const state = detectionStates.find((s) => s.id === id);
  return state ? state.name : id;
}
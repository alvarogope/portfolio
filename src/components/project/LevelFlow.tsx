import {
  getRouteNode,
  levelStages,
  pacingSummary,
  routeLinks,
  routeNodes,
  routeSummary,
  tensionBand,
  tensionLow,
  tensionPeak,
  tensionPoints,
  type RouteNodeId,
  type RouteNodeKind,
} from "@/content/break-in-level";
import { getRole } from "@/content/break-in-roles";

const R_PAD_X = 18;
const R_NODE_W = 112;
const R_NODE_H = 46;
const R_COL_PITCH = 146;
const R_MID_Y = 100;
const R_LANE_Y = 52;
const R_VB_H = 202;

const R_LABEL = 12;
const R_LINE_H = 15;
const R_WRAP = 12;

const routeColumn: Map<RouteNodeId, number> = (() => {
  const col = new Map<RouteNodeId, number>(routeNodes.map((n) => [n.id, 0]));
  for (let pass = 0; pass < routeNodes.length; pass += 1) {
    let moved = false;
    for (const link of routeLinks) {
      const next = (col.get(link.from) ?? 0) + 1;
      if (next > (col.get(link.to) ?? 0)) {
        col.set(link.to, next);
        moved = true;
      }
    }
    if (!moved) break;
  }
  return col;
})();

const R_COLS = routeNodes.reduce((n, node) => Math.max(n, routeColumn.get(node.id) ?? 0), 0);
const R_VB_W = R_PAD_X * 2 + R_COLS * R_COL_PITCH + R_NODE_W;

function laneOf(id: RouteNodeId): number {
  const track = getRouteNode(id).track;
  return track === "a" ? -1 : track === "b" ? 1 : 0;
}

function nodeBox(id: RouteNodeId) {
  const x = R_PAD_X + (routeColumn.get(id) ?? 0) * R_COL_PITCH;
  const cy = R_MID_Y + laneOf(id) * R_LANE_Y;
  return { x, y: cy - R_NODE_H / 2, cx: x + R_NODE_W / 2, cy, right: x + R_NODE_W };
}

function linkPath(from: RouteNodeId, to: RouteNodeId): string {
  const a = nodeBox(from);
  const b = nodeBox(to);
  if (a.cy === b.cy) return `M ${a.right} ${a.cy} H ${b.x}`;
  const mid = a.right + (b.x - a.right) / 2;
  return `M ${a.right} ${a.cy} H ${mid} V ${b.cy} H ${b.x}`;
}

const KIND_TAG: Record<RouteNodeKind, string | null> = {
  entry: "Entry",
  split: "",
  beat: null,
  merge: "",
  goal: "",
};

function wrap(text: string, max = R_WRAP): string[] {
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

function RouteRibbon() {
  return (
    <svg
      className="lf-ribbon"
      viewBox={`0 0 ${R_VB_W} ${R_VB_H}`}
      role="img"
      aria-labelledby="lf-route-title lf-route-desc"
    >
      <title id="lf-route-title">Branching infiltration route through the bank</title>
      <desc id="lf-route-desc">{routeSummary}</desc>

      <defs>
        <pattern id="lf-grid" width="28" height="28" patternUnits="userSpaceOnUse">
          <path className="lf-gridline" d="M 28 0 H 0 V 28" fill="none" />
        </pattern>
        <marker
          id="lf-arrow"
          viewBox="0 0 8 8"
          refX="7.4"
          refY="4"
          markerWidth="8"
          markerHeight="8"
          markerUnits="userSpaceOnUse"
          orient="auto"
        >
          <path className="lf-arrowhead" d="M 0 0 L 8 4 L 0 8 Z" />
        </marker>
      </defs>

      <rect className="lf-field" width={R_VB_W} height={R_VB_H} />
      <rect className="lf-field-grid" width={R_VB_W} height={R_VB_H} />

      {routeLinks.map((link) => (
        <path
          key={`${link.from}-${link.to}`}
          className="lf-conduit"
          d={linkPath(link.from, link.to)}
          markerEnd="url(#lf-arrow)"
        />
      ))}

      {routeNodes.map((node) => {
        const box = nodeBox(node.id);
        const lines = wrap(node.label.toUpperCase());
        const tag = KIND_TAG[node.kind];
        const first = lines.length > 1 ? box.cy - 3 : box.cy + 4.5;
        return (
          <g key={node.id} className={`lf-space is-${node.kind}`}>
            <rect
              className="lf-space-body"
              x={box.x}
              y={box.y}
              width={R_NODE_W}
              height={R_NODE_H}
            />
            <rect
              className="lf-space-frame"
              x={box.x + 0.5}
              y={box.y + 0.5}
              width={R_NODE_W - 1}
              height={R_NODE_H - 1}
            />
            <text className="lf-space-label" x={box.cx} y={first} textAnchor="middle">
              {lines.map((line, i) => (
                <tspan key={line} x={box.cx} dy={i === 0 ? 0 : R_LINE_H}>
                  {line}
                </tspan>
              ))}
            </text>
            {tag && (
              <text
                className="lf-space-tag"
                x={box.cx}
                y={box.y + R_NODE_H + 13}
                textAnchor="middle"
              >
                {tag.toUpperCase()}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

const C_VB_W = 1000;
const C_VB_H = 280;
const C_TOP = 54;
const C_BOTTOM = 250;

export interface TensionPlotPoint {
  x: number;
  y: number;
  point: (typeof tensionPoints)[number];
}

export function tensionGeometry({
  width = C_VB_W,
  top = C_TOP,
  bottom = C_BOTTOM,
} = {}): TensionPlotPoint[] {
  const n = tensionPoints.length;
  const slot = width / n;
  return tensionPoints.map((point) => ({
    point,
    x: (0.5 + point.x * (n - 1)) * slot,
    y: bottom - point.y * (bottom - top),
  }));
}

export function tensionPathD(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i += 1) {
    const a = points[i - 1];
    const b = points[i];
    const dx = (b.x - a.x) * 0.42;
    d += ` C ${a.x + dx} ${a.y} ${b.x - dx} ${b.y} ${b.x} ${b.y}`;
  }
  return d;
}

const pct = (n: number) => `${Math.round(n * 10000) / 100}%`;

export function TensionCurve() {
  const points = tensionGeometry();
  const line = tensionPathD(points);
  const first = points[0];
  const last = points[points.length - 1];
  const area = `${line} L ${last.x} ${C_BOTTOM} L ${first.x} ${C_BOTTOM} Z`;

  const marked = new Map([
    [tensionLow.stage, "Release"],
    [tensionPeak.stage, "Climax"],
  ]);

  return (
    <figure className="lf-chart">
      <div className="lf-plot">
        <svg
          className="lf-plot-svg"
          viewBox={`0 0 ${C_VB_W} ${C_VB_H}`}
          preserveAspectRatio="none"
          role="img"
          aria-labelledby="lf-curve-title lf-curve-desc"
        >
          <title id="lf-curve-title">Intended tension across the five stages</title>
          <desc id="lf-curve-desc">
            {`Intended tension, calm to peak, across the five stages in run order. ${tensionPoints
              .map((p) => `${p.name}: ${tensionBand(p.y)}, ${Math.round(p.y * 100)} percent`)
              .join(". ")}.`}
          </desc>

          <defs>
            <linearGradient id="lf-wash" x1="0" y1="0" x2="0" y2="1">
              <stop className="lf-wash-top" offset="0" />
              <stop className="lf-wash-base" offset="1" />
            </linearGradient>
          </defs>

          {[0, 0.5, 1].map((t) => {
            const y = C_BOTTOM - t * (C_BOTTOM - C_TOP);
            return (
              <line
                key={t}
                className={`lf-grid ${t === 0 ? "is-base" : ""}`}
                x1="0"
                y1={y}
                x2={C_VB_W}
                y2={y}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}

          <path className="lf-area" d={area} fill="url(#lf-wash)" />

          {points.map((p) => (
            <line
              key={`stem-${p.point.stage}`}
              className="lf-stem"
              x1={p.x}
              y1={C_BOTTOM}
              x2={p.x}
              y2={p.y}
              vectorEffect="non-scaling-stroke"
            />
          ))}

          <path
            className="lf-curve"
            d={line}
            fill="none"
            vectorEffect="non-scaling-stroke"
          />

          {points.map((p) => (
            <path
              key={`ring-${p.point.stage}`}
              className="lf-marker-ring"
              d={`M ${p.x} ${p.y} l 0.01 0`}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {points.map((p) => (
            <path
              key={`dot-${p.point.stage}`}
              className={marked.has(p.point.stage) ? "lf-marker is-marked" : "lf-marker"}
              d={`M ${p.x} ${p.y} l 0.01 0`}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>

        <span className="mono lf-y-label" style={{ top: pct(C_TOP / C_VB_H) }}>
          Peak
        </span>
        <span className="mono lf-y-label" style={{ top: pct(C_BOTTOM / C_VB_H) }}>
          Calm
        </span>

        {points.map((p) => {
          const label = marked.get(p.point.stage);
          if (!label) return null;
          const rightEdge = p.x / C_VB_W > 0.75;
          return (
            <span
              key={`note-${p.point.stage}`}
              className={rightEdge ? "mono lf-note is-right" : "mono lf-note"}
              style={
                rightEdge
                  ? { right: pct(1 - p.x / C_VB_W), top: pct(p.y / C_VB_H) }
                  : { left: pct(p.x / C_VB_W), top: pct(p.y / C_VB_H) }
              }
            >
              {label}
            </span>
          );
        })}
      </div>

      <div className="lf-axis" aria-hidden="true">
        {tensionPoints.map((p, i) => (
          <span key={p.stage} className="lf-axis-cell">
            <span className="mono lf-axis-num">{String(i + 1).padStart(2, "0")}</span>
            <span className="mono lf-axis-name">{p.name}</span>
            <span className="mono lf-axis-exp">{p.experience}</span>
          </span>
        ))}
      </div>

      <figcaption className="lf-caption">{pacingSummary}</figcaption>
    </figure>
  );
}

function StageField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="lf-field">
      <p className="mono lf-field-label">{label}</p>
      {children}
    </div>
  );
}

function StagePanels() {
  return (
    <ol className="lf-stages">
      {levelStages.map((stage) => {
        const role = stage.roleFocus === "all" ? null : getRole(stage.roleFocus);
        return (
          <li key={stage.id} className="lf-stage">
            <p className="mono lf-stage-kicker">
              <span>Stage {String(stage.order).padStart(2)}</span>
              <span className="lf-stage-mech">{stage.mechanic}</span>
            </p>
            <h4 className="lf-stage-name">{stage.name}</h4>

            <StageField label="Objective">
              <p className="lf-objective">{stage.objective}</p>
            </StageField>

            <StageField label="Role focus">
              <p className={role ? "mono lf-role is-role" : "mono lf-role"}>
                {role ? role.name : "All roles"}
              </p>
            </StageField>

            <StageField label="Hazards">
              <ul className="lf-hazards">
                {stage.hazards.map((h) => (
                  <li key={h} className="mono lf-hazard">
                    {h}
                  </li>
                ))}
              </ul>
            </StageField>

            <div className="lf-stage-foot">
              <p className="mono lf-exp">{stage.experience}</p>
              <div className="lf-meter" aria-hidden="true">
                <span className="lf-meter-fill" style={{ width: pct(stage.tension) }} />
              </div>
              <p className="mono lf-meter-read">
                Tension · {tensionBand(stage.tension)} · {Math.round(stage.tension * 100)}%
              </p>
              <p className="lf-why">{stage.why}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

const SPLIT_COUNT = routeNodes.filter((n) => n.kind === "split").length;

export default function LevelFlow() {
  return (
    <div className="lf">
      <div className="panel lf-console">
        <div className="lf-console-head">
          <p className="mono lf-console-tag">Level 1 · Central Bank</p>
        </div>

        {/* 1 — the route */}
        <section className="lf-band">
          <div className="lf-band-head">
            <h3 className="lf-band-title">The Floor Plan</h3>
          </div>
          <div
            className="lf-screen lf-ribbon-scroll"
            role="group"
            aria-label="Route diagram, scrolls horizontally"
            tabIndex={0}
          >
            <RouteRibbon />
          </div>
          <p className="mono mono-note lf-scroll-note">Scroll the plan sideways to follow the route →</p>
        </section>

        {/* 2 — the pacing curve */}
        <section className="lf-band">
          <div className="lf-band-head">
            <h3 className="lf-band-title">The Pacing Curve</h3>
          </div>
          <div className="lf-screen">
            <TensionCurve />
          </div>
        </section>

        {/* 3 — the stage breakdown */}
        <section className="lf-band">
          <div className="lf-band-head">
            <h3 className="lf-band-title">The Stage Breakdown</h3>
          </div>
          <StagePanels />
        </section>
      </div>

      <style>{`
        .lf {
          /* --color-silver is this route's amber (#E5B54D): the layout scopes
             it, so the accent is the token, not a hard-coded hex. 9.2:1 on the
             screens below. */
          --lf-amber: var(--color-silver);
          /* Mist is 4.2:1 on the bezel and 4.63:1 on a screen — under, and only
             just over, the 4.5 bar. Blended toward moonlight the small mono
             type clears it everywhere: 7.7:1 on the bezel, 7.9:1 on a screen. */
          --lf-quiet: color-mix(in srgb, var(--color-mist) 55%, var(--color-moonlight));
          --lf-edge: color-mix(in srgb, var(--color-mist) 30%, transparent);
          --lf-screen: var(--color-void);
        }

        /* Same breakout as the role graph: the section column caps at 68rem,
           which is narrower than a nine-column floor plan wants. The parent is
           centred, so 50% is the page's centre line; the lead/tail pair is in
           globals.css under THE RIGHT GUTTER, and keeps the plan clear of the
           project rail. */
        @media (min-width: 900px) {
          .lf {
            width: var(--breakout-w);
            margin-left: calc(50% - var(--breakout-lead));
            margin-right: calc(50% - var(--breakout-tail));
          }
        }

        /* ---- the bezel ---- */
        .lf-console {
          border: 1px solid var(--lf-edge);
          padding: 1.25rem;
          display: grid;
          gap: 1.75rem;
        }

        .lf-console-head {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: baseline;
          gap: 0.5rem 1.5rem;
          padding-bottom: 0.85rem;
          border-bottom: 1px solid var(--lf-edge);
        }
        .lf-console-tag {
          margin: 0;
          font-size: 0.72rem;
          color: var(--lf-amber);
        }
        .lf-console-meta {
          margin: 0;
          font-size: 0.68rem;
          color: var(--lf-quiet);
        }

        .lf-band { display: grid; gap: 0.75rem; }
        .lf-band-head {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: baseline;
          gap: 0.35rem 1.5rem;
        }
        .lf-band-title {
          font-family: var(--font-hero);
          font-size: 1rem;
          letter-spacing: 0.04em;
          margin: 0;
          color: var(--color-moonlight);
        }
        .lf-band-meta {
          margin: 0;
          font-size: 0.72rem;
          color: var(--lf-quiet);
        }

        /* Every drawing sits on a screen: one shade below the bezel, hairline
           framed. Three screens in one instrument. */
        .lf-screen {
          background: var(--lf-screen);
          border: 1px solid var(--lf-edge);
        }

        /* ---- 1 · route ribbon ----
           Below about 1180px the plan scrolls rather than shrinking: at 1120px
           the labels are still 10px, and under that they stop being readable
           long before the diagram stops being pretty. */
        .lf-ribbon-scroll { overflow-x: auto; overscroll-behavior-x: contain; }
        .lf-ribbon-scroll:focus-visible {
          outline: 2px solid var(--color-lunar-gold);
          outline-offset: 2px;
        }
        .lf-ribbon {
          display: block;
          width: 100%;
          min-width: 1120px;
          height: auto;
        }
        .lf-scroll-note {
          display: none;
          margin: 0;
          font-size: 0.71rem;
          color: var(--lf-quiet);
        }
        @media (max-width: 1180px) {
          .lf-scroll-note { display: block; }
        }

        .lf-field { fill: var(--lf-screen); }
        .lf-field-grid { fill: url(#lf-grid); opacity: 0.5; }
        .lf-gridline {
          stroke: color-mix(in srgb, var(--color-mist) 16%, transparent);
          stroke-width: 0.5;
        }

        .lf-conduit {
          fill: none;
          stroke: color-mix(in srgb, var(--color-mist) 72%, var(--color-moonlight));
          stroke-width: 1.4;
        }
        .lf-arrowhead { fill: color-mix(in srgb, var(--color-mist) 72%, var(--color-moonlight)); }

        .lf-space-body { fill: color-mix(in srgb, var(--color-moonlight) 4%, var(--lf-screen)); }
        .lf-space-frame { fill: none; stroke: var(--lf-edge); stroke-width: 1; }
        .lf-space-label {
          font-family: var(--font-mono);
          font-size: ${R_LABEL}px;
          letter-spacing: 0.04em;
          fill: var(--color-moonlight);
        }
        .lf-space-tag {
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 0.14em;
          fill: var(--lf-quiet);
        }

        /* The two ends of the run carry the accent: where you go in, and what
           you came for. The splits get a brighter frame than a plain beat so
           the branch points read at a glance. */
        .lf-space.is-split .lf-space-frame,
        .lf-space.is-merge .lf-space-frame {
          stroke: color-mix(in srgb, var(--color-mist) 62%, transparent);
        }
        .lf-space.is-entry .lf-space-tag { fill: var(--lf-amber); }
        .lf-space.is-goal .lf-space-frame { stroke: var(--lf-amber); stroke-width: 1.6; }
        .lf-space.is-goal .lf-space-body {
          fill: color-mix(in srgb, var(--lf-amber) 12%, var(--lf-screen));
        }
        .lf-space.is-goal .lf-space-label { fill: var(--lf-amber); }
        .lf-space.is-goal .lf-space-tag { fill: var(--lf-amber); }

        /* ---- 2 · pacing curve ---- */
        .lf-chart { margin: 0; display: grid; }
        .lf-plot {
          position: relative;
          height: clamp(180px, 19vw, 290px);
        }
        .lf-plot-svg { display: block; width: 100%; height: 100%; }

        .lf-grid {
          stroke: color-mix(in srgb, var(--color-mist) 20%, transparent);
          stroke-width: 1;
        }
        .lf-grid.is-base { stroke: color-mix(in srgb, var(--color-mist) 40%, transparent); }
        .lf-stem {
          stroke: color-mix(in srgb, var(--color-mist) 30%, transparent);
          stroke-width: 1;
        }

        .lf-wash-top {
          stop-color: var(--lf-amber);
          stop-opacity: 0.16;
        }
        .lf-wash-base {
          stop-color: var(--lf-amber);
          stop-opacity: 0.01;
        }

        .lf-curve {
          stroke: var(--lf-amber);
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        /* Zero-length round caps: a 9px dot and a 13px collar of the screen
           colour behind it, both immune to the plot's stretch. */
        .lf-marker-ring {
          stroke: var(--lf-screen);
          stroke-width: 13;
          stroke-linecap: round;
        }
        .lf-marker {
          stroke: color-mix(in srgb, var(--lf-amber) 55%, var(--lf-screen));
          stroke-width: 9;
          stroke-linecap: round;
        }
        .lf-marker.is-marked { stroke: var(--lf-amber); }

        /* Axis text is HTML, so it never inherits the plot's scale. */
        .lf-y-label {
          position: absolute;
          left: 0.5rem;
          transform: translateY(-100%);
          padding-bottom: 0.2rem;
          font-size: 0.70rem;
          color: var(--lf-quiet);
          pointer-events: none;
        }
        .lf-note {
          position: absolute;
          transform: translate(-50%, -100%);
          padding-bottom: 0.55rem;
          font-size: 0.68rem;
          color: var(--color-moonlight);
          white-space: nowrap;
          pointer-events: none;
        }
        /* A label centred on the last point would hang off the right edge, so
           that one hangs from its right side instead. */
        .lf-note.is-right { transform: translate(0, -100%); }

        .lf-axis {
          display: grid;
          grid-template-columns: repeat(${tensionPoints.length}, minmax(0, 1fr));
          border-top: 1px solid var(--lf-edge);
        }
        .lf-axis-cell {
          display: block;
          padding: 0.5rem 0.4rem 0.7rem;
          text-align: center;
          min-width: 0;
        }
        .lf-axis-num {
          display: none;
          font-size: 0.70rem;
          color: var(--lf-quiet);
        }
        .lf-axis-name {
          display: block;
          font-size: 0.72rem;
          color: var(--color-moonlight);
          line-height: 1.35;
        }
        .lf-axis-exp {
          display: block;
          margin-top: 0.2rem;
          font-size: 0.70rem;
          color: var(--lf-quiet);
          line-height: 1.35;
        }

        .lf-caption {
          margin: 0;
          padding: 0.85rem 0.9rem 0;
          border-top: 1px solid var(--lf-edge);
          font-family: var(--font-body);
          font-size: 0.86rem;
          line-height: 1.55;
          color: var(--color-moonlight);
          max-width: 62rem;
        }

        /* ---- 3 · stage panels ----
           One-pixel gaps over the edge colour: the dividers are the grid, not a
           border on each panel, which keeps the five columns exactly the width
           the curve's five slots are — so every marker stands over its stage. */
        .lf-stages {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(${levelStages.length}, minmax(0, 1fr));
          gap: 1px;
          background: var(--lf-edge);
          border: 1px solid var(--lf-edge);
        }
        .lf-stage {
          background: var(--lf-screen);
          padding: 1rem 0.9rem 1.1rem;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          min-width: 0;
        }

        .lf-stage-kicker {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: baseline;
          gap: 0.3rem 0.6rem;
          margin: 0;
          font-size: 0.70rem;
          color: var(--lf-quiet);
        }
        .lf-stage-mech { color: var(--color-moonlight); }
        .lf-stage-name {
          font-family: var(--font-hero);
          font-size: 1.05rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          margin: 0;
          color: var(--color-moonlight);
        }

        .lf-field { display: grid; gap: 0.22rem; }
        .lf-field-label {
          margin: 0;
          font-size: 0.68rem;
          color: var(--lf-amber);
        }
        .lf-objective {
          margin: 0;
          font-family: var(--font-body);
          font-size: 0.84rem;
          line-height: 1.45;
          color: var(--color-moonlight);
        }
        .lf-role {
          margin: 0;
          font-size: 0.7rem;
          color: var(--lf-quiet);
        }
        .lf-role.is-role { color: var(--lf-amber); }

        .lf-hazards {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 0.3rem;
        }
        .lf-hazard {
          font-size: 0.70rem;
          padding: 0.2rem 0.42rem;
          border: 1px solid color-mix(in srgb, var(--color-mist) 34%, transparent);
          color: var(--lf-quiet);
          line-height: 1.35;
        }

        /* Pinned to the bottom so the experience tag and the meter line up
           across all five panels however long the copy above them runs. */
        .lf-stage-foot {
          margin-top: auto;
          padding-top: 0.8rem;
          display: grid;
          gap: 0.4rem;
        }
        .lf-exp {
          margin: 0;
          font-size: 0.71rem;
          color: var(--color-moonlight);
        }
        .lf-meter {
          height: 3px;
          background: color-mix(in srgb, var(--color-mist) 26%, transparent);
        }
        .lf-meter-fill { display: block; height: 100%; background: var(--lf-amber); }
        .lf-meter-read {
          margin: 0;
          font-size: 0.68rem;
          color: var(--lf-quiet);
        }
        /* --lf-quiet is 7.9:1 on a screen, so it clears AA comfortably at this
           size. Body face rather than mono: it is a sentence, not a readout. */
        .lf-why {
          margin: 0.15rem 0 0;
          font-family: var(--font-body);
          font-size: 0.8rem;
          line-height: 1.45;
          color: var(--lf-quiet);
        }

        /* ---- responsive ----
           The five-across grid is what aligns the panels with the curve, so it
           is held as long as a column can still carry a sentence. Below that
           the alignment is gone anyway and the panels are better as cards. */
        @media (max-width: 1100px) {
          .lf-stages { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 700px) {
          .lf-console { padding: 0.9rem; }
          .lf-stages { grid-template-columns: minmax(0, 1fr); }
          /* No room for five names side by side: the axis keeps the numbers,
             and the panels below carry the names in full. */
          .lf-axis-name,
          .lf-axis-exp { display: none; }
          .lf-axis-num { display: block; }
          .lf-axis-cell { padding: 0.45rem 0.2rem 0.55rem; }
          .lf-caption { padding-inline: 0.5rem; font-size: 0.82rem; }
        }
        @media (max-width: 900px) and (min-width: 701px) {
          .lf-axis-exp { display: none; }
        }
      `}</style>
    </div>
  );
}
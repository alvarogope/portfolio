import {
  DEFAULT_ROLE,
  breakInRoles,
  connectedRoles,
  getRole,
  incomingLinks,
  linkTypeMeta,
  linkTypeOrder,
  linkTouches,
  outgoingLinks,
  roleLinks,
  type BreakInRole,
  type LinkType,
  type RoleId,
} from "@/content/break-in-roles";

/**
 * Break-In — "Nobody wins alone": the role interdependency diagram.
 *
 * The four roles sit in a diamond and the dependencies between them are drawn
 * as right-angle conduit, the way wiring is drawn on a security panel. Each
 * node is dressed as a camera feed (CAM tag, REC light, scanlines), and a
 * readout panel beside the diamond expands whichever role is selected into its
 * summary, its abilities, and the two lists that carry the thesis: what it
 * NEEDS, and what it gives.
 *
 * STAGE 1 is static. `selected` is a prop with a default rather than state, so
 * this renders on the server with no client JS — but every piece the
 * interactive version needs is already here: the highlight is a pure function
 * of `selected` (`linkTouches` / `connectedRoles`), and each node and wire
 * already carries its own `is-selected` / `is-active` / `is-dim` class.
 * Stage 2 only has to add `"use client"`, lift `selected` into `useState`, and
 * hang pointer/focus handlers on the `<g class="rg-node">` groups.
 *
 * GEOMETRY lives here, not in the data file. The wires are hand-routed rather
 * than solved: with seven links, four nodes and a label on every one, an
 * automatic router costs more than it saves, and the lanes below are chosen so
 * that no two conduits cross and no label plate lands on a wire it does not
 * belong to.
 */

/* ---- stage geometry ----------------------------------------------------
   Two numbers set everything. Rendered type = unit size * (stage_px / VB_W),
   and rendered height = stage_px * (VB_H / VB_W).

   A near-square viewBox ties those together: any width that made the labels
   readable also made the stage over 1000px tall. So the box is landscape
   (1.49:1) instead. The diamond is wide and shallow — the vertical gaps hold
   exactly one label plate each, the horizontal ones have room to spare — which
   buys a ~630px-tall stage at a scale of ~1.1, i.e. the section fits a desktop
   screen with the type still comfortably above 12px. */
const VB_W = 860;
const VB_H = 576;

/** VB_W / VB_H. The stage's max-width is derived from this so a short viewport shrinks it. */
const STAGE_ASPECT = (VB_W / VB_H).toFixed(4);

const NODE_W = 200;
const NODE_H = 92;
const HEADER_H = 20;

/** Diamond: Insider top, Hacker right, Vaultsnatcher bottom, Lockpicker left. */
const NODE_POS: Record<RoleId, { x: number; y: number }> = {
  insider: { x: 430, y: 80 },
  hacker: { x: 710, y: 275 },
  lockpicker: { x: 150, y: 275 },
  vaultsnatcher: { x: 430, y: 466 },
};

/** The escape-route bus: a perimeter conduit outside the diamond, plus one spur into each node. */
const RING_D = "M 14 12 H 846 V 536 H 14 Z";

interface WireRun {
  d: string;
  /** False for the perimeter bus itself, which terminates at its spurs rather than at a node. */
  arrow: boolean;
}

interface WireGeo {
  runs: WireRun[];
  /** Centre of the label plate. Sits on one of the run segments it belongs to. */
  label: { x: number; y: number };
}

/* Every route is an L or a Z between two node edges. Lanes were picked so the
   six pairwise wires never cross each other or the perimeter bus: the two
   Insider/Hacker wires nest in the top-right quadrant, the two
   Lockpicker/Vaultsnatcher wires nest bottom-left, and Hacker to Lockpicker
   runs straight through the middle as the spine. */
const WIRES: Record<string, WireGeo> = {
  "insider-hacker": {
    runs: [{ d: "M 530 100 H 660 V 229", arrow: true }],
    label: { x: 660, y: 165 },
  },
  "hacker-insider": {
    runs: [{ d: "M 780 229 V 56 H 530", arrow: true }],
    label: { x: 655, y: 56 },
  },
  "hacker-lockpicker": {
    runs: [{ d: "M 610 275 H 250", arrow: true }],
    label: { x: 430, y: 275 },
  },
  "hacker-vaultsnatcher": {
    runs: [{ d: "M 710 321 V 458 H 530", arrow: true }],
    label: { x: 710, y: 385 },
  },
  "lockpicker-vaultsnatcher": {
    runs: [{ d: "M 150 321 V 444 H 330", arrow: true }],
    label: { x: 166, y: 383 },
  },
  "vaultsnatcher-lockpicker": {
    runs: [{ d: "M 330 492 H 96 V 321", arrow: true }],
    label: { x: 230, y: 492 },
  },
  "insider-all": {
    runs: [
      { d: RING_D, arrow: false },
      { d: "M 430 12 V 34", arrow: true },
      { d: "M 846 275 H 810", arrow: true },
      { d: "M 430 536 V 512", arrow: true },
      { d: "M 14 275 H 50", arrow: true },
    ],
    label: { x: 100, y: 536 },
  },
};

/* ---- wire label typography ----
   Plate width is measured from the longest wrapped line. JetBrains Mono
   advances at 0.6em, so 11px type is 6.6 units per character. Dropping the
   wrap from 22 characters to 16 buys the larger type for free: every plate
   still comes in under 122 units wide — the clearance the lanes above were
   laid out against — and pays for it in height, which the stage has to spare. */
const LABEL_FONT = 11;
const LABEL_CHAR_W = LABEL_FONT * 0.6;
const LABEL_LINE_H = 14;
const LABEL_WRAP = 16;

function wrapLabel(text: string, max = LABEL_WRAP): string[] {
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

/** Camera-framing brackets, drawn at the four corners of a node. */
const CORNERS = [
  "M 3 12 V 3 H 12",
  `M ${NODE_W - 12} 3 H ${NODE_W - 3} V 12`,
  `M 3 ${NODE_H - 12} V ${NODE_H - 3} H 12`,
  `M ${NODE_W - 3} ${NODE_H - 12} V ${NODE_H - 3} H ${NODE_W - 12}`,
];

type NodeState = "selected" | "linked" | "dim";

/** The escape bus is a `protects` link, but it takes its own colour: it is the one line all four share. */
const wireKind = (id: string, type: LinkType) => (id === "insider-all" ? "escape" : type);

function FeedNode({ role, state }: { role: BreakInRole; state: NodeState }) {
  const pos = NODE_POS[role.id];
  const nx = pos.x - NODE_W / 2;
  const ny = pos.y - NODE_H / 2;

  return (
    <g className={`rg-node is-${state}`} transform={`translate(${nx} ${ny})`}>
      <rect className="rg-node-body" width={NODE_W} height={NODE_H} />
      <rect
        className="rg-node-scan"
        x="1"
        y={HEADER_H}
        width={NODE_W - 2}
        height={NODE_H - HEADER_H - 1}
      />
      <rect className="rg-node-head" width={NODE_W} height={HEADER_H} />
      <line className="rg-node-rule" x1="0" y1={HEADER_H} x2={NODE_W} y2={HEADER_H} />

      <text className="rg-cam" x="11" y="14">
        {role.cam}
      </text>
      <circle className="rg-rec-dot" cx="160" cy="10" r="2.6" />
      <text className="rg-rec" x="189" y="14" textAnchor="end">
        REC
      </text>

      <text className="rg-wm" x="184" y="80" textAnchor="end">
        {role.orbitLabel}
      </text>
      <text className="rg-name" x="12" y="52">
        {role.name.toUpperCase()}
      </text>
      <text className="rg-loc" x="12" y="72">
        {role.location.toUpperCase()}
      </text>

      {CORNERS.map((d) => (
        <path key={d} className="rg-node-corner" d={d} />
      ))}
      <rect
        className="rg-node-frame"
        x="0.5"
        y="0.5"
        width={NODE_W - 1}
        height={NODE_H - 1}
      />
    </g>
  );
}

function WireTag({ x, y, text }: { x: number; y: number; text: string }) {
  const lines = wrapLabel(text);
  const longest = lines.reduce((n, l) => Math.max(n, l.length), 0);
  const w = longest * LABEL_CHAR_W + 16;
  const h = lines.length * LABEL_LINE_H + 10;
  const top = y - h / 2;

  return (
    <g className="rg-tag">
      <rect className="rg-tag-plate" x={x - w / 2} y={top} width={w} height={h} />
      <text className="rg-tag-text" x={x} y={top + LABEL_LINE_H - 1} textAnchor="middle">
        {lines.map((line, i) => (
          <tspan key={line} x={x} dy={i === 0 ? 0 : LABEL_LINE_H}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}

/** One dependency, as it reads in the readout panel and in the roster. */
function LinkRow({
  type,
  who,
  label,
}: {
  type: LinkType | "escape";
  who: string;
  label: string;
}) {
  return (
    <li className="rg-row">
      <span className={`rg-row-rule rg-row-rule--${type}`} aria-hidden="true" />
      <span className="rg-row-body">
        <span className="mono rg-row-who">{who}</span>
        <span className="rg-row-label">{label}</span>
      </span>
    </li>
  );
}

function NeedsList({ id }: { id: RoleId }) {
  const rows = incomingLinks(id);
  if (rows.length === 0) return <p className="rg-row-empty">Needs nothing to start.</p>;
  return (
    <ul className="rg-rows">
      {rows.map(({ link, source }) => (
        <LinkRow
          key={link.id}
          type={wireKind(link.id, link.type)}
          who={`From · ${source.name}`}
          label={link.label}
        />
      ))}
    </ul>
  );
}

function GivesList({ id }: { id: RoleId }) {
  const rows = outgoingLinks(id);
  if (rows.length === 0) return <p className="rg-row-empty">Gives nothing on its own.</p>;
  return (
    <ul className="rg-rows">
      {rows.map(({ link, targets }) => (
        <LinkRow
          key={link.id}
          type={wireKind(link.id, link.type)}
          who={targets.length > 1 ? "To · Every role" : `To · ${targets[0].name}`}
          label={link.label}
        />
      ))}
    </ul>
  );
}

function Tags({ abilities }: { abilities: readonly string[] }) {
  return (
    <ul className="rg-tags">
      {abilities.map((a) => (
        <li key={a} className="mono rg-tag-pill">
          {a}
        </li>
      ))}
    </ul>
  );
}

export default function RoleGraph({
  selected = DEFAULT_ROLE,
}: {
  /**
   * The role the readout expands and the graph highlights around.
   * Stage 1 passes nothing and gets the Hacker, the hub of the web.
   */
  selected?: RoleId;
}) {
  const role = getRole(selected);
  const linked = connectedRoles(selected);

  const nodeState = (id: RoleId): NodeState =>
    id === selected ? "selected" : linked.has(id) ? "linked" : "dim";

  return (
    <div className="rg">
      {/* The diagram is decorative: everything in it is spelled out in the
          roster below, which is the text equivalent screen readers get. */}
      <div className="rg-stage">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <pattern id="rg-grid" width="28" height="28" patternUnits="userSpaceOnUse">
              <path className="rg-gridline" d="M 28 0 H 0 V 28" fill="none" />
            </pattern>
            <pattern id="rg-scan" width="4" height="3" patternUnits="userSpaceOnUse">
              <rect className="rg-scanline" width="4" height="1" />
            </pattern>
            {(["unlocks", "enables", "protects", "escape"] as const).map((kind) => (
              <marker
                key={kind}
                id={`rg-arrow-${kind}`}
                viewBox="0 0 8 8"
                refX="7.2"
                refY="4"
                markerWidth="8"
                markerHeight="8"
                markerUnits="userSpaceOnUse"
                orient="auto"
              >
                <path className={`rg-head rg-head--${kind}`} d="M 0 0 L 8 4 L 0 8 Z" />
              </marker>
            ))}
          </defs>

          <rect className="rg-field" width={VB_W} height={VB_H} />
          <rect className="rg-field-grid" width={VB_W} height={VB_H} />

          {roleLinks.map((link) => {
            const geo = WIRES[link.id];
            const kind = wireKind(link.id, link.type);
            const active = linkTouches(link, selected);
            return (
              <g
                key={link.id}
                className={`rg-wire rg-wire--${kind} ${active ? "is-active" : "is-dim"}`}
              >
                {geo.runs.map((run) => (
                  <path
                    key={run.d}
                    className="rg-wire-line"
                    d={run.d}
                    markerEnd={run.arrow ? `url(#rg-arrow-${kind})` : undefined}
                  />
                ))}
                <WireTag x={geo.label.x} y={geo.label.y} text={link.label} />
              </g>
            );
          })}

          {breakInRoles.map((r) => (
            <FeedNode key={r.id} role={r} state={nodeState(r.id)} />
          ))}
        </svg>
      </div>

      {/* The roster. Visually hidden beside the diagram on desktop, where it is
          the diagram text equivalent; below 900px it *replaces* the diagram as
          four stacked feed cards, because a diamond graph does not survive a
          360px viewport. Same data, same links, no SVG. */}
      <ol className="rg-roster">
        {breakInRoles.map((r) => (
          <li key={r.id} className={`panel rg-card ${r.id === selected ? "is-selected" : ""}`}>
            <p className="mono rg-card-cam">
              <span>
                {r.orbitLabel} · {r.cam} · {r.location}
              </span>
              <span className="rg-card-rec">
                <span className="rg-card-dot" aria-hidden="true" />
                REC
              </span>
            </p>
            <h3 className="rg-card-name">{r.name}</h3>
            <p className="rg-card-summary">{r.summary}</p>
            <Tags abilities={r.abilities} />
            <div className="rg-card-links">
              <p className="mono rg-list-title">Needs (incoming)</p>
              <NeedsList id={r.id} />
              <p className="mono rg-list-title">Enables / Protects (outgoing)</p>
              <GivesList id={r.id} />
            </div>
          </li>
        ))}
      </ol>

      {/* The line key belongs to the graph, not to the selected role, so it
          sits under the stage as a strip rather than stacked in the panel —
          which is also what stops the panel from being the tallest thing on
          screen. */}
      <div className="rg-key">
        <p className="mono rg-list-title rg-key-title">Line key</p>
        <ul className="rg-legend">
          {linkTypeOrder.map((type) => (
            <li key={type} className="rg-legend-row">
              <span className={`rg-row-rule rg-row-rule--${type}`} aria-hidden="true" />
              <span className="mono rg-legend-term">{linkTypeMeta[type].term}</span>
              <span className="rg-legend-gloss">{linkTypeMeta[type].gloss}</span>
            </li>
          ))}
          <li className="rg-legend-row">
            <span className="rg-row-rule rg-row-rule--escape" aria-hidden="true" />
            <span className="mono rg-legend-term">Escape</span>
            <span className="rg-legend-gloss">the one line all four are on</span>
          </li>
        </ul>
      </div>

      <aside className="panel rg-panel">
        <div className="rg-panel-detail">
          <p className="mono rg-panel-kicker">
            Readout · {role.orbitLabel} · {role.cam} · {role.location}
          </p>
          <h3 className="rg-panel-name">{role.name}</h3>
          <p className="rg-panel-summary">{role.summary}</p>
          <Tags abilities={role.abilities} />

          <p className="mono rg-list-title">Needs (incoming)</p>
          <NeedsList id={selected} />

          <p className="mono rg-list-title">Enables / Protects (outgoing)</p>
          <GivesList id={selected} />
        </div>

        <p className="rg-thesis">Nobody wins alone</p>
      </aside>

      <style>{`
        .rg {
          /* Small mono type on this page near-black needs lifting off
             --color-mist: mist is 4.28:1 on the feed fill, under the 4.5 bar.
             Blended 45% toward moonlight it reads 7.9:1 on the feed and
             7.7:1 on .panel, which covers every use below. */
          --rg-quiet: color-mix(in srgb, var(--color-mist) 55%, var(--color-moonlight));
          /* The camera feed itself: a hair above the page, so a node reads as
             a lit monitor rather than a hole. */
          --rg-feed: color-mix(in srgb, var(--color-moonlight) 5%, var(--color-void));
          --rg-steel: color-mix(in srgb, var(--color-mist) 85%, var(--color-moonlight));
          --rg-edge: color-mix(in srgb, var(--color-mist) 34%, transparent);
          --rg-dim: 0.55;

          position: relative;
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          align-items: start;
        }

        /* The diagram is the page's centrepiece and the section column caps at
           68rem, which left the stage ~696px — near 1:1 against the viewBox,
           i.e. 8.5px type on screen. This breaks .rg out of that column (the
           parent is centred, so 50% - half the target width lands it back on
           the viewport centre) and buys the stage the width the type needs.
           Capped at 82rem: past that the stage grows taller than a desktop
           screen without the labels getting usefully bigger. */
        @media (min-width: 900px) {
          .rg {
            width: min(92vw, 82rem);
            margin-left: calc(50% - min(46vw, 41rem));
            margin-right: calc(50% - min(46vw, 41rem));
          }

          /* Second guard, for short viewports rather than narrow ones: the
             stage is as wide as its own height budget allows, so a 1440x800
             screen shrinks the box instead of pushing the readout off-screen.
             Width, not max-height, so the SVG scales rather than letterboxing. */
          .rg-stage {
            max-width: calc(80vh * ${STAGE_ASPECT});
            margin-inline: auto;
            width: 100%;
          }
        }

        /* ---- stage ---- */
        .rg-stage {
          border: 1px solid var(--rg-edge);
          background: var(--color-void);
          overflow: hidden;
        }
        .rg-stage svg { display: block; width: 100%; height: auto; }

        .rg-field { fill: var(--color-void); }
        .rg-field-grid { fill: url(#rg-grid); opacity: 0.5; }
        .rg-gridline {
          stroke: color-mix(in srgb, var(--color-mist) 16%, transparent);
          stroke-width: 0.5;
        }
        .rg-scanline { fill: color-mix(in srgb, var(--color-void) 80%, transparent); }

        /* ---- conduit ----
           Line style carries the relationship; only the escape bus takes a
           colour of its own. Dotted is drawn with round caps and a zero-length
           dash so the dots stay round through the elbows. */
        .rg-wire-line { fill: none; }

        .rg-wire--unlocks .rg-wire-line { stroke: var(--color-silver); stroke-width: 1.6; }
        .rg-wire--unlocks .rg-head { fill: var(--color-silver); }

        .rg-wire--enables .rg-wire-line {
          stroke: var(--rg-steel);
          stroke-width: 1.4;
          stroke-dasharray: 7 5;
        }
        .rg-wire--enables .rg-head { fill: var(--rg-steel); }

        .rg-wire--protects .rg-wire-line {
          stroke: var(--color-mist);
          stroke-width: 1.8;
          stroke-dasharray: 0.1 5;
          stroke-linecap: round;
        }
        .rg-wire--protects .rg-head { fill: var(--color-mist); }

        .rg-wire--escape .rg-wire-line {
          stroke: var(--color-scarlet);
          stroke-width: 1.8;
          stroke-dasharray: 0.1 5;
          stroke-linecap: round;
        }
        .rg-wire--escape .rg-head { fill: var(--color-scarlet); }

        /* The highlight. Stage 1 fixes which wires are lit; Stage 2 changes
           the selected role and these same two classes do the work. */
        .rg-wire { transition: opacity 320ms cubic-bezier(0.22, 1, 0.36, 1); }
        .rg-wire.is-dim { opacity: var(--rg-dim); }
        .rg-wire.is-active { opacity: 1; }

        .rg-tag-plate {
          fill: var(--color-void);
          stroke: color-mix(in srgb, var(--color-mist) 24%, transparent);
          stroke-width: 1;
        }
        .rg-wire.is-active .rg-tag-plate {
          stroke: color-mix(in srgb, var(--color-mist) 44%, transparent);
        }
        .rg-tag-text {
          font-family: var(--font-mono);
          font-size: ${LABEL_FONT}px;
          letter-spacing: 0.02em;
          fill: var(--rg-quiet);
        }
        .rg-wire--unlocks.is-active .rg-tag-text { fill: var(--color-silver); }

        /* ---- camera feeds ---- */
        .rg-node-body { fill: var(--rg-feed); }
        .rg-node-scan { fill: url(#rg-scan); }
        .rg-node-head { fill: color-mix(in srgb, var(--color-moonlight) 7%, transparent); }
        .rg-node-rule { stroke: var(--rg-edge); stroke-width: 1; }
        .rg-node-frame { fill: none; stroke: var(--rg-edge); stroke-width: 1; }
        .rg-node-corner {
          fill: none;
          stroke: color-mix(in srgb, var(--color-mist) 55%, transparent);
          stroke-width: 1.2;
        }

        .rg-cam,
        .rg-loc {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.12em;
          fill: var(--rg-quiet);
        }
        .rg-loc { font-size: 9px; }

        .rg-rec {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          /* Scarlet at full strength is 4.28:1 on the feed; lifted toward
             moonlight it clears AA at 5.9:1 and still reads as red. */
          fill: color-mix(in srgb, var(--color-scarlet) 70%, var(--color-moonlight));
        }
        .rg-rec-dot {
          fill: var(--color-scarlet);
          animation: rg-blink 2.4s steps(1, end) infinite;
        }
        .rg-node.is-dim .rg-rec-dot { animation: none; opacity: 0.5; }

        @keyframes rg-blink {
          0%, 55% { opacity: 1; }
          56%, 100% { opacity: 0.22; }
        }

        .rg-name {
          font-family: var(--font-hero);
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 0.04em;
          fill: var(--color-moonlight);
        }
        /* Channel number, as monitor-wall texture. It sits on the baseline
           band below the role name (cap top 65.6 against a name baseline of
           52) and right of where the longest location string ends, so it
           never has to fight either of them for the same pixels. */
        .rg-wm {
          font-family: var(--font-mono);
          font-size: 20px;
          fill: var(--color-mist);
          opacity: 0.16;
        }

        .rg-node { transition: opacity 320ms cubic-bezier(0.22, 1, 0.36, 1); }
        .rg-node.is-dim { opacity: 0.62; }

        .rg-node.is-selected .rg-node-frame {
          stroke: var(--color-silver);
          stroke-width: 1.6;
        }
        .rg-node.is-selected .rg-node-head {
          fill: color-mix(in srgb, var(--color-silver) 16%, transparent);
        }
        .rg-node.is-selected .rg-name { fill: var(--color-silver); }
        .rg-node.is-selected .rg-node-corner { stroke: var(--color-silver); }
        .rg-node.is-selected .rg-wm { fill: var(--color-silver); opacity: 0.3; }

        .rg-node.is-linked .rg-node-frame {
          stroke: color-mix(in srgb, var(--color-mist) 62%, transparent);
        }

        /* ---- readout panel ---- */
        .rg-panel {
          border: 1px solid var(--rg-edge);
          border-top-color: color-mix(in srgb, var(--color-silver) 45%, transparent);
          padding: 1.3rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .rg-panel-kicker,
        .rg-list-title {
          font-size: 0.72rem;
          color: var(--rg-quiet);
          margin: 0;
        }
        .rg-list-title { color: var(--color-silver); margin-top: 0.85rem; }

        .rg-panel-name {
          font-family: var(--font-hero);
          font-size: var(--text-lg);
          margin: 0.3rem 0 0;
          color: var(--color-silver);
        }
        .rg-panel-summary,
        .rg-card-summary {
          font-family: var(--font-body);
          margin: 0.5rem 0 0;
          font-size: 0.92rem;
          line-height: 1.5;
          color: var(--color-moonlight);
        }

        .rg-tags {
          list-style: none;
          margin: 0.7rem 0 0;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }
        .rg-tag-pill {
          font-size: 0.7rem;
          padding: 0.26rem 0.55rem;
          border: 1px solid color-mix(in srgb, var(--color-silver) 32%, transparent);
          color: var(--color-silver);
          line-height: 1.4;
        }

        .rg-rows { list-style: none; margin: 0.45rem 0 0; padding: 0; display: grid; gap: 0.5rem; }
        .rg-row { display: grid; grid-template-columns: 1.6rem 1fr; gap: 0.6rem; align-items: start; }
        .rg-row-body { display: block; }
        .rg-row-who {
          display: block;
          font-size: 0.66rem;
          color: var(--rg-quiet);
        }
        .rg-row-label {
          display: block;
          font-family: var(--font-body);
          font-size: 0.9rem;
          line-height: 1.45;
          color: var(--color-moonlight);
          margin-top: 0.1rem;
        }
        .rg-row-empty {
          font-family: var(--font-body);
          font-size: 0.88rem;
          color: var(--rg-quiet);
          margin: 0.55rem 0 0;
        }

        /* The legend swatch and the row bullet are the same object: a 1.6rem
           run of the exact line style used on the conduit. */
        .rg-row-rule {
          display: block;
          height: 0;
          width: 1.6rem;
          margin-top: 0.5rem;
        }
        .rg-row-rule--unlocks { border-top: 2px solid var(--color-silver); }
        .rg-row-rule--enables { border-top: 2px dashed var(--rg-steel); }
        .rg-row-rule--protects { border-top: 2px dotted var(--color-mist); }
        .rg-row-rule--escape { border-top: 2px dotted var(--color-scarlet); }

        /* Below 900px this is a stacked list under the roster; from 900 up it
           is one strip beneath the stage, the title sitting inline as the
           first item so the whole key costs ~2 lines instead of ~150px. */
        .rg-key { border-top: 1px solid var(--rg-edge); padding-top: 0.8rem; }
        .rg-key-title { margin-top: 0; }
        .rg-legend { list-style: none; margin: 0.5rem 0 0; padding: 0; display: grid; gap: 0.4rem; }
        .rg-legend-row {
          display: grid;
          grid-template-columns: 1.6rem auto minmax(0, 1fr);
          gap: 0.6rem;
          align-items: baseline;
        }

        @media (min-width: 900px) {
          .rg-key {
            display: flex;
            flex-wrap: wrap;
            align-items: baseline;
            gap: 0.35rem 1.6rem;
          }
          .rg-key-title { flex: 0 0 auto; }
          .rg-legend {
            margin: 0;
            display: flex;
            flex-wrap: wrap;
            gap: 0.35rem 1.6rem;
            flex: 1 1 auto;
          }
          .rg-legend-row {
            grid-template-columns: 1.6rem auto auto;
            gap: 0.5rem;
          }
          .rg-legend-gloss { white-space: nowrap; }
        }
        .rg-legend-row .rg-row-rule { align-self: start; }
        .rg-legend-term { font-size: 0.7rem; color: var(--color-moonlight); }
        .rg-legend-gloss {
          font-family: var(--font-body);
          font-size: 0.82rem;
          color: var(--rg-quiet);
          line-height: 1.4;
        }

        /* Anchors to the bottom of the panel, which stretches to the height of
           the graph column beside it. */
        .rg-thesis {
          margin-top: auto;
          font-family: var(--font-hero);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.22em;
          font-size: 0.88rem;
          color: var(--color-silver);
          margin: 0;
          padding-top: 0.9rem;
          border-top: 1px solid color-mix(in srgb, var(--color-silver) 30%, transparent);
        }

        /* ---- roster ----
           Desktop: the diagram text equivalent, off-screen.
           Below 900px: the diagram itself. */
        .rg-roster { list-style: none; margin: 0; padding: 0; display: grid; gap: 1rem; }

        .rg-card { padding: 1.35rem; border: 1px solid var(--rg-edge); }
        .rg-card.is-selected {
          border-color: color-mix(in srgb, var(--color-silver) 45%, transparent);
        }
        .rg-card-cam {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.68rem;
          color: var(--rg-quiet);
          margin: 0;
          padding-bottom: 0.6rem;
          border-bottom: 1px solid var(--rg-edge);
        }
        .rg-card-rec {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          color: color-mix(in srgb, var(--color-scarlet) 70%, var(--color-moonlight));
          white-space: nowrap;
        }
        .rg-card-dot {
          width: 0.4rem;
          height: 0.4rem;
          border-radius: 50%;
          background: var(--color-scarlet);
          animation: rg-blink 2.4s steps(1, end) infinite;
        }
        .rg-card-name {
          font-family: var(--font-hero);
          font-size: var(--text-lg);
          margin: 0.8rem 0 0;
          color: var(--color-silver);
        }
        .rg-card-links { margin-top: 1.15rem; }

        /* Off-screen for both desktop bands: the diagram carries the picture,
           this carries the same content as text. */
        @media (min-width: 900px) {
          .rg-roster {
            position: absolute;
            width: 1px;
            height: 1px;
            margin: -1px;
            padding: 0;
            overflow: hidden;
            clip-path: inset(50%);
            white-space: nowrap;
            border: 0;
          }
        }

        /* 900-1199: there is not enough width for a diamond AND a side column
           without squeezing the stage back under 700px, so the readout drops
           below and the graph takes the whole width. The stage is larger here
           than it would be in two columns, not smaller. */
        @media (min-width: 900px) and (max-width: 1199px) {
          .rg-stage { grid-column: 1; grid-row: 1; }
          .rg-key { grid-column: 1; grid-row: 2; }
          .rg-panel { grid-column: 1; grid-row: 3; }
          .rg-panel-detail { max-width: 46rem; }
        }

        /* 1200+: the diamond and the readout side by side, as designed, with
           the line key as a strip closing the graph column. */
        @media (min-width: 1200px) {
          .rg {
            grid-template-columns: minmax(0, 1fr) minmax(21rem, 24rem);
            grid-template-rows: auto auto;
            row-gap: 1rem;
          }
          .rg-stage { grid-column: 1; grid-row: 1; }
          .rg-key { grid-column: 1; grid-row: 2; align-self: start; }
          .rg-panel { grid-column: 2; grid-row: 1 / span 2; min-height: 100%; }
        }

        @media (max-width: 899px) {
          /* No diamond below 900px. The four feeds stack, each carrying the
             dependency lists the readout would have shown, so nothing is lost
             and no SVG has to survive a 360px viewport. */
          .rg-stage { display: none; }
          .rg-panel-detail { display: none; }
          .rg-key { margin-top: 0; border-top: 0; padding-top: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .rg-rec-dot,
          .rg-card-dot { animation: none; }
          .rg-wire,
          .rg-node { transition: none; }
        }
      `}</style>
    </div>
  );
}

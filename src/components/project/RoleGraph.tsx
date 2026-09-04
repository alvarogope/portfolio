"use client";

import { useState, useSyncExternalStore } from "react";

import { alarmTriggers, type AlarmTrigger } from "@/content/break-in-detection";
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
  puzzleAsymmetryNote,
  roleLinks,
  selectionRule,
  type BreakInRole,
  type LinkType,
  type RoleAbility,
  type RoleId,
  type RolePuzzle,
} from "@/content/break-in-roles";

/**
 * The traps, by id. The ONLY thing this component takes from the detection
 * file: a T-number and a name, so a counter-link can cite the hazard it
 * answers. Nothing here knows what a trap does, what it costs, or that all
 * three skip the Investigating state — that is the state machine's to say,
 * and saying it twice is how two sections start disagreeing.
 */
const trapById = new Map<string, AlarmTrigger>(alarmTriggers.map((t) => [t.id, t]));

/**
 * Break-In — "Nobody wins alone": the role interdependency diagram.
 *
 * The four roles sit in a diamond and the dependencies between them are drawn
 * as right-angle conduit, the way wiring is drawn on a security panel. Each
 * node is dressed as a camera feed (CAM tag, REC light, scanlines), and a
 * readout panel beside the diamond expands whichever role is selected into its
 * discipline, its summary, its FULL ABILITY KIT, and the two lists that carry
 * the thesis: what it NEEDS, and what it gives.
 *
 * TWO WEBS ON ONE DIAGRAM. The wires answer two different questions and the
 * line styles keep them apart: what a role ENABLES for a teammate (`unlocks`,
 * `enables`) and what it TAKES OFF THAT TEAMMATE'S BOARD (`counters` — one
 * wire per trap, in gold). Both are the same argument. A role you need because
 * it hands you a window and a role you need because it kills the laser you
 * cannot see are equally load-bearing, and a diagram that drew only the first
 * was showing half the reason nobody wins alone.
 *
 * THE TRAPS ARE CITED, NOT EXPLAINED. A counter wire prints the trap's
 * T-number and the counter, and that is the whole of it: what each trap does,
 * what it costs and why it skips Investigating belong to the detection state
 * machine in §05, which is what the pointer under the line key says. This
 * diagram owns who saves you; that one owns what from.
 *
 * THE KIT LIVES IN THIS READOUT, not in a section of its own. The diagram
 * already sends a reader here to find out what a role does, so the detailed
 * answer belongs in the panel they are already looking at; a separate abilities
 * list further down the page would repeat the same four names with none of the
 * dependency context that makes them mean anything. `AbilityKit` below renders
 * it as labelled items rather than pills for the same reason — an ability with
 * a cost attached ("within one second", "three per run") stops being a tag.
 *
 * TUNING NUMBERS sit in their own chip beside the ability name rather than
 * buried in its sentence, so the four kits can be compared as budgets: the
 * Hacker's Vision is five seconds in every thirty-five, the Insider's Disguise
 * ten in every seventy. Only abilities that are actually tuned carry a chip.
 *
 * THE PUZZLE BLOCK closes each readout, and the Insider's says there is no
 * puzzle — which is the point of having it. An empty slot rendered as an empty
 * slot reads as an oversight; rendered as a stated decision it reads as design,
 * so `puzzleAsymmetryNote` is printed under the graph once, for all four.
 *
 * STAGE 2 makes the selection live. It is one piece of state, and click, tap,
 * hover and focus all do the same thing to it — so the ring on the node, the
 * lit conduit and the readout can never disagree. The highlight itself did not
 * change: it was already a pure function of `selected` (`linkTouches` /
 * `connectedRoles`), and every node and wire already carried its own
 * `is-selected` / `is-active` / `is-dim` class.
 *
 * The controls are HTML buttons laid over the drawing rather than the `<g>`
 * groups themselves. The SVG stays decorative and `aria-hidden`, and a real
 * `<button>` brings the tab stop, Enter/Space, the focus ring and a finger-sized
 * target with it — none of which an SVG group gives you the same way across
 * browsers.
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

/* Every route is an L or a Z between two node edges. Lanes were picked so no
   wire crosses another or the perimeter bus: the two Insider/Hacker wires nest
   in the top-right quadrant, the two Lockpicker/Vaultsnatcher wires nest
   bottom-left, and Hacker to Lockpicker runs straight through the middle as
   the spine.

   THE TWO COUNTER WIRES TOOK THE LAST TWO EMPTY LANES, which is why they are
   where they are rather than anywhere prettier. The stage was full: seven
   labelled wires on an 860x576 box leaves two gaps a 122-unit label plate
   fits in. The Hacker's second wire to the Lockpicker runs BELOW the spine at
   y=352 — the band between the spine's plate (which ends at y=301) and the
   Vaultsnatcher's roof (y=420) — so the pair's two wires read as a pair
   without either sitting on the other. The Vaultsnatcher's team-wide counter
   terminates on the escape bus in the bottom-right pocket, the one region
   below y=466 that no wire crosses; landing an arrow on the perimeter rather
   than on three separate nodes is the diagram's own vocabulary for "all", and
   a second full ring 18 units inside the first would have read as a drawing
   error rather than as a second bus. */
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
  /* Down out of the Hacker, west under the spine, up into the Lockpicker. The
     lane at y=352 clears the spine plate above it and the Vaultsnatcher below,
     and stops short of x=710 and x=150 so it crosses neither of the verticals
     dropping past it. */
  "hacker-lockpicker-vision": {
    runs: [{ d: "M 660 321 V 352 H 200 V 321", arrow: true }],
    label: { x: 430, y: 352 },
  },
  /* East out of the vault and down onto the escape bus: the trap this counters
     puts the whole team on a clock, so the wire lands on the line the whole
     team is on. */
  "vaultsnatcher-all": {
    runs: [{ d: "M 530 496 H 764 V 536", arrow: true }],
    label: { x: 647, y: 496 },
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

/* ---- interaction -------------------------------------------------------
   The roster is the diagram's text equivalent on desktop, where it is clipped
   off-screen. Rendering its cards as buttons at that width would put four
   invisible focus stops in the tab order, so the card control only exists in
   the compact band — where the roster *is* the diagram and the stage is
   `display: none`. Exactly one set of role controls is focusable at any width,
   and neither set is ever focusable while it cannot be seen. */
const COMPACT_QUERY = "(max-width: 899px)";

function subscribeCompact(onChange: () => void) {
  const mq = window.matchMedia(COMPACT_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

const getCompact = () => window.matchMedia(COMPACT_QUERY).matches;

/**
 * A node's box as stage percentages. The SVG meets its box exactly — width
 * 100%, height auto, one fixed aspect — so viewBox units map linearly onto the
 * overlay and a hit box stays on its feed at every stage size.
 */
function hitBox(id: RoleId) {
  const pos = NODE_POS[id];
  return {
    left: `${((pos.x - NODE_W / 2) / VB_W) * 100}%`,
    top: `${((pos.y - NODE_H / 2) / VB_H) * 100}%`,
    width: `${(NODE_W / VB_W) * 100}%`,
    height: `${(NODE_H / VB_H) * 100}%`,
  };
}

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

/**
 * One dependency, as it reads in the readout panel and in the roster.
 *
 * A counter-link also prints WHICH trap, as the detection section's own
 * T-number and name. It is a citation and it is deliberately the shortest one
 * that works: "T1 · Lasers" is enough to find the trap in §05, and anything
 * longer would be this component restating a mechanic it does not own.
 */
function LinkRow({
  type,
  who,
  label,
  trap,
}: {
  type: LinkType | "escape";
  who: string;
  label: string;
  trap?: AlarmTrigger;
}) {
  return (
    <li className="rg-row">
      <span className={`rg-row-rule rg-row-rule--${type}`} aria-hidden="true" />
      <span className="rg-row-body">
        <span className="mono rg-row-who">{who}</span>
        <span className="rg-row-label">{label}</span>
        {trap && (
          <span className="mono rg-row-trap">
            Trap {trap.index} · {trap.name}
          </span>
        )}
      </span>
    </li>
  );
}

/** Everything pointing AT this role — both webs, since being covered is a
    dependency exactly like being switched on. */
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
          trap={link.trap ? trapById.get(link.trap) : undefined}
        />
      ))}
    </ul>
  );
}

/**
 * The outgoing links, split by web rather than listed together — which is the
 * text half of what the two line styles do on the diagram. A reader (or a
 * screen reader, which never sees the diagram at all) gets the same two
 * questions answered separately: what does this role switch on, and what does
 * it take off the board.
 */
function GivesList({ id }: { id: RoleId }) {
  const rows = outgoingLinks(id).filter(({ link }) => link.type !== "counters");
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

/**
 * The counter web for one role. The empty case is stated rather than skipped,
 * for the same reason the Insider's missing mini-game is: three of the four
 * roles hold a trap counter, and a role that holds none is a fact about the
 * design, not a gap in the list.
 */
function CountersList({ id }: { id: RoleId }) {
  const rows = outgoingLinks(id).filter(({ link }) => link.type === "counters");
  if (rows.length === 0) {
    return <p className="rg-row-empty">Holds no trap counter.</p>;
  }
  return (
    <ul className="rg-rows">
      {rows.map(({ link, targets }) => (
        <LinkRow
          key={link.id}
          type="counters"
          who={targets.length > 1 ? "For · Every role" : `For · ${targets[0].name}`}
          label={link.label}
          trap={link.trap ? trapById.get(link.trap) : undefined}
        />
      ))}
    </ul>
  );
}

/**
 * The role's mini-game, or the fact that it has none. The absent case is
 * rendered rather than skipped: three of four roles having a puzzle is a
 * decision, and a blank where the fourth would be would read as a gap.
 */
function PuzzleBlock({ puzzle }: { puzzle: RolePuzzle | null }) {
  if (!puzzle) {
    /* Headline only. The full note is printed once under the graph, in the
       design-rules band, because it is an argument about all four roles
       rather than about this one — and rendering both put the same
       paragraph on screen twice whenever the Insider was selected. */
    return (
      <div className="rg-puzzle is-none">
        <p className="mono rg-puzzle-name">No mini-game &mdash; by design</p>
        <p className="rg-puzzle-body">{puzzleAsymmetryNote.headline}, and the reason is under the graph.</p>
      </div>
    );
  }

  return (
    <div className="rg-puzzle">
      <p className="mono rg-puzzle-name">{puzzle.name}</p>
      <p className="rg-puzzle-body">{puzzle.body}</p>
      {puzzle.fail && (
        <p className="rg-puzzle-fail">
          <span className="mono rg-puzzle-fail-label">On a failure</span>
          {puzzle.fail}
        </p>
      )}
    </div>
  );
}

/**
 * A role's full kit. Labelled items, not pills: every one of these abilities
 * carries a cost or a dependency ("three per run", "within one second", "only
 * once the USB lands") and a pill has nowhere to put that.
 */
function AbilityKit({ kit }: { kit: readonly RoleAbility[] }) {
  return (
    <ul className="rg-kit">
      {kit.map((ability) => (
        <li key={ability.name} className="rg-kit-item">
          <p className="mono rg-kit-head">
            <span className="rg-kit-name">{ability.name}</span>
            {/* The tuned numbers, set apart so the kits read as budgets. */}
            {ability.tuning && <span className="rg-kit-tuning">{ability.tuning}</span>}
          </p>
          <p className="rg-kit-body">{ability.body}</p>
          {ability.note && (
            <p className="rg-kit-note">
              <span className="mono rg-kit-note-mark" aria-hidden="true">
                &rsaquo;
              </span>
              {ability.note}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function RoleGraph({
  initialRole = DEFAULT_ROLE,
}: {
  /**
   * The role the readout opens on, before anyone has touched the diagram.
   * The page passes nothing and gets the Hacker, the hub of the web.
   */
  initialRole?: RoleId;
}) {
  const [selected, setSelected] = useState<RoleId>(initialRole);
  const compact = useSyncExternalStore(subscribeCompact, getCompact, () => false);

  const role = getRole(selected);
  const linked = connectedRoles(selected);

  const nodeState = (id: RoleId): NodeState =>
    id === selected ? "selected" : linked.has(id) ? "linked" : "dim";

  /* Hover is sticky: it does not revert on leave, so the picture holds still
     when the pointer wanders off the diamond and there is no flicker crossing
     the gap between two nodes. Touch is left to the click that follows — a
     synthetic pointerenter selecting first would only pick the same role. */
  const hover = (id: RoleId) => (event: React.PointerEvent) => {
    if (event.pointerType !== "touch") setSelected(id);
  };

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
            {(["unlocks", "enables", "counters", "escape"] as const).map((kind) => (
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

        {/* The buttons are transparent and exactly the size of the feed they
            cover; the lit state is drawn by the node underneath. Focus selects
            as well as click, so tabbing through the diamond traces the web the
            same way a pointer does. */}
        <div className="rg-hits" role="group" aria-label="Break-In roles">
          {breakInRoles.map((r) => (
            <button
              key={r.id}
              type="button"
              className="rg-hit"
              style={hitBox(r.id)}
              aria-label={`${r.name} — ${r.location}`}
              aria-pressed={r.id === selected}
              onClick={() => setSelected(r.id)}
              onFocus={() => setSelected(r.id)}
              onPointerEnter={hover(r.id)}
            />
          ))}
        </div>
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
            <h3 className="rg-card-name">
              {compact ? (
                <button
                  type="button"
                  className="rg-card-hit"
                  aria-pressed={r.id === selected}
                  onClick={() => setSelected(r.id)}
                >
                  {r.name}
                  <span className="rg-card-caret" aria-hidden="true" />
                </button>
              ) : (
                r.name
              )}
            </h3>
            <p className="mono rg-discipline">{r.discipline}</p>
            <p className="rg-card-summary">{r.summary}</p>
            <p className="mono rg-list-title">Ability kit</p>
            <AbilityKit kit={r.kit} />
            <p className="mono rg-list-title">Mini-game</p>
            <PuzzleBlock puzzle={r.puzzle} />
            <div className="rg-card-links">
              <p className="mono rg-list-title">Needs (incoming)</p>
              <NeedsList id={r.id} />
              <p className="mono rg-list-title">Gives (outgoing)</p>
              <GivesList id={r.id} />
              <p className="mono rg-list-title">Counters (traps)</p>
              <CountersList id={r.id} />
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
          {/* The escape bus. It is a `protects` link in the data and the only
              one, so it takes its gloss from that type rather than repeating
              it — and its own style, because it is the one line all four are
              on rather than a wire between two of them. */}
          <li className="rg-legend-row">
            <span className="rg-row-rule rg-row-rule--escape" aria-hidden="true" />
            <span className="mono rg-legend-term">Escape</span>
            <span className="rg-legend-gloss">{linkTypeMeta.protects.gloss}</span>
          </li>
        </ul>
        {/* The pointer, and the whole of what this diagram says about trap
            mechanics. One line, on purpose: the moment it explains what a
            laser costs, there are two sections to keep in step instead of
            one. */}
        <p className="rg-key-pointer">
          What each trap does — and what tripping it costs the run — belongs to the detection
          state machine in §05 · Being Seen. The counter wires only say who holds the answer.
        </p>
      </div>

      {/* The lobby rule. It belongs beside the graph rather than in a section
          of its own because it is what makes the graph binding: every wire
          above is a dependency you cannot opt out of by picking a second
          Hacker. */}
      <div className="rg-notes">
        <aside className="rg-note">
          <p className="mono rg-note-tag">Design rule · {selectionRule.headline}</p>
          <p className="rg-note-body">{selectionRule.body}</p>
          <p className="rg-note-credit">{selectionRule.credit}</p>
        </aside>

        {/* The other half of the same argument: the roles are not variants of
            each other, so they do not all get the same furniture. */}
        <aside className="rg-note">
          <p className="mono rg-note-tag">Design rule · {puzzleAsymmetryNote.headline}</p>
          <p className="rg-note-body">{puzzleAsymmetryNote.body}</p>
          <p className="rg-note-credit">{puzzleAsymmetryNote.credit}</p>
        </aside>
      </div>

      <aside className="panel rg-panel">
        {/* Keyed on the role so a change replays the swap rather than editing
            the text in place under the reader's eye. */}
        <div className="rg-panel-detail" key={selected}>
          <p className="mono rg-panel-kicker">
            Readout · {role.orbitLabel} · {role.cam} · {role.location}
          </p>
          <h3 className="rg-panel-name">{role.name}</h3>
          <p className="mono rg-discipline">{role.discipline}</p>
          <p className="rg-panel-summary">{role.summary}</p>

          <p className="mono rg-list-title">Ability kit</p>
          <AbilityKit kit={role.kit} />

          <p className="mono rg-list-title">Mini-game</p>
          <PuzzleBlock puzzle={role.puzzle} />

          <p className="mono rg-list-title">Needs (incoming)</p>
          <NeedsList id={selected} />

          <p className="mono rg-list-title">Gives (outgoing)</p>
          <GivesList id={selected} />

          <p className="mono rg-list-title">Counters (traps)</p>
          <CountersList id={selected} />
        </div>

        <p className="rg-thesis">Nobody wins alone</p>
      </aside>

      {/* The readout is display:none in the compact band and the roster carries
          the detail there, so this one line is what reports a change of
          selection at every width. */}
      <p className="rg-sr-live" role="status">
        {role.name} selected · {role.location}
      </p>

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
          position: relative;
          border: 1px solid var(--rg-edge);
          background: var(--color-void);
          overflow: hidden;
        }
        .rg-stage svg { display: block; width: 100%; height: auto; }

        /* ---- hit boxes ----
           Transparent, and exactly the size of the feed they sit on: there is
           nothing to style here but the pointer, the tap behaviour and the
           focus ring, because the lit state is drawn by the SVG node beneath.
           The ring has room — the nearest node edge is 50 viewBox units in
           from the wall and the stage clips at 0 — so it never gets shaved. */
        .rg-hits { position: absolute; inset: 0; }
        .rg-hit {
          position: absolute;
          appearance: none;
          margin: 0;
          padding: 0;
          border: 0;
          background: none;
          cursor: pointer;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }
        .rg-hit:focus-visible {
          outline: 2px solid var(--color-lunar-gold);
          outline-offset: 3px;
        }

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

        /* The counter web. Gold rather than steel because it answers a
           different question from every other wire on the stage, and dash-dot
           rather than dash or dot because colour is never allowed to be the
           only carrier: at 1px this reads as a marked-off rail even in
           greyscale, which is not true of two dash patterns that differ only
           in length. Gold on the stage is 8.6:1. */
        .rg-wire--counters .rg-wire-line {
          stroke: var(--color-gold);
          stroke-width: 1.7;
          stroke-dasharray: 10 4 2 4;
        }
        .rg-wire--counters .rg-head { fill: var(--color-gold); }

        /* There is no --protects wire style, and nothing is missing: the
           escape route is the only protects link, and it draws as --escape. */

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
        .rg-wire--counters.is-active .rg-tag-text { fill: var(--color-gold); }
        .rg-wire--counters.is-active .rg-tag-plate {
          stroke: color-mix(in srgb, var(--color-gold) 55%, transparent);
        }

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

        /* The swap, replayed by the key on .rg-panel-detail. Short enough to
           read as the panel answering the pointer rather than as an entrance. */
        .rg-panel-detail { animation: rg-swap 200ms cubic-bezier(0.22, 1, 0.36, 1); }

        @keyframes rg-swap {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: none; }
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

        /* The seat's job, sitting directly under the role name in both the
           panel and the roster card. */
        .rg-discipline {
          margin: 0.45rem 0 0;
          font-size: 0.68rem;
          letter-spacing: 0.08em;
          color: var(--color-silver);
        }

        /* ---- ability kit ----
           Replaces the old pill row. Each ability is a name, a body and an
           optional consequence line, so the panel can carry a cost ("within
           one second") that a tag never could. The left rule ties the three
           parts into one item without boxing them. */
        .rg-kit {
          list-style: none;
          margin: 0.5rem 0 0;
          padding: 0;
          display: grid;
          gap: 0.75rem;
        }
        .rg-kit-item {
          padding-left: 0.75rem;
          border-left: 1px solid color-mix(in srgb, var(--color-silver) 30%, transparent);
        }
        .rg-kit-head {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 0.35rem 0.6rem;
          margin: 0;
        }
        .rg-kit-name {
          font-size: 0.72rem;
          letter-spacing: 0.04em;
          color: var(--color-silver);
        }
        /* The tuned numbers. Boxed, so they read as a spec rather than as more
           sentence, and so two roles' budgets can be compared down the column. */
        .rg-kit-tuning {
          font-size: 0.70rem;
          letter-spacing: 0.04em;
          padding: 0.12rem 0.4rem;
          border: 1px solid color-mix(in srgb, var(--color-silver) 30%, transparent);
          color: var(--rg-quiet);
          line-height: 1.35;
          white-space: nowrap;
        }

        /* ---- the mini-game ----
           One block per role, including the role that does not have one. */
        .rg-puzzle {
          margin-top: 0.5rem;
          padding: 0.7rem 0.85rem 0.8rem;
          border: 1px solid var(--rg-edge);
          background: color-mix(in srgb, var(--color-silver) 5%, transparent);
          display: grid;
          gap: 0.25rem;
        }
        /* The absent case is stated, not blank: dashed, so it reads as a
           deliberately empty slot rather than a missing one. */
        .rg-puzzle.is-none {
          background: none;
          border-style: dashed;
        }
        .rg-puzzle-name {
          margin: 0;
          font-size: 0.7rem;
          letter-spacing: 0.06em;
          color: var(--color-silver);
        }
        .rg-puzzle.is-none .rg-puzzle-name { color: var(--rg-quiet); }
        .rg-puzzle-body {
          margin: 0;
          font-family: var(--font-body);
          font-size: 0.84rem;
          line-height: 1.5;
          color: var(--color-moonlight);
        }
        .rg-puzzle.is-none .rg-puzzle-body { color: var(--rg-quiet); }
        .rg-puzzle-fail {
          margin: 0.3rem 0 0;
          padding-top: 0.5rem;
          border-top: 1px solid var(--rg-edge);
          font-family: var(--font-body);
          font-size: 0.8rem;
          line-height: 1.45;
          color: var(--rg-quiet);
        }
        .rg-puzzle-fail-label {
          display: block;
          font-size: 0.68rem;
          letter-spacing: 0.16em;
          color: color-mix(in srgb, var(--color-scarlet) 74%, var(--color-moonlight));
          margin-bottom: 0.12rem;
        }
        .rg-kit-body {
          margin: 0.18rem 0 0;
          font-family: var(--font-body);
          font-size: 0.86rem;
          line-height: 1.5;
          color: var(--color-moonlight);
        }
        .rg-kit-note {
          margin: 0.28rem 0 0;
          font-family: var(--font-body);
          font-size: 0.8rem;
          line-height: 1.45;
          color: var(--rg-quiet);
        }
        .rg-kit-note-mark {
          margin-right: 0.4rem;
          color: var(--color-silver);
        }

        /* ---- the two design rules ----
           Full width under the graph at every band: both are about all four
           roles at once, so they are the two things here not keyed to the
           selection. Side by side where there is room, stacked where there
           is not. */
        .rg-notes {
          display: grid;
          gap: 1rem;
        }
        @media (min-width: 1000px) {
          .rg-notes { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        .rg-note {
          border: 1px solid var(--rg-edge);
          border-left: 2px solid var(--color-silver);
          background: var(--color-nightfall);
          padding: 1.1rem 1.25rem;
          display: grid;
          gap: 0.5rem;
        }
        .rg-note-tag {
          margin: 0;
          font-size: 0.68rem;
          letter-spacing: 0.14em;
          color: var(--color-silver);
        }
        .rg-note-body {
          margin: 0;
          font-family: var(--font-body);
          font-size: 0.88rem;
          line-height: 1.6;
          color: var(--color-moonlight);
          max-width: 54rem;
        }
        .rg-note-credit {
          margin: 0;
          padding-top: 0.6rem;
          border-top: 1px solid var(--rg-edge);
          font-family: var(--font-body);
          font-size: 0.82rem;
          line-height: 1.55;
          color: var(--rg-quiet);
          max-width: 54rem;
        }

        .rg-rows { list-style: none; margin: 0.45rem 0 0; padding: 0; display: grid; gap: 0.5rem; }
        .rg-row { display: grid; grid-template-columns: 1.6rem 1fr; gap: 0.6rem; align-items: start; }
        .rg-row-body { display: block; }
        .rg-row-who {
          display: block;
          font-size: 0.72rem;
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
        .rg-row-rule--escape { border-top: 2px dotted var(--color-scarlet); }
        /* Dash-dot, to match its conduit. A gradient rather than a border,
           because border-style has no dash-dot and the swatch has to be the
           same object as the wire it stands for — a dashed gold swatch beside
           a dash-dot gold wire would make the key the thing you have to
           decode. */
        .rg-row-rule--counters {
          height: 2px;
          background: repeating-linear-gradient(
            to right,
            var(--color-gold) 0 9px,
            transparent 9px 13px,
            var(--color-gold) 13px 15px,
            transparent 15px 19px
          );
        }

        /* The trap citation. Gold ties it to the wire, 7.6:1 on .panel, and it
           is a T-number rather than a sentence so it stays a pointer into §05
           instead of becoming a second account of the trap. */
        .rg-row-trap {
          display: inline-block;
          margin-top: 0.28rem;
          padding: 0.08rem 0.4rem;
          border: 1px solid color-mix(in srgb, var(--color-gold) 42%, transparent);
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          color: var(--color-gold);
          line-height: 1.5;
        }

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
        /* Sits under the whole key at every width, including the flex strip
           above 900px, where the 100% flex-basis is what drops it onto its own
           row instead of trailing the last legend item. */
        .rg-key-pointer {
          flex: 1 0 100%;
          margin: 0.7rem 0 0;
          font-family: var(--font-body);
          font-size: 0.82rem;
          line-height: 1.5;
          color: var(--rg-quiet);
          max-width: 54rem;
        }

        .rg-legend-row .rg-row-rule { align-self: start; }
        .rg-legend-term { font-size: 0.7rem; color: var(--color-moonlight); }
        .rg-legend-gloss {
          font-family: var(--font-body);
          font-size: 0.82rem;
          color: var(--rg-quiet);
          line-height: 1.4;
        }

        /* Heard, never seen. Out of flow, so it costs the grid nothing. */
        .rg-sr-live {
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

        .rg-card { position: relative; padding: 1.35rem; border: 1px solid var(--rg-edge); }
        .rg-card.is-selected {
          border-color: color-mix(in srgb, var(--color-silver) 45%, transparent);
        }

        /* The role name is the control, but its ::after stretches over the
           whole card, so anywhere on a card is a tap target — the finger-sized
           equivalent of clicking a node. The outline still hugs the name,
           since an outline ignores the pseudo-element. */
        .rg-card-hit {
          appearance: none;
          margin: 0;
          padding: 0;
          border: 0;
          background: none;
          font: inherit;
          color: inherit;
          letter-spacing: inherit;
          text-align: left;
          cursor: pointer;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }
        .rg-card-hit::after { content: ""; position: absolute; inset: 0; }
        .rg-card-hit:focus-visible {
          outline: 2px solid var(--color-lunar-gold);
          outline-offset: 3px;
        }

        /* Says the card opens, and which way it is pointing now. */
        .rg-card-caret {
          display: inline-block;
          width: 0.38em;
          height: 0.38em;
          margin-left: 0.6rem;
          border-right: 2px solid var(--color-silver);
          border-bottom: 2px solid var(--color-silver);
          transform: translateY(-0.16em) rotate(45deg);
          opacity: 0.7;
          transition: transform 200ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .rg-card.is-selected .rg-card-caret {
          transform: translateY(0.06em) rotate(-135deg);
          opacity: 1;
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
          .rg-notes { grid-column: 1; grid-row: 4; }
          .rg-panel-detail { max-width: 46rem; }
        }

        /* 1200+: the diamond and the readout side by side, as designed, with
           the line key as a strip closing the graph column. */
        @media (min-width: 1200px) {
          .rg {
            grid-template-columns: minmax(0, 1fr) minmax(21rem, 24rem);
            grid-template-rows: auto auto auto;
            row-gap: 1rem;
          }
          .rg-stage { grid-column: 1; grid-row: 1; }
          .rg-key { grid-column: 1; grid-row: 2; align-self: start; }
          .rg-panel { grid-column: 2; grid-row: 1 / span 2; min-height: 100%; }
          /* The rules are about all four roles, so they span both columns and
             close the whole diagram rather than sitting in one of them. */
          .rg-notes { grid-column: 1 / -1; grid-row: 3; }
        }

        @media (max-width: 899px) {
          /* No diamond below 900px. The four feeds stack, each carrying the
             dependency lists the readout would have shown, so nothing is lost
             and no SVG has to survive a 360px viewport. */
          .rg-stage { display: none; }
          .rg-panel-detail { display: none; }
          .rg-key { margin-top: 0; border-top: 0; padding-top: 0; }

          /* Collapsed until picked: four cards with every list open is a long
             scroll, and it gives the tap something to reveal. Only this band
             collapses — the desktop roster keeps every list in place, so the
             diagram's text equivalent up there is untouched. */
          .rg-card:not(.is-selected) .rg-card-links { display: none; }
        }

        /* Reduced motion switches instantly: no wire cross-fade, no readout
           swap, no caret sweep — the picture is simply already changed. */
        @media (prefers-reduced-motion: reduce) {
          .rg-rec-dot,
          .rg-card-dot,
          .rg-panel-detail { animation: none; }
          .rg-wire,
          .rg-node,
          .rg-card-caret { transition: none; }
        }
      `}</style>
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  gatingPointer,
  minigames,
  puzzlePattern,
  thesis,
  type Beat,
  type BlockMeta,
  type Minigame,
  type MinigameSide,
  waveformPayoff,
} from "@/content/shattered-skies-gameplay";
import type { SsVariant } from "@/content/shattered-skies-deep-dive";
import { mainHref } from "@/content/shattered-skies-deep-dive";
import InteractiveHint from "./InteractiveHint";
import Link from "next/link";

const W = 720;
const H = 380;

const PILL = { x: 250, y: 8, w: 220, h: 30 };

const ARC = {
  split: ["M 176 100 C 206 62, 220 42, 250 26", "M 470 26 C 500 42, 514 62, 544 100"],
  shared: ["M 88 100 C 138 60, 194 40, 250 26", "M 470 26 C 526 40, 582 60, 632 100"],
} as const;

const PANEL = { y: 104, h: 240, w: 336 };
const PANEL_X = { a: 8, b: 376 } as const;
const CONTENT_Y = PANEL.y + 62;

const CTRL = { y: 104, h: 176, w: 160 };
const CTRL_X = { a: 8, b: 552 } as const;
const PLATE = { x: 216, y: 104, w: 288, h: 200 };

const STAKES_Y = 366;

function head(x: number, y: number, dir: "l" | "r" | "u" | "d", s = 6) {
  const t = s * 0.62;
  if (dir === "r") return `M ${x} ${y} L ${x - s} ${y - t} L ${x - s} ${y + t} Z`;
  if (dir === "l") return `M ${x} ${y} L ${x + s} ${y - t} L ${x + s} ${y + t} Z`;
  if (dir === "u") return `M ${x} ${y} L ${x - t} ${y + s} L ${x + t} ${y + s} Z`;
  return `M ${x} ${y} L ${x - t} ${y - s} L ${x + t} ${y - s} Z`;
}

function wave(x: number, y: number, w: number, amp: number, cycles: number, n = 72) {
  const pts: string[] = [];
  for (let i = 0; i <= n; i += 1) {
    const t = i / n;
    const px = (x + t * w).toFixed(1);
    const py = (y - amp * Math.sin(t * cycles * Math.PI * 2)).toFixed(1);
    pts.push(`${px} ${py}`);
  }
  return `M ${pts.join(" L ")}`;
}

function BrokenChannel({ label, layout }: { label: string; layout: "split" | "shared" }) {
  const [left, right] = ARC[layout];
  return (
    <g className="ssc-chan">
      <path className="ssc-chan-arc" d={left} />
      <path className="ssc-chan-arc" d={right} />
      <path className="ssc-chan-jag" d="M 244 12 L 236 23 L 244 34" />
      <path className="ssc-chan-jag" d="M 476 12 L 484 23 L 476 34" />
      <rect className="ssc-chan-pill" x={PILL.x} y={PILL.y} width={PILL.w} height={PILL.h} rx={2} />
      <text className="ssc-chan-label" x={PILL.x + PILL.w / 2} y={PILL.y + 20} textAnchor="middle">
        {label}
      </text>
    </g>
  );
}

function Screen({ side, children }: { side: MinigameSide; children?: React.ReactNode }) {
  const x = PANEL_X[side.id];
  return (
    <g data-tone={side.id}>
      <rect className="ssc-fig-panel" x={x} y={PANEL.y} width={PANEL.w} height={PANEL.h} rx={2} />
      <rect className="ssc-fig-tab" x={x} y={PANEL.y} width={PANEL.w} height={3} />
      <text className="ssc-fig-name" x={x + 18} y={PANEL.y + 30}>
        {side.label}
      </text>
      <text className="ssc-fig-chip" x={x + 18} y={PANEL.y + 50}>
        {side.chip}
      </text>
      {children}
    </g>
  );
}

function ControlBlock({ side, children }: { side: MinigameSide; children?: React.ReactNode }) {
  const x = CTRL_X[side.id];
  return (
    <g data-tone={side.id}>
      <rect className="ssc-fig-panel" x={x} y={CTRL.y} width={CTRL.w} height={CTRL.h} rx={2} />
      <rect className="ssc-fig-tab" x={x} y={CTRL.y} width={CTRL.w} height={3} />
      <text className="ssc-fig-name" x={x + 16} y={CTRL.y + 30}>
        {side.label}
      </text>
      <text className="ssc-fig-chip is-tight" x={x + 16} y={CTRL.y + 48}>
        {side.chip}
      </text>
      {children}
    </g>
  );
}

function Stakes({ text }: { text: string }) {
  return (
    <text className="ssc-fig-stakes" x={W / 2} y={STAKES_Y} textAnchor="middle">
      {text}
    </text>
  );
}

const CELL = 20;
const GRID = CELL * 8;
const GRID_Y = CONTENT_Y;
const gridX = (panelX: number) => panelX + (PANEL.w - GRID) / 2;

const WALL_H: readonly (readonly [number, number])[] = [
  [1, 2], [2, 2], [3, 2], [5, 1], [6, 1], [0, 4], [1, 4],
  [2, 4], [4, 5], [5, 5], [6, 5], [2, 6], [3, 6],
];
const WALL_V: readonly (readonly [number, number])[] = [
  [2, 0], [2, 1], [5, 2], [5, 3], [3, 4], [3, 5], [6, 6], [6, 7], [1, 5],
];

const NODE_CELL = [1, 6] as const;
const SRC_CELL = [6, 1] as const;

function Lattice({ x, dim }: { x: number; dim?: boolean }) {
  return (
    <g className={dim ? "ssc-maze-grid is-dim" : "ssc-maze-grid"}>
      {Array.from({ length: 9 }, (_, i) => (
        <line key={`v${i}`} x1={x + i * CELL} y1={GRID_Y} x2={x + i * CELL} y2={GRID_Y + GRID} />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <line key={`h${i}`} x1={x} y1={GRID_Y + i * CELL} x2={x + GRID} y2={GRID_Y + i * CELL} />
      ))}
    </g>
  );
}

function MazeFigure({ game }: { game: Minigame }) {
  const [a, b] = game.sides;
  const ax = gridX(PANEL_X.a);
  const bx = gridX(PANEL_X.b);
  const nodeCx = (gx: number) => gx + (NODE_CELL[0] + 0.5) * CELL;
  const nodeCy = GRID_Y + (NODE_CELL[1] + 0.5) * CELL;

  return (
    <>
      <BrokenChannel label={game.diagram.barrier} layout="split" />

      <Screen side={a}>
        <Lattice x={ax} dim />
        <g className="ssc-maze-input">
          <path d={head(nodeCx(ax), nodeCy - 17, "u", 5)} />
          <path d={head(nodeCx(ax), nodeCy + 17, "d", 5)} />
          <path d={head(nodeCx(ax) - 17, nodeCy, "l", 5)} />
          <path d={head(nodeCx(ax) + 17, nodeCy, "r", 5)} />
        </g>
        <rect
          className="ssc-maze-node ssc-pulse"
          x={nodeCx(ax) - 6}
          y={nodeCy - 6}
          width={12}
          height={12}
        />
      </Screen>

      <Screen side={b}>
        <Lattice x={bx} />
        <g className="ssc-maze-wall">
          {WALL_H.map(([c, r]) => (
            <line
              key={`wh${c}-${r}`}
              x1={bx + c * CELL}
              y1={GRID_Y + r * CELL}
              x2={bx + (c + 1) * CELL}
              y2={GRID_Y + r * CELL}
            />
          ))}
          {WALL_V.map(([c, r]) => (
            <line
              key={`wv${c}-${r}`}
              x1={bx + c * CELL}
              y1={GRID_Y + r * CELL}
              x2={bx + c * CELL}
              y2={GRID_Y + (r + 1) * CELL}
            />
          ))}
        </g>
        <circle
          className="ssc-maze-src"
          cx={bx + (SRC_CELL[0] + 0.5) * CELL}
          cy={GRID_Y + (SRC_CELL[1] + 0.5) * CELL}
          r={7}
        />
        <circle
          className="ssc-maze-src-core"
          cx={bx + (SRC_CELL[0] + 0.5) * CELL}
          cy={GRID_Y + (SRC_CELL[1] + 0.5) * CELL}
          r={2.6}
        />
        <rect
          className="ssc-maze-ghost"
          x={nodeCx(bx) - 6}
          y={nodeCy - 6}
          width={12}
          height={12}
        />
      </Screen>

      <Stakes text={game.diagram.stakes} />
    </>
  );
}

const WELD = { x: 360, y: 214 };
const CRACK =
  "M 238 272 L 276 244 L 302 256 L 336 226 L 360 214 L 392 198 L 430 210 L 482 164";

function WelderFigure({ game }: { game: Minigame }) {
  const [a, b] = game.sides;
  const ax = CTRL_X.a + CTRL.w / 2;
  const bx = CTRL_X.b + CTRL.w / 2;
  const trackY = WELD.y;

  return (
    <>
      <BrokenChannel label={game.diagram.barrier} layout="shared" />

      {game.diagram.sharedLabel && (
        <text className="ssc-fig-shared" x={W / 2} y={PLATE.y - 10} textAnchor="middle">
          {game.diagram.sharedLabel}
        </text>
      )}
      <rect
        className="ssc-fig-panel is-shared"
        x={PLATE.x}
        y={PLATE.y}
        width={PLATE.w}
        height={PLATE.h}
        rx={2}
      />
      <g className="ssc-weld-rivet">
        <circle cx={PLATE.x + 14} cy={PLATE.y + 14} r={2.4} />
        <circle cx={PLATE.x + PLATE.w - 14} cy={PLATE.y + 14} r={2.4} />
        <circle cx={PLATE.x + 14} cy={PLATE.y + PLATE.h - 14} r={2.4} />
        <circle cx={PLATE.x + PLATE.w - 14} cy={PLATE.y + PLATE.h - 14} r={2.4} />
      </g>
      <path className="ssc-weld-crack" d={CRACK} />

      <g data-tone="a">
        <line className="ssc-axis-lead" x1={CTRL_X.a + CTRL.w} y1={trackY} x2={252} y2={trackY} />
        <line className="ssc-axis" x1={258} y1={WELD.y} x2={462} y2={WELD.y} />
        <path className="ssc-axis-head" d={head(252, WELD.y, "l")} />
        <path className="ssc-axis-head" d={head(468, WELD.y, "r")} />
      </g>

      <g data-tone="b">
        <path
          className="ssc-axis-lead"
          d={`M ${bx} ${CTRL.y + CTRL.h} L ${bx} 332 L ${WELD.x} 332 L ${WELD.x} 284`}
          fill="none"
        />
        <line className="ssc-axis" x1={WELD.x} y1={156} x2={WELD.x} y2={272} />
        <path className="ssc-axis-head" d={head(WELD.x, 150, "u")} />
        <path className="ssc-axis-head" d={head(WELD.x, 278, "d")} />
      </g>

      <circle className="ssc-weld-tool ssc-pulse" cx={WELD.x} cy={WELD.y} r={6.5} />
      <circle className="ssc-weld-tool-ring" cx={WELD.x} cy={WELD.y} r={11} />

      <ControlBlock side={a}>
        <line className="ssc-ctrl-track" x1={ax - 52} y1={trackY} x2={ax + 52} y2={trackY} />
        <path className="ssc-ctrl-head" d={head(ax - 58, trackY, "l", 5)} />
        <path className="ssc-ctrl-head" d={head(ax + 58, trackY, "r", 5)} />
        <circle className="ssc-ctrl-grip" cx={ax} cy={trackY} r={5} />
      </ControlBlock>

      <ControlBlock side={b}>
        <line className="ssc-ctrl-track" x1={bx} y1={trackY - 38} x2={bx} y2={trackY + 38} />
        <path className="ssc-ctrl-head" d={head(bx, trackY - 44, "u", 5)} />
        <path className="ssc-ctrl-head" d={head(bx, trackY + 44, "d", 5)} />
        <circle className="ssc-ctrl-grip" cx={bx} cy={trackY} r={5} />
      </ControlBlock>

      <Stakes text={game.diagram.stakes} />
    </>
  );
}

const SCOPE = { y: CONTENT_Y, h: 96, inset: 24 };
const SCOPE_MID = SCOPE.y + SCOPE.h / 2;
const DIAL_Y = [298, 330] as const;

function Scope({ panelX, path, dim }: { panelX: number; path: string; dim?: boolean }) {
  const x = panelX + SCOPE.inset;
  const w = PANEL.w - SCOPE.inset * 2;
  return (
    <g>
      <rect className="ssc-scope" x={x} y={SCOPE.y} width={w} height={SCOPE.h} rx={2} />
      <line className="ssc-scope-mid" x1={x} y1={SCOPE_MID} x2={x + w} y2={SCOPE_MID} />
      {Array.from({ length: 5 }, (_, i) => (
        <line
          key={i}
          className="ssc-scope-tick"
          x1={x + ((i + 1) * w) / 6}
          y1={SCOPE.y + 8}
          x2={x + ((i + 1) * w) / 6}
          y2={SCOPE.y + SCOPE.h - 8}
        />
      ))}
      <path className={dim ? "ssc-scope-wave is-dim" : "ssc-scope-wave"} d={path} />
    </g>
  );
}

function WaveformFigure({ game }: { game: Minigame }) {
  const [a, b] = game.sides;
  const axes = game.diagram.axes ?? ["", ""];
  const scopeW = PANEL.w - SCOPE.inset * 2;
  const dialX = (panelX: number) => panelX + SCOPE.inset;
  const dialW = PANEL.w - SCOPE.inset * 2 - 24;
  const dialAt = [0.34, 0.24] as const;

  return (
    <>
      <BrokenChannel label={game.diagram.barrier} layout="split" />

      <Screen side={a}>
        <Scope
          panelX={PANEL_X.a}
          path={wave(PANEL_X.a + SCOPE.inset, SCOPE_MID, scopeW, 34, 2.5)}
        />
        {DIAL_Y.map((y, i) => (
          <g key={y} className="ssc-dial is-absent">
            <text className="ssc-dial-label" x={dialX(PANEL_X.a)} y={y - 10}>
              {axes[i]}
            </text>
            <line
              className="ssc-dial-track"
              x1={dialX(PANEL_X.a)}
              y1={y}
              x2={dialX(PANEL_X.a) + dialW}
              y2={y}
            />
            <path
              className="ssc-dial-none"
              d={`M ${dialX(PANEL_X.a) + dialW + 8} ${y - 5} l 10 10 M ${
                dialX(PANEL_X.a) + dialW + 18
              } ${y - 5} l -10 10`}
            />
          </g>
        ))}
      </Screen>

      <Screen side={b}>
        <Scope
          panelX={PANEL_X.b}
          path={wave(PANEL_X.b + SCOPE.inset, SCOPE_MID, scopeW, 18, 1.5)}
          dim
        />
        {DIAL_Y.map((y, i) => (
          <g key={y} className="ssc-dial">
            <text className="ssc-dial-label" x={dialX(PANEL_X.b)} y={y - 10}>
              {axes[i]}
            </text>
            <line
              className="ssc-dial-track"
              x1={dialX(PANEL_X.b)}
              y1={y}
              x2={dialX(PANEL_X.b) + dialW}
              y2={y}
            />
            <line
              className="ssc-dial-fill"
              x1={dialX(PANEL_X.b)}
              y1={y}
              x2={dialX(PANEL_X.b) + dialW * dialAt[i]}
              y2={y}
            />
            <circle
              className="ssc-dial-grip ssc-pulse"
              cx={dialX(PANEL_X.b) + dialW * dialAt[i]}
              cy={y}
              r={5}
            />
          </g>
        ))}
      </Screen>

      <Stakes text={game.diagram.stakes} />
    </>
  );
}


const FIGURES = {
  maze: MazeFigure,
  welder: WelderFigure,
  waveform: WaveformFigure,
} as const;

type Seat = "both" | "a" | "b";

function AsymmetryFigure({ game, seat }: { game: Minigame; seat: Seat }) {
  const Figure = FIGURES[game.diagram.variant];
  return (
    <svg
      className="ssc-fig-svg"
      data-seat={seat}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-labelledby={`ssc-fig-${game.id}-title ssc-fig-${game.id}-desc`}
    >
      <title id={`ssc-fig-${game.id}-title`}>{game.diagram.title}</title>
      <desc id={`ssc-fig-${game.id}-desc`}>{game.diagram.summary}</desc>
      <Figure game={game} />
    </svg>
  );
}

function Schematic({ game }: { game: Minigame }) {
  const [seat, setSeat] = useState<Seat>("both");
  const [a, b] = game.sides;

  const options: readonly { id: Seat; label: string }[] = [
    { id: "both", label: "Both seats" },
    { id: "a", label: a.label },
    { id: "b", label: b.label },
  ];

  return (
    <figure className="ssc__fig" aria-labelledby={`ssc-figcap-${game.id}`}>
      <figcaption className="mono ssc__fig-cap" id={`ssc-figcap-${game.id}`}>
        {game.diagram.title}
      </figcaption>

      <div
        className="ssc__seats"
        role="group"
        aria-label={`Which seat of ${game.name} to show`}
      >
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            className="ssc__seat"
            data-tone={o.id}
            aria-pressed={seat === o.id}
            onClick={() => setSeat(o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="ssc__fig-frame" tabIndex={0} role="group" aria-label={game.diagram.title}>
        <AsymmetryFigure game={game} seat={seat} />
      </div>

      <p className="ssc__sr" role="status">
        {seat === "both"
          ? "Both seats shown."
          : `Showing ${(seat === "a" ? a : b).label} only.`}
      </p>

      <dl className="ssc__split" data-seat={seat}>
        {game.sides.map((sd) => (
          <div key={sd.id} className="ssc__side" data-tone={sd.id}>
            <dt className="ssc__side-name">{sd.label}</dt>
            <dd className="ssc__side-lines">
              <span className="ssc__side-line">
                <span className="mono ssc__side-key">Sees</span>
                <span>{sd.sees}</span>
              </span>
              <span className="ssc__side-line">
                <span className="mono ssc__side-key">Controls</span>
                <span>{sd.controls}</span>
              </span>
            </dd>
          </div>
        ))}
      </dl>

      <p className="mono ssc__fig-barrier">
        <span className="ssc__fig-barrier-jag" aria-hidden="true" />
        While the {game.diagram.barrier} goes on.
      </p>
    </figure>
  );
}

function BlockHeader({ order, kicker, title, standfirst, titleId }: BlockMeta & { titleId: string }) {
  return (
    <header className="ssc__head">
      <p className="mono ssc__head-rail">
        <span className="ssc__head-order">{order}</span>
        <span className="ssc__head-kicker">{kicker}</span>
      </p>
      <h3 className="ssc__head-title" id={titleId}>
        {title}
      </h3>
      <p className="ssc__head-standfirst">{standfirst}</p>
    </header>
  );
}

function BeatRail({ beats }: { beats: readonly Beat[] }) {
  return (
    <dl className="ssc__beats">
      {beats.map((b) => (
        <div key={b.label} className="ssc__beat">
          <dt className="mono ssc__beat-term">{b.label}</dt>
          <dd className="ssc__beat-body">{b.body}</dd>
        </div>
      ))}
    </dl>
  );
}

function DesignPoint({ body }: { body: string }) {
  return (
    <p className="ssc__point">
      <span className="mono ssc__point-tag">Design point</span>
      <span className="ssc__point-body">{body}</span>
    </p>
  );
}

/* ---- the section --------------------------------------------------------- */

export default function ShatteredSkiesCoop({
  variant = "main",
  block = "all",
}: {
  variant?: SsVariant;
  block?: "all" | "repairs" | "pattern";
}) {
  const deep = variant === "deep";
  const showRepairs = block === "all" || block === "repairs";
  const showPattern = block === "all" || block === "pattern";

  return (
    <div className="ssc" data-variant={variant}>
      {!deep && (
        <section className="ssc__thesis" aria-labelledby="ssc-thesis-title">
          <p className="mono ssc__thesis-tag" id="ssc-thesis-title">
            {thesis.tag}
          </p>
          <p className="ssc__thesis-body">{thesis.body}</p>
          <ol className="ssc__moves">
            {thesis.moves.map((m, i) => (
              <li key={m.label} className="ssc__move">
                <p className="mono ssc__move-label">
                  <span className="ssc__move-index" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {m.label}
                </p>
                <p className="ssc__move-body">{m.body}</p>
              </li>
            ))}
          </ol>
          <p className="ssc__thesis-note">{thesis.note}</p>
        </section>
      )}

      {!deep && showPattern && (
        <section className="ssc__pattern" aria-labelledby="ssc-pattern-title">
          <h4 className="ssc__pattern-title" id="ssc-pattern-title">
            {puzzlePattern.meta.title}
          </h4>
          <p className="ssc__pattern-standfirst">{puzzlePattern.meta.standfirst}</p>
          <ol className="ssc__pattern-steps">
            {puzzlePattern.steps.map((st) => (
              <li key={st.id} className="ssc__pattern-step">
                <span className="mono ssc__pattern-ord" aria-hidden="true">
                  {st.order}
                </span>
                <span className="ssc__pattern-label">{st.label}</span>
              </li>
            ))}
          </ol>
          <p className="ssc__pattern-point">{puzzlePattern.designPoint}</p>
        </section>
      )}

      {/* ================= 01 · the three minigames ================= */}
      {showRepairs && (
        <article className="ssc__block" aria-labelledby="ssc-minigames-title">
          {!deep && <BlockHeader {...minigames.meta} titleId="ssc-minigames-title" />}
          {deep && (
            <h3 className="ssc__deep-title" id="ssc-minigames-title">
              {minigames.meta.title}
            </h3>
          )}

          {deep && <p className="ssc__lead">{minigames.lead}</p>}

          {!deep && (
            <InteractiveHint
              what="seat"
              does="the diagram drops to just that seat's half, and the other goes dark"
            />
          )}

          <ol className="ssc__games" data-mode={deep ? "prose" : "figures"}>
            {minigames.games.map((g) => (
              <li key={g.id} className="ssc__game">
                <header className="ssc__game-head">
                  <p className="mono ssc__game-order" aria-hidden="true">
                    {g.order}
                  </p>
                  <div className="ssc__game-titles">
                    <h4 className="ssc__game-name" id={`ssc-game-${g.id}`}>
                      {g.name}
                    </h4>
                    <p className="mono ssc__game-tag">{g.tag}</p>
                    {!deep && <p className="ssc__game-standfirst">{g.standfirst}</p>}
                  </div>
                </header>

                {deep && <p className="ssc__game-premise">{g.premise}</p>}

                {!deep && <Schematic game={g} />}

                {deep && (
                  <>
                    <BeatRail beats={[g.split, g.barrierTwist, g.failure]} />
                    <DesignPoint body={g.designPoint} />
                  </>
                )}
              </li>
            ))}
          </ol>

          {!deep && (
            <blockquote className="ssc__payoff">
              <p className="ssc__payoff-body">{waveformPayoff}</p>
              <p className="mono ssc__payoff-src">Calibrating Sensors Puzzle</p>
            </blockquote>
          )}
        </article>
      )}

      {/* ================= 02 · the puzzle pattern, in full — DEEP ================= */}
      {deep && showPattern && (
        <article className="ssc__block ssc__block--compact" aria-labelledby="ssc-pattern-full">
          <h3 className="ssc__deep-title" id="ssc-pattern-full">
            {puzzlePattern.meta.title}
          </h3>
          <p className="ssc__lead">{puzzlePattern.lead}</p>

          <section className="ssc__aside" aria-labelledby="ssc-loop-title">
            <h4 className="mono ssc__aside-title" id="ssc-loop-title">
              {puzzlePattern.stepsLabel}
            </h4>
            <ol className="ssc__steps">
              {puzzlePattern.steps.map((st) => (
                <li key={st.id} className="ssc__step">
                  <p className="mono ssc__step-order" aria-hidden="true">
                    {st.order}
                  </p>
                  <div className="ssc__step-copy">
                    <p className="ssc__step-label">{st.label}</p>
                    <p className="ssc__step-body">{st.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="ssc__highlight" aria-labelledby="ssc-symbiochord-title">
            <h4 className="ssc__highlight-title" id="ssc-symbiochord-title">
              {puzzlePattern.symbiochord.label}
            </h4>
            <p className="ssc__highlight-body">{puzzlePattern.symbiochord.body}</p>
          </section>
        </article>
      )}

      {showRepairs && !deep && (
        <aside className="ssc__pointer" aria-label={gatingPointer.label}>
          <p className="ssc__pointer-tag">{gatingPointer.label}</p>
          <p className="ssc__pointer-body">
            {gatingPointer.body}{" "}
            <Link className="ssc__pointer-link" href={mainHref("worlds", variant)}>
              Click here for {gatingPointer.linkLabel}
            </Link>
          </p>
        </aside>
      )}

      <style>{`
        .ssc__pointer {
          display: grid;
          gap: 0.35rem;
          padding: 0.95rem 1.15rem;
          border: 1px solid var(--ssc-edge);
          border-left: 2px solid color-mix(in srgb, var(--ssc-cyan) 55%, transparent);
          background: var(--ssc-panel);
        }
        .ssc__pointer-tag {
          margin: 0;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ssc-cyan);
        }
        .ssc__pointer-body {
          margin: 0;
          font-size: 0.88rem;
          line-height: 1.65;
          color: var(--ssc-quiet);
        }
        /* S1 - a real link, because after the split the section it points at
           may be on the other page. Underlined at rest: a coloured word with
           no second cue is not an affordance. */
        .ssc__pointer-link {
          color: var(--ssc-cyan);
          text-decoration: underline;
          text-decoration-color: color-mix(in srgb, var(--ssc-cyan) 45%, transparent);
          text-underline-offset: 0.22em;
        }
        .ssc__pointer-link:hover,
        .ssc__pointer-link:focus-visible { text-decoration-color: currentColor; }

        /* ---- the deep dive's own headings ----
           The subpage puts a numbered SectionHeading above each block, so the
           full BlockHeader would be two title systems arguing. One line, h3. */
        .ssc__deep-title {
          margin: 0;
          font-family: var(--font-hero);
          font-size: 1.35rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          line-height: 1.25;
          color: var(--color-moonlight);
        }

        /* ---- THE PATTERN, AS A PRE-INTRO ------------------------------------
           Five labels on one strip, before the three descriptions rather than
           after them. It has to read as a RULE the examples below obey, so it
           is a bordered band rather than a list: compact enough that nobody
           mistakes it for a section, emphatic enough that nobody skims past
           the thing that explains the next three blocks. */
        .ssc__pattern {
          display: grid;
          gap: 0.9rem;
          padding: 1.35rem 1.5rem 1.45rem;
          border: 1px solid var(--ssc-edge);
          border-left: 2px solid var(--ssc-warm);
          background: var(--ssc-panel);
        }
        .ssc__pattern-title {
          margin: 0;
          font-family: var(--font-hero);
          font-size: 1.12rem;
          font-weight: 600;
          color: var(--color-moonlight);
        }
        .ssc__pattern-standfirst {
          margin: 0;
          max-width: 46rem;
          font-size: 0.95rem;
          line-height: 1.7;
          color: var(--color-moonlight);
        }
        .ssc__pattern-steps {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(12.5rem, 1fr));
          gap: 0.55rem 1.25rem;
        }
        .ssc__pattern-step {
          display: flex;
          align-items: baseline;
          gap: 0.55rem;
          min-width: 0;
          padding-top: 0.5rem;
          border-top: 1px solid var(--ssc-line);
        }
        .ssc__pattern-ord {
          flex: 0 0 auto;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          color: var(--ssc-warm);
        }
        .ssc__pattern-label {
          font-size: 0.86rem;
          line-height: 1.45;
          color: var(--color-moonlight);
        }
        .ssc__pattern-point {
          margin: 0;
          max-width: 46rem;
          font-size: 0.9rem;
          line-height: 1.65;
          color: var(--ssc-quiet);
        }

        /* ---- the waveform payoff -------------------------------------------
           The best sentence in the section, pulled where a first-pass reader
           reaches it. Warm rather than cyan: it is the one moment the section
           stops describing a barrier and describes what got across it. */
        .ssc__payoff {
          margin: 0;
          padding: 1.15rem 1.4rem 1.2rem;
          border-left: 2px solid var(--ssc-warm);
          background: color-mix(in srgb, var(--color-gold) 6%, transparent);
        }
        .ssc__payoff-body {
          margin: 0;
          max-width: 44rem;
          font-family: var(--font-hero);
          font-size: 1.15rem;
          line-height: 1.55;
          color: var(--color-moonlight);
        }
        .ssc__payoff-src {
          margin: 0.6rem 0 0;
          font-size: 0.7rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ssc-warm);
        }

        /* Prose mode on the deep dive: no schematic between the head and the
           reasoning rail, so the games want less air than the figure version. */
        .ssc__games[data-mode="prose"] { gap: 2.75rem; }

        .ssc {
          /* Same palette as the mechanics section directly above, so the two
             read as one document. Cyan is the section colour, gold the warm
             counter; every tone is measured on the void. */
          --ssc-cyan: var(--color-nebula, #7ec8d8);   /* 10.2:1 */
          --ssc-warm: var(--color-gold);              /*  8.6:1 */
          /* Mist alone is 4.2:1 on the panels; blended toward moonlight the
             small type clears AA everywhere it is used — about 8.8:1. */
          --ssc-quiet: color-mix(in srgb, var(--color-mist) 50%, var(--color-moonlight));
          --ssc-edge: color-mix(in srgb, var(--color-mist) 32%, transparent);
          --ssc-panel: color-mix(in srgb, var(--color-nightfall) 62%, var(--color-void));
          --ssc-inner: color-mix(in srgb, var(--color-void) 72%, var(--color-nightfall));
          --ssc-line: color-mix(in srgb, var(--color-mist) 26%, transparent);

          display: grid;
          gap: 3rem;
          min-width: 0;
        }

        /* ---- the credit ---- */
        .ssc__role {
          margin: 0;
          display: flex;
          align-items: baseline;
          gap: 0.6rem;
          font-size: 0.7rem;
          line-height: 1.6;
          letter-spacing: 0.1em;
          color: var(--ssc-quiet);
          max-width: 46rem;
        }
        .ssc__role-mark {
          flex: none;
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          background: var(--ssc-cyan);
          transform: translateY(-0.05rem);
        }
        .ssc__role-name {
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ssc-cyan);
        }

        /* ---- the thesis ---- */
        .ssc__thesis {
          position: relative;
          background: var(--ssc-panel);
          border: 1px solid var(--ssc-edge);
          padding: 1.5rem 1.6rem 1.65rem;
          display: grid;
          gap: 1rem;
          min-width: 0;
        }
        .ssc__thesis::before {
          content: "";
          position: absolute;
          inset: -1px auto -1px -1px;
          width: 3px;
          background: linear-gradient(180deg, var(--ssc-cyan), var(--ssc-warm));
        }
        .ssc__thesis-tag {
          margin: 0;
          font-size: 0.70rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--ssc-warm);
        }
        .ssc__thesis-body {
          margin: 0;
          max-width: 46rem;
          font-family: var(--font-hero);
          font-size: clamp(1.1rem, 0.98rem + 0.5vw, 1.35rem);
          line-height: 1.55;
          color: var(--color-moonlight);
        }
        .ssc__thesis-note {
          margin: 0;
          max-width: 46rem;
          font-size: 0.92rem;
          line-height: 1.75;
          color: var(--ssc-quiet);
        }

        /* The three moves, named once so they can be spotted in each figure. */
        .ssc__moves {
          list-style: none;
          margin: 0.15rem 0;
          padding: 0;
          display: grid;
          gap: 0.9rem;
        }
        @media (min-width: 46rem) {
          .ssc__moves { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.4rem; }
        }
        .ssc__move {
          display: grid;
          gap: 0.3rem;
          padding-top: 0.7rem;
          border-top: 1px solid var(--ssc-edge);
          min-width: 0;
        }
        .ssc__move-label {
          margin: 0;
          display: flex;
          align-items: baseline;
          gap: 0.55rem;
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ssc-cyan);
        }
        .ssc__move-index { color: var(--ssc-quiet); opacity: 0.75; }
        .ssc__move-body {
          margin: 0;
          font-size: 0.86rem;
          line-height: 1.6;
          color: var(--ssc-quiet);
        }

        /* ---- block furniture, matched to the mechanics section ---- */
        .ssc__block {
          display: grid;
          gap: 1.5rem;
          min-width: 0;
          padding-top: 2rem;
          border-top: 1px solid var(--ssc-edge);
        }
        .ssc__block--compact { gap: 1.25rem; }

        .ssc__head { display: grid; gap: 0.55rem; max-width: 46rem; }
        .ssc__head-rail {
          margin: 0;
          display: flex;
          align-items: baseline;
          gap: 0.85rem;
          font-size: 0.72rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }
        .ssc__head-order { color: var(--ssc-warm); }
        .ssc__head-kicker { color: var(--ssc-quiet); }
        .ssc__head-title {
          margin: 0;
          font-family: var(--font-hero);
          font-size: clamp(1.5rem, 1.2rem + 1.1vw, 2rem);
          line-height: 1.2;
          letter-spacing: 0.01em;
          color: var(--color-moonlight);
        }
        .ssc__head-standfirst {
          margin: 0;
          font-size: 1rem;
          line-height: 1.7;
          color: var(--ssc-quiet);
        }

        .ssc__lead {
          margin: 0;
          max-width: 46rem;
          font-size: 0.98rem;
          line-height: 1.8;
          color: var(--color-moonlight);
        }

        /* ---- a minigame ---- */
        .ssc__games {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 2.75rem;
        }
        .ssc__game {
          display: grid;
          gap: 1.15rem;
          min-width: 0;
        }
        .ssc__game-head {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: 0.9rem;
          align-items: start;
        }
        .ssc__game-order {
          margin: 0;
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          color: var(--ssc-warm);
          padding-top: 0.35rem;
        }
        .ssc__game-titles { display: grid; gap: 0.35rem; min-width: 0; }
        .ssc__game-name {
          margin: 0;
          font-family: var(--font-hero);
          font-size: clamp(1.2rem, 1.05rem + 0.6vw, 1.5rem);
          letter-spacing: 0.02em;
          color: var(--color-moonlight);
        }
        .ssc__game-tag {
          margin: 0;
          font-size: 0.71rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--ssc-cyan);
        }
        .ssc__game-standfirst {
          margin: 0.25rem 0 0;
          max-width: 44rem;
          font-size: 0.95rem;
          line-height: 1.7;
          color: var(--ssc-quiet);
        }
        .ssc__game-premise {
          margin: 0;
          max-width: 46rem;
          font-size: 0.95rem;
          line-height: 1.75;
          color: var(--color-moonlight);
        }

        /* ---- the figure ---- */
        .ssc__fig {
          margin: 0.35rem 0 0;
          display: grid;
          gap: 0.9rem;
          border: 1px solid var(--ssc-edge);
          background: color-mix(in srgb, var(--ssc-panel) 70%, transparent);
          padding: 1.1rem 1.1rem 1.2rem;
          min-width: 0;
        }
        .ssc__fig-cap {
          margin: 0;
          font-size: 0.70rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ssc-quiet);
        }
        .ssc__fig-frame {
          overflow-x: auto;
          overscroll-behavior-x: contain;
          -webkit-overflow-scrolling: touch;
          min-width: 0;
        }
        .ssc__fig-frame:focus-visible {
          outline: 2px solid var(--ssc-cyan);
          outline-offset: 3px;
        }
        .ssc-fig-svg {
          display: block;
          width: 100%;
          min-width: 40rem;
          height: auto;
        }

        /* ---- THE SEAT TOGGLE ------------------------------------------------
           Three toggle buttons that decide whose half of the drawing is live.

           DIMMED, NOT HIDDEN, and the distinction carries the design point.
           The guide in Circuit Realignment CAN see the answer — the whole
           minigame is that they can see it and cannot act on it. Removing
           their panel when the reader sits in the blind hand's seat would
           state the opposite. 12% leaves the shape legible as something
           present and out of reach.

           Everything per-player is already inside a data-tone group in all
           three figures, so this needs no geometry: the two players were the
           organising principle of the drawings from the start. */
        .ssc-fig-svg [data-tone] { transition: opacity 260ms ease; }
        .ssc-fig-svg[data-seat="a"] [data-tone="b"],
        .ssc-fig-svg[data-seat="b"] [data-tone="a"] { opacity: 0.12; }

        .ssc__seats {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin: 0.2rem 0 0.1rem;
        }
        .ssc__seat {
          -webkit-appearance: none;
          appearance: none;
          margin: 0;
          padding: 0.34rem 0.75rem 0.38rem;
          font: inherit;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.06em;
          cursor: pointer;
          /* THE RESTING AFFORDANCE. A full hairline at rest, so all three read
             as controls before anything is pressed — the same rule the orrery
             discs and the level rail follow. */
          border: 1px solid var(--ssc-edge);
          border-radius: 999px;
          background: color-mix(in srgb, var(--color-nightfall) 55%, transparent);
          color: var(--ssc-quiet);
          transition: color 180ms ease, border-color 180ms ease, background-color 180ms ease;
        }
        /* Each seat button wears the tone of the half it selects, so the
           control is colour-keyed to the drawing before it is read. */
        .ssc__seat[data-tone="a"] { --seat-tone: var(--ssc-cyan); }
        .ssc__seat[data-tone="b"] { --seat-tone: var(--ssc-warm); }
        .ssc__seat[data-tone="both"] { --seat-tone: var(--color-moonlight); }

        .ssc__seat:hover {
          color: var(--color-moonlight);
          border-color: color-mix(in srgb, var(--seat-tone) 55%, transparent);
        }
        .ssc__seat[aria-pressed="true"] {
          color: var(--color-void);
          background: var(--seat-tone);
          border-color: var(--seat-tone);
        }
        .ssc__seat:focus-visible {
          outline: 2px solid var(--ssc-cyan);
          outline-offset: 2px;
        }

        /* The rail below the drawing dims with it, so the picture and the
           prose never disagree about whose half is being looked at. */
        .ssc__split[data-seat="a"] .ssc__side[data-tone="b"],
        .ssc__split[data-seat="b"] .ssc__side[data-tone="a"] { opacity: 0.4; }
        .ssc__side { transition: opacity 260ms ease; }

        /* Visually hidden, but announced. */
        .ssc__sr {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
          border: 0;
        }

        @media (prefers-reduced-motion: reduce) {
          .ssc-fig-svg [data-tone],
          .ssc__side,
          .ssc__seat { transition: none; }
        }

        /* Who is who: left is always A and cyan, right always B and warm. */
        .ssc-fig-svg [data-tone="a"],
        .ssc__side[data-tone="a"] { --tone: var(--ssc-cyan); }
        .ssc-fig-svg [data-tone="b"],
        .ssc__side[data-tone="b"] { --tone: var(--ssc-warm); }

        /* --- figure primitives --- */
        .ssc-fig-panel {
          fill: var(--ssc-inner);
          stroke: var(--ssc-edge);
          stroke-width: 1;
        }
        .ssc-fig-panel.is-shared { stroke: color-mix(in srgb, var(--color-mist) 45%, transparent); }
        .ssc-fig-tab { fill: var(--tone, var(--ssc-edge)); }
        .ssc-fig-name {
          font-family: var(--font-hero);
          font-size: 14px;
          fill: var(--tone, var(--color-moonlight));
        }
        .ssc-fig-chip {
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.08em;
          fill: var(--ssc-quiet);
        }
        .ssc-fig-chip.is-tight { font-size: 8.5px; letter-spacing: 0.04em; }
        .ssc-fig-shared {
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          fill: var(--ssc-quiet);
        }
        .ssc-fig-stakes {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.1em;
          fill: var(--ssc-quiet);
        }

        /* --- the broken channel, identical in all three figures --- */
        .ssc-chan-arc {
          fill: none;
          stroke: var(--ssc-quiet);
          stroke-width: 1.4;
          stroke-dasharray: 5 5;
          opacity: 0.75;
        }
        .ssc-chan-jag {
          fill: none;
          stroke: var(--ssc-warm);
          stroke-width: 1.6;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .ssc-chan-pill {
          fill: var(--ssc-panel);
          stroke: color-mix(in srgb, var(--ssc-warm) 55%, transparent);
          stroke-width: 1;
        }
        .ssc-chan-label {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          fill: var(--ssc-warm);
        }

        /* --- 01 the maze --- */
        .ssc-maze-grid line { stroke: var(--ssc-line); stroke-width: 1; }
        .ssc-maze-grid.is-dim line { opacity: 0.45; }
        .ssc-maze-wall line {
          stroke: var(--ssc-warm);
          stroke-width: 2.6;
          stroke-linecap: square;
        }
        .ssc-maze-node { fill: var(--ssc-cyan); }
        .ssc-maze-ghost {
          fill: none;
          stroke: var(--ssc-cyan);
          stroke-width: 1.2;
          stroke-dasharray: 3 3;
        }
        .ssc-maze-input path { fill: var(--ssc-cyan); opacity: 0.55; }
        .ssc-maze-src {
          fill: none;
          stroke: var(--ssc-warm);
          stroke-width: 1.6;
        }
        .ssc-maze-src-core { fill: var(--ssc-warm); }

        /* --- 02 the welder --- */
        .ssc-weld-crack {
          fill: none;
          stroke: var(--ssc-quiet);
          stroke-width: 2.2;
          stroke-linecap: round;
          stroke-linejoin: round;
          opacity: 0.8;
        }
        .ssc-weld-rivet circle { fill: var(--ssc-line); }
        .ssc-weld-tool { fill: var(--color-moonlight); }
        .ssc-weld-tool-ring {
          fill: none;
          stroke: var(--color-moonlight);
          stroke-width: 1;
          opacity: 0.5;
        }
        .ssc-axis {
          stroke: var(--tone);
          stroke-width: 2;
        }
        .ssc-axis-head { fill: var(--tone); }
        .ssc-axis-lead {
          fill: none;
          stroke: var(--tone);
          stroke-width: 1.2;
          stroke-dasharray: 4 4;
          opacity: 0.7;
        }
        .ssc-ctrl-track { stroke: var(--tone); stroke-width: 1.6; opacity: 0.7; }
        .ssc-ctrl-head { fill: var(--tone); opacity: 0.7; }
        .ssc-ctrl-grip { fill: var(--tone); }

        /* --- 03 the waveform --- */
        .ssc-scope {
          fill: color-mix(in srgb, var(--color-void) 82%, var(--color-nightfall));
          stroke: var(--ssc-edge);
          stroke-width: 1;
        }
        .ssc-scope-mid {
          stroke: var(--ssc-line);
          stroke-width: 1;
          stroke-dasharray: 3 4;
        }
        .ssc-scope-tick { stroke: var(--ssc-line); stroke-width: 1; opacity: 0.5; }
        .ssc-scope-wave {
          fill: none;
          stroke: var(--tone, var(--ssc-cyan));
          stroke-width: 2;
          stroke-linejoin: round;
        }
        .ssc-dial-label {
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          fill: var(--ssc-quiet);
        }
        .ssc-dial-track { stroke: var(--ssc-line); stroke-width: 3; stroke-linecap: round; }
        .ssc-dial-fill { stroke: var(--tone); stroke-width: 3; stroke-linecap: round; }
        .ssc-dial-grip { fill: var(--tone); }
        .ssc-dial.is-absent .ssc-dial-track { stroke-dasharray: 3 5; opacity: 0.55; }
        .ssc-dial.is-absent .ssc-dial-label { opacity: 0.55; }
        .ssc-dial-none {
          fill: none;
          stroke: var(--ssc-quiet);
          stroke-width: 1.4;
          stroke-linecap: round;
          opacity: 0.6;
        }

        /* ---- the split, as text ---- */
        .ssc__split {
          margin: 0;
          display: grid;
          gap: 1px;
          background: var(--ssc-edge);
          border: 1px solid var(--ssc-edge);
        }
        @media (min-width: 44rem) {
          .ssc__split { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        .ssc__side {
          background: var(--ssc-panel);
          border-top: 3px solid var(--tone, var(--ssc-edge));
          padding: 0.9rem 1rem 1rem;
          display: grid;
          gap: 0.45rem;
          align-content: start;
          min-width: 0;
        }
        .ssc__side-name {
          margin: 0;
          font-family: var(--font-hero);
          font-size: 1.05rem;
          letter-spacing: 0.02em;
          color: var(--tone, var(--color-moonlight));
        }
        .ssc__side-lines { margin: 0; display: grid; gap: 0.4rem; }
        .ssc__side-line {
          display: grid;
          grid-template-columns: 4.5rem minmax(0, 1fr);
          gap: 0.6rem;
          font-size: 0.85rem;
          line-height: 1.6;
          color: var(--ssc-quiet);
        }
        .ssc__side-key {
          font-size: 0.70rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--ssc-quiet);
          opacity: 0.8;
          padding-top: 0.22rem;
        }
        .ssc__fig-barrier {
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.55rem;
          font-size: 0.71rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ssc-warm);
        }
        .ssc__fig-barrier-jag {
          flex: none;
          width: 1.6rem;
          height: 1px;
          background:
            repeating-linear-gradient(90deg, currentColor 0 4px, transparent 4px 8px);
          opacity: 0.8;
        }

        /* ---- the beat rail: split / twist / cost ---- */
        .ssc__beats {
          margin: 0;
          max-width: 46rem;
          display: grid;
          gap: 0.9rem;
        }
        .ssc__beat {
          display: grid;
          gap: 0.3rem;
          padding-left: 0.95rem;
          border-left: 1px solid var(--ssc-edge);
          min-width: 0;
        }
        .ssc__beat-term {
          font-size: 0.70rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ssc-cyan);
        }
        .ssc__beat-body {
          margin: 0;
          font-size: 0.92rem;
          line-height: 1.75;
          color: var(--ssc-quiet);
        }

        /* ---- the puzzle loop ---- */
        .ssc__aside {
          display: grid;
          gap: 0.9rem;
          padding: 1.15rem 1.2rem 1.3rem;
          border: 1px solid var(--ssc-edge);
          background: color-mix(in srgb, var(--ssc-panel) 70%, transparent);
          min-width: 0;
        }
        .ssc__aside-title {
          margin: 0;
          font-size: 0.70rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--ssc-warm);
        }
        .ssc__steps {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 0.85rem;
        }
        .ssc__step {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: 0.85rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--ssc-edge);
          min-width: 0;
        }
        .ssc__step:first-child { padding-top: 0; border-top: 0; }
        .ssc__step-order {
          margin: 0;
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          color: var(--ssc-cyan);
          padding-top: 0.15rem;
        }
        .ssc__step-copy { display: grid; gap: 0.2rem; min-width: 0; }
        .ssc__step-label {
          margin: 0;
          font-size: 0.95rem;
          line-height: 1.5;
          color: var(--color-moonlight);
        }
        .ssc__step-body {
          margin: 0;
          font-size: 0.88rem;
          line-height: 1.7;
          color: var(--ssc-quiet);
        }

        /* ---- the Symbiochord panel: the part of the pattern worth the words ---- */
        .ssc__highlight {
          position: relative;
          background: var(--ssc-panel);
          border: 1px solid color-mix(in srgb, var(--ssc-cyan) 30%, transparent);
          padding: 1.2rem 1.3rem 1.35rem;
          display: grid;
          gap: 0.6rem;
          min-width: 0;
        }
        .ssc__highlight::before {
          content: "";
          position: absolute;
          inset: -1px auto -1px -1px;
          width: 3px;
          background: var(--ssc-cyan);
        }
        .ssc__highlight-title {
          margin: 0;
          font-family: var(--font-hero);
          font-size: 1.1rem;
          letter-spacing: 0.02em;
          color: var(--color-moonlight);
        }
        .ssc__highlight-body {
          margin: 0;
          max-width: 46rem;
          font-size: 0.94rem;
          line-height: 1.75;
          color: var(--ssc-quiet);
        }

        /* ---- the line that hands a block back to the thesis ---- */
        .ssc__point {
          margin: 0;
          max-width: 46rem;
          display: grid;
          gap: 0.4rem;
          padding-top: 0.85rem;
          border-top: 1px solid var(--ssc-edge);
        }
        .ssc__point-tag {
          font-size: 0.70rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ssc-warm);
        }
        .ssc__point-body {
          font-size: 0.98rem;
          line-height: 1.7;
          color: var(--color-moonlight);
        }

        /* ---- motion ----
           One animation in the section, and it is the same one three times: a
           slow breath on the element each figure's players are fighting over —
           the node, the welder, the dial grips. Purely decorative; the figures
           read identically when still, and the split is written out in text
           underneath either way, so reduced motion simply gets them lit. */
        .ssc-pulse { opacity: 1; }
        @media (prefers-reduced-motion: no-preference) {
          .ssc-pulse { animation: ssc-breathe 3.2s ease-in-out infinite; }
        }
        @keyframes ssc-breathe {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
      `}</style>
    </div>
  );
}

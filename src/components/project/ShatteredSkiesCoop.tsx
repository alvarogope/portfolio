import {
  knowledgeGating,
  minigames,
  puzzlePattern,
  roleNote,
  thesis,
  type Beat,
  type BlockMeta,
  type Minigame,
  type MinigameSide,
} from "@/content/shattered-skies-gameplay";

/**
 * Shattered Skies — co-op design. The depth behind the mechanics section.
 *
 * WHAT IT IS. Three minigame breakdowns, each with a small schematic of its
 * asymmetry, then two compact supporting blocks: the co-op puzzle pattern and
 * the knowledge-gating rule. `ShatteredSkiesMechanics` further up the page
 * introduces the ship and the communication barrier and points here; nothing
 * in this component restates it.
 *
 * THE THREE FIGURES SHARE A GRAMMAR, on purpose — they are three expressions
 * of one thesis, so they are drawn with one visual vocabulary and differ only
 * where the design differs:
 *
 *   · a BROKEN ARC across the top of every figure, with the barrier label
 *     sitting in the gap. Same path, same pill, same place, all three times:
 *     the channel between the players is the constant.
 *   · LEFT IS ALWAYS PLAYER A AND CYAN, RIGHT IS ALWAYS PLAYER B AND WARM, in
 *     all three drawings and in the text rail beneath them, so a reader who
 *     learns the code once can read the other two at a glance.
 *   · the body of each figure is what the split actually looks like: two
 *     screens holding different knowledge (maze, waveform), or two controls
 *     holding different halves of one tool (welder).
 *
 * DATA, NOT COPY. Every string a figure prints — panel names, the compressed
 * chips inside the panels, the barrier label, the stakes line, the dial names —
 * comes from `shattered-skies-gameplay.ts`. The component owns geometry and
 * nothing else, which is what keeps the drawing and its `<desc>` from drifting
 * apart about who can see what.
 *
 * ACCESSIBILITY. Each figure is one `role="img"` with a `<title>` and a
 * `<desc>` that names who sees what and who controls what, rather than a
 * scatter of loose text nodes. Underneath every figure the same split is
 * repeated as a real HTML definition list — side, what it sees, what it
 * controls — so nothing is lost when the drawing is scrolled past, zoomed, or
 * read aloud. The drawings scroll rather than shrink below about 640px,
 * because the mono labels are 9–11px in viewBox units and stop being readable
 * long before the picture stops fitting; the scroll frame is focusable so a
 * keyboard can reach it.
 *
 * ATTRIBUTION. The credit line at the top says co-designed with the team, in
 * those words, before anything is described. Team of five; my seat was systems
 * and world design.
 */

/* ==========================================================================
   FIGURE GEOMETRY
   ==========================================================================
   One 720×380 canvas for all three. Two layouts inside it: SPLIT (two equal
   screens, used by the maze and the waveform) and SHARED (two narrow control
   blocks flanking one object, used by the welder). */

const W = 720;
const H = 380;

/** The broken channel. The pill sits in the gap; the arcs stop at its edges. */
const PILL = { x: 250, y: 8, w: 220, h: 30 };

/** Arc ends land above the centre of each panel — narrow for SPLIT, wide for SHARED. */
const ARC = {
  split: ["M 176 100 C 206 62, 220 42, 250 26", "M 470 26 C 500 42, 514 62, 544 100"],
  shared: ["M 88 100 C 138 60, 194 40, 250 26", "M 470 26 C 526 40, 582 60, 632 100"],
} as const;

/** SPLIT layout: two screens, 336 wide, 32 apart. */
const PANEL = { y: 104, h: 240, w: 336 };
const PANEL_X = { a: 8, b: 376 } as const;
/** Where a panel's own content may start, below its name and chip. */
const CONTENT_Y = PANEL.y + 62;

/** SHARED layout: control block, one object, control block. */
const CTRL = { y: 104, h: 176, w: 160 };
const CTRL_X = { a: 8, b: 552 } as const;
const PLATE = { x: 216, y: 104, w: 288, h: 200 };

const STAKES_Y = 366;

/* ---- small drawing helpers ---------------------------------------------- */

/** A filled arrowhead at (x, y) pointing in one of four directions. */
function head(x: number, y: number, dir: "l" | "r" | "u" | "d", s = 6) {
  const t = s * 0.62;
  if (dir === "r") return `M ${x} ${y} L ${x - s} ${y - t} L ${x - s} ${y + t} Z`;
  if (dir === "l") return `M ${x} ${y} L ${x + s} ${y - t} L ${x + s} ${y + t} Z`;
  if (dir === "u") return `M ${x} ${y} L ${x - t} ${y + s} L ${x + t} ${y + s} Z`;
  return `M ${x} ${y} L ${x - t} ${y - s} L ${x + t} ${y - s} Z`;
}

/** A sine, sampled. `amp` is the height and `cycles` the pitch — the two
    properties the sensor minigame asks the players to agree on. */
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

/* ---- shared figure furniture -------------------------------------------- */

/** The constant of all three drawings: a channel that does not reach across. */
function BrokenChannel({ label, layout }: { label: string; layout: "split" | "shared" }) {
  const [left, right] = ARC[layout];
  return (
    <g className="ssc-chan">
      <path className="ssc-chan-arc" d={left} />
      <path className="ssc-chan-arc" d={right} />
      {/* The severed ends, pointing into the gap. */}
      <path className="ssc-chan-jag" d="M 244 12 L 236 23 L 244 34" />
      <path className="ssc-chan-jag" d="M 476 12 L 484 23 L 476 34" />
      <rect className="ssc-chan-pill" x={PILL.x} y={PILL.y} width={PILL.w} height={PILL.h} rx={2} />
      <text className="ssc-chan-label" x={PILL.x + PILL.w / 2} y={PILL.y + 20} textAnchor="middle">
        {label}
      </text>
    </g>
  );
}

/** One player's screen in the SPLIT layout. */
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

/** One player's control block in the SHARED layout. */
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

/* ==========================================================================
   FIGURE 01 · CIRCUIT REALIGNMENT — the knowledge split
   ==========================================================================
   The same 8×8 lattice is drawn twice. The left copy is missing the walls and
   the source; the right copy has them and cannot move the node. That single
   difference between two otherwise identical grids is the whole drawing. */

const CELL = 20;
const GRID = CELL * 8;
const GRID_Y = CONTENT_Y;
/** Grid origin inside a panel — centred horizontally. */
const gridX = (panelX: number) => panelX + (PANEL.w - GRID) / 2;

/** Walls, in cell coordinates. `h` sits on a cell's top edge, `v` on its left. */
const WALL_H: readonly (readonly [number, number])[] = [
  [1, 2], [2, 2], [3, 2], [5, 1], [6, 1], [0, 4], [1, 4],
  [2, 4], [4, 5], [5, 5], [6, 5], [2, 6], [3, 6],
];
const WALL_V: readonly (readonly [number, number])[] = [
  [2, 0], [2, 1], [5, 2], [5, 3], [3, 4], [3, 5], [6, 6], [6, 7], [1, 5],
];

/** The node the blind player drives, and the source it has to reach. */
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

      {/* ---- left: the hand. The lattice, the node, and nothing else. ---- */}
      <Screen side={a}>
        <Lattice x={ax} dim />
        {/* The four inputs this player has, drawn around the node they own. */}
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

      {/* ---- right: the guide. Every wall, the source, and no input. ---- */}
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
        {/* The source: what the node has to be driven to. */}
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
        {/* The node as an outline: visible to the guide, untouchable by them. */}
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

/* ==========================================================================
   FIGURE 02 · SEAL HULL BREACH — the control split
   ==========================================================================
   One object in the middle and two controls that each own one axis of it. The
   left control's line runs straight in along the horizontal axis; the right
   control's drops under the plate and comes up the vertical one, so the two
   axes are legible before either label is read. */

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

      {/* ---- the shared object ---- */}
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

      {/* ---- player A: the horizontal axis, straight in from the left ---- */}
      <g data-tone="a">
        <line className="ssc-axis-lead" x1={CTRL_X.a + CTRL.w} y1={trackY} x2={252} y2={trackY} />
        <line className="ssc-axis" x1={258} y1={WELD.y} x2={462} y2={WELD.y} />
        <path className="ssc-axis-head" d={head(252, WELD.y, "l")} />
        <path className="ssc-axis-head" d={head(468, WELD.y, "r")} />
      </g>

      {/* ---- player B: the vertical axis, in under the plate from the right ---- */}
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

      {/* The one tool, at the intersection of two people's inputs. */}
      <circle className="ssc-weld-tool ssc-pulse" cx={WELD.x} cy={WELD.y} r={6.5} />
      <circle className="ssc-weld-tool-ring" cx={WELD.x} cy={WELD.y} r={11} />

      {/* ---- the two controls ---- */}
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

/* ==========================================================================
   FIGURE 03 · CALIBRATE SENSORS — both halves of the split
   ==========================================================================
   Two scopes at identical geometry so the mismatch is a direct comparison, and
   two dials that exist on one screen and are drawn as absences on the other. */

const SCOPE = { y: CONTENT_Y, h: 96, inset: 24 };
const SCOPE_MID = SCOPE.y + SCOPE.h / 2;
/** The two dial rows, at the same y on both screens so the absence lines up. */
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
  /** Where each dial currently sits — both short of the target, which is the point. */
  const dialAt = [0.34, 0.24] as const;

  return (
    <>
      <BrokenChannel label={game.diagram.barrier} layout="split" />

      {/* ---- left: the target, and no way to act on it ---- */}
      <Screen side={a}>
        <Scope
          panelX={PANEL_X.a}
          path={wave(PANEL_X.a + SCOPE.inset, SCOPE_MID, scopeW, 34, 2.5)}
        />
        {/* The dials this player does not have, drawn as the gap they are. */}
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

      {/* ---- right: the dials, and only the wave they are making ---- */}
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

/* ---- the figure wrapper -------------------------------------------------- */

const FIGURES = {
  maze: MazeFigure,
  welder: WelderFigure,
  waveform: WaveformFigure,
} as const;

function AsymmetryFigure({ game }: { game: Minigame }) {
  const Figure = FIGURES[game.diagram.variant];
  return (
    <svg
      className="ssc-fig-svg"
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

/* ---- prose furniture ----------------------------------------------------- */

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

/** split → twist → cost, in that order every time. */
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

export default function ShatteredSkiesCoop() {
  return (
    <div className="ssc">
      {/* The credit comes first, and says co-designed in that word. */}
      <p className="mono ssc__role">
        <span className="ssc__role-mark" aria-hidden="true" />
        <span>
          <strong className="ssc__role-name">{roleNote.headline}</strong> · {roleNote.role} ·{" "}
          {roleNote.body}
        </span>
      </p>

      {/* ---- the thesis the three figures are three versions of ---- */}
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

      {/* ================= 01 · the three minigames ================= */}
      <article className="ssc__block" aria-labelledby="ssc-minigames-title">
        <BlockHeader {...minigames.meta} titleId="ssc-minigames-title" />
        <p className="ssc__lead">{minigames.lead}</p>

        <ol className="ssc__games">
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
                  <p className="ssc__game-standfirst">{g.standfirst}</p>
                </div>
              </header>

              <p className="ssc__game-premise">{g.premise}</p>

              {/* ---- the asymmetry, drawn ---- */}
              <figure className="ssc__fig" aria-labelledby={`ssc-figcap-${g.id}`}>
                <figcaption className="mono ssc__fig-cap" id={`ssc-figcap-${g.id}`}>
                  {g.diagram.title}
                </figcaption>

                {/* Scrolls rather than shrinks: the mono labels stop being
                    readable well before the drawing stops fitting. */}
                <div
                  className="ssc__fig-frame"
                  tabIndex={0}
                  role="group"
                  aria-label={g.diagram.title}
                >
                  <AsymmetryFigure game={g} />
                </div>

                {/* The same split as real text, at every width. */}
                <dl className="ssc__split">
                  {g.sides.map((s) => (
                    <div key={s.id} className="ssc__side" data-tone={s.id}>
                      <dt className="ssc__side-name">{s.label}</dt>
                      <dd className="ssc__side-lines">
                        <span className="ssc__side-line">
                          <span className="mono ssc__side-key">Sees</span>
                          <span>{s.sees}</span>
                        </span>
                        <span className="ssc__side-line">
                          <span className="mono ssc__side-key">Controls</span>
                          <span>{s.controls}</span>
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>

                <p className="mono ssc__fig-barrier">
                  <span className="ssc__fig-barrier-jag" aria-hidden="true" />
                  {g.diagram.barrier} — between the two, carrying neither
                </p>
              </figure>

              <BeatRail beats={[g.split, g.barrierTwist, g.failure]} />
              <DesignPoint body={g.designPoint} />
            </li>
          ))}
        </ol>

        <p className="ssc__close">{minigames.close}</p>
      </article>

      {/* ================= 02 · the puzzle pattern ================= */}
      <article className="ssc__block ssc__block--compact" aria-labelledby="ssc-pattern-title">
        <BlockHeader {...puzzlePattern.meta} titleId="ssc-pattern-title" />
        <p className="ssc__lead">{puzzlePattern.lead}</p>

        <section className="ssc__aside" aria-labelledby="ssc-loop-title">
          <h4 className="mono ssc__aside-title" id="ssc-loop-title">
            {puzzlePattern.stepsLabel}
          </h4>
          <ol className="ssc__steps">
            {puzzlePattern.steps.map((s) => (
              <li key={s.id} className="ssc__step">
                <p className="mono ssc__step-order" aria-hidden="true">
                  {s.order}
                </p>
                <div className="ssc__step-copy">
                  <p className="ssc__step-label">{s.label}</p>
                  <p className="ssc__step-body">{s.body}</p>
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

        <DesignPoint body={puzzlePattern.designPoint} />
      </article>

      {/* ================= 03 · knowledge-gated exploration ================= */}
      <article className="ssc__block ssc__block--compact" aria-labelledby="ssc-gating-title">
        <BlockHeader {...knowledgeGating.meta} titleId="ssc-gating-title" />
        <p className="ssc__lead">{knowledgeGating.lead}</p>
        <BeatRail
          beats={[knowledgeGating.rule, knowledgeGating.example, knowledgeGating.crossRef]}
        />
        <DesignPoint body={knowledgeGating.designPoint} />
      </article>

      <style>{`
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
          font-size: 0.62rem;
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
          font-size: 0.66rem;
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
          font-size: 0.66rem;
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

        .ssc__lead,
        .ssc__close {
          margin: 0;
          max-width: 46rem;
          font-size: 0.98rem;
          line-height: 1.8;
          color: var(--color-moonlight);
        }
        .ssc__close {
          padding-top: 1rem;
          border-top: 1px solid var(--ssc-edge);
          color: var(--ssc-quiet);
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
          font-size: 0.64rem;
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
          font-size: 0.62rem;
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
          font-size: 0.6rem;
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
          font-size: 0.64rem;
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
          font-size: 0.62rem;
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
          font-size: 0.62rem;
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
          font-size: 0.66rem;
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
          font-size: 0.62rem;
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

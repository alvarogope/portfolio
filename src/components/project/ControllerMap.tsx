import {
  contextNote,
  controlBindings,
  controlsById,
  controlsIntro,
  groupLabels,
  groupOrder,
  padSummary,
  type ControlGroup,
  type ControlId,
} from "@/content/moon-knight-controls";
import InteractiveHint from "./InteractiveHint";

const VB = { x: 52, y: 12, w: 536, h: 374 };

const BODY =
  "M 200 100 Q 320 86 440 100 " +
  "C 508 104 548 140 560 202 " +
  "C 574 274 560 336 522 362 " +
  "C 486 386 446 370 428 332 " +
  "C 410 306 378 300 320 300 " +
  "C 262 300 230 306 212 332 " +
  "C 194 370 154 386 118 362 " +
  "C 80 336 66 274 80 202 " +
  "C 92 140 132 104 200 100 Z";

const LEFT_STICK = { x: 198, y: 172, r: 40 };
const RIGHT_STICK = { x: 398, y: 258, r: 40 };
const DPAD = { x: 252, y: 258, arm: 17, thick: 15 };
const FACE = { x: 462, y: 170, r: 19, spread: 38 };
const GUIDE = { x: 320, y: 132, r: 15 };
const VIEW = { x: 274, y: 164, r: 11 };
const MENU = { x: 366, y: 164, r: 11 };

const FACE_BUTTONS: { id: ControlId; dx: number; dy: number }[] = [
  { id: "y", dx: 0, dy: -FACE.spread },
  { id: "x", dx: -FACE.spread, dy: 0 },
  { id: "b", dx: FACE.spread, dy: 0 },
  { id: "a", dx: 0, dy: FACE.spread },
];

const STICKS: { id: ControlId; press: ControlId; s: typeof LEFT_STICK }[] = [
  { id: "left-stick", press: "left-stick-press", s: LEFT_STICK },
  { id: "right-stick", press: "right-stick-press", s: RIGHT_STICK },
];

function dpadPath(cx: number, cy: number, arm: number, t: number) {
  return (
    `M ${cx - t} ${cy - t - arm} H ${cx + t} V ${cy - t} H ${cx + t + arm} ` +
    `V ${cy + t} H ${cx + t} V ${cy + t + arm} H ${cx - t} V ${cy + t} ` +
    `H ${cx - t - arm} V ${cy - t} H ${cx - t} Z`
  );
}

const HIGHLIGHT_RULES = controlBindings
  .map(
    (c) => `
      .cm:has([data-ctl="${c.id}"]:hover) [data-ctl="${c.id}"],
      .cm:has([data-ctl="${c.id}"]:focus-visible) [data-ctl="${c.id}"] { --cm-on: 1; }
      .cm:has([data-ctl="${c.id}"]:hover) [data-detail="${c.id}"],
      .cm:has([data-ctl="${c.id}"]:focus-visible) [data-detail="${c.id}"] {
        visibility: visible; opacity: 1;
      }`
  )
  .join("");

function Pad() {
  return (
    <svg
      className="cm__pad"
      viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}
      role="img"
      aria-labelledby="cm-pad-title cm-pad-desc"
      focusable="false"
    >
      <title id="cm-pad-title">Moon-Knight gamepad layout</title>
      <desc id="cm-pad-desc">{padSummary}</desc>

      <defs>
        <linearGradient id="cm-shell" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#232A38" />
          <stop offset="100%" stopColor="#12171F" />
        </linearGradient>
      </defs>

      {/* ---- triggers, behind the shell so they read as further away ---- */}
      <g className="cm__trigger" data-ctl="lt">
        <rect x="140" y="28" width="80" height="36" rx="17" transform="rotate(-7 180 46)" />
        <text className="cm__code" x="180" y="52" textAnchor="middle">
          {controlsById.lt.code}
        </text>
      </g>
      <g className="cm__trigger" data-ctl="rt">
        <rect x="420" y="28" width="80" height="36" rx="17" transform="rotate(7 460 46)" />
        <text className="cm__code" x="460" y="52" textAnchor="middle">
          {controlsById.rt.code}
        </text>
      </g>

      {/* ---- bumpers ---- */}
      <g className="cm__bumper" data-ctl="lb">
        <rect x="122" y="64" width="108" height="32" rx="15" transform="rotate(-6 176 80)" />
        <text className="cm__code" x="176" y="86" textAnchor="middle">
          {controlsById.lb.code}
        </text>
      </g>
      <g className="cm__bumper" data-ctl="rb">
        <rect x="410" y="64" width="108" height="32" rx="15" transform="rotate(6 464 80)" />
        <text className="cm__code" x="464" y="86" textAnchor="middle">
          {controlsById.rb.code}
        </text>
      </g>

      {/* ---- the shell ---- */}
      <path className="cm__body" d={BODY} />
      {/* A second, inset outline: the pad reads as forged rather than moulded,
          which is the only concession this drawing makes to the gothic route. */}
      <path
        className="cm__body-inner"
        d={BODY}
        transform="translate(320 220) scale(0.955) translate(-320 -220)"
      />

      {/* ---- guide, inert: it belongs to the console, not the game ---- */}
      <circle className="cm__guide" cx={GUIDE.x} cy={GUIDE.y} r={GUIDE.r} />

      {/* ---- system buttons ---- */}
      <g className="cm__small" data-ctl="view">
        <circle cx={VIEW.x} cy={VIEW.y} r={VIEW.r} />
        <g className="cm__glyph">
          <rect x={VIEW.x - 5} y={VIEW.y - 4} width="6" height="8" rx="1" />
          <rect x={VIEW.x + 1} y={VIEW.y - 4} width="4" height="8" rx="1" />
        </g>
      </g>
      <g className="cm__small" data-ctl="menu">
        <circle cx={MENU.x} cy={MENU.y} r={MENU.r} />
        <g className="cm__glyph">
          <rect x={MENU.x - 5} y={MENU.y - 4} width="10" height="1.8" rx="0.9" />
          <rect x={MENU.x - 5} y={MENU.y - 0.9} width="10" height="1.8" rx="0.9" />
          <rect x={MENU.x - 5} y={MENU.y + 2.2} width="10" height="1.8" rx="0.9" />
        </g>
      </g>

      {/* ---- sticks: the well is the stick, the cap is the click ---- */}
      {STICKS.map(({ id, press, s }) => (
        <g key={id} className="cm__stick">
          <g data-ctl={id}>
            <circle className="cm__stick-well" cx={s.x} cy={s.y} r={s.r} />
          </g>
          <g data-ctl={press}>
            <circle className="cm__stick-cap" cx={s.x} cy={s.y} r={s.r - 13} />
            <text className="cm__code cm__code--cap" x={s.x} y={s.y + 5} textAnchor="middle">
              {controlsById[press].code}
            </text>
          </g>
        </g>
      ))}

      {/* ---- d-pad ---- */}
      <g className="cm__dpad" data-ctl="dpad">
        <path d={dpadPath(DPAD.x, DPAD.y, DPAD.arm, DPAD.thick)} />
      </g>

      {/* ---- face buttons ---- */}
      {FACE_BUTTONS.map(({ id, dx, dy }) => (
        <g key={id} className="cm__face" data-ctl={id}>
          <circle cx={FACE.x + dx} cy={FACE.y + dy} r={FACE.r} />
          <text className="cm__code" x={FACE.x + dx} y={FACE.y + dy + 6} textAnchor="middle">
            {controlsById[id].code}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function ControllerMap() {
  const grouped = groupOrder
    .map((g) => ({ group: g, items: controlBindings.filter((c) => c.group === g) }))
    .filter((g) => g.items.length > 0);

  return (
    <section className="cm" aria-label="Control scheme">
      <header className="cm__head">
        <p className="mono cm__kicker">{controlsIntro.kicker}</p>
        <h3 className="cm__title">{controlsIntro.title}</h3>
        <p className="cm__body-copy">{controlsIntro.body}</p>
        <InteractiveHint
          what="control"
          does="the pad and the list light up together, and its reasoning reads out beside them"
        />
      </header>

      <div className="cm__grid">
        {/* ---- left: the pad, and the readout that follows it ---- */}
        <div className="cm__padcol">
          <figure className="cm__figure">
            <Pad />
          </figure>

          {/* Decorative */}
          <div className="cm__readout" aria-hidden="true">
            <p className="cm__readout-idle">{controlsIntro.hint}</p>
            {controlBindings.map((c) => (
              <div key={c.id} className="cm__detail" data-detail={c.id}>
                <p className="cm__detail-head">
                  <span className="mono cm__chip">{c.input}</span>
                  <span className="cm__detail-action">{c.action}</span>
                </p>
                {c.combat && (
                  <p className="cm__detail-head">
                    <span className="mono cm__combat-tag">In combat</span>
                    <span className="cm__detail-action">{c.combat.action}</span>
                  </p>
                )}
                {c.note && <p className="cm__detail-note">{c.note}</p>}
                {c.combat && <p className="cm__detail-note">{c.combat.why}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* ---- right: the whole mapping, short rows so it fits beside the pad ---- */}
        <div className="cm__legend">
          {grouped.map(({ group, items }) => (
            <section key={group} className="cm__group" aria-labelledby={`cm-g-${group}`}>
              <h4 className="mono cm__group-title" id={`cm-g-${group}`}>
                {groupLabels[group as ControlGroup]}
              </h4>
              <dl className="cm__rows">
                {items.map((c) => (
                  <div key={c.id} className="cm__row" data-ctl={c.id} tabIndex={0}>
                    <dt className="cm__row-input">
                      <span className="mono cm__chip">{c.input}</span>
                    </dt>
                    <dd className="cm__row-action">
                      <span className="cm__action">{c.action}</span>
                      {c.combat && (
                        <span className="cm__combat">
                          <span className="mono cm__combat-tag">In combat</span>
                          <span className="cm__combat-action">{c.combat.action}</span>
                        </span>
                      )}
                      {c.note && <span className="cm__note">{c.note}</span>}
                      {c.combat && <span className="cm__note">{c.combat.why}</span>}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </div>

      <aside className="cm__context">
        <p className="mono cm__context-label">{contextNote.label}</p>
        <p className="cm__context-body">{contextNote.body}</p>
      </aside>

      <style>{`
        .cm {
          --cm-edge: color-mix(in srgb, var(--color-mist) 26%, transparent);
          --cm-panel: color-mix(in srgb, var(--color-nightfall) 55%, var(--color-void));
          /* Mist alone is 5.24:1 on this route; blended toward moonlight the
             small mono clears AA everywhere it is used. */
          --cm-quiet: color-mix(in srgb, var(--color-mist) 62%, var(--color-moonlight));
          /* ---- the pad's one concession to colour ----
             This route is monochrome — lunar gold is aliased to silver — so the
             four hues on the face cluster are the only chroma in the drawing,
             and they are the four everybody already knows. Pulled slightly off
             the moulded-plastic originals so they sit on a night shell rather
             than on a 2005 console. */
          --cm-a: #6cc24a;
          --cm-b: #ef4a45;
          --cm-x: #4f9ce8;
          --cm-y: #f2c236;
          /* Every lit/unlit rule below is written against --cm-hue rather than
             a fixed colour, so a control tints itself by overriding ONE
             variable. Default is the route's own accent. */
          --cm-hue: var(--color-lunar-gold);
          --cm-on: 0;
          display: grid;
          gap: 1.5rem;
        }

        /* The pairing needs more width than the page column gives it, so the
           section breaks out — same move the Break-In consoles make, and the
           same rule about the right edge: it stops short of the project rail
           rather than running under it. This one is capped at 78rem rather
           than 82, so it reads --free-right from globals.css (see THE RIGHT
           GUTTER) instead of the shared --breakout-* trio. */
        @media (min-width: 1000px) {
          .cm {
            width: calc(min(47vw, 39rem) + min(47vw, 39rem, var(--free-right)));
            margin-left: calc(50% - min(47vw, 39rem));
            margin-right: calc(50% - min(47vw, 39rem, var(--free-right)));
          }
        }

        .cm__head { display: grid; gap: 0.6rem; max-width: 46rem; }
        .cm__kicker { margin: 0; font-size: 0.7rem; color: var(--color-lunar-gold); }
        .cm__title {
          margin: 0;
          font-family: var(--font-hero);
          font-size: clamp(1.2rem, 1rem + 0.9vw, 1.6rem);
          line-height: 1.2;
          color: var(--color-moonlight);
        }
        .cm__body-copy {
          margin: 0;
          font-size: 0.95rem;
          line-height: 1.65;
          color: color-mix(in srgb, var(--color-moonlight) 55%, var(--color-mist));
        }
        .cm__hint { margin: 0; font-size: 0.72rem; color: var(--cm-quiet); }

        /* ---- the pairing ---- */
        .cm__grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 1.5rem;
          align-items: start;
        }
        @media (min-width: 900px) {
          .cm__grid { grid-template-columns: minmax(0, 21rem) minmax(0, 1fr); gap: 2rem; }
        }
        @media (min-width: 1200px) {
          .cm__grid { grid-template-columns: minmax(0, 25rem) minmax(0, 1fr); }
        }

        .cm__padcol { display: grid; gap: 1rem; align-content: start; }

        .cm__figure {
          margin: 0;
          width: 100%;
          padding: 1rem;
          border: 1px solid var(--cm-edge);
          background: var(--color-void);
        }
        .cm__pad { display: block; width: 100%; height: auto; }

        .cm__body { fill: url(#cm-shell); stroke: var(--color-silver); stroke-width: 2; }
        .cm__body-inner {
          fill: none;
          stroke: color-mix(in srgb, var(--color-silver) 24%, transparent);
          stroke-width: 1;
        }
        /* Inert, but not colourless: the nexus ring is green on every one of
           these pads, and silver was the drawing's one wrong note. */
        .cm__guide {
          fill: color-mix(in srgb, var(--cm-a) 7%, transparent);
          stroke: color-mix(in srgb, var(--cm-a) 40%, transparent);
          stroke-width: 1.5;
        }

        /* Every interactive control shares one lit/unlit contract, driven by
           --cm-on, which the generated rules at the foot flip to 1. */
        .cm__trigger rect,
        .cm__bumper rect,
        .cm__small circle,
        .cm__stick-well,
        .cm__dpad path,
        .cm__face circle {
          fill: color-mix(
            in srgb,
            var(--cm-hue) calc(var(--cm-on) * 16%),
            color-mix(in srgb, var(--color-nightfall) 82%, var(--color-void))
          );
          stroke: color-mix(
            in srgb,
            var(--cm-hue) calc(var(--cm-on) * 100%),
            color-mix(in srgb, var(--color-silver) 52%, transparent)
          );
          stroke-width: calc(1.5px + var(--cm-on) * 1.1px);
          transition: stroke 160ms ease, fill 160ms ease;
        }
        /* The cap is its own control (the click), so it gets the same contract
           on its own --cm-on rather than inheriting the well's. */
        .cm__stick-cap {
          fill: color-mix(
            in srgb,
            var(--cm-hue) calc(var(--cm-on) * 22%),
            color-mix(in srgb, var(--color-void) 70%, var(--color-nightfall))
          );
          stroke: color-mix(
            in srgb,
            var(--cm-hue) calc(var(--cm-on) * 100%),
            color-mix(in srgb, var(--color-silver) 34%, transparent)
          );
          stroke-width: calc(1px + var(--cm-on) * 1.2px);
          transition: stroke 160ms ease, fill 160ms ease;
        }
        .cm__glyph rect {
          fill: color-mix(
            in srgb,
            var(--cm-hue) calc(var(--cm-on) * 100%),
            var(--cm-quiet)
          );
          stroke: none;
          transition: fill 160ms ease;
        }
        .cm__code {
          font-family: var(--font-mono);
          font-size: 15px;
          letter-spacing: 0.06em;
          fill: color-mix(
            in srgb,
            var(--cm-hue) calc(var(--cm-on) * 100%),
            var(--cm-quiet)
          );
          transition: fill 160ms ease;
        }
        .cm__code--cap { font-size: 13px; }

        /* ---- the face cluster wears its own colours ----
           The hue is set on the ID, not on the shape, so ONE declaration per
           button reaches both ends of the cross-lighting: the circle on the pad
           and the legend row that points at it light in the same green, red,
           blue or amber. Nothing else in the section had to learn about it. */
        .cm [data-ctl="a"] { --cm-hue: var(--cm-a); }
        .cm [data-ctl="b"] { --cm-hue: var(--cm-b); }
        .cm [data-ctl="x"] { --cm-hue: var(--cm-x); }
        .cm [data-ctl="y"] { --cm-hue: var(--cm-y); }

        /* A current Xbox pad is grey buttons with COLOURED LETTERS, not four
           coloured lozenges — that is the reference being drawn here. So the
           letter carries the hue at rest and the ring is only tinted by it;
           lighting the control brightens the letter and brings the ring up to
           full. Overrides the shared contract above by source order. */
        .cm__face circle {
          fill: color-mix(
            in srgb,
            var(--cm-hue) calc(7% + var(--cm-on) * 17%),
            color-mix(in srgb, var(--color-nightfall) 82%, var(--color-void))
          );
          stroke: color-mix(in srgb, var(--cm-hue) calc(42% + var(--cm-on) * 58%), transparent);
        }
        .cm__face .cm__code {
          fill: color-mix(
            in srgb,
            var(--cm-hue) calc(100% - var(--cm-on) * 26%),
            var(--color-moonlight)
          );
        }
        /* Zero radius at rest, so this is a glow that only exists while lit. */
        .cm__face {
          filter: drop-shadow(
            0 0 calc(var(--cm-on) * 7px) color-mix(in srgb, var(--cm-hue) 50%, transparent)
          );
          transition: filter 160ms ease;
        }

        /* ---- the readout ----
           Fixed height, so swapping the detail never moves the mapping beside
           it. Every block is stacked in the same cell and only the lit one is
           displayed. */
        .cm__readout {
          display: grid;
          align-content: start;
          padding: 0.95rem 1.1rem;
          border: 1px solid var(--cm-edge);
          border-left: 2px solid color-mix(in srgb, var(--color-lunar-gold) 55%, transparent);
          background: var(--cm-panel);
        }
        /* Every block occupies the SAME cell, so the panel is sized once to the
           tallest of them and swapping the lit control cannot move anything.
           An earlier version toggled display and the panel jumped 47px between
           a one-line binding and LT's two-part explanation. */
        .cm__readout > * { grid-area: 1 / 1; }
        .cm__readout-idle {
          margin: 0;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          line-height: 1.7;
          color: var(--cm-quiet);
        }
        /* Any lit control replaces the prompt with its own block. */
        .cm:has([data-ctl]:hover) .cm__readout-idle,
        .cm:has([data-ctl]:focus-visible) .cm__readout-idle { visibility: hidden; }

        .cm__detail {
          display: grid;
          gap: 0.5rem;
          align-content: start;
          visibility: hidden;
          opacity: 0;
          transition: opacity 140ms ease;
        }
        .cm__detail-head {
          margin: 0;
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 0.5rem;
        }
        .cm__detail-action {
          font-size: 0.95rem;
          line-height: 1.45;
          color: var(--color-moonlight);
        }
        .cm__detail-note {
          margin: 0;
          font-size: 0.85rem;
          line-height: 1.6;
          color: color-mix(in srgb, var(--color-moonlight) 46%, var(--color-mist));
        }

        /* ---- the mapping ---- */
        .cm__legend {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(19rem, 100%), 1fr));
          gap: 1.1rem 2rem;
          align-content: start;
        }
        .cm__group { display: grid; gap: 0.4rem; align-content: start; }
        .cm__group-title {
          margin: 0;
          font-size: 0.71rem;
          color: var(--color-lunar-gold);
          padding-bottom: 0.3rem;
          border-bottom: 1px solid var(--cm-edge);
        }
        .cm__rows { margin: 0; display: grid; gap: 1px; }
        .cm__row {
          display: grid;
          grid-template-columns: 6rem minmax(0, 1fr);
          gap: 0.2rem 0.75rem;
          align-items: baseline;
          padding: 0.4rem 0.5rem;
          border-left: 2px solid
            color-mix(in srgb, var(--cm-hue) calc(var(--cm-on) * 100%), transparent);
          background: color-mix(
            in srgb,
            var(--cm-hue) calc(var(--cm-on) * 8%),
            transparent
          );
          transition: background-color 160ms ease, border-color 160ms ease;
        }
        .cm__row:focus-visible {
          outline: 2px solid var(--cm-hue);
          outline-offset: 2px;
        }
        .cm__row-input { margin: 0; }
        .cm__chip {
          display: inline-block;
          padding: 0.1rem 0.4rem;
          border: 1px solid
            color-mix(
              in srgb,
              var(--cm-hue) calc(var(--cm-on) * 100%),
              color-mix(in srgb, var(--color-mist) 45%, transparent)
            );
          font-size: 0.71rem;
          letter-spacing: 0.08em;
          color: color-mix(
            in srgb,
            var(--cm-hue) calc(var(--cm-on) * 100%),
            var(--cm-quiet)
          );
          white-space: nowrap;
          transition: color 160ms ease, border-color 160ms ease;
        }
        .cm__row-action { margin: 0; display: grid; gap: 0.25rem; justify-items: start; }
        .cm__action {
          font-size: 0.9rem;
          line-height: 1.45;
          color: var(--color-moonlight);
        }

        /* The second meaning, marked so it cannot be mistaken for the first. */
        .cm__combat {
          display: inline-flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 0.45rem;
        }
        .cm__combat-tag {
          padding: 0.06rem 0.4rem;
          border: 1px solid color-mix(in srgb, var(--color-scarlet) 50%, transparent);
          font-size: 0.68rem;
          letter-spacing: 0.14em;
          color: color-mix(in srgb, var(--color-scarlet) 52%, var(--color-moonlight));
          white-space: nowrap;
        }
        .cm__combat-action {
          font-size: 0.9rem;
          line-height: 1.45;
          color: var(--color-moonlight);
        }

        /* Clipped, not removed: the readout is the visual home for these on a
           wide screen, but they stay in the accessibility tree here — and come
           back inline below 900px, where there is no readout. */
        .cm__note {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
        }
        @media (max-width: 899px) {
          .cm__readout { display: none; }
          .cm__note {
            position: static;
            width: auto;
            height: auto;
            overflow: visible;
            clip-path: none;
            white-space: normal;
            font-size: 0.84rem;
            line-height: 1.55;
            color: color-mix(in srgb, var(--color-moonlight) 42%, var(--color-mist));
          }
          .cm__row { padding: 0.5rem 0.6rem; gap: 0.3rem 0.75rem; }
        }

        /* ---- the context note ---- */
        .cm__context {
          display: grid;
          gap: 0.45rem;
          padding: 0.95rem 1.15rem;
          border: 1px solid var(--cm-edge);
          border-left: 2px solid color-mix(in srgb, var(--color-lunar-gold) 60%, transparent);
          background: var(--cm-panel);
        }
        .cm__context-label { margin: 0; font-size: 0.72rem; color: var(--color-lunar-gold); }
        .cm__context-body {
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--color-moonlight);
        }

        @media (max-width: 520px) {
          .cm__row { grid-template-columns: minmax(0, 1fr); }
          .cm__figure { padding: 0.6rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cm__trigger rect,
          .cm__bumper rect,
          .cm__small circle,
          .cm__stick-well,
          .cm__stick-cap,
          .cm__dpad path,
          .cm__face,
          .cm__face circle,
          .cm__glyph rect,
          .cm__code,
          .cm__row,
          .cm__chip,
          .cm__detail {
            transition: none;
          }
        }

        ${HIGHLIGHT_RULES}
      `}</style>
    </section>
  );
}

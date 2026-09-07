import {
  hiddenChoice,
  hosts,
  mapNotes,
  mapSummary,
  premise,
  storyBeats,
  storyEndings,
  teamNote,
  worldNotes,
} from "@/content/shattered-skies-overview";
import type { SsVariant } from "@/content/shattered-skies-deep-dive";

/**
 * Shattered Skies — "The Game": the context section, with the narrative
 * structure map as its centrepiece.
 *
 * THIS SECTION IS NOT A CREDIT. It describes a team project, and it opens with
 * a visible attribution panel saying so and naming my role on it. Everything
 * after this section on the page is the part that is mine. That order — their
 * game first, my work second — is the whole reason the section exists.
 *
 * Read top to bottom:
 *
 *   1. THE PREMISE, and the two hosts as a pair of cards. The cards come
 *      before the diagram deliberately: they are where the reader learns that
 *      green is Drayk and cyan is Aevi, so the map never has to stop and
 *      explain its own colours.
 *   2. THE WORLD — three lore notes, short, because this is context.
 *   3. THE MAP — two backstories converge at the Symbiochord, run a spine of
 *      four beats, drop into the fifth (the final choice), and fan through two
 *      sealed decisions into the GDD's three endings. Every ending takes one
 *      line from each host, because two players with two options each is four
 *      combinations but only three outcomes: it does not matter which of them
 *      betrays the other, only that one of them did.
 *   4. THE BEATS and THE ENDINGS as real HTML text.
 *
 * WHY 3 AND 4 BOTH EXIST. The map carries only names; the prose under it
 * carries the actual beats. It is also why the SVG is a single `role="img"`
 * with a `<desc>`: a screen reader gets one summary of the shape instead of
 * forty loose fragments of node text, then reads the real content below.
 *
 * SPLIT ACROSS TWO PAGES. `variant="main"` renders bands 1 and 3 plus the beat
 * NAMES — the team context, the two hosts and the shape of the story, which is
 * what the systems further down the main page need in order to land.
 * `variant="deep"` renders band 2 and the written form of band 4: the world
 * notes, each beat's body, the sealed-choice mechanism and the three endings.
 *
 * THE DIAGRAM STAYS ON MAIN, and is not drawn twice. It is built entirely from
 * keys — `mapLabel`, `mapTag`, host names — so it costs the condensed page
 * almost nothing in words while carrying the whole structure. The deep dive
 * gets the prose the diagram is a picture OF, which is the split working: one
 * literal per sentence, one render site each.
 *
 * BELOW 900px ON MAIN the drawing is switched off with `display: none` and the
 * beat NAMES remain as a vertical rail. That is lossy compared with the old
 * single-page version, which is why `mapNotes.narrow` says what is happening
 * rather than implying the reader has everything.
 *
 * Static server component: no state, no client JavaScript.
 */

/* ---- geometry ----------------------------------------------------------
   viewBox units, laid out for a 1200-wide drawing that renders at about 1:1
   in the breakout width below. The spine runs left to right across the top,
   turns down at the end into the decisive beat, and fans out to the endings
   along the bottom — vertical space rather than horizontal, because four
   backstory-to-ending columns side by side would need a canvas twice this
   wide and half this readable. */

const VB_W = 1200;
const VB_H = 676;
const PAD = 14;

const SPINE_Y = 164;

/** Backstories: two nodes stacked left, meeting at the chain. */
const BS_X = PAD;
const BS_W = 140;
const BS_H = 68;
const BS_CY = [108, 220];

/** The Symbiochord itself — two interlocked links where the fates merge. */
const CHAIN_X = 209;
/** Vertical offset of the chain's two labels, clear of the links. */
const CHAIN_LABEL_DY = 25;
const CHAIN_RX = 9;
const CHAIN_RY = 6.5;

/** Spine beats: everything except the decisive one. */
const spineBeats = storyBeats.filter((b) => !b.decisive);
const finalBeat = storyBeats.find((b) => b.decisive) ?? storyBeats[storyBeats.length - 1];

const B_W = 198;
const B_H = 86;
const B_Y = SPINE_Y - B_H / 2;
const B_X0 = 264;
/** Derived, not authored: add a beat and the spine re-spaces itself. */
const B_PITCH =
  spineBeats.length > 1 ? (VB_W - PAD - B_X0 - B_W) / (spineBeats.length - 1) : 0;

const beatX = (i: number) => B_X0 + i * B_PITCH;
const lastBeatCx = beatX(spineBeats.length - 1) + B_W / 2;

/** The decisive beat, centred and given room — it is the pivot of the map. */
const FC_W = 328;
const FC_H = 96;
const FC_X = (VB_W - FC_W) / 2;
const FC_Y = 296;
const FC_CX = VB_W / 2;
const FC_BOTTOM = FC_Y + FC_H;

/** The two sealed decisions. Nothing passes between them. */
const G_W = 196;
const G_H = 48;
const G_Y = 424;
const G_BOTTOM = G_Y + G_H;
const G_CX = [FC_CX - 110, FC_CX + 110];

/** Endings across the foot, in content order: both selfless, one selfish,
    both selfish. Centred as a group, so the middle one sits directly under the
    wall between the two sealed decisions. */
const E_W = 260;
const E_H = 76;
const E_Y = 580;
const E_GAP = 36;
const E_X0 = (VB_W - (storyEndings.length * E_W + (storyEndings.length - 1) * E_GAP)) / 2;

const endX = (i: number) => E_X0 + i * (E_W + E_GAP);
const endCx = (i: number) => endX(i) + E_W / 2;


/* A fixed star field. Seeded so server and client draw the same sky. */
const STARS = (() => {
  let seed = 20250824;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  return Array.from({ length: 26 }, (_, i) => ({
    key: `star-${i}`,
    x: +(rand() * VB_W).toFixed(1),
    y: +(rand() * VB_H).toFixed(1),
    r: +(0.7 + rand() * 1.2).toFixed(2),
    o: +(0.16 + rand() * 0.38).toFixed(2),
  }));
})();

/** Greedy wrap for node labels. Node widths are fixed, so a character budget
    is enough — no measurement, and it stays a server component. */
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

/** A cubic that leaves and arrives vertically — the fan reads as a delta
    rather than four diagonals. */
function fanPath(x0: number, y0: number, x1: number, y1: number): string {
  const lift = (y1 - y0) * 0.55;
  return `M ${x0} ${y0} C ${x0} ${y0 + lift}, ${x1} ${y1 - lift}, ${x1} ${y1}`;
}

function NarrativeDiagram() {
  return (
    <svg
      className="nm-svg"
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      role="img"
      aria-labelledby="nm-map-title nm-map-desc"
    >
      <title id="nm-map-title">
        Narrative structure of Shattered Skies: two backstories, five story beats and three endings
      </title>
      <desc id="nm-map-desc">{mapSummary}</desc>

      <defs>
        <marker
          id="nm-arrow"
          viewBox="0 0 8 8"
          refX="7.2"
          refY="4"
          markerWidth="7"
          markerHeight="7"
          markerUnits="userSpaceOnUse"
          orient="auto"
        >
          <path className="nm-arrowhead" d="M 0 0 L 8 4 L 0 8 Z" />
        </marker>
        {/* Both selfless: the two hosts stop being two. The Unity node is the
            only place on the map where the colours are one object. */}
        <linearGradient id="nm-merge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" className="nm-merge-a" />
          <stop offset="100%" className="nm-merge-b" />
        </linearGradient>
      </defs>

      <rect className="nm-void" width={VB_W} height={VB_H} />
      <g className="nm-stars" aria-hidden="true">
        {STARS.map((s) => (
          <circle key={s.key} cx={s.x} cy={s.y} r={s.r} opacity={s.o} />
        ))}
      </g>

      {/* ---- band label rail ---- */}
      <g className="nm-rail">
        <text className="nm-rail-text" x={PAD} y={44}>
          01 · BACKSTORIES
        </text>
        <text className="nm-rail-text" x={PAD} y={300}>
          02 · THE CHOICE
        </text>
        <text className="nm-rail-text" x={PAD} y={560}>
          03 · ENDINGS
        </text>
      </g>

      {/* ---- backstories → the chain ---- */}
      {hosts.map((host, i) => (
        <path
          key={`bind-${host.id}`}
          className={`nm-bind is-${host.id}`}
          d={`M ${BS_X + BS_W} ${BS_CY[i]} C ${BS_X + BS_W + 26} ${BS_CY[i]}, ${
            CHAIN_X - 30
          } ${SPINE_Y}, ${CHAIN_X - CHAIN_RX - 6} ${SPINE_Y}`}
        />
      ))}

      {hosts.map((host, i) => {
        const y = BS_CY[i] - BS_H / 2;
        return (
          <g key={host.id} className={`nm-node nm-host is-${host.id}`}>
            <rect className="nm-node-body" x={BS_X} y={y} width={BS_W} height={BS_H} rx={3} />
            <rect
              className="nm-node-frame"
              x={BS_X + 0.5}
              y={y + 0.5}
              width={BS_W - 1}
              height={BS_H - 1}
              rx={3}
            />
            <text className="nm-kicker" x={BS_X + 16} y={y + 21}>
              BACKSTORY
            </text>
            <text className="nm-name" x={BS_X + 16} y={y + 43}>
              {host.name.toUpperCase()}
            </text>
            <text className="nm-tag" x={BS_X + 16} y={y + 58}>
              {host.species.toUpperCase()}
            </text>
          </g>
        );
      })}

      {/* The Symbiochord: two links, interlocked, one in each host's colour. */}
      <g className="nm-chain">
        <ellipse
          className="nm-chain-link is-drayk"
          cx={CHAIN_X - 6}
          cy={SPINE_Y}
          rx={CHAIN_RX}
          ry={CHAIN_RY}
        />
        <ellipse
          className="nm-chain-link is-aevi"
          cx={CHAIN_X + 6}
          cy={SPINE_Y}
          rx={CHAIN_RX}
          ry={CHAIN_RY}
        />
        <text
          className="nm-chain-sub"
          x={CHAIN_X}
          y={SPINE_Y - CHAIN_LABEL_DY}
          textAnchor="middle"
        >
          ONE LIFE
        </text>
        <text
          className="nm-chain-label"
          x={CHAIN_X}
          y={SPINE_Y + CHAIN_LABEL_DY}
          textAnchor="middle"
        >
          SYMBIOCHORD
        </text>
      </g>

      {/* ---- the spine ---- */}
      <path
        className="nm-conduit"
        d={`M ${CHAIN_X + CHAIN_RX + 6} ${SPINE_Y} H ${B_X0}`}
        markerEnd="url(#nm-arrow)"
      />
      {spineBeats.slice(0, -1).map((beat, i) => (
        <path
          key={`link-${beat.id}`}
          className="nm-conduit"
          d={`M ${beatX(i) + B_W} ${SPINE_Y} H ${beatX(i + 1)}`}
          markerEnd="url(#nm-arrow)"
        />
      ))}

      {spineBeats.map((beat, i) => {
        const x = beatX(i);
        const cx = x + B_W / 2;
        const lines = wrap(beat.mapLabel.toUpperCase(), 16);
        const first = lines.length > 1 ? 172 : 181;
        return (
          <g key={beat.id} className="nm-node nm-beat">
            <rect className="nm-node-body" x={x} y={B_Y} width={B_W} height={B_H} rx={3} />
            <rect
              className="nm-node-frame"
              x={x + 0.5}
              y={B_Y + 0.5}
              width={B_W - 1}
              height={B_H - 1}
              rx={3}
            />
            <text className="nm-kicker" x={cx} y={B_Y + 24} textAnchor="middle">
              {beat.index.toUpperCase()}
            </text>
            <text className="nm-beat-label" x={cx} y={first} textAnchor="middle">
              {lines.map((line, li) => (
                <tspan key={line} x={cx} dy={li === 0 ? 0 : 18}>
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        );
      })}

      {/* ---- spine → the decisive beat ---- */}
      <path
        className="nm-conduit"
        d={`M ${lastBeatCx} ${B_Y + B_H} V 252 H ${FC_CX} V ${FC_Y}`}
        markerEnd="url(#nm-arrow)"
      />

      <g className="nm-node nm-final">
        <rect className="nm-node-body" x={FC_X} y={FC_Y} width={FC_W} height={FC_H} rx={3} />
        <rect
          className="nm-node-frame"
          x={FC_X + 0.5}
          y={FC_Y + 0.5}
          width={FC_W - 1}
          height={FC_H - 1}
          rx={3}
        />
        <text className="nm-kicker" x={FC_CX} y={FC_Y + 26} textAnchor="middle">
          {finalBeat.index.toUpperCase()}
        </text>
        <text className="nm-final-label" x={FC_CX} y={FC_Y + 60} textAnchor="middle">
          {finalBeat.mapLabel.toUpperCase()}
        </text>
        <text className="nm-tag" x={FC_CX} y={FC_Y + 82} textAnchor="middle">
          MOMENT OF TRUTH
        </text>
      </g>

      {/* ---- the two sealed decisions ---- */}
      {hosts.map((host, i) => (
        <path
          key={`seal-${host.id}`}
          className={`nm-conduit is-${host.id}`}
          d={`M ${FC_CX} ${FC_BOTTOM} V 406 H ${G_CX[i]} V ${G_Y}`}
          markerEnd="url(#nm-arrow)"
        />
      ))}

      {hosts.map((host, i) => (
        <g key={`gate-${host.id}`} className={`nm-node nm-gate is-${host.id}`}>
          <rect
            className="nm-node-body"
            x={G_CX[i] - G_W / 2}
            y={G_Y}
            width={G_W}
            height={G_H}
            rx={24}
          />
          <rect
            className="nm-node-frame"
            x={G_CX[i] - G_W / 2 + 0.5}
            y={G_Y + 0.5}
            width={G_W - 1}
            height={G_H - 1}
            rx={24}
          />
          <text className="nm-gate-kicker" x={G_CX[i]} y={G_Y + 19} textAnchor="middle">
            SEALED
          </text>
          <text className="nm-gate-label" x={G_CX[i]} y={G_Y + 35} textAnchor="middle">
            {host.name.toUpperCase()} CHOOSES ALONE
          </text>
        </g>
      ))}

      {/* The wall between them. This is the mechanism the endings hang on. */}
      <path className="nm-wall" d={`M ${FC_CX} ${G_Y - 8} V ${G_BOTTOM + 8}`} />
      <text className="nm-wall-label" x={G_CX[1] + G_W / 2 + 20} y={G_Y + 20}>
        NO INFORMATION
      </text>
      <text className="nm-wall-label" x={G_CX[1] + G_W / 2 + 20} y={G_Y + 34}>
        PASSES BETWEEN THEM
      </text>
      <text className="nm-wall-sub" x={G_CX[1] + G_W / 2 + 20} y={G_Y + 50}>
        THE PAIR DECIDES THE ENDING
      </text>

      {/* ---- the fan: the pair of choices decides, never one of them, so
              every ending takes one line from each host ---- */}
      {storyEndings.map((ending, ei) =>
        hosts.map((host, hi) => (
          <path
            key={`fan-${ending.id}-${host.id}`}
            className={`nm-fan is-${host.id}`}
            d={fanPath(G_CX[hi], G_BOTTOM, endCx(ei), E_Y)}
          />
        ))
      )}

      {/* ---- endings ---- */}
      {storyEndings.map((ending, i) => {
        const x = endX(i);
        const cx = endCx(i);
        return (
          <g key={ending.id} className="nm-node nm-ending" data-tone={ending.tone}>
            <rect className="nm-node-body" x={x} y={E_Y} width={E_W} height={E_H} rx={3} />
            <rect
              className="nm-node-frame"
              x={x + 0.5}
              y={E_Y + 0.5}
              width={E_W - 1}
              height={E_H - 1}
              rx={3}
            />
            <rect className="nm-ending-rule" x={x} y={E_Y} width={E_W} height={3} />
            <text className="nm-ending-name" x={cx} y={E_Y + 38} textAnchor="middle">
              {ending.name.toUpperCase()}
            </text>
            <text className="nm-tag" x={cx} y={E_Y + 60} textAnchor="middle">
              {ending.mapTag.toUpperCase()}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function NarrativeMap({ variant = "main" }: { variant?: SsVariant }) {
  const deep = variant === "deep";

  return (
    <div className="nm" data-variant={variant}>
      {/* ---- attribution, before anything it might be mistaken for ----
          MAIN ONLY, and deliberately. `teamNote` is the page's canonical
          "team of five, my role was Systems & World Designer" statement, and
          the ownership map's rule is that no other section repeats it. The
          deep dive links back to this section rather than restating it. */}
      {!deep && (
        <aside className="nm__credit" aria-label="Attribution">
          <p className="mono nm__credit-tag">{teamNote.headline}</p>
          <p className="nm__credit-role">
            My role on it: <strong>{teamNote.role}</strong>
          </p>
          <p className="nm__credit-body">{teamNote.body}</p>
        </aside>
      )}

      {!deep && <p className="nm__premise">{premise}</p>}

      {/* ---- the two hosts: also the map's colour key ---- */}
      {!deep && (
        <ul className="nm__hosts">
          {hosts.map((host) => (
            <li key={host.id} className="nm__host" data-host={host.id}>
              <p className="mono nm__host-tag">
                <span className="nm__host-dot" aria-hidden="true" />
                {host.tag}
              </p>
              <h3 className="nm__host-name">{host.name}</h3>
              <p className="nm__host-body">{host.backstory}</p>
            </li>
          ))}
        </ul>
      )}

      {/* ---- the world — DEEP DIVE ---- */}
      {deep && (
        <section className="nm__band" aria-labelledby="nm-world-title">
          <h3 className="nm__band-title" id="nm-world-title">
            The world
          </h3>
          <dl className="nm__world">
            {worldNotes.map((note) => (
              <div key={note.id} className="nm__world-note">
                <dt className="mono nm__world-label">{note.label}</dt>
                <dd className="nm__world-body">{note.body}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* ---- the map — MAIN ONLY ---- */}
      {!deep && (
        <figure className="nm__figure">
          <figcaption className="nm__figcap">
            <h3 className="nm__band-title">Narrative structure</h3>
            <p className="mono nm__figcap-meta">
              Two backstories · {storyBeats.length} beats · {storyEndings.length} endings
            </p>
          </figcaption>

          <div
            className="nm__map"
            role="group"
            aria-label="Narrative structure map, scrolls horizontally"
            tabIndex={0}
          >
            <NarrativeDiagram />
          </div>

          {/* CHIP REMOVED. This figure has no interaction handler of any kind:
              it is a plain `overflow-x: auto` frame with a `tabIndex`, and
              nothing inside it responds to a pointer or a key. It carried a
              `pan` chip, which promised dragging and arrow keys that do not
              exist. A chip that over-promises teaches a reader to distrust the
              chips on the figures where the targets ARE real, so this says the
              one true thing instead, and only at the widths where it is true. */}
          <p className="mono mono-note nm__scroll-note">Scroll the map sideways to follow it →</p>

          <p className="nm__map-note nm__map-note--wide">{mapNotes.main}</p>
          <p className="nm__map-note nm__map-note--narrow">{mapNotes.narrow}</p>
        </figure>
      )}

      {/* ---- the beats ----
          MAIN gets the spine as names: index and title, which is the same
          content the diagram nodes carry and costs the condensed page nothing.
          DEEP gets the written beat under each name. */}
      <ol className="nm__beats" data-mode={deep ? "full" : "spine"}>
        {storyBeats.map((beat) => (
          <li key={beat.id} className="nm__beat" data-decisive={beat.decisive ? "true" : undefined}>
            <p className="mono nm__beat-index">{beat.index}</p>
            <h4 className="nm__beat-title">{beat.title}</h4>
            {deep && <p className="nm__beat-body">{beat.body}</p>}
          </li>
        ))}
      </ol>

      {/* ---- the mechanism the endings hang on — DEEP DIVE ---- */}
      {deep && (
        <section className="nm__gatebox" aria-labelledby="nm-gate-title">
          <h3 className="nm__band-title" id="nm-gate-title">
            {hiddenChoice.label}
          </h3>
          <p className="nm__gatebox-body">{hiddenChoice.body}</p>
        </section>
      )}

      {/* ---- the endings — DEEP DIVE ----
          The diagram on the main page names all three; what it cannot carry is
          the pair of choices each one takes and what it costs. That is here. */}
      {deep && (
        <ul className="nm__endings">
          {storyEndings.map((ending) => (
            <li key={ending.id} className="nm__ending" data-tone={ending.tone}>
              <h4 className="nm__ending-name">{ending.name}</h4>
              <p className="mono nm__ending-cond">{ending.condition}</p>
              <p className="nm__ending-body">{ending.outcome}</p>
            </li>
          ))}
        </ul>
      )}

      <style>{`
        .nm {
          /* Two hosts, two colours, everywhere. The layout scopes the palette,
             so these are tokens rather than hexes — except the two tone
             colours the theme has no slot for, which are checked below. */
          --nm-drayk: var(--color-emerald);
          --nm-aevi: var(--color-nebula, #7ec8d8);
          /* Unity is neither host's colour: it is what is left when the two
             stop being two. 12.7:1 on the void. */
          --nm-unity: #7FE3C4;
          --nm-betrayal: var(--color-gold);
          /* 5.8:1 on the void — over the 4.5 bar with room to spare. */
          --nm-destruction: #E4696E;
          /* Mist alone is 4.2:1 on the panels. Blended toward moonlight the
             small mono type clears AA everywhere it is used: about 8.8:1. */
          --nm-quiet: color-mix(in srgb, var(--color-mist) 50%, var(--color-moonlight));
          --nm-edge: color-mix(in srgb, var(--color-mist) 32%, transparent);
          --nm-void: var(--color-void);
          --nm-panel: color-mix(in srgb, var(--color-nightfall) 62%, var(--color-void));

          display: grid;
          gap: 2.75rem;
        }

        /* ---- attribution ----
           Framed and set apart on purpose. A reader who skims the page should
           not be able to skim past who made this. */
        .nm__credit {
          border: 1px solid var(--nm-edge);
          border-left: 2px solid var(--nm-aevi);
          background: var(--nm-panel);
          padding: 1.1rem 1.25rem;
          display: grid;
          gap: 0.45rem;
          max-width: 46rem;
        }
        .nm__credit-tag {
          margin: 0;
          font-size: 0.7rem;
          letter-spacing: 0.16em;
          color: var(--nm-aevi);
        }
        .nm__credit-role {
          margin: 0;
          font-size: 0.95rem;
          color: var(--color-moonlight);
        }
        .nm__credit-role strong {
          font-weight: 600;
          color: var(--nm-unity);
        }
        .nm__credit-body {
          margin: 0;
          font-size: 0.88rem;
          line-height: 1.6;
          color: var(--nm-quiet);
        }

        .nm__premise {
          margin: 0;
          max-width: 44rem;
          font-size: var(--text-lg);
          line-height: 1.65;
          color: var(--color-moonlight);
        }

        /* ---- hosts ---- */
        .nm__hosts {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 1px;
          background: var(--nm-edge);
          border: 1px solid var(--nm-edge);
        }
        @media (min-width: 46rem) {
          .nm__hosts { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        .nm__host {
          background: var(--nm-panel);
          padding: 1.15rem 1.25rem 1.35rem;
          display: grid;
          gap: 0.4rem;
          align-content: start;
          min-width: 0;
        }
        .nm__host[data-host="drayk"] { --host-accent: var(--nm-drayk); }
        .nm__host[data-host="aevi"] { --host-accent: var(--nm-aevi); }
        .nm__host-tag {
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.68rem;
          letter-spacing: 0.14em;
          color: var(--host-accent);
        }
        .nm__host-dot {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          background: var(--host-accent);
          flex: none;
        }
        .nm__host-name {
          margin: 0;
          font-family: var(--font-hero);
          font-size: 1.35rem;
          letter-spacing: 0.02em;
          color: var(--color-moonlight);
        }
        .nm__host-body {
          margin: 0;
          font-size: 0.88rem;
          line-height: 1.6;
          color: var(--nm-quiet);
        }

        /* ---- world ---- */
        .nm__band { display: grid; gap: 1rem; }
        .nm__band-title {
          margin: 0;
          font-family: var(--font-hero);
          font-size: 1.1rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--color-moonlight);
        }
        .nm__world {
          margin: 0;
          display: grid;
          gap: 1.25rem;
        }
        @media (min-width: 52rem) {
          .nm__world { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.5rem; }
        }
        .nm__world-note {
          display: grid;
          gap: 0.4rem;
          padding-top: 0.7rem;
          border-top: 1px solid var(--nm-edge);
          min-width: 0;
        }
        .nm__world-label {
          margin: 0;
          font-size: 0.68rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--nm-aevi);
        }
        .nm__world-body {
          margin: 0;
          font-size: 0.88rem;
          line-height: 1.6;
          color: var(--nm-quiet);
        }

        /* ---- the map ----
           Breakout to the same width the other diagrams on the site use: the
           section column caps at 68rem and a five-band map wants more. The
           parent is centred, so 50% minus half the target lands it back on the
           viewport centre. Prose stays in the column. */
        .nm__figure {
          margin: 0;
          display: grid;
          gap: 0.9rem;
        }
        @media (min-width: 900px) {
          .nm__figure {
            width: min(94vw, 84rem);
            margin-left: calc(50% - min(47vw, 42rem));
            margin-right: calc(50% - min(47vw, 42rem));
          }
        }
        .nm__figcap {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: baseline;
          gap: 0.35rem 1.5rem;
        }
        .nm__figcap-meta {
          margin: 0;
          font-size: 0.68rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--nm-quiet);
        }

        /* Below 1180px the drawing scrolls rather than shrinking: the small
           mono tags are 10px in viewBox units, and past about 0.9 scale they
           stop being readable well before the picture stops being pretty. */
        .nm__map {
          border: 1px solid var(--nm-edge);
          background: var(--nm-void);
          overflow-x: auto;
          overscroll-behavior-x: contain;
        }
        .nm__scroll-note {
          display: none;
          margin: 0.7rem 0 0;
          font-size: 0.71rem;
          color: var(--nm-quiet);
        }
        @media (max-width: 1080px) {
          .nm__scroll-note { display: block; }
        }
        .nm__map:focus-visible {
          outline: 2px solid var(--color-lunar-gold);
          outline-offset: 2px;
        }
        .nm-svg {
          display: block;
          width: 100%;
          min-width: 1080px;
          height: auto;
        }

        .nm__map-note {
          margin: 0;
          font-size: 0.76rem;
          line-height: 1.5;
          color: var(--nm-quiet);
          max-width: 44rem;
        }
        .nm__map-note--narrow { display: none; }

        /* THE FALLBACK. A branching map cannot be read on a phone, so below
           900px it is switched off entirely and the vertical rail of beats
           further down — which is on the page at every width — carries the
           structure instead. Nothing is hidden; only the picture is. */
        @media (max-width: 899px) {
          .nm__map { display: none; }
          .nm__map-note--wide { display: none; }
          .nm__map-note--narrow { display: block; }
        }

        /* ---- svg: field ---- */
        .nm-void { fill: var(--nm-void); }
        .nm-stars circle { fill: var(--color-moonlight); }

        .nm-rail-text {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.22em;
          fill: var(--nm-quiet);
          opacity: 0.75;
        }

        /* ---- svg: nodes ---- */
        .nm-node-body { fill: var(--nm-panel); }
        .nm-node-frame { fill: none; stroke: var(--nm-edge); stroke-width: 1; }

        .nm-kicker {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.2em;
          fill: var(--nm-quiet);
        }
        .nm-tag {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          fill: var(--nm-quiet);
        }
        .nm-name {
          font-family: var(--font-hero);
          font-size: 19px;
          font-weight: 600;
          letter-spacing: 0.06em;
          fill: var(--color-moonlight);
        }

        .nm-host.is-drayk .nm-node-frame { stroke: color-mix(in srgb, var(--nm-drayk) 55%, transparent); }
        .nm-host.is-drayk .nm-kicker,
        .nm-host.is-drayk .nm-tag { fill: var(--nm-drayk); }
        .nm-host.is-aevi .nm-node-frame { stroke: color-mix(in srgb, var(--nm-aevi) 55%, transparent); }
        .nm-host.is-aevi .nm-kicker,
        .nm-host.is-aevi .nm-tag { fill: var(--nm-aevi); }

        .nm-beat-label {
          font-family: var(--font-hero);
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 0.04em;
          fill: var(--color-moonlight);
        }
        .nm-final-label {
          font-family: var(--font-hero);
          font-size: 22px;
          font-weight: 600;
          letter-spacing: 0.06em;
          fill: var(--color-moonlight);
        }
        .nm-final .nm-node-frame { stroke: var(--color-silver); stroke-width: 1.6; }
        .nm-final .nm-node-body { fill: color-mix(in srgb, var(--color-silver) 10%, var(--nm-panel)); }
        .nm-final .nm-kicker { fill: var(--color-silver); }

        /* ---- svg: the chain ---- */
        .nm-chain-link { fill: none; stroke-width: 2.4; }
        .nm-chain-link.is-drayk { stroke: var(--nm-drayk); }
        .nm-chain-link.is-aevi { stroke: var(--nm-aevi); }
        .nm-chain-label,
        .nm-chain-sub {
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.18em;
          fill: var(--nm-quiet);
        }

        /* ---- svg: wiring ----
           Right angles for the spine, curves for the fan. The spine is the
           story running its course; the fan is two decisions being combined. */
        .nm-conduit {
          fill: none;
          stroke: color-mix(in srgb, var(--color-mist) 78%, var(--color-moonlight));
          stroke-width: 1.5;
        }
        .nm-conduit.is-drayk { stroke: color-mix(in srgb, var(--nm-drayk) 70%, transparent); }
        .nm-conduit.is-aevi { stroke: color-mix(in srgb, var(--nm-aevi) 70%, transparent); }
        .nm-arrowhead { fill: color-mix(in srgb, var(--color-mist) 78%, var(--color-moonlight)); }

        .nm-bind { fill: none; stroke-width: 1.8; }
        .nm-bind.is-drayk { stroke: var(--nm-drayk); }
        .nm-bind.is-aevi { stroke: var(--nm-aevi); }

        /* Every ending takes one line from each host: the picture of "the pair
           decides", not either one. */
        .nm-fan { fill: none; stroke-width: 1.6; opacity: 0.55; }
        .nm-fan.is-drayk { stroke: var(--nm-drayk); }
        .nm-fan.is-aevi { stroke: var(--nm-aevi); }

        .nm-wall-label,
        .nm-wall-sub,
        .nm-gate-kicker {
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.16em;
          fill: var(--nm-quiet);
        }
        .nm-wall-sub { opacity: 0.75; }

        /* ---- svg: the sealed decisions ---- */
        .nm-gate .nm-node-body { fill: var(--nm-void); }
        .nm-gate.is-drayk .nm-node-frame { stroke: var(--nm-drayk); }
        .nm-gate.is-aevi .nm-node-frame { stroke: var(--nm-aevi); }
        .nm-gate-label {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.1em;
          fill: var(--color-moonlight);
        }
        .nm-gate.is-drayk .nm-gate-kicker { fill: var(--nm-drayk); }
        .nm-gate.is-aevi .nm-gate-kicker { fill: var(--nm-aevi); }

        .nm-wall {
          stroke: var(--nm-quiet);
          stroke-width: 1.2;
          stroke-dasharray: 3 5;
          opacity: 0.8;
        }

        /* ---- svg + html: ending tones ---- */
        .nm-ending[data-tone="unity"],
        .nm__ending[data-tone="unity"] { --tone: var(--nm-unity); }
        .nm-ending[data-tone="betrayal"],
        .nm__ending[data-tone="betrayal"] { --tone: var(--nm-betrayal); }
        .nm-ending[data-tone="destruction"],
        .nm__ending[data-tone="destruction"] { --tone: var(--nm-destruction); }

        .nm-ending-rule { fill: var(--tone); }
        .nm-ending .nm-node-frame { stroke: color-mix(in srgb, var(--tone) 45%, transparent); }
        .nm-ending .nm-node-body { fill: color-mix(in srgb, var(--tone) 8%, var(--nm-panel)); }
        .nm-ending-name {
          font-family: var(--font-hero);
          font-size: 17px;
          font-weight: 600;
          letter-spacing: 0.05em;
          fill: var(--tone);
        }
        /* Unity is the one node where the two colours are a single object. */
        .nm-ending[data-tone="unity"] .nm-ending-rule { fill: url(#nm-merge); }
        .nm-merge-a { stop-color: var(--nm-drayk); }
        .nm-merge-b { stop-color: var(--nm-aevi); }

        /* ---- beats as text, and the narrow-screen spine ----
           The rail down the left is the spine: on a phone this list is the
           diagram. */
        .nm__beats {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 1.4rem;
        }
        /* SPINE MODE (main page): five names, no bodies. Laid out as columns
           rather than a tall rail, because five one-line entries stacked
           vertically read as a list of missing paragraphs, where five across
           read as a structure. The connector rule is dropped with them — it
           joins beats down a column and there is no column any more. */
        .nm__beats[data-mode="spine"] {
          grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
          gap: 0.9rem 1.25rem;
        }
        .nm__beats[data-mode="spine"] .nm__beat {
          padding-left: 0;
          padding-top: 0.7rem;
          border-top: 1px solid var(--nm-edge);
        }
        .nm__beats[data-mode="spine"] .nm__beat::before { display: none; }
        .nm__beats[data-mode="spine"] .nm__beat[data-decisive="true"] {
          border-top-color: color-mix(in srgb, var(--color-gold) 60%, transparent);
        }
        .nm__beat {
          position: relative;
          padding-left: 1.6rem;
          min-width: 0;
        }
        .nm__beat::before {
          content: "";
          position: absolute;
          left: 0.32rem;
          top: 0.55rem;
          bottom: -1.4rem;
          width: 1px;
          background: var(--nm-edge);
        }
        .nm__beat:last-child::before { display: none; }
        .nm__beat::after {
          content: "";
          position: absolute;
          left: 0;
          top: 0.35rem;
          width: 0.66rem;
          height: 0.66rem;
          border-radius: 50%;
          border: 1px solid var(--nm-aevi);
          background: var(--nm-void);
        }
        .nm__beat[data-decisive="true"]::after {
          background: var(--color-silver);
          border-color: var(--color-silver);
        }
        .nm__beat-index {
          margin: 0;
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--nm-quiet);
        }
        .nm__beat-title {
          margin: 0.2rem 0 0;
          font-family: var(--font-hero);
          font-size: 1.15rem;
          letter-spacing: 0.02em;
          color: var(--color-moonlight);
        }
        .nm__beat[data-decisive="true"] .nm__beat-title { color: var(--color-silver); }
        .nm__beat-body {
          margin: 0.45rem 0 0;
          max-width: 44rem;
          font-size: 0.92rem;
          line-height: 1.65;
          color: var(--nm-quiet);
        }

        /* ---- the hidden-information note ---- */
        .nm__gatebox {
          border: 1px solid var(--nm-edge);
          border-left: 2px solid var(--color-gold);
          background: var(--nm-panel);
          padding: 1.15rem 1.35rem 1.3rem;
          display: grid;
          gap: 0.6rem;
        }
        .nm__gatebox-body {
          margin: 0;
          max-width: 46rem;
          font-size: 0.92rem;
          line-height: 1.65;
          color: var(--color-moonlight);
        }

        /* ---- endings ---- */
        .nm__endings {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 1px;
          background: var(--nm-edge);
          border: 1px solid var(--nm-edge);
        }
        /* Exactly three, so it steps one-up straight to three-up with no
           two-up stage in between: a 2 + 1 grid leaves a hole where a fourth
           ending would have been. Same breakpoint as the world notes, which
           are also a three. */
        @media (min-width: 52rem) {
          .nm__endings { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
        .nm__ending {
          background: var(--nm-panel);
          border-top: 3px solid var(--tone);
          padding: 1.1rem 1.2rem 1.35rem;
          display: grid;
          gap: 0.35rem;
          align-content: start;
          min-width: 0;
        }
        .nm__ending-name {
          margin: 0;
          font-family: var(--font-hero);
          font-size: 1.2rem;
          letter-spacing: 0.03em;
          color: var(--tone);
        }
        .nm__ending-cond {
          margin: 0;
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--nm-quiet);
        }
        .nm__ending-body {
          margin: 0.3rem 0 0;
          font-size: 0.88rem;
          line-height: 1.6;
          color: var(--nm-quiet);
        }

        /* ---- motion ----
           One animation on the whole section: the two links of the Symbiochord
           pulse out of phase, so the thing binding the hosts is the only part
           of the map that is alive. Off entirely when reduced motion is asked
           for — the diagram is fully readable static, and nothing below
           depends on it. */
        @media (prefers-reduced-motion: no-preference) {
          .nm-chain-link { animation: nm-bind 6s ease-in-out infinite; }
          .nm-chain-link.is-aevi { animation-delay: -3s; }
        }
        @keyframes nm-bind {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

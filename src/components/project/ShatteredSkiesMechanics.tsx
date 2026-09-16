import {
  communication,
  ship,
  spine,
  telepathyFlow,
  traversal,
  type Reasoning,
} from "@/content/shattered-skies-mechanics";
import type { SsVariant } from "@/content/shattered-skies-deep-dive";
import { mainHref } from "@/content/shattered-skies-deep-dive";
import DecodeOnView from "./DecodeOnView";
import Link from "next/link";

const FLOW_W = 1040;
const FLOW_H = 372;

const WIN = { x: 12, y: 124, w: 236, h: 124 };
const WIN_CY = WIN.y + WIN.h / 2;

const TICK = { y: WIN.y + 88, w: 32, h: 6, gap: 8 };

const CH = { x: 396, w: 212, h: 90 };
const CH_Y = [72, 204];

const END = { x: 756, w: 272, h: 84 };
const END_Y = [36, 150, 264];

const chCy = (i: number) => CH_Y[i] + CH.h / 2;
const endCy = (i: number) => END_Y[i] + END.h / 2;

function link(x1: number, y1: number, x2: number, y2: number) {
  const dx = (x2 - x1) * 0.5;
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

function TelepathyFigure() {
  const { window: win, choices, endings, choicesLabel, endingsLabel } = telepathyFlow;

  return (
    <svg
      className="ssm-flow-svg"
      viewBox={`0 0 ${FLOW_W} ${FLOW_H}`}
      role="img"
      aria-labelledby="ssm-flow-title ssm-flow-desc"
    >
      <title id="ssm-flow-title">{telepathyFlow.title}</title>
      <desc id="ssm-flow-desc">{telepathyFlow.summary}</desc>

      {/* ---- column headers ---- */}
      <g className="ssm-flow-rail">
        <text x={WIN.x + WIN.w / 2} y={16} textAnchor="middle">
          {win.column}
        </text>
        <text x={CH.x + CH.w / 2} y={16} textAnchor="middle">
          {choicesLabel}
        </text>
        <text x={END.x + END.w / 2} y={16} textAnchor="middle">
          {endingsLabel}
        </text>
      </g>

      {/* ---- edges, drawn under the nodes ---- */}
      <g className="ssm-flow-edges">
        {choices.map((c, i) => (
          <path
            key={`w-${c.id}`}
            className="ssm-flow-edge"
            data-tone={c.tone}
            d={link(WIN.x + WIN.w, WIN_CY, CH.x, chCy(i))}
          />
        ))}
        {endings.map((e, ei) =>
          e.from.map((tone) => {
            const ci = choices.findIndex((c) => c.tone === tone);
            if (ci < 0) return null;
            return (
              <path
                key={`${e.id}-${tone}`}
                className="ssm-flow-edge"
                data-tone={tone}
                d={link(CH.x + CH.w, chCy(ci), END.x, endCy(ei))}
              />
            );
          })
        )}
        {endings.map((e, ei) => (
          <circle key={`dot-${e.id}`} className="ssm-flow-dot" data-tone={e.tone} cx={END.x} cy={endCy(ei)} r={2.6} />
        ))}
      </g>

      {/* ---- the window ---- */}
      <g className="ssm-flow-node ssm-flow-window">
        <rect x={WIN.x} y={WIN.y} width={WIN.w} height={WIN.h} rx={2} className="ssm-flow-body" />
        <rect x={WIN.x} y={WIN.y} width={WIN.w} height={WIN.h} rx={2} className="ssm-node-frame" />
        <text className="ssm-flow-name" x={WIN.x + 18} y={WIN.y + 44}>
          {win.label}
        </text>
        <text className="ssm-node-sub" x={WIN.x + 18} y={WIN.y + 70}>
          {win.seconds} seconds · filter off
        </text>
        {Array.from({ length: win.seconds }, (_, i) => (
          <rect
            key={i}
            className="ssm-flow-tick"
            x={WIN.x + 18 + i * (TICK.w + TICK.gap)}
            y={TICK.y}
            width={TICK.w}
            height={TICK.h}
            style={{ animationDelay: `${i}s` }}
          />
        ))}
      </g>

      {/* ---- the choice ---- */}
      {choices.map((c, i) => (
        <g key={c.id} className="ssm-flow-node" data-tone={c.tone}>
          <rect x={CH.x} y={CH_Y[i]} width={CH.w} height={CH.h} rx={2} className="ssm-flow-body" />
          <rect x={CH.x} y={CH_Y[i]} width={CH.w} height={CH.h} rx={2} className="ssm-node-frame" />
          <text className="ssm-flow-name is-tone" x={CH.x + CH.w / 2} y={chCy(i) + 6} textAnchor="middle">
            {c.label}
          </text>
        </g>
      ))}

      {/* ---- the endings ---- */}
      {endings.map((e, i) => (
        <g key={e.id} className="ssm-flow-node" data-tone={e.tone}>
          <rect x={END.x} y={END_Y[i]} width={END.w} height={END.h} rx={2} className="ssm-flow-body" />
          <rect x={END.x} y={END_Y[i]} width={END.w} height={END.h} rx={2} className="ssm-node-frame" />
          <rect x={END.x} y={END_Y[i]} width={3} height={END.h} className="ssm-flow-tab" />
          <text className="ssm-flow-name is-tone" x={END.x + 20} y={END_Y[i] + 36}>
            {e.name}
          </text>
          <text className="ssm-node-sub" x={END.x + 20} y={END_Y[i] + 60}>
            {e.combo}
          </text>
        </g>
      ))}
    </svg>
  );
}

function ReasoningRail({ reasoning }: { reasoning: Reasoning }) {
  const rows: readonly [string, string][] = [
    ["Decision", reasoning.decision],
    ["Why", reasoning.why],
    ["Player impact", reasoning.impact],
  ];
  return (
    <dl className="ssm__reasoning">
      {rows.map(([term, body]) => (
        <div key={term} className="ssm__reason">
          <dt className="mono ssm__reason-term">{term}</dt>
          <dd className="ssm__reason-body">{body}</dd>
        </div>
      ))}
    </dl>
  );
}



function BlockHeader({
  order,
  kicker,
  title,
  standfirst,
  titleId,
}: {
  order: string;
  kicker: string;
  title: string;
  standfirst: string;
  titleId: string;
}) {
  return (
    <header className="ssm__head">
      <p className="mono ssm__head-rail">
        <span className="ssm__head-order">{order}</span>
        <span className="ssm__head-kicker">{kicker}</span>
      </p>
      <h3 className="ssm__head-title" id={titleId}>
        {title}
      </h3>
      <p className="ssm__head-standfirst">{standfirst}</p>
    </header>
  );
}

function DesignPoint({ body }: { body: string }) {
  return (
    <p className="ssm__point">
      <span className="mono ssm__point-tag">Design point</span>
      <span className="ssm__point-body">{body}</span>
    </p>
  );
}

export default function ShatteredSkiesMechanics({
  variant = "main",
  block = "all",
}: {
  variant?: SsVariant;
  block?: "all" | "language" | "ship";
}) {
  const deep = variant === "deep";
  const showLanguage = block === "all" || block === "language";
  const showShip = block === "all" || block === "ship";

  return (
    <div className="ssm" data-variant={variant}>

      {/* ---- the spine — MAIN ONLY ---- */}
      {!deep && (
        <section className="ssm__spine" aria-labelledby="ssm-spine-title">
          <p className="mono ssm__spine-tag" id="ssm-spine-title">
            {spine.tag}
          </p>
          <p className="ssm__spine-body">{spine.body}</p>
          <p className="ssm__spine-note">{spine.note}</p>
        </section>
      )}

      {/* ================= 01 · communication ================= */}
      {showLanguage && (
        <article
          className="ssm__block ssm__block--signature"
          aria-labelledby="ssm-communication-title"
        >
          {!deep && <BlockHeader {...communication.meta} titleId="ssm-communication-title" />}
          {deep && (
            <h3 className="ssm__deep-title" id="ssm-communication-title">
              {communication.meta.title}
            </h3>
          )}

          {!deep && <p className="ssm__lead">{communication.lead}</p>}

          <ol className="ssm__channels" data-mode={deep ? "reasoning" : "body"}>
            {communication.channels.map((c, i) => (
              <li key={c.id} className="ssm__channel" data-emphasis={c.emphasis ?? "none"}>
                <div className="ssm__channel-head">
                  <p className="mono ssm__channel-order" aria-hidden="true">
                    {c.order}
                  </p>
                  <div className="ssm__channel-titles">
                    <h4 className="ssm__channel-label">{c.label}</h4>
                    {!deep && <p className="mono ssm__channel-tag">{c.tag}</p>}
                  </div>
                </div>

                {!deep && (
                  <p className="ssm__channel-body">
                    <DecodeOnView text={c.body} delay={i * 260} />
                  </p>
                )}

                {deep && <ReasoningRail reasoning={c.reasoning} />}
              </li>
            ))}
          </ol>

          {/* ---- the figure: telepathy → the endings — MAIN ONLY ---- */}
          {!deep && (
            <figure className="ssm__flow" aria-labelledby="ssm-flow-heading">
              <figcaption className="ssm__flow-cap">
                <h4 className="ssm__flow-title" id="ssm-flow-heading">
                  {telepathyFlow.title}
                </h4>
                <p className="ssm__flow-sub">{telepathyFlow.caption}</p>
              </figcaption>

              <div
                className="ssm__flow-frame"
                tabIndex={0}
                role="group"
                aria-label={telepathyFlow.title}
              >
                <TelepathyFigure />
              </div>
              <p className="mono mono-note ssm__scroll-note">
                Scroll the flow sideways to follow it →
              </p>
              <p className="ssm__flow-note">{telepathyFlow.note}</p>
            </figure>
          )}

          {!deep && <p className="ssm__close">{communication.close}</p>}
        </article>
      )}

      {/* ================= 02 · the ship ================= */}
      {showShip && (
        <article className="ssm__block" aria-labelledby="ssm-ship-title">
          {!deep && <BlockHeader {...ship.meta} titleId="ssm-ship-title" />}
          {deep && (
            <h3 className="ssm__deep-title" id="ssm-ship-title">
              {ship.meta.title}
            </h3>
          )}

          {!deep && (
            <>
              <p className="mono ssm__ref">
                Reference · <span className="ssm__ref-name">{ship.inspiration.ref}</span>
              </p>
              <p className="ssm__ref-body">{ship.inspiration.body}</p>

              <p className="ssm__lead">{ship.lead}</p>

              {/* Small on purpose: this is a reference, not the argument. */}
              <section className="ssm__aside" aria-labelledby="ssm-stations-title">
                <h4 className="mono ssm__aside-title" id="ssm-stations-title">
                  {ship.stationsLabel}
                </h4>
                <dl className="ssm__stations">
                  {ship.stations.map((st) => (
                    <div key={st.id} className="ssm__station">
                      <dt className="mono ssm__station-name">{st.name}</dt>
                      <dd className="ssm__station-role">{st.role}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section className="ssm__aside" aria-labelledby="ssm-repairs-title">
                <h4 className="mono ssm__aside-title" id="ssm-repairs-title">
                  {ship.repairs.label}
                </h4>
                <p className="ssm__aside-lead">{ship.repairs.body}</p>
                <p className="ssm__pointer">
                  <span className="mono ssm__pointer-tag">In depth</span>
                  <span className="ssm__pointer-body">
                    {ship.repairs.pointer}{" "}
                    <Link className="ssm__pointer-link" href={mainHref("coop", variant)}>
                      Click here for {ship.repairs.linkLabel}
                    </Link>
                  </span>
                </p>
              </section>

              <DesignPoint body={ship.designPoint} />
            </>
          )}

          {deep && <ReasoningRail reasoning={ship.dualControl} />}
        </article>
      )}

      {/* ================= 03 · traversal ================= */}
      {showShip && (
        <article className="ssm__block" aria-labelledby="ssm-traversal-title">
          {!deep && <BlockHeader {...traversal.meta} titleId="ssm-traversal-title" />}
          {deep && (
            <h3 className="ssm__deep-title" id="ssm-traversal-title">
              {traversal.meta.title}
            </h3>
          )}

          {!deep && (
            <>
              <p className="ssm__lead">{traversal.lead}</p>

              {/* Same two colours the narrative map uses for the two hosts. */}
              <ul className="ssm__bodies" aria-label={traversal.bodiesLabel}>
                {traversal.bodies.map((b) => (
                  <li key={b.id} className="ssm__body" data-host={b.id}>
                    <p className="ssm__body-name">{b.name}</p>
                    <p className="mono ssm__body-build">{b.build}</p>
                    <p className="ssm__body-copy">{b.body}</p>
                  </li>
                ))}
              </ul>

              <section className="ssm__aside" aria-labelledby="ssm-jetpack-title">
                <h4 className="mono ssm__aside-title" id="ssm-jetpack-title">
                  {traversal.jetpackLabel}
                </h4>
                <p className="ssm__aside-lead">{traversal.jetpackBody}</p>
              </section>

              <section className="ssm__highlight" aria-labelledby="ssm-booster-title">
                <h4 className="ssm__highlight-title" id="ssm-booster-title">
                  {traversal.booster.label}
                </h4>
                <p className="ssm__highlight-body">{traversal.booster.body}</p>
              </section>
            </>
          )}

          {deep && (
            <>
              <section className="ssm__aside" aria-labelledby="ssm-jetpack-uses-title">
                <h4 className="mono ssm__aside-title" id="ssm-jetpack-uses-title">
                  The thruster as an environmental verb
                </h4>
                <ul className="ssm__uses">
                  {traversal.jetpackUses.map((u) => (
                    <li key={u.id} className="ssm__use">
                      <p className="mono ssm__use-label">{u.label}</p>
                      <p className="ssm__use-body">{u.body}</p>
                    </li>
                  ))}
                </ul>
              </section>

              <h4 className="ssm__highlight-title">{traversal.booster.label}</h4>
              <ReasoningRail reasoning={traversal.booster.reasoning} />
            </>
          )}
        </article>
      )}

      <style>{`
        .ssm {
          /* The layout scopes the palette, so these are tokens rather than
             hexes — except the tones the theme has no slot for, which are
             contrast-checked below. Cyan is the section's colour and gold is
             its warm counter; every tone here is measured on the void. */
          --ssm-cyan: var(--color-nebula, #7ec8d8);      /* 10.2:1 */
          --ssm-warm: var(--color-gold);                  /* 8.6:1  */
          /* Emerald is 4.1:1 on the void — under the bar for body text — so
             Drayk's colour is lifted toward moonlight before it is used. */
          --ssm-drayk: color-mix(in srgb, var(--color-emerald) 55%, var(--color-moonlight));
          --ssm-aevi: var(--ssm-cyan);
          /* Ending tones, matched to NarrativeMap so the page's two diagrams
             agree: 12.7:1, 8.6:1 and 5.8:1 respectively. */
          --ssm-unity: #7FE3C4;
          --ssm-betrayal: var(--color-gold);
          --ssm-destruction: #E4696E;
          /* Mist alone is 4.2:1 on the panels. Blended toward moonlight the
             small type clears AA everywhere it is used: about 8.8:1. */
          --ssm-quiet: color-mix(in srgb, var(--color-mist) 50%, var(--color-moonlight));
          --ssm-edge: color-mix(in srgb, var(--color-mist) 32%, transparent);
          --ssm-panel: color-mix(in srgb, var(--color-nightfall) 62%, var(--color-void));
          --ssm-void: var(--color-void);

          display: grid;
          gap: 3rem;
          min-width: 0;
        }

        /* ---- the credit ----
           One line, not a panel: the team attribution for the game itself is
           already up the page. This one says who designed these systems. */
        .ssm__role {
          margin: 0;
          display: flex;
          align-items: baseline;
          gap: 0.6rem;
          font-size: 0.7rem;
          line-height: 1.6;
          letter-spacing: 0.1em;
          color: var(--ssm-quiet);
          max-width: 46rem;
        }
        .ssm__role-mark {
          flex: none;
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          background: var(--ssm-cyan);
          transform: translateY(-0.05rem);
        }
        .ssm__role-name {
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ssm-cyan);
        }

        /* ---- the spine ----
           The section's thesis. It is the only panel with a gradient edge, and
           the gradient is the two hosts' colours, because the claim is about
           the two of them. */
        .ssm__spine {
          position: relative;
          background: var(--ssm-panel);
          border: 1px solid var(--ssm-edge);
          padding: 1.5rem 1.6rem 1.65rem;
          display: grid;
          gap: 0.85rem;
        }
        .ssm__spine::before {
          content: "";
          position: absolute;
          inset: 0 auto 0 0;
          width: 2px;
          background: linear-gradient(to bottom, var(--ssm-drayk), var(--ssm-cyan));
        }
        .ssm__spine-tag {
          margin: 0;
          font-size: 0.68rem;
          letter-spacing: 0.18em;
          color: var(--ssm-cyan);
        }
        .ssm__spine-body {
          margin: 0;
          max-width: 46rem;
          font-size: clamp(1.08rem, 1rem + 0.5vw, 1.35rem);
          line-height: 1.6;
          color: var(--color-moonlight);
        }
        .ssm__spine-note {
          margin: 0;
          max-width: 46rem;
          padding-top: 0.85rem;
          border-top: 1px solid var(--ssm-edge);
          font-size: 0.9rem;
          line-height: 1.7;
          color: var(--ssm-quiet);
        }

        /* ---- block furniture ---- */
        .ssm__block {
          display: grid;
          gap: 1.5rem;
          min-width: 0;
          padding-top: 2.25rem;
          border-top: 1px solid var(--ssm-edge);
        }
        .ssm__head { display: grid; gap: 0.5rem; }
        .ssm__head-rail {
          margin: 0;
          display: flex;
          align-items: baseline;
          gap: 0.75rem;
          font-size: 0.68rem;
          letter-spacing: 0.18em;
        }
        .ssm__head-order { color: var(--ssm-cyan); }
        .ssm__head-kicker { color: var(--ssm-quiet); }
        .ssm__head-title {
          margin: 0;
          font-family: var(--font-hero);
          font-size: clamp(1.3rem, 1.05rem + 0.9vw, 1.85rem);
          letter-spacing: 0.02em;
          color: var(--color-moonlight);
        }
        /* The signature block gets the one accent title in the section. */
        .ssm__block--signature .ssm__head-title { color: var(--ssm-cyan); }
        .ssm__head-standfirst {
          margin: 0;
          max-width: 46rem;
          font-size: 1rem;
          line-height: 1.7;
          color: var(--ssm-quiet);
        }
        .ssm__lead {
          margin: 0;
          max-width: 46rem;
          font-size: 1.02rem;
          line-height: 1.75;
          color: var(--color-moonlight);
        }
        .ssm__close {
          margin: 0;
          max-width: 46rem;
          padding-left: 1rem;
          border-left: 2px solid var(--ssm-cyan);
          font-size: 1rem;
          line-height: 1.7;
          color: var(--color-moonlight);
        }

        /* ---- the reasoning rail ----
           Three labelled moves, hung off a hairline. Same shape in every block
           so it can be found without being read. */
        .ssm__reasoning {
          margin: 0;
          display: grid;
          gap: 0.9rem;
          max-width: 46rem;
        }
        .ssm__reason {
          display: grid;
          gap: 0.25rem;
          padding-left: 0.9rem;
          border-left: 1px solid var(--ssm-edge);
        }
        .ssm__reason-term {
          margin: 0;
          font-size: 0.71rem;
          letter-spacing: 0.16em;
          color: var(--ssm-warm);
        }
        .ssm__reason-body {
          margin: 0;
          font-size: 0.92rem;
          line-height: 1.7;
          color: var(--ssm-quiet);
        }

        /* ---- 01 · the channels ----
           The section's densest band, and the only numbered list in it. */
        .ssm__channels {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 1px;
          background: var(--ssm-edge);
          border: 1px solid var(--ssm-edge);
        }
        .ssm__channel {
          background: var(--ssm-panel);
          padding: 1.35rem 1.4rem 1.5rem;
          display: grid;
          gap: 0.85rem;
          min-width: 0;
        }
        /* The two channels the block leans on hardest are marked, not moved:
           the escalating order of the four is doing the real work. */
        .ssm__channel[data-emphasis="meta"] { box-shadow: inset 2px 0 0 var(--ssm-warm); }
        .ssm__channel[data-emphasis="payoff"] { box-shadow: inset 2px 0 0 var(--ssm-cyan); }

        .ssm__channel-head {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: 0.25rem 0.9rem;
          align-items: baseline;
        }
        .ssm__channel-order {
          margin: 0;
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          color: var(--ssm-cyan);
        }
        .ssm__channel-titles { min-width: 0; }
        .ssm__channel-label {
          margin: 0;
          font-family: var(--font-hero);
          font-size: 1.15rem;
          letter-spacing: 0.02em;
          color: var(--color-moonlight);
        }
        .ssm__channel-tag {
          margin: 0.3rem 0 0;
          font-size: 0.71rem;
          letter-spacing: 0.14em;
          color: var(--ssm-quiet);
        }
        .ssm__channel-badge {
          margin: 0;
          grid-column: 2;
          justify-self: start;
          font-size: 0.70rem;
          letter-spacing: 0.16em;
          padding: 0.25rem 0.5rem;
          border: 1px solid var(--ssm-edge);
          color: var(--ssm-warm);
        }
        .ssm__channel[data-emphasis="payoff"] .ssm__channel-badge { color: var(--ssm-cyan); }
        .ssm__channel-body {
          margin: 0;
          max-width: 46rem;
          font-size: 1rem;
          line-height: 1.7;
          color: var(--color-moonlight);
        }
        /* THE TRANSMISSION, MID-DECODE.

           Terminal green while the glyphs are still noise, the normal body
           colour once the sentence has resolved. The --color-emerald var is the
           route token — the old TransmissionCard hardcoded #5FD98A for this
           and could drift from the palette; it cannot now.

           tabular-nums and the mono stack are NOT used: the point is that the
           reader's own sentence is being repaired, so it has to be the same
           face and the same metrics it will settle into. The glyph set is
           chosen so the scrambled line occupies the same box, which is what
           stops the paragraph reflowing as it resolves.

           4.9:1 on this ground, and it is transient decoration over text that
           is also present, unscrambled, in the accessibility tree. */
        .ssm__channel-body [data-decoding="true"] {
          color: var(--color-emerald);
          /* Stops a half-decoded word being read as a spelling mistake. */
          opacity: 0.92;
        }

        /* THE CURSOR IS THE OTHER HALF OF THIS, and it lives in globals.css as
           .decode-cursor::after -- it needs @keyframes, and this component
           renders four of these. The two rules are keyed off the SAME
           data-decoding attribute and hand the green over between them: it is
           in the TEXT while the line is still noise, and in the CURSOR once the
           line has settled. Nothing else of the old card came back -- no
           terminal frame, no second copy of these four bodies.

           (No backticks in this block: it is inside a template literal.) */

        /* ---- the deep dive's own headings ----
           On the main page each block gets the full BlockHeader — order,
           kicker, title, standfirst. On the deep dive the section already has
           a numbered SectionHeading above it, so a second full header would
           be two title systems arguing. One line, at h3. */
        .ssm__deep-title {
          margin: 0;
          font-family: var(--font-hero);
          font-size: 1.35rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          line-height: 1.25;
          color: var(--color-moonlight);
        }
        /* Reasoning mode: no body copy between the label and the rail, so the
           channels want tighter spacing than the described version. */
        .ssm__channels[data-mode="reasoning"] { gap: 2.25rem; }

        /* ---- the figure ---- */
        /* min-width: 0 on the figure and its scroll frame: belt and braces
           against a grid item's auto minimum size, so the 1040px drawing can
           only ever scroll inside its own box. Measured at 500px: the page
           does not scroll horizontally, the frame does. */
        .ssm__flow {
          margin: 0;
          display: grid;
          gap: 1rem;
          min-width: 0;
        }
        .ssm__flow-cap { display: grid; gap: 0.3rem; }
        .ssm__flow-title {
          margin: 0;
          font-family: var(--font-hero);
          font-size: 1.15rem;
          letter-spacing: 0.02em;
          color: var(--color-moonlight);
        }
        .ssm__flow-sub {
          margin: 0;
          max-width: 46rem;
          font-size: 0.88rem;
          line-height: 1.6;
          color: var(--ssm-quiet);
        }
        .ssm__flow-frame {
          min-width: 0;
          border: 1px solid var(--ssm-edge);
          background: var(--ssm-void);
          overflow-x: auto;
          overscroll-behavior-x: contain;
        }
        .ssm__scroll-note {
          display: none;
          margin: 0.7rem 0 0;
          font-size: 0.71rem;
          color: var(--ssm-quiet);
        }
        @media (max-width: 1040px) {
          .ssm__scroll-note { display: block; }
        }
        .ssm__flow-frame:focus-visible {
          outline: 2px solid var(--color-lunar-gold);
          outline-offset: 2px;
        }
        /* Never drawn smaller than 1:1: the mono labels are 10px in viewBox
           units, so any downscaling puts them under 7px. At the section's full
           column width the drawing lands at almost exactly 1040px and no
           scrollbar appears; below that it scrolls, and the text rail under it
           carries the same flow anyway. */
        .ssm-flow-svg {
          display: block;
          width: 100%;
          min-width: 1040px;
          height: auto;
        }

        /* ---- svg: type ---- */
        .ssm-flow-rail text,
        .ssm-node-sub {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          fill: var(--ssm-quiet);
        }
        .ssm-flow-rail text { opacity: 0.85; }
        .ssm-flow-name {
          font-family: var(--font-hero);
          font-size: 17px;
          letter-spacing: 0.02em;
          fill: var(--color-moonlight);
        }
        .ssm-flow-name.is-tone { fill: var(--tone, var(--color-moonlight)); }

        /* ---- svg: nodes ---- */
        .ssm-flow-body { fill: var(--ssm-panel); }
        .ssm-node-frame { fill: none; stroke: var(--ssm-edge); stroke-width: 1; }
        .ssm-flow-tab { fill: var(--tone, var(--ssm-cyan)); }
        .ssm-flow-window .ssm-node-frame { stroke: color-mix(in srgb, var(--ssm-cyan) 45%, transparent); }
        .ssm-flow-window .ssm-flow-name { fill: var(--ssm-cyan); }
        .ssm-flow-tick { fill: var(--ssm-cyan); opacity: 0.9; }

        /* ---- svg: edges ---- */
        .ssm-flow-edge {
          fill: none;
          stroke: var(--tone, var(--ssm-cyan));
          stroke-width: 1.25;
          opacity: 0.5;
          vector-effect: non-scaling-stroke;
        }
        .ssm-flow-dot { fill: var(--tone, var(--ssm-cyan)); }

        /* ---- tones, shared by the svg and the text rail ----
           Scoped to .ssm: the attribute is generic enough that an unscoped
           rule would reach into other sections of the page. */
        .ssm [data-tone="truth"] { --tone: var(--ssm-cyan); }
        .ssm [data-tone="deceit"] { --tone: var(--ssm-warm); }
        .ssm [data-tone="unity"] { --tone: var(--ssm-unity); }
        .ssm [data-tone="betrayal"] { --tone: var(--ssm-betrayal); }
        .ssm [data-tone="destruction"] { --tone: var(--ssm-destruction); }

        .ssm__flow-note {
          margin: 0;
          max-width: 46rem;
          padding: 0.9rem 1.1rem;
          border: 1px solid var(--ssm-edge);
          border-left: 2px solid var(--ssm-warm);
          background: var(--ssm-panel);
          font-size: 0.9rem;
          line-height: 1.7;
          color: var(--color-moonlight);
        }

        /* ---- 02 + 03 · compact furniture ---- */
        .ssm__ref {
          margin: 0;
          font-size: 0.71rem;
          letter-spacing: 0.16em;
          color: var(--ssm-quiet);
        }
        .ssm__ref-name { color: var(--ssm-warm); }
        .ssm__ref-body {
          margin: -0.9rem 0 0;
          max-width: 46rem;
          font-size: 0.88rem;
          line-height: 1.65;
          color: var(--ssm-quiet);
        }

        .ssm__aside { display: grid; gap: 0.85rem; }
        .ssm__aside-title {
          margin: 0;
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          color: var(--ssm-cyan);
        }
        .ssm__aside-lead {
          margin: 0;
          max-width: 46rem;
          font-size: 0.95rem;
          line-height: 1.7;
          color: var(--color-moonlight);
        }

        /* Hands the three minigames to the co-op design section below. */
        .ssm__pointer {
          margin: 0;
          max-width: 46rem;
          display: grid;
          gap: 0.35rem;
          padding-left: 0.95rem;
          border-left: 1px solid var(--ssm-edge);
        }
        .ssm__pointer-tag {
          font-size: 0.70rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ssm-cyan);
        }
        .ssm__pointer-body {
          font-size: 0.89rem;
          line-height: 1.7;
          color: var(--ssm-quiet);
        }
        /* S2 — the hand-off is a real link now, because after the split the
           thing it points at may be on another page. Underlined at rest: a
           coloured word with no other cue is not an affordance. */
        .ssm__pointer-link {
          color: var(--ssm-cyan);
          text-decoration: underline;
          text-decoration-color: color-mix(in srgb, var(--ssm-cyan) 45%, transparent);
          text-underline-offset: 0.22em;
          white-space: nowrap;
        }
        .ssm__pointer-link:hover,
        .ssm__pointer-link:focus-visible {
          text-decoration-color: currentColor;
        }

        /* Ship systems: a reference, kept deliberately small. */
        .ssm__stations {
          margin: 0;
          display: grid;
          gap: 0.85rem;
        }
        @media (min-width: 44rem) {
          .ssm__stations { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.9rem 2.5rem; }
        }
        .ssm__station {
          display: grid;
          gap: 0.2rem;
          padding-left: 0.9rem;
          border-left: 1px solid var(--ssm-edge);
          min-width: 0;
        }
        .ssm__station-name {
          margin: 0;
          font-size: 0.7rem;
          letter-spacing: 0.14em;
          color: var(--ssm-warm);
        }
        .ssm__station-role {
          margin: 0;
          font-size: 0.87rem;
          line-height: 1.6;
          color: var(--ssm-quiet);
        }

        .ssm__uses {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 1rem;
        }
        @media (min-width: 44rem) {
          .ssm__uses { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.25rem; }
        }
        .ssm__use {
          display: grid;
          gap: 0.3rem;
          padding-top: 0.7rem;
          border-top: 1px solid var(--ssm-edge);
          min-width: 0;
        }
        .ssm__use-label {
          margin: 0;
          font-size: 0.71rem;
          letter-spacing: 0.16em;
          color: var(--ssm-cyan);
        }
        .ssm__use-body {
          margin: 0;
          font-size: 0.87rem;
          line-height: 1.6;
          color: var(--ssm-quiet);
        }

        /* Two bodies, two colours — the same pair the narrative map uses. */
        .ssm__bodies {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 1px;
          background: var(--ssm-edge);
          border: 1px solid var(--ssm-edge);
        }
        @media (min-width: 44rem) {
          .ssm__bodies { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        .ssm__body {
          background: var(--ssm-panel);
          border-top: 3px solid var(--host, var(--ssm-edge));
          padding: 1.1rem 1.2rem 1.3rem;
          display: grid;
          gap: 0.3rem;
          align-content: start;
          min-width: 0;
        }
        .ssm__body[data-host="aevi"] { --host: var(--ssm-aevi); }
        .ssm__body[data-host="drayk"] { --host: var(--ssm-drayk); }
        .ssm__body-name {
          margin: 0;
          font-family: var(--font-hero);
          font-size: 1.2rem;
          letter-spacing: 0.03em;
          color: var(--host, var(--color-moonlight));
        }
        .ssm__body-build {
          margin: 0;
          font-size: 0.70rem;
          letter-spacing: 0.16em;
          color: var(--ssm-quiet);
        }
        .ssm__body-copy {
          margin: 0.35rem 0 0;
          font-size: 0.9rem;
          line-height: 1.65;
          color: var(--ssm-quiet);
        }

        /* The collision booster: the block's highlight. */
        .ssm__highlight {
          border: 1px solid var(--ssm-edge);
          border-left: 2px solid var(--ssm-cyan);
          background: var(--ssm-panel);
          padding: 1.25rem 1.35rem 1.45rem;
          display: grid;
          gap: 0.8rem;
        }
        .ssm__highlight-title {
          margin: 0;
          font-family: var(--font-hero);
          font-size: 1.15rem;
          letter-spacing: 0.02em;
          color: var(--ssm-cyan);
        }
        .ssm__highlight-body {
          margin: 0;
          max-width: 46rem;
          font-size: 1rem;
          line-height: 1.7;
          color: var(--color-moonlight);
        }

        /* ---- the design point ----
           The line that hands the block back to the spine. */
        .ssm__point {
          margin: 0;
          max-width: 46rem;
          display: grid;
          gap: 0.4rem;
          padding-top: 0.85rem;
          border-top: 1px solid var(--ssm-edge);
        }
        .ssm__point-tag {
          font-size: 0.70rem;
          letter-spacing: 0.18em;
          color: var(--ssm-warm);
        }
        .ssm__point-body {
          font-size: 0.98rem;
          line-height: 1.7;
          color: var(--color-moonlight);
        }

        /* ---- motion ----
           One animation in the section: the five segments of the telepathy
           window go out one per second, then reset. It is the only thing on
           the page that shows what "five seconds" costs. Purely decorative —
           the figure reads identically when it is still, and the same content
           is in the text rail below — so reduced motion simply gets it lit. */
        @media (prefers-reduced-motion: no-preference) {
          .ssm-flow-tick { animation: ssm-drain 5s linear infinite; }
        }
        @keyframes ssm-drain {
          0%, 18% { opacity: 0.9; }
          20%, 100% { opacity: 0.18; }
        }
      `}</style>
    </div>
  );
}

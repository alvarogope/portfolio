import {
  joustDesignNote,
  joustMatrix,
  joustMatrixCaption,
  joustSpinout,
  joustTimings,
  joustingIntro,
} from "@/content/moon-knight-jousting";

/**
 * Moon-Knight — the jousting minigame.
 *
 * DELIBERATELY SMALL. This is a side feature on a page whose other sections are
 * pillars, and it is built to lose that comparison on purpose: no band titles,
 * no emblems, one visual. Matrix on the left, three short paragraphs on the
 * right, and the spin-out note as a slim rule underneath. On a narrow screen
 * the two columns stack and the whole thing is still under a screen.
 *
 * THE MATRIX IS A REAL TABLE. Two actions, three timings, six outcomes — that
 * is tabular data, so it is a `<table>` with a `<caption>`, `scope="col"` on
 * the timings and `scope="row"` on the actions. A grid of coloured divs would
 * have looked identical and told a screen reader nothing about which outcome
 * belonged to which pair.
 *
 * COLOUR IS NEVER THE ONLY SIGNAL. Every cell says what happens in words —
 * "Receives hit", "Dodges the attack" — so the tint is a second, faster read of
 * something the text already carries. That matters here more than usual,
 * because the tint IS the argument: the middle column lights up and the flanks
 * do not, which is the sentence "perfect timing is the skill window" told as a
 * shape before it is told as prose.
 *
 * A server component, and nothing in it moves.
 */
export default function Jousting() {
  return (
    <div className="mkj">
      <div className="mkj-body">
        {/* The visual first in source order as well as on screen: it is the
            thing worth stopping for, and the prose only explains it. */}
        <figure className="mkj-figure">
          <figcaption className="mono mkj-caption">{joustMatrixCaption}</figcaption>
          {/* Scroller, not a stacked rewrite: at 360px the table still fits,
              but a long outcome string or a large font must never be able to
              push the page sideways. */}
          <div className="mkj-scroll">
            <table className="mkj-matrix">
              <caption className="mkj-sr">
                Jousting outcomes by action and timing. Rows are the player&apos;s action,
                columns are when they commit.
              </caption>
              <thead>
                <tr>
                  <td className="mkj-corner" />
                  {joustTimings.map((t) => (
                    <th key={t} scope="col" className="mono mkj-col">
                      {t}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {joustMatrix.map((row) => (
                  <tr key={row.action}>
                    <th scope="row" className="mono mkj-row">
                      {row.action}
                    </th>
                    {row.cells.map((cell, i) => (
                      <td key={joustTimings[i]} className={`mkj-cell is-${cell.tone}`}>
                        {cell.outcome}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </figure>

        <div className="mkj-prose">
          {/* `joustingIntro.practice` was rendered here. The const was cut
              from `moon-knight-jousting.ts` and this read was left behind, so
              the page no longer type-checked; the second line is gone with the
              copy rather than replaced with new copy this component does not
              own. */}
          <p className="mkj-line">{joustingIntro.tournament}</p>
          <p className="mkj-design">
            <span className="mono mkj-design-key">Why</span>
            {joustDesignNote}
          </p>
        </div>
      </div>

      {/* The hook. A rule and a kicker rather than a panel — it is an aside
          about where the idea went, and giving it a box would make it look
          like a bigger claim than it is. */}
      <aside className="mkj-spinout">
        <p className="mono mkj-spinout-kicker">{joustSpinout.kicker}</p>
        <p className="mkj-spinout-body">{joustSpinout.body}</p>
      </aside>

      <style>{`
        .mkj {
          /* Same lifted inks as the diegetic and narrative bands, so this
             sits in the page rather than beside it. --mkj-quiet is 6.3:1 on
             the panel; raw scarlet is 2:1 and unusable, so it is mixed toward
             moonlight until it clears 4.5:1 as text. */
          --mkj-quiet: #93A0B3;
          --mkj-hair: color-mix(in srgb, var(--color-gold) 24%, transparent);
          --mkj-edge: color-mix(in srgb, var(--color-mist) 26%, transparent);
          --mkj-blood-ink: color-mix(in srgb, var(--color-scarlet) 55%, var(--color-moonlight));
          --mkj-leaf-ink: color-mix(in srgb, var(--color-emerald) 55%, var(--color-moonlight));

          display: grid;
          gap: 1.6rem;
        }

        /* Matrix beside prose. The matrix column is sized to the table so the
           text takes the slack rather than the other way round. */
        .mkj-body {
          display: grid;
          grid-template-columns: minmax(0, 22rem) minmax(0, 1fr);
          gap: 1.6rem 2.2rem;
          align-items: start;
        }

        .mkj-figure { margin: 0; display: grid; gap: 0.5rem; }
        .mkj-caption {
          margin: 0;
          font-size: 0.70rem;
          line-height: 1.5;
          color: var(--mkj-quiet);
        }
        .mkj-scroll { overflow-x: auto; }

        /* Visually hidden, still announced: the figcaption above is the human
           label, this is the one that explains the axes to a screen reader. */
        .mkj-sr {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
        }

        .mkj-matrix {
          border-collapse: separate;
          border-spacing: 1px;
          background: var(--mkj-edge);
          border: 1px solid var(--mkj-edge);
          width: 100%;
          min-width: 19rem;
        }
        .mkj-corner { background: var(--color-void); }
        .mkj-col,
        .mkj-row {
          background: var(--color-void);
          font-size: 0.68rem;
          font-weight: 400;
          color: var(--color-gold);
          padding: 0.45rem 0.5rem;
          line-height: 1.4;
        }
        .mkj-col { text-align: center; }
        .mkj-row { text-align: left; color: var(--color-silver); white-space: nowrap; }

        .mkj-cell {
          background: var(--color-nightfall);
          padding: 0.6rem 0.55rem;
          text-align: center;
          font-family: var(--font-body);
          font-size: 0.8rem;
          line-height: 1.4;
          color: var(--mkj-quiet);
          vertical-align: middle;
        }
        /* The tints, and what the shape says: the two ways to be hit are both
           mistimed dodges out on the flanks, and the one clean win sits in the
           middle. Attacking is never tinted as a win, because it never is one
           on its own — at perfect distance it only lands if they fail to read
           you, which is the silver "contested" cell rather than a green one.

           Emerald sits heavier than scarlet at equal percentages, so the win
           cell is mixed a few points stronger: the only clean outcome on the
           board must not read quieter than the two ways to lose. Checked at
           5.2:1 against its own tint. */
        .mkj-cell.is-good {
          background: color-mix(in srgb, var(--color-emerald) 26%, var(--color-nightfall));
          color: var(--mkj-leaf-ink);
        }
        .mkj-cell.is-contested {
          background: color-mix(in srgb, var(--color-silver) 11%, var(--color-nightfall));
          color: var(--color-moonlight);
        }
        .mkj-cell.is-bad {
          background: color-mix(in srgb, var(--color-scarlet) 22%, var(--color-nightfall));
          color: var(--mkj-blood-ink);
        }

        /* ---- the prose beside it ---- */
        .mkj-prose { display: grid; gap: 0.7rem; align-content: start; }
        .mkj-line {
          margin: 0;
          font-family: var(--font-body);
          font-size: 0.92rem;
          line-height: 1.65;
          color: var(--color-moonlight);
          max-width: 44rem;
        }
        .mkj-line--quiet { color: var(--color-silver); font-size: 0.88rem; }
        .mkj-design {
          margin: 0.15rem 0 0;
          padding-left: 0.85rem;
          border-left: 1px solid var(--mkj-hair);
          font-family: var(--font-body);
          font-size: 0.85rem;
          line-height: 1.6;
          color: var(--color-silver);
          max-width: 44rem;
        }
        /* The same gold "Why" tag the diegetic section marks its reasoning
           with — one convention for "this bit is the thinking". */
        .mkj-design-key {
          display: inline-block;
          margin-right: 0.5rem;
          font-size: 0.68rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--color-gold);
        }

        /* ---- the spin-out ---- */
        .mkj-spinout {
          border-top: 1px solid var(--mkj-hair);
          padding-top: 0.9rem;
          display: grid;
          gap: 0.3rem;
        }
        .mkj-spinout-kicker { margin: 0; font-size: 0.70rem; color: var(--color-gold); }
        .mkj-spinout-body {
          margin: 0;
          font-family: var(--font-body);
          font-size: 0.9rem;
          line-height: 1.65;
          color: var(--color-moonlight);
          max-width: 46rem;
        }

        /* ---- responsive ----
           One breakpoint, one change: the two columns become one. The table
           keeps its own scroller at every width. */
        @media (max-width: 760px) {
          .mkj-body { grid-template-columns: minmax(0, 1fr); }
        }
      `}</style>
    </div>
  );
}

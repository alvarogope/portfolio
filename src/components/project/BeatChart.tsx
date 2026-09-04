"use client";

import { useRef, useState } from "react";
import {
  arcCaption,
  beatChartThesis,
  beatDimensions,
  beatLevels,
  beatStructureNote,
  dimensionGroups,
  emptyCell,
  emptyCellLabel,
  getBeatLevel,
  type BeatLevel,
  type LevelId,
} from "@/content/moon-knight-levels";
import { MoonPhaseGlyph } from "./MoonPhaseGlyph";

/**
 * Moon-Knight — the level design beat chart.
 *
 * The planning artifact for the whole game: four levels, nine design
 * dimensions, one screen. Four bands, in the order the chart is meant to be
 * read:
 *
 *   1. THE MOON RAIL — the signature. The four levels strung along a single
 *      horizontal line, each marked by the moon phase the game is in when it
 *      is played, WAXING left to right: crescent, first quarter, gibbous,
 *      full. The moon is the spine of this project, so the level order and the
 *      lunar cycle are drawn as the same line. The rail also selects, and each
 *      station is stamped with its `stageLabel` — Prologue, then Acts I–III.
 *      That stamp plus `beatStructureNote` under the rail is what keeps four
 *      moons here from contradicting the three above the narrative arc:
 *      Centralis is a location, not an act, and the note says so.
 *   2. THE MATRIX — nine dimensions against four levels. The dense view, and
 *      the one worth reading in both directions: down a column is a level,
 *      across a row is an escalation. The boss row is emphasised because it is
 *      the one row where a cell is a whole encounter.
 *   3. THE DESIGN SHEET — the selected level expanded, its dimensions
 *      regrouped into the three passes a level actually gets designed in
 *      (space & goal, cast & threat, mood), led by one line on how those
 *      layers cohere. Defaults to the Tutorial.
 *   4. THE ARC — the four levels distilled to a phrase each. The whole
 *      escalation in one line, for a reader who stops after ten seconds.
 *
 * THE RAIL IS A TABLIST. Four levels, one visible panel: that is what tabs
 * are, so the rail is `role="tablist"` with roving tabindex, arrow/Home/End
 * keys and automatic activation, and the design sheet is its `tabpanel`. The
 * matrix column headers select the same level through ordinary buttons rather
 * than a second set of tabs — two tablists driving one panel would lie to a
 * screen reader about how many panels exist.
 *
 * SELECTION IS CLICK AND FOCUS, NOT HOVER. `WorldMap` on this page selects on
 * hover because its popover opens ON the marker being pointed at. Here the
 * panel is a tall block further down the page, so hovering the rail on the way
 * to somewhere else would reflow content the reader is looking at. Hover gets
 * an affordance and nothing more.
 *
 * NO SCREENSHOTS, DELIBERATELY. This is the planning view; the real captures
 * live in the page's gallery. Every cell is a phrase, and the creatures, cast,
 * palette and score each have their own section elsewhere on the page — the
 * chart's job is the relationships between them, not their descriptions.
 *
 * MOBILE. A nine-by-four matrix cannot be honestly squeezed into 360px, and
 * CSS cannot transpose a table, so below 820px the `<table>` is swapped for
 * per-level cards built from the same arrays — same nine labels, one level per
 * card. Only one of the two is ever in the DOM's accessibility tree, because
 * `display: none` removes the other. Between 820px and roughly a laptop the
 * table keeps its natural width inside a scroller.
 */

/* Dimensions pre-bucketed into the sheet's three groups. Module scope: the
   arrays are frozen content, so this is computed once rather than per render. */
const SHEET_GROUPS = dimensionGroups.map((group) => ({
  ...group,
  dims: beatDimensions.filter((d) => d.group === group.id),
}));

/* ---- the moon ----
   Geometry from `MoonPhaseGlyph`, shared with the narrative arc and the
   diegetic health readout. The halo is this section's own: a soft disc behind
   the moon that is the selection cue, and that sits at half strength on the
   full moon at all times — the last station is the one the whole progression
   is walking towards, so it is lit before it is chosen. */
function RailMoon({ level }: { level: BeatLevel }) {
  return (
    <span className="bc-orb">
      <span className="bc-halo" aria-hidden="true" />
      <MoonPhaseGlyph
        phase={level.phase}
        className="bc-moon"
        discClassName="bc-moon-disc"
        litClassName="bc-moon-lit"
      />
    </span>
  );
}

/** The dash a blank cell renders as, plus the words a screen reader gets. */
function Blank() {
  return (
    <>
      <span aria-hidden="true" className="bc-blank">
        {emptyCell}
      </span>
      <span className="bc-sr">{emptyCellLabel}</span>
    </>
  );
}

export default function BeatChart() {
  const [selected, setSelected] = useState<LevelId>(beatLevels[0].id);
  const tabRefs = useRef<Partial<Record<LevelId, HTMLButtonElement | null>>>({});
  const level = getBeatLevel(selected);

  /* Automatic activation: the arrow keys move focus and the selection
     together, which is the expected behaviour for a tablist whose panels are
     already rendered and cost nothing to swap. */
  function onRailKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = beatLevels.length - 1;
    let next: number | null = null;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = index === last ? 0 : index + 1;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = index === 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;

    if (next === null) return;
    event.preventDefault();
    const target = beatLevels[next];
    setSelected(target.id);
    tabRefs.current[target.id]?.focus();
  }

  return (
    <div className="bc">
      <p className="bc-thesis">{beatChartThesis}</p>

      {/* 1 — the moon rail */}
      <div
        className="bc-rail"
        role="tablist"
        aria-label="The four levels, by moon phase"
        aria-orientation="horizontal"
      >
        {beatLevels.map((l, i) => {
          const isSelected = l.id === selected;
          return (
            <button
              key={l.id}
              type="button"
              role="tab"
              id={`bc-tab-${l.id}`}
              aria-selected={isSelected}
              aria-controls="bc-sheet"
              tabIndex={isSelected ? 0 : -1}
              data-step={i}
              className={`bc-station${isSelected ? " is-selected" : ""}${l.phase === "full" ? " is-final" : ""}`}
              ref={(node) => {
                tabRefs.current[l.id] = node;
              }}
              onClick={() => setSelected(l.id)}
              onKeyDown={(event) => onRailKeyDown(event, i)}
            >
              <span className="mono bc-station-ord">
                <span className="bc-station-num">{l.ordinal}</span>
                <span className="bc-station-stage">{l.stageLabel}</span>
              </span>

              {/* Rule, moon, rule — the same crown the narrative acts wear. The
                  segments run edge to edge with no gutter between stations, so
                  four of them meet as one continuous rail through the moons. */}
              <span className="bc-crown">
                <span className="bc-rule bc-rule--l" aria-hidden="true" />
                <RailMoon level={l} />
                <span className="bc-rule bc-rule--r" aria-hidden="true" />
              </span>

              <span className="bc-station-name">{l.name}</span>
              <span className="mono bc-station-sub">{l.subtitle}</span>
              <span className="mono bc-station-phase">{l.phaseLabel}</span>
            </button>
          );
        })}
      </div>

      {/* The reconciliation, printed once and directly under the moons it
          explains: four locations, three acts. */}
      <p className="bc-structure">{beatStructureNote}</p>

      {/* 2a — the matrix, wide screens. A real table: the dimension is the row
          header, the level is the column header, and every cell is announced
          with both. */}
      <div className="bc-scroll">
        <table className="bc-matrix">
          <caption className="bc-sr">
            Level design beat chart. Rows are design dimensions, columns are the four levels in
            play order.
          </caption>
          <thead>
            <tr>
              <td className="bc-corner" />
              {beatLevels.map((l) => (
                <th
                  key={l.id}
                  scope="col"
                  className={`bc-colhead${l.id === selected ? " is-active" : ""}`}
                >
                  <button
                    type="button"
                    className="bc-colbtn"
                    aria-pressed={l.id === selected}
                    onClick={() => setSelected(l.id)}
                  >
                    <span className="bc-colbtn-name">{l.name}</span>
                    <span className="mono bc-colbtn-sub">{l.phaseLabel}</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {beatDimensions.map((dim) => (
              <tr key={dim.id} className={dim.id === "boss" ? "is-boss" : undefined}>
                <th scope="row" className="mono bc-rowhead">
                  {dim.label}
                </th>
                {beatLevels.map((l) => {
                  const value = l.cells[dim.id];
                  return (
                    <td
                      key={l.id}
                      className={`bc-cell${l.id === selected ? " is-active" : ""}`}
                    >
                      {value === null ? (
                        <Blank />
                      ) : (
                        <>
                          {value}
                          {dim.id === "boss" && l.finalBoss && (
                            <span className="mono bc-final">Final</span>
                          )}
                        </>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 2b — the matrix, narrow screens. Same nine dimensions, one level per
          card. Not interactive: the rail above is still on screen and is the
          only selector, so a phone gets one control surface, not two. */}
      <ul className="bc-cards">
        {beatLevels.map((l) => (
          <li
            key={l.id}
            className={`panel bc-card${l.id === selected ? " is-active" : ""}`}
          >
            <div className="bc-card-head">
              <MoonPhaseGlyph
                phase={l.phase}
                className="bc-card-moon"
                discClassName="bc-moon-disc"
                litClassName="bc-moon-lit"
              />
              <div className="bc-card-id">
                <p className="mono bc-card-ord">
                  {l.ordinal} · {l.stageLabel} · {l.phaseLabel}
                </p>
                <h4 className="bc-card-name">{l.name}</h4>
              </div>
            </div>
            <dl className="bc-card-dl">
              {beatDimensions.map((dim) => (
                <div
                  key={dim.id}
                  className={`bc-card-row${dim.id === "boss" ? " is-boss" : ""}`}
                >
                  <dt className="mono bc-card-key">{dim.label}</dt>
                  <dd className="bc-card-val">
                    {l.cells[dim.id] === null ? (
                      <Blank />
                    ) : (
                      <>
                        {l.cells[dim.id]}
                        {dim.id === "boss" && l.finalBoss && (
                          <span className="mono bc-final">Final</span>
                        )}
                      </>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>

      {/* 3 — the design sheet for the selected level */}
      <div
        className="panel bc-sheet"
        id="bc-sheet"
        role="tabpanel"
        aria-labelledby={`bc-tab-${level.id}`}
        tabIndex={0}
      >
        <div className="bc-sheet-head">
          <MoonPhaseGlyph
            phase={level.phase}
            className="bc-sheet-moon"
            discClassName="bc-moon-disc"
            litClassName="bc-moon-lit"
          />
          <div className="bc-sheet-id">
            <p className="mono bc-sheet-kicker">
              {level.ordinal} · {level.stageLabel} · {level.phaseLabel}
            </p>
            <h4 className="bc-sheet-name">{level.name}</h4>
            <p className="mono bc-sheet-sub">{level.subtitle}</p>
          </div>
        </div>

        {/* The payoff line. First, because it is the only sentence in the whole
            artifact that argues rather than lists. */}
        <p className="bc-cohesion">{level.cohesion}</p>

        <div className="bc-groups">
          {SHEET_GROUPS.map((group) => {
            /* Blanks are dashed in the matrix, where the column has to keep
               its alignment, and simply absent here, where nothing lines up
               and an empty row would just be noise. */
            const rows = group.dims.filter((d) => level.cells[d.id] !== null);
            if (rows.length === 0) return null;
            return (
              <section key={group.id} className={`bc-group is-${group.id}`}>
                <h5 className="mono bc-group-title">{group.label}</h5>
                <dl className="bc-group-dl">
                  {rows.map((dim) => (
                    <div key={dim.id} className="bc-group-row">
                      <dt className="mono bc-group-key">{dim.label}</dt>
                      <dd className="bc-group-val">
                        {level.cells[dim.id]}
                        {dim.id === "boss" && level.finalBoss && (
                          <span className="mono bc-final">Final</span>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            );
          })}
        </div>
      </div>

      {/* 4 — the arc */}
      <figure className="bc-arc">
        <figcaption className="mono bc-arc-caption">{arcCaption}</figcaption>
        <ol className="bc-arc-line">
          {beatLevels.map((l, i) => (
            <li key={l.id} className={`bc-arc-beat${l.id === selected ? " is-active" : ""}`}>
              <span className="mono bc-arc-name">{l.name}</span>
              <span className="bc-arc-phrase">{l.arc}</span>
              {i < beatLevels.length - 1 && (
                <span className="bc-arc-join" aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>
      </figure>

      <style>{`
        .bc {
          /* The page's established inks. --bc-quiet is 6.3:1 on the panel, so
             every small mono label in here clears AA as text; the emerald and
             scarlet are both unusable raw (3.4:1 and 2:1) and are mixed toward
             moonlight until they do. */
          --bc-quiet: #93A0B3;
          --bc-hair: color-mix(in srgb, var(--color-gold) 24%, transparent);
          --bc-edge: color-mix(in srgb, var(--color-mist) 26%, transparent);
          --bc-blood-ink: color-mix(in srgb, var(--color-scarlet) 55%, var(--color-moonlight));
          --bc-leaf-ink: color-mix(in srgb, var(--color-emerald) 55%, var(--color-moonlight));
          --bc-wash: color-mix(in srgb, var(--color-silver) 7%, transparent);

          display: grid;
          gap: 2.25rem;
        }

        .bc-sr {
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

        .bc-thesis {
          margin: 0;
          font-family: var(--font-body);
          font-size: 1rem;
          line-height: 1.7;
          color: var(--color-moonlight);
          max-width: 46rem;
        }

        /* ---- 1 · the moon rail --------------------------------------------
           Four equal columns, NO gap: each station carries its own half of the
           rail out to its own edges, so the segments abut and the line reads
           as continuous. Horizontal padding therefore lives on the text, never
           on the button. */
        .bc-rail {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0;
          border-top: 1px solid var(--bc-edge);
          border-bottom: 1px solid var(--bc-edge);
          background: color-mix(in srgb, var(--color-nightfall) 55%, transparent);
        }

        .bc-station {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          border: 0;
          border-radius: 0;
          padding: 1rem 0 1.1rem;
          margin: 0;
          font: inherit;
          color: inherit;
          text-align: center;
          cursor: pointer;
          min-width: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
          transition: background-color 220ms ease;
        }
        .bc-station:hover { background: color-mix(in srgb, var(--color-silver) 4%, transparent); }
        .bc-station.is-selected { background: var(--bc-wash); }
        .bc-station:focus-visible {
          outline: 2px solid var(--color-lunar-gold);
          outline-offset: -3px;
        }

        .bc-station-ord,
        .bc-station-name,
        .bc-station-sub,
        .bc-station-phase { padding-inline: 0.5rem; }

        /* Ordinal and act stamp on one line: the level number the chart
           counts in, and the narrative slot it fills. Centralis reads
           "Level 01 · Prologue", which is the whole resolution in four
           words. */
        .bc-station-ord {
          display: flex;
          justify-content: center;
          align-items: baseline;
          gap: 0.45rem;
          font-size: 0.70rem;
          color: var(--color-gold);
          letter-spacing: 0.08em;
        }
        .bc-station-stage {
          color: var(--bc-quiet);
          letter-spacing: 0.06em;
        }

        /* Sits between the rail and the matrix, at note weight: it explains
           the rail rather than competing with the thesis above it. */
        .bc-structure {
          margin: -0.9rem 0 0;
          padding-left: 0.9rem;
          border-left: 1px solid var(--bc-hair);
          font-family: var(--font-body);
          font-size: 0.85rem;
          line-height: 1.6;
          color: var(--bc-quiet);
          max-width: 46rem;
        }

        /* The rail itself. Each segment brightens with the step, so the line
           waxes along with the moons rather than sitting at one weight — the
           progression is legible even with the discs out of focus. */
        .bc-crown {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0;
          margin: 0.25rem 0 0.35rem;
        }
        .bc-rule {
          flex: 1 1 auto;
          height: 1px;
          min-width: 0;
          background: var(--bc-rail);
        }
        .bc-station[data-step="0"] { --bc-rail: color-mix(in srgb, var(--color-silver) 16%, transparent); }
        .bc-station[data-step="1"] { --bc-rail: color-mix(in srgb, var(--color-silver) 26%, transparent); }
        .bc-station[data-step="2"] { --bc-rail: color-mix(in srgb, var(--color-silver) 38%, transparent); }
        .bc-station[data-step="3"] { --bc-rail: color-mix(in srgb, var(--color-silver) 52%, transparent); }
        /* The line starts at the first moon and stops at the last: it is the
           span of the game, not an arrow pointing off the edge of it. */
        .bc-station[data-step="0"] .bc-rule--l,
        .bc-station[data-step="3"] .bc-rule--r { background: transparent; }

        .bc-orb {
          position: relative;
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          margin: 0 0.5rem;
        }
        .bc-halo {
          position: absolute;
          inset: -0.85rem;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            color-mix(in srgb, var(--color-silver) 34%, transparent) 0%,
            color-mix(in srgb, var(--color-silver) 10%, transparent) 45%,
            transparent 70%
          );
          opacity: 0;
          transition: opacity 260ms ease;
          pointer-events: none;
        }
        /* The full moon is lit before it is chosen — it is where the whole
           chart is heading. Selection takes it the rest of the way. */
        .bc-station.is-final .bc-halo { opacity: 0.42; }
        .bc-station.is-selected .bc-halo { opacity: 1; }

        .bc-moon { width: 2.5rem; height: 2.5rem; display: block; position: relative; }
        .bc-moon-disc {
          fill: color-mix(in srgb, var(--color-void) 70%, transparent);
          stroke: color-mix(in srgb, var(--color-silver) 34%, transparent);
          stroke-width: 1;
        }
        .bc-moon-lit { fill: var(--color-silver); }

        .bc-station-name {
          font-family: var(--font-hero), var(--font-display), serif;
          font-size: 1.05rem;
          font-weight: 600;
          letter-spacing: 0.03em;
          line-height: 1.25;
          color: var(--color-moonlight);
        }
        .bc-station-sub {
          font-size: 0.70rem;
          line-height: 1.45;
          color: var(--bc-quiet);
        }
        .bc-station-phase {
          font-size: 0.68rem;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: color-mix(in srgb, var(--color-silver) 62%, var(--bc-quiet));
        }

        /* ---- 2a · the matrix ---------------------------------------------- */
        .bc-scroll {
          overflow-x: auto;
          /* The scroller must never be what clips the focus ring on a column
             button, so the table is inset from its own edges. */
          padding: 3px;
          margin: -3px;
        }
        .bc-matrix {
          width: 100%;
          /* Sized so the table still fits un-scrolled at the width the cards
             take over, which means the scroller is a safety net for large
             font settings rather than a normal reading mode. */
          min-width: 48rem;
          border-collapse: collapse;
          table-layout: fixed;
        }
        .bc-corner {
          width: 8.5rem;
          border: 0;
          padding: 0;
        }

        .bc-colhead {
          width: auto;
          padding: 0;
          vertical-align: bottom;
          border-bottom: 1px solid var(--bc-hair);
        }
        .bc-colhead.is-active { border-bottom-color: var(--color-gold); }
        .bc-colbtn {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          background: transparent;
          border: 0;
          margin: 0;
          padding: 0.55rem 0.7rem 0.6rem;
          font: inherit;
          text-align: left;
          cursor: pointer;
          display: grid;
          gap: 0.12rem;
          transition: background-color 200ms ease;
        }
        .bc-colbtn:hover { background: color-mix(in srgb, var(--color-silver) 5%, transparent); }
        .bc-colhead.is-active .bc-colbtn { background: var(--bc-wash); }
        .bc-colbtn:focus-visible {
          outline: 2px solid var(--color-lunar-gold);
          outline-offset: -2px;
        }
        .bc-colbtn-name {
          font-family: var(--font-hero), var(--font-display), serif;
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: var(--color-moonlight);
        }
        .bc-colbtn-sub {
          font-size: 0.68rem;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: var(--bc-quiet);
        }

        .bc-rowhead {
          text-align: left;
          vertical-align: top;
          font-size: 0.70rem;
          font-weight: 400;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: var(--color-gold);
          padding: 0.6rem 1rem 0.6rem 0;
          border-bottom: 1px solid var(--bc-edge);
          white-space: nowrap;
        }
        .bc-cell {
          vertical-align: top;
          padding: 0.6rem 0.7rem;
          font-family: var(--font-body);
          font-size: 0.82rem;
          line-height: 1.5;
          color: var(--color-moonlight);
          border-bottom: 1px solid var(--bc-edge);
          border-left: 1px solid var(--bc-edge);
        }
        .bc-cell.is-active { background: var(--bc-wash); }
        .bc-blank { color: var(--bc-quiet); }

        /* The boss row is the only row where one cell is a whole encounter, so
             it gets the weight — a blood rule above it and silver ink in it. */
        .bc-matrix tr.is-boss .bc-rowhead {
          color: var(--bc-blood-ink);
          border-top: 1px solid color-mix(in srgb, var(--color-scarlet) 60%, transparent);
        }
        .bc-matrix tr.is-boss .bc-cell {
          color: var(--color-moonlight);
          font-family: var(--font-hero), var(--font-display), serif;
          font-size: 0.95rem;
          letter-spacing: 0.02em;
          border-top: 1px solid color-mix(in srgb, var(--color-scarlet) 60%, transparent);
          background: color-mix(in srgb, var(--color-scarlet) 7%, transparent);
        }
        .bc-matrix tr.is-boss .bc-cell.is-active {
          background: color-mix(in srgb, var(--color-scarlet) 13%, transparent);
        }

        .bc-final {
          display: inline-block;
          margin-left: 0.45rem;
          padding: 0.08rem 0.35rem;
          font-size: 0.68rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--bc-blood-ink);
          border: 1px solid color-mix(in srgb, var(--color-scarlet) 62%, transparent);
          vertical-align: 0.12em;
          white-space: nowrap;
        }

        /* ---- 2b · the matrix as cards (narrow) ---------------------------- */
        .bc-cards { display: none; }

        /* ---- 3 · the design sheet ----------------------------------------- */
        .bc-sheet {
          border: 1px solid var(--bc-edge);
          border-left: 3px solid color-mix(in srgb, var(--color-silver) 55%, transparent);
          padding: 1.3rem 1.4rem 1.4rem;
          display: grid;
          gap: 1rem;
        }
        .bc-sheet:focus-visible {
          outline: 2px solid var(--color-lunar-gold);
          outline-offset: 3px;
        }
        .bc-sheet-head {
          display: flex;
          align-items: center;
          gap: 0.9rem;
        }
        .bc-sheet-moon { width: 2.1rem; height: 2.1rem; flex: 0 0 auto; }
        .bc-sheet-id { min-width: 0; }
        .bc-sheet-kicker {
          margin: 0;
          font-size: 0.70rem;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: var(--color-gold);
        }
        .bc-sheet-name {
          font-family: var(--font-hero), var(--font-display), serif;
          font-size: 1.35rem;
          font-weight: 600;
          letter-spacing: 0.03em;
          margin: 0.15rem 0 0;
          color: var(--color-moonlight);
        }
        .bc-sheet-sub {
          margin: 0.2rem 0 0;
          font-size: 0.70rem;
          color: var(--bc-quiet);
        }

        .bc-cohesion {
          margin: 0;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--bc-hair);
          font-family: var(--font-body);
          font-size: 0.98rem;
          line-height: 1.7;
          color: var(--color-silver);
          max-width: 48rem;
        }

        .bc-groups {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
          gap: 1.2rem 1.8rem;
        }
        .bc-group { min-width: 0; }
        .bc-group-title {
          margin: 0 0 0.6rem;
          padding-bottom: 0.35rem;
          font-size: 0.70rem;
          font-weight: 400;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--bc-quiet);
          border-bottom: 1px solid var(--bc-edge);
        }
        /* One accent each, so the three passes are told apart at a glance:
           emerald for the place, blood for what is in it, silver for the feel. */
        .bc-group.is-space-goal .bc-group-title { color: var(--bc-leaf-ink); }
        .bc-group.is-cast-threat .bc-group-title { color: var(--bc-blood-ink); }
        .bc-group.is-mood .bc-group-title { color: var(--color-silver); }

        .bc-group-dl { margin: 0; display: grid; gap: 0.55rem; }
        .bc-group-row { min-width: 0; }
        .bc-group-key {
          font-size: 0.68rem;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: var(--color-gold);
        }
        .bc-group-val {
          margin: 0.15rem 0 0;
          font-family: var(--font-body);
          font-size: 0.88rem;
          line-height: 1.55;
          color: var(--color-moonlight);
        }

        /* ---- 4 · the arc --------------------------------------------------- */
        .bc-arc { margin: 0; }
        .bc-arc-caption {
          margin: 0 0 0.75rem;
          font-size: 0.70rem;
          letter-spacing: 0.07em;
          color: var(--color-gold);
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--bc-hair);
        }
        .bc-arc-line {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0;
        }
        .bc-arc-beat {
          position: relative;
          min-width: 0;
          padding: 0.65rem 1.6rem 0.7rem 0;
          display: grid;
          gap: 0.25rem;
          align-content: start;
          transition: opacity 220ms ease;
          /* The floor, not a taste call: the arc's own mono name is 0.55rem,
             and dimming it any further than this takes it under 4.5:1 against
             the void. The selected beat is told apart by its gold name as well
             as by weight, so the dim never has to do the work alone. */
          opacity: 0.78;
        }
        .bc-arc-beat.is-active { opacity: 1; }
        .bc-arc-name {
          font-size: 0.68rem;
          letter-spacing: 0.11em;
          text-transform: uppercase;
          color: var(--bc-quiet);
        }
        .bc-arc-beat.is-active .bc-arc-name { color: var(--color-gold); }
        .bc-arc-phrase {
          font-family: var(--font-body);
          font-size: 0.92rem;
          line-height: 1.5;
          color: var(--color-moonlight);
        }
        /* The joins are drawn, not typed: a chevron built from two borders,
           which rotates to point down when the arc stacks. */
        .bc-arc-join {
          position: absolute;
          top: 1.55rem;
          right: 0.7rem;
          width: 0.4rem;
          height: 0.4rem;
          border-top: 1px solid var(--bc-hair);
          border-right: 1px solid var(--bc-hair);
          transform: rotate(45deg);
        }

        /* ---- responsive ----------------------------------------------------
           Two moves, at two widths. At 1000px the arc goes to two columns
           because four phrases stop fitting on one line long before the rail
           does. At 820px the table hands over to the cards and the rail
           becomes a two-by-two grid of stations rather than a rail that has
           been squeezed until the moons touch. */
        @media (max-width: 1000px) {
          .bc-arc-line { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          /* The join after the second beat would point off the row's edge. */
          .bc-arc-beat:nth-child(2) .bc-arc-join { transform: rotate(135deg); right: auto; left: 0.1rem; top: auto; bottom: -0.35rem; }
        }

        @media (max-width: 820px) {
          .bc-scroll { display: none; }

          .bc-cards {
            display: grid;
            list-style: none;
            margin: 0;
            padding: 0;
            gap: 0.9rem;
          }
          .bc-card {
            border: 1px solid var(--bc-edge);
            border-left: 3px solid color-mix(in srgb, var(--color-silver) 22%, transparent);
            padding: 1rem 1.05rem 1.1rem;
            transition: border-color 220ms ease;
          }
          /* The wash is added as a background LAYER rather than through the
             background shorthand, which would drop the .panel rule's own
             gradient and void base and leave the card sitting on the page. */
          .bc-card.is-active {
            border-left-color: color-mix(in srgb, var(--color-silver) 70%, transparent);
            background-image:
              linear-gradient(var(--bc-wash), var(--bc-wash)),
              linear-gradient(145deg, color-mix(in srgb, var(--color-silver) 4%, transparent), transparent 38%);
          }
          .bc-card-head {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding-bottom: 0.75rem;
            border-bottom: 1px solid var(--bc-hair);
          }
          .bc-card-moon { width: 1.75rem; height: 1.75rem; flex: 0 0 auto; }
          .bc-card-id { min-width: 0; }
          .bc-card-ord {
            margin: 0;
            font-size: 0.68rem;
            letter-spacing: 0.09em;
            text-transform: uppercase;
            color: var(--color-gold);
          }
          .bc-card-name {
            font-family: var(--font-hero), var(--font-display), serif;
            font-size: 1.1rem;
            font-weight: 600;
            letter-spacing: 0.03em;
            margin: 0.15rem 0 0;
            color: var(--color-moonlight);
          }
          .bc-card-dl { margin: 0.8rem 0 0; display: grid; gap: 0.5rem; }
          /* Label beside value while there is room for it; the label column is
             fixed so nine rows line up as a chart rather than nine paragraphs. */
          .bc-card-row {
            display: grid;
            grid-template-columns: 5.6rem minmax(0, 1fr);
            gap: 0.2rem 0.75rem;
            align-items: baseline;
          }
          .bc-card-key {
            font-size: 0.68rem;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: var(--color-gold);
            line-height: 1.45;
          }
          .bc-card-val {
            margin: 0;
            font-family: var(--font-body);
            font-size: 0.86rem;
            line-height: 1.5;
            color: var(--color-moonlight);
          }
          .bc-card-row.is-boss .bc-card-key { color: var(--bc-blood-ink); }
          .bc-card-row.is-boss .bc-card-val {
            font-family: var(--font-hero), var(--font-display), serif;
            font-size: 0.98rem;
            letter-spacing: 0.02em;
          }

          .bc-rail { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          /* Stacked two-up, a rail through the moons would be a lie about the
             reading order, so the segments come off and each station keeps
             only its moon. */
          .bc-rule { display: none; }
          .bc-station { padding: 0.9rem 0 1rem; border-bottom: 1px solid var(--bc-edge); }
          .bc-station[data-step="2"],
          .bc-station[data-step="3"] { border-bottom: 0; }
          .bc-station[data-step="0"],
          .bc-station[data-step="2"] { border-right: 1px solid var(--bc-edge); }

          .bc-sheet { padding: 1.1rem 1.1rem 1.2rem; }
        }

        @media (max-width: 560px) {
          .bc-arc-line { grid-template-columns: minmax(0, 1fr); }
          .bc-arc-beat { padding: 0.55rem 0 0.9rem; }
          /* Matched to the two-column rule's specificity so the second beat's
             join is re-placed with the rest rather than keeping its corner. */
          .bc-arc-line .bc-arc-beat .bc-arc-join {
            top: auto;
            bottom: 0.05rem;
            left: 0.1rem;
            right: auto;
            transform: rotate(135deg);
          }
          .bc-card-row { grid-template-columns: minmax(0, 1fr); }
          .bc-station-name { font-size: 0.95rem; }
        }

        @media (max-width: 400px) {
          .bc-rail { grid-template-columns: minmax(0, 1fr); }
          .bc-station { border-right: 0 !important; border-bottom: 1px solid var(--bc-edge); }
          .bc-station[data-step="3"] { border-bottom: 0; }
        }

        /* Nothing here needs to move to be understood: the halo, the washes
           and the arc's dimming are all readable as static states. */
        @media (prefers-reduced-motion: reduce) {
          .bc-station,
          .bc-halo,
          .bc-colbtn,
          .bc-card,
          .bc-arc-beat { transition: none; }
        }
      `}</style>
    </div>
  );
}

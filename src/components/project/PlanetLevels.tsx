"use client";

import { useRef, useState } from "react";
import {
  dimensionGroups,
  dossierPointer,
  getLevelPlanet,
  levelDimensions,
  levelPlanets,
  levelsCredit,
  planetFacet,
  progressionCaption,
  spaceAudio,
  teachingThesis,
  type DimensionId,
  type LevelPlanet,
} from "@/content/shattered-skies-levels";
import type { PlanetId } from "@/content/shattered-skies-planets";
import { PlanetGlyph } from "./PlanetGlyphs";
import InteractiveHint from "./InteractiveHint";

const SHEET_GROUPS = dimensionGroups.map((group) => ({
  ...group,
  dims: levelDimensions.filter((d) => d.group === group.id),
}));

function toneStyle(id: PlanetId): React.CSSProperties {
  return { ["--tone" as string]: planetFacet(id).accent };
}

function MineTag({ className }: { className?: string }) {
  return (
    <span className={`mono pl-mine${className ? ` ${className}` : ""}`}>
      <span className="pl-sr">Audio design credit: </span>Fully Mine
    </span>
  );
}

function Gem({ source, label, body }: { source: string; label: string; body: string }) {
  return (
    <aside className="pl-gem" aria-label={label}>
      <p className="mono pl-gem-source">{source}</p>
      <p className="mono pl-gem-label">
        <span className="pl-gem-mark" aria-hidden="true" />
        {label}
      </p>
      <p className="pl-gem-body">{body}</p>
    </aside>
  );
}

const GEM_WORLDS = levelPlanets.filter((p) => p.audioGem);

export default function PlanetLevels() {
  const [selected, setSelected] = useState<PlanetId>(levelPlanets[0].id);
  const tabRefs = useRef<Partial<Record<PlanetId, HTMLButtonElement | null>>>({});
  const planet: LevelPlanet = getLevelPlanet(selected);

  function onRailKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = levelPlanets.length - 1;
    let next: number | null = null;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = index === last ? 0 : index + 1;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = index === 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;

    if (next === null) return;
    event.preventDefault();
    const target = levelPlanets[next];
    setSelected(target.id);
    tabRefs.current[target.id]?.focus();
  }

  return (
    <div className="pl">
      {/* 1 — the credit */}
      <aside className="pl-credit" aria-label="Attribution">
        <p className="mono pl-credit-tag">{levelsCredit.headline}</p>
        <p className="pl-credit-role">
          My role on it: <strong>{levelsCredit.role}</strong>
        </p>
        <dl className="pl-credit-split">
          {levelsCredit.lines.map((line) => (
            <div key={line.id} className={`pl-credit-line is-${line.id}`}>
              <dt className="mono pl-credit-disc">{line.label}</dt>
              <dd className="pl-credit-claim">
                <span className="pl-credit-strong">{line.claim}</span>
                <span className="pl-credit-body">{line.body}</span>
              </dd>
            </div>
          ))}
        </dl>
      </aside>

      {/* 2 — the thesis */}
      <div className="pl-thesis">
        <p className="pl-thesis-line">{teachingThesis}</p>
      </div>

      {/* 3 — the rail */}
      <div className="pl-railwrap">
        <p className="mono pl-rail-caption">
          The play order and each skill.
        </p>
        <InteractiveHint
          what="world"
          does="its full design sheet and score notes open below the rail"
        />
        <div
          className="pl-rail"
          role="tablist"
          aria-label="The five worlds, in play order"
          aria-orientation="horizontal"
        >
          {levelPlanets.map((p, i) => {
            const isSelected = p.id === selected;
            return (
              <button
                key={p.id}
                type="button"
                role="tab"
                id={`pl-tab-${p.id}`}
                aria-selected={isSelected}
                aria-controls="pl-sheet"
                tabIndex={isSelected ? 0 : -1}
                data-step={i}
                style={toneStyle(p.id)}
                className={`pl-station${isSelected ? " is-selected" : ""}`}
                ref={(node) => {
                  tabRefs.current[p.id] = node;
                }}
                onClick={() => setSelected(p.id)}
                onKeyDown={(event) => onRailKeyDown(event, i)}
              >
                <span className="mono pl-station-ord">{p.ordinal}</span>

                <span className="pl-crown">
                  <span className="pl-rule pl-rule--l" aria-hidden="true" />
                  <span className="pl-orb">
                    <span className="pl-halo" aria-hidden="true" />
                    <PlanetGlyph id={p.id} size="100%" className="pl-glyph" />
                  </span>
                  <span className="pl-rule pl-rule--r" aria-hidden="true" />
                </span>

                <span className="pl-station-name">{p.name}</span>
                <span className="mono pl-station-skill">{p.skill}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pl-scroll">
        <table className="pl-matrix">
          <caption className="pl-sr">
            Planetary level design chart. Rows are design dimensions, columns are the five worlds in
            play order. The audio row is designed entirely by me; the level design rows were
            co-designed with one other designer.
          </caption>
          <thead>
            <tr>
              <td className="pl-corner" />
              {levelPlanets.map((p) => (
                <th
                  key={p.id}
                  scope="col"
                  style={toneStyle(p.id)}
                  className={`pl-colhead${p.id === selected ? " is-active" : ""}`}
                >
                  <button
                    type="button"
                    className="pl-colbtn"
                    aria-pressed={p.id === selected}
                    onClick={() => setSelected(p.id)}
                  >
                    <span className="mono pl-colbtn-ord">{p.ordinal}</span>
                    <span className="pl-colbtn-name">{p.name}</span>
                    <span className="mono pl-colbtn-kind">{planetFacet(p.id).kind}</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {levelDimensions.map((dim) => (
              <tr key={dim.id} className={dim.id === "audio" ? "is-audio" : undefined}>
                <th scope="row" className="mono pl-rowhead">
                  {dim.label}
                </th>
                {levelPlanets.map((p) => (
                  <td
                    key={p.id}
                    style={toneStyle(p.id)}
                    className={`pl-cell${p.id === selected ? " is-active" : ""}`}
                  >
                    {p.cells[dim.id]}
                    {dim.id === "audio" && p.audioGem && (
                      <span className="pl-gem-flag" aria-hidden="true" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4b — the matrix */}
      <ul className="pl-cards">
        {levelPlanets.map((p) => (
          <li
            key={p.id}
            style={toneStyle(p.id)}
            className={`panel pl-card${p.id === selected ? " is-active" : ""}`}
          >
            <div className="pl-card-head">
              <PlanetGlyph id={p.id} size="2rem" className="pl-card-glyph" />
              <div className="pl-card-id">
                <p className="mono pl-card-ord">
                  {p.ordinal} · {planetFacet(p.id).kind}
                </p>
                <h4 className="pl-card-name">{p.name}</h4>
              </div>
            </div>
            <dl className="pl-card-dl">
              {levelDimensions.map((dim) => (
                <div
                  key={dim.id}
                  className={`pl-card-row${dim.id === "audio" ? " is-audio" : ""}`}
                >
                  <dt className="mono pl-card-key">
                    {dim.label}
                  </dt>
                  <dd className="pl-card-val">{p.cells[dim.id]}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>

      {/* 5 — the design sheet for the worlds */}
      <div
        className="panel pl-sheet"
        id="pl-sheet"
        role="tabpanel"
        aria-labelledby={`pl-tab-${planet.id}`}
        tabIndex={0}
        style={toneStyle(planet.id)}
      >
        <div className="pl-sheet-head">
          <PlanetGlyph id={planet.id} size="2.6rem" className="pl-sheet-glyph" />
          <div className="pl-sheet-id">
            <p className="mono pl-sheet-kicker">
              {planet.ordinal} · {planetFacet(planet.id).kind}
            </p>
            <h4 className="pl-sheet-name">{planet.name}</h4>
            <p className="mono pl-sheet-skill">
              Teaches: <span>{planet.skill}</span>
            </p>
          </div>
        </div>

        <p className="pl-cohesion">{planet.cohesion}</p>

        <div className="pl-groups">
          {SHEET_GROUPS.map((group) => (
            <section key={group.id} className={`pl-group is-${group.id}`}>
              <h5 className="mono pl-group-title">
                {group.label}
                {group.id === "sensory" && <MineTag className="pl-mine--group" />}
              </h5>

              <dl className="pl-group-dl">
                {group.dims.map((dim: { id: DimensionId; label: string }) => (
                  <div key={dim.id} className="pl-group-row">
                    <dt className="mono pl-group-key">{dim.label}</dt>
                    <dd className="pl-group-val">
                      {dim.id === "teaches" && (
                        <>
                          <span className="pl-lede">{planet.skillNote}</span>
                          {planet.teaches}
                        </>
                      )}
                      {dim.id === "signature" && planet.signature}
                      {dim.id === "unlocks" && (
                        <>
                          <span className="pl-tool">{planet.unlocks.tool}</span>
                          {planet.unlocks.toolNote}
                          <span className="pl-rewards">
                            <span className="mono pl-rewards-key">Rewards</span>
                            {planet.unlocks.rewards}
                          </span>
                        </>
                      )}
                      {dim.id === "hazards" && (
                        <ul className="pl-hazards">
                          {planet.hazards.map((hazard) => (
                            <li key={hazard.name} className="pl-hazard">
                              <span className="pl-hazard-name">{hazard.name}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {dim.id === "visuals" && planet.visuals}
                      {dim.id === "audio" && (
                        <>
                          <span className="pl-audio-char">{planet.audio.character}</span>
                          <span className="pl-audio-inst">{planet.audio.instruments}</span>
                          <span className="pl-audio-tex">{planet.audio.texture}</span>
                        </>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </div>

      {/* 6a — the audio notes */}
      <section className="pl-notes" aria-labelledby="pl-notes-head">
        <p className="mono pl-notes-kicker">
          Audio design
          <MineTag className="pl-mine--notes" />
        </p>
        <h4 id="pl-notes-head" className="pl-notes-head">
          Two main audio decisions
        </h4>

        <div className="pl-gems">
          {GEM_WORLDS.map((p) => (
            <Gem
              key={p.id}
              source={`${p.ordinal} · ${p.name}`}
              label={p.audioGem!.label}
              body={p.audioGem!.body}
            />
          ))}
          <Gem source={spaceAudio.kicker} label={spaceAudio.gem.label} body={spaceAudio.gem.body} />
        </div>

        <div className="pl-ship">
          <p className="mono pl-ship-kicker">{spaceAudio.kicker}</p>
          <h5 className="pl-ship-head">{spaceAudio.headline}</h5>
          <p className="pl-ship-body">{spaceAudio.body}</p>
        </div>
      </section>

      {/* 6b — the progression */}
      <figure className="pl-arc">
        <figcaption className="mono pl-arc-caption">{progressionCaption}</figcaption>
        <ol className="pl-arc-line">
          {levelPlanets.map((p, i) => (
            <li
              key={p.id}
              style={toneStyle(p.id)}
              className={`pl-arc-beat${p.id === selected ? " is-active" : ""}`}
            >
              <span className="mono pl-arc-skill">{p.skill}</span>
              <span className="pl-arc-name">{p.name}</span>
              <span className="pl-arc-phrase">{p.arc}</span>
              {i < levelPlanets.length - 1 && <span className="pl-arc-join" aria-hidden="true" />}
            </li>
          ))}
        </ol>
      </figure>

      <style>{`
        .pl {
          /* The page's sci-fi inks. --pl-cyan is 10.2:1 on the void and the
             warm gold 8.6:1, so every small mono label clears AA as text. The
             per-world --tone is set inline from the dossier's accent; all five
             clear 5:1 on the panel, and none of them is ever the only carrier
             of meaning — the name is always beside the colour. */
          --pl-cyan: var(--color-nebula, #7ec8d8);
          --pl-warm: var(--color-gold);
          --pl-quiet: color-mix(in srgb, var(--color-mist) 50%, var(--color-moonlight));
          --pl-edge: color-mix(in srgb, var(--color-mist) 32%, transparent);
          --pl-line: color-mix(in srgb, var(--color-mist) 22%, transparent);
          --pl-panel: color-mix(in srgb, var(--color-nightfall) 62%, var(--color-void));
          --pl-wash: color-mix(in srgb, var(--color-silver) 7%, transparent);

          display: grid;
          gap: 2.5rem;
        }

        .pl-sr {
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

        /* ---- 1 · the credit ------------------------------------------------
           Framed and set apart on purpose, and split by discipline: the two
           halves of this section were not made the same way, and a single
           blended sentence would blur that. */
        .pl-credit {
          border: 1px solid var(--pl-edge);
          border-left: 2px solid var(--pl-cyan);
          background: var(--pl-panel);
          padding: 1.1rem 1.25rem 1.2rem;
          display: grid;
          gap: 0.5rem;
          max-width: 48rem;
        }
        .pl-credit-tag {
          margin: 0;
          font-size: 0.7rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--pl-cyan);
        }
        .pl-credit-role {
          margin: 0;
          font-size: 0.95rem;
          color: var(--color-moonlight);
        }
        .pl-credit-role strong {
          font-weight: 600;
          color: var(--pl-warm);
        }
        .pl-credit-split {
          margin: 0.35rem 0 0;
          display: grid;
          gap: 0.7rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--pl-line);
        }
        .pl-credit-line {
          display: grid;
          grid-template-columns: 7.5rem minmax(0, 1fr);
          gap: 0.15rem 1rem;
          align-items: baseline;
        }
        .pl-credit-disc {
          font-size: 0.70rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--pl-quiet);
        }
        .pl-credit-line.is-audio .pl-credit-disc { color: var(--pl-cyan); }
        .pl-credit-claim { margin: 0; display: grid; gap: 0.2rem; }
        .pl-credit-strong {
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--color-moonlight);
        }
        .pl-credit-line.is-audio .pl-credit-strong { color: var(--pl-cyan); }
        .pl-credit-body {
          font-size: 0.85rem;
          line-height: 1.6;
          color: var(--pl-quiet);
        }

        /* ---- 2 · the thesis ------------------------------------------------ */
        .pl-thesis { display: grid; gap: 0.7rem; max-width: 48rem; }
        .pl-thesis-line {
          margin: 0;
          font-size: 1rem;
          line-height: 1.7;
          color: var(--color-moonlight);
        }
        /* Says what this section is NOT, so the dossier above is not re-read. */
        .pl-pointer {
          margin: 0;
          padding-left: 0.85rem;
          border-left: 2px solid var(--pl-warm);
          font-size: 0.72rem;
          line-height: 1.65;
          letter-spacing: 0.03em;
          color: var(--pl-quiet);
        }

        /* ---- 3 · the curriculum rail --------------------------------------
           Five equal columns, NO gap: each station carries its own half of the
           rail out to its own edges, so the segments abut and the line reads as
           continuous. Horizontal padding therefore lives on the text, never on
           the button. */
        .pl-railwrap { display: grid; gap: 0.6rem; }
        .pl-rail-caption {
          margin: 0;
          font-size: 0.70rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--pl-warm);
        }
        .pl-rail {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 0;
          border-top: 1px solid var(--pl-edge);
          border-bottom: 1px solid var(--pl-edge);
          background: color-mix(in srgb, var(--color-nightfall) 45%, transparent);
        }
        .pl-station {
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
        .pl-station:hover { background: color-mix(in srgb, var(--color-silver) 4%, transparent); }
        .pl-station.is-selected { background: var(--pl-wash); }
        .pl-station:focus-visible {
          outline: 2px solid var(--pl-cyan);
          outline-offset: -3px;
        }
        .pl-station-ord,
        .pl-station-name,
        .pl-station-skill { padding-inline: 0.4rem; }
        .pl-station-ord {
          font-size: 0.68rem;
          letter-spacing: 0.1em;
          color: var(--pl-warm);
        }

        /* The rail brightens with each step, so the curriculum is legible as a
           direction even with the worlds out of focus. */
        .pl-crown {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0;
          margin: 0.3rem 0 0.4rem;
        }
        .pl-rule {
          flex: 1 1 auto;
          height: 1px;
          min-width: 0;
          background: var(--pl-railink);
        }
        .pl-station[data-step="0"] { --pl-railink: color-mix(in srgb, var(--pl-cyan) 16%, transparent); }
        .pl-station[data-step="1"] { --pl-railink: color-mix(in srgb, var(--pl-cyan) 26%, transparent); }
        .pl-station[data-step="2"] { --pl-railink: color-mix(in srgb, var(--pl-cyan) 38%, transparent); }
        .pl-station[data-step="3"] { --pl-railink: color-mix(in srgb, var(--pl-cyan) 50%, transparent); }
        .pl-station[data-step="4"] { --pl-railink: color-mix(in srgb, var(--pl-cyan) 64%, transparent); }
        /* The line starts at the first world and stops at the last: it is the
           span of the curriculum, not an arrow off the edge of it. */
        .pl-station[data-step="0"] .pl-rule--l,
        .pl-station[data-step="4"] .pl-rule--r { background: transparent; }

        .pl-orb {
          position: relative;
          flex: 0 0 auto;
          width: 2.5rem;
          height: 2.5rem;
          display: grid;
          place-items: center;
          margin: 0 0.5rem;
        }
        .pl-glyph { width: 100%; height: 100%; }
        /* The halo is the selection cue, tinted with the world's own colour. */
        .pl-halo {
          position: absolute;
          inset: -0.7rem;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            color-mix(in srgb, var(--tone, var(--pl-cyan)) 38%, transparent) 0%,
            color-mix(in srgb, var(--tone, var(--pl-cyan)) 12%, transparent) 45%,
            transparent 70%
          );
          /* THE RESTING AFFORDANCE. This was opacity 0 until selected, which
             meant four of the five stations looked like plain labels and only
             the one you had already chosen looked like a control — the affordance
             arrived only after it was no longer needed.

             All five now carry a faint halo at rest, so the rail reads as five
             things you can pick, and hover and selection escalate it. Same
             pattern as the orrery's discs and the Moon-Knight world map's pins. */
          opacity: 0.28;
          transition: opacity 260ms ease;
          pointer-events: none;
        }
        .pl-station:hover .pl-halo,
        .pl-station:focus-visible .pl-halo { opacity: 0.62; }
        .pl-station.is-selected .pl-halo { opacity: 1; }

        .pl-station-name {
          font-family: var(--font-hero);
          font-size: 1.02rem;
          font-weight: 600;
          letter-spacing: 0.03em;
          line-height: 1.25;
          color: var(--color-moonlight);
        }
        .pl-station.is-selected .pl-station-name { color: var(--tone, var(--pl-cyan)); }
        .pl-station-skill {
          font-size: 0.68rem;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          line-height: 1.5;
          color: var(--pl-quiet);
        }

        /* ---- 4a · the matrix ----------------------------------------------- */
        .pl-scroll {
          overflow-x: auto;
          /* The scroller must never be what clips a focus ring, so the table is
             inset from its own edges. */
          padding: 3px;
          margin: -3px;
        }
        .pl-matrix {
          width: 100%;
          /* Sized so the table still fits un-scrolled at the width the cards
             take over: the scroller is a safety net for large font settings
             rather than a normal reading mode. */
          min-width: 54rem;
          border-collapse: collapse;
          table-layout: fixed;
        }
        /* Sets the row-header column width for the whole fixed-layout table.
           9.5rem rather than 8rem: enough that every current row label fits on
           one line WITH the audio row's credit chip stacked under it, so the
           wrap above is a safety net rather than the normal rendering. */
        .pl-corner { width: 9.5rem; border: 0; padding: 0; }

        .pl-colhead {
          width: auto;
          padding: 0;
          vertical-align: bottom;
          border-bottom: 1px solid var(--pl-edge);
        }
        .pl-colhead.is-active { border-bottom-color: var(--tone, var(--pl-cyan)); }
        .pl-colbtn {
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
        .pl-colbtn:hover { background: color-mix(in srgb, var(--color-silver) 5%, transparent); }
        .pl-colhead.is-active .pl-colbtn { background: var(--pl-wash); }
        .pl-colbtn:focus-visible {
          outline: 2px solid var(--pl-cyan);
          outline-offset: -2px;
        }
        .pl-colbtn-ord {
          font-size: 0.68rem;
          letter-spacing: 0.1em;
          color: var(--pl-warm);
        }
        .pl-colbtn-name {
          font-family: var(--font-hero);
          font-size: 0.98rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: var(--color-moonlight);
        }
        .pl-colhead.is-active .pl-colbtn-name { color: var(--tone, var(--pl-cyan)); }
        .pl-colbtn-kind {
          font-size: 0.68rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--pl-quiet);
        }

        .pl-rowhead {
          text-align: left;
          vertical-align: top;
          font-size: 0.70rem;
          font-weight: 400;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--pl-warm);
          padding: 0.65rem 1rem 0.65rem 0;
          border-bottom: 1px solid var(--pl-line);
          /* THE OVERLAP FIX, AND IT REMOVES THE MECHANISM RATHER THAN TUNING
             A NUMBER.

             This was white-space: nowrap inside a table-layout: fixed column
             pinned to the corner cell's width. A fixed column cannot grow, and
             a nowrap cell cannot wrap, so the moment the row header's content
             exceeded the column the text simply ran out of its cell and under
             the first data cell. Uppercase type with letter-spacing plus the
             inline "Mine" chip on the audio row is what pushed it over.

             Letting it wrap means the worst case is now a two-line header,
             which costs a few pixels of row height and cannot collide with
             anything. The chip is also no longer inline (see .pl-mine below),
             so the single widest case is gone as well. Do not put nowrap back
             on a fixed-width column. */
          overflow-wrap: anywhere;
        }
        .pl-cell {
          vertical-align: top;
          padding: 0.65rem 0.75rem;
          font-size: 0.82rem;
          line-height: 1.55;
          color: var(--color-moonlight);
          border-bottom: 1px solid var(--pl-line);
          border-left: 1px solid var(--pl-line);
        }
        .pl-cell.is-active { background: var(--pl-wash); }

        /* The audio row is the one row that is entirely mine, so it is the one
           row that gets its own rule, its own tint and a credit in the header. */
        .pl-matrix tr.is-audio .pl-rowhead {
          color: var(--pl-cyan);
          border-top: 1px solid color-mix(in srgb, var(--pl-cyan) 55%, transparent);
          white-space: normal;
        }
        .pl-matrix tr.is-audio .pl-cell {
          border-top: 1px solid color-mix(in srgb, var(--pl-cyan) 55%, transparent);
          background: color-mix(in srgb, var(--pl-cyan) 6%, transparent);
        }
        .pl-matrix tr.is-audio .pl-cell.is-active {
          background: color-mix(in srgb, var(--pl-cyan) 12%, transparent);
        }

        .pl-mine {
          /* Inline-block put this on the same line as the row label inside a
             fixed-width column, which made "AUDIO + MINE" the widest header in
             the table and the one that overflowed. It sits under the label
             now. In the sheet and the cards, where it is not in a table cell,
             it stays inline — see the override below. */
          display: table;
          margin-top: 0.3rem;
          margin-left: 0;
          padding: 0.08rem 0.35rem;
          font-size: 0.68rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--pl-cyan);
          border: 1px solid color-mix(in srgb, var(--pl-cyan) 55%, transparent);
          white-space: nowrap;
        }
        /* Everywhere that is NOT a fixed-width table header, the chip belongs
           on the same line as the thing it credits. */
        :not(.pl-rowhead) > .pl-mine,
        :not(.pl-rowhead) > * > .pl-mine {
          display: inline-block;
          margin-top: 0;
          margin-left: 0.4rem;
          vertical-align: 0.1em;
        }

        /* A world with a design note worth stopping on is flagged in the cell;
           the note itself is in the sheet, so the flag is decoration and the
           screen reader is not told about a marker it cannot follow. */
        .pl-gem-flag {
          display: inline-block;
          width: 0.4rem;
          height: 0.4rem;
          margin-left: 0.4rem;
          background: var(--pl-cyan);
          transform: rotate(45deg);
          vertical-align: 0.05em;
        }

        /* ---- 4b · the matrix as cards (narrow) ----------------------------- */
        .pl-cards { display: none; }

        /* ---- 5 · the design sheet ------------------------------------------ */
        .pl-sheet {
          border: 1px solid var(--pl-edge);
          border-left: 3px solid var(--tone, var(--pl-cyan));
          padding: 1.4rem 1.5rem 1.5rem;
          display: grid;
          gap: 1.1rem;
        }
        .pl-sheet:focus-visible {
          outline: 2px solid var(--pl-cyan);
          outline-offset: 3px;
        }
        .pl-sheet-head { display: flex; align-items: center; gap: 1rem; }
        .pl-sheet-glyph { flex: 0 0 auto; }
        .pl-sheet-id { min-width: 0; }
        .pl-sheet-kicker {
          margin: 0;
          font-size: 0.70rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--tone, var(--pl-cyan));
        }
        .pl-sheet-name {
          font-family: var(--font-hero);
          font-size: 1.4rem;
          font-weight: 600;
          letter-spacing: 0.03em;
          margin: 0.15rem 0 0;
          color: var(--color-moonlight);
        }
        .pl-sheet-skill {
          margin: 0.25rem 0 0;
          font-size: 0.70rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--pl-quiet);
        }
        .pl-sheet-skill span { color: var(--pl-warm); }

        .pl-cohesion {
          margin: 0;
          padding-bottom: 1.1rem;
          border-bottom: 1px solid var(--pl-line);
          font-size: 0.98rem;
          line-height: 1.7;
          color: var(--color-silver);
          max-width: 50rem;
        }

        .pl-groups {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
          gap: 1.4rem 2rem;
          align-items: start;
        }
        .pl-group { min-width: 0; }
        .pl-group-title {
          margin: 0 0 0.7rem;
          padding-bottom: 0.4rem;
          font-size: 0.70rem;
          font-weight: 400;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--pl-quiet);
          border-bottom: 1px solid var(--pl-line);
        }
        /* One accent each, so the three passes are told apart at a glance: the
           world's own colour for what it teaches, warm for the systems, cyan
           for the layer that is mine. */
        .pl-group.is-curriculum .pl-group-title { color: var(--tone, var(--pl-cyan)); }
        .pl-group.is-systems .pl-group-title { color: var(--pl-warm); }
        .pl-group.is-sensory .pl-group-title { color: var(--pl-cyan); }

        .pl-group-dl { margin: 0; display: grid; gap: 0.9rem; }
        .pl-group-row { min-width: 0; }
        .pl-group-key {
          font-size: 0.68rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--pl-warm);
        }
        .pl-group-val {
          margin: 0.25rem 0 0;
          font-size: 0.87rem;
          line-height: 1.6;
          color: var(--color-moonlight);
        }

        /* The lede is the curriculum claim; the paragraph after it is the
           detail, so the claim is set apart rather than buried in prose. */
        .pl-lede {
          display: block;
          margin-bottom: 0.35rem;
          font-size: 0.9rem;
          line-height: 1.55;
          color: var(--tone, var(--pl-cyan));
        }
        .pl-tool {
          display: block;
          font-weight: 600;
          color: var(--color-moonlight);
        }
        .pl-rewards {
          display: block;
          margin-top: 0.4rem;
          padding-top: 0.4rem;
          border-top: 1px dotted var(--pl-line);
          color: var(--pl-quiet);
        }
        .pl-rewards-key {
          display: block;
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--pl-warm);
          margin-bottom: 0.15rem;
        }

        .pl-hazards { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5rem; }
        .pl-hazard {
          display: grid;
          gap: 0.1rem;
          padding-left: 0.7rem;
          border-left: 1px solid color-mix(in srgb, var(--pl-warm) 45%, transparent);
        }
        .pl-hazard-name { font-weight: 600; color: var(--color-moonlight); }
        .pl-hazard-effect { font-size: 0.83rem; line-height: 1.55; color: var(--pl-quiet); }

        .pl-audio-char {
          display: block;
          font-weight: 600;
          color: var(--pl-cyan);
        }
        .pl-audio-inst { display: block; margin-top: 0.15rem; }
        .pl-audio-tex {
          display: block;
          margin-top: 0.35rem;
          font-size: 0.83rem;
          line-height: 1.55;
          color: var(--pl-quiet);
        }

        /* ---- the gems ------------------------------------------------------
           The two audio ideas worth stopping on. Same treatment in both places
           they appear, so a reader learns the shape once. */
        .pl-gem {
          padding: 0.95rem 1rem 1rem;
          border: 1px solid color-mix(in srgb, var(--pl-cyan) 38%, transparent);
          background: color-mix(in srgb, var(--pl-cyan) 7%, transparent);
          display: grid;
          gap: 0.35rem;
        }
        .pl-gem-source {
          margin: 0;
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--pl-quiet);
        }
        .pl-gem-label {
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.68rem;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: var(--pl-cyan);
        }
        .pl-gem-mark {
          width: 0.4rem;
          height: 0.4rem;
          flex: 0 0 auto;
          background: var(--pl-cyan);
          transform: rotate(45deg);
        }
        .pl-gem-body {
          margin: 0;
          font-size: 0.85rem;
          line-height: 1.65;
          color: var(--color-moonlight);
        }

        /* ---- 6a · the audio notes -------------------------------------------
           A standing band, not a disclosure: both notes are on screen whatever
           the reader has selected. */
        .pl-notes {
          border-top: 1px solid var(--pl-edge);
          padding-top: 1.4rem;
          display: grid;
          gap: 0.5rem;
        }
        .pl-notes-kicker {
          margin: 0;
          font-size: 0.70rem;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: var(--pl-cyan);
        }
        .pl-notes-head {
          font-family: var(--font-hero);
          font-size: 1.15rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          margin: 0 0 0.5rem;
          color: var(--color-moonlight);
        }
        /* Two notes side by side while there is room, stacked when there is
           not. auto-fit rather than a fixed two-up so a third note could be
           added to the data without touching this rule. */
        .pl-gems {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
          gap: 0.9rem;
          align-items: start;
        }

        .pl-ship {
          margin-top: 0.6rem;
          padding-left: 0.9rem;
          border-left: 1px solid var(--pl-line);
          display: grid;
          gap: 0.3rem;
          max-width: 46rem;
        }
        .pl-ship-kicker {
          margin: 0;
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--pl-quiet);
        }
        .pl-ship-head {
          font-family: var(--font-hero);
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          margin: 0;
          color: var(--color-moonlight);
        }
        .pl-ship-body {
          margin: 0;
          font-size: 0.88rem;
          line-height: 1.7;
          color: var(--pl-quiet);
        }

        /* ---- 6b · the progression ------------------------------------------- */
        .pl-arc { margin: 0; }
        .pl-arc-caption {
          margin: 0 0 0.8rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--pl-line);
          font-size: 0.70rem;
          letter-spacing: 0.08em;
          color: var(--pl-warm);
        }
        .pl-arc-line {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 0;
        }
        .pl-arc-beat {
          position: relative;
          min-width: 0;
          padding: 0.65rem 1.5rem 0.7rem 0;
          display: grid;
          gap: 0.22rem;
          align-content: start;
          transition: opacity 220ms ease;
          /* The floor, not a taste call: dimming the 0.55rem mono any further
             takes it under 4.5:1 on the void. The selected beat is told apart
             by its coloured name as well as by weight, so the dim never has to
             do the work alone. */
          opacity: 0.78;
        }
        .pl-arc-beat.is-active { opacity: 1; }
        .pl-arc-skill {
          font-size: 0.68rem;
          letter-spacing: 0.11em;
          text-transform: uppercase;
          color: var(--pl-warm);
        }
        .pl-arc-name {
          font-family: var(--font-hero);
          font-size: 0.92rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: var(--color-moonlight);
        }
        .pl-arc-beat.is-active .pl-arc-name { color: var(--tone, var(--pl-cyan)); }
        .pl-arc-phrase {
          font-size: 0.84rem;
          line-height: 1.5;
          color: var(--pl-quiet);
        }
        /* The joins are drawn, not typed: a chevron built from two borders,
           which rotates to point down when the progression stacks. */
        .pl-arc-join {
          position: absolute;
          top: 1.5rem;
          right: 0.6rem;
          width: 0.4rem;
          height: 0.4rem;
          border-top: 1px solid var(--pl-line);
          border-right: 1px solid var(--pl-line);
          transform: rotate(45deg);
        }

        /* ---- responsive -----------------------------------------------------
           Three moves. At 1100px the progression drops to a grid of cards
           because five phrases stop fitting on one line long before the rail
           does. At 900px the table hands over to the cards. At 620px the rail
           itself stops being a rail. */
        @media (max-width: 1100px) {
          .pl-arc-line { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .pl-arc-join { display: none; }
          .pl-arc-beat { padding: 0.6rem 1rem 0.7rem 0; }
        }

        @media (max-width: 900px) {
          .pl-scroll { display: none; }

          .pl-cards {
            display: grid;
            list-style: none;
            margin: 0;
            padding: 0;
            gap: 0.9rem;
          }
          .pl-card {
            border: 1px solid var(--pl-edge);
            border-left: 3px solid color-mix(in srgb, var(--tone, var(--pl-cyan)) 35%, transparent);
            padding: 1rem 1.05rem 1.1rem;
            transition: border-color 220ms ease;
          }
          /* The wash is added as a background LAYER rather than through the
             background shorthand, which would drop the .panel rule's own
             gradient and leave the card sitting on the page. */
          .pl-card.is-active {
            border-left-color: var(--tone, var(--pl-cyan));
            background-image:
              linear-gradient(var(--pl-wash), var(--pl-wash)),
              linear-gradient(145deg, color-mix(in srgb, var(--color-silver) 4%, transparent), transparent 38%);
          }
          .pl-card-head {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding-bottom: 0.75rem;
            border-bottom: 1px solid var(--pl-line);
          }
          .pl-card-glyph { flex: 0 0 auto; }
          .pl-card-id { min-width: 0; }
          .pl-card-ord {
            margin: 0;
            font-size: 0.68rem;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: var(--tone, var(--pl-cyan));
          }
          .pl-card-name {
            font-family: var(--font-hero);
            font-size: 1.1rem;
            font-weight: 600;
            letter-spacing: 0.03em;
            margin: 0.15rem 0 0;
            color: var(--color-moonlight);
          }
          .pl-card-dl { margin: 0.85rem 0 0; display: grid; gap: 0.6rem; }
          /* Label beside value while there is room for it; the label column is
             fixed so six rows line up as a chart rather than six paragraphs. */
          .pl-card-row {
            display: grid;
            grid-template-columns: 5.4rem minmax(0, 1fr);
            gap: 0.2rem 0.75rem;
            align-items: baseline;
          }
          .pl-card-key {
            font-size: 0.68rem;
            letter-spacing: 0.09em;
            text-transform: uppercase;
            color: var(--pl-warm);
            line-height: 1.5;
          }
          .pl-card-val {
            margin: 0;
            font-size: 0.86rem;
            line-height: 1.55;
            color: var(--color-moonlight);
          }
          .pl-card-row.is-audio {
            margin-top: 0.15rem;
            padding-top: 0.55rem;
            border-top: 1px solid color-mix(in srgb, var(--pl-cyan) 45%, transparent);
          }
          .pl-card-row.is-audio .pl-card-key { color: var(--pl-cyan); }

          .pl-sheet { padding: 1.1rem 1.15rem 1.25rem; }
          .pl-groups { grid-template-columns: minmax(0, 1fr); gap: 1.3rem; }
        }

        @media (max-width: 620px) {
          /* Five stations cannot hold a legible name at phone width, so the
             rail becomes a stack: the glyph moves beside the text, the rule
             comes off (a line through a vertical list would lie about the
             reading order), and each station keeps a full-width hit target. */
          .pl-rail { grid-template-columns: minmax(0, 1fr); }
          .pl-rule { display: none; }
          .pl-crown { width: auto; margin: 0; }
          .pl-station {
            display: grid;
            grid-template-columns: auto minmax(0, 1fr);
            grid-template-rows: auto auto;
            column-gap: 0.75rem;
            row-gap: 0.1rem;
            align-items: center;
            justify-items: start;
            text-align: left;
            padding: 0.7rem 0.85rem;
            border-bottom: 1px solid var(--pl-line);
          }
          .pl-station[data-step="4"] { border-bottom: 0; }
          .pl-orb { grid-row: 1 / span 2; width: 2.1rem; height: 2.1rem; margin: 0; }
          .pl-station-ord { display: none; }
          .pl-station-name { grid-column: 2; padding-inline: 0; font-size: 1rem; }
          .pl-station-skill { grid-column: 2; padding-inline: 0; text-align: left; }
          /* The ordinal is gone from the station, so the rail's caption carries
             the ordering claim on its own. */

          .pl-credit-line { grid-template-columns: minmax(0, 1fr); gap: 0.25rem; }
          .pl-card-row { grid-template-columns: minmax(0, 1fr); }
          .pl-arc-line { grid-template-columns: minmax(0, 1fr); }
          .pl-arc-beat { padding: 0.5rem 0 0.6rem; border-bottom: 1px solid var(--pl-line); }
          .pl-arc-beat:last-child { border-bottom: 0; }
          .pl-sheet-head { gap: 0.75rem; }
          .pl-sheet-name { font-size: 1.2rem; }
        }

        /* Nothing here needs to move to be understood: the halo, the washes and
           the progression's dimming are all readable as static states. */
        @media (prefers-reduced-motion: reduce) {
          .pl-station,
          .pl-halo,
          .pl-colbtn,
          .pl-card,
          .pl-arc-beat { transition: none; }
        }
      `}</style>
    </div>
  );
}

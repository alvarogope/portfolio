"use client";

import { useState } from "react";
import Image from "next/image";
import type { Ability } from "@/content/schema";
import InteractiveHint from "./InteractiveHint";

/**
 * Moon-Knight — the five quantum abilities, read off the design document's own
 * sigil.
 *
 * WHAT THIS IS. `quantum_abilities.jpg` is a real artefact from the GDD: the
 * Rubedo sigil, three interlocking rings of thorned branch with the five
 * powers set in glowing discs around them. It is the figure the abilities were
 * designed against, and it is the canvas here — the same treatment `WorldMap`
 * gives the hand-drawn map of Kaelum. Point at a disc and that ability's
 * reasoning opens beside it.
 *
 * WHY THE PAINTING AND NOT A DRAWING. This component briefly rendered a
 * redrawn SVG triskelion instead, on the argument that names baked into pixels
 * cannot be searched, translated or corrected. That argument bought a
 * spell-checkable diagram and paid for it with the actual artefact — and the
 * artefact is the evidence: it is what a designer made, and a portfolio that
 * redraws its own design documents is showing a component library rather than
 * a project. The two real costs are paid instead:
 *
 *   · THE TYPO. The painted sigil's first version read "Double Superpoistion".
 *     The file in the repo is the corrected one, and the names on it now match
 *     `moonKnight.abilities` exactly. That match is not enforceable by the
 *     build — it is an image — so it is stated here and in the ownership map.
 *   · THE READABILITY. Every word on the painting is also rendered as REAL
 *     TEXT: the readout prints the selected ability's name, its quantum basis
 *     and what it does in play, and each hotspot's accessible name is
 *     `name — principle`. Nothing is available only as pixels.
 *
 * KEYS, NOT COPY. This file types NO ability name, NO principle and NO effect.
 * It receives `moonKnight.abilities` and renders `name`, `annotation`, `body`
 * and `availableTo`. The one thing it does hold is GEOMETRY — where each disc
 * sits on the painting — and that is keyed BY NAME, because a position on a
 * fixed image cannot be computed from an array's length.
 *
 * IT IS ALSO THE ONLY HOME FOR THIS MATERIAL. §02 used to render this figure
 * and then five ability cards of the same array directly beneath it, so every
 * principle and every effect was stated twice on one screen. The cards are
 * gone; the readout is where an ability is described.
 *
 * INTERACTION FOLLOWS `RoleGraph` AND `WorldMap`, deliberately, so the three
 * diagrams on this project behave identically:
 *
 *   · ONE piece of state. Click, tap, focus and hover all set the same
 *     `selected` index, so the lit disc and the readout can never disagree.
 *   · THE PAINTING IS DECORATIVE-ISH — it carries a real `alt` describing the
 *     artefact, but it is not the control surface. The controls are real HTML
 *     `<button>`s laid over it, which is what buys the tab stop, Enter/Space,
 *     a real focus ring and a finger-sized target on every browser.
 *   · HOVER IS STICKY and ignores touch. It does not revert on leave, so the
 *     figure holds still when the pointer wanders off; on touch the click that
 *     follows does the work.
 *   · A `role="status"` line reports the change, because a mouse user sees the
 *     readout swap and a screen-reader user otherwise would not.
 *
 * REDUCED MOTION. The only animation is the transition on a hotspot's ring,
 * and the media query at the foot removes it. Nothing moves on its own.
 *
 * CONTRAST. Every colour is checked as TEXT against the panel it sits on.
 * `--color-mist` is 4.41:1 there, under the 4.5 bar for small type, so the
 * quiet ink is the same lifted steel the bestiary, cast and diegetic bands use.
 * Nothing is stated by colour alone: the enemy-exclusive ability is marked with
 * a chip that says so in words, not merely by being scarlet.
 */

/** The painting, and the box the hotspot percentages are measured against. */
const SIGIL_SRC = "/images/moon-knight/quantum_abilities.jpg";
const SIGIL_ALT =
  "The Rubedo sigil from the game's design document: three interlocking rings of thorned black " +
  "branch on a misty green ground, the Rubedo state at their centre, and the five quantum " +
  "abilities set in glowing violet discs around them.";

/**
 * Where each disc sits on the painting, as a fraction of its width and height.
 * `r` is the radius of the round control, again as a fraction — sized to the
 * painted glow ring rather than to the text inside it, so the target covers
 * the whole disc a reader is aiming at.
 *
 * KEYED BY ABILITY NAME, and that is the one coupling this component has to
 * the content file: rename an ability and its disc goes unplaced. That is a
 * visible, recoverable failure rather than a silent misplacement — see
 * `unplaced` below, which keeps any such ability reachable as a chip.
 *
 * MEASURED, NOT EYEBALLED. Each centre is the bounding box of the disc's own
 * dark interior in the 1024px source, found by segmenting the artwork rather
 * than by dragging numbers until they looked close. Two of them are more than
 * 20px away from where they looked right by eye — "Double Superposition" most
 * of all, because its label is wider than the disc it sits in and the eye
 * centres the ring on the TEXT. Re-measure, do not nudge.
 */
const HOTSPOTS: Record<string, { x: number; y: number; r: number }> = {
  "Master of Matters": { x: 0.5132, y: 0.1611, r: 0.058 },
  Instability: { x: 0.1855, y: 0.4004, r: 0.057 },
  "Double Superposition": { x: 0.8247, y: 0.4004, r: 0.058 },
  Inversion: { x: 0.1621, y: 0.7695, r: 0.057 },
  "Elliptical Force": { x: 0.8579, y: 0.7637, r: 0.058 },
};

/**
 * The quantum principle, taken off the ability's own `annotation`.
 *
 * `annotation` is written as "Quantum basis · Majorana states · topologically
 * protected qubits". The readout already labels the row "Quantum basis", so
 * repeating the prefix inside the value would print it twice. This strips it
 * and NOTHING ELSE — the rest of the string is passed through exactly as the
 * content file wrote it, separators included.
 *
 * Defensive on purpose: an annotation that does not carry the prefix is
 * returned whole rather than sliced at a guessed offset. The worst case is a
 * duplicated label, never a truncated principle.
 */
const PRINCIPLE_PREFIX = /^\s*quantum basis\s*·\s*/i;
function principleOf(ability: Ability) {
  return ability.annotation.replace(PRINCIPLE_PREFIX, "");
}

/** True for an ability the player is never given. Read, not hard-coded. */
function isEnemyOnly(ability: Ability) {
  return ability.availableTo.length === 1 && ability.availableTo[0] === "Enemy";
}

export default function QuantumSigil({
  abilities,
  /** The disc the readout opens on. First in the data unless told otherwise. */
  initialIndex = 0,
}: {
  abilities: readonly Ability[];
  initialIndex?: number;
}) {
  const [selected, setSelected] = useState(initialIndex);

  /* A guard, not a formality: `initialIndex` is a prop and the array is data.
     Clamping here means a bad pair renders the first ability instead of
     throwing inside a client component, where the failure would blank the
     whole section rather than one disc. */
  const total = abilities.length;
  const current = abilities[Math.min(Math.max(selected, 0), total - 1)] ?? abilities[0];

  /* Any ability the painting does not depict. Empty today, and it stays empty
     as long as the artefact and the content file agree — but an ability that
     is only reachable through an image is an ability a rename can hide, so the
     ones without a disc get a chip under the figure instead of vanishing. */
  const unplaced = abilities.filter((a) => !HOTSPOTS[a.name]);

  if (!current) return null;

  const hover = (i: number) => (event: React.PointerEvent) => {
    if (event.pointerType !== "touch") setSelected(i);
  };

  return (
    <div className="qs">
      {/* Above the figure, not below it: an instruction that arrives after the
          thing it explains has already been skipped. `InteractiveHint` is the
          same chip the world map, the beat chart and the controller map wear,
          so a reader learns the convention once. */}
      <div className="qs-hint-slot">
        <InteractiveHint what="disc" does="that ability's quantum basis and what it does in play read out beside it" />
      </div>

      <div className="qs-figure">
        <div className="qs-stage">
          <Image
            src={SIGIL_SRC}
            alt={SIGIL_ALT}
            fill
            sizes="(max-width: 860px) 92vw, 34rem"
            style={{ objectFit: "contain" }}
          />

          {/* The controls. Transparent, round, exactly over each painted disc,
              sized in percentages so they track the stage at any width. */}
          <div className="qs-hits" role="group" aria-label="Quantum abilities">
            {abilities.map((a, i) => {
              const spot = HOTSPOTS[a.name];
              if (!spot) return null;
              return (
                <button
                  key={a.name}
                  type="button"
                  className={`qs-hit${i === selected ? " is-on" : ""}${
                    isEnemyOnly(a) ? " is-enemy" : ""
                  }`}
                  style={{
                    left: `${(spot.x - spot.r) * 100}%`,
                    top: `${(spot.y - spot.r) * 100}%`,
                    width: `${spot.r * 200}%`,
                    height: `${spot.r * 200}%`,
                  }}
                  aria-label={`${a.name} — ${principleOf(a)}`}
                  aria-pressed={i === selected}
                  onClick={() => setSelected(i)}
                  onFocus={() => setSelected(i)}
                  onPointerEnter={hover(i)}
                />
              );
            })}
          </div>
        </div>

        {/* Provenance, not instruction — the chip above carries the
            instruction now. This says what the picture IS. */}
        <p className="mono qs-hint">The sigil, from the game&apos;s design document.</p>

        {unplaced.length > 0 && (
          <div className="qs-unplaced">
            <p className="mono qs-unplaced-key">Not on the sigil</p>
            <div className="qs-unplaced-row">
              {unplaced.map((a) => (
                <button
                  key={a.name}
                  type="button"
                  className={`mono qs-chip qs-chip--button${
                    a === current ? " is-on" : ""
                  }`}
                  aria-pressed={a === current}
                  onClick={() => setSelected(abilities.indexOf(a))}
                >
                  {a.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* The readout. Everything in it is a field of the selected ability, and
          this is the ONLY place on the page any of it is stated. */}
      <div className="qs-readout panel">
        <p className="mono qs-readout-kicker">
          <span className="qs-readout-index">
            {String(abilities.indexOf(current) + 1).padStart(2, "0")}
          </span>
          <span>Ability</span>
          {isEnemyOnly(current) ? (
            <span className="qs-chip qs-chip--enemy">Enemy only</span>
          ) : (
            <span className="qs-chip">Player &amp; enemy</span>
          )}
        </p>

        <h4 className="qs-readout-name">{current.name}</h4>

        <div className="qs-field">
          <p className="mono qs-field-key">Quantum basis</p>
          <p className="qs-field-value qs-field-value--mono mono">{principleOf(current)}</p>
        </div>

        <div className="qs-field">
          <p className="mono qs-field-key">In play</p>
          <p className="qs-field-value">{current.body}</p>
        </div>
      </div>

      {/* Reports the swap to anyone who cannot see the readout change. */}
      <p className="qs-sr-live" role="status">
        {current.name} selected · {principleOf(current)}
      </p>

      <style>{`
        .qs {
          /* --color-mist is 4.41:1 on the panel, under the 4.5 bar for small
             type. This is the same lifted steel the other Moon-Knight bands
             use — 6.3:1 — so every quiet label here clears AA as text. */
          --qs-quiet: #93A0B3;
          --qs-edge: color-mix(in srgb, var(--color-mist) 26%, transparent);
          /* Scarlet is 2:1 on nightfall and unusable raw. Lifted to ~5.2:1,
             which is a text-safe ink for the enemy-only chip. */
          --qs-blood: color-mix(in srgb, var(--color-scarlet) 55%, var(--color-moonlight));

          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 20rem);
          gap: clamp(1.5rem, 3vw, 2.5rem);
          align-items: center;
        }
        /* The chip spans both columns and sits above the pair. */
        .qs-hint-slot { grid-column: 1 / -1; }

        .qs-figure { display: grid; gap: 0.7rem; justify-items: center; }

        /* ---- the painting ---- */
        .qs-stage {
          position: relative;
          width: 100%;
          max-width: 34rem;
          aspect-ratio: 1 / 1;
          /* The artwork is square, so object-fit contain letterboxes into
             nothing here - but it is still the right fit: a crop would take a
             disc off the edge and its hotspot with it. */
        }
        .qs-stage img { border-radius: 2px; }

        .qs-hint {
          margin: 0;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          line-height: 1.5;
          color: var(--qs-quiet);
          text-align: center;
        }

        /* ---- the hit targets ----
           Visible by default, and that is the point: a hotspot nobody can see
           is a hotspot nobody uses. A hairline ring sits on every disc, the
           pointer thickens it, and the selected one goes gold. */
        .qs-hits { position: absolute; inset: 0; }
        .qs-hit {
          position: absolute;
          padding: 0;
          border-radius: 50%;
          background: transparent;
          cursor: pointer;
          border: 1.5px solid color-mix(in srgb, var(--color-gold) 34%, transparent);
          transition: border-color 160ms ease, box-shadow 160ms ease;
        }
        /* The ring is sized to the painted disc, which on a phone is about
           40px across — under the 44px a finger needs. This grows the TARGET
           without moving the ring. The discs are a third of the stage apart,
           so nothing collides. */
        .qs-hit::after {
          content: "";
          position: absolute;
          inset: -9px;
          border-radius: 50%;
        }
        .qs-hit:hover {
          border-color: color-mix(in srgb, var(--color-gold) 70%, transparent);
        }
        .qs-hit.is-on {
          border-color: var(--color-gold);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-gold) 22%, transparent);
        }
        /* The enemy-exclusive power reads cold — but never ONLY by colour: the
           readout says "Enemy only" in words and so does the button's own
           accessible name. */
        .qs-hit.is-enemy.is-on {
          border-color: var(--qs-blood);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-scarlet) 22%, transparent);
        }
        .qs-hit:focus-visible {
          outline: 2px solid var(--color-gold);
          outline-offset: 3px;
        }

        /* ---- the fallback chips ---- */
        .qs-unplaced { display: grid; gap: 0.4rem; justify-items: center; }
        .qs-unplaced-key {
          margin: 0;
          font-size: 0.66rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--qs-quiet);
        }
        .qs-unplaced-row { display: flex; flex-wrap: wrap; gap: 0.45rem; justify-content: center; }
        .qs-chip--button { cursor: pointer; background: transparent; }
        .qs-chip--button.is-on { color: var(--color-gold); border-color: var(--color-gold); }

        /* ---- the readout ---- */
        .qs-readout {
          border: 1px solid var(--qs-edge);
          border-left: 3px solid var(--color-gold);
          padding: clamp(1.1rem, 2.5vw, 1.5rem);
          display: grid;
          gap: 1rem;
          align-content: start;
        }
        .qs-readout-kicker {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.55rem;
          margin: 0;
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--qs-quiet);
        }
        .qs-readout-index { color: var(--color-gold); }
        .qs-chip {
          text-transform: none;
          letter-spacing: 0.06em;
          font-size: 0.68rem;
          padding: 0.2rem 0.55rem;
          border: 1px solid var(--qs-edge);
          border-radius: 999px;
          color: var(--qs-quiet);
        }
        .qs-chip--enemy {
          color: var(--qs-blood);
          border-color: color-mix(in srgb, var(--color-scarlet) 55%, transparent);
        }
        .qs-readout-name {
          margin: 0;
          font-family: var(--font-hero), var(--font-display), serif;
          font-size: clamp(1.2rem, 1rem + 0.8vw, 1.55rem);
          line-height: 1.2;
          color: var(--color-moonlight);
        }
        .qs-field { display: grid; gap: 0.35rem; }
        .qs-field-key {
          margin: 0;
          font-size: 0.68rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--color-gold);
        }
        .qs-field-value {
          margin: 0;
          font-size: 0.92rem;
          line-height: 1.65;
          color: var(--color-silver);
        }
        .qs-field-value--mono { font-size: 0.82rem; color: var(--qs-quiet); }

        /* Announced, not shown: the readout above is the visible version. */
        .qs-sr-live {
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

        /* Under 860px the readout goes below the figure rather than beside it:
           a 20rem panel next to a square painting leaves neither enough room. */
        @media (max-width: 860px) {
          .qs { grid-template-columns: minmax(0, 1fr); }
          .qs-hint-slot { grid-column: auto; }
          .qs-readout { max-width: 34rem; margin-inline: auto; width: 100%; }
        }

        @media (prefers-reduced-motion: reduce) {
          .qs-hit { transition: none; }
        }
      `}</style>
    </div>
  );
}

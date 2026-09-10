"use client";

import { useState } from "react";
import Image from "next/image";
import type { Ability } from "@/content/schema";
import InteractiveHint from "./InteractiveHint";

const SIGIL_SRC = "/images/moon-knight/quantum_abilities.jpg";
const SIGIL_ALT =
  "The Rubedo sigil from the game's design document: three interlocking rings of thorned black " +
  "branch on a misty green ground, the Rubedo state at their centre, and the five quantum " +
  "abilities set in glowing violet discs around them.";

const HOTSPOTS: Record<string, { x: number; y: number; r: number }> = {
  "Master of Matters": { x: 0.5132, y: 0.1611, r: 0.058 },
  Instability: { x: 0.1855, y: 0.4004, r: 0.057 },
  "Double Superposition": { x: 0.8247, y: 0.4004, r: 0.058 },
  Inversion: { x: 0.1621, y: 0.7695, r: 0.057 },
  "Elliptical Force": { x: 0.8579, y: 0.7637, r: 0.058 },
};

const PRINCIPLE_PREFIX = /^\s*quantum basis\s*·\s*/i;
function principleOf(ability: Ability) {
  return ability.annotation.replace(PRINCIPLE_PREFIX, "");
}

function isEnemyOnly(ability: Ability) {
  return ability.availableTo.length === 1 && ability.availableTo[0] === "Enemy";
}

export default function QuantumSigil({
  abilities,
  initialIndex = 0,
}: {
  abilities: readonly Ability[];
  initialIndex?: number;
}) {
  const [selected, setSelected] = useState(initialIndex);

  const total = abilities.length;
  const current = abilities[Math.min(Math.max(selected, 0), total - 1)] ?? abilities[0];

  const unplaced = abilities.filter((a) => !HOTSPOTS[a.name]);

  if (!current) return null;

  const hover = (i: number) => (event: React.PointerEvent) => {
    if (event.pointerType !== "touch") setSelected(i);
  };

  return (
    <div className="qs">
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

"use client";

import { useEffect, useRef, useState } from "react";
import {
  shatteredSkiesPlanets,
  tidalorHost,
  type Planet,
  type PlanetId,
} from "@/content/shattered-skies-planets";
import { PlanetGlyph } from "./PlanetGlyphs";
import InteractiveHint from "./InteractiveHint";

const RING_MIN = 11;
const RING_MAX = 40;
const ringRadius = (p: Planet) => RING_MIN + (RING_MAX - RING_MIN) * p.orbitRadius;

const glyphSize = (p: Planet) => 4 + 5.2 * p.renderScale;

const STAR_SIZE = 11;

const BASE_PERIOD = 420;
const period = (p: Planet) => Math.round(BASE_PERIOD * Math.pow(p.orbitRadius, 1.5));

const startAngle = (index: number) => (200 + index * 137.5) % 360;

const HOST_WIDTH = 2.2;
const HOST_OFFSET = -0.95;

const ENTRANCE_FAIL_OPEN_MS = 1500;

export default function PlanetOrrery({
  planets = shatteredSkiesPlanets,
  active = null,
  selected = null,
  onPreview,
  onSelect,
}: {
  planets?: readonly Planet[];
  active?: PlanetId | null;
  selected?: PlanetId | null;
  onPreview: (id: PlanetId | null) => void;
  onSelect: (id: PlanetId | null, viaPointer?: boolean) => void;
}) {
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const root = useRef<HTMLElement>(null);
  const activePlanet = planets.find((p) => p.id === active) ?? null;

  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const reveal = () => setEntered(true);
    const failOpen = window.setTimeout(reveal, ENTRANCE_FAIL_OPEN_MS);
    const el = root.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      reveal();
      return () => window.clearTimeout(failOpen);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        reveal();
        observer.disconnect();
        window.clearTimeout(failOpen);
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      window.clearTimeout(failOpen);
    };
  }, []);

  const moveFocus = (from: number, delta: number) => {
    const next = (from + delta + planets.length) % planets.length;
    buttons.current[next]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      onSelect(null);
      onPreview(null);
      return;
    }
    const index = buttons.current.findIndex((b) => b === event.target);
    if (index < 0) return;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        moveFocus(index, 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        moveFocus(index, -1);
        break;
      case "Home":
        moveFocus(0, 0);
        break;
      case "End":
        moveFocus(planets.length - 1, 0);
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  const onStageClick = (event: React.MouseEvent) => {
    if ((event.target as HTMLElement).closest("button")) return;
    onSelect(null);
  };

  return (
    <section
      className="orr"
      ref={root}
      aria-label="Interactive orrery of the Shattered Skies system"
      data-paused={active ? "true" : "false"}
      data-entered={entered ? "true" : "pending"}
      onKeyDown={onKeyDown}
    >
      <p className="orr__kicker">The Planetary System in Movement</p>

      <InteractiveHint
        what="world"
        does="its survey entry opens below and the other four dim"
      />

      <div className="orr__stage" onClick={onStageClick}>
        <svg className="orr__rings" viewBox="0 0 100 100" aria-hidden focusable="false">
          <circle cx="50" cy="50" r="48" fill="url(#ssp-halo)" />
          {planets.map((p, i) => (
            <circle
              key={p.id}
              className="orr__ring"
              data-state={
                p.id === selected
                  ? "selected"
                  : active
                    ? p.id === active
                      ? "active"
                      : "muted"
                    : "idle"
              }
              style={{ "--orr-in": i } as React.CSSProperties}
              cx="50"
              cy="50"
              r={ringRadius(p)}
              fill="none"
              stroke={p.accent}
              strokeWidth="0.3"
              strokeDasharray="1.1 2.3"
            />
          ))}
          <use
            className="orr__star"
            href="#ssp-sun"
            x={50 - STAR_SIZE / 2}
            y={50 - STAR_SIZE / 2}
            width={STAR_SIZE}
            height={STAR_SIZE}
          />
        </svg>

        {planets.map((p, i) => {
          const size = glyphSize(p);
          const state = active ? (p.id === active ? "active" : "muted") : "idle";
          return (
            <div
              key={p.id}
              className="orr__arm"
              style={{ "--orr-dur": `${period(p)}s` } as React.CSSProperties}
            >
              <div
                className="orr__slot"
                style={
                  {
                    "--orr-a": `${startAngle(i)}deg`,
                    "--orr-r": ringRadius(p),
                  } as React.CSSProperties
                }
              >
                <div className="orr__unspin">
                  <div className="orr__unphase">
                    {p.isMoon && (
                      <span className="orr__host" aria-hidden style={{ "--orr-size": size } as React.CSSProperties}>
                        <svg viewBox="0 0 140 100" focusable="false">
                          <use href="#ssp-gasgiant" width="140" height="100" />
                        </svg>
                      </span>
                    )}
                    <button
                      type="button"
                      ref={(el) => {
                        buttons.current[i] = el;
                      }}
                      className="orr__world"
                      data-state={state}
                      aria-pressed={p.id === selected}
                      style={
                        {
                          "--orr-size": size,
                          "--orr-accent": p.accent,
                          "--orr-in": i,
                        } as React.CSSProperties
                      }
                      onPointerEnter={() => onPreview(p.id)}
                      onPointerLeave={() => onPreview(null)}
                      onFocus={() => onPreview(p.id)}
                      onBlur={() => onPreview(null)}
                      onClick={(e) => onSelect(p.id === selected ? null : p.id, e.detail > 0)}
                    >
                      <span className="orr__body">
                        <PlanetGlyph id={p.id} size="100%" className="orr__glyph" />
                      </span>
                      <span className="orr__label">{p.name}</span>
                      <span className="orr__sr">
                        , {p.kind}, {p.orbitLabel}, {p.temperature}
                        {p.isMoon ? `, orbits a ${tidalorHost.name.toLowerCase()}` : ""}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="orr__readout">
        <p className="orr__status" aria-live="polite">
          {activePlanet ? (
            <>
              <span className="orr__status-tag" style={{ color: activePlanet.accent }}>
                {activePlanet.orbitLabel}
              </span>
              <span className="orr__status-name">{activePlanet.name}</span>
              <span className="orr__status-kind">
                {activePlanet.kind} · {activePlanet.temperature}
              </span>
            </>
          ) : (
            <span className="orr__status-hint">
              No world selected.
            </span>
          )}
        </p>
        {selected && (
          <button type="button" className="orr__clear" onClick={() => onSelect(null)}>
            <span className="orr__clear-x" aria-hidden>
              ✕
            </span>
            Clear selection
          </button>
        )}
      </div>

      <style>{`
        .orr {
          --orr-quiet: color-mix(in srgb, var(--color-mist) 82%, var(--color-moonlight));
          --orr-hairline: color-mix(in srgb, var(--color-mist) 24%, transparent);
          display: grid;
          gap: 1rem;
          /* Kicker, stage and readout share one column so the orrery reads as a
             single object rather than a small circle adrift in a wide band. */
          max-width: 36rem;
          margin: 0 auto 1.5rem;
        }
        .orr__kicker {
          margin: 0;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--color-nebula);
        }

        /* The stage is the container everything else is measured against: every
           radius and diameter below is a percentage of this square's width. */
        .orr__stage {
          container-type: inline-size;
          position: relative;
          width: 100%;
          aspect-ratio: 1;
        }
        .orr__rings {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .orr__ring {
          stroke-opacity: 0.38;
          transition: stroke-opacity 320ms ease, stroke-width 320ms ease;
        }
        .orr__ring[data-state="active"] { stroke-opacity: 0.95; }
        .orr__ring[data-state="muted"] { stroke-opacity: 0.16; }
        /* Pinned: the one orbit drawn as a solid line. It survives the pointer
           leaving, which is what separates a selection from a hover. */
        .orr__ring[data-state="selected"] {
          stroke-dasharray: none;
          stroke-opacity: 1;
          stroke-width: 0.5;
        }

        /* Rotation is split across three boxes: the arm carries the animation,
           the slot carries the starting angle and the radius, and the two
           unwinding boxes cancel both so the glyph and its label stay upright. */
        .orr__arm {
          position: absolute;
          inset: 0;
          pointer-events: none;
          animation: orr-spin var(--orr-dur) linear infinite;
        }
        .orr__slot {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 0;
          height: 0;
          transform: rotate(var(--orr-a)) translateX(calc(var(--orr-r) * 1cqw));
        }
        .orr__unspin {
          position: absolute;
          left: 0;
          top: 0;
          width: 0;
          height: 0;
          animation: orr-spin var(--orr-dur) linear infinite reverse;
        }
        .orr__unphase {
          position: absolute;
          left: 0;
          top: 0;
          width: 0;
          height: 0;
          transform: rotate(calc(-1 * var(--orr-a)));
        }
        @keyframes orr-spin { to { transform: rotate(360deg); } }

        /* Everything stops the moment the pointer crosses into the orrery, well
           before it reaches a world — so a planet is never a moving target at
           the moment of intent. Focus and a standing selection hold it too. */
        .orr:hover .orr__arm,
        .orr:hover .orr__unspin,
        .orr:focus-within .orr__arm,
        .orr:focus-within .orr__unspin,
        .orr[data-paused="true"] .orr__arm,
        .orr[data-paused="true"] .orr__unspin { animation-play-state: paused; }

        .orr__world {
          position: absolute;
          left: 0;
          top: 0;
          /* The glyph, not the whole button, sits on the ring; the label hangs below. */
          transform: translateX(-50%) translateY(calc(var(--orr-size) * -0.5cqw));
          display: grid;
          justify-items: center;
          gap: 0.35rem;
          width: max-content;
          padding: 0;
          border: 0;
          background: none;
          pointer-events: auto;
          cursor: pointer;
          transition: opacity 320ms ease, filter 320ms ease;
        }
        /* A hit area wider than the glyph, and never smaller than a fingertip,
           so the world cannot slip out from under a resting pointer. */
        .orr__world::before {
          content: "";
          position: absolute;
          left: 50%;
          top: calc(var(--orr-size) * 0.5cqw);
          width: max(2.75rem, calc(var(--orr-size) * 1.35cqw));
          height: max(2.75rem, calc(var(--orr-size) * 1.35cqw));
          transform: translate(-50%, -50%);
          border-radius: 50%;
        }
        .orr__world[data-state="muted"] { opacity: 0.4; }
        .orr__world[data-state="active"] {
          z-index: 2;
          filter: drop-shadow(0 0 calc(var(--orr-size) * 0.28cqw) var(--orr-accent));
        }
        /* A pinned world never dims all the way, so its marker stays readable
           while the pointer is off previewing something else. */
        .orr__world[aria-pressed="true"] { z-index: 3; }
        .orr__world[aria-pressed="true"][data-state="muted"] { opacity: 0.78; }
        .orr__world:focus-visible {
          outline: 2px solid var(--color-nebula);
          outline-offset: 4px;
        }

        .orr__body {
          position: relative;
          display: block;
          width: calc(var(--orr-size) * 1cqw);
          aspect-ratio: 1;
          border-radius: 50%;
          transition: box-shadow 260ms ease;
          /* THE RESTING AFFORDANCE, and it is half of the pair the chip above
             is the other half of. Telling a reader a figure is interactive
             does not excuse a figure that looks inert, and five painted discs
             on five rings look exactly like an illustration of a solar system.

             A faint accent ring at rest says "these are objects, not
             decoration". It is deliberately weak — the point is that hover and
             selection have somewhere to escalate TO, so the three states read
             as one scale rather than as on and off. */
          box-shadow: 0 0 0 1px color-mix(in srgb, var(--orr-accent) 34%, transparent);
        }
        .orr__world:hover .orr__body,
        .orr__world:focus-visible .orr__body,
        .orr__world[data-state="active"] .orr__body {
          box-shadow: 0 0 0 1.5px color-mix(in srgb, var(--orr-accent) 72%, transparent);
        }
        /* The pinned marker: a gap of void, then a hard accent ring. */
        .orr__world[aria-pressed="true"] .orr__body {
          box-shadow:
            0 0 0 2px var(--color-void),
            0 0 0 3.5px var(--orr-accent);
        }
        .orr__glyph {
          width: 100%;
          height: 100%;
        }
        .orr__label {
          font-family: var(--font-mono);
          font-size: clamp(0.58rem, 2.1cqw, 0.72rem);
          letter-spacing: 0.16em;
          text-transform: uppercase;
          white-space: nowrap;
          color: var(--orr-quiet);
          transition: color 320ms ease;
        }
        .orr__world[data-state="active"] .orr__label { color: var(--color-moonlight); }
        .orr__world[aria-pressed="true"] .orr__label { color: var(--orr-accent); }

        /* Tidalor's host: scenery, drawn behind the moon and left of it. */
        .orr__host {
          position: absolute;
          left: 0;
          top: 0;
          display: block;
          width: calc(var(--orr-size) * ${HOST_WIDTH}cqw);
          transform: translate(
            calc(-50% + var(--orr-size) * ${HOST_OFFSET}cqw),
            -50%
          );
          opacity: 0.85;
          pointer-events: none;
        }
        .orr__host svg { display: block; width: 100%; height: auto; }

        .orr__sr {
          position: absolute;
          width: 1px;
          height: 1px;
          margin: -1px;
          padding: 0;
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
        }

        /* ---- entrance: one pass, star outward, only once in view ---- */
        @media (prefers-reduced-motion: no-preference) {
          .orr[data-entered="pending"] .orr__star,
          .orr[data-entered="pending"] .orr__ring,
          .orr[data-entered="pending"] .orr__world { opacity: 0; }

          .orr[data-entered="true"] .orr__star {
            animation: orr-in-star 520ms ease-out backwards;
          }
          .orr[data-entered="true"] .orr__ring {
            animation: orr-in-ring 620ms ease-out backwards;
            animation-delay: calc(160ms + var(--orr-in) * 100ms);
          }
          .orr[data-entered="true"] .orr__world {
            animation: orr-in-world 560ms cubic-bezier(0.22, 1, 0.36, 1) backwards;
            animation-delay: calc(300ms + var(--orr-in) * 100ms);
          }
          /* Rings grow out of the star rather than from their own centres.
             Every entrance above fills backwards, never both, so the muted and
             active opacities take over again the moment it is done. */
          .orr__ring,
          .orr__star {
            transform-box: view-box;
            transform-origin: center;
          }
        }
        @keyframes orr-in-star {
          from { opacity: 0; scale: 0.4; }
          to { opacity: 1; scale: 1; }
        }
        @keyframes orr-in-ring {
          from { opacity: 0; scale: 0.88; }
          to { opacity: 1; scale: 1; }
        }
        @keyframes orr-in-world {
          from { opacity: 0; scale: 0.6; }
          to { opacity: 1; scale: 1; }
        }

        /* ---- readout ---- */
        .orr__readout {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem 1.25rem;
          min-height: 2.5rem;
          padding: 0.85rem 1.1rem;
          border: 1px solid var(--orr-hairline);
          background: color-mix(in srgb, var(--color-nightfall) 45%, var(--color-void));
        }
        .orr__status {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 0.5rem 0.9rem;
          margin: 0;
          min-width: 0;
        }
        .orr__status-tag,
        .orr__status-kind,
        .orr__status-hint {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
        .orr__status-kind,
        .orr__status-hint { color: var(--orr-quiet); }
        .orr__status-name {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          line-height: 1;
          text-transform: uppercase;
          color: var(--color-moonlight);
        }
        .orr__clear {
          flex: none;
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          min-height: 2.75rem;
          padding: 0.55rem 1.1rem;
          border: 1px solid color-mix(in srgb, var(--color-nebula) 60%, transparent);
          background: color-mix(in srgb, var(--color-nebula) 10%, transparent);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--color-nebula);
          cursor: pointer;
          transition: background-color 200ms ease, border-color 200ms ease, color 200ms ease;
        }
        .orr__clear-x { font-size: 0.9rem; line-height: 1; }
        .orr__clear:hover {
          background: color-mix(in srgb, var(--color-nebula) 22%, transparent);
          border-color: var(--color-nebula);
          color: var(--color-moonlight);
        }
        .orr__clear:focus-visible {
          outline: 2px solid var(--color-nebula);
          outline-offset: 3px;
        }
        .orr__clear:active { background: color-mix(in srgb, var(--color-nebula) 30%, transparent); }

        @media (prefers-reduced-motion: reduce) {
          .orr__arm,
          .orr__unspin { animation: none; }
        }
      `}</style>
    </section>
  );
}

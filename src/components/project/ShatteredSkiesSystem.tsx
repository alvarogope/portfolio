"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { planetById, type PlanetId } from "@/content/shattered-skies-planets";
import PlanetOrrery from "./PlanetOrrery";

export default function ShatteredSkiesSystem({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState<PlanetId | null>(null);
  const [selected, setSelected] = useState<PlanetId | null>(null);
  const active = preview ?? selected;
  const pinned = selected ? planetById[selected] : null;

  const select = useCallback((id: PlanetId | null, viaPointer = true) => {
    setSelected(id);
    if (!id || !viaPointer) return;
    const card = root.current?.querySelector(`.pd__card[data-planet="${id}"]`);
    if (!card) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() => {
      card.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "center" });
    });
  }, []);

  useEffect(() => {
    if (!selected) return;
    const onPointerDown = (event: PointerEvent) => {
      if (root.current?.contains(event.target as Node)) return;
      setSelected(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [selected]);

  return (
    <div className="sss" ref={root} data-active-planet={active ?? undefined}>
      <PlanetOrrery
        active={active}
        selected={selected}
        onPreview={setPreview}
        onSelect={select}
      />

      {children}

      {pinned && (
        <div className="sss__pinned">
          <p className="sss__pinned-what">
            <span className="sss__pinned-tag" style={{ color: pinned.accent }}>
              {pinned.orbitLabel}
            </span>
            <span className="sss__pinned-name">{pinned.name}</span>
            <span className="sss__pinned-note">is pinned — the other worlds are dimmed</span>
            <span className="sss__pinned-gate" data-gate={pinned.access.gate}>
              {pinned.access.label}
            </span>
          </p>
          <button type="button" className="sss__clear" onClick={() => setSelected(null)}>
            <span className="sss__clear-x" aria-hidden>
              ✕
            </span>
            Clear selection
          </button>
        </div>
      )}

      <style>{`
        .sss__pinned {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem 1.25rem;
          margin-top: 1.25rem;
          padding: 0.85rem 1.1rem;
          border: 1px solid color-mix(in srgb, var(--color-mist) 24%, transparent);
          background: color-mix(in srgb, var(--color-nightfall) 45%, var(--color-void));
        }
        .sss__pinned-what {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 0.5rem 0.9rem;
          margin: 0;
          min-width: 0;
        }
        .sss__pinned-tag,
        .sss__pinned-note {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }
        .sss__pinned-note {
          color: color-mix(in srgb, var(--color-mist) 82%, var(--color-moonlight));
        }
        .sss__pinned-gate {
          padding: 0.1rem 0.5rem;
          border: 1px solid color-mix(in srgb, var(--sss-gate, var(--color-mist)) 55%, transparent);
          background: color-mix(in srgb, var(--sss-gate, var(--color-mist)) 10%, transparent);
          font-family: var(--font-mono);
          font-size: 0.71rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--sss-gate, var(--color-mist));
          white-space: nowrap;
        }
        .sss__pinned-gate[data-gate="orbital"] { --sss-gate: var(--color-silver); }
        .sss__pinned-gate[data-gate="gravity"] { --sss-gate: var(--color-gold); }
        .sss__pinned-gate[data-gate="open"] {
          --sss-gate: color-mix(in srgb, var(--color-mist) 82%, var(--color-moonlight));
        }
        .sss__pinned-name {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          line-height: 1;
          text-transform: uppercase;
          color: var(--color-moonlight);
        }
        .sss__clear {
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
        .sss__clear-x { font-size: 0.9rem; line-height: 1; }
        .sss__clear:hover {
          background: color-mix(in srgb, var(--color-nebula) 22%, transparent);
          border-color: var(--color-nebula);
          color: var(--color-moonlight);
        }
        .sss__clear:focus-visible {
          outline: 2px solid var(--color-nebula);
          outline-offset: 3px;
        }
        .sss__clear:active { background: color-mix(in srgb, var(--color-nebula) 30%, transparent); }
      `}</style>
    </div>
  );
}

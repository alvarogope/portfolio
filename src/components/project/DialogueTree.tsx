"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import DialogueAvatar from "./DialogueAvatar";

type Line = { prompt: string; answer: string };

const CHARS_PER_SEC = 47;

const MS_PER_CHAR = 1000 / CHARS_PER_SEC;

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReduced(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
const getReduced = () => window.matchMedia(REDUCED_QUERY).matches;

export default function DialogueTree({ lines }: { lines: Line[] }) {
  const [active, setActive] = useState<number>(0);
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, () => false);

  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      {/* Dialogue Options */}
      <div style={{ display: "grid", gap: "0.6rem" }}>
        {lines.map((line, i) => {
          const selected = i === active;
          return (
            <button
              key={line.prompt}
              onClick={() => setActive(i)}
              aria-pressed={selected}
              style={{
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.85rem 1.1rem",
                background: selected
                  ? "color-mix(in srgb, var(--color-gold) 10%, transparent)"
                  : "transparent",
                border: `1px solid ${
                  selected
                    ? "color-mix(in srgb, var(--color-gold) 55%, transparent)"
                    : "color-mix(in srgb, var(--color-mist) 22%, transparent)"
                }`,
                color: selected ? "var(--color-moonlight)" : "var(--color-mist)",
                cursor: "pointer",
                transition: "border-color 0.2s ease, background 0.2s ease, color 0.2s ease",
                fontFamily: "var(--font-body)",
                fontSize: "0.98rem",
              }}
            >
              <span style={{ flex: 1 }}>{line.prompt}</span>
              <span
                aria-hidden
                style={{
                  color: "var(--color-gold)",
                  opacity: selected ? 1 : 0,
                  transition: "opacity 0.2s ease",
                }}
              >
                ▸
              </span>
            </button>
          );
        })}
      </div>

      {/* Speaker and Reply */}
      <Exchange key={active} text={lines[active].answer} reduced={reduced} />

      <style>{`
        @keyframes dlgCursor { 0%, 49% { opacity: 1 } 50%, 100% { opacity: 0 } }

        /* A drawn block rather than a glyph: its size is exact, so it
           cannot overlap the character before it or shift with the
           font's own metrics the way a ▊ does. */
        .dlg-cursor {
          display: inline-block;
          width: 0.5em;
          height: 1.05em;
          vertical-align: -0.19em;
          margin-left: 0.06em;
          background: var(--color-gold);
          animation: dlgCursor 1s steps(1) infinite;
        }

        /* Speaker beside the reply; stacked once there is no room for
           the portrait to sit alongside without crushing the measure. */
        .dlg-exchange {
          display: grid;
          grid-template-columns: 9.5rem minmax(0, 1fr);
          align-items: flex-start;
          gap: 1.25rem;
        }
        .dlg-exchange > .panel {
          flex: 1;
          /* Without this a flex child refuses to shrink below its
             content's intrinsic width and the panel overflows. */
          min-width: 0;
        }

        /* The portrait remains coupled to the typewriter state, but gets
           a quiet inspect-screen alcove instead of floating unframed. */
        .dlg-avatar-alcove {
          min-height: 10.5rem;
          display: grid;
          place-items: center;
          align-content: center;
          gap: 0.65rem;
          padding: 1rem;
          border: 1px solid color-mix(in srgb, var(--color-mist) 27%, transparent);
          background:
            repeating-linear-gradient(
              0deg,
              color-mix(in srgb, var(--color-silver) 4%, transparent) 0,
              color-mix(in srgb, var(--color-silver) 4%, transparent) 1px,
              transparent 1px,
              transparent 5px
            ),
            radial-gradient(circle at 50% 40%, color-mix(in srgb, var(--color-gold) 12%, transparent), transparent 66%),
            var(--color-nightfall);
        }
        .dlg-avatar-alcove__label {
          color: var(--color-silver);
          font-family: var(--font-mono);
          font-size: 0.70rem;
          letter-spacing: 0.14em;
        }

        @media (max-width: 640px) {
          .dlg-exchange { grid-template-columns: 1fr; gap: 1rem; }
          .dlg-avatar-alcove { min-height: 0; }
          .dlg-exchange > .panel { width: 100%; }
        }

        @media (prefers-reduced-motion: reduce) {
          .dlg-cursor { animation: none; }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Exchange({ text, reduced }: { text: string; reduced: boolean }) {
  const [count, setCount] = useState(0);
  const frame = useRef(0);

  useEffect(() => {
    if (reduced) return;

    let start: number | null = null;
    let shown = 0;

    const run = (now: number) => {
      if (start === null) start = now;

      const target = Math.min(text.length, Math.floor((now - start) / MS_PER_CHAR) + 1);

      if (target !== shown) {
        shown = target;
        setCount(target);
      }

      if (shown >= text.length) return;
      frame.current = requestAnimationFrame(run);
    };

    frame.current = requestAnimationFrame(run);
    return () => cancelAnimationFrame(frame.current);
  }, [text, reduced]);

  const shown = reduced ? text.length : Math.min(count, text.length);
  const done = shown >= text.length;

  return (
    <div className="dlg-exchange">
      {/* Speaking Duration */}
      <div className="dlg-avatar-alcove">
        <DialogueAvatar speaking={!reduced && !done} />
      </div>

      <div
        className="panel"
        style={{
          border: "1px solid color-mix(in srgb, var(--color-mist) 20%, transparent)",
          borderLeft: "3px solid var(--color-gold)",
          padding: "clamp(1.5rem, 4vw, 2.25rem)",
          minHeight: "9rem",
        }}
      >
        <p style={{ margin: 0, lineHeight: 1.75, fontSize: "1.05rem" }}>
          {text.slice(0, shown)}
          {!done && (
            <>
              <span aria-hidden className="dlg-cursor" />
              <span aria-hidden style={{ visibility: "hidden" }}>
                {text.slice(shown)}
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

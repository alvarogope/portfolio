"use client";

import { useEffect, useRef, useState } from "react";

/* Shattered Skies' signature element. A terminal-styled panel whose
   content decodes from scrambled glyphs to readable text. Decodes on
   hover (desktop) and on scroll-into-view (mobile fallback, since
   touch has no hover). Green terminal text on near-black, a prompt,
   a blinking cursor, faint scanlines. This IS the game's distorted-
   communication mechanic as a UI object: clarity you reach for.
   Respects prefers-reduced-motion (shows readable text immediately). */

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>*#@%&";
const TERMINAL = "#5FD98A";

export default function TransmissionCard({
  label,
  body,
  delay = 0,
}: {
  label: string;
  body: string;
  delay?: number;
}) {
  const [display, setDisplay] = useState(body);
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<number>(0);

  const scramble = () => {
    if (done) return;
    let iteration = 0;
    let tick = 0;
    const total = body.length;
    const run = () => {
      if (tick % 6 === 0) {
        setDisplay(
          body
            .split("")
            .map((ch, i) => {
              if (ch === " " || ch === "\n") return ch;
              if (i < iteration) return body[i];
              return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            })
            .join("")
        );
        iteration += total / 80; 
      }
      tick++;
      if (iteration >= total) {
        setDisplay(body);
        setDone(true);
        return;
      }
      frame.current = requestAnimationFrame(run);
    };
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(run);
  };

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setDisplay(body);
      setDone(true);
      return;
    }
    // Start scrambled
    setDisplay(
      body.split("").map((ch) => (ch === " " || ch === "\n" ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])).join("")
    );
    // Decode automatically when scrolled into view. Each card owns its
    // own observer on its own element, so cards never trigger together.
    //
    // The bottom rootMargin is what keeps a *later* section from
    // decoding early: with a bare threshold, a short card fires the
    // moment 40% of it clears the viewport's bottom edge, which on a
    // tall display happens while the reader is still several sections
    // above. Pulling the bottom edge in by 22% means the card must be
    // genuinely on screen before it starts. The threshold is lowered to
    // 0.25 to compensate, so cards still fire reliably inside the
    // shortened box.
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(scramble, delay);
          obs.disconnect();
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -22% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [body]);

  return (
    <div
      ref={ref}
      style={{
        background: "#05080B",
        border: `1px solid color-mix(in srgb, ${TERMINAL} 30%, transparent)`,
        padding: "1.25rem 1.4rem 1.5rem",
        fontFamily: "var(--font-mono)",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
      }}
    >
      {/* faint scanlines */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, color-mix(in srgb, ${TERMINAL} 4%, transparent) 3px)`,
          pointerEvents: "none",
        }}
      />
      {/* prompt label */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.9rem", position: "relative" }}>
        <span style={{ color: TERMINAL, fontSize: "0.78rem", letterSpacing: "0.1em" }}>&gt;</span>
        <span style={{ color: TERMINAL, fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.85 }}>
          {label}
        </span>
        <span className="tc-cursor" style={{ color: TERMINAL, marginLeft: "auto" }}>▊</span>
      </div>
      {/* decoding body */}
      <p style={{ margin: 0, color: TERMINAL, fontSize: "0.95rem", lineHeight: 1.7, position: "relative", whiteSpace: "pre-wrap" }}>
        {display}
      </p>

      <style>{`
        @keyframes tcblink { 0%, 49% { opacity: 1 } 50%, 100% { opacity: 0 } }
        .tc-cursor { animation: tcblink 1s steps(1) infinite; }
        @media (prefers-reduced-motion: reduce) { .tc-cursor { animation: none } }
      `}</style>
    </div>
  );
}
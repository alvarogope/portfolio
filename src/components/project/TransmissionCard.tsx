"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>*#@%&";
const TERMINAL = "#5FD98A";

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const scrambled = (body: string) =>
  body
    .split("")
    .map((ch) => (ch === " " || ch === "\n" ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
    .join("");

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
    if (done || prefersReduced()) return;
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
    if (prefersReduced()) return;

    const seed = requestAnimationFrame(() => setDisplay(scrambled(body)));
    const el = ref.current;
    if (!el) return () => cancelAnimationFrame(seed);

    let decodeTimer = 0;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          decodeTimer = window.setTimeout(scramble, delay);
          obs.disconnect();
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -22% 0px" }
    );
    obs.observe(el);

    return () => {
      cancelAnimationFrame(seed);
      window.clearTimeout(decodeTimer);
      obs.disconnect();
    };
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
      {/* Scan */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, color-mix(in srgb, ${TERMINAL} 4%, transparent) 3px)`,
          pointerEvents: "none",
        }}
      />
      {/* Prompt Label */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.9rem", position: "relative" }}>
        <span style={{ color: TERMINAL, fontSize: "0.78rem", letterSpacing: "0.1em" }}>&gt;</span>
        <span style={{ color: TERMINAL, fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.85 }}>
          {label}
        </span>
        <span className="tc-cursor" style={{ color: TERMINAL, marginLeft: "auto" }}>▊</span>
      </div>
      {/* Decoding Body */}
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
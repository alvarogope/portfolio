"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>*#@";

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const scrambled = (text: string) =>
  text
    .split("")
    .map((ch) => (ch === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
    .join("");

export default function DecryptText({
  text,
  trigger = "view",
  as: Tag = "span",
  style,
  className,
}: {
  text: string;
  trigger?: "view" | "hover";
  as?: "span" | "p" | "h2" | "h3";
  style?: React.CSSProperties;
  className?: string;
}) {
  const [display, setDisplay] = useState(text);
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<number>(0);

  const scramble = () => {
    if (done || prefersReduced()) return;
    let iteration = 0;
    const total = text.length;

    const run = () => {
      setDisplay(
        text
          .split("")
          .map((ch, i) => {
            if (ch === " ") return " ";
            if (i < iteration) return text[i];
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("")
      );

      iteration += total / 24;
      if (iteration >= total) {
        setDisplay(text);
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

    const seed = requestAnimationFrame(() => setDisplay(scrambled(text)));

    const el = trigger === "view" ? ref.current : null;
    if (!el) return () => cancelAnimationFrame(seed);

    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          scramble();
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);

    return () => {
      cancelAnimationFrame(seed);
      obs.disconnect();
    };
  }, [text]);

  return (
    <Tag
      ref={ref as React.RefObject<HTMLElement> & React.RefObject<HTMLDivElement>}
      className={className}
      style={style}
      onMouseEnter={trigger === "hover" ? scramble : undefined}
    >
      {display}
    </Tag>
  );
}
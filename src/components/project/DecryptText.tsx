"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>*#@";

export default function DecryptText({
  text,
  trigger = "view", // "view" = decrypt on scroll-in, "hover" = decrypt on hover
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
    if (done) return;
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

      iteration += total / 24; // resolve over ~24 frames
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
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setDisplay(text);
      setDone(true);
      return;
    }

    // Start scrambled
    setDisplay(
      text.split("").map((ch) => (ch === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])).join("")
    );

    if (trigger === "view") {
      const el = ref.current;
      if (!el) return;
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
      return () => obs.disconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>*#@%&";

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

const isGap = (ch: string) => ch === " " || ch === "\n" || ch === "\t";

const useClaimEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function DecodeOnView({
  text,
  delay = 0,
  className,
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useClaimEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      delete el.dataset.decodePending;
      return;
    }

    let frame = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const paint = (resolved: number) => {
      el.textContent = text
        .split("")
        .map((ch, i) => (isGap(ch) || i < resolved ? ch : randomGlyph()))
        .join("");
    };

    const restore = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      if (timer !== null) clearTimeout(timer);
      timer = null;
      el.textContent = text;
      delete el.dataset.decoding;
      delete el.dataset.decodePending;
    };

    const decode = () => {
      let resolved = 0;
      let tick = 0;
      const step = text.length / 80;

      const run = () => {
        if (tick % 6 === 0) {
          paint(resolved);
          resolved += step;
        }
        tick++;
        if (resolved >= text.length) {
          el.textContent = text;
          delete el.dataset.decoding;
          return;
        }
        frame = requestAnimationFrame(run);
      };
      frame = requestAnimationFrame(run);
    };

    el.dataset.decoding = "true";
    paint(0);
    delete el.dataset.decodePending;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        timer = setTimeout(decode, delay);
      },
      { rootMargin: "0px 0px -15% 0px" }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      restore();
    };
  }, [text, delay]);

  return (
    <span
      ref={ref}
      data-decode-pending=""
      className={className ? `decode-cursor ${className}` : "decode-cursor"}
    >
      {text}
    </span>
  );
}

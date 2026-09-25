"use client";

import { useEffect } from "react";

const PROBE_STEPS = [0, 0.15, 0.3, 0.45] as const;

const DEAD_ZONE_PX = 2;

const SETTLE_MS = 150;

export default function PreserveScrollOnResize() {
  useEffect(() => {
    const locked = () => document.body.style.overflow === "hidden";

    const headerHeight = () =>
      document.querySelector("header")?.getBoundingClientRect().height ?? 0;

    let anchor: { el: Element; top: number } | null = null;
    let restoring = false;
    let frame = 0;
    let settle = 0;
    let lastW = window.innerWidth;
    let lastH = window.innerHeight;

    const capture = () => {
      if (restoring || locked()) return;

      const vh = window.innerHeight;
      const x = Math.round(window.innerWidth / 2);
      const start = headerHeight() + 8;

      for (const step of PROBE_STEPS) {
        const y = Math.round(start + vh * step);
        if (y >= vh) break;

        const el = document.elementFromPoint(x, y);
        if (!el || el === document.body || el === document.documentElement) continue;

        const rect = el.getBoundingClientRect();
        if (rect.height > 0 && rect.height <= vh * 2) {
          anchor = { el, top: rect.top };
          return;
        }
      }
    };

    const restore = () => {
      if (!anchor || locked()) return;
      if (!anchor.el.isConnected) {
        anchor = null;
        return;
      }

      const delta = anchor.el.getBoundingClientRect().top - anchor.top;
      if (!Number.isFinite(delta) || Math.abs(delta) < DEAD_ZONE_PX) return;

      restoring = true;
      window.scrollBy({ top: delta, left: 0, behavior: "instant" });

      requestAnimationFrame(() => {
        restoring = false;
      });
    };

    const onScroll = () => {
      if (restoring || frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        capture();
      });
    };

    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w === lastW && h === lastH) return;
      lastW = w;
      lastH = h;

      restore();

      window.clearTimeout(settle);
      settle = window.setTimeout(restore, SETTLE_MS);
    };

    const initial = requestAnimationFrame(capture);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(initial);
      if (frame) cancelAnimationFrame(frame);
      window.clearTimeout(settle);
    };
  }, []);

  return null;
}
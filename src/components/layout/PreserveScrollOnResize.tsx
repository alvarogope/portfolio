"use client";

import { useEffect } from "react";

/* ============================================
   KEEP THE READER WHERE THEY WERE ACROSS A RESIZE

   THE BUG. Snap a window to half the screen and you land thousands of pixels
   from what you were reading. Measured on the built site, wide (1600px) →
   narrow (800px), from three depths on each project page:

     page              document height      worst drift
     /break-in         23,214 → 35,334 px   10,029 px  (28% of the page)
     /shattered-skies  27,458 → 33,554 px    5,902 px  (18%)
     /moon-knight      28,917 → 34,876 px    3,723 px  (11%)
     /seeds-of-tomorrow 11,114 → 15,604 px   1,430 px  (9%)

   THE CAUSE IS NOT A BUG IN OUR CODE. `window.scrollY` was byte-identical
   before and after every one of those resizes — nothing here scrolls the page.
   The scroll indicators (`useScrollProgress`, `MoonProgress`) only ever READ
   scrollY; the WebGL backdrops are `position: absolute` and out of flow; the
   plates all reserve their box with `aspect-ratio`, so nothing shifts as images
   load.

   What happens is ordinary reflow, at a scale these pages make brutal. Narrow
   the viewport and every `repeat(auto-fit, minmax(…))` grid drops from two
   columns to one, so the pages get 20–50% TALLER. The browser keeps scrollY —
   a pixel offset — constant, and on a 35,000px page that offset now points at
   completely different content.

   THE FIX. Keep tracking what the reader is actually looking at, and put it
   back after the reflow:

     · On scroll (rAF-throttled), remember the element under a probe point just
       below the sticky header, and how far down the viewport its top edge sits.
     · On resize, reflow has already happened by the time the event fires — so
       do NOT re-capture. Measure how far the remembered element moved and
       scroll by exactly that, which returns it to the offset it had.

   `behavior: "instant"` matters: `html { scroll-behavior: smooth }` in
   globals.css would otherwise ANIMATE every correction, turning a drag-resize
   into a slide. Same reason `ScrollToTop` passes it.

   WHY elementFromPoint AND NOT THE SECTION IDS. The ids are the thing a reader
   navigates by, but they are thousands of pixels apart — anchoring to one is
   accurate to the section, not to the paragraph. The element under the probe
   point is usually the very `<p>` or `<figure>` being read, which is as close
   to "roughly where they were" as this can get.
   ============================================ */

/** How far below the sticky header to probe, and how far down to keep trying. */
const PROBE_STEPS = [0, 0.15, 0.3, 0.45] as const;

/** Ignore a correction this small — it is rounding, not a jump. */
const DEAD_ZONE_PX = 2;

/** Re-run after the dust (late images, observers, font metrics) settles. */
const SETTLE_MS = 150;

export default function PreserveScrollOnResize() {
  useEffect(() => {
    /* The Lightbox pins the body while it is open. Correcting a scroll that
       cannot move is pointless, and restoring against a locked body would
       fight it. */
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
        /* Skip anything taller than two screens: a probe that lands in a
           container's padding returns the container, and pinning the top of a
           20,000px wrapper says nothing about where inside it the reader was.
           Step further down the viewport and try for something smaller. */
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

      /* Clearing on the next frame rather than synchronously: the scroll event
         our own correction fires must not be mistaken for the reader scrolling
         and re-capture a new anchor mid-resize. */
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

      /* A drag-resize fires a storm of these and each one gets a correction,
         which is what makes the content look pinned while the window moves.
         The trailing call catches whatever finished reflowing after the last
         event — images decoding at their new size, a grid settling. */
      window.clearTimeout(settle);
      settle = window.setTimeout(restore, SETTLE_MS);
    };

    /* One capture up front, so a resize that happens before the reader has
       scrolled at all still has something to hold on to. */
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

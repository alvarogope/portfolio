"use client";

import { useSyncExternalStore } from "react";

/* Shared scroll-progress logic for every per-project indicator.
   Returns progress 0..1 and whether reduced-motion is on. Each
   project's indicator is a thin visual layer over this.

   Both values are read straight from the browser through
   useSyncExternalStore rather than mirrored into state by an effect:
   it subscribes and cleans up on its own, and it gives the server a
   defined starting point (0 / no preference) instead of a first render
   that disagrees with the client. */

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange);
  return () => {
    window.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
  };
}

function getProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollable <= 0) return 0;
  return Math.min(1, Math.max(0, window.scrollY / scrollable));
}

function subscribeReduced(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getReduced() {
  return window.matchMedia(REDUCED_QUERY).matches;
}

export function useScrollProgress() {
  const progress = useSyncExternalStore(subscribeScroll, getProgress, () => 0);
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, () => false);

  return { progress, reduced };
}

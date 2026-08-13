"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

// If the browser can't tell us or the observer never fires (layout
// not settled yet, tab backgrounded, etc.), reveal anyway after this
// long so content is never stuck invisible.
const FAIL_OPEN_MS = 1500;

/* Reduced-motion is browser state, so it is read through a
   subscription rather than mirrored into React state by an effect —
   that mirroring is what made this component set state directly in an
   effect body. */
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReduced(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

const getReduced = () => window.matchMedia(REDUCED_QUERY).matches;

export default function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, () => false);

  useEffect(() => {
    // Under reduced motion the element renders with no inline style at
    // all (see below), so it is already visible and there is nothing to
    // observe for.
    if (reduced) return;

    const reveal = () => setShown(true);

    // Belt-and-suspenders: whatever else happens, don't leave the
    // section invisible forever.
    const failOpenTimer = window.setTimeout(reveal, FAIL_OPEN_MS);

    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      // No element to observe, or the browser doesn't support
      // IntersectionObserver — fail open on the next tick rather than
      // stay hidden. Deferred by a timer so this is a callback rather
      // than a synchronous set during the effect body.
      const immediate = window.setTimeout(reveal, 0);
      return () => {
        window.clearTimeout(failOpenTimer);
        window.clearTimeout(immediate);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          observer.disconnect();
          window.clearTimeout(failOpenTimer);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      window.clearTimeout(failOpenTimer);
    };
  }, [reduced]);

  return (
    <div
      ref={ref}
      style={
        reduced
          ? undefined
          : {
              opacity: shown ? 1 : 0,
              transform: shown ? "translateY(0)" : "translateY(22px)",
              transition: `opacity 0.55s var(--ease-soft, ease), transform 1s var(--ease-soft, ease)`,
              transitionDelay: `${delay}ms`,
            }
      }
    >
      {children}
    </div>
  );
}

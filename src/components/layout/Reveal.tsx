"use client";

import { useEffect, useRef, useState } from "react";

// If the browser can't tell us or the observer never fires (layout
// not settled yet, tab backgrounded, etc.), reveal anyway after this
// long so content is never stuck invisible.
const FAIL_OPEN_MS = 1500;

export default function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setReduced(true);
      setShown(true);
      return;
    }

    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      // No element to observe, or the browser doesn't support
      // IntersectionObserver — fail open rather than stay hidden.
      setShown(true);
      return;
    }

    const reveal = () => setShown(true);

    // Belt-and-suspenders: whatever else happens, don't leave the
    // section invisible forever.
    const failOpenTimer = window.setTimeout(reveal, FAIL_OPEN_MS);

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
  }, []);

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

"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const FAIL_OPEN_MS = 1500;

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
    if (reduced) return;

    const reveal = () => setShown(true);

    const failOpenTimer = window.setTimeout(reveal, FAIL_OPEN_MS);

    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
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

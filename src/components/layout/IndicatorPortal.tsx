"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

const noopSubscribe = () => () => {};

const THEMED_VARS = [
  "--color-void",
  "--color-nightfall",
  "--color-moonlight",
  "--color-mist",
  "--color-silver",
  "--color-gold",
  "--color-scarlet",
  "--color-emerald",
];

export function railStyle(height: number): React.CSSProperties {
  return {
    position: "fixed",
    left: "var(--rail-left, 1.5rem)",
    top: "50%",
    transform: "translateY(-50%)",
    height,
    width: 28,
    zIndex: 40,
    pointerEvents: "none",
    display: "flex",
    justifyContent: "center",
  };
}

export default function IndicatorPortal({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  const anchorRef = useRef<HTMLSpanElement>(null);

  const [host] = useState<HTMLDivElement | null>(() =>
    typeof document === "undefined" ? null : document.createElement("div")
  );

  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );

  useEffect(() => {
    if (!host) return;
    host.setAttribute("data-scroll-indicator", name);
    document.body.appendChild(host);
    return () => host.remove();
  }, [host, name]);

  useEffect(() => {
    const anchor = anchorRef.current;
    if (!host || !anchor) return;

    const computed = getComputedStyle(anchor);
    for (const name of THEMED_VARS) {
      const value = computed.getPropertyValue(name).trim();
      if (value) host.style.setProperty(name, value);
    }
  }, [host]);

  return (
    <>
      <span
        ref={anchorRef}
        aria-hidden
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden", pointerEvents: "none" }}
      />
      {hydrated && host && createPortal(children, host)}
    </>
  );
}

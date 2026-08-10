"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

/* Shared plumbing for the per-project scroll indicators.

   Every indicator is position: fixed, and a transformed ancestor
   (<Reveal> sets transform) becomes the containing block for fixed
   descendants — which pins them to the wrong box. So each indicator is
   portalled to <body> to escape that.

   Portalling also lifts the element out of the project's scoped layout
   <div>, which is exactly where the palette overrides live. Custom
   properties inherit down the DOM tree, not the React tree, so the
   theme has to be carried across the boundary by hand. SeedsAudio
   already does this for its transport bar; this centralises the trick
   so all four indicators share it. */

/* Nothing to subscribe to — this store only ever reports whether we are
   past hydration, so the subscribe callback is a no-op. */
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

/* The shared rail every edge indicator sits on: left edge, vertically
   centred, non-interactive. z-index 40 keeps it under the sticky site
   header (50) and under Seeds' transport bar (45), so it can never
   paint over either. Centring vertically also keeps it clear of that
   bar's lane at the foot of the viewport. */
export function railStyle(height: number): React.CSSProperties {
  return {
    position: "fixed",
    // Tucks closer to the edge on narrow viewports; see globals.css.
    left: "var(--rail-left, 1.5rem)",
    top: "50%",
    transform: "translateY(-50%)",
    height,
    width: 20,
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
  /* Tags the portal host in the DOM, so the indicator is identifiable
     once it has been lifted out of the React tree. */
  name: string;
  children: React.ReactNode;
}) {
  // Stays behind in the themed subtree, purely to read the resolved
  // palette from. Zero-sized, so it never affects layout.
  const anchorRef = useRef<HTMLSpanElement>(null);

  const [host] = useState<HTMLDivElement | null>(() =>
    typeof document === "undefined" ? null : document.createElement("div")
  );

  /* The portal must not render during hydration: the server emits
     nothing for it, so portalling on the first client render is a
     mismatch and React throws out the tree. This reports false through
     hydration and true immediately after, without a setState in an
     effect. */
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

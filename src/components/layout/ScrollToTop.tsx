"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/* ============================================
   SCROLL RESET ON ROUTE CHANGE

   App Router keeps the scroll position when the
   incoming page is already visible in the viewport,
   so navigating from halfway down a project page
   lands halfway down the next one. Reset it.
   ============================================ */

export default function ScrollToTop() {
  const pathname = usePathname();
  const previous = useRef<string | null>(null);

  useEffect(() => {
    const isFirstRun = previous.current === null;
    const changed = previous.current !== pathname;
    previous.current = pathname;

    // Leave the initial load to the browser: hash deep links and
    // scroll restoration on refresh should still work. The `changed`
    // guard also absorbs StrictMode's double-invoked mount effect.
    if (isFirstRun || !changed) return;

    // An in-page anchor owns its own scroll target.
    if (window.location.hash) return;

    // `instant` overrides `html { scroll-behavior: smooth }` in globals.css —
    // without it every navigation animates a long scroll back to the top.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

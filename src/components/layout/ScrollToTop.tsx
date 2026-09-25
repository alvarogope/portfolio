"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();
  const previous = useRef<string | null>(null);

  useEffect(() => {
    const isFirstRun = previous.current === null;
    const changed = previous.current !== pathname;
    previous.current = pathname;

    if (isFirstRun || !changed) return;

    if (window.location.hash) return;

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

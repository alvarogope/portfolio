"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A short, silent gameplay loop, sized and framed exactly like an image slot.
 *
 * WHY IT DOES NOT USE THE `autoPlay` ATTRIBUTE.
 *
 * `prefers-reduced-motion` cannot be expressed in CSS for video playback — a
 * media query can stop an animation, but it cannot stop a decoding video. If
 * the element carries `autoPlay`, a reduced-motion visitor gets the loop
 * playing on first paint and we can only pause it a frame later, which is
 * precisely the flash of motion the setting exists to prevent.
 *
 * So playback is started from the effect instead, and only when the query says
 * motion is welcome. Everyone else gets the first frame as a still (that is
 * what `preload="metadata"` buys) plus native controls, so the loop is offered
 * rather than imposed. The query is watched, not just read once: a visitor who
 * flips the OS setting with the page open gets the new behaviour immediately.
 *
 * `muted` is not decoration either. Every one of these clips is silent by
 * design, and an unmuted video is not allowed to autoplay at all.
 */
export default function LoopingVideo({
  src,
  label,
  aspect = "16 / 9",
  radius = "2px",
}: {
  src: string;
  /** Accessible name. Describe what the loop shows, as you would alt text. */
  label: string;
  aspect?: string;
  radius?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const apply = () => {
      const v = ref.current;
      setReduced(mq.matches);
      if (!v) return;
      if (mq.matches) {
        v.pause();
        v.currentTime = 0;
      } else {
        /* Rejected play() is not an error worth surfacing: a browser that
           blocks it leaves the first frame on screen, which is the same
           fallback reduced motion gets. */
        void v.play().catch(() => {});
      }
    };

    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        aspectRatio: aspect,
        overflow: "hidden",
        borderRadius: radius,
        border: "1px solid color-mix(in srgb, var(--color-mist) 20%, transparent)",
        background: "color-mix(in srgb, var(--color-nightfall) 55%, transparent)",
      }}
    >
      <video
        ref={ref}
        src={src}
        aria-label={label}
        loop
        muted
        playsInline
        preload="metadata"
        controls={reduced}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  );
}

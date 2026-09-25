"use client";

import { useEffect, useRef, useState } from "react";

export default function LoopingVideo({
  src,
  label,
  aspect = "16 / 9",
  radius = "2px",
}: {
  src: string;
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

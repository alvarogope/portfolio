"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { HeroSlide } from "./hero-slides";

const FADE_IN = 1800;
const HOLD = 5200;
const FADE_OUT = 1600;
const BLACK = 900;

type Phase = "pending" | "lit" | "fading";

const REDUCED = "(prefers-reduced-motion: reduce)";

function subscribeReduced(onChange: () => void) {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
const getReduced = () => window.matchMedia(REDUCED).matches;
const getServerReduced = () => true;

export default function HeroBackdrop({ slides }: { slides: HeroSlide[] }) {
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, getServerReduced);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("pending");
  const [loaded, setLoaded] = useState<ReadonlySet<number>>(() => new Set());
  const [furthest, setFurthest] = useState(0);

  const count = slides.length;
  const next = (index + 1) % count;
  const ready = loaded.has(index);

  useEffect(() => {
    if (reduced || count < 2) return;

    let raf1 = 0;
    let raf2 = 0;
    let timer = 0;

    if (phase === "pending") {
      if (!ready) return;
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setPhase("lit"));
      });
    } else if (phase === "lit") {
      timer = window.setTimeout(() => setPhase("fading"), FADE_IN + HOLD);
    } else {
      timer = window.setTimeout(() => {
        setIndex(next);
        setFurthest((f) => Math.max(f, next));
        setPhase("pending");
      }, FADE_OUT + BLACK);
    }

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.clearTimeout(timer);
    };
  }, [reduced, count, phase, ready, next]);

  const isMounted = (i: number) =>
    i <= furthest || i === index || (!reduced && i === next && phase !== "pending");

  const current = slides[index];

  return (
    <div className="hb">
      <div className="hb-layer" aria-hidden>
        {slides.map((slide, i) => (
          <div
            key={slide.src}
            className="hb-slide"
            data-lit={i === index && phase === "lit" ? "" : undefined}
          >
            {isMounted(i) && (
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="100vw"
                preload={i === 0}
                loading={i === 0 ? undefined : "eager"}
                fetchPriority={i === 0 ? undefined : "low"}
                style={{ objectFit: "cover", objectPosition: slide.position }}
                onLoad={() => setLoaded((prev) => new Set(prev).add(i))}
              />
            )}
            {slide.shade > 0 && (
              <div
                className="hb-shade"
                style={{
                  background: `color-mix(in srgb, var(--color-void) ${Math.round(slide.shade * 100)}%, transparent)`,
                }}
              />
            )}
          </div>
        ))}

        <div className="hb-scrim" />

        <p className="hb-caption" data-lit={phase === "lit" ? "" : undefined}>
          {current.project}
        </p>
      </div>

      <noscript>
        <style>{`.hb-slide:first-child { opacity: 1; }`}</style>
      </noscript>

      <style>{`
        .hb {
          position: absolute;
          inset: 0;
          background: var(--color-void);
        }
        .hb-layer {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        /* Out: the rule on the resting state, so losing data-lit fades over
           FADE_OUT. In: the rule on the lit state, so gaining it fades over
           FADE_IN. A transition always takes the timing of the state it is
           heading into. */
        .hb-slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity ${FADE_OUT}ms cubic-bezier(0.4, 0, 0.7, 0.2);
        }
        .hb-slide[data-lit] {
          opacity: 1;
          transition: opacity ${FADE_IN}ms cubic-bezier(0.25, 0.1, 0.25, 1);
        }
        /* Pulled toward the cool palette: every frame here was graded for
           its own game, not for a void-blue site. */
        .hb-slide img { filter: saturate(0.82); }
        .hb-shade { position: absolute; inset: 0; }

        /* The copy sits on the left, so the scrim is anchored in pixels from
           the left edge rather than in percent: the text block is the same
           width on every desktop, and a percentage would thin out under the
           subline on narrower screens. Plus a floor that hands the hero to
           the void bands below, and a lid under the sticky header. */
        .hb-scrim {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg,
              color-mix(in srgb, var(--color-void) 92%, transparent) 0px,
              color-mix(in srgb, var(--color-void) 84%, transparent) 540px,
              color-mix(in srgb, var(--color-void) 50%, transparent) 860px,
              color-mix(in srgb, var(--color-void) 12%, transparent) 1240px,
              transparent 100%),
            linear-gradient(0deg, var(--color-void) 0%, transparent 30%),
            linear-gradient(180deg, color-mix(in srgb, var(--color-void) 45%, transparent) 0%, transparent 18%);
        }

        .hb-caption {
          position: absolute;
          right: 32px;
          bottom: 32px;
          margin: 0;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: var(--color-silver);
          opacity: 0;
          transition: opacity ${FADE_OUT}ms ease;
        }
        .hb-caption[data-lit] {
          opacity: 0.85;
          transition: opacity ${FADE_IN}ms ease;
        }

        /* Narrow: the copy moves to the bottom and spans the width, so the
           scrim turns vertical, and the caption goes to the top corner,
           out of the copy's way. */
        @media (max-width: 720px) {
          .hb-scrim {
            background:
              linear-gradient(0deg,
                var(--color-void) 0%,
                color-mix(in srgb, var(--color-void) 88%, transparent) 30%,
                color-mix(in srgb, var(--color-void) 55%, transparent) 62%,
                color-mix(in srgb, var(--color-void) 35%, transparent) 100%);
          }
          .hb-caption { top: 24px; bottom: auto; right: 20px; font-size: 10px; letter-spacing: 0.22em; }
        }

        /* One still image, no cycle, no fade. */
        @media (prefers-reduced-motion: reduce) {
          .hb-slide,
          .hb-slide[data-lit],
          .hb-caption,
          .hb-caption[data-lit] { transition: none; }
          .hb-slide:first-child { opacity: 1; }
          .hb-slide:not(:first-child) { display: none; }
          .hb-caption { display: none; }
        }
      `}</style>
    </div>
  );
}
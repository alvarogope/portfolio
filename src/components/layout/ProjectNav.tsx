"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type PointerEvent,
} from "react";
import { createPortal } from "react-dom";
import { HOME_NAV_ITEM, type ProjectNavItem } from "@/content/games";

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

/* WHERE THE GUTTER IS ACTUALLY BIG ENOUGH, which is the whole argument for
   this number. It was 1560px, and at 1560px a 207px rail does not fit beside
   a centred 68rem column: the column's right edge lands at 1365 and the rail
   starts at 1331, so the rail was not in the gutter at all — it was standing
   on the last 34px of the column, over the plate bands and any panel that
   spans it. The column clears the rail, with the 2rem of air the gutter
   tokens ask for, from 1782px up; 1800 is that with a round number's worth
   of slack.

   What it costs: between 1560 and 1800 the nav is the in-flow list at the
   foot of the page, which is the fallback this component already ships and
   the only honest answer at a width where the rail has nowhere to stand.

   KEEP IN STEP WITH `--rail-claim`'s QUERY IN globals.css: below this width
   the rail claims no gutter and the wide consoles spend the whole of it. */
const RAIL_QUERY = "(min-width: 1800px)";

function subscribeMedia(query: string) {
  return (onChange: () => void) => {
    const mediaQuery = window.matchMedia(query);
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  };
}

const subscribeReduced = subscribeMedia(REDUCED_QUERY);
const subscribeRail = subscribeMedia(RAIL_QUERY);

function getReduced() {
  return typeof window !== "undefined" && window.matchMedia(REDUCED_QUERY).matches;
}

function getRail() {
  return typeof window !== "undefined" && window.matchMedia(RAIL_QUERY).matches;
}

const THEMED_VARS = [
  "--color-void",
  "--color-nightfall",
  "--color-moonlight",
  "--color-mist",
  "--color-silver",
  "--font-mono",
  "--font-body",
];

/* The deep-dive glyph, shared by both projects that have one: an open book,
   one leaf solid and one drawn, so it reads at 1.25em without detail. */
const BOOK = (
  <>
    <path d="M3.6 5.2h5.6c1.5 0 2.8 1 2.8 2.2v11.4c0-.9-1.1-1.6-2.6-1.6H3.6V5.2Z" fill="currentColor" />
    <path
      d="M20.4 5.2h-5.6c-1.5 0-2.8 1-2.8 2.2v11.4c0-.9 1.1-1.6 2.6-1.6h5.8V5.2Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </>
);

const ICONS: Record<string, React.ReactNode> = {

  /* Four tiles for four worlds — the index, drawn as what it contains. */
  home: (
    <>
      <rect x="3.4" y="3.4" width="7.2" height="7.2" fill="currentColor" />
      <rect x="13.4" y="3.4" width="7.2" height="7.2" fill="currentColor" />
      <rect x="3.4" y="13.4" width="7.2" height="7.2" fill="currentColor" />
      <rect x="13.4" y="13.4" width="7.2" height="7.2" fill="currentColor" />
    </>
  ),

  "moon-knight": (
    <path
      d="M15.6 3.2a9 9 0 1 0 5.2 12.9A10.5 10.5 0 0 1 15.6 3.2Z"
      fill="currentColor"
    />
  ),

  "shattered-skies": (
    <>
      <circle cx="12" cy="12" r="5.2" fill="currentColor" />
      <ellipse
        cx="12"
        cy="12"
        rx="10.4"
        ry="3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        transform="rotate(-22 12 12)"
      />
    </>
  ),

  "break-in": (
    <>
      <circle cx="12" cy="9.6" r="3.6" fill="currentColor" />
      <path d="M9.7 13.2h4.6l1.5 7.4H8.2l1.5-7.4Z" fill="currentColor" />
    </>
  ),

  "seeds-of-tomorrow": (
    <>
      <path d="M12 21V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M12 12.4C12 8.9 9.4 6.2 5.8 6.2c0 3.5 2.6 6.2 6.2 6.2Z"
        fill="currentColor"
      />
      <path
        d="M12 10.6c0-3.1 2.3-5.6 5.5-5.6 0 3.1-2.3 5.6-5.5 5.6Z"
        fill="currentColor"
      />
    </>
  ),

  /* ---- the subpage rows. `slug` is an icon key here, not a route. ---- */

  "moon-knight-world": BOOK,

  /* Angle brackets: the write-up about code. */
  "moon-knight-engineering": (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.1 6.3 3.7 12l5.4 5.7" />
      <path d="M14.9 6.3 20.3 12l-5.4 5.7" />
    </g>
  ),

  /* Two crossed orbits round a nucleus — the toolkit's own subject. */
  "moon-knight-quantum": (
    <>
      <circle cx="12" cy="12" r="2.1" fill="currentColor" />
      <ellipse
        cx="12"
        cy="12"
        rx="9.6"
        ry="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        transform="rotate(32 12 12)"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="9.6"
        ry="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        transform="rotate(-32 12 12)"
      />
    </>
  ),

};

type ProjectNavProps = {
  items: ProjectNavItem[];
  currentSlug: string;
  /** What the rail is a list OF. Subpage rails list one project's family. */
  kicker?: string;
  proximityRadius?: number;
  maxShift?: number;
  smoothing?: number;
};

type MotionValue = { proximity: number; shift: number };

const itemStyle = (accent: string) =>
  ({ "--accent-color": accent } as CSSProperties & Record<"--accent-color", string>);


export default function ProjectNav(props: ProjectNavProps) {
  const rail = useSyncExternalStore(subscribeRail, getRail, () => false);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [host] = useState<HTMLDivElement | null>(() =>
    typeof document === "undefined" ? null : document.createElement("div")
  );

  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    if (!host) return;
    host.setAttribute("data-project-nav", "");
    document.body.appendChild(host);
    return () => host.remove();
  }, [host]);

  useEffect(() => {
    const anchor = anchorRef.current;
    if (!host || !anchor) return;
    const computed = getComputedStyle(anchor);
    for (const name of THEMED_VARS) {
      const value = computed.getPropertyValue(name).trim();
      if (value) host.style.setProperty(name, value);
    }
  }, [host, rail]);

  const content = <NavContent {...props} rail={rail} />;

  return (
    <>
      <span
        ref={anchorRef}
        aria-hidden
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden", pointerEvents: "none" }}
      />
      {rail && hydrated && host ? createPortal(content, host) : !rail ? content : null}
    </>
  );
}

function NavContent({
  items,
  currentSlug,
  rail,
  kicker = "Go to other projects",
  proximityRadius = 180,
  maxShift = 16,
  smoothing = 9,
}: ProjectNavProps & { rail: boolean }) {
  const itemRefs = useRef(new Map<string, HTMLAnchorElement>());
  const current = useRef(new Map<string, MotionValue>());
  const targets = useRef(new Map<string, MotionValue>());
  const frame = useRef<number | null>(null);
  const previousTime = useRef<number | null>(null);
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, () => false);

  const resetMotion = useCallback(() => {
    items.forEach(({ slug }) => {
      targets.current.set(slug, { proximity: 0, shift: 0 });
      current.current.set(slug, { proximity: 0, shift: 0 });
      const element = itemRefs.current.get(slug);
      element?.style.setProperty("--line-proximity", "0");
      element?.style.setProperty("--line-shift", "0");
    });
  }, [items]);

  useEffect(() => {
    if (reduced) {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = null;
      previousTime.current = null;
      resetMotion();
      return;
    }

    const animate = (time: number) => {
      const elapsed = Math.min((time - (previousTime.current ?? time)) / 1000, 0.05);
      previousTime.current = time;
      const blend = 1 - Math.exp(-smoothing * elapsed);

      items.forEach(({ slug }) => {
        const target = targets.current.get(slug) ?? { proximity: 0, shift: 0 };
        const value = current.current.get(slug) ?? { proximity: 0, shift: 0 };
        value.proximity += (target.proximity - value.proximity) * blend;
        value.shift += (target.shift - value.shift) * blend;
        current.current.set(slug, value);

        const element = itemRefs.current.get(slug);
        element?.style.setProperty("--line-proximity", value.proximity.toFixed(3));
        element?.style.setProperty("--line-shift", value.shift.toFixed(2));
      });

      frame.current = requestAnimationFrame(animate);
    };

    frame.current = requestAnimationFrame(animate);
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = null;
      previousTime.current = null;
    };
  }, [items, reduced, resetMotion, smoothing]);

  const setTargetsFromPointer = (event: PointerEvent<HTMLElement>) => {
    if (reduced || event.pointerType !== "mouse") return;

    itemRefs.current.forEach((element, slug) => {
      const bounds = element.getBoundingClientRect();

      const x = bounds.left + bounds.width / 2;
      const y = bounds.top + bounds.height / 2;
      const distance = Math.hypot(event.clientX - x, event.clientY - y);
      const normalized = Math.max(0, 1 - distance / proximityRadius);

      const proximity = normalized ** 4;
      targets.current.set(slug, { proximity, shift: proximity * maxShift });
    });
  };

  const clearTargets = () => {
    if (reduced) return;
    items.forEach(({ slug }) => targets.current.set(slug, { proximity: 0, shift: 0 }));
  };

  const setFocusTarget = (slug: string, focused: boolean) => {
    if (reduced) return;
    const proximity = focused ? 1 : 0;
    targets.current.set(slug, { proximity, shift: proximity * maxShift });
  };

  return (
    <section
      className={`project-nav${rail ? " project-nav--rail" : " project-nav--flow"}`}
      aria-labelledby={`project-nav-${currentSlug}`}
    >
      <p id={`project-nav-${currentSlug}`} className="mono project-nav__kicker">
        {kicker}
      </p>
      <nav aria-label="Explore the project worlds">
        <ul
          className="project-nav__list"
          onPointerMove={setTargetsFromPointer}
          onPointerLeave={clearTargets}
        >
          {items.map((item) => {
            const active = item.slug === currentSlug;
            /* The index row is not one of the worlds, so it is ruled off
               from them rather than listed among them. */
            const isIndex = item.slug === HOME_NAV_ITEM.slug;

            return (
              <li
                key={item.slug}
                className={`project-nav__item${isIndex ? " project-nav__item--index" : ""}`}
                style={itemStyle(item.accent)}
              >
                <Link
                  ref={(element) => {
                    if (element) itemRefs.current.set(item.slug, element);
                    else itemRefs.current.delete(item.slug);
                  }}
                  href={item.href ?? `/${item.slug}`}
                  aria-current={active ? "page" : undefined}
                  className={`project-nav__link${active ? " is-active" : ""}`}
                  onFocus={() => setFocusTarget(item.slug, true)}
                  onBlur={() => setFocusTarget(item.slug, false)}
                >
                  <svg
                    className="project-nav__icon"
                    viewBox="0 0 24 24"
                    aria-hidden
                    focusable="false"
                  >
                    {ICONS[item.slug]}
                  </svg>
                  <span className="project-nav__marker" aria-hidden />
                  <span className="project-nav__label">{item.label}</span>
                  {active && <span className="project-nav__current">Active</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <style>{`
        .project-nav--flow {
          margin-top: clamp(4.5rem, 10vw, 8rem);
          padding-top: clamp(1.5rem, 4vw, 2.5rem);
          border-top: 1px solid color-mix(in srgb, var(--color-mist) 26%, transparent);
        }
        .project-nav__kicker {
          margin: 0 0 1.5rem;
          color: var(--color-mist);
          font-size: 0.69rem;
          letter-spacing: 0.16em;
        }
        .project-nav__list {
          display: grid;
          gap: 1.25rem;
          width: min(100%, 33rem);
          margin: 0;
          padding: 0;
          list-style: none;
        }
        /* The rule under the index row, in both forms. It is drawn on the
           <li> rather than the <a> so the gap between rows stays even —
           the border sits in the grid gap, not inside the link's hit area. */
        .project-nav__item--index {
          padding-bottom: 1.25rem;
          border-bottom: 1px solid color-mix(in srgb, var(--color-mist) 22%, transparent);
        }
        .project-nav__link {
          --line-proximity: 0;
          --line-shift: 0;
          display: grid;
          grid-template-columns: 1.9rem 3.75rem minmax(0, 1fr) auto;
          align-items: center;
          gap: 0.65rem;
          min-height: 3.6rem;
          padding: 0.55rem 0.75rem 0.55rem 0;
          transform: translateX(calc(var(--line-shift) * 1px));
          text-decoration: none;
          outline-offset: 4px;
        }
        .project-nav__icon,
        .project-nav__label {
          color: color-mix(
            in srgb,
            var(--color-mist) calc(100% - (var(--line-proximity) * 100%)),
            var(--accent-color)
          );
        }
        /* Sized in em so it tracks whatever the label is set to. */
        .project-nav__icon {
          width: 1.25em;
          height: 1.25em;
          justify-self: center;
        }
        .project-nav__marker {
          position: relative;
          width: 3.75rem;
          height: 1px;
          color: color-mix(
            in srgb,
            var(--color-mist) calc(100% - (var(--line-proximity) * 100%)),
            var(--accent-color)
          );
          background: currentColor;
        }
        .project-nav__marker::after {
          position: absolute;
          top: 50%;
          left: 0;
          width: 1px;
          height: 0.75rem;
          background: currentColor;
          content: "";
          transform: translateY(-50%) scaleY(0.5);
          transform-origin: center;
        }
        .project-nav__label {
          min-width: 0;
          font-family: var(--font-body);
          font-size: clamp(1.2rem, 1.05rem + 0.5vw, 1.4rem);
          line-height: 1.25;
        }
        .project-nav__current {
          margin-left: 1rem;
          color: var(--accent-color);
          font-family: var(--font-mono);
          font-size: 0.70rem;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }
        .project-nav__link.is-active .project-nav__marker {
          background: var(--accent-color);
          box-shadow: 0 0 0.8rem color-mix(in srgb, var(--accent-color) 38%, transparent);
        }
        .project-nav__link.is-active .project-nav__marker::after {
          background: var(--accent-color);
          transform: translateY(-50%) scaleY(1);
        }
        .project-nav__link:focus-visible .project-nav__index,
        .project-nav__link:focus-visible .project-nav__label { color: var(--accent-color); }
        .project-nav__link:focus-visible .project-nav__marker { background: var(--accent-color); }

        @media (max-width: 520px) {
          .project-nav__link { grid-template-columns: 1.6rem 2.1rem minmax(0, 1fr) auto; gap: 0.5rem; }
          .project-nav__marker { width: 2.1rem; }
          .project-nav__label { font-size: 1.15rem; }
          .project-nav__current { margin-left: 0.6rem; font-size: 0.68rem; }
        }

        /* ---- the rail ----------------------------------------------
           The left gutter already belongs to the per-project scroll
           indicator, so the rail lives in the right one, which is empty.
           It is portalled to <body>, so position: fixed genuinely pins
           to the viewport here.

           The rows slide LEFT on approach rather than right: the rail is
           against the right edge, so travelling inward is the motion
           that reads as reaching toward the reader. */
        .project-nav--rail {
          position: fixed;
          top: 50%;
          /* Centred within the right gutter: half the gutter, less half
             the rail's own width. It therefore tracks the viewport
             rather than hugging either the content or the edge.

             BOTH NUMBERS LIVE IN globals.css, under THE RIGHT GUTTER, and
             so does the breakpoint below. The wide consoles measure their
             right edge against the same three tokens, which is what keeps
             the rail off them — edit the geometry there, not here. */
          right: var(--rail-inset);
          z-index: 41;
          box-sizing: border-box;
          width: var(--rail-w);
          margin: 0;
          padding: 1.15rem 0.9rem;
          border: 1px solid color-mix(in srgb, var(--color-mist) 26%, transparent);
          background: color-mix(in srgb, var(--color-void) 88%, transparent);
          box-shadow: 0 0.8rem 2.4rem color-mix(in srgb, var(--color-void) 55%, transparent);
          backdrop-filter: blur(10px);
          transform: translateY(-50%);
        }
        .project-nav--rail .project-nav__kicker {
          margin-bottom: 1rem;
          font-size: 0.68rem;
          line-height: 1.5;
        }
        .project-nav--rail .project-nav__list { width: 100%; gap: 0.7rem; }
        .project-nav--rail .project-nav__item--index { padding-bottom: 0.7rem; }
        .project-nav--rail .project-nav__link {
          grid-template-columns: 1.4rem minmax(0, 1fr);
          gap: 0.55rem;
          min-height: 2.5rem;
          padding: 0;
          transform: translateX(calc(var(--line-shift) * -1px));
        }
        /* The horizontal marker would eat most of a 9.5rem rail, so in
           this form the tick becomes a vertical edge on the right — the
           same signal, turned to suit the orientation. */
        .project-nav--rail .project-nav__marker {
          position: absolute;
          top: 0.35rem;
          right: -0.9rem;
          bottom: 0.35rem;
          width: 2px;
          height: auto;
          opacity: calc(0.25 + var(--line-proximity) * 0.75);
        }
        .project-nav--rail .project-nav__marker::after { content: none; }
        .project-nav--rail .project-nav__link { position: relative; }
        /* The rail is a compact secondary nav in a 11.5rem column, so it
           runs a step below the flow variant's 1.4rem — at that size
           every label would wrap and the rail would tower. */
        .project-nav--rail .project-nav__label {
          overflow-wrap: anywhere;
          font-size: 1rem;
          line-height: 1.3;
        }
        .project-nav--rail .project-nav__current { display: none; }
        .project-nav--rail .project-nav__link.is-active .project-nav__marker {
          opacity: 1;
        }

        @media (prefers-reduced-motion: reduce) {
          .project-nav__link { transform: none; }
        }
      `}</style>
    </section>
  );
}

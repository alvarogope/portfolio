"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

/**
 * The shared image viewer. Every gallery on the site opens this one.
 *
 * WHY IT PORTALS, which is the whole bug it was written to fix.
 *
 * The old viewer was `position: fixed; inset: 0` rendered inline, right where
 * the gallery sits in the tree. That is correct CSS and it still failed,
 * because a fixed element resolves against the VIEWPORT only while none of its
 * ancestors carries a transform, filter or containment — any of those makes
 * that ancestor the containing block instead.
 *
 * Every section on every project page is wrapped in `Reveal`, and `Reveal`
 * keeps an inline `transform: translateY(0)` on the element permanently once
 * it has revealed (not just for the length of the animation). So the overlay
 * was being laid out inside the gallery's own box: near the bottom of the page
 * it opened mostly below the fold, and the controls under the image were cut
 * off entirely. The giveaway is that it behaved correctly under
 * prefers-reduced-motion, where `Reveal` sets no inline style at all and there
 * is no transform to trap it.
 *
 * The fix is to leave that subtree. This component mounts a host div as a
 * direct child of `document.body` and renders through it, so `fixed` resolves
 * against the viewport no matter where the trigger was.
 *
 * THEME TRAVELS WITH IT. The routes theme themselves in two different places:
 * Break-In and Shattered Skies put their colour tokens on `body` (so a body
 * portal inherits them), but every route puts `--font-display` / `--font-hero`
 * on a wrapper DIV inside the layout, which a body portal would escape. So the
 * host copies the resolved value of each token off the trigger element before
 * it is appended. The viewer opened from Moon-Knight is in Cinzel; the one
 * opened from Break-In is amber and Archivo; neither knows anything about the
 * other.
 *
 * WHY THE CONTROLS CANNOT BE CLIPPED ANY MORE. The old overlay was a column of
 * image + caption + button where the image alone was capped at 82vh, so the
 * three of them plus the padding always totalled more than the screen and the
 * button was pushed off the bottom — a second, independent bug that survived
 * even when the overlay was positioned correctly. This one is a three-row grid
 * (`auto 1fr auto`): the bar and the footer take the height they need first,
 * and the image gets exactly what is left. The image can never push a control
 * off screen because it is not what decides the layout.
 */

export interface LightboxItem {
  src: string;
  alt: string;
  caption?: string;
}

/* The tokens the host copies. Enumerated rather than discovered: iterating
   custom properties off a computed style is not portable, and this list is the
   project's whole palette (globals.css) plus everything the route layouts
   override. A token that is not set anywhere resolves to "" and is skipped. */
const THEME_TOKENS = [
  "--color-void",
  "--color-nightfall",
  "--color-moonlight",
  "--color-mist",
  "--color-silver",
  "--color-gold",
  "--color-scarlet",
  "--color-emerald",
  "--color-lunar-gold",
  "--color-rose-blood",
  "--color-nebula",
  "--font-display",
  "--font-hero",
  "--font-body",
  "--font-mono",
  "--ease-soft",
] as const;

function copyTheme(from: Element, to: HTMLElement) {
  const computed = window.getComputedStyle(from);
  for (const token of THEME_TOKENS) {
    const value = computed.getPropertyValue(token).trim();
    if (value) to.style.setProperty(token, value);
  }
}

const FOCUSABLE = 'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

/** Horizontal travel, in px, that counts as a swipe rather than a tap. */
const SWIPE_PX = 48;

export default function Lightbox({
  items,
  index,
  onClose,
  onIndexChange,
  themeSource,
}: {
  items: LightboxItem[];
  /** The open item, or null when the viewer is shut. */
  index: number | null;
  onClose: () => void;
  onIndexChange: (next: number) => void;
  /**
   * The element to read theme tokens off — normally the gallery root, which is
   * inside the route's font wrapper. Falls back to `body`.
   */
  themeSource?: React.RefObject<HTMLElement | null>;
}) {
  /* The portal host, built once by a lazy state initialiser and kept for the
     life of the component. Not created in an effect (that would set state
     synchronously inside an effect and cost a second render on every open) and
     not stashed in a ref during render (refs are not readable there). The
     initialiser returns null on the server, where there is no document and the
     viewer renders nothing anyway. React renders into the detached node first
     and the effect below attaches it, which is the ordinary portal sequence. */
  const [host] = useState<HTMLElement | null>(() => {
    if (typeof document === "undefined") return null;
    const el = document.createElement("div");
    el.setAttribute("data-lightbox-host", "");
    return el;
  });

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  /** The element focus came from, so it can be handed back on close. */
  const returnTo = useRef<HTMLElement | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  /** The picture's box, used to tell a click on the art from a click beside it. */
  const frameRef = useRef<HTMLDivElement>(null);

  const open = index !== null;
  const many = items.length > 1;
  const item = open ? items[index] : null;

  const go = useCallback(
    (delta: number) => {
      if (index === null || items.length === 0) return;
      onIndexChange((index + delta + items.length) % items.length);
    },
    [index, items.length, onIndexChange]
  );

  /* ---- the portal host ----
     Created on open and removed on close, so nothing of this component is left
     in the DOM while it is shut. */
  useEffect(() => {
    if (!open || !host) return;
    const el = host;
    /* Read the palette and the faces off the trigger's subtree BEFORE the host
       leaves it — once appended to body it can no longer inherit them. */
    copyTheme(themeSource?.current ?? document.body, el);
    document.body.appendChild(el);
    return () => {
      el.remove();
    };
  }, [open, host, themeSource]);

  /* ---- scroll lock ----
     Padding compensates for the scrollbar the lock removes, so the page behind
     does not jump sideways as the viewer opens. */
  useEffect(() => {
    if (!open) return;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
    };
  }, [open]);

  /* ---- focus: capture, move in, hand back ---- */
  useEffect(() => {
    if (!open) return;
    returnTo.current = document.activeElement as HTMLElement | null;
    /* Captured here rather than read in the cleanup: by the time cleanup runs
       React may already have detached the node from the ref. */
    const dialog = dialogRef.current;
    /* Next paint, so the dialog exists to receive it. */
    const raf = requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      cancelAnimationFrame(raf);
      /* Only hand focus back if it is still inside the viewer (or nowhere) —
         if something else has legitimately taken it since, leave it alone. */
      const active = document.activeElement;
      if (!active || active === document.body || dialog?.contains(active)) {
        returnTo.current?.focus?.();
      }
    };
  }, [open]);

  /* ---- keyboard: Escape, arrows, and the tab trap ---- */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (many && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
        e.preventDefault();
        go(e.key === "ArrowRight" ? 1 : -1);
        return;
      }
      if (e.key !== "Tab") return;

      const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!nodes || nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;

      /* Wrap at both ends, and pull focus back in if it has escaped. */
      if (!dialogRef.current?.contains(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [open, many, go, onClose]);

  if (!open || !host || !item) return null;

  const counter = many ? `${index + 1} / ${items.length}` : null;

  /**
   * Conventional lightbox behaviour: clicking the dark space AROUND the picture
   * closes; clicking the picture itself does not.
   *
   * The image is laid out with fill + object-fit: contain, which means the
   * <img> element covers the whole frame even though the painted picture is
   * letterboxed inside it — so the event target alone cannot tell the two
   * apart. The painted rectangle is derived instead, from the natural size and
   * the frame, and only clicks outside it close.
   */
  const onStageClick = (e: React.MouseEvent) => {
    const frame = frameRef.current;
    const img = frame?.querySelector("img");
    if (!frame || !img) {
      onClose();
      return;
    }
    const r = frame.getBoundingClientRect();
    const nw = img.naturalWidth || r.width;
    const nh = img.naturalHeight || r.height;
    const scale = Math.min(r.width / nw, r.height / nh);
    const w = nw * scale;
    const h = nh * scale;
    const x0 = r.left + (r.width - w) / 2;
    const y0 = r.top + (r.height - h) / 2;
    const onPicture =
      e.clientX >= x0 && e.clientX <= x0 + w && e.clientY >= y0 && e.clientY <= y0 + h;
    if (!onPicture) onClose();
  };

  return createPortal(
    <div
      className="lb"
      role="dialog"
      aria-modal="true"
      aria-label={item.alt || "Image viewer"}
      ref={dialogRef}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* ---- top row: counter left, the close button right ----
              Both live IN the grid rather than floating over the picture, so
              the row reserves its own height and the image can never be laid
              out underneath them. That is what keeps the "never clipped" fix
              intact while the close button gets much louder. */}
      <div className="lb__bar">
        <p className="lb__counter">{counter}</p>
        <button
          type="button"
          ref={closeRef}
          className="lb__close"
          onClick={onClose}
          aria-label="Close image viewer"
          title="Close (Esc)"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M6 6 L18 18 M18 6 L6 18" />
          </svg>
          <span className="lb__close-text" aria-hidden="true">
            Close
          </span>
        </button>
      </div>

      {/* ---- the stage ---- */}
      <div
        className="lb__stage"
        onClick={onStageClick}
        onTouchStart={(e) => {
          const t = e.changedTouches[0];
          touchStart.current = { x: t.clientX, y: t.clientY };
        }}
        onTouchEnd={(e) => {
          const start = touchStart.current;
          touchStart.current = null;
          if (!start || !many) return;
          const t = e.changedTouches[0];
          const dx = t.clientX - start.x;
          const dy = t.clientY - start.y;
          if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) < Math.abs(dy)) return;
          go(dx < 0 ? 1 : -1);
        }}
      >
        {many && (
          <button
            type="button"
            className="lb__nav lb__nav--prev"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label="Previous image"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M15 5 L8 12 L15 19" />
            </svg>
          </button>
        )}

        <div className="lb__frame" ref={frameRef}>
          <Image
            key={item.src}
            src={item.src}
            alt={item.alt}
            fill
            sizes="100vw"
            priority
            className="lb__img"
          />
        </div>

        {many && (
          <button
            type="button"
            className="lb__nav lb__nav--next"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label="Next image"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M9 5 L16 12 L9 19" />
            </svg>
          </button>
        )}
      </div>

      {/* ---- caption: its own row, so a long one shortens the picture rather
              than running off the bottom of the screen ---- */}
      {item.caption && (
        <div className="lb__foot">
          <p className="lb__caption">{item.caption}</p>
        </div>
      )}

      <style>{`
        [data-lightbox-host] { position: static; }

        .lb {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: grid;
          grid-template-rows: auto minmax(0, 1fr) auto;
          gap: clamp(0.5rem, 1.5vw, 0.9rem);
          height: 100vh;
          height: 100dvh;
          width: 100vw;
          padding:
            calc(env(safe-area-inset-top, 0px) + clamp(0.75rem, 2vw, 1.25rem))
            calc(env(safe-area-inset-right, 0px) + clamp(0.75rem, 2vw, 1.25rem))
            calc(env(safe-area-inset-bottom, 0px) + clamp(0.75rem, 2vw, 1.25rem))
            calc(env(safe-area-inset-left, 0px) + clamp(0.75rem, 2vw, 1.25rem));
          /* Near-opaque, so the picture is the only lit thing on screen — the
             ordinary lightbox contract. Not fully opaque: a few percent of the
             page reads as depth rather than as a new document. At 0.93 the
             site header and the scroll indicator were still legible through
             it, which read as a bug rather than as depth. */
          background: rgba(6, 8, 12, 0.965);
          font-family: var(--font-body, Georgia, serif);
          animation: lb-in 160ms var(--ease-soft, ease) both;
        }
        @keyframes lb-in { from { opacity: 0; } to { opacity: 1; } }

        /* ---- top row ---- */
        .lb__bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          min-height: 3.25rem;
        }
        .lb__counter {
          margin: 0;
          font-family: var(--font-mono, monospace);
          font-size: 0.78rem;
          letter-spacing: 0.16em;
          font-variant-numeric: tabular-nums;
          color: rgba(232, 230, 223, 0.62);
        }

        /* ---- THE CLOSE BUTTON ----
           An outlined red pill that inverts on hover: red mark on the dark
           ground at rest, and on hover the shape fills red and everything
           inside it flips to the backdrop colour. One idea, stated twice —
           the shape is red either way, so it is unmissable before you reach
           it and unmistakable once you do.

           A literal red rather than --color-scarlet, because the routes remap
           that token: Shattered Skies points scarlet at orange, and a close
           button must not be orange. --lb-ink is the backdrop, so the inverted
           label is genuinely the page's own ground rather than a guessed dark.

           52px tall clears the 48px target floor. #E5484D on the backdrop is
           5.1:1, and the inverted ground-on-red is 5.1:1 the other way, so both
           states clear AA as text and not just as a graphic. */
        .lb__close {
          --lb-red: #E5484D;
          --lb-ink: #06080C;
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          min-width: 3.25rem;
          height: 3.25rem;
          padding: 0 1rem;
          border: 2px solid var(--lb-red);
          border-radius: 999px;
          background: transparent;
          color: var(--lb-red);
          font-family: var(--font-mono, monospace);
          font-size: 0.76rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background-color 140ms ease, color 140ms ease, transform 140ms ease;
        }
        .lb__close:hover,
        .lb__close:focus-visible {
          background: var(--lb-red);
          color: var(--lb-ink);
        }
        .lb__close:active { transform: scale(0.94); }
        .lb__close:focus-visible {
          outline: 3px solid #FFFFFF;
          outline-offset: 3px;
        }
        .lb__close svg {
          width: 1.35rem;
          height: 1.35rem;
          flex: 0 0 auto;
          fill: none;
          /* currentColor, so the X inverts with the label rather than being
             painted separately and drifting out of step with it. */
          stroke: currentColor;
          stroke-width: 2.4;
          stroke-linecap: round;
        }
        .lb__close-text { line-height: 1; }

        /* ---- the stage ----
           Padded either side by a nav button's width, so the arrows sit in the
           gutters and never over the artwork. An absolutely positioned child
           resolves against the padding box, so left:0 lands in the gutter. */
        .lb__stage {
          position: relative;
          min-height: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-inline: 4.25rem;
          cursor: zoom-out;
        }
        .lb__frame {
          position: relative;
          flex: 1 1 auto;
          width: 100%;
          height: 100%;
          min-width: 0;
        }
        .lb__img { object-fit: contain; cursor: default; }

        /* ---- prev / next ---- */
        .lb__nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 2;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 3.25rem;
          height: 3.25rem;
          padding: 0;
          border: 1px solid rgba(255, 255, 255, 0.24);
          border-radius: 999px;
          background: rgba(18, 22, 30, 0.72);
          color: rgba(255, 255, 255, 0.92);
          cursor: pointer;
          transition: background-color 140ms ease, border-color 140ms ease;
        }
        .lb__nav:hover {
          background: rgba(34, 40, 52, 0.92);
          border-color: rgba(255, 255, 255, 0.5);
        }
        .lb__nav:focus-visible {
          outline: 3px solid var(--color-lunar-gold, #C9A961);
          outline-offset: 3px;
        }
        .lb__nav svg {
          width: 1.5rem;
          height: 1.5rem;
          fill: none;
          stroke: currentColor;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .lb__nav--prev { left: 0; }
        .lb__nav--next { right: 0; }

        /* ---- caption ---- */
        .lb__foot { display: flex; justify-content: center; }
        .lb__caption {
          margin: 0;
          max-width: 70ch;
          text-align: center;
          font-size: 0.88rem;
          line-height: 1.55;
          color: rgba(232, 230, 223, 0.72);
          max-height: 22vh;
          overflow-y: auto;
          overscroll-behavior: contain;
        }

        /* ---- phones ----
           The close button stays exactly where it is — top-right is where a
           thumb looks for it. The arrows come out of the side gutters and sit
           in a row under the picture, which on a 390px screen is both easier
           to hit and stops them crowding the artwork. */
        @media (max-width: 640px) {
          .lb__stage {
            display: grid;
            grid-template-columns: auto auto;
            grid-template-rows: minmax(0, 1fr) auto;
            justify-content: space-between;
            align-items: center;
            gap: 0.65rem;
            padding-inline: 0;
          }
          .lb__frame { grid-row: 1; grid-column: 1 / -1; width: 100%; }
          .lb__nav {
            position: static;
            transform: none;
            grid-row: 2;
            width: 3.5rem;
            height: 3rem;
          }
          .lb__nav--prev { grid-column: 1; }
          .lb__nav--next { grid-column: 2; }
          .lb__caption { font-size: 0.82rem; max-height: 16vh; }
          /* The word goes, the shape and the X stay. Still 52px, still red,
             still top-right — only the label is spent, because on a 390px bar
             it is the least load-bearing part of the control. */
          .lb__close-text { display: none; }
          .lb__close { padding: 0; width: 3.25rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .lb { animation: none; }
          .lb__close,
          .lb__nav { transition: none; }
          .lb__close:active { transform: none; }
        }
      `}</style>
    </div>,
    host
  );
}


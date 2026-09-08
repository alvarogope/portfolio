"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

/**
 * Text that arrives scrambled and decodes into itself when it scrolls into view.
 *
 * WHERE IT CAME FROM, AND WHY IT IS BACK. Shattered Skies used to render its
 * four communication channels as `TransmissionCard`s — a terminal-green card
 * that seeded itself with glyph noise and decoded on view. That band was
 * superseded by `ShatteredSkiesMechanics`, which says the same four things with
 * the design reasoning attached, and the effect went with the band rather than
 * on purpose. Both `TransmissionCard` and its faster sibling `DecryptText` sat
 * orphaned in this directory afterwards, imported by nothing. Both are now
 * deleted; this is their logic, once.
 *
 * The card CHROME is deliberately not revived: the channels already have a
 * layout, and bringing back a second way of drawing the same four things is how
 * the duplication the ownership map exists to prevent gets re-created. One
 * effect, applied to copy that already has a home.
 *
 * WHY IT EARNS ITS PLACE HERE RATHER THAN ANYWHERE. The section it renders in
 * argues that voice is broken on purpose and meaning has to be reconstructed
 * from what survives the filter. A sentence that arrives as noise and resolves
 * is that argument performed in four seconds, on the exact copy that makes it.
 * Used anywhere else on the site it would be decoration, so it is used nowhere
 * else.
 *
 * ONE TEXT NODE, NOT TWO — AND THAT IS THE WHOLE DESIGN OF THIS COMPONENT.
 *
 * The obvious implementation is React state plus a visually-hidden copy of the
 * real sentence for screen readers. That was the first version here, and a
 * rendered-DOM check caught what is wrong with it: the sentence is then in the
 * document TWICE. Assistive tech is fine — one copy is `aria-hidden` — but
 * Ctrl+F matches twice, select-all-and-copy yields the paragraph twice, and any
 * text extractor sees double. A component that exists to make one sentence more
 * legible must not put two of it on the page.
 *
 * So the span renders the REAL text, through React, exactly once — and the
 * animation mutates `textContent` on the ref instead of going through state.
 * React never re-renders the node (there is no state to change), so nothing
 * fights over it, and the DOM only ever holds one copy of the sentence.
 *
 * WHAT THAT BUYS, FOR FREE:
 *   - Server render and first paint emit the real string. No JS, no effect, no
 *     IntersectionObserver? The sentence is simply there, plain.
 *   - It stays in the accessibility tree throughout, unhidden, and is never
 *     announced as it changes because the span is not a live region.
 *   - `prefers-reduced-motion: reduce` returns before any glyph is written, and
 *     clears `data-decode-pending` on the way out so the plain sentence shows.
 *   - The scramble only starts once the element is actually on screen, so text
 *     the reader never scrolls to is never disturbed.
 *   - The real text is restored on cleanup, so an unmount mid-animation cannot
 *     strand a paragraph as glyph soup.
 *
 * WHEN THE NODE IS CLAIMED — AND THE BUG THAT MADE THAT A QUESTION.
 *
 * The four Shattered Skies channels shared one defect: the last of them showed
 * its finished sentence, readable, for as long as it took the reader to scroll
 * a little further, and only then dissolved into noise and decoded. The cause
 * was not the last card. It was that the component took ownership of its node
 * inside the IntersectionObserver callback, so from server render until the
 * span crossed the observer's trigger line the real sentence was simply on the
 * page. The trigger line is 15% of the viewport height above the bottom edge,
 * which gives every channel a band at the foot of the screen where it is
 * visible and unclaimed; the fourth is the one that comes to rest in that band
 * — the reader is reading the third while the fourth sits below it, done —
 * so it is the one where a designed-in window became a visible bug.
 *
 * The claim now happens at HYDRATION, in a layout effect, so the noise is in
 * place before the first frame the reader could see it in, whichever channel it
 * is and wherever it is parked. The observer is demoted to what it should
 * always have been: the thing that decides WHEN to resolve, not when to hide.
 * The sliver before hydration — server HTML, painted with the real string
 * because that is the no-JS contract — is covered in CSS by
 * `data-decode-pending`; see `globals.css`.
 *
 * WHY IT DECODES SLOWLY. `total / 80` characters resolved every sixth frame,
 * which is `TransmissionCard`'s cadence rather than `DecryptText`'s `total / 24`.
 * Twenty-four steps across a forty-word paragraph is a flicker; eighty steps
 * reads as a signal being cleaned up.
 *
 * THE CURSOR. The old card ended on a blinking block, and that one detail is
 * back: `.decode-cursor::after` in `globals.css`, blinking on `tcblink`. It is
 * generated content rather than an element, so the sentence is still in the DOM
 * exactly once and there is still nothing extra to select, find or announce.
 * `data-decoding` — set below for the length of the animation — hides it while
 * the line is still resolving, so it appears only once the transmission has
 * landed. Under reduced motion the block shows and does not blink: the cursor
 * is a glyph, the blink is the motion. The CARD CHROME stays deleted; bringing
 * back a second way of drawing these four channels is the duplication the
 * ownership map exists to prevent.
 */

/* Glyphs the noise is drawn from. Uppercase, digits and terminal punctuation:
   the alphabet a degraded transmission would show, and — because every glyph is
   roughly one character wide in the body face — the scrambled line occupies the
   same box as the decoded one, so nothing reflows as it resolves. */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>*#@%&";

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

/** Whitespace is never scrambled: word shapes are what stop it reflowing. */
const isGap = (ch: string) => ch === " " || ch === "\n" || ch === "\t";

/**
 * WHY A LAYOUT EFFECT, AND NOT A PASSIVE ONE — this is the whole fix.
 *
 * The node has to be CLAIMED before the browser paints the commit that hydrates
 * it. `useEffect` runs after that paint, which re-opens the window this
 * component exists to close; `useLayoutEffect` runs inside the commit, so the
 * first frame a reader could see already holds glyphs. There is no layout phase
 * on the server and React warns if you ask for one there, so the passive hook
 * stands in — neither runs server-side, and the branch is decided once at
 * module scope so the component always calls the same hook.
 */
const useClaimEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function DecodeOnView({
  text,
  /**
   * Milliseconds to hold the fully-scrambled state before decoding. Stagger a
   * group so four channels do not resolve in unison — that reads as an
   * animation, where a queue reads as four transmissions arriving.
   */
  delay = 0,
  className,
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useClaimEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* REDUCED MOTION IS NOT "DO NOTHING" ANY MORE.

       The span ships with `data-decode-pending`, and the stylesheet smears the
       glyphs while it is there — so returning early without clearing it would
       strand a reduced-motion reader in permanent noise. The rule is already
       scoped to `no-preference`, which makes this belt and braces rather than
       the only guard, and that is deliberate: the attribute is the component's
       to remove, and it removes it on every path. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      delete el.dataset.decodePending;
      return;
    }

    let frame = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;

    /** Render one intermediate state straight to the DOM. */
    const paint = (resolved: number) => {
      el.textContent = text
        .split("")
        .map((ch, i) => (isGap(ch) || i < resolved ? ch : randomGlyph()))
        .join("");
    };

    /** Always leaves the element holding the true sentence. */
    const restore = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      if (timer !== null) clearTimeout(timer);
      timer = null;
      el.textContent = text;
      delete el.dataset.decoding;
      delete el.dataset.decodePending;
    };

    const decode = () => {
      let resolved = 0;
      let tick = 0;
      const step = text.length / 80;

      const run = () => {
        /* Repaint every sixth frame rather than every frame: at 60fps that is a
           ~10Hz shimmer, which reads as a machine working. Every frame reads as
           a strobe and costs six times the string building. */
        if (tick % 6 === 0) {
          paint(resolved);
          resolved += step;
        }
        tick++;
        if (resolved >= text.length) {
          el.textContent = text;
          delete el.dataset.decoding;
          return;
        }
        frame = requestAnimationFrame(run);
      };
      frame = requestAnimationFrame(run);
    };

    /* ---- CLAIM THE NODE NOW, NOT WHEN THE OBSERVER FIRES ----

       This is the line the bug was hiding behind. `paint(0)` and
       `data-decoding` used to live inside the observer callback, which meant
       the span held the REAL, READABLE sentence from server render right up
       until it crossed the trigger line — and the trigger line sits 15% of the
       viewport height above the bottom edge, so every channel has a band at the
       foot of the screen where it is on-screen, legible and unclaimed. The
       fourth channel is the one that comes to rest in that band while the
       reader is still on the third, so it was the one seen resolved before it
       scrambled. Claiming at hydration removes the window for all four at once,
       and the order below matters: scramble the text FIRST, then drop
       `data-decode-pending`, so the node is never both visible and readable
       within one paint. */
    el.dataset.decoding = "true";
    paint(0);
    delete el.dataset.decodePending;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        /* One shot. Re-decoding on every scroll-past would turn a flourish into
           a tic, and would re-hide text the reader is trying to re-read. */
        observer.disconnect();
        /* The element is already scrambled and already flagged; scrolling to it
           only starts the clock. The stagger still reads as four transmissions
           arriving in a queue, because it is applied to the RESOLVE and the
           noise was there the whole time. */
        timer = setTimeout(decode, delay);
      },
      { rootMargin: "0px 0px -15% 0px" }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      restore();
    };
  }, [text, delay]);

  /* `decode-cursor` draws the blinking block after the sentence; see
     `globals.css`. It is a `::after`, so it adds no node to the one text node
     this component is built to guarantee.

     `data-decode-pending` covers the only window the layout effect above cannot
     reach: server HTML paints long before any JS runs, and it paints the real
     sentence — which is exactly what keeps this component honest when JS never
     arrives. The stylesheet smears the glyphs while the attribute is present,
     under `scripting: enabled` so a no-JS reader gets the plain line, and with
     a fail-open so a bundle that never loads does too. The effect deletes it in
     the same commit it scrambles in. */
  return (
    <span
      ref={ref}
      data-decode-pending=""
      className={className ? `decode-cursor ${className}` : "decode-cursor"}
    >
      {text}
    </span>
  );
}

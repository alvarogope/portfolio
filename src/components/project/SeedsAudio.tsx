"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Seed = { id: string; name: string; mood: string; src: string; tint: string };

const AMBIENT_SRC = "/audio/seeds/main-theme.mp3";

const SEEDS: Seed[] = [
  { id: "snow", name: "Snow Level", mood: "Still, crystalline cold", src: "/audio/seeds/snow.mp3", tint: "#6FB2C4" },
  { id: "rain", name: "Rain Level", mood: "The world weeping, then washed clean", src: "/audio/seeds/rain.mp3", tint: "#5F9B6B" },
  { id: "boss", name: "Final Boss", mood: "The last stand for the Earth", src: "/audio/seeds/final-boss.mp3", tint: "#E0A845" },
];

/* The transport bar is portalled to <body> so no transformed ancestor can
   capture its position: fixed. That also takes it outside the page's themed
   wrapper, so these custom properties have to be carried across by hand. */
const THEMED_VARS = ["--color-nightfall", "--color-silver", "--color-moonlight", "--font-mono"];

export default function SeedsAudio() {
  const ambientRef = useRef<HTMLAudioElement>(null);
  const seedRef = useRef<HTMLAudioElement>(null);

  const [ambientOn, setAmbientOn] = useState(false);
  const [activeSeed, setActiveSeed] = useState<string | null>(null);

  // Was the ambience playing when we ducked out of it for a seed? Only
  // then does it come back when the seed finishes.
  const wasAmbientOn = useRef(false);
  // Invalidates in-flight play() promises so a superseded click can never
  // land its state update after the click that replaced it.
  const playToken = useRef(0);

  /* ---- playback: exactly one element is ever unpaused ---- */

  const stopSeed = () => {
    const s = seedRef.current;
    playToken.current++;
    if (s) {
      s.pause();
      if (s.src) s.currentTime = 0;
    }
    setActiveSeed(null);
  };

  const resumeAmbient = () => {
    const a = ambientRef.current;
    const s = seedRef.current;
    if (!a) return;
    // Never come back in on top of a seed.
    if (s && !s.paused) return;
    wasAmbientOn.current = false; // memory consumed
    a.play()
      .then(() => setAmbientOn(true))
      .catch(() => setAmbientOn(false));
  };

  const toggleAmbient = () => {
    const a = ambientRef.current;
    if (!a) return;

    if (ambientOn) {
      a.pause();
      setAmbientOn(false);
      wasAmbientOn.current = false;
      return;
    }

    // Turning the ambience on takes the floor from whatever seed is
    // playing, and clears the resume memory so stopping that seed
    // doesn't try to start the ambience a second time.
    stopSeed();
    wasAmbientOn.current = false;
    a.play()
      .then(() => setAmbientOn(true))
      .catch(() => setAmbientOn(false));
  };

  const playSeed = (seed: Seed) => {
    const s = seedRef.current;
    const a = ambientRef.current;
    if (!s) return;

    // Same card again = stop, and hand the room back to the ambience.
    if (activeSeed === seed.id) {
      stopSeed();
      if (wasAmbientOn.current) resumeAmbient();
      return;
    }

    // Only sample the ambience state on the way *into* a seed. Switching
    // from one seed to another would read it as false — the first seed
    // already paused it — and erase the memory that it was ever on.
    if (activeSeed === null) wasAmbientOn.current = ambientOn;

    if (a) a.pause();
    setAmbientOn(false);
    stopSeed(); // never leave the previous seed running

    const token = ++playToken.current;
    s.src = seed.src;
    s.play()
      .then(() => {
        if (token !== playToken.current) return; // a newer click won
        setActiveSeed(seed.id);
      })
      .catch(() => {
        if (token !== playToken.current) return;
        setActiveSeed(null);
        if (wasAmbientOn.current) resumeAmbient();
      });
  };

  // A seed running to its end, or failing to load, releases the floor.
  useEffect(() => {
    const s = seedRef.current;
    if (!s) return;
    const release = () => {
      setActiveSeed(null);
      if (wasAmbientOn.current) resumeAmbient();
    };
    s.addEventListener("ended", release);
    s.addEventListener("error", release);
    return () => {
      s.removeEventListener("ended", release);
      s.removeEventListener("error", release);
    };
  }, []);

  // Backstop for the one-source invariant: whatever starts playing wins,
  // and the other element is stopped. Nothing above should ever trip this,
  // but it makes "two at once" unrepresentable rather than merely unlikely.
  useEffect(() => {
    const a = ambientRef.current;
    const s = seedRef.current;
    if (!a || !s) return;

    const onAmbientPlay = () => {
      if (!s.paused) {
        s.pause();
        if (s.src) s.currentTime = 0;
        setActiveSeed(null);
      }
    };
    const onSeedPlay = () => {
      if (!a.paused) {
        a.pause();
        setAmbientOn(false);
      }
    };

    a.addEventListener("play", onAmbientPlay);
    s.addEventListener("play", onSeedPlay);
    return () => {
      a.removeEventListener("play", onAmbientPlay);
      s.removeEventListener("play", onSeedPlay);
    };
  }, []);

  /* ---- the portalled transport bar ---- */

  const hostRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // Built during render so the portal has a target on the very first
  // client render; null on the server, where there is no document.
  const [portalHost] = useState<HTMLDivElement | null>(() =>
    typeof document === "undefined" ? null : document.createElement("div")
  );

  useEffect(() => {
    if (!portalHost) return;
    document.body.appendChild(portalHost);
    return () => portalHost.remove();
  }, [portalHost]);

  useEffect(() => {
    const host = hostRef.current;
    const bar = barRef.current;
    if (!portalHost || !host || !bar) return;

    // Carry the page's palette across the portal boundary.
    const computed = getComputedStyle(host);
    for (const name of THEMED_VARS) {
      const value = computed.getPropertyValue(name).trim();
      if (value) bar.style.setProperty(name, value);
    }

    // Reserve the bar's lane at the foot of the document so the last of
    // the page can always scroll clear of it.
    const previousPadding = document.body.style.paddingBottom;
    const reserve = () => {
      document.body.style.paddingBottom = `${bar.offsetHeight}px`;
    };
    reserve();

    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(reserve) : null;
    observer?.observe(bar);
    window.addEventListener("resize", reserve);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", reserve);
      document.body.style.paddingBottom = previousPadding;
    };
  }, [portalHost]);

  const anythingPlaying = ambientOn || activeSeed !== null;

  const transportBar = (
    <div
      ref={barRef}
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 45,
        display: "flex",
        justifyContent: "center",
        padding: "0.6rem 1.5rem calc(0.6rem + env(safe-area-inset-bottom, 0px))",
        background: "color-mix(in srgb, var(--color-nightfall) 94%, transparent)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderTop: `1px solid color-mix(in srgb, var(--color-silver) ${anythingPlaying ? "45%" : "20%"}, transparent)`,
        boxShadow: "0 -8px 30px -10px rgba(0,0,0,0.6)",
      }}
    >
      <button
        onClick={toggleAmbient}
        aria-label={ambientOn ? "Pause ambient theme" : "Play ambient theme"}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          padding: "0.5rem 1.3rem",
          background: "transparent",
          border: `1px solid color-mix(in srgb, var(--color-silver) ${anythingPlaying ? "60%" : "30%"}, transparent)`,
          borderRadius: "999px",
          color: "var(--color-moonlight)",
          cursor: "pointer",
          fontFamily: "var(--font-mono)",
          fontSize: "0.7rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        <span style={{ display: "flex", gap: "2px", alignItems: "flex-end", height: "0.9rem" }}>
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className={ambientOn ? "seed-bar" : ""}
              style={{ width: "2px", background: "var(--color-silver)", height: ambientOn ? "60%" : "30%", animationDelay: `${i * 0.12}s` }}
            />
          ))}
        </span>
        {ambientOn ? "Ambience on" : "Play ambience"}
      </button>
    </div>
  );

  return (
    <div ref={hostRef}>
      <audio ref={ambientRef} src={AMBIENT_SRC} loop preload="none" />
      <audio ref={seedRef} preload="none" />

      <div className="grid-4">
        {SEEDS.map((seed) => {
          const playing = activeSeed === seed.id;
          return (
            <button
              key={seed.id}
              onClick={() => playSeed(seed)}
              className="panel"
              style={{
                textAlign: "left",
                border: `1px solid color-mix(in srgb, ${seed.tint} ${playing ? "60%" : "25%"}, transparent)`,
                padding: "1.4rem",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: "0.9rem",
                transition: "border-color 0.3s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h3 style={{ margin: 0, fontSize: "var(--text-lg)", fontFamily: "var(--font-hero)" }}>{seed.name}</h3>
                <span
                  style={{
                    width: "2rem",
                    height: "2rem",
                    borderRadius: "50%",
                    border: `1px solid ${seed.tint}`,
                    color: seed.tint,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.8rem",
                  }}
                >
                  {playing ? "❚❚" : "▶"}
                </span>
              </div>
              <p style={{ margin: 0, color: "var(--color-mist)", fontSize: "0.92rem", lineHeight: 1.55 }}>{seed.mood}</p>

              <div style={{ display: "flex", gap: "3px", height: "1.5rem", alignItems: "flex-end", opacity: playing ? 1 : 0.25 }}>
                {[...Array(9)].map((_, i) => (
                  <span
                    key={i}
                    className={playing ? "seed-bar" : ""}
                    style={{
                      flex: 1,
                      background: seed.tint,
                      height: playing ? "40%" : "20%",
                      borderRadius: "1px",
                      animationDelay: `${i * 0.08}s`,
                    }}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {portalHost && createPortal(transportBar, portalHost)}

      <style>{`
        @keyframes seedpulse { 0%, 100% { height: 30% } 50% { height: 100% } }
        .seed-bar { animation: seedpulse 0.9s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .seed-bar { animation: none } }
      `}</style>
    </div>
  );
}

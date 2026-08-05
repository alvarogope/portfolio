"use client";

import { useEffect, useRef, useState } from "react";

type Seed = { id: string; name: string; mood: string; src: string; tint: string };

const AMBIENT_SRC = "/audio/seeds/main-theme.mp3";

const SEEDS: Seed[] = [
  { id: "snow", name: "Snow Level", mood: "Still, crystalline cold", src: "/audio/seeds/snow.mp3", tint: "#6FB2C4" },
  { id: "rain", name: "Rain Level", mood: "The world weeping, then washed clean", src: "/audio/seeds/rain.mp3", tint: "#5F9B6B" },
  { id: "boss", name: "Final Boss", mood: "The last stand for the Earth", src: "/audio/seeds/final-boss.mp3", tint: "#E0A845" },
];

export default function SeedsAudio() {
  const ambientRef = useRef<HTMLAudioElement>(null);
  const seedRef = useRef<HTMLAudioElement>(null);

  const [ambientOn, setAmbientOn] = useState(false);
  const [activeSeed, setActiveSeed] = useState<string | null>(null);
  const wasAmbientOn = useRef(false);

  const resumeAmbient = () => {
    ambientRef.current?.play().then(() => setAmbientOn(true)).catch(() => {});
  };

  const toggleAmbient = () => {
    const a = ambientRef.current;
    if (!a) return;
    if (ambientOn) {
      a.pause();
      setAmbientOn(false);
    } else {
      a.play().then(() => setAmbientOn(true)).catch(() => {});
    }
  };

  const playSeed = (seed: Seed) => {
    const s = seedRef.current;
    if (!s) return;

    if (activeSeed === seed.id) {
      s.pause();
      s.currentTime = 0;
      setActiveSeed(null);
      if (wasAmbientOn.current) resumeAmbient();
      return;
    }

    wasAmbientOn.current = ambientOn;
    if (ambientOn) {
      ambientRef.current?.pause();
      setAmbientOn(false);
    }

    s.src = seed.src;
    s.play().then(() => setActiveSeed(seed.id)).catch(() => {});
  };

  useEffect(() => {
    const s = seedRef.current;
    if (!s) return;
    const onEnded = () => {
      setActiveSeed(null);
      if (wasAmbientOn.current) resumeAmbient();
    };
    s.addEventListener("ended", onEnded);
    return () => s.removeEventListener("ended", onEnded);
  }, []);

  const anythingPlaying = ambientOn || activeSeed !== null;

  return (
    <div>
      <audio ref={ambientRef} src={AMBIENT_SRC} loop preload="none" />
      <audio ref={seedRef} preload="none" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
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
              <p style={{ margin: 0, color: "var(--color-mist)", fontSize: "0.85rem" }}>{seed.mood}</p>

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

      <button
        onClick={toggleAmbient}
        aria-label={ambientOn ? "Pause ambient theme" : "Play ambient theme"}
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: 45,
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          padding: "0.7rem 1.1rem",
          background: "color-mix(in srgb, var(--color-nightfall) 92%, transparent)",
          backdropFilter: "blur(8px)",
          border: `1px solid color-mix(in srgb, var(--color-silver) ${anythingPlaying ? "60%" : "30%"}, transparent)`,
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

      <style>{`
        @keyframes seedpulse { 0%, 100% { height: 30% } 50% { height: 100% } }
        .seed-bar { animation: seedpulse 0.9s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .seed-bar { animation: none } }
      `}</style>
    </div>
  );
}
"use client";

import { useEffect, useRef, useState } from "react";

type Track = {
  id: string;
  name: string;
  role: string;
  mood: string;
  src: string;
  tint: string;
  art?: "willow";
};

const TRACKS: Track[] = [
  {
    id: "main-theme",
    name: "Main Theme",
    role: "Moon-knight",
    mood: "This piece plays in the title screen and represents the Moon-Knight's adventure.",
    src: "/audio/moon-knight/main-theme.mp3",
    tint: "var(--color-silver)",
  },
  {
    id: "rest",
    name: "Rest",
    role: "Willow-tree rest theme",
    mood: "An arpeggio that the Moon-Knight plays to heal. It's inspired by medieval synth.",
    src: "/audio/moon-knight/rest.mp3",
    tint: "var(--color-gold)",
    art: "willow",
  },
];

const FRONDS = Array.from({ length: 23 }, (_, i) => {
  const x = 31 + i * 3.2;
  const t = (x - 66) / 35; 
  const y0 = 26 + 16 * t * t; 
  const jitter = (((i * 37) % 11) / 11) * 9; 
  const len = 50 - 14 * t * t - jitter;
  const bow = t * 4; 
  const x1 = x + bow * 0.6;
  const x2 = x + bow * 1.1;
  const x3 = x + bow;
  return {
    d: `M${x.toFixed(1)} ${y0.toFixed(1)} C ${x1.toFixed(1)} ${(y0 + len * 0.35).toFixed(1)}, ${x2.toFixed(1)} ${(y0 + len * 0.74).toFixed(1)}, ${x3.toFixed(1)} ${(y0 + len).toFixed(1)}`,
    opacity: 0.32 + ((i * 7) % 5) * 0.09,
    width: i % 4 === 0 ? 0.85 : 0.6,
  };
});

const FROND_GROUPS = [0, 1, 2].map((g) => FRONDS.filter((_, i) => i % 3 === g));

function Willow({ playing }: { playing: boolean }) {
  return (
    <svg
      viewBox="27 0 110 90"
      className={playing ? "mk-willow is-playing" : "mk-willow"}
      aria-hidden
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
    >
      {/* The borrowed moon. */}
      <path
        d="M126 4 A 7 7 0 1 0 126 18 A 9 9 0 1 1 126 4 Z"
        fill="currentColor"
        stroke="none"
        opacity="0.28"
      />

      {/* Ground. */}
      <path d="M30 84 H 104" strokeWidth="0.8" opacity="0.16" />
      <ellipse cx="66" cy="84" rx="22" ry="2" fill="currentColor" stroke="none" opacity="0.1" />

      {/* Trunk and boughs. */}
      <path d="M66 84 C 64.5 76 64 66 66 46" strokeWidth="2.8" opacity="0.85" />
      <path d="M65.6 46 C 61 42 57 40 52 39" strokeWidth="1.2" opacity="0.4" />
      <path d="M65.6 45 C 70 41 75 39 80 38" strokeWidth="1.2" opacity="0.4" />
      <path d="M65.8 44 C 64 38 64 33 66 29" strokeWidth="1.1" opacity="0.4" />

      {/* Crown twigs. */}
      <path d="M52 39 C 48 36 45 33 44 30" strokeWidth="0.7" opacity="0.3" />
      <path d="M80 38 C 84 35 87 32 88 29" strokeWidth="0.7" opacity="0.3" />
      <path d="M65 29.5 C 60 26.5 55 26 50 27.5" strokeWidth="0.7" opacity="0.26" />
      <path d="M66.5 28.5 C 72 27 78 28 83 31" strokeWidth="0.7" opacity="0.26" />

      {/* The curtain. */}
      {FROND_GROUPS.map((group, g) => (
        <g
          key={g}
          className="mk-frond"
          style={{ animationDelay: `${g * -2.4}s` }}
        >
          {group.map((f) => (
            <path key={f.d} d={f.d} strokeWidth={f.width} opacity={f.opacity} />
          ))}
        </g>
      ))}

      {/* The knight, resting against the trunk. */}
      <g fill="currentColor" stroke="none" opacity="0.8">
        <circle cx="72" cy="71.5" r="2.5" />
        <path d="M69.4 81 C 68.8 76.5 69.8 74 72 74 C 74.2 74 75.2 76.5 74.6 81 Z" />
      </g>
      <path d="M74 80.8 L 83 81.8" strokeWidth="2.1" opacity="0.8" />

      {/* The blade, laid down. */}
      <path d="M87 83 H 97" strokeWidth="0.9" opacity="0.45" />
      <path d="M89.2 81.6 V 84.4" strokeWidth="0.9" opacity="0.45" />
    </svg>
  );
}

export default function MoonKnightAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const [unavailable, setUnavailable] = useState<string[]>([]);

  const playToken = useRef(0);
  const loadedTrack = useRef<string | null>(null);

  const markUnavailable = (id: string) => {
    setUnavailable((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const stop = () => {
    const a = audioRef.current;
    playToken.current++;
    if (a) {
      a.pause();
      if (a.src) a.currentTime = 0;
    }
    setActiveTrack(null);
  };

  const playTrack = (track: Track) => {
    const a = audioRef.current;
    if (!a || unavailable.includes(track.id)) return;

    if (activeTrack === track.id) {
      stop();
      return;
    }

    stop();

    const token = ++playToken.current;
    loadedTrack.current = track.id;
    a.src = track.src;
    a.loop = true;
    a.play()
      .then(() => {
        if (token !== playToken.current) return;
        setActiveTrack(track.id);
      })
      .catch((err: unknown) => {
        if (token !== playToken.current) return;
        setActiveTrack(null);
        const name = err instanceof DOMException ? err.name : "";
        if (name !== "NotAllowedError" && name !== "AbortError") markUnavailable(track.id);
      });
  };

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    const onError = () => {
      if (loadedTrack.current) markUnavailable(loadedTrack.current);
      setActiveTrack(null);
    };
    const onEnded = () => setActiveTrack(null);

    a.addEventListener("error", onError);
    a.addEventListener("ended", onEnded);
    return () => {
      a.removeEventListener("error", onError);
      a.removeEventListener("ended", onEnded);
    };
  }, []);

  const playingTrack = TRACKS.find((t) => t.id === activeTrack);

  return (
    <div>
      <audio ref={audioRef} preload="none" />

      <div className="mk-score-grid">
        {TRACKS.map((track) => {
          const playing = activeTrack === track.id;
          const missing = unavailable.includes(track.id);

          return (
            <button
              key={track.id}
              onClick={() => playTrack(track)}
              disabled={missing}
              aria-pressed={playing}
              aria-label={
                missing
                  ? `${track.name} — ${track.role} — not available yet`
                  : playing
                    ? `Pause ${track.name}, ${track.role}`
                    : `Play ${track.name}, ${track.role}`
              }
              className="panel"
              style={{
                textAlign: "left",
                border: `1px solid color-mix(in srgb, ${track.tint} ${playing ? "60%" : "25%"}, transparent)`,
                padding: "1.6rem",
                cursor: missing ? "not-allowed" : "pointer",
                display: "flex",
                flexDirection: "column",
                gap: "0.9rem",
                opacity: missing ? 0.55 : 1,
                transition: "border-color 0.3s ease, opacity 0.3s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                <div>
                  <span className="mono" style={{ fontSize: "0.68rem", color: track.tint }}>
                    {track.role}
                  </span>
                  <h3
                    style={{
                      margin: "0.35rem 0 0",
                      fontSize: "var(--text-lg)",
                      fontFamily: "var(--font-hero)",
                    }}
                  >
                    {track.name}
                  </h3>
                </div>
                <span
                  aria-hidden
                  style={{
                    flexShrink: 0,
                    width: "2.4rem",
                    height: "2.4rem",
                    borderRadius: "50%",
                    border: `1px solid ${track.tint}`,
                    color: track.tint,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.8rem",
                  }}
                >
                  {missing ? "—" : playing ? "❚❚" : "▶"}
                </span>
              </div>

              <p style={{ margin: 0, color: "var(--color-mist)", fontSize: "0.92rem", lineHeight: 1.55 }}>
                {track.mood}
              </p>

              <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                {track.art === "willow" && <Willow playing={playing} />}

                <div
                  aria-hidden
                  style={{ display: "flex", gap: "3px", height: "1.5rem", alignItems: "flex-end", opacity: playing ? 1 : 0.22 }}
                >
                  {[...Array(14)].map((_, i) => (
                    <span
                      key={i}
                      className={playing ? "mk-score-bar" : ""}
                      style={{
                        flex: 1,
                        background: track.tint,
                        height: playing ? "40%" : "18%",
                        borderRadius: "1px",
                        animationDelay: `${i * 0.08}s`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {missing && (
                <span className="mono" style={{ fontSize: "0.71rem", color: "var(--color-mist)" }}>
                  Recording not available yet
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="mono" style={{ fontSize: "0.68rem", color: "var(--color-mist)", marginTop: "1.25rem", minHeight: "1rem" }}>
        {playingTrack ? `Now playing · ${playingTrack.name}` : "\u00A0"}
      </p>

      <style>{`
        .mk-score-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }
        @media (min-width: 760px) {
          .mk-score-grid { grid-template-columns: repeat(2, 1fr); }
        }
        .mk-willow {
          display: block;
          width: 100%;
          max-width: 190px;
          height: auto;
          opacity: 0.5;
          transition: opacity 0.4s ease;
        }
        .mk-willow.is-playing { opacity: 1; }
        /* fill-box hinges each curtain at the crown without hard-coding viewBox coordinates. */
        .mk-frond {
          transform-box: fill-box;
          transform-origin: 50% 0%;
          animation: mkwillowsway 9s ease-in-out infinite;
        }
        .mk-willow.is-playing .mk-frond { animation-duration: 5.5s; }
        @keyframes mkwillowsway {
          0%, 100% { transform: rotate(-1.1deg); }
          50%      { transform: rotate(1.1deg); }
        }
        @media (prefers-reduced-motion: reduce) { .mk-frond { animation: none } }
        @keyframes mkscorepulse { 0%, 100% { height: 25% } 50% { height: 100% } }
        .mk-score-bar { animation: mkscorepulse 1.6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .mk-score-bar { animation: none } }
      `}</style>
    </div>
  );
}

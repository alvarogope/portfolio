import KnightHead from "@/components/project/KnightHead";

export default function LostKnight() {
  return (
    <div aria-hidden style={{ width: "min(340px, 78vw)", lineHeight: 0 }}>
      <svg
        viewBox="0 0 200 190"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
        style={{ display: "block" }}
      >
        <defs>
          <radialGradient id="lostKnightMoonGlow">
            <stop offset="0%" stopColor="var(--color-silver)" stopOpacity="0.20" />
            <stop offset="55%" stopColor="var(--color-silver)" stopOpacity="0.05" />
            <stop offset="100%" stopColor="var(--color-silver)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="lostKnightMoonDisc" cx="38%" cy="34%">
            <stop offset="0%" stopColor="#D7DEE8" stopOpacity="0.78" />
            <stop offset="100%" stopColor="#8E9BAC" stopOpacity="0.38" />
          </radialGradient>
        </defs>

        <g shapeRendering="auto">
          <circle
            className="lost-knight__glow"
            cx="42"
            cy="36"
            r="46"
            fill="url(#lostKnightMoonGlow)"
          />
          <circle cx="42" cy="36" r="15" fill="url(#lostKnightMoonDisc)" />
          <circle cx="37" cy="32" r="3.5" fill="#0B0E14" opacity="0.14" />
          <circle cx="47" cy="41" r="2.5" fill="#0B0E14" opacity="0.12" />
          <circle cx="45" cy="29" r="1.6" fill="#0B0E14" opacity="0.1" />
        </g>
        <g fill="var(--color-silver)">
          <rect x="150" y="24" width="1.5" height="1.5" opacity="0.45" />
          <rect x="176" y="52" width="1.5" height="1.5" opacity="0.3" />
          <rect x="120" y="18" width="1.5" height="1.5" opacity="0.28" />
          <rect x="14" y="86" width="1.5" height="1.5" opacity="0.22" />
        </g>

        <g>
          <path
            d="M58 166 L64 160 L92 160 L98 161 L118 160 L138 160 L142 167 L138 174 L120 176 L86 175 L64 173 Z"
            fill="var(--color-nightfall)"
          />
          <path
            d="M18 172 L26 166 L44 163 L52 162 L54 170 L46 176 L28 178 L20 177 Z"
            fill="var(--color-nightfall)"
          />
          <path
            d="M150 168 L162 164 L180 165 L186 170 L184 178 L168 181 L154 178 Z"
            fill="var(--color-nightfall)"
          />
          <g stroke="var(--color-mist)" strokeWidth="1" strokeOpacity="0.55" fill="none">
            <path d="M64 160 L92 160 L98 161 L118 160 L138 160" />
            <path d="M26 166 L44 163 L52 162" />
            <path d="M162 164 L180 165 L186 170" />
          </g>
          <g stroke="#000000" strokeWidth="1" strokeOpacity="0.5" fill="none">
            <path d="M124 162 L132 161" />
            <path d="M133 163 L139 165" />
          </g>
          <path d="M104 182 L115 180 L117 187 L106 188 Z" fill="#1A2231" />
          <path d="M62 185 L73 183 L74 190 L63 190 Z" fill="#161D2A" />
          <path d="M140 186 L147 185 L148 190 L141 190 Z" fill="#141B28" />
        </g>

        <ellipse cx="100" cy="161" rx="29" ry="3" fill="#000000" opacity="0.45" />

        {/* ---- The knight ---- */}
        <g className="lost-knight__figure">
          {/* cloak */}
          <path
            d="M78 76 L122 76 L134 153 L117 145 L100 151 L83 145 L66 153 Z"
            fill="var(--color-scarlet)"
            opacity="0.32"
          />

          {/* sword */}
          <rect x="128" y="78" width="8" height="5" fill="var(--color-gold)" opacity="0.6" />
          <rect x="130" y="83" width="4" height="10" fill="#272c33" />
          <rect x="122" y="93" width="20" height="4" fill="var(--color-gold)" opacity="0.6" />
          <rect x="129" y="97" width="6" height="65" fill="#8b95a4" />
          <rect x="129" y="97" width="2" height="65" fill="#b8c4d4" opacity="0.8" />

          {/* head —  */}
          <g transform="translate(68 20)">
            <KnightHead />
          </g>

          {/* gorget */}
          <rect x="88" y="71" width="24" height="8" fill="#3b414a" />
          <rect x="88" y="71" width="24" height="2" fill="#68717c" />

          {/* breastplate */}
          <rect x="86" y="78" width="28" height="30" fill="#454c56" />
          <rect x="86" y="78" width="5" height="30" fill="#59616c" />
          <rect x="109" y="78" width="5" height="30" fill="#2b3038" />
          <rect x="99" y="78" width="2" height="30" fill="#3b414a" />
          <path d="M100 86 L105 92 L100 98 L95 92 Z" fill="var(--color-gold)" opacity="0.5" />

          {/* belt */}
          <rect x="85" y="108" width="30" height="6" fill="#272c33" />
          <rect x="96" y="108" width="8" height="6" fill="var(--color-gold)" opacity="0.45" />

          {/* tassets */}
          <path d="M86 114 L114 114 L111 131 L89 131 Z" fill="#3b414a" />
          <path d="M86 114 L91 114 L89 131 L87 131 Z" fill="#4f5761" />

          {/* legs */}
          <rect x="90" y="131" width="9" height="21" fill="#4b525c" />
          <rect x="101" y="131" width="9" height="21" fill="#3b414a" />
          <rect x="89" y="136" width="11" height="5" fill="#626a75" />
          <rect x="100" y="136" width="11" height="5" fill="#4c535d" />
          <rect x="87" y="152" width="14" height="8" fill="#272c33" />
          <rect x="99" y="152" width="14" height="8" fill="#20242a" />

          {/* arms */}
          <rect x="73" y="82" width="10" height="20" fill="#4b525c" />
          <rect x="73" y="82" width="3" height="20" fill="#626a75" />
          <rect x="72" y="100" width="12" height="10" fill="#626a75" />
          <rect x="72" y="106" width="12" height="4" fill="#4b525c" />
          <rect x="117" y="80" width="10" height="16" fill="#4c535d" />

          {/* pauldrons */}
          <path d="M70 80 L88 74 L90 88 L72 94 Z" fill="#626a75" />
          <path d="M70 80 L88 74 L88 78 L71 84 Z" fill="#818a95" />
          <path d="M112 74 L130 80 L128 94 L110 88 Z" fill="#4c535d" />
          <path d="M112 74 L130 80 L129 84 L112 78 Z" fill="#707984" />

          {/* sword hand */}
          <rect x="124" y="82" width="11" height="11" fill="#626a75" />
          <rect x="124" y="88" width="11" height="5" fill="#4b525c" />
        </g>
      </svg>

      <style>{`
        /* A slow breath, roughly ten times the period of the dialogue
           bob — he is standing still, not speaking. */
        @keyframes lostKnightBob {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-1.5px); }
        }

        @keyframes lostKnightGlow {
          0%, 100% { opacity: 0.7; }
          50%      { opacity: 1; }
        }

        .lost-knight__figure { animation: lostKnightBob 4.6s ease-in-out infinite; }
        .lost-knight__glow   { animation: lostKnightGlow 7s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .lost-knight__figure,
          .lost-knight__glow {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
export default function KnightHead({
  mouth = "idle",
}: {
  mouth?: "idle" | "animated";
}) {
  return (
    <g>
      {/* Upper Helmet */}
      <path
        fill="#3b414a"
        d="
          M16 22
          L18 14
          L23 9
          L31 7
          L40 9
          L46 14
          L49 22
          L49 39
          L45 47
          L39 52
          L24 52
          L18 47
          L15 39
          L15 25
          Z
        "
      />

      {/* Helmet Highlight */}
      <path
        fill="#59616c"
        d="
          M23 11
          L31 8
          L36 9
          L30 13
          L22 18
          L19 27
          L18 21
          L19 15
          Z
        "
      />

      {/* lower Helmet */}
      <path
        fill="#272c33"
        d="
          M16 34
          L20 39
          L27 42
          L40 42
          L47 37
          L48 43
          L44 48
          L38 52
          L25 52
          L19 47
          L16 40
          Z
        "
      />

      {/* Face */}
      <path
        fill="#d89b72"
        d="
          M23 24
          L27 20
          L38 20
          L43 24
          L43 37
          L39 42
          L32 45
          L25 41
          L22 36
          L22 27
          Z
        "
      />

      {/* Face Shadow */}
      <path
        fill="#b87555"
        d="
          M37 21
          L42 25
          L42 36
          L38 41
          L32 44
          L32 39
          L36 37
          L38 32
          L38 25
          Z
        "
      />

      {/* Hair */}
      <path
        fill="#352821"
        d="
          M23 24
          L24 20
          L28 17
          L37 17
          L41 20
          L43 25
          L38 23
          L34 21
          L29 22
          L25 26
          Z
        "
      />

      <path
        fill="#503a2d"
        d="
          M27 18
          L32 17
          L36 18
          L31 20
          L27 22
          L24 24
          L25 20
          Z
        "
      />

      {/* Eyes */}
      <rect x="25" y="28" width="5" height="3" fill="#20242a" />
      <rect x="26" y="28" width="2" height="1" fill="#f4f4f4" />
      <rect x="36" y="28" width="5" height="3" fill="#20242a" />
      <rect x="36" y="28" width="2" height="1" fill="#f4f4f4" />

      {/* Nose */}
      <path
        fill="#a9654d"
        d="
          M31 29
          L34 29
          L34 34
          L32 35
          L29 34
          L31 33
          Z
        "
      />

      {/* Mouth */}
      <g className={mouth === "animated" ? "avatar-mouth-closed" : undefined}>
        <rect x="28" y="37" width="9" height="2" fill="#713f38" />
        <rect x="30" y="37" width="5" height="1" fill="#e8b18a" />
      </g>

      {mouth === "animated" && (
        <g className="avatar-mouth-open">
          <rect x="29" y="36" width="7" height="4" fill="#4a2622" />
          <rect x="30" y="36" width="5" height="1" fill="#e8b18a" />
        </g>
      )}

      {/* Visor */}
      <path
        fill="#707984"
        d="
          M14 23
          L21 21
          L21 38
          L17 37
          L14 33
          Z
        "
      />

      <path
        fill="#707984"
        d="
          M43 21
          L50 23
          L50 33
          L47 37
          L43 38
          Z
        "
      />

      <path
        fill="#818a95"
        d="
          M18 20
          L24 16
          L40 16
          L46 20
          L43 25
          L21 25
          Z
        "
      />

      <path
        fill="#4b525c"
        d="
          M21 24
          L43 24
          L43 28
          L21 28
          Z
        "
      />

      {/* Visor Slits */}
      <rect x="23" y="24" width="4" height="2" fill="#1a1d22" />
      <rect x="30" y="24" width="4" height="2" fill="#1a1d22" />
      <rect x="37" y="24" width="4" height="2" fill="#1a1d22" />

      {/* Cheek Plates */}
      <path
        fill="#626a75"
        d="
          M15 31
          L20 34
          L20 43
          L17 40
          L15 36
          Z
        "
      />

      <path
        fill="#4c535d"
        d="
          M44 34
          L49 31
          L49 36
          L47 40
          L44 43
          Z
        "
      />

      {/* Helmet Ridge */}
      <rect x="30" y="8" width="4" height="8" fill="#68717c" />
      <rect x="31" y="9" width="2" height="6" fill="#858e99" />

      {/* Neck */}
      <rect x="19" y="43" width="3" height="6" fill="#1f2329" />
      <rect x="42" y="43" width="3" height="6" fill="#1f2329" />
      <rect x="26" y="48" width="12" height="6" fill="#252a30" />
      <rect x="29" y="48" width="6" height="2" fill="#4e555f" />
    </g>
  );
}

import type { BestiaryId } from "@/content/moon-knight-bestiary";

export function EmblemSprite() {
  return (
    <svg width="0" height="0" aria-hidden focusable="false" style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="mkb-plate" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E4E8F0" />
          <stop offset="52%" stopColor="#B8C4D4" />
          <stop offset="100%" stopColor="#C9A961" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const PLATE = "url(#mkb-plate)";
const VOID = "var(--color-void)";

/* ---------------------------------------------------------------- bosses -- */

function WerewolfEmblem() {
  return (
    <g>
      <path
        fill={PLATE}
        d="M12 40 L52 28 L58 4 L72 26 L77 24 L92 6 L100 34
           Q107 56 100 79 Q91 103 66 108 Q47 106 42 94
           Q34 82 18 66 L48 58 Q30 50 12 40 Z"
      />
      {/* fangs, top and bottom of the open jaw */}
      <path fill={VOID} d="M17 44 L23 58 L28 47 Z" />
      <path fill={VOID} d="M31 50 L36 62 L41 52 Z" />
      <path fill={VOID} d="M23 64 L28 52 L33 63 Z" />
      {/* eye */}
      <path fill={VOID} d="M60 45 L76 40 L73 50 Z" />
      {/* nose */}
      <path fill={VOID} d="M13 40 L23 36 L21 43 Z" />
      {/* ruff */}
      <path
        fill="currentColor"
        d="M99 78 L110 82 L100 88 L109 96 L97 98 L100 108 L88 105 Z"
      />
    </g>
  );
}

/** Horse-bodied knight */
function CentaurKnightEmblem() {
  return (
    <g>
      {/* lance */}
      <g transform="rotate(-42 60 74)">
        <rect x="56" y="4" width="7" height="122" fill={PLATE} />
        <path fill={PLATE} d="M59.5 -6 L67 10 L52 10 Z" />
        <rect x="48" y="70" width="23" height="5" fill="currentColor" />
      </g>
      {/* barrel */}
      <path
        fill={PLATE}
        d="M24 88 Q22 72 42 70 L82 70 Q100 74 100 90 Q100 106 82 108 L42 108 Q26 106 24 88 Z"
      />
      {/* tail */}
      <path fill={PLATE} d="M25 80 Q9 82 4 102 Q14 92 22 94 Z" />
      {/* legs */}
      <path fill={PLATE} d="M34 104 L44 104 L46 132 L36 136 Z" />
      <path fill={PLATE} d="M50 106 L58 106 L58 130 L48 134 Z" />
      <path fill={PLATE} d="M78 104 L88 104 L90 132 L80 136 Z" />
      <path fill={PLATE} d="M64 106 L72 106 L74 130 L64 134 Z" />
      {/* human torso rising from the withers */}
      <path fill={PLATE} d="M74 74 L72 46 Q74 34 88 34 Q102 34 102 48 L98 76 Z" />
      {/* helmed head with crest */}
      <circle cx="88" cy="24" r="11" fill={PLATE} />
      <path fill="currentColor" d="M79 14 Q88 0 97 14 Q88 8 79 14 Z" />
      <rect x="79" y="21" width="18" height="5" fill={VOID} />
      {/* lance arm */}
      <path fill={PLATE} d="M96 46 L114 32 L119 40 L100 54 Z" />
    </g>
  );
}

/** Hooded caster, staff and bound orb. */
function WizardKnightEmblem() {
  return (
    <g>
      {/* staff */}
      <rect x="96" y="26" width="5" height="112" fill={PLATE} />
      <circle cx="98.5" cy="20" r="9" fill="currentColor" />
      <circle cx="98.5" cy="20" r="4" fill={VOID} />
      {/* robe */}
      <path fill={PLATE} d="M22 138 Q26 88 44 58 L74 58 Q92 88 96 138 Z" />
      {/* hood — the same pointed arch the card frame uses */}
      <path fill={PLATE} d="M59 8 Q86 24 88 64 Q59 76 30 64 Q32 24 59 8 Z" />
      {/* face hollow */}
      <path fill={VOID} d="M46 38 Q59 30 72 38 Q70 62 59 68 Q48 62 46 38 Z" />
      <circle cx="53" cy="46" r="3" fill="currentColor" />
      <circle cx="66" cy="46" r="3" fill="currentColor" />
      {/* hands at the staff */}
      <path fill={PLATE} d="M76 82 L96 76 L98 86 L78 92 Z" />
      {/* hem */}
      <path fill="none" stroke={VOID} strokeWidth="2.5" d="M28 122 Q59 114 92 122" />
    </g>
  );
}

/** Sun in eclipse, transfixed by a sword. Her sigil, not her portrait. */
function SunKnightEmblem() {
  const rays = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <g>
      <g fill="currentColor">
        {rays.map((deg) => (
          <path key={deg} transform={"rotate(" + deg + " 60 62)"} d="M60 12 L65 30 L55 30 Z" />
        ))}
      </g>
      {/* disc, then the moon crossing it */}
      <circle cx="60" cy="62" r="27" fill={PLATE} />
      <circle cx="72" cy="55" r="24" fill={VOID} />
      {/* sword */}
      <path fill={PLATE} d="M60 2 L67 16 L67 100 L53 100 L53 16 Z" />
      <rect x="30" y="98" width="60" height="8" fill={PLATE} />
      <rect x="55" y="106" width="10" height="20" fill={PLATE} />
      <circle cx="60" cy="130" r="8" fill={PLATE} />
      <circle cx="60" cy="130" r="3" fill={VOID} />
    </g>
  );
}

/* --------------------------------------------------------------- enemies -- */

/** Great-helm above a shouldered sword. */
function SoldiersEmblem() {
  return (
    <g>
      {/* sword, held upright at the shoulder */}
      <path fill={PLATE} d="M99 8 L105 24 L105 96 L93 96 L93 24 Z" />
      <rect x="80" y="94" width="38" height="7" fill="currentColor" />
      <rect x="94" y="101" width="10" height="17" fill={PLATE} />
      <circle cx="99" cy="121" r="5" fill={PLATE} />
      {/* pauldrons */}
      <path fill={PLATE} d="M18 138 Q20 100 44 94 L70 94 Q94 100 96 138 Z" />
      {/* great-helm */}
      <path fill={PLATE} d="M32 28 Q32 10 56 10 Q80 10 80 28 L80 64 Q80 78 56 82 Q32 78 32 62 Z" />
      <rect x="38" y="36" width="15" height="7" fill={VOID} />
      <rect x="59" y="36" width="15" height="7" fill={VOID} />
      <rect x="53" y="30" width="6" height="38" fill={VOID} />
      {/* breath holes */}
      <circle cx="44" cy="58" r="2" fill={VOID} />
      <circle cx="68" cy="58" r="2" fill={VOID} />
      <circle cx="44" cy="66" r="2" fill={VOID} />
      <circle cx="68" cy="66" r="2" fill={VOID} />
    </g>
  );
}

/** A soldier who stood still too long. Branch arms, root feet. */
function WoodenHumanoidsEmblem() {
  return (
    <g>
      {/* bare canopy — the arms are branches and there is nothing left on them */}
      <path
        fill="none"
        stroke={PLATE}
        strokeWidth="5"
        strokeLinecap="round"
        d="M55 40 L44 16 M60 38 L60 10 M65 40 L77 16
           M50 52 L26 34 M70 52 L95 34"
      />
      <path
        fill="none"
        stroke={PLATE}
        strokeWidth="3"
        strokeLinecap="round"
        d="M44 16 L32 8 M44 16 L42 3 M60 10 L50 3 M60 10 L70 3 M77 16 L89 8 M77 16 L80 3
           M26 34 L10 30 M26 34 L20 19 M95 34 L111 30 M95 34 L100 19"
      />
      {/* root-legs */}
      <path
        fill="none"
        stroke={PLATE}
        strokeWidth="9"
        strokeLinecap="round"
        d="M46 116 L30 136 M74 116 L92 136"
      />
      {/* the trunk it became */}
      <path fill={PLATE} d="M49 34 Q60 30 71 34 Q79 76 86 120 L34 120 Q41 76 49 34 Z" />
      {/* a small face, low on the bole: two knot-hollows and a split */}
      <ellipse cx="52" cy="74" rx="4.5" ry="6" fill={VOID} transform="rotate(-14 52 74)" />
      <ellipse cx="69" cy="74" rx="4.5" ry="6" fill={VOID} transform="rotate(14 69 74)" />
      <path fill={VOID} d="M50 88 L71 88 L67 96 L60 91 L54 97 Z" />
      {/* bark seams and an old knot */}
      <path
        fill="none"
        stroke={VOID}
        strokeWidth="2.4"
        strokeLinecap="round"
        d="M52 104 Q49 112 50 118 M61 103 Q60 112 62 118 M70 104 Q73 112 72 118"
      />
      <circle cx="76" cy="60" r="3.5" fill={VOID} />
    </g>
  );
}

/** Hunched swamp-dweller, tongue already out. */
function AmphibianHumanoidsEmblem() {
  return (
    <g>
      {/* tongue */}
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        d="M40 66 Q8 68 8 92 Q9 106 24 104"
      />
      {/* body */}
      <path fill={PLATE} d="M30 120 Q20 84 40 68 Q60 56 80 68 Q100 84 90 120 Z" />
      {/* haunches and webbed feet */}
      <path fill={PLATE} d="M30 108 Q14 116 12 134 L36 130 Z" />
      <path fill={PLATE} d="M90 108 Q106 116 108 134 L84 130 Z" />
      {/* head */}
      <path fill={PLATE} d="M32 64 Q32 40 60 40 Q88 40 88 64 Q60 78 32 64 Z" />
      <path fill={VOID} d="M36 62 Q60 72 84 62 Q60 68 36 62 Z" />
      {/* domed eyes */}
      <circle cx="43" cy="37" r="12" fill={PLATE} />
      <circle cx="77" cy="37" r="12" fill={PLATE} />
      <ellipse cx="43" cy="37" rx="4" ry="7" fill={VOID} />
      <ellipse cx="77" cy="37" rx="4" ry="7" fill={VOID} />
    </g>
  );
}

/** Veiled royalty mid-scream, claws out of the fog. */
function BansheesEmblem() {
  return (
    <g>
      {/* the song */}
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.75"
        d="M14 34 Q4 56 12 78 M106 34 Q116 56 108 78"
      />
      {/* clawed hands, out from under the veil */}
      <g fill={PLATE}>
        <path d="M27 84 Q12 88 10 100 Q9 112 18 116 L26 104 Z" />
        <path d="M93 84 Q108 88 110 100 Q111 112 102 116 L94 104 Z" />
      </g>
      <g fill="none" stroke={PLATE} strokeWidth="3.4" strokeLinecap="round">
        <path d="M12 100 Q4 108 6 120 M17 110 Q11 120 15 130 M24 112 Q22 124 28 131" />
        <path d="M108 100 Q116 108 114 120 M103 110 Q109 120 105 130 M96 112 Q98 124 92 131" />
      </g>
      {/* veil */}
      <path
        fill={PLATE}
        d="M60 4 Q92 24 96 76 Q98 110 90 136 L30 136 Q22 110 24 76 Q28 24 60 4 Z"
      />
      {/* face hollow */}
      <ellipse cx="60" cy="52" rx="17" ry="22" fill={VOID} />
      <path fill="currentColor" d="M52 42 L58 45 L51 48 Z" />
      <path fill="currentColor" d="M68 42 L62 45 L69 48 Z" />
      {/* the wail */}
      <ellipse cx="60" cy="63" rx="6" ry="11" fill="currentColor" />
      {/* hem */}
      <path fill={VOID} d="M30 136 Q40 126 50 136 Q60 126 70 136 Q80 126 90 136 Z" />
    </g>
  );
}

/** A wisp that is only there once you are too close. */
function GhostsEmblem() {
  return (
    <g opacity="0.86">
      <path
        fill={PLATE}
        d="M60 8 Q94 18 94 60 Q94 94 86 116 Q78 134 60 130
           Q46 126 44 108 Q42 92 30 96 Q14 100 14 82 Q14 44 34 24 Q46 12 60 8 Z"
      />
      <ellipse cx="49" cy="52" rx="7" ry="10" fill={VOID} />
      <ellipse cx="73" cy="50" rx="7" ry="10" fill={VOID} />
      <ellipse cx="61" cy="76" rx="6" ry="9" fill={VOID} />
      {/* fog that moves oddly */}
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.8"
        d="M4 118 Q24 110 40 120 M78 128 Q96 120 116 126"
      />
    </g>
  );
}

/** Faceted armour, shard for a blade. */
function IceKnightsEmblem() {
  return (
    <g>
      {/* shard blade */}
      <path fill={PLATE} d="M96 10 L106 44 L100 90 L90 90 L86 44 Z" opacity="0.9" />
      <path fill={VOID} d="M96 20 L100 46 L96 78 L93 46 Z" opacity="0.55" />
      <rect x="88" y="90" width="16" height="5" fill="currentColor" />
      <rect x="93" y="95" width="6" height="16" fill={PLATE} />
      {/* shoulder crystals */}
      <path fill="currentColor" d="M34 92 L26 62 L46 82 Z" />
      <path fill="currentColor" d="M86 92 L94 62 L74 82 Z" />
      {/* faceted torso */}
      <path fill={PLATE} d="M30 100 L48 76 L72 76 L90 100 L94 138 L26 138 Z" />
      <path fill="none" stroke={VOID} strokeWidth="2" d="M60 78 L60 138 M32 102 L60 112 L88 102" />
      {/* faceted helm */}
      <path fill={PLATE} d="M60 10 L84 32 L80 62 L60 74 L40 62 L36 32 Z" />
      <path fill={VOID} d="M46 38 L74 38 L70 50 L50 50 Z" />
      <path fill="none" stroke={VOID} strokeWidth="2" d="M60 12 L60 36 M60 52 L60 72" />
    </g>
  );
}

/** Emblem lookup. One entry per bestiary id — swap a function to reskin one creature. */
export const EMBLEMS: Record<BestiaryId, () => React.ReactElement> = {
  werewolf: WerewolfEmblem,
  "centaur-knight": CentaurKnightEmblem,
  "wizard-knight": WizardKnightEmblem,
  "sun-knight": SunKnightEmblem,
  soldiers: SoldiersEmblem,
  "wooden-humanoids": WoodenHumanoidsEmblem,
  "amphibian-humanoids": AmphibianHumanoidsEmblem,
  banshees: BansheesEmblem,
  ghosts: GhostsEmblem,
  "ice-knights": IceKnightsEmblem,
};

/** Decorative by definition — the creature's name is always beside it as text. */
export function CreatureEmblem({ id }: { id: BestiaryId }) {
  const Emblem = EMBLEMS[id];
  return (
    <svg
      className="mkb__emblem"
      viewBox="0 0 120 140"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
      focusable="false"
    >
      <Emblem />
    </svg>
  );
}

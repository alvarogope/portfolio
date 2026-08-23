import type { CastId } from "@/content/moon-knight-cast";

/**
 * Moon-Knight — cast emblems.
 *
 * Five heraldic marks, one per character. SYMBOLS, NOT PORTRAITS: nobody in
 * this game gets a face on this page, because the interesting thing about each
 * of them is what they mean, not what they look like.
 *
 * Same rules as `BestiaryEmblems.tsx`, so the two sections sit together:
 *   - one self-contained function per character on a shared `0 0 120 120`
 *     viewBox, registered in `EMBLEMS` by `CastId`;
 *   - `url(#mkc-plate)` for steel mass, `url(#mkc-gold)` for gilt,
 *     `var(--color-void)` for cut-outs, `currentColor` for accents — the plate
 *     behind the emblem sets `currentColor` to that character's accent;
 *   - keep the mark between y 4 and y 116 and centred on x 60.
 *
 * `CastSprite` holds the shared gradients and must render exactly ONCE per
 * page (the ids are global). `Cast` does that at the top of its section.
 */

export function CastSprite() {
  return (
    <svg width="0" height="0" aria-hidden focusable="false" style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="mkc-plate" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E4E8F0" />
          <stop offset="55%" stopColor="#B8C4D4" />
          <stop offset="100%" stopColor="#8E9AAC" />
        </linearGradient>
        <linearGradient id="mkc-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8D9A8" />
          <stop offset="100%" stopColor="#B8974E" />
        </linearGradient>
        {/* The stain is painted as a single rect clipped to the flower (see
            DeathEmblem), so this is a plain top-to-bottom ramp across THAT
            rect — never applied to the petals one by one, which would stain
            each of them identically and just read as a pink rose. */}
        <linearGradient id="mkc-bleed" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8E2F3C" stopOpacity="0" />
          <stop offset="30%" stopColor="#9E2F3B" stopOpacity="0.32" />
          <stop offset="66%" stopColor="#B32F3C" stopOpacity="0.88" />
          <stop offset="100%" stopColor="#C4333F" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="mkc-ember" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#E07A45" />
          <stop offset="100%" stopColor="#F0C271" />
        </linearGradient>
        {/* Orpheus's coal: burnt crust outside, and the heat it throws. */}
        <linearGradient id="mkc-coal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#402E24" />
          <stop offset="100%" stopColor="#16100D" />
        </linearGradient>
        <radialGradient id="mkc-glow">
          <stop offset="0%" stopColor="#E07A45" stopOpacity="0.42" />
          <stop offset="58%" stopColor="#E07A45" stopOpacity="0.13" />
          <stop offset="100%" stopColor="#E07A45" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

const PLATE = "url(#mkc-plate)";
const GOLD = "url(#mkc-gold)";
const EMBER = "url(#mkc-ember)";
const COAL = "url(#mkc-coal)";
const VOID = "var(--color-void)";

/* ------------------------------------------------------------- the player -- */

/**
 * THE MOON-KNIGHT — a helm and a harp, either side of a seam.
 *
 * The emblem IS the character-design decision, so it is drawn as two WHOLE
 * objects rather than one hybrid: a sugarloaf great-helm on the left, a harp
 * on the right, a dashed seam between them. Half of each would have been
 * cleverer and unreadable at 140px.
 *
 * They are also drawn in two different MATERIALS on purpose — the helm is
 * solid steel plate, the harp is gold line-work — because two silver
 * silhouettes of similar mass merge into one blob at card size. The contrast
 * has to survive being small; that is the entire job of this mark.
 */
function MoonKnightEmblem() {
  return (
    <g>
      {/* the seam the character is built across */}
      <path
        d="M60 12 V104"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeDasharray="5 7"
        opacity="0.75"
        fill="none"
      />

      {/* ---- helm: how the player reads ---- */}
      <path fill={PLATE} d="M12 54 C12 34 20 20 32 20 C44 20 52 34 52 54 L52 84 L47 94 H17 L12 84 Z" />
      {/* one wide sight slit reads as a helm; two eye holes read as a face */}
      <path fill={VOID} d="M12 52 H52 V62 H12 Z" />
      <path fill={VOID} d="M29 28 H35 V90 H29 Z" />
      <g fill={VOID}>
        <circle cx="21" cy="71" r="2.1" />
        <circle cx="21" cy="80" r="2.1" />
        <circle cx="25" cy="75.5" r="2.1" />
        <circle cx="43" cy="71" r="2.1" />
        <circle cx="43" cy="80" r="2.1" />
        <circle cx="39" cy="75.5" r="2.1" />
      </g>

      {/* ---- harp: how the player heals ---- */}
      <HarpMark />
    </g>
  );
}

/**
 * THE HARP, on its own. Occupies roughly x 74–112, y 18–94 of the shared
 * `0 0 120 120` box, so a caller wanting it alone crops to that rather than
 * moving it — the instrument is the same object in every section it appears
 * in. `DiegeticDesign` draws it for the healing mechanic that way.
 *
 * Frame and strings take separate inks because the frame is mass and the
 * strings are detail: at emblem size they have to be told apart, and one
 * colour for both loses the strings entirely.
 */
export function HarpMark({
  frame = GOLD,
  strings = "#E8D9A8",
}: {
  frame?: string;
  strings?: string;
}) {
  return (
    <>
      <g fill="none" stroke={frame} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M74 32 Q98 18 106 44 L106 92" />
        <path d="M74 32 L88 92" />
        <path d="M80 94 H112" />
      </g>
      <g stroke={strings} strokeWidth="1.5" opacity="0.95">
        <path d="M83 28 L77.5 47" />
        <path d="M90.6 27 L80.3 59" />
        <path d="M97 30 L83.1 71" />
        <path d="M102 35 L85.5 81" />
        <path d="M106 44 L87.6 90" />
      </g>
    </>
  );
}

/* --------------------------------------------------------- the encounters -- */

/* The rose recurs across the game — it is Death's mark here and the unit of
   XP in `DiegeticDesign`, where a rose is stained per boss killed. Both are
   the same flower, so the geometry is exported rather than redrawn: five outer
   petals and three inner ones, each the same path rotated about (60, 56). */
export const ROSE_PETALS = [0, 72, 144, 216, 288];
export const ROSE_INNER = [0, 120, 240];
export const ROSE_PETAL = "M60 56 C44 50 41 24 60 17 C79 24 76 50 60 56 Z";
export const ROSE_PETAL_INNER = "M60 56 C51 52 49 37 60 33 C71 37 69 52 60 56 Z";

/**
 * DEATH — a white rose, taking the stain.
 *
 * Her whole character is one image from the ending: she holds you, and the
 * white dress goes red from the hem up. So the rose is painted white, then the
 * IDENTICAL geometry is painted again under a bottom-weighted scarlet
 * gradient — the bleed is the same flower, not an ornament beside it.
 */
function DeathEmblem() {
  const rose = (fill: string) => (
    <>
      {ROSE_PETALS.map((a) => (
        <path key={"o" + a} d={ROSE_PETAL} fill={fill} transform={"rotate(" + a + " 60 56)"} />
      ))}
      {ROSE_INNER.map((a) => (
        <path
          key={"i" + a}
          d={ROSE_PETAL_INNER}
          fill={fill}
          transform={"rotate(" + a + " 60 56)"}
        />
      ))}
    </>
  );

  return (
    <g>
      <path d="M60 56 V98" stroke="#8E9AA4" strokeWidth="3" fill="none" />
      <path fill="#6F7C74" d="M60 74 L44 68 L58 80 Z" />
      <path fill="#6F7C74" d="M60 86 L76 80 L62 92 Z" />
      {/* sepals, set between the petals — the mark reads heraldic, not floral */}
      <g fill="#6F7C74">
        {[36, 108, 180, 252, 324].map((a) => (
          <path
            key={"s" + a}
            d="M60 56 L55 32 L60 18 L65 32 Z"
            transform={"rotate(" + a + " 60 56)"}
          />
        ))}
      </g>

      <defs>
        <clipPath id="mkc-rose-clip">{rose("#000")}</clipPath>
      </defs>
      <g stroke={VOID} strokeWidth="1.4" strokeLinejoin="round">
        {rose("#F3F5F8")}
      </g>
      {/* the hem going red */}
      <rect
        x="14"
        y="48"
        width="92"
        height="52"
        fill="url(#mkc-bleed)"
        clipPath="url(#mkc-rose-clip)"
      />
      <circle cx="60" cy="56" r="4.5" fill="#C4333F" />

      <path fill="#C4333F" d="M60 96 Q68 105 60 114 Q52 105 60 96 Z" />
      <ellipse cx="60" cy="117" rx="12" ry="2.8" fill="#A82E39" opacity="0.85" />
    </g>
  );
}

/**
 * ORPHEUS — the ember left after the fire.
 *
 * Deliberately NOT a flame. A flame is a fire still happening, and his whole
 * beat is that you come back too late: the warning was given, the village is
 * already gone. So the mark is one coal in a bed of ash — burnt crust with the
 * heat still showing through the cracks, two spent coals beside it that have
 * stopped glowing, and the last of him going up as sparks.
 *
 * The ground line is the same one that runs under the Moon-Knight's helm and
 * harp: what the world stands on, and what it takes back.
 */
function OrpheusEmblem() {
  return (
    <g>
      {/* the heat still coming off it */}
      <circle cx="60" cy="70" r="42" fill="url(#mkc-glow)" />

      {/* the bed of ash */}
      <path fill="#3A414E" d="M14 104 Q38 90 60 94 Q84 90 106 104 Z" opacity="0.95" />
      <path d="M8 104 H112" stroke="currentColor" strokeWidth="2.2" fill="none" />
      <g stroke="currentColor" strokeWidth="1.2" opacity="0.45">
        <path d="M14 111 L20 104M30 111 L36 104M46 111 L52 104M62 111 L68 104M78 111 L84 104M94 111 L100 104" />
      </g>
      {/* it is still hot where it sits */}
      <ellipse cx="60" cy="91" rx="27" ry="7.5" fill="#E07A45" opacity="0.32" />

      {/* the coal: crust outside, heat in the fissures */}
      <path
        fill={COAL}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        d="M60 47 L76 54 L85 66 L81 82 L65 90 L48 87 L37 77 L39 59 Z"
      />
      <g fill="none" stroke="#F2AC62" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M43 82 L52 73 L56 63 L63 56 L70 53" />
        <path d="M56 63 L64 68 L77 71" />
        <path d="M52 73 L41 69" />
        <path d="M63 56 L61 47" />
      </g>
      <g fill="#FFDCA6">
        <circle cx="56" cy="63" r="2.7" />
        <circle cx="52" cy="73" r="2.2" />
        <circle cx="63" cy="56" r="2.2" />
      </g>

      {/* the last of him, going up */}
      <g fill={EMBER}>
        <circle cx="72" cy="32" r="2.8" opacity="0.9" />
        <circle cx="82" cy="20" r="2" opacity="0.7" />
        <circle cx="66" cy="14" r="1.5" opacity="0.5" />
        <circle cx="88" cy="34" r="1.4" opacity="0.45" />
      </g>
    </g>
  );
}

/* ------------------------------------------------------------- the mirror --
   The Witch and the Druid share their entire frame — the same dashed sigil
   ring, the same four cardinal diamonds, the same almond eye. Only what sits
   INSIDE the eye differs: hers is open onto an orbital diagram, his is shut
   under a seal. Drawing both from one shell is what makes the pair legible as
   one question with two answers, so the shell lives here and neither emblem is
   allowed to redraw it. */

function MirrorShell({ children }: { children: React.ReactNode }) {
  return (
    <g>
      <circle
        cx="60"
        cy="60"
        r="54"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeDasharray="3 7"
        opacity="0.7"
      />
      <g fill="currentColor">
        <path d="M60 0 L64 6 L60 12 L56 6 Z" />
        <path d="M60 108 L64 114 L60 120 L56 114 Z" />
        <path d="M0 60 L6 56 L12 60 L6 64 Z" />
        <path d="M108 60 L114 56 L120 60 L114 64 Z" />
      </g>
      <path
        d="M14 60 Q60 24 106 60 Q60 96 14 60 Z"
        fill="#0B0E14"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      {children}
    </g>
  );
}

/** THE WITCH — the eye open, an orbital where the iris should be. */
function WitchEmblem() {
  return (
    <MirrorShell>
      {/* what she is looking at: the old gods, as quantum mechanics */}
      <g fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.95">
        <ellipse cx="60" cy="60" rx="25" ry="9.5" />
        <ellipse cx="60" cy="60" rx="25" ry="9.5" transform="rotate(60 60 60)" />
        <ellipse cx="60" cy="60" rx="25" ry="9.5" transform="rotate(120 60 60)" />
      </g>
      <g fill="currentColor">
        <circle cx="85" cy="60" r="2.6" />
        <circle cx="47.5" cy="38.4" r="2.6" />
        <circle cx="47.5" cy="81.6" r="2.6" />
      </g>
      <circle cx="60" cy="60" r="14" fill={VOID} stroke={PLATE} strokeWidth="2.4" />
      <circle cx="60" cy="60" r="5.5" fill={PLATE} />
      {/* it looks back */}
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.9">
        <path d="M60 22 V14M38 30 L34 23M82 30 L86 23M60 98 V106" />
      </g>
    </MirrorShell>
  );
}

/** THE DRUID — the same eye, shut, with a bind-rune sealed over it. */
function DruidEmblem() {
  return (
    <MirrorShell>
      {/* the lid, closed */}
      <path
        d="M18 54 Q60 80 102 54"
        fill="none"
        stroke={PLATE}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <g stroke={PLATE} strokeWidth="1.9" strokeLinecap="round" opacity="0.85">
        <path d="M28 64 L24 74M43 72 L41 83M60 76 L60 88M77 72 L79 83M92 64 L96 74" />
      </g>
      {/* the seal pressed over it, and the rune kept underneath */}
      <path
        d="M73 50 L66.5 61.3 L53.5 61.3 L47 50 L53.5 38.7 L66.5 38.7 Z"
        fill={VOID}
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <g stroke={PLATE} strokeWidth="2.6" strokeLinecap="round" fill="none">
        <path d="M60 40 V60M60 48 L67 42M60 48 L53 42" />
      </g>
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.55">
        <path d="M60 22 V14M60 98 V106" />
      </g>
    </MirrorShell>
  );
}

/* ----------------------------------------------------------------- lookup -- */

const EMBLEMS: Record<CastId, () => React.JSX.Element> = {
  "moon-knight": MoonKnightEmblem,
  death: DeathEmblem,
  witch: WitchEmblem,
  druid: DruidEmblem,
  orpheus: OrpheusEmblem,
};

/** Decorative in every case — the card always names the character in text. */
export function CastEmblem({ id }: { id: CastId }) {
  const Emblem = EMBLEMS[id];
  return (
    <svg
      className="mkc__emblem"
      viewBox="0 0 120 120"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
    >
      <Emblem />
    </svg>
  );
}

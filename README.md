# Álvaro Gómez Pérez | Technical Game Designer

**I design game systems and build them myself.** This repository is the source code of my portfolio, live at **[alvarogomezgames.com](https://alvarogomezgames.com)**.

It presents four games I designed, two of which were shown at **Develop:Brighton 2025**. The site itself is a production Next.js application that I designed and wrote from scratch. This README covers both: the **games** (what I designed and built) and the **website** (how it is engineered, and why).

| | |
| --- | --- |
| **Role** | Technical Game Designer: systems, combat, level and world design, audio, engineering |
| **Engines** | Unreal Engine 5 (C++ and Blueprints), Unity (C#) |
| **Languages** | C++, C#, Python, TypeScript / JavaScript |
| **Tools** | Git, Perforce, Jira |
| **Education** | MA in Game Development. Moon-Knight began as my dissertation |
| **Contact** | [alvarogomezperez.work@gmail.com](mailto:alvarogomezperez.work@gmail.com) · [GitHub](https://github.com/alvarogope) |

---

## Contents

1. [The four games](#the-four-games)
2. [Engineering beyond games](#engineering-beyond-games)
3. [The website: stack](#the-website-stack)
4. [The website: architecture decisions](#the-website-architecture-decisions)
5. [Content design: written for a 30-second read](#content-design-written-for-a-30-second-read)
6. [Project structure](#project-structure)
7. [Running it locally](#running-it-locally)
8. [Credits](#credits)

---

## The four games

| Game | Genre | Engine | My role | Team | Year | Page |
| --- | --- | --- | --- | --- | --- | --- |
| **Moon-Knight** | Dark-fantasy action RPG | Unreal Engine 5 | Solo developer, full authorship | Solo | 2025 to present | [/moon-knight](https://alvarogomezgames.com/moon-knight) |
| **Shattered Skies** | Sci-fi co-op | Unity | Systems and world designer | 5 | 2025 | [/shattered-skies](https://alvarogomezgames.com/shattered-skies) |
| **Break-In** | Four-player stealth heist | Unity | Lead designer | 4 | 2025 | [/break-in](https://alvarogomezgames.com/break-in) |
| **Seeds of Tomorrow** | Solarpunk adventure | Unity | Composer and level designer | 5 | 2025 | [/seeds-of-tomorrow](https://alvarogomezgames.com/seeds-of-tomorrow) |

### Moon-Knight: combat built on quantum computing principles

*Solo · Unreal Engine 5 · C++ and Blueprints · shown at Develop:Brighton 2025*

Moon-Knight is an action RPG that asks a research question: **how could quantum computing principles change RPG mechanics without breaking the rules that make a game work?** It began as my MA dissertation. I designed and built everything: the systems, the level design, the enemies and bosses, the interface, the C++ and Blueprint code, and the music and audio. The tutorial is fully playable and introduces every core mechanic.

**The five quantum abilities.** Each ability maps to a real quantum principle, and each has its own risk and reward:

| Ability | Quantum basis | What it does in combat | Used by |
| --- | --- | --- | --- |
| **Master of Matters** | Majorana states, topologically protected qubits | Infuses the sword with Fire, Lightning or Water. It rewards players who learn enemy defences, and the cost is an equipment slot. | Player, enemy |
| **Instability** | Decoherence, superposition | An orb that changes size, speed and path every time it touches the environment. This makes positioning part of the fight. | Player, enemy |
| **Inversion** | NOT gate, state inversion | A parry that turns incoming damage into healing. It is high risk and high reward in a game where healing is scarce. | Player, enemy |
| **Elliptical Force** | Entanglement | Two orbs circle an enemy and converge. It can also block incoming sphere attacks. | Player, enemy |
| **Double Superposition** | Double superposition | Rewinds an enemy's state by one second, so it heals, repositions or counter-attacks. | Enemy only, by design |

**Other systems I designed:**
- the full combat loop: combos, a dual skill tree, and boss encounters that each test one mechanic
- an anti-farming progression currency (White Rose XP) that can only be earned through play
- a **diegetic UI**: information lives in the game world instead of on a HUD. For example, the health bar is a moon phase on the knight's breastplate.

**The engineering (documented on [/moon-knight/engineering](https://alvarogomezgames.com/moon-knight/engineering)).** I prototyped in Blueprints for speed, then rebuilt the core in C++. The rule I followed: *C++ handles the logic, Blueprints handle the presentation.* State, lifetime, damage and AI perception (`AMKEnemyAIController`) live in C++. Combo montages, sword-trace windows and Behaviour Trees stay in Blueprints, where frame-level tuning is fastest. The stack is UE5, C++, Blueprints, Enhanced Input, Behaviour Trees, AI Perception, UMG and Data Tables. Source: [Moon-Knight-UE5-RPG](https://github.com/alvarogope/Moon-Knight-UE5-RPG).

**The quantum toolkit (documented on [/moon-knight/engineering/quantum](https://alvarogomezgames.com/moon-knight/engineering/quantum)).** Blueprints could not represent the quantum mechanics faithfully. I documented that limit, then started building a C++17 toolkit on QPP, a library that wraps Quantum++ and Eigen. It simulates real qubits, gates, measurement and noise. The key decisions:
- **A density matrix, not a state vector.** Instability needs *decoherence*: an orb's outcome should become more random the longer it flies. A state vector can only represent pure states. A density matrix can represent the partially mixed states this mechanic needs.
- **Designers think in probabilities; the physics thinks in angles.** A designer sets "70% likely to amplify". The toolkit converts that to an `Ry` rotation, `θ = 2·arccos(√(1−p))`, so that `P(|1⟩) = p` exactly. Designers can tune abilities without knowing any quantum computing.
- **Decoherence is simulated from real physics.** It uses a trace-preserving depolarizing channel that pulls the qubit toward the maximally mixed state over the orb's flight.
- **Each ability is checked statistically.** A Monte Carlo test runs it a thousand times and compares the observed frequencies with the analytic prediction. For Inversion, the endpoints are deterministic and the interior points fall within one to two standard errors of `sin²`, which is the Born rule.

### Shattered Skies: a planetary system that works as a puzzle

*Team of 5 · Unity · systems and world designer*

Two soldiers from enemy species share one parasite, the Symbiochord, and so share one life. They do not speak the same language and must cooperate across a hostile, moving planetary system. I designed the world they cross and the systems that keep them together:
- **A planetary system based on real physics.** I researched real gravity, orbits and tides for the five worlds. Physics that behaves like the real world is faster for players to learn. For example, the path on the moon **Tidalor** only opens when its orbit pulls the tides low.
- **Progression through understanding.** Inspired by metroidvanias, players power up by understanding the world, not by collecting stat upgrades. **Dunestorm**'s gravity keeps players grounded until they learn to upgrade their jetpacks.
- **Asymmetric traversal.** Two bodies with opposite strengths, jetpacks that respond to weight, a shared fuel supply, and cooperative moves such as the boost.
- **Interdependent puzzles** that require both players to act at the same time with precise timing.

### Break-In: a co-op heist with no voice chat

*Team of 4 · Unity · lead designer*

A four-player stealth bank heist with one rule: **players cannot talk to each other.** Each player picks one of four asymmetric roles (the Hacker, the Insider, the Vaultsnatcher or the Lockpicker), and every ability is useless without a teammate. The team has eight minutes to steal as much as possible and escape. If anyone is caught, the run is over.
- **Coordination became a mechanic.** We removed voice chat on day one, so I designed three in-game coordination systems to replace it. For example, the Hacker's Vision became a danger signal shared by the whole team.
- I led the design team, acted as the link to the engineering team, and wrote most of the design documents: roles, mechanics, the puzzle and balancing.
- I designed the **detection state machine**, the **eight-minute pressure loop** and its risk/reward curve, and the balance data that stops any single role from carrying the team.
- I directed the audio (clock and action cues) and co-designed the bank layout with the team's level designer.

### Seeds of Tomorrow: a world that heals as you solve it

*Team of 5 · Unity · composer and level designer · shown at Develop:Brighton 2025*

A time traveller returns to an Earth destroyed by pollution and plants the seeds that bring it back to life.
- **Original soundtrack:** I composed and recorded all **eleven tracks**. The website includes a playable sampler with the level themes layered over the main theme.
- **Weather as storytelling:** acid rain falls over poisoned zones and turns into clean rain when the player solves the area. Snow, wind and sandstorms each bring their own hazard and mood.
- **Level and puzzle design** built around a combat-then-restoration rhythm: fight the polluted monsters, then do the quieter work of healing the place.

---

## Engineering beyond games

The site also documents two full-stack quantum computing applications:

| Project | What it does | Stack | Links |
| --- | --- | --- | --- |
| **QuantumRisk** | Prices European call options and calculates portfolio Value at Risk two ways: Iterative Quantum Amplitude Estimation (3-qubit circuit, log-normal amplitude encoding) against a 10,000-path classical Monte Carlo baseline. Uses live market data from Yahoo Finance. | Qiskit, Python, FastAPI, React, NumPy | [Live](https://quantum-risk-z9ez.vercel.app) · [Code](https://github.com/alvarogope/QuantumRisk) |
| **Quantum Portfolio Optimizer** | Treats asset selection as a QUBO problem. QAOA, tuned with COBYLA, picks which stocks to hold, and classical mean-variance optimisation sets the weights. Supports up to 9 assets (9 qubits) with three risk profiles. | Qiskit, Python, FastAPI, React, Tailwind, Vite | [Live](https://quantum-portfolio-optimizer-o3hq.vercel.app) · [Code](https://github.com/alvarogope/Quantum-Portfolio-Optimizer) |

---

## The website: stack

| Layer | Choice | Version |
| --- | --- | --- |
| Framework | Next.js (App Router) | 16.2 |
| UI | React, with the **React Compiler** enabled | 19.2 |
| Language | TypeScript, `strict` mode | 5 |
| Styling | Tailwind CSS plus a CSS custom-property design-token system | 4 |
| Animation | Motion | 13 |
| WebGL | OGL (a minimal WebGL library) with hand-written GLSL shaders | 1.0 |
| Code highlighting | Shiki, rendered on the server | 4 |
| Linting | ESLint with `next/core-web-vitals` and `next/typescript` | 9 |
| Hosting | Vercel, with Vercel Web Analytics (cookieless, no tracking cookies) | - |

Scale: about **39,000 lines** of TypeScript/TSX across 93 components and pages, 30+ typed content modules, and about 135 commits.

---

## The website: architecture decisions

### 1. Content is data; pages only compose it

All text lives in typed modules under [`src/content/`](src/content), separate from the components that render it. Every game follows one `Project` interface ([`src/content/schema.ts`](src/content/schema.ts)): facts, contributions, abilities, design challenge and engineering notes. One registry ([`src/content/games/index.ts`](src/content/games/index.ts)) feeds the homepage, the project navigation and each project page.

**Why:** the copy changed far more often than the layout. With content kept as data, I could rewrite, move or cut sections without touching the components. The types also catch a missing field at build time, not on the live site.

### 2. Links are built from code, so a broken link fails the build

Every section anchor is declared once, in [`src/content/project-chapters.ts`](src/content/project-chapters.ts), as `as const satisfies Record<string, Chapter>`. The page renders `id={chapter.id}`, and the chapter index under each hero links with `chapterHref(chapter)`, so the link and its target come from the same object. Links between pages work the same way: every link into the Moon-Knight deep dive is built with `deepDiveHref("score")`, never typed by hand.

**Why:** a wrong `#fragment` fails silently. The browser loads the page and simply doesn't scroll. Building every link from one source means a renamed section breaks the build, not the live site.

### 3. One component library, four visual identities

Each game has its own colours and typography, but all four share the same components. Each game's layout in the [`(games)`](src/app/(games)) route group redefines the same design tokens (`--color-void`, `--color-silver`, `--color-gold`, ...) and swaps the display font:

| Game | Palette | Display font | Scroll-progress indicator |
| --- | --- | --- | --- |
| Moon-Knight | Moonlight silver | UnifrakturCook + Cinzel | A **moon that waxes** as you scroll, with its colour blended in the OKLab colour space |
| Shattered Skies | Cyan and orange | Rajdhani | **The Symbiochord**, the parasite the two heroes share |
| Break-In | Vault gold and alarm red | Archivo | An **alarm meter** that rises from green through amber to red |
| Seeds of Tomorrow | Moss green and amber | Fraunces | A **plant that grows** and blooms near the end of the page |

**Why:** each page should feel like its game, but four copies of every component would quickly drift apart. Components are written once against tokens, and each game's look is configuration. The `(games)` route group gives each game its own layout without adding a segment to the URL. All eight fonts load through `next/font`, which hosts them with the site and avoids layout shift while they load.

**A detail:** the scroll indicators render through a React portal into `<body>`, which is outside the themed wrapper, so they would lose the game's colours. [`IndicatorPortal`](src/components/layout/IndicatorPortal.tsx) fixes this: it reads the resolved token values from an anchor element inside the theme and copies them onto the portal host.

### 4. Server components by default, client code only where needed

Only 35 of the 93 `.tsx` files are client components (`"use client"`), and each is interactive: a map, a graph, an audio player, a WebGL background. Everything else renders on the server. For example, [`CodeBlock`](src/components/project/CodeBlock.tsx) is an `async` server component that syntax-highlights the C++ samples with Shiki on the server, so code highlighting sends **no JavaScript** to the browser.

### 5. Interactive diagrams instead of long paragraphs

A design idea that a reader can explore is easier to understand than one described in a paragraph. Several sections are hand-built interactive SVG components:

- **[`WorldMap`](src/components/project/WorldMap.tsx):** the hand-drawn map of Kaelum with clickable region markers that link to the matching level and character entries. The map is served at quality 92, set in `next.config.ts`, because its linework blurs at the default 75.
- **[`PlanetOrrery`](src/components/project/PlanetOrrery.tsx):** the Shattered Skies star system. Orbital periods follow **Kepler's third law** (`period ∝ r^1.5`), the same real physics the game design is built on.
- **[`RoleGraph`](src/components/project/RoleGraph.tsx):** the Break-In dependency web. Select a role to see which teammates it needs and which alarm triggers it controls.
- **[`WeatherSystem`](src/components/project/WeatherSystem.tsx), [`BeatChart`](src/components/project/BeatChart.tsx), [`DialogueTree`](src/components/project/DialogueTree.tsx), [`ControllerMap`](src/components/project/ControllerMap.tsx), [`Bestiary`](src/components/project/Bestiary.tsx):** the Seeds weather states, Moon-Knight's pacing per level, the About page's question-and-answer dialogue, the control scheme, and the enemy catalogue.
- **[`SeedsAudio`](src/components/project/SeedsAudio.tsx):** a small player that layers each level's theme over the main theme.

### 6. WebGL backgrounds with OGL instead of three.js

Each game has a full-screen shader background: an aurora for Moon-Knight, a galaxy for Shattered Skies, a prism for Break-In, light rays for Seeds, and particles on the homepage. They are written as GLSL shaders on **OGL** rather than three.js. These are single-quad fragment shaders, so a full 3D engine would be dead weight in the bundle.

### 7. Accessibility and resilience

- **`prefers-reduced-motion` is respected throughout.** Looping videos pause on their first frame, scroll indicators render in a static state, the text-decode effect is skipped, and scroll reveals are turned off.
- **Content never stays hidden.** [`Reveal`](src/components/layout/Reveal.tsx) animates sections in when they scroll into view. If the IntersectionObserver never fires, a 1.5-second fallback timer shows the content anyway.
- **No flicker on first load.** Browser state such as scroll position and motion preference is read through `useSyncExternalStore` with a server snapshot, so the server-rendered HTML and the first browser render always match.
- **The reading position survives a resize.** [`PreserveScrollOnResize`](src/components/layout/PreserveScrollOnResize.tsx) remembers the element in view and restores it after the viewport changes, for example when a phone rotates.
- Decorative SVG and effects are marked `aria-hidden`, and the document declares `lang="en-GB"`.

### 8. SEO generated from the file system

[`sitemap.ts`](src/app/sitemap.ts) walks `src/app` at build time and lists every `page.tsx`. It leaves route-group folders such as `(games)` out of the URL and skips private (`_`), dynamic (`[`) and parallel (`@`) folders. A new page appears in the sitemap without a manual update. [`robots.ts`](src/app/robots.ts) points crawlers to the sitemap, and every page sets its own `metadata`.

### 9. The React Compiler instead of hand-written memoisation

`reactCompiler: true` in [`next.config.ts`](next.config.ts) memoises components automatically. The scroll-driven indicators and diagrams re-render often, and the compiler keeps that cheap without filling the code with `useMemo` and `useCallback`.

---

## Content design: written for a 30-second read

A recruiter's first look at a portfolio page usually lasts **10 to 30 seconds**, roughly 600 to 800 words at skimming speed. I treated that as a design constraint and measured the site against it. Two internal working documents, kept out of the repository, guided the restructure:

- **A reading-load audit.** It counts every page's prose, using both the source and the rendered HTML, and measures how many words a reader passes before reaching the strongest material on the page.
- **A section ownership map.** For every section on every page, it records which section owns each idea, so that no fact is explained twice. Each repeated passage got a verdict: *Absorb* (fold it into an interactive diagram and delete the prose), *Merge*, *Own*, *Keep*, *Cut* or *Split*.

The biggest result was the **Moon-Knight split**. The page had grown to about 7,650 words, and gameplay footage did not appear until 40% of the way down. Instead of trimming it, I split it by kind:
- [`/moon-knight`](https://alvarogomezgames.com/moon-knight) keeps the built work: the game running, the quantum systems, the creatures, the controls, the world and the beat chart.
- [`/moon-knight/world`](https://alvarogomezgames.com/moon-knight/world) holds the craft depth in full: the story arc, the cast, the symbolism, the art direction and the score.

The same pass added a **chapter index** under every project hero, so the best material is one click away instead of buried far down a long page.

---

## Project structure

```
src/
├── app/                          # Next.js App Router: routes and layouts only
│   ├── layout.tsx                # Root layout: fonts, header, footer
│   ├── page.tsx                  # Homepage: four "acts", one per game
│   ├── about/                    # About: design philosophy, tech badges, Q&A dialogue
│   ├── engineering/              # Quantum full-stack side projects
│   ├── (games)/                  # Route group: per-game theme and layout, no URL segment
│   │   ├── moon-knight/
│   │   │   ├── world/            # Deep dive: story, cast, art, score
│   │   │   └── engineering/      # UE5 C++/Blueprint architecture
│   │   │       └── quantum/      # The C++17 quantum toolkit
│   │   ├── shattered-skies/
│   │   ├── break-in/
│   │   └── seeds-of-tomorrow/
│   ├── sitemap.ts · robots.ts    # Generated SEO files
│   └── not-found.tsx             # Custom 404 with an illustrated lost knight
├── components/
│   ├── effects/                  # OGL/WebGL backgrounds and the tilt card
│   ├── layout/                   # Section scaffolding, navigation, scroll indicators, reveal
│   ├── project/                  # 54 project components: diagrams, galleries, audio, code
│   └── home/                     # Homepage composition
├── content/                      # All copy, as typed TypeScript data
│   ├── schema.ts                 # The Project interface every game follows
│   ├── games/                    # One file per game, plus the registry
│   └── project-chapters.ts       # Single source for section ids and titles
└── site.ts                       # Canonical site URL
public/
├── images/<game>/                # Screenshots, Blueprint captures, block-outs, clips (.mp4)
└── audio/seeds/                  # Soundtrack excerpts for the Seeds player
```

---

## Running it locally

Requires **Node.js 20.9 or later**.

```bash
npm install
npm run dev      # development server at http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npm run lint     # ESLint
```

---

## Credits

All design, systems, code and integration in the games and on this site are my own. Some 3D assets and audio in the games come from marketplaces (Fab, Quixel Megascans) or were AI-generated to speed up production; the site footer says the same. The Seeds of Tomorrow soundtrack and the Moon-Knight music are my own compositions.

---

**Álvaro Gómez Pérez** · Technical Game Designer · [alvarogomezgames.com](https://alvarogomezgames.com) · [alvarogomezperez.work@gmail.com](mailto:alvarogomezperez.work@gmail.com)

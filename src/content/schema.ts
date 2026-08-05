/** A single "My Contribution" pair. */
export interface Contribution {
    label: string;        // mono eyebrow, e.g. "Combat Systems"
    description: string;
    accent?: "gold" | "scarlet" | "emerald"; //Rare meaningful highlight
  }
  
  /** A quantum/mechanic ability card (Moon-Knight's signature). */
  export interface Ability {
    name: string;
    body: string;         // design-first prose, player experience leads
    annotation: string;   // the mono technical footnote
    availableTo: ("Player" | "Enemy")[];
  }
  
  /** One row of a system/payoff table. */
  export interface TableRow {
    cells: string[];      // must match the parent table's headers length
  }
  
  export interface SystemTable {
    caption?: string;
    headers: string[];
    rows: TableRow[];
  }
  
  /** The "Design Challenge" dialogue-box quote. */
  export interface DesignChallenge {
    quote: string;
    engine?: string;
    system?: string;
    resolution?: string;
  }
  
  /** A titled design-decision block. */
  export interface DesignDecision {
    title: string;
    body: string;
  }
  
  /** A labelled external link (repo, live build, itch, design doc). */
  export interface ProjectLink {
    label: string;        // "Source", "Play the build", "Design doc"
    url: string;
  }
  
  /**
   * The fact block every project MUST show, near the title.
   * Required so no page can silently omit engine, role, or team size.
   */
  export interface ProjectFacts {
    engine: string;       // "Unreal Engine 5" | "Unity"
    role: string;         // "Solo developer" | "Lead Designer"
    team: string;         // "Solo" | "Team of 4" | "Team of 5"
    year: string;         // "2025"
  }

  
  /** A playable role with its tools and its interdependency. */
  export interface Role {
    name: string;
    brief: string;          // one-line "what they do"
    tools: string;          // their abilities, with cooldowns
    dependsOn: string;      // who they need
    neededBy: string;       // who needs them
    accent?: "silver" | "gold" | "scarlet" | "emerald";
  }

    /** A branching ending outcome. */
  export interface Ending {
    name: string;
    outcome: string;
  }

  /** A named world/planet with its mechanical identity. */
  export interface World {
    name: string;
    descriptor: string;   // one-line: what it is + its mechanic
  }
  
  export interface Project {
    // Identity (required on all)
    slug: string;
    title: string;
    tagline: string;
    pillar: boolean;
    gallery?: { src: string; alt: string; caption: string }[];
  
    // Fact block (required, shown near the title on every page)
    facts: ProjectFacts;
  
    // Relevant links (required array, may be empty but must be considered)
    links: ProjectLink[];
  
    // Gateway card signals (the dashboard layer)
    eyebrow: string;
    systemsHook: string;
    disciplines: string;
    scope: string;
    routingVerb: string;
  
    // Hero
    posterAlt: string;
    showcase?: string;
  
    // Body (required core)
    vision: string;
    contributions: Contribution[];
    videoId?: string;
    videoCaption?: string;
  
    // Richer pillar-only sections (optional)
    abilities?: Ability[];
    designDecisions?: DesignDecision[];
    systemTable?: SystemTable;
    designChallenge?: DesignChallenge;
  
    // Engineering deep-dive door (Moon-Knight for now)
    engineeringNote?: {
      designedYear: string;
      engineeringYear: string;
      repoUrl?: string;
      currentStatus: string;
    };

    roles?: Role[];
    endings?: Ending[];
    worlds?: World[];
  }
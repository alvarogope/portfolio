export interface Contribution {
    label: string;        
    description: string;
    accent?: "gold" | "scarlet" | "emerald"; 
  }
  
  export interface Ability {
    name: string;
    body: string;         
    annotation: string;   
    availableTo: ("Player" | "Enemy")[];
  }
  
  export interface TableRow {
    cells: string[];      
  }
  
  export interface SystemTable {
    caption?: string;
    headers: string[];
    rows: TableRow[];
  }
  
  {/* Design Challenge */}
  export interface DesignChallenge {
    quote: string;
    engine?: string;
    system?: string;
    resolution?: string;
  }
  
  {/** Design Decision. */}
  export interface DesignDecision {
    title: string;
    body: string;
  }
  
  {/** Project Links */}
  export interface ProjectLink {
    label: string;
    url: string;
  }
  
  {/* Fact Block */}
  export interface ProjectFacts {
    engine: string;       // "Unreal Engine 5" | "Unity"
    role: string;         // "Solo developer" | "Lead Designer"
    team: string;         // "Solo" | "Team of 4" | "Team of 5"
    year: string;         // "2025"
  }

  
  {/* Role */}
  export interface Role {
    name: string;
    brief: string;          // one-line "what they do"
    tools: string;          // their abilities, with cooldowns
    dependsOn: string;      // who they need
    neededBy: string;       // who needs them
    accent?: "silver" | "gold" | "scarlet" | "emerald";
  }

  {/** Ending */}
  export interface Ending {
    name: string;
    outcome: string;
  }

  { /* World */}
  export interface World {
    name: string;
    descriptor: string;
  }
  
  export interface Project {
    slug: string;
    title: string;
    tagline: string;
    pillar: boolean;
    gallery?: { src: string; alt: string; caption: string }[];
  
    facts: ProjectFacts;
  
    links: ProjectLink[];
  
    eyebrow: string;
    systemsHook: string;
    disciplines: string;
    scope: string;
    routingVerb: string;
  
    posterAlt: string;
    showcase?: string;
  
    vision: string;
    contributions: Contribution[];
    videoId?: string;
    videoCaption?: string;
  
    abilities?: Ability[];
    designDecisions?: DesignDecision[];
    systemTable?: SystemTable;
    designChallenge?: DesignChallenge;
  
    engineeringNote?: {
      designedYear: string;
      engineeringYear: string;
      repoUrl?: string;
      currentStatus: string;
    };

    roles?: Role[];
    endings?: Ending[];
    worlds?: World[];

    communication?: { label: string; body: string }[];
  }
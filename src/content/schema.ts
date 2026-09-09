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
    engine: string;    
    role: string;      
    team: string;       
    year: string;     
  }

  
  {/* Role */}
  export interface Role {
    name: string;
    brief: string;          
    tools: string;          
    dependsOn: string;      
    neededBy: string;       
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
    gallery?: { src: string; alt: string; caption: string; video?: string }[];
  
    facts: ProjectFacts;
  
    links: ProjectLink[];
  
    eyebrow: string;
    systemsHook: string;
    built?: string;
    disciplines: string;
    scope: string;
    routingVerb: string;
  
    posterAlt: string;
    showcase?: string;
  
    vision: string;
    contributions: Contribution[];
  
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
    worlds?: World[];
  }
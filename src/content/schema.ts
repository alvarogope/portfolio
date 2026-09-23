export interface Contribution {
    label: string;        
    description: string;
  }
  
  export interface Ability {
    name: string;
    body: string;         
    annotation: string;   
    availableTo: ("Player" | "Enemy")[];
  }
  
  {/* Design Challenge */}
  export interface DesignChallenge {
    quote: string;
    engine?: string;
    system?: string;
    resolution?: string;
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
  }

  export interface Project {
    slug: string;
    title: string;
    tagline: string;
  
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
    designChallenge?: DesignChallenge;
  
    engineeringNote?: {
      designedYear: string;
      engineeringYear: string;
      repoUrl?: string;
      currentStatus: string;
    };

    roles?: Role[];
  }
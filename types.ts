export interface ContactFormData {
  // Common fields
  userType: 'commercial' | 'private';
  serviceType: string;
  email: string;
  projectStatus: string;
  message: string;
  dataPrivacy: boolean;
  
  // Optional common fields
  phone?: string;
  address?: string;
  files?: File[];
  offerChannel?: string;

  // Commercial specific (optional)
  companyName?: string;
  contactPerson?: string; // Also used for private customer name
  surfaceType?: string;
  chargerCount?: string;
  storagePurpose?: string;
  
  // Private specific (optional)
  privateSurfaceType?: string;
  additionalInterests?: string;

  // Quote-specific fields (optional)
  surfaceArea?: string; // for modules
  systemSize?: string; // for inverters
  yearlyConsumption?: string; // for storage
  carModel?: string; // for chargers
}

// Add SpeechRecognition types for window
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
    // Add Contact Picker API types for navigator
    interface Navigator {
        contacts: any;
    }
}

// FIX: Added type definitions for the Contact Picker API to resolve 'Cannot find name ContactInfo'.
export interface ContactAddress {
    addressLine?: string[];
    city?: string;
    country?: string;
    dependentLocality?: string;
    organization?: string;
    phone?: string;
    postalCode?: string;
    recipient?: string;
    region?: string;
    sortingCode?: string;
}

export interface ContactInfo {
    name?: string[];
    email?: string[];
    tel?: string[];
    address?: ContactAddress[];
}


export type FundingProgramLevel = 'bund' | 'land' | 'eu' | 'kommunal';

export interface FundingProgramBenefit {
    title: string;
    description: string;
    icon?: string;
}

export interface FundingProgramFAQ {
    question: string;
    answer: string;
}

export interface FundingProgramContact {
    phone?: string;
    email?: string;
    url?: string;
    hotlineHours?: string;
    note?: string;
}

export interface FundingProgramSEOConfig {
    title: string;
    description: string;
    keywords: string[];
    canonical?: string;
}

export interface FundingProgram {
    slug: string;
    title: string;
    shortTitle?: string;
    provider: string;
    level: FundingProgramLevel;
    region?: string;
    isActive: boolean;
    summary: string;
    tagline: string;
    heroImage?: string;
    logo: string;
    fundingTypes: string[];
    maxFunding?: string;
    minFunding?: string;
    fundingRate?: string;
    targetGroups: string[];
    eligibleProjects: string[];
    eligibleCosts?: string[];
    nonEligibleCosts?: string[];
    requirements: string[];
    applicationSteps: string[];
    documentsRequired: string[];
    processingTime?: string;
    deadlines?: string;
    combinationTips: string[];
    repaymentBenefits?: string[];
    supportServices: string[];
    successMetric?: string;
    highlights: FundingProgramBenefit[];
    faqs: FundingProgramFAQ[];
    contact: FundingProgramContact;
    externalLinks?: { label: string; url: string }[];
    seo: FundingProgramSEOConfig;
    lastUpdated: string;
    legalBasis?: string;
    notes?: string;
}


// FIX: Moved Page type here to resolve circular dependency issues.
export type Page =
    | 'home'
    | 'photovoltaik'
    | 'e-mobilitaet'
    | 'preise'
    | 'projekte'
    | 'produkte'
    | 'hersteller-detail'
    | 'ueber-uns'
    | 'karriere'
    | 'kontakt'
    | 'service-photovoltaik'
    | 'service-ladeparks'
    | 'service-speicher'
    | 'nachhaltigkeit'
    | 'aktuelles'
    | 'article-detail'
    | 'anwendungsfaelle'
    | 'anwendungsfall-detail'
    | 'login'
    | 'dashboard'
    | 'empfehlungspraemie'
    | 'wissens-hub'
    | 'glossar'
    | 'guide-detail'
    | 'innovations'
    | 'finanzierung'
    | 'sonderaktionen'
    | 'faq-page'
    | 'partner-werden'
    | 'impressum'
    | 'datenschutz'
    | 'agb'
    | 'presse'
    | 'wartung-service'
    | 'garantieabwicklung'
    | 'foerdermittel-check'
    | 'diy-hub'
    | 'agri-pv'
    | 'team'
    | 'warum-zoe-solar'
    | 'foerdermittel-uebersicht'
    | 'foerdermittel-programm'
    | 'foerdermittel-kfw'
    | 'foerdermittel-ibb'
    | 'foerdermittel-bafa'
    | 'elektro'
    | 'service-anmeldung-pv'
    | 'service-anmeldung-ladestationen'
    | 'service-netzanschluss'
    | 'service-verteilerbau'
    | 'service-zaehlerbau'
    | 'standort'
    | 'agri-pv-brandenburg'
    | 'agri-pv-sachsen-anhalt'
    | 'agri-pv-niedersachsen'
    | 'agri-pv-bayern'
    | 'agri-pv-nordrhein-westfalen'
    | 'eigenheim'
    | 'eigenheim-kosten'
    | 'eigenheim-einfamilienhaus-kosten'
    | 'eigenheim-planung'
    | 'photovoltaik-installation-dach'
    | 'eigenheim-installation'
    | 'seo-monitoring'
    | 'fallstudien'
    | 'fallstudie-detail'
    | 'agri-pv-erfahrungen'
    | 'mitarbeiter-login';
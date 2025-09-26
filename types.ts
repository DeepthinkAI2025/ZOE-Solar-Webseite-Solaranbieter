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


// FIX: Moved Page type here to resolve circular dependency issues.
export type Page = 'home' | 'photovoltaik' | 'e-mobilitaet' | 'preise' | 'projekte' | 'produkte' | 'hersteller-detail' | 'ueber-uns' | 'karriere' | 'kontakt' | 'service-photovoltaik' | 'service-ladeparks' | 'service-speicher' | 'nachhaltigkeit' | 'aktuelles' | 'article-detail' | 'anwendungsfaelle' | 'anwendungsfall-detail' | 'login' | 'dashboard' | 'empfehlungspraemie' | 'wissens-hub' | 'glossar' | 'guide-detail' | 'innovations' | 'finanzierung' | 'sonderaktionen' | 'faq-page' | 'partner-werden' | 'impressum' | 'datenschutz' | 'agb' | 'presse' | 'wartung-service' | 'garantieabwicklung' | 'foerdermittel-check' | 'diy-hub' | 'agri-pv' | 'team' | 'warum-zoe-solar' | 'foerdermittel-kfw' | 'foerdermittel-ibb' | 'foerdermittel-bafa' | 'elektro' | 'service-anmeldung-pv' | 'service-anmeldung-ladestationen' | 'service-netzanschluss' | 'service-verteilerbau' | 'service-zaehlerbau' | 'standort-berlin' | 'standort-muenchen' | 'standort-zuerich' | 'standort-hamburg' | 'standort-koeln' | 'standort-frankfurt' |   'standort-stuttgart' | 'agri-pv-brandenburg' | 'agri-pv-sachsen-anhalt' | 'agri-pv-niedersachsen' | 'agri-pv-bayern' | 'agri-pv-nordrhein-westfalen' | 'eigenheim' | 'eigenheim-kosten' | 'eigenheim-einfamilienhaus-kosten' | 'eigenheim-planung' | 'photovoltaik-installation-dach' | 'eigenheim-installation' | 'seo-monitoring' | 'fallstudien' | 'fallstudie-detail' | 'agri-pv-erfahrungen' | 'mitarbeiter-login';
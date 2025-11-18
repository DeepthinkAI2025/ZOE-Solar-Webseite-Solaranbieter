# 🔧 ZOE Solar Component Props Reference

## 📋 Comprehensive Props Documentation

Dieses Dokument enthält detaillierte Props-Definitionen für alle ZOE Solar React-Komponenten mit TypeScript-Typen, Validierungsregeln und Nutzungshinweisen.

---

## 🏠 Hero Components

### **Hero.tsx** - Advanced Landing Page Hero

#### Main Props Interface
```typescript
interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  customerType?: 'private' | 'business';
  backgroundImage?: string;
  showCalculator?: boolean;
  showManufacturerLogos?: boolean;
  variant?: 'default' | 'calculator' | 'manufacturer' | 'minimal';
  className?: string;
}
```

#### Props Details
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | ✅ | - | Haupt-Headline der Hero-Section |
| `subtitle` | `string` | ❌ | - | Sub-Headline unter dem Titel |
| `description` | `string` | ❌ | - | Beschreibender Text |
| `customerType` | `'private' \| 'business'` | ❌ | `'private'` | Zielgruppe für den Calculator |
| `backgroundImage` | `string` | ❌ | - | Hintergrundbild-URL |
| `showCalculator` | `boolean` | ❌ | `false` | ROI-Rechner anzeigen |
| `showManufacturerLogos` | `boolean` | ❌ | `false` | Hersteller-Logos anzeigen |
| `variant` | `string` | ❌ | `'default'` | Layout-Variante |
| `className` | `string` | ❌ | - | Zusätzliche CSS-Klassen |

#### Internal Component Props

##### **Tooltip** (Internal)
```typescript
interface TooltipProps {
  text: string;
}
```

##### **CustomSlider** (Internal)
```typescript
interface CustomSliderProps {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  tooltipText?: string;
}
```

##### **HeroCalculator** (Internal)
```typescript
interface HeroCalculatorProps {
  customerType: 'private' | 'business';
}
```

##### **ManufacturerLogo** (Internal)
```typescript
interface ManufacturerLogoProps {
  name: string;
  src: string;
  slug: string;
  onSelect: (slug: string) => void;
  className?: string;
}
```

#### Usage Example
```tsx
<Hero
  title="Solaranlagen für Ihr Unternehmen"
  subtitle="25 Jahre Garantie • Hocheffiziente Module"
  description="Deutschlands führender Solaranbieter für Gewerbe und Industrie"
  customerType="business"
  backgroundImage="/images/business-hero.jpg"
  showCalculator={true}
  variant="calculator"
/>
```

#### Validation Rules
- `title` muss mindestens 10 Zeichen und maximal 100 Zeichen lang sein
- `customerType` muss entweder 'private' oder 'business' sein
- `backgroundImage` muss eine gültige URL sein, falls angegeben

#### Performance Considerations
- `VANTA.Globe` wird lazy geladen für 3D-Animationen
- Hersteller-Logos verwenden `loading="lazy"` und `fetchPriority="low"`
- Calculator-Berechnungen sind mit `useMemo` optimiert

---

### **PageHero.tsx** - Page Header with Breadcrumbs

```typescript
interface PageHeroProps {
  title: string;
  breadcrumb?: BreadcrumbItem[];
  backgroundImage?: string;
  compact?: boolean;
  showContact?: boolean;
  className?: string;
}

interface BreadcrumbItem {
  label: string;
  url: string;
  isActive?: boolean;
}
```

#### Usage Example
```tsx
<PageHero
  title="Photovoltaik für Gewerbe"
  breadcrumb={[
    { label: "Home", url: "/" },
    { label: "Leistungen", url: "/leistungen" },
    { label: "Photovoltaik", url: "/leistungen/photovoltaik", isActive: true }
  ]}
  backgroundImage="/images/photovoltaik-header.jpg"
  compact={false}
  showContact={true}
/>
```

---

## 🧭 Navigation Components

### **MegaMenu.tsx** - Advanced Navigation Menu

```typescript
interface MegaMenuProps {
  items: MegaMenuItem[];
  isOpen: boolean;
  onClose: () => void;
  position?: 'header' | 'sidebar';
  variant?: 'horizontal' | 'vertical';
  className?: string;
  maxWidth?: string;
}

interface MegaMenuItem {
  title: string;
  icon?: ReactNode;
  description?: string;
  link?: string;
  children?: MegaMenuItem[];
  featured?: boolean;
  badge?: string;
  badgeColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  onClick?: () => void;
  external?: boolean;
}
```

#### Props Validation
```typescript
const megaMenuItemValidation = {
  title: {
    type: 'string',
    required: true,
    minLength: 2,
    maxLength: 50
  },
  link: {
    type: 'string',
    pattern: '^https?://.+|^/.*$'
  },
  badgeColor: {
    type: 'enum',
    values: ['primary', 'secondary', 'success', 'warning', 'error']
  }
};
```

#### Usage Example
```tsx
<MegaMenu
  items={[
    {
      title: "Leistungen",
      icon: <SolarIcon />,
      description: "Unsere Solarlösungen",
      featured: true,
      badge: "Beliebt",
      badgeColor: "primary",
      children: [
        {
          title: "Photovoltaik",
          description: "Solaranlagen für jedes Dach",
          link: "/leistungen/photovoltaik",
          badge: "Top"
        },
        {
          title: "E-Mobilität",
          description: "Ladestationen & Wallboxen",
          link: "/leistungen/e-mobilitaet"
        },
        {
          title: "Energiespeicher",
          description: "Batteriespeicher Systeme",
          link: "/leistungen/speicher"
        }
      ]
    },
    {
      title: "Produkte",
      icon: <ProductsIcon />,
      children: [
        {
          title: "Solar Module",
          link: "/produkte/solar-module"
        },
        {
          title: "Wechselrichter",
          link: "/produkte/wechselrichter"
        }
      ]
    }
  ]}
  isOpen={isMenuOpen}
  onClose={() => setIsMenuOpen(false)}
  position="header"
  variant="horizontal"
  maxWidth="1200px"
/>
```

### **Breadcrumb.tsx** - Navigation Breadcrumbs

```typescript
interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  showHome?: boolean;
  homeLabel?: string;
  homeUrl?: string;
  className?: string;
  maxItems?: number;
  collapseFrom?: 'start' | 'end' | 'middle';
}
```

#### Usage Example
```tsx
<Breadcrumb
  items={breadcrumbItems}
  separator={<ChevronRightIcon className="w-4 h-4" />}
  showHome={true}
  homeLabel="Startseite"
  homeUrl="/"
  maxItems={5}
  collapseFrom="middle"
/>
```

---

## 📝 Form Components

### **ContactForm.tsx** - Advanced Contact Form

```typescript
interface ContactFormProps {
  variant?: 'default' | 'compact' | 'minimal' | 'wizard';
  fields?: FormField[];
  onSubmit: (data: ContactFormData) => void | Promise<void>;
  onFieldChange?: (field: string, value: any) => void;
  showProgress?: boolean;
  enableSave?: boolean;
  autoSave?: boolean;
  redirectUrl?: string;
  submitButtonText?: string;
  submitButtonVariant?: 'primary' | 'secondary' | 'outline';
  validationSchema?: ValidationSchema;
  initialValues?: Partial<ContactFormData>;
  isLoading?: boolean;
  errors?: FormErrors;
  className?: string;
  reCaptchaSiteKey?: string;
  privacyPolicyUrl?: string;
  termsOfServiceUrl?: string;
}

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'radio' | 'checkbox' | 'file' | 'date' | 'number';
  required?: boolean;
  placeholder?: string;
  options?: FormFieldOption[];
  validation?: FieldValidation;
  conditional?: ConditionalLogic;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  description?: string;
  helpText?: string;
  icon?: ReactNode;
  disabled?: boolean;
  readonly?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  accept?: string; // for file inputs
  multiple?: boolean; // for file selects
  rows?: number; // for textarea
  cols?: number; // for textarea
}

interface FormFieldOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  description?: string;
  group?: string;
}

interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: {
    value: RegExp;
    message: string;
  };
  custom?: (value: any) => string | undefined;
}

interface ConditionalLogic {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than';
  value: any;
  action: 'show' | 'hide' | 'enable' | 'disable' | 'require';
}

interface ContactFormData {
  salutation?: 'herr' | 'frau' | 'divers';
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  industry?: string;
  message?: string;
  projectType?: string;
  roofSize?: number;
  consumption?: number;
  timeline?: string;
  budget?: string;
  financing?: string;
  privacyConsent: boolean;
  newsletterConsent?: boolean;
  callbackConsent?: boolean;
  documents?: File[];
  attachments?: string[];
  customFields?: Record<string, any>;
}

interface ValidationSchema {
  [key: string]: FieldValidation;
}

interface FormErrors {
  [key: string]: string | string[];
  global?: string;
}
```

#### Validation Schema Example
```typescript
const contactFormValidation: ValidationSchema = {
  firstName: {
    required: true,
    minLength: 2,
    pattern: {
      value: /^[a-zA-ZäöüßÄÖÜß\-']+$/,
      message: 'Bitte geben Sie einen gültigen Vornamen ein'
    }
  },
  email: {
    required: true,
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Bitte geben Sie eine gültige E-Mail-Adresse ein'
    }
  },
  phone: {
    pattern: {
      value: /^[\+]?[1-9][\d]{0,15}$/,
      message: 'Bitte geben Sie eine gültige Telefonnummer ein'
    }
  },
  privacyConsent: {
    required: {
      value: true,
      message: 'Sie müssen die Datenschutzerklärung akzeptieren'
    }
  }
};
```

#### Conditional Logic Example
```typescript
const conditionalFields: ConditionalLogic[] = [
  {
    field: 'customerType',
    operator: 'equals',
    value: 'business',
    action: 'show',
    targetFields: ['company', 'position', 'industry']
  },
  {
    field: 'hasProject',
    operator: 'equals',
    value: true,
    action: 'show',
    targetFields: ['projectType', 'roofSize', 'timeline']
  }
];
```

#### Usage Example
```tsx
<ContactForm
  variant="wizard"
  fields={[
    {
      name: 'salutation',
      label: 'Anrede',
      type: 'select',
      required: true,
      options: [
        { label: 'Herr', value: 'herr' },
        { label: 'Frau', value: 'frau' },
        { label: 'Divers', value: 'divers' }
      ]
    },
    {
      name: 'firstName',
      label: 'Vorname',
      type: 'text',
      required: true,
      validation: {
        required: true,
        minLength: 2
      }
    },
    {
      name: 'email',
      label: 'E-Mail',
      type: 'email',
      required: true,
      validation: {
        required: true,
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: 'Bitte geben Sie eine gültige E-Mail ein'
        }
      }
    },
    {
      name: 'company',
      label: 'Unternehmen',
      type: 'text',
      conditional: {
        field: 'customerType',
        operator: 'equals',
        value: 'business',
        action: 'show'
      }
    }
  ]}
  onSubmit={handleContactSubmit}
  validationSchema={contactFormValidation}
  showProgress={true}
  enableSave={true}
  autoSave={true}
  redirectUrl="/danke"
  submitButtonText="Anfrage senden"
  submitButtonVariant="primary"
  reCaptchaSiteKey="6LeIxAcTAAAAAJcZVRqyHh71UMIEgQcAa5m1Vq7P"
  privacyPolicyUrl="/datenschutz"
/>
```

---

## 🧮 Calculator Components

### **Calculator.tsx** - Interactive ROI Calculator

```typescript
interface CalculatorProps {
  type: 'solar' | 'roi' | 'co2' | 'savings' | 'hybrid';
  initialValues?: CalculatorValues;
  onResult?: (result: CalculatorResult) => void;
  onIntermediateResult?: (step: number, partialResult: Partial<CalculatorResult>) => void;
  showDetails?: boolean;
  showComparison?: boolean;
  currency?: 'EUR' | 'USD';
  language?: 'de' | 'en';
  variant?: 'default' | 'compact' | 'detailed' | 'interactive';
  steps?: CalculatorStep[];
  theme?: 'light' | 'dark' | 'auto';
  animation?: boolean;
  exportFormats?: ('pdf' | 'excel' | 'json')[];
  integration?: {
    crm?: boolean;
    analytics?: boolean;
    leadScoring?: boolean;
  };
}

interface CalculatorValues {
  // Location & Roof
  location?: {
    address?: string;
    city?: string;
    zipCode?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    irradiation?: number; // kWh/m²/year
  };

  // Roof Specifications
  roofSize?: number; // m²
  roofType?: 'flat' | 'pitched' | 'combined';
  roofOrientation?: 'south' | 'east' | 'west' | 'north' | 'east-west';
  roofPitch?: number; // degrees
  shading?: 'none' | 'light' | 'medium' | 'heavy';

  // Energy Consumption
  consumption?: number; // kWh/year
  consumptionProfile?: 'household' | 'business' | 'industrial';
  peakLoad?: number; // kW

  // System Configuration
  moduleType?: string;
  moduleEfficiency?: number; // percentage
  inverterType?: string;
  systemSize?: number; // kWp
  battery?: boolean;
  batteryCapacity?: number; // kWh
  evCharger?: boolean;

  // Financial
  budget?: number;
  financing?: 'cash' | 'loan' | 'leasing' | 'renting';
  electricityPrice?: number; // EUR/kWh
  feedInTariff?: number; // EUR/kWh

  // Timeline
  projectStart?: string;
  constructionTime?: number; // weeks

  // Customer Type
  customerType?: 'private' | 'business' | 'utility';
  industry?: string;

  // Advanced
  selfConsumptionRate?: number; // percentage
  degradationRate?: number; // percentage/year
  inflationRate?: number; // percentage/year
  interestRate?: number; // percentage/year
}

interface CalculatorResult {
  // System Specification
  systemSize: number; // kWp
  moduleCount: number;
  moduleType: string;
  inverterSize: number; // kW

  // Production
  annualProduction: number; // kWh/year
  specificYield: number; // kWh/kWp/year
  productionMonthly: number[]; // 12 months
  performanceRatio: number; // percentage

  // Financial Analysis
  totalCost: number; // EUR
  specificCost: number; // EUR/Wp
  annualSavings: number; // EUR
  amortizationPeriod: number; // years
  roi: number; // percentage
  npv: number; // Net Present Value
  irr: number; // Internal Rate of Return

  // 25-Year Analysis
  totalSavings25Years: number;
  totalCO2Savings25Years: number;
  cashFlowYearly: number[];

  // Environmental Impact
  co2Savings: {
    annual: number; // tons
    twentyFiveYears: number; // tons
    equivalent: {
      treesPlanted: number;
      carKilometers: number;
      flights: number;
    };
  };

  // Recommendations
  recommendations: Recommendation[];

  // Risk Analysis
  risks: {
    shading: number; // percentage loss
    degradation: number; // percentage loss
    priceRisk: number; // percentage risk
  };

  // Sensitivity Analysis
  sensitivity: {
    electricityPrice: SensitivityResult[];
    irradiation: SensitivityResult[];
    systemCost: SensitivityResult[];
  };

  // Financing Options
  financingOptions: FinancingOption[];

  // Metadata
  metadata: {
    calculationDate: string;
    assumptions: string[];
    dataSource: string;
    accuracy: number; // percentage
    version: string;
  };
}

interface Recommendation {
  type: 'system' | 'financing' | 'optimization' | 'maintenance';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  savings?: number; // EUR
  implementationCost?: number; // EUR
  roi?: number; // percentage
  priority: number; // 1-10
}

interface SensitivityResult {
  scenario: string;
  value: number;
  impact: {
    annualSavings: number; // EUR
    amortizationPeriod: number; // years
    roi: number; // percentage
  };
}

interface FinancingOption {
  type: 'cash' | 'loan' | 'leasing' | 'renting';
  provider: string;
  conditions: {
    interestRate?: number;
    duration?: number; // years
    downPayment?: number; // EUR
    monthlyPayment?: number; // EUR
  };
  totalCost: number; // EUR
  benefits: string[];
  requirements: string[];
}

interface CalculatorStep {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  validation?: ValidationSchema;
  dependencies?: string[];
  onEnter?: () => void;
  onLeave?: () => void;
}
```

#### Usage Example
```tsx
<Calculator
  type="solar"
  initialValues={{
    roofSize: 500,
    consumption: 50000,
    location: {
      city: "Berlin",
      coordinates: { lat: 52.5200, lng: 13.4050 }
    },
    electricityPrice: 0.32,
    customerType: "business"
  }}
  onResult={handleCalculationResult}
  onIntermediateResult={(step, partialResult) => {
    console.log(`Step ${step}:`, partialResult);
  }}
  showDetails={true}
  showComparison={true}
  currency="EUR"
  language="de"
  variant="detailed"
  theme="auto"
  animation={true}
  exportFormats={['pdf', 'excel']}
  integration={{
    crm: true,
    analytics: true,
    leadScoring: true
  }}
  steps={[
    {
      id: 'location',
      title: 'Standort & Dach',
      description: 'Geben Sie Ihre Standort- und Dachinformationen ein',
      fields: [
        {
          name: 'location.city',
          label: 'Stadt',
          type: 'text',
          required: true
        },
        {
          name: 'roofSize',
          label: 'Dachfläche',
          type: 'number',
          required: true,
          validation: { min: 10, max: 100000 }
        }
      ]
    },
    {
      id: 'consumption',
      title: 'Stromverbrauch',
      description: 'Ihr jährlicher Stromverbrauch',
      fields: [
        {
          name: 'consumption',
          label: 'Verbrauch in kWh/Jahr',
          type: 'number',
          required: true
        }
      ]
    }
  ]}
/>
```

---

## 🎨 UI Components

### **OfferCard.tsx** - Product/Service Offer Card

```typescript
interface OfferCardProps {
  title: string;
  description?: string;
  price?: {
    amount: number;
    currency?: string;
    period?: 'once' | 'month' | 'year';
    originalAmount?: number;
    discount?: number;
  };
  features?: OfferFeature[];
  image?: string;
  badge?: string;
  badgeColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  ctaButton?: {
    text: string;
    url: string;
    variant?: 'primary' | 'secondary' | 'outline';
    external?: boolean;
  };
  highlighted?: boolean;
  variant?: 'default' | 'compact' | 'detailed' | 'comparison';
  className?: string;
  onClick?: () => void;
  comparison?: boolean;
  popular?: boolean;
  rating?: {
    score: number;
    count: number;
    maxScore?: number;
  };
  tags?: string[];
  specifications?: Record<string, any>;
  availability?: 'in-stock' | 'out-of-stock' | 'pre-order' | 'discontinued';
  deliveryTime?: string;
  warranty?: string;
}

interface OfferFeature {
  name: string;
  included: boolean;
  description?: string;
  icon?: ReactNode;
  highlighted?: boolean;
  category?: string;
}
```

#### Usage Example
```tsx
<OfferCard
  title="Business Solar Komplettpaket"
  description="Alles aus einer Hand für Ihre Unternehmens-Solaranlage"
  price={{
    amount: 75000,
    currency: 'EUR',
    period: 'once',
    originalAmount: 85000,
    discount: 12
  }}
  badge="Meistgewählt"
  badgeColor="primary"
  highlighted={true}
  variant="detailed"
  rating={{
    score: 4.8,
    count: 156,
    maxScore: 5
  }}
  availability="in-stock"
  deliveryTime="4-6 Wochen"
  warranty="25 Jahre"
  features={[
    {
      name: "Hochleistungs-Solarmodule",
      included: true,
      description: "22% Effizienz, monokristallin",
      icon: <SolarPanelIcon />,
      highlighted: true
    },
    {
      name: "Premium-Wechselrichter",
      included: true,
      description: "10 Jahre Garantie"
    },
    {
      name: "Montage & Inbetriebnahme",
      included: true,
      description: "TÜV-geprüfte Montage"
    },
    {
      name: "Batteriespeicher 10 kWh",
      included: false,
      description: "Optional für +€12.000"
    }
  ]}
  ctaButton={{
    text: "Kostenlose Beratung",
    url: "/kontakt?package=business",
    variant: "primary"
  }}
  onClick={() => trackOfferClick('business-package')}
  tags=["Premium", "TÜV-zertifiziert", "25J Garantie"]}
  specifications={{
    Leistung: "bis 100 kWp",
    Modultyp: "Monokristallin",
    Effizienz: "22%",
    Garantie: "25 Jahre"
  }}
/>
```

### **Testimonials.tsx** - Customer Testimonials Section

```typescript
interface TestimonialsProps {
  testimonials: Testimonial[];
  title?: string;
  subtitle?: string;
  variant?: 'grid' | 'slider' | 'masonry' | 'list';
  layout?: '1-column' | '2-column' | '3-column' | '4-column' | 'auto';
  showRating?: boolean;
  showAvatar?: boolean;
  showCompany?: boolean;
  showProject?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showNavigation?: boolean;
  showPagination?: boolean;
  infinite?: boolean;
  itemsPerSlide?: number;
  className?: string;
  filter?: {
    industry?: string[];
    rating?: number;
    projectType?: string[];
    location?: string[];
  };
  sort?: 'rating' | 'date' | 'random' | 'featured';
  limit?: number;
  loadMore?: boolean;
  onLoadMore?: () => void;
}

interface Testimonial {
  id: string;
  customerName: string;
  company?: string;
  position?: string;
  avatar?: string;
  rating: number;
  maxRating?: number;
  date: string;
  title?: string;
  content: string;
  project?: {
    type: string;
    size: string;
    location: string;
    savings: string;
  };
  images?: string[];
  video?: {
    url: string;
    thumbnail: string;
    duration: string;
  };
  verified?: boolean;
  featured?: boolean;
  tags?: string[];
  response?: {
    content: string;
    author: string;
    position: string;
    date: string;
  };
}
```

#### Usage Example
```tsx
<Testimonials
  title="Was unsere Kunden sagen"
  subtitle="Über 2.500 zufriedene Kunden vertrauen auf ZOE Solar"
  variant="slider"
  layout="3-column"
  showRating={true}
  showAvatar={true}
  showCompany={true}
  showProject={true}
  autoPlay={true}
  autoPlayInterval={5000}
  showNavigation={true}
  showPagination={true}
  testimonials={[
    {
      id: "1",
      customerName: "Max Mustermann",
      company: "Muster GmbH",
      position: "Geschäftsführer",
      avatar: "/images/avatars/max-mustermann.jpg",
      rating: 5,
      date: "2024-10-15",
      title: "Exzellente Beratung und Umsetzung",
      content: "ZOE Solar hat uns perfekt bei der Umsetzung unserer 250kWp Anlage beraten. Von der Planung bis zur Inbetriebnahme alles professionell.",
      project: {
        type: "Photovoltaik",
        size: "250 kWp",
        location: "München",
        savings: "€45.000/Jahr"
      },
      verified: true,
      featured: true,
      tags: ["Gewerbe", "250kWp", "München"]
    }
  ]}
  filter={{
    industry: ["manufacturing", "retail"],
    rating: 4,
    projectType: ["photovoltaik"]
  }}
  sort="featured"
  limit={12}
  loadMore={true}
  onLoadMore={loadMoreTestimonials}
/>
```

---

## 🤖 AI & Interactive Components

### **AIRecommender.tsx** - AI-Powered Product Recommender

```typescript
interface AIRecommenderProps {
  userProfile: UserProfile;
  onRecommendation?: (recommendations: Recommendation[]) => void;
  onInteraction?: (interaction: RecommendationInteraction) => void;
  maxRecommendations?: number;
  showConfidence?: boolean;
  showReasoning?: boolean;
  showAlternatives?: boolean;
  enableFeedback?: boolean;
  refreshInterval?: number;
  variant?: 'cards' | 'list' | 'detailed' | 'comparison';
  filter?: RecommendationFilter;
  sort?: 'confidence' | 'savings' | 'roi' | 'popularity' | 'custom';
  personalized?: boolean;
  learning?: boolean;
  className?: string;
}

interface UserProfile {
  // Company Information
  companyType: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  industry: string;
  location: {
    address?: string;
    city: string;
    zipCode?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };

  // Energy Profile
  consumption: {
    annual: number; // kWh/year
    profile: 'constant' | 'seasonal' | 'peak' | 'custom';
    peakLoad: number; // kW
    loadProfile?: number[]; // hourly consumption
  };

  // Infrastructure
  infrastructure: {
    roofSize?: number; // m²
    roofType?: 'flat' | 'pitched' | 'combined';
    availableSpace?: number; // m²
    existingSystems?: {
      solar?: boolean;
      storage?: boolean;
      evCharging?: boolean;
    };
    gridConnection?: string;
  };

  // Financial Information
  budget: {
    range: {
      min: number;
      max: number;
    };
    financingPreference?: 'cash' | 'loan' | 'leasing' | 'renting';
    expectedROI?: number; // percentage
    paybackPeriod?: number; // years
  };

  // Goals & Priorities
  goals: {
    primary: GoalType[];
    secondary: GoalType[];
    priorities: {
      cost: number; // 1-10
      sustainability: number; // 1-10
      independence: number; // 1-10
      reliability: number; // 1-10
    };
  };

  // Preferences
  preferences: {
    moduleTypes?: string[];
    brands?: string[];
    warranty: {
      minimum: number; // years
      preferred?: number; // years
    };
    maintenance?: 'in-house' | 'provider' | 'hybrid';
    monitoring?: 'basic' | 'advanced' | 'premium';
  };

  // Timeline
  timeline: {
    preferredStart: string;
    urgency: 'low' | 'medium' | 'high' | 'critical';
    flexibility: 'high' | 'medium' | 'low';
  };

  // Decision Makers
  decisionMakers: {
    technical?: boolean;
    financial?: boolean;
    environmental?: boolean;
    operational?: boolean;
  };

  // Compliance & Regulations
  compliance: {
    industry?: string;
    certifications?: string[];
    standards?: string[];
    reporting?: string[];
  };

  // Historical Data
  history?: {
    previousProjects?: PreviousProject[];
    interactions?: Interaction[];
    feedback?: Feedback[];
  };
}

interface Recommendation {
  id: string;
  type: 'system' | 'product' | 'service' | 'financing' | 'optimization';
  title: string;
  description: string;
  confidence: number; // 0-1
  reasoning: string[];
  benefits: string[];
  specifications: {
    [key: string]: any;
  };
  financials: {
    cost: number;
    savings: {
      annual: number;
      total: number;
    };
    roi: number;
    paybackPeriod: number;
    co2Savings: number;
  };
  implementation: {
    timeline: string;
    complexity: 'low' | 'medium' | 'high';
    requirements: string[];
  };
  alternatives?: Recommendation[];
  caseStudies?: CaseStudy[];
  tags: string[];
  featured?: boolean;
  personalized: boolean;
  metadata: {
    algorithm: string;
    version: string;
    lastUpdated: string;
    dataSource: string[];
  };
}

interface RecommendationInteraction {
  type: 'view' | 'click' | 'favorite' | 'share' | 'feedback' | 'reject';
  recommendationId: string;
  timestamp: string;
  context?: {
    position?: number;
    variant?: string;
    filter?: string;
  };
  feedback?: {
    rating?: number;
    comment?: string;
    reasons?: string[];
  };
}

interface RecommendationFilter {
  type?: string[];
  maxCost?: number;
  minConfidence?: number;
  tags?: string[];
  features?: string[];
  exclude?: string[];
}
```

#### Usage Example
```tsx
<AIRecommender
  userProfile={{
    companyType: "medium",
    industry: "manufacturing",
    location: {
      city: "Stuttgart",
      coordinates: { lat: 48.7758, lng: 9.1829 }
    },
    consumption: {
      annual: 750000,
      profile: "constant",
      peakLoad: 150
    },
    infrastructure: {
      roofSize: 2000,
      roofType: "flat",
      availableSpace: 3000
    },
    budget: {
      range: { min: 200000, max: 500000 },
      financingPreference: "loan",
      expectedROI: 12,
      paybackPeriod: 8
    },
    goals: {
      primary: ["cost_reduction", "sustainability"],
      secondary: ["independence", "reliability"],
      priorities: {
        cost: 8,
        sustainability: 9,
        independence: 6,
        reliability: 9
      }
    },
    preferences: {
      moduleTypes: ["monocrystalline"],
      brands: ["premium"],
      warranty: {
        minimum: 20,
        preferred: 25
      },
      maintenance: "provider",
      monitoring: "advanced"
    },
    timeline: {
      preferredStart: "2025-03-01",
      urgency: "medium",
      flexibility: "medium"
    },
    decisionMakers: {
      technical: true,
      financial: true,
      environmental: true
    },
    compliance: {
      industry: "automotive",
      certifications: ["ISO 9001", "ISO 14001"],
      standards: ["DIN VDE 0100-712"]
    }
  }}
  onRecommendation={handleRecommendations}
  onInteraction={trackInteraction}
  maxRecommendations={5}
  showConfidence={true}
  showReasoning={true}
  showAlternatives={true}
  enableFeedback={true}
  refreshInterval={3600000} // 1 hour
  variant="cards"
  filter={{
    maxCost: 450000,
    minConfidence: 0.7,
    type: ["system", "product"]
  }}
  sort="confidence"
  personalized={true}
  learning={true}
/>
```

---

## 🎯 Dashboard Components

### **DashboardOverview.tsx** - Customer Dashboard

```typescript
interface DashboardOverviewProps {
  customerData: CustomerDashboardData;
  projects: DashboardProject[];
  widgets?: DashboardWidget[];
  layout?: DashboardLayout;
  theme?: 'light' | 'dark' | 'auto';
  refreshInterval?: number;
  enableExport?: boolean;
  enableNotifications?: boolean;
  enableCustomization?: boolean;
  className?: string;
  onWidgetAction?: (action: WidgetAction) => void;
  onLayoutChange?: (layout: DashboardLayout) => void;
}

interface CustomerDashboardData {
  profile: {
    name: string;
    company?: string;
    customerType: 'private' | 'business';
    memberSince: string;
    status: 'active' | 'inactive' | 'suspended';
    avatar?: string;
  };
  statistics: {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    totalInvestment: number;
    totalSavings: number;
    co2Savings: number;
    averageROI: number;
  };
  notifications: DashboardNotification[];
  quickActions: QuickAction[];
}

interface DashboardProject {
  id: string;
  title: string;
  type: string;
  status: 'planning' | 'active' | 'completed' | 'maintenance';
  progress: number; // 0-100
  nextMilestone?: string;
  nextDueDate?: string;
  performance?: {
    currentProduction?: number; // kWh
    expectedProduction?: number; // kWh
    efficiency?: number; // percentage
    savings?: number; // EUR/month
  };
  alerts?: ProjectAlert[];
}

interface DashboardWidget {
  id: string;
  type: 'kpi' | 'chart' | 'table' | 'alert' | 'weather' | 'news' | 'calendar' | 'custom';
  title: string;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  config: WidgetConfig;
  dataSource?: string;
  refreshInterval?: number;
  permissions?: {
    view: boolean;
    edit: boolean;
    delete: boolean;
  };
}

interface WidgetConfig {
  // KPI Widget
  kpis?: {
    label: string;
    value: number | string;
    unit?: string;
    trend?: {
      direction: 'up' | 'down' | 'stable';
      percentage: number;
      period: string;
    };
    target?: number;
    format?: 'number' | 'currency' | 'percentage' | 'duration';
  }[];

  // Chart Widget
  chart?: {
    type: 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'gauge';
    data?: any[];
    xAxis?: string;
    yAxis?: string;
    groupBy?: string;
    timeRange?: string;
    aggregation?: 'sum' | 'avg' | 'min' | 'max' | 'count';
    colors?: string[];
    showLegend?: boolean;
    showGrid?: boolean;
    showTooltip?: boolean;
  };

  // Table Widget
  table?: {
    columns: TableColumn[];
    data?: any[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
    };
    sorting?: {
      field: string;
      direction: 'asc' | 'desc';
    };
    filtering?: Record<string, any>;
    exportable?: boolean;
  };

  // Alert Widget
  alert?: {
    level: 'info' | 'success' | 'warning' | 'error' | 'critical';
    message: string;
    description?: string;
    actions?: AlertAction[];
    dismissible?: boolean;
    autoHide?: number; // milliseconds
  };

  // Custom Widget
  custom?: {
    component: React.ComponentType<any>;
    props?: Record<string, any>;
  };
}

interface DashboardLayout {
  columns: number;
  rowHeight: number;
  margin: [number, number];
  containerPadding: [number, number];
  breakpoints: {
    lg: number;
    md: number;
    sm: number;
    xs: number;
  };
}
```

#### Usage Example
```tsx
<DashboardOverview
  customerData={customerDashboardData}
  projects={dashboardProjects}
  widgets={[
    {
      id: 'kpi-overview',
      type: 'kpi',
      title: 'Gesamtübersicht',
      position: { x: 0, y: 0, w: 4, h: 2 },
      config: {
        kpis: [
          {
            label: 'Gesamtersparnis',
            value: 25920,
            unit: 'EUR/Jahr',
            trend: {
              direction: 'up',
              percentage: 12.5,
              period: 'letztes Jahr'
            },
            target: 30000,
            format: 'currency'
          },
          {
            label: 'CO₂-Einsparung',
            value: 4.05,
            unit: 't/Jahr',
            trend: {
              direction: 'up',
              percentage: 8.3,
              period: 'letztes Jahr'
            },
            format: 'number'
          }
        ]
      }
    },
    {
      id: 'production-chart',
      type: 'chart',
      title: 'Ertragsentwicklung',
      position: { x: 4, y: 0, w: 8, h: 4 },
      config: {
        chart: {
          type: 'line',
          timeRange: '12months',
          aggregation: 'sum',
          showLegend: true,
          showGrid: true
        }
      },
      dataSource: 'production-data'
    }
  ]}
  layout={{
    columns: 12,
    rowHeight: 100,
    margin: [16, 16],
    containerPadding: [16, 16],
    breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480 }
  }}
  theme="auto"
  refreshInterval={30000}
  enableExport={true}
  enableNotifications={true}
  enableCustomization={true}
  onWidgetAction={handleWidgetAction}
  onLayoutChange={saveLayout}
/>
```

---

## 🔧 Utility Components

### **OptimizedImage.tsx** - Performance-Optimized Image Component

```typescript
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number; // 1-100
  format?: 'webp' | 'avif' | 'jpg' | 'png' | 'auto';
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  placeholder?: 'blur' | 'empty' | 'dominantColor';
  blurDataURL?: string;
  fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  className?: string;
  style?: React.CSSProperties;
  sizes?: string;
  srcSet?: string;
  onError?: (error: React.SyntheticEvent<HTMLImageElement>) => void;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  enableCDN?: boolean;
  enableCacheBusting?: boolean;
  transformations?: ImageTransformations;
  fallback?: ReactNode;
  fallbackStrategy?: 'onError' | 'beforeLoad' | 'always';
}
```

---

## 📚 Advanced Component Patterns

### Compound Components
```typescript
const Card = {
  Root: ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={`card ${className || ''}`}>{children}</div>
  ),
  Header: ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={`card-header ${className || ''}`}>{children}</div>
  ),
  Body: ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={`card-body ${className || ''}`}>{children}</div>
  ),
  Footer: ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={`card-footer ${className || ''}`}>{children}</div>
  )
};
```

### Render Props Pattern
```typescript
interface DataFetcherProps<T> {
  url: string;
  children: (data: {
    loading: boolean;
    error: string | null;
    data: T | null;
    refetch: () => void;
  }) => ReactNode;
}
```

### Higher-Order Components
```typescript
function withLoading<P extends object>(
  Component: React.ComponentType<P>,
  LoadingComponent?: React.ComponentType
) {
  return function WithLoadingComponent(props: P & { isLoading?: boolean }) {
    const { isLoading, ...rest } = props;

    if (isLoading) {
      return LoadingComponent ? <LoadingComponent /> : <div>Loading...</div>;
    }

    return <Component {...(rest as P)} />;
  };
}
```

---

## 🔍 Props Validation

### Custom Validation Functions
```typescript
const validateProps = {
  // Email validation
  email: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? null : 'Invalid email format';
  },

  // Phone validation (German format)
  phoneDE: (phone: string) => {
    const phoneRegex = /^(\+49|0)[1-9][0-9]{1,14}$/;
    return phoneRegex.test(phone) ? null : 'Invalid German phone number';
  },

  // URL validation
  url: (url: string) => {
    try {
      new URL(url);
      return null;
    } catch {
      return 'Invalid URL format';
    }
  },

  // Date validation
  date: (date: string) => {
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? 'Invalid date format' : null;
  },

  // Range validation
  range: (value: number, min: number, max: number) => {
    if (value < min || value > max) {
      return `Value must be between ${min} and ${max}`;
    }
    return null;
  }
};
```

---

## 🎯 Best Practices

### Props Design Guidelines
1. **Use TypeScript interfaces** for all props
2. **Make optional props truly optional** with sensible defaults
3. **Avoid boolean props** for multiple states - use enums instead
4. **Provide detailed JSDoc comments** for complex props
5. **Use discriminated unions** for prop variations
6. **Implement proper prop validation** for runtime safety

### Component Composition
1. **Prefer composition over inheritance**
2. **Use render props for flexible components**
3. **Implement compound components for related functionality**
4. **Provide escape hatches with `as` prop or `className`**
5. **Make components composable and reusable**

### Performance Considerations
1. **Use React.memo** for expensive components
2. **Implement proper key props** for lists
3. **Debounce expensive operations** in props
4. **Use useMemo and useCallback** for computed values
5. **Lazy load heavy components**

---

**📊 Reference Version:** 1.0.0
**🔒 TypeScript:** Full Type Safety
**⚡ Performance:** Optimized Props
**♿ Accessibility:** ARIA Compliant
**📅 Last Update:** 17. November 2025
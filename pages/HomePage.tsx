import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Page } from '../types';
import { SemanticMain, SemanticSection } from '../components/SemanticLayout';

import Hero from '../components/Hero';
import PainPoints from '../components/PainPoints';
import ProjectGallery from '../components/ProjectGallery';
import Solutions from '../components/Solutions';
import UseCases from '../components/UseCases';
import PricingSection from '../components/PricingSection';
import ZeroDownPayment from '../components/ZeroDownPayment';
import AnimatedSection from '../components/AnimatedSection';
import Process from '../components/Process';
import GuaranteeSection from '../components/GuaranteeSection';
import HighIntentCTA from '../components/HighIntentCTA';
import CustomerBenefits from '../components/CustomerBenefits';
import CustomerTypeToggle from '../components/CustomerTypeToggle';

interface HomePageProps {
  setPage: (page: Page) => void;
  onSelectAnwendungsfall: (slug: string) => void;
  onSelectHersteller: (slug: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setPage, onSelectAnwendungsfall, onSelectHersteller }) => {
  const [customerType, setCustomerType] = useState<'private' | 'business'>('business');
  const sectionShell = 'py-16 sm:py-20 px-4 sm:px-6 lg:px-12';

  return (
    <SemanticMain className="w-full bg-[#FFFEFB] text-slate-900">
      <Helmet>
        <title>{customerType === 'private' ? 'Solaranlage Eigenheim - Komplette Photovoltaik-Lösungen für Ihr Zuhause | ZOE Solar' : 'Solaranlagen für Unternehmen - Gewerbliche Photovoltaik-Lösungen | ZOE Solar'}</title>
        <meta name="description" content={customerType === 'private' ? 'Solaranlage für Einfamilienhaus: Kostenlose Beratung, Planung & Installation. Bis zu 30% Förderung. Testsieger 2025. Jetzt kostenloses Angebot anfordern! Bis zu 30% Förderung möglich.' : 'Gewerbliche Solaranlagen: Kostenlose Beratung, Planung & Installation für Unternehmen. Bis zu 30% Förderung. Testsieger 2025. Jetzt kostenloses Angebot anfordern!'} />
        <meta name="keywords" content={customerType === 'private' ? 'Solaranlage Eigenheim, Photovoltaik Einfamilienhaus, Solaranlage Kosten, PV-Anlage Haus, Solarstrom Eigenheim' : 'Gewerbliche Solaranlagen, Photovoltaik Unternehmen, Solaranlage Gewerbe, PV-Anlage Geschäft, Solarstrom Gewerbe'} />
        <meta property="og:title" content={customerType === 'private' ? 'Solaranlage Eigenheim - Komplette Photovoltaik-Lösungen für Ihr Zuhause' : 'Solaranlagen für Unternehmen - Gewerbliche Photovoltaik-Lösungen'} />
        <meta property="og:description" content={customerType === 'private' ? 'Solaranlage für Einfamilienhaus: Kostenlose Beratung, Planung & Installation. Bis zu 30% Förderung. Testsieger 2025.' : 'Gewerbliche Solaranlagen: Kostenlose Beratung, Planung & Installation für Unternehmen. Bis zu 30% Förderung. Testsieger 2025.'} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={customerType === 'private' ? 'Solaranlage Eigenheim - Komplette Photovoltaik-Lösungen' : 'Solaranlagen für Unternehmen - Gewerbliche Photovoltaik-Lösungen'} />
        <meta name="twitter:description" content={customerType === 'private' ? 'Solaranlage für Einfamilienhaus: Kostenlose Beratung, Planung & Installation. Bis zu 30% Förderung.' : 'Gewerbliche Solaranlagen: Kostenlose Beratung, Planung & Installation für Unternehmen. Bis zu 30% Förderung.'} />
        <link rel="canonical" href="https://zoe-solar.de/" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "name": "ZOE Solar",
                "description": customerType === 'private' ? "Ihr Experte für Solaranlagen im Eigenheim. Komplette Photovoltaik-Lösungen mit kostenloser Beratung und Installation." : "Ihr Experte für gewerbliche Solaranlagen. Komplette Photovoltaik-Lösungen für Unternehmen mit kostenloser Beratung und Installation.",
                "url": "https://zoe-solar.de",
                "logo": "https://zoe-solar.de/logo.png",
                "sameAs": [
                  "https://www.facebook.com/zoesolar",
                  "https://www.instagram.com/zoesolar",
                  "https://www.linkedin.com/company/zoe-solar"
                ],
                "contactPoint": {
                  "@type": "ContactPoint",
                  "telephone": "+49-30-12345678",
                  "contactType": "customer service",
                  "availableLanguage": "German"
                },
                "areaServed": {
                  "@type": "Country",
                  "name": "Germany"
                },
                "hasOfferCatalog": {
                  "@type": "OfferCatalog",
                  "name": "Solaranlagen Dienstleistungen",
                  "itemListElement": [
                    {
                      "@type": "Offer",
                      "itemOffered": {
                        "@type": "Service",
                        "name": customerType === 'private' ? "Solaranlage Installation" : "Gewerbliche Solaranlage Installation",
                        "description": customerType === 'private' ? "Komplette Installation von Photovoltaik-Anlagen für Einfamilienhäuser" : "Komplette Installation von Photovoltaik-Anlagen für Unternehmen"
                      }
                    },
                    {
                      "@type": "Offer",
                      "itemOffered": {
                        "@type": "Service",
                        "name": customerType === 'private' ? "Solaranlage Beratung" : "Gewerbliche Solaranlage Beratung",
                        "description": customerType === 'private' ? "Kostenlose Beratung zur optimalen Solaranlage für Ihr Zuhause" : "Kostenlose Beratung zur optimalen Solaranlage für Ihr Unternehmen"
                      }
                    }
                  ]
                }
              },
              {
                "@type": "WebSite",
                "name": "ZOE Solar",
                "url": "https://zoe-solar.de",
                "description": customerType === 'private' ? "Solaranlagen für Einfamilienhäuser - Kostenlose Beratung und Installation" : "Gewerbliche Solaranlagen - Kostenlose Beratung und Installation für Unternehmen",
                "publisher": {
                  "@type": "Organization",
                  "name": "ZOE Solar"
                },
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://zoe-solar.de/search?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              },
              {
                "@type": "Product",
                "name": customerType === 'private' ? "Solaranlage Komplettsystem" : "Gewerbliche Solaranlage Komplettsystem",
                "description": customerType === 'private' ? "Komplette Photovoltaik-Anlage für Einfamilienhäuser mit Speicher und Wallbox" : "Komplette Photovoltaik-Anlage für Unternehmen mit Speicher und Wallbox",
                "brand": {
                  "@type": "Brand",
                  "name": "ZOE Solar"
                },
                "offers": {
                  "@type": "Offer",
                  "priceCurrency": "EUR",
                  "priceRange": customerType === 'private' ? "15000-35000" : "50000-500000",
                  "availability": "https://schema.org/InStock",
                  "seller": {
                    "@type": "Organization",
                    "name": "ZOE Solar"
                  }
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.8",
                  "reviewCount": "127",
                  "bestRating": "5",
                  "worstRating": "1"
                }
              },
              {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": customerType === 'private' ? "Wie viel kostet eine Solaranlage für ein Einfamilienhaus?" : "Wie viel kostet eine gewerbliche Solaranlage?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": customerType === 'private' ? "Die Kosten für eine Solaranlage liegen zwischen 15.000€ und 35.000€, abhängig von Größe und Ausstattung. Mit Förderungen reduzieren sich die Kosten um bis zu 30%." : "Die Kosten für eine gewerbliche Solaranlage liegen zwischen 50.000€ und 500.000€, abhängig von Größe und Ausstattung. Mit Förderungen reduzieren sich die Kosten um bis zu 30%."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Wie lange dauert die Installation einer Solaranlage?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Die Installation dauert typischerweise 2-5 Tage, abhängig von der Komplexität der Anlage und Dachsituation."
                    }
                  }
                ]
              },
              {
                "@type": "Service",
                "name": "Solaranlage Wartung",
                "description": "Professionelle Wartung und Service für Ihre Photovoltaik-Anlage",
                "provider": {
                  "@type": "Organization",
                  "name": "ZOE Solar"
                },
                "serviceType": "Wartungsservice",
                "areaServed": {
                  "@type": "Country",
                  "name": "Germany"
                }
              }
            ]
          })}
        </script>
      </Helmet>

      {/* Hero Section - Primary Call to Action */}
      <SemanticSection aria-label="Hauptbereich Einführung" className="px-0">
        <Hero customerType={customerType} onSelectHersteller={onSelectHersteller} setPage={setPage} />
      </SemanticSection>

      {/* Pain Points - Problem Identification */}
      <SemanticSection aria-label="Herausforderungen und Lösungen" className={sectionShell}>
        <PainPoints />
      </SemanticSection>

      {/* Knowledge Teaser - Links to New Pages */}
      <SemanticSection aria-label="Wissensbereiche erkunden" className={`${sectionShell} bg-white`}>
        <div className="max-w-7xl mx-auto bg-white/95 border border-slate-100 rounded-[32px] shadow-[0_20px_60px_rgba(15,23,42,0.06)] p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                Entdecken Sie unser Wissen
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Tiefergehende Informationen zu Technologien, Anleitungen, häufigen Fragen und Agri-PV-Lösungen.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-50 rounded-2xl p-6 text-left hover:bg-white transition-all cursor-pointer border border-transparent hover:border-primary-100" onClick={() => setPage('technology-page' as Page)}>
                <div className="bg-primary-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-2">Technologie & Innovation</h3>
                <p className="text-slate-600 text-base leading-relaxed">Erfahren Sie, welche technischen Standards Ihre Anlage wirklich braucht.</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 text-left hover:bg-white transition-all cursor-pointer border border-transparent hover:border-blue-100" onClick={() => setPage('guide-page' as Page)}>
                <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-2">Interaktive Anleitungen</h3>
                <p className="text-slate-600 text-base leading-relaxed">Schritt-für-Schritt-Erklärungen, die komplexe Vorgänge einfach machen.</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 text-left hover:bg-white transition-all cursor-pointer border border-transparent hover:border-purple-100" onClick={() => setPage('faq-page' as Page)}>
                <div className="bg-purple-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-2">Häufige Fragen</h3>
                <p className="text-slate-600 text-base leading-relaxed">Antworten auf die Fragen, die uns Familienbetriebe täglich stellen.</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-6 text-left hover:bg-white transition-all cursor-pointer border border-transparent hover:border-orange-100" onClick={() => setPage('agripv-page' as Page)}>
                <div className="bg-orange-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-2">Agri-PV Lösungen</h3>
                <p className="text-slate-600 text-base leading-relaxed">Solarlösungen speziell für Landwirte und Agrarbetriebe.</p>
              </div>
            </div>
        </div>
      </SemanticSection>

      {/* Why ZOE Solar - Company Strengths */}
      <SemanticSection aria-label="Warum ZOE Solar" className={sectionShell}>
        <AnimatedSection>
          <CustomerBenefits customerType={customerType} />
        </AnimatedSection>
      </SemanticSection>

      {/* Solutions - Service Offerings */}
      <SemanticSection aria-label="Unsere Lösungen" className={sectionShell}>
        <AnimatedSection>
          <Solutions />
        </AnimatedSection>
      </SemanticSection>

      {/* Use Cases - Industry Applications */}
      <SemanticSection aria-label="Anwendungsfälle" className={sectionShell}>
        <AnimatedSection>
          <UseCases customerType={customerType} onSelectAnwendungsfall={onSelectAnwendungsfall} setPage={setPage} />
        </AnimatedSection>
      </SemanticSection>

      {/* Process - How It Works */}
      <SemanticSection aria-label="Unser Prozess" className={sectionShell}>
        <AnimatedSection>
          <Process customerType={customerType} setPage={setPage} />
        </AnimatedSection>
      </SemanticSection>

      {/* Project Gallery - Portfolio */}
      <SemanticSection aria-label="Projektgalerie" className={sectionShell}>
        <AnimatedSection>
          <ProjectGallery customerType={customerType} setPage={setPage} />
        </AnimatedSection>
      </SemanticSection>

      {/* Zero Down Payment - Financing Option */}
      <SemanticSection aria-label="Null-Anzahlung Option" className={sectionShell}>
        <AnimatedSection>
          <ZeroDownPayment customerType={customerType} setPage={setPage} />
        </AnimatedSection>
      </SemanticSection>

      {/* Pricing - Cost Information */}
      <SemanticSection aria-label="Preise und Pakete" className={sectionShell}>
        <AnimatedSection>
          <PricingSection setPage={setPage} customerType={customerType} />
        </AnimatedSection>
      </SemanticSection>

      {/* Guarantee - Warranty Information */}
      <SemanticSection aria-label="Garantie und Sicherheit" className={sectionShell}>
        <AnimatedSection>
          <GuaranteeSection setPage={setPage} />
        </AnimatedSection>
      </SemanticSection>




      {/* High Intent CTA - Conversion Funnel */}
      <SemanticSection aria-label="Handlungsaufforderung" className={sectionShell}>
        <AnimatedSection>
          <HighIntentCTA setPage={setPage} customerType={customerType} />
        </AnimatedSection>
      </SemanticSection>


      {/* Fixed Customer Type Toggle */}
      <CustomerTypeToggle customerType={customerType} setCustomerType={setCustomerType} />

    </SemanticMain>
  );
};

export default HomePage;
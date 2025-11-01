import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProblemSolution from '../components/ProblemSolution';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import Header from '../components/Header';
import SubHeader from '../components/SubHeader';
import PromoBanner from '../components/PromoBanner';
import ScrollToTopButton from '../components/ScrollToTopButton';
import CookieConsentBanner from '../components/CookieConsentBanner';

const EigenheimKostenPage: React.FC = () => {
  const heroData = {
    title: "Solaranlage Eigenheim Kosten - Lohnt sich das?",
    subtitle: "Detaillierte Kostenübersicht für Photovoltaik-Anlagen im Eigenheim. Förderungen ✓ Finanzierung ✓ Wirtschaftlichkeit ✓ Jetzt kostenlose Beratung!",
    primaryButton: {
      text: "Kosten berechnen",
      href: "#calculator"
    },
    secondaryButton: {
      text: "Förderungen prüfen",
      href: "#foerderungen"
    },
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Solaranlage Kostenberechnung für Eigenheime"
  };

  const costBreakdown = [
    {
      category: "Solarmodule",
      percentage: 40,
      costRange: "6.000€ - 12.000€",
      description: "Hochwertige Module mit 25 Jahren Leistungsgarantie"
    },
    {
      category: "Wechselrichter",
      percentage: 15,
      costRange: "2.000€ - 4.000€",
      description: "String-Wechselrichter oder Hybrid-Wechselrichter"
    },
    {
      category: "Montagesystem",
      percentage: 20,
      costRange: "3.000€ - 6.000€",
      description: "Dachbefestigung und Montagematerial"
    },
    {
      category: "Installation",
      percentage: 15,
      costRange: "2.000€ - 4.000€",
      description: "Professionelle Montage und Inbetriebnahme"
    },
    {
      category: "Sonstiges",
      percentage: 10,
      costRange: "1.000€ - 3.000€",
      description: "Planung, Genehmigung, Verkabelung"
    }
  ];

  const financingOptions = [
    {
      title: "KfW-Förderung",
      description: "Bis zu 7.500€ Zuschuss für Solaranlagen",
      amount: "7.500€",
      type: "Zuschuss"
    },
    {
      title: "KfW-Kredit",
      description: "Zinsgünstiger Kredit bis 100.000€",
      amount: "100.000€",
      type: "Kredit"
    },
    {
      title: "Einspeisevergütung",
      description: "Vergütung für ins Netz eingespeisten Strom",
      amount: "8-13 ct/kWh",
      type: "Einnahme"
    },
    {
      title: "Steuerliche Vorteile",
      description: "Abschreibung über 20 Jahre möglich",
      amount: "Bis 40%",
      type: "Steuervorteil"
    }
  ];

  const testimonials = [
    {
      name: "Herr Bauer",
      location: "Stuttgart",
      text: "Mit der KfW-Förderung hat sich die Investition in 8 Jahren amortisiert. Jetzt spare ich 1.500€ Stromkosten jährlich.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
    },
    {
      name: "Familie Weber",
      location: "Köln",
      text: "Die genaue Kostenaufstellung und Wirtschaftlichkeitsberechnung hat uns überzeugt. Alles war transparent und nachvollziehbar.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=150&auto=format&fit=crop"
    }
  ];

  const faqData = [
    {
      question: "Wie hoch sind die typischen Kosten für eine Solaranlage im Eigenheim?",
      answer: "Eine 8-10kWp Solaranlage kostet zwischen 15.000€ und 25.000€ brutto. Mit Förderungen reduzieren sich die Netto-Kosten auf 10.000€ bis 18.000€."
    },
    {
      question: "Welche Förderungen gibt es aktuell für Solaranlagen?",
      answer: "Aktuell gibt es die KfW-Förderung (7.500€ Zuschuss), BAFA-Förderung für Speicher (bis 7.500€) und die Einspeisevergütung. Die Förderungen ändern sich regelmäßig."
    },
    {
      question: "Lohnt sich eine Solaranlage finanziell?",
      answer: "Bei optimalen Bedingungen amortisiert sich eine Solaranlage in 8-12 Jahren. Mit steigenden Strompreisen und Förderungen kann sich die Amortisationszeit auf 6-8 Jahre verkürzen."
    },
    {
      question: "Kann ich eine Solaranlage finanzieren?",
      answer: "Ja, es gibt verschiedene Finanzierungsmöglichkeiten: KfW-Kredit mit günstigen Zinsen, Ratenzahlung beim Hersteller oder Leasing-Modelle."
    },
    {
      question: "Wie viel spare ich mit einer Solaranlage?",
      answer: "Bei einem Jahresverbrauch von 4.000kWh können Sie mit einer 8kWp Anlage ca. 1.200-1.800€ Stromkosten jährlich sparen, je nach Strompreis und Eigenverbrauchsanteil."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Solaranlage Eigenheim Kosten | Photovoltaik Preise 2025 | ZOE Solar</title>
        <meta name="description" content="Solaranlage Eigenheim Kosten: Detaillierte Preisübersicht ✓ Förderungen ✓ Wirtschaftlichkeit ✓ Kostenlose Beratung. Jetzt informieren!" />
        <meta name="keywords" content="Solaranlage Eigenheim Kosten, Photovoltaik Kosten Eigenheim, Solaranlage Preise, PV Anlage Kosten, Solarstrom Kosten" />
        <link rel="canonical" href="https://www.zoe-solar.de/eigenheim-kosten" />

        {/* Open Graph */}
        <meta property="og:title" content="Solaranlage Eigenheim Kosten | Photovoltaik Preise 2025 | ZOE Solar" />
        <meta property="og:description" content="Solaranlage Eigenheim Kosten: Detaillierte Preisübersicht ✓ Förderungen ✓ Wirtschaftlichkeit ✓ Kostenlose Beratung." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop" />
        <meta property="og:url" content="https://www.zoe-solar.de/eigenheim-kosten" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Solaranlage Eigenheim Kosten | Photovoltaik Preise 2025 | ZOE Solar" />
        <meta name="twitter:description" content="Solaranlage Eigenheim Kosten: Detaillierte Preisübersicht ✓ Förderungen ✓ Wirtschaftlichkeit ✓ Kostenlose Beratung." />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Solaranlage Eigenheim Kosten",
            "description": "Detaillierte Kostenübersicht für Photovoltaik-Anlagen im Eigenheim",
            "url": "https://www.zoe-solar.de/eigenheim-kosten",
            "mainEntity": {
              "@type": "Service",
              "name": "Solaranlage Kostenberatung",
              "description": "Professionelle Beratung zu Kosten und Wirtschaftlichkeit von Solaranlagen für Eigenheime"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-white">
        <Header />
        <SubHeader />

        <main>
          <Hero {...heroData} />

          {/* Kostenübersicht */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Kostenübersicht Solaranlage Eigenheim
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Detaillierte Aufschlüsselung der Kosten für eine typische 8-10kWp Solaranlage
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {costBreakdown.map((item, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{item.category}</h3>
                      <span className="text-2xl font-bold text-blue-600">{item.percentage}%</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{item.costRange}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 bg-blue-600 rounded-lg p-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-4">Gesamtkosten Beispiel</h3>
                <p className="text-4xl font-bold mb-2">18.000€ - 28.000€</p>
                <p className="text-blue-100">Brutto für 8-10kWp Komplettanlage inkl. Installation</p>
              </div>
            </div>
          </section>

          {/* Förderungen */}
          <section id="foerderungen" className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Förderungen & Finanzierung
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Reduzieren Sie die Kosten Ihrer Solaranlage mit staatlichen Förderungen
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {financingOptions.map((option, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">{option.title}</h3>
                      <span className="text-lg font-bold text-green-600">{option.amount}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{option.type}</p>
                    <p className="text-gray-700">{option.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Wirtschaftlichkeit */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Wirtschaftlichkeit Ihrer Solaranlage
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="text-2xl font-bold text-blue-600 mb-2">8-12 Jahre</h3>
                  <p className="text-gray-600">Amortisationszeit</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="text-2xl font-bold text-green-600 mb-2">1.200-1.800€</h3>
                  <p className="text-gray-600">Jährliche Ersparnis</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="text-2xl font-bold text-purple-600 mb-2">25+ Jahre</h3>
                  <p className="text-gray-600">Nutzungsdauer</p>
                </div>
              </div>

              <p className="text-lg text-gray-600">
                Mit steigenden Strompreisen und Förderungen kann sich Ihre Investition bereits in 6-8 Jahren amortisieren.
              </p>
            </div>
          </section>

          <Testimonials
            testimonials={testimonials}
            title="Erfahrungen unserer Kunden"
            subtitle="Was Eigenheimbesitzer über die Kosten und Wirtschaftlichkeit sagen"
          />

          <FAQ
            faqs={faqData}
            title="Häufige Fragen zu Solaranlage Kosten"
            subtitle="Alles was Sie über die Kosten einer Photovoltaik-Anlage wissen müssen"
          />

          {/* CTA Section */}
          <section className="py-16 bg-blue-600">
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Kostenlose & unverbindliche Beratung
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Lassen Sie sich individuell beraten und erhalten Sie eine genaue Kostenaufstellung für Ihr Eigenheim.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/kontakt"
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors"
                >
                  Kostenlose Beratung
                </Link>
                <Link
                  to="/solarrechner"
                  className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Kosten berechnen
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
        <ScrollToTopButton />
        <CookieConsentBanner />
      </div>
    </>
  );
};

export default EigenheimKostenPage;
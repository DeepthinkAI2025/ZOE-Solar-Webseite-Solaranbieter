import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProblemSolution from '../components/ProblemSolution';
import Process from '../components/Process';
import Testimonials from '../components/Testimonials';
import { Calculator } from '../components/Calculator';
import FAQ from '../components/FAQ';

const EigenheimPage: React.FC = () => {
  const heroData = {
    title: "Solaranlagen für Eigenheime - Ihre Energieunabhängigkeit",
    subtitle: "Professionelle Photovoltaik-Lösungen für Einfamilienhäuser, Doppelhäuser und Reihenhäuser. Kostenlose Beratung ✓ Qualität ✓ Erfahrung seit 2010.",
    primaryButton: {
      text: "Kostenlose Beratung",
      href: "#contact"
    },
    secondaryButton: {
      text: "Solarrechner",
      href: "#calculator"
    },
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Moderne Solaranlage auf einem Einfamilienhaus"
  };

  const problems = [
    {
      title: "Steigende Stromkosten",
      description: "Die Strompreise steigen kontinuierlich. Mit einer Solaranlage machen Sie sich unabhängig von Energieversorgern.",
      icon: "⚡"
    },
    {
      title: "Umweltbewusstsein",
      description: "Sie möchten nachhaltig leben und CO2 einsparen? Solarenergie ist die sauberste Energiequelle.",
      icon: "🌱"
    },
    {
      title: "Wertsteigerung Immobilie",
      description: "Eine Solaranlage erhöht den Wert Ihres Eigenheims und macht es attraktiver für potenzielle Käufer.",
      icon: "🏠"
    }
  ];

  const solutions = [
    {
      title: "Komplette Solaranlage",
      description: "Vom Dach-Check bis zur Inbetriebnahme - wir übernehmen alles. Hochwertige Module und Wechselrichter.",
      icon: "☀️"
    },
    {
      title: "Batteriespeicher",
      description: "Speichern Sie überschüssigen Solarstrom und nutzen Sie ihn auch nachts oder bei schlechtem Wetter.",
      icon: "🔋"
    },
    {
      title: "Wallbox für E-Auto",
      description: "Laden Sie Ihr Elektroauto mit selbstproduziertem Strom - die perfekte Ergänzung zur Solaranlage.",
      icon: "🚗"
    }
  ];

  const processSteps = [
    {
      title: "Kostenlose Beratung",
      description: "Wir besuchen Sie vor Ort, prüfen Ihr Dach und erstellen ein maßgeschneidertes Angebot.",
      icon: "📋"
    },
    {
      title: "Planung & Genehmigung",
      description: "Wir übernehmen die komplette Planung und beantragen alle notwendigen Genehmigungen.",
      icon: "📐"
    },
    {
      title: "Professionelle Installation",
      description: "Unsere zertifizierten Monteure installieren Ihre Solaranlage fachgerecht und termingerecht.",
      icon: "🔧"
    },
    {
      title: "Inbetriebnahme & Service",
      description: "Nach der Installation nehmen wir die Anlage in Betrieb und bieten umfassenden Service.",
      icon: "✅"
    }
  ];

  const testimonials = [
    {
      name: "Familie Müller",
      location: "Berlin",
      text: "Seit der Installation unserer Solaranlage sparen wir über 1.200€ Stromkosten im Jahr. Die Beratung war erstklassig und die Installation professionell.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
    },
    {
      name: "Herr Schmidt",
      location: "München",
      text: "Die Kombination aus Solaranlage und Batteriespeicher war die beste Entscheidung. Wir sind jetzt nahezu energieautark.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop"
    },
    {
      name: "Frau Wagner",
      location: "Hamburg",
      text: "Von der Beratung bis zur Wartung - alles aus einer Hand. Besonders die transparente Kommunikation hat uns überzeugt.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=150&auto=format&fit=crop"
    }
  ];

  const faqData = [
    {
      question: "Wie viel kostet eine Solaranlage für mein Einfamilienhaus?",
      answer: "Die Kosten variieren je nach Größe und Ausstattung. Eine typische 8-10kWp Anlage kostet zwischen 15.000€ und 25.000€. Mit Förderungen reduzieren sich die Kosten erheblich."
    },
    {
      question: "Wie lange dauert die Amortisation einer Solaranlage?",
      answer: "Bei optimalen Bedingungen amortisiert sich eine Solaranlage in 8-12 Jahren. Mit steigenden Strompreisen und Förderungen kann sich die Amortisationszeit auf 6-8 Jahre verkürzen."
    },
    {
      question: "Brauche ich einen Batteriespeicher?",
      answer: "Ein Batteriespeicher erhöht Ihren Eigenverbrauch von ca. 30% auf bis zu 80%. Besonders empfehlenswert wenn Sie viel Strom am Abend oder in den Wintermonaten verbrauchen."
    },
    {
      question: "Welche Förderungen gibt es für Solaranlagen im Eigenheim?",
      answer: "Aktuell gibt es die KfW-Förderung (bis zu 7.500€ Zuschuss), BAFA-Förderung für Speicher und die Einspeisevergütung. Die Förderungen ändern sich regelmäßig."
    },
    {
      question: "Wie funktioniert die Netzeinspeisung?",
      answer: "Überschüssiger Solarstrom wird ins öffentliche Netz eingespeist. Dafür erhalten Sie eine Einspeisevergütung. Bei Bedarf können Sie den Strom auch zurücknehmen."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Solaranlagen für Eigenheime | Photovoltaik Einfamilienhaus | ZOE Solar</title>
        <meta name="description" content="Professionelle Solaranlagen für Einfamilienhäuser. Kostenlose Beratung ✓ Qualität ✓ Erfahrung seit 2010. Jetzt Energieunabhängigkeit erreichen!" />
        <meta name="keywords" content="Solaranlage Eigenheim, Photovoltaik Einfamilienhaus, Solaranlage Hausdach, PV Anlage Eigenheim, Solarstrom Eigenheim" />
        <link rel="canonical" href="https://www.zoe-solar.de/eigenheim" />

        {/* Open Graph */}
        <meta property="og:title" content="Solaranlagen für Eigenheime | Photovoltaik Einfamilienhaus | ZOE Solar" />
        <meta property="og:description" content="Professionelle Solaranlagen für Einfamilienhäuser. Kostenlose Beratung ✓ Qualität ✓ Erfahrung seit 2010." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop" />
        <meta property="og:url" content="https://www.zoe-solar.de/eigenheim" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Solaranlagen für Eigenheime | Photovoltaik Einfamilienhaus | ZOE Solar" />
        <meta name="twitter:description" content="Professionelle Solaranlagen für Einfamilienhäuser. Kostenlose Beratung ✓ Qualität ✓ Erfahrung seit 2010." />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Solaranlagen für Eigenheime",
            "description": "Professionelle Photovoltaik-Lösungen für Einfamilienhäuser, Doppelhäuser und Reihenhäuser",
            "provider": {
              "@type": "Organization",
              "name": "ZOE Solar GmbH",
              "url": "https://www.zoe-solar.de"
            },
            "serviceType": "Solaranlagen Installation",
            "areaServed": "Deutschland",
            "offers": {
              "@type": "Offer",
              "description": "Kostenlose Beratung und Installation von Solaranlagen für Eigenheime"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-white">
        <main>
          <Hero {...heroData} />

          <ProblemSolution
            problems={problems}
            solutions={solutions}
            title="Warum eine Solaranlage für Ihr Eigenheim?"
            subtitle="Entdecken Sie die Vorteile der Solarenergie für Ihr Zuhause"
          />

          <Process
            steps={processSteps}
            title="Ihr Weg zur Solaranlage"
            subtitle="Von der Beratung bis zur Inbetriebnahme - wir begleiten Sie durch jeden Schritt"
          />

          <section id="calculator" className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Solarrechner für Ihr Eigenheim
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Berechnen Sie die Wirtschaftlichkeit Ihrer Solaranlage. Geben Sie Ihre Dachfläche und Stromverbrauch ein.
                </p>
              </div>
              <Calculator />
            </div>
          </section>

          <Testimonials
            testimonials={testimonials}
            title="Was unsere Kunden sagen"
            subtitle="Erfahrungen von Eigenheimbesitzern mit Solaranlagen"
          />

          <FAQ
            faqs={faqData}
            title="Häufige Fragen zu Solaranlagen im Eigenheim"
            subtitle="Alles was Sie über Photovoltaik für Ihr Haus wissen müssen"
          />

          <section className="py-16 bg-blue-600">
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Bereit für Ihre Energieunabhängigkeit?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Lassen Sie sich kostenlos und unverbindlich beraten. Unsere Experten kommen zu Ihnen nach Hause.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/kontakt"
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors"
                >
                  Kostenlose Beratung vereinbaren
                </Link>
                <Link
                  to="/preise"
                  className="inline-flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md text-white bg-transparent hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Preise ansehen
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default EigenheimPage;
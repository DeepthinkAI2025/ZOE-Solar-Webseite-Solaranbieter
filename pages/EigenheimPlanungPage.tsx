import React from 'react';
import { Helmet } from 'react-helmet';
import Hero from '../components/Hero';
import ProblemSolution from '../components/ProblemSolution';
import InteractiveGuide from '../components/InteractiveGuide';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import ContactForm from '../components/ContactForm';

const EigenheimPlanungPage: React.FC = () => {
  const pageTitle = "Solaranlage Eigenheim Planung - Professionelle Beratung & Planung";
  const pageDescription = "Solaranlage Eigenheim Planung: Kompetente Beratung für Ihre Photovoltaik-Anlage. Dachanalyse ✓ Wirtschaftlichkeitsberechnung ✓ Individuelle Planung ✓ Jetzt starten!";
  const pageKeywords = "Solaranlage Eigenheim Planung, Photovoltaik Planung Haus, PV Anlage Planung, Dachanalyse Solaranlage, Wirtschaftlichkeitsberechnung Solaranlage";

  const heroProps = {
    title: "Solaranlage Eigenheim Planung",
    subtitle: "Professionelle Planung Ihrer Photovoltaik-Anlage",
    description: "Von der Dachanalyse bis zur finalen Planung - wir begleiten Sie durch jeden Schritt der Planung Ihrer Solaranlage für Ihr Eigenheim.",
    primaryButton: "Kostenlose Dachanalyse",
    secondaryButton: "Planungsberatung",
    backgroundImage: "/images/solaranlage-planung.jpg"
  };

  const problemSolutionProps = {
    problem: {
      title: "Komplexe Planung einer Solaranlage für das Eigenheim",
      description: "Die Planung einer Solaranlage erfordert Fachwissen in vielen Bereichen. Fehler in der Planungsphase können teuer werden.",
      points: [
        "Unklare Dachbedingungen und Statik",
        "Fehlende Kenntnisse über optimale Ausrichtung und Neigung",
        "Unsicherheit bei der Dimensionierung der Anlage",
        "Komplexe Förderlandschaft und Wirtschaftlichkeitsberechnung"
      ]
    },
    solution: {
      title: "Professionelle Planung sichert Ihren Solarerfolg",
      description: "Unsere zertifizierten Planer analysieren Ihr Dach, berechnen die Wirtschaftlichkeit und erstellen eine maßgeschneiderte Planung für Ihre Solaranlage.",
      points: [
        "Kostenlose Dachanalyse vor Ort",
        "Professionelle Wirtschaftlichkeitsberechnung",
        "Optimale Anlagendimensionierung für Ihr Dach",
        "Komplette Förderberatung und Antragsunterstützung"
      ]
    }
  };

  const testimonialsProps = {
    title: "Kundenstimmen zu unserer Planungsqualität",
    testimonials: [
      {
        name: "Herr Wagner",
        location: "Stuttgart",
        rating: 5,
        text: "Die Planung war sehr detailliert und hat alle Aspekte berücksichtigt. Besonders die Wirtschaftlichkeitsberechnung hat uns überzeugt.",
        image: "/images/testimonial-3.jpg"
      },
      {
        name: "Familie Bauer",
        location: "Frankfurt",
        rating: 5,
        text: "Die Dachanalyse war sehr professionell. Wir wussten vorher nicht, dass unser Dach so gut geeignet ist für Solaranlagen.",
        image: "/images/testimonial-4.jpg"
      }
    ]
  };

  const faqProps = {
    title: "Häufige Fragen zur Solaranlage Eigenheim Planung",
    faqs: [
      {
        question: "Wie läuft die Planung einer Solaranlage ab?",
        answer: "Zuerst führen wir eine kostenlose Dachanalyse durch. Dann erstellen wir eine Wirtschaftlichkeitsberechnung und eine detaillierte technische Planung."
      },
      {
        question: "Was kostet die Planung einer Solaranlage?",
        answer: "Die Grundplanung ist kostenlos. Bei Auftragserteilung verrechnen wir die Planungskosten mit dem Installationspreis."
      },
      {
        question: "Wie lange dauert die Planungsphase?",
        answer: "Eine vollständige Planung dauert typischerweise 2-4 Wochen, abhängig von der Komplexität des Daches und der gewünschten Anlage."
      },
      {
        question: "Welche Unterlagen brauche ich für die Planung?",
        answer: "Grundrisse des Daches, Informationen zur Elektrik und ggf. eine Statikberechnung bei älteren Häusern."
      },
      {
        question: "Können auch schwierige Dächer mit Solaranlagen ausgestattet werden?",
        answer: "Ja, wir haben Erfahrung mit allen Dachformen. Auch bei schwierigen Bedingungen finden wir optimale Lösungen."
      }
    ]
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Solaranlage Eigenheim Planung",
    "description": "Professionelle Planung und Beratung für Photovoltaik-Anlagen auf Eigenheimen",
    "provider": {
      "@type": "Organization",
      "name": "ZOE Solar GmbH",
      "url": "https://www.zoe-solar.de"
    },
    "areaServed": "DE",
    "serviceType": "Solaranlagen Planung"
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords} />
        <link rel="canonical" href="https://www.zoe-solar.de/solaranlage-eigenheim-planung" />
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </Helmet>

      <Hero {...heroProps} />
      <ProblemSolution {...problemSolutionProps} />
      <InteractiveGuide />
      <Testimonials {...testimonialsProps} />
      <FAQ {...faqProps} />
      <ContactForm />
    </>
  );
};

export default EigenheimPlanungPage;
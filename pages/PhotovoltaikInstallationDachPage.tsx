import React from 'react';
import CustomHelmet from '../components/CustomHelmet';
import Hero from '../components/Hero';
import ProblemSolution from '../components/ProblemSolution';
import Process from '../components/Process';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import ContactForm from '../components/ContactForm';

const PhotovoltaikInstallationDachPage: React.FC = () => {
  const pageTitle = "Photovoltaik Installation Dach - Professionelle Montage & Installation";
  const pageDescription = "Photovoltaik Installation Dach: Experten für die fachgerechte Montage Ihrer Solaranlage. Qualitätsgarantie ✓ Zertifizierte Monteure ✓ Wetterunabhängige Installation ✓ Jetzt Termin sichern!";
  const pageKeywords = "Photovoltaik Installation Dach, Solaranlage Montage, PV Installation Dach, Dachmontage Solaranlage, Solarteur Installation";

  const heroProps = {
    title: "Photovoltaik Installation Dach",
    subtitle: "Professionelle Montage Ihrer Solaranlage",
    description: "Unsere zertifizierten Fachkräfte installieren Ihre Photovoltaik-Anlage fachgerecht und sicher. Wetterunabhängige Montage mit Qualitätsgarantie.",
    primaryButton: "Installations-Termin",
    secondaryButton: "Montageberatung",
    backgroundImage: "/images/photovoltaik-installation.jpg"
  };

  const problemSolutionProps = {
    problem: {
      title: "Risiken bei unsachgemäßer Dachinstallation",
      description: "Eine falsch installierte Solaranlage kann zu Sicherheitsrisiken, Leistungsverlusten und teuren Nachbesserungen führen.",
      points: [
        "Unsichere Montage gefährdet Dach und Bewohner",
        "Leistungsverluste durch falsche Ausrichtung",
        "Wasserschäden durch undichte Montagepunkte",
        "Hohe Nachbesserungskosten bei Fehlern"
      ]
    },
    solution: {
      title: "Professionelle Installation sichert Ihre Investition",
      description: "Unsere zertifizierten Monteure garantieren eine fachgerechte Installation nach höchsten Standards und Sicherheitsvorschriften.",
      points: [
        "Zertifizierte Fachkräfte mit langjähriger Erfahrung",
        "Wetterunabhängige Montage mit Wetterschutz",
        "Qualitätskontrolle und Funktionsprüfung",
        "10-jährige Garantie auf Montage und Material"
      ]
    }
  };

  const processProps = {
    title: "Unser Installationsprozess",
    steps: [
      {
        title: "Vorbereitung",
        description: "Dachvorbereitung und Materialtransport",
        icon: "🔧"
      },
      {
        title: "Unterkonstruktion",
        description: "Montage der stabilen Unterkonstruktion",
        icon: "🏗️"
      },
      {
        title: "Module",
        description: "Fachgerechte Montage der Solarmodule",
        icon: "☀️"
      },
      {
        title: "Elektrik",
        description: "Verkabelung und Anschluss der Wechselrichter",
        icon: "⚡"
      },
      {
        title: "Prüfung",
        description: "Funktionsprüfung und Qualitätskontrolle",
        icon: "✅"
      },
      {
        title: "Inbetriebnahme",
        description: "Offizielle Inbetriebnahme und Übergabe",
        icon: "🚀"
      }
    ]
  };

  const testimonialsProps = {
    title: "Kundenbewertungen unserer Installation",
    testimonials: [
      {
        name: "Herr Schneider",
        location: "München",
        rating: 5,
        text: "Die Installation war perfekt organisiert. Trotz Regenwetter konnte termingerecht installiert werden. Sehr professionelle Arbeit.",
        image: "/images/testimonial-5.jpg"
      },
      {
        name: "Frau Weber",
        location: "Hamburg",
        rating: 5,
        text: "Die Monteure waren sehr sorgfältig und haben alles sauber hinterlassen. Die Anlage läuft einwandfrei seit der Installation.",
        image: "/images/testimonial-6.jpg"
      }
    ]
  };

  const faqProps = {
    title: "Häufige Fragen zur Photovoltaik Installation Dach",
    faqs: [
      {
        question: "Wie lange dauert die Installation einer Solaranlage?",
        answer: "Eine typische Dachinstallation dauert 2-5 Tage, abhängig von der Anlagengröße und Dachkomplexität."
      },
      {
        question: "Kann bei jedem Wetter installiert werden?",
        answer: "Wir installieren wetterunabhängig. Bei starkem Wind oder Eis verwenden wir spezielle Sicherheitsmaßnahmen."
      },
      {
        question: "Bleibt das Dach bewohnbar während der Installation?",
        answer: "Ja, wir arbeiten so, dass das Dach jederzeit begehbar bleibt. Bei Bedarf installieren wir temporäre Abdeckungen."
      },
      {
        question: "Was passiert bei Beschädigungen am Dach?",
        answer: "Wir reparieren alle durch die Installation entstandenen Schäden kostenfrei und übernehmen die Gewährleistung."
      },
      {
        question: "Wann kann die Anlage in Betrieb genommen werden?",
        answer: "Nach erfolgreicher Installation und Prüfung erfolgt die offizielle Inbetriebnahme durch den Netzbetreiber."
      }
    ]
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Photovoltaik Installation Dach",
    "description": "Professionelle Montage und Installation von Photovoltaik-Anlagen auf Dächern",
    "provider": {
      "@type": "Organization",
      "name": "ZOE Solar GmbH",
      "url": "https://www.zoe-solar.de"
    },
    "areaServed": "DE",
    "serviceType": "Solaranlagen Installation"
  };

  return (
    <>
      <CustomHelmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords} />
        <link rel="canonical" href="https://www.zoe-solar.de/photovoltaik-installation-dach" />
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </CustomHelmet>

      <Hero {...heroProps} />
      <ProblemSolution {...problemSolutionProps} />
      <Process {...processProps} />
      <Testimonials {...testimonialsProps} />
      <FAQ {...faqProps} />
      <ContactForm />
    </>
  );
};

export default PhotovoltaikInstallationDachPage;
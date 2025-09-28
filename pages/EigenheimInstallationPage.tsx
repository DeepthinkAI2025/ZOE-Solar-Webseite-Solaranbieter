import React from 'react';
import CustomHelmet from '../components/CustomHelmet';
import Hero from '../components/Hero';
import ProblemSolution from '../components/ProblemSolution';
import Process from '../components/Process';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import ContactForm from '../components/ContactForm';

const EigenheimInstallationPage: React.FC = () => {
  const pageTitle = "Solaranlage Eigenheim Installation - Komplette Montage für Ihr Zuhause";
  const pageDescription = "Solaranlage Eigenheim Installation: Vollständige Montage Ihrer Photovoltaik-Anlage zu Hause. Von der Planung bis Inbetriebnahme ✓ Festpreisgarantie ✓ Qualitätssicherung ✓ Jetzt starten!";
  const pageKeywords = "Solaranlage Eigenheim Installation, Photovoltaik Installation Haus, PV Anlage Montage, Solaranlage Einbau, Dachinstallation Solaranlage";

  const heroProps = {
    title: "Solaranlage Eigenheim Installation",
    subtitle: "Komplette Montage für Ihr Zuhause",
    description: "Von der ersten Planung bis zur finalen Inbetriebnahme - wir übernehmen die komplette Installation Ihrer Solaranlage für Ihr Eigenheim.",
    primaryButton: "Installationsanfrage",
    secondaryButton: "Kostenlose Beratung",
    backgroundImage: "/images/solaranlage-installation.jpg"
  };

  const problemSolutionProps = {
    problem: {
      title: "Komplexe Installation erfordert professionelle Expertise",
      description: "Die Installation einer Solaranlage ist technisch anspruchsvoll und erfordert Fachwissen in Elektrotechnik, Statik und Photovoltaik.",
      points: [
        "Hohe Sicherheitsanforderungen bei Dacharbeiten",
        "Komplexe Elektrik und Netzanschluss",
        "Wetterabhängige Montagebedingungen",
        "Notwendigkeit von Spezialwerkzeugen und Zertifizierungen"
      ]
    },
    solution: {
      title: "Komplettpaket für sorgenfreie Installation",
      description: "Wir bieten Ihnen ein Rundum-sorglos-Paket von der Planung über die Montage bis zur Inbetriebnahme Ihrer Solaranlage.",
      points: [
        "Festpreisgarantie ohne versteckte Kosten",
        "Koordination aller Gewerke (Elektrik, Dach, Netzbetreiber)",
        "Qualitätssicherung und Funktionsprüfung",
        "Schnelle Termine und zuverlässige Ausführung"
      ]
    }
  };

  const processProps = {
    title: "Ihr Weg zur fertigen Solaranlage",
    steps: [
      {
        title: "Beratung",
        description: "Persönliche Beratung und Angebotserstellung",
        icon: "💬"
      },
      {
        title: "Planung",
        description: "Detaillierte technische Planung und Genehmigungen",
        icon: "📋"
      },
      {
        title: "Vorbereitung",
        description: "Materialbeschaffung und Terminplanung",
        icon: "📦"
      },
      {
        title: "Installation",
        description: "Professionelle Montage durch zertifizierte Fachkräfte",
        icon: "🔧"
      },
      {
        title: "Anschluss",
        description: "Netzanschluss und Inbetriebnahme",
        icon: "⚡"
      },
      {
        title: "Übergabe",
        description: "Endabnahme und Einweisung",
        icon: "🎉"
      }
    ]
  };

  const testimonialsProps = {
    title: "Erfahrungen mit unserer Komplettinstallation",
    testimonials: [
      {
        name: "Familie Hoffmann",
        location: "Köln",
        rating: 5,
        text: "Von der Beratung bis zur Übergabe - alles aus einer Hand. Besonders die Koordination hat uns beeindruckt.",
        image: "/images/testimonial-7.jpg"
      },
      {
        name: "Herr Krause",
        location: "Berlin",
        rating: 5,
        text: "Die Installation war termingerecht und sauber. Die Monteure waren sehr professionell und haben alles erklärt.",
        image: "/images/testimonial-8.jpg"
      }
    ]
  };

  const faqProps = {
    title: "Häufige Fragen zur Solaranlage Eigenheim Installation",
    faqs: [
      {
        question: "Wie lange dauert die komplette Installation?",
        answer: "Von Auftrag bis Inbetriebnahme dauert es typischerweise 6-8 Wochen, abhängig von Planung und Verfügbarkeit."
      },
      {
        question: "Wer übernimmt die Koordination mit dem Netzbetreiber?",
        answer: "Wir übernehmen die komplette Kommunikation und Koordination mit dem Netzbetreiber für den Anschluss."
      },
      {
        question: "Was passiert bei unvorhergesehenen Problemen?",
        answer: "Wir haben langjährige Erfahrung und lösen unvorhergesehene Probleme schnell und unkompliziert."
      },
      {
        question: "Gibt es eine Gewährleistung auf die Installation?",
        answer: "Ja, wir geben 10 Jahre Garantie auf Material und Montage. Zusätzlich profitieren Sie von der Herstellergarantie."
      },
      {
        question: "Kann die Installation bei laufendem Betrieb erfolgen?",
        answer: "Ja, wir planen die Installation so, dass Ihr Haushalt weitestgehend normal weiterlaufen kann."
      }
    ]
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Solaranlage Eigenheim Installation",
    "description": "Komplette Installation von Photovoltaik-Anlagen für Eigenheime",
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
        <link rel="canonical" href="https://www.zoe-solar.de/solaranlage-eigenheim-installation" />
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

export default EigenheimInstallationPage;
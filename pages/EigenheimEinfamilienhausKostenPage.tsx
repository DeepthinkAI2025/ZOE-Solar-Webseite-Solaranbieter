import React from 'react';
import CustomHelmet from '../components/CustomHelmet';
import Hero from '../components/Hero';
import ProblemSolution from '../components/ProblemSolution';
import { Calculator } from '../components/Calculator';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import ContactForm from '../components/ContactForm';

const EigenheimEinfamilienhausKostenPage: React.FC = () => {
  const pageTitle = "Solaranlage Einfamilienhaus Kosten - Komplette Preise & Kalkulation 2024";
  const pageDescription = "Solaranlage Einfamilienhaus Kosten: Komplette Übersicht aller Preise für Photovoltaik-Anlagen auf Einfamilienhäusern. Kostenlose Beratung ✓ Qualitätsgarantie ✓ Jetzt anfragen!";
  const pageKeywords = "Solaranlage Einfamilienhaus Kosten, Photovoltaik Einfamilienhaus Preise, PV Anlage Haus Kosten, Solarstrom Einfamilienhaus, Dach-Photovoltaik Kosten";

  const heroProps = {
    title: "Solaranlage Einfamilienhaus Kosten",
    subtitle: "Komplette Preise für Photovoltaik-Anlagen auf Einfamilienhäusern",
    description: "Erfahren Sie alles über die Kosten einer Solaranlage für Ihr Einfamilienhaus. Von der Planung bis zur Installation - transparente Preise und Förderungen.",
    primaryButton: "Kostenlose Beratung",
    secondaryButton: "Preisrechner",
    backgroundImage: "/images/solaranlage-einfamilienhaus.jpg"
  };

  const problemSolutionProps = {
    problem: {
      title: "Hohe Energiekosten belasten Einfamilienhaus-Besitzer",
      description: "Steigende Strompreise machen eine Investition in eine Solaranlage für Ihr Einfamilienhaus besonders attraktiv. Doch die Kostenplanung ist komplex.",
      points: [
        "Stromkosten von 0,40-0,50€/kWh belasten den Haushalt",
        "Unklare Kosten für Solaranlagen auf Einfamilienhäusern",
        "Komplexe Förderlandschaft erschwert die Kalkulation",
        "Unsicherheit über Amortisationszeit und Rentabilität"
      ]
    },
    solution: {
      title: "Solaranlage Einfamilienhaus - Ihre Lösung für Energieunabhängigkeit",
      description: "Mit einer professionell geplanten Solaranlage auf Ihrem Einfamilienhaus senken Sie Ihre Stromkosten nachhaltig und profitieren von attraktiven Förderungen.",
      points: [
        "Kostentransparenz von Anfang an",
        "Professionelle Planung und Installation",
        "Optimale Fördernutzung für maximale Einsparungen",
        "Schnelle Amortisation durch Eigenverbrauch"
      ]
    }
  };

  const testimonialsProps = {
    title: "Erfahrungen unserer Kunden mit Solaranlagen auf Einfamilienhäusern",
    testimonials: [
      {
        name: "Familie Müller",
        location: "Hamburg",
        rating: 5,
        text: "Die Solaranlage auf unserem Einfamilienhaus hat sich bereits nach 6 Jahren amortisiert. Die Kosten waren transparent und die Beratung professionell.",
        image: "/images/testimonial-1.jpg"
      },
      {
        name: "Herr Schmidt",
        location: "Köln",
        rating: 5,
        text: "Sehr zufrieden mit der Preisgestaltung und der Qualität der Solaranlage. Die Kosten für unser Einfamilienhaus lagen im erwarteten Rahmen.",
        image: "/images/testimonial-2.jpg"
      }
    ]
  };

  const faqProps = {
    title: "Häufige Fragen zu Solaranlage Einfamilienhaus Kosten",
    faqs: [
      {
        question: "Wie viel kostet eine Solaranlage für ein Einfamilienhaus?",
        answer: "Die Kosten liegen typischerweise zwischen 15.000€ und 35.000€ für eine 5-10kWp Anlage. Der genaue Preis hängt von Dachgröße, Ausrichtung und gewünschter Ausstattung ab."
      },
      {
        question: "Welche Förderungen gibt es für Solaranlagen auf Einfamilienhäusern?",
        answer: "Aktuell gibt es die KfW-Förderung (bis zu 7.500€ Zuschuss), Einspeisevergütung und je nach Bundesland weitere lokale Förderungen."
      },
      {
        question: "Wie lange dauert die Amortisation einer Solaranlage?",
        answer: "Bei optimalen Bedingungen amortisiert sich eine Solaranlage auf einem Einfamilienhaus in 8-12 Jahren durch Eigenverbrauch und Einspeisevergütung."
      },
      {
        question: "Sind die Kosten für Planung und Installation im Preis enthalten?",
        answer: "Ja, unser Festpreis beinhaltet Planung, alle Materialien, Installation, Inbetriebnahme und eine 10-jährige Garantie."
      },
      {
        question: "Gibt es eine kostenlose Beratung vor Ort?",
        answer: "Ja, wir bieten eine kostenlose Vor-Ort-Beratung an, bei der wir Ihr Dach begutachten und ein individuelles Angebot erstellen."
      }
    ]
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Solaranlage Einfamilienhaus Kosten",
    "description": "Komplette Kostenübersicht für Solaranlagen auf Einfamilienhäusern mit transparenten Preisen und Förderungen",
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
        <link rel="canonical" href="https://www.zoe-solar.de/solaranlage-einfamilienhaus-kosten" />
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </CustomHelmet>

      <Hero {...heroProps} />
      <ProblemSolution {...problemSolutionProps} />
      <Calculator />
      <Testimonials {...testimonialsProps} />
      <FAQ {...faqProps} />
      <ContactForm />
    </>
  );
};

export default EigenheimEinfamilienhausKostenPage;
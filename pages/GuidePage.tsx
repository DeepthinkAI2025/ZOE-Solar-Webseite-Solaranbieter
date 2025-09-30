import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Page } from '../types';
import { SemanticMain, SemanticSection } from '../components/SemanticLayout';
import InteractiveGuide from '../components/InteractiveGuide';
import AnimatedSection from '../components/AnimatedSection';

interface GuidePageProps {
  setPage: (page: Page) => void;
}

const GuidePage: React.FC<GuidePageProps> = ({ setPage }) => {
  return (
    <SemanticMain className="w-full">
      <Helmet>
        <title>Interaktiver Solar-Leitfaden - Schritt-für-Schritt zur Solaranlage | ZOE Solar</title>
        <meta name="description" content="Unser interaktiver Leitfaden führt Sie Schritt für Schritt zur optimalen Solaranlage. Erfahren Sie alles über Planung, Installation und Förderungen." />
        <meta name="keywords" content="Solar Leitfaden, Photovoltaik Planung, Solaranlage Schritt-für-Schritt, Förderungen Solar, ZOE Solar Guide" />
        <meta property="og:title" content="Interaktiver Solar-Leitfaden - Schritt-für-Schritt zur Solaranlage" />
        <meta property="og:description" content="Unser interaktiver Leitfaden führt Sie Schritt für Schritt zur optimalen Solaranlage." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Interaktiver Solar-Leitfaden - Schritt-für-Schritt zur Solaranlage" />
        <meta name="twitter:description" content="Unser interaktiver Leitfaden führt Sie Schritt für Schritt zur optimalen Solaranlage." />
        <link rel="canonical" href="https://zoe-solar.de/leitfaden" />
      </Helmet>

      <SemanticSection aria-label="Interaktiver Leitfaden">
        <AnimatedSection>
          <InteractiveGuide />
        </AnimatedSection>
      </SemanticSection>
    </SemanticMain>
  );
};

export default GuidePage;
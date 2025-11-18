import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Page } from '../types';
import { SemanticMain, SemanticSection } from '../components/SemanticLayout';
import AgriPVBenefits from '../components/AgriPVBenefits';
import AnimatedSection from '../components/AnimatedSection';
import CustomerTypeToggle from '../components/CustomerTypeToggle';

interface AgriPVPageProps {
  setPage: (page: Page) => void;
}

const AgriPVPage: React.FC<AgriPVPageProps> = ({ setPage }) => {
  const [customerType, setCustomerType] = useState<'private' | 'business'>('business');

  return (
    <SemanticMain className="w-full">
      <Helmet>
        <title>AgriPV - Solaranlagen für Landwirtschaft | ZOE Solar</title>
        <meta name="description" content="AgriPV-Lösungen für Landwirte: Kombinieren Sie Landwirtschaft und Solarenergie. Höhere Erträge, bessere Bodenqualität und saubere Energie." />
        <meta name="keywords" content="AgriPV, Solaranlagen Landwirtschaft, Photovoltaik Agrar, Solar für Bauern, ZOE Solar AgriPV" />
        <meta property="og:title" content="AgriPV - Solaranlagen für Landwirtschaft" />
        <meta property="og:description" content="AgriPV-Lösungen für Landwirte: Kombinieren Sie Landwirtschaft und Solarenergie." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AgriPV - Solaranlagen für Landwirtschaft" />
        <meta name="twitter:description" content="AgriPV-Lösungen für Landwirte: Kombinieren Sie Landwirtschaft und Solarenergie." />
        <link rel="canonical" href="https://zoe-solar.de/agripv" />
      </Helmet>

      <SemanticSection aria-label="AgriPV Vorteile">
        <AnimatedSection>
          <AgriPVBenefits setPage={setPage} customerType={customerType} />
        </AnimatedSection>
      </SemanticSection>

      <CustomerTypeToggle customerType={customerType} setCustomerType={setCustomerType} />
    </SemanticMain>
  );
};

export default AgriPVPage;
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Page } from '../types';
import { SemanticMain, SemanticSection } from '../components/SemanticLayout';
import Technology from '../components/Technology';
import AnimatedSection from '../components/AnimatedSection';
import CustomerTypeToggle from '../components/CustomerTypeToggle';

interface TechnologyPageProps {
  setPage: (page: Page) => void;
}

const TechnologyPage: React.FC<TechnologyPageProps> = ({ setPage }) => {
  const [customerType, setCustomerType] = useState<'private' | 'business'>('business');

  return (
    <SemanticMain className="w-full">
      <Helmet>
        <title>Technologie & Innovationen - Moderne Solartechnik | ZOE Solar</title>
        <meta name="description" content="Entdecken Sie die neuesten Technologien in der Solarenergie. Von Hochleistungsmodulen bis zu intelligenten Energiespeichern - ZOE Solar setzt auf Innovation." />
        <meta name="keywords" content="Solartechnologie, Photovoltaik Innovationen, Energiespeicher, Solarmodule, ZOE Solar Technologie" />
        <meta property="og:title" content="Technologie & Innovationen - Moderne Solartechnik" />
        <meta property="og:description" content="Entdecken Sie die neuesten Technologien in der Solarenergie. Von Hochleistungsmodulen bis zu intelligenten Energiespeichern." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Technologie & Innovationen - Moderne Solartechnik" />
        <meta name="twitter:description" content="Entdecken Sie die neuesten Technologien in der Solarenergie." />
        <link rel="canonical" href="https://zoe-solar.de/technologie" />
      </Helmet>

      <SemanticSection aria-label="Technologie und Innovationen">
        <AnimatedSection>
          <Technology customerType={customerType} />
        </AnimatedSection>
      </SemanticSection>

      <CustomerTypeToggle customerType={customerType} setCustomerType={setCustomerType} />
    </SemanticMain>
  );
};

export default TechnologyPage;
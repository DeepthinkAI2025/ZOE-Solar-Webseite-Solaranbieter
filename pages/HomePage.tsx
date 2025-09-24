import React from 'react';
import { Page } from '../types';

import { Calculator } from '../components/Calculator';
import { CO2Calculator } from '../components/CO2Calculator';
import Hero from '../components/Hero';
import InnovationsSlider from '../components/InnovationsSlider';
import InteractiveGuide from '../components/InteractiveGuide';
import PainPoints from '../components/PainPoints';
import ProductsPreview from '../components/ProductsPreview';
import ProjectGallery from '../components/ProjectGallery';
import Solutions from '../components/Solutions';
import Technology from '../components/Technology';
import Testimonials from '../components/Testimonials';
import UseCases from '../components/UseCases';
import ServiceWizard from '../components/ServiceWizard';
import PricingSection from '../components/PricingSection';
import FAQ from '../components/FAQ';
import VideoSection from '../components/VideoSection';
import AgriPVBenefits from '../components/AgriPVBenefits';
import ZeroDownPayment from '../components/ZeroDownPayment';
import AnimatedSection from '../components/AnimatedSection';

interface HomePageProps {
  setPage: (page: Page) => void;
  onSelectAnwendungsfall: (slug: string) => void;
  onSelectHersteller: (slug: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setPage, onSelectAnwendungsfall, onSelectHersteller }) => {
  return (
    <div className="w-full">
      <Hero onSelectHersteller={onSelectHersteller} setPage={setPage} />
      {/* The UseCases component displays different industry solutions and requires a callback to handle navigation to the detail page. */}
      <AnimatedSection><UseCases setPage={setPage} onSelectAnwendungsfall={onSelectAnwendungsfall} /></AnimatedSection>
      <AnimatedSection><PricingSection setPage={setPage} /></AnimatedSection>
      <AnimatedSection><ZeroDownPayment setPage={setPage} /></AnimatedSection>
      {/* The PainPoints section uses position:sticky, which does not work inside a container with a `transform`.
          Therefore, we remove the AnimatedSection wrapper from this component to ensure the stacking effect works correctly. */}
      <PainPoints />
      <AnimatedSection><AgriPVBenefits setPage={setPage} /></AnimatedSection>
      {/* Proof First Section: Build trust immediately after presenting the problem */}
      <AnimatedSection><Technology /></AnimatedSection>
      <AnimatedSection><ProjectGallery setPage={setPage} /></AnimatedSection>
      <AnimatedSection><Testimonials /></AnimatedSection>
      {/* Solution & Process Section: Explain the "how" after establishing credibility */}
      <AnimatedSection><Solutions /></AnimatedSection>
      <AnimatedSection><InteractiveGuide /></AnimatedSection>
      {/* ROI and Deeper Dive */}
      <AnimatedSection><Calculator /></AnimatedSection>
      <AnimatedSection><CO2Calculator /></AnimatedSection>
      <AnimatedSection><InnovationsSlider /></AnimatedSection>
      <AnimatedSection><VideoSection /></AnimatedSection>
      <AnimatedSection><FAQ /></AnimatedSection>
      <AnimatedSection><ProductsPreview setPage={setPage} onSelectHersteller={onSelectHersteller} /></AnimatedSection>
      <AnimatedSection>
        <section id="service-finder" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16 max-w-4xl mx-auto">
                    <p className="font-bold text-green-600 uppercase tracking-wider">Lösungsfinder</p>
                    <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mt-2">Ihr Weg zur passenden Lösung.</h2>
                    <p className="text-lg text-slate-600 mt-4">
                        Starten Sie mit einer freien Anfrage an unsere KI oder wählen Sie direkt den passenden Servicebereich, um Ihre Anfrage zu präzisieren. Wir leiten Sie schnell und unkompliziert zum Ziel.
                    </p>
                </div>
                <ServiceWizard />
            </div>
        </section>
      </AnimatedSection>
    </div>
  );
};

export default HomePage;
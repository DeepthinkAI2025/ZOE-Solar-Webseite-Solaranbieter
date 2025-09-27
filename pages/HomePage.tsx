import React from 'react';
import { Page } from '../types';

import Hero from '../components/Hero';
import InteractiveGuide from '../components/InteractiveGuide';
import PainPoints from '../components/PainPoints';
import ProjectGallery from '../components/ProjectGallery';
import Solutions from '../components/Solutions';
import Technology from '../components/Technology';
import Testimonials from '../components/Testimonials';
import UseCases from '../components/UseCases';
import PricingSection from '../components/PricingSection';
import FAQ from '../components/FAQ';
import AgriPVBenefits from '../components/AgriPVBenefits';
import ZeroDownPayment from '../components/ZeroDownPayment';
import AnimatedSection from '../components/AnimatedSection';
import Process from '../components/Process';
import TrustSignals from '../components/TrustSignals';
import GuaranteeSection from '../components/GuaranteeSection';
import HighIntentCTA from '../components/HighIntentCTA';

interface HomePageProps {
  setPage: (page: Page) => void;
  onSelectAnwendungsfall: (slug: string) => void;
  onSelectHersteller: (slug: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setPage, onSelectAnwendungsfall, onSelectHersteller }) => {
  return (
    <div className="w-full">
      <Hero onSelectHersteller={onSelectHersteller} setPage={setPage} />
    <AnimatedSection><TrustSignals /></AnimatedSection>
    <AnimatedSection><Testimonials /></AnimatedSection>
    {/* The PainPoints section uses position:sticky, which does not work inside a container with a `transform`.
      Therefore, we remove the AnimatedSection wrapper from this component to ensure the stacking effect works correctly. */}
    <PainPoints />
    <AnimatedSection><Solutions /></AnimatedSection>
    {/* The UseCases component displays different industry solutions and requires a callback to handle navigation to the detail page. */}
    <AnimatedSection><UseCases setPage={setPage} onSelectAnwendungsfall={onSelectAnwendungsfall} /></AnimatedSection>
    <AnimatedSection><Process /></AnimatedSection>
    <AnimatedSection><ProjectGallery setPage={setPage} /></AnimatedSection>
    <AnimatedSection><ZeroDownPayment setPage={setPage} /></AnimatedSection>
    <AnimatedSection><PricingSection setPage={setPage} /></AnimatedSection>
    <AnimatedSection><GuaranteeSection setPage={setPage} /></AnimatedSection>
    <AnimatedSection><AgriPVBenefits setPage={setPage} /></AnimatedSection>
    <AnimatedSection><Technology /></AnimatedSection>
    <AnimatedSection><InteractiveGuide /></AnimatedSection>
    <AnimatedSection><HighIntentCTA setPage={setPage} /></AnimatedSection>
    <AnimatedSection><FAQ /></AnimatedSection>
    </div>
  );
};

export default HomePage;
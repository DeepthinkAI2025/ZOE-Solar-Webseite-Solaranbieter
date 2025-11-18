import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Page } from '../../types';

// Lazy loaded components for better performance
const Header = lazy(() => import('../Header'));
const Footer = lazy(() => import('../Footer'));
const AIChatFunnel = lazy(() => import('../AIChatFunnel'));
const PromoBanner = lazy(() => import('../PromoBanner'));
const CommandHub = lazy(() => import('../CommandHub'));
const OfferPopup = lazy(() => import('../OfferPopup'));
const ExitIntentPopup = lazy(() => import('../ExitIntentPopup'));
const CookieConsentBanner = lazy(() => import('../CookieConsentBanner'));
const ComparisonTray = lazy(() => import('../ComparisonTray'));
const ComparisonModal = lazy(() => import('../ComparisonModal'));
const SEOManager = lazy(() => import('../SEOManager'));
const AIMonitoringDashboard = lazy(() => import('../AIMonitoringDashboard'));

// Advanced AI Components
const PredictiveContentEngine = lazy(() => import('../PredictiveContentEngine'));
const EdgeComputingOptimizer = lazy(() => import('../EdgeComputingOptimizer'));
const MultilingualExpansionEngine = lazy(() => import('../MultilingualExpansionEngine'));

// Lazy loaded pages
const HomePage = lazy(() => import('../../pages/HomePage'));
const HomePageAMP = lazy(() => import('../../pages/HomePage.amp'));
const PhotovoltaikPage = lazy(() => import('../../pages/PhotovoltaikPage'));
const EMobilitaetPage = lazy(() => import('../../pages/EMobilitaetPage'));
const ElektroPage = lazy(() => import('../../pages/ElektroPage'));
const PreisePage = lazy(() => import('../../pages/PreisePage'));
const ProjektePage = lazy(() => import('../../pages/ProjektePage'));
const UeberUnsPage = lazy(() => import('../../pages/UeberUnsPage'));
const KontaktPage = lazy(() => import('../../pages/KontaktPage'));
const KarrierePage = lazy(() => import('../../pages/KarrierePage'));
const ServicePhotovoltaikPage = lazy(() => import('../../pages/ServicePhotovoltaikPage'));
const ServiceLadeparksPage = lazy(() => import('../../pages/ServiceLadeparksPage'));
const ServiceSpeicherPage = lazy(() => import('../../pages/ServiceSpeicherPage'));
const ServiceAnmeldungPVPage = lazy(() => import('../../pages/ServiceAnmeldungPVPage'));
const ServiceAnmeldungLadestationenPage = lazy(() => import('../../pages/ServiceAnmeldungLadestationenPage'));
const ServiceNetzanschlussPage = lazy(() => import('../../pages/ServiceNetzanschlussPage'));
const ServiceVerteilerbauPage = lazy(() => import('../../pages/ServiceVerteilerbauPage'));
const ServiceZaehlerbauPage = lazy(() => import('../../pages/ServiceZaehlerbauPage'));
const StandortDynamicPage = lazy(() => import('../../pages/StandortDynamicPage'));
const EigenheimPage = lazy(() => import('../../pages/EigenheimPage'));
const EigenheimKostenPage = lazy(() => import('../../pages/EigenheimKostenPage'));
const EigenheimEinfamilienhausKostenPage = lazy(() => import('../../pages/EigenheimEinfamilienhausKostenPage'));
const EigenheimPlanungPage = lazy(() => import('../../pages/EigenheimPlanungPage'));
const PhotovoltaikInstallationDachPage = lazy(() => import('../../pages/PhotovoltaikInstallationDachPage'));
const EigenheimInstallationPage = lazy(() => import('../../pages/EigenheimInstallationPage'));
const CaseStudyPage = lazy(() => import('../../pages/CaseStudyPage'));
const FallstudienPage = lazy(() => import('../../pages/FallstudienPage'));
const AgriPVErfahrungenPage = lazy(() => import('../../pages/AgriPVErfahrungenPage'));
const AgriPVBrandenburgPage = lazy(() => import('../../pages/AgriPVBrandenburgPage'));
const AgriPVSachsenAnhaltPage = lazy(() => import('../../pages/AgriPVSachsenAnhaltPage'));
const AgriPVNiedersachsenPage = lazy(() => import('../../pages/AgriPVNiedersachsenPage'));
const AgriPVBayernPage = lazy(() => import('../../pages/AgriPVBayernPage'));
const AgriPVNordrheinWestfalenPage = lazy(() => import('../../pages/AgriPVNordrheinWestfalenPage'));
const LeistungenPage = lazy(() => import('../../pages/LeistungenPage'));
const SEOMonitoringPage = lazy(() => import('../../pages/SEOMonitoringPage'));
const UnifiedStrategyDashboardPage = lazy(() => import('../../pages/UnifiedStrategyDashboardPage'));
const LoginPage = lazy(() => import('../../pages/LoginPage'));
const EmpfehlungspraemiePage = lazy(() => import('../../pages/EmpfehlungspraemiePage'));
const InnovationsPage = lazy(() => import('../../pages/InnovationsPage'));
const FinanzierungPage = lazy(() => import('../../pages/FinanzierungPage'));
const SonderaktionenPage = lazy(() => import('../../pages/SonderaktionenPage'));
const FAQPage = lazy(() => import('../../pages/FAQPage'));
const TechnologyPage = lazy(() => import('../../pages/TechnologyPage'));
const GuidePage = lazy(() => import('../../pages/GuidePage'));
const PartnerWerdenPage = lazy(() => import('../../pages/PartnerWerdenPage'));
const ImpressumPage = lazy(() => import('../../pages/ImpressumPage'));
const DatenschutzPage = lazy(() => import('../../pages/DatenschutzPage'));
const AGBPage = lazy(() => import('../../pages/AGBPage'));
const NachhaltigkeitPage = lazy(() => import('../../pages/NachhaltigkeitPage'));
const PressePage = lazy(() => import('../../pages/PressePage'));
const WartungServicePage = lazy(() => import('../../pages/WartungServicePage'));
const GarantieabwicklungPage = lazy(() => import('../../pages/GarantieabwicklungPage'));
const FoerdermittelCheckPage = lazy(() => import('../../pages/FoerdermittelCheckPage'));
const AgriPVPage = lazy(() => import('../../pages/AgriPVPage'));
const TeamPage = lazy(() => import('../../pages/TeamPage'));
const WarumZoeSolarPage = lazy(() => import('../../pages/WarumZoeSolarPage'));
const FoerdermittelKFWPage = lazy(() => import('../../pages/FoerdermittelKFWPage'));
const FoerdermittelIBBPage = lazy(() => import('../../pages/FoerdermittelIBBPage'));
const FoerdermittelBAFAPage = lazy(() => import('../../pages/FoerdermittelBAFAPage'));
const PhotovoltaikIndustriePage = lazy(() => import('../../pages/PhotovoltaikIndustriePage'));
const PhotovoltaikLandwirtschaftPage = lazy(() => import('../../pages/PhotovoltaikLandwirtschaftPage'));
const PhotovoltaikGewerbegebaeudePage = lazy(() => import('../../pages/PhotovoltaikGewerbegebaeudePage'));
const PhotovoltaikLogistikzentrenPage = lazy(() => import('../../pages/PhotovoltaikLogistikzentrenPage'));
const PhotovoltaikEinzelhandelPage = lazy(() => import('../../pages/PhotovoltaikEinzelhandelPage'));
const PhotovoltaikRechnerGewerbePage = lazy(() => import('../../pages/PhotovoltaikRechnerGewerbePage'));
const MitarbeiterLoginPage = lazy(() => import('../../pages/MitarbeiterLoginPage'));
const AktuellesPage = lazy(() => import('../../pages/AktuellesPage'));
const ArticleDetailPage = lazy(() => import('../../pages/ArticleDetailPage'));
const WissensHubPage = lazy(() => import('../../pages/WissensHubPage'));
const MagazinPage = lazy(() => import('../../pages/MagazinPage'));
const GlossarPage = lazy(() => import('../../pages/GlossarPage'));
const GuideDetailPage = lazy(() => import('../../pages/GuideDetailPage'));
const DashboardPage = lazy(() => import('../../pages/DashboardPage'));
const DIYHubPage = lazy(() => import('../../pages/DIYHubPage'));
const ProduktePageLazy = lazy(() => import('../../pages/ProduktePage'));
const HerstellerDetailPageLazy = lazy(() => import('../../pages/HerstellerDetailPage'));
const AnwendungsfaellePageLazy = lazy(() => import('../../pages/AnwendungsfaellePage'));
const AnwendungsfallDetailPageLazy = lazy(() => import('../../pages/AnwendungsfallDetailPage'));

// Interfaces for router props
export interface RouterProps {
  currentPage?: Page;
  setPage?: (page: Page, options?: { scrollToTop?: boolean; anchor?: string }) => void;
  bannerHeight?: number;
  headerHeight?: number;
  isLoggedIn?: boolean;
  user?: any;
  selectedArticle?: any;
  setSelectedArticle?: (article: any) => void;
  selectedGuide?: any;
  setSelectedGuide?: (guide: any) => void;
  selectedManufacturer?: any;
  setSelectedManufacturer?: (manufacturer: any) => void;
  selectedUseCase?: any;
  setSelectedUseCase?: (useCase: any) => void;
  comparisonList?: any[];
  onToggleCompare?: (product: any) => void;
  onSelectAnwendungsfall?: (slug: string) => void;
  onSelectHersteller?: (slug: string) => void;
  onSelectWissen?: (wissenKey: string) => void;
  onLogout?: () => void;
  onLogin?: (userData: any) => void;
  onBack?: () => void;
  openCommandHub?: () => void;
  theme?: 'day' | 'night' | 'seasonal';
  onToggleTheme?: () => void;
  userPreferences?: any;
  voiceInterfaceActive?: boolean;
  arMode?: boolean;
  gestureControl?: boolean;
}

// Loading fallback component
const LoadingFallback: React.FC<{ message?: string }> = ({ message = 'Laden...' }) => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
      <p className="text-slate-600">{message}</p>
    </div>
  </div>
);

// Main Router Component
export const AppRouter: React.FC<RouterProps> = (props) => {
  const setPage = (props.setPage ?? (() => {})) as NonNullable<RouterProps['setPage']>;
  const onSelectAnwendungsfall = props.onSelectAnwendungsfall ?? (() => {});
  const onSelectHersteller = props.onSelectHersteller ?? (() => {});
  const onToggleCompare = props.onToggleCompare ?? (() => {});
  const onSelectWissen = props.onSelectWissen ?? (() => {});
  const onBack = props.onBack ?? (() => {});
  const onLoginHandler = props.onLogin ?? (() => {});
  const bannerHeight = props.bannerHeight ?? 0;
  const headerHeight = props.headerHeight ?? 0;
  const currentPage = (props.currentPage ?? 'home') as Page;
  const comparisonList = props.comparisonList ?? [];
  const isLoggedIn = props.isLoggedIn ?? false;

  const handleArticleSelect = (slug: string) => {
    document.dispatchEvent(new CustomEvent('select-article', { detail: slug }));
  };

  const handleGuideSelect = (slug: string) => {
    document.dispatchEvent(new CustomEvent('select-guide', { detail: slug }));
  };

  const handleLogin = (email: string) => {
    onLoginHandler({ id: email, name: email, email });
  };

  return (
    <>
      <Suspense fallback={<LoadingFallback message="Layout wird geladen..." />}>
        {/* SEO Schema Markup */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "ZOE Solar GmbH",
            "url": "https://zoe-solar.de",
            "logo": "https://zoe-solar.de/logo.png",
            "contactPoint": [{
              "@type": "ContactPoint",
              "telephone": "+49-30-1234567",
              "contactType": "customer service",
              "email": "info@zoe-solar.de"
            }]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "ZOE Solar Berlin",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Musterstraße 1",
              "addressLocality": "Berlin",
              "postalCode": "10115",
              "addressCountry": "DE"
            },
            "telephone": "+49-30-1234567",
            "openingHours": "Mo-Fr 09:00-18:00",
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "52.5200",
              "longitude": "13.4050"
            },
            "serviceArea": [
              {
                "@type": "Place",
                "name": "Berlin",
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": "52.5200",
                  "longitude": "13.4050"
                }
              },
              {
                "@type": "Place",
                "name": "Brandenburg",
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": "52.4125",
                  "longitude": "12.5316"
                }
              }
            ],
            "areaServed": [
              "Berlin",
              "Brandenburg",
              "Bayern"
            ]
          })}
        </script>

        <Routes>
          {/* Home Pages */}
          <Route path="/" element={
            <HomePage
              setPage={setPage}
              onSelectAnwendungsfall={onSelectAnwendungsfall}
              onSelectHersteller={onSelectHersteller}
            />
          } />

          {/* Main Service Pages */}
          <Route path="/leistungen" element={<LeistungenPage setPage={setPage} />} />
          <Route path="/photovoltaik" element={<PhotovoltaikPage setPage={setPage} />} />
          <Route path="/e-mobilitaet" element={<EMobilitaetPage setPage={setPage} />} />
          <Route path="/elektro" element={<ElektroPage setPage={setPage} />} />
          <Route path="/preise" element={<PreisePage isLoggedIn={isLoggedIn} />} />
          <Route path="/projekte" element={<ProjektePage setPage={setPage} />} />
          <Route path="/ueber-uns" element={<UeberUnsPage setPage={setPage} />} />
          <Route path="/kontakt" element={<KontaktPage setPage={setPage} />} />
          <Route path="/karriere" element={<KarrierePage setPage={setPage} />} />

          {/* Service Pages */}
          <Route path="/service/photovoltaik" element={
            <ServicePhotovoltaikPage
              setPage={setPage}
              currentPage={currentPage}
              bannerHeight={bannerHeight}
              headerHeight={headerHeight}
            />
          } />
          <Route path="/service/ladeparks" element={
            <ServiceLadeparksPage
              setPage={setPage}
              currentPage={currentPage}
              bannerHeight={bannerHeight}
              headerHeight={headerHeight}
            />
          } />
          <Route path="/service/speicher" element={
            <ServiceSpeicherPage
              setPage={setPage}
              currentPage={currentPage}
              bannerHeight={bannerHeight}
              headerHeight={headerHeight}
            />
          } />
          <Route path="/service/anmeldung-pv" element={
            <ServiceAnmeldungPVPage
              setPage={setPage}
              currentPage={currentPage}
              bannerHeight={bannerHeight}
              headerHeight={headerHeight}
            />
          } />
          <Route path="/service/anmeldung-ladestationen" element={
            <ServiceAnmeldungLadestationenPage
              setPage={setPage}
              currentPage={currentPage}
              bannerHeight={bannerHeight}
              headerHeight={headerHeight}
            />
          } />
          <Route path="/service/netzanschluss" element={
            <ServiceNetzanschlussPage
              setPage={setPage}
              currentPage={currentPage}
              bannerHeight={bannerHeight}
              headerHeight={headerHeight}
            />
          } />
          <Route path="/service/verteilerbau" element={
            <ServiceVerteilerbauPage
              setPage={setPage}
              currentPage={currentPage}
              bannerHeight={bannerHeight}
              headerHeight={headerHeight}
            />
          } />
          <Route path="/service/zaehlerbau" element={
            <ServiceZaehlerbauPage
              setPage={setPage}
              currentPage={currentPage}
              bannerHeight={bannerHeight}
              headerHeight={headerHeight}
            />
          } />

          {/* Dynamic Location Pages */}
          <Route path="/standort/:stadt" element={<StandortDynamicPage />} />

          {/* Residential Solar Pages */}
          <Route path="/eigenheim" element={<EigenheimPage />} />
          <Route path="/eigenheim/kosten" element={<EigenheimKostenPage />} />
          <Route path="/eigenheim/einfamilienhaus-kosten" element={<EigenheimEinfamilienhausKostenPage />} />
          <Route path="/eigenheim/planung" element={<EigenheimPlanungPage />} />
          <Route path="/photovoltaik/installation-dach" element={<PhotovoltaikInstallationDachPage />} />
          <Route path="/eigenheim/installation" element={<EigenheimInstallationPage />} />

          {/* Case Studies */}
          <Route path="/fallstudien/:slug" element={<CaseStudyPage />} />
          <Route path="/fallstudien" element={<FallstudienPage />} />

          {/* Agri-PV Pages */}
          <Route path="/agri-pv-erfahrungen" element={<AgriPVErfahrungenPage />} />
          <Route path="/agri-pv/brandenburg" element={<AgriPVBrandenburgPage />} />
          <Route path="/agri-pv/sachsen-anhalt" element={<AgriPVSachsenAnhaltPage />} />
          <Route path="/agri-pv/niedersachsen" element={<AgriPVNiedersachsenPage />} />
          <Route path="/agri-pv/bayern" element={<AgriPVBayernPage />} />
          <Route path="/agri-pv/nordrhein-westfalen" element={<AgriPVNordrheinWestfalenPage />} />
          <Route path="/agri-pv" element={<AgriPVPage setPage={setPage} />} />

          {/* Commercial Solar Pages */}
          <Route path="/photovoltaik/industrie" element={<PhotovoltaikIndustriePage />} />
          <Route path="/photovoltaik/landwirtschaft" element={<PhotovoltaikLandwirtschaftPage />} />
          <Route path="/photovoltaik/gewerbegebaeude" element={<PhotovoltaikGewerbegebaeudePage />} />
          <Route path="/photovoltaik/logistikzentren" element={<PhotovoltaikLogistikzentrenPage />} />
          <Route path="/photovoltaik/einzelhandel" element={<PhotovoltaikEinzelhandelPage />} />
          <Route path="/photovoltaik/rechner-gewerbe" element={<PhotovoltaikRechnerGewerbePage setPage={setPage} />} />

          {/* Company Pages */}
          <Route path="/team" element={<TeamPage setPage={setPage} />} />
          <Route path="/warum-zoe-solar" element={<WarumZoeSolarPage />} />
          <Route path="/nachhaltigkeit" element={<NachhaltigkeitPage />} />
          <Route path="/presse" element={<PressePage />} />
          <Route path="/partner-werden" element={<PartnerWerdenPage />} />

          {/* Financial Pages */}
          <Route path="/finanzierung" element={<FinanzierungPage setPage={setPage} />} />
          <Route path="/sonderaktionen" element={<SonderaktionenPage />} />
          <Route path="/empfehlungspraemie" element={<EmpfehlungspraemiePage />} />

          {/* Funding Pages */}
          <Route path="/foerdermittel-check" element={<FoerdermittelCheckPage />} />
          <Route path="/foerdermittel/kfw" element={
            <FoerdermittelKFWPage
              setPage={setPage}
              currentPage={currentPage}
              bannerHeight={bannerHeight}
              headerHeight={headerHeight}
            />
          } />
          <Route path="/foerdermittel/ibb" element={
            <FoerdermittelIBBPage
              setPage={setPage}
              currentPage={currentPage}
              bannerHeight={bannerHeight}
              headerHeight={headerHeight}
            />
          } />
          <Route path="/foerdermittel/bafa" element={
            <FoerdermittelBAFAPage
              setPage={setPage}
              currentPage={currentPage}
              bannerHeight={bannerHeight}
              headerHeight={headerHeight}
            />
          } />

          {/* Knowledge Base */}
          <Route path="/wissen/faq" element={<FAQPage setPage={setPage} />} />
          <Route path="/technologie" element={<TechnologyPage setPage={setPage} />} />
          <Route path="/leitfaden" element={<GuidePage setPage={setPage} />} />
          <Route path="/aktuelles" element={<AktuellesPage onSelectArticle={handleArticleSelect} />} />
          <Route path="/artikel/:slug" element={
            props.selectedArticle ? (
              <ArticleDetailPage article={props.selectedArticle} onBack={onBack} />
            ) : (
              <Navigate to="/aktuelles" replace />
            )
          } />
          <Route path="/wissens-hub" element={
            <WissensHubPage
              setPage={setPage}
              onSelectArticle={handleArticleSelect}
              onSelectGuide={handleGuideSelect}
            />
          } />
          <Route path="/magazin" element={<MagazinPage setPage={setPage} onSelectArticle={handleArticleSelect} />} />
          <Route path="/glossar" element={<GlossarPage />} />
          <Route path="/leitfaden/:slug" element={
            props.selectedGuide ? (
              <GuideDetailPage guide={props.selectedGuide} onBack={onBack} />
            ) : (
              <Navigate to="/leitfaden" replace />
            )
          } />

          {/* Product Pages */}
          <Route path="/produkte" element={
            <ProduktePageLazy
              onSelectHersteller={onSelectHersteller}
              comparisonList={comparisonList}
              onToggleCompare={onToggleCompare}
              bannerHeight={bannerHeight}
              headerHeight={headerHeight}
            />
          } />
          <Route path="/hersteller/:slug" element={
            props.selectedManufacturer ? (
              <HerstellerDetailPageLazy
                manufacturer={props.selectedManufacturer}
                comparisonList={comparisonList}
                onToggleCompare={onToggleCompare}
                onSelectHersteller={onSelectHersteller}
                bannerHeight={bannerHeight}
                headerHeight={headerHeight}
              />
            ) : (
              <Navigate to="/produkte" replace />
            )
          } />
          <Route path="/anwendungsfaelle" element={
            <AnwendungsfaellePageLazy
              onSelectAnwendungsfall={onSelectAnwendungsfall}
              bannerHeight={bannerHeight}
              headerHeight={headerHeight}
            />
          } />
          <Route path="/anwendungsfaelle/:slug" element={
            props.selectedUseCase ? (
              <AnwendungsfallDetailPageLazy
                useCase={props.selectedUseCase}
                onSelectAnwendungsfall={onSelectAnwendungsfall}
                bannerHeight={bannerHeight}
                headerHeight={headerHeight}
              />
            ) : (
              <Navigate to="/anwendungsfaelle" replace />
            )
          } />

          {/* User Account Pages */}
          <Route path="/login" element={<LoginPage onLogin={handleLogin} setPage={setPage} />} />
          <Route path="/dashboard" element={<DashboardPage user={props.user} />} />
          <Route path="/mitarbeiter-login" element={<MitarbeiterLoginPage />} />

          {/* Innovation & DIY */}
          <Route path="/innovationen" element={<InnovationsPage setPage={setPage} />} />
          <Route path="/diy-hub" element={<DIYHubPage />} />

          {/* Legal Pages */}
          <Route path="/impressum" element={<ImpressumPage />} />
          <Route path="/datenschutz" element={<DatenschutzPage />} />
          <Route path="/agb" element={<AGBPage />} />

          {/* Service Pages */}
          <Route path="/wartung-service" element={<WartungServicePage />} />
          <Route path="/garantieabwicklung" element={<GarantieabwicklungPage />} />

          {/* Admin Pages */}
          <Route path="/seo-monitoring" element={<SEOMonitoringPage />} />
          <Route path="/unified-strategy-dashboard" element={<UnifiedStrategyDashboardPage />} />
          <Route path="/admin/predictive-content" element={
            <Suspense fallback={<LoadingFallback message="Predictive Content Engine wird geladen..." />}>
              <PredictiveContentEngine />
            </Suspense>
          } />
          <Route path="/admin/edge-computing" element={
            <Suspense fallback={<LoadingFallback message="Edge Computing Optimizer wird geladen..." />}>
              <EdgeComputingOptimizer />
            </Suspense>
          } />
          <Route path="/admin/multilingual-expansion" element={
            <Suspense fallback={<LoadingFallback message="Multilingual Expansion Engine wird geladen..." />}>
              <MultilingualExpansionEngine />
            </Suspense>
          } />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      {/* Global Components */}
      <Suspense fallback={<div></div>}>
  <AIChatFunnel onOpen={() => {}} currentPage={currentPage} />
        <CookieConsentBanner />
      </Suspense>
    </>
  );
};

export default AppRouter;
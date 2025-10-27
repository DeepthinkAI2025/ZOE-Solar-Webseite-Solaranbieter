import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
const Header = lazy(() => import('./components/Header'));
const Footer = lazy(() => import('./components/Footer'));
const AIChatFunnel = lazy(() => import('./components/AIChatFunnel'));
const PromoBanner = lazy(() => import('./components/PromoBanner'));
const CommandHub = lazy(() => import('./components/CommandHub'));
const PageHero = lazy(() => import('./components/PageHero'));
const OfferPopup = lazy(() => import('./components/OfferPopup'));
const ExitIntentPopup = lazy(() => import('./components/ExitIntentPopup'));
const CookieConsentBanner = lazy(() => import('./components/CookieConsentBanner'));
const ComparisonTray = lazy(() => import('./components/ComparisonTray'));
const ComparisonModal = lazy(() => import('./components/ComparisonModal'));
const SEOManager = lazy(() => import('./components/SEOManager'));
const AIMonitoringDashboard = lazy(() => import('./components/AIMonitoringDashboard'));


const HomePage = lazy(() => import('./pages/HomePage'));
const HomePageAMP = lazy(() => import('./pages/HomePage.amp'));
const PhotovoltaikPage = lazy(() => import('./pages/PhotovoltaikPage'));
const EMobilitaetPage = lazy(() => import('./pages/EMobilitaetPage'));
const ElektroPage = lazy(() => import('./pages/ElektroPage'));
const PreisePage = lazy(() => import('./pages/PreisePage'));
const ProjektePage = lazy(() => import('./pages/ProjektePage'));
const UeberUnsPage = lazy(() => import('./pages/UeberUnsPage'));
const KontaktPage = lazy(() => import('./pages/KontaktPage'));
const KarrierePage = lazy(() => import('./pages/KarrierePage'));
const ServicePhotovoltaikPage = lazy(() => import('./pages/ServicePhotovoltaikPage'));
const ServiceLadeparksPage = lazy(() => import('./pages/ServiceLadeparksPage'));
const ServiceSpeicherPage = lazy(() => import('./pages/ServiceSpeicherPage'));
const ServiceAnmeldungPVPage = lazy(() => import('./pages/ServiceAnmeldungPVPage'));
const ServiceAnmeldungLadestationenPage = lazy(() => import('./pages/ServiceAnmeldungLadestationenPage'));
const ServiceNetzanschlussPage = lazy(() => import('./pages/ServiceNetzanschlussPage'));
const ServiceVerteilerbauPage = lazy(() => import('./pages/ServiceVerteilerbauPage'));
const ServiceZaehlerbauPage = lazy(() => import('./pages/ServiceZaehlerbauPage'));
const StandortDynamicPage = lazy(() => import('./pages/StandortDynamicPage'));
const EigenheimPage = lazy(() => import('./pages/EigenheimPage'));
const EigenheimKostenPage = lazy(() => import('./pages/EigenheimKostenPage'));
const EigenheimEinfamilienhausKostenPage = lazy(() => import('./pages/EigenheimEinfamilienhausKostenPage'));
const EigenheimPlanungPage = lazy(() => import('./pages/EigenheimPlanungPage'));
const PhotovoltaikInstallationDachPage = lazy(() => import('./pages/PhotovoltaikInstallationDachPage'));
const EigenheimInstallationPage = lazy(() => import('./pages/EigenheimInstallationPage'));
const CaseStudyPage = lazy(() => import('./pages/CaseStudyPage'));
const FallstudienPage = lazy(() => import('./pages/FallstudienPage'));
const AgriPVErfahrungenPage = lazy(() => import('./pages/AgriPVErfahrungenPage'));
const AgriPVBrandenburgPage = lazy(() => import('./pages/AgriPVBrandenburgPage'));
const AgriPVSachsenAnhaltPage = lazy(() => import('./pages/AgriPVSachsenAnhaltPage'));
const AgriPVNiedersachsenPage = lazy(() => import('./pages/AgriPVNiedersachsenPage'));
const AgriPVBayernPage = lazy(() => import('./pages/AgriPVBayernPage'));
const AgriPVNordrheinWestfalenPage = lazy(() => import('./pages/AgriPVNordrheinWestfalenPage'));
const SEOMonitoringPage = lazy(() => import('./pages/SEOMonitoringPage'));
const UnifiedStrategyDashboardPage = lazy(() => import('./pages/UnifiedStrategyDashboardPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const EmpfehlungspraemiePage = lazy(() => import('./pages/EmpfehlungspraemiePage'));
const InnovationsPage = lazy(() => import('./pages/InnovationsPage'));
const FinanzierungPage = lazy(() => import('./pages/FinanzierungPage'));
const SonderaktionenPage = lazy(() => import('./pages/SonderaktionenPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const TechnologyPage = lazy(() => import('./pages/TechnologyPage'));
const GuidePage = lazy(() => import('./pages/GuidePage'));
const PartnerWerdenPage = lazy(() => import('./pages/PartnerWerdenPage'));
const ImpressumPage = lazy(() => import('./pages/ImpressumPage'));
const DatenschutzPage = lazy(() => import('./pages/DatenschutzPage'));
const AGBPage = lazy(() => import('./pages/AGBPage'));
const NachhaltigkeitPage = lazy(() => import('./pages/NachhaltigkeitPage'));
const PressePage = lazy(() => import('./pages/PressePage'));
const WartungServicePage = lazy(() => import('./pages/WartungServicePage'));
const GarantieabwicklungPage = lazy(() => import('./pages/GarantieabwicklungPage'));
const FoerdermittelCheckPage = lazy(() => import('./pages/FoerdermittelCheckPage'));
const AgriPVPage = lazy(() => import('./pages/AgriPVPage'));
const TeamPage = lazy(() => import('./pages/TeamPage'));
const WarumZoeSolarPage = lazy(() => import('./pages/WarumZoeSolarPage'));
const FoerdermittelKFWPage = lazy(() => import('./pages/FoerdermittelKFWPage'));
const FoerdermittelIBBPage = lazy(() => import('./pages/FoerdermittelIBBPage'));
const FoerdermittelBAFAPage = lazy(() => import('./pages/FoerdermittelBAFAPage'));
const PhotovoltaikIndustriePage = lazy(() => import('./pages/PhotovoltaikIndustriePage'));
const PhotovoltaikLandwirtschaftPage = lazy(() => import('./pages/PhotovoltaikLandwirtschaftPage'));
const PhotovoltaikGewerbegebaeudePage = lazy(() => import('./pages/PhotovoltaikGewerbegebaeudePage'));
const PhotovoltaikLogistikzentrenPage = lazy(() => import('./pages/PhotovoltaikLogistikzentrenPage'));
const PhotovoltaikEinzelhandelPage = lazy(() => import('./pages/PhotovoltaikEinzelhandelPage'));
const PhotovoltaikRechnerGewerbePage = lazy(() => import('./pages/PhotovoltaikRechnerGewerbePage'));
const MitarbeiterLoginPage = lazy(() => import('./pages/MitarbeiterLoginPage'));

const AktuellesPage = lazy(() => import('./pages/AktuellesPage'));
const ArticleDetailPage = lazy(() => import('./pages/ArticleDetailPage'));
const WissensHubPage = lazy(() => import('./pages/WissensHubPage'));
const MagazinPage = lazy(() => import('./pages/MagazinPage'));
const GlossarPage = lazy(() => import('./pages/GlossarPage'));
const GuideDetailPage = lazy(() => import('./pages/GuideDetailPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const DIYHubPage = lazy(() => import('./pages/DIYHubPage'));
const ProduktePageLazy = lazy(() => import('./pages/ProduktePage'));
const HerstellerDetailPageLazy = lazy(() => import('./pages/HerstellerDetailPage'));
const AnwendungsfaellePageLazy = lazy(() => import('./pages/AnwendungsfaellePage'));
const AnwendungsfallDetailPageLazy = lazy(() => import('./pages/AnwendungsfallDetailPage'));

import { articles } from './data/articles';
import { productCatalog } from './data/products.generated';
import type { Product, Manufacturer } from './data/productTypes';
import { pageHeroData } from './data/pageContent';
import { useCasesData } from './data/useCases';
import { mockCustomer, mockDemoCustomer, CustomerData, CustomerProject } from './data/customerData';
import { guides } from './data/guidesData';
import { PricingPackage } from './data/pricingPackages';
import { Page } from './types';
import { derivePageFromPath, pageToPath } from './data/pageRoutes';
import { resolveSeoForPage, ResolvedSEO } from './data/seoConfig';
import { contentFreshnessManager } from './utils/ContentFreshnessManager';
import { internalLinkingOptimizer } from './utils/InternalLinkingOptimizer';
import { criticalCSSExtractor } from './utils/CriticalCSSExtractor';
import { userIntentClassifier } from './utils/UserIntentClassifier';
import { serpFeatureOptimizer } from './utils/SerpFeatureOptimizer';
import { seoMonitoringHub } from './utils/SEOMonitoringHub';
import { contentGapAnalyzer } from './utils/ContentGapAnalyzer';
import { seoOrchestrator } from './utils/SEOOrchestrator';

// ===== AI INTEGRATION IMPORTS =====
import { aiIntegrationService } from './services/aiIntegrationService.ts';
import { aiAPIIntegration } from './services/aiAPIIntegration.ts';
import { aiFirstContentOptimizationService } from './services/aiFirstContentOptimizationService.ts';
import { predictiveKeywordAnalysisService } from './services/predictiveKeywordAnalysisService.ts';
import { contentPerformancePredictionService } from './services/contentPerformancePredictionService.ts';
import { userBehaviorPatternAnalysisService } from './services/userBehaviorPatternAnalysisService.ts';
import { aiPlatformIntegrationService } from './services/aiPlatformIntegrationService.ts';
import { semanticAIUnderstandingService } from './services/semanticAIUnderstandingService.ts';
import { aiMonitoringAnalyticsService } from './services/aiMonitoringAnalyticsService.ts';
import { aiFutureProofingService } from './services/aiFutureProofingService.ts';

// ===== SEO SERVICES IMPORTS =====
import { automatedCoreWebVitalsOptimizationService } from './services/automatedCoreWebVitalsOptimizationService.ts';
import { advancedInternalLinkingService } from './services/advancedInternalLinkingService.ts';

// ===== AUTHORITY BUILDING SERVICES IMPORTS =====
import { brandAuthorityBuildingService } from './services/brandAuthorityBuildingService.ts';
import { enterpriseCitationManagementService } from './services/enterpriseCitationManagementService.ts';
import { enterpriseBrandAuthorityService } from './services/enterpriseBrandAuthorityService.ts';

const manufacturers: Manufacturer[] = productCatalog.manufacturers;

// ===== APP COMPONENT =====
const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Additional state for component props
  const [bannerHeight, setBannerHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [openCommandHub, setOpenCommandHub] = useState(() => () => {});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [comparisonList, setComparisonList] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [selectedUseCase, setSelectedUseCase] = useState(null);
  const [currentPage, setCurrentPage] = useState<Page>('home');

  // Initialize SEO Services on app start - verzögert
  useEffect(() => {
    // Services werden lazy initialisiert nach dem ersten Render
    const initServices = async () => {
      console.log('SEO Services initialized:', {
        coreWebVitals: automatedCoreWebVitalsOptimizationService.getOptimizationAnalytics(),
        internalLinking: advancedInternalLinkingService.getPerformanceMetrics(),
        brandAuthority: brandAuthorityBuildingService.calculateBrandAuthorityScore(),
        enterpriseCitations: enterpriseCitationManagementService.getDashboardOverview(),
        enterpriseBrand: enterpriseBrandAuthorityService.getBrandAuthorityAnalytics(30),
        aiMonitoring: aiMonitoringAnalyticsService.getMonitoringStats()
      });
    };

    // Verzögere die Initialisierung um 2 Sekunden
    const timer = setTimeout(initServices, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Event listeners: 'select-article' and 'select-guide' aus Komponenten/Navigationen
  useEffect(() => {
    const onSelectArticle = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail) return;
      const slug = String(detail);
      const article = articles.find(a => (a as any).slug === slug) || null;
      setSelectedArticle(article);
      // Berechne Pfad anhand des zentralen Mappings und ersetze :slug
      const path = pageToPath['article-detail'].replace(':slug', slug);
      navigate(path);
    };

    const onSelectGuide = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail) return;
      const slug = String(detail);
      const guide = guides.find(g => (g as any).slug === slug) || null;
      setSelectedGuide(guide);
      const path = pageToPath['guide-detail'].replace(':slug', slug);
      navigate(path);
    };

    document.addEventListener('select-article', onSelectArticle as EventListener);
    document.addEventListener('select-guide', onSelectGuide as EventListener);

    return () => {
      document.removeEventListener('select-article', onSelectArticle as EventListener);
      document.removeEventListener('select-guide', onSelectGuide as EventListener);
    };
  }, [navigate, articles, guides]);

  const handleSetPage = (page: Page) => {
    setCurrentPage(page);
    navigate(pageToPath[page]);
  };

  const handleSelectAnwendungsfall = (slug: string) => {
    navigate(`/anwendungsfaelle/${slug}`);
  };

  const handleSelectHersteller = (slug: string) => {
    navigate(`/hersteller/${slug}`);
  };

  const handleLogin = (userData: any) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setUser(null);
    navigate('/');
  }, [navigate]);

  const handleToggleCompare = (product: any) => {
    setComparisonList(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };
  const handleSelectWissen = (wissenKey: string) => {
    handleSetPage(wissenKey as Page);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        currentPage={currentPage}
        setPage={handleSetPage}
        openCommandHub={openCommandHub}
        bannerHeight={bannerHeight}
        isLoggedIn={isLoggedIn}
        onHeightChange={() => {}}
        onSelectHersteller={handleSelectHersteller}
        onSelectWissen={handleSelectWissen}
        onLogout={handleLogout}
        theme="day"
        onToggleTheme={() => {}}
      />
      <PromoBanner
        onHeightChange={setBannerHeight}
        setPage={handleSetPage}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        theme="day"
        onToggleTheme={() => {}}
      />
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
            },
            {
              "@type": "Place",
              "name": "Bayern",
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "48.7904",
                "longitude": "11.4979"
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
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": "Photovoltaik-Komplettpaket",
          "image": "https://zoe-solar.de/produkte/pv-komplettpaket.jpg",
          "description": "Effizientes Photovoltaik-Komplettpaket für Eigenheime und Gewerbe.",
          "brand": {
            "@type": "Brand",
            "name": "ZOE Solar"
          },
          "offers": {
            "@type": "Offer",
            "priceCurrency": "EUR",
            "price": "8999.00",
            "availability": "https://schema.org/InStock"
          }
        })}
      </script>
      <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><div className="loader"></div></div>}>
        <Routes>
          <Route path="/" element={<HomePage setPage={handleSetPage} onSelectAnwendungsfall={handleSelectAnwendungsfall} onSelectHersteller={handleSelectHersteller} />} />
          <Route path="/photovoltaik" element={<PhotovoltaikPage setPage={handleSetPage} />} />
          <Route path="/e-mobilitaet" element={<EMobilitaetPage setPage={handleSetPage} />} />
          <Route path="/elektro" element={<ElektroPage setPage={handleSetPage} />} />
          <Route path="/preise" element={<PreisePage isLoggedIn={isLoggedIn} />} />
          <Route path="/projekte" element={<ProjektePage setPage={handleSetPage} />} />
          <Route path="/ueber-uns" element={<UeberUnsPage setPage={handleSetPage} />} />
          <Route path="/kontakt" element={<KontaktPage setPage={handleSetPage} />} />
          <Route path="/karriere" element={<KarrierePage setPage={handleSetPage} />} />
          <Route path="/service/photovoltaik" element={<ServicePhotovoltaikPage setPage={handleSetPage} currentPage={currentPage} bannerHeight={bannerHeight} headerHeight={headerHeight} />} />
          <Route path="/service/ladeparks" element={<ServiceLadeparksPage setPage={handleSetPage} currentPage={currentPage} bannerHeight={bannerHeight} headerHeight={headerHeight} />} />
          <Route path="/service/speicher" element={<ServiceSpeicherPage setPage={handleSetPage} currentPage={currentPage} bannerHeight={bannerHeight} headerHeight={headerHeight} />} />
          <Route path="/service/anmeldung-pv" element={<ServiceAnmeldungPVPage setPage={handleSetPage} currentPage={currentPage} bannerHeight={bannerHeight} headerHeight={headerHeight} />} />
          <Route path="/service/anmeldung-ladestationen" element={<ServiceAnmeldungLadestationenPage setPage={handleSetPage} currentPage={currentPage} bannerHeight={bannerHeight} headerHeight={headerHeight} />} />
          <Route path="/service/netzanschluss" element={<ServiceNetzanschlussPage setPage={handleSetPage} currentPage={currentPage} bannerHeight={bannerHeight} headerHeight={headerHeight} />} />
          <Route path="/service/verteilerbau" element={<ServiceVerteilerbauPage setPage={handleSetPage} currentPage={currentPage} bannerHeight={bannerHeight} headerHeight={headerHeight} />} />
          <Route path="/service/zaehlerbau" element={<ServiceZaehlerbauPage setPage={handleSetPage} currentPage={currentPage} bannerHeight={bannerHeight} headerHeight={headerHeight} />} />
          <Route path="/standort/:stadt" element={<StandortDynamicPage />} />
          <Route path="/eigenheim" element={<EigenheimPage />} />
          <Route path="/eigenheim/kosten" element={<EigenheimKostenPage />} />
          <Route path="/eigenheim/einfamilienhaus-kosten" element={<EigenheimEinfamilienhausKostenPage />} />
          <Route path="/eigenheim/planung" element={<EigenheimPlanungPage />} />
          <Route path="/photovoltaik/installation-dach" element={<PhotovoltaikInstallationDachPage />} />
          <Route path="/eigenheim/installation" element={<EigenheimInstallationPage />} />
          <Route path="/fallstudien/:slug" element={<CaseStudyPage />} />
          <Route path="/fallstudien" element={<FallstudienPage />} />
          <Route path="/agri-pv-erfahrungen" element={<AgriPVErfahrungenPage />} />
          <Route path="/agri-pv/brandenburg" element={<AgriPVBrandenburgPage />} />
          <Route path="/agri-pv/sachsen-anhalt" element={<AgriPVSachsenAnhaltPage />} />
          <Route path="/agri-pv/niedersachsen" element={<AgriPVNiedersachsenPage />} />
          <Route path="/agri-pv/bayern" element={<AgriPVBayernPage />} />
          <Route path="/agri-pv/nordrhein-westfalen" element={<AgriPVNordrheinWestfalenPage />} />
          <Route path="/seo-monitoring" element={<SEOMonitoringPage />} />
          <Route path="/unified-strategy-dashboard" element={<UnifiedStrategyDashboardPage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} setPage={handleSetPage} />} />
          <Route path="/empfehlungspraemie" element={<EmpfehlungspraemiePage />} />
          <Route path="/innovationen" element={<InnovationsPage setPage={handleSetPage} />} />
          <Route path="/finanzierung" element={<FinanzierungPage setPage={handleSetPage} />} />
          <Route path="/sonderaktionen" element={<SonderaktionenPage />} />
          <Route path="/wissen/faq" element={<FAQPage setPage={handleSetPage} />} />
          <Route path="/technologie" element={<TechnologyPage setPage={handleSetPage} />} />
          <Route path="/leitfaden" element={<GuidePage setPage={handleSetPage} />} />
          <Route path="/partner-werden" element={<PartnerWerdenPage />} />
          <Route path="/impressum" element={<ImpressumPage />} />
          <Route path="/datenschutz" element={<DatenschutzPage />} />
          <Route path="/agb" element={<AGBPage />} />
          <Route path="/nachhaltigkeit" element={<NachhaltigkeitPage />} />
          <Route path="/presse" element={<PressePage />} />
          <Route path="/wartung-service" element={<WartungServicePage />} />
          <Route path="/garantieabwicklung" element={<GarantieabwicklungPage />} />
          <Route path="/foerdermittel-check" element={<FoerdermittelCheckPage />} />
          <Route path="/agri-pv" element={<AgriPVPage />} />
          <Route path="/team" element={<TeamPage setPage={handleSetPage} />} />
          <Route path="/warum-zoe-solar" element={<WarumZoeSolarPage />} />
          <Route path="/foerdermittel/kfw" element={<FoerdermittelKFWPage setPage={handleSetPage} currentPage={currentPage} bannerHeight={bannerHeight} headerHeight={headerHeight} />} />
          <Route path="/foerdermittel/ibb" element={<FoerdermittelIBBPage setPage={handleSetPage} currentPage={currentPage} bannerHeight={bannerHeight} headerHeight={headerHeight} />} />
          <Route path="/foerdermittel/bafa" element={<FoerdermittelBAFAPage setPage={handleSetPage} currentPage={currentPage} bannerHeight={bannerHeight} headerHeight={headerHeight} />} />
          {/* <Route path="/photovoltaik/gewerbe" element={<PhotovoltaikGewerbePage />} /> */}
          <Route path="/photovoltaik/industrie" element={<PhotovoltaikIndustriePage />} />
          <Route path="/photovoltaik/landwirtschaft" element={<PhotovoltaikLandwirtschaftPage />} />
          <Route path="/photovoltaik/gewerbegebaeude" element={<PhotovoltaikGewerbegebaeudePage />} />
          <Route path="/photovoltaik/logistikzentren" element={<PhotovoltaikLogistikzentrenPage />} />
          <Route path="/photovoltaik/einzelhandel" element={<PhotovoltaikEinzelhandelPage />} />
          <Route path="/photovoltaik/rechner-gewerbe" element={<PhotovoltaikRechnerGewerbePage setPage={handleSetPage} />} />
          <Route path="/mitarbeiter-login" element={<MitarbeiterLoginPage />} />
          <Route path="/aktuelles" element={<AktuellesPage onSelectArticle={setSelectedArticle} />} />
          <Route path="/artikel/:slug" element={<ArticleDetailPage article={selectedArticle} onBack={handleBack} />} />
          <Route path="/wissens-hub" element={<WissensHubPage setPage={handleSetPage} onSelectArticle={setSelectedArticle} onSelectGuide={setSelectedGuide} />} />
          <Route path="/magazin" element={<MagazinPage setPage={handleSetPage} onSelectArticle={setSelectedArticle} />} />
          <Route path="/glossar" element={<GlossarPage />} />
          <Route path="/leitfaden/:slug" element={<GuideDetailPage guide={selectedGuide} onBack={handleBack} />} />
          <Route path="/dashboard" element={<DashboardPage user={user} />} />
          <Route path="/diy-hub" element={<DIYHubPage />} />
          <Route path="/produkte" element={<ProduktePageLazy onSelectHersteller={handleSelectHersteller} comparisonList={comparisonList} onToggleCompare={handleToggleCompare} bannerHeight={bannerHeight} headerHeight={headerHeight} />} />
          <Route path="/hersteller/:slug" element={<HerstellerDetailPageLazy manufacturer={selectedManufacturer} comparisonList={comparisonList} onToggleCompare={handleToggleCompare} onSelectHersteller={handleSelectHersteller} bannerHeight={bannerHeight} headerHeight={headerHeight} />} />
          <Route path="/anwendungsfaelle" element={<AnwendungsfaellePageLazy onSelectAnwendungsfall={handleSelectAnwendungsfall} bannerHeight={bannerHeight} headerHeight={headerHeight} />} />
          <Route path="/anwendungsfaelle/:slug" element={<AnwendungsfallDetailPageLazy useCase={selectedUseCase} onSelectAnwendungsfall={handleSelectAnwendungsfall} bannerHeight={bannerHeight} headerHeight={headerHeight} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <AIChatFunnel onOpen={() => {}} currentPage={currentPage} />
      <CookieConsentBanner />
      <Footer setPage={handleSetPage} />
    </div>
  );
};

export default App;

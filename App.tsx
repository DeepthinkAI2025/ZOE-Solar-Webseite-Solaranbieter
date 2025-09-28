import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AIChatFunnel from './components/AIChatFunnel';
import PromoBanner from './components/PromoBanner';
import CommandHub from './components/CommandHub';
import PageHero from './components/PageHero';
import OfferPopup from './components/OfferPopup';
import ExitIntentPopup from './components/ExitIntentPopup';
import CookieConsentBanner from './components/CookieConsentBanner';
import ComparisonTray from './components/ComparisonTray';
import ComparisonModal from './components/ComparisonModal';
import SEOManager from './components/SEOManager';

// Import page components
import HomePage from './pages/HomePage';
import PhotovoltaikPage from './pages/PhotovoltaikPage';
import EMobilitaetPage from './pages/EMobilitaetPage';
import ElektroPage from './pages/ElektroPage';
import PreisePage from './pages/PreisePage';
import ProjektePage from './pages/ProjektePage';
import UeberUnsPage from './pages/UeberUnsPage';
import KontaktPage from './pages/KontaktPage';
import KarrierePage from './pages/KarrierePage';
import ServicePhotovoltaikPage from './pages/ServicePhotovoltaikPage';
import ServiceLadeparksPage from './pages/ServiceLadeparksPage';
import ServiceSpeicherPage from './pages/ServiceSpeicherPage';
import ServiceAnmeldungPVPage from './pages/ServiceAnmeldungPVPage';
import ServiceAnmeldungLadestationenPage from './pages/ServiceAnmeldungLadestationenPage';
import ServiceNetzanschlussPage from './pages/ServiceNetzanschlussPage';
import ServiceVerteilerbauPage from './pages/ServiceVerteilerbauPage';
import ServiceZaehlerbauPage from './pages/ServiceZaehlerbauPage';
import StandortDynamicPage from './pages/StandortDynamicPage';
import EigenheimPage from './pages/EigenheimPage';
import EigenheimKostenPage from './pages/EigenheimKostenPage';
import EigenheimEinfamilienhausKostenPage from './pages/EigenheimEinfamilienhausKostenPage';
import EigenheimPlanungPage from './pages/EigenheimPlanungPage';
import PhotovoltaikInstallationDachPage from './pages/PhotovoltaikInstallationDachPage';
import EigenheimInstallationPage from './pages/EigenheimInstallationPage';
import CaseStudyPage from './pages/CaseStudyPage';
import FallstudienPage from './pages/FallstudienPage';
import AgriPVErfahrungenPage from './pages/AgriPVErfahrungenPage';
import AgriPVBrandenburgPage from './pages/AgriPVBrandenburgPage';
import AgriPVSachsenAnhaltPage from './pages/AgriPVSachsenAnhaltPage';
import AgriPVNiedersachsenPage from './pages/AgriPVNiedersachsenPage';
import AgriPVBayernPage from './pages/AgriPVBayernPage';
import AgriPVNordrheinWestfalenPage from './pages/AgriPVNordrheinWestfalenPage';
import SEOMonitoringPage from './pages/SEOMonitoringPage';
import LoginPage from './pages/LoginPage';
import EmpfehlungspraemiePage from './pages/EmpfehlungspraemiePage';
import InnovationsPage from './pages/InnovationsPage';
import FinanzierungPage from './pages/FinanzierungPage';
import SonderaktionenPage from './pages/SonderaktionenPage';
import FAQPage from './pages/FAQPage';
import PartnerWerdenPage from './pages/PartnerWerdenPage';
import ImpressumPage from './pages/ImpressumPage';
import DatenschutzPage from './pages/DatenschutzPage';
import AGBPage from './pages/AGBPage';
import NachhaltigkeitPage from './pages/NachhaltigkeitPage';
import PressePage from './pages/PressePage';
import WartungServicePage from './pages/WartungServicePage';
import GarantieabwicklungPage from './pages/GarantieabwicklungPage';
import FoerdermittelCheckPage from './pages/FoerdermittelCheckPage';
import AgriPVPage from './pages/AgriPVPage';
import TeamPage from './pages/TeamPage';
import WarumZoeSolarPage from './pages/WarumZoeSolarPage';
import FoerdermittelKFWPage from './pages/FoerdermittelKFWPage';
import FoerdermittelIBBPage from './pages/FoerdermittelIBBPage';
import FoerdermittelBAFAPage from './pages/FoerdermittelBAFAPage';
import MitarbeiterLoginPage from './pages/MitarbeiterLoginPage';

const AktuellesPage = lazy(() => import('./pages/AktuellesPage'));
const ArticleDetailPage = lazy(() => import('./pages/ArticleDetailPage'));
const WissensHubPage = lazy(() => import('./pages/WissensHubPage'));
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
import { resolveSeoForPage } from './data/seoConfig';

const manufacturers: Manufacturer[] = productCatalog.manufacturers;

const scrollToAnchor = (anchor: string) => {
  window.requestAnimationFrame(() => {
    document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
  });
};

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isCommandHubOpen, setIsCommandHubOpen] = useState(false);
  const [bannerHeight, setBannerHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<CustomerData | null>(null);
  const [hasChatBeenOpened, setHasChatBeenOpened] = useState(false);
  const [dashboardMessage, setDashboardMessage] = useState<string | null>(null);
  const [comparisonList, setComparisonList] = useState<Product[]>([]);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [comparisonMessage, setComparisonMessage] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  const currentPage = useMemo(() => derivePageFromPath(location.pathname), [location.pathname]);
  const pageProps = useMemo(() => ({ bannerHeight, headerHeight }), [bannerHeight, headerHeight]);
  const pathSegments = useMemo(() => location.pathname.split('/').filter(Boolean), [location.pathname]);

  const activeArticle = useMemo(() => {
    if (currentPage !== 'article-detail') return undefined;
    const slug = pathSegments[pathSegments.length - 1];
    if (!slug || slug === 'aktuelles') return undefined;
    return articles.find((a) => a.slug === slug);
  }, [currentPage, pathSegments]);

  const activeGuide = useMemo(() => {
    if (currentPage !== 'guide-detail') return undefined;
    const slug = pathSegments[pathSegments.length - 1];
    if (!slug || slug === 'guide') return undefined;
    return guides.find((g) => g.slug === slug);
  }, [currentPage, pathSegments]);

  const activeManufacturer = useMemo(() => {
    if (currentPage !== 'hersteller-detail') return undefined;
    const slug = pathSegments[pathSegments.length - 1];
    if (!slug || slug === 'produkte') return undefined;
    return manufacturers.find((m) => m.slug === slug);
  }, [currentPage, pathSegments]);

  const activeUseCase = useMemo(() => {
    if (currentPage !== 'anwendungsfall-detail') return undefined;
    const slug = pathSegments[pathSegments.length - 1];
    if (!slug || slug === 'anwendungsfaelle') return undefined;
    return useCasesData.find((uc) => uc.id === slug);
  }, [currentPage, pathSegments]);

  const seoMetadata = useMemo(
    () =>
      resolveSeoForPage({
        page: currentPage,
        pathname: `${location.pathname}${location.search}`,
        article: activeArticle,
        guide: activeGuide,
        manufacturer: activeManufacturer,
        useCase: activeUseCase,
      }),
    [currentPage, location.pathname, location.search, activeArticle, activeGuide, activeManufacturer, activeUseCase]
  );

  const handleSetPage = useCallback(
    (page: Page, options?: { scrollToTop?: boolean; anchor?: string }) => {
      const targetPath = pageToPath[page] ?? '/';

      if (page === 'dashboard' && !isLoggedIn) {
        navigate('/login');
        return;
      }

      if (page === 'login' && isLoggedIn) {
        navigate('/dashboard');
        return;
      }

      const shouldScroll = options?.scrollToTop !== false;

      if (location.pathname === targetPath) {
        if (shouldScroll) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        if (options?.anchor) {
          scrollToAnchor(options.anchor);
        }
        return;
      }

      setIsExiting(true);
      setTimeout(() => {
        navigate(targetPath);
        setIsExiting(false);

        if (shouldScroll) {
          window.scrollTo({ top: 0 });
        }

        if (options?.anchor) {
          setTimeout(() => scrollToAnchor(options.anchor!), 100);
        }
      }, 300);
    },
    [isLoggedIn, location.pathname, navigate]
  );

  const handleToggleCompare = useCallback((product: Product) => {
    setComparisonList((prev) => {
      const isInList = prev.some((p) => p.name === product.name);

      if (isInList) {
        return prev.filter((p) => p.name !== product.name);
      }

      if (prev.length > 0 && prev[0].category !== product.category) {
        setComparisonMessage(`Sie können nur Produkte aus der Kategorie "${prev[0].category}" vergleichen.`);
        return prev;
      }

      if (prev.length >= 4) {
        setComparisonMessage('Sie können maximal 4 Produkte vergleichen.');
        return prev;
      }

      return [...prev, product];
    });
  }, []);

  const handleClearCompare = useCallback(() => {
    setComparisonList([]);
  }, []);

  const handleLogin = useCallback(
    (email: string) => {
      let success = false;

      if (email === 'kunde@test.de') {
        setCurrentUser(mockCustomer);
        success = true;
      } else if (email === 'demo') {
        setCurrentUser(mockDemoCustomer);
        success = true;
      }

      if (success) {
        setIsLoggedIn(true);
        handleSetPage('dashboard');
      } else {
        console.error('Login failed');
      }
    },
    [handleSetPage]
  );

  const handleAddPackageRequest = useCallback(
    (pkg: PricingPackage) => {
      if (!isLoggedIn || !currentUser) return;

      const newProject: CustomerProject = {
        id: `proj_${Date.now()}`,
        name: pkg.name,
        status: 'Anfrage',
        power: `${pkg.specs.modulesKwp} kWp`,
        startDate: new Date().toLocaleDateString('de-DE'),
        offers: [],
        invoices: [],
        history: [{ date: new Date().toLocaleDateString('de-DE'), event: 'Paket-Anfrage gestellt' }],
        messages: [
          {
            id: `msg_${Date.now()}`,
            date: new Date().toLocaleDateString('de-DE'),
            from: 'ZOE Solar',
            text: `Vielen Dank für Ihre Anfrage für das Paket "${pkg.name}". Wir prüfen die Details und melden uns in Kürze bei Ihnen, um einen Vor-Ort-Termin zu vereinbaren und ein verbindliches Angebot zu erstellen.`,
          },
        ],
      };

      setCurrentUser((prevUser) => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          projects: [newProject, ...prevUser.projects],
        };
      });

      setDashboardMessage(`Das Paket "${pkg.name}" wurde erfolgreich zu Ihrem Profil hinzugefügt.`);
      handleSetPage('dashboard');
    },
    [currentUser, handleSetPage, isLoggedIn]
  );

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    handleSetPage('home');
  }, [handleSetPage]);

  const handleSelectArticle = useCallback(
    (slug: string) => {
      navigate(`/aktuelles/${slug}`);
    },
    [navigate]
  );

  const handleSelectGuide = useCallback(
    (slug: string) => {
      navigate(`/wissen/guide/${slug}`);
    },
    [navigate]
  );

  const handleSelectHersteller = useCallback(
    (slug: string) => {
      navigate(`/produkte/${slug}`);
    },
    [navigate]
  );

  const handleSelectAnwendungsfall = useCallback(
    (slug: string) => {
      navigate(`/anwendungsfaelle/${slug}`);
    },
    [navigate]
  );

  const handleSelectWissen = useCallback(
    (slug: string) => {
      switch (slug) {
        case 'glossar':
          navigate('/wissen/glossar');
          break;
        case 'faq':
          navigate('/wissen/faq');
          break;
        case 'magazin':
          navigate('/aktuelles');
          break;
        default:
          navigate('/wissen');
          break;
      }
    },
    [navigate]
  );

  const handleHeroCta = useCallback(
    (page?: Page, action?: 'open-chat', anchor?: string) => {
      if (action === 'open-chat') {
        document.dispatchEvent(new CustomEvent('open-chat'));
      } else if (page) {
        handleSetPage(page, { anchor });
      }
    },
    [handleSetPage]
  );

  useEffect(() => {
    const handleArticleSelectEvent = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      if (customEvent.detail) {
        handleSelectArticle(customEvent.detail);
      }
    };

    const handleGuideSelectEvent = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      if (customEvent.detail) {
        handleSelectGuide(customEvent.detail);
      }
    };

    const handleHerstellerSelectEvent = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      if (customEvent.detail) {
        handleSelectHersteller(customEvent.detail);
      }
    };

    const handleSetPageEvent = (event: Event) => {
      const customEvent = event as CustomEvent<Page>;
      if (customEvent.detail) {
        handleSetPage(customEvent.detail);
      }
    };

    const handleAddPackageRequestEvent = (event: Event) => {
      const customEvent = event as CustomEvent<PricingPackage>;
      if (customEvent.detail) {
        handleAddPackageRequest(customEvent.detail);
      }
    };

    document.addEventListener('select-article', handleArticleSelectEvent);
    document.addEventListener('select-guide', handleGuideSelectEvent);
    document.addEventListener('select-hersteller', handleHerstellerSelectEvent);
    document.addEventListener('set-page', handleSetPageEvent);
    document.addEventListener('add-package-request', handleAddPackageRequestEvent);

    return () => {
      document.removeEventListener('select-article', handleArticleSelectEvent);
      document.removeEventListener('select-guide', handleGuideSelectEvent);
      document.removeEventListener('select-hersteller', handleHerstellerSelectEvent);
      document.removeEventListener('set-page', handleSetPageEvent);
      document.removeEventListener('add-package-request', handleAddPackageRequestEvent);
    };
  }, [handleAddPackageRequest, handleSelectArticle, handleSelectGuide, handleSelectHersteller, handleSetPage]);

  useEffect(() => {
    if (comparisonMessage) {
      const timer = setTimeout(() => setComparisonMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [comparisonMessage]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  useEffect(() => {
    if (hasChatBeenOpened) return;

    const handleScroll = () => {
      const footer = document.querySelector('footer');
      if (!footer) return;

      const rect = footer.getBoundingClientRect();
      if (rect.top <= window.innerHeight) {
        document.dispatchEvent(new CustomEvent('open-chat'));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasChatBeenOpened]);

  const ArticleDetailRoute: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const article = articles.find((a) => a.slug === slug);

    if (!slug || !article) {
      return <Navigate to="/aktuelles" replace />;
    }

    return <ArticleDetailPage article={article} onBack={() => navigate('/aktuelles')} />;
  };

  const GuideDetailRoute: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const guide = guides.find((g) => g.slug === slug);

    if (!slug || !guide) {
      return <Navigate to="/wissen" replace />;
    }

    return <GuideDetailPage guide={guide} onBack={() => navigate('/wissen')} />;
  };

  const HerstellerDetailRoute: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const manufacturer = manufacturers.find((m) => m.slug === slug);

    if (!slug || !manufacturer) {
      return <Navigate to="/produkte" replace />;
    }

    return (
      <HerstellerDetailPageLazy
        manufacturer={manufacturer}
        comparisonList={comparisonList}
        onToggleCompare={handleToggleCompare}
        onSelectHersteller={handleSelectHersteller}
        {...pageProps}
      />
    );
  };

  const AnwendungsfallDetailRoute: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const useCase = useCasesData.find((uc) => uc.id === slug);

    if (!slug || !useCase) {
      return <Navigate to="/anwendungsfaelle" replace />;
    }

    return (
      <AnwendungsfallDetailPageLazy
        useCase={useCase}
        onSelectAnwendungsfall={handleSelectAnwendungsfall}
        {...pageProps}
      />
    );
  };

  const DashboardRoute: React.FC = () => {
    if (!isLoggedIn || !currentUser) {
      return <Navigate to="/login" replace />;
    }

    return (
      <DashboardPage
        user={currentUser}
        message={dashboardMessage}
        clearMessage={() => setDashboardMessage(null)}
      />
    );
  };

  const heroData = pageHeroData[currentPage];
  const excludedPagesForHero: Page[] = [
    'home',
    'photovoltaik',
    'e-mobilitaet',
    'elektro',
    'preise',
    'projekte',
    'produkte',
    'ueber-uns',
    'karriere',
    'kontakt',
    'anwendungsfaelle',
    'sonderaktionen',
    'innovations',
    'agri-pv',
    'wissens-hub',
    'aktuelles',
    'empfehlungspraemie',
    'partner-werden',
    'diy-hub',
    'nachhaltigkeit',
    'glossar',
    'faq-page',
    'presse',
    'wartung-service',
    'garantieabwicklung',
    'foerdermittel-check',
    'article-detail',
    'guide-detail',
    'hersteller-detail',
    'anwendungsfall-detail',
    'login',
    'dashboard',
    'team',
    'warum-zoe-solar',
    'service-photovoltaik',
    'service-ladeparks',
    'service-speicher',
    'impressum',
    'datenschutz',
    'agb',
  ];

  const showPageHero = !excludedPagesForHero.includes(currentPage) && heroData;
  const isSubNavPage = [
    'service-photovoltaik',
    'service-ladeparks',
    'service-speicher',
    'hersteller-detail',
    'anwendungsfall-detail',
    'anwendungsfaelle',
    'produkte',
    'finanzierung',
    'foerdermittel-kfw',
    'foerdermittel-ibb',
    'foerdermittel-bafa',
    'service-anmeldung-pv',
    'service-anmeldung-ladestationen',
    'service-netzanschluss',
    'service-verteilerbau',
    'service-zaehlerbau',
  ].includes(currentPage);

  return (
    <div className="bg-white h-full flex flex-col">
      <SEOManager metadata={seoMetadata} />
      <PromoBanner onHeightChange={setBannerHeight} setPage={handleSetPage} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Header
        currentPage={currentPage}
        setPage={handleSetPage}
        openCommandHub={() => setIsCommandHubOpen(true)}
        bannerHeight={bannerHeight}
        onHeightChange={setHeaderHeight}
        onSelectHersteller={handleSelectHersteller}
        onSelectWissen={handleSelectWissen}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      <main
        id="main-content"
        className={`flex-grow ${isExiting ? 'page-transition-exit' : 'page-transition-enter'}`}
        style={{
          paddingTop: isSubNavPage ? '0px' : `${bannerHeight + headerHeight}px`,
          scrollMarginTop: `${bannerHeight + headerHeight}px`,
        }}
      >
        {showPageHero && heroData && <PageHero {...heroData} onCtaClick={handleHeroCta} />}

        <Suspense
          fallback={
            <div className="py-32 flex justify-center">
              <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" role="status" aria-label="Lade Produkte" />
            </div>
          }
        >
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  setPage={handleSetPage}
                  onSelectAnwendungsfall={handleSelectAnwendungsfall}
                  onSelectHersteller={handleSelectHersteller}
                />
              }
            />
            <Route path="/photovoltaik" element={<PhotovoltaikPage setPage={handleSetPage} />} />
            <Route path="/e-mobilitaet" element={<EMobilitaetPage setPage={handleSetPage} />} />
            <Route path="/elektro" element={<ElektroPage setPage={handleSetPage} />} />
            <Route path="/preise" element={<PreisePage isLoggedIn={isLoggedIn} />} />
            <Route path="/finanzierung" element={<FinanzierungPage setPage={handleSetPage} />} />
            <Route
              path="/foerdermittel/kfw"
              element={<FoerdermittelKFWPage setPage={handleSetPage} currentPage={currentPage} {...pageProps} />}
            />
            <Route
              path="/foerdermittel/ibb"
              element={<FoerdermittelIBBPage setPage={handleSetPage} currentPage={currentPage} {...pageProps} />}
            />
            <Route
              path="/foerdermittel/bafa"
              element={<FoerdermittelBAFAPage setPage={handleSetPage} currentPage={currentPage} {...pageProps} />}
            />
            <Route path="/sonderaktionen" element={<SonderaktionenPage />} />
            <Route path="/innovationen" element={<InnovationsPage setPage={handleSetPage} />} />
            <Route path="/projekte" element={<ProjektePage setPage={handleSetPage} />} />
            <Route
              path="/produkte"
              element={
                <ProduktePageLazy
                  onSelectHersteller={handleSelectHersteller}
                  comparisonList={comparisonList}
                  onToggleCompare={handleToggleCompare}
                  {...pageProps}
                />
              }
            />
            <Route path="/produkte/:slug" element={<HerstellerDetailRoute />} />
            <Route path="/ueber-uns" element={<UeberUnsPage setPage={handleSetPage} />} />
            <Route path="/team" element={<TeamPage setPage={handleSetPage} />} />
            <Route path="/warum-zoe-solar" element={<WarumZoeSolarPage />} />
            <Route path="/karriere" element={<KarrierePage setPage={handleSetPage} />} />
            <Route path="/partner-werden" element={<PartnerWerdenPage />} />
            <Route path="/empfehlungspraemie" element={<EmpfehlungspraemiePage />} />
            <Route path="/kontakt" element={<KontaktPage setPage={handleSetPage} />} />
            <Route path="/standort" element={<Navigate to="/standort/berlin" replace />} />
            <Route path="/standort/:city" element={<StandortDynamicPage />} />
            <Route path="/fallstudien" element={<FallstudienPage />} />
            <Route path="/fallstudie/:slug" element={<CaseStudyPage />} />
            <Route path="/agri-pv-erfahrungen" element={<AgriPVErfahrungenPage />} />
            <Route
              path="/service/photovoltaik"
              element={<ServicePhotovoltaikPage setPage={handleSetPage} currentPage={currentPage} {...pageProps} />}
            />
            <Route
              path="/service/anmeldung-pv"
              element={<ServiceAnmeldungPVPage setPage={handleSetPage} currentPage={currentPage} {...pageProps} />}
            />
            <Route path="/agri-pv" element={<AgriPVPage />} />
            <Route path="/agri-pv/brandenburg" element={<AgriPVBrandenburgPage />} />
            <Route path="/agri-pv/sachsen-anhalt" element={<AgriPVSachsenAnhaltPage />} />
            <Route path="/agri-pv/niedersachsen" element={<AgriPVNiedersachsenPage />} />
            <Route path="/agri-pv/bayern" element={<AgriPVBayernPage />} />
            <Route path="/agri-pv/nordrhein-westfalen" element={<AgriPVNordrheinWestfalenPage />} />
            <Route path="/eigenheim" element={<EigenheimPage />} />
            <Route path="/eigenheim-kosten" element={<EigenheimKostenPage />} />
            <Route path="/eigenheim-einfamilienhaus-kosten" element={<EigenheimEinfamilienhausKostenPage />} />
            <Route path="/eigenheim-planung" element={<EigenheimPlanungPage />} />
            <Route path="/photovoltaik-installation-dach" element={<PhotovoltaikInstallationDachPage />} />
            <Route path="/eigenheim-installation" element={<EigenheimInstallationPage />} />
            <Route path="/seo-monitoring" element={<SEOMonitoringPage />} />
            <Route
              path="/service/ladeparks"
              element={<ServiceLadeparksPage setPage={handleSetPage} currentPage={currentPage} {...pageProps} />}
            />
            <Route
              path="/service/anmeldung-ladestationen"
              element={<ServiceAnmeldungLadestationenPage setPage={handleSetPage} currentPage={currentPage} {...pageProps} />}
            />
            <Route
              path="/service/speicher"
              element={<ServiceSpeicherPage setPage={handleSetPage} currentPage={currentPage} {...pageProps} />}
            />
            <Route
              path="/service/netzanschluss"
              element={<ServiceNetzanschlussPage setPage={handleSetPage} currentPage={currentPage} {...pageProps} />}
            />
            <Route
              path="/service/verteilerbau"
              element={<ServiceVerteilerbauPage setPage={handleSetPage} currentPage={currentPage} {...pageProps} />}
            />
            <Route
              path="/service/zaehlerbau"
              element={<ServiceZaehlerbauPage setPage={handleSetPage} currentPage={currentPage} {...pageProps} />}
            />
            <Route path="/diy-hub" element={<DIYHubPage />} />
            <Route path="/wissen/diy" element={<DIYHubPage />} />
            <Route
              path="/anwendungsfaelle"
              element={<AnwendungsfaellePageLazy onSelectAnwendungsfall={handleSelectAnwendungsfall} {...pageProps} />}
            />
            <Route path="/anwendungsfaelle/:slug" element={<AnwendungsfallDetailRoute />} />
            <Route path="/aktuelles" element={<AktuellesPage onSelectArticle={handleSelectArticle} />} />
            <Route path="/aktuelles/:slug" element={<ArticleDetailRoute />} />
            <Route
              path="/wissen"
              element={
                <WissensHubPage
                  setPage={handleSetPage}
                  onSelectArticle={handleSelectArticle}
                  onSelectGuide={handleSelectGuide}
                />
              }
            />
            <Route path="/wissen/glossar" element={<GlossarPage />} />
            <Route path="/wissen/faq" element={<FAQPage />} />
            <Route path="/wissen/guide/:slug" element={<GuideDetailRoute />} />
            <Route path="/nachhaltigkeit" element={<NachhaltigkeitPage />} />
            <Route path="/presse" element={<PressePage />} />
            <Route path="/wartung-service" element={<WartungServicePage />} />
            <Route path="/garantieabwicklung" element={<GarantieabwicklungPage />} />
            <Route path="/foerdermittel/check" element={<FoerdermittelCheckPage />} />
            <Route path="/impressum" element={<ImpressumPage />} />
            <Route path="/datenschutz" element={<DatenschutzPage />} />
            <Route path="/agb" element={<AGBPage />} />
            <Route path="/mitarbeiter-login" element={<MitarbeiterLoginPage />} />
            <Route
              path="/login"
              element={
                isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} setPage={handleSetPage} />
              }
            />
            <Route path="/dashboard" element={<DashboardRoute />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer setPage={handleSetPage} />
      <AIChatFunnel onOpen={() => setHasChatBeenOpened(true)} currentPage={currentPage} />
      <CommandHub
        isOpen={isCommandHubOpen}
        onClose={() => setIsCommandHubOpen(false)}
        setPage={(page) => {
          handleSetPage(page);
          setIsCommandHubOpen(false);
        }}
      />
      <OfferPopup />
      <ExitIntentPopup setPage={handleSetPage} />
      <CookieConsentBanner />
      {comparisonMessage && (
        <div
          role="alert"
          className="fixed top-24 right-6 bg-red-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg z-[200] animate-fade-in"
        >
          {comparisonMessage}
        </div>
      )}
      <ComparisonTray
        items={comparisonList}
        onRemove={handleToggleCompare}
        onClear={handleClearCompare}
        onCompare={() => setIsComparisonModalOpen(true)}
      />
      {isComparisonModalOpen && (
        <ComparisonModal
          items={comparisonList}
          onClose={() => setIsComparisonModalOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
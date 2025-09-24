import React, { useState, useEffect } from 'react';
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
import AktuellesPage from './pages/AktuellesPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import ProduktePage from './pages/ProduktePage';
import HerstellerDetailPage from './pages/HerstellerDetailPage';
import AnwendungsfaellePage from './pages/AnwendungsfaellePage';
import AnwendungsfallDetailPage from './pages/AnwendungsfallDetailPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EmpfehlungspraemiePage from './pages/EmpfehlungspraemiePage';
import WissensHubPage from './pages/WissensHubPage';
import GlossarPage from './pages/GlossarPage';
import GuideDetailPage from './pages/GuideDetailPage';
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
import DIYHubPage from './pages/DIYHubPage';
import AgriPVPage from './pages/AgriPVPage';
import TeamPage from './pages/TeamPage';
import WarumZoeSolarPage from './pages/WarumZoeSolarPage';
import FoerdermittelKFWPage from './pages/FoerdermittelKFWPage';
import FoerdermittelIBBPage from './pages/FoerdermittelIBBPage';
import FoerdermittelBAFAPage from './pages/FoerdermittelBAFAPage';


import { articles } from './data/articles';
import { manufacturers, Product } from './data/products';
import { pageHeroData } from './data/pageContent';
import { useCasesData } from './data/useCases';
import { mockCustomer, mockDemoCustomer, CustomerData, CustomerProject } from './data/customerData';
import { guides } from './data/guidesData';
import { PricingPackage } from './data/pricingPackages';
// FIX: Import Page type from types.ts to resolve circular dependency.
import { Page } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isCommandHubOpen, setIsCommandHubOpen] = useState(false);
  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string | null>(null);
  const [selectedGuideSlug, setSelectedGuideSlug] = useState<string | null>(null);
  const [selectedHerstellerSlug, setSelectedHerstellerSlug] = useState<string | null>(null);
  const [selectedAnwendungsfallSlug, setSelectedAnwendungsfallSlug] = useState<string | null>(null);
  const [bannerHeight, setBannerHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<CustomerData | null>(null);
  const [hasChatBeenOpened, setHasChatBeenOpened] = useState(false);
  const [dashboardMessage, setDashboardMessage] = useState<string | null>(null);
  
  // State for Product Comparison
  const [comparisonList, setComparisonList] = useState<Product[]>([]);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [comparisonMessage, setComparisonMessage] = useState<string | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  


  useEffect(() => {
    const handleArticleSelect = (event: Event) => {
        const customEvent = event as CustomEvent<string>;
        if (customEvent.detail) {
            handleSelectArticle(customEvent.detail);
        }
    };
    const handleGuideSelect = (event: Event) => {
        const customEvent = event as CustomEvent<string>;
        if (customEvent.detail) {
            handleSelectGuide(customEvent.detail);
        }
    };
     const handleHerstellerSelect = (event: Event) => {
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

    document.addEventListener('select-article', handleArticleSelect);
    document.addEventListener('select-guide', handleGuideSelect);
    document.addEventListener('select-hersteller', handleHerstellerSelect);
    document.addEventListener('set-page', handleSetPageEvent);
    document.addEventListener('add-package-request', handleAddPackageRequestEvent);

    return () => {
        document.removeEventListener('select-article', handleArticleSelect);
        document.removeEventListener('select-guide', handleGuideSelect);
        document.removeEventListener('select-hersteller', handleHerstellerSelect);
        document.removeEventListener('set-page', handleSetPageEvent);
        document.removeEventListener('add-package-request', handleAddPackageRequestEvent);
    };
  }, [isLoggedIn, currentUser]);

  useEffect(() => {
    if (comparisonMessage) {
        const timer = setTimeout(() => setComparisonMessage(null), 3000);
        return () => clearTimeout(timer);
    }
  }, [comparisonMessage]);

  // Effect to auto-open chat when user scrolls to footer
  useEffect(() => {
    // If chat has been opened, don't add listener.
    if (hasChatBeenOpened) return;

    const handleScroll = () => {
        const footer = document.querySelector('footer');
        if (footer) {
            const rect = footer.getBoundingClientRect();
            // Trigger when the top of the footer enters the viewport
            if (rect.top <= window.innerHeight) {
                document.dispatchEvent(new CustomEvent('open-chat'));
            }
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Cleanup function will be called when component unmounts OR when hasChatBeenOpened changes.
    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
  }, [hasChatBeenOpened]);



  const handleToggleCompare = (product: Product) => {
    const isInList = comparisonList.some(p => p.name === product.name);

    if (isInList) {
        setComparisonList(prev => prev.filter(p => p.name !== product.name));
    } else {
        if (comparisonList.length > 0 && comparisonList[0].category !== product.category) {
            setComparisonMessage(`Sie können nur Produkte aus der Kategorie "${comparisonList[0].category}" vergleichen.`);
            return;
        }
        if (comparisonList.length >= 4) {
            setComparisonMessage('Sie können maximal 4 Produkte vergleichen.');
            return;
        }
        setComparisonList(prev => [...prev, product]);
    }
  };

  const handleClearCompare = () => {
    setComparisonList([]);
  };

  const handleSetPage = (page: Page, options?: { scrollToTop?: boolean, anchor?: string }) => {
     if (page === currentPage && options?.anchor) {
        document.getElementById(options.anchor)?.scrollIntoView({ behavior: 'smooth' });
        return;
    }
    if (page === currentPage) return;
    
    setIsExiting(true);
    setTimeout(() => {
        if (page === 'dashboard' && !isLoggedIn) {
            setCurrentPage('login');
        } else {
            setCurrentPage(page);
        }

        if (page !== 'article-detail') setSelectedArticleSlug(null);
        if (page !== 'guide-detail') setSelectedGuideSlug(null);
        if (page !== 'hersteller-detail') setSelectedHerstellerSlug(null);
        if (page !== 'anwendungsfall-detail') setSelectedAnwendungsfallSlug(null);
        
        setIsExiting(false);

        const shouldScroll = options?.scrollToTop !== false;
        if (shouldScroll) {
            window.scrollTo(0, 0);
        }

        if (options?.anchor) {
            setTimeout(() => {
                document.getElementById(options.anchor)?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, 300);
  };

  const handleLogin = (email: string) => {
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
          // In a real app, you would show an error message here
          console.error("Login failed");
      }
  };

  const handleAddPackageRequest = (pkg: PricingPackage) => {
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
        messages: [{ 
            id: `msg_${Date.now()}`, 
            date: new Date().toLocaleDateString('de-DE'), 
            from: 'ZOE Solar', 
            text: `Vielen Dank für Ihre Anfrage für das Paket "${pkg.name}". Wir prüfen die Details und melden uns in Kürze bei Ihnen, um einen Vor-Ort-Termin zu vereinbaren und ein verbindliches Angebot zu erstellen.` 
        }]
    };

    setCurrentUser(prevUser => {
        if (!prevUser) return null;
        return {
            ...prevUser,
            projects: [newProject, ...prevUser.projects]
        };
    });
    
    setDashboardMessage(`Das Paket "${pkg.name}" wurde erfolgreich zu Ihrem Profil hinzugefügt.`);
    handleSetPage('dashboard');
};


  const handleLogout = () => {
      setIsLoggedIn(false);
      setCurrentUser(null);
      handleSetPage('home');
  };

  const handleSelectArticle = (slug: string) => {
    setSelectedArticleSlug(slug);
    handleSetPage('article-detail');
  };
  
  const handleSelectGuide = (slug: string) => {
    setSelectedGuideSlug(slug);
    handleSetPage('guide-detail');
  };

  const handleSelectHersteller = (slug: string) => {
    setSelectedHerstellerSlug(slug);
    handleSetPage('hersteller-detail');
  };

  const handleSelectAnwendungsfall = (slug: string) => {
    setSelectedAnwendungsfallSlug(slug);
    handleSetPage('anwendungsfall-detail');
  };
  
  const handleSelectWissen = (slug: string) => {
    if (slug === 'glossar') {
        handleSetPage('glossar');
    } else if (slug === 'faq') {
        handleSetPage('faq-page');
    } else if (slug === 'magazin') {
        handleSetPage('aktuelles');
    } else { // 'hub' and default
        handleSetPage('wissens-hub');
    }
  };
  
  const handleHeroCta = (page?: Page, action?: 'open-chat', anchor?: string) => {
      if (action === 'open-chat') {
          document.dispatchEvent(new CustomEvent('open-chat'));
      } else if (page) {
          handleSetPage(page, { anchor: anchor });
      }
  };

  const renderPage = () => {
    const pageProps = {
        bannerHeight: bannerHeight,
        headerHeight: headerHeight
    };

    switch (currentPage) {
      case 'login':
        return <LoginPage onLogin={handleLogin} setPage={handleSetPage} />;
      case 'dashboard':
        return currentUser ? <DashboardPage user={currentUser} message={dashboardMessage} clearMessage={() => setDashboardMessage(null)} /> : <LoginPage onLogin={handleLogin} setPage={handleSetPage} />; // Fallback to login
      case 'photovoltaik':
        return <PhotovoltaikPage setPage={handleSetPage} />;
      case 'e-mobilitaet':
        return <EMobilitaetPage setPage={handleSetPage} />;
       case 'elektro':
        return <ElektroPage setPage={handleSetPage} />;
      case 'preise':
        return <PreisePage isLoggedIn={isLoggedIn} />;
      case 'finanzierung':
        return <FinanzierungPage setPage={handleSetPage} />;
      case 'foerdermittel-kfw':
        return <FoerdermittelKFWPage setPage={handleSetPage} currentPage={currentPage} bannerHeight={bannerHeight} headerHeight={headerHeight} />;
      case 'foerdermittel-ibb':
        return <FoerdermittelIBBPage setPage={handleSetPage} currentPage={currentPage} bannerHeight={bannerHeight} headerHeight={headerHeight} />;
      case 'foerdermittel-bafa':
        return <FoerdermittelBAFAPage setPage={handleSetPage} currentPage={currentPage} bannerHeight={bannerHeight} headerHeight={headerHeight} />;
      case 'sonderaktionen':
        return <SonderaktionenPage />;
      case 'innovations':
        return <InnovationsPage setPage={handleSetPage} />;
      case 'projekte':
        return <ProjektePage setPage={handleSetPage} />;
      case 'produkte':
        return <ProduktePage onSelectHersteller={handleSelectHersteller} comparisonList={comparisonList} onToggleCompare={handleToggleCompare} {...pageProps} />;
      case 'hersteller-detail': {
        const hersteller = manufacturers.find(m => m.slug === selectedHerstellerSlug);
        if (!hersteller) {
            return <ProduktePage onSelectHersteller={handleSelectHersteller} comparisonList={comparisonList} onToggleCompare={handleToggleCompare} {...pageProps} />;
        }
        return <HerstellerDetailPage manufacturer={hersteller} comparisonList={comparisonList} onToggleCompare={handleToggleCompare} onSelectHersteller={handleSelectHersteller} {...pageProps} />;
      }
      case 'ueber-uns':
        return <UeberUnsPage setPage={handleSetPage}/>;
      case 'team':
        return <TeamPage setPage={handleSetPage} />;
      case 'warum-zoe-solar':
        return <WarumZoeSolarPage />;
      case 'karriere':
        return <KarrierePage setPage={handleSetPage} />;
      case 'partner-werden':
        return <PartnerWerdenPage />;
      case 'empfehlungspraemie':
        return <EmpfehlungspraemiePage />;
      case 'kontakt':
        return <KontaktPage setPage={handleSetPage} />;
      case 'service-photovoltaik':
        return <ServicePhotovoltaikPage setPage={handleSetPage} currentPage={currentPage} {...pageProps} />;
      case 'service-anmeldung-pv':
        return <ServiceAnmeldungPVPage setPage={handleSetPage} currentPage={currentPage} {...pageProps} />;
      case 'agri-pv':
        return <AgriPVPage />;
      case 'service-ladeparks':
        return <ServiceLadeparksPage setPage={handleSetPage} currentPage={currentPage} {...pageProps} />;
       case 'service-anmeldung-ladestationen':
        return <ServiceAnmeldungLadestationenPage setPage={handleSetPage} currentPage={currentPage} {...pageProps} />;
      case 'service-speicher':
        return <ServiceSpeicherPage setPage={handleSetPage} currentPage={currentPage} {...pageProps} />;
      case 'service-netzanschluss':
        return <ServiceNetzanschlussPage setPage={handleSetPage} currentPage={currentPage} {...pageProps} />;
      case 'service-verteilerbau':
        return <ServiceVerteilerbauPage setPage={handleSetPage} currentPage={currentPage} {...pageProps} />;
      case 'service-zaehlerbau':
        return <ServiceZaehlerbauPage setPage={handleSetPage} currentPage={currentPage} {...pageProps} />;
      case 'diy-hub':
        return <DIYHubPage />;
      case 'anwendungsfaelle':
        return <AnwendungsfaellePage onSelectAnwendungsfall={handleSelectAnwendungsfall} {...pageProps} />;
      case 'anwendungsfall-detail': {
        const useCase = useCasesData.find(uc => uc.id === selectedAnwendungsfallSlug);
        if (!useCase) {
          return <AnwendungsfaellePage onSelectAnwendungsfall={handleSelectAnwendungsfall} {...pageProps} />;
        }
        return <AnwendungsfallDetailPage useCase={useCase} onSelectAnwendungsfall={handleSelectAnwendungsfall} {...pageProps} />;
      }
      case 'aktuelles':
        return <AktuellesPage onSelectArticle={handleSelectArticle} />;
      case 'article-detail': {
          const article = articles.find(a => a.slug === selectedArticleSlug);
          if (!article) {
            // Fallback if article not found (e.g., bad link)
            return <AktuellesPage onSelectArticle={handleSelectArticle} />;
          }
          return <ArticleDetailPage article={article} onBack={() => handleSetPage('aktuelles')} />;
        }
       case 'guide-detail': {
          const guide = guides.find(g => g.slug === selectedGuideSlug);
          if (!guide) {
            return <WissensHubPage setPage={handleSetPage} onSelectArticle={handleSelectArticle} onSelectGuide={handleSelectGuide} />;
          }
          return <GuideDetailPage guide={guide} onBack={() => handleSetPage('wissens-hub')} />;
        }
      case 'wissens-hub':
          return <WissensHubPage setPage={handleSetPage} onSelectArticle={handleSelectArticle} onSelectGuide={handleSelectGuide} />;
      case 'glossar':
          return <GlossarPage />;
      case 'faq-page':
          return <FAQPage />;
      case 'presse':
          return <PressePage />;
      case 'wartung-service':
          return <WartungServicePage />;
      case 'garantieabwicklung':
          return <GarantieabwicklungPage />;
      case 'foerdermittel-check':
          return <FoerdermittelCheckPage />;
      case 'impressum':
        return <ImpressumPage />;
      case 'datenschutz':
        return <DatenschutzPage />;
      case 'agb':
        return <AGBPage />;
      case 'nachhaltigkeit':
        return <NachhaltigkeitPage />;
      case 'home':
      default:
        return <HomePage setPage={handleSetPage} onSelectAnwendungsfall={handleSelectAnwendungsfall} onSelectHersteller={handleSelectHersteller} />;
    }
  };
  
  const heroData = pageHeroData[currentPage];
  const excludedPagesForHero: Page[] = ['home', 'photovoltaik', 'e-mobilitaet', 'elektro', 'preise', 'projekte', 'produkte', 'ueber-uns', 'karriere', 'kontakt', 'anwendungsfaelle', 'sonderaktionen', 'innovations', 'agri-pv', 'wissens-hub', 'aktuelles', 'empfehlungspraemie', 'partner-werden', 'diy-hub', 'nachhaltigkeit', 'glossar', 'faq-page', 'presse', 'wartung-service', 'garantieabwicklung', 'foerdermittel-check', 'article-detail', 'guide-detail', 'hersteller-detail', 'anwendungsfall-detail', 'login', 'dashboard', 'team', 'warum-zoe-solar', 'service-photovoltaik', 'service-ladeparks', 'service-speicher', 'impressum', 'datenschutz', 'agb'];
  const showPageHero = !excludedPagesForHero.includes(currentPage) && heroData;
  const isSubNavPage = ['service-photovoltaik', 'service-ladeparks', 'service-speicher', 'hersteller-detail', 'anwendungsfall-detail', 'anwendungsfaelle', 'produkte', 'finanzierung', 'foerdermittel-kfw', 'foerdermittel-ibb', 'foerdermittel-bafa', 'service-anmeldung-pv', 'service-anmeldung-ladestationen', 'service-netzanschluss', 'service-verteilerbau', 'service-zaehlerbau'].includes(currentPage);

  return (
    <div className="bg-white h-full flex flex-col">
      <PromoBanner
        onHeightChange={setBannerHeight}
        setPage={handleSetPage}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
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
      <main id="main-content" className={`flex-grow ${isExiting ? 'page-transition-exit' : 'page-transition-enter'}`} style={{ paddingTop: isSubNavPage ? `0px` : `${bannerHeight + headerHeight}px`, scrollMarginTop: `${bannerHeight + headerHeight}px` }}>
        {showPageHero && heroData && (
            <PageHero
                {...heroData}
                onCtaClick={handleHeroCta}
            />
        )}
        {renderPage()}
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
          <div role="alert" className="fixed top-24 right-6 bg-red-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg z-[200] animate-fade-in">
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
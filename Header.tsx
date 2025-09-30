import React, { useState, useEffect, useRef } from 'react';
// FIX: Changed import to ../types to resolve circular dependency with App.tsx
import { Page } from '../types';
import PhotovoltaikMegaMenu from './PhotovoltaikMegaMenu';
import ProductsMegaMenu from './ProductsMegaMenu';
import EMobilitaetMegaMenu from './EMobilitaetMegaMenu';
// FIX: The module does not have a default export, so we use a named import.
import { WissenMegaMenu } from './WissenMegaMenu';
import PreiseMegaMenu from './PreiseMegaMenu';
import ElektroMegaMenu from './ElektroMegaMenu';

interface HeaderProps {
  currentPage: Page;
  setPage: (page: Page, options?: { scrollToTop?: boolean }) => void;
  openCommandHub: () => void;
  bannerHeight: number;
  onHeightChange: (height: number) => void;
  onSelectHersteller: (slug: string) => void;
  onSelectWissen: (slug: string) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

type DropdownType = 'photovoltaik' | 'produkte' | 'e-mobilitaet' | 'wissen' | 'preise' | 'elektro' | null;

const Header: React.FC<HeaderProps> = ({ currentPage, setPage, openCommandHub, bannerHeight, onHeightChange, onSelectHersteller, onSelectWissen, isLoggedIn, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
  const [isCtaDropdownOpen, setIsCtaDropdownOpen] = useState(false);
  const [isMobileCtaOpen, setIsMobileCtaOpen] = useState(false);
  
  const headerRef = useRef<HTMLElement>(null);
  const dropdownTimeout = useRef<number | null>(null);
  const ctaDropdownRef = useRef<HTMLDivElement>(null);
  const mobileCtaRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
    const handleResize = () => {
        if (headerRef.current) {
            onHeightChange(headerRef.current.offsetHeight);
        }
    };
    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    if (headerRef.current) {
        resizeObserver.observe(headerRef.current);
    }
    window.addEventListener('resize', handleResize);
    return () => {
        window.removeEventListener('resize', handleResize);
        if (headerRef.current) {
            resizeObserver.unobserve(headerRef.current);
        }
    };
   }, [onHeightChange]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ctaDropdownRef.current && !ctaDropdownRef.current.contains(event.target as Node)) {
        setIsCtaDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        openCommandHub();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openCommandHub]);

  useEffect(() => {
    const handleNavigationKeyDown = (event: KeyboardEvent) => {
        // We only want to trigger this if no input field is focused.
        const target = event.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
            return;
        }

        if (event.altKey) {
            let page: Page | null = null;
            switch (event.key) {
                case '1':
                    page = 'home';
                    break;
                case '2':
                    page = 'photovoltaik';
                    break;
                case '3':
                    page = 'produkte';
                    break;
                case '4':
                    page = 'e-mobilitaet';
                    break;
                case '5':
                    page = 'wissens-hub';
                    break;
                case '6':
                    page = 'kontakt';
                    break;
                default:
                    break;
            }

            if (page) {
                event.preventDefault();
                setPage(page);
            }
        }
    };

    window.addEventListener('keydown', handleNavigationKeyDown);
    return () => {
        window.removeEventListener('keydown', handleNavigationKeyDown);
    };
}, [setPage]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
    return () => { document.body.classList.remove('mobile-menu-open'); }
  }, [isMobileMenuOpen]);

  const handleLinkClick = (page: Page) => {
    console.log('Header: handleLinkClick called with page:', page);
    console.log('Header: pageToPath result:', pageToPath[page]);
    setPage(page);
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  };
  
  const handleSelectHerstellerClick = (slug: string) => {
    onSelectHersteller(slug);
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  };
  
  const handleSelectWissenClick = (slug: string) => {
    onSelectWissen(slug);
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  };
  
  const openChat = () => {
    document.dispatchEvent(new CustomEvent('open-chat'));
    setIsMobileMenuOpen(false);
    setIsCtaDropdownOpen(false);
    setIsMobileCtaOpen(false);
  };

  const handleMouseEnter = (dropdown: DropdownType) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setActiveDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = window.setTimeout(() => {
        setActiveDropdown(null);
    }, 200);
  };
  
  const isPhotovoltaikActive = ['photovoltaik', 'service-photovoltaik', 'service-speicher', 'innovations', 'agri-pv', 'service-anmeldung-pv'].includes(currentPage);
  const isProdukteActive = ['produkte', 'hersteller-detail'].includes(currentPage);
  const isEMobilitaetActive = ['e-mobilitaet', 'service-ladeparks', 'service-anmeldung-ladestationen'].includes(currentPage);
  const isWissenActive = ['wissens-hub', 'glossar', 'aktuelles', 'article-detail', 'guide-detail', 'faq-page', 'diy-hub'].includes(currentPage);
  const isPreiseActive = ['preise', 'finanzierung', 'foerdermittel-check', 'sonderaktionen'].includes(currentPage);
  const isElektroActive = ['elektro', 'service-netzanschluss', 'service-verteilerbau', 'service-zaehlerbau'].includes(currentPage);


  const navLinkClasses = (page: Page | 'photovoltaik_parent' | 'produkte_parent' | 'e-mobilitaet_parent' | 'wissen_parent' | 'preise_parent' | 'elektro_parent') => {
    let activeCondition = false;
    if (page === 'photovoltaik_parent') activeCondition = isPhotovoltaikActive;
    else if (page === 'produkte_parent') activeCondition = isProdukteActive;
    else if (page === 'e-mobilitaet_parent') activeCondition = isEMobilitaetActive;
    else if (page === 'wissen_parent') activeCondition = isWissenActive;
    else if (page === 'preise_parent') activeCondition = isPreiseActive;
    else if (page === 'elektro_parent') activeCondition = isElektroActive;
    else activeCondition = currentPage === page;

    return `transition-colors duration-200 cursor-pointer pb-1 border-b-2 flex items-center gap-1.5 ${
      activeCondition
        ? 'font-semibold text-green-600 border-green-600'
        : 'border-transparent text-slate-600 hover:text-green-600 hover:border-green-300'
    }`;
  }
  
  return (
    <>
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-md border-b border-slate-200/80"
      style={{ top: `${bannerHeight}px` }}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
                <div className="font-bold cursor-pointer text-slate-900 text-3xl" onClick={() => handleLinkClick('home')}>
                    ZOE <span className="text-green-500">Solar</span>
                </div>
                <a 
                    onClick={() => setPage('faq-page')}
                    className="hidden lg:flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-full px-3 py-1.5 text-sm text-slate-600 transition-all duration-300 hover:bg-green-50 hover:border-green-300 hover:text-green-700 cursor-pointer group"
                    title="Zum Testbericht auf PhotovoltaikTest.de"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">Testsieger 2025</span>
                </a>
            </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a onClick={() => handleLinkClick('sonderaktionen')} className={`${navLinkClasses('sonderaktionen')} text-yellow-500 font-bold border-yellow-500 hover:text-yellow-600 hover:border-yellow-400`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1V3a1 1 0 112 0v1h2a1 1 0 110 2H9v1a1 1 0 11-2 0V6H6v1a1 1 0 11-2 0V6H3a1 1 0 01-1-1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1v-1a1 1 0 112 0v1h2a1 1 0 110 2H9v1a1 1 0 11-2 0v-1H6v1a1 1 0 11-2 0v-1H3a1 1 0 01-1-1v-1a1 1 0 011-1z" clipRule="evenodd" /></svg>
                Aktionen
            </a>
            <div onMouseEnter={() => handleMouseEnter('preise')} onMouseLeave={handleMouseLeave} className="relative">
               <a onClick={() => handleLinkClick('preise')} className={`${navLinkClasses('preise_parent')} ${activeDropdown === 'preise' ? 'text-green-600 !border-b-transparent' : ''}`}>
                Preise
                <svg className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'preise' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
               </a>
               <div className={`transition-all duration-300 transform origin-top ${activeDropdown === 'preise' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                 <PreiseMegaMenu setPage={handleLinkClick} closeMenu={() => setActiveDropdown(null)} />
               </div>
            </div>

            <div onMouseEnter={() => handleMouseEnter('photovoltaik')} onMouseLeave={handleMouseLeave} className="relative">
               <a onClick={() => handleLinkClick('photovoltaik')} className={`${navLinkClasses('photovoltaik_parent')} ${activeDropdown === 'photovoltaik' ? 'text-green-600 !border-b-transparent' : ''}`}>
                Photovoltaik
                <svg className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'photovoltaik' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
               </a>
               <div className={`transition-all duration-300 transform origin-top ${activeDropdown === 'photovoltaik' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                 <PhotovoltaikMegaMenu setPage={handleLinkClick} closeMenu={() => setActiveDropdown(null)} />
               </div>
            </div>

            <div onMouseEnter={() => handleMouseEnter('e-mobilitaet')} onMouseLeave={handleMouseLeave} className="relative">
               <a onClick={() => handleLinkClick('e-mobilitaet')} className={`${navLinkClasses('e-mobilitaet_parent')} ${activeDropdown === 'e-mobilitaet' ? 'text-green-600 !border-b-transparent' : ''}`}>
                E-Mobilität
                <svg className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'e-mobilitaet' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
               </a>
               <div className={`transition-all duration-300 transform origin-top ${activeDropdown === 'e-mobilitaet' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                 <EMobilitaetMegaMenu setPage={handleLinkClick} closeMenu={() => setActiveDropdown(null)} />
               </div>
            </div>

            <div onMouseEnter={() => handleMouseEnter('elektro')} onMouseLeave={handleMouseLeave} className="relative">
               <a onClick={() => handleLinkClick('elektro')} className={`${navLinkClasses('elektro_parent')} ${activeDropdown === 'elektro' ? 'text-green-600 !border-b-transparent' : ''}`}>
                Elektro
                <svg className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'elektro' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
               </a>
               <div className={`transition-all duration-300 transform origin-top ${activeDropdown === 'elektro' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                 <ElektroMegaMenu setPage={handleLinkClick} closeMenu={() => setActiveDropdown(null)} />
               </div>
            </div>
            
            <div onMouseEnter={() => handleMouseEnter('produkte')} onMouseLeave={handleMouseLeave} className="relative">
               <a onClick={() => handleLinkClick('produkte')} className={`${navLinkClasses('produkte_parent')} ${activeDropdown === 'produkte' ? 'text-green-600 !border-b-transparent' : ''}`}>
                Produkte
                <svg className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'produkte' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
               </a>
               <div className={`transition-all duration-300 transform origin-top ${activeDropdown === 'produkte' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                 <ProductsMegaMenu setPage={handleLinkClick} onSelectHersteller={handleSelectHerstellerClick} />
               </div>
            </div>

            <div onMouseEnter={() => handleMouseEnter('wissen')} onMouseLeave={handleMouseLeave} className="relative">
               <a onClick={() => handleLinkClick('wissens-hub')} className={`${navLinkClasses('wissen_parent')} ${activeDropdown === 'wissen' ? 'text-green-600 !border-b-transparent' : ''}`}>
                Wissen
                <svg className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'wissen' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
               </a>
               <div className={`transition-all duration-300 transform origin-top ${activeDropdown === 'wissen' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                 <WissenMegaMenu setPage={handleLinkClick} onSelectWissen={handleSelectWissenClick} closeMenu={() => setActiveDropdown(null)} />
               </div>
            </div>
            
            <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                <button onClick={openCommandHub} title="Suchen (Cmd+K)" aria-label="Suchen (Cmd+K)" className="p-2 rounded-full transition-colors duration-200 text-slate-500 hover:bg-slate-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
                <div ref={ctaDropdownRef} className="relative">
                    <button onClick={() => setIsCtaDropdownOpen(prev => !prev)} className="bg-green-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer cta-button-glow flex items-center gap-2">
                      Jetzt anfragen
                       <svg className={`w-4 h-4 transition-transform duration-300 ${isCtaDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                     <div className={`absolute top-full right-0 mt-2 w-72 bg-white/95 backdrop-blur-lg rounded-md shadow-2xl overflow-hidden transition-all duration-300 transform origin-top-right border border-slate-200/50 ${isCtaDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                        <button onClick={openChat} className="w-full text-left group flex items-start gap-4 p-4 hover:bg-green-50 transition-colors duration-200 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                            <div>
                                <h4 className="font-bold text-slate-800 group-hover:text-green-600">Mit KI-Berater sprechen</h4>
                                <p className="text-sm text-slate-500">Direkt & unkompliziert Anfrage starten.</p>
                            </div>
                        </button>
                        <a href="tel:+493012345678" className="w-full text-left group flex items-start gap-4 p-4 hover:bg-green-50 transition-colors duration-200 cursor-pointer border-t border-slate-200/80">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            <div>
                                <h4 className="font-bold text-slate-800 group-hover:text-green-600">Kundenservice anrufen</h4>
                                <p className="text-sm text-slate-500">Für eine persönliche Beratung.</p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
          </nav>
          
          {/* Mobile Nav Trigger */}
          <div className="md:hidden flex items-center gap-2">
             <button onClick={openCommandHub} className="p-2 rounded-full transition-colors text-slate-900">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`z-[101] p-2 rounded-md transition-colors ${isMobileMenuOpen ? 'text-slate-800' : 'text-slate-900'}`}
              aria-label={isMobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
            >
                <div className={`hamburger-icon ${isMobileMenuOpen ? 'open' : ''} w-6 h-6 flex flex-col justify-between`}>
                    <span className="line line-1 block h-0.5 w-full bg-current"></span>
                    <span className="line line-2 block h-0.5 w-full bg-current"></span>
                    <span className="line line-3 block h-0.5 w-full bg-current"></span>
                </div>
            </button>
          </div>
        </div>
      </div>
    </header>
    
    {/* Mobile Off-Canvas Menu */}
    <div
      className={`fixed inset-0 z-[100] transition-opacity duration-300 md:hidden ${
        isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden={!isMobileMenuOpen}
    >
      <div
        className={`off-canvas-menu-overlay absolute inset-0 bg-black/50 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>
      <nav
        className={`off-canvas-menu absolute top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-xl transform translate-x-full ${
          isMobileMenuOpen ? 'translate-x-0' : ''
        }`}
      >
        <div className={`p-8 h-full flex flex-col mobile-menu-is-open`} style={{ paddingTop: `${bannerHeight + 88}px` }}>
            <div className="space-y-2 mb-8">
                <a onClick={() => handleLinkClick('sonderaktionen')} className="nav-item-stagger block text-yellow-600 hover:text-yellow-700 cursor-pointer text-2xl font-semibold px-4 py-3 rounded-md hover:bg-yellow-50">Aktionen</a>
                <a onClick={() => handleLinkClick('preise')} className="nav-item-stagger block text-slate-700 hover:text-green-600 cursor-pointer text-2xl font-semibold px-4 py-3 rounded-md hover:bg-slate-100">Preise</a>
                <a onClick={() => handleLinkClick('photovoltaik')} className="nav-item-stagger block text-slate-700 hover:text-green-600 cursor-pointer text-2xl font-semibold px-4 py-3 rounded-md hover:bg-slate-100">Photovoltaik</a>
                <a onClick={() => handleLinkClick('e-mobilitaet')} className="nav-item-stagger block text-slate-700 hover:text-green-600 cursor-pointer text-2xl font-semibold px-4 py-3 rounded-md hover:bg-slate-100">E-Mobilität</a>
                <a onClick={() => handleLinkClick('elektro')} className="nav-item-stagger block text-slate-700 hover:text-green-600 cursor-pointer text-2xl font-semibold px-4 py-3 rounded-md hover:bg-slate-100">Elektro</a>
                <a onClick={() => handleLinkClick('produkte')} className="nav-item-stagger block text-slate-700 hover:text-green-600 cursor-pointer text-2xl font-semibold px-4 py-3 rounded-md hover:bg-slate-100">Produkte</a>
                <a onClick={() => handleLinkClick('wissens-hub')} className="nav-item-stagger block text-slate-700 hover:text-green-600 cursor-pointer text-2xl font-semibold px-4 py-3 rounded-md hover:bg-slate-100">Wissen</a>
                <a onClick={() => handleLinkClick('kontakt')} className="nav-item-stagger block text-slate-700 hover:text-green-600 cursor-pointer text-2xl font-semibold px-4 py-3 rounded-md hover:bg-slate-100">Kontakt</a>
            </div>
            <div className="mt-auto nav-item-stagger" style={{transitionDelay: '450ms'}}>
               {isLoggedIn ? (
                    <>
                        <a onClick={() => handleLinkClick('dashboard')} className="block text-center w-full bg-slate-100 text-slate-800 font-bold py-4 px-6 rounded-xl mb-3 hover:bg-slate-200 transition-all">Mein Konto</a>
                        <button onClick={() => { onLogout(); setIsMobileMenuOpen(false); }} className="w-full bg-slate-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-slate-700 transition-all">Logout</button>
                    </>
                ) : (
                    <>
                      <a onClick={() => {handleLinkClick('login')}} className="block text-center w-full bg-slate-100 text-slate-800 font-bold py-4 px-6 rounded-xl mb-3 hover:bg-slate-200 transition-all">Kunden-Login</a>
                      <div ref={mobileCtaRef}>
                          <button onClick={() => setIsMobileCtaOpen(!isMobileCtaOpen)} className="w-full bg-green-500 text-white font-bold py-4 px-6 rounded-xl hover:bg-green-600 transition-all duration-300 shadow-lg flex justify-center items-center gap-2">
                              Jetzt anfragen
                              <svg className={`w-5 h-5 transition-transform duration-300 ${isMobileCtaOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                          </button>
                          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isMobileCtaOpen ? 'max-h-96 mt-3' : 'max-h-0'}`}>
                              <div className="space-y-3">
                                  <button onClick={openChat} className="w-full bg-slate-100 text-slate-800 font-bold py-4 px-6 rounded-xl hover:bg-slate-200 transition-all">
                                      Mit KI-Berater sprechen
                                  </button>
                                  <a href="tel:+493012345678" className="block text-center w-full bg-slate-100 text-slate-800 font-bold py-4 px-6 rounded-xl hover:bg-slate-200 transition-all">
                                      Kundenservice anrufen
                                  </a>
                              </div>
                          </div>
                      </div>
                    </>
                )}
            </div>
        </div>
      </nav>
    </div>
    </>
  );
};

export default Header;
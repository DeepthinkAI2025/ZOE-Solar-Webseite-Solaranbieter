import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
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
  theme: 'day' | 'night';
  onToggleTheme: () => void;
}

type DropdownType = 'photovoltaik' | 'produkte' | 'e-mobilitaet' | 'wissen' | 'preise' | 'elektro' | null;

const Header: React.FC<HeaderProps> = ({ currentPage, setPage, openCommandHub, bannerHeight, onHeightChange, onSelectHersteller, onSelectWissen, isLoggedIn, onLogout, theme, onToggleTheme }) => {
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
  const isNight = theme === 'night';
  const dropdownActiveClass = isNight ? 'text-emerald-200 !border-b-transparent' : 'text-green-600 !border-b-transparent';


  const navLinkClasses = (page: Page | 'photovoltaik_parent' | 'produkte_parent' | 'e-mobilitaet_parent' | 'wissen_parent' | 'preise_parent' | 'elektro_parent') => {
    let activeCondition = false;
    if (page === 'photovoltaik_parent') activeCondition = isPhotovoltaikActive;
    else if (page === 'produkte_parent') activeCondition = isProdukteActive;
    else if (page === 'e-mobilitaet_parent') activeCondition = isEMobilitaetActive;
    else if (page === 'wissen_parent') activeCondition = isWissenActive;
    else if (page === 'preise_parent') activeCondition = isPreiseActive;
    else if (page === 'elektro_parent') activeCondition = isElektroActive;
    else activeCondition = currentPage === page;

    const activeClasses = isNight
      ? 'font-semibold text-emerald-300 border-emerald-300'
      : 'font-semibold text-green-600 border-green-600';
    const inactiveClasses = isNight
      ? 'border-transparent text-slate-300 hover:text-emerald-200 hover:border-emerald-300/60'
      : 'border-transparent text-slate-600 hover:text-green-600 hover:border-green-300';

    return `transition-colors duration-200 cursor-pointer pb-1 border-b-2 flex items-center gap-1.5 ${
      activeCondition ? activeClasses : inactiveClasses
    }`;
  }
  
  return (
    <>
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-colors duration-300 ${
        isNight
          ? 'bg-slate-950/80 border-b border-slate-800/70 text-slate-100 shadow-[0_12px_36px_rgba(15,23,42,0.55)]'
          : 'bg-white/95 border-b border-slate-200/80 text-slate-900 shadow-md'
      }`}
      style={{ top: `${bannerHeight}px` }}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-4">
        <Link
          to="/"
          onClick={() => handleLinkClick('home')}
          className={`font-bold cursor-pointer text-3xl ${isNight ? 'text-slate-100' : 'text-slate-900'}`}
        >
          ZOE <span className="text-green-500">Solar</span>
        </Link>
        <NavLink
          to="/wissen/faq"
          onClick={() => handleLinkClick('faq-page')}
          className={`hidden lg:flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-all duration-300 cursor-pointer group ${
            isNight
              ? 'bg-slate-800/70 border border-slate-700 text-slate-200 hover:bg-emerald-500/10 hover:border-emerald-400/50 hover:text-emerald-200'
              : 'bg-slate-100 border border-slate-200 text-slate-600 hover:bg-green-50 hover:border-green-300 hover:text-green-700'
          }`}
          title="Zum Testbericht auf PhotovoltaikTest.de"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">Testsieger 2025</span>
        </NavLink>
            </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/sonderaktionen"
              onClick={() => handleLinkClick('sonderaktionen')}
              className={`${navLinkClasses('sonderaktionen')} text-yellow-500 font-bold border-yellow-500 hover:text-yellow-600 hover:border-yellow-400`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1V3a1 1 0 112 0v1h2a1 1 0 110 2H9v1a1 1 0 11-2 0V6H6v1a1 1 0 11-2 0V6H3a1 1 0 01-1-1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1v-1a1 1 0 112 0v1h2a1 1 0 110 2H9v1a1 1 0 11-2 0v-1H6v1a1 1 0 11-2 0v-1H3a1 1 0 01-1-1v-1a1 1 0 011-1z" clipRule="evenodd" /></svg>
                Aktionen
            </NavLink>
            <div onMouseEnter={() => handleMouseEnter('preise')} onMouseLeave={handleMouseLeave} className="relative">
               <NavLink
                 to="/preise"
                 onClick={() => handleLinkClick('preise')}
                 className={`${navLinkClasses('preise_parent')} ${activeDropdown === 'preise' ? dropdownActiveClass : ''}`}
               >
                Preise
                <svg className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'preise' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
               </NavLink>
               <div className={`transition-all duration-300 transform origin-top ${activeDropdown === 'preise' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                 <PreiseMegaMenu setPage={handleLinkClick} closeMenu={() => setActiveDropdown(null)} />
               </div>
            </div>

            <div onMouseEnter={() => handleMouseEnter('photovoltaik')} onMouseLeave={handleMouseLeave} className="relative">
               <NavLink
                 to="/photovoltaik"
                 onClick={() => handleLinkClick('photovoltaik')}
                 className={`${navLinkClasses('photovoltaik_parent')} ${activeDropdown === 'photovoltaik' ? dropdownActiveClass : ''}`}
               >
                Photovoltaik
                <svg className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'photovoltaik' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
               </NavLink>
               <div className={`transition-all duration-300 transform origin-top ${activeDropdown === 'photovoltaik' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                 <PhotovoltaikMegaMenu setPage={handleLinkClick} closeMenu={() => setActiveDropdown(null)} />
               </div>
            </div>

            <div onMouseEnter={() => handleMouseEnter('e-mobilitaet')} onMouseLeave={handleMouseLeave} className="relative">
               <NavLink
                 to="/e-mobilitaet"
                 onClick={() => handleLinkClick('e-mobilitaet')}
                 className={`${navLinkClasses('e-mobilitaet_parent')} ${activeDropdown === 'e-mobilitaet' ? dropdownActiveClass : ''}`}
               >
                E-Mobilität
                <svg className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'e-mobilitaet' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
               </NavLink>
               <div className={`transition-all duration-300 transform origin-top ${activeDropdown === 'e-mobilitaet' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                 <EMobilitaetMegaMenu setPage={handleLinkClick} closeMenu={() => setActiveDropdown(null)} />
               </div>
            </div>

            <div onMouseEnter={() => handleMouseEnter('elektro')} onMouseLeave={handleMouseLeave} className="relative">
               <NavLink
                 to="/elektro"
                 onClick={() => handleLinkClick('elektro')}
                 className={`${navLinkClasses('elektro_parent')} ${activeDropdown === 'elektro' ? dropdownActiveClass : ''}`}
               >
                Elektro
                <svg className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'elektro' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
               </NavLink>
               <div className={`transition-all duration-300 transform origin-top ${activeDropdown === 'elektro' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                 <ElektroMegaMenu setPage={handleLinkClick} closeMenu={() => setActiveDropdown(null)} />
               </div>
            </div>
            
            <div onMouseEnter={() => handleMouseEnter('produkte')} onMouseLeave={handleMouseLeave} className="relative">
               <NavLink
                 to="/produkte"
                 onClick={() => handleLinkClick('produkte')}
                 className={`${navLinkClasses('produkte_parent')} ${activeDropdown === 'produkte' ? dropdownActiveClass : ''}`}
               >
                Produkte
                <svg className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'produkte' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
               </NavLink>
               <div className={`transition-all duration-300 transform origin-top ${activeDropdown === 'produkte' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                 <ProductsMegaMenu setPage={handleLinkClick} onSelectHersteller={handleSelectHerstellerClick} />
               </div>
            </div>

            <div onMouseEnter={() => handleMouseEnter('wissen')} onMouseLeave={handleMouseLeave} className="relative">
               <NavLink
                 to="/wissen"
                 onClick={() => handleLinkClick('wissens-hub')}
                 className={`${navLinkClasses('wissen_parent')} ${activeDropdown === 'wissen' ? dropdownActiveClass : ''}`}
               >
                Wissen
                <svg className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'wissen' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
               </NavLink>
               <div className={`transition-all duration-300 transform origin-top ${activeDropdown === 'wissen' ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                 <WissenMegaMenu setPage={handleLinkClick} onSelectWissen={handleSelectWissenClick} closeMenu={() => setActiveDropdown(null)} />
               </div>
            </div>
            
      <div className={`flex items-center gap-3 pl-4 border-l ${isNight ? 'border-slate-700' : 'border-slate-200'}`}>
        <button onClick={openCommandHub} title="Suchen (Cmd+K)" aria-label="Suchen (Cmd+K)" className={`p-2 rounded-full transition-colors duration-200 ${isNight ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-200'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
                <div ref={ctaDropdownRef} className="relative">
                    <button onClick={() => setIsCtaDropdownOpen(prev => !prev)} className="bg-green-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer cta-button-glow flex items-center gap-2">
                      Jetzt anfragen
                       <svg className={`w-4 h-4 transition-transform duration-300 ${isCtaDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
           <div className={`absolute top-full right-0 mt-2 w-72 backdrop-blur-lg rounded-md overflow-hidden transition-all duration-300 transform origin-top-right ${
            isNight
              ? 'bg-slate-900/95 border border-slate-700/70 shadow-[0_20px_55px_rgba(8,47,73,0.55)]'
              : 'bg-white/95 border border-slate-200/50 shadow-2xl'
           } ${isCtaDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
            <button
              onClick={openChat}
              className={`w-full text-left group flex items-start gap-4 p-4 transition-colors duration-200 cursor-pointer ${
                isNight ? 'hover:bg-emerald-500/10' : 'hover:bg-green-50'
              }`}
            >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                            <div>
                <h4 className={`font-bold ${isNight ? 'text-slate-100 group-hover:text-emerald-200' : 'text-slate-800 group-hover:text-green-600'}`}>Mit KI-Berater sprechen</h4>
                <p className={`text-sm ${isNight ? 'text-slate-300/80' : 'text-slate-500'}`}>Direkt & unkompliziert Anfrage starten.</p>
                            </div>
                        </button>
            <a
              href="tel:+493012345678"
              className={`w-full text-left group flex items-start gap-4 p-4 transition-colors duration-200 cursor-pointer border-t ${
                isNight
                  ? 'border-slate-700/70 hover:bg-emerald-500/10'
                  : 'border-slate-200/80 hover:bg-green-50'
              }`}
            >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            <div>
                <h4 className={`font-bold ${isNight ? 'text-slate-100 group-hover:text-emerald-200' : 'text-slate-800 group-hover:text-green-600'}`}>Kundenservice anrufen</h4>
                <p className={`text-sm ${isNight ? 'text-slate-300/80' : 'text-slate-500'}`}>Für eine persönliche Beratung.</p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
          </nav>
          
          {/* Mobile Nav Trigger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={onToggleTheme}
              title={isNight ? 'Tagmodus aktivieren' : 'Nachtmodus aktivieren'}
              aria-label={isNight ? 'Tagmodus aktivieren' : 'Nachtmodus aktivieren'}
              className={`p-2 rounded-full transition-colors duration-200 ${isNight ? 'text-emerald-200 hover:bg-slate-800/70' : 'text-amber-500 hover:bg-slate-100'}`}
            >
              {isNight ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 12.79A9 9 0 0111.21 3a7 7 0 100 14 9 9 0 009.79-4.21z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm5.657 3.343a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM18 11a1 1 0 100 2h1a1 1 0 100-2h-1zm-6 7a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-7-6a1 1 0 100 2H4a1 1 0 100-2H3zm1.343-5.657a1 1 0 010 1.414l-.707.707A1 1 0 112.222 7.05l.707-.707a1 1 0 011.414 0zM12 7a5 5 0 100 10 5 5 0 000-10zm6.364 10.95a1 1 0 000-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414 0zm-12.728 0a1 1 0 011.414-1.414l.707.707a1 1 0 01-1.414 1.414l-.707-.707z" />
                </svg>
              )}
            </button>
             <button onClick={openCommandHub} className={`p-2 rounded-full transition-colors ${isNight ? 'text-slate-200 hover:bg-slate-800/70' : 'text-slate-900 hover:bg-slate-200'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`z-[101] p-2 rounded-md transition-colors ${isMobileMenuOpen ? 'text-slate-800' : 'text-slate-900'}`}>
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
                <Link to="/sonderaktionen" onClick={() => handleLinkClick('sonderaktionen')} className="nav-item-stagger block text-yellow-600 hover:text-yellow-700 cursor-pointer text-2xl font-semibold px-4 py-3 rounded-md hover:bg-yellow-50">Aktionen</Link>
                <Link to="/preise" onClick={() => handleLinkClick('preise')} className="nav-item-stagger block text-slate-700 hover:text-green-600 cursor-pointer text-2xl font-semibold px-4 py-3 rounded-md hover:bg-slate-100">Preise</Link>
                <Link to="/photovoltaik" onClick={() => handleLinkClick('photovoltaik')} className="nav-item-stagger block text-slate-700 hover:text-green-600 cursor-pointer text-2xl font-semibold px-4 py-3 rounded-md hover:bg-slate-100">Photovoltaik</Link>
                <Link to="/e-mobilitaet" onClick={() => handleLinkClick('e-mobilitaet')} className="nav-item-stagger block text-slate-700 hover:text-green-600 cursor-pointer text-2xl font-semibold px-4 py-3 rounded-md hover:bg-slate-100">E-Mobilität</Link>
                <Link to="/elektro" onClick={() => handleLinkClick('elektro')} className="nav-item-stagger block text-slate-700 hover:text-green-600 cursor-pointer text-2xl font-semibold px-4 py-3 rounded-md hover:bg-slate-100">Elektro</Link>
                <Link to="/produkte" onClick={() => handleLinkClick('produkte')} className="nav-item-stagger block text-slate-700 hover:text-green-600 cursor-pointer text-2xl font-semibold px-4 py-3 rounded-md hover:bg-slate-100">Produkte</Link>
                <Link to="/wissen" onClick={() => handleLinkClick('wissens-hub')} className="nav-item-stagger block text-slate-700 hover:text-green-600 cursor-pointer text-2xl font-semibold px-4 py-3 rounded-md hover:bg-slate-100">Wissen</Link>
                <Link to="/kontakt" onClick={() => handleLinkClick('kontakt')} className="nav-item-stagger block text-slate-700 hover:text-green-600 cursor-pointer text-2xl font-semibold px-4 py-3 rounded-md hover:bg-slate-100">Kontakt</Link>
            </div>
            <div className="mt-auto nav-item-stagger" style={{transitionDelay: '500ms'}}>
               {isLoggedIn ? (
                    <>
                        <Link to="/dashboard" onClick={() => handleLinkClick('dashboard')} className="block text-center w-full bg-slate-100 text-slate-800 font-bold py-4 px-6 rounded-xl mb-3 hover:bg-slate-200 transition-all">Mein Konto</Link>
                        <button onClick={() => { onLogout(); setIsMobileMenuOpen(false); }} className="w-full bg-slate-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-slate-700 transition-all">Logout</button>
                    </>
                ) : (
                    <>
                      <Link to="/login" onClick={() => handleLinkClick('login')} className="block text-center w-full bg-slate-100 text-slate-800 font-bold py-4 px-6 rounded-xl mb-3 hover:bg-slate-200 transition-all">Kunden-Login</Link>
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
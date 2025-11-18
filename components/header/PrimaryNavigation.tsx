import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Page } from '../types';

// Import Mega Menu Components
import PhotovoltaikMegaMenu from '../PhotovoltaikMegaMenu';
import ProductsMegaMenu from '../ProductsMegaMenu';
import EMobilitaetMegaMenu from '../EMobilitaetMegaMenu';
import { WissenMegaMenu } from '../WissenMegaMenu';
import PreiseMegaMenu from '../PreiseMegaMenu';
import ElektroMegaMenu from '../ElektroMegaMenu';

interface PrimaryNavigationProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  onSelectHersteller: (slug: string) => void;
  onSelectWissen: (slug: string) => void;
}

type DropdownType = 'photovoltaik' | 'produkte' | 'e-mobilitaet' | 'wissen' | 'preise' | 'elektro' | null;

const PrimaryNavigation: React.FC<PrimaryNavigationProps> = ({
  currentPage,
  onPageChange,
  onSelectHersteller,
  onSelectWissen
}) => {
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
  const dropdownTimeout = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (dropdownTimeout.current) {
        clearTimeout(dropdownTimeout.current);
      }
    };
  }, []);

  const handleMouseEnter = (dropdown: DropdownType) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setActiveDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = window.setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const handleLinkClick = (page: Page) => {
    onPageChange(page);
    setActiveDropdown(null);
  };

  const handleSelectHerstellerClick = (slug: string) => {
    onSelectHersteller(slug);
    setActiveDropdown(null);
  };

  const handleSelectWissenClick = (slug: string) => {
    onSelectWissen(slug);
    setActiveDropdown(null);
  };

  // Active state checks
  const isPhotovoltaikActive = ['photovoltaik', 'service-photovoltaik', 'service-speicher', 'innovations', 'agri-pv', 'service-anmeldung-pv'].includes(currentPage);
  const isProdukteActive = ['produkte', 'hersteller-detail'].includes(currentPage);
  const isEMobilitaetActive = ['e-mobilitaet', 'service-ladeparks', 'service-anmeldung-ladestationen'].includes(currentPage);
  const isWissenActive = ['wissens-hub', 'glossar', 'aktuelles', 'article-detail', 'guide-detail', 'faq-page', 'diy-hub'].includes(currentPage);
  const isPreiseActive = ['preise', 'finanzierung', 'foerdermittel-check', 'sonderaktionen'].includes(currentPage);
  const isElektroActive = ['elektro', 'service-netzanschluss', 'service-verteilerbau', 'service-zaehlerbau'].includes(currentPage);

  const navLinkClasses = (page: Page | 'photovoltaik_parent' | 'produkte_parent' | 'e-mobilitaet_parent' | 'wissen_parent' | 'preise_parent' | 'elektro_parent', dropdown?: DropdownType) => {
    let activeCondition = false;
    if (page === 'photovoltaik_parent') activeCondition = isPhotovoltaikActive;
    else if (page === 'produkte_parent') activeCondition = isProdukteActive;
    else if (page === 'e-mobilitaet_parent') activeCondition = isEMobilitaetActive;
    else if (page === 'wissen_parent') activeCondition = isWissenActive;
    else if (page === 'preise_parent') activeCondition = isPreiseActive;
    else if (page === 'elektro_parent') activeCondition = isElektroActive;
    else activeCondition = currentPage === page;

    const isDropdownActive = dropdown === activeDropdown;

    return `group relative transition-all duration-200 cursor-pointer pb-1 border-b-2 flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-slate-50 ${
      activeCondition
        ? 'font-semibold text-green-600 border-green-600 bg-green-50/50'
        : 'border-transparent text-slate-600 hover:text-green-600 hover:border-green-300'
    } ${isDropdownActive ? 'text-green-600 !border-b-transparent bg-green-50' : ''}`;
  };

  const navigationItems = [
    {
      key: 'sonderaktionen',
      label: 'Aktionen',
      page: 'sonderaktionen' as Page,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1V3a1 1 0 112 0v1h2a1 1 0 110 2H9v1a1 1 0 11-2 0V6H6v1a1 1 0 11-2 0V6H3a1 1 0 01-1-1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1v-1a1 1 0 112 0v1h2a1 1 0 110 2H9v1a1 1 0 11-2 0v-1H6v1a1 1 0 11-2 0v-1H3a1 1 0 01-1-1v-1a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      ),
      dropdown: null,
      specialClass: 'text-yellow-500 font-bold border-yellow-500 hover:text-yellow-600 hover:border-yellow-400',
    },
    {
      key: 'preise',
      label: 'Preise',
      page: 'preise_parent' as any,
      icon: null,
      dropdown: 'preise' as DropdownType,
    },
    {
      key: 'photovoltaik',
      label: 'Photovoltaik',
      page: 'photovoltaik_parent' as any,
      icon: null,
      dropdown: 'photovoltaik' as DropdownType,
    },
    {
      key: 'e-mobilitaet',
      label: 'E-Mobilität',
      page: 'e-mobilitaet_parent' as any,
      icon: null,
      dropdown: 'e-mobilitaet' as DropdownType,
    },
    {
      key: 'elektro',
      label: 'Elektro',
      page: 'elektro_parent' as any,
      icon: null,
      dropdown: 'elektro' as DropdownType,
    },
    {
      key: 'produkte',
      label: 'Produkte',
      page: 'produkte_parent' as any,
      icon: null,
      dropdown: 'produkte' as DropdownType,
    },
    {
      key: 'wissen',
      label: 'Wissen',
      page: 'wissen_parent' as any,
      icon: null,
      dropdown: 'wissen' as DropdownType,
    },
  ];

  const megaMenuVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.15, ease: 'easeIn' } }
  };

  return (
    <nav className="hidden md:flex items-center space-x-1" role="navigation" aria-label="Hauptnavigation">
      {navigationItems.map((item) => (
        <div
          key={item.key}
          className="relative"
          onMouseEnter={() => item.dropdown && handleMouseEnter(item.dropdown)}
          onMouseLeave={handleMouseLeave}
        >
          {item.dropdown ? (
            <button
              onClick={() => item.dropdown && onPageChange(item.key as Page)}
              className={`${navLinkClasses(item.page, item.dropdown)} ${
                item.specialClass || ''
              }`}
              aria-expanded={activeDropdown === item.dropdown}
              aria-haspopup="true"
            >
              {item.icon && item.icon}
              <span>{item.label}</span>
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${
                  activeDropdown === item.dropdown ? 'rotate-180' : ''
                } group-hover:scale-110`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => handleLinkClick(item.page as Page)}
              className={`${navLinkClasses(item.page, item.dropdown)} ${
                item.specialClass || ''
              }`}
            >
              {item.icon && item.icon}
              <span>{item.label}</span>
            </button>
          )}

          {/* Mega Menu Dropdown */}
          <AnimatePresence>
            {item.dropdown && activeDropdown === item.dropdown && (
              <motion.div
                className="absolute top-full left-0 z-50 mt-1"
                variants={megaMenuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-200/50 min-w-max overflow-hidden">
                  {item.dropdown === 'photovoltaik' && (
                    <PhotovoltaikMegaMenu setPage={handleLinkClick} closeMenu={() => setActiveDropdown(null)} />
                  )}
                  {item.dropdown === 'produkte' && (
                    <ProductsMegaMenu setPage={handleLinkClick} onSelectHersteller={handleSelectHerstellerClick} />
                  )}
                  {item.dropdown === 'e-mobilitaet' && (
                    <EMobilitaetMegaMenu setPage={handleLinkClick} closeMenu={() => setActiveDropdown(null)} />
                  )}
                  {item.dropdown === 'wissen' && (
                    <WissenMegaMenu setPage={handleLinkClick} onSelectWissen={handleSelectWissenClick} closeMenu={() => setActiveDropdown(null)} />
                  )}
                  {item.dropdown === 'preise' && (
                    <PreiseMegaMenu setPage={handleLinkClick} closeMenu={() => setActiveDropdown(null)} />
                  )}
                  {item.dropdown === 'elektro' && (
                    <ElektroMegaMenu setPage={handleLinkClick} closeMenu={() => setActiveDropdown(null)} />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </nav>
  );
};

export default PrimaryNavigation;
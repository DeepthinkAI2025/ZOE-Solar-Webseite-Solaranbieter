import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Page } from '../types';

interface MobileNavigationProps {
  isOpen: boolean;
  currentPage: Page;
  onPageChange: (page: Page) => void;
  onClose: () => void;
  bannerHeight: number;
  openCommandHub: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isOpen,
  currentPage,
  onPageChange,
  onClose,
  bannerHeight,
  openCommandHub,
  isLoggedIn,
  onLogout
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
    return () => { document.body.classList.remove('mobile-menu-open'); }
  }, [isOpen]);

  const handleLinkClick = (page: Page) => {
    onPageChange(page);
    onClose();
  };

  const handleLogout = () => {
    onLogout();
    onClose();
  };

  const menuItems = [
    { page: 'sonderaktionen' as Page, label: 'Aktionen', icon: '⭐', color: 'text-yellow-600 hover:bg-yellow-50' },
    { page: 'preise' as Page, label: 'Preise', icon: '💰', color: 'text-slate-700 hover:bg-slate-100' },
    { page: 'photovoltaik' as Page, label: 'Photovoltaik', icon: '☀️', color: 'text-slate-700 hover:bg-green-50' },
    { page: 'e-mobilitaet' as Page, label: 'E-Mobilität', icon: '🚗', color: 'text-slate-700 hover:bg-blue-50' },
    { page: 'elektro' as Page, label: 'Elektro', icon: '⚡', color: 'text-slate-700 hover:bg-orange-50' },
    { page: 'produkte' as Page, label: 'Produkte', icon: '📦', color: 'text-slate-700 hover:bg-purple-50' },
    { page: 'wissens-hub' as Page, label: 'Wissen', icon: '📚', color: 'text-slate-700 hover:bg-indigo-50' },
    { page: 'kontakt' as Page, label: 'Kontakt', icon: '📞', color: 'text-slate-700 hover:bg-red-50' },
  ];

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const menuVariants = {
    hidden: { x: '100%' },
    visible: { x: 0, transition: { type: 'spring', damping: 25, stiffness: 200 } }
  };

  const itemVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.05,
        type: 'spring',
        damping: 20,
        stiffness: 300
      }
    })
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-[100] md:hidden bg-black/50 backdrop-blur-sm"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Mobile Menu */}
          <motion.nav
            ref={menuRef}
            className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-2xl z-[101] md:hidden overflow-y-auto"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            style={{ paddingTop: `${bannerHeight + 88}px` }}
          >
            <div className="p-8 h-full flex flex-col">
              {/* Quick Search */}
              <motion.button
                onClick={() => {
                  openCommandHub();
                  onClose();
                }}
                className="mb-6 flex items-center justify-center gap-3 w-full bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-4 hover:from-slate-100 hover:to-slate-200 transition-all duration-300"
                variants={itemVariants}
                custom={0}
              >
                <svg className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="font-semibold text-slate-700">Schnellsuche</span>
              </motion.button>

              {/* Navigation Items */}
              <div className="space-y-2 mb-8 flex-grow">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.page}
                    onClick={() => handleLinkClick(item.page)}
                    className={`nav-item-stagger w-full text-left flex items-center gap-4 ${item.color} cursor-pointer text-xl font-semibold px-4 py-3 rounded-lg transition-all duration-300 active:scale-95`}
                    variants={itemVariants}
                    custom={index + 1}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span>{item.label}</span>
                    {item.page === currentPage && (
                      <span className="ml-auto h-2 w-2 bg-green-500 rounded-full"></span>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* User Actions */}
              <motion.div
                className="space-y-3 pt-6 border-t border-slate-200"
                variants={itemVariants}
                custom={menuItems.length + 2}
              >
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={() => handleLinkClick('dashboard')}
                      className="w-full bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 font-bold py-4 px-6 rounded-xl hover:from-slate-200 hover:to-slate-300 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-3"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Mein Konto
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-4 px-6 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-3"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleLinkClick('login')}
                      className="w-full bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 font-bold py-4 px-6 rounded-xl hover:from-slate-200 hover:to-slate-300 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-3"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Kunden-Login
                    </button>
                    <button
                      onClick={() => handleLinkClick('kontakt')}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-3"
                    >
                      <span className="relative">
                        Jetzt anfragen
                        <span className="absolute inset-0 bg-green-400 rounded-lg blur-lg opacity-50 animate-pulse"></span>
                      </span>
                    </button>
                  </>
                )}
              </motion.div>

              {/* Contact Info */}
              <motion.div
                className="mt-6 pt-6 border-t border-slate-200 text-center text-sm text-slate-500"
                variants={itemVariants}
                custom={menuItems.length + 3}
              >
                <p className="mb-2">Mo-Fr: 8:00 - 18:00 Uhr</p>
                <a href="tel:+493012345678" className="text-green-600 hover:text-green-700 font-semibold transition-colors">
                  +49 30 12345678
                </a>
              </motion.div>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileNavigation;
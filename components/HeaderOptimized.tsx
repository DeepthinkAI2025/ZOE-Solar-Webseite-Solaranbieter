import React from 'react';
import { Page } from '../types';
import HeaderLogo from './header/HeaderLogo';
import PrimaryNavigation from './header/PrimaryNavigation';
import HeaderCTA from './header/HeaderCTA';
import MobileNavigation from './header/MobileNavigation';
import { useHeader } from '../hooks/useHeader';

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

const HeaderOptimized: React.FC<HeaderProps> = ({
  currentPage,
  setPage,
  openCommandHub,
  bannerHeight,
  onHeightChange,
  onSelectHersteller,
  onSelectWissen,
  isLoggedIn,
  onLogout
}) => {
  const {
    headerRef,
    isMobileMenuOpen,
    handleLinkClick,
    openChat,
    toggleMobileMenu,
    closeMobileMenu,
  } = useHeader(currentPage, setPage, openCommandHub, onHeightChange);

  const handleSelectHersteller = (slug: string) => {
    onSelectHersteller(slug);
    closeMobileMenu();
  };

  const handleSelectWissen = (slug: string) => {
    onSelectWissen(slug);
    closeMobileMenu();
  };

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200/80 transition-all duration-300"
        style={{ top: `0px` }}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            {/* Logo Section */}
            <HeaderLogo currentPage={currentPage} onPageChange={handleLinkClick} />

            {/* Desktop Navigation */}
            <PrimaryNavigation
              currentPage={currentPage}
              onPageChange={handleLinkClick}
              onSelectHersteller={handleSelectHersteller}
              onSelectWissen={handleSelectWissen}
            />

            {/* Desktop CTA */}
            <div className="hidden md:block">
              <HeaderCTA
                openCommandHub={openCommandHub}
                openChat={openChat}
                isLoggedIn={isLoggedIn}
                onLogout={onLogout}
              />
            </div>

            {/* Mobile Menu Trigger */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={openCommandHub}
                aria-label="Suchen"
                className="p-2.5 rounded-full transition-all duration-200 text-slate-600 hover:bg-slate-100 hover:text-green-600 group"
              >
                <svg
                  className="h-6 w-6 group-hover:scale-110 transition-transform duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              <button
                onClick={toggleMobileMenu}
                className={`z-[101] p-2.5 rounded-xl transition-all duration-300 ${
                  isMobileMenuOpen
                    ? 'bg-slate-100 text-slate-800 shadow-md'
                    : 'text-slate-900 hover:bg-slate-100'
                }`}
                aria-label={isMobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
              >
                <div className={`relative w-6 h-6 flex flex-col justify-center items-center`}>
                  <span
                    className={`absolute h-0.5 w-6 bg-current transition-all duration-300 ${
                      isMobileMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'
                    }`}
                  ></span>
                  <span
                    className={`h-0.5 w-6 bg-current transition-all duration-300 ${
                      isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                    }`}
                  ></span>
                  <span
                    className={`absolute h-0.5 w-6 bg-current transition-all duration-300 ${
                      isMobileMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'
                    }`}
                  ></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNavigation
        isOpen={isMobileMenuOpen}
        currentPage={currentPage}
        onPageChange={handleLinkClick}
        onClose={closeMobileMenu}
        bannerHeight={bannerHeight}
        openCommandHub={openCommandHub}
        isLoggedIn={isLoggedIn}
        onLogout={onLogout}
      />
    </>
  );
};

export default HeaderOptimized;
import { useState, useEffect, useRef } from 'react';
import { Page } from '../types';

export const useHeader = (
  currentPage: Page,
  setPage: (page: Page, options?: { scrollToTop?: boolean }) => void,
  openCommandHub: () => void,
  onHeightChange: (height: number) => void
) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Header height tracking
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

  // Command hub keyboard shortcut
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

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleNavigationKeyDown = (event: KeyboardEvent) => {
      // Don't trigger if input field is focused
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
    return () => window.removeEventListener('keydown', handleNavigationKeyDown);
  }, [setPage]);

  const handleLinkClick = (page: Page) => {
    setPage(page);
    setIsMobileMenuOpen(false);
  };

  const openChat = () => {
    document.dispatchEvent(new CustomEvent('open-chat'));
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return {
    headerRef,
    isMobileMenuOpen,
    handleLinkClick,
    openChat,
    toggleMobileMenu,
    closeMobileMenu,
  };
};
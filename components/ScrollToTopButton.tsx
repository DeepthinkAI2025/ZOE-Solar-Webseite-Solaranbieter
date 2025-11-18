import React, { useEffect, useMemo, useState } from 'react';

interface ScrollToTopButtonProps {
  /** Scroll distance in pixels before the button is shown */
  threshold?: number;
  /** Optional label override for screen readers */
  label?: string;
  /** Allows the layout to tweak the fixed position */
  offset?: {
    bottom?: number;
    right?: number;
  };
  /** Additional Tailwind classes */
  className?: string;
  /** Optional callback when scrolling begins (e.g. screen reader announcement) */
  onScrollStart?: () => void;
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({
  threshold = 160,
  label = 'Nach oben scrollen',
  offset,
  className = '',
  onScrollStart,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const isBrowser = typeof window !== 'undefined';

  const style = useMemo(() => ({
    bottom: offset?.bottom ?? 32,
    right: offset?.right ?? 32,
  }), [offset]);

  useEffect(() => {
    if (!isBrowser) return;

    const handleScroll = () => {
      setIsVisible(window.pageYOffset > threshold);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isBrowser, threshold]);

  const scrollToTop = () => {
    if (!isBrowser) return;
    onScrollStart?.();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isBrowser) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className={`fixed z-40 rounded-full bg-primary-600 text-white p-3 shadow-lg hover:bg-primary-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-400 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0 pointer-events-none'} ${className}`.trim()}
      style={style}
      aria-label={label}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
};

export default ScrollToTopButton;

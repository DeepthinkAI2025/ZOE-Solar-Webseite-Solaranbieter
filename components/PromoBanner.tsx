import React, { useRef, useEffect } from 'react';
import { Page } from '../types';

interface PromoBannerProps {
  onHeightChange: (height: number) => void;
  setPage: (page: Page) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

const NavIcon: React.FC<{ type: 'agri-pv' | 'ueber-uns' | 'contact' | 'login' }> = ({ type }) => {
    const className = "h-4 w-4";
    const icons = {
        'agri-pv': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0 1.172 1.953 1.172 5.119 0 7.072z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3" /></svg>,
        'ueber-uns': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
        'contact': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
        'login': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    };
    return icons[type] || null;
}

const PromoBanner: React.FC<PromoBannerProps> = ({ onHeightChange, setPage, isLoggedIn, onLogout }) => {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
        if (bannerRef.current) {
            onHeightChange(bannerRef.current.offsetHeight);
        }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [onHeightChange]);
  
  const handlePromoClick = () => {
    setPage('sonderaktionen');
  };

  const navLinkClasses = "flex items-center gap-1.5 transition-colors duration-200 cursor-pointer text-slate-600 hover:text-green-600";

  return (
    <div ref={bannerRef} className="hidden md:block fixed top-0 left-0 right-0 bg-white z-[60] border-b border-slate-200">
      <div className="container mx-auto px-6 py-2 flex justify-between items-center text-sm">
        {/* Left Side: Promo Text */}
        <div className="flex items-center gap-2">
            <span>✨</span>
            <p className="font-medium text-slate-700">
              <span className="font-semibold text-slate-800">Sonderaktion:</span> Kostenlose Analyse + <span className="font-bold text-green-600">5.000 € Rabatt</span> für Anlagen ab 30 kWp!
            </p>
            <a onClick={handlePromoClick} className="ml-2 bg-green-100 text-green-700 font-bold text-xs px-3 py-1 rounded-full hover:bg-green-200 transition-colors duration-200 cursor-pointer">
                Details
            </a>
        </div>
        
        {/* Right Side: Utility Navigation */}
        <nav className="flex items-center gap-5">
            <a onClick={() => setPage('agri-pv')} className={navLinkClasses}><NavIcon type="agri-pv" /><span>Agri-PV Förderung: Bis zu 1 Mio. € Zuschuss</span></a>
            <a onClick={() => setPage('ueber-uns')} className={navLinkClasses}><NavIcon type="ueber-uns" /><span>Über uns</span></a>
            <a onClick={() => setPage('kontakt')} className={navLinkClasses}><NavIcon type="contact" /><span>Kontakt</span></a>

            <div className="pl-5 border-l border-slate-200 flex items-center gap-4">
                {isLoggedIn ? (
                    <>
                        <a onClick={() => setPage('dashboard')} className={`${navLinkClasses} font-semibold`}><NavIcon type="login" /><span>Mein Konto</span></a>
                        <a onClick={onLogout} className={`${navLinkClasses} font-semibold`}>Logout</a>
                    </>
                ) : (
                    <a onClick={() => setPage('login')} className={`${navLinkClasses} font-semibold`}><NavIcon type="login" /><span>Kunden-Login</span></a>
                )}
            </div>
        </nav>
      </div>
    </div>
  );
};

export default PromoBanner;
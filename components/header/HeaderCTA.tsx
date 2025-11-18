import React, { useState, useRef, useEffect } from 'react';

interface HeaderCTAProps {
  openCommandHub: () => void;
  openChat: () => void;
  isLoggedIn: boolean;
  onLogout?: () => void;
  onPageChange?: (page: 'login' | 'dashboard') => void;
  isMobile?: boolean;
}

const HeaderCTA: React.FC<HeaderCTAProps> = ({
  openCommandHub,
  openChat,
  isLoggedIn,
  onLogout,
  onPageChange,
  isMobile = false
}) => {
  const [isCtaDropdownOpen, setIsCtaDropdownOpen] = useState(false);
  const ctaDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ctaDropdownRef.current && !ctaDropdownRef.current.contains(event.target as Node)) {
        setIsCtaDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenChat = () => {
    openChat();
    setIsCtaDropdownOpen(false);
  };

  if (isMobile) {
    return (
      <div className="space-y-3">
        {isLoggedIn ? (
          <>
            {onPageChange && (
              <button
                onClick={() => onPageChange('dashboard')}
                className="w-full bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 font-bold py-4 px-6 rounded-xl hover:from-slate-200 hover:to-slate-300 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Mein Konto
              </button>
            )}
            {onLogout && (
              <button
                onClick={() => {
                  onLogout();
                }}
                className="w-full bg-gradient-to-r from-slate-600 to-slate-700 text-white font-bold py-4 px-6 rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            )}
          </>
        ) : (
          <>
            {onPageChange && (
              <button
                onClick={() => onPageChange('login')}
                className="w-full bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 font-bold py-4 px-6 rounded-xl hover:from-slate-200 hover:to-slate-300 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Kunden-Login
              </button>
            )}
            <div className="relative" ref={ctaDropdownRef}>
              <button
                onClick={() => setIsCtaDropdownOpen(!isCtaDropdownOpen)}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex justify-center items-center gap-3"
              >
                <span className="relative">
                  Jetzt anfragen
                  {/* Glow effect */}
                  <span className="absolute inset-0 bg-green-400 rounded-lg blur-lg opacity-50 animate-pulse"></span>
                </span>
                <svg
                  className={`w-5 h-5 transition-transform duration-300 ${isCtaDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Mobile CTA Dropdown */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isCtaDropdownOpen ? 'max-h-96 mt-3' : 'max-h-0'
                }`}
              >
                <div className="space-y-3">
                  <button
                    onClick={handleOpenChat}
                    className="w-full bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 font-bold py-4 px-6 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 border border-blue-200 flex items-center justify-center gap-3"
                  >
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Mit KI-Berater sprechen
                  </button>
                  <a
                    href="tel:+493012345678"
                    className="block text-center w-full bg-gradient-to-r from-green-50 to-green-100 text-green-800 font-bold py-4 px-6 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-300 border border-green-200 flex items-center justify-center gap-3"
                  >
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Kundenservice anrufen
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
      {/* Search Button */}
      <button
        onClick={openCommandHub}
        title="Suchen (Cmd+K)"
        aria-label="Suchen (Cmd+K)"
        className="p-2.5 rounded-full transition-all duration-200 text-slate-500 hover:bg-slate-100 hover:text-green-600 group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 group-hover:scale-110 transition-transform duration-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {/* CTA Dropdown */}
      <div ref={ctaDropdownRef} className="relative">
        <button
          onClick={() => setIsCtaDropdownOpen(!isCtaDropdownOpen)}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-2.5 px-7 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2 group"
          aria-label="Anfrage-Optionen"
        >
          <span className="relative">
            Jetzt anfragen
            {/* Premium glow effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-400 rounded-lg blur-md opacity-40 group-hover:opacity-60 transition-opacity duration-300"></span>
          </span>
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${isCtaDropdownOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Desktop CTA Dropdown */}
        <div
          className={`absolute top-full right-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden transition-all duration-300 transform origin-top-right border border-slate-200/50 ${
            isCtaDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          }`}
        >
          <div className="p-1">
            <button
              onClick={handleOpenChat}
              className="w-full text-left group flex items-start gap-4 p-4 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 transition-all duration-200 cursor-pointer rounded-lg"
            >
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-500 group-hover:scale-110 transition-transform duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {/* Online indicator */}
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 group-hover:text-green-600 transition-colors duration-200">
                  Mit KI-Berater sprechen
                </h4>
                <p className="text-sm text-slate-500">Direkt & unkompliziert Anfrage starten.</p>
              </div>
            </button>

            <a
              href="tel:+493012345678"
              className="w-full text-left group flex items-start gap-4 p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all duration-200 cursor-pointer rounded-lg border-t border-slate-200/50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-500 group-hover:scale-110 transition-transform duration-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <div>
                <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors duration-200">
                  Kundenservice anrufen
                </h4>
                <p className="text-sm text-slate-500">Für eine persönliche Beratung.</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderCTA;
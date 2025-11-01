import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Page } from '../types';

interface PromoBannerProps {
  onHeightChange: (height: number) => void;
  setPage: (page: Page) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  personalizedContent?: any;
  theme?: 'day' | 'night' | 'seasonal';
  realTimeWeather?: any;
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

const PromoBanner: React.FC<PromoBannerProps> = ({
  onHeightChange, setPage, isLoggedIn, onLogout,
  personalizedContent, theme = 'day', realTimeWeather
}) => {
  const bannerRef = useRef<HTMLDivElement>(null);

  // ===== STATE-OF-THE-ART BANNER FEATURES =====
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const [isWeatherOptimized, setIsWeatherOptimized] = useState(false);
  const [userLocation, setUserLocation] = useState<string>('');

  const promotionalMessages = [
    {
      id: 1,
      icon: '☀️',
      text: 'Sonderaktion',
      highlight: '5.000 € Rabatt',
      condition: 'für Anlagen ab 30 kWp',
      link: 'sonderaktionen',
      priority: 'high'
    },
    {
      id: 2,
      icon: '🌱',
      text: 'Agri-PV Förderung',
      highlight: 'Bis zu 1 Mio. € Zuschuss',
      condition: 'für Landwirte',
      link: 'agri-pv',
      priority: 'high'
    },
    {
      id: 3,
      icon: '🤖',
      text: 'KI-Beratung',
      highlight: 'Sofortige Analyse',
      condition: 'in nur 2 Minuten',
      link: 'photovoltaik',
      priority: 'medium'
    },
    {
      id: 4,
      icon: '🚗',
      text: 'E-Mobilität',
      highlight: 'Kombipakete',
      condition: 'Solar + Wallbox',
      link: 'e-mobilitaet',
      priority: 'medium'
    }
  ];

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

  // Auto-rotate promotional messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromoIndex((prev) => (prev + 1) % promotionalMessages.length);
    }, 5000); // Rotate every 5 seconds
    return () => clearInterval(interval);
  }, [promotionalMessages.length]);

  // Weather-based optimization
  useEffect(() => {
    if (realTimeWeather) {
      setIsWeatherOptimized(true);
      // Adjust message based on weather
      if (realTimeWeather.condition === 'sunny') {
        setCurrentPromoIndex(0); // Focus on solar savings
      } else if (realTimeWeather.condition === 'cloudy') {
        setCurrentPromoIndex(1); // Focus on subsidies
      }
    }
  }, [realTimeWeather]);

  // Get user location for personalization
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        // In a real implementation, use reverse geocoding API
        const cities = ['Berlin', 'München', 'Hamburg', 'Frankfurt', 'Köln'];
        const randomCity = cities[Math.floor(Math.random() * cities.length)];
        setUserLocation(randomCity);
      });
    }
  }, []);

  const currentPromo = promotionalMessages[currentPromoIndex];
  const isNight = theme === 'night';
  const isSeasonal = theme === 'seasonal';

  const handlePromoClick = () => {
    setPage(currentPromo.link as Page);
  };

  const getBannerThemeClasses = () => {
    if (isSeasonal && realTimeWeather) {
      return realTimeWeather.condition === 'sunny'
        ? 'bg-gradient-to-r from-amber-100 to-orange-100 border-amber-300 text-amber-900'
        : realTimeWeather.condition === 'cloudy'
        ? 'bg-gradient-to-r from-blue-100 to-slate-100 border-blue-300 text-slate-800'
        : 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-300 text-purple-900';
    }
    return isNight
      ? 'bg-slate-900/95 border-slate-700/70 text-slate-200 backdrop-blur-md'
      : 'bg-white border-slate-200 text-slate-700';
  };

  const navLinkClasses = `flex items-center gap-1.5 transition-all duration-300 cursor-pointer hover:scale-105 ${
    isNight
      ? 'text-slate-300 hover:text-emerald-400'
      : 'text-slate-600 hover:text-green-600'
  }`;

  return (
    <div
      ref={bannerRef}
      className={`hidden md:block fixed top-0 left-0 right-0 z-[60] border-b transition-all duration-500 ${getBannerThemeClasses()} shadow-sm`}
    >
      {/* Weather Indicator */}
      {realTimeWeather && (
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-pulse"></div>
      )}

      <div className="container mx-auto px-6 py-2 flex justify-between items-center text-sm">
        {/* Left Side: Dynamic Promo Text */}
        <div className="flex items-center gap-3">
          {/* Promo Icon with Animation */}
          <div className="relative">
            <span className="text-2xl animate-pulse">{currentPromo.icon}</span>
            {isWeatherOptimized && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <p className="font-medium">
              <span className="font-semibold">{currentPromo.text}:</span>{' '}
              <span className={`font-bold ${
                isNight ? 'text-emerald-400' : 'text-green-600'
              }`}>{currentPromo.highlight}</span>{' '}
              <span className="text-xs opacity-80">{currentPromo.condition}</span>
              {userLocation && (
                <span className="text-xs ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  📍 {userLocation}
                </span>
              )}
            </p>
            <button
              onClick={handlePromoClick}
              className={`ml-2 font-bold text-xs px-3 py-1 rounded-full transition-all duration-300 cursor-pointer hover:scale-105 ${
                isNight
                  ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              Details
            </button>

            {/* Progress Indicator */}
            <div className="flex gap-1 ml-3">
              {promotionalMessages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPromoIndex(index)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    index === currentPromoIndex
                      ? isNight ? 'bg-emerald-400 w-4' : 'bg-green-600 w-4'
                      : isNight ? 'bg-slate-600' : 'bg-slate-300'
                  }`}
                  aria-label={`Promo ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Side: Enhanced Utility Navigation */}
        <nav className="flex items-center gap-5">
            <a onClick={() => setPage('agri-pv')} className={navLinkClasses}>
                <NavIcon type="agri-pv" />
                <span>Agri-PV Förderung: Bis zu 1 Mio. € Zuschuss</span>
            </a>
            <a onClick={() => setPage('ueber-uns')} className={navLinkClasses}>
                <NavIcon type="ueber-uns" />
                <span>Über uns</span>
            </a>
            <a onClick={() => setPage('kontakt')} className={navLinkClasses}>
                <NavIcon type="contact" />
                <span>Kontakt</span>
            </a>

            <div className={`pl-5 flex items-center gap-4 border-l ${
              isNight ? 'border-slate-700' : 'border-slate-200'
            }`}>
                {realTimeWeather && (
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${
                      isNight ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                    }`}>
                        <span>{realTimeWeather.condition === 'sunny' ? '☀️' : '☁️'}</span>
                        <span>{realTimeWeather.temperature}°C</span>
                    </div>
                )}

                {isLoggedIn ? (
                    <>
                        <a onClick={() => setPage('dashboard')} className={`${navLinkClasses} font-semibold`}>
                            <NavIcon type="login" />
                            <span>Mein Konto</span>
                        </a>
                        <a onClick={onLogout} className={`${navLinkClasses} font-semibold`}>
                            <span>Logout</span>
                        </a>
                    </>
                ) : (
                    <a onClick={() => setPage('login')} className={`${navLinkClasses} font-semibold`}>
                        <NavIcon type="login" />
                        <span>Kunden-Login</span>
                    </a>
                )}
            </div>
        </nav>
      </div>
    </div>
  );
};

export default PromoBanner;
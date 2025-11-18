import React from 'react';
import { Page } from '../types';

interface HeaderLogoProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

const HeaderLogo: React.FC<HeaderLogoProps> = ({ currentPage, onPageChange }) => {
  const handleLogoClick = () => {
    onPageChange('home');
  };

  return (
    <div className="flex items-center gap-4">
      {/* Main Logo */}
      <div
        className="font-bold cursor-pointer text-slate-900 text-3xl transition-transform duration-300 hover:scale-105"
        onClick={handleLogoClick}
      >
        ZOE <span className="text-primary-600">Solar</span>
      </div>

      {/* Trust Badge */}
      <button
        onClick={() => onPageChange('faq-page')}
        className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition-all duration-300 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 cursor-pointer group shadow-sm hover:shadow-md"
        title="Zum Testbericht auf PhotovoltaikTest.de"
        aria-label="Testsieger-Abzeichen"
      >
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {/* Micro-pulse animation */}
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary-500 rounded-full animate-ping"></span>
        </div>
        <span className="font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
          Testsieger 2025
        </span>
      </button>
    </div>
  );
};

export default HeaderLogo;
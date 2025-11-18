import React from 'react';

interface HeaderToggleButtonProps {
  onClick: () => void;
  bannerHeight: number;
}

const HeaderToggleButton: React.FC<HeaderToggleButtonProps> = ({ onClick, bannerHeight }) => {
  return (
    <button
      onClick={onClick}
      className="fixed left-1/2 -translate-x-1/2 z-[70] bg-white/95 backdrop-blur-sm text-slate-700 px-4 py-2 rounded-b-lg shadow-md hover:bg-slate-100 transition-all duration-300 transform hover:scale-105 animate-fade-in flex items-center gap-2"
      style={{ top: `${bannerHeight}px` }}
      aria-label="Menü einblenden"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
      <span className="font-semibold text-sm">Menü einblenden</span>
    </button>
  );
};

export default HeaderToggleButton;
import React from 'react';
import { Page } from '../types';

interface EMobilitaetMegaMenuProps {
  setPage: (page: Page) => void;
  closeMenu: () => void;
}

const EMobilitaetMegaMenu: React.FC<EMobilitaetMegaMenuProps> = ({ setPage, closeMenu }) => {

  const handleLinkClick = (page: Page) => {
    setPage(page);
    closeMenu();
  };

  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[768px]">
        <div className="bg-white/95 backdrop-blur-lg shadow-lg rounded-lg border border-slate-200/50 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left Column */}
                <div className="p-6 border-r border-slate-200">
                    <h3 className="font-bold text-slate-500 uppercase tracking-wider text-sm mb-4 px-3">Ladeinfrastruktur</h3>
                    <div className="space-y-1">
                        <a onClick={() => handleLinkClick('service-ladeparks')} className="group flex items-start gap-4 p-3 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                           <div className="flex-shrink-0 pt-1">
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
                           </div>
                           <div>
                               <h4 className="font-bold text-slate-800">Ladeparks & Wallboxen</h4>
                               <p className="text-sm text-slate-500">Skalierbare Ladelösungen für Flotten, Mitarbeiter und Kunden.</p>
                           </div>
                        </a>
                         <a onClick={() => handleLinkClick('service-anmeldung-ladestationen')} className="group flex items-start gap-4 p-3 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                           <div className="flex-shrink-0 pt-1">
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM10.5 12h3.75" /></svg>
                           </div>
                           <div>
                               <h4 className="font-bold text-slate-800">Anmeldung & Anträge</h4>
                               <p className="text-sm text-slate-500">Informationen zu Netzanschluss und Betreiberpflichten.</p>
                           </div>
                        </a>
                    </div>
                    <div className="pt-4 mt-4 border-t border-slate-200/80">
                         <a onClick={() => handleLinkClick('e-mobilitaet')} className="group p-3 rounded-lg hover:bg-slate-200/50 transition-colors duration-200 cursor-pointer flex items-center justify-between text-slate-600 font-semibold">
                            <span>Übersicht E-Mobilität</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </a>
                    </div>
                </div>
                {/* Right Column */}
                <div className="bg-slate-50/70 p-6 flex flex-col justify-center">
                    <h3 className="font-bold text-slate-500 uppercase tracking-wider text-sm mb-4 px-3">Top-Komponenten</h3>
                    <p className="text-sm text-slate-600 mb-4 px-3">
                        Wir setzen auf bewährte Ladelösungen von Marktführern für maximale Zuverlässigkeit.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-center justify-center h-20"><img src="/assets/logos/wallbox.png" alt="Wallbox" className="max-h-12 w-auto" /></div>
                        <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-center justify-center h-20"><img src="/assets/logos/keba.png" alt="Keba" className="max-h-12 w-auto" /></div>
                        <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-center justify-center h-20"><img src="/assets/logos/mennekes.png" alt="Mennekes" className="max-h-12 w-auto" /></div>
                        <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-center justify-center h-20"><img src="/assets/logos/alpitronic.png" alt="Alpitronic" className="max-h-12 w-auto" /></div>
                    </div>
                     <div className="pt-4 mt-4 border-t border-slate-200/80">
                         <a onClick={() => handleLinkClick('produkte')} className="group p-3 rounded-lg hover:bg-slate-200/50 transition-colors duration-200 cursor-pointer flex items-center justify-between text-slate-600 font-semibold">
                            <span>Alle Produkte anzeigen</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default EMobilitaetMegaMenu;
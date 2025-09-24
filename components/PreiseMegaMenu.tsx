import React from 'react';
import { Page } from '../types';

interface PreiseMegaMenuProps {
  setPage: (page: Page) => void;
  closeMenu: () => void;
}

const PreiseMegaMenu: React.FC<PreiseMegaMenuProps> = ({ setPage, closeMenu }) => {

  const handleLinkClick = (page: Page) => {
    setPage(page);
    closeMenu();
  };

  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[768px]">
        <div className="bg-white/95 backdrop-blur-lg shadow-lg rounded-lg border border-slate-200/50 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left Column */}
                <div className="p-6">
                    <h3 className="font-bold text-slate-500 uppercase tracking-wider text-sm mb-4 px-3">Preisgestaltung & Pakete</h3>
                    <div className="space-y-1">
                        <a onClick={() => handleLinkClick('preise')} className="group flex items-start gap-4 p-3 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                           <div className="flex-shrink-0 pt-1">
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" /></svg>
                           </div>
                           <div>
                               <h4 className="font-bold text-slate-800">Pakete & Preise</h4>
                               <p className="text-sm text-slate-500">Transparente Festpreise für Privat & Gewerbe.</p>
                           </div>
                        </a>
                         <a onClick={() => handleLinkClick('finanzierung')} className="group flex items-start gap-4 p-3 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                           <div className="flex-shrink-0 pt-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                           </div>
                           <div>
                               <h4 className="font-bold text-slate-800">Finanzierung & Förderung</h4>
                               <p className="text-sm text-slate-500">Alle Infos zu KfW, IBB, BAFA und 0€ Anzahlung.</p>
                           </div>
                        </a>
                        <a onClick={() => handleLinkClick('foerdermittel-check')} className="group flex items-start gap-4 p-3 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                           <div className="flex-shrink-0 pt-1">
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33" /></svg>
                           </div>
                           <div>
                               <h4 className="font-bold text-slate-800">Digitaler Förder-Check</h4>
                               <p className="text-sm text-slate-500">Schnelle Ersteinschätzung Ihrer Möglichkeiten.</p>
                           </div>
                        </a>
                    </div>
                </div>

                {/* Right Column */}
                <div className="bg-slate-50/70 p-6 flex flex-col justify-center">
                    <h3 className="font-bold text-slate-500 uppercase tracking-wider text-sm mb-4 px-3">Top-Förderbanken</h3>
                     <ul className="space-y-3">
                        <li><a onClick={() => handleLinkClick('foerdermittel-kfw')} className="text-slate-700 hover:text-green-600 transition-colors duration-200 cursor-pointer flex items-center gap-2 text-sm"><span className="text-green-500">&rarr;</span>KfW-Bankengruppe</a></li>
                        <li><a onClick={() => handleLinkClick('foerdermittel-ibb')} className="text-slate-700 hover:text-green-600 transition-colors duration-200 cursor-pointer flex items-center gap-2 text-sm"><span className="text-green-500">&rarr;</span>IBB (Investitionsbank Berlin)</a></li>
                        <li><a onClick={() => handleLinkClick('foerdermittel-bafa')} className="text-slate-700 hover:text-green-600 transition-colors duration-200 cursor-pointer flex items-center gap-2 text-sm"><span className="text-green-500">&rarr;</span>BAFA (Bundesamt)</a></li>
                    </ul>
                     <div className="pt-4 mt-4 border-t border-slate-200/80">
                         <a onClick={() => handleLinkClick('sonderaktionen')} className="group p-3 rounded-lg hover:bg-slate-200/50 transition-colors duration-200 cursor-pointer flex items-center justify-between text-yellow-600 font-semibold">
                            <span>Zu den Sonderaktionen</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default PreiseMegaMenu;
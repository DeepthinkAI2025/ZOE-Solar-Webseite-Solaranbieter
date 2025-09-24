import React from 'react';
import { Page } from '../types';

interface ElektroMegaMenuProps {
  setPage: (page: Page) => void;
  closeMenu: () => void;
}

const coreServices = [
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-slate-500 group-data-[active=true]:text-green-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
        title: 'Netzanschlüsse',
        page: 'service-netzanschluss' as Page,
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-slate-500 group-data-[active=true]:text-green-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10.5 11.25h3M12 15h.008" /></svg>,
        title: 'Verteilerbau & Umbau',
        page: 'service-verteilerbau' as Page,
    },
     {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-slate-500 group-data-[active=true]:text-green-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>,
        title: 'Zählerplatz & Messkonzepte',
        page: 'service-zaehlerbau' as Page,
    }
];


const ElektroMegaMenu: React.FC<ElektroMegaMenuProps> = ({ setPage, closeMenu }) => {

  const handleServiceClick = (page: Page) => {
    setPage(page);
    closeMenu();
  };

  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[768px]">
        <div className="bg-white/95 backdrop-blur-lg shadow-lg rounded-lg border border-slate-200/50 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left Column */}
                <div className="p-6 border-r border-slate-200">
                    <h3 className="font-bold text-slate-500 uppercase tracking-wider text-sm mb-4 px-3">Elektro-Fachleistungen</h3>
                    <div className="space-y-1">
                        {coreServices.map(item => (
                            <a
                                key={item.page}
                                onClick={() => handleServiceClick(item.page)}
                                className="group flex items-center gap-4 p-3 rounded-lg transition-colors duration-200 cursor-pointer hover:bg-slate-100"
                            >
                                <div className="flex-shrink-0 bg-slate-100 group-hover:bg-green-100 p-3 rounded-lg transition-colors">{item.icon}</div>
                                <div>
                                    <h4 className="font-bold text-slate-800">{item.title}</h4>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Right Column */}
                <div className="p-8 bg-slate-50/70 flex flex-col items-center justify-center text-center">
                   <div className="bg-white p-4 rounded-full border border-slate-200 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                   </div>
                    <h3 className="font-bold text-slate-800 text-xl mt-4">Sicherheit & Normen</h3>
                    <p className="text-sm text-slate-600 mt-2">
                        Alle Elektroarbeiten werden von unseren zertifizierten Meisterbetrieben nach höchsten VDE-Standards durchgeführt.
                    </p>
                     <div className="pt-4 mt-4 border-t border-slate-200/80 w-full">
                         <a onClick={() => handleServiceClick('elektro')} className="group p-3 rounded-lg hover:bg-slate-200/50 transition-colors duration-200 cursor-pointer flex items-center justify-between text-slate-600 font-semibold">
                            <span>Übersicht Elektro</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ElektroMegaMenu;
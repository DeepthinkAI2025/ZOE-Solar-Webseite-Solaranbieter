import React from 'react';
import { Page } from '../types';

interface PhotovoltaikMegaMenuProps {
  setPage: (page: Page) => void;
  closeMenu: () => void;
}

const coreServices = [
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-slate-500 group-data-[active=true]:text-green-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6.75M9 11.25h6.75M9 15.75h6.75M9 20.25h6.75" /></svg>,
        title: 'Photovoltaik für Gewerbe',
        page: 'service-photovoltaik' as Page,
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-slate-500 group-data-[active=true]:text-green-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M4.5 10.5H18V15H4.5v-4.5zM3.75 18h15A2.25 2.25 0 0021 15.75v-6.375A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25v6.375A2.25 2.25 0 005.25 18h-1.5z" /></svg>,
        title: 'Industrielle Speicher',
        page: 'service-speicher' as Page,
    },
];

const specialServices = [
    { title: 'Agri-PV', page: 'agri-pv' as Page },
    { title: 'Innovative Technologien', page: 'innovations' as Page },
    { title: 'Wartung & Service', page: 'wartung-service' as Page },
    { title: 'Anmeldung & Anträge', page: 'service-anmeldung-pv' as Page },
];
const gewerbeCluster = [
    { title: 'Gewerbe Photovoltaik', page: 'photovoltaik-gewerbe' as Page },
    { title: 'Wirtschaftlichkeitsrechner', page: 'photovoltaik-rechner-gewerbe' as Page },
    { title: 'Gewerbe-Planung', page: 'photovoltaik-planung-gewerbe' as Page },
    { title: 'Gewerbegebäude', page: 'photovoltaik-gewerbegebaeude' as Page },
];

const PhotovoltaikMegaMenu: React.FC<PhotovoltaikMegaMenuProps> = ({ setPage, closeMenu }) => {

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
                    <h3 className="font-bold text-slate-500 uppercase tracking-wider text-sm mb-4 px-3">Kernkompetenzen</h3>
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
                <div className="p-6 bg-slate-50/70">
                    <h3 className="font-bold text-slate-500 uppercase tracking-wider text-sm mb-4 px-3">Spezial-Lösungen & Services</h3>
                    <ul className="space-y-3">
                        {specialServices.map(service => (
                            <li key={service.page}>
                                <a onClick={() => handleServiceClick(service.page)} className="text-slate-700 hover:text-green-600 transition-colors duration-200 cursor-pointer flex items-center gap-2 text-sm">
                                    <span className="text-green-500">&rarr;</span>
                                    {service.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                     <div className="pt-4 mt-4 border-t border-slate-200/80">
                         <a onClick={() => handleServiceClick('photovoltaik')} className="group p-3 rounded-lg hover:bg-slate-200/50 transition-colors duration-200 cursor-pointer flex items-center justify-between text-slate-600 font-semibold">
                            <span>Alle PV-Leistungen</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default PhotovoltaikMegaMenu;
import React from 'react';
import { Page } from '../types';

interface ServiceNavigationProps {
    currentPage: Page;
    setPage: (page: Page) => void;
}

const services: { page: Page; title: string; icon: React.ReactNode }[] = [
    {
        page: 'service-photovoltaik',
        title: 'Photovoltaik Gewerbe',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
    },
    {
        page: 'service-ladeparks',
        title: 'Ladeparks & E-Mobilität',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
    },
    {
        page: 'service-speicher',
        title: 'Industrielle Speicher',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M4.5 10.5H18V15H4.5v-4.5zM3.75 18h15A2.25 2.25 0 0021 15.75v-6.375A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25v6.375A2.25 2.25 0 005.25 18h-1.5z" /></svg>
    }
];

const ServiceNavigation: React.FC<ServiceNavigationProps> = ({ currentPage, setPage }) => {
    return (
        <aside className="lg:col-span-1">
            <div className="sticky top-28 bg-white p-4 rounded-lg shadow-md border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4 px-2">Leistungsbereiche</h3>
                <nav className="space-y-1">
                    {services.map(service => (
                        <button
                            key={service.page}
                            onClick={() => setPage(service.page)}
                            className={`w-full flex items-center gap-4 p-3 rounded-md text-left font-semibold transition-colors duration-200 ${
                                currentPage === service.page
                                    ? 'bg-green-100 text-green-800'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                        >
                            <span className={currentPage === service.page ? 'text-green-600' : 'text-slate-500'}>{service.icon}</span>
                            <span>{service.title}</span>
                        </button>
                    ))}
                </nav>
            </div>
        </aside>
    );
};

export default ServiceNavigation;

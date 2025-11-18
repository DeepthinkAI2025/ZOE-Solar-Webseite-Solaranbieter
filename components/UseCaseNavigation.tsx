import React from 'react';
import { useCasesData } from '../data/useCases';

const NavIcon: React.FC<{ name: string }> = ({ name }) => {
    const className = "w-6 h-6";
    const strokeWidth = 1.5;
    const icons: { [key: string]: React.ReactNode } = {
        'roof': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18" /></svg>,
        'storage': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M4.5 10.5H18V15H4.5v-4.5zM3.75 18h15A2.25 2.25 0 0021 15.75v-6.375A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25v6.375A2.25 2.25 0 005.25 18h-1.5z" /></svg>,
        'charging': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
        'carport': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5v-1.875a3.375 3.375 0 003.375-3.375h1.5a1.125 1.125 0 011.125 1.125v-1.5a3.375 3.375 0 00-3.375-3.375H3.375z" /></svg>,
        'open-space': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>,
        'agri-pv': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>,
        'tenant-power': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962A3.375 3.375 0 0110.5 9.75v-.75a3.375 3.375 0 013.375-3.375s-1.543.425-2.25 1.5c-.296.346-.45.743-.45 1.125v.75m-3.375 0c-.296.346-.45.743-.45 1.125v.75m-3.375 0c-.296.346-.45.743-.45 1.125v.75M6.375 12v.75a3.375 3.375 0 01-3.375 3.375c-1.386 0-2.595-.57-3.375-1.5m15.75-3.375c.296-.346.45-.743.45-1.125v-.75m3.375 0c-.296-.346.45-.743.45-1.125v-.75m3.375 0c-.296-.346.45-.743.45-1.125v-.75M9 12.75h6" /></svg>,
        'grid': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M15.75 3v1.5m0 16.5v-1.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 3C4.204 3 3 10.193 3 12c0 1.807 1.204 9 9 9s9-7.193 9-9c0-1.807-1.204-9-9-9z" /></svg>
    };
    return icons[name] || null;
};

interface UseCaseNavigationProps {
    currentUseCaseSlug: string;
    onSelectAnwendungsfall: (slug: string) => void;
}

const UseCaseNavigation: React.FC<UseCaseNavigationProps> = ({ currentUseCaseSlug, onSelectAnwendungsfall }) => {
    return (
        <aside>
            <div className="bg-white p-4 rounded-lg shadow-md border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4 px-2">Branchen-Lösungen</h3>
                <nav className="space-y-1">
                    {useCasesData.map(useCase => (
                        <button
                            key={useCase.id}
                            onClick={() => onSelectAnwendungsfall(useCase.id)}
                            className={`w-full flex items-center gap-4 p-3 rounded-md text-left font-semibold transition-colors duration-200 ${
                                currentUseCaseSlug === useCase.id
                                    ? 'bg-green-100 text-green-800'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                        >
                            <span className={currentUseCaseSlug === useCase.id ? 'text-green-600' : 'text-slate-500'}>
                               <NavIcon name={useCase.solutions[0].icon} />
                            </span>
                            <span>{useCase.title}</span>
                        </button>
                    ))}
                </nav>
            </div>
        </aside>
    );
};

export default UseCaseNavigation;
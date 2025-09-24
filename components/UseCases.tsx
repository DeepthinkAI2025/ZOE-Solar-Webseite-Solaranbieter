import React from 'react';
import { useCasesData, UseCase } from '../data/useCases';
import { Page } from '../types';

// FIX: Corrected the component to display Use Cases and accept props. Preserved SolutionIcon export for other components.
export const SolutionIcon: React.FC<{ name: string }> = ({ name }) => {
    const className = "h-6 w-6 text-green-600";
    const strokeWidth = 1.5;
    const icons: { [key: string]: React.ReactNode } = {
        'roof': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18" /></svg>,
        'storage': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M4.5 10.5H18V15H4.5v-4.5zM3.75 18h15A2.25 2.25 0 0021 15.75v-6.375A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25v6.375A2.25 2.25 0 005.25 18h-1.5z" /></svg>,
        'charging': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
        'carport': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5v-1.875a3.375 3.375 0 003.375-3.375h1.5a1.125 1.125 0 011.125 1.125v-1.5a3.375 3.375 0 00-3.375-3.375H3.375z" /></svg>,
        'open-space': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>,
        'agri-pv': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>,
        'tenant-power': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962A3.375 3.375 0 0110.5 9.75v-.75a3.375 3.375 0 013.375-3.375s-1.543.425-2.25 1.5c-.296.346-.45.743-.45 1.125v.75m-3.375 0c-.296.346-.45.743-.45 1.125v.75m-3.375 0c-.296.346-.45.743-.45 1.125v.75M6.375 12v.75a3.375 3.375 0 01-3.375 3.375c-1.386 0-2.595-.57-3.375-1.5m15.75-3.375c.296-.346.45-.743.45-1.125v-.75m3.375 0c-.296-.346.45-.743.45-1.125v-.75m3.375 0c-.296-.346.45-.743.45-1.125v-.75M9 12.75h6" /></svg>,
        'revenue': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>,
        'tech': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3m16.5 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008z" /></svg>,
        'grid': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M15.75 3v1.5m0 16.5v-1.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 3C4.204 3 3 10.193 3 12c0 1.807 1.204 9 9 9s9-7.193 9-9c0-1.807-1.204-9-9-9z" /></svg>
    };
    return icons[name] || null;
};

interface UseCasesProps {
    onSelectAnwendungsfall: (slug: string) => void;
    setPage: (page: Page) => void;
}

const UseCaseCard: React.FC<{ useCase: UseCase, onSelect: () => void }> = ({ useCase, onSelect }) => (
    <div onClick={onSelect} className="group bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col cursor-pointer hover:shadow-2xl hover:border-green-300 h-full">
        <div className="overflow-hidden relative">
            <img
                src={useCase.imageUrl}
                alt={useCase.title}
                loading="lazy"
                decoding="async"
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
            />
        </div>
        <div className="p-6 flex flex-col flex-grow">
            <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-green-600 transition-colors duration-300">{useCase.title}</h2>
            <h3 className="text-lg font-semibold text-green-700 mb-3">{useCase.headline}</h3>
            <p className="text-slate-600 text-sm mb-4 flex-grow">{useCase.description}</p>
            <div className="self-start font-bold text-green-600 group-hover:text-green-700 transition-colors mt-auto">
                Details ansehen <span className="inline-block transform group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
            </div>
        </div>
    </div>
);


const UseCases: React.FC<UseCasesProps> = ({ onSelectAnwendungsfall, setPage }) => {
    const duplicatedUseCases = [...useCasesData, ...useCasesData];

    return (
        <section id="anwendungsfaelle" className="py-20 bg-slate-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16 max-w-4xl mx-auto">
                    <p className="font-bold text-green-600 uppercase tracking-wider">Lösungen nach Maß</p>
                    <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mt-2">Für jede Branche die richtige Energielösung.</h2>
                    <p className="text-lg text-slate-600 mt-4">
                        Jede Branche hat einzigartige Anforderungen. Wir entwickeln maßgeschneiderte Konzepte, die nicht nur Kosten senken, sondern echten Mehrwert schaffen.
                    </p>
                </div>
            </div>

            <div className="relative group cursor-pointer">
                <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-slate-50 to-transparent z-10"></div>
                <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-slate-50 to-transparent z-10"></div>
                
                <div className="flex animate-infinite-scroll group-hover:[animation-play-state:paused]" style={{ animationDuration: '90s' }}>
                    {duplicatedUseCases.map((useCase, index) => (
                        <div key={`${useCase.id}-${index}`} className="w-[380px] flex-shrink-0 mx-4">
                            <UseCaseCard 
                                useCase={useCase}
                                onSelect={() => onSelectAnwendungsfall(useCase.id)}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mt-16">
                    <button onClick={() => setPage('anwendungsfaelle')} className="bg-green-600 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-xl cta-button-glow transform hover:-translate-y-1 cursor-pointer">
                        Alle Branchenlösungen ansehen
                    </button>
                </div>
            </div>
        </section>
    );
};

export default UseCases;

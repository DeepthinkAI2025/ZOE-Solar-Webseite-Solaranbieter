import React, { useState } from 'react';
import { Page } from '../types';
import { useCasesData, UseCase } from '../data/useCases';
import { SolutionIcon } from '../components/UseCases';

interface AnwendungsfaelleMegaMenuProps {
  setPage: (page: Page) => void;
  onSelectAnwendungsfall: (slug: string) => void;
}

const AnwendungsfaelleMegaMenu: React.FC<AnwendungsfaelleMegaMenuProps> = ({ setPage, onSelectAnwendungsfall }) => {
  const [activeUseCase, setActiveUseCase] = useState<UseCase | null>(useCasesData[0] || null);

  const handleLinkClick = (page: Page) => {
    setPage(page);
  };
  
  const handleUseCaseSelect = (slug: string) => {
    onSelectAnwendungsfall(slug);
  };

  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[1024px]">
        <div className="bg-white/95 backdrop-blur-lg shadow-lg rounded-lg border border-slate-200/50 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Left Column: List of Use Cases */}
            <div className="md:col-span-1 bg-slate-50 p-6 border-r border-slate-200">
              <h3 className="font-bold text-slate-500 uppercase tracking-wider text-sm mb-4">Lösungen für Ihre Branche</h3>
              <div className="space-y-2">
                {useCasesData.map(useCase => (
                  <a 
                    key={useCase.id} 
                    onMouseEnter={() => setActiveUseCase(useCase)}
                    onClick={() => handleUseCaseSelect(useCase.id)} 
                    className={`group flex items-center gap-4 p-3 rounded-lg transition-colors duration-200 cursor-pointer ${activeUseCase?.id === useCase.id ? 'bg-white shadow-sm' : 'hover:bg-slate-200/50'}`}
                  >
                    <div className="flex-shrink-0">
                       <SolutionIcon name={useCase.solutions[0].icon} />
                    </div>
                    <div>
                      <h4 className={`font-bold transition-colors duration-200 ${activeUseCase?.id === useCase.id ? 'text-green-600' : 'text-slate-800'}`}>{useCase.title}</h4>
                    </div>
                  </a>
                ))}
              </div>
               <div className='border-t border-slate-200 my-6'></div>
               <a onClick={() => handleLinkClick('anwendungsfaelle')} className="group p-3 rounded-lg hover:bg-slate-200/50 transition-colors duration-200 cursor-pointer flex items-center justify-between text-slate-600 font-semibold">
                <span>Alle Anwendungsfälle</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </div>
            
            {/* Right Column: Featured Use Case */}
            {activeUseCase && (
                <div className="md:col-span-2 bg-white p-8">
                    <p className="font-bold text-slate-500 uppercase tracking-wider text-sm mb-4">Featured Anwendungsfall</p>
                    <div className="relative h-40 rounded-lg overflow-hidden mb-4">
                        <img src={activeUseCase.imageUrl} alt={activeUseCase.title} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-bold text-2xl text-green-600 mb-2">{activeUseCase.title}</h3>
                    <p className="text-slate-600 text-sm mb-4">
                        {activeUseCase.description}
                    </p>
                    <button onClick={() => handleUseCaseSelect(activeUseCase.id)} className="mt-2 text-green-600 font-bold text-sm hover:text-green-700 transition-colors group flex items-center">
                        Mehr zu dieser Lösung
                        <span className="inline-block transform group-hover:translate-x-1 transition-transform ml-1">&rarr;</span>
                    </button>
                </div>
            )}
          </div>
        </div>
    </div>
  );
};

export default AnwendungsfaelleMegaMenu;

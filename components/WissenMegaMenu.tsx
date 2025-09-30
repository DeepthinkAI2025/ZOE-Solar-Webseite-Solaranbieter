import React, { useState } from 'react';
import { Page } from '../types';
import { articles, Article } from '../data/articles';
import { guides } from '../data/guidesData';
import { glossarData, GlossarItem } from '../data/glossarData';

interface WissenMegaMenuProps {
  setPage: (page: Page) => void;
  onSelectWissen: (slug: string) => void; 
  closeMenu: () => void;
}

interface FaqFeaturedItem {
    term: string;
    definition: string;
}

type WissenDataItem = {
    id: string;
    icon: React.ReactNode;
    title: string;
    page: Page;
    featured: {
        type: 'guide' | 'article' | 'glossar' | 'faq';
        item: Guide | Article | GlossarItem | FaqFeaturedItem | undefined;
    };
};

const wissenData: WissenDataItem[] = [
  {
    id: 'hub',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-slate-500 group-data-[active=true]:text-green-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>,
    title: 'Wissens-Hub',
    page: 'wissens-hub',
    featured: {
        type: 'guide',
        item: guides[0], // Featured Guide
    }
  },
   {
     id: 'magazin',
     icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-slate-500 group-data-[active=true]:text-green-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>,
     title: 'Magazin & Aktuelles',
     page: 'magazin',
    featured: {
        type: 'article',
        item: articles.find(a => a.slug === 'auszeichnung-bester-solaranbieter-2025') || articles[0],
    }
  },
  {
    id: 'glossar',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-slate-500 group-data-[active=true]:text-green-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>,
    title: 'Solar-Glossar',
    page: 'glossar',
    featured: {
        type: 'glossar',
        item: glossarData.find(g => g.term === 'Amortisationszeit'),
    }
  },
  {
    id: 'faq',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-slate-500 group-data-[active=true]:text-green-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>,
    title: 'FAQ & Häufige Fragen',
    page: 'faq-page',
    featured: {
        type: 'faq',
        item: {
            term: 'Was unterscheidet ZOE Solar von anderen Anbietern?',
            definition: 'Drei wesentliche Punkte: 1. Herstellerunabhängigkeit für Ihre maximale Rendite. 2. Eigene, zertifizierte Expertenteams. 3. Ein fester Ansprechpartner für alles.'
        }
    }
  },
  {
    id: 'diy-hub',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-slate-500 group-data-[active=true]:text-green-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.472-2.472a3.375 3.375 0 000-4.773L6.75 3.75l-4.773 0a3.375 3.375 0 00-4.773 4.773l2.472 2.472" /></svg>,
    title: 'DIY-Hub & Services',
    page: 'diy-hub',
    featured: {
        type: 'guide',
        item: guides.find(g => g.slug === 'checkliste-solardach'),
    }
  }
];

export const WissenMegaMenu: React.FC<WissenMegaMenuProps> = ({ setPage, onSelectWissen, closeMenu }) => {
  const [activeItem, setActiveItem] = useState(wissenData[0]);
  
  const handleSelect = (id: string, page: Page, slug?: string) => {
    if (page === 'article-detail' && slug) {
        document.dispatchEvent(new CustomEvent('select-article', { detail: slug }));
    } else if (page === 'guide-detail' && slug) {
        document.dispatchEvent(new CustomEvent('select-guide', { detail: slug }));
    } else if (page === 'diy-hub') {
        setPage('diy-hub');
    } else {
        onSelectWissen(id);
    }
    closeMenu();
  };

  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[1024px]">
        <div className="bg-white/95 backdrop-blur-lg shadow-lg rounded-lg border border-slate-200/50 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3">
                {/* Left Column */}
                <div className="md:col-span-1 bg-slate-50 p-6 border-r border-slate-200">
                    <h3 className="font-bold text-slate-500 uppercase tracking-wider text-sm mb-4 px-3">Wissensbereiche</h3>
                    <div className="space-y-1">
                        {wissenData.map(item => (
                            <a
                                key={item.id}
                                onMouseEnter={() => setActiveItem(item)}
                                onClick={() => handleSelect(item.id, item.page)}
                                data-active={activeItem.id === item.id}
                                className="group flex items-center gap-4 p-3 rounded-lg transition-colors duration-200 cursor-pointer data-[active=true]:bg-white data-[active=true]:shadow-sm hover:bg-slate-200/50"
                            >
                                <div className="flex-shrink-0">{item.icon}</div>
                                <div>
                                    <h4 className={`font-bold transition-colors duration-200 ${activeItem.id === item.id ? 'text-green-600' : 'text-slate-800'}`}>{item.title}</h4>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
                {/* Right Column: Featured Item */}
                <div className="md:col-span-2 p-8">
                    {activeItem && activeItem.featured.item && (
                        <div className="animate-fade-in">
                            <h3 className="font-bold text-slate-500 uppercase tracking-wider text-sm mb-4">Featured {activeItem.featured.type}</h3>
                            {activeItem.featured.type === 'guide' || activeItem.featured.type === 'article' ? (
                                <>
                                    <div className="relative h-40 rounded-lg overflow-hidden mb-4">
                                        <img src={(activeItem.featured.item as Article | Guide).imageUrl} alt={(activeItem.featured.item as Article | Guide).title} className="w-full h-full object-cover" />
                                    </div>
                                    <h4 className="font-bold text-xl text-green-600 mb-2">{(activeItem.featured.item as Article | Guide).title}</h4>
                                    {/* FIX: Use a type guard to access 'excerpt' on Article or 'description' on Guide. */}
                                    <p className="text-slate-600 text-sm mb-4">{'excerpt' in activeItem.featured.item ? (activeItem.featured.item as Article).excerpt : (activeItem.featured.item as Guide).description}</p>
                                    <button onClick={() => handleSelect(activeItem.id, activeItem.page, (activeItem.featured.item as Article | Guide).slug)} className="text-green-600 font-bold text-sm hover:text-green-700 transition-colors group flex items-center">
                                        Weiterlesen <span className="inline-block transform group-hover:translate-x-1 transition-transform ml-1">&rarr;</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h4 className="font-bold text-xl text-green-600 mb-2">{(activeItem.featured.item as GlossarItem | FaqFeaturedItem).term}</h4>
                                    <p className="text-slate-600 text-sm mb-4">{(activeItem.featured.item as GlossarItem | FaqFeaturedItem).definition}</p>
                                    <button onClick={() => handleSelect(activeItem.id, activeItem.page)} className="text-green-600 font-bold text-sm hover:text-green-700 transition-colors group flex items-center">
                                        Mehr erfahren <span className="inline-block transform group-hover:translate-x-1 transition-transform ml-1">&rarr;</span>
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};
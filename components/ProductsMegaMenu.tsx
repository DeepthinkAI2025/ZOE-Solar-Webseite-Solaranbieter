import React, { useState } from 'react';
import { Page } from '../types';
import { productCatalog } from '../data/products.generated';
import { ProductCategory } from '../data/productTypes';

interface ProductsMegaMenuProps {
  setPage: (page: Page) => void;
  onSelectHersteller: (slug: string) => void;
}

const CategoryIcon: React.FC<{ name: string; isActive: boolean }> = ({ name, isActive }) => {
    const className = `h-7 w-7 transition-colors ${isActive ? 'text-green-600' : 'text-slate-500'}`;
    const strokeWidth = 1.5;

    const icons: { [key: string]: React.ReactNode } = {
        'Module': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>,
        'Wechselrichter': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 100 15 7.5 7.5 0 000-15z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" /></svg>,
        'Speicher': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M4.5 10.5H18V15H4.5v-4.5zM3.75 18h15A2.25 2.25 0 0021 15.75v-6.375A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25v6.375A2.25 2.25 0 005.25 18h-1.5z" /></svg>,
        'Ladestationen': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
        'Unterkonstruktion': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.472-2.472a3.375 3.375 0 000-4.773L6.75 3.75l-4.773 0a3.375 3.375 0 00-4.773 4.773l2.472 2.472" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 1.5l6 6" /></svg>,
        'Elektrokomponenten': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>,
        'Leistungsoptimierer': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
    };

    return icons[name] || null;
};

const { allCategories, manufacturers } = productCatalog;

const ProductsMegaMenu: React.FC<ProductsMegaMenuProps> = ({ setPage, onSelectHersteller }) => {
    const [activeCategory, setActiveCategory] = useState<ProductCategory>(allCategories[0]);
    const manufacturersForCategory = manufacturers.filter(m => m.category.includes(activeCategory));

  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[896px]">
        <div className="bg-white/95 backdrop-blur-lg shadow-lg rounded-lg border border-slate-200/50 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3">
                {/* Left Column: Categories */}
                <div className="md:col-span-1 bg-slate-50 p-6 border-r border-slate-200">
                    <h3 className="font-bold text-slate-500 uppercase tracking-wider text-sm mb-4 px-3">Produktkategorien</h3>
                    <div className="space-y-1">
                        {allCategories.map(category => (
                            <a 
                                key={category} 
                                onMouseEnter={() => setActiveCategory(category)}
                                onClick={() => setPage('produkte')} 
                                data-active={activeCategory === category}
                                className="group flex items-center gap-4 p-3 rounded-lg transition-colors duration-200 cursor-pointer data-[active=true]:bg-white data-[active=true]:shadow-sm hover:bg-slate-200/50"
                            >
                                <div className="flex-shrink-0"><CategoryIcon name={category} isActive={activeCategory === category} /></div>
                                <div>
                                    <h4 className={`font-bold transition-colors duration-200 ${activeCategory === category ? 'text-green-600' : 'text-slate-800'}`}>{category}</h4>
                                </div>
                            </a>
                        ))}
                    </div>
                     <div className='border-t border-slate-200 my-6'></div>
                    <a onClick={() => setPage('produkte')} className="group p-3 rounded-lg hover:bg-slate-200/50 transition-colors duration-200 cursor-pointer flex items-center justify-between text-slate-600 font-semibold">
                        <span>Alle Produkte anzeigen</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </a>
                </div>

                {/* Right Column: Manufacturers */}
                <div className="md:col-span-2 p-8">
                    <h3 className="font-bold text-slate-500 uppercase tracking-wider text-sm mb-4">Unsere Premium-Partner für: <span className="text-green-600">{activeCategory}</span></h3>
                    {manufacturersForCategory.length > 0 ? (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                            {manufacturersForCategory.map(man => (
                                <a 
                                    key={man.slug}
                                    onClick={() => onSelectHersteller(man.slug)}
                                    className="group flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-lg h-32 transition-all duration-300 hover:shadow-xl hover:border-green-300 hover:-translate-y-1 cursor-pointer"
                                >
                                    <img src={man.logoUrl} alt={man.name} className="max-h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full bg-slate-50 rounded-lg">
                            <p className="text-slate-500">Für diese Kategorie sind keine Partner hinterlegt.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default ProductsMegaMenu;

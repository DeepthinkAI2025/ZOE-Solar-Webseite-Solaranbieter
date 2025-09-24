import React, { useState, useMemo } from 'react';
import { manufacturers, Product, ProductCategory } from '../data/products';
import { Page } from '../types';

interface ProductsPreviewProps {
    setPage: (page: Page) => void;
    onSelectHersteller: (slug: string) => void;
}

const featuredCategories: ProductCategory[] = ['Module', 'Wechselrichter', 'Speicher', 'Ladestationen'];

const CategoryIcon: React.FC<{ name: string; }> = ({ name }) => {
    const className = `h-6 w-6`;
    const icons: { [key: string]: React.ReactNode } = {
        'Module': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>,
        'Wechselrichter': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 100 15 7.5 7.5 0 000-15z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" /></svg>,
        'Speicher': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M4.5 10.5H18V15H4.5v-4.5zM3.75 18h15A2.25 2.25 0 0021 15.75v-6.375A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25v6.375A2.25 2.25 0 005.25 18h-1.5z" /></svg>,
        'Ladestationen': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
    };
    return icons[name] || null;
}

const ProductsPreview: React.FC<ProductsPreviewProps> = ({ setPage, onSelectHersteller }) => {
    const [activeCategory, setActiveCategory] = useState<ProductCategory>(featuredCategories[0]);

    const { featuredProduct, categoryManufacturers } = useMemo(() => {
        // FIX: Use .includes() to check if the category exists in the manufacturer's category array.
        const manufacturersForCategory = manufacturers.filter(m => m.category.includes(activeCategory));
        // Find a representative product, preferably with specs
        const product = manufacturersForCategory.flatMap(m => m.products).find(p => p.specs) || manufacturersForCategory[0]?.products[0];
        
        return {
            featuredProduct: product,
            categoryManufacturers: manufacturersForCategory,
        };
    }, [activeCategory]);

    return (
        <section id="produkte-vorschau" className="py-20 bg-slate-900 text-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 max-w-4xl mx-auto">
                    <p className="font-bold text-green-400 uppercase tracking-wider">Unsere Technologie</p>
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mt-2">Qualität, die überzeugt.</h2>
                    <p className="text-lg text-slate-300 mt-4">
                        Einblicke in unser Portfolio an Premium-Komponenten. Als herstellerunabhängiger Partner wählen wir für Sie nur die beste und rentabelste Technik aus.
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                   {featuredCategories.map(cat => (
                       <button
                           key={cat}
                           onClick={() => setActiveCategory(cat)}
                           className={`px-4 md:px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-green-400 ${
                               activeCategory === cat
                               ? 'bg-green-500 text-white shadow-lg'
                               : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                           }`}
                       >
                           <CategoryIcon name={cat} />
                           {cat}
                       </button>
                   ))}
                </div>

                {/* Content Display */}
                <div key={activeCategory} className="max-w-6xl mx-auto bg-slate-800/50 p-6 md:p-8 rounded-2xl border border-slate-700 grid md:grid-cols-2 gap-8 md:gap-12 items-center animate-fade-in">
                    {/* Left: Featured Product */}
                    {featuredProduct ? (
                        <div onClick={() => onSelectHersteller(featuredProduct.manufacturerSlug)} className="group cursor-pointer">
                            <div className="relative aspect-square rounded-xl overflow-hidden mb-6 shadow-2xl">
                                <img src={featuredProduct.imageUrl} alt={featuredProduct.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h3 className="text-2xl font-bold">{featuredProduct.name}</h3>
                                </div>
                            </div>
                            <p className="text-slate-300 mb-4">{featuredProduct.description}</p>
                            {featuredProduct.specs && (
                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    {Object.entries(featuredProduct.specs).slice(0,2).map(([key, value]) => (
                                         <div key={key} className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                                            <p className="text-slate-400">{key}</p>
                                            <p className="font-bold text-green-400 text-base">{value}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-400">Produktinformationen werden geladen...</div>
                    )}

                    {/* Right: Manufacturer Logos */}
                    <div>
                        <h3 className="font-bold text-xl text-slate-200 mb-6">Unsere Premium-Partner für {activeCategory}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
                            {categoryManufacturers.map(man => (
                                <div
                                    key={man.slug}
                                    title={`Mehr von ${man.name}`}
                                    onClick={() => onSelectHersteller(man.slug)}
                                    className="group flex items-center justify-center p-4 bg-slate-800 border border-slate-700 rounded-lg h-24 transition-all duration-300 hover:shadow-xl hover:border-green-400 hover:-translate-y-1 cursor-pointer"
                                >
                                    <img src={man.logoUrl} alt={man.name} className="max-h-12 w-auto object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="text-center mt-16">
                    <button onClick={() => setPage('produkte')} className="bg-green-500 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-green-600 transition-all duration-300 shadow-xl cta-button-glow transform hover:-translate-y-1 cursor-pointer">
                        Alle Produkte entdecken
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ProductsPreview;

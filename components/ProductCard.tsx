import React from 'react';
import { Product } from '../data/productTypes';

interface ProductCardProps {
    product: Product & { manufacturerName: string };
    onQuote: (product: Product) => void;
    comparisonList: Product[];
    onToggleCompare: (product: Product) => void;
    onShowDetails: (product: Product) => void;
    onSelectHersteller: (slug: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onQuote,
    comparisonList,
    onToggleCompare,
    onShowDetails,
    onSelectHersteller
}) => {
    const isSelected = comparisonList.some(p => p.name === product.name);
    const isDisabled = !isSelected && (
        (comparisonList.length > 0 && comparisonList[0].category !== product.category) ||
        comparisonList.length >= 4
    );

    return (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col h-full transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <div onClick={() => onShowDetails(product)} className="cursor-pointer group relative overflow-hidden">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/80 backdrop-blur-sm text-slate-800 font-bold py-2 px-4 rounded-full text-sm">
                        Details ansehen
                    </div>
                </div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                 <button onClick={(e) => { e.stopPropagation(); onSelectHersteller(product.manufacturerSlug); }} className="text-xs font-semibold text-slate-500 hover:text-green-600 self-start mb-2">
                    {product.manufacturerName}
                </button>
                <h3 onClick={() => onShowDetails(product)} className="text-base font-bold text-slate-800 mb-2 cursor-pointer hover:text-green-600 transition-colors flex-grow leading-snug">{product.name}</h3>

                {product.basePrice && (
                    <div className="my-3 text-2xl font-bold text-slate-800">
                        {product.basePrice.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                    </div>
                )}

                <div className="mt-auto pt-4 border-t border-slate-100 space-y-2">
                     <button
                        onClick={() => onQuote(product)}
                        className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm"
                    >
                        Angebot anfragen
                    </button>
                    <button
                        onClick={() => onToggleCompare(product)}
                        disabled={isDisabled}
                        className={`w-full flex items-center justify-center gap-2 border-2 font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-sm ${
                            isSelected
                            ? 'bg-green-100 border-green-600 text-green-700'
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed'
                        }`}
                        title={isDisabled ? "Sie können nur Produkte derselben Kategorie vergleichen oder haben das Limit von 4 Produkten erreicht." : ""}
                    >
                         {isSelected ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                        )}
                        {isSelected ? 'Vergleichen' : 'Vergleichen'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
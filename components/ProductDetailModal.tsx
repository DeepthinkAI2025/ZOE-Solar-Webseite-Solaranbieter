import React from 'react';
import { Product } from '../data/products';

interface ProductDetailModalProps {
    product: Product;
    onClose: () => void;
    comparisonList: Product[];
    onToggleCompare: (product: Product) => void;
    onQuote: (product: Product) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, comparisonList, onToggleCompare, onQuote }) => {
    const isSelectedForComparison = comparisonList.some(p => p.name === product.name);
    const isComparisonDisabled = !isSelectedForComparison && (
        (comparisonList.length > 0 && comparisonList[0].category !== product.category) ||
        comparisonList.length >= 4
    );

    return (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative z-10 w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-slide-in-up">
                <header className="p-6 border-b border-slate-200 flex justify-between items-start">
                    <div>
                        <span className="text-sm font-semibold text-green-600 mb-1">{product.category}</span>
                        <h2 className="text-2xl font-bold text-slate-800">{product.name}</h2>
                    </div>
                    <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-800" aria-label="Schließen">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>

                <div className="flex-grow overflow-y-auto max-h-[75vh]">
                    <div className="grid md:grid-cols-2 gap-8 p-8">
                        {/* Left Column: Image */}
                        <div>
                            <img src={product.imageUrl} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-lg" />
                        </div>

                        {/* Right Column: Details */}
                        <div className="flex flex-col">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Beschreibung</h3>
                                <p className="text-slate-600 mb-6">{product.description}</p>
                            </div>

                            {product.specs && Object.keys(product.specs).length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-slate-800 mb-3 border-b pb-2">Technische Daten</h3>
                                    <ul className="space-y-2">
                                        {Object.entries(product.specs).map(([key, value]) => (
                                            <li key={key} className="flex justify-between text-sm border-b border-slate-100 py-2">
                                                <span className="font-semibold text-slate-600">{key.replace(/_/g, ' ')}</span>
                                                <span className="text-slate-800 font-medium">{value}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="mt-auto space-y-2 pt-6 border-t">
                                <button
                                    onClick={() => onToggleCompare(product)}
                                    disabled={isComparisonDisabled}
                                    className={`w-full flex items-center justify-center gap-2 border-2 font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-sm ${
                                        isSelectedForComparison 
                                        ? 'bg-green-100 border-green-600 text-green-700' 
                                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed'
                                    }`}
                                    title={isComparisonDisabled ? "Sie können nur Produkte derselben Kategorie vergleichen oder haben das Limit von 4 Produkten erreicht." : ""}
                                >
                                    {isSelectedForComparison ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                    )}
                                    {isSelectedForComparison ? 'Zum Vergleich hinzugefügt' : 'Vergleichen'}
                                </button>
                                <button 
                                    onClick={() => onQuote(product)}
                                    className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200"
                                >
                                    Individuelles Angebot anfragen
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailModal;
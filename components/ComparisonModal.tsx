import React from 'react';
import { Product } from '../data/productTypes';

interface ComparisonModalProps {
    items: Product[];
    onClose: () => void;
}

const PlaceholderCard: React.FC = () => (
    <div className="h-full flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-slate-500 font-semibold text-center">Produkt hinzufügen</p>
    </div>
);

const ComparisonModal: React.FC<ComparisonModalProps> = ({ items, onClose }) => {
    
    if (items.length === 0) return null;

    // FIX: Replaced `Array.from(new Set(...))` with the spread syntax `[...new Set(...)]` for better type inference.
    // This ensures `key` is correctly typed as `string` in the map function below, resolving multiple TypeScript errors.
    const allSpecKeys = [...new Set(items.flatMap(item => Object.keys(item.specs || {})))];
    const category = items[0].category;

    const areValuesDifferent = (key: string) => {
        if (items.length < 2) return false;
        if (key === 'basePrice') {
            const firstValue = items[0].basePrice;
            return items.slice(1).some(item => item.basePrice !== firstValue);
        }
        const firstValue = items[0].specs?.[key];
        return items.slice(1).some(item => item.specs?.[key] !== firstValue);
    };
    
    const handleStartAiChat = () => {
        const event = new CustomEvent('start-chat-with-comparison-context', {
            detail: items
        });
        document.dispatchEvent(event);
        onClose(); // Close the modal to show the chat
    };


    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="comparison-modal-title">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative z-10 w-full max-w-7xl bg-slate-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh] animate-slide-in-up">
                <header className="p-6 border-b border-slate-200 flex justify-between items-center flex-shrink-0 bg-white">
                    <div>
                        <h2 id="comparison-modal-title" className="text-2xl font-bold text-slate-800">Produktvergleich: {category}</h2>
                        <p className="text-sm text-slate-500">Schlüsselunterschiede sind farblich hervorgehoben.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={handleStartAiChat} className="bg-slate-700 text-white font-bold py-2 px-5 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-md text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.375 3.375 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                            Experten-Analyse im Chat starten
                        </button>
                        <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-800" aria-label="Schließen">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </header>
                <div className="flex-grow overflow-auto">
                    <div className="comparison-grid">
                        {/* Sticky Header */}
                        <div className="comparison-header-sticky col-start-1 col-end-[-1] grid grid-cols-5 bg-white/95 backdrop-blur-sm shadow-sm z-10">
                            <div className="w-full p-6 font-bold text-slate-600 self-end">Eigenschaft</div>
                            {items.map(item => (
                                <div key={item.name} className="w-full p-6 text-center border-l border-slate-200">
                                    <img src={item.imageUrl} alt={item.name} className="w-full h-28 object-cover rounded-md mb-3 shadow-md" />
                                    <p className="font-bold text-slate-800 text-base">{item.name}</p>
                                </div>
                            ))}
                            {[...Array(Math.max(0, 4 - items.length))].map((_, i) => <div key={`placeholder-th-${i}`} className="w-full p-6 border-l border-slate-200"><PlaceholderCard /></div>)}
                        </div>

                        {/* Spec Rows */}
                        <div className={`comparison-spec-row col-start-1 col-end-[-1] ${areValuesDifferent('basePrice') ? 'highlight-diff' : ''}`}>
                            <div className="p-6 font-semibold text-slate-700 flex items-center">Preis</div>
                            {items.map(item => (
                                <div key={`${item.name}-price`} className="p-6 text-center font-bold text-2xl text-green-700 border-l border-slate-200 flex items-center justify-center">
                                    {item.basePrice ? item.basePrice.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) : 'Auf Anfrage'}
                                </div>
                            ))}
                            {[...Array(Math.max(0, 4 - items.length))].map((_, i) => <div key={`placeholder-price-${i}`} className="p-6 border-l border-slate-200"></div>)}
                        </div>
                        {/* FIX: Explicitly type `key` as string to resolve type inference issues. */}
                        {allSpecKeys.map((key: string) => (
                            <div key={key} className={`comparison-spec-row col-start-1 col-end-[-1] ${areValuesDifferent(key) ? 'highlight-diff' : ''}`}>
                                <div className="p-6 font-semibold text-slate-700 flex items-center">{key.replace(/_/g, ' ')}</div>
                                {items.map(item => (
                                    <div key={`${item.name}-${key}`} className="p-6 text-center text-slate-600 border-l border-slate-200 flex items-center justify-center">
                                        {item.specs?.[key] || '-'}
                                    </div>
                                ))}
                                {[...Array(Math.max(0, 4 - items.length))].map((_, i) => <div key={`placeholder-spec-${i}`} className="p-6 border-l border-slate-200"></div>)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComparisonModal;
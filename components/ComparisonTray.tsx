import React, { useState, useEffect } from 'react';
import { Product } from '../data/productTypes';

interface ComparisonTrayProps {
    items: Product[];
    onRemove: (product: Product) => void;
    onClear: () => void;
    onCompare: () => void;
}

const ComparisonTray: React.FC<ComparisonTrayProps> = ({ items, onRemove, onClear, onCompare }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        // Auto-expand when first item is added, but only if it was closed
        if (items.length === 1 && !isExpanded) {
            setIsExpanded(true);
        }
        // Auto-close when last item is removed
        if (items.length === 0 && isExpanded) {
            setIsExpanded(false);
        }
    }, [items.length]);

    if (items.length === 0) {
        return null;
    }

    return (
        <div className={`fixed top-1/2 right-0 -translate-y-1/2 z-[150] transition-transform duration-300 ease-in-out ${isExpanded ? '' : 'translate-x-[calc(100%-56px)]'}`}>
            <div className="flex items-start">
                {/* Trigger Tab */}
                <button 
                    onClick={() => setIsExpanded(!isExpanded)} 
                    className="bg-slate-800 text-white p-4 rounded-l-xl shadow-lg flex flex-col items-center gap-2 h-[120px]"
                    aria-label={isExpanded ? "Vergleichs-Panel schließen" : "Vergleichs-Panel öffnen"}
                    aria-expanded={isExpanded}
                    aria-controls="comparison-panel"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    <span className="font-bold text-lg leading-none">{items.length}</span>
                     <span className="writing-mode-vertical-lr text-xs font-semibold">VERGLEICH</span>
                </button>
                
                {/* Panel */}
                <div id="comparison-panel" className="w-80 bg-white shadow-2xl rounded-l-xl border-l border-t border-b border-slate-200 flex flex-col h-[70vh] max-h-[600px]">
                    <header className="p-4 border-b border-slate-200 flex-shrink-0">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-slate-800 text-lg">Produktvergleich</h3>
                             <button onClick={() => setIsExpanded(false)} className="p-1 rounded-full hover:bg-slate-200" aria-label="Schließen"><span className="text-2xl" aria-hidden="true">&times;</span></button>
                        </div>
                        {items.length > 0 && (
                            <button onClick={onClear} className="text-xs text-slate-500 hover:text-red-600 hover:underline">Auswahl löschen ({items.length}/4)</button>
                        )}
                    </header>
                    
                    <div className="flex-grow p-4 overflow-y-auto space-y-3">
                        {items.map(item => (
                            <div key={item.name} className="flex items-center gap-3 bg-slate-50 p-2 rounded-md border border-slate-200">
                                <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded-sm flex-shrink-0"/>
                                <p className="text-sm font-semibold text-slate-700 flex-grow">{item.name}</p>
                                <button onClick={() => onRemove(item)} className="bg-slate-200 text-slate-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold z-10 flex-shrink-0 hover:bg-red-500 hover:text-white" aria-label={`Entferne ${item.name} aus dem Vergleich`}>&times;</button>
                            </div>
                        ))}
                         {[...Array(4 - items.length)].map((_, i) => (
                            <div key={`placeholder-${i}`} className="border-2 border-dashed border-slate-300 rounded-md h-[68px] flex items-center justify-center">
                               <span className="text-slate-400 text-sm">Nächsten Slot wählen</span>
                            </div>
                        ))}
                    </div>
                    
                    <footer className="p-4 border-t border-slate-200 flex-shrink-0">
                         <button 
                            onClick={onCompare} 
                            disabled={items.length < 2}
                            className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed"
                        >
                            {items.length < 2 ? 'Mindestens 2 Produkte wählen' : 'Jetzt vergleichen'}
                        </button>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default ComparisonTray;
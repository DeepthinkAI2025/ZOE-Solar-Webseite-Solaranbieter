import React, { useState, useMemo } from 'react';
import { Product } from '../data/products';

interface ProductConfiguratorProps {
    product: Product;
    onClose: () => void;
}

const ProductConfigurator: React.FC<ProductConfiguratorProps> = ({ product, onClose }) => {
    const [addInstallation, setAddInstallation] = useState(false);
    const [cableLength, setCableLength] = useState(10);
    const [provideCable, setProvideCable] = useState(true);
    const [addGroundwork, setAddGroundwork] = useState(false);
    const [addStonework, setAddStonework] = useState(false);
    
    const BASE_INSTALLATION_COST = 599;
    const CABLE_WITH_LAYING_PER_METER = 49;
    const LAYING_ONLY_PER_METER = 29;
    const GROUNDWORK_PER_METER = 20;
    const STONEWORK_PER_METER = 20;

    const totalCost = useMemo(() => {
        let total = product.basePrice || 0;
        if (addInstallation) {
            total += BASE_INSTALLATION_COST;
            
            if (cableLength > 0) {
                total += provideCable 
                    ? cableLength * CABLE_WITH_LAYING_PER_METER
                    : cableLength * LAYING_ONLY_PER_METER;
                
                if(addGroundwork) total += cableLength * GROUNDWORK_PER_METER;
                if(addStonework) total += cableLength * STONEWORK_PER_METER;
            }
        }
        return total;
    }, [product, addInstallation, cableLength, provideCable, addGroundwork, addStonework]);

    return (
        <div className="fixed inset-0 z-[101] flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                <header className="p-6 border-b border-slate-200 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Produkt Konfigurator</h2>
                        <p className="text-slate-500">{product.name}</p>
                    </div>
                     <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-800" aria-label="Schließen">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                <main className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
                    {/* Base Product */}
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <img src={product.imageUrl} alt={product.name} className="w-20 h-20 object-cover rounded-md" />
                        <div className="flex-grow">
                            <h3 className="font-bold text-slate-800">{product.name}</h3>
                            <p className="text-sm text-slate-500">Produktpreis (ohne Installation)</p>
                        </div>
                        <p className="text-xl font-bold text-slate-800">{product.basePrice?.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</p>
                    </div>

                    {/* Installation Package */}
                    <div className="border border-slate-200 rounded-lg">
                        <div className="p-4 bg-slate-50 rounded-t-lg">
                           <label className="flex items-center justify-between cursor-pointer">
                                <span className="font-bold text-slate-800">Installationspaket hinzufügen</span>
                                <input type="checkbox" checked={addInstallation} onChange={() => setAddInstallation(!addInstallation)} className="h-6 w-6 text-green-600 border-slate-300 rounded focus:ring-green-500" />
                           </label>
                        </div>
                        <div className={`p-4 space-y-4 transition-all duration-300 ${addInstallation ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 invisible'}`}>
                            <p className="text-sm text-slate-500 -mt-2">Standard-Montage & Inbetriebnahme der Wallbox für <span className="font-bold text-slate-700">{BASE_INSTALLATION_COST.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>.</p>
                            
                            <hr />

                            <div>
                                <label className="font-semibold text-slate-700 block mb-2">Leitungsverlegung</label>
                                <div className="flex items-center gap-2">
                                    <input type="range" min="0" max="50" value={cableLength} onChange={(e) => setCableLength(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-500" />
                                    <span className="font-bold text-slate-800 w-20 text-center">{cableLength} m</span>
                                </div>
                            </div>
                            
                            <div className="grid sm:grid-cols-2 gap-2">
                                <label className={`p-3 border rounded-md cursor-pointer text-sm ${provideCable ? 'bg-green-50 border-green-500 ring-2 ring-green-200' : 'bg-white'}`}>
                                    <input type="radio" name="cable" checked={provideCable} onChange={() => setProvideCable(true)} className="sr-only" />
                                    <span className="font-semibold block">Inklusive Leitung</span>
                                    <span>({CABLE_WITH_LAYING_PER_METER} €/m)</span>
                                </label>
                                 <label className={`p-3 border rounded-md cursor-pointer text-sm ${!provideCable ? 'bg-green-50 border-green-500 ring-2 ring-green-200' : 'bg-white'}`}>
                                    <input type="radio" name="cable" checked={!provideCable} onChange={() => setProvideCable(false)} className="sr-only" />
                                    <span className="font-semibold block">Leitung vorhanden</span>
                                    <span>({LAYING_ONLY_PER_METER} €/m)</span>
                                </label>
                            </div>
                            
                            <div className="space-y-2 pt-2">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={addGroundwork} onChange={() => setAddGroundwork(!addGroundwork)} className="h-5 w-5 text-green-600 border-slate-300 rounded focus:ring-green-500" />
                                    <span className="text-sm">Zusatz: Erdarbeiten (+{GROUNDWORK_PER_METER} €/m)</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={addStonework} onChange={() => setAddStonework(!addStonework)} className="h-5 w-5 text-green-600 border-slate-300 rounded focus:ring-green-500" />
                                    <span className="text-sm">Zusatz: Steinarbeiten (+{STONEWORK_PER_METER} €/m)</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </main>
                <footer className="p-6 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <p className="text-sm text-slate-600">Gesamtpreis (geschätzt)</p>
                        <p className="text-3xl font-bold text-slate-900">{totalCost.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</p>
                    </div>
                    <button className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors shadow-md">
                        In den Warenkorb
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ProductConfigurator;
/**
 * ZOE SOLAR - CO2Calculator mit verbesserter Accessibility
 * Rekonstruiert aus Chat-Verlauf - Vollständige Accessibility-Implementierung
 * 
 * WCAG 2.1 AA konforme Verbesserungen:
 * - ARIA Labels und IDs für alle Form-Elemente
 * - Live-Region für dynamische Updates
 * - Focus Management im Modal
 * - Keyboard Navigation Support
 * - Screen Reader Optimierungen
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ensurePdfLibraries } from '../utils/pdfExport';

// Reusable components for UI consistency mit verbesserter Accessibility
const AccessibleTooltip: React.FC<{ text: string; id: string }> = ({ text, id }) => {
    const [isVisible, setIsVisible] = useState(false);
    
    return (
        <div className="group relative flex items-center">
            <button
                type="button"
                className="h-5 w-5 text-slate-400 cursor-help focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                aria-describedby={`tooltip-${id}`}
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                onFocus={() => setIsVisible(true)}
                onBlur={() => setIsVisible(false)}
                aria-label="Hilfe-Informationen"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>
            <div 
                id={`tooltip-${id}`}
                role="tooltip"
                className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-800 text-white text-sm rounded-lg p-3 border border-slate-600 shadow-lg z-10 transition-opacity duration-300 ${
                    isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            >
                {text}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-slate-800"></div>
            </div>
        </div>
    );
};

const AccessibleSlider: React.FC<{
    label: string;
    unit: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (value: number) => void;
    tooltipText?: string;
    sliderId: string;
    inputId: string;
}> = ({ label, unit, value, min, max, step, onChange, tooltipText, sliderId, inputId }) => (
    <div className="space-y-3">
        <div className="flex justify-between items-baseline">
            <div className="flex items-center gap-2">
                <label htmlFor={inputId} className="font-semibold text-slate-300">
                    {label}
                </label>
                {tooltipText && <AccessibleTooltip text={tooltipText} id={sliderId} />}
            </div>
            <div className="flex items-center bg-slate-900/50 border border-slate-600 rounded-md">
                <label htmlFor={inputId} className="sr-only">
                    {label} in {unit}
                </label>
                <input
                    id={inputId}
                    type="number"
                    value={value}
                    min={min}
                    max={max}
                    step={step}
                    onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value))))}
                    className="w-32 bg-transparent text-right font-bold text-green-400 text-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    aria-label={`${label} in ${unit}`}
                    aria-describedby={`slider-${sliderId}-help`}
                />
                <span className="text-slate-400 pr-3">{unit}</span>
            </div>
        </div>
        
        {/* Assistive text für Screen Reader */}
        <div id={`slider-${sliderId}-help`} className="sr-only">
            Aktueller Wert: {value} {unit}. Verwenden Sie die Pfeiltasten zur Anpassung.
        </div>
        
        <input
            id={sliderId}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label={`${label} Regler in ${unit}`}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            aria-valuetext={`${value} ${unit}`}
            aria-describedby={`slider-${sliderId}-help`}
        />
        
        {/* Visueller Indikator für Slider-Value */}
        <div className="flex justify-between text-sm text-slate-400">
            <span>{min.toLocaleString('de-DE')} {unit}</span>
            <span>{max.toLocaleString('de-DE')} {unit}</span>
        </div>
    </div>
);

// Certificate Modal Component mit verbesserter Accessibility
const AccessibleESGCertificateModal: React.FC<{ 
    co2SavingsTonnes: string;
    treesEquivalent: string;
    onClose: () => void;
    isOpen: boolean;
}> = ({ co2SavingsTonnes, treesEquivalent, onClose, isOpen }) => {
    const [companyName, setCompanyName] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);
    const certificateRef = React.useRef<HTMLDivElement>(null);
    const companyNameInputRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Focus Management
    useEffect(() => {
        if (isOpen && companyNameInputRef.current) {
            // Focus auf das erste Element setzen
            companyNameInputRef.current.focus();
        }
    }, [isOpen]);

    // Escape Key Handler
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Focus Trap
    useEffect(() => {
        if (!isOpen || !modalRef.current) return;

        const modal = modalRef.current;
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        const handleTabKey = (event: KeyboardEvent) => {
            if (event.key !== 'Tab') return;

            if (event.shiftKey) {
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        };

        modal.addEventListener('keydown', handleTabKey);
        return () => modal.removeEventListener('keydown', handleTabKey);
    }, [isOpen]);

    // Using an inline SVG for the watermark to avoid creating new asset files
    const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="0.5" stroke="#e2e8f0"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`;
    const watermarkUrl = `url("data:image/svg+xml;base64,${btoa(svgIcon)}")`;

    const handleDownload = async () => {
        const element = certificateRef.current;
        if (!element) return;

        setIsDownloading(true);
        try {
            const { html2canvas } = await ensurePdfLibraries();
            const canvas = await html2canvas(element, {
                scale: 3,
                backgroundColor: '#ffffff',
                useCORS: true,
            });
            const link = document.createElement('a');
            link.download = `ZOE_Solar_ESG-Potenzial_${companyName.replace(/\s+/g, '_') || 'Analyse'}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Fehler beim Erstellen des Zertifikats:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true"></div>
            
            {/* Modal */}
            <div 
                ref={modalRef}
                className="relative z-10 w-full max-w-2xl bg-slate-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-auto max-h-[90vh]"
                role="dialog"
                aria-modal="true"
                aria-labelledby="certificate-title"
                aria-describedby="certificate-description"
            >
                {/* Certificate Content */}
                <div ref={certificateRef} className="bg-white p-12 relative">
                    <div className="absolute inset-0 bg-no-repeat bg-center opacity-10" style={{backgroundImage: watermarkUrl, backgroundSize: '60%'}}></div>
                    <div className="relative z-10 text-center">
                        <h2 id="certificate-title" className="text-4xl font-bold text-slate-800">ESG-Potenzial-Zertifikat</h2>
                        <p id="certificate-description" className="text-slate-500 mt-2">ausgestellt von ZOE Solar</p>
                        <div className="mt-8">
                            <label htmlFor="company-name" className="text-lg text-slate-600 block mb-2">
                                Für
                            </label>
                            <input 
                                ref={companyNameInputRef}
                                id="company-name"
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder="[ Ihr Firmenname ]"
                                className="text-3xl font-bold text-green-700 text-center bg-transparent border-none focus:ring-0 w-full placeholder:text-green-300"
                                aria-describedby="company-name-help"
                            />
                            <div id="company-name-help" className="sr-only">
                                Geben Sie hier Ihren Firmennamen ein, der auf dem Zertifikat erscheinen soll
                            </div>
                        </div>
                        <div className="my-10 border-t-2 border-b-2 border-dashed border-slate-200 py-10">
                            <p className="text-lg text-slate-600">Geschätztes jährliches CO₂-Einsparpotenzial</p>
                            <p className="text-7xl font-bold text-green-600 my-2" aria-live="polite">{co2SavingsTonnes} <span className="text-4xl text-slate-700">Tonnen</span></p>
                            <p className="text-lg text-slate-600">Dies entspricht der Pflanzleistung von ca. <strong>{treesEquivalent} Bäumen</strong> pro Jahr.</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="text-left">
                                <p className="text-sm font-bold text-slate-800">ZOE <span className="text-green-500">Solar</span></p>
                                <p className="text-xs text-slate-500">Ihr Partner für die Energiewende</p>
                            </div>
                            <p className="text-sm font-semibold text-slate-600">{new Date().toLocaleDateString('de-DE')}</p>
                        </div>
                    </div>
                </div>
                
                {/* Download Footer */}
                <footer className="p-6 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button 
                        onClick={handleDownload} 
                        disabled={isDownloading} 
                        className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors shadow-md disabled:bg-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        aria-describedby="download-help"
                    >
                        {isDownloading ? 'Wird erstellt...' : 'Als PNG herunterladen'}
                    </button>
                    <div id="download-help" className="sr-only">
                        Lädt das ESG-Zertifikat als PNG-Bild herunter
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-slate-600 font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                    >
                        Schließen
                    </button>
                </footer>
            </div>
        </div>
    );
};

// Main Component mit Live-Region für Ergebnisse
export const AccessibleCO2Calculator: React.FC = () => {
    const [consumption, setConsumption] = useState(100000); // kWh
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [announcement, setAnnouncement] = useState('');

    const calculation = useMemo(() => {
        const CO2_KG_PER_KWH = 0.401; // German electricity mix CO2 factor
        const CO2_KG_PER_TREE_YEAR = 12.5;

        const co2SavingsKg = consumption * CO2_KG_PER_KWH;
        const co2SavingsTonnes = co2SavingsKg / 1000;
        const treesEquivalent = co2SavingsKg / CO2_KG_PER_TREE_YEAR;

        return {
            co2SavingsTonnes: co2SavingsTonnes.toLocaleString('de-DE', { maximumFractionDigits: 0 }),
            treesEquivalent: treesEquivalent.toLocaleString('de-DE', { maximumFractionDigits: 0 }),
        };
    }, [consumption]);

    // Live-Region für Screen Reader Updates
    useEffect(() => {
        setAnnouncement(`CO₂-Einsparung aktualisiert: ${calculation.co2SavingsTonnes} Tonnen pro Jahr, entspricht ${calculation.treesEquivalent} Bäumen`);
        
        // Clear announcement after 3 seconds
        const timer = setTimeout(() => setAnnouncement(''), 3000);
        return () => clearTimeout(timer);
    }, [calculation.co2SavingsTonnes, calculation.treesEquivalent]);

    return (
        <>
            {/* Live Region für Screen Reader */}
            <div aria-live="polite" aria-atomic="true" className="sr-only">
                {announcement}
            </div>
            
            <AccessibleESGCertificateModal 
                co2SavingsTonnes={calculation.co2SavingsTonnes} 
                treesEquivalent={calculation.treesEquivalent} 
                onClose={() => setIsModalOpen(false)} 
                isOpen={isModalOpen}
            />
            
            <section id="co2-rechner" className="py-20 bg-slate-800 text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16 max-w-4xl mx-auto">
                        <p className="font-bold text-green-400 uppercase tracking-wider">ESG-Potenzial-Rechner</p>
                        <h2 className="text-4xl lg:text-5xl font-bold text-white mt-2">Ihr Beitrag zum Klimaschutz.</h2>
                        <p className="text-lg text-slate-300 mt-4">
                            Geben Sie Ihren jährlichen Stromverbrauch ein und entdecken Sie, wie viele Tonnen CO₂ Sie mit einer ZOE Solar Anlage einsparen können. Erstellen Sie anschließend Ihr persönliches ESG-Zertifikat.
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto bg-slate-900/70 backdrop-blur-sm p-8 md:p-12 rounded-2xl border border-slate-700">
                        <form role="form" aria-labelledby="calculator-heading">
                            <h3 id="calculator-heading" className="sr-only">CO₂-Rechner für Stromverbrauch</h3>
                            
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                {/* Controls */}
                                <div className="space-y-8">
                                    <AccessibleSlider
                                        label="Jährlicher Stromverbrauch"
                                        unit="kWh"
                                        value={consumption}
                                        min={10000} 
                                        max={1000000} 
                                        step={1000}
                                        onChange={setConsumption}
                                        tooltipText="Geben Sie hier den gesamten Stromverbrauch Ihres Unternehmens pro Jahr ein, wie er auf Ihrer letzten Stromrechnung ausgewiesen ist."
                                        sliderId="consumption-slider"
                                        inputId="consumption-input"
                                    />
                                    
                                    <button 
                                        type="button"
                                        onClick={() => setIsModalOpen(true)} 
                                        className="w-full bg-green-500 text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-green-600 transition-all duration-300 shadow-lg cta-button-glow transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        aria-describedby="certificate-button-help"
                                    >
                                        ESG-Potenzial-Zertifikat erstellen
                                    </button>
                                    <div id="certificate-button-help" className="sr-only">
                                        Öffnet ein Modal zur Erstellung eines personalisierten ESG-Zertifikats
                                    </div>
                                </div>

                                {/* Results mit Live-Region */}
                                <div className="text-center">
                                    <p className="text-sm text-green-300 font-semibold uppercase tracking-wider">Mögliche CO₂-Einsparung pro Jahr</p>
                                    <p className="text-7xl font-bold text-green-300 mt-1" aria-live="polite" aria-atomic="true">
                                        {calculation.co2SavingsTonnes}
                                    </p>
                                    <p className="text-2xl font-medium text-slate-300">Tonnen</p>
                                    <div className="mt-6 pt-6 border-t border-slate-700">
                                        <p className="text-slate-300">Das entspricht der Pflanzleistung von ca.</p>
                                        <p className="text-3xl font-bold text-white mt-1" aria-live="polite" aria-atomic="true">
                                            {calculation.treesEquivalent} Bäumen
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
};

// Legacy Export für Abwärtskompatibilität
export const CO2Calculator = AccessibleCO2Calculator;

export default AccessibleCO2Calculator;
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { productCatalog } from '../data/products.generated';
import { Page } from '../types';
import { pageToPath } from '../data/pageRoutes';
import { loadExternalScript } from '../utils/loadExternalScript';
import Breadcrumb from './Breadcrumb';

const THREE_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
const VANTA_GLOBE_SRC = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.globe.min.js';

const loadVantaGlobe = async () => {
    if (typeof window === 'undefined') {
        return null;
    }

    await loadExternalScript(THREE_SRC);
    await loadExternalScript(VANTA_GLOBE_SRC);

    const VANTA = (window as any).VANTA;
    if (!VANTA?.GLOBE) {
        throw new Error('VANTA Globe konnte nicht geladen werden.');
    }

    return VANTA;
};

const ManufacturerLogo: React.FC<{ name: string; src: string; slug: string; onSelect: (slug: string) => void; className?: string }> = ({ name, src, slug, onSelect, className = '' }) => {
  return (
    <a
      onClick={() => onSelect(slug)}
      title={`Mehr von ${name} erfahren`}
      className={`flex-shrink-0 mx-8 flex items-center justify-center h-10 cursor-pointer ${className}`}
    >
      <img
        src={src}
        alt={name}
        loading="lazy"
        fetchPriority="low"
        className="h-full w-auto max-w-[150px] object-contain transition-all duration-300"
      />
    </a>
  );
};

// --- START: Reusable components for the calculator ---
const Tooltip: React.FC<{ text: string }> = ({ text }) => (
    <div className="group relative flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            {/* FIX: Corrected invalid SVG path data. */}
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 bg-slate-800 text-white text-sm rounded-lg p-3 border border-slate-600 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-slate-800"></div>
        </div>
    </div>
);

const CustomSlider: React.FC<{
    label: string;
    unit: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (value: number) => void;
    tooltipText?: string;
}> = ({ label, unit, value, min, max, step, onChange, tooltipText }) => (
    <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
                <label className="font-semibold text-slate-300">{label}</label>
                {tooltipText && <Tooltip text={tooltipText} />}
            </div>
            <div className="font-mono text-green-300">
                {value.toLocaleString('de-DE')} {unit}
            </div>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
        />
    </div>
);
// --- END: Reusable components for the calculator ---

const HeroCalculator: React.FC<{ customerType: 'private' | 'business' }> = ({ customerType }) => {
    const [surfaceArea, setSurfaceArea] = React.useState(customerType === 'private' ? 100 : 1000); // m²
    const [electricityPrice, setElectricityPrice] = React.useState(28); // ct/kWh

    // Update default values when customerType changes
    React.useEffect(() => {
        if (customerType === 'private') {
            setSurfaceArea(100);
        } else {
            setSurfaceArea(1000);
        }
        setElectricityPrice(28);
    }, [customerType]);

    const calculation = React.useMemo(() => {
        const kwpPerSqM = 0.2;
        const kwhPerKwpPerYear = 1050;
        const co2KgPerKwh = 0.401;
        const selfConsumptionRate = 0.50; // Annahme: 50%
        const feedInTariffCt = 8.1;

        const totalKwp = surfaceArea * kwpPerSqM;
        const yearlyProductionKwh = totalKwp * kwhPerKwpPerYear;

        const selfConsumedKwh = yearlyProductionKwh * selfConsumptionRate;
        const fedInKwh = yearlyProductionKwh * (1 - selfConsumptionRate);

        const savingsFromSelfConsumption = (selfConsumedKwh * electricityPrice) / 100;
        const earningsFromFeedIn = (fedInKwh * feedInTariffCt) / 100;
        const yearlySavings = savingsFromSelfConsumption + earningsFromFeedIn;

        const co2SavingsKg = yearlyProductionKwh * co2KgPerKwh;

        return {
            totalKwp: totalKwp.toLocaleString('de-DE', { maximumFractionDigits: 0 }),
            yearlyProductionKwh: yearlyProductionKwh.toLocaleString('de-DE', {maximumFractionDigits: 0}),
            yearlySavings: yearlySavings.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }),
            co2SavingsTonnes: (co2SavingsKg / 1000).toLocaleString('de-DE', { maximumFractionDigits: 1 }),
        };
    }, [surfaceArea, electricityPrice]);
    
    const openChat = () => {
        document.dispatchEvent(new CustomEvent('open-chat'));
    };

    return (
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/20 p-6 md:p-8 w-full max-w-2xl shadow-2xl">
            <h3 className="font-bold text-white text-2xl mb-1">Ihr Potenzial in 60 Sekunden.</h3>
            <p className="text-slate-300 mb-6 text-sm">Passen Sie die Regler an und entdecken Sie Ihr Ertragspotenzial.</p>
            
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 my-8">
                <CustomSlider
                    label="Verfügbare Fläche"
                    unit="m²"
                    value={surfaceArea}
                    min={100} max={50000} step={100}
                    onChange={setSurfaceArea}
                    tooltipText="Pro 5 m² Fläche kann etwa 1 kWp (Kilowatt-Peak) an Photovoltaik-Leistung installiert werden."
                />
                 <CustomSlider
                    label="Ihr Strompreis"
                    unit="ct/kWh"
                    value={electricityPrice}
                    min={15} max={50} step={1}
                    onChange={setElectricityPrice}
                    tooltipText="Ihr Strompreis ist entscheidend für die Berechnung Ihrer Ersparnis. Jede selbst verbrauchte Kilowattstunde (kWh) spart Ihnen den Einkauf zu diesem Preis."
                />
            </div>
            
            <div className="bg-slate-900/50 rounded-xl border border-slate-700 p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                    <div>
                        <p className="text-xs text-slate-300 uppercase tracking-wider">Leistung</p>
                        <p className="text-2xl font-bold text-white">{calculation.totalKwp} <span className="text-lg font-medium text-slate-300">kWp</span></p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-300 uppercase tracking-wider">Erzeugte Energie p.a.</p>
                        <p className="text-2xl font-bold text-white">{calculation.yearlyProductionKwh} <span className="text-lg font-medium text-slate-300">kWh</span></p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-300 uppercase tracking-wider">CO₂-Ersparnis p.a.</p>
                        <p className="text-2xl font-bold text-white">{calculation.co2SavingsTonnes} <span className="text-lg font-medium text-slate-300">t</span></p>
                    </div>
                </div>
                <div className="pt-6 border-t border-slate-700 text-center">
                    <p className="text-sm text-green-300 font-semibold uppercase tracking-wider">Mögliche Ersparnis pro Jahr</p>
                    <p className="text-5xl font-bold text-green-300 mt-1">{calculation.yearlySavings}</p>
                    
                    <Link
                        to={pageToPath.kontakt}
                        onClick={(event) => {
                            event.preventDefault();
                            openChat();
                        }}
                        className="inline-block mt-6 bg-green-500 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-green-600 transition-all duration-300 shadow-lg cta-button-glow transform hover:-translate-y-1"
                    >
                        Jetzt Potenzial analysieren
                    </Link>
                </div>
            </div>
            
            <p className="text-xs text-slate-400 italic text-center mt-3">
                Dies ist eine Schätzung. Eine genaue Analyse berücksichtigt Ihren individuellen Lastgang und Standort.
            </p>
        </div>
    );
};

interface HeroProps {
    onSelectHersteller: (slug: string) => void;
    setPage: (page: Page) => void;
    theme?: 'day' | 'night';
    customerType: 'private' | 'business';
    setCustomerType?: (type: 'private' | 'business') => void;
}

const { manufacturers } = productCatalog;

const Hero: React.FC<HeroProps> = ({ onSelectHersteller, setPage, customerType, setCustomerType }) => {
    const vantaRef = useRef<HTMLDivElement | null>(null);
    
    // State for headline animation
    const [headlineIndex, setHeadlineIndex] = useState(0);
    
    const headlines = useMemo(() => {
        if (customerType === 'private') {
            return [
                "Ihres Zuhauses.",
                "Ihrer Familie.",
                "Ihrer Energiezukunft.",
                "Ihres Eigenheims.",
            ];
        } else {
            return [
                "Ihres Unternehmens.",
                "Ihrer Landwirtschaft.",
                "Ihres Familienbetriebs.",
                "Ihrer Energiezukunft.",
            ];
        }
    }, [customerType]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setHeadlineIndex(current => (current + 1) % headlines.length);
        }, 2500); // Change phrase every 2.5 seconds
        return () => clearTimeout(timer);
    }, [headlineIndex, headlines]);
    
    const allLogos = manufacturers.map(m => ({
        name: m.name,
        src: m.logoUrl,
        slug: m.slug
    }));
    
    const logosFirstRow = allLogos.slice(0, Math.ceil(allLogos.length / 2));
    const logosSecondRow = allLogos.slice(Math.ceil(allLogos.length / 2));

    useEffect(() => {
        if (!vantaRef.current) {
            return;
        }

        let effect: any = null;
        let cancelled = false;
        const element = vantaRef.current;

        const initVanta = async () => {
            try {
                const VANTA = await loadVantaGlobe();
                if (!VANTA || cancelled || effect || !element) {
                    return;
                }
                effect = VANTA.GLOBE({
                    el: element,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.0,
                    minWidth: 200.0,
                    scale: 1.0,
                    scaleMobile: 1.0,
                    color: 0x22c55e,
                    backgroundColor: 0x0f172a,
                    size: 1.2,
                });
            } catch (error) {
                console.error('VANTA Globe konnte nicht initialisiert werden', error);
            }
        };

        const observer = new IntersectionObserver(
            (entries) => {
                const isVisible = entries.some((entry) => entry.isIntersecting);
                if (isVisible) {
                    initVanta();
                    observer.disconnect();
                }
            },
            { rootMargin: '200px 0px', threshold: 0.1 }
        );

        observer.observe(element);

        return () => {
            cancelled = true;
            observer.disconnect();
            if (effect) {
                effect.destroy();
                effect = null;
            }
        };
    }, []);

  return (
    <section ref={vantaRef} className="relative bg-slate-900 min-h-screen flex flex-col text-white overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/40 z-10"></div>
      
        <div className="relative z-20 container mx-auto px-6 flex-grow flex flex-col justify-center py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mt-10">
                <div className="text-center lg:text-left">
                    {/* Breadcrumb Navigation - nur auf Unterseiten anzeigen */}
                    {location.pathname !== '/' && (
                        <Breadcrumb variant="hero" />
                    )}

                    <div className="mb-6 opacity-0" style={{ animation: 'slide-up-fade-in 0.8s ease-out 0.1s forwards' }}>
                        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                            <Link
                                to={customerType === 'private' ? pageToPath['preise'] : pageToPath['agri-pv']}
                                onClick={(event) => {
                                    event.preventDefault();
                                    setPage(customerType === 'private' ? 'preise' : 'agri-pv');
                                }}
                                className="inline-block bg-white/10 border border-white/30 rounded-full px-4 py-2 text-sm text-white transition-all duration-300 hover:bg-white/20 transform hover:-translate-y-0.5 group"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                    </span>
                                    {customerType === 'private' ? (
                                        <>
                                            <span className="font-semibold text-green-300">KfW-Förderung 2025</span>
                                            <span className="text-slate-300">| Bis zu 50% Zuschuss</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="font-semibold text-green-300">Neu: Agri-PV Förderung 2025</span>
                                            <span className="text-slate-300">| Bis zu 1 Mio. € Zuschuss</span>
                                        </>
                                    )}
                                </div>
                            </Link>
                            <div className="bg-red-500/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-white font-bold animate-pulse">
                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Förderfrist endet in: 127 Tagen</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight animate-hero-heading mb-4 [text-shadow:_0_2px_4px_rgb(0_0_0_/_40%)] speakable-hero-headline hero-headline" style={{lineHeight: '1.15'}}>
                        Sichern Sie die Zukunft
                        <br />
                        <span className="text-green-400 animated-headline-container">
                            <span key={headlineIndex} className="inline-block">
                                {headlines[headlineIndex].split(' ').map((word, wordIndex) => (
                                    <React.Fragment key={wordIndex}>
                                        <span className="word-wrapper">
                                            <span
                                                className="animated-word"
                                                style={{ animationDelay: `${wordIndex * 0.08}s` }}
                                            >
                                                {word}
                                            </span>
                                        </span>
                                        {' '}
                                    </React.Fragment>
                                ))}
                            </span>
                        </span>
                    </h1>

                    <p className="text-xl text-slate-200 mt-4 max-w-xl animate-hero-p mx-auto lg:mx-0 speakable-hero-pitch hero-pitch">
                        {customerType === 'private'
                            ? 'Wir helfen Ihnen, Ihr Zuhause unabhängig von Stromkosten zu machen. Schaffen Sie eine nachhaltige Zukunft für Ihre Familie mit sauberer, erneuerbarer Energie.'
                            : 'Wir helfen Familienbetrieben, ihre ungenutzten Flächen in eine sichere Zukunft zu verwandeln. Schaffen Sie eine nachhaltige Einnahmequelle, die Generationen überdauert und Ihren Hof für die Zukunft rüstet.'
                        }
                    </p>
                    
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-x-8 gap-y-4 animate-hero-features">
                        <div className="flex items-center gap-3 text-slate-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span className="font-semibold">Solaranbieter Testsieger 2025</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-100">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span className="font-semibold">100% Kostenlose Analyse & Angebot</span>
                        </div>
                    </div>

                    <div className="mt-8 text-left animate-hero-cta">
                        <p className="font-semibold text-green-300 uppercase tracking-wider text-sm mb-3">Unsere Expertise für:</p>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-slate-200">
                            {customerType === 'private' ? (
                                <>
                                    <span className="font-semibold">✓ Einfamilienhäuser</span>
                                    <span className="font-semibold">✓ Mehrfamilienhäuser</span>
                                    <span className="font-semibold">✓ Eigenheime & Wohnungen</span>
                                </>
                            ) : (
                                <>
                                    <span className="font-semibold">✓ Familienbetriebe & Landwirte</span>
                                    <span className="font-semibold">✓ Grundbesitzer & die nächste Generation</span>
                                    <span className="font-semibold">✓ Zukunftsorientierte Unternehmen</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center lg:justify-end animate-hero-features mt-4">
                   <HeroCalculator customerType={customerType} />
                </div>
            </div>
        </div>
        
        <div className="relative z-20 w-full bg-white backdrop-blur-sm py-6">
            <p className="text-center text-xs text-gray-600 mb-6 font-semibold uppercase tracking-wider animate-hero-partners">Unsere Premium-Partner für höchste Qualität</p>
            <div className="relative w-full overflow-hidden animate-hero-partners">
                {/* Single row scrolling left */}
                <div className="flex animate-infinite-scroll">
                    {[...allLogos, ...allLogos].map((logo, index) => (
                        <ManufacturerLogo
                            key={`${logo.slug}-${index}`}
                            name={logo.name}
                            src={logo.src}
                            slug={logo.slug}
                            onSelect={onSelectHersteller}
                        />
                    ))}
                </div>
            </div>
        </div>
    </section>
  );
};

export default Hero;
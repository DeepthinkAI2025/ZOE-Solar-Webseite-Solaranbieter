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
      className={`flex-shrink-0 mx-8 flex items-center justify-center h-10 w-32 cursor-pointer ${className}`}
      style={{ aspectRatio: '4/1' }}
    >
      <img
        src={src}
        alt={name}
        loading="lazy"
        width="128"
        height="32"
        fetchPriority="low"
        className="h-full w-auto max-w-[120px] object-contain transition-all duration-300"
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
                <label className="font-semibold text-slate-700">{label}</label>
                {tooltipText && <Tooltip text={tooltipText} />}
            </div>
            <div className="font-mono text-primary-700">
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
            className="w-full h-2 bg-primary-100 rounded-full appearance-none cursor-pointer accent-primary-600"
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
    <div className="bg-white/95 backdrop-blur-2xl rounded-[32px] border border-white/60 p-8 md:p-10 w-full max-w-2xl shadow-[0_25px_90px_rgba(15,23,42,0.08)]">
      <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary-600">
        <span className="inline-flex h-2 w-2 rounded-full bg-primary-500" aria-hidden />
        Echtzeit-Solarpotenzial
      </div>
      <h3 className="font-black text-slate-900 text-3xl md:text-[2.65rem] leading-tight mt-3">
        Ihr Potenzial in 60 Sekunden
      </h3>
      <p className="text-base md:text-lg text-slate-600 mt-3 max-w-xl">
        Schieben Sie die Regler und sehen Sie sofort, welche Leistung, CO₂-Ersparnis und Jahresrendite möglich sind.
      </p>

      <div className="grid md:grid-cols-2 gap-x-10 gap-y-8 my-10">
        <CustomSlider
          label="Verfügbare Fläche"
          unit="m²"
          value={surfaceArea}
          min={100}
          max={50000}
          step={100}
          onChange={setSurfaceArea}
          tooltipText="Pro 5 m² Fläche kann etwa 1 kWp (Kilowatt-Peak) an Photovoltaik-Leistung installiert werden."
        />
        <CustomSlider
          label="Ihr Strompreis"
          unit="ct/kWh"
          value={electricityPrice}
          min={15}
          max={50}
          step={1}
          onChange={setElectricityPrice}
          tooltipText="Ihr Strompreis entscheidet über die interne Rendite: Jede selbst verbrauchte Kilowattstunde spart diesen Betrag."
        />
      </div>

      <div className="bg-[#F0FBF4] rounded-2xl border border-primary-100 p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-xs font-semibold text-primary-800 uppercase tracking-[0.3em]">Leistung</p>
            <p className="text-3xl md:text-4xl font-black text-slate-900">
              {calculation.totalKwp}
              <span className="block text-base font-semibold text-slate-500 mt-1">kWp</span>
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-primary-800 uppercase tracking-[0.3em]">Energie p.a.</p>
            <p className="text-3xl md:text-4xl font-black text-slate-900">
              {calculation.yearlyProductionKwh}
              <span className="block text-base font-semibold text-slate-500 mt-1">kWh</span>
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-primary-800 uppercase tracking-[0.3em]">CO₂-Ersparnis</p>
            <p className="text-3xl md:text-4xl font-black text-slate-900">
              {calculation.co2SavingsTonnes}
              <span className="block text-base font-semibold text-slate-500 mt-1">t p.a.</span>
            </p>
          </div>
        </div>
        <div className="pt-6 border-t border-primary-100 text-center">
          <p className="text-sm font-semibold tracking-[0.2em] text-primary-700 uppercase">
            Mögliche Ersparnis pro Jahr
          </p>
          <p className="text-5xl font-black text-primary-700 mt-3">
            {calculation.yearlySavings}
          </p>

          <Link
            to={pageToPath.kontakt}
            onClick={(event) => {
              event.preventDefault();
              openChat();
            }}
            className="inline-flex items-center justify-center gap-2 mt-6 bg-primary-600 text-white font-black py-3.5 px-8 rounded-2xl text-lg md:text-xl hover:bg-primary-700 transition-all duration-300 shadow-lg shadow-primary-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F0FBF4]"
            aria-label="Jetzt individuelle Potenzialanalyse anfordern"
          >
            Jetzt Potenzial analysieren
            <span aria-hidden>→</span>
          </Link>
          <p className="text-xs text-slate-500 mt-3">100% unverbindlich · Keine Weitergabe Ihrer Daten</p>
        </div>
      </div>

      <p className="text-sm text-slate-500 text-center mt-4 leading-relaxed">
        Diese Schnellrechnung ersetzt keine detaillierte Leistungsprognose, zeigt aber Ihr realistisches Potenzial. Im Erstgespräch simulieren wir Ihre Anlage auf Basis von Standortdaten und Lastprofilen.
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

const statHighlights = [
  {
    value: '42.800 €',
    label: 'Ø-Ersparnis über 20 Jahre',
    detail: 'auf Basis von 1.200 Projekten',
  },
  {
    value: '1.200+',
    label: 'installierte Anlagen seit 2015',
    detail: 'bundesweit für Privat & Gewerbe',
  },
  {
    value: '4,9 / 5',
    label: 'Kundenzufriedenheit',
    detail: 'aus verifizierten Bewertungen',
  },
];

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

  const currentHeadline = useMemo(() => {
    if (headlines.length === 0) {
      return '';
    }
    return headlines[headlineIndex] ?? headlines[0] ?? '';
  }, [headlines, headlineIndex]);

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
                    backgroundColor: 0xf9fafb,
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
    <section
      ref={vantaRef}
      className="relative isolate bg-gradient-to-br from-[#FFFEFB] via-[#F4FAFF] to-white min-h-[90vh] flex flex-col text-slate-900 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.12),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.04),_transparent_55%)] z-10" />

      <div className="relative z-20 container mx-auto px-6 flex-grow flex flex-col justify-center py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            {/* Breadcrumb Navigation - nur auf Unterseiten anzeigen */}
            {location.pathname !== '/' && (
              <Breadcrumb variant="hero" />
            )}

            <div className="space-y-4 animate-hero-features">
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to={customerType === 'private' ? pageToPath['preise'] : pageToPath['agri-pv']}
                  onClick={(event) => {
                    event.preventDefault();
                    setPage(customerType === 'private' ? 'preise' : 'agri-pv');
                  }}
                  className="inline-flex items-center gap-3 bg-white/90 border border-primary-100 rounded-full px-5 py-2 text-sm font-semibold text-primary-900 shadow-sm hover:shadow-md transition"
                >
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500" />
                  </span>
                  {customerType === 'private' ? 'KfW-Förderung 2025 · Bis zu 50% Zuschuss' : 'Agri-PV Förderung 2025 · Bis zu 1 Mio. € Zuschuss'}
                </Link>
                <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 rounded-full px-5 py-2 text-sm font-semibold border border-red-100 shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Förderfrist endet in 127 Tagen
                </div>
              </div>
            </div>

            <h1 className="mt-10 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight animate-hero-heading speakable-hero-headline hero-headline">
              Sichern Sie die Zukunft
              <br />
              <span className="text-primary-600 animated-headline-container">
                <span key={headlineIndex} className="inline-block">
                  {currentHeadline.split(' ').map((word, wordIndex) => (
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

            <p className="text-lg md:text-2xl leading-relaxed text-slate-700 mt-6 max-w-2xl mx-auto lg:mx-0 animate-hero-p speakable-hero-pitch hero-pitch">
              {customerType === 'private'
                ? 'Wir machen Ihr Zuhause unabhängig von steigenden Strompreisen – mit klarer Beratung, verständlichen Zahlen und Fördermitteln, die speziell für Familien zugeschnitten sind.'
                : 'Wir sichern Familienbetrieben, Landwirtschaft und Unternehmen eine stabile zweite Einnahmequelle. Verständlich erklärt, finanziell belegt – damit jede Generation davon profitiert.'
              }
            </p>

            <div className="mt-10 grid sm:grid-cols-3 gap-4 animate-hero-features">
              {statHighlights.map((stat) => (
                <div key={stat.label} className="bg-white/90 border border-white rounded-2xl p-4 text-left shadow-sm" role="listitem">
                  <p className="text-2xl md:text-3xl font-black text-primary-700">{stat.value}</p>
                  <p className="text-sm font-semibold text-slate-600 mt-2">{stat.label}</p>
                  <p className="text-xs text-slate-500 mt-1">{stat.detail}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-4 animate-hero-cta">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link
                  to={pageToPath.kontakt}
                  onClick={(event) => {
                    event.preventDefault();
                    document.dispatchEvent(new CustomEvent('open-chat'));
                  }}
                  className="inline-flex w-full sm:w-auto justify-center items-center gap-3 bg-primary-600 text-white text-lg font-black px-8 py-4 rounded-2xl shadow-lg hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  aria-label="Kostenfreie Solarberatung starten"
                >
                  Kostenfreie Analyse starten
                  <span aria-hidden>→</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setPage('kontakt')}
                  className="w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-8 py-4 text-lg font-semibold text-slate-800 shadow-sm hover:shadow-md"
                >
                  Rückruf vereinbaren
                </button>
              </div>
              <p className="text-sm text-slate-500">Sofortige Terminbestätigung · Wir erklären alles Schritt für Schritt.</p>
            </div>

            <div className="mt-8 text-left animate-hero-features">
              <p className="font-semibold text-primary-700 uppercase tracking-[0.35em] text-xs mb-4">Unsere Expertise</p>
              <div className="flex flex-wrap gap-3 text-lg font-semibold text-slate-800">
                {customerType === 'private' ? (
                  <>
                    <span className="px-4 py-2 bg-white/70 rounded-full border border-slate-200">Einfamilienhäuser</span>
                    <span className="px-4 py-2 bg-white/70 rounded-full border border-slate-200">Mehrfamilienhäuser</span>
                    <span className="px-4 py-2 bg-white/70 rounded-full border border-slate-200">Eigenheime & Wohnungen</span>
                  </>
                ) : (
                  <>
                    <span className="px-4 py-2 bg-white/70 rounded-full border border-slate-200">Familienbetriebe & Landwirte</span>
                    <span className="px-4 py-2 bg-white/70 rounded-full border border-slate-200">Grundbesitzer:innen</span>
                    <span className="px-4 py-2 bg-white/70 rounded-full border border-slate-200">Unternehmen & Gewerbe</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end animate-hero-features mt-8 lg:mt-0">
            <HeroCalculator customerType={customerType} />
          </div>
        </div>
      </div>
        
        {/* Enhanced Partners Section with Professional Slider */}
        <div className="relative z-20 w-full bg-gradient-to-b from-white to-gray-50 py-8 border-t border-gray-200">
            {/* Section Header */}
            <div className="text-center mb-8">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2 animate-hero-partners">
                    Unsere Premium-Partner
                </h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                    Exklusive Partnerschaften mit den weltweit führenden Herstellern für maximale Qualität und Zuverlässigkeit
                </p>
            </div>

            {/* Professional Logo Slider Container */}
            <div className="relative">
                {/* Gradient Overlays for Professional Look */}
                <div className="absolute left-0 top-0 w-24 h-full bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
                <div className="absolute right-0 top-0 w-24 h-full bg-gradient-to-l from-gray-50 to-transparent z-10"></div>
                
                {/* Scrolling Container */}
                <div className="relative w-full overflow-hidden" style={{ contain: 'layout inline-size', height: '80px' }}>
                    <div className="flex animate-logo-scroll" style={{ willChange: 'transform' }}>
                        {/* Duplicate logos for seamless loop */}
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

                {/* Scroll Progress Indicator */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-0.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full animate-scroll-progress"></div>
                </div>
            </div>

            {/* Trust Badges */}
            <div className="flex justify-center items-center gap-6 mt-8 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Zertifizierte Partner</span>
                </div>
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Premium Qualität</span>
                </div>
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <span>Marktführer</span>
                </div>
            </div>
        </div>
    </section>
  );
};

export default Hero;
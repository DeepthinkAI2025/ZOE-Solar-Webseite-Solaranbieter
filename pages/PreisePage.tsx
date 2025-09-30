import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Page } from '../types';
import { pricingPackages, PricingPackage } from '../data/pricingPackages.ts';
import AIRecommender from '../components/AIRecommender';

const SpecIcon: React.FC<{ type: 'modules' | 'storage' | 'wallbox' }> = ({ type }) => {
    const className = "w-8 h-8 text-green-700";
    if (type === 'modules') return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>;
    if (type === 'storage') return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M4.5 10.5H18V15H4.5v-4.5zM3.75 18h15A2.25 2.25 0 0021 15.75v-6.375A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25v6.375A2.25 2.25 0 005.25 18h-1.5z" /></svg>;
    if (type === 'wallbox') return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>;
    return null;
};

const PackageCard: React.FC<{ pkg: PricingPackage, onSelect: () => void, isLoggedIn: boolean }> = ({ pkg, onSelect, isLoggedIn }) => {
    const hasBadge = !!pkg.badge;
    const badgeColors = {
        green: 'bg-green-500',
        blue: 'bg-blue-500',
        yellow: 'bg-yellow-500',
    };
    const borderColors = {
        green: 'border-green-500',
        blue: 'border-blue-500',
        yellow: 'border-yellow-500',
    };

    const badgeColorClass = badgeColors[pkg.badgeColor || 'green'];
    const borderColorClass = borderColors[pkg.badgeColor || 'green'];

    return (
        <div className={`group relative bg-white rounded-2xl shadow-lg border-2 flex flex-col transform transition-transform duration-300 ${hasBadge ? `${borderColorClass} shadow-2xl` : 'border-slate-200 hover:-translate-y-2'}`}>
            <div className="relative">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-t-xl">
                     <img src={pkg.imageUrl} alt={pkg.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                 {hasBadge && (
                    <div className={`absolute top-4 right-4 ${badgeColorClass} text-white font-bold text-sm px-4 py-1 rounded-full shadow-lg z-10`}>
                        {pkg.badge}
                    </div>
                )}
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-slate-800">{pkg.name}</h3>
                <p className="text-slate-500 h-10">{pkg.target}</p>
                
                <div className="my-6">
                    <span className="text-5xl font-bold text-slate-900">{pkg.price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                    {pkg.priceNote && <span className="text-sm text-slate-500 ml-1 block">{pkg.priceNote}</span>}
                </div>

                <div className="grid grid-cols-3 gap-4 text-center mb-8">
                    {pkg.specs.modulesKwp > 0 && <div className="bg-slate-50 p-3 rounded-lg"><SpecIcon type="modules"/> <div className="font-bold mt-1">{pkg.specs.modulesKwp} kWp</div><div className="text-xs text-slate-500">Module</div></div>}
                    {pkg.specs.storageKwh && <div className="bg-slate-50 p-3 rounded-lg"><SpecIcon type="storage"/> <div className="font-bold mt-1">{pkg.specs.storageKwh} kWh</div><div className="text-xs text-slate-500">Speicher</div></div>}
                    {pkg.specs.wallboxKw && <div className="bg-slate-50 p-3 rounded-lg"><SpecIcon type="wallbox"/> <div className="font-bold mt-1">{pkg.specs.wallboxKw} kW</div><div className="text-xs text-slate-500">Wallbox</div></div>}
                </div>

                 <h4 className="font-bold text-slate-800 mb-4">Kernleistungen:</h4>
                <ul className="space-y-3 mb-6 flex-grow">
                    {pkg.includes.map(item => <li key={item} className="flex items-start"><svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><span className="text-slate-600 text-sm">{item}</span></li>)}
                </ul>
                
                <div className="pt-6 mt-auto border-t border-slate-200">
                    <h4 className="font-bold text-slate-800 mb-4">Premium-Komponenten:</h4>
                    <div className="flex items-center gap-4">
                        {pkg.componentLogos.map(logo => (
                            <img key={logo} src={logo} alt="Hersteller Logo" className="h-6 object-contain" />
                        ))}
                    </div>
                </div>
            </div>
             <div className="p-6 bg-slate-50 rounded-b-xl mt-auto">
                <button onClick={onSelect} className="w-full bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-md transform hover:-translate-y-0.5">
                    {isLoggedIn ? 'Paket zum Profil hinzufügen' : 'Dieses Paket anfragen'}
                </button>
            </div>
        </div>
    );
};

const PreiseHero: React.FC<{ onCtaClick: (anchor?: string) => void }> = ({ onCtaClick }) => {
    return (
        <section className="preise-hero bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-6 py-20 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Text Content */}
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tighter animate-slide-in-up pillar-intro" style={{ animationDelay: '0.2s' }}>
                            Transparenz, die sich auszahlt.
                        </h1>
                        <h2 className="text-5xl md:text-6xl font-extrabold text-green-600 tracking-tighter mt-2 animate-slide-in-up pillar-benefits" style={{ animationDelay: '0.4s' }}>
                            Festpreise, die überzeugen.
                        </h2>
                        <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 animate-slide-in-up pillar-keyfacts" style={{ animationDelay: '0.6s' }}>
                           Entdecken Sie unsere schlüsselfertigen Solarpakete. Beste Technologie, erstklassiger Service – garantiert ohne versteckte Kosten.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slide-in-up" style={{ animationDelay: '0.8s' }}>
                            <a onClick={() => onCtaClick('preise-pakete')} className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-lg cta-button-glow cursor-pointer">
                                Zu den Paketen springen
                            </a>
                            <button onClick={() => document.dispatchEvent(new CustomEvent('open-chat'))} className="w-full sm:w-auto bg-white text-slate-700 font-bold py-3 px-8 rounded-lg hover:bg-slate-200 transition-colors border border-slate-300 shadow-md">
                                Individuelles Angebot
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Image Collage */}
                    <div className="hidden lg:block relative h-96">
                        <div className="absolute inset-0">
                            <img src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=800&auto=format&fit=crop" alt="Transparente Preise" className="floating-hero-img img-1" />
                            <img src="https://images.unsplash.com/photo-1588702547919-26089e690ecc?q=80&w=800&auto=format&fit=crop" alt="Festpreis-Garantie" className="floating-hero-img img-2" />
                            <img src="https://images.unsplash.com/photo-1617462474252-a33758e5781a?q=80&w=800&auto=format&fit=crop" alt="Solarpakete" className="floating-hero-img img-3" />
                            <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop" alt="Zuverlässiger Partner" className="floating-hero-img img-4" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


interface PreisePageProps {
    isLoggedIn: boolean;
}

const PreisePage: React.FC<PreisePageProps> = ({ isLoggedIn }) => {
    const [activeType, setActiveType] = useState<'private' | 'commercial'>('commercial');
    const [powerValue, setPowerValue] = useState(100);
    const [includeStorage, setIncludeStorage] = useState(false);
    const [includeWallbox, setIncludeWallbox] = useState(false);
    const [sortBy, setSortBy] = useState('price_asc');
    
    const handlePackageSelect = (pkg: PricingPackage) => {
        if (isLoggedIn) {
            document.dispatchEvent(new CustomEvent('add-package-request', { detail: pkg }));
        } else {
            const detail = {
                type: 'package_quote',
                packageData: {
                    name: pkg.name,
                    userType: pkg.userType,
                    price: pkg.price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }),
                    details: `${pkg.specs.modulesKwp} kWp Module, ${pkg.specs.storageKwh ?? 0} kWh Speicher`
                }
            };
            document.dispatchEvent(new CustomEvent('start-chat-with-context', { detail }));
        }
    };
    
    const openChatWithContext = (context: string) => {
        document.dispatchEvent(new CustomEvent('start-chat-with-context', { detail: { type: 'custom_inquiry', context: context } }));
    };

    const filteredPackages = useMemo(() => {
        let results = pricingPackages
            .filter(p => p.userType === activeType)
            .filter(p => p.specs.modulesKwp <= powerValue)
            .filter(p => includeStorage ? (p.specs.storageKwh ?? 0) > 0 : true)
            .filter(p => includeWallbox ? (p.specs.wallboxKw ?? 0) > 0 : true);

        results.sort((a, b) => {
            if (sortBy === 'price_asc') {
                return a.price - b.price;
            } else if (sortBy === 'price_desc') {
                return b.price - a.price;
            }
            return 0;
        });

        return results;
    }, [activeType, powerValue, includeStorage, includeWallbox, sortBy]);

    const resetFilters = () => {
        setPowerValue(100);
        setIncludeStorage(false);
        setIncludeWallbox(false);
        setSortBy('price_asc');
    };
    
    const handleHeroCta = (anchor?: string) => {
      if (anchor) {
        document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
      }
    };


    return (
        <>
            <Helmet>
                <title>Solaranlage Kosten - Festpreise für Photovoltaik-Anlagen | ZOE Solar</title>
                <meta name="description" content="Solaranlage Kosten: Transparente Festpreise für Photovoltaik-Anlagen. Ab 15.000€ inkl. Installation. Kostenlose Beratung. Jetzt Preise vergleichen!" />
                <meta name="keywords" content="Solaranlage Kosten, Photovoltaik Preise, PV-Anlage Preis, Solaranlage Festpreis, Photovoltaik Kosten" />
                <meta property="og:title" content="Solaranlage Kosten - Festpreise für Photovoltaik-Anlagen" />
                <meta property="og:description" content="Solaranlage Kosten: Transparente Festpreise für Photovoltaik-Anlagen. Ab 15.000€ inkl. Installation. Kostenlose Beratung." />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Solaranlage Kosten - Festpreise für Photovoltaik-Anlagen" />
                <meta name="twitter:description" content="Solaranlage Kosten: Transparente Festpreise für Photovoltaik-Anlagen. Ab 15.000€ inkl. Installation." />
                <link rel="canonical" href="https://zoe-solar.de/preise" />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Service",
                        "name": "Solaranlage Kosten",
                        "description": "Transparente Festpreise für Photovoltaik-Anlagen mit kostenloser Beratung und professioneller Installation",
                        "provider": {
                            "@type": "Organization",
                            "name": "ZOE Solar GmbH",
                            "url": "https://www.zoe-solar.de"
                        },
                        "areaServed": "DE",
                        "serviceType": "Photovoltaik Installation",
                        "offers": {
                            "@type": "Offer",
                            "priceRange": "15000-50000",
                            "priceCurrency": "EUR"
                        }
                    })}
                </script>
            </Helmet>
            <PreiseHero onCtaClick={handleHeroCta} />
            <div id="preise-pakete" className="py-20 bg-slate-50 scroll-mt-24">
                <div className="container mx-auto px-6">
                    <AIRecommender />

                     <div className="grid lg:grid-cols-4 gap-8 items-start mt-12">
                        {/* Sidebar */}
                        <aside className="lg:col-span-1 lg:sticky top-28">
                            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 space-y-6">
                               <h3 className="text-xl font-bold text-slate-800 border-b pb-3">Pakete filtern</h3>
                               
                                {/* Customer Type */}
                                <div>
                                    <h4 className="font-semibold text-slate-800 mb-3">Kundentyp</h4>
                                    <div className="flex bg-slate-100 p-1 rounded-lg">
                                        <button onClick={() => setActiveType('commercial')} className={`w-1/2 py-2 rounded-md font-bold transition-colors text-sm ${activeType === 'commercial' ? 'bg-white text-green-700 shadow' : 'text-slate-600'}`}>Gewerbe</button>
                                        <button onClick={() => setActiveType('private')} className={`w-1/2 py-2 rounded-md font-bold transition-colors text-sm ${activeType === 'private' ? 'bg-white text-green-700 shadow' : 'text-slate-600'}`}>Privat</button>
                                    </div>
                               </div>

                               {/* Power Filter */}
                               <div>
                                    <h4 className="text-sm font-semibold text-slate-600 mb-2">Leistung bis</h4>
                                    <input
                                        type="range"
                                        min="1"
                                        max="100"
                                        value={powerValue}
                                        onChange={e => setPowerValue(Number(e.target.value))}
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                                    />
                                    <div className="text-center font-bold text-slate-700 mt-2">
                                        {powerValue} kWp
                                    </div>
                                </div>
                               
                               {/* Components Filter */}
                               <div>
                                    <h4 className="text-sm font-semibold text-slate-600 mb-2">Komponenten</h4>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={includeStorage} onChange={() => setIncludeStorage(p => !p)} className="h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500" />
                                            <span className="text-slate-700">Mit Speicher</span>
                                        </label>
                                         <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={includeWallbox} onChange={() => setIncludeWallbox(p => !p)} className="h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500" />
                                            <span className="text-slate-700">Mit Wallbox</span>
                                        </label>
                                    </div>
                               </div>

                               <button onClick={resetFilters} className="w-full text-center text-sm text-slate-500 hover:text-red-600 hover:underline pt-4 border-t border-slate-200">Filter zurücksetzen</button>
                            </div>
                        </aside>
                        
                        {/* Main Content */}
                        <main className="lg:col-span-3">
                             <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 p-4 bg-white rounded-lg shadow-md border border-slate-200">
                                <p className="font-semibold text-slate-700">
                                    {filteredPackages.length} Paket(e) gefunden in <span className="text-green-600 font-bold">"{activeType === 'private' ? 'Privat' : 'Gewerbe'}"</span>
                                </p>
                                <div className="flex items-center gap-3">
                                    <label htmlFor="sort-by" className="text-sm font-semibold text-slate-600 flex-shrink-0">Sortieren nach:</label>
                                    <div className="relative">
                                        <select
                                            id="sort-by"
                                            value={sortBy}
                                            onChange={e => setSortBy(e.target.value)}
                                            className="bg-slate-700 text-white font-semibold border-transparent rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm pl-4 pr-10 py-2 appearance-none cursor-pointer"
                                        >
                                            <option value="price_asc">Preis aufsteigend</option>
                                            <option value="price_desc">Preis absteigend</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                 {filteredPackages.length > 0 ? (
                                    filteredPackages.map(pkg => <PackageCard key={pkg.id} pkg={pkg} onSelect={() => handlePackageSelect(pkg)} isLoggedIn={isLoggedIn} />)
                                 ) : (
                                    <div className="md:col-span-2 text-center py-20 bg-white rounded-lg shadow-md border">
                                        <h3 className="text-xl font-semibold text-slate-700">Keine Pakete für Ihre Auswahl gefunden.</h3>
                                        <p className="text-slate-500 mt-2">Bitte passen Sie Ihre Filter an oder starten Sie eine individuelle Anfrage.</p>
                                    </div>
                                 )}

                                  <div className="bg-slate-800 text-white rounded-2xl shadow-lg border-2 border-slate-700 flex flex-col p-8 justify-center text-center">
                                    <h3 className="text-2xl font-bold">Ihr Projekt ist größer?</h3>
                                    <p className="text-slate-300 my-4">Kein Problem. Für Großanlagen über 100 kWp oder Solarparks erstellen wir Ihnen ein maßgeschneidertes Angebot.</p>
                                    <button onClick={() => openChatWithContext('Individuelles Angebot für Großanlage')} className="w-full bg-slate-600 font-bold py-4 px-8 rounded-lg text-lg hover:bg-slate-700 transition-all duration-300 mt-4">
                                        Individuelles Angebot
                                    </button>
                                </div>
                            </div>
                        </main>
                     </div>
                </div>
            </div>
        </>
    );
};

export default PreisePage;
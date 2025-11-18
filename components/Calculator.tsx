import React, { useState, useMemo } from 'react';

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; unit?: string }> = ({ icon, label, value, unit }) => (
    <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50 flex items-center gap-4">
        <div className="flex-shrink-0 text-green-400">{icon}</div>
        <div>
            <div className="text-slate-300 text-sm">{label}</div>
            <div className="text-xl font-bold text-white">
                {value} <span className="text-lg font-medium text-slate-300">{unit}</span>
            </div>
        </div>
    </div>
);

const ExpertTipCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-slate-800/60 p-6 rounded-xl border border-slate-700/50 h-full">
        <div className="flex items-center gap-3 mb-3">
            <div className="flex-shrink-0 text-green-400">{icon}</div>
            <h4 className="font-bold text-white text-lg">{title}</h4>
        </div>
        <p className="text-slate-300 text-sm">{children}</p>
    </div>
);

const Tooltip: React.FC<{ text: string }> = ({ text }) => (
    <div className="group relative flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-800 text-white text-sm rounded-lg p-3 border border-slate-600 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
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
    <div className="space-y-3">
        <div className="flex justify-between items-baseline">
            <div className="flex items-center gap-2">
                <label className="font-semibold text-slate-300">{label}</label>
                {tooltipText && <Tooltip text={tooltipText} />}
            </div>
            <div className="flex items-center bg-slate-900/50 border border-slate-600 rounded-md">
                 <input
                    type="number"
                    value={value}
                    min={min}
                    max={max}
                    step={step}
                    onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value))))}
                    className="w-28 bg-transparent text-right font-bold text-green-400 text-lg p-2 focus:outline-none"
                    aria-label={label}
                />
                <span className="text-slate-400 pr-3">{unit}</span>
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


export const Calculator: React.FC = () => {
    const [surfaceArea, setSurfaceArea] = useState(500); // m²
    const [electricityPrice, setElectricityPrice] = useState(28); // ct/kWh
    const [chargerCount, setChargerCount] = useState(2); // Anzahl E-Ladepunkte

    const calculation = useMemo(() => {
        const isValid = !isNaN(surfaceArea) && !isNaN(electricityPrice) && !isNaN(chargerCount) && surfaceArea >= 10;
        // FIX: Changed numeric return values (0) to string ('--') for type consistency.
        if (!isValid) return { error: 'Bitte geben Sie gültige Werte ein.', totalInvestment: '--', yearlySavings: '--', amortizationYears: '--', co2SavingsTonnes: '--', selfConsumptionRate: '--', solarKilometersFormatted: '--' };

        const kwpPerSqM = 0.2, kwhPerKwpPerYear = 1050, co2KgPerKwh = 0.401;
        const baseSelfConsumptionRate = 0.40, avgKwhPerChargerYear = 6000;
        const feedInTariffCt = 8.1, kwhPer100km = 18, costPerCharger = 2000;

        const totalKwp = surfaceArea * kwpPerSqM;
        let costPerKwp = totalKwp < 4 ? 1200 : (totalKwp >= 100 ? 850 : 1150 + ((totalKwp - 4) * (850 - 1150)) / (100 - 4));
        const investmentSolar = totalKwp * costPerKwp;
        const investmentChargers = chargerCount * costPerCharger;
        const totalInvestment = investmentSolar + investmentChargers;
        const yearlyProductionKwh = totalKwp * kwhPerKwpPerYear;
        const chargerDemandKwh = chargerCount * avgKwhPerChargerYear;
        const baseSelfConsumedKwh = yearlyProductionKwh * baseSelfConsumptionRate;
        const totalSelfConsumedKwh = Math.min(yearlyProductionKwh, baseSelfConsumedKwh + chargerDemandKwh);
        const fedInKwh = yearlyProductionKwh - totalSelfConsumedKwh;
        const savingsFromSelfConsumption = (totalSelfConsumedKwh * electricityPrice) / 100;
        const earningsFromFeedIn = (fedInKwh * feedInTariffCt) / 100;
        const yearlySavings = savingsFromSelfConsumption + earningsFromFeedIn;
        const amortizationYears = yearlySavings > 0 ? totalInvestment / yearlySavings : 0;
        const co2SavingsKg = yearlyProductionKwh * co2KgPerKwh;
        const selfConsumptionRate = yearlyProductionKwh > 0 ? (totalSelfConsumedKwh / yearlyProductionKwh) * 100 : 0;
        const solarKwhForChargers = totalSelfConsumedKwh - baseSelfConsumedKwh;
        const solarKilometers = (solarKwhForChargers / kwhPer100km) * 100;

        return {
            error: null,
            totalInvestment: totalInvestment.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }),
            yearlySavings: yearlySavings.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }),
            amortizationYears: amortizationYears > 0 ? amortizationYears.toFixed(1) : '∞',
            co2SavingsTonnes: (co2SavingsKg / 1000).toLocaleString('de-DE', { maximumFractionDigits: 0 }),
            selfConsumptionRate: selfConsumptionRate.toFixed(0),
            solarKilometersFormatted: solarKilometers > 0 ? solarKilometers.toLocaleString('de-DE', { maximumFractionDigits: 0 }) : '0',
        };
    }, [surfaceArea, electricityPrice, chargerCount]);

    const amortizationProgress = useMemo(() => {
        const years = parseFloat(calculation.amortizationYears);
        if (isNaN(years) || years <= 0) return 0;
        const targetYears = 15; // A good target for visualization
        const progress = Math.max(0, 100 - ((years / targetYears) * 100));
        return Math.min(100, progress);
    }, [calculation.amortizationYears]);

    const circumference = 2 * Math.PI * 90; // 2 * pi * radius
    const strokeDashoffset = circumference - (amortizationProgress / 100) * circumference;

    const openChat = () => {
        document.dispatchEvent(new CustomEvent('open-chat'));
    };

    return (
        <section id="rechner" className="py-20 bg-slate-800 text-white">
            <div className="max-w-7xl mx-auto px-6">
                 <div className="text-center mb-16 max-w-4xl mx-auto">
                    <p className="font-bold text-green-400 uppercase tracking-wider">Interaktives Synergie-Dashboard</p>
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mt-2">Ihr Potenzial im Cockpit-Modus.</h2>
                    <p className="text-lg text-slate-300 mt-4">
                       Stellen Sie Ihre Parameter ein und sehen Sie in Echtzeit, wie Ihre Fläche zum profitablen Kraftwerk wird – und wie E-Mobilität den Turbo zündet.
                    </p>
                </div>
            </div>

            <div className="w-full bg-slate-900/70 backdrop-blur-sm py-12 border-y border-slate-700">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-3 gap-8 xl:gap-12 items-start">
                        {/* Column 1: Controls */}
                        <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700 space-y-8">
                             <h3 className="text-2xl font-bold text-white text-center">Ihre Parameter</h3>
                             <CustomSlider label="Verfügbare Fläche" unit="m²" value={surfaceArea} min={10} max={50000} step={10} onChange={setSurfaceArea} tooltipText="Pro 5 m² Fläche kann etwa 1 kWp (Kilowatt-Peak) an Photovoltaik-Leistung installiert werden."/>
                             <CustomSlider label="Ihr aktueller Strompreis" unit="ct/kWh" value={electricityPrice} min={15} max={50} step={1} onChange={setElectricityPrice} tooltipText="Ihr Strompreis ist entscheidend für die Berechnung Ihrer Ersparnis."/>
                             <CustomSlider label="Geplante E-Ladepunkte" unit="Stk." value={chargerCount} min={0} max={50} step={1} onChange={setChargerCount} tooltipText="Jeder Ladepunkt steigert den Eigenverbrauch und beschleunigt so die Amortisation."/>
                        </div>

                        {/* Column 2: Main Visualization */}
                        <div className="flex flex-col items-center text-center">
                            <div className="relative w-64 h-64">
                                <svg className="w-full h-full" viewBox="0 0 200 200">
                                    <circle className="text-slate-700" strokeWidth="10" stroke="currentColor" fill="transparent" r="90" cx="100" cy="100"/>
                                    <circle className="text-green-400" strokeWidth="10" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" stroke="currentColor" fill="transparent" r="90" cx="100" cy="100" style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 0.5s ease-out' }}/>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-slate-300 text-sm">Amortisation in</span>
                                    <span className="text-5xl font-bold text-white my-1">{calculation.amortizationYears}</span>
                                    <span className="text-slate-300 text-sm">Jahren</span>
                                </div>
                            </div>
                            <p className="text-sm text-slate-400 mt-4 max-w-xs">
                                Je schneller die Amortisation (grüner Kreis), desto rentabler Ihre Investition.
                            </p>
                        </div>

                        {/* Column 3: Stats */}
                        <div className="space-y-4">
                             <h3 className="text-2xl font-bold text-white text-center">Ihre Ergebnisse</h3>
                             <StatCard label="Geschätzte Gesamtinvestition" value={calculation.totalInvestment} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
                             <StatCard label="Mögliche Ersparnis pro Jahr" value={calculation.yearlySavings} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>} />
                             <StatCard label="CO₂-Reduktion pro Jahr" value={calculation.co2SavingsTonnes} unit="t" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 00.517 3.86l2.387.477a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 01-.517-3.86l.477-2.387a2 2 0 01.547-1.806z" /></svg>} />
                             <StatCard label="Reichweite mit Solarstrom p.a." value={calculation.solarKilometersFormatted} unit="km" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} />
                        </div>
                    </div>
                </div>
            </div>

             <div className="max-w-7xl mx-auto px-6 mt-16">
                 <div className="grid lg:grid-cols-2 gap-8">
                     <ExpertTipCard 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
                        title="Tipp: Eigenverbrauch maximieren"
                     >
                         Jede Kilowattstunde, die Sie selbst verbrauchen, ist bares Geld wert. Ladeinfrastruktur, Wärmepumpen oder die Produktion von Wasserstoff sind ideale Wege, um den Eigenverbrauch zu steigern und die Abhängigkeit vom Netz zu minimieren.
                     </ExpertTipCard>
                      <ExpertTipCard 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        title="Unverbindliche Analyse"
                     >
                         Dieser Rechner ist eine Schätzung. Für eine exakte Analyse berücksichtigen unsere Experten Ihren individuellen Lastgang, Standortfaktoren und alle Fördermöglichkeiten. Fordern Sie jetzt Ihre kostenlose Analyse an.
                     </ExpertTipCard>
                 </div>
                 <div className="text-center mt-12">
                    <button onClick={openChat} className="bg-green-500 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-green-600 transition-all duration-300 shadow-xl cta-button-glow transform hover:-translate-y-1">
                        Jetzt kostenlose Analyse anfordern
                    </button>
                 </div>
             </div>
        </section>
    );
};
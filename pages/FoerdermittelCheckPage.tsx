import React, { useState } from 'react';
import ImageWithFallback from '../components/ImageWithFallback';

const FoerdermittelHero: React.FC<{ onCtaClick: (anchor?: string) => void }> = ({ onCtaClick }) => {
    return (
        <section className="foerdermittel-hero bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-6 py-20 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Text Content */}
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tighter animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                           Fördermittel-Check.
                        </h1>
                        <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
                           Verpassen Sie keine Zuschüsse. Wir navigieren Sie durch den Förderdschungel und finden die passenden Töpfe für Ihr Projekt.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slide-in-up" style={{ animationDelay: '0.8s' }}>
                            <a onClick={() => onCtaClick('foerder-check')} className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-lg cta-button-glow cursor-pointer">
                                Digitaler Förder-Check
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Image Collage */}
                    <div className="hidden lg:block relative h-96">
                        <div className="absolute inset-0">
                            <a onClick={() => onCtaClick('foerder-check')} className="floating-hero-img foerdermittel-hero img-1 cursor-pointer">
                                <ImageWithFallback src="https://images.unsplash.com/photo-1639755243883-2073d8f310f8?q=80&w=800&auto=format&fit=crop" alt="Förderung" className="w-full h-full object-cover" imgWidth={250} imgHeight={250}/>
                            </a>
                            <a onClick={() => onCtaClick('foerder-check')} className="floating-hero-img foerdermittel-hero img-2 cursor-pointer">
                                <ImageWithFallback src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=800&auto=format&fit=crop" alt="Geld" className="w-full h-full object-cover" imgWidth={200} imgHeight={200}/>
                            </a>
                            <a onClick={() => onCtaClick('foerder-check')} className="floating-hero-img foerdermittel-hero img-3 cursor-pointer">
                                <ImageWithFallback src="https://images.unsplash.com/photo-1587907338887-a2c3a5e8e8b1?q=80&w=800&auto=format&fit=crop" alt="Dokumente" className="w-full h-full object-cover" imgWidth={220} imgHeight={220}/>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


const FoerdermittelCheckPage: React.FC = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        state: 'Brandenburg',
        companySize: '< 50 Mitarbeiter',
        projectType: 'PV-Dachanlage',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<string[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCheck = () => {
        setIsLoading(true);
        // Simulate API call and logic
        setTimeout(() => {
            const found: string[] = ['KfW-Programm 270', 'Steuerliche Vorteile (IAB & Sonder-AfA)'];
            if (formData.projectType.includes('Speicher')) {
                found.push('Landesförderung für Batteriespeicher');
            }
            if (formData.state === 'Berlin') {
                found.push('IBB Förderprogramm "Wirtschaft nah"');
            }
            setResults(found);
            setIsLoading(false);
            setStep(2);
        }, 1500);
    };

    const handleReset = () => {
        setStep(1);
        setResults([]);
    };
    
    const openChat = () => document.dispatchEvent(new CustomEvent('open-chat'));

     const handleHeroCta = (anchor?: string) => {
        if (anchor) {
            document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-white">
            <FoerdermittelHero onCtaClick={handleHeroCta} />
            <section id="foerder-check" className="py-20 bg-slate-50 scroll-mt-24">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1">
                             <div className="bg-white p-8 rounded-xl shadow-2xl border border-slate-200">
                                {step === 1 && (
                                    <div className="animate-fade-in">
                                        <h3 className="text-2xl font-bold text-slate-800 mb-2">Digitaler Förder-Assistent</h3>
                                        <p className="text-slate-500 mb-6">Beantworten Sie drei kurze Fragen, um eine erste Einschätzung potenzieller Förderprogramme zu erhalten.</p>
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">In welchem Bundesland befindet sich das Projekt?</label>
                                                <select name="state" value={formData.state} onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm">
                                                    <option>Baden-Württemberg</option>
                                                    <option>Bayern</option>
                                                    <option>Berlin</option>
                                                    <option>Brandenburg</option>
                                                    <option>Bremen</option>
                                                    <option>Hamburg</option>
                                                    <option>Hessen</option>
                                                    <option>Mecklenburg-Vorpommern</option>
                                                    <option>Niedersachsen</option>
                                                    <option>Nordrhein-Westfalen</option>
                                                    <option>Rheinland-Pfalz</option>
                                                    <option>Saarland</option>
                                                    <option>Sachsen</option>
                                                    <option>Sachsen-Anhalt</option>
                                                    <option>Schleswig-Holstein</option>
                                                    <option>Thüringen</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Wie groß ist Ihr Unternehmen?</label>
                                                <select name="companySize" value={formData.companySize} onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm">
                                                    <option>&lt; 50 Mitarbeiter</option>
                                                    <option>50 - 249 Mitarbeiter</option>
                                                    <option>&gt; 250 Mitarbeiter</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Welche Art von Projekt planen Sie?</label>
                                                <select name="projectType" value={formData.projectType} onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm">
                                                    <option>PV-Dachanlage</option>
                                                    <option>PV-Dachanlage mit Speicher</option>
                                                    <option>PV-Freiflächenanlage</option>
                                                    <option>Ladepark / Ladeinfrastruktur</option>
                                                </select>
                                            </div>
                                            <button onClick={handleCheck} disabled={isLoading} className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-green-700 transition-colors disabled:bg-slate-400">
                                                {isLoading ? 'Prüfung läuft...' : 'Fördermittel prüfen'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {step === 2 && (
                                     <div className="animate-fade-in">
                                        <h3 className="text-2xl font-bold text-slate-800 mb-2">Ergebnis Ihrer Vorab-Prüfung</h3>
                                        <p className="text-slate-500 mb-6">Basierend auf Ihren Angaben kommen folgende Förderungen potenziell in Frage:</p>
                                        <ul className="space-y-3 mb-6">
                                            {results.map(res => (
                                                <li key={res} className="flex items-start bg-green-50 p-3 rounded-md border border-green-200">
                                                    <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    <span className="text-slate-700 font-semibold">{res}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <p className="text-xs text-slate-400 mb-6">Dies ist eine unverbindliche Ersteinschätzung. Die genaue Förderfähigkeit muss individuell geprüft werden.</p>
                                        <div className="flex flex-col gap-4">
                                            <button onClick={openChat} className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-green-700 transition-colors">Jetzt detailliert prüfen lassen</button>
                                            <button onClick={handleReset} className="text-slate-600 font-semibold hover:underline">Neue Prüfung starten</button>
                                        </div>
                                    </div>
                                )}
                             </div>
                        </div>
                        <div className="order-1 lg:order-2 text-center lg:text-left">
                            <p className="font-bold text-green-600 uppercase tracking-wider">Kein Geld verschenken</p>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">Wir finden die passenden Töpfe für Ihr Projekt.</h2>
                            <p className="text-lg text-slate-600 mt-4">
                               Die deutsche Förderlandschaft ist komplex, aber lukrativ. Als Teil unseres Services analysieren wir alle verfügbaren Bundes- und Landesprogramme und unterstützen Sie aktiv bei der Antragsstellung, damit Sie die maximale finanzielle Unterstützung für Ihr Vorhaben erhalten.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FoerdermittelCheckPage;

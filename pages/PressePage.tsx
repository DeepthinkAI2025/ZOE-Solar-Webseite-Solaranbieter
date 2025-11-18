import React, { useState } from 'react';

const pressReleases = [
    {
        date: '25. August 2024',
        title: 'Testsieger: ZOE Solar als Bester Solaranbieter 2026 ausgezeichnet',
        excerpt: 'Eine unabhängige Auszeichnung bestätigt unseren Weg: ZOE Solar wurde vom renommierten Portal anbieter-tester.de zum besten Anbieter für gewerbliche Solaranlagen 2026 gekürt.',
        link: '#',
    },
    {
        date: '10. Juni 2024',
        title: 'ZOE Solar erweitert Team am Standort Berlin zur Deckung der steigenden Nachfrage',
        excerpt: 'Angesichts des starken Wachstums im Bereich gewerblicher PV-Anlagen haben wir unsere Kapazitäten in Planung und Projektmanagement ausgebaut.',
        link: '#',
    },
    {
        date: '15. Mai 2024',
        title: 'Neuer 5-Megawatt-Solarpark in der Lausitz erfolgreich ans Netz angeschlossen',
        excerpt: 'In Rekordzeit hat ZOE Solar einen weiteren Großsolarpark auf einer Konversionsfläche realisiert und leistet damit einen wichtigen Beitrag zum Strukturwandel in der Region.',
        link: '#',
    },
];

const PresseHero: React.FC<{ onCtaClick: (anchor?: string) => void }> = ({ onCtaClick }) => {
    return (
        <section className="presse-hero bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-6 py-20 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Text Content */}
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tighter animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                           Pressebereich.
                        </h1>
                        <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
                           Aktuelle Pressemitteilungen, Materialien und Kontaktinformationen für Journalisten und Medienvertreter.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slide-in-up" style={{ animationDelay: '0.8s' }}>
                            <a onClick={() => onCtaClick('pressemitteilungen')} className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-lg cta-button-glow cursor-pointer">
                                Zu den Mitteilungen
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Image Collage */}
                    <div className="hidden lg:block relative h-96">
                        <div className="absolute inset-0">
                            <img src="https://images.unsplash.com/photo-1455894127589-22f75400213a?q=80&w=800&auto=format&fit=crop" alt="Presse" className="floating-hero-img presse-hero img-1" />
                            <img src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop" alt="Nachrichten" className="floating-hero-img presse-hero img-2" />
                            <img src="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=800&auto=format&fit=crop" alt="Journalismus" className="floating-hero-img presse-hero img-3" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


const PressePage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'success'>('idle');

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(`Subscribing ${email} to press mailing list.`);
        setStatus('success');
    };
    
    const openChat = () => document.dispatchEvent(new CustomEvent('open-chat'));
    
    const handleHeroCta = (anchor?: string) => {
        if (anchor) {
            document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-white">
            <PresseHero onCtaClick={handleHeroCta} />
            <section id="pressemitteilungen" className="py-20 bg-slate-50 scroll-mt-24">
                <div className="container mx-auto px-6">
                    {/* Pressemitteilungen */}
                    <div className="max-w-4xl mx-auto mb-20">
                        <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Aktuelle Pressemitteilungen</h2>
                        <div className="space-y-8 border-l-2 border-slate-200 ml-4">
                            {pressReleases.map((release, index) => (
                                <div key={index} className="relative pl-8">
                                    <div className="absolute -left-[11px] top-1 w-5 h-5 bg-white border-2 border-slate-300 rounded-full"></div>
                                    <p className="text-sm text-slate-500 mb-1">{release.date}</p>
                                    <h3 className="text-xl font-bold text-slate-800 hover:text-green-600 transition-colors">
                                        <a href={release.link}>{release.title}</a>
                                    </h3>
                                    <p className="text-slate-600 mt-2">{release.excerpt}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Presseverteiler & Kontakt */}
                    <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
                        <div className="bg-white p-8 rounded-lg shadow-xl border border-slate-200">
                            <h3 className="text-2xl font-bold text-slate-800 mb-4">Für Journalisten</h3>
                            <p className="text-slate-600 mb-6">Sie möchten über ZOE Solar oder die Energiewende berichten? Hier finden Sie alle nötigen Ressourcen. Für Interview-Anfragen oder weitere Informationen, kontaktieren Sie uns bitte direkt.</p>
                            <div className="space-y-4">
                                <h4 className="font-semibold text-slate-700">Pressekontakt:</h4>
                                <p className="text-slate-600">
                                    Jeremy Schulze<br />
                                    <a href="mailto:presse@zoe-solar.de" className="text-green-600 hover:underline">presse@zoe-solar.de</a><br />
                                    <a href="tel:+493012345679" className="text-green-600 hover:underline">+49 (0) 30 123 456 79</a>
                                </p>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-xl border border-slate-200">
                            {status === 'success' ? (
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-green-800 mb-3">Vielen Dank!</h3>
                                    <p className="text-slate-700">Sie wurden erfolgreich in unseren Presseverteiler aufgenommen.</p>
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-4">In den Presseverteiler eintragen</h3>
                                    <p className="text-slate-600 mb-6">Verpassen Sie keine Neuigkeiten von ZOE Solar. Wir informieren Sie über neue Projekte, Partnerschaften und Unternehmens-Updates.</p>
                                    <form onSubmit={handleSubscribe}>
                                        <div className="flex gap-4">
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                placeholder="Ihre E-Mail-Adresse"
                                                required
                                                className="flex-grow px-4 py-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                            />
                                            <button type="submit" className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors">Anmelden</button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PressePage;
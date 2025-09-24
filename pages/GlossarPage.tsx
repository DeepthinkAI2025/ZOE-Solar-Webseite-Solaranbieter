import React, { useState, useMemo, useEffect } from 'react';
import { glossarData } from '../data/glossarData';

const slugify = (text: string) =>
    text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s*\(.*\)\s*/g, '') // Remove content in parentheses and surrounding spaces
        .replace(/\s+/g, '-') 
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');

const GlossarHero: React.FC<{ onCtaClick: (anchor?: string) => void }> = ({ onCtaClick }) => {
    return (
        <section className="glossar-hero bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-6 py-20 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Text Content */}
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tighter animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                           Solar-Glossar.
                        </h1>
                        <h2 className="text-5xl md:text-6xl font-extrabold text-green-600 tracking-tighter mt-2 animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
                            Wissen, das bleibt.
                        </h2>
                        <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
                           Von A wie Albedo bis Z wie Zelle. Wir erklären die wichtigsten Fachbegriffe der Photovoltaik – einfach und verständlich.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slide-in-up" style={{ animationDelay: '0.8s' }}>
                            <a onClick={() => onCtaClick('glossar-liste')} className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-lg cta-button-glow cursor-pointer">
                                Direkt zu den Begriffen
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Image Collage */}
                    <div className="hidden lg:block relative h-96">
                        <div className="absolute inset-0">
                            <img src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=800&auto=format&fit=crop" alt="Bücher" className="floating-hero-img glossar-hero img-1" />
                            <img src="https://images.unsplash.com/photo-1517436026-163580462p8?q=80&w=800&auto=format&fit=crop" alt="Informationen" className="floating-hero-img glossar-hero img-2" />
                            <img src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=800&auto=format&fit=crop" alt="Bibliothek" className="floating-hero-img glossar-hero img-3" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


const GlossarPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeLetter, setActiveLetter] = useState('A');

    // This effect handles both initial load with a hash and subsequent hash changes.
    useEffect(() => {
        const handleHashChange = () => {
            if (window.location.hash) {
                const id = window.location.hash.replace('#', '');
                const foundItem = glossarData.find(item => slugify(item.term) === id);
                
                if (foundItem) {
                    const firstLetter = foundItem.term.charAt(0).toUpperCase();
                    setActiveLetter(firstLetter);
                    setSearchTerm(''); // Clear search to ensure letter filtering is active

                    // A short timeout allows React to re-render with the correct activeLetter
                    // before we try to find and scroll to the element.
                    setTimeout(() => {
                        const element = document.getElementById(id);
                        if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            // Add a temporary highlight effect for better UX
                            element.classList.add('transition-all', 'duration-1000', 'bg-green-50', 'ring-2', 'ring-green-300', 'scale-[1.02]');
                            setTimeout(() => {
                                element.classList.remove('bg-green-50', 'ring-2', 'ring-green-300', 'scale-[1.02]');
                            }, 3000);
                        }
                    }, 100);
                }
            }
        };

        // Run on initial mount
        handleHashChange();

        // Listen for hash changes
        window.addEventListener('hashchange', handleHashChange);

        // Cleanup listener
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []); // Empty dependency array ensures this effect runs only once to set up the listener.


    const filteredData = useMemo(() => {
        if (searchTerm) {
            return glossarData.filter(item =>
                item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.definition.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return glossarData.filter(item => item.term.toUpperCase().startsWith(activeLetter));
    }, [searchTerm, activeLetter]);

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    
    const handleHeroCta = (anchor?: string) => {
        if (anchor) {
            document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-slate-50">
            <GlossarHero onCtaClick={handleHeroCta} />
            <div id="glossar-liste" className="py-20 scroll-mt-24">
                <div className="container mx-auto px-6">
                    
                    {/* Search and Alphabet Navigation */}
                    <div className="max-w-4xl mx-auto mb-12">
                        <div className="relative mb-6">
                            <input 
                                type="text"
                                placeholder="Begriff suchen..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    if (e.target.value === '') {
                                        // If search is cleared, reset to A
                                        setActiveLetter('A');
                                    }
                                }}
                                className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow text-lg bg-white text-slate-800 placeholder-slate-400"
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                        </div>
                        
                        {!searchTerm && (
                            <div className="flex flex-wrap justify-center gap-1">
                                {alphabet.map(letter => (
                                    <button
                                        key={letter}
                                        onClick={() => setActiveLetter(letter)}
                                        className={`w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-base font-bold rounded-md transition-colors duration-200 ${
                                            activeLetter === letter
                                                ? 'bg-green-600 text-white'
                                                : 'bg-white text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        {letter}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Glossary List */}
                    <div className="max-w-4xl mx-auto">
                        {filteredData.length > 0 ? (
                            <div className="space-y-6">
                                {filteredData.map(item => (
                                    <div key={item.term} id={slugify(item.term)} className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                                        <h2 className="text-xl font-bold text-green-700">{item.term}</h2>
                                        <p className="mt-2 text-slate-600">{item.definition}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md border">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <h3 className="mt-4 text-xl font-semibold text-slate-700">Keine Ergebnisse gefunden</h3>
                                <p className="text-slate-500 mt-2">
                                    {searchTerm 
                                        ? `Für Ihre Suche nach "${searchTerm}" konnten wir leider keinen passenden Begriff finden.`
                                        : `Für den Buchstaben "${activeLetter}" sind keine Einträge vorhanden.`
                                    }
                                </p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default GlossarPage;
import React, { useState, useMemo, useEffect } from 'react';
import { Page } from '../types';
import { articles, Article } from '../data/articles';
import { guides, Guide } from '../data/guidesData';
import { webinars, Webinar } from '../data/webinarsData';
import YouTubeEmbed from '../components/YouTubeEmbed';
import { glossarData } from '../data/glossarData';
import FAQ from '../components/FAQ';

interface WissensHubPageProps {
  setPage: (page: Page) => void;
  onSelectArticle: (slug: string) => void;
  onSelectGuide: (slug: string) => void;
}

const WissensHubHero: React.FC<{ onCtaClick: (anchor?: string) => void }> = ({ onCtaClick }) => {
    return (
        <section className="wissenshub-hero-v2 bg-slate-900 overflow-hidden">
            <div className="container mx-auto px-6 py-20 lg:py-32">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Text Content */}
                    <div className="text-center lg:text-left relative z-10">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tighter animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                           Wissen, das
                        </h1>
                        <h2 className="text-5xl md:text-6xl font-extrabold text-green-400 tracking-tighter mt-2 animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
                            Vorsprung schafft.
                        </h2>
                        <p className="mt-6 text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
                           Ihr zentraler Anlaufpunkt für tiefgehendes Wissen, aktuelle Trends und praktische Ratgeber rund um die gewerbliche Solarenergie.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slide-in-up" style={{ animationDelay: '0.8s' }}>
                            <a onClick={() => onCtaClick('bibliothek')} className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-lg cta-button-glow cursor-pointer">
                                Zur Bibliothek
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Image Collage */}
                    <div className="hidden lg:block relative h-96">
                        <div className="absolute inset-0" style={{ perspective: '1000px' }}>
                            <div className="wh-card card-1">
                                <img src={guides[0].imageUrl} alt={guides[0].title} />
                                <div className="wh-card-label">Leitfaden</div>
                            </div>
                            <div className="wh-card card-2">
                                <img src={articles[0].imageUrl} alt={articles[0].title} />
                                <div className="wh-card-label">Artikel</div>
                            </div>
                            <div className="wh-card card-3 bg-green-500 flex items-center justify-center text-white">
                                <div className="text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
                                    <p className="font-bold text-xl mt-2">Glossar</p>
                                </div>
                                <div className="wh-card-label">Wissen</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

type ResourceType = 'Artikel' | 'Leitfaden' | 'Whitepaper' | 'Checkliste' | 'Webinar';
type OriginalType = 'article' | 'guide' | 'webinar';

interface Resource {
    slug: string;
    title: string;
    description: string;
    type: ResourceType;
    imageUrl: string;
    date: string; // Format: YYYY-MM-DD or "DD. Month YYYY"
    originalType: OriginalType;
}

const WebinarModal: React.FC<{ webinar: Webinar; onClose: () => void }> = ({ webinar, onClose }) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleDownloadPdf = () => {
        alert('Die PDF-Version dieses Webinars wird in Kürze zur Verfügung stehen.');
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="webinar-modal-title">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative z-10 w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-auto max-h-[90vh] animate-slide-in-up">
                <header className="p-6 border-b border-slate-200 flex justify-between items-start">
                    <div>
                        <span className="text-sm font-semibold text-green-600 mb-1">{webinar.type}</span>
                        <h2 id="webinar-modal-title" className="text-2xl font-bold text-slate-800">{webinar.title}</h2>
                    </div>
                    <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-800" aria-label="Schließen">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                <div className="flex-grow overflow-y-auto">
                    <div className="aspect-video bg-black">
                        {webinar.videoId ? (
                            <YouTubeEmbed videoId={webinar.videoId} />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white">Video nicht verfügbar.</div>
                        )}
                    </div>
                    <div className="p-6">
                        <p className="text-slate-600">{webinar.description}</p>
                    </div>
                </div>
                 <footer className="p-6 bg-slate-50 border-t border-slate-200 flex-shrink-0">
                    <button
                        onClick={handleDownloadPdf}
                        className="w-full flex items-center justify-center gap-3 text-white font-semibold bg-green-600 hover:bg-green-700 px-4 py-3 rounded-lg transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        <span>Präsentation als PDF herunterladen</span>
                    </button>
                </footer>
            </div>
        </div>
    );
};


const ResourceCard: React.FC<{ resource: Resource, onSelect: (resource: Resource) => void }> = ({ resource, onSelect }) => {
    const isWebinar = resource.type === 'Webinar';
    const ctaText = isWebinar ? 'Video ansehen' : 'Weiterlesen';

    return (
        <div onClick={() => onSelect(resource)} className="group cursor-pointer bg-white rounded-xl shadow-lg border border-slate-200 transform hover:-translate-y-2 transition-transform duration-300 hover:shadow-2xl hover:border-green-300 flex flex-col overflow-hidden h-full">
            <div className="overflow-hidden relative">
                <img 
                    src={resource.imageUrl} 
                    alt={resource.title} 
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                {isWebinar && (
                    <>
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <span className="bg-slate-100 text-slate-700 font-semibold px-3 py-1 rounded-full text-xs self-start mb-3">{resource.type}</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-green-600 transition-colors duration-300 flex-grow">{resource.title}</h3>
                <p className="text-slate-600 text-sm mb-4">{resource.description}</p>
                <div className="font-bold text-green-600 group-hover:text-green-700 transition-colors mt-auto self-start">
                    {ctaText} <span className="inline-block transform group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
                </div>
            </div>
        </div>
    );
};

const ResourceToolCard: React.FC<{ title: string; description: string; icon: React.ReactNode; onClick: () => void }> = ({ title, description, icon, onClick }) => (
    <div onClick={onClick} className="group block bg-green-600 text-white rounded-xl shadow-lg p-8 transform hover:-translate-y-2 transition-transform duration-300 hover:shadow-2xl hover:bg-green-700 cursor-pointer h-full">
        <div className="bg-green-500/80 text-white p-3 rounded-full inline-block mb-4">
            {icon}
        </div>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-green-100 mb-4">{description}</p>
        <div className="font-bold text-white transition-colors mt-auto">
            Jetzt entdecken <span className="inline-block transform group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
        </div>
    </div>
);

const WissensHubPage: React.FC<WissensHubPageProps> = ({ setPage, onSelectArticle, onSelectGuide }) => {
    const [activeFilter, setActiveFilter] = useState<ResourceType | 'Alle'>('Alle');
    const [sortOrder, setSortOrder] = useState<'date_desc' | 'relevance'>('date_desc');
    const [selectedWebinar, setSelectedWebinar] = useState<Webinar | null>(null);
    
    const parseDate = (dateString: string): Date => {
        const months: { [key: string]: number } = {
            'Januar': 0, 'Februar': 1, 'März': 2, 'April': 3, 'Mai': 4, 'Juni': 5,
            'Juli': 6, 'August': 7, 'September': 8, 'Oktober': 9, 'November': 10, 'Dezember': 11
        };
        const parts = dateString.split(' ');
        if (parts.length === 3 && parts[0].includes('.')) {
            const day = parseInt(parts[0].replace('.', ''), 10);
            const month = months[parts[1]];
            const year = parseInt(parts[2], 10);
            return new Date(year, month, day);
        }
        return new Date(dateString); // Handles YYYY-MM-DD
    };

    const allResources = useMemo((): Resource[] => {
        const mappedArticles: Resource[] = articles.map(a => ({
            slug: a.slug, title: a.title, description: a.excerpt,
            type: 'Artikel', imageUrl: a.imageUrl, date: a.date, originalType: 'article',
        }));
        const mappedGuides: Resource[] = guides.map(g => ({
            slug: g.slug, title: g.title, description: g.description,
            type: g.type, imageUrl: g.imageUrl, date: g.date, originalType: 'guide',
        }));
        const mappedWebinars: Resource[] = webinars.map(w => ({
            slug: w.slug, title: w.title, description: w.description,
            type: 'Webinar', imageUrl: w.imageUrl, date: w.date, originalType: 'webinar',
        }));
        return [...mappedArticles, ...mappedGuides, ...mappedWebinars];
    }, []);

    const filteredAndSortedResources = useMemo(() => {
        let resources = [...allResources];
        if (activeFilter !== 'Alle') {
            resources = resources.filter(r => r.type === activeFilter);
        }
        if (sortOrder === 'date_desc') {
            resources.sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());
        }
        return resources;
    }, [allResources, activeFilter, sortOrder]);

    const handleResourceSelect = (resource: Resource) => {
        switch (resource.originalType) {
            case 'article':
                onSelectArticle(resource.slug);
                break;
            case 'guide':
                onSelectGuide(resource.slug);
                break;
            case 'webinar':
                const webinar = webinars.find(w => w.slug === resource.slug);
                if (webinar?.type === 'Aufzeichnung' && webinar.videoId) {
                    setSelectedWebinar(webinar); // Open modal for recorded webinars
                } else {
                    alert('Informationen zu diesem Live-Event folgen in Kürze. Melden Sie sich für unseren Newsletter an, um auf dem Laufenden zu bleiben!');
                }
                break;
        }
    };

    const handleHeroCta = (anchor?: string) => {
        if (anchor) {
            document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const filterCategories: (ResourceType | 'Alle')[] = ['Alle', 'Artikel', 'Leitfaden', 'Whitepaper', 'Checkliste', 'Webinar'];

    return (
        <>
            {selectedWebinar && <WebinarModal webinar={selectedWebinar} onClose={() => setSelectedWebinar(null)} />}
            <WissensHubHero onCtaClick={handleHeroCta} />
            <div className="py-20 bg-slate-50">
                <div id="bibliothek" className="container mx-auto px-6 space-y-20 scroll-mt-24">
                    <section>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-slate-900">Interaktive Tools & Nachschlagewerke</h2>
                            <p className="text-lg text-slate-600 mt-2">Unsere interaktiven Tools und Lexika für Ihren Wissensvorsprung.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            <ResourceToolCard title="Solar-Glossar" description="Von A wie Albedo bis Z wie Zelle. Alle Fachbegriffe einfach erklärt." icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>} onClick={() => setPage('glossar')} />
                            <ResourceToolCard title="Häufige Fragen (FAQ)" description="Die Antworten auf die wichtigsten Fragen rund um Ihr PV-Großprojekt." icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>} onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })} />
                            <ResourceToolCard title="Amortisationsrechner" description="Berechnen Sie in Echtzeit das Potenzial Ihrer Flächen und die Amortisationszeit." icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h3l-3-3m2-4H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-1M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" /></svg>} onClick={() => { setPage('home'); setTimeout(() => document.getElementById('rechner')?.scrollIntoView({ behavior: 'smooth' }), 100); }} />
                        </div>
                    </section>

                    <section>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-slate-900">Unsere Wissens-Bibliothek</h2>
                            <p className="text-lg text-slate-600 mt-2">Finden Sie genau die Inhalte, die Sie benötigen. Filtern und sortieren Sie nach Ihren Wünschen.</p>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 p-4 bg-white rounded-xl shadow-md border border-slate-200">
                            <div className="flex flex-wrap justify-center gap-2">
                                {filterCategories.map(cat => (
                                    <button key={cat} onClick={() => setActiveFilter(cat)} className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 transform hover:-translate-y-0.5 ${activeFilter === cat ? 'bg-green-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                        {cat}
                                    </button>
                                ))}
                            </div>
                            <div className="flex-shrink-0">
                                <label htmlFor="sort-order" className="sr-only">Sortieren nach</label>
                                <select id="sort-order" value={sortOrder} onChange={e => setSortOrder(e.target.value as any)} className="font-semibold border-slate-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500">
                                    <option value="date_desc">Neueste zuerst</option>
                                    <option value="relevance">Relevanz</option>
                                </select>
                            </div>
                        </div>

                        {filteredAndSortedResources.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredAndSortedResources.map(resource => (
                                    <ResourceCard key={`${resource.originalType}-${resource.slug}`} resource={resource} onSelect={handleResourceSelect} />
                                ))}
                            </div>
                        ) : (
                             <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md border">
                                <h3 className="text-xl font-semibold text-slate-700">Keine Beiträge gefunden.</h3>
                                <p className="text-slate-500 mt-2">Für Ihre Auswahl gibt es aktuell keine Inhalte. Bitte ändern Sie den Filter.</p>
                            </div>
                        )}
                    </section>
                     {/* FAQ Section */}
                     <section id="faq" className="py-20 bg-white">
                         <FAQ customerType="business" setPage={setPage} />
                     </section>
                </div>
            </div>
        </>
    );
};

export default WissensHubPage;
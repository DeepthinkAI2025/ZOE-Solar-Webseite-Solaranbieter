import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Page } from '../types';
import { articles, Article } from '../data/articles';

interface MagazinPageProps {
    setPage: (page: Page) => void;
    onSelectArticle: (slug: string) => void;
}

const MagazinHero: React.FC<{ onCtaClick: (anchor?: string) => void }> = ({ onCtaClick }) => {
    return (
        <section className="magazin-hero bg-gradient-to-br from-green-900 via-slate-900 to-green-800 overflow-hidden">
            <div className="container mx-auto px-6 py-20 lg:py-32">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="text-center lg:text-left relative z-10">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tighter animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                            Magazin
                        </h1>
                        <h2 className="text-5xl md:text-6xl font-extrabold text-green-400 tracking-tighter mt-2 animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
                            Aktuelle Einblicke
                        </h2>
                        <p className="mt-6 text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
                            Entdecken Sie die neuesten Trends, Technologien und Geschichten aus der Welt der gewerblichen Solarenergie. Unser Magazin hält Sie auf dem Laufenden.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slide-in-up" style={{ animationDelay: '0.8s' }}>
                            <a onClick={() => onCtaClick('artikel')} className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-lg cta-button-glow cursor-pointer">
                                Zu den Artikeln
                            </a>
                        </div>
                    </div>
                    <div className="hidden lg:block relative h-96">
                        <div className="absolute inset-0" style={{ perspective: '1000px' }}>
                            <div className="magazin-card card-1">
                                <img src={articles[0]?.imageUrl} alt={articles[0]?.title} />
                                <div className="magazin-card-label">Artikel</div>
                            </div>
                            <div className="magazin-card card-2">
                                <img src={articles[1]?.imageUrl} alt={articles[1]?.title} />
                                <div className="magazin-card-label">News</div>
                            </div>
                            <div className="magazin-card card-3 bg-green-500 flex items-center justify-center text-white">
                                <div className="text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                    <p className="font-bold text-xl mt-2">Magazin</p>
                                </div>
                                <div className="magazin-card-label">Wissen</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const ArticleCard: React.FC<{ article: Article, onSelect: (article: Article) => void }> = ({ article, onSelect }) => {
    return (
        <div onClick={() => onSelect(article)} className="group cursor-pointer block bg-white rounded-xl shadow-lg border border-slate-200 transform hover:-translate-y-2 transition-transform duration-300 hover:shadow-2xl hover:border-green-300 flex flex-col overflow-hidden h-full">
            <div className="overflow-hidden relative">
                <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <span className="bg-slate-100 text-slate-700 font-semibold px-3 py-1 rounded-full text-xs self-start mb-3">{article.category}</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-green-600 transition-colors duration-300 flex-grow">{article.title}</h3>
                <p className="text-slate-600 text-sm mb-4">{article.excerpt}</p>
                <div className="font-bold text-green-600 group-hover:text-green-700 transition-colors mt-auto self-start">
                    Weiterlesen <span className="inline-block transform group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
                </div>
            </div>
        </div>
    );
};

const MagazinPage: React.FC<MagazinPageProps> = ({ setPage, onSelectArticle }) => {
    const [activeCategory, setActiveCategory] = useState<string>('Alle');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const categories = useMemo(() => {
        const cats = Array.from(new Set(articles.map(a => a.category)));
        return ['Alle', ...cats];
    }, []);

    const filteredArticles = useMemo(() => {
        let filtered = articles;
        if (activeCategory !== 'Alle') {
            filtered = filtered.filter(a => a.category === activeCategory);
        }
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(a =>
                a.title.toLowerCase().includes(query) ||
                a.excerpt.toLowerCase().includes(query)
            );
        }
        return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [activeCategory, searchQuery]);

    const handleArticleSelect = (article: Article) => {
        onSelectArticle(article.slug);
    };

    const handleHeroCta = (anchor?: string) => {
        if (anchor) {
            document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <Helmet>
                <title>Magazin | ZOE Solar - Aktuelle Einblicke in Solarenergie</title>
                <meta name="description" content="Entdecken Sie das ZOE Solar Magazin mit den neuesten Trends, Technologien und Geschichten aus der gewerblichen Solarenergie. Bleiben Sie informiert." />
                <meta name="keywords" content="Solar Magazin, Solar News, Photovoltaik Trends, ZOE Solar Magazin" />
                <meta property="og:title" content="Magazin | ZOE Solar" />
                <meta property="og:description" content="Aktuelle Einblicke in die Welt der gewerblichen Solarenergie." />
                <meta property="og:image" content="https://www.zoe-solar.de/images/magazin-hero.jpg" />
                <meta property="og:url" content="https://www.zoe-solar.de/magazin" />
                <meta name="twitter:card" content="summary_large_image" />
                <link rel="canonical" href="https://www.zoe-solar.de/magazin" />
            </Helmet>
            <MagazinHero onCtaClick={handleHeroCta} />
            <div className="py-20 bg-slate-50">
                <div className="container mx-auto px-6 space-y-20">
                    <section id="artikel">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-slate-900">Unser Magazin</h2>
                            <p className="text-lg text-slate-600 mt-2">Finden Sie die neuesten Artikel und Einblicke. Filtern Sie nach Kategorien oder suchen Sie gezielt.</p>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 p-4 bg-white rounded-xl shadow-md border border-slate-200">
                            <div className="flex flex-wrap justify-center gap-2">
                                {categories.map(cat => (
                                    <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 transform hover:-translate-y-0.5 ${activeCategory === cat ? 'bg-green-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                        {cat}
                                    </button>
                                ))}
                            </div>
                            <div className="w-full md:w-auto">
                                <input
                                    type="text"
                                    placeholder="Artikel suchen..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full md:w-64 px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                        </div>

                        {filteredArticles.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredArticles.map(article => (
                                    <ArticleCard key={article.slug} article={article} onSelect={handleArticleSelect} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md border">
                                <h3 className="text-xl font-semibold text-slate-700">Keine Artikel gefunden.</h3>
                                <p className="text-slate-500 mt-2">Für Ihre Suche gibt es aktuell keine Inhalte. Bitte ändern Sie den Filter oder die Suchbegriffe.</p>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </>
    );
};

export default MagazinPage;
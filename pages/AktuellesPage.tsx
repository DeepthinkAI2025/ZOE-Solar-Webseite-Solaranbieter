import React, { useState, useMemo } from 'react';
import { articles, Article } from '../data/articles';
import { Page } from '../types';

interface AktuellesPageProps {
    onSelectArticle: (slug: string) => void;
}

const AktuellesHero: React.FC<{ onCtaClick: (anchor?: string) => void }> = ({ onCtaClick }) => {
    return (
        <section className="aktuelles-hero-v2 bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-6 py-20 lg:py-32 relative">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Text Content */}
                    <div className="text-center lg:text-left z-10">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tighter animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                           Unser Magazin.
                        </h1>
                        <h2 className="text-5xl md:text-6xl font-extrabold text-green-600 tracking-tighter mt-2 animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
                            Einblicke & Trends.
                        </h2>
                        <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
                           Bleiben Sie informiert: Hier finden Sie die neuesten Artikel, Fallstudien und Technologie-Updates aus der Welt der erneuerbaren Energien.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slide-in-up" style={{ animationDelay: '0.8s' }}>
                            <a onClick={() => onCtaClick('artikel')} className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-lg cta-button-glow cursor-pointer">
                                Neueste Artikel
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Image Collage */}
                    <div className="hidden lg:block relative h-96">
                        <div className="hero-image-container">
                            <div className="main-image">
                                <img src={articles[0].imageUrl} alt={articles[0].title} />
                            </div>
                            <div className="overlay-card card-1">
                                <img src={articles[1].imageUrl} alt={articles[1].title} />
                                <h4>{articles[1].title}</h4>
                            </div>
                             <div className="overlay-card card-2">
                                <img src={articles[2].imageUrl} alt={articles[2].title} />
                                <h4>{articles[2].title}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


// Sub-components for the new magazine layout
const MainFeaturedCard: React.FC<{ article: Article; onSelect: () => void }> = ({ article, onSelect }) => (
    <div onClick={onSelect} className="group relative w-full h-full cursor-pointer overflow-hidden rounded-2xl shadow-2xl border border-slate-200/50">
        <img 
            src={article.imageUrl}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105 group-hover:brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
        <div className="relative flex h-full flex-col justify-end p-8 text-white">
            <div className="flex items-center gap-4 mb-3">
                <span className="bg-green-500 text-white font-semibold px-3 py-1 rounded-full text-sm">{article.category}</span>
                <p className="text-sm text-slate-200">{article.date}</p>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3 transition-colors duration-300 group-hover:text-green-300">{article.title}</h2>
            <p className="text-slate-200 mb-4 text-lg hidden md:block max-w-2xl">{article.excerpt}</p>
            <div className="font-bold text-green-400 group-hover:text-white transition-colors duration-300">
                Weiterlesen <span className="inline-block transform group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
            </div>
        </div>
    </div>
);

const SecondaryFeaturedCard: React.FC<{ article: Article; onSelect: () => void }> = ({ article, onSelect }) => (
     <div onClick={onSelect} className="group relative w-full h-full cursor-pointer overflow-hidden rounded-2xl shadow-xl border border-slate-200/50">
        <img 
            src={article.imageUrl}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105 group-hover:brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="relative flex h-full flex-col justify-end p-6 text-white">
            <span className="bg-green-500 text-white font-semibold px-2 py-0.5 rounded-full text-xs self-start mb-2">{article.category}</span>
            <h2 className="text-xl font-bold text-white transition-colors duration-300 group-hover:text-green-300">{article.title}</h2>
        </div>
    </div>
);

const ArticleCard: React.FC<{ article: Article, onSelect: () => void }> = ({ article, onSelect }) => (
    <div onClick={onSelect} className="group bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col cursor-pointer hover:shadow-2xl hover:border-green-300">
        <div className="overflow-hidden relative">
            <img 
                src={article.imageUrl}
                alt={article.title}
                loading="lazy"
                decoding="async"
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
            />
             <span className="absolute top-4 left-4 bg-green-100 text-green-800 font-semibold px-3 py-1 rounded-full text-sm">{article.category}</span>
        </div>
        <div className="p-6 flex flex-col flex-grow">
            <p className="text-sm text-slate-500 mb-3">{article.date}</p>
            <h2 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-green-600 transition-colors duration-300 flex-grow">{article.title}</h2>
            <p className="text-slate-600 text-sm mb-4">{article.excerpt}</p>
            <div className="self-start font-bold text-green-600 group-hover:text-green-700 transition-colors mt-auto">
                Weiterlesen <span className="inline-block transform group-hover:translate-x-1 transition-transform duration-300">&rarr;</span>
            </div>
        </div>
    </div>
);


const AktuellesPage: React.FC<AktuellesPageProps> = ({ onSelectArticle }) => {
    const [activeCategory, setActiveCategory] = useState<string>('Alle');
    
    const categories = useMemo(() => ['Alle', ...new Set(articles.map(a => a.category))], []);

    const articlesByCategory = useMemo(() => {
        if (activeCategory === 'Alle') return articles;
        return articles.filter(a => a.category === activeCategory);
    }, [activeCategory]);
    
    const [mainFeatured, ...restArticles] = articlesByCategory;
    const secondaryFeatured = restArticles.slice(0, 2);
    const otherArticles = restArticles.slice(2);

     const handleHeroCta = (anchor?: string) => {
        if (anchor) {
            document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div id="artikel" className="bg-slate-50 scroll-mt-24">
            <AktuellesHero onCtaClick={handleHeroCta} />
            <div className="py-20">
                <div className="container mx-auto px-6 space-y-16">
                    
                    {/* Category Filters */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 transform hover:-translate-y-0.5 ${
                                    activeCategory === category 
                                    ? 'bg-green-600 text-white shadow-md' 
                                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-300'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Featured Section */}
                    {mainFeatured ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-8 h-auto lg:h-[600px]">
                            <div className="lg:col-span-2 lg:row-span-2 min-h-[400px] flex">
                                <MainFeaturedCard article={mainFeatured} onSelect={() => onSelectArticle(mainFeatured.slug)} />
                            </div>
                            {secondaryFeatured.map(article => (
                                <div key={article.slug} className="min-h-[240px] flex">
                                    <SecondaryFeaturedCard article={article} onSelect={() => onSelectArticle(article.slug)} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-lg shadow-md border">
                            <h3 className="text-xl font-semibold text-slate-700">Keine Beiträge in dieser Kategorie gefunden.</h3>
                            <p className="text-slate-500 mt-2">Bitte wählen Sie eine andere Kategorie aus.</p>
                        </div>
                    )}
                    
                    {/* Other Articles Grid */}
                    {otherArticles.length > 0 && (
                        <div className="pt-8 border-t border-slate-200">
                            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center md:text-left">Weitere Beiträge</h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {otherArticles.map((article) => (
                                <ArticleCard 
                                        key={article.slug} 
                                        article={article} 
                                        onSelect={() => onSelectArticle(article.slug)} 
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AktuellesPage;
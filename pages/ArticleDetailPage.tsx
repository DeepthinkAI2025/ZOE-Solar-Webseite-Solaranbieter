import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { articles, Article, ContentBlock } from '../data/articles';
import { glossarData } from '../data/glossarData';
import GlossarLink from '../components/GlossarLink';

interface ArticleDetailPageProps {
    article: Article;
    onBack: () => void;
}

// Helper to create URL-friendly slugs from headings
const slugify = (text: string) =>
    text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-'); // Replace multiple - with single -

// Reusable Progress Bar Component
const ReadingProgressBar: React.FC = () => {
    const [width, setWidth] = useState(0);
    const scrollListener = useCallback(() => {
        const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
        setWidth(progress);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', scrollListener);
        scrollListener();
        return () => window.removeEventListener('scroll', scrollListener);
    }, [scrollListener]);

    return <div id="reading-progress-bar" style={{ width: `${width}%` }} />;
};

// Reusable Mini Article Card for "Related" section
const RelatedArticleCard: React.FC<{ article: Article, onSelect: () => void }> = ({ article, onSelect }) => (
    <div onClick={onSelect} className="group h-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col cursor-pointer hover:shadow-2xl hover:border-green-300">
       <div className="overflow-hidden">
           <img 
               src={article.imageUrl}
               alt={article.title}
               loading="lazy"
               decoding="async"
               className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
           />
       </div>
       <div className="p-4 flex flex-col flex-grow">
           <span className="text-sm font-semibold text-green-600 mb-2">{article.category}</span>
           <h3 className="text-lg font-bold text-slate-800 group-hover:text-green-600 transition-colors duration-300 flex-grow">{article.title}</h3>
           <div className="self-start font-bold text-green-600 text-sm group-hover:text-green-700 transition-colors mt-3">
               Weiterlesen <span className="inline-block transform group-hover:translate-x-1 transition-transform">&rarr;</span>
           </div>
       </div>
   </div>
);

// New Content Block Components
const InfoCard: React.FC<{ title: string; text: string; icon: 'info' | 'tip' | 'warning'; textRenderer: (text: string) => React.ReactNode; }> = ({ title, text, icon, textRenderer }) => {
    const icons = {
        info: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        tip: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.375 3.375 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
        warning: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
    };

    return (
        <div className={`info-card info-card-${icon}`}>
            <div className="info-card-icon-wrapper">{icons[icon]}</div>
            <div>
                <h4>{title}</h4>
                <p>{textRenderer(text)}</p>
            </div>
        </div>
    );
};

const ImageWithCaption: React.FC<{ imageUrl: string; caption: string }> = ({ imageUrl, caption }) => (
    <figure className="my-8">
        <img src={imageUrl} alt={caption} loading="lazy" decoding="async" className="w-full rounded-lg shadow-lg" />
        <figcaption className="embedded-image-caption">{caption}</figcaption>
    </figure>
);


const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({ article, onBack }) => {
    const openChat = () => document.dispatchEvent(new CustomEvent('open-chat'));
    const [activeHeading, setActiveHeading] = useState<string>('');
    
    // --- Glossar Linking Logic ---
    const { renderContentWithGlossar } = useMemo(() => {
        const glossarTerms = glossarData.map(item => item.term).sort((a, b) => b.length - a.length);
        const escapedGlossarTerms = glossarTerms.map(term => term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
        const glossarRegex = new RegExp(`\\b(${escapedGlossarTerms.join('|')})\\b`, 'gi');

        const renderFn = (text: string): React.ReactNode => {
            if (!text) return text;
            const boldParts = text.split(/(\*\*.*?\*\*)/g);

            return boldParts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    const boldText = part.slice(2, -2);
                    return <strong key={i}>{boldText}</strong>;
                }

                const glossarParts = part.split(glossarRegex);
                return glossarParts.map((glossarPart, j) => {
                    const matchedTerm = glossarTerms.find(term => term.toLowerCase() === glossarPart.toLowerCase());
                    if (matchedTerm) {
                        return <GlossarLink key={`${i}-${j}`} term={matchedTerm}>{glossarPart}</GlossarLink>;
                    }
                    return <React.Fragment key={`${i}-${j}`}>{glossarPart}</React.Fragment>;
                });
            });
        };
        return { renderContentWithGlossar: renderFn };
    }, []);

    // Extract headings for TOC
    const headings = useMemo(() => 
        article.content
            .flatMap(block => (block.type === 'heading' || block.type === 'subheading') ? [{ text: block.text, slug: slugify(block.text) }] : []),
        [article]
    );

    // Observer for active heading highlighting
    useEffect(() => {
        if (headings.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveHeading(entry.target.id);
                    }
                });
            },
            { rootMargin: '-30% 0px -70% 0px' }
        );

        const headingElements = headings.map(({ slug }) => document.getElementById(slug)).filter(el => el);
        headingElements.forEach((el) => observer.observe(el));
        
        return () => observer.disconnect();
    }, [headings]);

    const relatedArticles = useMemo(() => {
        return articles.filter(a => a.slug !== article.slug && a.category === article.category).slice(0, 3);
    }, [article]);
    
    // Social Share Links
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = encodeURIComponent(`Interessanter Artikel von ZOE Solar: ${article.title}`);
    const shareLinks = {
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(article.title)}&summary=${encodeURIComponent(article.excerpt)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${shareText}`,
    };
    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert('Link in die Zwischenablage kopiert!');
        });
    };
    
    const renderHeadingWithAI = (block: ContentBlock, index: number) => {
        if (block.type !== 'heading' && block.type !== 'subheading') return null;

        const handleAIClick = () => {
            const contentStartIndex = article.content.findIndex(b => b === block);
            let contentEndIndex = article.content.findIndex((b, i) => i > contentStartIndex && (b.type === 'heading' || b.type === 'subheading'));
            if (contentEndIndex === -1) contentEndIndex = article.content.length;
            
            const relevantContentBlocks = article.content.slice(contentStartIndex, contentEndIndex);
            
            const contextText = relevantContentBlocks.map(b => {
                if ('text' in b) return b.text;
                if ('items' in b && b.items) return b.items.join('\n- ');
                return '';
            }).join('\n\n');

            const detail = { type: 'contextual_help', context: contextText, source: article.title };
            document.dispatchEvent(new CustomEvent('start-chat-with-context', { detail }));
        };

        const HeadingTag = block.type === 'heading' ? 'h2' : 'h3';

        return (
            <div key={index} className="group relative">
                <HeadingTag id={slugify(block.text)}>
                    {block.text}
                     <button
                        onClick={handleAIClick}
                        className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity absolute top-1/2 -translate-y-1/2 -right-10 p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full"
                        title={`Frage zu diesem Abschnitt stellen`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.375 3.375 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                    </button>
                </HeadingTag>
            </div>
        );
    };

    return (
        <>
            <ReadingProgressBar />

            <header className="relative h-[60vh] min-h-[450px] md:h-[70vh] text-white flex flex-col justify-between" style={{'--promo-banner-height': '0px'} as React.CSSProperties}>
                <div className="absolute inset-0 bg-slate-900">
                    <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover opacity-50" loading="eager" decoding="auto" fetchPriority="high"/>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                
                <div className="relative container mx-auto px-6 pt-28">
                     <button onClick={onBack} className="inline-flex items-center gap-2 text-slate-200 hover:text-white transition-colors font-semibold bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        <span>Zurück zur Übersicht</span>
                    </button>
                </div>

                <div className="relative container mx-auto px-6 py-12">
                    <div className="max-w-4xl">
                        <span className="bg-green-500 text-white font-semibold px-3 py-1 rounded-full text-sm">{article.category}</span>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mt-4 leading-tight shadow-text">{article.title}</h1>
                    </div>
                </div>
            </header>
            
            <div className="bg-white py-16 lg:py-24">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
                        
                        {/* Article Content */}
                        <article className="lg:col-span-8">
                            <div className="flex items-center gap-4 text-slate-500 border-b border-slate-200 pb-8 mb-10">
                                <img src={article.authorImageUrl} alt={article.authorName} loading="lazy" decoding="async" className="w-16 h-16 rounded-full object-cover"/>
                                <div>
                                    <p className="font-bold text-slate-800 text-lg">{article.authorName}</p>
                                    <p className="text-sm">{article.authorRole} &bull; {article.date}</p>
                                </div>
                            </div>
                            
                            <div className="prose-custom prose prose-lg max-w-none text-slate-700">
                                <p className="lead">{renderContentWithGlossar(article.excerpt)}</p>
                                {article.content.map((block, index) => {
                                    switch (block.type) {
                                        case 'heading':
                                        case 'subheading':
                                            return renderHeadingWithAI(block, index);
                                        case 'quote':
                                            return (
                                                <blockquote key={index}>
                                                    <p>{renderContentWithGlossar(block.text)}</p>
                                                    {block.attribution && <cite>{block.attribution}</cite>}
                                                </blockquote>
                                            );
                                        case 'list':
                                            return <ul key={index}>{block.items.map((item, i) => <li key={i}>{renderContentWithGlossar(item)}</li>)}</ul>;
                                        case 'info_card':
                                            return <InfoCard key={index} title={block.title} text={block.text} icon={block.icon} textRenderer={renderContentWithGlossar} />;
                                        case 'image_with_caption':
                                            return <ImageWithCaption key={index} imageUrl={block.imageUrl} caption={block.caption} />;
                                        case 'paragraph':
                                        default:
                                            return <p key={index}>{renderContentWithGlossar(block.text)}</p>;
                                    }
                                })}
                            </div>

                             <div className="mt-16 pt-8 border-t border-slate-200 flex items-start gap-6 bg-slate-50 p-6 rounded-lg">
                                <img src={article.authorImageUrl} alt={article.authorName} loading="lazy" decoding="async" className="w-20 h-20 rounded-full object-cover flex-shrink-0"/>
                                <div>
                                    <p className="text-xs text-slate-500 font-semibold uppercase">Verfasst von</p>
                                    <h3 className="font-bold text-slate-800 text-xl">{article.authorName}</h3>
                                    <p className="text-sm text-slate-500 mb-2">{article.authorRole}</p>
                                    <p className="text-slate-600 text-sm">{article.authorBio}</p>
                                </div>
                            </div>
                        </article>

                        {/* Sticky Sidebar */}
                        <aside className="lg:col-span-4">
                            <div className="sticky top-28 space-y-8">
                                {headings.length > 0 && (
                                    <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
                                        <h3 className="font-bold text-slate-800 mb-4">Inhaltsverzeichnis</h3>
                                        <ul className="space-y-2">
                                            {headings.map(({ text, slug }) => (
                                                <li key={slug}>
                                                    <a href={`#${slug}`} className={`block text-sm border-l-2 transition-all duration-200 pl-3 ${activeHeading === slug ? 'border-green-500 text-green-600 font-semibold' : 'border-slate-300 text-slate-500 hover:text-slate-800 hover:border-slate-400'}`}>
                                                        {text}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <div className="p-6 bg-white rounded-lg border border-slate-200">
                                     <h3 className="font-bold text-slate-800 mb-4">Artikel teilen</h3>
                                     <div className="flex items-center gap-2">
                                         <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex-1 p-2 bg-slate-100 rounded-md text-slate-600 hover:bg-green-100 hover:text-green-600 transition-colors flex justify-center items-center" aria-label="Auf LinkedIn teilen">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                                         </a>
                                         <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex-1 p-2 bg-slate-100 rounded-md text-slate-600 hover:bg-green-100 hover:text-green-600 transition-colors flex justify-center items-center" aria-label="Auf Twitter teilen">
                                             <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.293 1.634 4.212 3.793 4.649-.65.177-1.343.23-2.043.188 1.6 2.1 4.3 2.7 5.945 2.1-1.353 1.059-3.056 1.691-4.901 1.691-1.2 0-2.8-.2-3.5-.5 1.75 1.123 3.825 1.776 6.044 1.776 7.23 0 11.181-6.002 10.877-11.411.85-.615 1.581-1.385 2.16-2.25z"/></svg>
                                         </a>
                                         <button onClick={copyToClipboard} className="flex-1 p-2 bg-slate-100 rounded-md text-slate-600 hover:bg-green-100 hover:text-green-600 transition-colors flex justify-center items-center" aria-label="Link kopieren">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 1h-14v16h2v-14h12v-2zm-2 4h-12v18h12v-18zm-10 16h8v-14h-8v14z"/></svg>
                                         </button>
                                     </div>
                                </div>
                                <div className="p-8 bg-green-600 text-white rounded-lg text-center">
                                    <h3 className="text-xl font-bold">Bereit für Ihr Projekt?</h3>
                                    <p className="text-green-100 my-3 text-sm">Starten Sie jetzt Ihre kostenlose und unverbindliche Potenzial-Analyse.</p>
                                    <button onClick={openChat} className="mt-2 bg-white text-green-600 font-bold py-2 px-5 rounded-lg hover:bg-green-50 transition-colors w-full">
                                        Analyse starten
                                    </button>
                                </div>
                            </div>
                        </aside>

                    </div>
                </div>
            </div>
            
            {/* Related Articles Section */}
            {relatedArticles.length > 0 && (
                 <section className="py-20 bg-slate-50 border-t border-slate-200">
                    <div className="container mx-auto px-6">
                         <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">Das könnte Sie auch interessieren</h2>
                         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {relatedArticles.map(related => (
                                <RelatedArticleCard 
                                    key={related.slug} 
                                    article={related} 
                                    onSelect={() => {
                                        const event = new CustomEvent('select-article', { detail: related.slug });
                                        document.dispatchEvent(event);
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                 </section>
            )}
        </>
    );
};

export default ArticleDetailPage;

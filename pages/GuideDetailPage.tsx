import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { guides, Guide } from '../data/guidesData';
import { ContentBlock } from '../data/articles';
import { glossarData } from '../data/glossarData';
import GlossarLink from '../components/GlossarLink';
import { ensurePdfLibraries } from '../utils/pdfExport';

interface GuideDetailPageProps {
    guide: Guide;
    onBack: () => void;
}

// Helper to create URL-friendly slugs from headings
const slugify = (text: string) =>
    text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') 
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');

const ReadingProgressBar: React.FC<{ contentRef: React.RefObject<HTMLElement> }> = ({ contentRef }) => {
    const [width, setWidth] = useState(0);

    const scrollListener = useCallback(() => {
        const el = contentRef.current;
        if (!el) return;

        const { top, height } = el.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // The total scrollable distance *within* the content element
        const scrollableHeight = height - viewportHeight;

        // If the content is smaller than the viewport
        if (scrollableHeight <= 0) {
            // If the top of the content is above the viewport top, it's fully read
            if (top <=0) {
                 const bottom = el.getBoundingClientRect().bottom;
                 if (bottom <= viewportHeight) {
                    setWidth(100);
                 } else {
                    setWidth(0);
                 }
            } else {
                setWidth(0);
            }
            return;
        }

        // How much of the content has been scrolled past the top of the viewport
        const scrolledDistance = -top;

        const progress = (scrolledDistance / scrollableHeight) * 100;
        
        // Clamp the value between 0 and 100
        const clampedProgress = Math.max(0, Math.min(100, progress));

        setWidth(clampedProgress);
    }, [contentRef]);

    useEffect(() => {
        window.addEventListener('scroll', scrollListener);
        scrollListener(); // Initial calculation
        return () => window.removeEventListener('scroll', scrollListener);
    }, [scrollListener]);

    return <div id="reading-progress-bar" style={{ width: `${width}%` }} />;
};

// Reusable Mini Guide Card for "Related" section
const RelatedGuideCard: React.FC<{ guide: Guide, onSelect: () => void }> = ({ guide, onSelect }) => (
    <div onClick={onSelect} className="group h-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col cursor-pointer hover:shadow-2xl hover:border-green-300">
       <div className="overflow-hidden">
           <img 
               src={guide.imageUrl}
               alt={guide.title}
               loading="lazy"
               decoding="async"
               className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
           />
       </div>
       <div className="p-4 flex flex-col flex-grow">
           <span className="text-sm font-semibold text-green-600 mb-2">{guide.type}</span>
           <h3 className="text-lg font-bold text-slate-800 group-hover:text-green-600 transition-colors duration-300 flex-grow">{guide.title}</h3>
           <div className="self-start font-bold text-green-600 text-sm group-hover:text-green-700 transition-colors mt-3">
               Leitfaden öffnen <span className="inline-block transform group-hover:translate-x-1 transition-transform">&rarr;</span>
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
        <img src={imageUrl} alt={caption} className="w-full rounded-lg shadow-lg" />
        <figcaption className="embedded-image-caption">{caption}</figcaption>
    </figure>
);


const GuideDetailPage: React.FC<GuideDetailPageProps> = ({ guide, onBack }) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [activeHeading, setActiveHeading] = useState<string>('');
    const contentRef = useRef<HTMLElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    
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

    const headings = useMemo(() => 
        guide.content
            ?.flatMap(block => (block.type === 'heading' || block.type === 'subheading') ? [{ text: block.text, slug: slugify(block.text) }] : []) || [],
        [guide]
    );

    const relatedGuides = useMemo(() => {
        return guides.filter(g => g.slug !== guide.slug && g.type === guide.type).slice(0, 3);
    }, [guide]);

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
    
    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const contentElement = document.getElementById('guide-content-to-print');
            if (!contentElement) {
                return;
            }

            const { html2canvas, jsPDF } = await ensurePdfLibraries();
            const canvas = await html2canvas(contentElement, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${guide.slug}.pdf`);
        } catch (error) {
            console.error('PDF konnte nicht erstellt werden', error);
            alert('Download fehlgeschlagen. Bitte versuchen Sie es erneut.');
        } finally {
            setIsDownloading(false);
        }
    };
    
    const handleShare = async () => {
        const shareData = {
            title: `ZOE Solar Leitfaden: ${guide.title}`,
            text: guide.description,
            url: window.location.href,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback for desktop browsers
                await navigator.clipboard.writeText(window.location.href);
                alert('Link in die Zwischenablage kopiert!');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };
    
    const handleInfographicDownload = () => {
        if (!imageRef.current) return;
        setIsDownloading(true);
        
        fetch(imageRef.current.src)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `infografik-${guide.slug}.png`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                setIsDownloading(false);
            })
            .catch(() => {
                alert('Download fehlgeschlagen. Bitte versuchen Sie es erneut.');
                setIsDownloading(false);
            });
    };
    
    const handleInfographicShare = async () => {
         const shareData = {
            title: `ZOE Solar Infografik: ${guide.title}`,
            text: `Eine nützliche Zusammenfassung zu ${guide.title} von ZOE Solar.`,
            url: window.location.href,
        };
        try {
            await navigator.share(shareData);
        } catch (err) {
            console.error('Error sharing:', err);
            await navigator.clipboard.writeText(window.location.href);
            alert('Link in die Zwischenablage kopiert!');
        }
    };
    
    const renderHeadingWithAI = (block: ContentBlock, index: number) => {
        if (block.type !== 'heading' && block.type !== 'subheading') return null;

        const handleAIClick = () => {
            const contentStartIndex = guide.content.findIndex(b => b === block);
            let contentEndIndex = guide.content.findIndex((b, i) => i > contentStartIndex && (b.type === 'heading' || b.type === 'subheading'));
            if (contentEndIndex === -1) contentEndIndex = guide.content.length;
            
            const relevantContentBlocks = guide.content.slice(contentStartIndex, contentEndIndex);
            
            const contextText = relevantContentBlocks.map(b => {
                if ('text' in b) return b.text;
                if ('items' in b && b.items) return b.items.join('\n- ');
                return '';
            }).join('\n\n');

            const detail = { type: 'contextual_help', context: contextText, source: guide.title };
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
            <ReadingProgressBar contentRef={contentRef} />

            <header className="relative h-[50vh] min-h-[400px] text-white flex flex-col justify-end" style={{'--promo-banner-height': '0px'} as React.CSSProperties}>
                <div className="absolute inset-0 bg-slate-900">
                    <img src={guide.imageUrl} alt={guide.title} className="w-full h-full object-cover opacity-50"/>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                
                <div className="relative container mx-auto px-6 py-12">
                    <button onClick={onBack} className="inline-flex items-center gap-2 text-slate-200 hover:text-white transition-colors font-semibold bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        <span>Zurück zum Wissens-Hub</span>
                    </button>
                    <div className="max-w-4xl">
                        <span className="bg-green-500 text-white font-semibold px-3 py-1 rounded-full text-sm">{guide.type}</span>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mt-4 leading-tight shadow-text">{guide.title}</h1>
                    </div>
                </div>
            </header>
            
            <div className="bg-white py-16 lg:py-24">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
                        
                        {/* Article Content */}
                        <article ref={contentRef} className="lg:col-span-8">
                            <div id="guide-content-to-print" className="prose-custom prose prose-lg max-w-none text-slate-700">
                                <p className="lead">{renderContentWithGlossar(guide.description)}</p>
                                {guide.content.map((block, index) => {
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
                        </article>

                        {/* Sticky Sidebar */}
                        <aside className="lg:col-span-4">
                            <div className="sticky top-28 space-y-6">
                               <div className="p-6 bg-white rounded-lg border border-slate-200 shadow-md">
                                    <h3 className="font-bold text-slate-800 mb-4">Aktionen</h3>
                                    <div className="space-y-3">
                                        <button onClick={handleDownload} disabled={isDownloading} className="w-full flex items-center justify-center gap-3 text-white font-semibold bg-green-600 hover:bg-green-700 px-4 py-3 rounded-lg transition-colors disabled:bg-slate-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                            <span>{isDownloading ? 'Wird erstellt...' : 'Als PDF herunterladen'}</span>
                                        </button>
                                        <button onClick={handleShare} className="w-full flex items-center justify-center gap-3 text-slate-700 font-semibold bg-slate-100 hover:bg-slate-200 px-4 py-3 rounded-lg transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>
                                            <span>Leitfaden teilen</span>
                                        </button>
                                    </div>
                                </div>
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
                                {guide.infographicUrl && (
                                     <div className="p-6 bg-white rounded-lg border border-slate-200 shadow-md">
                                        <h3 className="font-bold text-slate-800 mb-4">Visuelle Zusammenfassung</h3>
                                        <img ref={imageRef} src={guide.infographicUrl} alt={`Infografik für ${guide.title}`} className="w-full rounded-lg mb-4" crossOrigin="anonymous"/>
                                        <div className="flex gap-2">
                                            <button onClick={handleInfographicDownload} disabled={isDownloading} className="flex-1 flex items-center justify-center gap-2 text-white font-semibold bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg transition-colors text-sm disabled:bg-slate-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                <span>{isDownloading ? '...' : 'Download'}</span>
                                            </button>
                                            <button onClick={handleInfographicShare} className="flex-1 flex items-center justify-center gap-2 text-slate-700 font-semibold bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition-colors text-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>
                                                <span>Teilen</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </aside>

                    </div>
                </div>
            </div>
            
            {/* Related Guides Section */}
            {relatedGuides.length > 0 && (
                 <section className="py-20 bg-slate-50 border-t border-slate-200">
                    <div className="container mx-auto px-6">
                         <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">Das könnte Sie auch interessieren</h2>
                         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {relatedGuides.map(related => (
                                <RelatedGuideCard 
                                    key={related.slug} 
                                    guide={related} 
                                    onSelect={() => {
                                        const event = new CustomEvent('select-guide', { detail: related.slug });
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

export default GuideDetailPage;

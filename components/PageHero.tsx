import React from 'react';
import { Page } from '../types';
import { HeroData } from '../data/pageContent';
import Breadcrumb from './Breadcrumb';

interface PageHeroProps extends HeroData {
    onCtaClick: (page?: Page, action?: 'open-chat', anchor?: string) => void;
}

const BenefitIcon: React.FC<{ name: string }> = ({ name }) => {
    const className = "w-7 h-7 text-green-300";
    const icons: { [key: string]: React.ReactNode } = {
        cost: <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>,
        revenue: <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
        image: <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
        value: <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    };
    return icons[name] || null;
};

const DefaultVisual = () => (
    <div className="flex items-center justify-center h-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-48 h-48 text-green-400/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    </div>
);


const PageHero: React.FC<PageHeroProps> = ({ title, subtitle, bgImage, stats, benefits, ctaText, ctaPage, ctaAction, ctaAnchor, onCtaClick }) => {
    
    const handleCta = () => {
        onCtaClick(ctaPage, ctaAction, ctaAnchor);
    };
    
    return (
        <section className="relative bg-slate-900 text-white overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <img src={bgImage} alt={title} className="w-full h-full object-cover animate-ken-burns" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/95 via-slate-900/80 to-slate-900/30"></div>
            
            <div className="relative container mx-auto px-6 py-24 md:py-32 flex items-center min-h-[60vh]">
                <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
                    {/* Main Content */}
                    <div className="text-center lg:text-left">
                         <div className="page-hero-animate-item page-hero-breadcrumb mb-4">
                            <Breadcrumb variant="hero" />
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tighter text-white page-hero-animate-item page-hero-title [text-shadow:_0_3px_5px_rgb(0_0_0_/_50%)]">
                            {title}
                        </h1>
                        <p className="mt-6 text-xl md:text-2xl text-slate-200 max-w-2xl mx-auto lg:mx-0 page-hero-animate-item page-hero-subtitle">
                            {subtitle}
                        </p>
                        {ctaText && (
                            <div className="mt-10 page-hero-animate-item page-hero-cta">
                                <button
                                    onClick={handleCta}
                                    className="bg-green-500 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-green-600 transition-all duration-300 shadow-xl cta-button-glow transform hover:-translate-y-1"
                                >
                                    {ctaText}
                                </button>
                            </div>
                        )}
                    </div>
                    
                    {/* Aside Content (Stats or Benefits) */}
                    <div className="hidden lg:flex lg:justify-end page-hero-animate-item page-hero-aside">
                        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-2xl max-w-md w-full min-h-[200px]">
                            {stats && (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    {stats.map(stat => (
                                        <div key={stat.label} className="text-center">
                                            <p className="text-5xl font-bold text-green-400">{stat.value}</p>
                                            <p className="text-sm text-slate-300 mt-1 uppercase tracking-wider">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {benefits && (
                                <ul className="space-y-6">
                                    {benefits.map(benefit => (
                                        <li key={benefit.text} className="flex items-center gap-4">
                                            <div className="flex-shrink-0 bg-white/10 p-3 rounded-full border border-white/20">
                                                <BenefitIcon name={benefit.icon} />
                                            </div>
                                            <span className="font-semibold text-lg text-slate-100">{benefit.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {!stats && !benefits && <DefaultVisual />}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PageHero;
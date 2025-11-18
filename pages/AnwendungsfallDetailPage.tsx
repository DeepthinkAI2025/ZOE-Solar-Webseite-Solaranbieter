import React, { useState, useEffect, useMemo, useRef } from 'react';
import { UseCase, Challenge as ChallengeData, Solution as SolutionData, useCasesData } from '../data/useCases';
import { SolutionIcon } from '../components/UseCases';
import SubHeader from '../components/SubHeader';

interface AnwendungsfallDetailPageProps {
    useCase: UseCase;
    onSelectAnwendungsfall: (slug: string) => void;
    bannerHeight: number;
    headerHeight: number;
}

const AnwendungsfallHero: React.FC<{ useCase: UseCase, bannerHeight: number, headerHeight: number }> = ({ useCase, bannerHeight, headerHeight }) => {
    return (
        <section className="bg-white" style={{ paddingTop: `${bannerHeight + headerHeight}px` }}>
            <div className="container mx-auto px-6 py-20 lg:py-16">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="text-center lg:text-left relative z-10">
                        <p className="text-base font-bold text-green-600 uppercase tracking-wider">Branchenlösung</p>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mt-2">
                            {useCase.title}
                        </h1>
                        <h2 className="mt-4 text-xl text-slate-600 font-semibold max-w-xl mx-auto lg:mx-0">
                           {useCase.headline}
                        </h2>
                        <p className="mt-4 text-slate-600 max-w-xl mx-auto lg:mx-0">
                           {useCase.description}
                        </p>
                    </div>
                    <div className="relative h-80">
                         <img 
                            src={useCase.heroImageUrl} 
                            alt={useCase.title} 
                            className="w-full h-full object-cover rounded-2xl shadow-2xl" 
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};


const Challenge: React.FC<{ challenge: ChallengeData }> = ({ challenge }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 text-center transform hover:-translate-y-1 transition-transform duration-300">
        <div className="inline-block bg-red-100 text-red-600 p-3 rounded-full mb-4">
            <SolutionIcon name={challenge.icon} />
        </div>
        <h3 className="font-bold text-slate-800 text-lg mb-2">{challenge.title}</h3>
        <p className="text-slate-600 text-sm">{challenge.description}</p>
    </div>
);

const Solution: React.FC<{ solution: SolutionData }> = ({ solution }) => (
    <div className="flex items-start gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex-shrink-0 bg-green-100 text-green-600 p-3 rounded-full mt-1">
            <SolutionIcon name={solution.icon} />
        </div>
        <div>
            <h3 className="text-xl font-bold text-slate-800">{solution.title}</h3>
            <p className="text-slate-600">{solution.description}</p>
        </div>
    </div>
);

const AnwendungsfallDetailPage: React.FC<AnwendungsfallDetailPageProps> = ({ useCase, onSelectAnwendungsfall, bannerHeight, headerHeight }) => {
    if (!useCase) {
        return <div className="container mx-auto px-6 py-20 text-center">Fehler: Anwendungsfall nicht gefunden</div>;
    }

    const contentRef = useRef<HTMLDivElement>(null);
    const [activeSection, setActiveSection] = useState('challenges');

    const sections = useMemo(() => [
        { id: 'challenges', title: 'Herausforderungen' },
        { id: 'approach', title: 'Lösungsansatz' },
        { id: 'solutions', title: 'Unsere Lösungen' },
        { id: 'benefits', title: 'Ihre Vorteile' },
        { id: 'project-example', title: 'Praxisbeispiel' },
    ], []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: '-20% 0px -75% 0px' } 
        );

        const elements = sections.map(sec => document.getElementById(sec.id)).filter(el => el);
        elements.forEach(el => observer.observe(el));

        return () => {
            elements.forEach(el => el && observer.unobserve(el));
        };
    }, [sections]);
    
    const navItems = useCasesData.filter(uc => uc && uc.id).map(uc => ({
        id: uc.id,
        title: uc.title,
        page: 'anwendungsfall-detail',
    }));

    const openChatWithContext = () => {
        const detail = { type: 'use_case', useCase: useCase };
        document.dispatchEvent(new CustomEvent('start-chat-with-context', { detail }));
    };

    return (
        <div className="bg-slate-50">
            <AnwendungsfallHero useCase={useCase} bannerHeight={bannerHeight} headerHeight={headerHeight} />
            <SubHeader
                navItems={navItems}
                activeItemId={useCase.id}
                onItemClick={(slug) => onSelectAnwendungsfall(slug as string)}
                bannerHeight={bannerHeight}
                headerHeight={headerHeight}
            />
            <div className="py-20">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-16">
                        <aside className="hidden lg:block lg:col-span-3">
                            <div className="sticky top-36">
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Auf dieser Seite</h3>
                                <nav>
                                    <ul className="border-l-2 border-slate-200">
                                        {sections.map(section => (
                                            <li key={section.id}>
                                                <a 
                                                    href={`#${section.id}`}
                                                    className={`block py-2 pl-4 -ml-0.5 border-l-2 transition-all duration-200 ${activeSection === section.id ? 'border-green-500 text-green-600 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                                                >
                                                    {section.title}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            </div>
                        </aside>
                         <main ref={contentRef} className="lg:col-span-9 space-y-20">
                            <section id="challenges" className="scroll-mt-32">
                                <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Typische Herausforderungen</h2>
                                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    {useCase.challenges.map(challenge => <Challenge key={challenge.title} challenge={challenge} />)}
                                </div>
                            </section>
                            
                            <section id="approach" className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 scroll-mt-32">
                                <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">Unser Lösungsansatz</h2>
                                <p className="text-slate-600 text-center max-w-3xl mx-auto">{useCase.ourApproach}</p>
                            </section>

                            <section id="solutions" className="scroll-mt-32">
                                <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Unsere Lösungen für Sie</h2>
                                <div className="space-y-6 max-w-3xl mx-auto">
                                    {useCase.solutions.map(solution => <Solution key={solution.title} solution={solution} />)}
                                </div>
                            </section>
                            
                            <section id="benefits" className="bg-green-50 p-8 rounded-xl border border-green-200 scroll-mt-32">
                                <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">Ihre Vorteile</h2>
                                <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-4 max-w-4xl mx-auto">
                                    {useCase.benefits.map((benefit, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            <span className="text-slate-700 font-medium">{benefit.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section id="project-example" className="bg-slate-800 text-white rounded-2xl shadow-2xl overflow-hidden scroll-mt-32">
                                <div className="grid lg:grid-cols-2 items-center">
                                    <div className="p-10">
                                        <p className="font-bold text-green-400 uppercase tracking-wider">Praxisbeispiel</p>
                                        <h3 className="text-3xl font-bold text-white mt-2">{useCase.projectExample.title}</h3>
                                        <p className="text-lg text-green-300 font-semibold mt-2">{useCase.projectExample.stats}</p>
                                        <p className="text-slate-300 mt-4">{useCase.projectExample.description}</p>
                                    </div>
                                    <img src={useCase.projectExample.imageUrl} alt={useCase.projectExample.title} className="w-full h-full object-cover min-h-[300px]" />
                                </div>
                            </section>

                            <section id="cta" className="text-center pt-12 border-t border-slate-200 scroll-mt-32">
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Interesse geweckt?</h2>
                                <p className="text-lg text-slate-600 my-4 max-w-3xl mx-auto">
                                    Starten Sie eine intelligente Bedarfsanalyse. Unser KI-Assistent stellt Ihnen einige gezielte Fragen, um die perfekte Lösung für Sie zu finden.
                                </p>
                                <button onClick={openChatWithContext} className="bg-green-600 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-xl cta-button-glow transform hover:-translate-y-1">
                                    Intelligente Analyse starten
                                </button>
                            </section>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AnwendungsfallDetailPage;

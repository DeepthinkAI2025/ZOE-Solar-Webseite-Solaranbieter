import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page } from '../types';
import AnimatedSection from '../components/AnimatedSection';
import { Calculator } from '../components/Calculator';
import { CO2Calculator } from '../components/CO2Calculator';
import { fundingPrograms, getFundingProgramBySlug } from '../data/fundingPrograms';

interface FinanzierungPageProps {
    setPage: (page: Page) => void;
}

const Benefit: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode }> = ({ title, children, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
        <div className="text-green-600 mb-3">{icon}</div>
        <h3 className="font-bold text-slate-800 text-lg mb-2">{title}</h3>
        <p className="text-slate-600 text-sm">{children}</p>
    </div>
);

const FoerderCard: React.FC<{ slug: string }> = ({ slug }) => {
    const navigate = useNavigate();
    const program = getFundingProgramBySlug(slug);

    if (!program) return null;

    return (
        <div className="bg-white p-8 rounded-xl shadow-xl border border-slate-200 flex flex-col transform hover:-translate-y-2 transition-transform duration-300">
            <div className="h-16 flex items-center mb-6">
                <img src={program.logo} alt={`${program.provider} Logo`} className="max-h-12 w-auto object-contain" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">{program.title}</h3>
            <p className="text-slate-600 flex-grow mb-6">{program.summary}</p>
            <button onClick={() => navigate(`/foerdermittel/${program.slug}`)} className="mt-auto font-bold text-green-600 group text-sm transition-colors self-start">
                Mehr erfahren <span className="inline-block transform group-hover:translate-x-1 transition-transform">&rarr;</span>
            </button>
        </div>
    );
};


const FinanzierungPage: React.FC<FinanzierungPageProps> = ({ setPage: _setPage }) => {
    const navigate = useNavigate();
    const openChat = () => document.dispatchEvent(new CustomEvent('open-chat'));

    const featuredPrograms = useMemo(() => {
        if (!fundingPrograms.length) {
            return [];
        }

        const curatedSlugs = [
            'kfw',
            'ibb-wirtschaft-nah',
            'bafa-eew-zuschuss',
        ];

        const curated = curatedSlugs
            .map((slug) => fundingPrograms.find((program) => program.slug === slug))
            .filter((program): program is NonNullable<typeof program> => Boolean(program));

        if (curated.length >= 3) return curated.map((program) => program.slug);

        const fallback = fundingPrograms
            .filter((program) => program.level === 'bund')
            .slice(0, 3 - curated.length)
            .map((program) => program.slug);

        return [...curated.map((program) => program.slug), ...fallback];
    }, []);

    return (
        <div className="bg-slate-50">
            <AnimatedSection>
                <section id="how-it-works" className="py-20 bg-white scroll-mt-24">
                    <div className="container mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">Ihre Solaranlage für <span className="text-green-600">0 € Anzahlung</span>.</h2>
                                <p className="text-lg text-slate-600 mt-6">
                                    Starten Sie ohne Eigenkapital in die Energiewende. Mit attraktiven Förderkrediten übersteigt Ihre monatliche Ersparnis oft die Rate – Sie profitieren vom ersten Tag an. Unser Prozess ist darauf ausgelegt, Ihnen den Weg so einfach wie möglich zu machen. Wir übernehmen die komplette Abwicklung für Sie.
                                </p>
                                <button onClick={openChat} className="mt-8 bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-lg cta-button-glow transform hover:-translate-y-1">
                                    Jetzt Finanzierungsberatung anfordern
                                </button>
                            </div>
                            <div className="grid grid-cols-1 gap-8">
                                <Benefit title="Kein Eigenkapital nötig" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}>
                                    Schonen Sie Ihre Liquidität. Die gesamte Investition wird über einen zinsgünstigen Kredit finanziert. Sie starten mit 0 € Einsatz.
                                </Benefit>
                                <Benefit title="Sofortiger Gewinn" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}>
                                    Ihre monatliche Ersparnis durch günstigeren Solarstrom ist in der Regel höher als die Kreditrate. Sie profitieren finanziell ab dem ersten Tag.
                                </Benefit>
                            </div>
                        </div>
                    </div>
                </section>
            </AnimatedSection>

                    <AnimatedSection>
                        <div className="space-y-12">
                            <Calculator />
                            <CO2Calculator />
                        </div>
                    </AnimatedSection>

            <AnimatedSection>
                 <section className="py-20">
                     <div className="container mx-auto px-6 max-w-6xl mx-auto">
                         <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-slate-900">Die wichtigsten Förderinstitutionen</h2>
                            <p className="text-lg text-slate-600 mt-4">Wir navigieren Sie durch den Förderdschungel und finden die passenden Töpfe für Ihr Projekt.</p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                            {featuredPrograms.map((slug) => (
                                <FoerderCard key={slug} slug={slug} />
                            ))}
                        </div>
                        <div className="text-center mt-12">
                            <button
                                onClick={() => navigate('/foerdermittel')}
                                className="text-green-600 font-semibold text-sm inline-flex items-center gap-2"
                            >
                                Alle Förderprogramme anzeigen <span aria-hidden>&rarr;</span>
                            </button>
                        </div>
                    </div>
                </section>
            </AnimatedSection>
        </div>
    );
};

export default FinanzierungPage;
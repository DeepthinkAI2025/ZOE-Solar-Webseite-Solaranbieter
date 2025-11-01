import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Page } from '../types';
import AnimatedSection from '../components/AnimatedSection';
import ServiceWizard from '../components/ServiceWizard';
import Breadcrumb from '../components/Breadcrumb';
import { pageToPath } from '../data/pageRoutes';

interface LeistungenPageProps {
  setPage: (page: Page, options?: { anchor?: string }) => void;
}

// --- START: Hero Component ---
const ServiceIcon: React.FC<{ name: string }> = ({ name }) => {
    const icons: { [key: string]: React.ReactNode } = {
        'photovoltaik': <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
        'e-mobilitaet': <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
        'elektro': <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6.75M9 11.25h6.75M9 15.75h6.75M9 20.25h6.75" /></svg>,
        'agri-pv': <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>,
        'speicher': <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M4.5 10.5H18V15H4.5v-4.5zM3.75 18h15A2.25 2.25 0 0021 15.75v-6.375A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25v6.375A2.25 2.25 0 005.25 18h-1.5z" /></svg>,
        'ladeparks': <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6.75M9 11.25h6.75M9 15.75h6.75M9 20.25h6.75" /></svg>,
    };
    return icons[name] || null;
};

const serviceCards = [
    { id: 'photovoltaik', title: 'Photovoltaik', icon: 'photovoltaik', page: 'photovoltaik' as Page, description: 'Solaranlagen für Gewerbe, Landwirtschaft und Industrie' },
    { id: 'e-mobilitaet', title: 'E-Mobilität', icon: 'e-mobilitaet', page: 'e-mobilitaet' as Page, description: 'Ladeinfrastruktur und Wallbox-Installationen' },
    { id: 'elektro', title: 'Elektroinstallation', icon: 'elektro', page: 'elektro' as Page, description: 'Netzanschluss, Verteilerbau und Zaehlerbau' },
    { id: 'agri-pv', title: 'Agri-PV', icon: 'agri-pv', page: 'agri-pv' as Page, description: 'Photovoltaik auf landwirtschaftlichen Flächen' },
    { id: 'speicher', title: 'Batteriespeicher', icon: 'speicher', page: 'service-speicher' as Page, description: 'Energiespeicher für maximale Unabhängigkeit' },
    { id: 'ladeparks', title: 'Ladeparks', icon: 'ladeparks', page: 'service-ladeparks' as Page, description: 'Großprojekte für gewerbliche Ladeinfrastruktur' },
];

const LeistungenHero: React.FC<{ setPage: (page: Page) => void, onCtaClick: () => void }> = ({ setPage, onCtaClick }) => {
    return (
        <section className="leistungen-hero-v2 bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-6 py-16 lg:py-24">
                <div className="max-w-4xl mx-auto text-center">
                    <AnimatedSection>
                        <div className="mb-8">
                            <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-6">
                                Unsere Leistungen im Überblick
                            </span>
                            <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6">
                                Komplettlösungen für
                                <span className="text-green-600 block">erneuerbare Energie</span>
                            </h1>
                            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
                                Von der Planung bis zur Inbetriebnahme: Wir bieten Ihnen maßgeschneiderte Lösungen für Photovoltaik, E-Mobilität und Elektroinstallation.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={onCtaClick}
                                className="bg-green-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-green-700 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                Kostenlose Beratung anfordern
                            </button>
                            <Link
                                to="/projekte"
                                className="border-2 border-slate-300 text-slate-700 font-bold py-4 px-8 rounded-lg hover:bg-slate-100 transition-colors duration-300"
                            >
                                Referenzprojekte ansehen
                            </Link>
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </section>
    );
};

// --- START: Service Overview ---
const ServiceOverview: React.FC<{ setPage: (page: Page) => void }> = ({ setPage }) => {
    return (
        <section className="py-16 lg:py-24 bg-white">
            <div className="container mx-auto px-6">
                <AnimatedSection>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                            Unsere Kompetenzbereiche
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            Als erfahrener Partner für erneuerbare Energien bieten wir Ihnen ein umfassendes Leistungsspektrum.
                        </p>
                    </div>
                </AnimatedSection>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {serviceCards.map((service, index) => (
                        <AnimatedSection key={service.id} delay={index * 100}>
                            <div
                                onClick={() => setPage(service.page)}
                                className="group bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
                            >
                                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors duration-300">
                                    <div className="text-green-600 text-2xl group-hover:text-white transition-colors duration-300">
                                        <ServiceIcon name={service.id} />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-green-600 transition-colors duration-300">
                                    {service.title}
                                </h3>
                                <p className="text-slate-600 mb-4">
                                    {service.description}
                                </p>
                                <div className="flex items-center text-green-600 font-semibold group-hover:text-green-700">
                                    Mehr erfahren
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- START: Value Proposition ---
const ValueProposition: React.FC<{ onCtaClick: () => void }> = ({ onCtaClick }) => {
    const benefits = [
        {
            title: 'Kostenoptimierte Planung',
            description: 'Durch unsere Erfahrung und modernste Planungstools finden wir immer die wirtschaftlichste Lösung für Ihr Projekt.',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        },
        {
            title: 'Zuverlässige Umsetzung',
            description: 'Unser qualifiziertes Team sorgt für eine termingerechte und fachgerechte Installation Ihrer Anlage.',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        },
        {
            title: 'Langfristiger Service',
            description: 'Wir begleiten Sie nicht nur bei der Installation, sondern bieten auch Wartung und Service über die gesamte Lebensdauer.',
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        }
    ];

    return (
        <section className="py-16 lg:py-24 bg-slate-50">
            <div className="container mx-auto px-6">
                <AnimatedSection>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                            Warum ZOE Solar?
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            Ihr Partner für professionelle Energielösungen mit Fokus auf Qualität und Wirtschaftlichkeit.
                        </p>
                    </div>
                </AnimatedSection>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {benefits.map((benefit, index) => (
                        <AnimatedSection key={index} delay={index * 100}>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <div className="text-green-600">
                                        {benefit.icon}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4">
                                    {benefit.title}
                                </h3>
                                <p className="text-slate-600">
                                    {benefit.description}
                                </p>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>

                <AnimatedSection delay={300}>
                    <div className="bg-green-600 rounded-3xl p-8 md:p-12 text-center text-white">
                        <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                            Bereit für Ihre Energielösung?
                        </h3>
                        <p className="text-xl mb-8 text-green-100">
                            Kontaktieren Sie uns für eine unverbindliche Beratung und erhalten Sie ein kostenloses Angebot für Ihr Projekt.
                        </p>
                        <button
                            onClick={onCtaClick}
                            className="bg-white text-green-600 font-bold py-4 px-8 rounded-lg hover:bg-slate-100 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            Beratung anfordern
                        </button>
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
};

// --- START: Main Component ---
const LeistungenPage: React.FC<LeistungenPageProps> = ({ setPage }) => {
    const [showWizard, setShowWizard] = useState(false);

    const handleCtaClick = () => {
        setShowWizard(true);
    };

    const closeWizard = () => {
        setShowWizard(false);
    };

    const breadcrumbItems = [
        { label: 'Startseite', href: '/' },
        { label: 'Leistungen', href: '/leistungen' }
    ];

    return (
        <>
            <Helmet>
                <title>Leistungen - ZOE Solar</title>
                <meta name="description" content="Entdecken Sie unser umfassendes Leistungsspektrum: Photovoltaik, E-Mobilität, Elektroinstallation und mehr. Professionelle Energielösungen für Gewerbe und Industrie." />
                <meta name="keywords" content="Photovoltaik, E-Mobilität, Elektroinstallation, Solaranlagen, Agri-PV, Batteriespeicher, Ladeinfrastruktur" />
                <link rel="canonical" href="https://zoe-solar.de/leistungen" />
            </Helmet>

            <div className="min-h-screen">
                {/* Breadcrumb */}
                <div className="bg-white border-b border-slate-200">
                    <div className="container mx-auto px-6 py-4">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>
                </div>

                {/* Hero Section */}
                <LeistungenHero setPage={setPage} onCtaClick={handleCtaClick} />

                {/* Service Overview */}
                <ServiceOverview setPage={setPage} />

                {/* Value Proposition */}
                <ValueProposition onCtaClick={handleCtaClick} />

                {/* Service Wizard Modal */}
                {showWizard && (
                    <ServiceWizard isOpen={showWizard} onClose={closeWizard} />
                )}
            </div>
        </>
    );
};

export default LeistungenPage;
import React from 'react';
import { useCasesData, UseCase } from '../data/useCases.ts';
import { Page } from '../types';

// Enhanced professional solution icons
export const SolutionIcon: React.FC<{ name: string }> = ({ name }) => {
    const className = "h-6 w-6 text-primary-600";
    const strokeWidth = 1.5;
    const icons: { [key: string]: React.ReactNode } = {
        'roof': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 9h1.5m-1.5 3h1.5m-1.5 3h1.5" /></svg>,
        'storage': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M4.5 10.5H18V15H4.5v-4.5zM3.75 18h15A2.25 2.25 0 0021 15.75v-6.375A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25v6.375A2.25 2.25 0 005.25 18h-1.5z" /></svg>,
        'charging': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
        'carport': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5v-1.875a3.375 3.375 0 003.375-3.375h1.5a1.125 1.125 0 011.125 1.125v-1.5a3.375 3.375 0 00-3.375-3.375H3.375z" /></svg>,
        'open-space': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>,
        'agri-pv': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>,
        'tenant-power': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962A3.375 3.375 0 0110.5 9.75v-.75a3.375 3.375 0 013.375-3.375s-1.543.425-2.25 1.5c-.296.346-.45.743-.45 1.125v.75m-3.375 0c-.296.346-.45.743-.45 1.125v.75m-3.375 0c-.296.346-.45.743-.45 1.125v.75M6.375 12v.75a3.375 3.375 0 01-3.375 3.375c-1.386 0-2.595-.57-3.375-1.5m15.75-3.375c.296-.346.45-.743.45-1.125v-.75m3.375 0c-.296-.346.45-.743.45-1.125v-.75m3.375 0c-.296-.346.45-.743.45-1.125v-.75M9 12.75h6" /></svg>,
        'revenue': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20m9-9H3m7.5-7.5L12 2l2.5 3.5M12 22l-2.5-3.5L12 22z" /></svg>,
        'tech': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3m16.5 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008z" /></svg>,
        'grid': <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M15.75 3v1.5m0 16.5v-1.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 3C4.204 3 3 10.193 3 12c0 1.807 1.204 9 9 9s9-7.193 9-9c0-1.807-1.204-9-9-9z" /></svg>
    };
    return icons[name] || null;
};

interface UseCasesProps {
    customerType: 'private' | 'business';
    onSelectAnwendungsfall: (slug: string) => void;
    setPage: (page: Page) => void;
}

// Professional solution data for different customer types
const solutionData = {
    private: {
        badge: "Privatkunden",
        title: "Maßgeschneiderte Lösungen für Ihr Zuhause",
        subtitle: "Von der Beratung bis zur schlüsselfertigen Installation – wir finden die optimale Energielösung für Ihre Bedürfnisse.",
        solutions: [
            {
                id: 'einfamilienhaus',
                title: 'Einfamilienhaus',
                headline: 'Komplette Photovoltaik-Anlage',
                description: 'Vollständige Solarlösung mit Dachanlage, Speicher und Wallbox für maximale Unabhängigkeit und Kosteneinsparungen.',
                imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop',
                features: ['Dachmontage', 'Solar-Speicher', 'Wallbox', 'Förderoptimierung'],
                savings: 'Bis zu 30% Energiekosten',
                icon: 'roof'
            },
            {
                id: 'balkonkraftwerk',
                title: 'Balkonkraftwerk',
                headline: 'Einfache Solarlösung für Mieter',
                description: 'Steckfertige Balkonmodule für Mietwohnungen. Günstiger Einstieg in die Solarenergie ohne Dachinstallation.',
                imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070&auto=format&fit=crop',
                features: ['Steckfertig', 'Mietergeeignet', 'Kostengünstig', 'Schnell installiert'],
                savings: 'Bis zu 15% Stromkosten',
                icon: 'charging'
            },
            {
                id: 'solarzaun',
                title: 'Solarzaun',
                headline: 'Intelligente Grundstücksbegrenzung',
                description: 'Solarpanele integriert in Zaunsysteme. Schützen Sie Ihr Grundstück und produzieren Sie gleichzeitig Strom.',
                imageUrl: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?q=80&w=2070&auto=format&fit=crop',
                features: ['Zaunfunktion', 'Solarintegration', 'Sicherheit', 'Eigenstrom'],
                savings: 'Zweifach nutzbar',
                icon: 'grid'
            },
            {
                id: 'mehrfamilienhaus',
                title: 'Mehrfamilienhaus',
                headline: 'Gemeinschaftliche Solaranlage',
                description: 'Gemeinschaftliche Dachanlage für Mehrfamilienhäuser. Günstiger Strom für alle Bewohner durch gemeinsame Investition.',
                imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop',
                features: ['Gemeinschaftsanlage', 'Günstiger Strom', 'Quartierspeicher', 'Fördermittel'],
                savings: 'Stabile Einsparungen',
                icon: 'tenant-power'
            }
        ]
    },
    business: {
        badge: "Gewerbekunden",
        title: "Branchenspezifische Energielösungen",
        subtitle: "Maßgeschneiderte Konzepte für unterschiedliche Branchen. Maximale Wirtschaftlichkeit und Nachhaltigkeit für Ihr Unternehmen.",
        solutions: [
            {
                id: 'agri-pv',
                title: 'Landwirtschaft',
                headline: 'Doppelte Ernte: Ackerbau und Energie',
                description: 'Agri-Photovoltaik für Landwirte. Schutz der Kulturen und gleichzeitige Stromproduktion auf derselben Fläche.',
                imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop',
                features: ['Hochaufgeständerte PV', 'Kulturschutz', 'Direktvermarktung', 'Förderoptimierung'],
                savings: 'Zweite Einnahmequelle',
                icon: 'agri-pv'
            },
            {
                id: 'gewerbliche-dachanlage',
                title: 'Gewerbliche Dachanlage',
                headline: 'Professionelle Dachinstallation',
                description: 'Hochleistungs-Solaranlagen für gewerbliche Dächer. Optimierte Wirtschaftlichkeit durch Eigenverbrauch und Einspeisung.',
                imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop',
                features: ['Dachoptimierung', 'Lastganganalyse', 'Förderberatung', 'Wartungsservice'],
                savings: 'ROI in 6-8 Jahren',
                icon: 'tech'
            },
            {
                id: 'mieterstrommodell',
                title: 'Mieterstrom-Modell',
                headline: 'Mieterstrom für Gewerbeimmobilien',
                description: 'Mieterstromversorgung für gewerbliche Immobilien. Günstiger Strom für Mieter und attraktive Rendite für Eigentümer.',
                imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
                features: ['Mieterstrom', 'Renditeoptimierung', 'Fördermittel', 'Quartierspeicher'],
                savings: 'Stabile Rendite + günstiger Strom',
                icon: 'tenant-power'
            },
            {
                id: 'logistics',
                title: 'Logistik & Industrie',
                headline: 'Energiekosten senken, Prozesse sichern',
                description: 'Hochleistungs-Solaranlagen für 24/7-Betriebe. Intelligente Speichersysteme und Lastspitzen-Management.',
                imageUrl: 'https://images.unsplash.com/photo-1587293852726-70cdb122126a?q=80&w=2070&auto=format&fit=crop',
                features: ['Großdachanlagen', 'Industriespeicher', 'Peak-Shaving', 'ESG-Reporting'],
                savings: '40% Energiekostensenkung',
                icon: 'storage'
            },
            {
                id: 'retail',
                title: 'Handel & Einzelhandel',
                headline: 'Kunden anziehen, Kosten senken',
                description: 'Solar-Carports und Dachanlagen für Supermärkte. Ladeinfrastruktur als Service-Angebot und Umsatz-Booster.',
                imageUrl: 'https://images.unsplash.com/photo-1570857502907-a8b6b3d142f3?q=80&w=2070&auto=format&fit=crop',
                features: ['Solar-Carports', 'Ladeinfrastruktur', 'Kühlkostenoptimierung', 'Marketingvorteil'],
                savings: 'Neue Einnahmequellen',
                icon: 'carport'
            },
            {
                id: 'hotels',
                title: 'Hotels & Gastronomie',
                headline: 'Gastfreundschaft mit grüner Energie',
                description: 'Solaranlagen für Hotels und Restaurants. Reduzieren Sie Energiekosten und stärken Sie Ihr nachhaltiges Image.',
                imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
                features: ['Dachanlagen', 'Energiemanagement', 'Nachhaltigkeitsimage', 'Kosteneinsparungen'],
                savings: '25% Energiekostensenkung',
                icon: 'roof'
            },
            {
                id: 'healthcare',
                title: 'Gesundheitswesen',
                headline: 'Zuverlässige Energie für kritische Versorgung',
                description: 'Solar-Backup-Systeme für Krankenhäuser und Pflegeeinrichtungen. Sicherstellen Sie kontinuierliche Stromversorgung.',
                imageUrl: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?q=80&w=2070&auto=format&fit=crop',
                features: ['Backup-Systeme', 'Notstromversorgung', 'Energiesicherheit', 'Kosteneffizienz'],
                savings: 'Stabile Versorgung + Einsparungen',
                icon: 'grid'
            },
            {
                id: 'education',
                title: 'Bildungseinrichtungen',
                headline: 'Lernen mit sauberer Energie',
                description: 'Solaranlagen für Schulen und Universitäten. Bilden Sie die nächste Generation mit nachhaltiger Energie aus.',
                imageUrl: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=2070&auto=format&fit=crop',
                features: ['Bildungsprojekte', 'Nachhaltigkeitserziehung', 'Kosteneinsparungen', 'Fördermittel'],
                savings: 'Bildung + Energieeinsparung',
                icon: 'tech'
            }
        ]
    }
};

const SolutionCard: React.FC<{
    solution: any,
    onSelect: () => void,
    index: number
}> = React.memo(({ solution, onSelect, index }) => {
    const [imageLoaded, setImageLoaded] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <div
            onClick={onSelect}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl hover:shadow-primary-100/50 transition-all duration-500 hover:-translate-y-2 border border-gray-100/50 overflow-hidden cursor-pointer h-full transform-gpu"
            style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
            }}
        >
            {/* Enhanced gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-500 z-10 ${
                isHovered
                    ? 'from-primary-50/30 via-transparent to-blue-50/20'
                    : 'from-primary-50/0 via-transparent to-blue-50/0'
            }`} />

            {/* Image section with loading state */}
            <div className="relative overflow-hidden">
                {!imageLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
                )}
                <img
                    src={solution.imageUrl}
                    alt={solution.title}
                    loading="lazy"
                    decoding="async"
                    onLoad={() => setImageLoaded(true)}
                    className={`w-full h-48 object-cover transition-all duration-700 ${
                        imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                    } ${isHovered ? 'scale-110' : 'scale-100'}`}
                />
                <div className="absolute top-4 left-4">
                    <div className={`bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1 shadow-lg border border-gray-200 transition-all duration-300 ${
                        isHovered ? 'scale-105 shadow-xl' : ''
                    }`}>
                        <div className="flex items-center gap-2">
                            <SolutionIcon name={solution.icon} />
                            <span className="text-sm font-semibold text-gray-800">{solution.title}</span>
                        </div>
                    </div>
                </div>

                {/* Hover overlay with enhanced effects */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                }`} />
            </div>

            {/* Content section with enhanced animations */}
            <div className="p-6 relative z-20">
                <h3 className={`text-xl font-bold text-gray-900 mb-2 transition-all duration-300 ${
                    isHovered ? 'text-primary-600' : ''
                }`}>
                    {solution.headline}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed mb-4 transition-all duration-300">
                    {solution.description}
                </p>

                {/* Enhanced features */}
                <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                        {solution.features.slice(0, 2).map((feature: string, idx: number) => (
                            <span
                                key={idx}
                                className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium transition-all duration-300 ${
                                    isHovered
                                        ? 'bg-primary-100 text-primary-700 scale-105'
                                        : 'bg-gray-100 text-gray-700'
                                }`}
                            >
                                {feature}
                            </span>
                        ))}
                        {solution.features.length > 2 && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium transition-all duration-300 ${
                                isHovered
                                    ? 'bg-primary-100 text-primary-700 scale-105'
                                    : 'bg-primary-100 text-primary-700'
                            }`}>
                                +{solution.features.length - 2} weitere
                            </span>
                        )}
                    </div>
                </div>

                {/* Enhanced savings highlight */}
                <div className="flex items-center justify-between">
                    <div className={`font-bold text-sm transition-all duration-300 ${
                        isHovered ? 'text-primary-700 scale-105' : 'text-primary-600'
                    }`}>
                        {solution.savings}
                    </div>
                    <div className={`transition-all duration-300 transform ${
                        isHovered ? 'text-primary-600 translate-x-1' : 'text-gray-500'
                    }`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
});

const UseCases: React.FC<UseCasesProps> = ({ customerType, onSelectAnwendungsfall, setPage }) => {
    const currentData = solutionData[customerType];
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);
    const [touchStart, setTouchStart] = React.useState<number | null>(null);
    const [touchEnd, setTouchEnd] = React.useState<number | null>(null);
    const autoPlayRef = React.useRef<NodeJS.Timeout | null>(null);

    const solutionsPerView = 3;
    const totalSolutions = currentData.solutions.length;
    const canScroll = totalSolutions > solutionsPerView;
    const maxIndex = totalSolutions - solutionsPerView;

    // Auto-play functionality
    React.useEffect(() => {
        if (canScroll && isAutoPlaying) {
            autoPlayRef.current = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1));
            }, 5000); // Change slide every 5 seconds
        } else {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current);
            }
        }

        return () => {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current);
            }
        };
    }, [canScroll, isAutoPlaying, maxIndex]);

    const nextSlide = React.useCallback(() => {
        if (currentIndex < maxIndex) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setCurrentIndex(0); // Loop back to start
        }
    }, [currentIndex, maxIndex]);

    const prevSlide = React.useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        } else {
            setCurrentIndex(maxIndex); // Loop to end
        }
    }, [currentIndex, maxIndex]);

    const goToSlide = React.useCallback((index: number) => {
        setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
    }, [maxIndex]);

    // Touch handlers for swipe support
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
        setIsAutoPlaying(false); // Pause auto-play on touch
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe && currentIndex < maxIndex) {
            nextSlide();
        }
        if (isRightSwipe && currentIndex > 0) {
            prevSlide();
        }

        // Resume auto-play after a delay
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    // Keyboard navigation
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
                setIsAutoPlaying(false);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextSlide();
                setIsAutoPlaying(false);
            }
        };

        if (canScroll) {
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [canScroll, nextSlide, prevSlide]);

    const visibleSolutions = canScroll
        ? currentData.solutions.slice(currentIndex, currentIndex + solutionsPerView)
        : currentData.solutions;

    return (
        <section id="anwendungsfaelle" className="relative py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden">
            {/* Enhanced professional background effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-primary-200/8 to-primary-200/5 blur-[200px]" />
                <div className="absolute top-1/4 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-200/6 to-indigo-200/3 blur-[180px]" />
                <div className="absolute bottom-0 right-1/3 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-purple-200/4 to-pink-200/2 blur-[160px]" />
                <div className="absolute top-3/4 left-1/4 h-[300px] w-[300px] rounded-full bg-white/20 blur-[140px]" />
            </div>

            <div className="relative w-full px-4 sm:px-6 lg:px-8">
                {/* Professional header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary-50 to-primary-50 border border-primary-200/60 mb-8 shadow-sm backdrop-blur-sm">
                        <div className="p-1.5 rounded-full bg-primary-100">
                            <svg className="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.092 1.21-.138 2.43-.138 3.662v4.286a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7v-4.286z" />
                            </svg>
                        </div>
                        <span className="text-base font-bold text-primary-700 uppercase tracking-wider">
                            {currentData.badge}
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-primary-800 to-gray-900 leading-tight mb-8 drop-shadow-sm">
                        {currentData.title}
                    </h2>

                    <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium">
                        {currentData.subtitle}
                    </p>
                </div>

                {/* Enhanced solutions carousel */}
                <div className="relative px-4 sm:px-6 lg:px-6">
                    {/* Navigation arrows - only show if can scroll */}
                    {canScroll && (
                        <>
                            <button
                                onClick={() => {
                                    prevSlide();
                                    setIsAutoPlaying(false);
                                }}
                                disabled={currentIndex === 0 && !canScroll}
                                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-gray-200/80 hover:border-primary-300 hover:shadow-primary-200/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110 group"
                                aria-label="Vorherige Lösungen anzeigen"
                                onMouseEnter={() => setIsAutoPlaying(false)}
                                onMouseLeave={() => setTimeout(() => setIsAutoPlaying(true), 2000)}
                            >
                                <svg className="w-6 h-6 text-gray-700 group-hover:text-primary-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <button
                                onClick={() => {
                                    nextSlide();
                                    setIsAutoPlaying(false);
                                }}
                                disabled={currentIndex >= maxIndex && !canScroll}
                                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-gray-200/80 hover:border-primary-300 hover:shadow-primary-200/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110 group"
                                aria-label="Nächste Lösungen anzeigen"
                                onMouseEnter={() => setIsAutoPlaying(false)}
                                onMouseLeave={() => setTimeout(() => setIsAutoPlaying(true), 2000)}
                            >
                                <svg className="w-6 h-6 text-gray-700 group-hover:text-primary-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}

                    {/* Solutions grid with touch support */}
                    <div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 max-w-6xl mx-auto px-4"
                        onTouchStart={canScroll ? handleTouchStart : undefined}
                        onTouchMove={canScroll ? handleTouchMove : undefined}
                        onTouchEnd={canScroll ? handleTouchEnd : undefined}
                        style={{ touchAction: canScroll ? 'pan-y pinch-zoom' : 'auto' }}
                    >
                        {visibleSolutions.map((solution, index) => (
                            <SolutionCard
                                key={`${customerType}-${solution.id}-${currentIndex + index}`}
                                solution={solution}
                                onSelect={() => {
                                    onSelectAnwendungsfall(solution.id);
                                    setIsAutoPlaying(false);
                                }}
                                index={currentIndex + index}
                            />
                        ))}
                    </div>

                    {/* Enhanced dots indicator - only show if can scroll */}
                    {canScroll && (
                        <div className="flex justify-center mt-12 space-x-4">
                            {Array.from({ length: maxIndex + 1 }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        goToSlide(i);
                                        setIsAutoPlaying(false);
                                    }}
                                    className={`relative transition-all duration-500 ease-out rounded-full ${
                                        i === currentIndex
                                            ? 'w-12 h-4 bg-gradient-to-r from-primary-500 to-primary-500 shadow-lg'
                                            : 'w-4 h-4 bg-gray-300 hover:bg-gray-400 shadow-md'
                                    }`}
                                    aria-label={`Gehe zu Lösung ${i + 1}`}
                                    onMouseEnter={() => setIsAutoPlaying(false)}
                                    onMouseLeave={() => setTimeout(() => setIsAutoPlaying(true), 2000)}
                                >
                                    {i === currentIndex && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-400 rounded-full animate-pulse opacity-80" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Auto-play indicator */}
                    {canScroll && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                                className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-300 shadow-lg ${
                                    isAutoPlaying
                                        ? 'bg-gradient-to-r from-primary-50 to-primary-50 text-primary-700 hover:from-primary-100 hover:to-primary-100 border border-primary-200/60'
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/60'
                                }`}
                                aria-label={isAutoPlaying ? 'Auto-Play stoppen' : 'Auto-Play starten'}
                            >
                                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    isAutoPlaying ? 'bg-primary-500 animate-pulse shadow-primary-300 shadow-md' : 'bg-gray-400'
                                }`} />
                                <span className="font-semibold">
                                    {isAutoPlaying ? 'Auto-Play aktiv' : 'Auto-Play pausiert'}
                                </span>
                                <svg className={`w-4 h-4 transition-transform duration-300 ${isAutoPlaying ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l.707.707A1 1 0 0012.414 11H15m-3-3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default UseCases;

// Add custom CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    .hover\\:shadow-3xl:hover {
        box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(34, 197, 94, 0.1);
    }
`;
document.head.appendChild(style);

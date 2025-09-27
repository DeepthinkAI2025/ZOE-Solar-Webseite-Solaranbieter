import React from 'react';
import { Page } from '../types';
import AnimatedSection from '../components/AnimatedSection';
import VideoSection from '../components/VideoSection';

const teamMembers = [
    { name: 'Max Mustermann', role: 'Gründer & Geschäftsführer', imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop' },
    { name: 'Erika Mustermann', role: 'Leitung Projektplanung', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop' },
    { name: 'Klaus Kleber', role: 'Leitender Ingenieur', imageUrl: 'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=2071&auto=format&fit=crop' },
];

const stats = [
    { value: '> 150 MWp', label: 'Installierte Leistung' },
    { value: '> 85.000 t', label: 'CO₂ Einsparung pro Jahr' },
    { value: '> 50.000', label: 'Versorgte Haushalte (äquiv.)' },
];

const timeline = [
    { year: '2018', title: 'Die Vision entsteht', text: 'Gründer Max Mustermann erkennt das enorme, ungenutzte Potenzial auf den Dächern des deutschen Mittelstands und gründet ZOE Solar mit der Mission, die Energiewende für Unternehmen einfach und profitabel zu machen.' },
    { year: '2020', title: 'Erstes Großprojekt', text: 'Realisierung der ersten 1-Megawatt-Dachanlage für ein Logistikzentrum in Brandenburg. Ein Meilenstein, der unsere Expertise für komplexe Projekte unter Beweis stellt.' },
    { year: '2022', title: 'Expansion des Teams', text: 'Das Kernteam wächst auf über 20 festangestellte Experten. Wir beziehen unseren neuen Hauptsitz in Berlin und bauen unsere Planungs- und Montagekapazitäten massiv aus.' },
    { year: '2024', title: 'Testsieger 2025', text: 'ZOE Solar wird von PhotovoltaikTest.de als bester Anbieter für gewerbliche Solaranlagen ausgezeichnet. Eine Bestätigung unseres kompromisslosen Qualitätsanspruchs.' },
    { year: 'Heute', title: 'Ihr starker Partner', text: 'Mit über 150 MWp installierter Leistung sind wir einer der führenden Partner für gewerbliche Solarlösungen in Deutschland und gestalten die Energiezukunft aktiv mit.' },
];

const UeberUnsHero: React.FC<{ onCtaClick: (anchor?: string) => void }> = ({ onCtaClick }) => {
    return (
        <section className="ueberuns-hero bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-6 py-20 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Text Content */}
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tighter animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                            Wir gestalten die Energiewende.
                        </h1>
                        <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
                           Wir sind mehr als nur ein Installationsbetrieb – wir sind Ihr strategischer Partner auf dem Weg in eine profitable und unabhängige Energiezukunft.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slide-in-up" style={{ animationDelay: '0.8s' }}>
                            <a onClick={() => onCtaClick('zoe-unterschied')} className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-lg cta-button-glow cursor-pointer">
                                Was uns auszeichnet
                            </a>
                            <button onClick={() => document.dispatchEvent(new CustomEvent('open-chat'))} className="w-full sm:w-auto bg-white text-slate-700 font-bold py-3 px-8 rounded-lg hover:bg-slate-200 transition-colors border border-slate-300 shadow-md">
                                Kontakt aufnehmen
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Image Collage */}
                    <div className="hidden lg:block relative h-96">
                        <div className="absolute inset-0">
                            <img src={teamMembers[0].imageUrl} alt={teamMembers[0].name} className="floating-hero-img ueberuns-hero img-1" />
                            <img src={teamMembers[1].imageUrl} alt={teamMembers[1].name} className="floating-hero-img ueberuns-hero img-2" />
                            <img src={teamMembers[2].imageUrl} alt={teamMembers[2].name} className="floating-hero-img ueberuns-hero img-3" />
                            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=400&auto=format&fit=crop" alt="Unser Team" className="floating-hero-img ueberuns-hero img-4" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


interface UeberUnsPageProps {
  setPage: (page: Page) => void;
}

const UeberUnsPage: React.FC<UeberUnsPageProps> = ({ setPage }) => {
     const handleHeroCta = (anchor?: string) => {
      if (anchor) {
        document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
      }
    };
    return (
        <div className="bg-white">
            <UeberUnsHero onCtaClick={handleHeroCta} />
            {/* Mission Section */}
            <AnimatedSection>
                <section className="py-20 bg-white">
            <AnimatedSection>
                <VideoSection />
            </AnimatedSection>

                    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <p className="font-bold text-green-600 uppercase tracking-wider">Unsere Mission</p>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">Ihr Partner für eine profitable Energiezukunft.</h2>
                            <p className="text-lg text-slate-600 mt-6">
                                ZOE Solar wurde aus der Überzeugung gegründet, dass die Zukunft der Energieversorgung dezentral, erneuerbar und vor allem wirtschaftlich sein muss. Wir begleiten den deutschen Mittelstand und die Landwirtschaft auf dem Weg in eine unabhängige Energiezukunft, die sich rechnet.
                            </p>
                             <p className="text-slate-600 mt-4">
                                Jedes von uns realisierte Projekt ist ein aktiver Beitrag zum Klimaschutz, zur Reduzierung von Emissionen und zur Schonung endlicher Ressourcen. Wir sehen uns als strategischer Partner, der technische Exzellenz mit ökonomischer Vernunft verbindet.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <img src="https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop" alt="Nachhaltigkeit" className="rounded-xl shadow-lg w-full h-auto object-cover aspect-square"/>
                            <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop" alt="Handshake" className="rounded-xl shadow-lg w-full h-auto object-cover aspect-square mt-8"/>
                        </div>
                    </div>
                </section>
            </AnimatedSection>
            
            {/* Timeline Section */}
            <AnimatedSection>
                <section className="py-20 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-slate-900">Unsere Geschichte: Meilensteine des Wachstums</h2>
                        </div>
                        <div className="relative">
                            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 hidden md:block" aria-hidden="true"></div>
                            {timeline.map((item, index) => (
                                 <div key={item.year} className="md:grid md:grid-cols-2 md:gap-12 items-center relative mb-12">
                                    <div className={`md:text-right md:pr-12 ${index % 2 !== 0 ? 'md:order-2 md:text-left md:pl-12' : ''}`}>
                                        <p className="text-5xl font-bold text-green-200">{item.year}</p>
                                        <h3 className="text-2xl font-bold text-slate-800 mt-1">{item.title}</h3>
                                        <p className="text-slate-600 mt-2">{item.text}</p>
                                    </div>
                                    <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 bg-green-500 border-4 border-white rounded-full hidden md:block"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </AnimatedSection>
            

             {/* Team Section */}
            <AnimatedSection>
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-12">
                             <h2 className="text-4xl font-bold text-slate-900">Unser Kernteam</h2>
                             <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">
                                Erfahrung, Leidenschaft und Kompetenz für Ihr Projekt.
                             </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-8">
                            {teamMembers.map(member => (
                                <div key={member.name} className="text-center">
                                    <img src={member.imageUrl} alt={member.name} loading="lazy" decoding="async" className="w-40 h-40 rounded-full object-cover mx-auto mb-4 shadow-lg"/>
                                    <h4 className="font-bold text-slate-800 text-lg">{member.name}</h4>
                                    <p className="text-slate-500">{member.role}</p>
                                </div>
                            ))}
                        </div>
                         <div className="text-center mt-12">
                            <button onClick={() => setPage('team')} className="font-bold text-green-600 hover:text-green-700 transition-colors group">
                                Lernen Sie das gesamte Team kennen <span className="inline-block transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                            </button>
                        </div>
                    </div>
                </section>
            </AnimatedSection>
            
            {/* Sustainability Section */}
            <AnimatedSection>
                <section className="py-20 bg-slate-800 text-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold">Unser Beitrag in Zahlen</h2>
                            <p className="text-slate-300 mt-2">Gemeinsam mit unseren Kunden haben wir bereits viel erreicht.</p>
                        </div>
                        <div className="grid sm:grid-cols-3 gap-8 text-center">
                            {stats.map(stat => (
                                <div key={stat.label} className="bg-slate-700 p-8 rounded-lg">
                                    <p className="text-4xl md:text-5xl font-bold text-green-400">{stat.value}</p>
                                    <p className="text-slate-300 mt-2">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </AnimatedSection>
        </div>
    );
};

export default UeberUnsPage;
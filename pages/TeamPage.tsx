import React from 'react';
import { Page } from '../types';

const teamMembers = [
    { name: 'Max Mustermann', role: 'Gründer & Geschäftsführer', imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop' },
    { name: 'Erika Mustermann', role: 'Leitung Projektplanung', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop' },
    { name: 'Klaus Kleber', role: 'Leitender Ingenieur', imageUrl: 'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=2071&auto=format&fit=crop' },
    { name: 'Julia Richter', role: 'Leitung Vertrieb', imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop' },
    { name: 'Stefan Meier', role: 'Leiter Montageteams', imageUrl: 'https://images.unsplash.com/photo-1621905252507-b3c04bd9bb0a?q=80&w=1964&auto=format&fit=crop' },
    { name: 'Lena Schmidt', role: 'Marketing & Kommunikation', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop' },
];

const TeamHero: React.FC<{ onCtaClick: () => void }> = ({ onCtaClick }) => {
    return (
        <section className="team-hero bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-6 py-20 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Text Content */}
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tighter animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                            Unsere Experten.
                        </h1>
                        <h2 className="text-5xl md:text-6xl font-extrabold text-green-600 tracking-tighter mt-2 animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
                            Das Team hinter ZOE Solar.
                        </h2>
                        <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
                           Lernen Sie die Köpfe kennen, die mit Leidenschaft und Expertise Ihr Projekt zum Erfolg führen. Jeder Einzelne ein Spezialist auf seinem Gebiet.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slide-in-up" style={{ animationDelay: '0.8s' }}>
                            <a onClick={onCtaClick} className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-lg cta-button-glow cursor-pointer">
                                Werden Sie Teil des Teams
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Image Collage */}
                    <div className="hidden lg:block relative h-96">
                        <div className="absolute inset-0">
                            <img src={teamMembers[3].imageUrl} alt={teamMembers[3].name} className="floating-hero-img team-hero img-1" />
                            <img src={teamMembers[4].imageUrl} alt={teamMembers[4].name} className="floating-hero-img team-hero img-2" />
                            <img src={teamMembers[5].imageUrl} alt={teamMembers[5].name} className="floating-hero-img team-hero img-3" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

interface TeamPageProps {
    setPage: (page: Page) => void;
}

const TeamPage: React.FC<TeamPageProps> = ({ setPage }) => {

    const handleCtaClick = () => {
        setPage('karriere');
    };

    return (
        <>
            <TeamHero onCtaClick={handleCtaClick} />
            <div className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {teamMembers.map(member => (
                            <div key={member.name} className="text-center group">
                                <div className="relative overflow-hidden rounded-xl shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                                    <img src={member.imageUrl} alt={member.name} loading="lazy" decoding="async" className="w-full h-auto object-cover aspect-square"/>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                        <h4 className="font-bold text-lg">{member.name}</h4>
                                        <p className="text-sm text-green-300">{member.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default TeamPage;
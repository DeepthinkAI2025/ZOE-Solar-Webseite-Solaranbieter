import React, { useState } from 'react';
import { Page } from '../types';
import JobApplicationFunnel from '../components/JobApplicationFunnel';
import AnimatedSection from '../components/AnimatedSection';

const jobOpenings = [
    {
        title: 'Projektleiter Photovoltaik (m/w/d)',
        location: 'Berlin',
        type: 'Vollzeit',
        description: 'Sie übernehmen die Verantwortung für die Planung und Umsetzung unserer gewerblichen PV-Großprojekte von der Akquise bis zur Übergabe.'
    },
    {
        title: 'Elektroniker für Energie- & Gebäudetechnik (m/w/d)',
        location: 'Brandenburg / Bundesweit',
        type: 'Vollzeit',
        description: 'Sie sind Teil unseres Montageteams und für die fachgerechte Installation und Inbetriebnahme unserer PV-Anlagen und Speichersysteme verantwortlich.'
    },
    {
        title: 'Vertriebsmitarbeiter im Außendienst (m/w/d)',
        location: 'Region Ostdeutschland',
        type: 'Vollzeit',
        description: 'Sie identifizieren und gewinnen neue Kunden aus der Landwirtschaft und Industrie und begleiten diese als erster Ansprechpartner.'
    }
];

const benefits = [
    'Attraktives Gehalt & Bonusmodell',
    'Firmenwagen, auch zur privaten Nutzung',
    'Modernste Arbeitsausstattung (Apple)',
    'Flexible Arbeitszeiten & Home-Office',
    'Flache Hierarchien & schnelle Entscheidungen',
    'Regelmäßige Weiterbildungen & Zertifizierungen',
    'Team-Events & starker Zusammenhalt',
    'Betriebliche Altersvorsorge'
];

const KarriereHero: React.FC<{ onCtaClick: (anchor?: string) => void }> = ({ onCtaClick }) => {
    return (
        <section className="karriere-hero-v2 bg-slate-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 py-20 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Text Content */}
                    <div className="text-center lg:text-left z-10">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tighter animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                            Werden Sie Teil der Energiewende.
                        </h1>
                        <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
                           Bei ZOE Solar arbeiten wir jeden Tag daran, die Zukunft nachhaltiger zu gestalten. Gestalten Sie mit uns – in einem dynamischen Team mit klarer Mission.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slide-in-up" style={{ animationDelay: '0.8s' }}>
                            <a onClick={() => onCtaClick('offene-stellen')} className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-lg cta-button-glow cursor-pointer">
                                Zu den offenen Stellen
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Team Mosaic */}
                    <div className="hidden lg:block relative h-96">
                        <div className="team-mosaic">
                           <div className="mosaic-img img-1">
                                <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop" alt="Team bei der Arbeit" />
                            </div>
                            <div className="mosaic-img img-2">
                                <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop" alt="Meeting" />
                            </div>
                            <div className="mosaic-img img-3">
                                <img src="https://images.unsplash.com/photo-1556742518-a6e5b402c6a2?q=80&w=800&auto=format&fit=crop" alt="Partnerschaft" />
                            </div>
                            <div className="mosaic-img img-4">
                                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop" alt="Mitarbeiterin" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


interface KarrierePageProps {
  setPage: (page: Page, options?: { anchor?: string }) => void;
}

const KarrierePage: React.FC<KarrierePageProps> = ({ setPage }) => {
    const [isFunnelOpen, setIsFunnelOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState('');

    const handleApplyClick = (jobTitle: string) => {
        setSelectedJob(jobTitle);
        setIsFunnelOpen(true);
    };
    
    const handleHeroCta = (anchor?: string) => {
      if (anchor) {
        document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
      }
    };


    return (
        <div className="bg-slate-50">
            <KarriereHero onCtaClick={handleHeroCta} />
            
            <AnimatedSection>
                <div className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-12 items-center bg-slate-50 p-12 rounded-lg shadow-xl border border-slate-200">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-800 mb-4">Was wir Ihnen bieten</h2>
                                <p className="text-slate-600 mb-6">Wir sind ein dynamisches Team mit einer klaren Mission. Bei uns finden Sie ein Arbeitsumfeld, in dem Ihr Beitrag zählt und Ihre berufliche Entwicklung gefördert wird.</p>
                                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                                    {benefits.map((benefit, index) => (
                                        <div key={index} className="flex items-start">
                                            <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                            <span className="text-slate-600">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <img 
                                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
                                    alt="ZOE Solar Team bei der Arbeit"
                                    loading="lazy"
                                    decoding="async"
                                    className="rounded-lg shadow-lg w-full h-auto object-cover aspect-video"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Job Openings Section */}
                    <div id="offene-stellen" className="max-w-7xl mx-auto px-6 mt-20 scroll-mt-28">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-slate-900">Offene Stellen</h2>
                            <p className="text-lg text-slate-600 mt-4 max-w-3xl mx-auto">
                                Wir wachsen und suchen Verstärkung. Finden Sie die Position, die zu Ihnen passt.
                            </p>
                        </div>
                        <div className="space-y-6 max-w-4xl mx-auto">
                            {jobOpenings.map((job, index) => (
                                <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-slate-200 hover:shadow-xl hover:border-green-300 transition-all duration-300">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
                                        <h3 className="text-xl font-bold text-slate-800">{job.title}</h3>
                                        <div className="flex items-center gap-4 mt-2 sm:mt-0 text-sm text-slate-500">
                                            <span>{job.location}</span>
                                            <span className="bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">{job.type}</span>
                                        </div>
                                    </div>
                                    <p className="text-slate-600 mb-4">{job.description}</p>
                                    <button onClick={() => handleApplyClick(job.title)} className="font-bold text-green-600 hover:text-green-700 transition-colors">Jetzt bewerben →</button>
                                </div>
                            ))}
                            <div className="text-center pt-8">
                                <h3 className="font-bold text-slate-700">Nicht die passende Stelle dabei?</h3>
                                <p className="text-slate-600 mt-2">Wir sind immer auf der Suche nach talentierten Menschen. Senden Sie uns gerne Ihre{' '}
                                    <button onClick={() => handleApplyClick('Initiativbewerbung')} className="text-green-600 hover:underline font-semibold">Initiativbewerbung</button>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </AnimatedSection>
            {isFunnelOpen && <JobApplicationFunnel onClose={() => setIsFunnelOpen(false)} jobTitle={selectedJob} />}
        </div>
    );
};

export default KarrierePage;
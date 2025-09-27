import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import { fundingProgramLevels, getActiveFundingPrograms } from '../data/fundingPrograms';

const FoerdermittelOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const programs = useMemo(() => getActiveFundingPrograms(), []);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPrograms = useMemo(() => {
    return programs.filter((program) => {
      const matchesLevel = selectedLevel === 'all' || program.level === selectedLevel;
      const matchesSearch = `${program.title} ${program.provider} ${program.region ?? ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesLevel && matchesSearch;
    });
  }, [programs, searchTerm, selectedLevel]);

  return (
    <div className="bg-slate-50">
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-700 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1600&q=80')] opacity-10" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <span className="px-4 py-1 bg-white/10 backdrop-blur rounded-full uppercase tracking-wider text-xs">
              Fördermitteldatenbank für Solar & Energieprojekte
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mt-6 leading-tight">
              Jede relevante Förderung. Eine Plattform. Komplett aufbereitet.
            </h1>
            <p className="text-lg text-slate-200 mt-4">
              Von Bundesprogrammen über Landesbanken bis zu kommunalen Sondertöpfen: Wir behalten den Überblick und kombinieren die
              besten Incentives für Ihr Solarprojekt. Starten Sie mit einer passgenauen Förderstrategie.
            </p>
            <div className="mt-10 grid gap-4 md:grid-cols-[2fr_1fr]">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/20">
                <label className="block text-xs uppercase tracking-wide text-slate-300 font-semibold mb-2">
                  Programm suchen
                </label>
                <input
                  className="w-full bg-white/80 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="z.B. KfW 270, NRW.BANK oder LIFE"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/20">
                <label className="block text-xs uppercase tracking-wide text-slate-300 font-semibold mb-2">
                  Filter nach Ebene
                </label>
                <select
                  className="w-full bg-white/80 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  value={selectedLevel}
                  onChange={(event) => setSelectedLevel(event.target.value)}
                >
                  <option value="all">Alle Programme</option>
                  {fundingProgramLevels.map(({ level, label }) => (
                    <option key={level} value={level}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AnimatedSection>
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
              <h2 className="text-2xl font-bold text-slate-900">Ergebnisse ({filteredPrograms.length})</h2>
              <button
                onClick={() => document.dispatchEvent(new CustomEvent('open-chat'))}
                className="bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl shadow hover:bg-emerald-700 transition"
              >
                Förderanalyse starten
              </button>
            </div>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredPrograms.map((program) => (
                <article key={program.slug} className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
                  <div className="bg-slate-100/80 p-6 border-b border-slate-200">
                    <img src={program.logo} alt={`${program.provider} Logo`} className="h-12 object-contain" />
                  </div>
                  <div className="p-6 flex flex-col gap-4 flex-grow">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500 font-semibold">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full">
                        {fundingProgramLevels.find(({ level }) => level === program.level)?.label ?? program.level}
                      </span>
                      {program.region && <span className="px-2 py-1 bg-slate-100 rounded-full">{program.region}</span>}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 leading-tight">{program.title}</h3>
                      <p className="text-sm text-slate-500 font-semibold mt-1">{program.provider}</p>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed flex-grow">{program.summary}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                      {program.fundingRate && (
                        <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-100">
                          Förderquote {program.fundingRate}
                        </span>
                      )}
                      {program.maxFunding && (
                        <span className="px-3 py-1 bg-slate-50 rounded-full border border-slate-200">
                          Bis {program.maxFunding}
                        </span>
                      )}
                      <span className="px-3 py-1 bg-slate-50 rounded-full border border-slate-200">
                        Zielgruppe: {program.targetGroups.join(', ')}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wide text-slate-400 font-semibold">
                      Zuletzt aktualisiert: {program.lastUpdated}
                    </span>
                    <button
                      onClick={() => navigate(`/foerdermittel/${program.slug}`)}
                      className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm hover:text-emerald-700"
                    >
                      Programmdetail <span aria-hidden>&rarr;</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
};

export default FoerdermittelOverviewPage;

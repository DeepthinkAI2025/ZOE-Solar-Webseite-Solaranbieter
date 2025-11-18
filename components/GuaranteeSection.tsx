import React from 'react';
import { Page } from '../types';

interface GuaranteeSectionProps {
  setPage: (page: Page, options?: { anchor?: string }) => void;
}

const guarantees = [
  {
    title: 'Sorglos-Garantie',
    description:
      'Wir übernehmen Planung, Behördenkommunikation, Netzanschluss sowie Monitoring. Sie erhalten ein schlüsselfertiges Kraftwerk inklusive Betriebsführung.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-12 h-12 text-primary-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75l-7.5 7.5L7.5 18l4.5-4.5 4.5 4.5 3-3-7.5-7.5z" />
      </svg>
    ),
  },
  {
    title: 'Rendite-Maximierung',
    description:
      'Durch AI-gestützte Simulationen und präzise Standortanalysen maximieren wir Ihre Anlagenleistung. So erreichen Sie die höchstmögliche Rendite bei minimalen Investitionskosten.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-12 h-12 text-primary-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 10h18M3 14h18M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 9h4v6h-4z" />
      </svg>
    ),
  },
  {
    title: 'Direktvermarktung-Vorteil',
    description:
      'Wir übernehmen die Direktvermarktung Ihrer Solarenergie und sichern Ihnen höhere Erlöse als über den Netzbetreiber. So amortisiert sich Ihre Anlage schneller und rentabler.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-12 h-12 text-primary-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

const guaranteeStats = [
  { value: '24h', label: 'Reaktionszeit auf Servicefälle' },
  { value: '97%', label: 'Projektabschluss im geplanten Budget' },
  { value: '30 J.', label: 'Ertragsgarantie auf Premium-Module' },
];

const GuaranteeSection: React.FC<GuaranteeSectionProps> = ({ setPage }) => {
  return (
    <section className="py-20 bg-gradient-to-b from-[#FFFEFB] via-white to-[#F4FAFF]" aria-labelledby="guarantee-heading">
      <div className="max-w-6xl mx-auto px-6 text-slate-900">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-16 items-start">
          <div>
            <p className="text-sm font-semibold text-primary-700 uppercase tracking-[0.4em]">Risikofrei investieren</p>
            <h2 id="guarantee-heading" className="text-4xl lg:text-[3.25rem] font-black mt-4 leading-tight">
              Drei Garantien, die Solar für Familienbetriebe planbar machen.
            </h2>
            <p className="text-xl text-slate-700 mt-6 leading-relaxed">
              Jede Zusage steht schriftlich im Vertrag. Sollte eine Garantie nicht erfüllt werden, gleichen wir den Schaden
              finanziell aus – transparent, nachvollziehbar und mit festen Fristen.
            </p>

            <div className="mt-10 grid sm:grid-cols-3 gap-4" role="list">
              {guaranteeStats.map((stat) => (
                <div key={stat.label} className="bg-white/90 border border-white rounded-2xl p-4 shadow-sm" role="listitem">
                  <p className="text-3xl font-black text-primary-700">{stat.value}</p>
                  <p className="text-sm font-semibold text-slate-600 mt-2">{stat.label}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setPage('kontakt')}
              className="mt-10 inline-flex items-center gap-3 bg-primary-600 text-white font-black py-4 px-10 rounded-2xl text-lg hover:bg-primary-700 transition-all duration-300 shadow-lg shadow-primary-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFEFB]"
            >
              Garantierte Erstberatung sichern
              <span aria-hidden>→</span>
            </button>
            <p className="text-sm text-slate-500 mt-3">Klarer Maßnahmenplan & schriftliche Zusagen nach dem Gespräch.</p>
          </div>
          <div className="space-y-6">
            {guarantees.map((item) => (
              <div
                key={item.title}
                className="bg-white border border-slate-100 rounded-3xl p-6 flex gap-6 items-start shadow-md shadow-slate-200/40"
              >
                <div className="flex-shrink-0">{item.icon}</div>
                <div>
                  <h3 className="text-2xl font-semibold text-slate-900">{item.title}</h3>
                  <p className="text-base text-slate-600 mt-3 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
            <p className="text-sm text-slate-500">
              * Garantien gelten nach gemeinsamer Projektfreigabe und sind Teil Ihres Angebots.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuaranteeSection;

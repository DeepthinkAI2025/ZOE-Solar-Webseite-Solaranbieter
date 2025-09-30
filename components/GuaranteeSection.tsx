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
        className="w-12 h-12 text-green-500"
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
        className="w-12 h-12 text-green-500"
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
        className="w-12 h-12 text-green-500"
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

const GuaranteeSection: React.FC<GuaranteeSectionProps> = ({ setPage }) => {
  return (
    <section className="py-20 bg-slate-900" aria-labelledby="guarantee-heading">
      <div className="max-w-6xl mx-auto px-6 text-white">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-16 items-center">
          <div>
            <p className="font-bold text-green-400 uppercase tracking-widest">Risikofrei investieren</p>
            <h2 id="guarantee-heading" className="text-4xl lg:text-5xl font-bold mt-4 leading-tight">
              Drei Garantien, die Solar zur sicheren Investition machen.
            </h2>
            <p className="text-lg text-slate-200 mt-6">
              Wir wissen, dass Sie Zahlen und Sicherheit brauchen. Deshalb geben wir starke Versprechen ab – schriftlich
              fixiert im Vertrag. Sollte eines davon nicht erfüllt werden, gleichen wir den Schaden finanziell aus.
            </p>
            <button
              onClick={() => setPage('kontakt')}
              className="mt-10 inline-flex items-center gap-3 bg-green-500 text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-green-600 transition-all duration-300 shadow-xl cta-button-glow"
            >
              Garantierte Erstberatung sichern
              <span aria-hidden>→</span>
            </button>
          </div>
          <div className="space-y-6">
            {guarantees.map((item) => (
              <div
                key={item.title}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 flex gap-6 items-start backdrop-blur-sm"
              >
                <div className="flex-shrink-0">{item.icon}</div>
                <div>
                  <h3 className="text-2xl font-semibold text-white">{item.title}</h3>
                  <p className="text-slate-300 mt-2 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
            <p className="text-sm text-slate-400">
              * Alle Garantien gelten nach gemeinsamer Projektfreigabe. Details besprechen wir im Erstgespräch und
              tragen sie in Ihr individuelles Angebot ein.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuaranteeSection;

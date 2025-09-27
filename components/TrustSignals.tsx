import React, { useEffect, useState } from 'react';

const trustStats = [
  {
    label: 'Betreutes Investitionsvolumen',
    value: '€ 180 Mio.',
    subline: 'finanziert & realisiert seit 2018',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a2.25 2.25 0 011.928 0l.041.02m-2.01 0v.008c0 .322-.11.636-.312.891l-.093.117a2.252 2.252 0 00-.33 1.852l.03.124c.134.532.63.908 1.178.908h.306c.549 0 1.044-.376 1.178-.908l.03-.124a2.252 2.252 0 00-.33-1.852l-.093-.117a1.5 1.5 0 01-.312-.891v-.008m-2.016 0a2.251 2.251 0 00-1.132-.958l-2.262-.905a2.219 2.219 0 01-1.206-1.184l-.106-.255a2.214 2.214 0 011.184-2.889l2.262-.905a2.248 2.248 0 011.604 0l2.262.905a2.219 2.219 0 011.206 1.184l.106.255a2.214 2.214 0 01-1.184 2.889l-2.262.905a2.251 2.251 0 00-1.132.958z" />
      </svg>
    ),
  },
  {
    label: 'Performance-SLA erfüllt',
    value: '97%',
    subline: 'garantierte Ertragswerte im Monitoring',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5l3 3 9-9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 21a9 9 0 110-18 9 9 0 010 18z" />
      </svg>
    ),
  },
  {
    label: 'Durchschnittliche Amortisation',
    value: '7,6 Jahre',
    subline: 'bei Agrar- & Gewerbekunden',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const proofPoints = [
  'Bankfähige Cashflow-Modelle inkl. Sensitivitätsanalysen',
  'Eigene Planung, Montage & Service – keine Subunternehmer',
  'Transparenter Projekt-Tracker mit Live-Monitoring 24/7',
];

const badges = [
  {
    title: 'Testsieger 2025',
    description: 'Ausgezeichnet von photovoltaiktest.de',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.25-2.25a9 9 0 11-12.99 12.99 9 9 0 0112.99-12.99z" />
      </svg>
    ),
  },
  {
    title: 'DNV GL Zertifiziert',
    description: 'Planung & Installation nach ISO 9001',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75l-7.5 7.5L7.5 18l4.5-4.5 4.5 4.5 3-3-7.5-7.5z" />
      </svg>
    ),
  },
  {
    title: 'Eigenes Montageteam',
    description: '100% Kontrolle & feste Qualitätsstandards',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904l-2.114.757a1.125 1.125 0 01-1.419-1.419l.757-2.114a2.25 2.25 0 01.502-.787l6.364-6.364a2.25 2.25 0 113.182 3.182l-6.364 6.364c-.214.214-.48.38-.788.501z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6.75L17.25 6 18 5.25" />
      </svg>
    ),
  },
];

const clientLogos = [
  {
    name: 'Landgut Brandenburg',
    src: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Biohof Nord',
    src: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Logistik Campus Berlin',
    src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Frischezentrum Mitte',
    src: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Solar GmbH Süd',
    src: 'https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'AgriCollective Ost',
    src: 'https://images.unsplash.com/photo-1428660386617-8d277e7deaf2?auto=format&fit=crop&w=200&q=80',
  },
];

const testimonial = {
  quote:
    '„ZOE Solar hat in nur fünf Monaten unsere komplette Hofstruktur elektrifiziert – inklusive Finanzierungsnachweis für die Bank. Die prognostizierten Cashflows treffen wir seit Inbetriebnahme auf den Punkt.“',
  author: 'Johanna Keller',
  role: 'CFO · Landgut Brandenburg',
  avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=250&q=80',
};

type MonitoringSnapshot = {
  availability: number | null;
  productionMw: number | null;
  alerts: Array<{ id?: string; message: string }>;
  updatedAt: string | null;
};

const defaultMonitoring: MonitoringSnapshot = {
  availability: 99.2,
  productionMw: 6.4,
  alerts: [],
  updatedAt: null
};

const TrustSignals: React.FC = () => {
  const [monitoring, setMonitoring] = useState<MonitoringSnapshot>(defaultMonitoring);
  const [isMonitoringLoading, setMonitoringLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function loadSnapshot() {
      setMonitoringLoading(true);
      try {
        const response = await fetch('/api/monitoring/summary', { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = (await response.json()) as MonitoringSnapshot;
        if (!cancelled) {
          setMonitoring({
            availability: typeof payload.availability === 'number' ? payload.availability : defaultMonitoring.availability,
            productionMw: typeof payload.productionMw === 'number' ? payload.productionMw : defaultMonitoring.productionMw,
            alerts: Array.isArray(payload.alerts) ? payload.alerts : defaultMonitoring.alerts,
            updatedAt: payload.updatedAt ?? defaultMonitoring.updatedAt
          });
        }
      } catch (error) {
        if (!cancelled) {
          console.warn('[TrustSignals] Monitoring-Daten konnten nicht geladen werden:', error);
          setMonitoring(defaultMonitoring);
        }
      } finally {
        if (!cancelled) setMonitoringLoading(false);
      }
    }

    loadSnapshot();

    const interval = window.setInterval(() => {
      loadSnapshot();
    }, 1000 * 60 * 10);

    return () => {
      cancelled = true;
      controller.abort();
      window.clearInterval(interval);
    };
  }, []);

  const availabilityDisplay = monitoring.availability != null
    ? `${monitoring.availability.toFixed(2)}%`
    : '—';

  const productionDisplay = monitoring.productionMw != null
    ? `${monitoring.productionMw.toFixed(1)} MW`
    : '—';

  return (
    <section className="relative py-24 bg-slate-950 text-white overflow-hidden" aria-labelledby="trust-signals-heading">
      <div className="absolute inset-0">
        <div className="absolute -top-24 -right-32 h-96 w-96 rounded-full bg-green-500/20 blur-[160px]" />
        <div className="absolute top-1/3 -left-32 h-80 w-80 rounded-full bg-emerald-500/10 blur-[140px]" />
      </div>
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid items-start gap-14 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="font-semibold uppercase tracking-[0.35em] text-emerald-300/80">Vertrauen entsteht durch Ergebnisse</p>
            <h2 id="trust-signals-heading" className="mt-6 text-4xl font-bold leading-tight text-white md:text-5xl">
              Wir liefern bankfähige Solarprojekte – von der Analyse bis zur Rendite.
            </h2>
            <p className="mt-6 text-lg text-slate-300">
              Unsere Mandanten erhalten klare Entscheidungsgrundlagen, verlässliche Projektabwicklung und messbare
              Performance. Jedes Versprechen ist mit Daten, Garantien und Monitoring hinterlegt.
            </p>

            <ul className="mt-8 space-y-3 text-sm text-slate-200">
              {proofPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20 text-green-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="font-medium leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {trustStats.map((stat) => (
                <div
                  key={stat.label}
                  className="group rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_45px_-25px_rgba(15,185,125,0.45)] backdrop-blur"
                >
                  <div className="flex items-center justify-between text-slate-200">
                    <span className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-white/60">
                      {stat.label}
                    </span>
                    <span className="text-green-300">{stat.icon}</span>
                  </div>
                  <p className="mt-4 text-2xl font-bold text-white">{stat.value}</p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-white/60">
                    {stat.subline}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_35px_60px_-30px_rgba(16,185,129,0.4)] backdrop-blur">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-emerald-200/70">Proofboard</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">
                Jede Zusage ist vertraglich abgesichert und live nachvollziehbar.
              </h3>
            </div>

            <div className="space-y-4">
              {badges.map((badge) => (
                <div key={badge.title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/15 text-green-300">
                    {badge.icon}
                  </div>
                  <div>
                    <p className="text-base font-semibold text-white">{badge.title}</p>
                    <p className="text-sm text-slate-300">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">Monitoring Snapshot</p>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/20 text-green-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 15h4l2 6 4-18 2 12 2-6h4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-slate-300">Ø Anlagenverfügbarkeit (Live)</p>
                  <p className="text-2xl font-semibold text-white">
                    {isMonitoringLoading ? 'lädt…' : availabilityDisplay}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Produktion aktuell: {isMonitoringLoading ? '—' : productionDisplay}
                    {monitoring.updatedAt ? ` · Stand ${new Date(monitoring.updatedAt).toLocaleString('de-DE')}` : ''}
                  </p>
                </div>
              </div>
              {!!monitoring.alerts?.length && (
                <ul className="mt-4 space-y-2 text-xs text-amber-300">
                  {monitoring.alerts.map((alert, index) => (
                    <li key={alert.id ?? index} className="flex items-start gap-2">
                      <span className="mt-0.5">•</span>
                      <span>{alert.message}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1.05fr_1fr]">
          <blockquote className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_25px_50px_-30px_rgba(15,185,125,0.5)] md:p-10">
            <span className="pointer-events-none absolute -top-10 -left-2 text-9xl font-serif text-green-500/20">“</span>
            <p className="relative z-10 text-xl leading-relaxed text-slate-100">{testimonial.quote}</p>
            <div className="relative z-10 mt-6 flex items-center gap-4">
              <img
                src={testimonial.avatar}
                alt={testimonial.author}
                className="h-12 w-12 rounded-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-200/80">Case Study</p>
                <p className="text-base font-semibold text-white">{testimonial.author}</p>
                <p className="text-sm text-slate-300">{testimonial.role}</p>
              </div>
            </div>
          </blockquote>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">Partner-Portfolio</p>
            <p className="mt-4 text-base text-slate-200">
              Überregional tätige Landwirtschafts- und Industriebetriebe setzen auf ZOE Solar als ganzheitlichen
              Energiepartner – vom Dach bis zur Direktvermarktung.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-3">
              {clientLogos.map((logo) => (
                <div
                  key={logo.name}
                  className="flex aspect-square items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-3"
                >
                  <img
                    src={logo.src}
                    alt={logo.name}
                    className="max-h-12 w-auto object-contain opacity-80"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSignals;

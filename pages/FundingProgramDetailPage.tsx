import React, { useEffect, useMemo } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import AnimatedSection from '../components/AnimatedSection';
import SubHeader from '../components/SubHeader';
import { fundingProgramLevels, getActiveFundingPrograms, getFundingProgramBySlug } from '../data/fundingPrograms';
import { FundingProgram, Page } from '../types';

interface FundingProgramDetailPageProps {
  setPage: (page: Page, options?: { scrollToTop?: boolean; anchor?: string }) => void;
  currentPage: Page;
  bannerHeight: number;
  headerHeight: number;
  slugOverride?: string;
}

const InfoBadge: React.FC<{ label: string; value?: string }> = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="bg-white/80 backdrop-blur rounded-xl px-4 py-3 border border-slate-200 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-1">{label}</p>
      <p className="text-base font-semibold text-slate-800">{value}</p>
    </div>
  );
};

const FundingProgramDetailPage: React.FC<FundingProgramDetailPageProps> = ({
  setPage: _setPage,
  currentPage: _currentPage,
  bannerHeight,
  headerHeight,
  slugOverride,
}) => {
  const { slug: slugParam } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const legacySlugMap: Record<string, string> = {
    kfw: "kfw",
    ibb: "ibb-wirtschaft-nah",
    "ibb-programm": "ibb-wirtschaft-nah",
    bafa: "bafa-eew-zuschuss",
    "bafa-transformationskonzept": "bafa-transformationskonzept",
  };

  const incomingSlug = slugOverride ?? slugParam ?? "";
  const mappedSlug = legacySlugMap[incomingSlug];
  const canonicalSlug = mappedSlug ?? incomingSlug;

  useEffect(() => {
    if (!slugOverride && incomingSlug && mappedSlug && mappedSlug !== incomingSlug) {
      navigate(`/foerdermittel/${mappedSlug}`, { replace: true });
    }
  }, [incomingSlug, mappedSlug, navigate, slugOverride]);

  const program = useMemo<FundingProgram | undefined>(() => {
    if (!canonicalSlug) return undefined;
    return getFundingProgramBySlug(canonicalSlug);
  }, [canonicalSlug]);

  const activePrograms = useMemo(() => getActiveFundingPrograms(), []);

  const navItems = useMemo(
    () =>
      activePrograms.map((item) => ({
        id: item.slug,
        title: item.shortTitle ?? item.title,
        page: `/foerdermittel/${item.slug}`,
      })),
    [activePrograms]
  );

  if (!canonicalSlug || !program) {
    return <Navigate to="/foerdermittel" replace />;
  }

  const levelLabel = fundingProgramLevels.find((entry) => entry.level === program.level)?.label;

  return (
    <div className="bg-slate-50">
      <SubHeader
        navItems={navItems}
        activeItemId={program.slug}
        onItemClick={(id, page) => {
          if (typeof page === 'string') {
            navigate(page);
          }
        }}
        bannerHeight={bannerHeight}
        headerHeight={headerHeight}
      />

      <section className="relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/60 via-slate-900/70 to-slate-900" />
        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="grid lg:grid-cols-[2fr_1fr] gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6 text-sm text-green-200">
                {levelLabel && <span className="px-3 py-1 bg-white/10 rounded-full backdrop-blur">{levelLabel}</span>}
                {program.region && (
                  <span className="px-3 py-1 bg-white/10 rounded-full backdrop-blur">Region: {program.region}</span>
                )}
                {!program.isActive && (
                  <span className="px-3 py-1 bg-red-500/80 rounded-full">Derzeit ausgesetzt</span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">{program.title}</h1>
              <p className="text-lg text-slate-100 max-w-3xl leading-relaxed">{program.summary}</p>
              <div className="mt-10 grid sm:grid-cols-3 gap-4 max-w-3xl">
                <InfoBadge label="Förderquote" value={program.fundingRate} />
                <InfoBadge label="Förderhöhe" value={program.maxFunding} />
                <InfoBadge label="Zielgruppe" value={program.targetGroups.join(', ')} />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-3xl p-6 border border-white/20 shadow-2xl">
              <div className="bg-white rounded-2xl p-6 flex flex-col gap-4 items-center text-center">
                <img src={program.logo} alt={`${program.provider} Logo`} className="max-h-16 object-contain" />
                <p className="text-sm font-semibold text-green-600">{program.tagline}</p>
                <button
                  onClick={() => document.dispatchEvent(new CustomEvent('open-chat'))}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 transition transform hover:-translate-y-0.5"
                >
                  Individuelle Förderberatung anfragen
                </button>
                {program.externalLinks?.length ? (
                  <div className="w-full text-left">
                    <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-2">
                      Offizielle Informationen
                    </p>
                    <ul className="space-y-1 text-sm">
                      {program.externalLinks.map((link) => (
                        <li key={link.url}>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-700 font-semibold"
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        {program.heroImage && (
          <div
            className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 bg-cover bg-center"
            style={{ backgroundImage: `url(${program.heroImage})` }}
          />
        )}
      </section>

      <AnimatedSection>
        <section className="py-16">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid lg:grid-cols-[2fr_1fr] gap-12">
              <div className="space-y-12">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Programmnutzen im Überblick</h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {program.highlights.map((highlight) => (
                      <div key={highlight.title} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-semibold text-green-600 mb-2">{highlight.title}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">{highlight.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Förderfähige Projekte</h2>
                  <ul className="grid sm:grid-cols-2 gap-4">
                    {program.eligibleProjects.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 bg-white rounded-2xl border border-slate-200 p-4 text-sm text-slate-600"
                      >
                        <span className="mt-1 inline-flex h-2.5 w-2.5 bg-green-600 rounded-full" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {program.eligibleCosts?.length ? (
                    <details className="mt-4 bg-white rounded-2xl border border-slate-200 p-4">
                      <summary className="font-semibold text-slate-800 cursor-pointer">Kostenarten im Detail</summary>
                      <ul className="mt-3 space-y-2 text-sm text-slate-600">
                        {program.eligibleCosts.map((cost) => (
                          <li key={cost} className="flex gap-2">
                            <span className="text-green-600">•</span>
                            {cost}
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : null}
                  {program.nonEligibleCosts?.length ? (
                    <details className="mt-4 bg-white rounded-2xl border border-rose-200 p-4">
                      <summary className="font-semibold text-rose-600 cursor-pointer">Nicht förderfähige Kosten</summary>
                      <ul className="mt-3 space-y-2 text-sm text-rose-600">
                        {program.nonEligibleCosts.map((cost) => (
                          <li key={cost} className="flex gap-2">
                            <span>•</span>
                            {cost}
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : null}
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Voraussetzungen</h2>
                  <ul className="space-y-3">
                    {program.requirements.map((requirement) => (
                      <li key={requirement} className="bg-white rounded-2xl border border-slate-200 p-4 text-sm text-slate-600">
                        {requirement}
                      </li>
                    ))}
                  </ul>
                  {program.legalBasis && (
                    <p className="mt-3 text-xs text-slate-500">Rechtsgrundlage: {program.legalBasis}</p>
                  )}
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Antragsprozess</h2>
                  <div className="space-y-4">
                    {program.applicationSteps.map((step, index) => (
                      <div key={step} className="bg-white rounded-2xl border border-slate-200 p-4">
                        <div className="flex items-start gap-3">
                          <span className="flex-none w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center">
                            {index + 1}
                          </span>
                          <p className="text-sm text-slate-700 leading-relaxed">{step}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {program.processingTime && (
                    <p className="mt-4 text-sm text-slate-500">Bearbeitungszeit: {program.processingTime}</p>
                  )}
                  {program.deadlines && (
                    <p className="text-sm text-slate-500">Fristen &amp; Calls: {program.deadlines}</p>
                  )}
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Unterstützung durch ZOE Solar</h2>
                  <ul className="grid sm:grid-cols-2 gap-4">
                    {program.supportServices.map((service) => (
                      <li key={service} className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-sm text-emerald-700">
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>

                {program.combinationTips.length ? (
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Kombinationsmöglichkeiten</h2>
                    <ul className="space-y-3">
                      {program.combinationTips.map((tip) => (
                        <li key={tip} className="bg-white rounded-2xl border border-slate-200 p-4 text-sm text-slate-600">
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {program.repaymentBenefits?.length ? (
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Tilgungszuschüsse &amp; Boni</h2>
                    <ul className="space-y-3">
                      {program.repaymentBenefits.map((benefit) => (
                        <li key={benefit} className="bg-white rounded-2xl border border-green-200 p-4 text-sm text-green-700">
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {program.notes && <p className="text-xs text-slate-500">Hinweis: {program.notes}</p>}
              </div>

              <aside className="space-y-8">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Facts</h3>
                  <dl className="space-y-3 text-sm text-slate-600">
                    <div>
                      <dt className="font-semibold text-slate-500">Anbieter</dt>
                      <dd>{program.provider}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-500">Programmart</dt>
                      <dd>{program.fundingTypes.join(', ')}</dd>
                    </div>
                    {program.minFunding && (
                      <div>
                        <dt className="font-semibold text-slate-500">Mindestvolumen</dt>
                        <dd>{program.minFunding}</dd>
                      </div>
                    )}
                    {program.maxFunding && (
                      <div>
                        <dt className="font-semibold text-slate-500">Maximalvolumen</dt>
                        <dd>{program.maxFunding}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="font-semibold text-slate-500">Letzte Aktualisierung</dt>
                      <dd>{program.lastUpdated}</dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Kontakt</h3>
                  <ul className="space-y-3 text-sm text-slate-600">
                    {program.contact.phone && (
                      <li>
                        <span className="font-semibold text-slate-500 block">Hotline</span>
                        <span>{program.contact.phone}</span>
                        {program.contact.hotlineHours && (
                          <span className="block text-xs text-slate-500">{program.contact.hotlineHours}</span>
                        )}
                      </li>
                    )}
                    {program.contact.email && (
                      <li>
                        <span className="font-semibold text-slate-500 block">E-Mail</span>
                        <a href={`mailto:${program.contact.email}`} className="text-green-600 font-semibold">
                          {program.contact.email}
                        </a>
                      </li>
                    )}
                    {program.contact.url && (
                      <li>
                        <span className="font-semibold text-slate-500 block">Webseite</span>
                        <a
                          href={program.contact.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 font-semibold"
                        >
                          {program.contact.url}
                        </a>
                      </li>
                    )}
                    {program.contact.note && <li className="text-xs text-slate-500">{program.contact.note}</li>}
                  </ul>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Benötigte Unterlagen</h3>
                  <ul className="space-y-3 text-sm text-slate-600">
                    {program.documentsRequired.map((doc) => (
                      <li key={doc} className="flex gap-2">
                        <span className="text-green-600">•</span>
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {program.faqs.length ? (
        <section className="bg-white py-16">
          <div className="container mx-auto px-6 max-w-5xl">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">FAQs zum Programm</h2>
            <div className="space-y-4">
              {program.faqs.map((faq) => (
                <details key={faq.question} className="group border border-slate-200 rounded-2xl p-6">
                  <summary className="cursor-pointer text-lg font-semibold text-slate-800 flex items-center justify-between gap-4">
                    {faq.question}
                    <span className="text-green-600 text-2xl group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-3 text-slate-600 leading-relaxed text-sm">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="py-16 bg-emerald-600">
        <div className="container mx-auto px-6 text-center text-white max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">Wir holen das Maximum aus Ihrem Fördermix</h2>
          <p className="text-lg text-emerald-100 mb-8">
            Von der Machbarkeitsanalyse über die Förderstrategie bis zur Schlüsselübergabe – ZOE Solar begleitet Ihr Projekt
            durch jede Prüfungsinstanz und sorgt für eine reibungslose Umsetzung.
          </p>
          <button
            onClick={() => document.dispatchEvent(new CustomEvent('open-chat'))}
            className="bg-white text-emerald-700 font-semibold py-3 px-8 rounded-xl shadow-lg hover:bg-emerald-50 transition"
          >
            Kostenlose Erstberatung sichern
          </button>
        </div>
      </section>
    </div>
  );
};

export default FundingProgramDetailPage;

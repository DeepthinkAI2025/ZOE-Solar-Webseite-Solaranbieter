import React from 'react';

interface ProdukteHeroProps {
  onOpenChat?: () => void;
}

const CheckIcon = () => (
  <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ProdukteHero: React.FC<ProdukteHeroProps> = ({ onOpenChat }) => {
  const handleOpenChat = () => {
    if (onOpenChat) {
      onOpenChat();
    } else {
      document.dispatchEvent(new CustomEvent('open-chat'));
    }
  };

  return (
    <section className="produkte-hero bg-slate-50 overflow-hidden" aria-label="Produkte Hero Bereich" role="banner">
      <div className="container mx-auto px-6 py-20 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tighter animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
              Technologie, die überzeugt.
            </h1>
            <h2 className="text-5xl md:text-6xl font-extrabold text-green-600 tracking-tighter mt-2 animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
              Komponenten, die performen.
            </h2>
            <p id="hero-description" className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
              Wir sind herstellerunabhängig. Das bedeutet für Sie: Nur die besten, effizientesten und langlebigsten Produkte des Weltmarkts für Ihre maximale Rendite.
            </p>
            <div className="mt-8 animate-slide-in-up" style={{ animationDelay: '0.7s' }}>
              <ul className="space-y-3 text-left max-w-md mx-auto lg:mx-0" aria-describedby="hero-description">
                <li className="flex items-start">
                  <CheckIcon />
                  <span><strong>Herstellerunabhängige Auswahl:</strong> Nur die beste Technik für Ihre Ziele.</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon />
                  <span><strong>Geprüfte Tier-1-Komponenten:</strong> Wir setzen auf Langlebigkeit und höchste Garantien.</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon />
                  <span><strong>Maximale Performance:</strong> Perfekt aufeinander abgestimmte Systeme für höchste Erträge.</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slide-in-up" style={{ animationDelay: '0.9s' }}>
              <a href="#product-catalog" className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-lg cta-button-glow" aria-label="Zum Produktkatalog navigieren">
                Zum Produktkatalog
              </a>
              <button onClick={handleOpenChat} className="w-full sm:w-auto bg-white text-slate-700 font-bold py-3 px-8 rounded-lg hover:bg-slate-200 transition-colors border border-slate-300 shadow-md" aria-label="KI-Berater starten">
                KI-Berater starten
              </button>
            </div>
          </div>

          {/* Right Column: Image Collage */}
          <div className="hidden lg:block relative h-96">
            <div className="absolute inset-0">
              <div className="floating-hero-img img-1">
                <img src="https://images.unsplash.com/photo-1628453483958-c8a709249a26?q=80&w=400&auto=format&fit=crop" alt="Hochwertiges Solarmodul für maximale Energieeffizienz" className="w-full h-full object-cover" loading="lazy" />
                <div className="floating-hero-img-label">Solarmodul</div>
              </div>
              <div className="floating-hero-img img-2">
                <img src="https://images.unsplash.com/photo-1632930603299-8a93917c9171?q=80&w=400&auto=format&fit=crop" alt="Moderner Wechselrichter für optimale Stromumwandlung" className="w-full h-full object-cover" loading="lazy" />
                <div className="floating-hero-img-label">Wechselrichter</div>
              </div>
              <div className="floating-hero-img img-3">
                <img src="https://images.unsplash.com/photo-1633711124238-52260c6f5d81?q=80&w=400&auto=format&fit=crop" alt="Leistungsstarker Batteriespeicher für Energiespeicherung" className="w-full h-full object-cover" loading="lazy" />
                <div className="floating-hero-img-label">Batteriespeicher</div>
              </div>
              <div className="floating-hero-img img-4">
                <img src="https://images.unsplash.com/photo-1675883196884-35805ac51268?q=80&w=400&auto=format&fit=crop" alt="Elektrische Ladestation für Elektrofahrzeuge" className="w-full h-full object-cover" loading="lazy" />
                <div className="floating-hero-img-label">Ladestation</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProdukteHero;
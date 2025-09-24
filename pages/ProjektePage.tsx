import React from 'react';
import { Page } from '../types';
import AnimatedSection from '../components/AnimatedSection';

interface ProjektePageProps {
  setPage: (page: Page) => void;
}

const projects = [
  // Dachanlagen
  {
    title: 'Logistikzentrum Berlin',
    category: 'Dachanlage',
    stats: '1.2 MWp Leistung | ca. 250.000 € Ersparnis/Jahr',
    imageUrl: 'https://images.unsplash.com/photo-1599454100913-b903e12a4459?q=80&w=1932&auto=format&fit=crop',
    description: 'Für dieses Logistikzentrum mit 24/7-Betrieb war die Senkung der enormen Energiekosten entscheidend. Die von uns installierte 1.2 MWp-Anlage deckt nicht nur einen Großteil des Eigenbedarfs für Kühlung und Sortieranlagen, sondern generiert durch die Einspeisung von Überschüssen zusätzliche Einnahmen. Eine Investition, die sich in weniger als 6 Jahren amortisiert.'
  },
  {
    title: 'Produktionshalle Potsdam',
    category: 'Dachanlage & Speicher',
    stats: '1.5 MWp Leistung | ca. 330.000 € Ersparnis/Jahr',
    imageUrl: 'https://images.unsplash.com/photo-1558221639-130a584346a8?q=80&w=2070&auto=format&fit=crop',
    description: 'Eine hochmoderne Produktionshalle wurde mit einer leistungsstarken PV-Anlage und einem angeschlossenen Batteriespeicher ausgestattet. Diese Kombination sichert die energieintensive Fertigung gegen Strompreisschwankungen ab, kappt teure Lastspitzen und maximiert die Rendite durch einen Eigenverbrauchsanteil von über 65%.'
  },
  {
    title: 'Kühlhaus in Spreewald',
    category: 'Dachanlage',
    stats: '950 kWp Leistung | ca. 240.000 € Ersparnis/Jahr',
    imageUrl: 'https://images.unsplash.com/photo-1665431168114-7225b2e04e7b?q=80&w=2070&auto=format&fit=crop',
    description: 'Die Kühlung von Lebensmitteln ist extrem energieintensiv. Unsere Dachanlage versorgt die Kühlhäuser dieses Produzenten nun mit kostengünstigem Solarstrom. Das Ergebnis: eine massive Reduzierung der Betriebskosten und eine nachhaltige Stärkung der Wettbewerbsfähigkeit.'
  },
  // Freiflächenanlagen
  {
    title: 'Agrarbetrieb Brandenburg',
    category: 'Freiflächenanlage',
    stats: '800 kWp Leistung | ca. 120.000 € Einnahmen/Jahr',
    imageUrl: 'https://images.unsplash.com/photo-1621243804936-775306a8f2e3?q=80&w=2070&auto=format&fit=crop',
    description: 'Ein landwirtschaftlicher Großbetrieb nutzt eine Konversionsfläche zur Stromerzeugung. Die Anlage diversifiziert die Einnahmequellen des Betriebs und schafft eine wetterunabhängige, stabile Rendite durch die Direktvermarktung des erzeugten Stroms.'
  },
  {
    title: 'Solarpark Lausitz',
    category: 'Freiflächenanlage',
    stats: '5 MWp Leistung | ca. 475.000 € Einnahmen/Jahr',
    imageUrl: 'https://images.unsplash.com/photo-1508235281165-a88981b2484a?q=80&w=2071&auto=format&fit=crop',
    description: 'Auf einer ehemaligen Tagebaufläche entstand einer der größten Solarparks der Region. Dieses Projekt ist ein Paradebeispiel für gelungenen Strukturwandel: Es revitalisiert ungenutztes Land und generiert durch den Verkauf von sauberem Strom erhebliche, langfristige Einnahmen.'
  },
    {
    title: 'Energiepark Mecklenburg',
    category: 'Freiflächenanlage',
    stats: '2.5 MWp Leistung | ca. 240.000 € Einnahmen/Jahr',
    imageUrl: 'https://images.unsplash.com/photo-1596371801258-a833216b251a?q=80&w=2070&auto=format&fit=crop',
    description: 'In Zusammenarbeit mit der Gemeinde wurde dieser Bürger-Solarpark realisiert. Er versorgt nicht nur die Region mit sauberem Strom, sondern ermöglicht den Bürgern auch eine direkte finanzielle Beteiligung an der Energiewende, was die lokale Akzeptanz und Wertschöpfung stärkt.'
  },
  // Solar-Carports
  {
    title: 'Solar-Carport für Autohaus',
    category: 'Solar-Carport',
    stats: '300 kWp Leistung | ca. 72.000 € Ersparnis/Jahr',
    imageUrl: 'https://images.unsplash.com/photo-1666209593430-349f7a778b7b?q=80&w=1974&auto=format&fit=crop',
    description: 'Die Parkflächen dieses Autohauses wurden mit Solar-Carports überdacht. Diese versorgen die hauseigenen Ladesäulen für Elektrofahrzeuge sowie das Gebäude mit Strom. Ein doppelter Gewinn: massive Kostensenkung und ein modernes, nachhaltiges Image, das Kunden anzieht.'
  },
  {
    title: 'Mitarbeiterparkplatz Siemens Campus',
    category: 'Solar-Carport',
    stats: '750 kWp Leistung | ca. 175.000 € Ersparnis/Jahr',
    imageUrl: 'https://images.unsplash.com/photo-1695425251109-c454e1a17686?q=80&w=2070&auto=format&fit=crop',
    description: 'Ein großer Mitarbeiterparkplatz wurde intelligent umfunktioniert. Die Solar-Carports spenden nicht nur Schatten, sondern decken einen erheblichen Teil des Campus-Strombedarfs und ermöglichen das kostengünstige Laden von Mitarbeiter-E-Fahrzeugen – ein wertvoller Benefit.'
  },
  {
    title: 'Parkhaus am Flughafen BER',
    category: 'Solar-Carport',
    stats: '1.1 MWp Leistung | ca. 290.000 € Ersparnis/Jahr',
    imageUrl: 'https://images.unsplash.com/photo-1647551003669-1e35dd05b63a?q=80&w=2070&auto=format&fit=crop',
    description: 'Das oberste Deck eines Parkhauses am Flughafen BER wurde mit einer PV-Anlage überdacht. Der erzeugte Strom wird direkt für die energieintensive Beleuchtung und die E-Ladeinfrastruktur des Parkhauses genutzt, was die Betriebskosten signifikant reduziert.'
  },
  // Ladestationen
  {
    title: 'HPC-Ladepark an der A9',
    category: 'Ladestationen',
    stats: '16 HPC-Ladepunkte | Fokus: Kundenfrequenz & Service',
    imageUrl: 'https://images.unsplash.com/photo-1675883196884-35805ac51268?q=80&w=1974&auto=format&fit=crop',
    description: 'Die Errichtung dieses High-Power-Charging (HPC) Ladeparks an einem wichtigen Verkehrsknotenpunkt positioniert den Betreiber als Vorreiter der E-Mobilität. Das moderne Ladeangebot zieht neue, kaufkräftige Kundengruppen an und erhöht die Verweildauer.'
  },
  {
    title: 'Ladeinfrastruktur für Wohnquartier',
    category: 'Ladestationen',
    stats: '40 AC-Ladepunkte | Fokus: Immobilienwert & Komfort',
    imageUrl: 'https://images.unsplash.com/photo-1633333393122-2c63e2f5b80a?q=80&w=2070&auto=format&fit=crop',
    description: 'Die Ausstattung eines Neubau-Wohnquartiers mit flächendeckender AC-Ladeinfrastruktur ist heute ein entscheidendes Verkaufs- und Vermietungsargument. Es steigert den Immobilienwert, erhöht den Wohnkomfort und macht das Quartier zukunftssicher.'
  },
  {
    title: 'Betriebshof-Elektrifizierung (BVG)',
    category: 'Ladestationen',
    stats: '32 DC-Ladepunkte | Fokus: Betriebskostensenkung',
    imageUrl: 'https://images.unsplash.com/photo-1632833252069-e325239a7a6c?q=80&w=2070&auto=format&fit=crop',
    description: 'Durch die Installation einer maßgeschneiderten Ladeinfrastruktur für die E-Bus-Flotte werden die "Treibstoffkosten" massiv gesenkt. Gesteuert über ein intelligentes Lastmanagement, wird die vorhandene Netzkapazität optimal ausgenutzt und teure Lastspitzen vermieden.'
  },
  // Balkonkraftwerke
  {
    title: 'Wohnanlage Prenzlauer Berg',
    category: 'Balkonkraftwerke',
    stats: '800 Wp pro Einheit | Gewinn: Geringere Nebenkosten',
    imageUrl: 'https://images.unsplash.com/photo-1690553128039-382901700b0e?q=80&w=1964&auto=format&fit=crop',
    description: 'Ein Gemeinschaftsprojekt, das sich für alle lohnt: Die Installation von über 50 Steckersolargeräten senkt die Strom-Grundlast und damit die Nebenkostenabrechnung für jeden teilnehmenden Mieter. Ein einfacher und effektiver Beitrag zum Klimaschutz mit direktem finanziellem Vorteil.'
  },
  {
    title: 'Modernes Stadthaus Charlottenburg',
    category: 'Balkonkraftwerke',
    stats: '600 Wp mit Speicher | Gewinn: Maximale Autarkie',
    imageUrl: 'https://images.unsplash.com/photo-1684572993881-c423bb0b40a3?q=80&w=1974&auto=format&fit=crop',
    description: 'Ästhetisch und effizient: Dieses Balkonkraftwerk mit integriertem Mini-Speicher ermöglicht es dem Eigentümer, selbst erzeugten Solarstrom auch nach Sonnenuntergang zu nutzen. Das steigert die Unabhängigkeit und maximiert die Ersparnis auf der Stromrechnung.'
  },
  {
    title: 'Genossenschaftsbau Kreuzberg',
    category: 'Balkonkraftwerke',
    stats: 'Mieterstrom-Modell | Gewinn: Gemeinschaft & Teilhabe',
    imageUrl: 'https://images.unsplash.com/photo-1687891244439-93a84b06bd9c?q=80&w=1974&auto=format&fit=crop',
    description: 'Dieses Mieterstrom-Konzept ermöglicht es allen Bewohnern einer Genossenschaft, direkt von günstigem Solarstrom zu profitieren. Es stärkt den Gemeinschaftsgedanken, fördert die Nachhaltigkeit im Quartier und macht die Energiewende für jeden zugänglich.'
  }
];

const ProjekteHero: React.FC<{ onCtaClick: (anchor?: string) => void }> = ({ onCtaClick }) => {
    return (
        <section className="projekte-hero bg-slate-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 py-20 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column: Text Content */}
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tighter animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                            Aus Visionen werden Kraftwerke.
                        </h1>
                        <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
                           Jedes Projekt ist ein Beweis für unsere Expertise und ein Schritt in eine grünere Zukunft. Entdecken Sie eine Auswahl unserer erfolgreich umgesetzten Anlagen und lassen Sie sich inspirieren.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slide-in-up" style={{ animationDelay: '0.8s' }}>
                            <a onClick={() => onCtaClick('projekte-liste')} className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-lg cta-button-glow cursor-pointer">
                                Alle Projekte ansehen
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Image Collage */}
                    <div className="hidden lg:block relative h-96">
                        <div className="absolute inset-0">
                            <div className="floating-hero-img img-1">
                                <img src={projects[0].imageUrl} alt={projects[0].category} className="w-full h-full object-cover" />
                                <div className="floating-hero-img-label">{projects[0].category}</div>
                            </div>
                             <div className="floating-hero-img img-2">
                                <img src={projects[3].imageUrl} alt={projects[3].category} className="w-full h-full object-cover" />
                                <div className="floating-hero-img-label">{projects[3].category}</div>
                            </div>
                             <div className="floating-hero-img img-3">
                                <img src={projects[6].imageUrl} alt={projects[6].category} className="w-full h-full object-cover" />
                                <div className="floating-hero-img-label">{projects[6].category}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


const ProjektePage: React.FC<ProjektePageProps> = ({ setPage }) => {

    const handleHeroCta = (anchor?: string) => {
      if (anchor) {
        document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
      }
    };

    return (
        <div className="bg-slate-50">
            <ProjekteHero onCtaClick={handleHeroCta} />
            <AnimatedSection>
                <div id="projekte-liste" className="py-20 scroll-mt-24">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {projects.map((project, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden border border-slate-200 flex flex-col">
                                    <img 
                                        src={project.imageUrl}
                                        alt={`Projekt: ${project.title}`}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-56 object-cover"
                                    />
                                    <div className="p-6 flex flex-col flex-grow">
                                        <span className="text-sm font-semibold text-green-600 mb-1">{project.category}</span>
                                        <h3 className="text-xl font-bold text-slate-800">{project.title}</h3>
                                        <p className="text-slate-500 font-medium my-2">{project.stats}</p>
                                        <p className="text-slate-600 text-sm mt-2 flex-grow">{project.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </AnimatedSection>
        </div>
    );
};

export default ProjektePage;
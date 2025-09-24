import React, { useState, useMemo } from 'react';

const technologyData = [
  {
    id: 'modules',
    title: 'Hochleistungsmodule',
    icon: 'modules',
    content: 'Wir setzen auf die neueste Generation von Solarmodulen, einschließlich bifazialer und HJT/TOPCon-Zellen-Technologie, um auch bei diffusem Licht maximale Energieerträge zu gewährleisten. Langlebigkeit und branchenführende Garantien sind für uns Standard.',
    features: ['Bifaziale Technologie für beidseitige Energiegewinnung', 'Höchste Wirkungsgrade auch bei Schwachlicht', 'Robuste Bauweise für extreme Wetterbedingungen', '25+ Jahre Leistungsgarantie'],
    logos: [
        { name: 'Meyer Burger', src: '/assets/logos/meyer-burger.png' },
        { name: 'Q-Cells', src: '/assets/logos/q-cells.png' },
        { name: 'Jinko Solar', src: '/assets/logos/jinko-solar.png' },
        { name: 'JA Solar', src: '/assets/logos/ja-solar.png' },
        { name: 'LONGi Solar', src: '/assets/logos/longi-solar.png' },
        { name: 'Trina Solar', src: '/assets/logos/trina-solar.png' },
    ]
  },
  {
    id: 'inverters',
    title: 'Intelligente Wechselrichter',
    icon: 'inverters',
    content: 'Das Gehirn Ihrer Anlage. Wir verwenden ausschließlich smarte Wechselrichter von führenden Herstellern, die eine optimale Umwandlung des Gleichstroms ermöglichen und ein detailliertes Monitoring in Echtzeit bieten.',
    features: ['Echtzeit-Monitoring auf Modulebene', 'Intelligentes Schattenmanagement', 'Schnittstellen für Energiemanagementsysteme', 'Vorbereitet für zukünftige Netzdienstleistungen'],
     logos: [
        { name: 'SMA', src: '/assets/logos/sma.png' },
        { name: 'Fronius', src: '/assets/logos/fronius.png' },
        { name: 'SolarEdge', src: '/assets/logos/solaredge.png' },
        { name: 'Huawei', src: '/assets/logos/huawei.png' },
        { name: 'GoodWe', src: '/assets/logos/goodwe.png' },
        { name: 'Enphase', src: '/assets/logos/enphase.png' },
    ]
  },
  {
    id: 'storage',
    title: 'Skalierbare Speichersysteme',
    icon: 'storage',
    content: 'Machen Sie sich unabhängig von Strompreisschwankungen. Unsere modularen Batteriespeichersysteme speichern überschüssigen Solarstrom für die spätere Nutzung, kappen teure Lastspitzen und sichern Ihre Energieversorgung ab.',
    features: ['Modulare Bauweise für flexible Erweiterung', 'Lastspitzenkappung (Peak Shaving)', 'Notstrom- und Inselnetzfähigkeit', 'Langlebige Lithium-Eisenphosphat-Technologie (LFP)'],
     logos: [
        { name: 'BYD', src: '/assets/logos/byd.png' },
        { name: 'LG Energy Solution', src: '/assets/logos/lg.png' },
        { name: 'Fox ESS', src: '/assets/logos/fox-ess.png' },
        { name: 'Victron Energy', src: '/assets/logos/victron.png' },
        { name: 'sonnen', src: '/assets/logos/sonnen.png' },
        { name: 'Deye', src: '/assets/logos/deye.png' },
    ]
  },
  {
    id: 'chargers',
    title: 'Smarte Ladestationen',
    icon: 'chargers',
    content: 'Machen Sie Ihren Standort zum E-Mobility-Hub. Wir bieten skalierbare Ladelösungen vom einzelnen Wall Connector bis zum High-Power-Charging (HPC) Ladepark. Intelligent vernetzt mit Ihrer PV-Anlage laden Sie kostengünstig und CO₂-neutral.',
    features: ['AC- und DC-Ladelösungen (bis 350 kW)', 'Intelligentes Lastmanagement zur Vermeidung von Netzspitzen', 'Backend-Anbindung für Monitoring & Abrechnung', 'Solar-optimiertes Laden für maximalen Eigenverbrauch'],
    logos: [
        { name: 'Wallbox', src: '/assets/logos/wallbox.png' },
        { name: 'ABB', src: '/assets/logos/abb.png' },
        { name: 'Mennekes', src: '/assets/logos/mennekes.png' },
        { name: 'KEBA', src: '/assets/logos/keba.png' },
        { name: 'Alpitronic', src: '/assets/logos/alpitronic.png' },
        { name: 'Hypercharger', src: '/assets/logos/hypercharger.png' },
    ]
  }
];

type SystemComponent = 'modules' | 'inverters' | 'storage' | 'chargers';

const InfoPanel: React.FC<{ data: typeof technologyData[0] | undefined }> = ({ data }) => {
    if (!data) return null;

    return (
        <div className="bg-slate-800/60 p-8 rounded-2xl border border-slate-700/50 h-full flex flex-col animate-fade-in">
            <h3 className="text-3xl font-bold text-green-400 mb-4">{data.title}</h3>
            <p className="text-slate-300 mb-6 leading-relaxed flex-grow">{data.content}</p>
            <ul className="space-y-4 mb-8">
                {data.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                        <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span className="text-slate-200">{feature}</span>
                    </li>
                ))}
            </ul>
            <div className="pt-6 border-t border-slate-700 mt-auto">
                <h4 className="text-slate-300 font-semibold mb-4 text-sm uppercase tracking-wider">Auswahl unserer Premium-Partner:</h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-center">
                    {data.logos.map(logo => (
                        <div key={logo.name} title={logo.name} className="flex justify-center items-center h-12">
                            <img src={logo.src} alt={`${logo.name} logo`} className="max-h-8 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Technology: React.FC = () => {
    const [activeComponent, setActiveComponent] = useState<SystemComponent>('modules');
    const activeData = useMemo(() => technologyData.find(item => item.id === activeComponent), [activeComponent]);

    const hotspotClass = "hotspot";
    const activeHotspotClass = "active";

    return (
        <section id="technologie" className="py-20 text-white technology-bg">
            <div className="container max-w-7xl mx-auto px-6">
                <div className="text-center mb-16 max-w-4xl mx-auto">
                    <p className="font-bold text-green-400 uppercase tracking-wider">Unser Qualitätsversprechen</p>
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mt-2">Das Energiefluss-Cockpit.</h2>
                    <p className="text-lg text-slate-300 mt-4">
                        Unsere Unabhängigkeit ist Ihr Vorteil. Entdecken Sie die Komponenten, die wir zu einem perfekt abgestimmten System für maximale Rendite kombinieren. Klicken Sie auf ein Bauteil, um mehr zu erfahren.
                    </p>
                </div>
                
                <div className="grid lg:grid-cols-5 gap-12 items-center">
                    {/* Interactive SVG */}
                    <div className="lg:col-span-3">
                       <svg viewBox="0 0 800 500" className="w-full h-auto">
                            <defs>
                                <linearGradient id="componentGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#283549" />
                                    <stop offset="100%" stopColor="#1e293b" />
                                </linearGradient>
                                
                                <radialGradient id="particleGradient">
                                    <stop offset="0%" stop-color="#bbf7d0" />
                                    <stop offset="100%" stop-color="#22c55e" stop-opacity="0" />
                                </radialGradient>
                                <filter id="particle-glow">
                                    <feGaussianBlur stdDeviation="1.5" />
                                </filter>
                                <circle id="particle" r="5" fill="url(#particleGradient)" filter="url(#particle-glow)"></circle>
                                
                                {/* Animation Paths with curves */}
                                <path id="flow1" d="M 150 75 Q 155 110 150 145" fill="none" />
                                <path id="flow2" d="M 250 200 C 300 200, 320 230, 350 230" fill="none" />
                                <path id="flow3" d="M 450 250 Q 500 255 550 250" fill="none" />
                                <path id="flow4" d="M 600 220 Q 590 200 600 180" fill="none" />
                                <path id="flow5" d="M 600 280 Q 610 300 600 320" fill="none" />
                                <path id="flow6" d="M 650 350 Q 675 375 700 400" fill="none" />
                                <path id="flow7" d="M 600 380 Q 625 405 650 430" fill="none" />
                            </defs>

                            <style>{`
                                .component-rect { fill: url(#componentGrad); stroke: #475569; stroke-width: 1.5; transition: filter 0.3s ease; }
                                .component-text { fill: #cbd5e1; font-size: 18px; font-weight: bold; font-family: sans-serif; pointer-events: none; }
                                .sun { animation: sun-pulse 4s infinite ease-in-out; transform-origin: center; }
                                .module-glow { animation: module-glow-pulse 3s infinite ease-in-out; }
                                .hotspot.active .component-rect, .hotspot:hover .component-rect { filter: drop-shadow(0 0 15px #22c55e); }
                                @keyframes sun-pulse {
                                    0% { transform: scale(1); filter: drop-shadow(0 0 5px #fde047); }
                                    50% { transform: scale(1.03); filter: drop-shadow(0 0 15px #fde047); }
                                    100% { transform: scale(1); filter: drop-shadow(0 0 5px #fde047); }
                                }
                                @keyframes module-glow-pulse {
                                    0% { filter: drop-shadow(0 0 8px #16a34a); }
                                    50% { filter: drop-shadow(0 0 20px #16a34a); }
                                    100% { filter: drop-shadow(0 0 8px #16a34a); }
                                }
                                .hotspot { cursor: pointer; transition: transform 0.2s ease-in-out; }
                                .hotspot:hover { transform: scale(1.05); }
                                .flow-path { stroke: #166534; stroke-width: 1.5; fill: none; }
                            `}</style>

                            {/* Base Flow Paths */}
                            <use href="#flow1" className="flow-path"/>
                            <use href="#flow2" className="flow-path"/>
                            <use href="#flow3" className="flow-path"/>
                            <use href="#flow4" className="flow-path"/>
                            <use href="#flow5" className="flow-path"/>
                            <use href="#flow6" className="flow-path"/>
                            <use href="#flow7" className="flow-path"/>

                            {/* Animated Particles */}
                            <use href="#particle" opacity="0"><animate attributeName="opacity" values="0;1;0" dur="2.5s" begin="0s" repeatCount="indefinite"/><animateMotion dur="2.5s" begin="0s" repeatCount="indefinite"><mpath href="#flow1"/></animateMotion></use>
                            <use href="#particle" opacity="0"><animate attributeName="opacity" values="0;1;0" dur="2.5s" begin="0.6s" repeatCount="indefinite"/><animateMotion dur="2.5s" begin="0.6s" repeatCount="indefinite"><mpath href="#flow1"/></animateMotion></use>
                            <use href="#particle" opacity="0"><animate attributeName="opacity" values="0;1;0" dur="2.5s" begin="1.2s" repeatCount="indefinite"/><animateMotion dur="2.5s" begin="1.2s" repeatCount="indefinite"><mpath href="#flow1"/></animateMotion></use>
                            <use href="#particle" opacity="0"><animate attributeName="opacity" values="0;1;0" dur="2.5s" begin="1.8s" repeatCount="indefinite"/><animateMotion dur="2.5s" begin="1.8s" repeatCount="indefinite"><mpath href="#flow1"/></animateMotion></use>

                            <use href="#particle" opacity="0"><animate attributeName="opacity" values="0;1;0" dur="3s" begin="0.2s" repeatCount="indefinite"/><animateMotion dur="3s" begin="0.2s" repeatCount="indefinite"><mpath href="#flow2"/></animateMotion></use>
                            <use href="#particle" opacity="0"><animate attributeName="opacity" values="0;1;0" dur="3s" begin="1.2s" repeatCount="indefinite"/><animateMotion dur="3s" begin="1.2s" repeatCount="indefinite"><mpath href="#flow2"/></animateMotion></use>
                            <use href="#particle" opacity="0"><animate attributeName="opacity" values="0;1;0" dur="3s" begin="2.2s" repeatCount="indefinite"/><animateMotion dur="3s" begin="2.2s" repeatCount="indefinite"><mpath href="#flow2"/></animateMotion></use>

                            <use href="#particle" opacity="0"><animate attributeName="opacity" values="0;1;0" dur="2s" begin="0.4s" repeatCount="indefinite"/><animateMotion dur="2s" begin="0.4s" repeatCount="indefinite"><mpath href="#flow3"/></animateMotion></use>
                            <use href="#particle" opacity="0"><animate attributeName="opacity" values="0;1;0" dur="2s" begin="1.4s" repeatCount="indefinite"/><animateMotion dur="2s" begin="1.4s" repeatCount="indefinite"><mpath href="#flow3"/></animateMotion></use>

                            <use href="#particle" opacity="0"><animate attributeName="opacity" values="0;1;0" dur="1.8s" begin="0.6s" repeatCount="indefinite"/><animateMotion dur="1.8s" begin="0.6s" repeatCount="indefinite"><mpath href="#flow4"/></animateMotion></use>
                            <use href="#particle" opacity="0"><animate attributeName="opacity" values="0;1;0" dur="1.8s" begin="1.5s" repeatCount="indefinite"/><animateMotion dur="1.8s" begin="1.5s" repeatCount="indefinite"><mpath href="#flow4"/></animateMotion></use>

                            <use href="#particle" opacity="0"><animate attributeName="opacity" values="0;1;0" dur="1.8s" begin="0.8s" repeatCount="indefinite"/><animateMotion dur="1.8s" begin="0.8s" repeatCount="indefinite"><mpath href="#flow5"/></animateMotion></use>
                            <use href="#particle" opacity="0"><animate attributeName="opacity" values="0;1;0" dur="1.8s" begin="1.7s" repeatCount="indefinite"/><animateMotion dur="1.8s" begin="1.7s" repeatCount="indefinite"><mpath href="#flow5"/></animateMotion></use>

                            <use href="#particle" opacity="0"><animate attributeName="opacity" values="0;1;0" dur="2.2s" begin="1s" repeatCount="indefinite"/><animateMotion dur="2.2s" begin="1s" repeatCount="indefinite"><mpath href="#flow6"/></animateMotion></use>
                            <use href="#particle" opacity="0"><animate attributeName="opacity" values="0;1;0" dur="2.2s" begin="1.5s" repeatCount="indefinite"/><animateMotion dur="2.2s" begin="1.5s" repeatCount="indefinite"><mpath href="#flow7"/></animateMotion></use>

                            
                            {/* Sun */}
                            <g className="sun"><circle cx="150" cy="50" r="25" fill="#facc15" /></g>
                            
                            {/* Components */}
                            <g onClick={() => setActiveComponent('modules')} className={`${hotspotClass} ${activeComponent === 'modules' ? activeHotspotClass : ''}`}>
                                <rect x="50" y="150" width="200" height="100" rx="15" className="component-rect module-glow" />
                                <text x="150" y="205" textAnchor="middle" className="component-text">Module</text>
                            </g>
                            
                            <g onClick={() => setActiveComponent('inverters')} className={`${hotspotClass} ${activeComponent === 'inverters' ? activeHotspotClass : ''}`}>
                                <rect x="350" y="220" width="100" height="60" rx="10" className="component-rect" />
                                <text x="400" y="255" textAnchor="middle" className="component-text">DC/AC</text>
                            </g>

                            <g>
                                <rect x="550" y="120" width="100" height="60" rx="10" className="component-rect" />
                                <text x="600" y="155" textAnchor="middle" fill="#94a3b8" fontSize="16">Verbraucher</text>
                            </g>

                            <g onClick={() => setActiveComponent('storage')} className={`${hotspotClass} ${activeComponent === 'storage' ? activeHotspotClass : ''}`}>
                                <rect x="550" y="220" width="100" height="60" rx="10" className="component-rect" />
                                <text x="600" y="255" textAnchor="middle" className="component-text">Speicher</text>
                            </g>

                            <g onClick={() => setActiveComponent('chargers')} className={`${hotspotClass} ${activeComponent === 'chargers' ? activeHotspotClass : ''}`}>
                                <rect x="550" y="320" width="100" height="60" rx="10" className="component-rect" />
                                <text x="600" y="355" textAnchor="middle" className="component-text" fontSize="16">Ladestation</text>
                            </g>

                            <g>
                                <text x="725" y="425" fill="#94a3b8" fontSize="16">Netz</text>
                            </g>
                        </svg>
                    </div>

                    {/* Info Panel */}
                    <div className="lg:col-span-2">
                        <InfoPanel key={activeComponent} data={activeData} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Technology;
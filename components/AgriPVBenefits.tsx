import React, { useState, useMemo, useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei';
import { Box3, Vector3, PerspectiveCamera } from 'three';
import type { Group, Mesh, MeshBasicMaterial } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { Page } from '../types';

// Error Boundary for 3D Canvas
interface AgriPVBenefitsProps {
  customerType: 'private' | 'business';
  setPage: (page: Page) => void;
}

class CanvasErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('3D Canvas Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-[350px] rounded-2xl overflow-hidden relative shadow-inner bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">3D-Visualisierung nicht verfügbar</h3>
            <p className="text-gray-600 text-sm">Die 3D-Ansicht konnte nicht geladen werden. Bitte versuchen Sie die Seite neu zu laden.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const agriPVData = {
  private: {
    badge: 'Speziell für Landwirte',
    title: 'Agri-PV: Die doppelte Ernte.',
    subtitle: 'Maximieren Sie den Wert Ihres Landes durch die Kombination von Energieerzeugung und nachhaltigem Anbau.',
    description: 'Nutzen Sie Ihre landwirtschaftlichen Flächen optimal: Ernten Sie Solarstrom und landwirtschaftliche Produkte gleichzeitig. Unsere Agri-PV-Systeme schützen Ihre Kulturen vor extremen Wetterbedingungen.',
    benefits: [
      {
        id: 'dual-use',
        title: 'Duale Flächennutzung',
        icon: 'dual-use',
        content: 'Kombinieren Sie Ackerbau und Energieerzeugung ohne Flächenverlust. Unsere erhöhten Montagesysteme ermöglichen den Anbau von Kulturpflanzen unter den Modulen und maximieren so die Flächeneffizienz.',
        features: ['Optimale Lichtdurchlässigkeit für Pflanzenwachstum', 'Schutz vor Hagel und intensiver Sonneneinstrahlung', 'Erhöhte Montage für mechanisierte Bewirtschaftung', 'Steigerung der Gesamterträge um bis zu 30%'],
      },
      {
        id: 'weather',
        title: 'Ernteschutz & Wassereinsparung',
        icon: 'weather',
        content: 'Die Module schützen empfindliche Kulturen vor Hagel und Sonnenbrand. Gleichzeitig reduzieren sie die Verdunstung und sparen wertvolles Wasser für die Bewässerung.',
        features: ['Hagelschutz für empfindliche Kulturen', 'Reduzierte Verdunstung um 20-30%', 'Optimale Lichtverhältnisse für Pflanzenwachstum', 'Schutz vor extremen Wetterereignissen'],
      },
      {
        id: 'revenue',
        title: 'Stabile Einnahmequelle',
        icon: 'revenue',
        content: 'Erwirtschaften Sie planbare Erträge durch den Stromverkauf. Agri-PV kombiniert landwirtschaftliche Einnahmen mit stabilen Energieerlösen für maximale Wirtschaftlichkeit.',
        features: ['EEG-Vergütung für 20+ Jahre garantiert', 'Kombination aus Agrar- und Energieerträgen', 'Risikominimierung durch diversifizierte Einkommensquellen', 'Steuerliche Vorteile für Landwirte'],
      }
    ],
    cta: 'Mehr über Agri-PV erfahren',
  },
  business: {
    badge: 'Für Agrarunternehmen',
    title: 'Agri-PV: Industrielle Landwirtschaft der Zukunft',
    subtitle: 'Skalierbare Agri-Photovoltaik-Lösungen für moderne Agrarbetriebe.',
    description: 'Transformieren Sie Ihre landwirtschaftlichen Flächen in profitable Dual-Use-Systeme. Unsere Agri-PV-Anlagen sind speziell für den gewerblichen Einsatz konzipiert.',
    benefits: [
      {
        id: 'efficiency',
        title: 'Maximale Energieeffizienz',
        icon: 'efficiency',
        content: 'Höchste Modulleistung pro Quadratmeter durch optimierte Anordnung. Unsere Systeme sind für den kommerziellen Dauerbetrieb ausgelegt und maximieren die Energieausbeute.',
        features: ['Bifaziale Module für 360° Energiegewinnung', 'Intelligente Tracker-Systeme für optimale Ausrichtung', 'Höchste Wirkungsgrade auch bei Schwachlicht', 'Skalierbare Leistung bis 5 MWp pro Anlage'],
      },
      {
        id: 'growth',
        title: 'Skalierbare Erweiterung',
        icon: 'growth',
        content: 'Modulare Systeme für Flächen von 1 bis 100+ Hektar. Planen Sie Ihre Expansion mit zukunftssicheren Technologien und flexiblen Finanzierungsmodellen.',
        features: ['Modulare Bauweise für flexible Erweiterung', 'Flächen von 1 ha bis 100+ ha möglich', 'Zukunftssichere Technologie für 25+ Jahre', 'Flexible Finanzierungsmodelle'],
      },
      {
        id: 'revenue',
        title: 'Mehrfache Erlösströme',
        icon: 'revenue',
        content: 'Kombinieren Sie EEG-Vergütung und landwirtschaftliche Erträge. Unsere Agri-PV-Systeme schaffen diversifizierte Einkommensquellen für maximale Rentabilität.',
        features: ['EEG-Vergütung + Direktvermarktung möglich', 'Landwirtschaftliche Erträge erhalten', 'CO₂-Zertifikate und weitere Erlösquellen', 'Return on Investment von 8-12% p.a.'],
      }
    ],
    cta: 'Agri-PV für Ihr Unternehmen planen',
  }
};

type AgriPVComponent = 'dual-use' | 'weather' | 'revenue' | 'efficiency' | 'growth';

const componentMetrics: Record<AgriPVComponent, { label: string; value: string; hint: string; accent: string }[]> = {
  'dual-use': [
    { label: 'Flächeneffizienz', value: '130%', hint: 'Duale Nutzung vs. Monokultur', accent: 'text-emerald-400' },
    { label: 'Lichtdurchlässigkeit', value: '75%', hint: 'Optimale Pflanzenbedingungen', accent: 'text-green-300' },
    { label: 'Ertragsteigerung', value: '+30%', hint: 'Gesamtertrag pro Hektar', accent: 'text-sky-300' },
    { label: 'CO₂-Reduktion', value: '85 t/ha', hint: 'Jährliche Einsparung', accent: 'text-emerald-200' }
  ],
  weather: [
    { label: 'Hagelschutz', value: '100%', hint: 'Kompletter Schutz gewährleistet', accent: 'text-blue-400' },
    { label: 'Wassereinsparung', value: '25%', hint: 'Reduzierte Verdunstung', accent: 'text-blue-300' },
    { label: 'Temperaturregulierung', value: '-5°C', hint: 'Schutz vor Hitze', accent: 'text-cyan-300' },
    { label: 'Ernteverluste', value: '0%', hint: 'Durch Wetterschutz minimiert', accent: 'text-blue-200' }
  ],
  revenue: [
    { label: 'EEG-Vergütung', value: '8,2 ct/kWh', hint: '20+ Jahre garantiert', accent: 'text-amber-400' },
    { label: 'Agrarertrag', value: '85%', hint: 'Erhalten bleibt', accent: 'text-lime-300' },
    { label: 'ROI', value: '10,5%', hint: 'Durchschnittliche Rendite', accent: 'text-amber-300' },
    { label: 'Amortisation', value: '8,2 Jahre', hint: 'Schnelle Kapitalrückfluss', accent: 'text-yellow-200' }
  ],
  efficiency: [
    { label: 'Modulwirkungsgrad', value: '22,5%', hint: 'TOPCon-Technologie', accent: 'text-violet-400' },
    { label: 'Systemeffizienz', value: '87%', hint: 'Vollständige Anlage', accent: 'text-purple-300' },
    { label: 'Lebensdauer', value: '30 Jahre', hint: 'Lineare Leistungsgarantie', accent: 'text-fuchsia-300' },
    { label: 'Wartungskosten', value: '0,8%/a', hint: 'Sehr geringer Aufwand', accent: 'text-purple-200' }
  ],
  growth: [
    { label: 'Skalierbarkeit', value: '100 ha+', hint: 'Maximale Flächengröße', accent: 'text-indigo-400' },
    { label: 'Modularität', value: '95%', hint: 'Flexible Erweiterung', accent: 'text-indigo-300' },
    { label: 'Planungszeit', value: '3 Monate', hint: 'Von Planung bis Betrieb', accent: 'text-blue-300' },
    { label: 'Zukunftssicherheit', value: '25+', hint: 'Jahre Technologie-Lebenszyklus', accent: 'text-indigo-200' }
  ]
};

const cameraConfigurations: Record<AgriPVComponent, { position: [number, number, number]; fov: number; target: [number, number, number] }> = {
  'dual-use': { position: [0, 0, 10], fov: 50, target: [0, 0, 0] },
  weather: { position: [0, 0, 10], fov: 50, target: [0, 0, 0] },
  revenue: { position: [0, 0, 10], fov: 50, target: [0, 0, 0] },
  efficiency: { position: [0, 0, 10], fov: 50, target: [0, 0, 0] },
  growth: { position: [0, 0, 10], fov: 50, target: [0, 0, 0] }
};

// Energy Effects Components
const EnergyHalo: React.FC<{ color: string; radius: number; intensity: number }> = ({ color, radius, intensity }) => {
  const meshRef = useRef<Mesh | null>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    const material = meshRef.current.material as MeshBasicMaterial;
    material.opacity = 0.1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <ringGeometry args={[radius - 0.1, radius, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0.1} />
    </mesh>
  );
};

const EnergyParticle: React.FC<{ delay: number; startPosition: [number, number, number] }> = ({ delay, startPosition }) => {
  const meshRef = useRef<Mesh | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  useFrame((state) => {
    if (!meshRef.current || !visible) return;
    const time = state.clock.elapsedTime - delay;
    const progress = (time % 3) / 3;
    const angle = progress * Math.PI * 2;
    const radius = 2 + Math.sin(progress * Math.PI) * 0.5;

    meshRef.current.position.x = startPosition[0] + Math.cos(angle) * radius;
    meshRef.current.position.y = startPosition[1] + Math.sin(angle) * radius;
    meshRef.current.position.z = startPosition[2] + Math.sin(progress * Math.PI * 4) * 0.2;

    const material = meshRef.current.material as MeshBasicMaterial;
    material.opacity = Math.sin(progress * Math.PI) * 0.8;
  });

  if (!visible) return null;

  return (
    <mesh ref={meshRef} position={startPosition}>
      <sphereGeometry args={[0.05]} />
      <meshBasicMaterial color="#22c55e" transparent />
    </mesh>
  );
};

// Professional Agri-PV 3D Component
const ProfessionalAgriPV: React.FC = React.memo(() => {
  const meshRef = useRef<Group | null>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
  });

  return (
    <group ref={meshRef}>
      {/* Ground/Farm Land */}
      <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Solar Panels on elevated structure */}
      {Array.from({ length: 3 }, (_, row) =>
        Array.from({ length: 4 }, (_, col) => (
          <group key={`${row}-${col}`} position={[col * 1.5 - 2.25, 0.5 + row * 0.1, row * 0.5 - 0.5]}>
            {/* Support posts */}
            <mesh position={[-0.6, -0.5, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 1]} />
              <meshStandardMaterial color="#4a5568" />
            </mesh>
            <mesh position={[0.6, -0.5, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 1]} />
              <meshStandardMaterial color="#4a5568" />
            </mesh>

            {/* Solar panel */}
            <mesh position={[0, 0, 0]} rotation={[Math.PI / 6, 0, 0]}>
              <boxGeometry args={[1.2, 0.05, 0.6]} />
              <meshStandardMaterial color="#1a365d" />
            </mesh>
          </group>
        ))
      )}

      {/* Plants under panels */}
      {Array.from({ length: 20 }, (_, i) => {
        const x = (Math.random() - 0.5) * 6;
        const z = (Math.random() - 0.5) * 6;
        const y = -0.8;
        return (
          <mesh key={i} position={[x, y, z]}>
            <cylinderGeometry args={[0.02, 0.02, 0.3]} />
            <meshStandardMaterial color="#228B22" />
          </mesh>
        );
      })}

      <EnergyHalo color="#22c55e" radius={3.5} intensity={0.8} />
      <EnergyParticle delay={0} startPosition={[2, 0.5, 0]} />
      <EnergyParticle delay={1.5} startPosition={[-2, 0.5, 0]} />
      <EnergyParticle delay={3} startPosition={[0, 1, 1.5]} />
    </group>
  );
});

const ComponentImage: React.FC<{ component: AgriPVComponent }> = ({ component }) => {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const CameraController: React.FC = () => {
    const { camera } = useThree();

    useEffect(() => {
      const config = cameraConfigurations[component];
      const [cx, cy, cz] = config.position;
      const [tx, ty, tz] = config.target;

      camera.position.set(cx, cy, cz);
      if ('fov' in camera) {
        (camera as PerspectiveCamera).fov = config.fov;
        camera.updateProjectionMatrix();
      }
      camera.lookAt(tx, ty, tz);

      if (controlsRef.current) {
        controlsRef.current.target.set(tx, ty, tz);
        controlsRef.current.update();
      }
    }, [camera, component]);

    return null;
  };

  return (
    <div className="h-[350px] rounded-2xl overflow-hidden relative shadow-inner bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <CanvasErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 10], fov: 50 }}
          style={{ width: '100%', height: '100%' }}
        >
          <Suspense fallback={null}>
            <CameraController />
            <Environment preset="studio" />
            <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={8} blur={2.5} />
            <OrbitControls
              ref={controlsRef}
              enablePan={false}
              enableZoom={false}
              enableRotate={true}
              autoRotate={true}
              autoRotateSpeed={0.5}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.8}
            />
            <ProfessionalAgriPV />
          </Suspense>
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
};

const InfoPanel: React.FC<{ data: typeof agriPVData.private.benefits[0] | undefined }> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl border border-gray-200/50 h-full flex flex-col shadow-xl animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-2xl bg-green-50 border border-green-100">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900">{data.title}</h3>
      </div>

      <p className="text-gray-700 mb-8 leading-relaxed flex-grow text-lg">{data.content}</p>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Technische Vorteile:</h4>
        <ul className="space-y-4">
          {data.features.map((feature, index) => (
            <li key={index} className="flex items-start group">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5 mr-4 group-hover:bg-green-200 transition-colors duration-200">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-700 leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const AgriPVBenefits: React.FC<AgriPVBenefitsProps> = ({ customerType, setPage }) => {
  const [activeComponent, setActiveComponent] = useState<AgriPVComponent>('dual-use');
  const currentAgriData = agriPVData[customerType];
  const activeData = useMemo(() => currentAgriData.benefits.find(item => item.id === activeComponent), [activeComponent, currentAgriData]);

  const getComponentLabel = (id: AgriPVComponent) => {
    const labels = {
      'dual-use': 'Duale Nutzung',
      weather: 'Wetterschutz',
      revenue: 'Einnahmen',
      efficiency: customerType === 'business' ? 'Effizienz' : 'Energie',
      growth: customerType === 'business' ? 'Wachstum' : 'Expansion'
    };
    return labels[id];
  };

  return (
    <section className="relative py-20 bg-gradient-to-br from-green-50/80 via-white to-emerald-50/60 overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute -top-32 -right-40 h-96 w-96 rounded-full bg-green-200/20 blur-[180px]" />
        <div className="absolute top-1/4 -left-40 h-80 w-80 rounded-full bg-emerald-200/15 blur-[160px]" />
        <div className="absolute bottom-0 right-1/3 h-72 w-72 rounded-full bg-white/40 blur-[140px]" />
        <div className="absolute top-3/4 left-1/4 h-64 w-64 rounded-full bg-green-100/25 blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/60 mb-8 shadow-sm">
            <div className="p-1.5 rounded-full bg-green-100">
              <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-green-700 uppercase tracking-wider">
              {currentAgriData.badge}
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-green-800 to-gray-900 leading-tight mb-6">
            {currentAgriData.title}
          </h2>

          <p className="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium">
            {currentAgriData.subtitle}
          </p>
        </div>

        {/* Enhanced Interactive Agri-PV Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-16">
          {/* Component Selection Panel - Left */}
          <div className="order-1 lg:order-1">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-gray-200/60 h-full">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Agri-PV Vorteile</h3>
              </div>

              <div className="space-y-3">
                {currentAgriData.benefits.map((item) => {
                  const component = item.id as AgriPVComponent;
                  const isActive = activeComponent === component;
                  return (
                    <button
                      key={component}
                      onClick={() => setActiveComponent(component)}
                      className={`w-full p-4 rounded-2xl transition-all duration-300 text-left group hover:scale-[1.02] ${
                        isActive
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 shadow-lg shadow-green-100/50'
                          : 'bg-gray-50/80 border-2 border-gray-200/60 hover:bg-white hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl transition-all duration-300 ${
                          isActive
                            ? 'bg-green-100 text-green-700 shadow-sm'
                            : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
                        }`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {component === 'dual-use' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25z" />}
                            {component === 'weather' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />}
                            {component === 'revenue' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />}
                            {component === 'efficiency' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />}
                            {component === 'growth' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />}
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-semibold transition-colors duration-300 ${
                            isActive ? 'text-green-800' : 'text-gray-800'
                          }`}>
                            {item.title}
                          </h4>
                          <p className={`text-sm mt-1 transition-colors duration-300 ${
                            isActive ? 'text-green-600' : 'text-gray-600'
                          }`}>
                            {getComponentLabel(component)}
                          </p>
                        </div>
                        {isActive && (
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-sm"></div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3D Visualization Panel - Center */}
          <div className="order-3 lg:order-2">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-gray-200/60 h-full min-h-[450px]">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Agri-PV Visualisierung</h3>
              </div>

              <div className="h-[350px] rounded-2xl overflow-hidden relative shadow-inner bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <ComponentImage component={activeComponent} />
              </div>
            </div>
          </div>

          {/* Info Panel - Right */}
          <div className="order-2 lg:order-3">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-gray-200/60 h-full flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{activeData?.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">Technische Details & Vorteile</p>
                </div>
              </div>

              <div className="flex-grow space-y-6">
                <div>
                  <p className="text-gray-700 leading-relaxed text-base">{activeData?.content}</p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Technische Vorteile
                  </h4>
                  <ul className="space-y-3">
                    {activeData?.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-start group">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 mr-4 group-hover:bg-green-200 transition-colors duration-200">
                          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700 leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Quality Assurance Section */}
        <div className="text-center">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/80 max-w-5xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-gray-900">Ihr Agri-PV Partner</h3>
            </div>

            <p className="text-xl text-gray-700 leading-relaxed mb-10 max-w-4xl mx-auto">
              {customerType === 'private'
                ? 'Wir begleiten Sie von der ersten Beratung bis zur erfolgreichen Inbetriebnahme Ihrer Agri-PV-Anlage. Profitieren Sie von unserer langjährigen Erfahrung in der Landwirtschaft und Photovoltaik.'
                : 'Für Ihr Agrarunternehmen bieten wir maßgeschneiderte Lösungen mit skalierbaren Finanzierungsmodellen. Von der Flächenbewertung bis zum Betriebsmanagement - alles aus einer Hand.'
              }
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="group">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/50 hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">Fachkompetenz</h4>
                  <p className="text-gray-600 leading-relaxed">Spezialisten für Landwirtschaft und Photovoltaik in einem Team</p>
                </div>
              </div>

              <div className="group">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50 hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">Maßgeschneiderte Lösungen</h4>
                  <p className="text-gray-600 leading-relaxed">Individuelle Planung für Ihre spezifischen Anforderungen</p>
                </div>
              </div>

              <div className="group">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200/50 hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">Langfristiger Support</h4>
                  <p className="text-gray-600 leading-relaxed">Betreuung von der Planung bis zum laufenden Betrieb</p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <button
                onClick={() => setPage('agri-pv')}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 px-8 rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                {currentAgriData.cta}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgriPVBenefits;
import React, { useState, useMemo, useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei';
import { Box3, Vector3, PerspectiveCamera } from 'three';
import type { Group, Mesh, MeshBasicMaterial } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

// Error Boundary for 3D Canvas
interface TechnologyProps {
  customerType: 'private' | 'business';
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

const technologyData = {
  private: [
    {
      id: 'modules',
      title: 'Premium Solarmodule',
      icon: 'modules',
      content: 'Wir verwenden ausschließlich hochwertige Solarmodule mit bifazialer Technologie und HJT/TOPCon-Zellen für maximale Energieausbeute - auch bei diffusem Licht. Unsere Module bieten branchenführende Garantien und überzeugen durch ihre Robustheit.',
      features: ['Bifaziale Technologie für 360° Energiegewinnung', 'Höchste Wirkungsgrade auch bei Schwachlicht', 'Robuste Bauweise für extreme Wetterbedingungen', '25+ Jahre Leistungsgarantie'],
    },
    {
      id: 'inverters',
      title: 'Intelligente Wechselrichter',
      icon: 'inverters',
      content: 'Das Herzstück Ihrer Solaranlage. Unsere smarten Wechselrichter optimieren die Energieumwandlung und bieten umfassendes Monitoring in Echtzeit. So haben Sie jederzeit volle Kontrolle über Ihre Energieproduktion.',
      features: ['Echtzeit-Monitoring auf Modulebene', 'Intelligentes Schattenmanagement', 'Schnittstellen für Energiemanagementsysteme', 'Vorbereitet für zukünftige Netzdienstleistungen'],
    },
    {
      id: 'storage',
      title: 'Hausbatterie-Speicher',
      icon: 'storage',
      content: 'Machen Sie sich unabhängig von Strompreisschwankungen. Unsere modularen Batteriespeichersysteme speichern Ihren selbstproduzierten Solarstrom für die Abend- und Nachtstunden. So maximieren Sie Ihren Eigenverbrauch.',
      features: ['Modulare Bauweise für flexible Erweiterung', 'Maximierung des Eigenverbrauchs', 'Notstrom- und Inselnetzfähigkeit', 'Langlebige Lithium-Eisenphosphat-Technologie'],
    },
    {
      id: 'chargers',
      title: 'Wallbox-Ladestation',
      icon: 'chargers',
      content: 'Laden Sie Ihr Elektroauto mit selbstproduziertem Solarstrom. Unsere Wallboxen sind intelligent vernetzt und laden optimal, wenn Ihre Solaranlage am meisten produziert. So tanken Sie CO₂-neutral und kostengünstig.',
      features: ['Intelligentes Solar-optimiertes Laden', 'Hohe Ladeleistung bis 22 kW', 'Intuitive Bedienung via App', 'Sichere Installation nach VDE-Standards'],
    }
  ],
  business: [
    {
      id: 'modules',
      title: 'Kommerzielle Solarmodule',
      icon: 'modules',
      content: 'Für gewerbliche Dachflächen setzen wir auf skalierbare Solarmodule mit höchsten Wirkungsgraden und bewährter Technologie. Unsere Module sind speziell für kommerzielle Anwendungen optimiert und bieten maximale Wirtschaftlichkeit.',
      features: ['Optimierte Wirkungsgrade für kommerzielle Anlagen', 'Schnelle Montage für minimale Ausfallzeiten', 'Robuste Bauweise für gewerbliche Nutzung', '30 Jahre lineare Leistungsgarantie'],
    },
    {
      id: 'inverters',
      title: 'Gewerbliche Wechselrichter',
      icon: 'inverters',
      content: 'Professionelle Wechselrichterlösungen für große Dachflächen und Freiflächenanlagen. Unsere Systeme bieten höchste Effizienz, umfassendes Monitoring und sind für den kommerziellen Dauerbetrieb konzipiert.',
      features: ['Skalierbare Leistung bis 100+ kW', 'Umfassendes Monitoring & Reporting', 'Netzstützende Funktionen', 'Vorbereitet für Energiemarkt-Teilnahme'],
    },
    {
      id: 'storage',
      title: 'Großspeicher-Systeme',
      icon: 'storage',
      content: 'Großskalige Energiespeicher für gewerbliche Anwendungen. Unsere Systeme ermöglichen Lastspitzenkappung, Eigenverbrauchsoptimierung und bieten Notstromsicherheit für Ihren Geschäftsbetrieb.',
      features: ['Kapazitäten bis 1 MWh und mehr', 'Lastspitzenkappung (Peak Shaving)', 'Notstrom- und Inselnetzfähigkeit', 'Schnellladekapazität für Netzdienstleistungen'],
    },
    {
      id: 'chargers',
      title: 'E-Mobility-Ladeinfrastruktur',
      icon: 'chargers',
      content: 'Machen Sie Ihren Standort zum E-Mobility-Hub. Wir planen und installieren skalierbare Ladelösungen vom einzelnen Wall Connector bis zum High-Power-Charging Ladepark. Intelligent vernetzt mit Ihrer PV-Anlage.',
      features: ['AC- und DC-Ladelösungen (bis 350 kW)', 'Intelligentes Lastmanagement', 'Backend-Anbindung für Monitoring & Abrechnung', 'Solar-optimiertes Laden für maximale Wirtschaftlichkeit'],
    }
  ]
};

type SystemComponent = 'modules' | 'inverters' | 'storage' | 'chargers';

const componentMetrics: Record<SystemComponent, { label: string; value: string; hint: string; accent: string }[]> = {
  modules: [
    { label: 'Effizienz', value: '98,7%', hint: 'TOPCon-Module in Echtzeit', accent: 'text-emerald-400' },
    { label: 'Tagesertrag', value: '42,3 kWh', hint: 'Südliche Ausrichtung, 15 kWp', accent: 'text-green-300' },
    { label: 'Temperatur', value: '38°C', hint: 'aktive Hinterlüftung', accent: 'text-sky-300' },
    { label: 'Degradation', value: '0,28%/a', hint: 'lineare Premium-Garantie', accent: 'text-emerald-200' }
  ],
  inverters: [
    { label: 'Umwandlung', value: '99,1%', hint: '3xMPPT, dynamisch', accent: 'text-blue-400' },
    { label: 'Monitoring', value: '24/7', hint: 'Cloudbasierte Analyse', accent: 'text-blue-300' },
    { label: 'Reserveleistung', value: '18%', hint: 'für Peak Management', accent: 'text-cyan-300' },
    { label: 'Firmware', value: 'v4.8.2', hint: 'Update: 30.09.2025 14:32', accent: 'text-blue-200' }
  ],
  storage: [
    { label: 'Kapazität', value: '19,6 kWh', hint: 'LFP-Speicher, modular', accent: 'text-amber-400' },
    { label: 'SOC', value: '82%', hint: 'Notstrom-Reserve aktiv', accent: 'text-lime-300' },
    { label: 'Zyklen', value: '12.480', hint: '15 Jahre Garantie', accent: 'text-amber-300' },
    { label: 'Leistung', value: '10 kW', hint: 'symmetrisch, 3-phasig', accent: 'text-yellow-200' }
  ],
  chargers: [
    { label: 'Ladeleistung', value: '22 kW', hint: 'Mode 3, RFID-gesteuert', accent: 'text-violet-400' },
    { label: 'PV-Anteil', value: '79%', hint: 'Solar-optimiertes Laden', accent: 'text-purple-300' },
    { label: 'Sessions/Tag', value: '34', hint: 'Durchschnitt letzte 7 Tage', accent: 'text-fuchsia-300' },
    { label: 'Verfügbarkeit', value: '99,8%', hint: 'Wartung: 12.09.2025', accent: 'text-purple-200' }
  ]
};

const cameraConfigurations: Record<SystemComponent, { position: [number, number, number]; fov: number; target: [number, number, number] }> = {
  modules: {
    position: [0, 0, 8],
    fov: 45,
    target: [0, 0, 0]
  },
  inverters: {
    position: [0, 0, 8],
    fov: 45,
    target: [0, 0, 0]
  },
  storage: {
    position: [0, 0, 8],
    fov: 45,
    target: [0, 0, 0]
  },
  chargers: {
    position: [0, 0, 8],
    fov: 45,
    target: [0, 0, 0]
  }
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
    const progress = (time % 3) / 3; // 3 second cycle
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

// Professional Solar Panel with GLB Model
const ProfessionalSolarPanel: React.FC = React.memo(() => {
  const { scene } = useGLTF('/models/new/solar_panel_fbx.glb');
  const meshRef = useRef<Group | null>(null);
  const model = useMemo(() => scene.clone(true), [scene]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });

  useEffect(() => {
    if (!model) return;
    model.updateMatrixWorld(true);

    // Einheitliche Zentrierung und Skalierung für alle Modelle
    const boundingBox = new Box3().setFromObject(model);
    const center = boundingBox.getCenter(new Vector3());
    model.position.sub(center);

    const size = boundingBox.getSize(new Vector3());
    const desiredHeight = 4.0; // Einheitlicher Wert für alle Modelle
    const scaleFactor = size.y > 0 ? desiredHeight / size.y : 1;
    model.scale.setScalar(scaleFactor);
    model.updateMatrixWorld(true);
  }, [model]);

  return (
    <group ref={meshRef}>
      <group>
        <primitive object={model} />
      </group>
      <EnergyHalo color="#22c55e" radius={2.5} intensity={0.8} />
      <EnergyParticle delay={0} startPosition={[1.5, 0.5, 0]} />
      <EnergyParticle delay={1.5} startPosition={[-1.5, 0.5, 0]} />
      <EnergyParticle delay={3} startPosition={[0, 1.5, 1]} />
    </group>
  );
});

// Professional Inverter 3D Component
const ProfessionalInverter: React.FC = React.memo(() => {
  const { scene } = useGLTF('/models/new/wechselrichter/scene.gltf');
  const meshRef = useRef<Group | null>(null);
  const model = useMemo(() => scene.clone(true), [scene]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
  });

  useEffect(() => {
    if (!model) return;
    model.updateMatrixWorld(true);

    // Einheitliche Zentrierung und Skalierung für alle Modelle
    const boundingBox = new Box3().setFromObject(model);
    const center = boundingBox.getCenter(new Vector3());
    model.position.sub(center);

    const size = boundingBox.getSize(new Vector3());
    const desiredHeight = 4.0; // Einheitlicher Wert für alle Modelle
    const scaleFactor = size.y > 0 ? desiredHeight / size.y : 1;
    model.scale.setScalar(scaleFactor);
    model.updateMatrixWorld(true);
  }, [model]);

  return (
    <group ref={meshRef}>
      <group>
        <primitive object={model} />
      </group>
      <EnergyHalo color="#3b82f6" radius={2.2} intensity={0.6} />
      <EnergyParticle delay={0.5} startPosition={[1.2, 0.8, 0.5]} />
      <EnergyParticle delay={2} startPosition={[-1.2, 0.8, -0.5]} />
    </group>
  );
});

// Professional Battery 3D Component
const ProfessionalBattery: React.FC = React.memo(() => {
  const meshRef = useRef<Group | null>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.03;
  });

  return (
    <group ref={meshRef}>
      {/* Battery Case */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[0.8, 1.2, 0.4]} />
        <meshStandardMaterial color="#2d3748" />
      </mesh>
      {/* Battery Modules */}
      {Array.from({ length: 4 }, (_, i) => (
        <mesh key={i} position={[0, -0.2 + i * 0.25, 0.15]}>
          <boxGeometry args={[0.6, 0.15, 0.1]} />
          <meshStandardMaterial color="#4a5568" />
        </mesh>
      ))}
      {/* LED Indicators */}
      <mesh position={[0.25, 0.3, 0.22]}>
        <sphereGeometry args={[0.02]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.5} />
      </mesh>
      <EnergyHalo color="#f59e0b" radius={2.0} intensity={0.4} />
      <EnergyParticle delay={1} startPosition={[0.8, 0.6, 0.3]} />
    </group>
  );
});

// Professional Wallbox with GLB Model
const ProfessionalWallbox: React.FC = React.memo(() => {
  const { scene } = useGLTF('/models/new/super_charger_tesla_free.glb');
  const meshRef = useRef<Group | null>(null);
  const model = useMemo(() => scene.clone(true), [scene]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });

  useEffect(() => {
    if (!model) return;
    model.updateMatrixWorld(true);

    // Zentrierung und individuelle Skalierung für die Wallbox
    const boundingBox = new Box3().setFromObject(model);
    const center = boundingBox.getCenter(new Vector3());
    model.position.sub(center);

    const size = boundingBox.getSize(new Vector3());
    const desiredHeight = 10.0; // Wallbox gezielt größer skalieren
    const scaleFactor = size.y > 0 ? desiredHeight / size.y : 1;
    model.scale.setScalar(scaleFactor);
    model.updateMatrixWorld(true);
  }, [model]);

  return (
    <group ref={meshRef}>
      <group>
        <primitive object={model} />
      </group>
      <EnergyHalo color="#8b5cf6" radius={2.5} intensity={0.5} />
      <EnergyParticle delay={0.8} startPosition={[1.5, 0.5, 0]} />
      <EnergyParticle delay={2.5} startPosition={[-1.5, 0.5, 0]} />
    </group>
  );
});const ComponentImage: React.FC<{ component: SystemComponent }> = ({ component }) => {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const CameraController: React.FC = () => {
    const { camera } = useThree();

    useEffect(() => {
      const config = cameraConfigurations[component];
      const [cx, cy, cz] = config.position;
      const [tx, ty, tz] = config.target;

      camera.position.set(cx, cy, cz);
      // Only set fov if camera is a PerspectiveCamera
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
          camera={{ position: [0, 0, 8], fov: 45 }}
          style={{ width: '100%', height: '100%' }}
        >
          <Suspense fallback={null}>
            <CameraController />
            <Environment preset="studio" />
            <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={5} blur={2.5} />
            <OrbitControls
              ref={controlsRef}
              enablePan={false}
              enableZoom={false}
              enableRotate={true}
              autoRotate={true}
              autoRotateSpeed={0.5}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 1.5}
            />
            {component === 'modules' && <ProfessionalSolarPanel />}
            {component === 'inverters' && <ProfessionalInverter />}
            {component === 'storage' && <ProfessionalBattery />}
            {component === 'chargers' && <ProfessionalWallbox />}
          </Suspense>
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
};

useGLTF.preload('/models/new/wechselrichter/scene.gltf');
useGLTF.preload('/models/new/solar_panel_fbx.glb');
useGLTF.preload('/models/new/super_charger_tesla_free.glb');


const InfoPanel: React.FC<{ data: typeof technologyData.private[0] | undefined }> = ({ data }) => {
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

const Technology: React.FC<TechnologyProps> = ({ customerType }) => {
  const [activeComponent, setActiveComponent] = useState<SystemComponent>('modules');
  const currentTechData = technologyData[customerType];
  const activeData = useMemo(() => currentTechData.find(item => item.id === activeComponent), [activeComponent, currentTechData]);

  const getComponentLabel = (id: SystemComponent) => {
    const labels = {
      modules: customerType === 'private' ? 'Solarmodule' : 'Module',
      inverters: 'Wechselrichter',
      storage: customerType === 'private' ? 'Batterie' : 'Speicher',
      chargers: customerType === 'private' ? 'Wallbox' : 'Ladestation'
    };
    return labels[id];
  };

  return (
    <section className="relative py-20 bg-gradient-to-br from-blue-50/80 via-white to-green-50/60 overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute -top-32 -right-40 h-96 w-96 rounded-full bg-blue-200/20 blur-[180px]" />
        <div className="absolute top-1/4 -left-40 h-80 w-80 rounded-full bg-green-200/15 blur-[160px]" />
        <div className="absolute bottom-0 right-1/3 h-72 w-72 rounded-full bg-white/40 blur-[140px]" />
        <div className="absolute top-3/4 left-1/4 h-64 w-64 rounded-full bg-blue-100/25 blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/60 mb-8 shadow-sm">
            <div className="p-1.5 rounded-full bg-green-100">
              <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-green-700 uppercase tracking-wider">
              {customerType === 'private' ? 'Premium-Technologie für Ihr Zuhause' : 'Professionelle Technologie für Ihr Unternehmen'}
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-green-800 to-gray-900 leading-tight mb-6">
            {customerType === 'private'
              ? 'Ihr Energiefluss-System'
              : 'Ihr Unternehmens-Energiesystem'
            }
          </h2>

          <p className="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium">
            {customerType === 'private'
              ? 'Entdecken Sie die perfekt aufeinander abgestimmten Komponenten Ihres persönlichen Energiesystems. Jedes Element wurde sorgfältig ausgewählt, um maximale Effizienz und Zuverlässigkeit zu gewährleisten.'
              : 'Erfahren Sie mehr über die skalierbaren Technologien, die Ihr Unternehmen unabhängig und zukunftssicher machen. Von der Planung bis zur Umsetzung - alles aus einer Hand.'
            }
          </p>
        </div>

        {/* Enhanced Interactive System Overview */}
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
                <h3 className="text-xl font-bold text-gray-900">Komponenten</h3>
              </div>

              <div className="space-y-3">
                {currentTechData.map((item) => {
                  const component = item.id as SystemComponent;
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
                            {component === 'modules' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />}
                            {component === 'inverters' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />}
                            {component === 'storage' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />}
                            {component === 'chargers' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7zM4 14l9-11" />}
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
                <h3 className="text-xl font-bold text-gray-900">Produkt-Visualisierung</h3>
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
              <h3 className="text-3xl font-bold text-gray-900">Unser Qualitätsversprechen</h3>
            </div>

            <p className="text-xl text-gray-700 leading-relaxed mb-10 max-w-3xl mx-auto">
              {customerType === 'private'
                ? 'Jede Komponente Ihres Energiesystems wird von uns sorgfältig geprüft und professionell installiert. Wir garantieren höchste Qualitätsstandards und stehen Ihnen mit unserem Service langfristig zur Seite.'
                : 'Für Ihr Unternehmen setzen wir ausschließlich auf zertifizierte Premium-Komponenten und professionelle Installation. Unsere Systeme sind skalierbar, wartungsfreundlich und für den Dauerbetrieb konzipiert.'
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
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">Zertifizierte Qualität</h4>
                  <p className="text-gray-600 leading-relaxed">Alle Komponenten entsprechen höchsten Standards und internationalen Zertifizierungen</p>
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
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">Professionelle Installation</h4>
                  <p className="text-gray-600 leading-relaxed">Fachgerechter Einbau nach neuesten VDE-Normen und Sicherheitsstandards</p>
                </div>
              </div>

              <div className="group">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200/50 hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">Langfristiger Service</h4>
                  <p className="text-gray-600 leading-relaxed">Umfassende Garantiepakete und regelmäßige Wartung für maximale Betriebssicherheit</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};export default Technology;
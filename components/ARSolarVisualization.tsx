// AR Solar Visualization - Smartphone Kamera Integration für Dach-Analyse & Panel-Platzierung
import React, { useState, useEffect, useCallback, useRef } from 'react';

interface ARMeasurement {
  id: string;
  type: 'roof-dimension' | 'panel-placement' | 'shade-analysis' | 'orientation-detection';
  value: number;
  unit: string;
  confidence: number; // 0-100
  timestamp: Date;
  position3D?: {
    x: number;
    y: number;
    z: number;
  };
}

interface SolarPanel {
  id: string;
  position: {
    x: number;
    y: number;
    rotation: number;
  };
  size: {
    width: number;
    height: number;
  };
  efficiency: number;
  type: string;
  estimatedOutput: number; // kWh/year
}

interface ARScene {
  id: string;
  name: string;
  location: string;
  measurements: ARMeasurement[];
  placedPanels: SolarPanel[];
  totalEstimatedOutput: number;
  totalArea: number;
  orientation: string;
  tilt: number;
  shadeAnalysis: {
    totalShadePercentage: number;
    shadedAreas: Array<{ x: number; y: number; severity: number }>;
  };
  createdAt: Date;
}

interface ARCapability {
  isSupported: boolean;
  hasCamera: boolean;
  hasGyroscope: boolean;
  hasAccelerometer: boolean;
  platform: 'ios' | 'android' | 'desktop';
  webXRSupported: boolean;
  modelReady: boolean;
}

const ARSolarVisualization: React.FC = () => {
  const [isARMode, setIsARMode] = useState(false);
  const [currentScene, setCurrentScene] = useState<ARScene | null>(null);
  const [measurements, setMeasurements] = useState<ARMeasurement[]>([]);
  const [placedPanels, setPlacedPanels] = useState<SolarPanel[]>([]);
  const [arCapabilities, setArCapabilities] = useState<ARCapability>({
    isSupported: false,
    hasCamera: false,
    hasGyroscope: false,
    hasAccelerometer: false,
    platform: 'desktop',
    webXRSupported: false,
    modelReady: false
  });

  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [measurementMode, setMeasurementMode] = useState<'manual' | 'automatic'>('automatic');
  const [showInstructions, setShowInstructions] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize AR Capabilities
  useEffect(() => {
    detectARCapabilities();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Detect Device AR Capabilities
  const detectARCapabilities = async () => {
    const capabilities: ARCapability = {
      isSupported: false,
      hasCamera: false,
      hasGyroscope: false,
      hasAccelerometer: false,
      platform: 'desktop',
      webXRSupported: false,
      modelReady: false
    };

    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
      capabilities.platform = 'ios';
    } else if (userAgent.includes('android')) {
      capabilities.platform = 'android';
    }

    // Check camera availability
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
      capabilities.hasCamera = true;
    }

    // Check device orientation capabilities
    if ('DeviceOrientationEvent' in window) {
      capabilities.hasGyroscope = true;
    }

    if ('DeviceMotionEvent' in window) {
      capabilities.hasAccelerometer = true;
    }

    // Check WebXR support
    if ('xr' in navigator) {
      try {
        await (navigator as any).xr.isSessionSupported('immersive-ar');
        capabilities.webXRSupported = true;
      } catch (error) {
        console.log('WebXR not supported');
      }
    }

    // Basic AR support if camera and orientation sensors are available
    capabilities.isSupported = capabilities.hasCamera && (capabilities.hasGyroscope || capabilities.hasAccelerometer);

    setArCapabilities(capabilities);
  };

  // Start AR Session
  const startARSession = async () => {
    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsARMode(true);
      setShowInstructions(true);

      // Start automatic scanning
      if (measurementMode === 'automatic') {
        setTimeout(() => startAutomaticScanning(), 2000);
      }

    } catch (error) {
      console.error('AR session failed:', error);
      alert('Kamera konnte nicht gestartet werden. Bitte erlauben Sie den Kamerazugriff.');
    }
  };

  // Stop AR Session
  const stopARSession = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsARMode(false);
    setIsScanning(false);
    setShowInstructions(true);
  };

  // Start Automatic Scanning
  const startAutomaticScanning = () => {
    setIsScanning(true);
    setScanProgress(0);

    // Simulate progressive scanning process
    const scanInterval = setInterval(() => {
      setScanProgress(prev => {
        const newProgress = prev + Math.random() * 15;

        if (newProgress >= 100) {
          clearInterval(scanInterval);
          setIsScanning(false);
          completeAutomaticScanning();
          return 100;
        }

        return newProgress;
      });
    }, 500);
  };

  // Complete Automatic Scanning
  const completeAutomaticScanning = () => {
    // Generate simulated AR measurements
    const simulatedMeasurements: ARMeasurement[] = [
      {
        id: 'roof-width',
        type: 'roof-dimension',
        value: 12.5,
        unit: 'm',
        confidence: 92,
        timestamp: new Date(),
        position3D: { x: 0, y: 0, z: 0 }
      },
      {
        id: 'roof-length',
        type: 'roof-dimension',
        value: 8.3,
        unit: 'm',
        confidence: 89,
        timestamp: new Date(),
        position3D: { x: 12.5, y: 0, z: 0 }
      },
      {
        id: 'roof-orientation',
        type: 'orientation-detection',
        value: 35, // degrees from south
        unit: '°',
        confidence: 95,
        timestamp: new Date()
      },
      {
        id: 'roof-tilt',
        type: 'orientation-detection',
        value: 32, // degrees
        unit: '°',
        confidence: 88,
        timestamp: new Date()
      }
    ];

    setMeasurements(simulatedMeasurements);

    // Generate optimal panel placement
    const panels = generateOptimalPanelPlacement(simulatedMeasurements);
    setPlacedPanels(panels);

    // Create AR scene
    const scene: ARScene = {
      id: `scene-${Date.now()}`,
      name: 'Dach-Analyse',
      location: 'Ihre Position',
      measurements: simulatedMeasurements,
      placedPanels: panels,
      totalEstimatedOutput: panels.reduce((sum, panel) => sum + panel.estimatedOutput, 0),
      totalArea: panels.reduce((sum, panel) => sum + (panel.size.width * panel.size.height), 0),
      orientation: 'Süd-West',
      tilt: 32,
      shadeAnalysis: {
        totalShadePercentage: 8,
        shadedAreas: [
          { x: 2, y: 3, severity: 0.3 },
          { x: 8, y: 5, severity: 0.1 }
        ]
      },
      createdAt: new Date()
    };

    setCurrentScene(scene);
    setShowInstructions(false);
  };

  // Generate Optimal Panel Placement
  const generateOptimalPanelPlacement = (measurements: ARMeasurement[]): SolarPanel[] => {
    const panels: SolarPanel[] = [];
    const roofWidth = measurements.find(m => m.id === 'roof-width')?.value || 10;
    const roofLength = measurements.find(m => m.id === 'roof-length')?.value || 8;

    const panelWidth = 1.7; // Standard panel width
    const panelHeight = 1.0; // Standard panel height
    const spacing = 0.1; // Spacing between panels

    const panelsPerRow = Math.floor(roofWidth / (panelWidth + spacing));
    const numberOfRows = Math.floor(roofLength / (panelHeight + spacing));

    for (let row = 0; row < numberOfRows; row++) {
      for (let col = 0; col < panelsPerRow; col++) {
        panels.push({
          id: `panel-${row}-${col}`,
          position: {
            x: col * (panelWidth + spacing),
            y: row * (panelHeight + spacing),
            rotation: 0
          },
          size: {
            width: panelWidth,
            height: panelHeight
          },
          efficiency: 22.5, // Modern panel efficiency
          type: 'Monokristallin',
          estimatedOutput: 450 // kWh per year per panel
        });
      }
    }

    return panels;
  };

  // Add Manual Measurement
  const addManualMeasurement = (type: ARMeasurement['type'], value: number, unit: string) => {
    const measurement: ARMeasurement = {
      id: `manual-${Date.now()}`,
      type,
      value,
      unit,
      confidence: 95,
      timestamp: new Date()
    };

    setMeasurements(prev => [...prev, measurement]);
  };

  // Place Panel Manually
  const placePanelManually = (x: number, y: number) => {
    const panel: SolarPanel = {
      id: `manual-panel-${Date.now()}`,
      position: {
        x,
        y,
        rotation: 0
      },
      size: {
        width: 1.7,
        height: 1.0
      },
      efficiency: 22.5,
      type: 'Monokristallin',
      estimatedOutput: 450
    };

    setPlacedPanels(prev => [...prev, panel]);
  };

  // Calculate System Performance
  const calculateSystemPerformance = () => {
    if (!currentScene) return null;

    const totalOutput = currentScene.totalEstimatedOutput;
    const totalPanels = currentScene.placedPanels.length;
    const avgOutputPerPanel = totalPanels > 0 ? totalOutput / totalPanels : 0;

    // Calculate ROI (simplified)
    const systemCost = totalPanels * 1500; // €1500 per panel including installation
    const annualSavings = totalOutput * 0.35; // €0.35 per kWh saved
    const roiYears = systemCost / annualSavings;

    return {
      totalOutput,
      totalPanels,
      avgOutputPerPanel,
      systemCost,
      annualSavings,
      roiYears,
      co2Savings: totalOutput * 0.5 // kg CO2 per kWh
    };
  };

  // Export AR Scene Data
  const exportSceneData = () => {
    if (!currentScene) return;

    const data = {
      scene: currentScene,
      performance: calculateSystemPerformance(),
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ar-solar-analysis-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const performance = calculateSystemPerformance();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📱 AR Solar Visualization
        </h1>
        <p className="text-gray-600">
          Smartphone Kamera Integration für Dach-Analyse & Panel-Platzierung
        </p>
      </div>

      {/* AR Capabilities Status */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">🔧 Gerät-Fähigkeiten</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`text-center p-4 rounded-lg ${
            arCapabilities.hasCamera ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <div className="text-2xl mb-2">{arCapabilities.hasCamera ? '📷' : '❌'}</div>
            <div className="font-medium">Kamera</div>
          </div>
          <div className={`text-center p-4 rounded-lg ${
            arCapabilities.hasGyroscope ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            <div className="text-2xl mb-2">{arCapabilities.hasGyroscope ? '🧭' : '❌'}</div>
            <div className="font-medium">Gyroskop</div>
          </div>
          <div className={`text-center p-4 rounded-lg ${
            arCapabilities.webXRSupported ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            <div className="text-2xl mb-2">{arCapabilities.webXRSupported ? '🥽' : '❌'}</div>
            <div className="font-medium">WebXR</div>
          </div>
          <div className={`text-center p-4 rounded-lg ${
            arCapabilities.isSupported ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <div className="text-2xl mb-2">{arCapabilities.isSupported ? '✅' : '❌'}</div>
            <div className="font-medium">AR Ready</div>
          </div>
        </div>
      </div>

      {/* AR Camera View */}
      {isARMode && (
        <div className="relative bg-black rounded-xl overflow-hidden mb-8" style={{ height: '500px' }}>
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
          />

          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          />

          {/* AR Overlay */}
          <div className="absolute top-4 left-4 right-4">
            <div className="bg-black bg-opacity-50 text-white p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span>AR Modus Aktiv</span>
                <button
                  onClick={stopARSession}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Beenden
                </button>
              </div>
            </div>
          </div>

          {/* Scan Progress */}
          {isScanning && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black bg-opacity-50 text-white p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span>Dach wird analysiert...</span>
                  <span>{Math.round(scanProgress)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          {showInstructions && !isScanning && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black bg-opacity-50 text-white p-3 rounded-lg">
                <p>📸 Richten Sie die Kamera auf Ihr Dach für automatische Analyse</p>
                <p className="text-sm mt-1">Oder tippen Sie manuell auf das Dach für Messungen</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Control Panel */}
      {!isARMode && (
        <div className="text-center mb-8">
          <button
            onClick={startARSession}
            disabled={!arCapabilities.hasCamera}
            className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {arCapabilities.hasCamera ? '📱 AR Analyse starten' : '❌ Kamera nicht verfügbar'}
          </button>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="automatic"
                  checked={measurementMode === 'automatic'}
                  onChange={(e) => setMeasurementMode(e.target.value as 'automatic' | 'manual')}
                  className="mr-2"
                />
                <span>Automatische Analyse</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="manual"
                  checked={measurementMode === 'manual'}
                  onChange={(e) => setMeasurementMode(e.target.value as 'automatic' | 'manual')}
                  className="mr-2"
                />
                <span>Manuelle Messung</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Measurements Results */}
      {measurements.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📏 Messergebnisse</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {measurements.map((measurement) => (
              <div key={measurement.id} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    {measurement.type === 'roof-dimension' ? 'Dachdimension' :
                     measurement.type === 'orientation-detection' ? 'Ausrichtung' :
                     measurement.type === 'shade-analysis' ? 'Schattenanalyse' : 'Messung'}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {measurement.confidence}%
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {measurement.value} {measurement.unit}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Panel Configuration */}
      {placedPanels.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🔷 Panel-Konfiguration</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-sm font-medium text-gray-600 mb-1">Anzahl Module</div>
              <div className="text-2xl font-bold text-gray-900">{placedPanels.length}</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-sm font-medium text-gray-600 mb-1">Gesamtfläche</div>
              <div className="text-2xl font-bold text-gray-900">
                {placedPanels.reduce((sum, panel) => sum + (panel.size.width * panel.size.height), 0).toFixed(1)} m²
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-sm font-medium text-gray-600 mb-1">Module-Typ</div>
              <div className="text-lg font-bold text-gray-900">{placedPanels[0]?.type || 'Monokristallin'}</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-sm font-medium text-gray-600 mb-1">Wirkungsgrad</div>
              <div className="text-2xl font-bold text-gray-900">{placedPanels[0]?.efficiency || 22.5}%</div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Analysis */}
      {performance && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">⚡ Performance-Analyse</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{performance.totalOutput.toLocaleString()}</div>
              <div className="text-sm text-gray-600">kWh/Jahr</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">€{performance.annualSavings.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Ersparnis/Jahr</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{performance.roiYears.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Jahre Amortisation</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{performance.co2Savings.toFixed(0)} kg</div>
              <div className="text-sm text-gray-600">CO₂-Einsparung/Jahr</div>
            </div>
          </div>
        </div>
      )}

      {/* Export Actions */}
      {currentScene && (
        <div className="text-center">
          <button
            onClick={exportSceneData}
            className="px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 transition-colors"
          >
            📄 Analyse exportieren
          </button>
        </div>
      )}

      {/* AR Scene Visualization */}
      {currentScene && placedPanels.length > 0 && (
        <div className="mt-8 bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">🏠 Dach-Visualisierung</h3>
          <div className="relative bg-white rounded-lg border-2 border-gray-200" style={{ height: '300px' }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Roof outline */}
                <div className="border-4 border-gray-400 bg-gray-100" style={{
                  width: `${Math.min(280, placedPanels.reduce((max, panel) =>
                    Math.max(max, panel.position.x + panel.size.width * 10), 0))}px`,
                  height: `${Math.min(200, placedPanels.reduce((max, panel) =>
                    Math.max(max, panel.position.y + panel.size.height * 10), 0))}px`
                }}>

                  {/* Solar panels */}
                  {placedPanels.map((panel) => (
                    <div
                      key={panel.id}
                      className="absolute bg-blue-600 border border-blue-800"
                      style={{
                        left: `${panel.position.x * 10}px`,
                        top: `${panel.position.y * 10}px`,
                        width: `${panel.size.width * 10}px`,
                        height: `${panel.size.height * 10}px`,
                        transform: `rotate(${panel.position.rotation}deg)`
                      }}
                      title={`Modul: ${panel.type}\nAusgabe: ${panel.estimatedOutput} kWh/Jahr`}
                    />
                  ))}

                  {/* Shade areas */}
                  {currentScene.shadeAnalysis.shadedAreas.map((area, index) => (
                    <div
                      key={index}
                      className="absolute bg-red-300 opacity-50"
                      style={{
                        left: `${area.x * 10}px`,
                        top: `${area.y * 10}px`,
                        width: '20px',
                        height: '20px'
                      }}
                      title={`Schattenbereich: ${area.severity * 100}%`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 p-2 rounded text-xs">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-600 mr-1"></div>
                  <span>Solarmodule</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-300 mr-1"></div>
                  <span>Schatten</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ARSolarVisualization;
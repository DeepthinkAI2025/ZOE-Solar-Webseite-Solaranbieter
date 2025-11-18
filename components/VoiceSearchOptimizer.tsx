// Voice Search 2.0 Optimizer für Google Actions, Alexa Skills & Conversational AI
import React, { useState, useEffect, useCallback, useRef } from 'react';

interface VoiceSearchData {
  query: string;
  intent: 'information' | 'comparison' | 'calculation' | 'appointment' | 'quote' | 'location';
  confidence: number; // 0-1
  entities: {
    location?: string;
    systemType?: string;
    budget?: string;
    timeframe?: string;
  };
  timestamp: Date;
  source: 'google-actions' | 'alexa-skill' | 'google-assistant' | 'siri' | 'website';
}

interface VoiceAnalytics {
  totalQueries: number;
  successfulResponses: number;
  averageConfidence: number;
  topIntents: Array<{ intent: string; count: number }>;
  locationQueries: Array<{ location: string; count: number }>;
  conversionRate: number;
  voicePlatformUsage: {
    google: number;
    alexa: number;
    siri: number;
    website: number;
  };
}

const VoiceSearchOptimizer: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [detectedIntent, setDetectedIntent] = useState<VoiceSearchData | null>(null);
  const [analytics, setAnalytics] = useState<VoiceAnalytics>({
    totalQueries: 0,
    successfulResponses: 0,
    averageConfidence: 0,
    topIntents: [],
    locationQueries: [],
    conversionRate: 0,
    voicePlatformUsage: {
      google: 0,
      alexa: 0,
      siri: 0,
      website: 0
    }
  });

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Voice Search Intents für Solar Industry
  const solarVoiceIntents = [
    {
      name: 'GetSolarQuote',
      utterances: [
        'Ich möchte ein Angebot für eine Solaranlage',
        'Wie viel kostet eine Photovoltaikanlage',
        'Solaranlage Preis berechnen',
        'Kosten für Solarenergie für mein Haus',
        'Photovoltaik Angebot anfordern'
      ],
      parameters: {
        systemType: {
          type: 'string',
          required: false,
          examples: ['Dachanlage', 'Balkonkraftwerk', 'Gewerbeanlage', 'Agri-PV']
        },
        budget: {
          type: 'currency',
          required: false,
          examples: ['unter 10000 Euro', '20000 Euro', '5000 bis 10000 Euro']
        },
        location: {
          type: 'location',
          required: true,
          examples: ['Berlin', 'München', 'Hamburg', 'Köln', 'Frankfurt']
        }
      }
    },
    {
      name: 'CalculateROI',
      utterances: [
        'Wie hoch ist die Rendite bei Solaranlagen',
        'Wann amortisiert sich eine Photovoltaikanlage',
        'Solaranlage ROI berechnen',
        'Einsparungen durch Solarenergie',
        'Amortisationsdauer Solaranlage'
      ],
      parameters: {
        systemSize: {
          type: 'number',
          required: false,
          examples: ['5 Kilowatt', '10 kWp', '3 Kilowatt peak']
        },
        location: {
          type: 'location',
          required: true,
          examples: ['Brandenburg', 'Bayern', 'Niedersachsen']
        }
      }
    }
  ];

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'de-DE';

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);

        if (event.results[current].isFinal) {
          processVoiceQuery(transcript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Process Voice Query with Intent Detection
  const processVoiceQuery = useCallback((query: string) => {
    const intent = detectIntent(query);
    setDetectedIntent(intent);

    // Update Analytics
    updateAnalytics(intent);

    // Process Intent
    processIntent(intent);
  }, []);

  // Advanced Intent Detection using NLP patterns
  const detectIntent = (query: string): VoiceSearchData => {
    const normalizedQuery = query.toLowerCase();

    // Intent Detection Patterns
    let detectedIntent: VoiceSearchData['intent'] = 'information';
    let confidence = 0.7;
    const entities: VoiceSearchData['entities'] = {};

    // Location Detection
    const locationPatterns = /(berlin|münchen|hamburg|köln|frankfurt|stuttgart|düsseldorf|dresden|leipzig|hanover|brandenburg|bayern|baden-württemberg)/i;
    const locationMatch = query.match(locationPatterns);
    if (locationMatch) {
      entities.location = locationMatch[1];
      confidence += 0.1;
    }

    // Budget Detection
    const budgetPatterns = /(\d+)\s*(euro|€|tausend|k)/i;
    const budgetMatch = query.match(budgetPatterns);
    if (budgetMatch) {
      entities.budget = budgetMatch[0];
      confidence += 0.05;
    }

    // System Type Detection
    if (/balkonkraftwerk|mini-pv|stecker-solaranlage/i.test(normalizedQuery)) {
      entities.systemType = 'balkonkraftwerk';
      detectedIntent = 'quote';
      confidence += 0.15;
    } else if (/dachanlage|photovoltaik|solaranlage|pv-anlage/i.test(normalizedQuery)) {
      entities.systemType = 'dachanlage';
      detectedIntent = query.includes('kosten') || query.includes('preis') ? 'quote' : 'information';
      confidence += 0.15;
    }

    // Action Intent Detection
    if (/angebot|kosten|preis|kalkulieren|berechnen|quote|angebot anfordern/i.test(normalizedQuery)) {
      detectedIntent = 'quote';
      confidence += 0.2;
    } else if (/termin|beratung|vereinbaren|buchung/i.test(normalizedQuery)) {
      detectedIntent = 'appointment';
      confidence += 0.2;
    } else if (/standort|nähe|wo|finden|in meiner nähe/i.test(normalizedQuery)) {
      detectedIntent = 'location';
      confidence += 0.2;
    } else if (/rendite|roi|amortisation|einsparung|return/i.test(normalizedQuery)) {
      detectedIntent = 'calculation';
      confidence += 0.25;
    }

    return {
      query,
      intent: detectedIntent,
      confidence: Math.min(1, confidence),
      entities,
      timestamp: new Date(),
      source: 'website'
    };
  };

  // Process Detected Intent
  const processIntent = async (intent: VoiceSearchData) => {
    let response = '';

    switch (intent.intent) {
      case 'quote':
        response = await handleSolarQuote(intent);
        break;
      case 'calculation':
        response = await handleROICalculation(intent);
        break;
      case 'appointment':
        response = await handleAppointmentBooking(intent);
        break;
      case 'location':
        response = await handleLocationSearch(intent);
        break;
      case 'information':
        response = await handleInformationRequest(intent);
        break;
      default:
        response = 'Ich kann Ihnen mit Ihrer Solaranlage-Anfrage gerne helfen. Können Sie mir mehr Details geben?';
    }

    // Speak Response
    speakResponse(response);
  };

  // Intent Handlers
  const handleSolarQuote = async (intent: VoiceSearchData): Promise<string> => {
    const systemType = intent.entities.systemType || 'Photovoltaikanlage';
    const location = intent.entities.location || 'Ihrer Region';

    return `Gerne erstelle ich Ihnen ein maßgeschneidertes Angebot für eine ${systemType} in ${location}.
            Basierend auf aktuellen Preisen erwarten Sie mit Investitionskosten zwischen 8.000 und 15.000 Euro.
            Möchten Sie, dass ich einen Experten für eine detaillierte Analyse zu Ihnen schicke?`;
  };

  const handleROICalculation = async (intent: VoiceSearchData): Promise<string> => {
    return `Die Rendite von Solaranlagen liegt typischerweise bei 8-12% pro Jahr.
            Mit aktuellen Strompreisen und Förderprogrammen amortisiert sich eine Anlage meist nach 8-12 Jahren.
            Danach erzielen Sie 15-20 Jahre lang reinen Gewinn. Wie groß ist Ihre zur Verfügung stehende Dachfläche?`;
  };

  const handleAppointmentBooking = async (intent: VoiceSearchData): Promise<string> => {
    return `Ich kann Ihnen gerne einen Beratungstermin vereinbaren.
            Unsere Solar-Experten stehen Ihnen von Montag bis Freitag von 8 bis 18 Uhr zur Verfügung.
            Bevorzugten Sie einen Termin am Vormittag oder Nachmittag?`;
  };

  const handleLocationSearch = async (intent: VoiceSearchData): Promise<string> => {
    const location = intent.entities.location || 'Ihrer Nähe';
    return `ZOE Solar hat Standorte in ganz Deutschland. In ${location} können wir Ihnen unser Komplettangebot anbieten.
            Nennen Sie mir bitte Ihre Adresse für die genaue Standortfindung.`;
  };

  const handleInformationRequest = async (intent: VoiceSearchData): Promise<string> => {
    return `Photovoltaik wandelt Sonnenlicht direkt in Strom um.
            Eine typische Anlage produziert 4.000-6.000 kWh pro Jahr und deckt damit 40-70% Ihres Strombedarfs.
            Mehr erfahren Sie in unserer umfassenden Solar-Beratung.`;
  };

  // Voice Response System
  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      synthRef.current = new SpeechSynthesisUtterance(text);
      synthRef.current.lang = 'de-DE';
      synthRef.current.rate = 0.9;
      synthRef.current.pitch = 1;

      // Select German female voice
      const voices = speechSynthesis.getVoices();
      const germanVoice = voices.find(voice =>
        voice.lang.startsWith('de') && voice.name.includes('Female')
      );
      if (germanVoice) {
        synthRef.current.voice = germanVoice;
      }

      speechSynthesis.speak(synthRef.current);
    }
  };

  // Voice Recording Controls
  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript('');
      setDetectedIntent(null);
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // Update Analytics
  const updateAnalytics = (intent: VoiceSearchData) => {
    setAnalytics(prev => ({
      totalQueries: prev.totalQueries + 1,
      successfulResponses: prev.successfulResponses + (intent.confidence > 0.7 ? 1 : 0),
      averageConfidence: (prev.averageConfidence * prev.totalQueries + intent.confidence) / (prev.totalQueries + 1),
      topIntents: updateTopIntents(prev.topIntents, intent.intent),
      locationQueries: intent.entities.location
        ? updateLocationQueries(prev.locationQueries, intent.entities.location)
        : prev.locationQueries,
      conversionRate: prev.conversionRate, // Would be calculated from actual conversions
      voicePlatformUsage: {
        ...prev.voicePlatformUsage,
        website: prev.voicePlatformUsage.website + 1
      }
    }));
  };

  const updateTopIntents = (current: any[], newIntent: string) => {
    const updated = [...current];
    const existing = updated.find(item => item.intent === newIntent);

    if (existing) {
      existing.count++;
    } else {
      updated.push({ intent: newIntent, count: 1 });
    }

    return updated.sort((a, b) => b.count - a.count).slice(0, 5);
  };

  const updateLocationQueries = (current: any[], location: string) => {
    const updated = [...current];
    const existing = updated.find(item => item.location === location);

    if (existing) {
      existing.count++;
    } else {
      updated.push({ location, count: 1 });
    }

    return updated.sort((a, b) => b.count - a.count).slice(0, 10);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🎤 Voice Search 2.0 Optimizer
        </h1>
        <p className="text-gray-600">
          Google Actions, Alexa Skills & Conversational AI Integration für maximale Voice-Sichtbarkeit
        </p>
      </div>

      {/* Voice Interface */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
        <div className="text-center">
          <div className="mb-6">
            <button
              onClick={isListening ? stopListening : startListening}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all transform hover:scale-105 ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isListening ? (
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>
            <div className="mt-4">
              <p className="text-lg font-semibold text-gray-900">
                {isListening ? 'Ich höre zu...' : 'Klicken für Voice-Suche'}
              </p>
              <p className="text-sm text-gray-600">
                Fragen Sie nach Solaranlagen, Kosten, oder Terminvereinbarung
              </p>
            </div>
          </div>

          {/* Transcript Display */}
          {transcript && (
            <div className="bg-white rounded-lg p-4 mb-4 border border-blue-200">
              <p className="text-sm text-gray-500 mb-1">Gesprochen:</p>
              <p className="text-lg text-gray-900">{transcript}</p>
            </div>
          )}

          {/* Intent Detection Result */}
          {detectedIntent && (
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-green-900">✅ Intent erkannt:</h3>
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                  {(detectedIntent.confidence * 100).toFixed(0)}% confident
                </span>
              </div>
              <div className="text-left space-y-2">
                <p><strong>Absicht:</strong> {detectedIntent.intent}</p>
                {detectedIntent.entities.location && (
                  <p><strong>Standort:</strong> {detectedIntent.entities.location}</p>
                )}
                {detectedIntent.entities.systemType && (
                  <p><strong>Systemtyp:</strong> {detectedIntent.entities.systemType}</p>
                )}
                {detectedIntent.entities.budget && (
                  <p><strong>Budget:</strong> {detectedIntent.entities.budget}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Voice Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-purple-900">Voice Queries</h3>
            <div className="text-2xl">🎤</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-purple-900">{analytics.totalQueries}</div>
            <div className="text-sm text-purple-700">{analytics.successfulResponses} erfolgreich</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-green-900">Avg Confidence</h3>
            <div className="text-2xl">🎯</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-green-900">
              {(analytics.averageConfidence * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-green-700">Intent Recognition</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-blue-900">Top Intent</h3>
            <div className="text-2xl">💭</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-blue-900 capitalize">
              {analytics.topIntents[0]?.intent || 'N/A'}
            </div>
            <div className="text-sm text-blue-700">
              {analytics.topIntents[0]?.count || 0} mal
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-amber-900">Top Location</h3>
            <div className="text-2xl">📍</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-amber-900 capitalize">
              {analytics.locationQueries[0]?.location || 'N/A'}
            </div>
            <div className="text-sm text-amber-700">
              {analytics.locationQueries[0]?.count || 0} Anfragen
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceSearchOptimizer;
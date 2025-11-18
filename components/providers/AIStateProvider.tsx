import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// AI Service Interfaces
export interface AIIntegrationStatus {
  initialized: boolean;
  services: {
    aiIntegration: boolean;
    apiIntegration: boolean;
    contentOptimization: boolean;
    keywordAnalysis: boolean;
    userBehaviorAnalysis: boolean;
    platformIntegration: boolean;
    semanticUnderstanding: boolean;
    monitoringAnalytics: boolean;
    futureProofing: boolean;
  };
  lastUpdate: Date | null;
  errors: string[];
}

export interface UserBehaviorPattern {
  sessionId: string;
  userId?: string;
  pageViews: string[];
  timeOnPages: Record<string, number>;
  interactions: string[];
  deviceInfo: {
    userAgent: string;
    viewport: { width: number; height: number };
    device: 'mobile' | 'tablet' | 'desktop';
  };
  searchQueries: string[];
  exitIntent: boolean;
  conversionProbability: number;
}

export interface PersonalizedContent {
  userId?: string;
  sessionId: string;
  content: Record<string, any>;
  personalizedAt: Date;
  confidence: number;
}

export interface VoiceCommand {
  id: string;
  command: string;
  intent: string;
  confidence: number;
  timestamp: Date;
  executed: boolean;
}

export interface AIState {
  integrationStatus: AIIntegrationStatus;
  userBehavior: UserBehaviorPattern | null;
  personalizedContent: PersonalizedContent | null;
  voiceInterfaceActive: boolean;
  gestureControl: boolean;
  emotionDetection: boolean;
  arMode: boolean;
  voiceCommands: VoiceCommand[];
  isLoading: boolean;
  error: string | null;
}

interface AIContextType {
  state: AIState;
  initializeAIServices: () => Promise<void>;
  updateUserBehavior: (behavior: Partial<UserBehaviorPattern>) => void;
  setPersonalizedContent: (content: PersonalizedContent) => void;
  activateVoiceInterface: () => void;
  deactivateVoiceInterface: () => void;
  activateGestureControl: () => void;
  activateEmotionDetection: () => void;
  toggleARMode: () => void;
  addVoiceCommand: (command: Omit<VoiceCommand, 'id' | 'timestamp'>) => void;
  clearAIState: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

interface AIStateProviderProps {
  children: ReactNode;
}

export const AIStateProvider: React.FC<AIStateProviderProps> = ({ children }) => {
  const [state, setState] = useState<AIState>({
    integrationStatus: {
      initialized: false,
      services: {
        aiIntegration: false,
        apiIntegration: false,
        contentOptimization: false,
        keywordAnalysis: false,
        userBehaviorAnalysis: false,
        platformIntegration: false,
        semanticUnderstanding: false,
        monitoringAnalytics: false,
        futureProofing: false,
      },
      lastUpdate: null,
      errors: [],
    },
    userBehavior: null,
    personalizedContent: null,
    voiceInterfaceActive: false,
    gestureControl: false,
    emotionDetection: false,
    arMode: false,
    voiceCommands: [],
    isLoading: false,
    error: null,
  });

  // Initialize AI Services
  const initializeAIServices = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Dynamically import AI services (from existing App.tsx imports)
      // Note: aiAPIIntegration is server-side only and skipped for browser compatibility
      const services = await Promise.all([
        import('../../services/aiIntegrationService'),
        // import('../../services/aiAPIIntegration'), // Server-side only - Express.js not compatible with browser
        import('../../services/aiFirstContentOptimizationService'),
        import('../../services/predictiveKeywordAnalysisService'),
        import('../../services/userBehaviorPatternAnalysisService'),
        import('../../services/aiPlatformIntegrationService'),
        import('../../services/semanticAIUnderstandingService'),
        import('../../services/aiMonitoringAnalyticsService'),
        import('../../services/aiFutureProofingService'),
      ]);

      // Simple import check - services are singleton instances
      const serviceStatuses = services.map((serviceModule, index) => {
        try {
          // Check if service module has a default export or named export
          const hasDefault = serviceModule.default !== undefined;
          const hasExports = Object.keys(serviceModule).length > 0;
          
          if (hasDefault || hasExports) {
            console.log(`✅ Service ${index} loaded successfully`);
            return true;
          } else {
            console.warn(`⚠️ Service ${index} loaded but no exports found`);
            return false;
          }
        } catch (err) {
          console.warn(`❌ Service ${index} loading failed:`, err);
          return false;
        }
      });

      const newStatus: AIIntegrationStatus = {
        initialized: true,
        services: {
          aiIntegration: serviceStatuses[0] || false,
          apiIntegration: false, // Skipped due to browser compatibility
          contentOptimization: serviceStatuses[1] || false,
          keywordAnalysis: serviceStatuses[2] || false,
          userBehaviorAnalysis: serviceStatuses[3] || false,
          platformIntegration: serviceStatuses[4] || false,
          semanticUnderstanding: serviceStatuses[5] || false,
          monitoringAnalytics: serviceStatuses[6] || false,
          futureProofing: serviceStatuses[7] || false,
        },
        lastUpdate: new Date(),
        errors: [],
      };

      setState(prev => ({
        ...prev,
        integrationStatus: newStatus,
        isLoading: false,
      }));

      console.log('🤖 AI Services initialized:', newStatus);

    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to initialize AI services',
      }));
      console.error('❌ AI Services initialization failed:', error);
    }
  }, []);

  // Update user behavior patterns
  const updateUserBehavior = useCallback((behavior: Partial<UserBehaviorPattern>) => {
    setState(prev => ({
      ...prev,
      userBehavior: prev.userBehavior
        ? { ...prev.userBehavior, ...behavior }
        : {
            sessionId: Math.random().toString(36).substr(2, 9),
            pageViews: [],
            timeOnPages: {},
            interactions: [],
            deviceInfo: {
              userAgent: navigator.userAgent,
              viewport: { width: window.innerWidth, height: window.innerHeight },
              device: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop',
            },
            searchQueries: [],
            exitIntent: false,
            conversionProbability: 0,
            ...behavior,
          },
    }));
  }, []);

  // Set personalized content
  const setPersonalizedContent = useCallback((content: PersonalizedContent) => {
    setState(prev => ({
      ...prev,
      personalizedContent: content,
    }));
  }, []);

  // Voice interface controls
  const activateVoiceInterface = useCallback(() => {
    setState(prev => ({ ...prev, voiceInterfaceActive: true }));

    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'de-DE';

      recognition.onresult = (event: any) => {
        const last = event.results.length - 1;
        const command = event.results[last][0].transcript.toLowerCase();

        addVoiceCommand({
          command,
          intent: 'voice_command',
          confidence: event.results[last][0].confidence,
          executed: false,
        });
      };

      recognition.start();
      console.log('🎤 Voice interface activated');
    }
  }, []);

  const deactivateVoiceInterface = useCallback(() => {
    setState(prev => ({ ...prev, voiceInterfaceActive: false }));
    console.log('🔇 Voice interface deactivated');
  }, []);

  // Gesture control
  const activateGestureControl = useCallback(() => {
    setState(prev => ({ ...prev, gestureControl: true }));
    console.log('👆 Gesture control activated');
  }, []);

  // Emotion detection
  const activateEmotionDetection = useCallback(() => {
    setState(prev => ({ ...prev, emotionDetection: true }));
    console.log('😊 Emotion detection activated');
  }, []);

  // AR Mode toggle
  const toggleARMode = useCallback(() => {
    setState(prev => ({ ...prev, arMode: !prev.arMode }));
    console.log('🥽 AR mode toggled');
  }, []);

  // Voice command management
  const addVoiceCommand = useCallback((command: Omit<VoiceCommand, 'id' | 'timestamp'>) => {
    const newCommand: VoiceCommand = {
      ...command,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      voiceCommands: [...prev.voiceCommands, newCommand],
    }));

    console.log('🎤 Voice command received:', command);
  }, []);

  // Clear AI state
  const clearAIState = useCallback(() => {
    setState({
      integrationStatus: {
        initialized: false,
        services: {
          aiIntegration: false,
          apiIntegration: false,
          contentOptimization: false,
          keywordAnalysis: false,
          userBehaviorAnalysis: false,
          platformIntegration: false,
          semanticUnderstanding: false,
          monitoringAnalytics: false,
          futureProofing: false,
        },
        lastUpdate: null,
        errors: [],
      },
      userBehavior: null,
      personalizedContent: null,
      voiceInterfaceActive: false,
      gestureControl: false,
      emotionDetection: false,
      arMode: false,
      voiceCommands: [],
      isLoading: false,
      error: null,
    });
  }, []);

  // Initialize AI services on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      initializeAIServices();
    }, 2000); // Delay to not block initial render

    return () => clearTimeout(timer);
  }, [initializeAIServices]);

  // Track user behavior
  useEffect(() => {
    const handlePageView = () => {
      updateUserBehavior({
        pageViews: [...(state.userBehavior?.pageViews || []), window.location.pathname],
      });
    };

    window.addEventListener('popstate', handlePageView);
    return () => window.removeEventListener('popstate', handlePageView);
  }, [state.userBehavior?.pageViews, updateUserBehavior]);

  const value: AIContextType = {
    state,
    initializeAIServices,
    updateUserBehavior,
    setPersonalizedContent,
    activateVoiceInterface,
    deactivateVoiceInterface,
    activateGestureControl,
    activateEmotionDetection,
    toggleARMode,
    addVoiceCommand,
    clearAIState,
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
};

export const useAIState = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAIState must be used within an AIStateProvider');
  }
  return context;
};

export default AIStateProvider;
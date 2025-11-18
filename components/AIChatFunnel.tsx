import React from 'react';
import { Page } from '../types';
import AIChatContainer from './ai-chat/AIChatContainer';

interface AIChatFunnelProps {
  onOpen: () => void;
  currentPage: Page;
  initialContext?: string;
}

/**
 * AIChatFunnel - Refactored modular component
 *
 * This component has been completely refactored from a monolithic 1,594-line component
 * into a modular, maintainable architecture with the following improvements:
 *
 * **Custom Hooks:**
 * - useAIChatState.ts - Centralized state management
 * - useAIVoiceInput.ts - Voice recognition and text-to-speech
 * - useAIMessageProcessing.ts - AI API integration and message processing
 * - useAIChatPersistence.ts - Session storage and persistence
 * - useAIDocumentGeneration.ts - PDF and document generation
 *
 * **Component Modules:**
 * - AIChatContainer.tsx - Main container with orchestration logic (~300 lines)
 * - AIChatMessages.tsx - Message display and rendering (~200 lines)
 * - AIChatInput.tsx - User input handling (~150 lines)
 * - AIChatVoiceControls.tsx - Voice controls and language switching (~100 lines)
 *
 * **Service Layer:**
 * - AIChatService.ts - API integration with retry logic and error handling
 * - AICacheService.ts - Intelligent caching for performance optimization
 * - AIAnalyticsService.ts - Chat analytics and usage tracking
 *
 * **Supporting Components:**
 * - ConfigSlider.tsx - Service configuration sliders
 * - ConfirmationForm.tsx - Contact form validation
 * - RoofAnalysisCard.tsx - Roof analysis results display
 *
 * **Benefits:**
 * ✅ Reduced from 1,594 lines to ~50 lines in main component
 * ✅ Separation of concerns with single responsibility principle
 * ✅ Improved testability with isolated modules
 * ✅ Better reusability across different components
 * ✅ Enhanced maintainability and developer experience
 * ✅ Performance optimizations with caching and analytics
 * ✅ Type safety with comprehensive TypeScript definitions
 */
const AIChatFunnel: React.FC<AIChatFunnelProps> = ({ onOpen, currentPage, initialContext }) => {
    return <AIChatContainer onOpen={onOpen} currentPage={currentPage} initialContext={initialContext} />;
};

export default React.memo(AIChatFunnel);
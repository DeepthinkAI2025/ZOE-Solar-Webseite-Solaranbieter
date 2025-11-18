import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: Date;
  type?: 'text' | 'component' | 'error' | 'success';
  component?: React.ReactNode;
  options?: string[];
  metadata?: Record<string, unknown>;
}

export interface AIChatState {
  messages: Message[];
  isLoading: boolean;
  step: 'start' | 'greeting' | 'needs_analysis' | 'configuring_service' | 'final' | 'error';
  userInput: string;
  currentLang: 'de-DE' | 'en-US';
  isListening: boolean;
  voiceSupported: boolean;
  isOpen: boolean;
  currentPage: string | null;
  aiAvailable: boolean;
  sessionTimeout: number | null;
  contextualPrompts: string[];
  error: string | null;
}

const initialState: AIChatState = {
  messages: [],
  isLoading: false,
  step: 'start',
  userInput: '',
  currentLang: 'de-DE',
  isListening: false,
  voiceSupported: false,
  isOpen: false,
  currentPage: null,
  aiAvailable: false,
  sessionTimeout: null,
  contextualPrompts: [],
  error: null,
};

const aiChatSlice = createSlice({
  name: 'aiChat',
  initialState,
  reducers: {
    // Message management
    addUserMessage: (state, action: PayloadAction<string>) => {
      const message: Message = {
        id: Date.now().toString(),
        sender: 'user',
        text: action.payload,
        timestamp: new Date(),
      };
      state.messages.push(message);
    },
    addAIMessage: (state, action: PayloadAction<Omit<Message, 'sender' | 'timestamp'>>) => {
      const message: Message = {
        ...action.payload,
        sender: 'ai',
        timestamp: new Date(),
      };
      state.messages.push(message);
    },
    addSystemMessage: (state, action: PayloadAction<string>) => {
      const message: Message = {
        id: Date.now().toString(),
        sender: 'system',
        text: action.payload,
        timestamp: new Date(),
        type: 'text',
      };
      state.messages.push(message);
    },
    clearMessages: (state) => {
      state.messages = [];
    },

    // UI state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setStep: (state, action: PayloadAction<AIChatState['step']>) => {
      state.step = action.payload;
    },
    setUserInput: (state, action: PayloadAction<string>) => {
      state.userInput = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Language settings
    setCurrentLang: (state, action: PayloadAction<AIChatState['currentLang']>) => {
      state.currentLang = action.payload;
    },
    toggleLanguage: (state) => {
      state.currentLang = state.currentLang === 'de-DE' ? 'en-US' : 'de-DE';
    },

    // Voice functionality
    setListening: (state, action: PayloadAction<boolean>) => {
      state.isListening = action.payload;
    },
    setVoiceSupported: (state, action: PayloadAction<boolean>) => {
      state.voiceSupported = action.payload;
    },

    // Chat state
    openChat: (state, action: PayloadAction<string>) => {
      state.isOpen = true;
      state.currentPage = action.payload;
    },
    closeChat: (state) => {
      state.isOpen = false;
    },
    setAIAvailable: (state, action: PayloadAction<boolean>) => {
      state.aiAvailable = action.payload;
    },

    // Session management
    setSessionTimeout: (state, action: PayloadAction<number | null>) => {
      state.sessionTimeout = action.payload;
    },

    // Contextual prompts
    setContextualPrompts: (state, action: PayloadAction<string[]>) => {
      state.contextualPrompts = action.payload;
    },

    // Reset conversation
    resetConversation: (state, action?: PayloadAction<'de-DE' | 'en-US'>) => {
      const lang = action?.payload || state.currentLang;
      Object.assign(state, initialState);
      state.currentLang = lang;
    },

    // Session persistence
    loadConversation: (state, action: PayloadAction<Partial<AIChatState>>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const {
  addUserMessage,
  addAIMessage,
  addSystemMessage,
  clearMessages,
  setLoading,
  setStep,
  setUserInput,
  setError,
  setCurrentLang,
  toggleLanguage,
  setListening,
  setVoiceSupported,
  openChat,
  closeChat,
  setAIAvailable,
  setSessionTimeout,
  setContextualPrompts,
  resetConversation,
  loadConversation,
} = aiChatSlice.actions;

export default aiChatSlice.reducer;
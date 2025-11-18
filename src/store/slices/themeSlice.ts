import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Theme = 'day' | 'night' | 'seasonal';
export type ColorScheme = 'solar-bright' | 'solar-soft' | 'solar-midnight' | 'auto';

export interface UserPreferences {
  colorScheme: ColorScheme;
  fontSize: 'small' | 'medium' | 'large';
  language: 'de' | 'en';
  animations: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  voiceEnabled: boolean;
  autoPlayVideos: boolean;
  notifications: boolean;
  locationTracking: boolean;
  personalization: boolean;
}

export interface WeatherData {
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'night';
  humidity: number;
  windSpeed: number;
  location: string;
  timestamp: Date;
}

export interface ThemeState {
  theme: Theme;
  colorScheme: ColorScheme;
  userPreferences: UserPreferences;
  systemPreferences: {
    prefersDark: boolean;
    prefersReducedMotion: boolean;
    prefersHighContrast: boolean;
  };
  realTimeWeather: WeatherData | null;
  autoThemeAdjustment: boolean;
  customCSS: string;
  loading: boolean;
  error: string | null;
}

const initialState: ThemeState = {
  theme: 'day',
  colorScheme: 'solar-bright',
  userPreferences: {
    colorScheme: 'solar-bright',
    fontSize: 'medium',
    language: 'de',
    animations: true,
    reducedMotion: false,
    highContrast: false,
    voiceEnabled: false,
    autoPlayVideos: true,
    notifications: true,
    locationTracking: true,
    personalization: true,
  },
  systemPreferences: {
    prefersDark: false,
    prefersReducedMotion: false,
    prefersHighContrast: false,
  },
  realTimeWeather: null,
  autoThemeAdjustment: true,
  customCSS: '',
  loading: false,
  error: null,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    // Theme management
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
    setColorScheme: (state, action: PayloadAction<ColorScheme>) => {
      state.colorScheme = action.payload;
      state.userPreferences.colorScheme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'day' ? 'night' : 'day';
    },
    setAutoThemeAdjustment: (state, action: PayloadAction<boolean>) => {
      state.autoThemeAdjustment = action.payload;
    },

    // User preferences
    updateUserPreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      state.userPreferences = { ...state.userPreferences, ...action.payload };
    },
    setFontSize: (state, action: PayloadAction<UserPreferences['fontSize']>) => {
      state.userPreferences.fontSize = action.payload;
    },
    setLanguage: (state, action: PayloadAction<UserPreferences['language']>) => {
      state.userPreferences.language = action.payload;
    },
    toggleAnimations: (state) => {
      state.userPreferences.animations = !state.userPreferences.animations;
    },
    setReducedMotion: (state, action: PayloadAction<boolean>) => {
      state.userPreferences.reducedMotion = action.payload;
    },
    toggleHighContrast: (state) => {
      state.userPreferences.highContrast = !state.userPreferences.highContrast;
    },
    toggleVoiceEnabled: (state) => {
      state.userPreferences.voiceEnabled = !state.userPreferences.voiceEnabled;
    },
    toggleNotifications: (state) => {
      state.userPreferences.notifications = !state.userPreferences.notifications;
    },
    togglePersonalization: (state) => {
      state.userPreferences.personalization = !state.userPreferences.personalization;
    },

    // System preferences
    updateSystemPreferences: (state, action: PayloadAction<Partial<ThemeState['systemPreferences']>>) => {
      state.systemPreferences = { ...state.systemPreferences, ...action.payload };
    },
    setPrefersDark: (state, action: PayloadAction<boolean>) => {
      state.systemPreferences.prefersDark = action.payload;
    },
    setPrefersReducedMotion: (state, action: PayloadAction<boolean>) => {
      state.systemPreferences.prefersReducedMotion = action.payload;
      state.userPreferences.reducedMotion = action.payload;
    },

    // Weather integration
    setRealTimeWeather: (state, action: PayloadAction<WeatherData>) => {
      state.realTimeWeather = action.payload;

      // Auto-adjust theme based on weather if enabled
      if (state.autoThemeAdjustment) {
        switch (action.payload.condition) {
          case 'sunny':
            state.theme = 'day';
            state.colorScheme = 'solar-bright';
            break;
          case 'cloudy':
            state.theme = 'day';
            state.colorScheme = 'solar-soft';
            break;
          case 'night':
            state.theme = 'night';
            state.colorScheme = 'solar-midnight';
            break;
          case 'rainy':
          case 'snowy':
            state.theme = 'day';
            state.colorScheme = 'solar-soft';
            break;
        }
      }
    },

    // Weather-based theme adjustment
    adjustThemeBasedOnWeather: (state, action: PayloadAction<WeatherData>) => {
      if (!state.autoThemeAdjustment) return;

      const weather = action.payload;
      switch (weather.condition) {
        case 'sunny':
          state.theme = 'day';
          state.colorScheme = 'solar-bright';
          break;
        case 'cloudy':
          state.theme = 'day';
          state.colorScheme = 'solar-soft';
          break;
        case 'night':
          state.theme = 'night';
          state.colorScheme = 'solar-midnight';
          break;
        case 'rainy':
        case 'snowy':
          state.theme = 'day';
          state.colorScheme = 'solar-soft';
          break;
      }
    },

    // Custom CSS
    setCustomCSS: (state, action: PayloadAction<string>) => {
      state.customCSS = action.payload;
    },

    // Loading and error states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Reset
    resetTheme: (state) => {
      Object.assign(state, initialState);
    },
    resetUserPreferences: (state) => {
      state.userPreferences = { ...initialState.userPreferences };
    },
  },
});

export const {
  setTheme,
  setColorScheme,
  toggleTheme,
  setAutoThemeAdjustment,
  updateUserPreferences,
  setFontSize,
  setLanguage,
  toggleAnimations,
  setReducedMotion,
  toggleHighContrast,
  toggleVoiceEnabled,
  toggleNotifications,
  togglePersonalization,
  updateSystemPreferences,
  setPrefersDark,
  setPrefersReducedMotion,
  setRealTimeWeather,
  adjustThemeBasedOnWeather,
  setCustomCSS,
  setLoading,
  setError,
  resetTheme,
  resetUserPreferences,
} = themeSlice.actions;

export default themeSlice.reducer;
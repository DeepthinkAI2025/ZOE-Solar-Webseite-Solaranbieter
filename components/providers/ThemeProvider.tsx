import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// Weather Data Interface
export interface WeatherData {
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'night' | string;
  temperature?: number;
  humidity?: number;
  windSpeed?: number;
  location?: string;
}

// User Preferences Interface
export interface UserPreferences {
  colorScheme: 'solar-green' | 'solar-bright' | 'solar-soft' | 'solar-midnight' | 'dark' | 'light';
  animationLevel: 'none' | 'basic' | 'advanced' | 'enhanced';
  interactionMode: 'standard' | 'accessible' | 'touch-friendly';
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
  highContrast: boolean;
  autoTheme: boolean;
  weatherBasedTheme: boolean;
}

// Theme Configuration
export interface ThemeConfig {
  mode: 'day' | 'night' | 'seasonal';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    error: string;
    warning: string;
    success: string;
    info: string;
  };
  typography: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  transitions: {
    fast: string;
    normal: string;
    slow: string;
  };
}

// Theme State
export interface ThemeState {
  theme: ThemeConfig;
  currentMode: 'day' | 'night' | 'seasonal';
  preferences: UserPreferences;
  weather: WeatherData | null;
  isLoading: boolean;
  customThemes: Record<string, ThemeConfig>;
}

interface ThemeContextType {
  state: ThemeState;
  setTheme: (mode: 'day' | 'night' | 'seasonal') => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  setWeather: (weather: WeatherData) => void;
  createCustomTheme: (name: string, theme: Partial<ThemeConfig>) => void;
  applyCustomTheme: (name: string) => void;
  resetToDefault: () => void;
  exportTheme: () => string;
  importTheme: (themeData: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Default Theme Configurations
const defaultThemes: Record<'day' | 'night' | 'seasonal', ThemeConfig> = {
  day: {
    mode: 'day',
    colors: {
      primary: '#059669',      // Green-600
      secondary: '#0891b2',    // Cyan-600
      accent: '#f59e0b',       // Amber-500
      background: '#ffffff',   // White
      surface: '#f8fafc',      // Slate-50
      text: '#1e293b',         // Slate-800
      textSecondary: '#64748b', // Slate-500
      error: '#dc2626',        // Red-600
      warning: '#d97706',      // Amber-600
      success: '#059669',      // Green-600
      info: '#2563eb',         // Blue-600
    },
    typography: {
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
      fontSize: '16px',
      fontWeight: '400',
      lineHeight: '1.6',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      xxl: '3rem',
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
    },
    transitions: {
      fast: '150ms ease-in-out',
      normal: '300ms ease-in-out',
      slow: '500ms ease-in-out',
    },
  },
  night: {
    mode: 'night',
    colors: {
      primary: '#10b981',      // Green-500
      secondary: '#06b6d4',    // Cyan-500
      accent: '#fbbf24',       // Amber-400
      background: '#0f172a',   // Slate-900
      surface: '#1e293b',      // Slate-800
      text: '#f1f5f9',         // Slate-100
      textSecondary: '#94a3b8', // Slate-400
      error: '#f87171',        // Red-400
      warning: '#fbbf24',      // Amber-400
      success: '#34d399',      // Green-400
      info: '#60a5fa',         // Blue-400
    },
    typography: {
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
      fontSize: '16px',
      fontWeight: '400',
      lineHeight: '1.6',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      xxl: '3rem',
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4)',
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
    },
    transitions: {
      fast: '150ms ease-in-out',
      normal: '300ms ease-in-out',
      slow: '500ms ease-in-out',
    },
  },
  seasonal: {
    mode: 'seasonal',
    colors: {
      primary: '#059669',      // Green-600 (Summer)
      secondary: '#ea580c',    // Orange-600 (Autumn)
      accent: '#7c3aed',       // Violet-600 (Spring)
      background: '#ffffff',   // White (Winter)
      surface: '#fef3c7',      // Amber-50
      text: '#1e293b',         // Slate-800
      textSecondary: '#64748b', // Slate-500
      error: '#dc2626',        // Red-600
      warning: '#d97706',      // Amber-600
      success: '#059669',      // Green-600
      info: '#2563eb',         // Blue-600
    },
    typography: {
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
      fontSize: '16px',
      fontWeight: '400',
      lineHeight: '1.6',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      xxl: '3rem',
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
    },
    transitions: {
      fast: '150ms ease-in-out',
      normal: '300ms ease-in-out',
      slow: '500ms ease-in-out',
    },
  },
};

// Default User Preferences
const defaultPreferences: UserPreferences = {
  colorScheme: 'solar-green',
  animationLevel: 'advanced',
  interactionMode: 'standard',
  fontSize: 'medium',
  reducedMotion: false,
  highContrast: false,
  autoTheme: true,
  weatherBasedTheme: true,
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [state, setState] = useState<ThemeState>({
    theme: defaultThemes.day,
    currentMode: 'day',
    preferences: defaultPreferences,
    weather: null,
    isLoading: false,
    customThemes: {},
  });

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem('theme-preferences');
    const savedMode = localStorage.getItem('theme-mode');
    const savedCustomThemes = localStorage.getItem('custom-themes');

    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences);
        setState(prev => ({
          ...prev,
          preferences: { ...defaultPreferences, ...preferences },
        }));
      } catch (error) {
        console.warn('Failed to parse saved theme preferences:', error);
      }
    }

    if (savedMode) {
      setTheme(savedMode as 'day' | 'night' | 'seasonal');
    }

    if (savedCustomThemes) {
      try {
        const customThemes = JSON.parse(savedCustomThemes);
        setState(prev => ({
          ...prev,
          customThemes,
        }));
      } catch (error) {
        console.warn('Failed to parse saved custom themes:', error);
      }
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('theme-preferences', JSON.stringify(state.preferences));
  }, [state.preferences]);

  useEffect(() => {
    localStorage.setItem('theme-mode', state.currentMode);
  }, [state.currentMode]);

  useEffect(() => {
    localStorage.setItem('custom-themes', JSON.stringify(state.customThemes));
  }, [state.customThemes]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    const theme = state.theme;

    // Apply CSS custom properties
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    Object.entries(theme.typography).forEach(([key, value]) => {
      root.style.setProperty(`--typography-${key}`, value);
    });

    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });

    Object.entries(theme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });

    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value);
    });

    Object.entries(theme.transitions).forEach(([key, value]) => {
      root.style.setProperty(`--transition-${key}`, value);
    });

    // Apply data attributes
    root.setAttribute('data-theme', theme.mode);
    root.setAttribute('data-color-scheme', state.preferences.colorScheme);
    root.setAttribute('data-animation-level', state.preferences.animationLevel);
    root.setAttribute('data-interaction-mode', state.preferences.interactionMode);
    root.setAttribute('data-font-size', state.preferences.fontSize);

    // Apply accessibility preferences
    if (state.preferences.reducedMotion) {
      root.setAttribute('data-reduced-motion', 'true');
    } else {
      root.removeAttribute('data-reduced-motion');
    }

    if (state.preferences.highContrast) {
      root.setAttribute('data-high-contrast', 'true');
    } else {
      root.removeAttribute('data-high-contrast');
    }

  }, [state.theme, state.preferences]);

  // Auto-detect time of day
  useEffect(() => {
    if (state.preferences.autoTheme) {
      const hour = new Date().getHours();
      const shouldBeNight = hour >= 20 || hour < 6;

      if (shouldBeNight && state.currentMode !== 'night') {
        setTheme('night');
      } else if (!shouldBeNight && state.currentMode !== 'day') {
        setTheme('day');
      }
    }
  }, [state.preferences.autoTheme, state.currentMode]);

  // Weather-based theme adjustment
  useEffect(() => {
    if (state.preferences.weatherBasedTheme && state.weather) {
      adjustThemeBasedOnWeather(state.weather);
    }
  }, [state.weather, state.preferences.weatherBasedTheme]);

  // Set theme mode
  const setTheme = useCallback((mode: 'day' | 'night' | 'seasonal') => {
    setState(prev => ({
      ...prev,
      currentMode: mode,
      theme: prev.customThemes[mode] || defaultThemes[mode],
    }));
  }, []);

  // Update preferences
  const updatePreferences = useCallback((preferences: Partial<UserPreferences>) => {
    setState(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...preferences },
    }));
  }, []);

  // Set weather data
  const setWeather = useCallback((weather: WeatherData) => {
    setState(prev => ({ ...prev, weather }));
  }, []);

  // Create custom theme
  const createCustomTheme = useCallback((name: string, themeConfig: Partial<ThemeConfig>) => {
    setState(prev => {
      const baseTheme = defaultThemes[prev.currentMode];
      const customTheme: ThemeConfig = {
        ...baseTheme,
        ...themeConfig,
        mode: prev.currentMode,
      };

      return {
        ...prev,
        customThemes: {
          ...prev.customThemes,
          [name]: customTheme,
        },
        theme: customTheme,
      };
    });
  }, []);

  // Apply custom theme
  const applyCustomTheme = useCallback((name: string) => {
    setState(prev => {
      const customTheme = prev.customThemes[name];
      if (customTheme) {
        return { ...prev, theme: customTheme };
      }
      return prev;
    });
  }, []);

  // Reset to default
  const resetToDefault = useCallback(() => {
    setState(prev => ({
      ...prev,
      theme: defaultThemes[prev.currentMode],
      preferences: defaultPreferences,
      customThemes: {},
    }));
  }, []);

  // Export theme
  const exportTheme = useCallback(() => {
    const exportData = {
      currentMode: state.currentMode,
      preferences: state.preferences,
      customThemes: state.customThemes,
      theme: state.theme,
    };
    return JSON.stringify(exportData, null, 2);
  }, [state]);

  // Import theme
  const importTheme = useCallback((themeData: string) => {
    try {
      const imported = JSON.parse(themeData);

      setState(prev => ({
        ...prev,
        currentMode: imported.currentMode || 'day',
        preferences: { ...defaultPreferences, ...imported.preferences },
        customThemes: imported.customThemes || {},
        theme: imported.theme || defaultThemes.day,
      }));

    } catch (error) {
      console.error('Failed to import theme:', error);
      throw new Error('Invalid theme data');
    }
  }, []);

  // Adjust theme based on weather
  const adjustThemeBasedOnWeather = useCallback((weather: WeatherData) => {
    if (!state.preferences.weatherBasedTheme) return;

    let newColorScheme: UserPreferences['colorScheme'] = state.preferences.colorScheme;

    switch (weather.condition) {
      case 'sunny':
        newColorScheme = 'solar-bright';
        break;
      case 'cloudy':
        newColorScheme = 'solar-soft';
        break;
      case 'night':
        setTheme('night');
        newColorScheme = 'solar-midnight';
        break;
      default:
        newColorScheme = 'solar-green';
    }

    updatePreferences({ colorScheme: newColorScheme });
  }, [state.preferences.weatherBasedTheme, state.preferences.colorScheme, setTheme, updatePreferences]);

  // Fetch weather data (mock function - would integrate with real weather API)
  useEffect(() => {
    if (state.preferences.weatherBasedTheme && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        // Mock weather data - replace with real API call
        const mockWeather: WeatherData = {
          condition: 'sunny',
          temperature: 22,
          humidity: 65,
          location: 'Berlin',
        };
        setWeather(mockWeather);
      });
    }
  }, [state.preferences.weatherBasedTheme, setWeather]);

  const value: ThemeContextType = {
    state,
    setTheme,
    updatePreferences,
    setWeather,
    createCustomTheme,
    applyCustomTheme,
    resetToDefault,
    exportTheme,
    importTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeState = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeState must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
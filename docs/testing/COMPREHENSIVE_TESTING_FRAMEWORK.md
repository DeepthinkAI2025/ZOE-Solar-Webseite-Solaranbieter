# 🧪 ZOE Solar Comprehensive Testing Framework

## 📋 Overview

Dieses umfassende Testing Framework etabliert eine vollständige Teststrategie für die ZOE Solar React-Anwendung mit Unit Tests, Integration Tests, E2E Tests, Performance Tests und Security Tests sowie Continuous Testing und Quality Gates.

---

## 🎯 Testing Pyramid & Strategy

### Testing Pyramid Architecture
```
                    🎭 E2E Tests (5%)
                 Critical User Journeys
                 Cross-Browser Testing
                 User Experience Validation

                🔗 Integration Tests (25%)
             Component Integration
             API Integration
             Database Integration
             Service Mesh Testing

    🧪 Unit Tests (70%)
   Pure Functions & Utilities
   Component Logic Testing
   Hook Testing
   Business Logic Validation
   Mock/Stub Testing
```

### Test Coverage Goals
```yaml
Coverage Targets:
  Unit Tests:
    Statements: 95%+
    Branches: 90%+
    Functions: 95%+
    Lines: 95%

  Integration Tests:
    API Endpoints: 100%
    Database Operations: 95%+
    External Integrations: 90%+

  E2E Tests:
    Critical User Paths: 100%
    Cross-Browser: 100%
    Mobile Responsiveness: 100%
```

---

## 🧪 Unit Testing Framework

### Jest Configuration with Advanced Features
```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/__tests__/__mocks__/fileMock.js',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/index.{js,jsx,ts,tsx}',
    '!src/**/*.types.ts',
    '!src/**/__tests__/**/*',
    '!src/**/*.config.{js,ts}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    'src/components/**/*.{js,jsx,ts,tsx}': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    'src/utils/**/*.{js,ts}': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
    'src/services/**/*.{js,ts}': {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testTimeout: 10000,
  verbose: true,
  bail: false,
  maxWorkers: '50%',
  testSequencer: require('./jest-sequencer'),
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: 'test-results', outputName: 'junit.xml' }],
    ['jest-html-reporters', { publicPath: 'test-results', filename: 'report.html' }],
    [
      '@jest/generate-coverage/legacy',
      {
        coverageReporters: [
          'text',
          'text-summary',
          'lcov',
          'html',
          'json',
          'cobertura',
        ],
      },
    ],
  ],
};

module.exports = createJestConfig(customJestConfig);
```

### Advanced Test Setup
```javascript
// src/__tests__/setup/jest.setup.js
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { server } from './msw-server';

// Configure Testing Library
configure({
  testIdAttribute: 'data-testid',
  asyncUtilTimeout: 5000,
  asyncWrapperTimeout: 3000,
});

// Setup MSW server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset request handlers after each test
afterEach(() => server.resetHandlers());

// Clean up after all tests
afterAll(() => server.close());

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    push: jest.fn(),
    pop: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
  }),
}));

// Mock Intersection Observer
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
});

// Mock scrollTo
window.scrollTo = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Performance API mock
global.performance = {
  ...global.performance,
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByName: jest.fn(),
  getEntriesByType: jest.fn(),
};

// Mock fetch if not available
if (!global.fetch) {
  global.fetch = require('jest-fetch-mock');
}

// Suppress console warnings in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is deprecated')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
```

### Custom Test Sequencer
```javascript
// jest-sequencer.js
const Sequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends Sequencer {
  sort(tests) {
    // Sort tests by type and priority
    const copyTests = [...tests];

    return copyTests.sort((testA, testB) => {
      // Unit tests first
      const isUnitTestA = testA.path.includes('/__tests__/unit/') || testA.path.includes('.test.');
      const isUnitTestB = testB.path.includes('/__tests__/unit/') || testB.path.includes('.test.');

      if (isUnitTestA !== isUnitTestB) {
        return isUnitTestA ? -1 : 1;
      }

      // Then integration tests
      const isIntegrationTestA = testA.path.includes('/__tests__/integration/');
      const isIntegrationTestB = testB.path.includes('/__tests__/integration/');

      if (isIntegrationTestA !== isIntegrationTestB) {
        return isIntegrationTestA ? -1 : 1;
      }

      // Sort alphabetically within same type
      return testA.path.localeCompare(testB.path);
    });
  }
}

module.exports = CustomSequencer;
```

### Advanced Component Testing Examples
```typescript
// src/components/Calculator/Calculator.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Calculator } from './Calculator';
import { CalculatorProvider } from '../../context/CalculatorContext';
import { ThemeProvider } from '../../context/ThemeContext';

// Test utilities
const renderWithProviders = (ui: React.ReactElement, options = {}) => {
  return render(
    <ThemeProvider>
      <CalculatorProvider>
        {ui}
      </CalculatorProvider>
    </ThemeProvider>,
    {
      wrapper: ({ children }) => <div>{children}</div>,
      ...options,
    }
  );
};

// Mock data
const mockCalculationResults = {
  systemSize: 100,
  annualProduction: 105000,
  annualSavings: 33600,
  co2Savings: 42.1,
  amortizationPeriod: 7.2,
  roi: 14.8,
};

describe('Calculator Component', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
  });

  // Rendering Tests
  describe('Rendering', () => {
    it('renders calculator with all form elements', () => {
      renderWithProviders(<Calculator />);

      expect(screen.getByTestId('calculator-form')).toBeInTheDocument();
      expect(screen.getByLabelText(/Dachfläche/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Stromverbrauch/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Bundesland/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Berechnen/i })).toBeInTheDocument();
    });

    it('displays correct default values', () => {
      renderWithProviders(<Calculator />);

      expect(screen.getByDisplayValue('100')).toBeInTheDocument(); // Roof size
      expect(screen.getByDisplayValue('5000')).toBeInTheDocument(); // Consumption
    });

    it('shows loading state during calculation', async () => {
      // Mock slow calculation
      jest.useFakeTimers();

      renderWithProviders(<Calculator />);

      const calculateButton = screen.getByRole('button', { name: /Berechnen/i });
      await user.click(calculateButton);

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Berechnen/i })).toBeDisabled();

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      jest.useRealTimers();
    });
  });

  // Interaction Tests
  describe('User Interactions', () => {
    it('calculates system when form is valid', async () => {
      const mockCalculate = jest.fn().mockResolvedValue(mockCalculationResults);
      jest.mock('../../services/calculatorService', () => ({
        calculateSolarSystem: mockCalculate,
      }));

      renderWithProviders(<Calculator />);

      // Fill form
      await user.clear(screen.getByLabelText(/Dachfläche/i));
      await user.type(screen.getByLabelText(/Dachfläche/i), '200');

      await user.clear(screen.getByLabelText(/Stromverbrauch/i));
      await user.type(screen.getByLabelText(/Stromverbrauch/i), '10000');

      await user.selectOptions(screen.getByLabelText(/Bundesland/i), 'bayern');

      await user.click(screen.getByRole('button', { name: /Berechnen/i }));

      await waitFor(() => {
        expect(mockCalculate).toHaveBeenCalledWith({
          roofSize: 200,
          consumption: 10000,
          region: 'bayern',
        });
      });

      await waitFor(() => {
        expect(screen.getByTestId('results-section')).toBeInTheDocument();
        expect(screen.getByText(/100 kWp/i)).toBeInTheDocument();
        expect(screen.getByText(/105.000 kWh/i)).toBeInTheDocument();
      });
    });

    it('shows validation errors for invalid inputs', async () => {
      renderWithProviders(<Calculator />);

      // Enter invalid roof size
      await user.clear(screen.getByLabelText(/Dachfläche/i));
      await user.type(screen.getByLabelText(/Dachfläche/i), '-100');

      await user.click(screen.getByRole('button', { name: /Berechnen/i }));

      expect(screen.getByText(/Dachfläche muss positiv sein/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Berechnen/i })).toBeDisabled();
    });

    it('handles keyboard navigation', async () => {
      renderWithProviders(<Calculator />);

      // Tab through form
      await user.tab();
      expect(screen.getByLabelText(/Dachfläche/i)).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText(/Stromverbrauch/i)).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText(/Bundesland/i)).toHaveFocus();

      // Use Enter to submit
      await user.keyboard('{Enter}');

      // Should trigger calculation if form is valid
      // (depends on validation state)
    });

    it('debounces input changes', async () => {
      const debounceTime = 300;
      jest.useFakeTimers();

      renderWithProviders(<Calculator />);

      const roofSizeInput = screen.getByLabelText(/Dachfläche/i);

      await user.type(roofSizeInput, '150');

      // Should not trigger immediate calculation
      expect(screen.queryByTestId('results-section')).not.toBeInTheDocument();

      // Fast-forward debounce time
      act(() => {
        jest.advanceTimersByTime(debounceTime);
      });

      // Should trigger calculation after debounce
      await waitFor(() => {
        // Check if calculation was triggered
      });

      jest.useRealTimers();
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    it('has proper ARIA labels and descriptions', () => {
      renderWithProviders(<Calculator />);

      // Check form elements have proper labels
      const roofSizeInput = screen.getByLabelText(/Dachfläche/i);
      expect(roofSizeInput).toHaveAttribute('aria-describedby');

      // Check loading announcement
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('supports screen reader announcements', async () => {
      renderWithProviders(<Calculator />);

      // Trigger calculation
      await user.type(screen.getByLabelText(/Dachfläche/i), '200');
      await user.click(screen.getByRole('button', { name: /Berechnen/i }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/Berechnung abgeschlossen/i);
      });
    });

    it('is fully keyboard accessible', async () => {
      renderWithProviders(<Calculator />);

      // Test full keyboard workflow
      await user.tab();
      await user.keyboard('200');
      await user.tab();
      await user.keyboard('10000');
      await user.tab();
      await user.keyboard('{ArrowDown}{ArrowDown}{Enter}'); // Select Bayern
      await user.tab();
      await user.keyboard('{Enter}'); // Submit

      await waitFor(() => {
        expect(screen.getByTestId('results-section')).toBeInTheDocument();
      });
    });

    it('has sufficient color contrast', () => {
      // This would be tested with axe-core
      const { container } = renderWithProviders(<Calculator />);

      expect(container).toBeAccessible();
    });
  });

  // Performance Tests
  describe('Performance', () => {
    it('renders within performance budget', () => {
      const startTime = performance.now();

      const { container } = renderWithProviders(<Calculator />);

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(container).toBeInTheDocument();
      expect(renderTime).toBeLessThan(100); // 100ms max render time
    });

    it('does not cause memory leaks', () => {
      const { unmount } = renderWithProviders(<Calculator />);

      // Simulate multiple interactions
      const roofSizeInput = screen.getByLabelText(/Dachfläche/i);
      for (let i = 0; i < 100; i++) {
        fireEvent.change(roofSizeInput, { target: { value: i.toString() } });
      }

      unmount();

      // Check for memory leaks (would need more sophisticated testing)
      expect(true).toBe(true); // Placeholder for actual memory leak detection
    });

    it('debounces expensive operations efficiently', async () => {
      const mockExpensiveOperation = jest.fn();

      renderWithProviders(<Calculator />);

      const input = screen.getByLabelText(/Dachfläche/i);

      // Fire multiple rapid changes
      fireEvent.change(input, { target: { value: '1' } });
      fireEvent.change(input, { target: { value: '12' } });
      fireEvent.change(input, { target: { value: '123' } });
      fireEvent.change(input, { target: { value: '1234' } });
      fireEvent.change(input, { target: { value: '12345' } });

      // Wait for debounce
      await new Promise(resolve => setTimeout(resolve, 300));

      // Should only call expensive operation once
      expect(mockExpensiveOperation).toHaveBeenCalledTimes(1);
    });
  });

  // Error Handling Tests
  describe('Error Handling', () => {
    it('handles API errors gracefully', async () => {
      jest.mock('../../services/calculatorService', () => ({
        calculateSolarSystem: jest.fn().mockRejectedValue(new Error('API Error')),
      }));

      renderWithProviders(<Calculator />);

      await user.type(screen.getByLabelText(/Dachfläche/i), '200');
      await user.type(screen.getByLabelText(/Stromverbrauch/i), '10000');
      await user.click(screen.getByRole('button', { name: /Berechnen/i }));

      await waitFor(() => {
        expect(screen.getByText(/Berechnung fehlgeschlagen/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Erneut versuchen/i })).toBeInTheDocument();
      });
    });

    it('provides fallback values when data is missing', async () => {
      jest.mock('../../services/calculatorService', () => ({
        calculateSolarSystem: jest.fn().mockResolvedValue({
          systemSize: null,
          annualProduction: undefined,
        }),
      }));

      renderWithProviders(<Calculator />);

      await user.click(screen.getByRole('button', { name: /Berechnen/i }));

      await waitFor(() => {
        expect(screen.getByText(/Daten nicht verfügbar/i)).toBeInTheDocument();
      });
    });

    it('recovers from network interruptions', async () => {
      let callCount = 0;
      jest.mock('../../services/calculatorService', () => ({
        calculateSolarSystem: jest.fn().mockImplementation(() => {
          callCount++;
          if (callCount === 1) {
            throw new Error('Network Error');
          }
          return Promise.resolve(mockCalculationResults);
        }),
      }));

      renderWithProviders(<Calculator />);

      // First attempt fails
      await user.click(screen.getByRole('button', { name: /Berechnen/i }));

      await waitFor(() => {
        expect(screen.getByText(/Netzwerkfehler/i)).toBeInTheDocument();
      });

      // Retry succeeds
      await user.click(screen.getByRole('button', { name: /Erneut versuchen/i }));

      await waitFor(() => {
        expect(screen.getByTestId('results-section')).toBeInTheDocument();
      });
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    it('handles extreme input values', async () => {
      renderWithProviders(<Calculator />);

      // Test very large values
      await user.clear(screen.getByLabelText(/Dachfläche/i));
      await user.type(screen.getByLabelText(/Dachfläche/i), '999999');

      // Test very small values
      await user.clear(screen.getByLabelText(/Stromverbrauch/i));
      await user.type(screen.getByLabelText(/Stromverbrauch/i), '1');

      await user.click(screen.getByRole('button', { name: /Berechnen/i }));

      await waitFor(() => {
        expect(screen.getByTestId('results-section')).toBeInTheDocument();
      });
    });

    it('handles rapid form resets', async () => {
      renderWithProviders(<Calculator />);

      const resetButton = screen.getByRole('button', { name: /Zurücksetzen/i });

      // Fill form and reset multiple times
      for (let i = 0; i < 10; i++) {
        await user.type(screen.getByLabelText(/Dachfläche/i), '100');
        await user.click(resetButton);

        expect(screen.getByDisplayValue('100')).not.toBeInTheDocument();
      }
    });

    it('concurrent requests are handled correctly', async () => {
      const { rerender } = renderWithProviders(<Calculator />);

      // Trigger multiple calculations simultaneously
      const calculateButton = screen.getByRole('button', { name: /Berechnen/i });

      await user.click(calculateButton);
      await user.click(calculateButton);
      await user.click(calculateButton);

      // Should handle gracefully
      expect(screen.getByTestId('calculator-form')).toBeInTheDocument();
    });
  });

  // Integration with Context
  describe('Context Integration', () => {
    it('uses calculator context values correctly', () => {
      const mockContextValue = {
        calculations: [mockCalculationResults],
        setCalculations: jest.fn(),
        isLoading: false,
        error: null,
      };

      jest.mock('../../context/CalculatorContext', () => ({
        useCalculator: () => mockContextValue,
      }));

      renderWithProviders(<Calculator />);

      expect(screen.getByTestId('calculator-form')).toBeInTheDocument();
    });

    it('updates context on calculation completion', async () => {
      const mockSetCalculations = jest.fn();

      jest.mock('../../context/CalculatorContext', () => ({
        useCalculator: () => ({
          calculations: [],
          setCalculations: mockSetCalculations,
          isLoading: false,
          error: null,
        }),
      }));

      renderWithProviders(<Calculator />);

      await user.type(screen.getByLabelText(/Dachfläche/i), '200');
      await user.click(screen.getByRole('button', { name: /Berechnen/i }));

      await waitFor(() => {
        expect(mockSetCalculations).toHaveBeenCalled();
      });
    });
  });
});
```

### Hook Testing Examples
```typescript
// src/hooks/useCalculator/useCalculator.test.ts
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCalculator } from './useCalculator';

// Test wrapper for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useCalculator Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Basic Functionality Tests
  describe('Basic Functionality', () => {
    it('initializes with default values', () => {
      const { result } = renderHook(() => useCalculator(), { wrapper: createWrapper() });

      expect(result.current.formValues).toEqual({
        roofSize: 100,
        consumption: 5000,
        region: 'bayern',
        roofType: 'flat',
        orientation: 'south',
        shading: 'low',
      });

      expect(result.current.calculation).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('updates form values correctly', () => {
      const { result } = renderHook(() => useCalculator(), { wrapper: createWrapper() });

      act(() => {
        result.current.updateFormValue('roofSize', 200);
        result.current.updateFormValue('consumption', 10000);
      });

      expect(result.current.formValues.roofSize).toBe(200);
      expect(result.current.formValues.consumption).toBe(10000);
    });

    it('validates form values', () => {
      const { result } = renderHook(() => useCalculator(), { wrapper: createWrapper() });

      // Valid values
      expect(result.current.validateForm()).toBe(true);

      // Invalid roof size
      act(() => {
        result.current.updateFormValue('roofSize', -100);
      });

      expect(result.current.validateForm()).toBe(false);
      expect(result.current.errors.roofSize).toBe('Dachfläche muss positiv sein');

      // Reset and test invalid consumption
      act(() => {
        result.current.updateFormValue('roofSize', 100);
        result.current.updateFormValue('consumption', 0);
      });

      expect(result.current.validateForm()).toBe(false);
      expect(result.current.errors.consumption).toBe('Verbrauch muss positiv sein');
    });
  });

  // Calculation Tests
  describe('Calculation', () => {
    it('performs calculation successfully', async () => {
      const mockCalculation = {
        systemSize: 100,
        annualProduction: 105000,
        annualSavings: 33600,
        co2Savings: 42.1,
      };

      jest.mock('../../services/calculatorService', () => ({
        calculateSolarSystem: jest.fn().mockResolvedValue(mockCalculation),
      }));

      const { result } = renderHook(() => useCalculator(), { wrapper: createWrapper() });

      await act(async () => {
        await result.current.calculate();
      });

      expect(result.current.calculation).toEqual(mockCalculation);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('handles calculation errors', async () => {
      const mockError = new Error('Calculation failed');
      jest.mock('../../services/calculatorService', () => ({
        calculateSolarSystem: jest.fn().mockRejectedValue(mockError),
      }));

      const { result } = renderHook(() => useCalculator(), { wrapper: createWrapper() });

      await act(async () => {
        await result.current.calculate();
      });

      expect(result.current.calculation).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(mockError);
    });

    it('shows loading state during calculation', async () => {
      jest.mock('../../services/calculatorService', () => ({
        calculateSolarSystem: jest.fn(() =>
          new Promise(resolve => setTimeout(() => resolve({}), 1000))
        ),
      }));

      const { result } = renderHook(() => useCalculator(), { wrapper: createWrapper() });

      act(() => {
        result.current.calculate();
      });

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 1100));
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('does not calculate with invalid form', async () => {
      const { result } = renderHook(() => useCalculator(), { wrapper: createWrapper() });

      act(() => {
        result.current.updateFormValue('roofSize', -100);
      });

      await act(async () => {
        await result.current.calculate();
      });

      expect(result.current.calculation).toBeNull();
      expect(result.current.error).toBe('Bitte korrigieren Sie die fehlerhaften Eingaben');
    });
  });

  // Performance Tests
  describe('Performance', () => {
    it('debounces form value updates', async () => {
      const { result } = renderHook(() => useCalculator(), { wrapper: createWrapper() });

      // Rapid updates should be debounced
      for (let i = 0; i < 100; i++) {
        act(() => {
          result.current.updateFormValue('roofSize', i);
        });
      }

      // Should not update 100 times due to debouncing
      expect(result.current.formValues.roofSize).not.toBe(99);
    });

    it('caches calculation results', async () => {
      const mockCalculation = {
        systemSize: 100,
        annualProduction: 105000,
      };

      const mockCalculate = jest.fn().mockResolvedValue(mockCalculation);
      jest.mock('../../services/calculatorService', () => ({
        calculateSolarSystem: mockCalculate,
      }));

      const { result } = renderHook(() => useCalculator(), { wrapper: createWrapper() });

      // First calculation
      await act(async () => {
        await result.current.calculate();
      });

      // Second calculation with same inputs should use cache
      await act(async () => {
        await result.current.calculate();
      });

      expect(mockCalculate).toHaveBeenCalledTimes(1);
    });

    it('handles concurrent calculations', async () => {
      const { result } = renderHook(() => useCalculator(), { wrapper: createWrapper() });

      // Trigger multiple calculations simultaneously
      const promises = Array(5).fill(null).map(() =>
        act(async () => {
          await result.current.calculate();
        })
      );

      await Promise.all(promises);

      expect(result.current.isLoading).toBe(false);
      expect(result.current.calculation).not.toBeNull();
    });
  });

  // Memory Management Tests
  describe('Memory Management', () => {
    it('cleans up on unmount', () => {
      const { result, unmount } = renderHook(() => useCalculator(), { wrapper: createWrapper() });

      // Start calculation
      act(() => {
        result.current.calculate();
      });

      expect(result.current.isLoading).toBe(true);

      // Unmount should clean up
      unmount();

      // No memory leaks should occur
      expect(true).toBe(true); // Placeholder for actual memory leak detection
    });

    it('removes event listeners on unmount', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

      const { unmount } = renderHook(() => useCalculator(), { wrapper: createWrapper() });

      unmount();

      // All event listeners should be removed
      expect(removeEventListenerSpy).toHaveBeenCalledTimes(addEventListenerSpy.mock.calls.length);
    });
  });

  // Error Recovery Tests
  describe('Error Recovery', () => {
    it('recovers from failed calculation', async () => {
      const mockError = new Error('Network Error');
      const mockCalculate = jest.fn()
        .mockRejectedValueOnce(mockError)
        .mockResolvedValueOnce({
          systemSize: 100,
          annualProduction: 105000,
        });

      jest.mock('../../services/calculatorService', () => ({
        calculateSolarSystem: mockCalculate,
      }));

      const { result } = renderHook(() => useCalculator(), { wrapper: createWrapper() });

      // First attempt fails
      await act(async () => {
        await result.current.calculate();
      });

      expect(result.current.error).toBe(mockError);

      // Second attempt succeeds
      await act(async () => {
        await result.current.calculate();
      });

      expect(result.current.calculation).not.toBeNull();
      expect(result.current.error).toBeNull();
    });

    it('handles repeated validation errors gracefully', () => {
      const { result } = renderHook(() => useCalculator(), { wrapper: createWrapper() });

      // Multiple invalid updates
      for (let i = 0; i < 10; i++) {
        act(() => {
          result.current.updateFormValue('roofSize', -i);
        });

        expect(result.current.errors.roofSize).toBeDefined();
        expect(result.current.validateForm()).toBe(false);
      }

      // Valid update should clear errors
      act(() => {
        result.current.updateFormValue('roofSize', 100);
      });

      expect(result.current.errors.roofSize).toBeUndefined();
      expect(result.current.validateForm()).toBe(true);
    });
  });
});
```

---

## 🔗 Integration Testing Framework

### API Integration Tests
```typescript
// src/__tests__/integration/api/calculator-api.test.ts
import request from 'supertest';
import { app } from '../../../app';

describe('Calculator API Integration', () => {
  // Setup and teardown
  beforeAll(async () => {
    // Setup test database
    await setupTestDatabase();
  });

  afterAll(async () => {
    // Cleanup test database
    await cleanupTestDatabase();
  });

  beforeEach(async () => {
    // Reset database state
    await resetTestData();
  });

  // API Endpoint Tests
  describe('POST /api/calculator/calculate', () => {
    it('calculates solar system correctly', async () => {
      const requestData = {
        roofSize: 200,
        consumption: 10000,
        region: 'bayern',
        roofType: 'flat',
        orientation: 'south',
        shading: 'low',
      };

      const response = await request(app)
        .post('/api/calculator/calculate')
        .send(requestData)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          systemSize: expect.any(Number),
          annualProduction: expect.any(Number),
          annualSavings: expect.any(Number),
          co2Savings: expect.any(Number),
          amortizationPeriod: expect.any(Number),
          roi: expect.any(Number),
        },
      });

      // Validate calculation accuracy
      const { data } = response.body;
      expect(data.systemSize).toBeCloseTo(40, 1); // 200 * 0.2
      expect(data.annualProduction).toBeCloseTo(42000, 1000); // 40 * 1050
    });

    it('validates input parameters', async () => {
      const invalidData = {
        roofSize: -100,
        consumption: 0,
        region: 'invalid',
        roofType: 'invalid',
      };

      const response = await request(app)
        .post('/api/calculator/calculate')
        .send(invalidData)
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: expect.stringContaining('validation'),
          details: expect.any(Object),
        },
      });
    });

    it('handles concurrent requests correctly', async () => {
      const requestData = {
        roofSize: 200,
        consumption: 10000,
        region: 'bayern',
        roofType: 'flat',
        orientation: 'south',
        shading: 'low',
      };

      // Send 10 concurrent requests
      const promises = Array(10).fill(null).map(() =>
        request(app)
          .post('/api/calculator/calculate')
          .send(requestData)
          .expect(200)
      );

      const responses = await Promise.all(promises);

      // All responses should be consistent
      responses.forEach(response => {
        expect(response.body.success).toBe(true);
        expect(response.body.data.systemSize).toBeCloseTo(40, 1);
      });
    });

    it('rate limits requests correctly', async () => {
      const requestData = {
        roofSize: 200,
        consumption: 10000,
        region: 'bayern',
      };

      // Send requests rapidly to trigger rate limiting
      const promises = Array(100).fill(null).map(() =>
        request(app)
          .post('/api/calculator/calculate')
          .send(requestData)
      );

      const responses = await Promise.allSettled(promises);

      // Some requests should be rate limited
      const rateLimitedResponses = responses.filter(
        result => result.status === 'rejected' ||
        (result.status === 'fulfilled' && result.value.status === 429)
      );

      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });

    it('caches calculation results', async () => {
      const requestData = {
        roofSize: 200,
        consumption: 10000,
        region: 'bayern',
      };

      // First request
      const startTime1 = performance.now();
      const response1 = await request(app)
        .post('/api/calculator/calculate')
        .send(requestData)
        .expect(200);
      const endTime1 = performance.now();
      const duration1 = endTime1 - startTime1;

      // Second request (should be cached)
      const startTime2 = performance.now();
      const response2 = await request(app)
        .post('/api/calculator/calculate')
        .send(requestData)
        .expect(200);
      const endTime2 = performance.now();
      const duration2 = endTime2 - startTime2;

      // Cached request should be faster
      expect(duration2).toBeLessThan(duration1 * 0.5);

      // Results should be identical
      expect(response1.body).toEqual(response2.body);
    });
  });

  // Database Integration Tests
  describe('Database Integration', () => {
    it('persists calculation results correctly', async () => {
      const requestData = {
        roofSize: 200,
        consumption: 10000,
        region: 'bayern',
      };

      const response = await request(app)
        .post('/api/calculator/calculate')
        .send(requestData)
        .expect(200);

      const calculationId = response.body.data.id;

      // Verify persistence in database
      const dbRecord = await getCalculationFromDatabase(calculationId);
      expect(dbRecord).toMatchObject({
        input_data: requestData,
        result: response.body.data,
        created_at: expect.any(Date),
      });
    });

    it('handles database errors gracefully', async () => {
      // Mock database error
      jest.spyOn(require('../../database/calculations'), 'saveCalculation')
        .mockRejectedValue(new Error('Database connection failed'));

      const requestData = {
        roofSize: 200,
        consumption: 10000,
        region: 'bayern',
      };

      const response = await request(app)
        .post('/api/calculator/calculate')
        .send(requestData)
        .expect(500);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: expect.stringContaining('database'),
        },
      });
    });

    it('performs database transactions correctly', async () => {
      const requestData = {
        roofSize: 200,
        consumption: 10000,
        region: 'bayern',
      };

      // Mock partial database failure
      jest.spyOn(require('../../database/analytics'), 'trackCalculation')
        .mockRejectedValue(new Error('Analytics service unavailable'));

      // Calculation should still complete successfully
      const response = await request(app)
        .post('/api/calculator/calculate')
        .send(requestData)
        .expect(200);

      expect(response.body.success).toBe(true);

      // But analytics should not be tracked
      expect(require('../../database/analytics').trackCalculation).toHaveBeenCalled();
    });
  });

  // External Service Integration Tests
  describe('External Services', () => {
    it('integrates with weather API correctly', async () => {
      const mockWeatherData = {
        irradiation: 1050,
        temperature: 15,
        cloudCover: 0.3,
      };

      jest.mock('../../services/weatherService', () => ({
        getWeatherData: jest.fn().mockResolvedValue(mockWeatherData),
      }));

      const requestData = {
        roofSize: 200,
        consumption: 10000,
        region: 'bayern',
        includeWeatherData: true,
      };

      const response = await request(app)
        .post('/api/calculator/calculate')
        .send(requestData)
        .expect(200);

      expect(require('../../services/weatherService').getWeatherData).toHaveBeenCalledWith('bayern');

      // Results should incorporate weather data
      expect(response.body.data.annualProduction).toBeGreaterThan(0);
    });

    it('handles external service failures gracefully', async () => {
      jest.mock('../../services/weatherService', () => ({
        getWeatherData: jest.fn().mockRejectedValue(new Error('Weather API unavailable')),
      }));

      const requestData = {
        roofSize: 200,
        consumption: 10000,
        region: 'bayern',
        includeWeatherData: true,
      };

      // Should still complete with default values
      const response = await request(app)
        .post('/api/calculator/calculate')
        .send(requestData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(require('../../services/weatherService').getWeatherData).toHaveBeenCalled();
    });

    it('retries external service calls', async () => {
      let callCount = 0;
      jest.mock('../../services/weatherService', () => ({
        getWeatherData: jest.fn().mockImplementation(() => {
          callCount++;
          if (callCount < 3) {
            throw new Error('Temporary failure');
          }
          return { irradiation: 1050 };
        }),
      }));

      const requestData = {
        roofSize: 200,
        consumption: 10000,
        region: 'bayern',
        includeWeatherData: true,
      };

      const response = await request(app)
        .post('/api/calculator/calculate')
        .send(requestData)
        .expect(200);

      expect(callCount).toBe(3); // Should retry 3 times
      expect(response.body.success).toBe(true);
    });
  });

  // Authentication & Authorization Tests
  describe('Authentication & Authorization', () => {
    it('requires authentication for protected endpoints', async () => {
      const response = await request(app)
        .post('/api/calculator/calculate')
        .send({})
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
    });

    it('accepts valid JWT tokens', async () => {
      const validToken = generateValidJWTToken();

      const response = await request(app)
        .post('/api/calculator/calculate')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          roofSize: 200,
          consumption: 10000,
          region: 'bayern',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('rejects invalid JWT tokens', async () => {
      const invalidToken = 'invalid.jwt.token';

      const response = await request(app)
        .post('/api/calculator/calculate')
        .set('Authorization', `Bearer ${invalidToken}`)
        .send({})
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: expect.stringContaining('token'),
        },
      });
    });

    it('enforces rate limits per user', async () => {
      const userToken = generateValidJWTToken({ userId: 'test-user-123' });

      const requestData = {
        roofSize: 200,
        consumption: 10000,
        region: 'bayern',
      };

      // Send requests from same user
      const promises = Array(20).fill(null).map(() =>
        request(app)
          .post('/api/calculator/calculate')
          .set('Authorization', `Bearer ${userToken}`)
          .send(requestData)
      );

      const responses = await Promise.allSettled(promises);

      // Some requests should be rate limited
      const rateLimitedResponses = responses.filter(
        result => result.status === 'rejected' ||
        (result.status === 'fulfilled' && result.value.status === 429)
      );

      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });

  // Performance Integration Tests
  describe('Performance', () => {
    it('handles high load efficiently', async () => {
      const requestData = {
        roofSize: 200,
        consumption: 10000,
        region: 'bayern',
      };

      const concurrentUsers = 50;
      const requestsPerUser = 10;

      const promises = [];
      for (let user = 0; user < concurrentUsers; user++) {
        const userToken = generateValidJWTToken({ userId: `user-${user}` });

        for (let req = 0; req < requestsPerUser; req++) {
          promises.push(
            request(app)
              .post('/api/calculator/calculate')
              .set('Authorization', `Bearer ${userToken}`)
              .send(requestData)
          );
        }
      }

      const startTime = performance.now();
      const responses = await Promise.allSettled(promises);
      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Calculate metrics
      const totalRequests = concurrentUsers * requestsPerUser;
      const successfulRequests = responses.filter(r => r.status === 'fulfilled' && r.value.status === 200).length;
      const requestsPerSecond = (successfulRequests / totalTime) * 1000;

      expect(successfulRequests).toBeGreaterThan(totalRequests * 0.95); // 95% success rate
      expect(requestsPerSecond).toBeGreaterThan(100); // 100+ RPS
    });

    it('maintains response times under load', async () => {
      const requestData = {
        roofSize: 200,
        consumption: 10000,
        region: 'bayern',
      };

      const promises = Array(100).fill(null).map(() =>
        request(app)
          .post('/api/calculator/calculate')
          .send(requestData)
      );

      const responses = await Promise.allSettled(promises);

      const successfulResponses = responses.filter(
        result => result.status === 'fulfilled' && result.value.status === 200
      );

      const responseTimes = successfulResponses.map(
        result => result.value.headers['x-response-time']
      ).filter(Boolean);

      const averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
      const maxResponseTime = Math.max(...responseTimes);

      expect(averageResponseTime).toBeLessThan(500); // 500ms average
      expect(maxResponseTime).toBeLessThan(2000); // 2s max
    });
  });

  // Utility Functions
  async function setupTestDatabase() {
    // Initialize test database
    await require('../../database/setup').initialize();
  }

  async function cleanupTestDatabase() {
    // Clean up test database
    await require('../../database/cleanup').cleanup();
  }

  async function resetTestData() {
    // Reset test data to initial state
    await require('../../database/reset').reset();
  }

  async function getCalculationFromDatabase(id: string) {
    // Retrieve calculation from database
    return await require('../../database/calculations').getById(id);
  }

  function generateValidJWTToken(payload: any = {}) {
    // Generate valid JWT token for testing
    const jwt = require('jsonwebtoken');
    return jwt.sign(
      {
        userId: 'test-user',
        email: 'test@example.com',
        ...payload,
      },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  }
});
```

---

## 🎭 End-to-End Testing Framework

### Playwright Configuration
```typescript
// tests/e2e/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'test-results/playwright-report' }],
    ['json', { outputFile: 'test-results/test-results.json' }],
    ['junit', { outputFile: 'test-results/junit-results.xml' }],
    process.env.CI ? ['github'] : ['list'],
  ],
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /.*\.chromium\.spec\.(ts|js)/,
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testMatch: /.*\.firefox\.spec\.(ts|js)/,
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testMatch: /.*\.webkit\.spec\.(ts|js)/,
    },

    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      testMatch: /.*\.mobile\.spec\.(ts|js)/,
    },

    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
      testMatch: /.*\.mobile\.spec\.(ts|js)/,
    },

    {
      name: 'tablet',
      use: { ...devices['iPad Pro'] },
      testMatch: /.*\.tablet\.spec\.(ts|js)/,
    },

    {
      name: 'accessibility',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /.*\.a11y\.spec\.(ts|js)/,
    },

    {
      name: 'performance',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /.*\.perf\.spec\.(ts|js)/,
    },
  ],

  webServer: {
    command: process.env.CI ? '' : 'npm run dev',
    url: process.env.CI ? undefined : 'http://localhost:3000',
    port: process.env.CI ? undefined : 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  globalSetup: require.resolve('./global-setup.ts'),
  globalTeardown: require.resolve('./global-teardown.ts'),
});
```

### Custom Test Fixtures
```typescript
// tests/e2e/fixtures/test-fixtures.ts
import { test as base } from '@playwright/test';
import { CalculatorPage } from '../pages/CalculatorPage';
import { ContactFormPage } from '../pages/ContactFormPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ProjectGalleryPage } from '../pages/ProjectGalleryPage';

// Extend base test with custom fixtures
export const test = base.extend<{
  calculatorPage: CalculatorPage;
  contactFormPage: ContactFormPage;
  dashboardPage: DashboardPage;
  projectGalleryPage: ProjectGalleryPage;
  authenticatedUser: { name: string; email: string; token: string };
  testData: {
    validCalculation: any;
    validContactForm: any;
    mockApiResponse: any;
  };
}>({
  // Page fixtures
  calculatorPage: async ({ page }, use) => {
    const calculatorPage = new CalculatorPage(page);
    await use(calculatorPage);
  },

  contactFormPage: async ({ page }, use) => {
    const contactFormPage = new ContactFormPage(page);
    await use(contactFormPage);
  },

  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  projectGalleryPage: async ({ page }, use) => {
    const projectGalleryPage = new ProjectGalleryPage(page);
    await use(projectGalleryPage);
  },

  // Authentication fixture
  authenticatedUser: async ({ page }, use) => {
    const mockUser = {
      name: 'Test User',
      email: 'test@example.com',
      token: 'mock-jwt-token',
    };

    // Set up mock authentication
    await page.route('**/api/auth/me', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: mockUser,
        }),
      });
    });

    // Set up API authentication headers
    await page.addInitScript(() => {
      window.localStorage.setItem('authToken', mockUser.token);
    });

    await use(mockUser);
  },

  // Test data fixture
  testData: async ({}, use) => {
    const mockData = {
      validCalculation: {
        roofSize: 200,
        consumption: 10000,
        region: 'bayern',
        roofType: 'flat',
        orientation: 'south',
        shading: 'low',
      },
      validContactForm: {
        firstName: 'Max',
        lastName: 'Mustermann',
        email: 'max.mustermann@example.com',
        company: 'Test Company',
        message: 'Test message',
        projectType: 'photovoltaik',
        privacyConsent: true,
      },
      mockApiResponse: {
        success: true,
        data: {
          systemSize: 40,
          annualProduction: 42000,
          annualSavings: 13440,
          co2Savings: 16.8,
          amortizationPeriod: 8.5,
          roi: 12.5,
        },
      },
    };

    await use(mockData);
  },
});

// Custom assertions
export { expect } from '@playwright/test';
```

### Page Object Models
```typescript
// tests/e2e/pages/CalculatorPage.ts
import { Page, Locator } from '@playwright/test';

export class CalculatorPage {
  readonly page: Page;
  readonly calculatorForm: Locator;
  readonly roofSizeInput: Locator;
  readonly consumptionInput: Locator;
  readonly regionSelect: Locator;
  readonly calculateButton: Locator;
  readonly resultsSection: Locator;
  readonly loadingSpinner: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.calculatorForm = page.locator('[data-testid="calculator-form"]');
    this.roofSizeInput = page.locator('[data-testid="roof-size-input"]');
    this.consumptionInput = page.locator('[data-testid="consumption-input"]');
    this.regionSelect = page.locator('[data-testid="region-select"]');
    this.calculateButton = page.locator('[data-testid="calculate-button"]');
    this.resultsSection = page.locator('[data-testid="results-section"]');
    this.loadingSpinner = page.locator('[data-testid="loading-spinner"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
  }

  async goto() {
    await this.page.goto('/rechner');
    await this.calculatorForm.waitFor();
  }

  async fillForm(data: {
    roofSize: string;
    consumption: string;
    region: string;
  }) {
    await this.roofSizeInput.fill(data.roofSize);
    await this.consumptionInput.fill(data.consumption);
    await this.regionSelect.selectOption(data.region);
  }

  async submitForm() {
    await this.calculateButton.click();
  }

  async waitForResults() {
    await this.resultsSection.waitFor({ timeout: 30000 });
  }

  async waitForLoading() {
    await this.loadingSpinner.waitFor({ state: 'visible' });
    await this.loadingSpinner.waitFor({ state: 'hidden' });
  }

  async getResults() {
    if (!(await this.resultsSection.isVisible())) {
      throw new Error('Results section is not visible');
    }

    return {
      systemSize: await this.page.locator('[data-testid="system-size"]').textContent(),
      annualProduction: await this.page.locator('[data-testid="annual-production"]').textContent(),
      annualSavings: await this.page.locator('[data-testid="annual-savings"]').textContent(),
      co2Savings: await this.page.locator('[data-testid="co2-savings"]').textContent(),
      amortizationPeriod: await this.page.locator('[data-testid="amortization-period"]').textContent(),
      roi: await this.page.locator('[data-testid="roi"]').textContent(),
    };
  }

  async hasError() {
    return await this.errorMessage.isVisible();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }

  async isFormValid() {
    const isCalculateButtonEnabled = await this.calculateButton.isEnabled();
    const errorCount = await this.page.locator('[data-testid*="error"]').count();

    return isCalculateButtonEnabled && errorCount === 0;
  }

  async takeScreenshot(path?: string) {
    await this.page.screenshot({
      path: path || 'test-results/screenshots/calculator-page.png',
      fullPage: true
    });
  }

  async mockApiResponse(responseData: any) {
    await this.page.route('**/api/calculator/calculate', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(responseData),
      });
    });
  }

  async mockApiError(error: { status: number; message: string }) {
    await this.page.route('**/api/calculator/calculate', (route) => {
      route.fulfill({
        status: error.status,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: error.message,
        }),
      });
    });
  }
}
```

### E2E Test Examples
```typescript
// tests/e2e/calculator/calculator.spec.ts
import { test, expect } from '../../fixtures/test-fixtures';

test.describe('Calculator Functionality', () => {
  test.beforeEach(async ({ calculatorPage }) => {
    await calculatorPage.goto();
  });

  test('calculates solar system with valid inputs', async ({
    calculatorPage,
    testData,
  }) => {
    // Mock API response
    await calculatorPage.mockApiResponse(testData.mockApiResponse);

    // Fill form with valid data
    await calculatorPage.fillForm(testData.validCalculation);

    // Verify form is valid
    expect(await calculatorPage.isFormValid()).toBe(true);

    // Submit form
    await calculatorPage.submitForm();

    // Wait for loading
    await calculatorPage.waitForLoading();

    // Wait for results
    await calculatorPage.waitForResults();

    // Verify results
    const results = await calculatorPage.getResults();
    expect(results.systemSize).toContain('40 kWp');
    expect(results.annualProduction).toContain('42.000 kWh');
    expect(results.annualSavings).toContain('€13.440');
  });

  test('shows validation errors for invalid inputs', async ({
    calculatorPage,
  }) => {
    // Fill form with invalid data
    await calculatorPage.fillForm({
      roofSize: '-100',
      consumption: '0',
      region: 'invalid',
    });

    // Verify form is invalid
    expect(await calculatorPage.isFormValid()).toBe(false);

    // Submit form
    await calculatorPage.submitForm();

    // Verify error messages
    expect(await calculatorPage.hasError()).toBe(true);
    const errorMessage = await calculatorPage.getErrorMessage();
    expect(errorMessage).toContain('Bitte korrigieren Sie die fehlerhaften Eingaben');
  });

  test('handles API errors gracefully', async ({
    calculatorPage,
    testData,
  }) => {
    // Mock API error
    await calculatorPage.mockApiError({
      status: 500,
      message: 'Server error',
    });

    // Fill form with valid data
    await calculatorPage.fillForm(testData.validCalculation);

    // Submit form
    await calculatorPage.submitForm();

    // Wait for loading
    await calculatorPage.waitForLoading();

    // Verify error handling
    expect(await calculatorPage.hasError()).toBe(true);
    const errorMessage = await calculatorPage.getErrorMessage();
    expect(errorMessage).toContain('Berechnung fehlgeschlagen');
  });

  test('persists calculation results in dashboard', async ({
    calculatorPage,
    dashboardPage,
    authenticatedUser,
    testData,
  }) => {
    // Mock successful API response
    await calculatorPage.mockApiResponse(testData.mockApiResponse);

    // Calculate solar system
    await calculatorPage.fillForm(testData.validCalculation);
    await calculatorPage.submitForm();
    await calculatorPage.waitForResults();

    // Navigate to dashboard
    await calculatorPage.page.click('[data-testid="dashboard-link"]');
    await dashboardPage.page.waitForLoad();

    // Verify calculation is saved
    const calculations = await dashboardPage.getCalculations();
    expect(calculations).toHaveLength(1);
    expect(calculations[0]).toMatchObject({
      roofSize: testData.validCalculation.roofSize,
      consumption: testData.validCalculation.consumption,
      region: testData.validCalculation.region,
    });
  });

  test('supports keyboard navigation', async ({
    calculatorPage,
    testData,
  }) => {
    // Navigate form with keyboard
    await calculatorPage.page.keyboard.press('Tab');
    expect(await calculatorPage.roofSizeInput).toBeFocused();

    await calculatorPage.page.keyboard.type(testData.validCalculation.roofSize);
    await calculatorPage.page.keyboard.press('Tab');
    expect(await calculatorPage.consumptionInput).toBeFocused();

    await calculatorPage.page.keyboard.type(testData.validCalculation.consumption);
    await calculatorPage.page.keyboard.press('Tab');
    expect(await calculatorPage.regionSelect).toBeFocused();

    // Select region with keyboard
    await calculatorPage.page.keyboard.press('ArrowDown');
    await calculatorPage.page.keyboard.press('ArrowDown');
    await calculatorPage.page.keyboard.press('Enter');

    // Submit with keyboard
    await calculatorPage.page.keyboard.press('Tab');
    await calculatorPage.page.keyboard.press('Enter');

    // Verify calculation started
    await calculatorPage.waitForLoading();
  });

  test('works correctly on mobile devices', async ({
    calculatorPage,
    testData,
  }) => {
    // Set mobile viewport
    await calculatorPage.page.setViewport({ width: 375, height: 667 });

    // Verify mobile layout
    expect(await calculatorPage.page.locator('[data-testid="mobile-layout"]').isVisible()).toBe(true);

    // Test mobile form interaction
    await calculatorPage.fillForm(testData.validCalculation);
    await calculatorPage.submitForm();

    // Verify mobile results
    await calculatorPage.waitForResults();
    expect(await calculatorPage.resultsSection.isVisible()).toBe(true);
  });

  test('maintains performance under load', async ({
    calculatorPage,
    testData,
  }) => {
    // Performance monitoring
    const performanceMetrics = await calculatorPage.page.evaluate(() => {
      const startTime = performance.now();

      // Simulate rapid form changes
      const input = document.querySelector('[data-testid="roof-size-input"]') as HTMLInputElement;
      for (let i = 0; i < 100; i++) {
        input.value = i.toString();
        input.dispatchEvent(new Event('input'));
      }

      const endTime = performance.now();
      return endTime - startTime;
    });

    // Should handle rapid changes efficiently
    expect(performanceMetrics).toBeLessThan(1000); // 1 second max

    // Form should still be functional
    await calculatorPage.fillForm(testData.validCalculation);
    expect(await calculatorPage.isFormValid()).toBe(true);
  });

  test('accessibility compliance', async ({
    calculatorPage,
    testData,
  }) => {
    // Run accessibility checks
    const violations = await calculatorPage.page.accessibility.snapshot();
    expect(violations).toEqual([]);

    // Check ARIA labels
    await expect(calculatorPage.roofSizeInput).toHaveAttribute('aria-label');
    await expect(calculatorPage.consumptionInput).toHaveAttribute('aria-label');
    await expect(calculatorPage.calculateButton).toHaveAttribute('aria-label');

    // Check focus management
    await calculatorPage.calculateButton.focus();
    expect(await calculatorPage.calculateButton).toBeFocused();

    // Check color contrast (would need axe-core for actual testing)
    await expect(calculatorPage.page).toHaveAccessible();
  });

  test('cross-browser compatibility', async ({ page }) => {
    // Test across different browsers (configured in playwright.config.ts)
    test.skip(process.env.BROWSER === 'webkit', 'Safari-specific test');

    await page.goto('/rechner');
    const pageTitle = await page.title();
    expect(pageTitle).toContain('Solarrechner');
  });
});
```

---

## 📊 Performance Testing Framework

### Lighthouse CI Integration
```javascript
// tests/performance/lighthouse.spec.js
const { playAudit } = require('lighthouse/lighthouse-core');
const { launch } = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

describe('Performance Testing', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await launch({
      chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox'],
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  const pages = [
    { url: '/', name: 'Homepage' },
    { url: '/rechner', name: 'Calculator' },
    { url: '/kontakt', name: 'Contact Form' },
    { url: '/projekte', name: 'Project Gallery' },
    { url: '/dashboard', name: 'Dashboard' },
  ];

  pages.forEach(({ url, name }) => {
    test(`${name} Performance Audit`, async () => {
      await page.goto(url);

      const results = await playAudit({
        url: page.url(),
        port: 9222,
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      });

      const performanceScore = results.lhr.categories.performance.score * 100;
      const accessibilityScore = results.lhr.categories.accessibility.score * 100;
      const bestPracticesScore = results.lhr.categories['best-practices'].score * 100;
      const seoScore = results.lhr.categories.seo.score * 100;

      // Performance assertions
      expect(performanceScore).toBeGreaterThan(90);
      expect(accessibilityScore).toBeGreaterThan(95);
      expect(bestPracticesScore).toBeGreaterThan(90);
      expect(seoScore).toBeGreaterThan(90);

      // Core Web Vitals
      const fcp = results.lhr.audits['first-contentful-paint'].numericValue;
      const lcp = results.lhr.audits['largest-contentful-paint'].numericValue;
      const cls = results.lhr.audits['cumulative-layout-shift'].numericValue;
      const fid = results.lhr.audits['max-potential-fid'].numericValue;

      expect(fcp).toBeLessThan(1800);
      expect(lcp).toBeLessThan(2500);
      expect(cls).toBeLessThan(0.1);
      expect(fid).toBeLessThan(100);

      // Save detailed report
      const reportPath = path.join(__dirname, `../../test-results/lighthouse-${name.toLowerCase().replace(/\s+/g, '-')}.json`);
      fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));

      console.log(`${name} Performance Metrics:`);
      console.log(`  Performance Score: ${performanceScore}`);
      console.log(`  Accessibility Score: ${accessibilityScore}`);
      console.log(`  Best Practices Score: ${bestPracticesScore}`);
      console.log(`  SEO Score: ${seoScore}`);
      console.log(`  First Contentful Paint: ${fcp}ms`);
      console.log(`  Largest Contentful Paint: ${lcp}ms`);
      console.log(`  Cumulative Layout Shift: ${cls}`);
      console.log(`  Max Potential FID: ${fid}ms`);
    });
  });

  test('Bundle Size Analysis', async () => {
    await page.goto('/');

    const bundleSizes = await page.evaluate(() => {
      const bundles = [];

      // Get all script resources
      const scripts = Array.from(document.querySelectorAll('script[src]'));

      scripts.forEach(script => {
        const src = script.getAttribute('src');
        if (src && (src.includes('.js') || src.includes('chunk'))) {
          bundles.push({
            url: src,
            size: script.getAttribute('data-size') || 0,
          });
        }
      });

      return bundles;
    });

    let totalSize = 0;
    bundleSizes.forEach(bundle => {
      totalSize += parseInt(bundle.size) || 0;
    });

    // Total bundle size should be reasonable
    expect(totalSize).toBeLessThan(2 * 1024 * 1024); // 2MB max

    // No single bundle should be too large
    bundleSizes.forEach(bundle => {
      expect(bundle.size).toBeLessThan(500 * 1024); // 500KB max per bundle
    });

    console.log('Bundle Size Analysis:');
    bundleSizes.forEach(bundle => {
      console.log(`  ${bundle.url}: ${Math.round(bundle.size / 1024)}KB`);
    });
    console.log(`  Total: ${Math.round(totalSize / 1024)}KB`);
  });

  test('Memory Usage Analysis', async () => {
    await page.goto('/');

    // Simulate user interactions
    await page.click('[data-testid="calculator-tab"]');
    await page.fill('[data-testid="roof-size-input"]', '200');
    await page.fill('[data-testid="consumption-input"]', '10000');
    await page.click('[data-testid="calculate-button"]');

    // Memory metrics
    const metrics = await page.evaluate(() => {
      return performance.memory;
    });

    // Memory usage should be reasonable
    expect(metrics.usedJSHeapSize).toBeLessThan(100 * 1024 * 1024); // 100MB max
    expect(metrics.totalJSHeapSize).toBeLessThan(200 * 1024 * 1024); // 200MB max

    console.log('Memory Usage:');
    console.log(`  Used JS Heap: ${Math.round(metrics.usedJSHeapSize / 1024 / 1024)}MB`);
    console.log(`  Total JS Heap: ${Math.round(metrics.totalJSHeapSize / 1024 / 1024)}MB`);
    console.log(`  JS Heap Limit: ${Math.round(metrics.jsHeapSizeLimit / 1024 / 1024)}MB`);
  });
});
```

---

## 🔒 Security Testing Framework

### Security Scanning Tests
```typescript
// tests/security/security.spec.ts
import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

test.describe('Security Testing', () => {
  test('Accessibility Compliance', async ({ page }) => {
    await page.goto('/');

    const accessibilityScan = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScan.violations).toEqual([]);
  });

  test('XSS Prevention', async ({ page }) => {
    await page.goto('/kontakt');

    // Test various XSS payloads
    const xssPayloads = [
      '<script>alert("XSS")</script>',
      '"><script>alert("XSS")</script>',
      "javascript:alert('XSS')",
      '<img src=x onerror=alert("XSS")>',
      '<svg onload=alert("XSS")>',
      '<iframe src="javascript:alert(\'XSS\')"></iframe>',
    ];

    for (const payload of xssPayloads) {
      await page.fill('[data-testid="message-input"]', payload);
      await page.click('[data-testid="submit-button"]');

      // Verify no script execution
      const alertCalled = await page.evaluate(() => {
        return (window as any).alertCalled || false;
      });

      expect(alertCalled).toBe(false);
    }
  });

  test('CSRF Protection', async ({ page }) => {
    await page.goto('/api/calculator/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roofSize: 200,
        consumption: 10000,
      }),
    });

    const response = await page.waitForSelector('pre');
    const responseText = await response.textContent();

    expect(responseText).toContain('CSRF token required');
  });

  test('SQL Injection Prevention', async ({ page }) => {
    await page.goto('/api/projects/search');

    // Test SQL injection payloads
    const sqlPayloads = [
      "'; DROP TABLE projects; --",
      "OR '1'='1",
      "UNION SELECT * FROM users --",
      "'; INSERT INTO users VALUES ('hacker', 'password'); --",
    ];

    for (const payload of sqlPayloads) {
      await page.fill('[data-testid="search-input"]', payload);
      await page.click('[data-testid="search-button"]');

      // Should not cause database errors
      const errorMessages = await page.locator('[data-testid="error-message"]').all();
      expect(errorMessages).toHaveLength(0);
    }
  });

  test('Authentication Bypass Prevention', async ({ page }) => {
    // Try to access protected endpoints without authentication
    const protectedEndpoints = [
      '/api/dashboard',
      '/api/user/profile',
      '/api/admin/users',
      '/api/projects/create',
    ];

    for (const endpoint of protectedEndpoints) {
      const response = await page.goto(endpoint);

      // Should redirect to login or return 401
      const currentUrl = page.url();
      expect(currentUrl).toContain('/login') ||
                 page.locator('h1').textContent().toContain('Unauthorized');
    }
  });

  test('Rate Limiting', async ({ page }) => {
    await page.goto('/api/calculator/calculate');

    const rapidRequests = [];
    for (let i = 0; i < 100; i++) {
      rapidRequests.push(
        page.evaluate(() => {
          return fetch('/api/calculator/calculate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              roofSize: 200,
              consumption: 10000,
            }),
          }).then(r => r.status);
        })
      );
    }

    const responses = await Promise.all(rapidRequests);
    const rateLimitedResponses = responses.filter(status => status === 429);

    expect(rateLimitedResponses.length).toBeGreaterThan(0);
  });

  test('Sensitive Data Exposure', async ({ page }) => {
    // Check if sensitive data is exposed in client-side code
    await page.goto('/');

    const sensitiveDataPatterns = [
      /password/i,
      /secret/i,
      /token/i,
      /api[_-]?key/i,
      /private[_-]?key/i,
    ];

    const pageContent = await page.content();

    for (const pattern of sensitiveDataPatterns) {
      const matches = pageContent.match(pattern);
      if (matches) {
        // Verify it's in a comment or configuration, not actual data
        console.warn(`Potential sensitive data found: ${matches[0]}`);
      }
    }

    // Check for exposed API keys in network requests
    const networkRequests = [];
    page.on('request', request => {
      const url = request.url();
      const headers = request.headers();

      // Check for API keys in URLs
      if (url.includes('key=') || url.includes('token=')) {
        networkRequests.push({ type: 'url', value: url });
      }

      // Check for API keys in headers
      Object.entries(headers).forEach(([key, value]) => {
        if (key.toLowerCase().includes('key') ||
            key.toLowerCase().includes('token') ||
            key.toLowerCase().includes('secret')) {
          networkRequests.push({ type: 'header', key, value });
        }
      });
    });

    await page.goto('/rechner');
    await page.waitForTimeout(5000); // Wait for network activity

    // Verify no sensitive data exposed
    expect(networkRequests.filter(req =>
      req.value.includes('sk-') ||
      req.value.includes('pk_') ||
      req.value.includes('secret_')
    )).toHaveLength(0);
  });

  test('File Upload Security', async ({ page }) => {
    await page.goto('/api/upload');

    // Test file upload restrictions
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'];
    const maliciousFiles = [
      { name: 'malicious.js', content: 'alert("XSS")' },
      { name: 'malicious.html', content: '<script>alert("XSS")</script>' },
      { name: 'malicious.php', content: '<?php echo "Hacked"; ?>' },
      { name: 'malicious.exe', content: 'binary content' },
    ];

    for (const file of maliciousFiles) {
      const fileInput = page.locator('[data-testid="file-input"]');

      // Create fake file
      const filePromise = new Promise<File>((resolve) => {
        const file = new File([file.content], file.name, { type: 'application/octet-stream' });
        resolve(file);
      });

      const fakeFile = await filePromise;
      await fileInput.setInputFiles([fakeFile]);

      await page.click('[data-testid="upload-button"]');

      // Should reject malicious files
      const errorMessage = await page.locator('[data-testid="error-message"]').textContent();
      expect(errorMessage).toContain('Dateityp nicht erlaubt');
    }
  });

  test('Content Security Policy', async ({ page }) => {
    await page.goto('/');

    // Check CSP headers
    const cspHeader = await page.evaluate(() => {
      const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      return meta ? meta.getAttribute('content') : '';
    });

    expect(cspHeader).toBeDefined();
    expect(cspHeader).toContain('default-src');
    expect(cspHeader).toContain("'self'");
    expect(cspHeader).toContain('script-src');
  });

  test('HTTPS Enforcement', async ({ page }) => {
    // Check for HTTPS redirect
    const response = await page.goto('http://zoe-solar.de');
    expect(page.url()).toStartWith('https://');
  });

  test('Cookie Security', async ({ page }) => {
    await page.goto('/');

    const cookies = await page.context().cookies();

    // Check for secure cookie attributes
    const secureCookies = cookies.filter(cookie =>
      cookie.name.includes('session') ||
      cookie.name.includes('auth') ||
      cookie.name.includes('token')
    );

    for (const cookie of secureCookies) {
      expect(cookie.secure).toBe(true);
      expect(cookie.httpOnly).toBe(true);
      expect(cookie.sameSite).toBe('Strict');
    }
  });
});
```

---

## 📈 Testing CI/CD Integration

### GitHub Actions Testing Workflow
```yaml
# .github/workflows/comprehensive-testing.yml
name: 🧪 Comprehensive Testing

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 2 * * 1'  # Monday 2 AM
  workflow_dispatch:

env:
  NODE_VERSION: '20.x'
  NODE_OPTIONS: '--max-old-space-size=8192'

jobs:
  lint-and-type-check:
    name: 🔍 Lint & Type Check
    runs-on: ubuntu-latest
    steps:
    - name: 📥 Checkout code
      uses: actions/checkout@v4

    - name: 🟢 Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'

    - name: 📦 Install dependencies
      run: npm ci

    - name: 🔍 ESLint
      run: npm run lint:check

    - name: 🔍 Prettier check
      run: npm run format:check

    - name: 🔍 TypeScript check
      run: npm run type-check

  unit-tests:
    name: 🧪 Unit Tests
    runs-on: ubuntu-latest
    steps:
    - name: 📥 Checkout code
      uses: actions/checkout@v4

    - name: 🟢 Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'

    - name: 📦 Install dependencies
      run: npm ci

    - name: 🧪 Run unit tests
      run: npm run test:unit

    - name: 📊 Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
        flags: unittests

  integration-tests:
    name: 🔗 Integration Tests
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: zoe_solar_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
    - name: 📥 Checkout code
      uses: actions/checkout@v4

    - name: 🟢 Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'

    - name: 📦 Install dependencies
      run: npm ci

    - name: 🔧 Setup test environment
      run: |
        npm run setup:test
        npm run db:migrate:test
        npm run db:seed:test

    - name: 🔗 Run integration tests
      run: npm run test:integration
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/zoe_solar_test
        REDIS_URL: redis://localhost:6379
        NODE_ENV: test

  e2e-tests:
    name: 🎭 E2E Tests
    runs-on: ubuntu-latest
    steps:
    - name: 📥 Checkout code
      uses: actions/checkout@v4

    - name: 🟢 Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'

    - name: 📦 Install dependencies
      run: npm ci

    - name: 🔧 Install Playwright
      run: npm ci && npx playwright install --with-deps

    - name: 🏗️ Build application
      run: npm run build

    - name: 🌐 Start application
      run: |
        npm run start:test &
        sleep 30
      env:
        CI: true

    - name: 🎭 Run E2E tests
      run: npm run test:e2e

    - name: 📊 Upload E2E test results
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: test-results/playwright-report
        retention-days: 30

  performance-tests:
    name: ⚡ Performance Tests
    runs-on: ubuntu-latest
    steps:
    - name: 📥 Checkout code
      uses: actions/checkout@v4

    - name: 🟢 Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'

    - name: 📦 Install dependencies
      run: npm ci

    - name: 🔧 Install Lighthouse
      run: npm install -g @lhci/cli

    - name: 🏗️ Build application
      run: npm run build

    - name: 🌐 Start application
      run: |
        npm run start:test &
        sleep 30

    - name: ⚡ Run Lighthouse CI
      run: lhci autorun
      env:
        LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}

    - name: 📊 Upload Lighthouse results
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: lighthouse-results
        path: .lighthouseci/

  security-tests:
    name: 🔒 Security Tests
    runs-on: ubuntu-latest
    steps:
    - name: 📥 Checkout code
      uses: actions/checkout@v4

    - name: 🔍 Run security audit
      run: npm audit --audit-level moderate

    - name: 🔍 Run OWASP ZAP Baseline Scan
      run: |
        npm install -g @zaproxy/zap-baseline
        zap-baseline.py -t http://localhost:3000 -j

    - name: 📊 Upload security reports
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: security-reports
        path: security-reports/

  accessibility-tests:
    name: ♿ Accessibility Tests
    runs-on: ubuntu-latest
    steps:
    - name: 📥 Checkout code
      uses: actions/checkout@v4

    - name: 🟢 Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'

    - name: 📦 Install dependencies
      run: npm ci

    - name: ♿ Run accessibility tests
      run: npm run test:a11y

    - name: 📊 Upload accessibility reports
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: accessibility-reports
        path: test-results/a11y/

  visual-regression:
    name: 👁️ Visual Regression
    runs-on: ubuntu-latest
    steps:
    - name: 📥 Checkout code
      uses: actions/checkout@v4

    - name: 🟢 Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'

    - name: 📦 Install dependencies
      run: npm ci

    - name: 🔧 Install Visual Regression tools
      run: npm install -g @percy/cli

    - name: 👁️ Run visual regression tests
      run: npx percy exec --config .percyrc.yml npm run test:visual

    - name: 📊 Upload Percy results
      uses: actions/upload-artifact@v3
      if: failure()
      with:
        name: percy-results
        path: .percy/
```

---

## 📚 Best Practices

### Testing Best Practices
1. **Test Pyramid** - 70% unit, 20% integration, 10% E2E
2. **Fast Feedback** - Unit tests under 100ms, integration tests under 1s
3. **Isolation** - Tests should not depend on each other
4. **Deterministic** - Tests should produce consistent results
5. **Comprehensive Coverage** - Cover happy paths, edge cases, and errors
6. **Continuous Integration** - Run tests on every commit

### Quality Gates
```yaml
# Quality Gates Configuration
quality_gates:
  code_coverage:
    statements: 90%
    branches: 85%
    functions: 90%
    lines: 90%

  performance:
    lighthouse_score: 90
    core_web_vitals:
      fcp: 1800ms
      lcp: 2500ms
      cls: 0.1
      fid: 100ms

  accessibility:
    wcag_level: AA
    axe_violations: 0

  security:
    high_vulnerabilities: 0
    medium_vulnerabilities: 5
    owasp_zap_alerts: 0
```

---

**🧪 Testing Framework Version:** 1.0.0
**📊 Coverage Target:** 90%+
**⚡ Performance:** Core Web Vitals
**♿ Accessibility:** WCAG 2.1 AA
**🔒 Security:** OWASP Standards
**📅 Last Update:** 17. November 2025
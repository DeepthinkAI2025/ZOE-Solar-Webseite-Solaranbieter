# 👨‍💻 Development Guide für ZOE Solar

## 📋 Übersicht

**Projekt:** ZOE Solar Enterprise Platform
**Version:** 1.0.0
**Tech Stack:** React 19 + TypeScript + Vite + TailwindCSS
**Status:** Production-ready
**Zielgruppe:** Entwickler, DevOps, Technical Leads

---

## 🚀 Quick Start für Entwickler

### 1️⃣ System-Anforderungen
```bash
# Node.js & npm
node --version  # >= 18.0.0
npm --version   # >= 8.0.0

# Git Setup
git --version

# Optional Tools (empfohlen)
code --version  # VS Code
docker --version # Docker
```

### 2️⃣ Projekt aufsetzen
```bash
# 1. Repository klonen
git clone https://github.com/zoe-solar/zoe-solar-webseite.git
cd zoe-solar-webseite

# 2. Dependencies installieren
npm install

# 3. Environment konfigurieren
cp .env.example .env.local
# .env.local mit Ihren Werten füllen

# 4. Entwicklungsserver starten
npm run dev          # Frontend (http://localhost:5173)
npm run server       # Backend API (http://localhost:5001)
```

### 3️⃣ VS Code Setup (empfohlen)
```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

---

## 🏗️ Projekt-Architektur

### 📁 Verzeichnisstruktur
```
zoe-solar-webseite/
├── 📁 components/              # React-Komponenten
│   ├── 📁 ai-chat/            # KI-Chat-Komponenten
│   ├── 📁 calculators/        # ROI- & Solar-Rechner
│   ├── 📁 forms/              # Kontakt- & Angebotsformulare
│   ├── 📁 layout/             # Layout & Navigation
│   ├── 📁 sections/           # Content-Sektionen
│   └── 📁 ui/                 # UI-Komponenten
├── 📁 hooks/                  # React Hooks
│   ├── useOptimizedState.ts   # Optimized State Management
│   ├── useAIChatState.ts      # KI-Chat State
│   └── useNotionData.ts       # Notion CMS Hooks
├── 📁 lib/                    # Bibliotheken & Utilities
│   ├── 📁 cache/              # Cache Management
│   ├── 📁 notion/             # Notion API Integration
│   ├── 📁 performance/        # Performance Optimierungen
│   └── 📁 security/           # Security Komponenten
├── 📁 pages/                  # React Router Pages
│   ├── 📁 service/            # Service-Seiten
│   ├── 📁 standorte/          # Standort-Seiten
│   └── 📁 admin/              # Admin-Bereich
├── 📁 services/               # Backend Services
│   ├── 📁 ai/                 # KI-Services
│   ├── 📁 seo/                # SEO-Automatisierung
│   └── 📁 serena-mcp/         # Serena MCP Services
├── 📁 styles/                 # CSS & Tailwind
├── 📁 utils/                  # Utility-Funktionen
├── 📁 types/                  # TypeScript Typen
└── 📁 public/                 # Static Assets
```

### 🔧 Core Components

#### **React 19 + TypeScript Setup**
```typescript
// App.tsx - Hauptanwendung
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AccessibilityProvider } from './components/AccessibilityProvider';
import { ModalProvider } from './components/modals/ModalProvider';

export default function App() {
  return (
    <HelmetProvider>
      <AccessibilityProvider>
        <ModalProvider>
          <BrowserRouter>
            {/* App Content */}
          </BrowserRouter>
        </ModalProvider>
      </AccessibilityProvider>
    </HelmetProvider>
  );
}
```

#### **Vite Build Configuration**
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin']
      }
    }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  build: {
    target: 'es2020',
    minify: 'terser',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion', '@headlessui/react']
        }
      }
    }
  }
});
```

---

## 🎯 Code-Standards & Best Practices

### 📝 TypeScript Standards

#### **Strikte Typisierung**
```typescript
// ✅ GUT: Explizite Typdefinition
interface SolarProject {
  readonly id: string;
  readonly title: string;
  readonly power: number; // kWp
  readonly location: {
    readonly address: string;
    readonly coordinates: {
      readonly lat: number;
      readonly lng: number;
    };
  };
  readonly status: ProjectStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

type ProjectStatus = 'pending' | 'active' | 'completed' | 'cancelled';

// ❌ SCHLECHT: Implizite any-Typen
const project = {
  id: '123',
  title: 'Solar Project',
  power: 75 // TypeScript weiß nicht, dass dies kWp ist
};
```

#### **Utility Types verwenden**
```typescript
// ✅ GUT: Utility Types für saubere APIs
interface CreateProjectRequest {
  title: string;
  power: number;
  location: Address;
  budget?: number;
}

interface UpdateProjectRequest {
  id: string;
} & Partial<CreateProjectRequest>;

// ✅ GUT: Pick & Omit für spezifische Views
type ProjectListItem = Pick<SolarProject, 'id' | 'title' | 'power' | 'status'>;
type CreateProjectPayload = Omit<SolarProject, 'id' | 'createdAt' | 'updatedAt'>;
```

### 🎨 React Component Standards

#### **Function Components mit Hooks**
```typescript
// ✅ GUT: Moderne React Patterns
interface SolarCalculatorProps {
  readonly initialPower?: number;
  readonly onCalculationComplete?: (result: CalculationResult) => void;
}

export const SolarCalculator: React.FC<SolarCalculatorProps> = React.memo(({
  initialPower = 50,
  onCalculationComplete
}) => {
  const [power, setPower] = React.useState<number>(initialPower);
  const [result, setResult] = React.useState<CalculationResult | null>(null);

  const handleCalculation = React.useCallback(async () => {
    const calculation = await calculateROI(power);
    setResult(calculation);
    onCalculationComplete?.(calculation);
  }, [power, onCalculationComplete]);

  return (
    <div className="solar-calculator">
      {/* Calculator UI */}
    </div>
  );
});

SolarCalculator.displayName = 'SolarCalculator';
```

#### **Custom Hooks für komplexe Logik**
```typescript
// ✅ GUT: Custom Hook für KI-Chat-Logik
interface UseAIChatOptions {
  readonly apiKey: string;
  readonly model?: string;
  readonly onError?: (error: Error) => void;
}

export function useAIChat(options: UseAIChatOptions) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const sendMessage = React.useCallback(async (content: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchAIResponse(content, options);
      setMessages(prev => [...prev, { role: 'user', content }, { role: 'assistant', content: response }]);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      options.onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages: () => setMessages([])
  };
}
```

### 🎨 TailwindCSS Standards

#### **Component-Styles**
```typescript
// ✅ GUT: Komponentenspezifische Styles mit Tailwind
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}, ref) => {
  const baseClasses = 'font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      ref={ref}
      className={clsx(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});
```

#### **Responsive Design**
```typescript
// ✅ GUT: Responsive Patterns
const ResponsiveLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navigation */}
      <nav className="lg:hidden">
        {/* Mobile Nav Content */}
      </nav>

      {/* Desktop Navigation */}
      <nav className="hidden lg:block">
        {/* Desktop Nav Content */}
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {children}
        </div>
      </main>
    </div>
  );
};
```

---

## 🧪 Testing-Strategie

### 🏗️ Test-Architektur
```
src/
├── 📁 test/
│   ├── 📁 __mocks__/         # Mock-Dateien
│   ├── 📁 fixtures/          # Test-Daten
│   ├── 📁 utils/             # Test-Utilities
│   └── setup.ts              # Test-Setup
├── 📁 **/*.test.tsx          # Component Tests
├── 📁 **/*.test.ts           # Unit Tests
└── 📁 **/*.e2e.ts            # E2E Tests
```

### 🧩 Unit Testing (Jest + React Testing Library)
```typescript
// SolarCalculator.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SolarCalculator } from './SolarCalculator';

describe('SolarCalculator', () => {
  const user = userEvent.setup();

  it('should calculate ROI correctly', async () => {
    render(<SolarCalculator />);

    // Power input
    const powerInput = screen.getByLabelText(/Systemgröße/i);
    await user.clear(powerInput);
    await user.type(powerInput, '75');

    // Calculate button
    const calculateButton = screen.getByRole('button', { name: /Berechnen/i });
    await user.click(calculateButton);

    // Verify result
    await waitFor(() => {
      expect(screen.getByText(/jährliche Produktion/i)).toBeInTheDocument();
      expect(screen.getByText(/75\.000 kWh/)).toBeInTheDocument();
    });
  });

  it('should show validation error for invalid power', async () => {
    render(<SolarCalculator />);

    const powerInput = screen.getByLabelText(/Systemgröße/i);
    await user.clear(powerInput);
    await user.type(powerInput, '0');

    const calculateButton = screen.getByRole('button', { name: /Berechnen/i });
    await user.click(calculateButton);

    expect(screen.getByText(/Mindestens 1 kWp erforderlich/i)).toBeInTheDocument();
  });
});
```

### 🎯 Integration Testing
```typescript
// AIChat.integration.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { AIChat } from './AIChat';
import { MockAIProvider } from '../test/MockAIProvider';

describe('AIChat Integration', () => {
  it('should handle full conversation flow', async () => {
    render(
      <MockAIProvider>
        <AIChat />
      </MockAIProvider>
    );

    // Start conversation
    const startButton = screen.getByText(/Kostenlose Beratung starten/i);
    fireEvent.click(startButton);

    // Check for initial message
    await waitFor(() => {
      expect(screen.getByText(/Herzlich willkommen/i)).toBeInTheDocument();
    });

    // Send message
    const messageInput = screen.getByPlaceholderText(/Ihre Frage/i);
    const sendButton = screen.getByRole('button', { name: /Senden/i });

    fireEvent.change(messageInput, { target: { value: 'Welche Anlage für 500m² Dach?' } });
    fireEvent.click(sendButton);

    // Verify AI response
    await waitFor(() => {
      expect(screen.getByText(/Für Ihr 500m² Dach empfehle ich/i)).toBeInTheDocument();
    });
  });
});
```

### 🌐 E2E Testing (Playwright)
```typescript
// solar-calculator.e2e.ts
import { test, expect } from '@playwright/test';

test.describe('Solar Calculator E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/rechner/photovoltaik');
  });

  test('should complete full calculation flow', async ({ page }) => {
    // Step 1: Enter basic information
    await page.fill('[data-testid="power-input"]', '75');
    await page.fill('[data-testid="consumption-input"]', '95000');
    await page.fill('[data-testid="location-input"]', 'Berlin, Deutschland');

    // Step 2: Click calculate
    await page.click('[data-testid="calculate-button"]');

    // Step 3: Verify results
    await expect(page.locator('[data-testid="annual-production"]')).toContainText('75.000');
    await expect(page.locator('[data-testid="roi-period"]')).toBeVisible();
    await expect(page.locator('[data-testid="co2-savings"]')).toBeVisible();

    // Step 4: Request offer
    await page.click('[data-testid="request-offer-button"]');

    await expect(page.locator('[data-testid="contact-form"]')).toBeVisible();
  });

  test('should handle validation errors', async ({ page }) => {
    await page.click('[data-testid="calculate-button"]');

    await expect(page.locator('[data-testid="power-error"]')).toContainText('Bitte geben Sie die Systemgröße an');
    await expect(page.locator('[data-testid="consumption-error"]')).toContainText('Bitte geben Sie Ihren Verbrauch an');
  });
});
```

---

## 🔧 Development Tools & Setup

### 🛠️ VS Code Extensions
```json
// .vscode/extensions.json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json",
    "streetsidesoftware.code-spell-checker"
  ]
}
```

### 📏 ESLint Configuration
```javascript
// eslint.config.js
module.exports = {
  extends: [
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'jsx-a11y/anchor-is-valid': 'warn'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
```

### 🎨 Prettier Configuration
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

---

## 🚀 Performance Optimierung

### ⚡ React Performance

#### **Memoization Patterns**
```typescript
// ✅ GUT: React.memo für expensive components
const ExpensiveSolarChart = React.memo<SolarChartProps>(({ data, options }) => {
  const chartData = React.useMemo(() => {
    return processSolarData(data);
  }, [data]);

  return (
    <Chart data={chartData} options={options} />
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.data.length === nextProps.data.length &&
    prevProps.options.type === nextProps.options.type
  );
});

// ✅ GUT: useMemo für expensive calculations
const useSolarCalculations = (power: number, location: string) => {
  return React.useMemo(() => {
    // Expensive calculation
    return calculateSolarPotential(power, location);
  }, [power, location]);
};

// ✅ GUT: useCallback für event handlers
const SolarCalculator = () => {
  const [power, setPower] = React.useState(50);

  const handlePowerChange = React.useCallback((value: number) => {
    setPower(value);
  }, []);

  return (
    <PowerInput onPowerChange={handlePowerChange} />
  );
};
```

#### **Code Splitting**
```typescript
// ✅ GUT: Lazy Loading für schwere Komponenten
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const SolarCalculator = React.lazy(() => import('./components/SolarCalculator'));
const AIChat = React.lazy(() => import('./components/ai-chat/AIChat'));

// Router mit Suspense
const App = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/rechner" element={<SolarCalculator />} />
          <Route path="/chat" element={<AIChat />} />
        </Routes>
      </Suspense>
    </Router>
  );
};
```

### 📦 Bundle Optimierung
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion', '@headlessui/react', '@heroicons/react'],
          charts: ['recharts', 'd3'],
          utils: ['date-fns', 'lodash-es']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
```

### 🖼️ Image Optimization
```typescript
// ✅ GUT: Responsive Images mit next/image
const OptimizedImage = ({ src, alt, width, height, ...props }) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      {...props}
      style={{
        objectFit: 'cover',
        width: '100%',
        height: 'auto'
      }}
    />
  );
};

// ✅ GUT: Progressive Image Loading
const ProgressiveImage = ({ src, placeholder, alt }) => {
  const [imageSrc, setImageSrc] = React.useState(placeholder);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
  }, [src]);

  return (
    <div className="relative overflow-hidden">
      <img
        src={imageSrc}
        alt={alt}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
      />
    </div>
  );
};
```

---

## 🔐 Security Best Practices

### 🛡️ Input Validation
```typescript
// ✅ GUT: Server-side validation
import z from 'zod';

const SolarProjectSchema = z.object({
  title: z.string().min(1).max(100),
  power: z.number().min(1).max(1000),
  location: z.object({
    address: z.string().min(1),
    coordinates: z.object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180)
    })
  }),
  email: z.string().email()
});

// Client-side validation
const validateProject = (data: unknown) => {
  return SolarProjectSchema.parse(data);
};
```

### 🔒 API Security
```typescript
// ✅ GUT: Secure API calls
const secureAPICall = async (endpoint: string, options: RequestInit = {}) => {
  const token = getStoredAuthToken();

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-API-Version': '1.0',
      ...options.headers
    },
    credentials: 'same-origin'
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};
```

### 🚫 XSS Prevention
```typescript
// ✅ GUT: Safe HTML rendering
import { DOMPurify } from 'dompurify';

const SafeHTMLContent = ({ content }: { content: string }) => {
  const cleanContent = React.useMemo(() => {
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: ['class']
    });
  }, [content]);

  return <div dangerouslySetInnerHTML={{ __html: cleanContent }} />;
};
```

---

## 🔄 CI/CD Pipeline

### 📋 GitHub Actions Workflow
```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Type checking
        run: npm run type-check

  build:
    needs: [test, lint]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: dist/

  deploy:
    if: github.ref == 'refs/heads/main'
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: dist/

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 📊 Monitoring & Debugging

### 🔍 Error Monitoring
```typescript
// ✅ GUT: Error Boundary mit Logging
class ErrorBoundary extends React.Component<{ children: React.ReactNode }> {
  state = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error tracking service
    console.error('React Error:', error, errorInfo);

    // Send to monitoring service
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.track('React Error', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}
```

### 📈 Performance Monitoring
```typescript
// ✅ GUT: Performance API integration
const usePerformanceMonitoring = () => {
  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Monitor Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          switch (entry.entryType) {
            case 'navigation':
              const navEntry = entry as PerformanceNavigationTiming;
              console.log('Page Load Time:', navEntry.loadEventEnd - navEntry.loadEventStart);
              break;
            case 'paint':
              const paintEntry = entry as PerformancePaintTiming;
              console.log(`${paintEntry.name}:`, paintEntry.startTime);
              break;
          }
        }
      });

      observer.observe({ entryTypes: ['navigation', 'paint'] });
    }
  }, []);
};
```

---

## 📚 Ressourcen & Dokumentation

### 📖 Interne Dokumentation
- **[Component Library](./docs/components.md)** - UI-Komponenten
- **[API Reference](./API_REFERENCE.md)** - REST API Dokumentation
- **[Serena MCP Guide](./SERENA_MCP_GUIDE.md)** - AI-Integration
- **[Notion CMS Guide](./NOTION_CMS_GUIDE.md)** - Content Management

### 🔗 Externe Ressourcen
- **[React 19 Documentation](https://react.dev/)**
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)**
- **[Vite Guide](https://vitejs.dev/guide/)**
- **[TailwindCSS Documentation](https://tailwindcss.com/docs)**
- **[Testing Library](https://testing-library.com/docs/)**
- **[Playwright Testing](https://playwright.dev/)**
- **[Web Performance](https://web.dev/performance/)**

### 🎯 Best Practices
- **[React Best Practices](https://react.dev/learn/thinking-in-react)**
- **[TypeScript Best Practices](https://typescript-eslint.io/rules/)**
- **[Performance Guidelines](https://web.dev/fast/)**
- **[Security Guidelines](https://owasp.org/)**
- **[Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)**

---

## 🤝 Contribution Guidelines

### 🔄 Development Workflow
```bash
# 1. Feature Branch erstellen
git checkout -b feature/solar-calculator-improvement

# 2. Development
# ... code changes ...

# 3. Testing & Linting
npm run test
npm run lint
npm run type-check

# 4. Commit (Conventional Commits)
git add .
git commit -m "feat(calculator): add ROI calculation with dynamic pricing"

# 5. Push & PR
git push origin feature/solar-calculator-improvement
# Create Pull Request auf GitHub
```

### 📝 Commit Conventions
```bash
# Format: <type>(<scope>): <description>

feat: new feature
fix: bug fix
docs: documentation changes
style: formatting, missing semi colons, etc.
refactor: refactoring production code
test: adding tests, refactoring test
chore: updating build tasks, package manager configs, etc.
```

### 🧪 PR Checklist
- [ ] Code follows project style guidelines
- [ ] All tests pass (`npm test`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] TypeScript compilation succeeds
- [ ] Components are properly tested
- [ ] Documentation is updated
- [ ] Performance impact considered
- [ ] Accessibility implications checked

---

## 🚀 Deployment

### 🌍 Environment Configuration
```bash
# Development (.env.development)
VITE_API_URL=http://localhost:5001/api
VITE_OPENROUTER_API_KEY=your_dev_key
VITE_GOOGLE_MAPS_API_KEY=your_dev_maps_key

# Staging (.env.staging)
VITE_API_URL=https://staging.zoe-solar.de/api
VITE_OPENROUTER_API_KEY=${STAGING_OPENROUTER_KEY}

# Production (.env.production)
VITE_API_URL=https://zoe-solar.de/api
VITE_OPENROUTER_API_KEY=${PRODUCTION_OPENROUTER_KEY}
```

### 📦 Build & Deploy Commands
```bash
# Development
npm run dev              # Development server
npm run build:dev        # Development build

# Testing
npm run test             # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage
npm run e2e              # End-to-end tests

# Production
npm run build            # Production build
npm run preview          # Preview production build
npm run deploy           # Deploy to production
```

---

<div align="center">
  <h3>🚀 ZOE Solar Development Team</h3>
  <p><strong>Enterprise Development · Modern Stack · Best Practices</strong></p>
  <p>🌞 <em>Gemeinsam die Zukunft der Solarenergie programmieren!</em> 🌞</p>
</div>

---

**📊 Development Version:** 1.0.0
**🚀 Status:** Production Ready
**📈 Code Coverage:** > 85%
**🔒 Security:** Enterprise Level
**📅 Last Update:** 17. November 2025
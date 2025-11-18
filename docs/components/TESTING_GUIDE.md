# 🧪 ZOE Solar Testing Guide

## 📋 Overview

Dieser umfassende Testing Guide etabliert Best Practices, Tools und Strategien für das Testing der ZOE Solar React-Anwendung. Das Ziel ist eine robuste, zuverlässige und wartbare Codebasis mit hoher Testabdeckung.

---

## 🎯 Testing Philosophy

### Testing Pyramid
```
    🔸 E2E Tests (10%)
         User Journey Testing
         Critical Path Testing

    🔸 Integration Tests (20%)
         Component Integration
         API Integration
         Service Integration

    🔸 Unit Tests (70%)
         Pure Functions
         Component Logic
         Utility Functions
         Business Logic
```

### Testing Principles
1. **Fast Feedback**: Unit Tests sollten unter 100ms laufen
2. **Isolation**: Tests sollten unabhängig voneinander sein
3. **Repeatability**: Tests sollten konsistente Ergebnisse liefern
4. **Clarity**: Test-Code sollte lesbar und verständlich sein
5. **Coverage**: Alle wichtigen Code-Pfade abdecken

---

## 🛠️ Testing Stack

### Core Testing Libraries
```json
{
  "jest": "^29.7.0",
  "@testing-library/react": "^14.1.2",
  "@testing-library/jest-dom": "^6.1.5",
  "@testing-library/user-event": "^14.5.1",
  "@testing-library/cypress": "^10.0.1",
  "msw": "^2.0.8",
  "cypress": "^13.6.0",
  "playwright": "^1.40.1"
}
```

### Testing Utilities
```json
{
  "@testing-library/react-hooks": "^8.0.1",
  "@testing-library/react-native": "^12.4.2",
  "jest-environment-jsdom": "^29.7.0",
  "jest-axe": "^8.0.0",
  "jest-emotion": "^11.0.0",
  "identity-obj-proxy": "^3.0.0"
}
```

### Code Coverage & Quality
```json
{
  "@types/jest": "^29.5.8",
  "codecov": "^3.8.3",
  "coveralls": "^3.1.1",
  "cross-env": "^7.0.3",
  "eslint-plugin-jest": "^27.6.0"
}
```

---

## 📦 Test Structure & Organization

### Directory Structure
```
src/
├── __tests__/
│   ├── __mocks__/
│   │   ├── fileMock.js
│   │   └── styleMock.js
│   ├── setup/
│   │   ├── jest.setup.js
│   │   ├── test-utils.jsx
│   │   └── msw-handlers.js
│   └── fixtures/
│       ├── users.ts
│       ├── projects.ts
│       └── api-responses.ts
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   ├── Button.stories.tsx
│   │   └── index.ts
│   └── ContactForm/
│       ├── ContactForm.tsx
│       ├── ContactForm.test.tsx
│       ├── ContactForm.integration.test.tsx
│       └── ContactForm.e2e.test.tsx
├── hooks/
│   ├── useAuth/
│   │   ├── useAuth.ts
│   │   ├── useAuth.test.ts
│   │   └── useAuth.integration.test.ts
├── services/
│   ├── api/
│   │   ├── api.ts
│   │   ├── api.test.ts
│   │   └── api.integration.test.ts
└── utils/
    ├── calculator.ts
    ├── calculator.test.ts
    └── calculator.integration.test.ts
```

### File Naming Conventions
- **Unit Tests**: `Component.test.tsx` oder `hook.test.ts`
- **Integration Tests**: `Component.integration.test.tsx`
- **E2E Tests**: `Component.e2e.test.tsx`
- **Storybook Stories**: `Component.stories.tsx`
- **Test Utilities**: `test-utils.tsx` oder `setup-tests.ts`

---

## 🧪 Unit Testing

### Component Testing Patterns

#### Simple Component Testing
```typescript
// components/Button/Button.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  // Basic Rendering Tests
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Button>Click me</Button>);

      const button = screen.getByRole('button', { name: 'Click me' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('button-base', 'button-primary', 'button-md');
    });

    it('renders with custom variant', () => {
      render(
        <Button variant="secondary" size="lg">
          Secondary Button
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('button-secondary', 'button-lg');
    });

    it('renders as disabled', () => {
      render(<Button disabled>Disabled Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });
  });

  // Interaction Testing
  describe('Interactions', () => {
    it('calls onClick when clicked', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', () => {
      const handleClick = jest.fn();
      render(
        <Button onClick={handleClick} disabled>
          Disabled Button
        </Button>
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('handles keyboard interactions', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole('button');
      fireEvent.keyDown(button, { key: 'Enter' });

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  // Accessibility Testing
  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <Button aria-label="Close dialog" aria-describedby="close-description">
          ×
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Close dialog');
      expect(button).toHaveAttribute('aria-describedby', 'close-description');
    });

    it('is focusable', () => {
      render(<Button>Focusable Button</Button>);

      const button = screen.getByRole('button');
      button.focus();

      expect(button).toHaveFocus();
    });
  });
});
```

#### Complex Component Testing
```typescript
// components/ContactForm/ContactForm.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from './ContactForm';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Mock API server setup
const server = setupServer(
  rest.post('/api/contact', (req, res, ctx) => {
    return res(ctx.json({ success: true, message: 'Contact form submitted' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('ContactForm Component', () => {
  const user = userEvent.setup();

  // Initial State Tests
  describe('Initial State', () => {
    it('renders all form fields', () => {
      render(<ContactForm onSubmit={jest.fn()} />);

      expect(screen.getByLabelText(/vorname/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/nachname/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/nachricht/i)).toBeInTheDocument();
      expect(screen.getByRole('checkbox', { name: /datenschutz/i })).toBeInTheDocument();
    });

    it('submit button is disabled initially', () => {
      render(<ContactForm onSubmit={jest.fn()} />);

      const submitButton = screen.getByRole('button', { name: /senden/i });
      expect(submitButton).toBeDisabled();
    });
  });

  // Form Validation Tests
  describe('Form Validation', () => {
    it('shows validation errors for required fields', async () => {
      render(<ContactForm onSubmit={jest.fn()} />);

      const submitButton = screen.getByRole('button', { name: /senden/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/vorname ist ein pflichtfeld/i)).toBeInTheDocument();
        expect(screen.getByText(/e-mail ist ein pflichtfeld/i)).toBeInTheDocument();
        expect(screen.getByText(/datenschutz muss akzeptiert werden/i)).toBeInTheDocument();
      });
    });

    it('validates email format', async () => {
      render(<ContactForm onSubmit={jest.fn()} />);

      const emailInput = screen.getByLabelText(/e-mail/i);
      await user.type(emailInput, 'invalid-email');

      await user.tab(); // blur the input

      await waitFor(() => {
        expect(screen.getByText(/bitte geben sie eine gültige e-mail/i)).toBeInTheDocument();
      });
    });

    it('enables submit button when form is valid', async () => {
      render(<ContactForm onSubmit={jest.fn()} />);

      await user.type(screen.getByLabelText(/vorname/i), 'Max');
      await user.type(screen.getByLabelText(/nachname/i), 'Mustermann');
      await user.type(screen.getByLabelText(/e-mail/i), 'max@test.de');
      await user.type(screen.getByLabelText(/nachricht/i), 'Test message');
      await user.click(screen.getByRole('checkbox', { name: /datenschutz/i }));

      const submitButton = screen.getByRole('button', { name: /senden/i });
      expect(submitButton).not.toBeDisabled();
    });
  });

  // Form Submission Tests
  describe('Form Submission', () => {
    it('submits form with valid data', async () => {
      const handleSubmit = jest.fn();
      render(<ContactForm onSubmit={handleSubmit} />);

      await user.type(screen.getByLabelText(/vorname/i), 'Max');
      await user.type(screen.getByLabelText(/nachname/i), 'Mustermann');
      await user.type(screen.getByLabelText(/e-mail/i), 'max@test.de');
      await user.type(screen.getByLabelText(/nachricht/i), 'Test message');
      await user.click(screen.getByRole('checkbox', { name: /datenschutz/i }));

      await user.click(screen.getByRole('button', { name: /senden/i }));

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith({
          firstName: 'Max',
          lastName: 'Mustermann',
          email: 'max@test.de',
          message: 'Test message',
          privacyConsent: true
        });
      });
    });

    it('shows loading state during submission', async () => {
      const handleSubmit = jest.fn(() => new Promise(resolve => setTimeout(resolve, 1000)));
      render(<ContactForm onSubmit={handleSubmit} />);

      // Fill form
      await user.type(screen.getByLabelText(/vorname/i), 'Max');
      await user.type(screen.getByLabelText(/e-mail/i), 'max@test.de');
      await user.click(screen.getByRole('checkbox', { name: /datenschutz/i }));

      await user.click(screen.getByRole('button', { name: /senden/i }));

      expect(screen.getByText(/wird gesendet/i)).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  // Error Handling Tests
  describe('Error Handling', () => {
    it('handles API errors gracefully', async () => {
      server.use(
        rest.post('/api/contact', (req, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({ error: 'Server error' })
          );
        })
      );

      render(<ContactForm onSubmit={jest.fn()} />);

      // Fill and submit form
      await user.type(screen.getByLabelText(/vorname/i), 'Max');
      await user.type(screen.getByLabelText(/e-mail/i), 'max@test.de');
      await user.click(screen.getByRole('checkbox', { name: /datenschutz/i }));

      await user.click(screen.getByRole('button', { name: /senden/i }));

      await waitFor(() => {
        expect(screen.getByText(/fehler beim senden/i)).toBeInTheDocument();
      });
    });
  });
});
```

### Hook Testing Patterns

#### Custom Hook Testing
```typescript
// hooks/useCalculator/useCalculator.test.ts
import { renderHook, act } from '@testing-library/react';
import { useCalculator } from './useCalculator';

describe('useCalculator Hook', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => useCalculator());

    expect(result.current.systemSize).toBe(0);
    expect(result.current.annualProduction).toBe(0);
    expect(result.current.roi).toBe(0);
    expect(result.current.errors).toEqual({});
  });

  it('updates values when setters are called', () => {
    const { result } = renderHook(() => useCalculator());

    act(() => {
      result.current.setRoofSize(500);
      result.current.setConsumption(10000);
    });

    expect(result.current.roofSize).toBe(500);
    expect(result.current.consumption).toBe(10000);
  });

  it('calculates system size correctly', () => {
    const { result } = renderHook(() => useCalculator());

    act(() => {
      result.current.setRoofSize(500);
    });

    const expectedSystemSize = 500 * 0.2; // roofSize * kwpPerSqM
    expect(result.current.systemSize).toBe(expectedSystemSize);
  });

  it('validates input values', () => {
    const { result } = renderHook(() => useCalculator());

    act(() => {
      result.current.setRoofSize(-10); // Invalid negative value
    });

    expect(result.current.errors.roofSize).toBe('Dachgröße muss positiv sein');
  });

  it('handles async calculations', async () => {
    const { result } = renderHook(() => useCalculator());

    act(() => {
      result.current.setRoofSize(1000);
      result.current.calculateSavings();
    });

    await act(async () => {
      await result.current.calculationPromise;
    });

    expect(result.current.annualSavings).toBeGreaterThan(0);
  });
});
```

### Utility Function Testing

#### Pure Function Testing
```typescript
// utils/calculator/calculator.test.ts
import {
  calculateROI,
  calculateCO2Savings,
  formatCurrency,
  validateSolarInputs
} from './calculator';

describe('Calculator Utilities', () => {
  describe('calculateROI', () => {
    it('calculates correct ROI for valid inputs', () => {
      const result = calculateROI({
        systemCost: 50000,
        annualSavings: 8000,
        maintenanceCost: 500,
        financingCost: 1000
      });

      expect(result.roi).toBeCloseTo(13.0, 1);
      expect(result.paybackPeriod).toBeCloseTo(6.25, 2);
      expect(result.netPresentValue).toBeGreaterThan(0);
    });

    it('returns 0 ROI for zero savings', () => {
      const result = calculateROI({
        systemCost: 50000,
        annualSavings: 0,
        maintenanceCost: 500,
        financingCost: 1000
      });

      expect(result.roi).toBe(0);
      expect(result.paybackPeriod).toBe(Infinity);
    });

    it('handles edge cases', () => {
      expect(() => calculateROI({
        systemCost: -1000, // Invalid negative cost
        annualSavings: 8000,
        maintenanceCost: 500,
        financingCost: 1000
      })).toThrow('System cost must be positive');
    });
  });

  describe('calculateCO2Savings', () => {
    it('calculates CO2 savings correctly', () => {
      const annualProduction = 10000; // kWh
      const co2Factor = 0.401; // kg/kWh

      const result = calculateCO2Savings(annualProduction);

      expect(result.annual).toBeCloseTo(4.01, 2); // tons
      expect(result.twentyFiveYears).toBeCloseTo(100.25, 2);
      expect(result.equivalent.treesPlanted).toBeCloseTo(185, 0);
    });
  });

  describe('formatCurrency', () => {
    it('formats currency with German locale', () => {
      expect(formatCurrency(1234.56)).toBe('1.234,56 €');
      expect(formatCurrency(0)).toBe('0,00 €');
      expect(formatCurrency(1000000)).toBe('1.000.000,00 €');
    });

    it('handles edge cases', () => {
      expect(formatCurrency(null)).toBe('0,00 €');
      expect(formatCurrency(undefined)).toBe('0,00 €');
      expect(formatCurrency('invalid')).toBe('0,00 €');
    });
  });

  describe('validateSolarInputs', () => {
    it('validates all required fields', () => {
      const errors = validateSolarInputs({
        roofSize: 100,
        consumption: 5000
      });

      expect(errors).toEqual({});
    });

    it('returns validation errors for invalid inputs', () => {
      const errors = validateSolarInputs({
        roofSize: -10,
        consumption: 0,
        budget: -100
      });

      expect(errors.roofSize).toBe('Dachgröße muss positiv sein');
      expect(errors.consumption).toBe('Verbrauch muss positiv sein');
      expect(errors.budget).toBe('Budget muss positiv sein');
    });
  });
});
```

---

## 🔗 Integration Testing

### Component Integration Testing

#### Form with API Integration
```typescript
// components/ContactForm/ContactForm.integration.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ContactForm } from './ContactForm';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Setup mock server with realistic API responses
const server = setupServer(
  rest.post('/api/contact', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        success: true,
        data: {
          id: 'contact_123',
          message: 'Vielen Dank für Ihre Anfrage',
          leadScore: 85
        }
      })
    );
  }),

  rest.get('/api/config/contact-form', (req, res, ctx) => {
    return res(
      ctx.json({
        fields: [
          { name: 'firstName', required: true, type: 'text' },
          { name: 'email', required: true, type: 'email' },
          { name: 'company', required: false, type: 'text' }
        ],
        validation: {
          firstName: { minLength: 2, maxLength: 50 },
          email: { pattern: 'email' }
        }
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Test wrapper with required providers
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('ContactForm Integration Tests', () => {
  const user = userEvent.setup();

  it('submits form and receives API response', async () => {
    render(
      <TestWrapper>
        <ContactForm />
      </TestWrapper>
    );

    // Wait for form configuration to load
    await waitFor(() => {
      expect(screen.getByLabelText(/vorname/i)).toBeInTheDocument();
    });

    // Fill form
    await user.type(screen.getByLabelText(/vorname/i), 'Max');
    await user.type(screen.getByLabelText(/e-mail/i), 'max@test.de');
    await user.type(screen.getByLabelText(/unternehmen/i), 'Test Company');
    await user.type(screen.getByLabelText(/nachricht/i), 'Test message');
    await user.click(screen.getByRole('checkbox', { name: /datenschutz/i }));

    // Submit form
    await user.click(screen.getByRole('button', { name: /senden/i }));

    // Verify success response
    await waitFor(() => {
      expect(screen.getByText(/vielen dank für ihre anfrage/i)).toBeInTheDocument();
    });
  });

  it('handles API errors with retry mechanism', async () => {
    let attemptCount = 0;
    server.use(
      rest.post('/api/contact', (req, res, ctx) => {
        attemptCount++;
        if (attemptCount < 3) {
          return res(ctx.status(500), ctx.json({ error: 'Server error' }));
        }
        return res(ctx.status(201), ctx.json({ success: true }));
      })
    );

    render(
      <TestWrapper>
        <ContactForm />
      </TestWrapper>
    );

    // Fill and submit form
    await user.type(screen.getByLabelText(/vorname/i), 'Max');
    await user.type(screen.getByLabelText(/e-mail/i), 'max@test.de');
    await user.click(screen.getByRole('checkbox', { name: /datenschutz/i }));

    await user.click(screen.getByRole('button', { name: /senden/i }));

    // Should show retry indicator
    await waitFor(() => {
      expect(screen.getByText(/versuch wird wiederholt/i)).toBeInTheDocument();
    }, { timeout: 5000 });

    // Should eventually succeed
    await waitFor(() => {
      expect(screen.getByText(/anfrage erfolgreich/i)).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  it('integrates with analytics tracking', async () => {
    const mockTrack = jest.fn();

    // Mock analytics
    window.gtag = mockTrack;
    window.fbq = jest.fn();

    render(
      <TestWrapper>
        <ContactForm analyticsEnabled={true} />
      </TestWrapper>
    );

    // Fill and submit form
    await user.type(screen.getByLabelText(/vorname/i), 'Max');
    await user.type(screen.getByLabelText(/e-mail/i), 'max@test.de');
    await user.click(screen.getByRole('checkbox', { name: /datenschutz/i }));

    await user.click(screen.getByRole('button', { name: /senden/i }));

    await waitFor(() => {
      expect(mockTrack).toHaveBeenCalledWith('event', 'form_submit', {
        event_category: 'contact_form',
        event_label: 'contact_page'
      });
    });
  });
});
```

### API Integration Testing

#### Service Layer Integration
```typescript
// services/api/api.integration.test.ts
import { apiClient } from './apiClient';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/projects', (req, res, ctx) => {
    const page = req.url.searchParams.get('page') || '1';
    const limit = req.url.searchParams.get('limit') || '10';

    return res(
      ctx.json({
        success: true,
        data: {
          projects: [
            {
              id: 'proj_1',
              title: 'Test Project 1',
              status: 'active',
              progress: 75
            },
            {
              id: 'proj_2',
              title: 'Test Project 2',
              status: 'completed',
              progress: 100
            }
          ],
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: 2,
            totalPages: 1
          }
        }
      })
    );
  }),

  rest.post('/api/projects', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        success: true,
        data: {
          id: 'proj_new',
          title: 'New Project',
          status: 'pending'
        }
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('API Client Integration', () => {
  it('fetches projects with pagination', async () => {
    const response = await apiClient.get('/projects', {
      params: { page: 1, limit: 10 }
    });

    expect(response.data.success).toBe(true);
    expect(response.data.data.projects).toHaveLength(2);
    expect(response.data.data.pagination.page).toBe(1);
  });

  it('creates new project', async () => {
    const projectData = {
      title: 'New Project',
      type: 'photovoltaik',
      power: 250
    };

    const response = await apiClient.post('/projects', projectData);

    expect(response.status).toBe(201);
    expect(response.data.success).toBe(true);
    expect(response.data.data.title).toBe('New Project');
  });

  it('handles authentication errors', async () => {
    server.use(
      rest.get('/api/projects', (req, res, ctx) => {
        return res(
          ctx.status(401),
          ctx.json({ error: 'Unauthorized' })
        );
      })
    );

    await expect(apiClient.get('/projects')).rejects.toThrow();
  });
});
```

---

## 🎭 End-to-End Testing

### Cypress E2E Testing

#### Critical User Journey Testing
```typescript
// cypress/e2e/contact-form-journey.cy.ts
describe('Contact Form User Journey', () => {
  beforeEach(() => {
    // Setup API mocking
    cy.intercept('POST', '/api/contact', {
      fixture: 'contact-form-success.json'
    }).as('submitContact');

    cy.intercept('GET', '/api/config/contact-form', {
      fixture: 'contact-form-config.json'
    }).as('getContactConfig');

    // Visit page
    cy.visit('/kontakt');
  });

  it('completes full contact form journey', () => {
    // Step 1: Page loads correctly
    cy.get('[data-testid="page-title"]').should('contain', 'Kontakt');
    cy.get('[data-testid="contact-form"]').should('be.visible');

    // Step 2: Fill personal information
    cy.get('[data-testid="salutation-select"]').click();
    cy.get('[data-value="herr"]').click();

    cy.get('[data-testid="first-name-input"]')
      .type('Max')
      .should('have.value', 'Max');

    cy.get('[data-testid="last-name-input"]')
      .type('Mustermann')
      .should('have.value', 'Mustermann');

    cy.get('[data-testid="email-input"]')
      .type('max@test.de')
      .should('have.value', 'max@test.de');

    // Step 3: Fill project information
    cy.get('[data-testid="project-type-select"]').click();
    cy.get('[data-value="photovoltaik"]').click();

    cy.get('[data-testid="roof-size-input"]')
      .type('500')
      .should('have.value', '500');

    // Step 4: Fill message
    cy.get('[data-testid="message-textarea"]')
      .type('Ich interessiere mich für eine Solaranlage.')
      .should('contain', 'Solaranlage');

    // Step 5: Accept privacy policy
    cy.get('[data-testid="privacy-checkbox"]')
      .check()
      .should('be.checked');

    // Step 6: Submit form
    cy.get('[data-testid="submit-button"]')
      .should('not.be.disabled')
      .click();

    // Step 7: Verify submission
    cy.wait('@submitContact');

    cy.get('[data-testid="success-message"]')
      .should('be.visible')
      .and('contain', 'Vielen Dank');

    // Step 8: Verify analytics tracking
    cy.get('@submitContact').should((xhr) => {
      expect(xhr.request.body).to.include({
        firstName: 'Max',
        lastName: 'Mustermann',
        email: 'max@test.de',
        projectType: 'photovoltaik'
      });
    });
  });

  it('handles validation errors correctly', () => {
    // Try to submit empty form
    cy.get('[data-testid="submit-button"]').click();

    // Check validation errors
    cy.get('[data-testid="first-name-error"]')
      .should('be.visible')
      .and('contain', 'Pflichtfeld');

    cy.get('[data-testid="email-error"]')
      .should('be.visible')
      .and('contain', 'Pflichtfeld');

    cy.get('[data-testid="privacy-error"]')
      .should('be.visible')
      .and('contain', 'akzeptiert werden');
  });

  it('shows loading state during submission', () => {
    // Fill form minimally
    cy.get('[data-testid="first-name-input"]').type('Test');
    cy.get('[data-testid="email-input"]').type('test@test.de');
    cy.get('[data-testid="privacy-checkbox"]').check();

    // Submit with slow response
    cy.intercept('POST', '/api/contact', {
      delay: 2000,
      fixture: 'contact-form-success.json'
    }).as('submitContactSlow');

    cy.get('[data-testid="submit-button"]').click();

    // Verify loading state
    cy.get('[data-testid="submit-button"]')
      .should('be.disabled')
      .and('contain', 'Wird gesendet');

    cy.get('[data-testid="loading-spinner"]').should('be.visible');

    // Wait for completion
    cy.wait('@submitContactSlow');
    cy.get('[data-testid="success-message"]').should('be.visible');
  });
});
```

### Playwright Testing

#### Cross-Browser E2E Testing
```typescript
// tests/e2e/calculator-journey.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Calculator Journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/rechner');
  });

  test('calculates solar ROI correctly', async ({ page }) => {
    // Set roof size
    await page.fill('[data-testid="roof-size-slider"]', '500');
    await expect(page.locator('[data-testid="roof-size-value"]')).toContainText('500');

    // Set consumption
    await page.fill('[data-testid="consumption-input"]', '50000');
    await expect(page.locator('[data-testid="consumption-input"]')).toHaveValue('50000');

    // Calculate
    await page.click('[data-testid="calculate-button"]');

    // Wait for results
    await expect(page.locator('[data-testid="results-section"]')).toBeVisible();

    // Verify calculations
    await expect(page.locator('[data-testid="system-size"]')).toContainText('100');
    await expect(page.locator('[data-testid="annual-production"]')).toContainText('105.000');
    await expect(page.locator('[data-testid="annual-savings"]')).toContainText('€');
    await expect(page.locator('[data-testid="roi"]')).toContainText('%');

    // Download results
    const downloadPromise = page.waitForEvent('download');
    await page.click('[data-testid="download-pdf-button"]');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/solar-angebot.*\.pdf/);
  });

  test('handles edge cases in calculations', async ({ page }) => {
    // Test with minimum values
    await page.fill('[data-testid="roof-size-slider"]', '10');
    await page.click('[data-testid="calculate-button"]');

    await expect(page.locator('[data-testid="warning-message"]'))
      .toContainText('Dachgröße für wirtschaftliche Betreibung');

    // Test with maximum values
    await page.fill('[data-testid="roof-size-slider"]', '10000');
    await page.click('[data-testid="calculate-button"]');

    await expect(page.locator('[data-testid="system-size"]')).toContainText('2.000');
  });

  test('integrates with CRM after calculation', async ({ page }) => {
    // Mock CRM API
    await page.route('/api/crm/lead', (route) => {
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          leadId: 'lead_123'
        })
      });
    });

    // Complete calculation
    await page.fill('[data-testid="roof-size-slider"]', '500');
    await page.fill('[data-testid="consumption-input"]', '50000');
    await page.click('[data-testid="calculate-button"]');

    // Request consultation
    await page.fill('[data-testid="consultation-name"]', 'Test User');
    await page.fill('[data-testid="consultation-email"]', 'test@test.de');
    await page.fill('[data-testid="consultation-phone"]', '+49 123 456789');
    await page.click('[data-testid="request-consultation-button"]');

    // Verify CRM integration
    await expect(page.locator('[data-testid="success-message"]'))
      .toContainText('Beratung angefordert');

    const requests = await page.requests();
    const crmRequest = requests.find(req => req.url().includes('/api/crm/lead'));
    expect(crmRequest).toBeTruthy();
  });
});
```

---

## 🎯 Performance Testing

### Component Performance Testing
```typescript
// components/performance/PerformanceReport.test.tsx
import { render, screen } from '@testing-library/react';
import { PerformanceReport } from './PerformanceReport';
import { act } from 'react-dom/test-utils';

describe('PerformanceReport Performance', () => {
  it('renders large datasets efficiently', () => {
    const startTime = performance.now();

    const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      value: Math.random() * 100,
      timestamp: new Date(Date.now() - i * 1000)
    }));

    act(() => {
      render(<PerformanceReport data={largeDataset} />);
    });

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Should render within 100ms
    expect(renderTime).toBeLessThan(100);

    expect(screen.getByTestId('performance-report')).toBeInTheDocument();
  });

  it('handles memory leaks correctly', () => {
    const initialMemory = performance.memory?.usedJSHeapSize || 0;

    const { unmount } = render(<PerformanceReport />);

    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }

    unmount();

    // Force garbage collection again
    if (global.gc) {
      global.gc();
    }

    const finalMemory = performance.memory?.usedJSHeapSize || 0;
    const memoryIncrease = finalMemory - initialMemory;

    // Memory increase should be minimal
    expect(memoryIncrease).toBeLessThan(1024 * 1024); // 1MB
  });
});
```

### Load Testing Integration
```typescript
// tests/performance/load-testing.spec.ts
import { test } from '@playwright/test';

test.describe('Load Testing', () => {
  test('handles concurrent calculator requests', async ({ page }) => {
    const requests = [];

    page.on('request', (request) => {
      if (request.url().includes('/api/calculator')) {
        requests.push(request);
      }
    });

    // Simulate multiple simultaneous calculations
    const promises = Array.from({ length: 10 }, (_, i) =>
      page.evaluate((index) => {
        return fetch('/api/calculator', {
          method: 'POST',
          body: JSON.stringify({
            roofSize: 100 + index * 10,
            consumption: 5000 + index * 100
          })
        });
      }, i)
    );

    await Promise.all(promises);

    expect(requests).toHaveLength(10);

    // Verify all requests completed successfully
    for (const request of requests) {
      expect(request.status()).toBe(200);
    }
  });
});
```

---

## 📊 Code Coverage & Quality

### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup/jest.setup.js'],
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/__tests__/__mocks__/fileMock.js',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/**/index.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    './src/components/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    },
    './src/utils/': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95
    }
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{test,spec}.{ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{ts,tsx}'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testTimeout: 10000
};
```

### Coverage Reporting
```json
// package.json scripts
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --coverage --ci --watchAll=false",
    "test:coverage:report": "jest --coverage && codecov",
    "test:performance": "jest --testMatch=**/*.perf.test.js"
  }
}
```

### Quality Gates
```typescript
// tests/helpers/qualityGates.ts
export const coverageThresholds = {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80
  },
  components: {
    branches: 90,
    functions: 90,
    lines: 90,
    statements: 90
  },
  utilities: {
    branches: 95,
    functions: 95,
    lines: 95,
    statements: 95
  }
};

export const performanceThresholds = {
  maxRenderTime: 100, // ms
  maxMemoryIncrease: 1024 * 1024, // 1MB
  maxBundleSize: 1024 * 1024, // 1MB
  minLighthouseScore: 90
};
```

---

## 🔧 Test Utilities & Helpers

### Custom Test Utilities
```typescript
// src/__tests__/setup/test-utils.tsx
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import { theme } from '../../theme';

// Test wrapper with all required providers
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0
      },
      mutations: {
        retry: false
      }
    }
  });

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

// Custom render function
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export testing library utilities
export * from '@testing-library/react';
export * from '@testing-library/user-event';
export { customRender as render };

// Common test helpers
export const createMockUser = (overrides = {}) => ({
  id: 'user_123',
  name: 'Test User',
  email: 'test@test.de',
  role: 'customer',
  ...overrides
});

export const createMockProject = (overrides = {}) => ({
  id: 'proj_123',
  title: 'Test Project',
  status: 'active',
  progress: 75,
  ...overrides
});

export const waitForDataToLoad = () => new Promise(resolve => setTimeout(resolve, 100));
```

### Mock Data Factories
```typescript
// src/__tests__/fixtures/data-factories.ts
import { faker } from '@faker-js/faker';

export const createProject = (overrides = {}) => ({
  id: faker.string.uuid(),
  title: faker.lorem.words(3),
  description: faker.lorem.paragraph(),
  status: faker.helpers.arrayElement(['planning', 'active', 'completed']),
  progress: faker.number.int({ min: 0, max: 100 }),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  customer: {
    id: faker.string.uuid(),
    name: faker.company.name(),
    email: faker.internet.email()
  },
  specifications: {
    power: faker.number.int({ min: 10, max: 1000 }),
    moduleCount: faker.number.int({ min: 20, max: 500 }),
    inverterSize: faker.number.int({ min: 5, max: 100 })
  },
  ...overrides
});

export const createContactFormSubmission = (overrides = {}) => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  company: faker.company.name(),
  message: faker.lorem.paragraph(),
  projectType: faker.helpers.arrayElement(['photovoltaik', 'speicher', 'e-mobilitaet']),
  budget: faker.helpers.arrayElement(['5000-10000', '10000-25000', '25000-50000', '50000+']),
  timeline: faker.helpers.arrayElement(['sofort', '3-monate', '6-monate', '12-monate']),
  privacyConsent: true,
  newsletterConsent: faker.datatype.boolean(),
  ...overrides
});

export const createAPIResponse = (data = null, overrides = {}) => ({
  success: true,
  data,
  message: faker.lorem.sentence(),
  timestamp: faker.date.recent().toISOString(),
  requestId: faker.string.uuid(),
  ...overrides
});
```

---

## 🔄 Continuous Integration

### GitHub Actions Workflow
```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
    - uses: actions/checkout@v4

    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run linting
      run: npm run lint

    - name: Run type checking
      run: npm run type-check

    - name: Run unit tests
      run: npm run test:coverage

    - name: Run integration tests
      run: npm run test:integration

    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
        flags: unittests
        name: codecov-umbrella

    - name: Build project
      run: npm run build

  e2e:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4

    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20.x'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Build application
      run: npm run build

    - name: Install Playwright browsers
      run: npx playwright install --with-deps

    - name: Run E2E tests
      run: npm run test:e2e

    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

### Quality Gates Configuration
```typescript
// tests/helpers/qualityGates.ts
export interface QualityGateConfig {
  coverage: {
    branches: number;
    functions: number;
    lines: number;
    statements: number;
  };
  performance: {
    maxRenderTime: number;
    maxMemoryIncrease: number;
    minLighthouseScore: number;
  };
  accessibility: {
    wcagLevel: 'A' | 'AA' | 'AAA';
    minAxeScore: number;
  };
  security: {
    maxVulnerabilities: number;
    allowedPackages: string[];
  };
}

export const productionQualityGates: QualityGateConfig = {
  coverage: {
    branches: 90,
    functions: 90,
    lines: 90,
    statements: 90
  },
  performance: {
    maxRenderTime: 100,
    maxMemoryIncrease: 1024 * 1024,
    minLighthouseScore: 90
  },
  accessibility: {
    wcagLevel: 'AA',
    minAxeScore: 95
  },
  security: {
    maxVulnerabilities: 0,
    allowedPackages: []
  }
};
```

---

## 📝 Testing Documentation

### Test Documentation Standards

#### Test Case Documentation
```typescript
/**
 * Test: ContactForm Submission
 *
 * Description: Verifies that the contact form can be successfully submitted
 * with valid data and handles validation errors appropriately.
 *
 * Preconditions:
 * - User is on the contact page
 * - API endpoint is available
 *
 * Test Steps:
 * 1. Fill out all required fields with valid data
 * 2. Accept privacy policy
 * 3. Click submit button
 * 4. Verify success message appears
 *
 * Expected Results:
 * - Form submission succeeds
 * - Success message is displayed
 * - Data is sent to API
 * - Analytics tracking is triggered
 *
 * Post-conditions:
 * - Form is reset
 * - User is redirected to thank you page
 */
test('submits contact form successfully', async () => {
  // Test implementation
});
```

### Component Testing Checklist

#### Pre-Testing Checklist
- [ ] Component props are fully typed
- [ ] Component renders without crashing
- [ ] Default props are properly handled
- [ ] Edge cases are identified
- [ ] Error states are defined
- [ ] Loading states are defined
- [ ] Accessibility requirements are clear

#### Testing Checklist
- [ ] All props are tested
- [ ] All state changes are tested
- [ ] All event handlers are tested
- [ ] Error scenarios are tested
- [ ] Accessibility is tested
- [ ] Performance is tested
- [ ] Integration points are tested

#### Post-Testing Checklist
- [ ] Test coverage meets requirements
- [ ] Tests are maintainable
- [ ] Test documentation is complete
- [ ] Tests run in CI/CD pipeline
- [ ] Test failures provide clear error messages

---

**🧪 Testing Guide Version:** 1.0.0
**📊 Coverage Target:** 90%+
**⚡ Performance Target:** <100ms render time
**♿ Accessibility:** WCAG 2.1 AA
**🔒 Quality Gates:** Automated
**📅 Last Update:** 17. November 2025
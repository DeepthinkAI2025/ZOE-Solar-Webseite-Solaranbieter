# 🎨 ZOE Solar Design System

## 📋 Overview

Das ZOE Solar Design System ist eine umfassende Sammlung von Designprinzipien, Komponenten, Richtlinien und Best Practices für die Entwicklung konsistenter, zugänglicher und performanter Benutzeroberflächen.

---

## 🎯 Design Principles

### 1. **Klarheit & Einfachheit**
- Klare Hierarchie und intuitive Navigation
- Vermeidung unnötiger Komplexität
- Fokus auf Kernfunktionen und Benutzerziele

### 2. **Konsistenz**
- Einheitliche visuelle Sprache
- Wiederholbare Patterns und Komponenten
- Standardisierte Interaktionen

### 3. **Zugänglichkeit (Accessibility)**
- WCAG 2.1 AA Konformität
- Barrierefreies Design für alle Nutzer
- Screen Reader und Keyboard Navigation Support

### 4. **Performance**
- Mobile-First-Ansatz
- Optimierte Ladezeiten
- Effiziente Animationen und Interaktionen

### 5. **Markenkonsistenz**
- Corporate Design Integration
- Farb- und Typografie-Standards
- Markenwerte im Design reflektiert

---

## 🎨 Color Palette

### Primary Colors
```css
:root {
  /* Brand Primary */
  --color-primary-50: #f0fdf4;
  --color-primary-100: #dcfce7;
  --color-primary-200: #bbf7d0;
  --color-primary-300: #86efac;
  --color-primary-400: #4ade80;
  --color-primary-500: #22c55e; /* Primary Brand Color */
  --color-primary-600: #16a34a;
  --color-primary-700: #15803d;
  --color-primary-800: #166534;
  --color-primary-900: #14532d;

  /* Secondary */
  --color-secondary-50: #f8fafc;
  --color-secondary-100: #f1f5f9;
  --color-secondary-200: #e2e8f0;
  --color-secondary-300: #cbd5e1;
  --color-secondary-400: #94a3b8;
  --color-secondary-500: #64748b;
  --color-secondary-600: #475569;
  --color-secondary-700: #334155;
  --color-secondary-800: #1e293b;
  --color-secondary-900: #0f172a;
}
```

### Semantic Colors
```css
:root {
  /* Success */
  --color-success-50: #f0fdf4;
  --color-success-500: #22c55e;
  --color-success-600: #16a34a;
  --color-success-700: #15803d;

  /* Warning */
  --color-warning-50: #fffbeb;
  --color-warning-500: #f59e0b;
  --color-warning-600: #d97706;
  --color-warning-700: #b45309;

  /* Error */
  --color-error-50: #fef2f2;
  --color-error-500: #ef4444;
  --color-error-600: #dc2626;
  --color-error-700: #b91c1c;

  /* Info */
  --color-info-50: #eff6ff;
  --color-info-500: #3b82f6;
  --color-info-600: #2563eb;
  --color-info-700: #1d4ed8;
}
```

### Neutral Colors
```css
:root {
  /* Gray Scale */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;

  /* White & Black */
  --color-white: #ffffff;
  --color-black: #000000;
}
```

### Color Usage Guidelines
- **Primary Colors**: Branding, CTAs, wichtige Interaktionen
- **Secondary Colors**: UI-Elemente, sekundäre Informationen
- **Success Colors**: Erfolgsmeldungen, positive Bestätigungen
- **Warning Colors**: Warnhinweise, wichtige Informationen
- **Error Colors**: Fehlermeldungen, kritische Aktionen
- **Info Colors**: Informationsmeldungen, Hinweise

---

## ✏️ Typography

### Font Stack
```css
:root {
  /* Primary Font Stack */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
               'Helvetica Neue', Arial, 'Noto Sans', sans-serif;

  /* Monospace Font Stack */
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco',
               'Courier New', monospace;

  /* Display Font Stack */
  --font-display: 'Inter Display', 'Inter', -apple-system, BlinkMacSystemFont,
                  'Segoe UI', Roboto, sans-serif;
}
```

### Type Scale
```css
:root {
  /* Font Sizes */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */
  --text-5xl: 3rem;        /* 48px */
  --text-6xl: 3.75rem;     /* 60px */
  --text-7xl: 4.5rem;      /* 72px */
  --text-8xl: 6rem;        /* 96px */
  --text-9xl: 8rem;        /* 128px */

  /* Font Weights */
  --font-thin: 100;
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
  --font-black: 900;

  /* Line Heights */
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
}
```

### Typography Classes

#### Headings
```css
.heading-1 {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  letter-spacing: -0.025em;
  color: var(--color-gray-900);
}

.heading-2 {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-tight);
  letter-spacing: -0.025em;
  color: var(--color-gray-900);
}

.heading-3 {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
  color: var(--color-gray-900);
}

.heading-4 {
  font-family: var(--font-sans);
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
  color: var(--color-gray-900);
}
```

#### Body Text
```css
.body-large {
  font-family: var(--font-sans);
  font-size: var(--text-lg);
  font-weight: var(--font-normal);
  line-height: var(--leading-relaxed);
  color: var(--color-gray-700);
}

.body-base {
  font-family: var(--font-sans);
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
  color: var(--color-gray-700);
}

.body-small {
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
  color: var(--color-gray-600);
}
```

---

## 📐 Spacing System

### Scale
```css
:root {
  --space-0: 0;          /* 0px */
  --space-px: 1px;       /* 1px */
  --space-0_5: 0.125rem; /* 2px */
  --space-1: 0.25rem;    /* 4px */
  --space-1_5: 0.375rem; /* 6px */
  --space-2: 0.5rem;     /* 8px */
  --space-2_5: 0.625rem; /* 10px */
  --space-3: 0.75rem;    /* 12px */
  --space-3_5: 0.875rem; /* 14px */
  --space-4: 1rem;       /* 16px */
  --space-5: 1.25rem;    /* 20px */
  --space-6: 1.5rem;     /* 24px */
  --space-7: 1.75rem;    /* 28px */
  --space-8: 2rem;       /* 32px */
  --space-9: 2.25rem;    /* 36px */
  --space-10: 2.5rem;    /* 40px */
  --space-11: 2.75rem;   /* 44px */
  --space-12: 3rem;      /* 48px */
  --space-14: 3.5rem;    /* 56px */
  --space-16: 4rem;      /* 64px */
  --space-20: 5rem;      /* 80px */
  --space-24: 6rem;      /* 96px */
  --space-28: 7rem;      /* 112px */
  --space-32: 8rem;      /* 128px */
  --space-36: 9rem;      /* 144px */
  --space-40: 10rem;     /* 160px */
  --space-44: 11rem;     /* 176px */
  --space-48: 12rem;     /* 192px */
  --space-52: 13rem;     /* 208px */
  --space-56: 14rem;     /* 224px */
  --space-60: 15rem;     /* 240px */
  --space-64: 16rem;     /* 256px */
  --space-72: 18rem;     /* 288px */
  --space-80: 20rem;     /* 320px */
  --space-96: 24rem;     /* 384px */
}
```

### Usage Patterns
```css
/* Component Padding */
.component-padding-vertical { padding-top: var(--space-6); padding-bottom: var(--space-6); }
.component-padding-horizontal { padding-left: var(--space-8); padding-right: var(--space-8); }
.component-padding { padding: var(--space-6) var(--space-8); }

/* Section Spacing */
.section-spacing-sm { margin-bottom: var(--space-12); }
.section-spacing-md { margin-bottom: var(--space-20); }
.section-spacing-lg { margin-bottom: var(--space-32); }
.section-spacing-xl { margin-bottom: var(--space-48); }

/* Element Spacing */
.element-spacing-sm { margin-bottom: var(--space-3); }
.element-spacing-md { margin-bottom: var(--space-4); }
.element-spacing-lg { margin-bottom: var(--space-6); }
```

---

## 🔄 Layout System

### Grid System
```css
:root {
  /* Grid Breakpoints */
  --breakpoint-sm: 640px;   /* Small screens */
  --breakpoint-md: 768px;   /* Medium screens */
  --breakpoint-lg: 1024px;  /* Large screens */
  --breakpoint-xl: 1280px;  /* Extra large screens */
  --breakpoint-2xl: 1536px; /* 2X large screens */

  /* Container Max Widths */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1400px;
}

/* Container */
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--space-4);
  padding-right: var(--space-4);
}

@media (min-width: 640px) {
  .container { max-width: var(--container-sm); }
}

@media (min-width: 768px) {
  .container { max-width: var(--container-md); }
}

@media (min-width: 1024px) {
  .container { max-width: var(--container-lg); }
}

@media (min-width: 1280px) {
  .container { max-width: var(--container-xl); }
}

@media (min-width: 1536px) {
  .container { max-width: var(--container-2xl); }
}
```

### Flexbox Utilities
```css
/* Flex Container */
.flex { display: flex; }
.inline-flex { display: inline-flex; }

/* Direction */
.flex-row { flex-direction: row; }
.flex-row-reverse { flex-direction: row-reverse; }
.flex-col { flex-direction: column; }
.flex-col-reverse { flex-direction: column-reverse; }

/* Wrap */
.flex-wrap { flex-wrap: wrap; }
.flex-wrap-reverse { flex-wrap: wrap-reverse; }
.flex-nowrap { flex-wrap: nowrap; }

/* Justify */
.justify-start { justify-content: flex-start; }
.justify-end { justify-content: flex-end; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.justify-around { justify-content: space-around; }
.justify-evenly { justify-content: space-evenly; }

/* Align */
.items-start { align-items: flex-start; }
.items-end { align-items: flex-end; }
.items-center { align-items: center; }
.items-baseline { align-items: baseline; }
.items-stretch { align-items: stretch; }
```

---

## 🎭 Components

### Button System

#### Base Button
```css
.button-base {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  font-weight: var(--font-medium);
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  border: 1px solid transparent;
  text-decoration: none;
  white-space: nowrap;
  outline: none;
  position: relative;
}

.button-base:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

.button-base:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

#### Button Variants
```css
/* Primary Button */
.button-primary {
  @apply button-base;
  background-color: var(--color-primary-600);
  color: var(--color-white);
  border-color: var(--color-primary-600);
}

.button-primary:hover:not(:disabled) {
  background-color: var(--color-primary-700);
  border-color: var(--color-primary-700);
}

.button-primary:active:not(:disabled) {
  background-color: var(--color-primary-800);
  border-color: var(--color-primary-800);
}

/* Secondary Button */
.button-secondary {
  @apply button-base;
  background-color: transparent;
  color: var(--color-secondary-700);
  border-color: var(--color-secondary-300);
}

.button-secondary:hover:not(:disabled) {
  background-color: var(--color-secondary-50);
  border-color: var(--color-secondary-400);
}

/* Outline Button */
.button-outline {
  @apply button-base;
  background-color: transparent;
  color: var(--color-primary-600);
  border-color: var(--color-primary-600);
}

.button-outline:hover:not(:disabled) {
  background-color: var(--color-primary-600);
  color: var(--color-white);
}

/* Ghost Button */
.button-ghost {
  @apply button-base;
  background-color: transparent;
  color: var(--color-primary-600);
  border-color: transparent;
}

.button-ghost:hover:not(:disabled) {
  background-color: var(--color-primary-50);
}
```

#### Button Sizes
```css
.button-sm {
  height: 2rem;
  padding: 0 var(--space-3);
  font-size: var(--text-sm);
  border-radius: 0.375rem;
}

.button-md {
  height: 2.5rem;
  padding: 0 var(--space-4);
  font-size: var(--text-base);
  border-radius: 0.5rem;
}

.button-lg {
  height: 3rem;
  padding: 0 var(--space-6);
  font-size: var(--text-base);
  border-radius: 0.5rem;
}

.button-xl {
  height: 3.5rem;
  padding: 0 var(--space-8);
  font-size: var(--text-lg);
  border-radius: 0.5rem;
}
```

### Card System

#### Base Card
```css
.card {
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: all 0.2s ease-in-out;
}

.card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.card-elevated {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.card-interactive:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
```

#### Card Sections
```css
.card-header {
  padding: var(--space-6);
  border-bottom: 1px solid var(--color-gray-100);
}

.card-body {
  padding: var(--space-6);
}

.card-footer {
  padding: var(--space-6);
  border-top: 1px solid var(--color-gray-100);
  background-color: var(--color-gray-50);
}
```

### Form Components

#### Input Fields
```css
.input-base {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-gray-300);
  border-radius: 0.5rem;
  background-color: var(--color-white);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  color: var(--color-gray-900);
  transition: all 0.2s ease-in-out;
}

.input-base:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.input-base:disabled {
  background-color: var(--color-gray-50);
  color: var(--color-gray-500);
  cursor: not-allowed;
}

.input-error {
  border-color: var(--color-error-500);
}

.input-error:focus {
  border-color: var(--color-error-500);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
```

#### Form Labels
```css
.form-label {
  display: block;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-gray-700);
  margin-bottom: var(--space-2);
}

.form-label-required::after {
  content: '*';
  color: var(--color-error-500);
  margin-left: var(--space-1);
}
```

---

## 🎨 Animation System

### Animation Tokens
```css
:root {
  /* Animation Durations */
  --duration-75: 75ms;
  --duration-100: 100ms;
  --duration-150: 150ms;
  --duration-200: 200ms;
  --duration-300: 300ms;
  --duration-500: 500ms;
  --duration-700: 700ms;
  --duration-1000: 1000ms;

  /* Animation Timing Functions */
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-back-in: cubic-bezier(0.6, -0.28, 0.735, 0.045);
  --ease-back-out: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  --ease-back-in-out: cubic-bezier(0.68, -0.55, 0.265, 1.55);

  /* Animation Delays */
  --delay-75: 75ms;
  --delay-100: 100ms;
  --delay-150: 150ms;
  --delay-200: 200ms;
  --delay-300: 300ms;
  --delay-500: 500ms;
  --delay-700: 700ms;
  --delay-1000: 1000ms;
}
```

### Keyframe Animations
```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Fade In Up */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Slide In Right */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Scale In */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Pulse */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Spin */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Bounce */
@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
  }
  40%, 43% {
    transform: translateY(-30px);
    animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
  }
  70% {
    transform: translateY(-15px);
    animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
  }
  90% {
    transform: translateY(-4px);
    animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
  }
}
```

### Animation Utilities
```css
.animate-fadeIn {
  animation: fadeIn var(--duration-300) var(--ease-out);
}

.animate-fadeInUp {
  animation: fadeInUp var(--duration-500) var(--ease-out);
}

.animate-slideInRight {
  animation: slideInRight var(--duration-300) var(--ease-out);
}

.animate-scaleIn {
  animation: scaleIn var(--duration-200) var(--ease-out);
}

.animate-pulse {
  animation: pulse var(--duration-1000) var(--ease-in-out) infinite;
}

.animate-spin {
  animation: spin var(--duration-1000) var(--ease-linear) infinite;
}

.animate-bounce {
  animation: bounce var(--duration-1000) infinite;
}
```

---

## 🔧 Responsive Design

### Responsive Utilities
```css
/* Responsive Spacing */
.p-responsive {
  padding: var(--space-4) var(--space-6);
}

@media (min-width: 768px) {
  .p-responsive {
    padding: var(--space-6) var(--space-8);
  }
}

@media (min-width: 1024px) {
  .p-responsive {
    padding: var(--space-8) var(--space-12);
  }
}

/* Responsive Typography */
.text-responsive {
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
}

@media (min-width: 768px) {
  .text-responsive {
    font-size: var(--text-lg);
  }
}

@media (min-width: 1024px) {
  .text-responsive {
    font-size: var(--text-xl);
  }
}

/* Responsive Grid */
.grid-responsive {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .grid-responsive {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-6);
  }
}

@media (min-width: 1024px) {
  .grid-responsive {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-8);
  }
}

@media (min-width: 1280px) {
  .grid-responsive {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### Mobile-First Approach
```css
/* Default (Mobile) Styles */
.hero-section {
  padding: var(--space-8) var(--space-4);
  text-align: center;
}

.hero-title {
  font-size: var(--text-3xl);
  line-height: var(--leading-tight);
  margin-bottom: var(--space-4);
}

/* Tablet Styles */
@media (min-width: 768px) {
  .hero-section {
    padding: var(--space-12) var(--space-8);
    text-align: left;
  }

  .hero-title {
    font-size: var(--text-4xl);
    margin-bottom: var(--space-6);
  }
}

/* Desktop Styles */
@media (min-width: 1024px) {
  .hero-section {
    padding: var(--space-16) var(--space-12);
  }

  .hero-title {
    font-size: var(--text-5xl);
    margin-bottom: var(--space-8);
  }
}

/* Large Desktop Styles */
@media (min-width: 1280px) {
  .hero-title {
    font-size: var(--text-6xl);
  }
}
```

---

## ♿ Accessibility Guidelines

### Focus Management
```css
/* Focus Styles */
.focus-ring {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
  border-radius: 0.25rem;
}

.focus-visible-only:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

/* Skip Links */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--color-primary-600);
  color: var(--color-white);
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 1000;
  transition: top 0.3s;
}

.skip-link:focus {
  top: 6px;
}
```

### Screen Reader Support
```css
/* Screen Reader Only Text */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Not Screen Reader Only */
.not-sr-only {
  position: static;
  width: auto;
  height: auto;
  padding: 0;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

### Color Contrast Requirements
- **Normal Text**: Mindestens 4.5:1 Kontrastverhältnis
- **Large Text**: Mindestens 3:1 Kontrastverhältnis (18pt+ oder 14pt+ fett)
- **Interactive Elements**: Mindestens 3:1 Kontrastverhältnis
- **Graphic Objects**: Mindestens 3:1 Kontrastverhältnis

---

## 🚀 Performance Guidelines

### CSS Performance
```css
/* Use CSS Custom Properties for theming */
:root {
  --fast-transition: all 0.15s var(--ease-out);
  --normal-transition: all 0.3s var(--ease-out);
  --slow-transition: all 0.5s var(--ease-out);
}

/* Optimize animations for performance */
.gpu-accelerated {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}

/* Reduce paint operations */
.will-change-transform {
  will-change: transform;
}

/* Contain layout recalculations */
.layout-contained {
  contain: layout;
}
```

### Critical CSS
```css
/* Above the fold critical styles */
.critical-above-fold {
  /* Critical layout and typography */
  display: block;
  font-family: var(--font-sans);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  color: var(--color-gray-900);
  background-color: var(--color-white);
}

/* Lazy loaded non-critical styles */
.non-critical {
  /* Less important visual enhancements */
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: var(--normal-transition);
}
```

---

## 🔍 Component Examples

### Example: Complete Button Component
```tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <LoadingSpinner className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
```

---

## 📝 Usage Guidelines

### Do's and Don'ts

#### ✅ Do's
- **Consistent Design**: Nutze Design System Komponenten
- **Mobile-First**: Beginne mit Mobile-Design
- **Accessibility**: Berücksichtige WCAG Richtlinien
- **Performance**: Optimiere für schnelle Ladezeiten
- **Semantic HTML**: Nutze passende HTML-Elemente
- **Color Contrast**: Sicher gute Lesbarkeit

#### ❌ Don'ts
- **Inline Styles**: Vermeide Inline-Styling
- **Hardcoded Values**: Nutze Design Tokens
- **Skip Breakpoints**: Berücksichtige alle Viewports
- **Ignore Accessibility**: Barrierefreiheit ist Pflicht
- **Over-Animation**: Nutze Animationen sparsam
- **Break Layout**: Vermeide Layout Shifts

### Design Review Checklist

#### Visual Design
- [ ] Farbschema korrekt angewendet
- [ ] Typografie konsistent
- [ ] Abstände und Raster eingehalten
- [ ] Visuelle Hierarchie klar
- [ ] Brand Guidelines befolgt

#### Usability
- [ ] Interactive Elemente klar erkennbar
- [ ] Feedback für Benutzeraktionen
- [ ] Error States behandelt
- [ ] Loading States vorhanden
- [ ] Form Validation implementiert

#### Accessibility
- [ ] Keyboard Navigation möglich
- [ ] Screen Reader Support
- [ ] Color Contrast ausreichend
- [ ] ARIA Labels korrekt
- [ ] Focus Management

#### Performance
- [ ] Bilder optimiert
- [ ] CSS minimal
- [ ] Animationen performant
- [ ] Core Web Vitals erfüllt
- [ ] Bundle Size optimiert

---

**🎨 Design System Version:** 1.0.0
**📱 Responsive:** Mobile-First
**♿ Accessible:** WCAG 2.1 AA
**⚡ Performant:** Optimized for Speed
**🔧 Maintainable:** Modular Architecture
**📅 Last Update:** 17. November 2025
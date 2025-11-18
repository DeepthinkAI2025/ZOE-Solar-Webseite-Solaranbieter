# ZOE Solar Developer Guidelines

**Version:** 1.0  
**Last Updated:** 31. Oktober 2024

---

## Project Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation
```bash
git clone <repository>
cd ZOE-Solar-Webseite-Solaranbieter-main
npm install --legacy-peer-deps
npm run dev
```

### Build
```bash
npm run build
npm run preview
```

---

## Code Standards

### TypeScript
- Use strict mode
- Define types for all props
- Avoid `any` type
- Use interfaces for complex objects

```tsx
interface PageProps {
  title: string;
  description: string;
  image?: string;
}

const Page: React.FC<PageProps> = ({ title, description, image }) => {
  return <div>{title}</div>;
};
```

### React Components
- Use functional components
- Use hooks (useState, useEffect, useContext)
- Keep components focused and reusable
- Use proper naming conventions

```tsx
// Good
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return <div>{product.name}</div>;
};

// Avoid
const PC: React.FC = ({ p }) => {
  return <div>{p.n}</div>;
};
```

### File Structure
```
src/
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── PageHero.tsx
│   └── ...
├── pages/
│   ├── HomePage.tsx
│   ├── PhotovoltaikPage.tsx
│   └── ...
├── styles/
│   └── index.css
└── App.tsx
```

---

## Styling Guidelines

### Tailwind CSS
- Use utility classes for styling
- Avoid inline styles
- Use predefined colors and spacing
- Follow mobile-first approach

```tsx
// Good
<div className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
  Button
</div>

// Avoid
<div style={{ backgroundColor: '#16a34a', color: 'white' }}>
  Button
</div>
```

### Color Palette
- Primary: `green-600` (#16a34a)
- Secondary: `slate-900` (#0f172a)
- Accents: `blue-600`, `orange-500`, `red-600`

### Responsive Design
```tsx
// Mobile first
<div className="text-base md:text-lg lg:text-xl">
  Responsive text
</div>

// Show/hide
<div className="hidden md:block">Desktop only</div>
<div className="block md:hidden">Mobile only</div>
```

---

## Accessibility Standards

### Semantic HTML
```tsx
// Good
<header>
  <nav>
    <a href="/">Home</a>
  </nav>
</header>

// Avoid
<div className="header">
  <div className="nav">
    <div className="link">Home</div>
  </div>
</div>
```

### ARIA Labels
```tsx
// Good
<button aria-label="Close menu">×</button>
<img alt="Product image" src="product.jpg" />

// Avoid
<button>×</button>
<img src="product.jpg" />
```

### Focus Management
```tsx
// Ensure focus is visible
<button className="focus:outline-none focus:ring-2 focus:ring-green-600">
  Click me
</button>
```

---

## Performance Best Practices

### Image Optimization
- Use WebP format when possible
- Implement responsive images with srcset
- Lazy load images below the fold
- Optimize image sizes

```tsx
<img
  src="image.webp"
  alt="Description"
  loading="lazy"
  srcSet="image-small.webp 640w, image-large.webp 1280w"
/>
```

### Code Splitting
- Use React.lazy for route-based splitting
- Implement Suspense for loading states
- Monitor bundle size

```tsx
const HomePage = React.lazy(() => import('./pages/HomePage'));

<Suspense fallback={<Loading />}>
  <HomePage />
</Suspense>
```

### Caching
- Set proper cache headers
- Use CDN for static assets
- Implement service workers for PWA

---

## Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Accessibility Tests
```bash
npm run test:a11y
```

### Best Practices
- Test critical user paths
- Include accessibility tests
- Mock external APIs
- Aim for 80%+ coverage

---

## Git Workflow

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `refactor/description` - Code refactoring
- `docs/description` - Documentation

### Commit Messages
```
feat: Add new feature
fix: Fix bug in component
refactor: Improve code structure
docs: Update documentation
```

### Pull Requests
- Describe changes clearly
- Include screenshots for UI changes
- Request review from team
- Ensure CI passes

---

## Deployment

### Staging
```bash
npm run build
npm run preview
```

### Production
```bash
git push origin main
# Automated deployment via GitHub Actions
```

### Monitoring
- Check Lighthouse scores
- Monitor Core Web Vitals
- Track error rates
- Review analytics

---

## Common Tasks

### Adding a New Page
1. Create component in `pages/`
2. Add route in `App.tsx`
3. Add navigation link in `Header.tsx`
4. Add breadcrumb in `Footer.tsx`
5. Test on mobile and desktop

### Adding a New Component
1. Create component in `components/`
2. Define TypeScript interface
3. Add documentation
4. Add to `COMPONENT_LIBRARY.md`
5. Test accessibility

### Updating Styles
1. Use Tailwind utilities
2. Update `tailwind.config.js` if needed
3. Test on all breakpoints
4. Verify color contrast
5. Check accessibility

---

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Vitals](https://web.dev/vitals/)

---

**Status:** ✅ Complete and ready for development

